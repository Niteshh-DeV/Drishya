/**
 * The recommendation engine: weighted scoring of destinations against what a
 * traveller asks for — interests, season, budget and where they start.
 *
 * Pure functions over plain data, with no React or Prisma, so the same code
 * ranks results in the browser on /plan, picks "Places like this" on
 * destination pages at build time, and can later be handed to the assistant
 * as a tool.
 */
import { districts } from "@/data/districts";
import type { BudgetLevel, InterestTag, RecommendPlace, Season } from "@/lib/types";

/** Calendar order, the same as `Season.sortOrder` in the database. */
export const SEASONS = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"] as const satisfies readonly Season[];

/** Cheapest first, the same order as `BudgetLevel.rank` in the database. */
export const BUDGET_LEVELS = ["Low", "Low-Medium", "Medium", "High"] as const satisfies readonly BudgetLevel[];

/**
 * The months the planner puts in each season. The content only tags places
 * by season name, so this is the planner's own reading of the far-western
 * calendar: the monsoon usually reaches Sudurpaschim late in June and clears
 * by the end of September, which leaves June as the hot pre-monsoon summer
 * of Kailali and Kanchanpur.
 */
export const SEASON_MONTHS: Record<Season, string> = {
  Spring: "Mar–May",
  Summer: "June",
  Monsoon: "Jul–Sep",
  Autumn: "Oct–Nov",
  Winter: "Dec–Feb",
};

/** Season for each month, January first. */
const MONTH_SEASON: Season[] = [
  "Winter", "Winter", "Spring", "Spring", "Spring", "Summer",
  "Monsoon", "Monsoon", "Monsoon", "Autumn", "Autumn", "Winter",
];

export function seasonForDate(date: Date): Season {
  return MONTH_SEASON[date.getMonth()];
}

/**
 * How much each factor counts. A factor the traveller leaves unset drops
 * out and the rest are rescaled, so a score always lies between 0 and 1.
 * `hiddenGem` counts only when the traveller asks for hidden gems.
 */
export const WEIGHTS = {
  interests: 0.4,
  season: 0.25,
  distance: 0.2,
  budget: 0.15,
  hiddenGem: 0.1,
};

export type Weights = typeof WEIGHTS;

/**
 * A place's tags are stored main ones first. A match on its first tag
 * counts in full and each later tag a tenth less, down to half: Culture,
 * sixth of Khaptad's tags, shouldn't match a Culture search as well as it
 * matches Ghatal Temple.
 */
function tagWeight(index: number): number {
  return Math.max(0.5, 1 - 0.1 * index);
}

/** Score for a factor whose source field is flagged as unconfirmed: no sign either way. */
const UNSURE = 0.5;

/** The distance factor falls to about a third (1/e) at this many km. */
const DISTANCE_SCALE_KM = 100;

/** A place one budget level over the traveller's ceiling scores this, not 0. */
const STRETCH_SCORE = 0.4;

/** Leading results per page, and how many of them one district may take. */
export const LEAD_RESULTS = 9;
const PER_DISTRICT = 3;

export interface TripPreferences {
  interests: InterestTag[];
  season: Season | null;
  /** The most the traveller wants to spend. */
  budget: BudgetLevel | null;
  /** Where the trip starts, [lat, lon]. */
  from: [number, number] | null;
  /** Favour places few visitors reach. */
  hiddenGems: boolean;
}

export interface Recommendation {
  place: RecommendPlace;
  /** 0–1, before the district spread reorders the list. */
  score: number;
  /** The traveller's interests this place offers. */
  matched: InterestTag[];
  /** Null when no season was chosen or the place lists none. */
  inSeason: boolean | null;
  /** One budget level above the traveller's ceiling. */
  stretch: boolean;
  /** Straight-line km from the starting point; null without one. */
  km: number | null;
  /** Factors scored as unknown because the content flags their field as unconfirmed. */
  unconfirmed: ("season" | "budget")[];
}

export interface SimilarPlace {
  place: RecommendPlace;
  /** Interest tags it shares with the place being viewed. */
  shared: InterestTag[];
  /** Straight-line km from the place being viewed. */
  km: number | null;
}

