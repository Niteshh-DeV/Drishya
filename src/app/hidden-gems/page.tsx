import type { Metadata } from "next";
import { GemIndex, type Gem } from "@/components/hidden-gems/GemIndex";
import { getHiddenGems } from "@/lib/db/destinations";
import { coverImageUrl } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hidden Gems",
  description:
    "Lesser-known temples, lakes, waterfalls and meadows across Sudurpaschim — places most visitors to Nepal never hear about.",
  alternates: { canonical: "/hidden-gems" },
};

export default async function HiddenGemsPage() {
  const destinations = await getHiddenGems();
  const gems: Gem[] = destinations.map((d) => ({
    id: d.id,
    slug: d.slug,
    districtId: d.districtId,
    name: d.name,
    shortDescription: d.shortDescription,
    reason: d.hiddenGemReason,
    coverUrl: coverImageUrl(d),
    categories: d.category,
  }));

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            Off the usual route
          </p>
          <h1 className="font-display mt-5 text-[clamp(3.25rem,10vw,8rem)] font-medium uppercase leading-[0.85] tracking-[0.06em] text-ink">
            Hidden Gems
          </h1>
          <div className="mx-auto mt-10 h-16 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Temples, caves, lakes and high meadows across Sudurpaschim that
            see few visitors from outside the province — from the limestone
            cave of Patal Bhumeshwar in Baitadi to Budhinanda Tal in Bajura.
          </p>
        </header>

        {gems.length === 0 ? (
          <p className="mx-auto mt-20 max-w-xl border-y border-line py-10 text-center text-sm text-muted">
            No hidden gems are published yet.
          </p>
        ) : (
          <GemIndex gems={gems} />
        )}
      </div>
    </main>
  );
}
