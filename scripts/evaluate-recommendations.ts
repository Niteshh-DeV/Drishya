/**
 * Checks the recommendation engine against the traveller personas in
 * scripts/recommendation-personas.ts.
 *
 *   npm run recommend:eval                                 current weights
 *   npm run recommend:eval -- --weights interests=0.5,distance=0.1
 *   npm run recommend:eval -- --ids                        list destination ids
 *
 * Reads destinations from the database the site uses (DATABASE_URL), so it
 * sees photos, edits and verify flags the seed files don't have. For each
 * persona it prints the top five, marking the places the team expects, and
 * once `expected` is filled in: precision@5 (expected places in the top
 * five, out of five), recall@10 (expected places found in the top ten, out
 * of all expected) and the rank of the first expected place.
 *
 * It also counts distinct scores in the top ten. When many results share a
 * score, their order is decided by the tie-breakers, not by the traveller's
 * answers.
 */
import { config } from "dotenv";
import { districts } from "../src/data/districts";
import { WEIGHTS, recommend, samePlace, type Weights } from "../src/lib/recommend";
import type { RecommendPlace } from "../src/lib/types";
import { PERSONAS, type Persona } from "./recommendation-personas";

config({ path: [".env.local", ".env"], quiet: true });

function parseWeights(arg: string | undefined): Weights {
  const weights = { ...WEIGHTS };
  if (!arg) return weights;
  for (const pair of arg.split(",")) {
    const [key, raw] = pair.split("=");
    const value = Number(raw);
    if (!(key in weights) || !Number.isFinite(value) || value < 0) {
      throw new Error(`Bad weight "${pair}". Use e.g. interests=0.5 (keys: ${Object.keys(WEIGHTS).join(", ")}).`);
    }
    weights[key as keyof Weights] = value;
  }
  return weights;
}

const districtName = (id: string) => districts.find((d) => d.id === id)?.name ?? id;
const fixed = (n: number) => n.toFixed(2);

interface Outcome {
  precision5: number | null;
  recall10: number | null;
  distinctTop10: number;
}

function evaluate(persona: Persona, places: RecommendPlace[], weights: Weights): Outcome {
  const byId = new Map(places.map((p) => [p.id, p]));
  for (const id of persona.expected) {
    if (!byId.has(id)) console.warn(`   ! "${id}" in "${persona.name}" is not a destination id`);
  }
  const expected = persona.expected.flatMap((id) => byId.get(id) ?? []);
  // Khaptad's entries count as one place, as they do in the results.
  const isExpected = (place: RecommendPlace) =>
    expected.some((e) => e.id === place.id || samePlace(e, place));

  const results = recommend(
    places,
    {
      interests: persona.interests,
      season: persona.season,
      budget: persona.budget,
      from: persona.from ? (districts.find((d) => d.id === persona.from)?.center ?? null) : null,
      hiddenGems: persona.hiddenGems ?? false,
    },
    weights,
  );
  const top10 = results.slice(0, 10);

  console.log(`\n${persona.name}`);
  console.log(
    `   ${[
      persona.interests.join(" + ") || "any interest",
      persona.season ?? "any time",
      persona.budget ? `up to ${persona.budget}` : "any budget",
      persona.from ? `from ${districtName(persona.from)}` : "from anywhere",
      persona.hiddenGems ? "hidden gems" : "",
    ]
      .filter(Boolean)
      .join(" · ")}`,
  );
  results.slice(0, 5).forEach((r, i) => {
    const mark = isExpected(r.place) ? "  ✓" : "";
    console.log(
      `   ${i + 1}  ${fixed(r.score)}  ${r.place.name.padEnd(44)} ${districtName(r.place.districtId).padEnd(11)}${mark}`,
    );
  });

  const distinctTop10 = new Set(top10.map((r) => r.score.toFixed(4))).size;
  const facts = [`${results.length} results`, `${distinctTop10} distinct scores in top 10`];
  let precision5: number | null = null;
  let recall10: number | null = null;
  if (expected.length > 0) {
    precision5 = results.slice(0, 5).filter((r) => isExpected(r.place)).length / 5;
    recall10 = expected.filter((e) => top10.some((r) => r.place.id === e.id || samePlace(e, r.place))).length / expected.length;
    const first = results.findIndex((r) => isExpected(r.place));
    facts.push(
      `precision@5 ${fixed(precision5)}`,
      `recall@10 ${fixed(recall10)}`,
      first === -1 ? "no expected place ranked" : `first expected #${first + 1}`,
    );
  } else {
    facts.push("no expected places yet");
  }
  console.log(`   ${facts.join(" · ")}`);
  return { precision5, recall10, distinctTop10 };
}

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

async function main() {
  // Imported here, after the env files are loaded: the Prisma client reads
  // DATABASE_URL as soon as its module runs.
  const { getRecommendPlaces } = await import("../src/lib/db/destinations");
  const { prisma } = await import("../src/lib/db/prisma");

  try {
    const places = await getRecommendPlaces();

    if (process.argv.includes("--ids")) {
      for (const district of districts) {
        const inDistrict = places.filter((p) => p.districtId === district.id);
        if (inDistrict.length === 0) continue;
        console.log(`\n${district.name}`);
        for (const p of inDistrict) console.log(`   ${p.id.padEnd(48)} ${p.name}`);
      }
      return;
    }

    const flag = process.argv.indexOf("--weights");
    const weights = parseWeights(flag === -1 ? undefined : process.argv[flag + 1]);
    console.log(
      `Weights: ${Object.entries(weights)
        .map(([key, value]) => `${key} ${Math.round(value * 100)}`)
        .join(" · ")}`,
    );
    console.log(`${places.length} destinations from the database`);

    const outcomes = PERSONAS.map((persona) => evaluate(persona, places, weights));
    const judged = outcomes.filter((o) => o.precision5 !== null);

    console.log(`\nSummary: ${PERSONAS.length} personas, ${judged.length} with expected places`);
    console.log(`   mean distinct scores in top 10: ${mean(outcomes.map((o) => o.distinctTop10)).toFixed(1)} of 10`);
    if (judged.length > 0) {
      console.log(`   mean precision@5: ${fixed(mean(judged.map((o) => o.precision5!)))}`);
      console.log(`   mean recall@10:   ${fixed(mean(judged.map((o) => o.recall10!)))}`);
    } else {
      console.log("   Fill in `expected` in scripts/recommendation-personas.ts to score the rankings.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
