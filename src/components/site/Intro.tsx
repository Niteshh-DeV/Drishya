import type { CSSProperties } from "react";

/**
 * Opening screen for the first page of a visit: "DRISHYA" rises letter by
 * letter over deep forest, a brass rule draws beneath it, then the panel
 * lifts away. Everything runs in CSS (`.intro` in globals.css), so the
 * page is never left covered if scripts fail. The inline script in
 * layout.tsx hides it for the rest of the browser session.
 */
const WORD = "DRISHYA";

export function Intro() {
  return (
    <div aria-hidden className="intro">
      <div className="text-center">
        <p className="font-display overflow-hidden pb-[0.08em] text-[clamp(3rem,11vw,7.5rem)] font-medium leading-none tracking-[0.18em] [margin-right:-0.18em]">
          {WORD.split("").map((letter, i) => (
            <span key={i} className="intro-letter" style={{ "--i": i } as CSSProperties}>
              {letter}
            </span>
          ))}
        </p>
        <span className="intro-rule mx-auto mt-6 block h-px w-24 bg-brass" />
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-brass-light">
          {/* Letter-spacing pulls Devanagari conjuncts apart, so the word sits untracked. */}
          <span className="tracking-normal">दृश्य</span> · Sudurpaschim
        </p>
      </div>
    </div>
  );
}
