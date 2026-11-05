/**
 * Data access for travelers writing their own posts. Kept apart from
 * `blog.ts` so reader-facing queries stay limited to published posts.
 * Every function takes the signed-in user's id and only touches that
 * user's posts; ownership is checked here, not left to the caller.
 */
import { prisma } from "./prisma";
import { makeSlug } from "@/lib/blog-input";
import type {
  AuthorPostSummary,
  BlogPostInput,
  BlogPostStatus,
  InterestTag,
} from "@/lib/types";

/** What a page needs to refresh after a post changes. */
export interface PostPaths {
  slug: string;
  /** Whether readers could see the post before this change. */
  wasPublished: boolean;
  destinationPaths: string[];
  districtIds: string[];
  /** The author's account, whose traveler page lists the post. Null for team posts. */
  authorId: string | null;
}

/** How many of the author's posts are in each status. */
export async function countAuthorPosts(userId: string): Promise<Record<BlogPostStatus, number>> {
  const rows = await prisma.blogPost.groupBy({
    by: ["status"],
    where: { authorId: userId },
    _count: { _all: true },
  });
  const counts: Record<BlogPostStatus, number> = { draft: 0, pending: 0, published: 0, rejected: 0 };
  for (const row of rows) counts[row.status] = row._count._all;
  return counts;
}

export async function getAuthorPosts(userId: string): Promise<AuthorPostSummary[]> {
  const rows = await prisma.blogPost.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, status: true, updatedAt: true, reviewNote: true },
  });
  return rows.map((r) => ({
    ...r,
    updatedAt: r.updatedAt.toISOString(),
    reviewNote: r.reviewNote ?? undefined,
  }));
}

/** The author's own post, shaped for the writing form, or null if it isn't theirs. */
export async function getAuthorPost(
  id: string,
  userId: string,
): Promise<{
  id: string;
  status: BlogPostStatus;
  reviewNote?: string;
  input: BlogPostInput;
} | null> {
  const r = await prisma.blogPost.findFirst({
    where: { id, authorId: userId },
    include: {
      sections: { orderBy: { position: "asc" } },
      destinations: { orderBy: { position: "asc" }, select: { destinationId: true } },
      tags: { select: { tagName: true } },
    },
  });
  if (!r) return null;
  return {
    id: r.id,
    status: r.status,
    reviewNote: r.reviewNote ?? undefined,
    input: {
      title: r.title,
      excerpt: r.excerpt,
      authorName: r.authorName,
      cover:
        r.coverPublicId && r.coverUrl
          ? { publicId: r.coverPublicId, url: r.coverUrl }
          : undefined,
      coverCredit: r.coverCredit ?? undefined,
      sections: r.sections.map((s) => ({
        heading: s.heading ?? undefined,
        body: s.body,
        image:
          s.imagePublicId && s.imageUrl
            ? { publicId: s.imagePublicId, url: s.imageUrl }
            : undefined,
        imageCaption: s.imageCaption ?? undefined,
      })),
      destinationIds: r.destinations.map((d) => d.destinationId),
      tags: r.tags.map((t) => t.tagName as InterestTag),
    },
  };
}

/** Columns and child rows for a validated post. Districts follow from its places. */
async function postData(input: BlogPostInput, status: BlogPostStatus) {
  const places = await prisma.destination.findMany({
    where: { id: { in: input.destinationIds } },
    select: { id: true, districtId: true },
  });
  const known = new Set(places.map((p) => p.id));
  const destinationIds = input.destinationIds.filter((id) => known.has(id));
  return {
    title: input.title,
    excerpt: input.excerpt,
    authorName: input.authorName,
    status,
    coverPublicId: input.cover?.publicId ?? null,
    coverUrl: input.cover?.url ?? null,
    coverCredit: input.coverCredit ?? null,
    sections: {
      create: input.sections.map((s, position) => ({
        position,
        heading: s.heading ?? null,
        body: s.body,
        imagePublicId: s.image?.publicId ?? null,
        imageUrl: s.image?.url ?? null,
        imageCaption: s.imageCaption ?? null,
      })),
    },
    destinations: {
      create: destinationIds.map((destinationId, position) => ({ destinationId, position })),
    },
    districts: {
      create: [...new Set(places.map((p) => p.districtId))].map((districtId) => ({ districtId })),
    },
    tags: { create: input.tags.map((tagName) => ({ tagName })) },
  };
}

export async function createAuthorPost(
  userId: string,
  input: BlogPostInput,
  status: BlogPostStatus,
): Promise<{ id: string }> {
  const data = await postData(input, status);
  const { id } = await prisma.blogPost.create({
    data: { ...data, slug: makeSlug(input.title), authorId: userId },
    select: { id: true },
  });
  return { id };
}

async function currentPaths(id: string, userId: string): Promise<PostPaths | null> {
  const r = await prisma.blogPost.findFirst({
    where: { id, authorId: userId },
    select: {
      slug: true,
      status: true,
      authorId: true,
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
    authorId: r.authorId,
  };
}

/**
 * Replaces the post's content wholesale. Editing a published post takes it
 * off the site until it is reviewed again, so travelers can't swap approved
 * text for something else.
 */
export async function updateAuthorPost(
  id: string,
  userId: string,
  input: BlogPostInput,
  status: BlogPostStatus,
): Promise<PostPaths | null> {
  const paths = await currentPaths(id, userId);
  if (!paths) return null;
  const data = await postData(input, status);
  const reset = { deleteMany: {} };
  await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      sections: { ...reset, ...data.sections },
      destinations: { ...reset, ...data.destinations },
      districts: { ...reset, ...data.districts },
      tags: { ...reset, ...data.tags },
    },
  });
  return paths;
}

export async function deleteAuthorPost(id: string, userId: string): Promise<PostPaths | null> {
  const paths = await currentPaths(id, userId);
  if (!paths) return null;
  await prisma.blogPost.delete({ where: { id } });
  return paths;
}
