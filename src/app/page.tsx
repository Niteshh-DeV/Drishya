import Link from "next/link";
import { HeroMap } from "@/components/hero-map/HeroMap";
import { Reveal } from "@/components/site/Reveal";
import { districts } from "@/data/districts";
import { getMapPlaces } from "@/lib/db/destinations";

export const revalidate = 3600;

export default async function Home() {
  const places = await getMapPlaces();

  return (
    <main id="top">
      {/*
       * Full-bleed pinned hero: one screen tall, scroll flies the camera from
       * the province overview through all nine districts. Its own section owns
       * the scroll distance, so nothing here needs a max-width.
       */}
      <HeroMap places={places} />

      {/* Text/grid fallback — works without JS, helps SEO, and lists everything. */}
      <section
        id="all-districts"
        className="mx-auto max-w-360 px-5 py-24 sm:px-10 sm:py-36 lg:px-16"
      >
        <Reveal>
          <div className="flex flex-col gap-8 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-ink">
                All districts
              </h2>
              <p className="font-display mt-5 text-[clamp(3.5rem,8vw,7rem)] font-medium leading-[0.82] tracking-[0.03em] text-ink">
                Nine ways in
              </p>
            </div>
            <span className="text-xs uppercase tracking-[0.18em] text-muted sm:pb-1">
              {districts.length} districts ·{" "}
              {districts
                .reduce((sum, d) => sum + d.areaSqKm, 0)
                .toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
              km²
            </span>
          </div>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d, i) => (
            <li key={d.slug}>
              <Reveal delay={(i % 3) * 0.07}>
                <Link
                  href={`/districts/${d.slug}`}
                  className="group block h-full border-b border-line py-8 transition-colors hover:border-accent-ink"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-xl text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
                      {d.areaSqKm.toLocaleString()} km²
                    </span>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-2">
                    <span className="font-display text-3xl text-ink transition-colors group-hover:text-accent-ink sm:text-4xl">
                      {d.name}
                    </span>
                  </div>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-ink">
                    {d.tagline}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {d.blurb}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted transition-colors group-hover:text-accent-ink">
                    Explore
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-2"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
