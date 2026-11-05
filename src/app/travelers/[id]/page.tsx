import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import { Reveal } from "@/components/site/Reveal";
import { RevealTitle } from "@/components/site/RevealTitle";
import { districts } from "@/data/districts";
import { getTravelerParams, getTravelerProfile } from "@/lib/db/travelers";

export const revalidate = 3600;

// Travelers whose first story is approved after a build render on their
// first visit, then cache like the rest.
export function generateStaticParams() {
  return getTravelerParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const traveler = await getTravelerProfile(id);
  if (!traveler) return { title: "Traveler not found" };
  return {
    title: `${traveler.name} — traveler stories`,
    description:
      traveler.bio ?? `Stories from Nepal's Sudurpaschim Province, written by ${traveler.name}.`,
    alternates: { canonical: `/travelers/${traveler.id}` },
  };
}

function joinedLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kathmandu",
  }).format(new Date(iso));
}

export default async function TravelerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const traveler = await getTravelerProfile(id);
  if (!traveler) notFound();

  // The districts their stories cover, in the map's order.
  const covered = districts.filter((d) =>
    traveler.posts.some((post) => post.districtIds.includes(d.id)),
  );

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <header className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {traveler.image ? (
            // Google avatars refuse hotlinking when a referrer is sent.
            <img
              src={traveler.image}
              alt=""
              referrerPolicy="no-referrer"
              className="h-28 w-28 rounded-full object-cover ring-1 ring-brass/60 ring-offset-4 ring-offset-paper"
            />
          ) : (
            <span className="font-display grid h-28 w-28 place-items-center rounded-full bg-brass text-5xl text-forest-deep ring-1 ring-brass/60 ring-offset-4 ring-offset-paper">
              {traveler.name.charAt(0).toUpperCase()}
            </span>
          )}
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            Traveler · Writing since {joinedLabel(traveler.joinedAt)}
          </p>
          <RevealTitle
            text={traveler.name}
            className="font-display mt-4 text-balance text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.92] text-ink"
          />
          {traveler.bio && (
            <p className="mx-auto mt-7 max-w-2xl whitespace-pre-line text-base leading-relaxed text-muted sm:text-lg">
              {traveler.bio}
            </p>
          )}
        </header>

        <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 border-y border-line">
          <div className="border-r border-line px-5 py-6 text-center">
            <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">Stories</dt>
            <dd className="font-display mt-2 text-4xl text-ink">{traveler.posts.length}</dd>
          </div>
          <div className="px-5 py-6 text-center">
            <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">Districts</dt>
            <dd className="font-display mt-2 text-4xl text-ink">{covered.length}</dd>
          </div>
        </dl>
        {covered.length > 0 && (
          <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            {covered.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/districts/${d.slug}`}
                  className="block border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-accent-ink hover:text-accent-ink"
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <section className="mx-auto mt-24 max-w-6xl">
          <div className="border-b border-line pb-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Field notes</p>
            <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">
              Stories by {traveler.name}
            </h2>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {traveler.posts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 0.06}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
          <p className="mt-16 max-w-2xl border-t border-line pt-6 text-xs leading-relaxed text-muted">
            Traveler stories share personal experiences. Check fees, opening hours and
            road conditions on the destination pages before you go.
          </p>
        </section>
      </div>
    </main>
  );
}
