/**
 * Data-access layer. Pages and components import ONLY from here — never from
 * the Prisma client directly — so the database can change without touching UI.
 * Everything returned is a plain, serializable `Destination`, safe to pass
 * from server components into client components (e.g. the Leaflet map).
 */
import { prisma } from "./prisma";
import type {
  BudgetLevel,
  DestinationImage,
  Destination,
  InterestTag,
  Season,
} from "@/lib/types";
import type { Destination as Row, DestinationImage as ImageRow } from "@/generated/prisma/client";

function toImage(image: ImageRow): DestinationImage {
  return {
    id: image.id,
    publicId: image.publicId,
    secureUrl: image.secureUrl,
    originalFilename: image.originalFilename,
    sortOrder: image.sortOrder,
    isCover: image.isCover,
    credit: image.credit ?? undefined,
  };
}

type DestinationRow = Row & { images: ImageRow[] };

function toDestination(r: DestinationRow): Destination {
  return {
    id: r.id,
    slug: r.slug,
    districtId: r.districtId,
    name: r.name,
    nameNepali: r.nameNepali ?? undefined,
    category: r.category,
    nearestTown: r.nearestTown ?? undefined,
    position: r.lat != null && r.lon != null ? [r.lat, r.lon] : null,
    elevationM: r.elevationM ?? undefined,
    interestTags: r.interestTags as InterestTag[],
    bestSeasons: r.bestSeasons as Season[],
    bestTimeNote: r.bestTimeNote ?? undefined,
    budget: r.budget as BudgetLevel,
    budgetNote: r.budgetNote ?? undefined,
    hiddenGem: r.hiddenGem,
    hiddenGemReason: r.hiddenGemReason ?? undefined,
    shortDescription: r.shortDescription,
    longDescription: r.longDescription ?? undefined,
    bestFor: r.bestFor ?? undefined,
    howToGetThere: r.howToGetThere ?? undefined,
    entryFee: r.entryFee ?? undefined,
    openingHours: r.openingHours ?? undefined,
    nearbyStaysFood: r.nearbyStaysFood ?? undefined,
    safetyNotes: r.safetyNotes ?? undefined,
    media: r.mediaPhoto || r.images.length
      ? {
          photo: r.mediaPhoto ?? "",
          photoUrl: r.mediaPhotoUrl ?? undefined,
          credit: r.mediaCredit ?? "",
          photos: r.images.map(toImage),
        }
      : undefined,
    sources: r.sources.length ? r.sources : undefined,
    alternateNames: r.alternateNames,
    culturalNote: r.culturalNote ?? undefined,
    verify: r.verify.length ? r.verify : undefined,
  };
}

export async function getDestinationsForDistrict(
  districtId: string,
): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({
    where: { districtId },
    orderBy: { name: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return rows.map(toDestination);
}

export async function getDestination(
  districtId: string,
  slug: string,
): Promise<Destination | null> {
  const row = await prisma.destination.findUnique({
    where: { districtId_slug: { districtId, slug } },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return row ? toDestination(row) : null;
}

export async function getAllDestinationParams(): Promise<
  { slug: string; destination: string }[]
> {
  const rows = await prisma.destination.findMany({
    select: { districtId: true, slug: true },
  });
  return rows.map((row) => ({ slug: row.districtId, destination: row.slug }));
}

export async function getMappableDestinations(
  districtId: string,
): Promise<Destination[]> {
  const all = await getDestinationsForDistrict(districtId);
  return all.filter((destination) => destination.position !== null);
}

export async function getAllDestinations(): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({
    orderBy: [{ districtId: "asc" }, { name: "asc" }],
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return rows.map(toDestination);
}

export async function getAllMappableDestinations(): Promise<Destination[]> {
  const destinations = await getAllDestinations();
  return destinations.filter((destination) => destination.position !== null);
}

export async function getDestinationBySlug(
  slug: string,
): Promise<Destination | null> {
  const rows = await prisma.destination.findMany({
    where: { slug },
    orderBy: [{ districtId: "asc" }, { name: "asc" }],
    take: 2,
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  // Slugs are unique only within a district. The legacy /place/[slug] route
  // must not silently redirect an ambiguous slug to the wrong district.
  return rows.length === 1 ? toDestination(rows[0]) : null;
}

export async function getAllPlaceParams(): Promise<{ slug: string }[]> {
  const rows = await prisma.destination.findMany({
    select: { slug: true },
    distinct: ["slug"],
    orderBy: { slug: "asc" },
  });
  return rows;
}
