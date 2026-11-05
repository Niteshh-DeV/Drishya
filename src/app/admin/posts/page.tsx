import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/blog/PostBody";
import { formatPostDate } from "@/components/blog/PostCard";
import { getDistrict } from "@/data/districts";
import { requireAdmin } from "@/lib/admin";
import { getLivePosts, getPendingPosts, type ReviewPost } from "@/lib/db/blog-review";
import { cloudinaryUrl } from "@/lib/images";
import { approve, reject } from "./actions";

export const metadata: Metadata = {
  title: "Review stories",
  robots: { index: false },
};

const noteField =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent-ink";

function PostMeta({ post }: { post: ReviewPost }) {
  return (
    <dl className="mt-3 grid gap-x-6 gap-y-1 text-xs text-muted sm:grid-cols-2">
      <div>
        <dt className="inline">Byline: </dt>
        <dd className="inline text-ink">{post.authorName}</dd>
      </div>
      {post.authorAccount && (
        <div>
          <dt className="inline">Account: </dt>
          <dd className="inline text-ink">{post.authorAccount}</dd>
        </div>
      )}
      <div>
        <dt className="inline">Places: </dt>
        <dd className="inline text-ink">
          {post.places.length
            ? post.places.map((p) => `${p.name} (${getDistrict(p.districtId)?.name})`).join(", ")
            : "None"}
        </dd>
      </div>
      {post.tags.length > 0 && (
        <div>
          <dt className="inline">Interests: </dt>
          <dd className="inline text-ink">{post.tags.join(", ")}</dd>
        </div>
      )}
    </dl>
  );
}

function Preview({ post }: { post: ReviewPost }) {
  return (
    <details className="mt-5 overflow-hidden rounded-2xl border border-line">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink hover:text-accent-ink">
        Read the full story
      </summary>
      <div className="border-t border-line px-4 py-6 sm:px-8">
        {post.coverUrl && (
          <figure className="mb-10">
            <img
              src={cloudinaryUrl(post.coverUrl, 1200)}
              alt=""
              className="max-h-96 w-full rounded-2xl object-cover"
            />
            {post.coverCredit && (
              <figcaption className="mt-2 text-right text-xs text-muted">{post.coverCredit}</figcaption>
            )}
          </figure>
        )}
        <PostBody sections={post.sections} />
      </div>
    </details>
  );
}

export default async function ReviewPostsPage() {
  // Non-admins get a plain 404 rather than a hint that the page exists.
  if (!(await requireAdmin())) notFound();

  const [pending, live] = await Promise.all([getPendingPosts(), getLivePosts()]);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">Admin</p>
      <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        Review stories
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Check each story against the destination pages before approving: no
        invented fees, opening hours or phone numbers, and nothing that reads
        like an advert.
      </p>

      <section className="mt-12">
        <h2 className="font-display border-b border-line pb-3 text-3xl text-ink">
          Waiting for review <span className="text-muted">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Nothing to review right now.</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {pending.map((post) => (
              <li key={post.id} className="glass-card rounded-3xl p-5 sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Submitted {formatPostDate(post.updatedAt)}
                </p>
                <h3 className="font-display mt-2 text-2xl font-semibold text-ink">{post.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                <PostMeta post={post} />
                <Preview post={post} />

                <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                  <form action={approve}>
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                    >
                      Approve &amp; publish
                    </button>
                  </form>
                  <form action={reject} className="space-y-2">
                    <input type="hidden" name="id" value={post.id} />
                    <textarea
                      name="note"
                      required
                      maxLength={500}
                      rows={2}
                      placeholder="Why it isn't ready — the author sees this note."
                      className={noteField}
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
                    >
                      Send back to author
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display border-b border-line pb-3 text-3xl text-ink">
          Published <span className="text-muted">({live.length})</span>
        </h2>
        {live.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No published stories yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {live.map((post) => (
              <li key={post.id} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-display text-xl text-ink hover:text-accent-ink"
                  >
                    {post.title}
                  </Link>
                  <span className="text-xs text-muted">
                    {post.authorName}
                    {post.publishedAt && ` · ${formatPostDate(post.publishedAt)}`}
                  </span>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-muted hover:text-accent-ink">
                    Take down
                  </summary>
                  <form action={reject} className="mt-3 space-y-2">
                    <input type="hidden" name="id" value={post.id} />
                    <textarea
                      name="note"
                      required
                      maxLength={500}
                      rows={2}
                      placeholder="Why it's coming down — the author sees this note."
                      className={noteField}
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
                    >
                      Unpublish
                    </button>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
