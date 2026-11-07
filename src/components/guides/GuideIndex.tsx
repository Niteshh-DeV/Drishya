"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { districts } from "@/data/districts";
import type { GuideSummary } from "@/lib/types";
import { GuideCard } from "./GuideCard";

/**
 * The guide directory. District chips filter in the browser, so the page
 * itself stays prerendered.
 */
export function GuideIndex({ guides }: { guides: GuideSummary[] }) {
  const [district, setDistrict] = useState<string | null>(null);

  // Only districts that have a guide, in the map's order.
  const options = useMemo(
    () => districts.filter((d) => guides.some((g) => g.districtIds.includes(d.id))),
    [guides],
  );
  const shown = district ? guides.filter((g) => g.districtIds.includes(district)) : guides;
  const districtName = districts.find((d) => d.id === district)?.name;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted">
            {guides.length} {guides.length === 1 ? "guide" : "guides"} listed
          </p>
          <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">
            {districtName ? `Guides in ${districtName}` : "Find a guide"}
          </h2>
        </div>
        {options.length > 1 && (
          <div role="group" aria-label="Filter by district" className="flex flex-wrap gap-2">
            {[{ id: null, name: "All" }, ...options].map((d) => {
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
                  {d.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((guide, index) => (
          <Reveal key={guide.id} delay={(index % 3) * 0.06}>
            <GuideCard guide={guide} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
