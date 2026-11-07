import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/components/blog/PostCard";
import { GuidePortrait } from "@/components/guides/GuideCard";
import { getDistrict } from "@/data/districts";
import { requireAdmin } from "@/lib/admin";
import { getListedGuides, getPendingGuides, type ReviewGuide } from "@/lib/db/guide-review";
import { approve, reject } from "./actions";

export const metadata: Metadata = {
  title: "Review guides",
  robots: { index: false },
};

const noteField =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent-ink";

function GuideDetails({ guide }: { guide: ReviewGuide }) {
  const rows: [string, string | undefined][] = [
    ["Account", guide.account],
    ["Districts", guide.districtIds.map((id) => getDistrict(id)?.name).join(", ")],
    [
      "Places",
      guide.places.length
        ? guide.places.map((p) => `${p.name} (${getDistrict(p.districtId)?.name})`).join(", ")
        : "None",
    ],
    ["Languages", guide.languages.join(", ")],
    ["Good for", guide.specialties.join(", ") || undefined],
    ["Guiding since", guide.guidingSince ? String(guide.guidingSince) : undefined],
    ["Phone", guide.phone && `${guide.phone}${guide.whatsapp ? " (WhatsApp)" : ""}`],
    ["Email", guide.contactEmail],
    ["Licence no.", guide.licenceNo],
  ];
  return (
    <dl className="mt-4 grid gap-x-6 gap-y-1 text-xs text-muted sm:grid-cols-2">
      {rows
        .filter((row): row is [string, string] => Boolean(row[1]))
        .map(([label, value]) => (
          <div key={label}>
            <dt className="inline">{label}: </dt>
            <dd className="inline text-ink">{value}</dd>
          </div>
        ))}
    </dl>
  );
}

function Preview({ guide }: { guide: ReviewGuide }) {
  return (
    <details className="mt-5 overflow-hidden rounded-2xl border border-line">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink hover:text-accent-ink">
        Read the full profile
      </summary>
      <div className="space-y-6 border-t border-line px-4 py-6 text-sm leading-relaxed text-ink sm:px-8">
        <p className="whitespace-pre-line">{guide.about || "No “about” text yet."}</p>
        {guide.rates && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Rates</p>
            <p className="mt-1 whitespace-pre-line">{guide.rates}</p>
          </div>
        )}
      </div>
    </details>
  );
}

export default async function ReviewGuidesPage() {
  // Non-admins get a plain 404 rather than a hint that the page exists.
  if (!(await requireAdmin())) notFound();

  const [pending, listed] = await Promise.all([getPendingGuides(), getListedGuides()]);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">Admin</p>
      <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        Review guides
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Before approving, call or message the guide on the number they gave, and check the
        licence number if there is one. Listed places should be ones they actually lead
        trips to, and nothing should read like an advert for someone else.
      </p>
      <p className="mt-2 text-xs text-muted">
        Stories have their own queue:{" "}
        <Link href="/admin/posts" className="link-draw text-ink">
          Review stories
        </Link>
      </p>

      <section className="mt-12">
        <h2 className="font-display border-b border-line pb-3 text-3xl text-ink">
          Waiting for review <span className="text-muted">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Nothing to review right now.</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {pending.map((guide) => (
              <li key={guide.id} className="glass-card rounded-3xl p-5 sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Submitted {formatPostDate(guide.updatedAt)}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <GuidePortrait guide={guide} size="h-14 w-14" />
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl font-semibold text-ink">{guide.name}</h3>
                    <p className="text-sm leading-relaxed text-muted">{guide.headline}</p>
                  </div>
                </div>
                <GuideDetails guide={guide} />
                <Preview guide={guide} />

                <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                  <form action={approve}>
                    <input type="hidden" name="id" value={guide.id} />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                    >
                      Approve &amp; list
                    </button>
                  </form>
                  <form action={reject} className="space-y-2">
                    <input type="hidden" name="id" value={guide.id} />
                    <textarea
                      name="note"
                      required
                      maxLength={500}
                      rows={2}
                      placeholder="What needs changing — the guide sees this note."
                      className={noteField}
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
                    >
                      Send back to guide
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display border-b border-line pb-3 text-3xl text-ink">
          Listed <span className="text-muted">({listed.length})</span>
        </h2>
        {listed.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No guides listed yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {listed.map((guide) => (
              <li key={guide.id} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={`/guide-connect/${guide.id}`}
                    className="font-display text-xl text-ink hover:text-accent-ink"
                  >
                    {guide.name}
                  </Link>
                  <span className="text-xs text-muted">
                    {guide.districtIds.map((id) => getDistrict(id)?.name).join(", ")}
                    {guide.publishedAt && ` · listed ${formatPostDate(guide.publishedAt)}`}
                  </span>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-muted hover:text-accent-ink">
                    Take down
                  </summary>
                  <form action={reject} className="mt-3 space-y-2">
                    <input type="hidden" name="id" value={guide.id} />
                    <textarea
                      name="note"
                      required
                      maxLength={500}
                      rows={2}
                      placeholder="Why the listing is coming down — the guide sees this note."
                      className={noteField}
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
                    >
                      Unlist
                    </button>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
