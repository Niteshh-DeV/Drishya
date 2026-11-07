/**
 * Guide Connect data access for public pages. Every query is limited to
 * published profiles, and none of them return phone numbers or emails —
 * those go out one guide at a time through `getGuideContact`, which the
 * caller must only use for a signed-in visitor.
 */
import { cache } from "react";
import { prisma } from "./prisma";
import type { Guide, GuideContact, GuideSummary, InterestTag } from "@/lib/types";
import type { Prisma } from "@/generated/prisma/client";

const published = {
  status: "published",
  publishedAt: { not: null },
} satisfies Prisma.GuideProfileWhereInput;

const newestFirst = { publishedAt: "desc" } satisfies Prisma.GuideProfileOrderByWithRelationInput;

const summarySelect = {
  id: true,
  headline: true,
  guidingSince: true,
  photoUrl: true,
  user: { select: { name: true, image: true } },
  districts: { orderBy: { position: "asc" }, select: { districtId: true } },
  languages: { orderBy: { position: "asc" }, select: { language: true } },
  specialties: { orderBy: { position: "asc" }, select: { tagName: true } },
} satisfies Prisma.GuideProfileSelect;

const guideSelect = {
  ...summarySelect,
  about: true,
  rates: true,
  phone: true,
  whatsapp: true,
  contactEmail: true,
  publishedAt: true,
  destinations: {
    orderBy: { position: "asc" },
    select: {
      destination: {
        select: {
          id: true,
          slug: true,
          districtId: true,
          name: true,
          shortDescription: true,
          lat: true,
          lon: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1, select: { secureUrl: true } },
        },
      },
    },
  },
} satisfies Prisma.GuideProfileSelect;

type SummaryRow = Prisma.GuideProfileGetPayload<{ select: typeof summarySelect }>;

function toSummary(r: SummaryRow): GuideSummary {
  return {
    id: r.id,
    name: r.user.name ?? "Local guide",
    image: r.photoUrl ?? r.user.image ?? undefined,
    headline: r.headline,
    districtIds: r.districts.map((d) => d.districtId),
    languages: r.languages.map((l) => l.language),
    specialties: r.specialties.map((s) => s.tagName as InterestTag),
    guidingSince: r.guidingSince ?? undefined,
  };
}

/** Every listed guide, newest first. */
export async function getPublishedGuides(): Promise<GuideSummary[]> {
  const rows = await prisma.guideProfile.findMany({
    where: published,
    orderBy: newestFirst,
    select: summarySelect,
  });
  return rows.map(toSummary);
}

/** Cached per request: `generateMetadata` and the page share one query. */
export const getGuide = cache(async (id: string): Promise<Guide | null> => {
  const r = await prisma.guideProfile.findFirst({ where: { id, ...published }, select: guideSelect });
  if (!r) return null;
  const contactMethods: Guide["contactMethods"] = [];
  if (r.phone) contactMethods.push("phone");
  if (r.phone && r.whatsapp) contactMethods.push("whatsapp");
  if (r.contactEmail) contactMethods.push("email");
  return {
    ...toSummary(r),
    about: r.about,
    rates: r.rates ?? undefined,
    places: r.destinations.map(({ destination: d }) => ({
      id: d.id,
      slug: d.slug,
      districtId: d.districtId,
      name: d.name,
      shortDescription: d.shortDescription,
      position: d.lat != null && d.lon != null ? [d.lat, d.lon] : null,
      coverUrl: d.images[0]?.secureUrl,
    })),
    contactMethods,
    publishedAt: r.publishedAt!.toISOString(),
  };
});

export async function getGuideParams(): Promise<{ id: string }[]> {
  return prisma.guideProfile.findMany({ where: published, select: { id: true } });
}

/** Guides who work anywhere in the district. */
export async function getGuidesForDistrict(districtId: string): Promise<GuideSummary[]> {
  const rows = await prisma.guideProfile.findMany({
    where: { ...published, districts: { some: { districtId } } },
    orderBy: newestFirst,
    select: summarySelect,
  });
  return rows.map(toSummary);
}

/** Guides who listed this destination among the places they know. */
export async function getGuidesForDestination(destinationId: string): Promise<GuideSummary[]> {
  const rows = await prisma.guideProfile.findMany({
    where: { ...published, destinations: { some: { destinationId } } },
    orderBy: newestFirst,
    select: summarySelect,
  });
  return rows.map(toSummary);
}

/** A published guide's phone and email. Only call this for a signed-in visitor. */
export async function getGuideContact(id: string): Promise<GuideContact | null> {
  const r = await prisma.guideProfile.findFirst({
    where: { id, ...published },
    select: { phone: true, whatsapp: true, contactEmail: true, user: { select: { name: true } } },
  });
  if (!r) return null;
  return {
    name: r.user.name ?? "Local guide",
    phone: r.phone ?? undefined,
    whatsapp: Boolean(r.phone) && r.whatsapp,
    email: r.contactEmail ?? undefined,
  };
}
