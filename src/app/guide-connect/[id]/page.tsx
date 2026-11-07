import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ContactReveal } from "@/components/guides/ContactReveal";
import { GuidePortrait, guideDistrictNames } from "@/components/guides/GuideCard";
import { Reveal } from "@/components/site/Reveal";
import { RevealTitle } from "@/components/site/RevealTitle";
import { getDistrict } from "@/data/districts";
import { getGuide, getGuideParams } from "@/lib/db/guides";
import { cloudinaryUrl, shareImageUrl } from "@/lib/images";
import { destinationHref, placeCoverName } from "@/lib/site";

export const revalidate = 3600;

// Guides approved after a build render on their first visit, then cache
// like the rest.
export function generateStaticParams() {
  return getGuideParams();
}

const isCloudinary = (url?: string) => Boolean(url?.includes("res.cloudinary.com"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const guide = await getGuide(id);
  if (!guide) return { title: "Guide not found" };

  const title = `${guide.name} — local guide`;
  const description = guide.headline;
  // Only uploaded portraits make a decent preview; a 96px account avatar doesn't.
  const images =
    guide.image && isCloudinary(guide.image)
      ? [{ url: shareImageUrl(guide.image), width: 1200, height: 630, alt: guide.name }]
      : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/guide-connect/${guide.id}` },
    ...(images && {
      openGraph: { title, description, type: "profile", url: `/guide-connect/${guide.id}`, images },
      twitter: { card: "summary_large_image", title, description, images },
    }),
  };
}

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guide = await getGuide(id);
  if (!guide) notFound();

  const districtNames = guideDistrictNames(guide);
  const paragraphs = guide.about.split(/\n{2,}/).filter(Boolean);
  const stats: [string, string | number][] = [
    ...(guide.guidingSince ? ([["Guiding since", guide.guidingSince]] as [string, number][]) : []),
    ["Districts", guide.districtIds.length],
    ["Languages", guide.languages.length],
  ];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <header className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <GuidePortrait
            guide={guide}
            size="h-32 w-32"
            width={320}
            className="ring-1 ring-brass/60 ring-offset-4 ring-offset-paper"
          />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            Local guide · {districtNames.join(" · ")}
          </p>
          <RevealTitle
            text={guide.name}
            className="font-display mt-4 text-balance text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.92] text-ink"
          />
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {guide.headline}
          </p>
        </header>

        <dl
          className={`mx-auto mt-14 grid max-w-3xl border-y border-line ${stats.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
        >
          {stats.map(([label, value]) => (
            <div key={label} className="border-r border-line px-4 py-6 text-center last:border-r-0">
              <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">{label}</dt>
              <dd className="font-display mt-2 text-4xl text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mx-auto mt-24 grid max-w-6xl gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <section>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted">In their words</p>
              <h2 className="font-display mt-2 border-b border-line pb-4 text-4xl text-ink">
                About {guide.name.split(" ")[0]}
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-ink sm:text-lg">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {guide.rates && (
              <section className="mt-16">
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted">As the guide describes them</p>
                <h2 className="font-display mt-2 border-b border-line pb-4 text-3xl text-ink">Rates</h2>
                <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink">{guide.rates}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  Drishya doesn&apos;t set or check prices. Confirm what&apos;s included before you
                  agree.
                </p>
              </section>
            )}
          </div>

          <aside className="space-y-12 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <section className="glass-card rounded-3xl p-6 sm:p-7">
              <h2 className="font-display text-3xl text-ink">Get in touch</h2>
              <div className="mt-5">
                <ContactReveal guide={guide} />
              </div>
            </section>

            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">Works in</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {guide.districtIds.map((districtId) => {
                    const district = getDistrict(districtId);
                    if (!district) return null;
                    return (
                      <Link
                        key={districtId}
                        href={`/districts/${district.slug}`}
                        className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-accent-ink hover:text-accent-ink"
                      >
                        {district.name}
                      </Link>
                    );
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">Languages</dt>
                <dd className="mt-2 text-ink">{guide.languages.join(", ")}</dd>
              </div>
              {guide.specialties.length > 0 && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">Good for</dt>
                  <dd className="mt-2 text-ink">{guide.specialties.join(", ")}</dd>
                </div>
              )}
            </dl>
          </aside>
        </div>

        {guide.places.length > 0 && (
          <section className="mx-auto mt-28 max-w-6xl">
            <div className="border-b border-line pb-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Places they know</p>
              <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">
                Where {guide.name.split(" ")[0]} can take you
              </h2>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {guide.places.map((place, index) => (
                <Reveal key={place.id} delay={(index % 3) * 0.06}>
                  <Link href={destinationHref(place)} className="group block">
                    {place.coverUrl ? (
                      <div className="card-media aspect-[4/3]">
                        <ViewTransition name={placeCoverName(place.id)} share="morph" default="none">
                          <img
                            src={cloudinaryUrl(place.coverUrl, 800)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </ViewTransition>
                      </div>
                    ) : (
                      <div aria-hidden className="aspect-[4/3] border border-line bg-stone/20" />
                    )}
                    <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-accent-ink">
                      {getDistrict(place.districtId)?.name}
                    </p>
                    <h3 className="font-display mt-1 text-[1.75rem] leading-tight text-ink transition-colors group-hover:text-accent-ink">
                      {place.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                      {place.shortDescription}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <div className="mx-auto mt-24 flex max-w-6xl flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
          <Link
            href="/guide-connect"
            className="link-draw self-start pb-0.5 text-sm uppercase tracking-[0.2em] text-muted hover:text-accent-ink"
          >
            ← All guides
          </Link>
          <p className="max-w-xl text-xs leading-relaxed text-muted sm:text-right">
            Guides are reviewed by the Drishya team before they&apos;re listed, but
            Drishya doesn&apos;t employ them or handle bookings. Profiles are written by
            the guides themselves.
          </p>
        </div>
      </div>
    </main>
  );
}
