/**
 * Seeds districts, destinations and the sample blog post from the TypeScript
 * data files.
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
import type {
  BudgetLevel,
  Category,
  Destination,
  InterestTag,
  Season,
} from "../src/lib/types";
import { districts } from "../src/data/districts";
import { achhamDestinations } from "./data/achham";
import { blogPosts, type BlogPostSeed } from "./data/blog";
import { baitadiDestinations } from "./data/baitadi";
import { bajuraDestinations } from "./data/bajura";
import { bajhangDestinations } from "./data/bajhang";
import { dadeldhuraDestinations } from "./data/dadeldhura";
import { dotiDestinations } from "./data/doti";
import { kailaliDestinations } from "./data/kailali";
import { kanchanpurDestinations } from "./data/kanchanpur";

const allDestinations = [
  ...achhamDestinations,
  ...baitadiDestinations,
  ...bajuraDestinations,
  ...bajhangDestinations,
  ...dadeldhuraDestinations,
  ...dotiDestinations,
  ...kailaliDestinations,
  ...kanchanpurDestinations,
];

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const overwrite = process.argv.includes("--overwrite");

// Lookup vocabularies — identical to the string unions in src/lib/types.ts.
// `satisfies` makes the compiler flag any value the unions don't allow.
const CATEGORIES = [
  "Temple", "Religious Site", "Historical Site", "Archaeological Site",
  "Cultural Heritage", "Lake & Wetland", "River", "Waterfall", "Cave",
  "Viewpoint", "Mountain & Trek", "Meadow", "Forest & Wildlife",
  "Park & Recreation", "Town & Village", "Landmark",
] satisfies Category[];
const INTEREST_TAGS = [
  "Culture", "History", "Religious", "Nature", "Wildlife",
  "Adventure", "Trekking", "Relaxation", "Archaeology",
] satisfies InterestTag[];
const SEASONS = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"] satisfies Season[];
const BUDGETS = ["Low", "Low-Medium", "Medium", "High"] satisfies BudgetLevel[];

/** Child rows for a destination, each list kept in its authored order. */
function childRows(x: Destination) {
  return {
    categories: { create: x.category.map((categoryName, position) => ({ categoryName, position })) },
    interestTags: { create: x.interestTags.map((tagName, position) => ({ tagName, position })) },
    bestSeasons: { create: x.bestSeasons.map((seasonName, position) => ({ seasonName, position })) },
    alternateNames: {
      create: [...new Set(x.alternateNames)].map((name, position) => ({ name, position })),
    },
    sources: {
      create: (x.sources ?? []).map((source, position) => ({
        url: source.url ?? null,
        label: source.label ?? null,
        position,
      })),
    },
    verifications: { create: [...new Set(x.verify ?? [])].map((field) => ({ field })) },
  };
}

async function main() {
  // Lookup rows first: destinations reference them by foreign key.
  await prisma.category.createMany({ data: CATEGORIES.map((name) => ({ name })), skipDuplicates: true });
  await prisma.interestTag.createMany({ data: INTEREST_TAGS.map((name) => ({ name })), skipDuplicates: true });
  await prisma.season.createMany({
    data: SEASONS.map((name, i) => ({ name, sortOrder: i + 1 })),
    skipDuplicates: true,
  });
  await prisma.budgetLevel.createMany({
    data: BUDGETS.map((name, i) => ({ name, rank: i + 1 })),
    skipDuplicates: true,
  });

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
    for (const t of x.interestTags) if (!INTEREST_TAGS.includes(t)) throw new Error(`${x.id}: bad interest tag "${t}"`);
    for (const c of x.category) if (!CATEGORIES.includes(c)) throw new Error(`${x.id}: bad category "${c}"`);
    if (!x.category.length) throw new Error(`${x.id}: needs at least one category`);
    if (!BUDGETS.includes(x.budget)) throw new Error(`${x.id}: bad budget "${x.budget}"`);
    if (!overwrite && destinationInDb.has(x.id)) continue;

    const data = {
      slug: x.slug,
      districtId: x.districtId,
      name: x.name,
      nameNepali: x.nameNepali ?? null,
      nearestTown: x.nearestTown ?? null,
      lat: x.position?.[0] ?? null,
      lon: x.position?.[1] ?? null,
      elevationM: x.elevationM ?? null,
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
      photoCredit: x.photoCredit ?? null,
      culturalNote: x.culturalNote ?? null,
    };
    const children = childRows(x);
    if (destinationInDb.has(x.id)) {
      // --overwrite: replace every child list wholesale with the .ts values.
      const reset = { deleteMany: {} };
      await prisma.destination.update({
        where: { id: x.id },
        data: {
          ...data,
          categories: { ...reset, ...children.categories },
          interestTags: { ...reset, ...children.interestTags },
          bestSeasons: { ...reset, ...children.bestSeasons },
          alternateNames: { ...reset, ...children.alternateNames },
          sources: { ...reset, ...children.sources },
          verifications: { ...reset, ...children.verifications },
        },
      });
    } else {
      await prisma.destination.create({ data: { id: x.id, ...data, ...children } });
    }
    destinationsWritten += 1;
    console.log(`  ${overwrite ? "upserted" : "added"} ${x.id}`);
  }
  console.log(
    `Destinations ${overwrite ? "upserted" : "added"}: ${destinationsWritten}` +
      (overwrite ? "" : ` (skipped ${allDestinations.length - destinationsWritten} already in the database)`),
  );

  await seedBlogPosts();
}

