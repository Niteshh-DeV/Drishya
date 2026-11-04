import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { districts, getDistrict } from "@/data/districts";
import { DistrictMapLoader } from "@/components/district-map/DistrictMapLoader";
import {
  getDestinationsForDistrict,
  getMappableDestinations,
} from "@/lib/db/destinations";

export const revalidate = 3600;

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
  if (!district) {
    return {
      title: "District not found",
      description: "The district you are looking for is not available.",
    };
  }

  const canonicalUrl = `/districts/${district.slug}`;

  return {
    title: `${district.name} Travel Guide`,
    description: `${district.blurb} Explore destinations, hidden gems, and practical travel information for ${district.name} in Sudurpaschim Province.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${district.name} Travel Guide`,
      description: district.blurb,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${district.name} Travel Guide`,
      description: district.blurb,
    },
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const district = getDistrict(slug);
  if (!district) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://drishya.vercel.app";

  const [destinations, mappableDestinations] = await Promise.all([
    getDestinationsForDistrict(district.id),
    getMappableDestinations(district.id),
  ]);
  const hiddenGemCount = destinations.filter(
    (destination) => destination.hiddenGem,
  ).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${district.name} District Guide`,
    description: district.blurb,
    url: new URL(`/districts/${district.slug}`, siteUrl).toString(),
    touristType: "Destination discovery",
    provider: {
      "@type": "Organization",
      name: "Drishya",
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Sudurpaschim Province",
      addressCountry: "NP",
    },
    itinerary: destinations.slice(0, 10).map((destination) => ({
      "@type": "TouristTrip",
      name: destination.name,
      description: destination.shortDescription,
      url: new URL(`/districts/${district.slug}/${destination.slug}`, siteUrl).toString(),
    })),
  };
  const jsonLdScript = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <main className="min-h-screen bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript }}
      />
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+3rem)] sm:px-10 lg:px-16">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent-ink"
        >
          ← Back to map
        </Link>

        <section className="mx-auto mt-12 max-w-6xl">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Explore the region</p>
              <h2 className="font-display mt-2 text-3xl text-ink sm:text-4xl">A living map of {district.name}</h2>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-muted sm:block">
              {mappableDestinations.length} mapped places
            </span>
          </div>
        <DistrictMapLoader
          district={district}
          destinations={mappableDestinations}
        />
        </section>

        <header className="mx-auto mt-28 max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            {district.tagline}
          </p>
          <h1 className="font-display mt-5 text-[clamp(4rem,13vw,10rem)] font-medium uppercase leading-[0.82] tracking-[0.06em] text-ink">
            {district.name}
          </h1>
          <div className="mx-auto mt-12 h-20 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {district.blurb}
          </p>
        </header>

        <dl className="mx-auto mt-16 grid max-w-5xl border-y border-line sm:grid-cols-3">
          <div className="border-b border-line px-5 py-5 text-center sm:border-b-0 sm:border-r">
            <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">Area</dt>
            <dd className="font-display mt-2 text-2xl text-ink">
              {district.areaSqKm.toLocaleString()} km²
            </dd>
          </div>
          <div className="border-b border-line px-5 py-5 text-center sm:border-b-0 sm:border-r">
            <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">Center</dt>
            <dd className="mt-2 text-sm uppercase tracking-[0.12em] text-ink">
              {district.center[0].toFixed(3)}, {district.center[1].toFixed(3)}
            </dd>
          </div>
          <div className="px-5 py-5 text-center">
            <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">District code</dt>
            <dd className="mt-2 text-sm uppercase tracking-[0.12em] text-ink">{district.pcode}</dd>
          </div>
        </dl>

      <section className="mx-auto mt-20 grid max-w-6xl border-y border-line sm:grid-cols-3">
        {[
          ["Destinations", destinations.length],
          ["Hidden gems", hiddenGemCount],
          ["Mapped on map", mappableDestinations.length],
        ].map(([label, count]) => (
          <div key={label} className="border-b border-line px-5 py-6 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              {label}
            </h2>
            <p className="font-display mt-2 text-4xl text-ink">
              {count}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-28 max-w-6xl">
        <div className="flex items-end justify-between border-b border-line pb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Places to go</p>
            <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">Destinations</h2>
          </div>
          <span className="text-xs uppercase tracking-[0.18em] text-muted">{destinations.length} places</span>
        </div>
        {destinations.length === 0 ? (
          <p className="mt-8 border-b border-line pb-8 text-sm text-muted">
            Content coming soon for {district.name}.
          </p>
        ) : (
          <div className="grid gap-x-12 md:grid-cols-2">
            {destinations.map((destination, index) => (
              <Link
                key={destination.id}
                href={`/districts/${district.slug}/${destination.slug}`}
                className="group border-b border-line py-8 transition-colors hover:border-accent-ink"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl text-accent-ink">0{index + 1}</span>
                  {destination.hiddenGem && (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-accent-ink">Hidden gem</span>
                  )}
                </div>
                <h3 className="font-display mt-4 text-3xl text-ink transition-colors group-hover:text-accent-ink">
                  {destination.name}
                </h3>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {destination.category.map((category) => (
                    <span key={category} className="text-[10px] uppercase tracking-[0.16em] text-muted">
                      {category}
                    </span>
                  ))}
                </div>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{destination.shortDescription}</p>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-accent-ink">
                  Explore place · {destination.budget} →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
      </div>
    </main>
  );
}
