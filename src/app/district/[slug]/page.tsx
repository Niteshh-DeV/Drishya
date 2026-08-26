import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { districts, getDistrict } from "@/data/districts";

const DISTRICT_SECTIONS = [
  {
    title: "History",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh cursus elementum faucibus nunc, tristique sem volutpat blandit. Mi sed feugiat ut posuere integer a sapien vitae.",
  },
  {
    title: "Culture",
    copy: "Suspendisse potenti. Neque laoreet diam ac non in lectus integer. Scelerisque blandit sed sem est, volutpat facilisis libero malesuada egestas.",
  },
  {
    title: "Safety",
    copy: "Praesent nibh tristique at orci. Volutpat congue cursus in dui, vulputate proin egestas at. Aenean et id sed diam vestibulum tristique sed.",
  },
  {
    title: "Stays & Food",
    copy: "Amet eu porttitor risus pretium nibh in. Ullamcorper tincidunt faucibus dui commodo massa ultricies id. Nunc enim scelerisque et ac risus.",
  },
  {
    title: "Hidden Gems",
    copy: "Habitasse dignissim donec auctor magna facilisis volutpat in. Egestas purus lacus mattis in suspendisse integer lectus mi sed consectetur.",
  },
] as const;

const PLACEHOLDER_CARDS = [
  "Section overview card",
  "Featured highlight card",
  "Local note card",
] as const;

export function generateStaticParams() {
  return districts.map((district) => ({ slug: district.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const district = getDistrict(slug);
  return {
    title: district ? `${district.name} Guide — Drishya` : "District Guide — Drishya",
    description:
      district?.blurb ??
      "Placeholder district shell for history, culture, safety, stays, food, and hidden gems.",
  };
}

export default async function DistrictShellPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const district = getDistrict(slug);
  if (!district) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <header className="glass rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          District shell
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {district.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
          Placeholder page structure for content wiring. Replace section text and
          cards with Prisma-backed records in Phase 5.
        </p>
      </header>

      <section className="mt-8 space-y-6">
        {DISTRICT_SECTIONS.map((section) => (
          <article key={section.title} className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="font-display text-3xl font-semibold text-ink">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              {section.copy}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PLACEHOLDER_CARDS.map((card) => (
                <div
                  key={`${section.title}-${card}`}
                  className="rounded-2xl border border-line/50 bg-paper/50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Placeholder
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-ink">{card}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
