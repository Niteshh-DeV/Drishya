/**
 * Seeds districts + destinations from the TypeScript data files.
 *
 *   npx prisma db seed                    # add new rows only
 *   npx prisma db seed -- --overwrite     # also rewrite existing rows
 *
 * By default only rows missing from the database are created, so adding a
 * new district file never touches places already there (or edits made to
 * them in the database). `--overwrite` restores the old behaviour: every
 * row is reset to its .ts values.
 */
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import { districts } from "../src/data/districts";
import { baitadiDestinations } from "./data/baitadi";
import { bajuraDestinations } from "./data/bajura";
import { bajhangDestinations } from "./data/bajhang";
import { dadeldhuraDestinations } from "./data/dadeldhura";

const allDestinations = [
  ...baitadiDestinations,
  ...bajuraDestinations,
  ...bajhangDestinations,
  ...dadeldhuraDestinations,
];

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const overwrite = process.argv.includes("--overwrite");

const SEASONS = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"];
const BUDGETS = ["Low", "Low-Medium", "Medium", "High"];

async function main() {
  const districtIds = new Set(districts.map((d) => d.id));
  const [existingDistricts, existingDestinations] = await Promise.all([
    prisma.district.findMany({ select: { id: true } }),
    prisma.destination.findMany({ select: { id: true } }),
  ]);
  const districtInDb = new Set(existingDistricts.map((d) => d.id));
  const destinationInDb = new Set(existingDestinations.map((d) => d.id));

  let districtsWritten = 0;
  for (const d of districts) {
    if (!overwrite && districtInDb.has(d.id)) continue;
    const data = {
      slug: d.slug,
      name: d.name,
      pcode: d.pcode,
      areaSqKm: d.areaSqKm,
      centerLat: d.center[0],
      centerLon: d.center[1],
      tagline: d.tagline,
      blurb: d.blurb,
    };
    await prisma.district.upsert({
      where: { id: d.id },
      create: { id: d.id, ...data },
      update: data,
    });
    districtsWritten += 1;
  }
  console.log(`Districts ${overwrite ? "upserted" : "added"}: ${districtsWritten}`);

  const seen = new Set<string>();
  let destinationsWritten = 0;
  for (const x of allDestinations) {
    // Fail loudly on data mistakes instead of writing bad rows.
    if (!districtIds.has(x.districtId)) throw new Error(`${x.id}: unknown district "${x.districtId}"`);
    if (seen.has(x.id)) throw new Error(`Duplicate destination id ${x.id}`);
    seen.add(x.id);
    for (const s of x.bestSeasons) if (!SEASONS.includes(s)) throw new Error(`${x.id}: bad season "${s}"`);
    if (!BUDGETS.includes(x.budget)) throw new Error(`${x.id}: bad budget "${x.budget}"`);
    if (!overwrite && destinationInDb.has(x.id)) continue;

    const data = {
      slug: x.slug,
      districtId: x.districtId,
      name: x.name,
      nameNepali: x.nameNepali ?? null,
      category: x.category,
      nearestTown: x.nearestTown ?? null,
      lat: x.position?.[0] ?? null,
      lon: x.position?.[1] ?? null,
      elevationM: x.elevationM ?? null,
      interestTags: x.interestTags,
      bestSeasons: x.bestSeasons,
      bestTimeNote: x.bestTimeNote ?? null,
      budget: x.budget,
      budgetNote: x.budgetNote ?? null,
      hiddenGem: x.hiddenGem,
      hiddenGemReason: x.hiddenGemReason ?? null,
      shortDescription: x.shortDescription,
      longDescription: x.longDescription ?? null,
      bestFor: x.bestFor ?? null,
      howToGetThere: x.howToGetThere ?? null,
      entryFee: x.entryFee ?? null,
      openingHours: x.openingHours ?? null,
      nearbyStaysFood: x.nearbyStaysFood ?? null,
      safetyNotes: x.safetyNotes ?? null,
      mediaPhoto: x.media?.photo ?? null,
      mediaPhotoUrl: x.media?.photoUrl ?? null,
      mediaCredit: x.media?.credit ?? null,
      sources: x.sources ?? [],
      alternateNames: x.alternateNames,
      culturalNote: x.culturalNote ?? null,
      verify: x.verify ?? [],
    };
    await prisma.destination.upsert({
      where: { id: x.id },
      create: { id: x.id, ...data },
      update: data,
    });
    destinationsWritten += 1;
    console.log(`  ${overwrite ? "upserted" : "added"} ${x.id}`);
  }
  console.log(
    `Destinations ${overwrite ? "upserted" : "added"}: ${destinationsWritten}` +
      (overwrite ? "" : ` (skipped ${allDestinations.length - destinationsWritten} already in the database)`),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());