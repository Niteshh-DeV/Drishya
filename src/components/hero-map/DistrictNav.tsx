"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { District } from "@/lib/types";

interface DistrictNavProps {
  districts: District[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Preview a district on the map while its tick is hovered/focused. */
  onHover?: (id: string | null) => void;
}

/**
 * The bottom "ruler" navigator: one numbered tick per district. The active
 * district is lifted and accented; the rest are quiet marks. Clicking (or
 * arrowing) moves the hero camera, and hovering a tick previews that district
 * on the map. Purely presentational — all state lives in the parent `HeroMap`.
 */
export function DistrictNav({
  districts,
  activeIndex,
  onSelect,
  onHover,
}: DistrictNavProps) {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // The ruler scrolls horizontally on narrow screens — keep the active tick
  // centered. Scrolling the container directly (rather than scrollIntoView)
  // avoids yanking the page vertically.
  useEffect(() => {
    const list = listRef.current;
    const btn = activeRef.current;
    if (!list || !btn) return;
    const left = btn.offsetLeft - list.clientWidth / 2 + btn.clientWidth / 2;
    list.scrollTo({
      left: Math.max(0, left),
      behavior: reduced ? "auto" : "smooth",
    });
  }, [activeIndex, reduced]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Choose a district"
      onPointerLeave={() => onHover?.(null)}
      className="no-scrollbar flex items-end gap-1 overflow-x-auto px-2 sm:justify-center"
    >
      {districts.map((d, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={d.slug}
            ref={isActive ? activeRef : undefined}
            role="tab"
            aria-selected={isActive}
            aria-label={d.name}
            onClick={() => onSelect(i)}
            onPointerEnter={(e) => {
              // Mouse only — a tap shouldn't leave the preview state stuck on.
              if (e.pointerType === "mouse") onHover?.(d.id);
            }}
            onFocus={() => onHover?.(d.id)}
            onBlur={() => onHover?.(null)}
            className="group relative flex shrink-0 flex-col items-center gap-1.5 px-2 py-2 outline-none"
          >
            {/* number */}
            <span
              className={`text-[11px] tabular-nums transition-colors ${
                isActive ? "text-accent" : "text-muted/60 group-hover:text-ink/70"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* tick */}
            <span
              className={`w-px origin-bottom rounded-full transition-all duration-300 ${
                isActive
                  ? "h-5 bg-accent"
                  : "h-2.5 bg-line group-hover:h-3.5 group-hover:bg-muted group-focus-visible:h-3.5 group-focus-visible:bg-muted"
              }`}
            />

            {/* name */}
            <span
              className={`whitespace-nowrap text-xs transition-all duration-300 ${
                isActive
                  ? "font-medium text-ink"
                  : "text-muted/70 group-hover:text-ink/80 group-focus-visible:text-ink/80"
              }`}
            >
              {d.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
