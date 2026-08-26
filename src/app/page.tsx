import Link from "next/link";
import { HeroMap } from "@/components/hero-map/HeroMap";
import { Reveal } from "@/components/site/Reveal";
import { districts } from "@/data/districts";

export default function Home() {
  return (
    <main id="top">
      {/*
       * Full-bleed pinned hero: one screen tall, scroll flies the camera from
       * the province overview through all nine districts. Its own section owns
       * the scroll distance, so nothing here needs a max-width.
       */}
      <HeroMap />

      {/* Text/grid fallback — works without JS, helps SEO, and lists everything. */}
      <section
        id="all-districts"
        className="mx-auto max-w-6xl px-4 py-20 sm:py-28"
      >
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-ink">
                All districts
              </h2>
              <p className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Nine ways in
              </p>
            </div>
            <span className="hidden shrink-0 text-sm text-muted sm:block">
              {districts.length} districts ·{" "}
              {districts
                .reduce((sum, d) => sum + d.areaSqKm, 0)
                .toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
              km²
            </span>
          </div>
        </Reveal>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d, i) => (
            <li key={d.slug}>
              <Reveal delay={(i % 3) * 0.07}>
                <Link
                  href={`/districts/${d.slug}`}
                  className="glass glass-card group block h-full rounded-2xl p-5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-2xl font-semibold text-ink transition-colors group-hover:text-accent-ink">
                      {d.name}
                    </span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted">
                      {d.areaSqKm.toLocaleString()} km²
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-accent-ink">
                    {d.tagline}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    {d.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-accent-ink">
                    Explore
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
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