/** Great-circle distance in km between two [lat, lon] points. */
export function haversineKm(a: [number, number], b: [number, number]): number {
  const rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad;
  const dLon = (b[1] - a[1]) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

interface Whereabouts {
  point: [number, number];
  /** How far off `point` the place may really be, in km. */
  slack: number;
}

/**
 * Where a place is, for measuring distances. A place whose coordinates are
 * still unconfirmed is taken to be at its district's centre: close enough to
 * rank Bajhang ahead of Kanchanpur for someone starting in Chainpur, and
 * used for ranking only, never drawn as a pin. It carries a slack of two
 * thirds of the radius of a circle the district's size (the average distance
 * from the centre of a spot inside it), so a traveller starting from the same
 * district never finds it 0 km away. Once its coordinates are confirmed in
 * the database, they are used instead.
 */
function whereabouts(place: RecommendPlace): Whereabouts | null {
  if (place.position) return { point: place.position, slack: 0 };
  const district = districts.find((d) => d.id === place.districtId);
  if (!district) return null;
  return { point: district.center, slack: (2 / 3) * Math.sqrt(district.areaSqKm / Math.PI) };
}

function kmBetween(a: Whereabouts, b: Whereabouts): number {
  return Math.max(haversineKm(a.point, b.point), a.slack, b.slack);
}

const budgetRank = (level: BudgetLevel) => BUDGET_LEVELS.indexOf(level);

/** Whether the content flags this field of the place as unconfirmed (its `verify` list). */
const unsure = (place: RecommendPlace, field: "budget" | "bestSeasons" | "hiddenGem") =>
  place.verify.includes(field);

/**
 * How much we know about a place: a photo, a confirmed pin, a full write-up,
 * nothing left to verify. Breaks ties between equal scores, ahead of the
 * alphabet, without changing the scores themselves.
 */
function completeness(place: RecommendPlace): number {
  return (
    Number(Boolean(place.coverUrl)) +
    Number(place.position !== null) +
    Number(place.described) +
    Number(place.verify.length === 0)
  );
}

/** Best first. Scores within a hair of each other count as tied. */
function byRank<T extends { place: RecommendPlace; score: number }>(a: T, b: T): number {
  if (Math.abs(a.score - b.score) > 1e-9) return b.score - a.score;
  return completeness(b.place) - completeness(a.place) || a.place.name.localeCompare(b.place.name);
}

/** "Khaptad National Park (Achham Section)" → "khaptad national park". */
function placeKey(name: string): string {
  return name.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
}

/**
 * Whether two entries describe one place written up under each district it
 * is reached from: Khaptad National Park in Bajhang, "(Achham Section)" and
 * "(Doti-side Access)". The content marks those with a qualifier, so names
 * that are simply identical (Surma Devi Temple in Achham and in Chainpur)
 * are kept apart.
 */
export function samePlace(a: RecommendPlace, b: RecommendPlace): boolean {
  return a.name !== b.name && placeKey(a.name) === placeKey(b.name);
}

/** Keeps the first (highest-ranked) entry of each place. */
function dedupe<T extends { place: RecommendPlace }>(ranked: T[]): T[] {
  const kept: T[] = [];
  for (const result of ranked) {
    if (!kept.some((k) => samePlace(k.place, result.place))) kept.push(result);
  }
  return kept;
}

/**
 * Fills the leading results with at most `PER_DISTRICT` places from any one
 * district, so Kailali's fifteen entries can't take the whole first page.
 * Places held back keep their order and follow, so "Show more" reaches them.
 */
function spread<T extends { place: RecommendPlace }>(ranked: T[]): T[] {
  const lead: T[] = [];
  const rest: T[] = [];
  const perDistrict = new Map<string, number>();
  for (const result of ranked) {
    const count = perDistrict.get(result.place.districtId) ?? 0;
    if (lead.length < LEAD_RESULTS && count < PER_DISTRICT) {
      lead.push(result);
      perDistrict.set(result.place.districtId, count + 1);
    } else {
      rest.push(result);
    }
  }
  return [...lead, ...rest];
}

/**
 * Ranks `places` for a traveller. Two things rule a place out rather than
 * lowering it: sharing none of the chosen interests, and costing two or more
 * budget levels over the ceiling. Everything else is a weighted average of
 * the factors the traveller set.
 *
 * A budget, season list or hidden-gem flag the content marks as unconfirmed
 * scores a neutral 0.5 and never rules a place out. `weights` is for
 * comparing weight sets (scripts/evaluate-recommendations.ts); the site uses
 * the defaults.
 */
export function recommend(
  places: RecommendPlace[],
  prefs: TripPreferences,
  weights: Weights = WEIGHTS,
): Recommendation[] {
  const ceiling = prefs.budget ? budgetRank(prefs.budget) : null;
  const scored: Recommendation[] = [];

  for (const place of places) {
    const matched = place.interestTags.filter((tag) => prefs.interests.includes(tag));
    if (prefs.interests.length > 0 && matched.length === 0) continue;

    const budgetUnsure = unsure(place, "budget");
    const over = ceiling === null || budgetUnsure ? 0 : budgetRank(place.budget) - ceiling;
    if (over > 1) continue;

    const seasonUnsure = unsure(place, "bestSeasons");
    const inSeason =
      prefs.season && !seasonUnsure && place.bestSeasons.length > 0
        ? place.bestSeasons.includes(prefs.season)
        : null;
    const where = whereabouts(place);
    const km = prefs.from && where ? kmBetween({ point: prefs.from, slack: 0 }, where) : null;

    let total = 0;
    let weight = 0;
    const add = (w: number, value: number) => {
      total += w * value;
      weight += w;
    };
    if (prefs.interests.length > 0) {
      const strength = matched.reduce((sum, tag) => sum + tagWeight(place.interestTags.indexOf(tag)), 0);
      add(weights.interests, strength / prefs.interests.length);
    }
    // A place with no listed seasons is neither in nor out of season.
    if (prefs.season) add(weights.season, inSeason === null ? UNSURE : inSeason ? 1 : 0);
    if (ceiling !== null) add(weights.budget, budgetUnsure ? UNSURE : over <= 0 ? 1 : STRETCH_SCORE);
    if (km !== null) add(weights.distance, Math.exp(-km / DISTANCE_SCALE_KM));
    if (prefs.hiddenGems) {
      add(weights.hiddenGem, unsure(place, "hiddenGem") ? UNSURE : place.hiddenGem ? 1 : 0);
    }

    const unconfirmed: Recommendation["unconfirmed"] = [];
    if (prefs.season && seasonUnsure) unconfirmed.push("season");
    if (ceiling !== null && budgetUnsure) unconfirmed.push("budget");

    scored.push({
      place,
      score: weight > 0 ? total / weight : 0,
      matched,
      inSeason,
      stretch: over === 1,
      km,
      unconfirmed,
    });
  }

  scored.sort(byRank);
  return spread(dedupe(scored));
}

/** Items two lists share, over all the items in either; neutral when one is empty, since nothing is known. */
function overlap<T>(a: T[], b: T[]): number {
  if (a.length === 0 || b.length === 0) return UNSURE;
  const shared = a.filter((x) => b.includes(x)).length;
  return shared / new Set([...a, ...b]).size;
}

const SIMILAR_WEIGHTS = { interests: 0.5, distance: 0.25, seasons: 0.15, budget: 0.1 } as const;

/**
 * Places most like `place`, for its own page: shared interests first, then
 * nearness, overlapping seasons and a similar budget. Other entries for the
 * same place (Khaptad from another district) are left out.
 */
export function similarPlaces(
  place: RecommendPlace,
  places: RecommendPlace[],
  limit = 3,
): SimilarPlace[] {
  const origin = whereabouts(place);
  const budgetSpan = BUDGET_LEVELS.length - 1;

  const scored = places
    .filter((other) => other.id !== place.id && !samePlace(place, other))
    .map((other) => {
      const where = whereabouts(other);
      const km = origin && where ? kmBetween(origin, where) : null;
      const seasons =
        unsure(place, "bestSeasons") || unsure(other, "bestSeasons")
          ? UNSURE
          : overlap(place.bestSeasons, other.bestSeasons);
      const budget =
        unsure(place, "budget") || unsure(other, "budget")
          ? UNSURE
          : 1 - Math.abs(budgetRank(place.budget) - budgetRank(other.budget)) / budgetSpan;
      const score =
        SIMILAR_WEIGHTS.interests * overlap(place.interestTags, other.interestTags) +
        SIMILAR_WEIGHTS.distance * (km === null ? UNSURE : Math.exp(-km / DISTANCE_SCALE_KM)) +
        SIMILAR_WEIGHTS.seasons * seasons +
        SIMILAR_WEIGHTS.budget * budget;
      return {
        place: other,
        shared: other.interestTags.filter((tag) => place.interestTags.includes(tag)),
        km,
        score,
      };
    })
    .sort(byRank);

  return dedupe(scored)
    .slice(0, limit)
    .map(({ place: other, shared, km }) => ({ place: other, shared, km }));
}
