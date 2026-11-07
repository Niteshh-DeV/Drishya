import type { Metadata } from "next";
import Link from "next/link";
import { GuideIndex } from "@/components/guides/GuideIndex";
import { Magnetic } from "@/components/site/Magnetic";
import { RevealTitle } from "@/components/site/RevealTitle";
import { getPublishedGuides } from "@/lib/db/guides";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guide Connect",
  description:
    "Find local guides across Sudurpaschim's nine districts — for the trails to Badimalika and Api Nampa, the meadows of Khaptad and the temples of the far west.",
  alternates: { canonical: "/guide-connect" },
};

/** How listing works. Keep this in step with the review flow in /admin/guides. */
const HOW_IT_WORKS = [
  {
    title: "Guides by district",
    body: "Find people who know the trails and temples of Bajhang, Darchula or Achham, listed under the districts they work in.",
  },
  {
    title: "Reviewed before listing",
    body: "Each guide signs in with their own account and is reviewed by our team before their profile goes live — the same way traveler stories are.",
  },
  {
    title: "Linked to the places they know",
    body: "Guide profiles connect to the destination pages, so you can go from Khaptad or Ramaroshan straight to someone who can take you there.",
  },
];

export default async function GuideConnectPage() {
  const guides = await getPublishedGuides();

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            Local guides
          </p>
          <RevealTitle
            text="Guide Connect"
            className="font-display mt-5 text-[clamp(3rem,9vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[0.06em] text-ink"
          />
          <div className="mx-auto mt-10 h-16 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Much of Sudurpaschim is best reached with someone local — the
            multi-day climbs to Badimalika, the meadows of Khaptad, villages
            where the road ends. Find guides who live and work there.
          </p>
        </header>

        <section className="mx-auto mt-20 grid max-w-5xl gap-10 border-y border-line py-12 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, index) => (
            <div key={item.title}>
              <span className="font-display text-2xl text-accent-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display mt-3 text-2xl text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </section>

        <div className="mt-24">
          {guides.length > 0 ? (
            <GuideIndex guides={guides} />
          ) : (
            <section className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl text-ink sm:text-4xl">The first guides are on their way</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
                Profiles appear here once our team has reviewed them. Until then, every
                destination page has how to get there, where to stay and safety notes.
              </p>
              <div className="mt-8 flex justify-center">
                <Magnetic>
                  <Link
                    href="/map"
                    className="inline-block rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
                  >
                    Explore the map
                  </Link>
                </Magnetic>
              </div>
            </section>
          )}
        </div>

        <section className="mx-auto mt-28 grid max-w-5xl gap-8 border-t border-line pt-12 sm:grid-cols-[1.4fr_1fr] sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted">For guides</p>
            <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">Do you guide in the far west?</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Sign in, tell travelers where you work and which places you know, and
              our team will review your profile. Your phone number is only shown to
              signed-in travelers.
            </p>
          </div>
          <div className="sm:justify-self-end">
            <Magnetic>
              <Link
                href="/guide-connect/apply"
                className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
              >
                List yourself as a guide
              </Link>
            </Magnetic>
          </div>
        </section>

        <p className="mx-auto mt-16 max-w-5xl text-xs leading-relaxed text-muted">
          Drishya lists guides but doesn&apos;t employ them or handle bookings and
          payments. Agree on the route, dates, price and what&apos;s included directly
          with your guide before you set out.
        </p>
      </div>
    </main>
  );
}
