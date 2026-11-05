/**
 * Public traveler pages. A traveler only has a public page once a story of
 * theirs is published, and it shows what they chose to share — name, photo,
 * bio and published stories — never their email or unpublished work.
 */
import { cache } from "react";
import { prisma } from "./prisma";
import { getPublishedPostsByAuthor } from "./blog";
import type { TravelerProfile } from "@/lib/types";

const hasPublishedStory = {
  blogPosts: { some: { status: "published", publishedAt: { not: null } } },
} as const;

/** Cached per request: `generateMetadata` and the page share one query. */
export const getTravelerProfile = cache(async (id: string): Promise<TravelerProfile | null> => {
  const user = await prisma.user.findFirst({
    where: { id, ...hasPublishedStory },
    select: { id: true, name: true, image: true, bio: true, createdAt: true },
  });
  if (!user) return null;
  const posts = await getPublishedPostsByAuthor(user.id);
  return {
    id: user.id,
    // Fall back to the byline of their latest story if the account has no name.
    name: user.name ?? posts[0]?.authorName ?? "Traveler",
    image: user.image ?? undefined,
    bio: user.bio ?? undefined,
    joinedAt: user.createdAt.toISOString(),
    posts,
  };
});

/** Every traveler with a published story, for prerendering and the sitemap. */
export async function getTravelerParams(): Promise<{ id: string }[]> {
  return prisma.user.findMany({ where: hasPublishedStory, select: { id: true } });
}
