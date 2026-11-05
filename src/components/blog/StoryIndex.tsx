"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { districts } from "@/data/districts";
import { cloudinaryUrl } from "@/lib/images";
import type { BlogPostSummary } from "@/lib/types";
import { Byline, PostCard, postMeta } from "./PostCard";

/**
 * The blog index body: the newest story as a full-width feature, then the
 * rest in a grid. District chips filter in the browser, so the page itself
 * stays prerendered.
 */
export function StoryIndex({ posts }: { posts: BlogPostSummary[] }) {
  const [district, setDistrict] = useState<string | null>(null);

  // Only districts that actually have stories, in the map's order.
  const options = useMemo(
    () => districts.filter((d) => posts.some((p) => p.districtIds.includes(d.id))),
    [posts],
  );
  const [featured, ...rest] = posts;
  const shown = district ? posts.filter((p) => p.districtIds.includes(district)) : rest;

  return (
    <>
      {!district && featured && (
        <Reveal className="mt-20">
          <Link href={`/blog/${featured.slug}`} className="group block">
            {featured.coverUrl && (
              <div className="mx-[calc(50%-50vw)] overflow-hidden">
                <img
                  src={cloudinaryUrl(featured.coverUrl, 2000)}
                  alt=""
                  decoding="async"
                  className="h-[min(68vh,44rem)] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
            )}
            <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-accent-ink">
                  Latest · {postMeta(featured)}
                </p>
                <h2 className="font-display mt-4 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-ink transition-colors group-hover:text-accent-ink">
                  {featured.title}
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-muted">{featured.excerpt}</p>
                <div className="flex items-center justify-between gap-4">
                  <Byline post={featured} />
                  <span className="text-xs uppercase tracking-[0.18em] text-accent-ink">
                    Read story →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      )}

      {(options.length > 1 || rest.length > 0) && (
        <section className="mx-auto mt-28 max-w-6xl">
          <div className="flex flex-col gap-5 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Across the province</p>
              <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">
                {district ? `Stories from ${districts.find((d) => d.id === district)?.name}` : "More stories"}
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

          {shown.length === 0 ? (
            <p className="mt-10 text-sm text-muted">No other stories yet — check back soon.</p>
          ) : (
            <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 0.06}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
