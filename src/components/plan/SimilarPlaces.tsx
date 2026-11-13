import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import type { SimilarPlace } from "@/lib/recommend";
import { SuggestionCard, distanceNote, type SuggestionNote } from "./SuggestionCard";

function notesFor({ place, shared, km }: SimilarPlace): SuggestionNote[] {
  const notes: SuggestionNote[] = shared.slice(0, 3).map((tag) => ({ text: tag, accent: true }));
  if (km !== null) notes.push({ text: distanceNote(km) });
  if (place.hiddenGem) notes.push({ text: "Hidden gem" });
  return notes;
}

/** "Places like this" on a destination page, ranked by `similarPlaces`. */
export function SimilarPlaces({ places }: { places: SimilarPlace[] }) {
  if (places.length === 0) return null;

  return (
    <section className="mx-auto mt-28 max-w-6xl">
      <div className="flex items-end justify-between border-b border-line pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Trip planner</p>
          <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">Places like this</h2>
        </div>
        <Link
          href="/plan"
          className="text-xs uppercase tracking-[0.18em] text-muted hover:text-accent-ink"
        >
          Plan a trip →
        </Link>
      </div>
      <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((similar, index) => (
          <Reveal key={similar.place.id} delay={index * 0.06}>
            <SuggestionCard place={similar.place} notes={notesFor(similar)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
