import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { PlacesInStory } from "@/components/blog/PlacesInStory";
import { PostBody } from "@/components/blog/PostBody";
import {
  AuthorAvatar,
  Byline,
  RelatedStories,
  formatPostDate,
  postCoverName,
  storyLabel,
} from "@/components/blog/PostCard";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ShareButton } from "@/components/blog/ShareButton";
import { RevealTitle } from "@/components/site/RevealTitle";
import { getDistrict } from "@/data/districts";
import { getAllPostParams, getMoreStories, getPost } from "@/lib/db/blog";
import { cloudinaryUrl, shareImageUrl } from "@/lib/images";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// Posts approved after the build render on their first visit, then cache.
export function generateStaticParams() {
  return getAllPostParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Story not found" };

  const canonicalUrl = `/blog/${post.slug}`;
  const images = post.coverUrl
    ? [{ url: shareImageUrl(post.coverUrl), width: 1200, height: 630, alt: post.title }]
    : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.publishedAt,
      authors: [post.authorName],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const more = await getMoreStories(post.id);
  const districtNames = post.districtIds.map((id) => getDistrict(id)?.name).filter(Boolean);
  const url = new URL(`/blog/${post.slug}`, SITE_URL).toString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: post.publishedAt,
    image: post.coverUrl ? [cloudinaryUrl(post.coverUrl, 1200)] : undefined,
    author: post.byTeam
      ? { "@type": "Organization", name: "Drishya" }
      : {
          "@type": "Person",
          name: post.authorName,
          url: post.authorId ? new URL(`/travelers/${post.authorId}`, SITE_URL).toString() : undefined,
        },
    publisher: { "@type": "Organization", name: "Drishya" },
    keywords: post.tags.join(", ") || undefined,
    about: post.destinations.map((place) => ({
      "@type": "TouristAttraction",
      name: place.name,
      url: new URL(`/districts/${place.districtId}/${place.slug}`, SITE_URL).toString(),
    })),
  };

  return (
    <main className="min-h-screen bg-paper pb-24 text-ink">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article>
        <header className="mx-auto max-w-4xl px-5 pt-[calc(var(--header-h)+4rem)] text-center">
          <Link
            href="/blog"
            className="link-draw pb-0.5 text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent-ink"
          >
            ← Field notes
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            {[storyLabel(post), districtNames.join(" · ")].filter(Boolean).join(" — ")}
          </p>
          <RevealTitle
            text={post.title}
            className="font-display mt-5 text-[clamp(2.75rem,7vw,6rem)] font-medium leading-[0.98] tracking-tight text-ink text-balance break-words"
          />
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {post.excerpt}
          </p>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-4 border-y border-line py-5">
            <Byline post={post} link />
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
              {formatPostDate(post.publishedAt)} · {post.readingMinutes} min read
            </p>
            <ShareButton title={post.title} />
          </div>
        </header>

        {post.coverUrl && (
          <figure className="mt-16">
            <div className="overflow-hidden">
              <ViewTransition name={postCoverName(post.id)} share="morph" default="none">
                <img
                  src={cloudinaryUrl(post.coverUrl, 2200)}
                  alt=""
                  decoding="async"
                  className="ken-burns h-[min(75vh,52rem)] w-full object-cover"
                />
              </ViewTransition>
            </div>
            {post.coverCredit && (
              <figcaption className="mx-auto mt-3 max-w-6xl px-5 text-right text-[10px] uppercase tracking-[0.16em] text-muted">
                {post.coverCredit}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mx-auto mt-20 max-w-2xl px-5">
          <PostBody sections={post.sections} />

          {post.tags.length > 0 && (
            <ul className="mt-16 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {post.authorId && (
            <aside className="mt-16 flex gap-5 border-t border-line pt-8">
              <AuthorAvatar post={post} size="h-14 w-14 text-xl" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Written by</p>
                <p className="font-display mt-1 text-2xl text-ink">{post.authorName}</p>
                {post.authorBio && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{post.authorBio}</p>
                )}
                <Link
                  href={`/travelers/${post.authorId}`}
                  className="link-draw mt-4 inline-block pb-0.5 text-xs uppercase tracking-[0.18em] text-accent-ink"
                >
                  More from {post.authorName} →
                </Link>
              </div>
            </aside>
          )}

          <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-muted">
            {post.byTeam
              ? "Practical details here come from our destination pages; check them again before you travel."
              : "Traveler stories share personal experiences. Check fees, opening hours and road conditions on the destination pages before you go."}
          </p>
        </div>

        <div className="px-5 sm:px-10 lg:px-16">
          <PlacesInStory places={post.destinations} />
          <RelatedStories posts={more} title="More stories" />
        </div>
      </article>
    </main>
  );
}
