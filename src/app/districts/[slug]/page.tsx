import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { districts, getDistrict } from "@/data/districts";
import { poisForDistrict } from "@/data/sample-pois";
import { DistrictMapLoader } from "@/components/district-map/DistrictMapLoader";
import type { PoiCategory } from "@/lib/types";

const CATEGORY_HEADING: Record<PoiCategory, string> = {
  guide: "Guides",
  stay: "Stays",
  "hidden-gem": "Hidden gems",
};

// Prerender all nine district pages at build time.
export function generateStaticParams() {
  return districts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const district = getDistrict(slug);
  if (!district) return { title: "District not found — Drishya" };
  return { title: `${district.name} — Drishya`, description: district.blurb };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const district = getDistrict(slug);
  if (!district) notFound();

  const pois = poisForDistrict(district.id);
  const countFor = (cat: PoiCategory) =>
    pois.filter((p) => p.category === cat).length;

  return (
    // The dock floats, so pages pad themselves clear of it.
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+1.5rem)]">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-accent-ink"
      >
        ← Back to map
      </Link>

      <header className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          {district.tagline}
        </p>
        <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {district.name}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink/70">
          {district.blurb}
        </p>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-muted">Area</dt>
            <dd className="font-medium text-ink">
              {district.areaSqKm.toLocaleString()} km²
            </dd>
          </div>
          <div>
            <dt className="text-muted">Center</dt>
            <dd className="font-medium text-ink">
              {district.center[0].toFixed(3)}, {district.center[1].toFixed(3)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Code</dt>
            <dd className="font-medium text-ink">{district.pcode}</dd>
          </div>
        </dl>
      </header>

      <section className="mt-6">
        <DistrictMapLoader district={district} />
      </section>

      {/* Sample counts today; wired to real guide/stay/gem records in a later phase. */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {(Object.keys(CATEGORY_HEADING) as PoiCategory[]).map((cat) => (
          <div key={cat} className="glass glass-card rounded-2xl p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {CATEGORY_HEADING[cat]}
            </h2>
            <p className="font-display mt-1 text-3xl font-semibold text-ink">
              {countFor(cat)}
            </p>
            <p className="text-sm text-ink/60">sample marker(s) on the map</p>
          </div>
        ))}
      </section>

      <p className="glass mt-8 rounded-2xl p-5 text-sm text-ink/60">
        History, culture, safety and destination content for {district.name} will
        live here — added by the content team in a later phase.
      </p>
    </main>
  );
}
