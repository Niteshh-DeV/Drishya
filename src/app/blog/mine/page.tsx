import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DeletePostButton } from "@/components/blog/DeletePostButton";
import { formatPostDate } from "@/components/blog/PostCard";
import { StatusBadge } from "@/components/blog/StatusBadge";
import { getAuthorPosts } from "@/lib/db/blog-authoring";

export const metadata: Metadata = {
  title: "My stories",
  robots: { index: false },
};

export default async function MyPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/blog/mine");

  const [posts, query] = await Promise.all([getAuthorPosts(session.user.id), searchParams]);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            Traveler stories
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            My stories
          </h1>
        </div>
        <Link
          href="/blog/write"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          Write a story
        </Link>
      </div>

      {query.submitted && (
        <p role="status" className="glass mt-8 rounded-2xl px-5 py-4 text-sm text-ink">
          Thanks! Your story was sent for review. It will appear on the blog once
          the team approves it.
        </p>
      )}

      {posts.length === 0 ? (
        <div className="mt-12 border-y border-line py-14 text-center">
          <p className="font-display text-3xl text-ink">Your first story starts here</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Visited Amargadhi Fort or spent a day boating on Ghodaghodi Lake?
            Write it up section by section — drafts save as you go, and
            nothing is public until our team approves it.
          </p>
          <Link
            href="/blog/write"
            className="mt-7 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            Write a story
          </Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-5">
              <StatusBadge status={post.status} />
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-xl text-ink">{post.title}</p>
                <p className="text-xs text-muted">Updated {formatPostDate(post.updatedAt)}</p>
                {post.status === "rejected" && post.reviewNote && (
                  <p className="mt-2 rounded-xl border border-line px-3 py-2 text-sm text-ink">
                    <span className="text-muted">Reviewer&apos;s note: </span>
                    {post.reviewNote}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                {post.status === "published" && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs uppercase tracking-[0.16em] text-muted hover:text-accent-ink"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/blog/write/${post.id}`}
                  className="text-xs uppercase tracking-[0.16em] text-accent-ink hover:underline"
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
