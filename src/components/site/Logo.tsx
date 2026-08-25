import Link from "next/link";

/**
 * The Drishya wordmark.
 *
 * "Drishya" (दृश्य) means *sight* / *view* — so the mark is an abstract
 * eye-lens: a vesica drawn in one hairline stroke with a brass iris and a
 * paper glint. The word itself is set in the editorial serif, letterspaced and
 * uppercased so it reads as a mark rather than as running text.
 *
 * It sits on the dark forest dock, so everything here is the light-on-dark
 * treatment: stone hairlines, brass accent, paper→stone→brass gradient ink.
 *
 * On hover the iris opens a touch and a hairline rule draws itself under the
 * word — the whole thing is one `group`, no JS.
 */
export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="Drishya — home"
      className="group inline-flex items-center gap-2 outline-none"
    >
      <span className="relative grid h-7 w-7 shrink-0 place-items-center">
        {/* Soft brass halo that blooms on hover. */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brass/25 opacity-0 blur-[7px] transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <svg
          viewBox="0 0 32 32"
          className="relative h-full w-full"
          fill="none"
          aria-hidden
        >
          {/* Eye-lens: two arcs meeting at points. */}
          <path
            d="M 3.5 16 Q 16 4.6 28.5 16 Q 16 27.4 3.5 16 Z"
            stroke="var(--color-stone)"
            strokeOpacity="0.85"
            strokeWidth="1.35"
            strokeLinejoin="round"
            fill="color-mix(in srgb, var(--color-stone) 10%, transparent)"
          />
          {/* Iris — opens slightly on hover. Ringed so brass reads on forest. */}
          <circle
            cx="16"
            cy="16"
            r="4.1"
            fill="var(--color-brass)"
            stroke="color-mix(in srgb, var(--color-paper) 45%, transparent)"
            strokeWidth="0.8"
            className="origin-center transition-transform duration-500 ease-out group-hover:scale-110"
          />
          {/* Glint. */}
          <circle cx="14.4" cy="14.4" r="1.1" fill="var(--color-paper)" />
          {/* Outer lash-ticks: a nod to the compass rose on the map. */}
          <path
            d="M 16 2.2 V 4 M 16 28 V 29.8"
            stroke="var(--color-brass-light)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </span>

      <span className="relative">
        <span className="logo-ink font-display block text-[1.05rem] font-semibold uppercase leading-none tracking-[0.24em]">
          Drishya
        </span>
        {/* Hairline rule that draws in from the left on hover. */}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-stone/70 to-brass/80 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </span>
    </Link>
  );
}
