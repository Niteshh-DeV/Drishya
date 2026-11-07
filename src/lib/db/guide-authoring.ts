/**
 * Data access for a guide editing their own profile. Every function takes
 * the signed-in user's id and only touches that user's profile; ownership
 * is part of each query, not left to the caller.
 */
import { prisma } from "./prisma";
import type { GuideProfileInput, GuideStatus, InterestTag } from "@/lib/types";
import type { Prisma } from "@/generated/prisma/client";

/** What a page needs to refresh after a profile changes. */
export interface GuidePaths {
  id: string;
  /** Whether visitors could see the profile before this change. */
  wasPublished: boolean;
  districtIds: string[];
  destinationPaths: string[];
}

export interface OwnGuideProfile {
  id: string;
  status: GuideStatus;
  reviewNote?: string;
  input: GuideProfileInput;
}

const pathsSelect = {
  id: true,
  status: true,
  districts: { select: { districtId: true } },
  destinations: { select: { destination: { select: { slug: true, districtId: true } } } },
} satisfies Prisma.GuideProfileSelect;

function toPaths(r: Prisma.GuideProfileGetPayload<{ select: typeof pathsSelect }>): GuidePaths {
  return {
    id: r.id,
    wasPublished: r.status === "published",
    districtIds: r.districts.map((d) => d.districtId),
    destinationPaths: r.destinations.map(
      ({ destination }) => `/districts/${destination.districtId}/${destination.slug}`,
    ),
  };
}

/**
 * `User.role` says "guide" exactly while the profile is listed. Admins keep
 * their role whatever happens to a profile of theirs.
 */
export function syncGuideRole(userId: string, listed: boolean) {
  return prisma.user.updateMany({
    where: { id: userId, role: listed ? "traveler" : "guide" },
    data: { role: listed ? "guide" : "traveler" },
  });
}

/** The user's own profile shaped for the application form, or null if they have none. */
export async function getOwnGuideProfile(userId: string): Promise<OwnGuideProfile | null> {
  const r = await prisma.guideProfile.findUnique({
    where: { userId },
    include: {
      districts: { orderBy: { position: "asc" }, select: { districtId: true } },
      destinations: { orderBy: { position: "asc" }, select: { destinationId: true } },
      specialties: { orderBy: { position: "asc" }, select: { tagName: true } },
      languages: { orderBy: { position: "asc" }, select: { language: true } },
    },
  });
  if (!r) return null;
  return {
    id: r.id,
    status: r.status,
    reviewNote: r.reviewNote ?? undefined,
    input: {
      headline: r.headline,
      about: r.about,
      guidingSince: r.guidingSince ?? undefined,
      photo:
        r.photoPublicId && r.photoUrl ? { publicId: r.photoPublicId, url: r.photoUrl } : undefined,
      rates: r.rates ?? "",
      phone: r.phone ?? "",
      whatsapp: r.whatsapp,
      contactEmail: r.contactEmail ?? "",
      licenceNo: r.licenceNo ?? "",
      districtIds: r.districts.map((d) => d.districtId),
      destinationIds: r.destinations.map((d) => d.destinationId),
      specialties: r.specialties.map((s) => s.tagName as InterestTag),
      languages: r.languages.map((l) => l.language),
    },
  };
}

/** The profile's review status, for the account page. */
export async function getOwnGuideStatus(
  userId: string,
): Promise<{ id: string; status: GuideStatus } | null> {
  return prisma.guideProfile.findUnique({ where: { userId }, select: { id: true, status: true } });
}

/**
 * Places must exist and sit in one of the districts the guide works in —
 * a Kailali guide can't list Api Nampa without also listing Darchula.
 */
async function checkPlaces(input: GuideProfileInput): Promise<string | null> {
  if (input.destinationIds.length === 0) return null;
  const rows = await prisma.destination.findMany({
    where: { id: { in: input.destinationIds } },
    select: { id: true, districtId: true, name: true },
  });
  if (rows.length !== input.destinationIds.length) return "One of the places could not be found.";
  const outside = rows.find((r) => !input.districtIds.includes(r.districtId));
  return outside ? `${outside.name} isn't in one of the districts you picked.` : null;
}

/**
 * Creates or replaces the user's profile. Saving a listed profile takes it
 * off the directory until it is reviewed again, so approved contact details
 * can't be swapped for unchecked ones.
 */
export async function saveOwnGuideProfile(
  userId: string,
  input: GuideProfileInput,
  status: Extract<GuideStatus, "draft" | "pending">,
): Promise<{ ok: true; id: string; before: GuidePaths | null } | { ok: false; error: string }> {
  const placeError = await checkPlaces(input);
  if (placeError) return { ok: false, error: placeError };

  const existing = await prisma.guideProfile.findUnique({ where: { userId }, select: pathsSelect });

  const fields = {
    headline: input.headline,
    about: input.about,
    guidingSince: input.guidingSince ?? null,
    photoPublicId: input.photo?.publicId ?? null,
    photoUrl: input.photo?.url ?? null,
    rates: input.rates || null,
    phone: input.phone || null,
    whatsapp: input.whatsapp,
    contactEmail: input.contactEmail || null,
    licenceNo: input.licenceNo || null,
    status,
  };
  const lists = {
    districts: { create: input.districtIds.map((districtId, position) => ({ districtId, position })) },
    destinations: {
      create: input.destinationIds.map((destinationId, position) => ({ destinationId, position })),
    },
    specialties: { create: input.specialties.map((tagName, position) => ({ tagName, position })) },
    languages: { create: input.languages.map((language, position) => ({ language, position })) },
  };
  const reset = { deleteMany: {} };

  const [saved] = await prisma.$transaction([
    prisma.guideProfile.upsert({
      where: { userId },
      create: { userId, ...fields, ...lists },
      update: {
        ...fields,
        districts: { ...reset, ...lists.districts },
        destinations: { ...reset, ...lists.destinations },
        specialties: { ...reset, ...lists.specialties },
        languages: { ...reset, ...lists.languages },
      },
      select: { id: true },
    }),
    syncGuideRole(userId, false),
  ]);

  return { ok: true, id: saved.id, before: existing ? toPaths(existing) : null };
}

export async function deleteOwnGuideProfile(userId: string): Promise<GuidePaths | null> {
  const existing = await prisma.guideProfile.findUnique({ where: { userId }, select: pathsSelect });
  if (!existing) return null;
  await prisma.$transaction([
    prisma.guideProfile.delete({ where: { userId } }),
    syncGuideRole(userId, false),
  ]);
  return toPaths(existing);
}

/** Paths for a profile by id, for the review actions. */
export async function guidePaths(id: string): Promise<(GuidePaths & { userId: string }) | null> {
  const r = await prisma.guideProfile.findUnique({
    where: { id },
    select: { ...pathsSelect, userId: true },
  });
  return r ? { ...toPaths(r), userId: r.userId } : null;
}
