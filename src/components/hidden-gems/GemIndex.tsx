"use client";

import Link from "next/link";
import { useMemo, useState, ViewTransition } from "react";
import { Reveal } from "@/components/site/Reveal";
import { districts } from "@/data/districts";
import { cloudinaryUrl } from "@/lib/images";
import { destinationHref, placeCoverName } from "@/lib/site";

/** What a hidden-gem card shows — kept slim so long descriptions stay on the server. */
export interface Gem {
  id: string;
  slug: string;
  districtId: string;
  name: string;
  shortDescription: string;
  reason?: string;
  coverUrl?: string;
  categories: string[];
}

/**
 * Hidden gems as an editorial photo grid with district chips. Filtering
 * happens in the browser over the prerendered list.
 */
export function GemIndex({ gems }: { gems: Gem[] }) {
  const [district, setDistrict] = useState<string | null>(null);

  const options = useMemo(
    () =>
      districts
        .map((d) => ({ ...d, count: gems.filter((g) => g.districtId === d.id).length }))
        .filter((d) => d.count > 0),
    [gems],
  );
  const shown = district ? gems.filter((g) => g.districtId === district) : gems;

  return (
    <section className="mx-auto mt-20 max-w-6xl">
      <div className="flex flex-col gap-5 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {shown.length} {shown.length === 1 ? "place" : "places"}
          {district && ` in ${districts.find((d) => d.id === district)?.name}`}
        </p>
        <div role="group" aria-label="Filter by district" className="flex flex-wrap gap-2">
          {[{ id: null, name: "All", count: gems.length }, ...options].map((d) => {
            const on = district === d.id;
            return (
              <button
                key={d.id ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setDistrict(d.id)}
                className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  on ? "border-ink bg-ink text-paper" : "border-line text-muted hover:text-ink"
                }`}
              >
                {d.name} <span className={on ? "text-paper/70" : "text-muted/70"}>{d.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((gem, index) => (
          <Reveal key={gem.id} delay={(index % 3) * 0.06}>
            <Link href={destinationHref(gem)} className="group block">
              <div className="card-media">
                {gem.coverUrl ? (
                  <ViewTransition name={placeCoverName(gem.id)} share="morph" default="none">
                    <img
                      src={cloudinaryUrl(gem.coverUrl, 900)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </ViewTransition>
                ) : (
                  // No photo yet: a quiet panel with the name, never a stock image.
                  <div className="font-display grid aspect-[4/3] w-full place-items-center border border-line bg-stone/15 px-6 text-center text-2xl text-muted">
                    {gem.name}
                  </div>
                )}
              </div>
              <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-muted">
                {[districts.find((d) => d.id === gem.districtId)?.name, gem.categories[0]]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <h2 className="font-display mt-2 text-[1.75rem] leading-[1.1] text-ink transition-colors group-hover:text-accent-ink">
                {gem.name}
              </h2>
              {gem.reason && (
                <p className="font-display mt-3 border-l-2 border-brass pl-3 text-lg italic leading-snug text-accent-ink">
                  {gem.reason}
                </p>
              )}
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                {gem.shortDescription}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-accent-ink">
                Explore place <span aria-hidden className="card-arrow">→</span>
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
