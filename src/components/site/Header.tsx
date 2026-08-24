import Link from "next/link";

/** Minimal site header. Guides/Assistant are later-phase features (shown as coming soon). */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-brand">
            Drishya
          </span>
          <span className="hidden text-xs text-muted sm:inline">
            Sudurpaschim
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-ink/80 transition-colors hover:text-brand">
            Map
          </Link>
          <span className="cursor-default text-muted/60" title="Coming soon">
            Guides
          </span>
          <span className="cursor-default text-muted/60" title="Coming soon">
            Assistant
          </span>
        </nav>
      </div>
    </header>
  );
}
