/**
 * Data-access layer. Pages and components import ONLY from here — never from
 * the Prisma client directly — so the database can change without touching UI.
 * Everything returned is a plain, serializable `Destination` or `MapPlace`,
 * safe to pass from server components into client components (e.g. the
 * Leaflet map).
 */
import { cache } from "react";
import { prisma } from "./prisma";
import { coverImageUrl } from "@/lib/images";
import type {
  BudgetLevel,
  DestinationImage,
  Destination,
  InterestTag,
  MapPlace,
  Season,
} from "@/lib/types";
import type {
  Destination as Row,
  DestinationImage as ImageRow,
  Prisma,
} from "@/generated/prisma/client";

const withImages = {
  images: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.DestinationInclude;

/** Only the columns a map marker or hover card reads, plus the cover photo. */
const mapPlaceSelect = {
  id: true,
  slug: true,
  districtId: true,
  name: true,
  shortDescription: true,
  lat: true,
  lon: true,
  hiddenGem: true,
  images: { orderBy: { sortOrder: "asc" }, take: 1, select: { secureUrl: true } },
} satisfies Prisma.DestinationSelect;

const hasPosition = { lat: { not: null }, lon: { not: null } } satisfies Prisma.DestinationWhereInput;

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

type MapPlaceRow = Prisma.DestinationGetPayload<{ select: typeof mapPlaceSelect }>;

function toMapPlace(r: MapPlaceRow): MapPlace {
  return {
    id: r.id,
    slug: r.slug,
    districtId: r.districtId,
    name: r.name,
    shortDescription: r.shortDescription,
    // The `hasPosition` filter guarantees both are set.
    position: [r.lat!, r.lon!],
    hiddenGem: r.hiddenGem,
    coverUrl: r.images[0]?.secureUrl,
  };
}

/**
 * Slims already-loaded destinations down to map markers, dropping any without
 * coordinates. For pages that render both a list and a map from one query.
 */
export function toMapPlaces(destinations: Destination[]): MapPlace[] {
  return destinations.flatMap((destination) =>
    destination.position
      ? [
          {
            id: destination.id,
            slug: destination.slug,
            districtId: destination.districtId,
            name: destination.name,
            shortDescription: destination.shortDescription,
            position: destination.position,
            hiddenGem: destination.hiddenGem,
            coverUrl: coverImageUrl(destination),
          },
        ]
      : [],
  );
}

export async function getDestinationsForDistrict(
  districtId: string,
): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({
    where: { districtId },
    orderBy: { name: "asc" },
    include: withImages,
  });
  return rows.map(toDestination);
}

/**
 * Cached per request: the destination page calls this from both
 * `generateMetadata` and the page body, which now share one query.
 */
export const getDestination = cache(
  async (districtId: string, slug: string): Promise<Destination | null> => {
    const row = await prisma.destination.findUnique({
      where: { districtId_slug: { districtId, slug } },
      include: withImages,
    });
    return row ? toDestination(row) : null;
  },
);

/**
 * The place that follows `current` in the province-wide reading order
 * (district, then name), wrapping around at the end. Reads only the three
 * columns the "Next place" link needs.
 */
export async function getNextDestination(current: {
  id: string;
}): Promise<{ slug: string; districtId: string; name: string } | null> {
  const order = await prisma.destination.findMany({
    orderBy: [{ districtId: "asc" }, { name: "asc" }],
    select: { id: true, slug: true, districtId: true, name: true },
  });
  const index = order.findIndex((place) => place.id === current.id);
  if (index === -1 || order.length < 2) return null;
  const { slug, districtId, name } = order[(index + 1) % order.length];
  return { slug, districtId, name };
}

export async function getAllDestinationParams(): Promise<
  { slug: string; destination: string }[]
> {
  const rows = await prisma.destination.findMany({
    select: { districtId: true, slug: true },
  });
  return rows.map((row) => ({ slug: row.districtId, destination: row.slug }));
}

/** Map markers for every placed destination, optionally limited to one district. */
export async function getMapPlaces(districtId?: string): Promise<MapPlace[]> {
  const rows = await prisma.destination.findMany({
    where: { ...hasPosition, ...(districtId ? { districtId } : {}) },
    orderBy: [{ districtId: "asc" }, { name: "asc" }],
    select: mapPlaceSelect,
  });
  return rows.map(toMapPlace);
}

export async function getHiddenGems(): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({
    where: { hiddenGem: true },
    orderBy: [{ districtId: "asc" }, { name: "asc" }],
    include: withImages,
  });
  return rows.map(toDestination);
}

/** Cached per request, like `getDestination`. */
export const getDestinationBySlug = cache(
  async (slug: string): Promise<Destination | null> => {
    const rows = await prisma.destination.findMany({
      where: { slug },
      orderBy: [{ districtId: "asc" }, { name: "asc" }],
      take: 2,
      include: withImages,
    });
    // Slugs are unique only within a district. The legacy /place/[slug] route
    // must not silently redirect an ambiguous slug to the wrong district.
    return rows.length === 1 ? toDestination(rows[0]) : null;
  },
);

export async function getAllPlaceParams(): Promise<{ slug: string }[]> {
  const rows = await prisma.destination.findMany({
    select: { slug: true },
    distinct: ["slug"],
    orderBy: { slug: "asc" },
  });
  return rows;
}
