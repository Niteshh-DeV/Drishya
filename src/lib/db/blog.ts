/**
 * Blog data access. Like `destinations.ts`, pages import only from here and
 * get back plain serializable objects. Every reader-facing query is limited
 * to `published` posts, so drafts and posts waiting for review can never
 * leak onto the public site through a page that forgot to filter.
 */
import { cache } from "react";
import { prisma } from "./prisma";
import type {
  BlogPost,
  BlogPostSummary,
  InterestTag,
} from "@/lib/types";
import type { Prisma } from "@/generated/prisma/client";

const published = {
  status: "published",
  publishedAt: { not: null },
} satisfies Prisma.BlogPostWhereInput;

const newestFirst = { publishedAt: "desc" } satisfies Prisma.BlogPostOrderByWithRelationInput;

const summarySelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverUrl: true,
  coverCredit: true,
  authorName: true,
  authorId: true,
  author: { select: { image: true } },
  publishedAt: true,
  // Bodies only, for the reading-time estimate on cards.
  sections: { select: { body: true } },
  districts: { select: { districtId: true } },
  tags: { select: { tagName: true } },
} satisfies Prisma.BlogPostSelect;

const postInclude = {
  author: { select: { image: true } },
  sections: { orderBy: { position: "asc" } },
  districts: { select: { districtId: true } },
  tags: { select: { tagName: true } },
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
} satisfies Prisma.BlogPostInclude;

/** ~200 words a minute, never less than one. */
function readingMinutes(sections: { body: string }[]): number {
  const words = sections
    .map((section) => section.body.trim().split(/\s+/).filter(Boolean).length)
    .reduce((sum, count) => sum + count, 0);
  return Math.max(1, Math.round(words / 200));
}

type SummaryRow = Prisma.BlogPostGetPayload<{ select: typeof summarySelect }>;

function toSummary(r: SummaryRow): BlogPostSummary {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    coverUrl: r.coverUrl ?? undefined,
    coverCredit: r.coverCredit ?? undefined,
    authorName: r.authorName,
    authorImage: r.author?.image ?? undefined,
    byTeam: r.authorId == null,
    // The `published` filter guarantees a publish date.
    publishedAt: r.publishedAt!.toISOString(),
    readingMinutes: readingMinutes(r.sections),
    districtIds: r.districts.map((d) => d.districtId),
    tags: r.tags.map((t) => t.tagName as InterestTag),
  };
}

type PostRow = Prisma.BlogPostGetPayload<{ include: typeof postInclude }>;

function toPost(r: PostRow): BlogPost {
  return {
    ...toSummary(r),
    sections: r.sections.map((section) => ({
      id: section.id,
      heading: section.heading ?? undefined,
      body: section.body,
      imageUrl: section.imageUrl ?? undefined,
      imageCaption: section.imageCaption ?? undefined,
    })),
    destinations: r.destinations.map(({ destination: d }) => ({
      id: d.id,
      slug: d.slug,
      districtId: d.districtId,
      name: d.name,
      shortDescription: d.shortDescription,
      position: d.lat != null && d.lon != null ? [d.lat, d.lon] : null,
      coverUrl: d.images[0]?.secureUrl,
    })),
  };
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const rows = await prisma.blogPost.findMany({
    where: published,
    orderBy: newestFirst,
    select: summarySelect,
  });
  return rows.map(toSummary);
}

/** Cached per request: `generateMetadata` and the page body share one query. */
export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const row = await prisma.blogPost.findFirst({
    where: { slug, ...published },
    include: postInclude,
  });
  return row ? toPost(row) : null;
});

export async function getAllPostParams(): Promise<{ slug: string }[]> {
  return prisma.blogPost.findMany({ where: published, select: { slug: true } });
}

/** Published posts that mention a destination, for its "Stories from here" block. */
export async function getPostsForDestination(
  destinationId: string,
): Promise<BlogPostSummary[]> {
  const rows = await prisma.blogPost.findMany({
    where: { ...published, destinations: { some: { destinationId } } },
    orderBy: newestFirst,
    take: 3,
    select: summarySelect,
  });
  return rows.map(toSummary);
}

/**
 * Published posts about a district — tagged with it directly, or about any
 * destination inside it.
 */
export async function getPostsForDistrict(
  districtId: string,
): Promise<BlogPostSummary[]> {
  const rows = await prisma.blogPost.findMany({
    where: {
      ...published,
      OR: [
        { districts: { some: { districtId } } },
        { destinations: { some: { destination: { districtId } } } },
      ],
    },
    orderBy: newestFirst,
    take: 3,
    select: summarySelect,
  });
  return rows.map(toSummary);
}

/** Newest published posts other than `excludeId`, for "More stories". */
export async function getMoreStories(
  excludeId: string,
  take = 3,
): Promise<BlogPostSummary[]> {
  const rows = await prisma.blogPost.findMany({
    where: { ...published, id: { not: excludeId } },
    orderBy: newestFirst,
    take,
    select: summarySelect,
  });
  return rows.map(toSummary);
}

/** Slugs and dates for the sitemap. */
export async function getPostSitemapEntries(): Promise<{ slug: string; updatedAt: Date }[]> {
  return prisma.blogPost.findMany({
    where: published,
    select: { slug: true, updatedAt: true },
  });
}
