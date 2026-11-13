import type { Metadata } from "next";
import { Suspense } from "react";
import { TripPlanner, TripPlannerFallback } from "@/components/plan/TripPlanner";
import { RevealTitle } from "@/components/site/RevealTitle";
import { getRecommendPlaces } from "@/lib/db/destinations";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Plan a Trip",
  description:
    "Choose what draws you, when you're travelling, your budget and where you start, and get a shortlist of places across Sudurpaschim ranked for you.",
  alternates: { canonical: "/plan" },
};

export default async function PlanPage() {
  const places = await getRecommendPlaces();

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            Trip planner
          </p>
          <RevealTitle
            text="Plan a Trip"
            className="font-display mt-5 text-[clamp(3.25rem,10vw,8rem)] font-medium uppercase leading-[0.85] tracking-[0.06em] text-ink"
          />
          <div className="mx-auto mt-10 h-16 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Tell us what draws you, when you&apos;re going and where you&apos;ll start, and
            we&apos;ll rank the {places.length} places we&apos;ve written up so far — from the
            wetlands of Kailali to the high meadows of Khaptad.
          </p>
        </header>

        {/* The planner reads its answers from the URL, which isn't known
            while the page is prerendered. */}
        <Suspense fallback={<TripPlannerFallback />}>
          <TripPlanner places={places} />
        </Suspense>
      </div>
    </main>
  );
}
