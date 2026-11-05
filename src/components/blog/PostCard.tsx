import Link from "next/link";
import { getDistrict } from "@/data/districts";
import { cloudinaryUrl } from "@/lib/images";
import type { BlogPostSummary } from "@/lib/types";

/** "4 Nov 2026", fixed to Nepal time so server and browser agree. */
export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kathmandu",
  }).format(new Date(iso));
}

export function postMeta(post: BlogPostSummary): string {
  const districts = post.districtIds
    .map((id) => getDistrict(id)?.name)
    .filter(Boolean);
  return [
    districts.join(", "),
    formatPostDate(post.publishedAt),
    `${post.readingMinutes} min read`,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Traveler stories are personal accounts; team posts are labelled as ours. */
export function storyLabel(post: Pick<BlogPostSummary, "byTeam">): string {
  return post.byTeam ? "From the Drishya team" : "Traveler story";
}

/** Short label beside a name, where the full one would repeat "Drishya team". */
function bylineLabel(post: Pick<BlogPostSummary, "byTeam">): string {
  return post.byTeam ? "Editorial" : "Traveler story";
}

/** Profile photo, or an initial on brass when there isn't one. */
export function AuthorAvatar({
  post,
  size = "h-9 w-9",
}: {
  post: Pick<BlogPostSummary, "authorName" | "authorImage">;
  size?: string;
}) {
  if (post.authorImage) {
    return (
      // Google avatars refuse hotlinking when a referrer is sent.
      <img
        src={post.authorImage}
        alt=""
        referrerPolicy="no-referrer"
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`${size} font-display grid shrink-0 place-items-center rounded-full bg-brass text-base font-semibold text-forest-deep`}
    >
      {post.authorName.charAt(0).toUpperCase()}
    </span>
  );
}

/** Avatar, name and label, e.g. under a post title. */
export function Byline({ post }: { post: BlogPostSummary }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <AuthorAvatar post={post} />
      <div className="leading-tight">
        <p className="text-sm font-medium text-ink">{post.authorName}</p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-accent-ink">
          {bylineLabel(post)}
        </p>
      </div>
    </div>
  );
}

/**
 * A story in a grid: photo, meta line, title, summary. Editorial rather
 * than boxed, to match the destination lists on district pages.
 */
export function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block border-t border-line pt-5">
      {post.coverUrl && (
        <div className="mb-5 overflow-hidden">
          <img
            src={cloudinaryUrl(post.coverUrl, 900)}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{postMeta(post)}</p>
      <h3 className="font-display mt-3 text-[1.75rem] leading-[1.1] text-ink transition-colors group-hover:text-accent-ink">
        {post.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      <div className="mt-5 flex items-center gap-2.5">
        <AuthorAvatar post={post} size="h-6 w-6 text-xs" />
        <span className="text-xs text-ink">{post.authorName}</span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-accent-ink">
          · {bylineLabel(post)}
        </span>
      </div>
    </Link>
  );
}

/**
 * "Stories from here" strip for district and destination pages. Renders
 * nothing when no published post mentions the place.
 */
export function RelatedStories({
  posts,
  placeName,
  title,
}: {
  posts: BlogPostSummary[];
  placeName?: string;
  title?: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto mt-28 max-w-6xl">
      <div className="flex items-end justify-between border-b border-line pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Field notes</p>
          <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">
            {title ?? `Stories from ${placeName}`}
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-xs uppercase tracking-[0.18em] text-muted hover:text-accent-ink"
        >
          All stories →
        </Link>
      </div>
      <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
