"use client";

import { useState } from "react";

/**
 * Floating "Quick facts" button and its slide-out reference panel for a
 * place page. Sits in the bottom-left corner so it doesn't compete with the
 * site dock at the top. The only stateful part of the page, so it is the
 * only part that hydrates.
 */
export function PlaceMenu({
  districtName,
  placeName,
  items,
}: {
  districtName: string;
  placeName: string;
  /** [label, text] pairs; empty fields are already filtered out. */
  items: [string, string][];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      {items.length > 0 && (
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="destination-menu"
          className="glass-strong fixed bottom-5 left-5 z-40 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink shadow-xl transition-colors hover:text-accent-ink sm:left-10"
        >
          Quick facts {menuOpen ? "−" : "+"}
        </button>
      )}

      {menuOpen && (
        <aside
          id="destination-menu"
          className="fixed bottom-20 left-5 z-40 max-h-[calc(100vh-var(--header-h)-7rem)] w-[min(22rem,calc(100vw-2.5rem))] overflow-y-auto border border-line bg-paper/95 p-5 text-ink shadow-[0_24px_60px_-24px_color-mix(in_srgb,var(--color-forest-deep)_45%,transparent)] backdrop-blur-xl sm:left-10"
        >
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
                {districtName}
              </p>
              <h2 className="font-display mt-2 text-3xl leading-none">
                {placeName}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close destination menu"
              className="text-xl leading-none text-muted hover:text-accent-ink"
            >
              ×
            </button>
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <div className="grid gap-2">
              {items.map(([label, value]) => (
                <div key={label}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelected((current) => (current === label ? null : label))
                    }
                    aria-expanded={selected === label}
                    className="flex w-full items-center justify-between border border-line px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
                  >
                    {label}
                    <span aria-hidden>{selected === label ? "−" : "+"}</span>
                  </button>
                  {selected === label && (
                    <p className="border-x border-b border-line bg-paper/60 px-3 py-3 text-sm leading-relaxed text-muted">
                      {value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
