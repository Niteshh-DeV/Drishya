import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { districts, getDistrict } from "@/data/districts";
import { RelatedStories } from "@/components/blog/PostCard";
import { LocalGuides } from "@/components/guides/GuideCard";
import { RevealTitle } from "@/components/site/RevealTitle";
import { DistrictMapLoader } from "@/components/district-map/DistrictMapLoader";
import { getPostsForDistrict } from "@/lib/db/blog";
import { getGuidesForDistrict } from "@/lib/db/guides";
import {
  getDestinationsForDistrict,
  toMapPlaces,
} from "@/lib/db/destinations";
import { cloudinaryUrl, coverImageUrl, shareImageUrl } from "@/lib/images";
import { SITE_URL, placeCoverName } from "@/lib/site";
import { displayTitleSize } from "@/lib/typography";

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
  // The first photographed destination stands in for the district.
  const destinations = await getDestinationsForDistrict(district.id);
  const cover = destinations.map(coverImageUrl).find(Boolean);
  const images = cover
    ? [{ url: shareImageUrl(cover), width: 1200, height: 630, alt: district.name }]
    : undefined;

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
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${district.name} Travel Guide`,
      description: district.blurb,
      ...(images && { images }),
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

  const [destinations, stories, guides] = await Promise.all([
    getDestinationsForDistrict(district.id),
    getPostsForDistrict(district.id),
    getGuidesForDistrict(district.id),
  ]);
  const mapPlaces = toMapPlaces(destinations);
  const hiddenGemCount = destinations.filter(
    (destination) => destination.hiddenGem,
  ).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${district.name} District Guide`,
    description: district.blurb,
    url: new URL(`/districts/${district.slug}`, SITE_URL).toString(),
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
      url: new URL(`/districts/${district.slug}/${destination.slug}`, SITE_URL).toString(),
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
          className="link-draw pb-0.5 text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent-ink"
        >
          ← Back to map
        </Link>

        <header className="mx-auto mt-12 max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            {district.tagline}
          </p>
          <RevealTitle
            text={district.name}
            className="font-display mt-5 font-medium uppercase leading-[0.82] tracking-[0.06em] text-ink"
            style={{ fontSize: displayTitleSize(district.name, { maxRem: 10, containerRem: 64 }) }}
          />
          <div className="mx-auto mt-12 h-20 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {district.blurb}
          </p>
        </header>

        <dl className="mx-auto mt-16 grid max-w-5xl grid-cols-2 border-y border-line sm:grid-cols-4">
          {[
            ["Area", `${district.areaSqKm.toLocaleString()} km²`],
            ["Destinations", destinations.length],
            ["Hidden gems", hiddenGemCount],
            ["On the map", mapPlaces.length],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={`px-5 py-6 text-center ${index % 2 === 0 ? "border-r border-line" : ""} ${index < 2 ? "border-b border-line sm:border-b-0" : ""} sm:border-r sm:last:border-r-0`}
            >
              <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">{label}</dt>
              <dd className="font-display mt-2 text-3xl text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mx-auto mt-24 max-w-6xl">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Explore the region</p>
              <h2 className="font-display mt-2 text-3xl text-ink sm:text-4xl">A living map of {district.name}</h2>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-muted sm:block">
              {mapPlaces.length} mapped places
            </span>
          </div>
          <DistrictMapLoader district={district} places={mapPlaces} />
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
            {destinations.map((destination, index) => {
              const cover = coverImageUrl(destination);
              return (
                <Link
                  key={destination.id}
                  href={`/districts/${district.slug}/${destination.slug}`}
                  className="group flex gap-6 border-b border-line py-8 transition-colors hover:border-accent-ink"
                >
                  {cover ? (
                    <span className="card-media block h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                      {/* Flies up into the destination page's cover. */}
                      <ViewTransition name={placeCoverName(destination.id)} share="morph" default="none">
                        <img
                          src={cloudinaryUrl(cover, 360)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </ViewTransition>
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="font-display grid h-28 w-28 shrink-0 place-items-center border border-line text-2xl text-accent-ink sm:h-32 sm:w-32"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {destination.category.slice(0, 2).map((category) => (
                        <span key={category} className="text-[10px] uppercase tracking-[0.16em] text-muted">
                          {category}
                        </span>
                      ))}
                      {destination.hiddenGem && (
                        <span className="text-[10px] uppercase tracking-[0.18em] text-accent-ink">Hidden gem</span>
                      )}
                    </div>
                    <h3 className="font-display mt-2 text-[1.75rem] leading-tight text-ink transition-colors group-hover:text-accent-ink">
                      {destination.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                      {destination.shortDescription}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-accent-ink">
                      Explore place · {destination.budget} <span aria-hidden className="card-arrow">→</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <RelatedStories posts={stories} placeName={district.name} />
      <LocalGuides guides={guides} placeName={district.name} />
      </div>
    </main>
  );
}
