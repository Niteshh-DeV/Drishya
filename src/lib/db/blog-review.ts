/**
 * Data access for the admin review queue. Callers must check the admin role
 * first (see `requireAdmin` in src/lib/admin.ts); nothing here does.
 */
import { prisma } from "./prisma";
import type { BlogPostSection } from "@/lib/types";
import type { PostPaths } from "./blog-authoring";

export interface ReviewPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  /** The account behind the byline, so reviewers can tell who wrote it. */
  authorAccount?: string;
  coverUrl?: string;
  coverCredit?: string;
  updatedAt: string;
  publishedAt?: string;
  sections: Omit<BlogPostSection, "id">[];
  places: { name: string; districtId: string; slug: string }[];
  tags: string[];
}

const reviewInclude = {
  author: { select: { name: true, email: true } },
  sections: { orderBy: { position: "asc" as const } },
  destinations: {
    orderBy: { position: "asc" as const },
    select: { destination: { select: { name: true, districtId: true, slug: true } } },
  },
  tags: { select: { tagName: true } },
};

async function postsWithStatus(
  status: "pending" | "published",
): Promise<ReviewPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status },
    orderBy: status === "pending" ? { updatedAt: "asc" } : { publishedAt: "desc" },
    include: reviewInclude,
  });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    authorName: r.authorName,
    authorAccount: r.author
      ? [r.author.name, r.author.email].filter(Boolean).join(" · ")
      : undefined,
    coverUrl: r.coverUrl ?? undefined,
    coverCredit: r.coverCredit ?? undefined,
    updatedAt: r.updatedAt.toISOString(),
    publishedAt: r.publishedAt?.toISOString(),
    sections: r.sections.map((s) => ({
      heading: s.heading ?? undefined,
      body: s.body,
      imageUrl: s.imageUrl ?? undefined,
      imageCaption: s.imageCaption ?? undefined,
    })),
    places: r.destinations.map((d) => d.destination),
    tags: r.tags.map((t) => t.tagName),
  }));
}

export async function countPendingPosts(): Promise<number> {
  return prisma.blogPost.count({ where: { status: "pending" } });
}

/** Oldest first, so nothing waits at the bottom of the queue. */
export const getPendingPosts = () => postsWithStatus("pending");
export const getLivePosts = () => postsWithStatus("published");

async function pathsFor(id: string): Promise<PostPaths | null> {
  const r = await prisma.blogPost.findUnique({
    where: { id },
    select: {
      slug: true,
      status: true,
      destinations: { select: { destination: { select: { slug: true, districtId: true } } } },
      districts: { select: { districtId: true } },
    },
  });
  if (!r) return null;
  return {
    slug: r.slug,
    wasPublished: r.status === "published",
    destinationPaths: r.destinations.map(
      ({ destination }) => `/districts/${destination.districtId}/${destination.slug}`,
    ),
    districtIds: r.districts.map((d) => d.districtId),
  };
}

/**
 * Publishes a pending post. A post re-approved after an edit keeps its
 * original publish date.
 */
export async function approvePost(id: string): Promise<PostPaths | null> {
  const paths = await pathsFor(id);
  if (!paths) return null;
  const current = await prisma.blogPost.findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  await prisma.blogPost.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: current?.publishedAt ?? new Date(),
      reviewNote: null,
    },
  });
  return paths;
}

/** Rejects a pending post, or takes a published one down, with a note for the author. */
export async function rejectPost(id: string, note: string): Promise<PostPaths | null> {
  const paths = await pathsFor(id);
  if (!paths) return null;
  await prisma.blogPost.update({
    where: { id },
    data: { status: "rejected", reviewNote: note },
  });
  return paths;
}
