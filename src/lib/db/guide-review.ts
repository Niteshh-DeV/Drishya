/**
 * Data access for the admin guide review queue. Callers must check the admin
 * role first (see `requireAdmin` in src/lib/admin.ts); nothing here does.
 * Unlike the public queries, these return contact details and the licence
 * number, which reviewers need to check a guide is who they say.
 */
import { prisma } from "./prisma";
import { guidePaths, syncGuideRole, type GuidePaths } from "./guide-authoring";

export interface ReviewGuide {
  id: string;
  name: string;
  /** The account behind the profile, so reviewers can tell who applied. */
  account: string;
  image?: string;
  headline: string;
  about: string;
  guidingSince?: number;
  rates?: string;
  phone?: string;
  whatsapp: boolean;
  contactEmail?: string;
  licenceNo?: string;
  districtIds: string[];
  places: { name: string; districtId: string; slug: string }[];
  specialties: string[];
  languages: string[];
  updatedAt: string;
  publishedAt?: string;
}

async function guidesWithStatus(status: "pending" | "published"): Promise<ReviewGuide[]> {
  const rows = await prisma.guideProfile.findMany({
    where: { status },
    orderBy: status === "pending" ? { updatedAt: "asc" } : { publishedAt: "desc" },
    include: {
      user: { select: { name: true, email: true, image: true } },
      districts: { orderBy: { position: "asc" }, select: { districtId: true } },
      destinations: {
        orderBy: { position: "asc" },
        select: { destination: { select: { name: true, districtId: true, slug: true } } },
      },
      specialties: { orderBy: { position: "asc" }, select: { tagName: true } },
      languages: { orderBy: { position: "asc" }, select: { language: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.user.name ?? "No name on the account",
    account: [r.user.name, r.user.email].filter(Boolean).join(" · "),
    image: r.photoUrl ?? r.user.image ?? undefined,
    headline: r.headline,
    about: r.about,
    guidingSince: r.guidingSince ?? undefined,
    rates: r.rates ?? undefined,
    phone: r.phone ?? undefined,
    whatsapp: r.whatsapp,
    contactEmail: r.contactEmail ?? undefined,
    licenceNo: r.licenceNo ?? undefined,
    districtIds: r.districts.map((d) => d.districtId),
    places: r.destinations.map((d) => d.destination),
    specialties: r.specialties.map((s) => s.tagName),
    languages: r.languages.map((l) => l.language),
    updatedAt: r.updatedAt.toISOString(),
    publishedAt: r.publishedAt?.toISOString(),
  }));
}

export async function countPendingGuides(): Promise<number> {
  return prisma.guideProfile.count({ where: { status: "pending" } });
}

/** Oldest first, so nobody waits at the bottom of the queue. */
export const getPendingGuides = () => guidesWithStatus("pending");
export const getListedGuides = () => guidesWithStatus("published");

/**
 * Lists a pending profile and gives the account the guide role. A profile
 * re-approved after an edit keeps its original listing date.
 */
export async function approveGuide(id: string): Promise<GuidePaths | null> {
  const paths = await guidePaths(id);
  if (!paths) return null;
  const current = await prisma.guideProfile.findUnique({ where: { id }, select: { publishedAt: true } });
  await prisma.$transaction([
    prisma.guideProfile.update({
      where: { id },
      data: { status: "published", publishedAt: current?.publishedAt ?? new Date(), reviewNote: null },
    }),
    syncGuideRole(paths.userId, true),
  ]);
  return paths;
}

/** Sends a pending profile back, or takes a listed one down, with a note for the guide. */
export async function rejectGuide(id: string, note: string): Promise<GuidePaths | null> {
  const paths = await guidePaths(id);
  if (!paths) return null;
  await prisma.$transaction([
    prisma.guideProfile.update({ where: { id }, data: { status: "rejected", reviewNote: note } }),
    syncGuideRole(paths.userId, false),
  ]);
  return paths;
}
