"use client";

import Link from "next/link";
import { ViewTransition, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useLenis } from "lenis/react";
import { AccountButton } from "./AccountButton";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useDismiss } from "./useDismiss";

type NavItem =
  | { label: string; href: string; /** Path prefixes that light this item. */ match: string[] }
  | { label: string; soon: true };

/** Nav entries. `soon` renders as a quiet, non-interactive dock item. */
const ITEMS: NavItem[] = [
  { label: "Map", href: "/map", match: ["/map", "/districts", "/place"] },
  { label: "Hidden Gems", href: "/hidden-gems", match: ["/hidden-gems"] },
  { label: "Plan a Trip", href: "/plan", match: ["/plan"] },
  { label: "Field Notes", href: "/blog", match: ["/blog", "/travelers"] },
  { label: "Guides", href: "/guide-connect", match: ["/guide-connect"] },
  { label: "Assistant", soon: true },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function isActive(pathname: string, item: NavItem): boolean {
  return "match" in item && item.match.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * The site nav as a macOS dock: a floating forest pill that hovers over the
 * page instead of sitting on it. `fixed` + `pointer-events-none` on the rail
 * means the hero map stays hoverable everywhere the pill isn't.
 *
 * The pill spans the page (up to `max-w-4xl`) rather than hugging its content,
 * with the mark and the nav pushed to opposite ends — a content-width pill read
 * as a stray chip floating over the map. On a phone the navigation opens as a
 * full-screen panel instead.
 *
 * The current section wears a brass pill that slides between items. It is
 * measured from the links' offsets rather than animated with a shared
 * layout, so the dock's own movement (tucking, settling) never knocks it
 * out of place. Once the
 * page scrolls, the dock settles (a touch smaller, more frosted); on long
 * pages it tucks away while you read down and returns as soon as you scroll
 * up. The landing hero keeps it in view, since the dock is the only fixed
 * landmark while the camera flies.
 *
 * During a page transition the dock is captured as its own snapshot and
 * held still above the pages (`.dock-hold` in globals.css). The keyed marker
 * inside guarantees it counts as changed on every navigation; React would
 * otherwise skip an unchanged boundary and let the pages cover the dock.
 *
 * The frosted glass is a layer *behind* the header rather than the header
 * itself: an element with `backdrop-filter` stops its descendants' own
 * backdrop filters at its edge, and the account menu needs to blur the page.
 *
 * Sizing lives in --dock-* / --header-h (globals.css); pages read --header-h to
 * keep their first row clear of the pill.
 */
export function Header() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);

  // Place the active-section pill under the current link; re-measure when
  // the nav resizes (web fonts arriving, the window crossing a breakpoint).
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      setPill(active ? { x: active.offsetLeft, width: active.offsetWidth } : null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [pathname]);

  const autoHide = pathname !== "/";

  const tuckedRef = useRef(tucked);
  tuckedRef.current = tucked;
  const holdUntil = useRef(0);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (performance.now() < holdUntil.current) return;
    if (!autoHide || menuOpen || y < 160) setTucked(false);
    else if (y - previous > 4) setTucked(true);
    else if (previous - y > 4) setTucked(false);
  });

  // A new page starts with the menu closed and the dock in view. A dock that
  // was tucked away waits for the page transition to finish before gliding
  // back: a tucked dock isn't in the transition's snapshots, so returning
  // mid-transition it would slide in underneath the incoming page.
  useLayoutEffect(() => {
    setMenuOpen(false);
    if (!tuckedRef.current || reduced) {
      setTucked(false);
      return;
    }
    holdUntil.current = performance.now() + 950;
    const timer = setTimeout(() => setTucked(false), 950);
    return () => clearTimeout(timer);
  }, [pathname, reduced]);

  // Hold the page still behind the open phone menu.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    lenis?.stop();
    firstLinkRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = previous;
      lenis?.start();
    };
  }, [menuOpen, lenis]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useDismiss({ open: menuOpen, close: closeMenu, trigger: toggleRef });

  if (pathname.startsWith("/place/")) return null;

  return (
    <ViewTransition name="site-header" update="dock-hold" default="none">
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-[var(--dock-top)] z-[100] flex justify-center px-3 sm:px-4"
        animate={{ y: tucked ? "-160%" : "0%" }}
        transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
        // Tabbing into a tucked dock brings it back.
        onFocusCapture={() => setTucked(false)}
      >
        <span key={pathname} hidden />
        <motion.header
          className="pointer-events-auto relative isolate flex h-[var(--dock-h)] w-full max-w-4xl items-center justify-between rounded-full pl-3 pr-1.5 sm:pl-5 sm:pr-3"
          animate={{ scale: scrolled && !menuOpen ? 0.97 : 1 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
        >
          <span
            aria-hidden
            className={`dock absolute inset-0 -z-10 rounded-full ${scrolled ? "dock-scrolled" : ""}`}
          />
          <Logo href="/#top" />
          <div className="flex items-center gap-0.5">
            <nav ref={navRef} aria-label="Main" className="relative hidden items-center gap-1 text-sm md:flex">
              {pill && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-brass/20 ring-1 ring-inset ring-brass/40"
                  initial={false}
                  animate={{ x: pill.x, width: pill.width }}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              {ITEMS.map((item) => {
                if (!("href" in item)) {
                  return (
                    <span
                      key={item.label}
                      title="Coming soon"
                      className="hidden cursor-default rounded-full px-4 py-1.5 text-stone/55 lg:inline"
                    >
                      {item.label}
                    </span>
                  );
                }
                const active = isActive(pathname, item);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`dock-item relative rounded-full px-3.5 py-1.5 font-medium outline-none hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60 lg:px-4 ${
                      active ? "text-brass-light" : "text-dock-text"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              ref={toggleRef}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="dock-item grid h-9 w-9 place-items-center rounded-full text-dock-text outline-none hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60 md:hidden"
            >
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.6"
              >
                {/* Two bars that cross into a close mark. */}
                <motion.path
                  initial={false}
                  animate={{ d: menuOpen ? "M5 5 L15 15" : "M3 7 L17 7" }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                />
                <motion.path
                  initial={false}
                  animate={{ d: menuOpen ? "M5 15 L15 5" : "M3 13 L17 13" }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                />
              </svg>
            </button>
            <ThemeToggle />
            <AccountButton />
          </div>
        </motion.header>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-label="Site navigation"
            className="fixed inset-0 z-[95] flex flex-col bg-forest-deep/95 px-6 pb-10 pt-[calc(var(--header-h)+3rem)] text-dock-text backdrop-blur-xl md:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduced ? 0.15 : 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Main" className="flex flex-col">
              {ITEMS.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="overflow-hidden border-b border-stone/15"
                  initial={reduced ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: reduced ? 0 : 0.18 + index * 0.06, ease: EASE }}
                >
                  {"href" in item ? (
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={isActive(pathname, item) ? "page" : undefined}
                      className="group flex items-baseline gap-5 py-4 outline-none focus-visible:text-brass-light"
                    >
                      <span className="font-display w-7 text-base text-brass-light">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-[2.6rem] leading-none transition-colors group-hover:text-brass-light ${
                          isActive(pathname, item) ? "text-brass-light" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <p className="flex items-baseline gap-5 py-4 text-stone/50">
                      <span className="font-display w-7 text-base">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-display text-[2.6rem] leading-none">{item.label}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em]">Soon</span>
                    </p>
                  )}
                </motion.div>
              ))}
            </nav>
            <motion.p
              className="mt-auto text-[10px] uppercase tracking-[0.28em] text-stone/70"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: reduced ? 0 : 0.5 }}
            >
              Nine districts · Kailali to Darchula
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </ViewTransition>
  );
}
