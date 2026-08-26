import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

/** Nav entries. `soon` renders as a quiet, non-interactive dock item. */
const ITEMS = [
  { label: "Map", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Guide", href: "/guide-connect" },
  { label: "Assistant", soon: true },
] as const;

/**
 * The site nav as a macOS dock: a floating forest pill that hovers over the
 * page instead of sitting on it. `fixed` + `pointer-events-none` on the rail
 * means the hero map stays hoverable everywhere the pill isn't.
 *
 * The pill spans the page (up to `max-w-4xl`) rather than hugging its content,
 * with the mark and the nav pushed to opposite ends — a content-width pill read
 * as a stray chip floating over the map. On a phone it fills the rail, so type
 * and padding step down at `sm` to keep three items on one line at 360px.
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
          <nav className="flex items-center gap-0.5 text-[13px] sm:gap-1.5 sm:text-sm">
            {ITEMS.map((item) =>
              "href" in item ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="dock-item rounded-full px-2.5 py-1.5 font-medium text-dock-text outline-none hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60 sm:px-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  title="Coming soon"
                  className="cursor-default rounded-full px-2.5 py-1.5 text-stone/55 sm:px-4"
                >
                  {item.label}
                </span>
              ),
            )}
          </nav>
          <ThemeToggle />
        </div>
      </header>
    </div>
  );
}
