import Link from "next/link";
import { HeroMap } from "@/components/hero-map/HeroMap";
import { districts } from "@/data/districts";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Sudurpaschim Province · Nepal
        </p>
        <h1 className="font-display mt-3 text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
          Explore Drishya
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          Nine districts of Nepal&apos;s far west, one at a time. Pick a district
          along the bottom to frame it, trace its landmarks, then dive in for
          maps, guides, stays and hidden gems.
        </p>
      </section>

      <div className="mt-10">
        <HeroMap />
      </div>

      {/* Text/grid fallback — works without JS, helps SEO, and lists everything. */}
      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          All districts
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {districts.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/districts/${d.slug}`}
                className="group block rounded-xl border border-line bg-white/50 p-4 transition-colors hover:border-brand hover:bg-white"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-ink group-hover:text-brand">
                    {d.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {d.areaSqKm.toLocaleString()} km²
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink/60">{d.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
