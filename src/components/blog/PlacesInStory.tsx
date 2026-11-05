"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { getDistrict } from "@/data/districts";
import { cloudinaryUrl } from "@/lib/images";
import { destinationHref } from "@/lib/site";
import type { BlogPlaceLink } from "@/lib/types";

// Leaflet touches `window`, so the map only loads in the browser.
const StoryMap = dynamic(() => import("./StoryMap").then((mod) => mod.StoryMap), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-2xl border border-line bg-stone/30 sm:h-96" />,
});

/** Linked cards for the places a story mentions, and a map of the ones with coordinates. */
export function PlacesInStory({ places }: { places: BlogPlaceLink[] }) {
  if (places.length === 0) return null;

  const mapped = places.flatMap((p) =>
    p.position ? [{ id: p.id, name: p.name, href: destinationHref(p), position: p.position }] : [],
  );

  return (
    <section className="mx-auto mt-28 max-w-5xl">
      <div className="border-b border-line pb-5">
        <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Go there yourself</p>
        <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">Places in this story</h2>
      </div>

      {mapped.length > 0 && (
        <div className="mt-8">
          <StoryMap places={mapped} />
        </div>
      )}

      <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {places.map((place) => (
          <li key={place.id}>
            <Link href={destinationHref(place)} className="group flex gap-5">
              {place.coverUrl ? (
                <img
                  src={cloudinaryUrl(place.coverUrl, 320)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-24 w-24 shrink-0 object-cover"
                />
              ) : (
                <span aria-hidden className="h-24 w-24 shrink-0 border border-line bg-stone/20" />
              )}
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                  {getDistrict(place.districtId)?.name}
                </p>
                <p className="font-display mt-1 text-2xl leading-tight text-ink transition-colors group-hover:text-accent-ink">
                  {place.name}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                  {place.shortDescription}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