/**
 * Photos come from the destination's Cloudinary gallery already in the
 * database, so run `npm run cloudinary:seed` first for posts to get images.
 */
async function blogPostData(post: BlogPostSeed) {
  const gallery = post.photosFrom
    ? await prisma.destinationImage.findMany({
        where: { destinationId: post.photosFrom },
        orderBy: { sortOrder: "asc" },
      })
    : [];
  const cover = gallery[0];
  const districtIds = await prisma.destination.findMany({
    where: { id: { in: post.destinationIds } },
    select: { districtId: true },
    distinct: ["districtId"],
  });
  return {
    title: post.title,
    excerpt: post.excerpt,
    authorName: post.authorName,
    status: "published" as const,
    publishedAt: new Date(post.publishedAt),
    coverPublicId: cover?.publicId ?? null,
    coverUrl: cover?.secureUrl ?? null,
    coverCredit: cover?.credit ?? null,
    sections: {
      create: post.sections.map((section, position) => {
        const photo = section.photoIndex != null ? gallery[section.photoIndex] : undefined;
        return {
          position,
          heading: section.heading ?? null,
          body: section.body,
          imagePublicId: photo?.publicId ?? null,
          imageUrl: photo?.secureUrl ?? null,
          imageCaption: photo ? section.imageCaption ?? null : null,
        };
      }),
    },
    destinations: {
      create: post.destinationIds.map((destinationId, position) => ({ destinationId, position })),
    },
    districts: { create: districtIds.map(({ districtId }) => ({ districtId })) },
    tags: { create: post.tags.map((tagName) => ({ tagName })) },
  };
}

async function seedBlogPosts() {
  const destinationIds = new Set(allDestinations.map((x) => x.id));
  let written = 0;
  for (const post of blogPosts) {
    for (const id of post.destinationIds) {
      if (!destinationIds.has(id)) throw new Error(`blog ${post.slug}: unknown destination "${id}"`);
    }
    for (const t of post.tags) if (!INTEREST_TAGS.includes(t)) throw new Error(`blog ${post.slug}: bad tag "${t}"`);

    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug }, select: { id: true } });
    if (existing && !overwrite) continue;
    const data = await blogPostData(post);
    if (existing) {
      const reset = { deleteMany: {} };
      await prisma.blogPost.update({
        where: { id: existing.id },
        data: {
          ...data,
          sections: { ...reset, ...data.sections },
          destinations: { ...reset, ...data.destinations },
          districts: { ...reset, ...data.districts },
          tags: { ...reset, ...data.tags },
        },
      });
    } else {
      await prisma.blogPost.create({ data: { slug: post.slug, ...data } });
    }
    written += 1;
    console.log(`  ${overwrite ? "upserted" : "added"} blog post ${post.slug}`);
  }
  console.log(`Blog posts ${overwrite ? "upserted" : "added"}: ${written}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());