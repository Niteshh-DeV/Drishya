import Link from "next/link";
import type { Metadata } from "next";
import { StoryIndex } from "@/components/blog/StoryIndex";
import { Magnetic } from "@/components/site/Magnetic";
import { RevealTitle } from "@/components/site/RevealTitle";
import { getPublishedPosts } from "@/lib/db/blog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Field Notes — Traveler Stories",
  description:
    "First-hand stories from Sudurpaschim Province — pilgrim trails to Badimalika, boat rides on Ghodaghodi Lake, mornings in Khaptad, and villages from Kailali to Darchula.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            Stories from Sudurpaschim
          </p>
          <RevealTitle
            text="Field Notes"
            className="font-display mt-5 text-[clamp(3.5rem,11vw,8.5rem)] font-medium uppercase leading-[0.85] tracking-[0.06em] text-ink"
          />
          <div className="mx-auto mt-10 h-16 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Trails, festivals and quiet corners of the far west, written by the
            people who went there. Every story is read by our team before it
            is published.
          </p>
          <Magnetic className="mt-8 inline-block">
            <Link
              href="/blog/write"
              className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              Share your story
            </Link>
          </Magnetic>
        </header>

        {posts.length === 0 ? (
          <p className="mx-auto mt-20 max-w-xl border-y border-line py-10 text-center text-sm leading-relaxed text-muted">
            No stories are published yet. Been to Ramaroshan&apos;s lakes or up
            to Khaptad? Be the first to write one.
          </p>
        ) : (
          <StoryIndex posts={posts} />
        )}
      </div>
    </main>
  );
}
