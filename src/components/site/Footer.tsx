"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { Logo } from "./Logo";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Map", href: "/map" },
  { label: "Hidden Gems", href: "/hidden-gems" },
  { label: "Plan a Trip", href: "/plan" },
  { label: "Field Notes", href: "/blog" },
  { label: "Guide Connect", href: "/guide-connect" },
];

/** Team members; a `href` links the name to their own site. */
const TEAM: { name: string; href?: string }[] = [
  { name: "Nitesh Joshi", href: "https://niteshjoshi.me" },
  { name: "Bipana Dhami" },
  { name: "Pooja Bhatt" },
  { name: "Gomati Badu" },
];

const headingClass = "text-[10px] font-semibold uppercase tracking-[0.28em] text-brass-light";

/**
 * The closing spread: a line about the province, the site's sections, the
 * team, and the wordmark set huge behind it all, sunk into the bottom edge
 * and rising into place as you reach it — the way travel magazines sign off.
 */
export function Footer() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const year = new Date().getFullYear();
  if (pathname.startsWith("/place/")) return null;

  function backToTop() {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <footer className="relative isolate mt-24 overflow-hidden bg-forest text-dock-text">
      {/* The wordmark sits behind the footer's own content, sunk into its
          bottom edge, so it adds texture without adding height. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 select-none overflow-hidden">
        <motion.p
          className="font-display footer-wordmark whitespace-nowrap text-center text-[19.5vw] font-medium uppercase leading-[0.8] tracking-[0.04em]"
          initial={{ y: "45%", opacity: 0 }}
          whileInView={{ y: "22%", opacity: 1 }}
          viewport={{ once: true }}
          transition={reduced ? { duration: 0 } : { duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Drishya
        </motion.p>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="font-display mt-8 max-w-md text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.12] text-dock-text">
              From Ghodaghodi Lake in Kailali to the snows of Api in Darchula.
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-stone/85">
              The districts, destinations and traveler stories of Nepal&apos;s
              Sudurpaschim Province, in one place.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className={headingClass}>Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw pb-0.5 text-stone/90 hover:text-dock-text">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={headingClass}>The project</p>
            <p className="mt-5 text-sm leading-relaxed text-stone/85">
              A Computer Engineering minor project at Far Western University,
              built by
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {TEAM.map((member) => (
                <li key={member.name}>
                  {member.href ? (
                    <a
                      href={member.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-draw pb-0.5 text-dock-text hover:text-brass-light"
                    >
                      {member.name}
                    </a>
                  ) : (
                    <span className="text-dock-text">{member.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-stone/15 py-6 text-[11px] uppercase tracking-[0.18em] text-stone/70">
          <p>
            © {year} Drishya ·{" "}
            <Link href="/privacy" className="link-draw pb-0.5 hover:text-dock-text">
              Privacy
            </Link>
          </p>
          <button
            type="button"
            onClick={backToTop}
            className="group inline-flex items-center gap-2 uppercase tracking-[0.18em] outline-none transition-colors hover:text-brass-light focus-visible:text-brass-light"
          >
            Back to top
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
