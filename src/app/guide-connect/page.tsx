import type { Metadata } from "next";
import Link from "next/link";
import { Magnetic } from "@/components/site/Magnetic";
import { RevealTitle } from "@/components/site/RevealTitle";

export const metadata: Metadata = {
  title: "Guide Connect",
  description:
    "Local guides across Sudurpaschim's nine districts — coming soon to Drishya.",
  alternates: { canonical: "/guide-connect" },
};

/** What the feature will do. Keep this in step with what is actually planned. */
const PLANNED = [
  {
    title: "Guides by district",
    body: "Find people who know the trails and temples of Bajhang, Darchula or Achham, listed under the districts they work in.",
  },
  {
    title: "Profiles you can trust",
    body: "Each guide signs in with their own account and is reviewed by our team before their profile goes live — the same way traveler stories are.",
  },
  {
    title: "Linked to the places they know",
    body: "Guide profiles connect to the destination pages, so you can go from Khaptad or Ramaroshan straight to someone who can take you there.",
  },
];

export default function GuideConnectPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            Coming soon
          </p>
          <RevealTitle
            text="Guide Connect"
            className="font-display mt-5 text-[clamp(3rem,9vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[0.06em] text-ink"
          />
          <div className="mx-auto mt-10 h-16 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Much of Sudurpaschim is best reached with someone local — the
            multi-day climbs to Badimalika, the meadows of Khaptad, villages
            where the road ends. We&apos;re building a way to find them.
          </p>
        </header>

        <section className="mx-auto mt-20 grid max-w-5xl gap-10 border-y border-line py-12 sm:grid-cols-3">
          {PLANNED.map((item, index) => (
            <div key={item.title}>
              <span className="font-display text-2xl text-accent-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display mt-3 text-2xl text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-20 max-w-3xl text-center">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Planning a trip now?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Every destination page has how to get there, where to stay and
            safety notes, and travelers share their own routes in Field Notes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <Link
                href="/map"
                className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
              >
                Explore the map
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/blog"
                className="inline-block rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
              >
                Read Field Notes
              </Link>
            </Magnetic>
          </div>
        </section>
      </div>
    </main>
  );
}
