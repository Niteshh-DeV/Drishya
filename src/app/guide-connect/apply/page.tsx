import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GuideForm } from "@/components/guides/GuideForm";
import { getAccountProfile } from "@/lib/db/users";
import { getDestinationOptions } from "@/lib/db/destinations";
import { getOwnGuideProfile } from "@/lib/db/guide-authoring";

export const metadata: Metadata = {
  title: "Your guide profile",
  robots: { index: false },
};

const GUIDELINES: { title: string; body: string }[] = [
  {
    title: "Be specific",
    body: "Name the routes and places you know — the trail up to Badimalika, the walk across Khaptad's patans — rather than “all of Sudurpaschim”.",
  },
  {
    title: "Only places you've led",
    body: "List destinations you've actually taken travelers to. You'll appear on those pages, and travelers will expect you to know them.",
  },
  {
    title: "Your own contact details",
    body: "Use a number or email you answer yourself. Agencies and hotels are welcome, but say so in your headline.",
  },
  {
    title: "Rates in your words",
    body: "If you share prices, say what's included — food, porters, permits. Drishya never handles payments.",
  },
];

function Guidelines() {
  return (
    <ol className="space-y-5">
      {GUIDELINES.map((tip, index) => (
        <li key={tip.title} className="flex gap-3">
          <span className="font-display text-lg leading-none text-accent-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{tip.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{tip.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default async function GuideApplyPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/guide-connect/apply");

  const userId = session.user.id;
  const [own, account, places] = await Promise.all([
    getOwnGuideProfile(userId),
    getAccountProfile(userId),
    getDestinationOptions(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <Link
        href="/guide-connect"
        className="text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent-ink"
      >
        ← Guide Connect
      </Link>
      <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        {own ? "Your guide profile" : "List yourself as a guide"}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Tell travelers where you work, the places you know and how to reach you. Our team
        reviews every profile before it appears on Guide Connect.
      </p>

      <details className="mt-8 rounded-2xl border border-line px-5 py-4 lg:hidden">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Before you start
        </summary>
        <div className="mt-5">
          <Guidelines />
        </div>
      </details>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          <GuideForm
            profileId={own?.id ?? null}
            status={own?.status}
            reviewNote={own?.reviewNote}
            places={places}
            account={{ name: account?.name, image: account?.image }}
            initial={
              own?.input ?? {
                headline: "",
                about: "",
                rates: "",
                phone: "",
                whatsapp: false,
                contactEmail: "",
                licenceNo: "",
                districtIds: [],
                destinationIds: [],
                specialties: [],
                languages: [],
              }
            }
          />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Before you start
            </p>
            <div className="mt-5">
              <Guidelines />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
