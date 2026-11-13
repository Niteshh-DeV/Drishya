"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/site/Reveal";
import { districts, getDistrict } from "@/data/districts";
import { INTEREST_TAGS } from "@/lib/blog-input";
import {
  BUDGET_LEVELS,
  LEAD_RESULTS,
  SEASONS,
  SEASON_MONTHS,
  WEIGHTS,
  recommend,
  seasonForDate,
  type Recommendation,
} from "@/lib/recommend";
import type { BudgetLevel, InterestTag, MapPlace, RecommendPlace, Season } from "@/lib/types";
import { PlanMapLoader } from "./PlanMapLoader";
import { SuggestionCard, distanceNote, type SuggestionNote } from "./SuggestionCard";

/**
 * What the URL holds, so a plan can be shared:
 * `?interests=Trekking,Nature&season=Autumn&budget=Medium&from=doti&gems=1`.
 * A shared location is never written to it.
 */
interface PlanQuery {
  interests: InterestTag[];
  /** Null means any time of year. */
  season: Season | null;
  /** The most the traveller wants to spend; null for any budget. */
  budget: BudgetLevel | null;
  /** District id the trip starts from. */
  from: string | null;
  gems: boolean;
}

function readQuery(params: URLSearchParams, defaultSeason: Season): PlanQuery {
  const pick = <T extends string>(value: string | null, options: readonly T[]) =>
    options.find((option) => option === value) ?? null;
  const season = params.get("season");
  return {
    interests: (params.get("interests")?.split(",") ?? []).filter((tag): tag is InterestTag =>
      (INTEREST_TAGS as readonly string[]).includes(tag),
    ),
    season: season === "any" ? null : (pick(season, SEASONS) ?? defaultSeason),
    budget: pick(params.get("budget"), BUDGET_LEVELS),
    from: getDistrict(params.get("from") ?? "")?.id ?? null,
    gems: params.get("gems") === "1",
  };
}

/** Replaces the URL in place; Next keeps `useSearchParams` in step with it. */
function writeQuery(query: PlanQuery) {
  const params = new URLSearchParams();
  if (query.interests.length > 0) params.set("interests", query.interests.join(","));
  params.set("season", query.season ?? "any");
  if (query.budget) params.set("budget", query.budget);
  if (query.from) params.set("from", query.from);
  if (query.gems) params.set("gems", "1");
  window.history.replaceState(null, "", `?${params.toString().replaceAll("%2C", ",")}`);
}

/** "Culture, History and Nature"; past three, "and 2 more". */
function listOf(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length > 3) return `${items.slice(0, 2).join(", ")} and ${items.length - 2} more`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

interface Start {
  point: [number, number];
  /** "Doti", or "you" for a shared location. */
  label: string;
  districtId?: string;
}

/** Why a result came up, in the order the weights rank them. */
function notesFor(result: Recommendation, query: PlanQuery, start: Start | null): SuggestionNote[] {
  const { place } = result;
  const notes: SuggestionNote[] = result.matched.slice(0, 3).map((tag) => ({ text: tag, accent: true }));
  if (result.inSeason === true) notes.push({ text: `Best in ${query.season}`, accent: true });
  if (result.inSeason === false) notes.push({ text: `Best in ${place.bestSeasons.join(", ")}` });
  if (result.unconfirmed.includes("season")) notes.push({ text: "Best season unconfirmed" });
  if (result.unconfirmed.includes("budget")) notes.push({ text: "Budget unconfirmed" });
  else if (query.budget) {
    notes.push(
      result.stretch
        ? { text: `${place.budget} budget · a stretch` }
        : { text: `${place.budget} budget`, accent: true },
    );
  }
  if (start && result.km !== null) {
    notes.push(
      start.districtId === place.districtId
        ? { text: `In ${start.label}`, accent: true }
        : { text: distanceNote(result.km, start.label) },
    );
  }
  if (place.hiddenGem) notes.push({ text: "Hidden gem", accent: query.gems });
  return notes;
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
        on ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink/40 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ legend, children, className = "" }: { legend: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={className}>
      <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{legend}</legend>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">{children}</div>
    </fieldset>
  );
}

/** Stands in for the planner while it reads the URL, at roughly its size. */
export function TripPlannerFallback() {
  return (
    <div className="mx-auto mt-16 max-w-6xl" aria-hidden>
      <div className="skeleton h-64 sm:h-48" />
      <div className="skeleton mt-16 h-[22rem] rounded-3xl sm:h-[26rem]" />
    </div>
  );
}

