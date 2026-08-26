import Link from "next/link";

const POSTS = [
  {
    slug: "western-ridge-route",
    category: "Trail",
    title: "Western Ridge Route",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis volutpat augue quam mauris nisl.",
  },
  {
    slug: "khaptad-weekend-notes",
    category: "Field Notes",
    title: "Khaptad Weekend Notes",
    excerpt:
      "Sed laoreet duis commodo mi vulputate. In gravida gravida cursus fermentum varius.",
  },
  {
    slug: "mahakali-border-story",
    category: "Culture",
    title: "Mahakali Border Story",
    excerpt:
      "Pellentesque id pretium feugiat quis ornare. Morbi at volutpat in suspendisse dui diam.",
  },
] as const;

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          Blog shell
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Stories from Sudurpaschim
        </h1>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <article key={post.slug} className="glass glass-card rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {post.category}
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-ink">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink transition-colors hover:text-brass-light"
            >
              Read placeholder
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
