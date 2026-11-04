import Link from "next/link";
import { getDistrict } from "@/data/districts";
import { getAllDestinations } from "@/lib/db/destinations";

export const revalidate = 3600;

export default async function HiddenGemsPage() {
  const destinations = (await getAllDestinations()).filter(
    (destination) => destination.hiddenGem,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          Destination discovery
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Hidden gems across Sudurpaschim
        </h1>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted sm:col-span-2 lg:col-span-3">
            No hidden gems are published yet.
          </p>
        ) : (
          destinations.map((destination) => (
            <article key={destination.id} className="glass rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {getDistrict(destination.districtId)?.name ?? "Sudurpaschim"}
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-ink">
                {destination.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {destination.shortDescription}
              </p>
              {destination.hiddenGemReason && (
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {destination.hiddenGemReason}
                </p>
              )}
              <Link
                href={`/districts/${destination.districtId}/${destination.slug}`}
                className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink transition-colors hover:text-brass-light"
              >
                Explore place →
              </Link>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
