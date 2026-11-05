import Link from "next/link";
import type { ReactNode } from "react";

const TIPS: { title: string; body: string }[] = [
  {
    title: "Write what you saw",
    body: "The road, the weather, who you met, what you ate. Small details — the jeep ride into Martadi, your first view of the Api range — make a story worth reading.",
  },
  {
    title: "Don't guess the facts",
    body: "Leave out fees, opening hours and phone numbers you aren't sure of. Readers check those on the destination pages, which our team keeps up to date.",
  },
  {
    title: "Break it into sections",
    body: "One section per day, stop or idea works well. Give each a short heading and, if you have one, a photo.",
  },
  {
    title: "Use your own photos",
    body: "Upload pictures you took. If a photo is someone else's, credit them in the caption or the cover credit.",
  },
  {
    title: "Respect people and places",
    body: "Ask before photographing people up close, and take care with temples and festivals that are sacred to the communities who keep them.",
  },
];

function Tips() {
  return (
    <ol className="space-y-5">
      {TIPS.map((tip, index) => (
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

/** Shared frame for the new-story and edit pages: editor plus writing tips. */
export function WriteLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <Link
        href="/blog/mine"
        className="text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent-ink"
      >
        ← My stories
      </Link>
      <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {intro && <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{intro}</p>}

      <details className="mt-8 rounded-2xl border border-line px-5 py-4 lg:hidden">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Tips for a good story
        </summary>
        <div className="mt-5">
          <Tips />
        </div>
      </details>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">{children}</div>
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Tips for a good story
            </p>
            <div className="mt-5">
              <Tips />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
