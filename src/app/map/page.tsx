import type { Metadata } from "next";
import { RegionMapLoader } from "@/components/region-map/RegionMapLoader";
import { getMapPlaces } from "@/lib/db/destinations";

export const metadata: Metadata = {
  title: "Map",
  description: "Explore mapped destinations across Sudurpaschim Province.",
};

export const revalidate = 3600;

export default async function MapPage() {
  const places = await getMapPlaces();

  return (
    <main className="min-h-screen bg-paper px-4 pb-20 pt-[calc(var(--header-h)+3rem)] text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-ink">
            Sudurpaschim Province
          </p>
          <h1 className="font-display mt-3 text-5xl font-medium tracking-tight sm:text-7xl">
            Every place, together.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Explore all mapped destinations across the region. Hidden gems use
            brass pins; select any pin to read a short description and open its
            full place page.
          </p>
        </header>
        <RegionMapLoader places={places} />
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">
          {places.length} mapped destinations
        </p>
      </div>
    </main>
  );
}
