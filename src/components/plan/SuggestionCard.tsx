import Link from "next/link";
import { ViewTransition } from "react";
import { getDistrict } from "@/data/districts";
import { cloudinaryUrl } from "@/lib/images";
import { destinationHref, placeCoverName } from "@/lib/site";
import type { RecommendPlace } from "@/lib/types";

/** One reason a place was suggested; `accent` marks the ones that matched. */
export interface SuggestionNote {
  text: string;
  accent?: boolean;
}

/** "About 45 km away" — straight-line, rounded so it doesn't read as a road distance. */
export function distanceNote(km: number, from?: string): string {
  return `About ${Math.max(5, Math.round(km / 5) * 5)} km ${from ? `from ${from}` : "away"}`;
}

/**
 * A suggested place: its photo, name and the reasons it came up. Shared by
 * the trip planner's results and "Places like this" on destination pages.
 */
export function SuggestionCard({
  place,
  notes,
  rank,
}: {
  place: RecommendPlace;
  notes: SuggestionNote[];
  /** Position in the planner's list, shown as "01". */
  rank?: number;
}) {
  const meta = [getDistrict(place.districtId)?.name, place.category].filter(Boolean).join(" · ");

  return (
    <Link href={destinationHref(place)} className="group block">
      <div className="card-media">
        {place.coverUrl ? (
          <ViewTransition name={placeCoverName(place.id)} share="morph" default="none">
            <img
              src={cloudinaryUrl(place.coverUrl, 800)}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </ViewTransition>
        ) : (
          // No photo yet: a quiet panel with the name, never a stock image.
          <div className="font-display grid aspect-[4/3] w-full place-items-center border border-line bg-stone/15 px-6 text-center text-2xl text-muted">
            {place.name}
          </div>
        )}
      </div>
      <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-muted">
        {rank !== undefined && (
          <span className="text-accent-ink">{String(rank).padStart(2, "0")} · </span>
        )}
        {meta}
      </p>
      <h3 className="font-display mt-2 text-[1.6rem] leading-[1.1] text-ink transition-colors group-hover:text-accent-ink">
        {place.name}
      </h3>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{place.shortDescription}</p>
      {notes.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {notes.map((note) => (
            <li
              key={note.text}
              className={`border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${
                note.accent ? "border-brass/50 text-accent-ink" : "border-line text-muted"
              }`}
            >
              {note.text}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
