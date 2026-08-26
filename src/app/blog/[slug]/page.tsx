import type { Metadata } from "next";

const CONTENT_SECTIONS = [
  "Introduction",
  "Route Context",
  "Local Voices",
  "Practical Notes",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");

  return {
    title: `${title} — Drishya Blog`,
    description: "Placeholder blog detail layout for future CMS or Prisma data.",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-[calc(var(--header-h)+2rem)] lg:grid-cols-[minmax(0,1fr)_280px]">
      <article className="glass rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          Blog detail shell
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {slug.replaceAll("-", " ")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae tempus
          tristique in id at vitae risus, sit vel. Nulla facilisi arcu ac
          condimentum sem viverra.
        </p>

        <div className="mt-8 space-y-6">
          {CONTENT_SECTIONS.map((section) => (
            <section key={section}>
              <h2 className="font-display text-2xl font-semibold text-ink">{section}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                pharetra varius commodo iaculis lectus egestas est. Aenean
                volutpat feugiat sem, quis posuere neque rhoncus in.
              </p>
            </section>
          ))}
        </div>
      </article>

      <aside className="space-y-4">
        <div className="glass rounded-3xl p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Related posts
          </h2>
          <div className="mt-3 space-y-3">
            {["Placeholder post one", "Placeholder post two", "Placeholder post three"].map(
              (item) => (
                <p key={item} className="rounded-xl border border-line/50 bg-paper/40 p-3 text-sm">
                  {item}
                </p>
              ),
            )}
          </div>
        </div>
      </aside>
    </main>
  );
}
