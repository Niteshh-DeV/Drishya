"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

/** Nav entries. `soon` renders as a quiet, non-interactive dock item. */
const ITEMS = [
  { label: "Map", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Guide", href: "/guide-connect" },
  { label: "Assistant", soon: true },
] as const;

function closeMobileMenu(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

/**
 * The site nav as a macOS dock: a floating forest pill that hovers over the
 * page instead of sitting on it. `fixed` + `pointer-events-none` on the rail
 * means the hero map stays hoverable everywhere the pill isn't.
 *
 * The pill spans the page (up to `max-w-4xl`) rather than hugging its content,
 * with the mark and the nav pushed to opposite ends — a content-width pill read
 * as a stray chip floating over the map. On a phone the navigation collapses
 * into a compact dropdown so the pill stays light and uncluttered.
 *
 * Sizing lives in --dock-* / --header-h (globals.css); pages read --header-h to
 * keep their first row clear of the pill.
 */
export function Header() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[var(--dock-top)] z-50 flex justify-center px-3 sm:px-4">
      <header className="dock pointer-events-auto flex h-[var(--dock-h)] w-full max-w-4xl items-center justify-between rounded-full pl-3 pr-1.5 sm:pl-5 sm:pr-3">
        <Logo href="/#top" />

        <div className="flex items-center gap-0.5">
          <nav className="hidden items-center gap-1.5 text-sm sm:flex">
            {ITEMS.map((item) =>
              "href" in item ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="dock-item rounded-full px-4 py-1.5 font-medium text-dock-text outline-none hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  title="Coming soon"
                  className="cursor-default rounded-full px-4 py-1.5 text-stone/55"
                >
                  {item.label}
                </span>
              ),
            )}
          </nav>
          <details className="group relative sm:hidden">
            <summary
              aria-label="Open navigation menu"
              className="dock-item flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full text-sm font-medium text-dock-text outline-none marker:hidden hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60 [&::-webkit-details-marker]:hidden"
            >
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              >
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            </summary>
            <nav className="dock absolute right-0 top-full z-10 mt-2 min-w-44 rounded-2xl p-1.5 text-sm shadow-xl">
              {ITEMS.map((item) =>
                "href" in item ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block rounded-xl px-4 py-2.5 font-medium text-dock-text outline-none hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    key={item.label}
                    title="Coming soon"
                    onClick={closeMobileMenu}
                    className="block rounded-xl px-4 py-2.5 text-stone/55"
                  >
                    {item.label}
                  </span>
                ),
              )}
            </nav>
          </details>
          <ThemeToggle />
        </div>
      </header>
    </div>
  );
}
