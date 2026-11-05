import type { Metadata } from "next";
import { RegionMapLoader } from "@/components/region-map/RegionMapLoader";
import { RevealTitle } from "@/components/site/RevealTitle";
import { getMapPlaces } from "@/lib/db/destinations";

export const metadata: Metadata = {
  title: "Map",
  description:
    "Every mapped destination across Sudurpaschim's nine districts on one map — from Ghodaghodi Lake in Kailali to Badimalika in Bajura.",
  alternates: { canonical: "/map" },
};

export const revalidate = 3600;

export default async function MapPage() {
  const places = await getMapPlaces();
  const gems = places.filter((p) => p.hiddenGem).length;
  const districtsCovered = new Set(places.map((p) => p.districtId)).size;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            Sudurpaschim Province
          </p>
          <RevealTitle
            text="Every Place, Together"
            className="font-display mt-5 text-balance text-[clamp(3rem,8.5vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[0.05em] text-ink"
          />
          <div className="mx-auto mt-10 h-16 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Every destination we&apos;ve mapped, from Ghodaghodi Lake in Kailali to
            Badimalika in Bajura. Choose a district to fly there; brass pins mark
            the hidden gems.
          </p>
        </header>

        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-3 border-y border-line">
          {[
            ["On the map", places.length],
            ["Hidden gems", gems],
            ["Districts", `${districtsCovered} of 9`],
          ].map(([label, value], index) => (
            <div key={label} className={`px-4 py-6 text-center ${index < 2 ? "border-r border-line" : ""}`}>
              <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">{label}</dt>
              <dd className="font-display mt-2 text-3xl text-ink sm:text-4xl">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-16">
          <RegionMapLoader places={places} />
          <p className="mt-5 text-center text-xs leading-relaxed text-muted">
            Places without confirmed coordinates aren&apos;t pinned yet; you&apos;ll
            find them on their district pages.
          </p>
        </section>
      </div>
    </main>
  );
}