/**
 * The trip planner: a short form whose answers live in the URL, and the
 * shortlist `recommend` ranks from them. All scoring happens here in the
 * browser, over the prerendered list of places, so the page needs no
 * request to the server and keeps working if the database is away.
 *
 * Reads `useSearchParams`, so the page wraps it in <Suspense>.
 */
export function TripPlanner({ places }: { places: RecommendPlace[] }) {
  const params = useSearchParams();
  const [defaultSeason] = useState(() => seasonForDate(new Date()));
  const query = useMemo(() => readQuery(params, defaultSeason), [params, defaultSeason]);
  const update = (patch: Partial<PlanQuery>) => writeQuery({ ...query, ...patch });

  const [here, setHere] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const fromDistrict = query.from ? getDistrict(query.from) : undefined;
  const start: Start | null = fromDistrict
    ? { point: fromDistrict.center, label: fromDistrict.name, districtId: fromDistrict.id }
    : here
      ? { point: here, label: "you" }
      : null;
  const from = start?.point ?? null;

  const results = useMemo(
    () =>
      recommend(places, {
        interests: query.interests,
        season: query.season,
        budget: query.budget,
        from,
        hiddenGems: query.gems,
      }),
    [places, query, from],
  );

  // "Show more" starts over whenever the plan changes.
  const planKey = `${params.toString()}|${here ?? ""}`;
  const [more, setMore] = useState({ key: planKey, count: LEAD_RESULTS });
  const count = more.key === planKey ? more.count : LEAD_RESULTS;
  const shown = useMemo(() => results.slice(0, count), [results, count]);

  const mapPlaces = useMemo(
    () =>
      shown.flatMap(({ place }): MapPlace[] =>
        place.position
          ? [
              {
                id: place.id,
                slug: place.slug,
                districtId: place.districtId,
                name: place.name,
                shortDescription: place.shortDescription,
                position: place.position,
                hiddenGem: place.hiddenGem,
                coverUrl: place.coverUrl,
              },
            ]
          : [],
      ),
    [shown],
  );
  const unpinned = shown.length - mapPlaces.length;

  const toggleInterest = (tag: InterestTag) =>
    update({
      interests: query.interests.includes(tag)
        ? query.interests.filter((t) => t !== tag)
        : INTEREST_TAGS.filter((t) => t === tag || query.interests.includes(t)),
    });

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setLocateError("This browser can't share a location. Pick a district instead.");
      return;
    }
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        setHere([position.coords.latitude, position.coords.longitude]);
        update({ from: null });
      },
      () => {
        setLocating(false);
        setLocateError("Couldn't get your location. Pick a district instead.");
      },
      { maximumAge: 10 * 60 * 1000, timeout: 10000 },
    );
  };

  const headline = `${query.interests.length > 0 ? listOf(query.interests) : "Every kind of place"}${
    query.season ? ` in ${query.season}` : ", any time of year"
  }`;
  const changed = Boolean(
    query.interests.length > 0 || query.season !== defaultSeason || query.budget || query.from || query.gems || here,
  );

  return (
    <>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="mx-auto mt-16 max-w-6xl border-y border-line py-8"
        aria-label="Plan a trip"
      >
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <Field legend="What draws you" className="md:col-span-2 lg:col-span-1">
            {INTEREST_TAGS.map((tag) => (
              <Chip key={tag} on={query.interests.includes(tag)} onClick={() => toggleInterest(tag)}>
                {tag}
              </Chip>
            ))}
          </Field>

          <Field legend="When">
            {SEASONS.map((season) => {
              const on = query.season === season;
              return (
                <Chip key={season} on={on} onClick={() => update({ season })}>
                  {season} <span className={on ? "text-paper/70" : "text-muted/70"}>{SEASON_MONTHS[season]}</span>
                </Chip>
              );
            })}
            <Chip on={query.season === null} onClick={() => update({ season: null })}>
              Any time
            </Chip>
          </Field>

          <Field legend="Budget, up to">
            <Chip on={query.budget === null} onClick={() => update({ budget: null })}>
              Any
            </Chip>
            {BUDGET_LEVELS.map((level) => (
              <Chip key={level} on={query.budget === level} onClick={() => update({ budget: level })}>
                {level}
              </Chip>
            ))}
          </Field>

          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Starting from
            </legend>
            <select
              aria-label="Starting district"
              value={query.from ?? (here ? "here" : "")}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "here") return;
                setHere(null);
                update({ from: value || null });
              }}
              className="mt-3 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent-ink"
            >
              <option value="">Anywhere</option>
              {here && <option value="here">My location</option>}
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={locate}
              disabled={locating}
              className="link-draw mt-3 pb-0.5 text-[11px] uppercase tracking-[0.18em] text-accent-ink disabled:opacity-60"
            >
              {locating ? "Finding you…" : "Use my location"}
            </button>
            <p className="mt-2 text-xs leading-relaxed text-muted" role="status">
              {locateError ?? "Your location stays in this browser."}
            </p>
          </fieldset>

          <Field legend="Off the usual route">
            <Chip on={query.gems} onClick={() => update({ gems: !query.gems })}>
              Favour hidden gems
            </Chip>
          </Field>

          {changed && (
            <div className="flex items-end lg:justify-end">
              <button
                type="button"
                onClick={() => {
                  setHere(null);
                  setLocateError(null);
                  window.history.replaceState(null, "", window.location.pathname);
                }}
                className="link-draw pb-0.5 text-[11px] uppercase tracking-[0.18em] text-muted hover:text-ink"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </form>

      <section className="mx-auto mt-16 max-w-6xl" aria-labelledby="plan-results">
        <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Your shortlist</p>
            <h2 id="plan-results" className="font-display mt-2 text-balance text-4xl text-ink sm:text-5xl">
              {headline}
            </h2>
          </div>
          <p className="shrink-0 text-xs uppercase tracking-[0.18em] text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "place" : "places"}
          </p>
        </div>

        {query.interests.length === 0 && results.length > 0 && (
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Pick a few interests above to rank these by what you&apos;re after.
          </p>
        )}

        {results.length === 0 ? (
          <p className="mx-auto mt-14 max-w-xl border-y border-line py-10 text-center text-sm leading-relaxed text-muted">
            Nothing we&apos;ve written up matches all of that yet. Try a higher budget or other interests.
          </p>
        ) : (
          <>
            <div className="mt-10">
              <PlanMapLoader places={mapPlaces} activeId={hovered} here={here} />
              {unpinned > 0 && (
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {unpinned === 1 ? "One place below isn't" : `${unpinned} places below aren't`} on the map
                  yet: their coordinates are still being confirmed.
                </p>
              )}
            </div>

            <div
              className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
              onPointerLeave={() => setHovered(null)}
            >
              {shown.map((result, index) => (
                <Reveal key={result.place.id} delay={(index % 3) * 0.06}>
                  <div
                    onPointerEnter={() => setHovered(result.place.id)}
                    onFocus={() => setHovered(result.place.id)}
                    onBlur={() => setHovered(null)}
                  >
                    <SuggestionCard place={result.place} notes={notesFor(result, query, start)} rank={index + 1} />
                  </div>
                </Reveal>
              ))}
            </div>

            {count < results.length && (
              <button
                type="button"
                onClick={() => setMore({ key: planKey, count: count + LEAD_RESULTS })}
                className="mx-auto mt-16 block rounded-full border border-line px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
              >
                Show more · {results.length - count} left
              </button>
            )}
          </>
        )}
      </section>

      <details className="mx-auto mt-24 max-w-3xl border-t border-line pt-6 text-sm leading-relaxed text-muted">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
          How the shortlist is ranked
        </summary>
        <p className="mt-4">
          Each place is scored on the things you set, weighted as below. Anything you leave open
          doesn&apos;t count, and the rest are scaled up to make the whole. A place has to offer at
          least one of your interests, and can cost at most one budget level more than yours, which
          is marked as a stretch. Interests a place is mainly known for count for more than ones
          further down its list. No district takes more than three of the first nine places, so
          the shortlist spreads across the province.
        </p>
        <p className="mt-4">
          Where a place&apos;s budget, best season or hidden-gem status is still being confirmed,
          that part counts as neither good nor bad. When two places score the same, the one we
          know more about (a photo, a confirmed map pin, a full write-up) comes first.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-5">
          {(
            [
              ["Interests", WEIGHTS.interests],
              ["Season", WEIGHTS.season],
              ["Distance", WEIGHTS.distance],
              ["Budget", WEIGHTS.budget],
              ["Hidden gems", WEIGHTS.hiddenGem],
            ] as const
          ).map(([label, weight]) => (
            <div key={label} className="bg-paper px-4 py-4 text-center last:col-span-2 sm:last:col-span-1">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</dt>
              <dd className="font-display mt-1 text-3xl text-ink">{Math.round(weight * 100)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5">
          Hidden gems count only when you ask for them. Distances are straight lines from your
          starting point (a district&apos;s centre, or your location); hill roads in Bajhang, Bajura
          and Darchula run much further. Places whose coordinates are still being confirmed are
          measured from the centre of their district, and never counted as nearer than a typical
          spot in that district.
        </p>
      </details>
    </>
  );
}
