"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import svgJson from "@/data/sudurpaschim-svg.json";
import { districts } from "@/data/districts";
import { landmarksForDistrict } from "@/data/landmarks";
import { framedViewBox, pathBounds, unionBounds, type Bounds } from "@/lib/pathBounds";
import {
  clamp,
  frameAt,
  seatBias,
  seatFrame,
  type Frame,
} from "@/lib/heroCamera";
import type { LandmarkKind, SudurpaschimSvg } from "@/lib/types";
import { DistrictNav } from "./DistrictNav";

const svg = svgJson as SudurpaschimSvg;

/*
 * The stage aspect must be known before the first paint, or the opening frame
 * is computed against the 16/9 fallback and a portrait phone crops the province
 * (with `slice`, a wide viewBox in a tall stage loses its edges). A layout
 * effect measures before the browser paints; on the server there's no layout to
 * read, so we fall back to a plain effect to avoid React's SSR warning.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The hero is a pinned, scroll-driven camera. The section is tall; the stage
 * inside it is `sticky` and exactly one viewport high, so page scroll flies the
 * camera between stops instead of moving the map off screen.
 *
 * Stop 0 frames the whole province (the opening shot, under the title); stops
 * 1…9 frame each district in `districts` order. This is the scroll distance
 * allotted to each stop after the first.
 */
const STOP_VH = 85;

/**
 * Scroll progress at which the opening title has fully dissolved — a small
 * fraction of a very tall section, so the card clears as soon as you move.
 */
const TITLE_FADE_END = 0.03;

/**
 * Landmark pins and labels are authored around a 15-user-unit cap height, and
 * we want them to render at ~13 CSS px on every screen — so they stay legible
 * on a phone instead of shrinking with the stage.
 */
const MARKER_UNITS = 15;
const MARKER_PX = 13;

/*
 * Cartographic palette. The landmass is forest green on warm paper; the
 * district in frame turns brass. Hovering lifts a district toward the light.
 *
 * Two deviations from the palette's literal role table, both measured:
 *  · hairlines are stone, not slate — slate on forest is 1.26:1, so slate
 *    borders would vanish entirely on the dark landmass (stone is 7.65:1);
 *  · the hover fill is slate lifted 15% toward stone (1.74:1 from forest),
 *    because raw slate would make hovering imperceptible for the same reason.
 * The hovered district also takes a brass hairline, previewing the brass it
 * becomes when clicked.
 */
const ACTIVE_FILL = "#b68d4c"; // brass — the district in frame
const HOVER_FILL = "#4d5e59"; // slate, lifted
const BASE_FILL = "#1f3d2b"; // forest — the province
const ACTIVE_STROKE = "#162c1f"; // forest-deep ink, 4.9:1 on brass
const HOVER_STROKE = "#b68d4c"; // brass, previewing the active state
const BORDER_STROKE = "#d1cfc7"; // stone hairlines between districts

/** SVG paths keyed by district id (the JSON is in a different order than `districts`). */
const svgById = Object.fromEntries(svg.districts.map((d) => [d.id, d]));

/** Tiny centered glyph per landmark kind, drawn in ±4 local units (paper on forest). */
function Glyph({ kind }: { kind: LandmarkKind }) {
  const paper = "#f6f5f2";
  if (kind === "peak") {
    return <path d="M -3.6 3 L 0 -4 L 3.6 3 Z" fill={paper} />;
  }
  if (kind === "temple") {
    return (
      <path
        d="M -3.4 3 L -3.4 -0.6 L 0 -4 L 3.4 -0.6 L 3.4 3 Z"
        fill={paper}
      />
    );
  }
  if (kind === "gem") {
    return <path d="M 0 -3.6 L 3.6 0 L 0 3.6 L -3.6 0 Z" fill={paper} />;
  }
  // water — a little wave
  return (
    <path
      d="M -3.6 0 q 1.8 -2.6 3.6 0 t 3.6 0"
      fill="none"
      stroke={paper}
      strokeWidth={1.3}
      strokeLinecap="round"
    />
  );
}

export function HeroMap() {
  const router = useRouter();
  const reduced = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const bounds = useMemo<Record<string, Bounds>>(() => {
    const out: Record<string, Bounds> = {};
    for (const d of svg.districts) out[d.id] = pathBounds(d.d);
    return out;
  }, []);

  /** Measured stage size in CSS px — the stage is full-bleed, so its aspect
   * (and therefore the camera framing) depends on the viewport.
   *
   * Seeded from the viewport on the first client render, not left at 0: the
   * stage is full-bleed and one screen tall, so innerWidth/innerHeight are the
   * right aspect immediately. Waiting for the layout effect means the first
   * painted frame is computed against the 16/9 fallback, and on a portrait phone
   * `slice` crops the province for that frame — the flash that read as "broken
   * on phone". SSR has no window, so it renders the fallback and the first
   * client render corrects it before paint. */
  const [stage, setStage] = useState(() =>
    typeof window === "undefined"
      ? { w: 0, h: 0 }
      : { w: window.innerWidth, h: window.innerHeight },
  );
  useIsomorphicLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) setStage({ w, h });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /*
   * The aspect the camera frames against. Kept exact: `slice` crops nothing
   * only while the viewBox aspect matches the stage, so rounding this would
   * permanently tighten the framing. A phone's `100dvh` shifts a few percent as
   * the URL bar collapses, which re-frames the camera by the same few percent —
   * that is the correct response to a genuinely different viewport.
   */
  const aspect = stage.w > 0 && stage.h > 0 ? stage.w / stage.h : 16 / 9;

  /** Stop 0 = whole province; stops 1…n = each district, in `districts` order. */
  const stops = useMemo<Frame[]>(() => {
    const province = unionBounds(districts.map((d) => bounds[d.id]));
    /*
     * The province is roughly square, so on a wide screen a centred frame
     * leaves dead paper either side — and the glass card would sit right on top
     * of the subject. `seatBias` pushes it right of centre on landscape; on a
     * portrait phone it leaves the overview centred (behind the title) but drops
     * each district into the lower half, clear of the top-pinned district card.
     */
    return [
      seatFrame(framedViewBox(province, aspect, 0.06), seatBias(aspect, true)),
      ...districts.map((d) =>
        seatFrame(framedViewBox(bounds[d.id], aspect, 0.22), seatBias(aspect, false)),
      ),
    ];
  }, [bounds, aspect]);

  // ── Scroll → camera ────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  /*
   * A spring on scroll progress smooths the discrete steps a mouse wheel emits,
   * but it must stay close to critically damped or it reads as lag: the camera
   * crawls after the scroll position instead of tracking it. Damping ratio here
   * is damping / (2·√(stiffness·mass)) ≈ 1.07 — just past critical, so it
   * settles fast with no overshoot, and the stiffness keeps the trailing
   * distance small. The weight in the motion comes from `frameAt`'s
   * plateau-and-fly easing, not from the spring.
   */
  const sprung = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 36,
    restDelta: 0.0005,
  });
  const camP = reduced ? scrollYProgress : sprung;

  const initial = stops[0];
  const vx = useMotionValue(initial[0]);
  const vy = useMotionValue(initial[1]);
  const vw = useMotionValue(initial[2]);
  const vh = useMotionValue(initial[3]);
  const viewBox = useMotionTemplate`${vx} ${vy} ${vw} ${vh}`;

  // Read the freshest stops inside the scroll handler without resubscribing.
  const stopsRef = useRef(stops);
  stopsRef.current = stops;

  const applyProgress = useCallback(
    (p: number) => {
      const f = frameAt(stopsRef.current, p);
      vx.set(f[0]);
      vy.set(f[1]);
      vw.set(f[2]);
      vh.set(f[3]);
    },
    [vx, vy, vw, vh],
  );

  useMotionValueEvent(camP, "change", applyProgress);
  // Re-frame on resize (new aspect ⇒ new stops) and on mount/restored scroll.
  useEffect(() => {
    applyProgress(camP.get());
  }, [stops, applyProgress, camP]);

  /*
   * True while the camera is moving. Changing `viewBox` re-rasterises the whole
   * SVG every frame, and the `feDropShadow` lifts below are gaussian blurs —
   * by far the most expensive thing in that repaint, and the main reason the
   * fly drops frames on a phone. We drop them during the fly and restore them
   * on settle; a shadow arriving as the camera lands isn't something you catch.
   *
   * Guarded by a ref so a scroll burst costs two renders, not one per frame.
   */
  const [flying, setFlying] = useState(false);
  const flyingRef = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useMotionValueEvent(camP, "change", () => {
    if (!flyingRef.current) {
      flyingRef.current = true;
      setFlying(true);
    }
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      flyingRef.current = false;
      setFlying(false);
    }, 140);
  });
  useEffect(() => () => clearTimeout(settleTimer.current), []);

  /** Which stop the UI considers current: 0 = overview, 1…n = districts. */
  const [stopIndex, setStopIndex] = useState(0);
  const syncStop = useCallback((v: number) => {
    setStopIndex(clamp(Math.round(v * districts.length), 0, districts.length));
  }, []);
  useMotionValueEvent(scrollYProgress, "change", syncStop);
  useEffect(() => {
    syncStop(scrollYProgress.get());
  }, [syncStop, scrollYProgress]);

  /** District under the pointer, if any — drives the premium hover state. */
  const [hoverId, setHoverId] = useState<string | null>(null);

  const activeIndex = stopIndex - 1; // -1 while the overview is framed
  const active = activeIndex >= 0 ? districts[activeIndex] : undefined;
  const activeSvg = active ? svgById[active.id] : undefined;
  const landmarks = active ? landmarksForDistrict(active.id) : [];

  const hovered =
    hoverId && hoverId !== active?.id
      ? districts.find((d) => d.id === hoverId)
      : undefined;

  // Markers only show once the camera has settled, so a per-stop scalar is
  // enough to keep pins ~13px regardless of how large the framed district is.
  const frameW = stops[stopIndex]?.[2] ?? initial[2];
  const uscale =
    stage.w > 0 ? (MARKER_PX / MARKER_UNITS) * (frameW / stage.w) : 1;

  // The opening title dissolves the moment you start scrolling.
  //
  // `titleOpacity` is a *function* transform, not the `[0, 0.03] → [1, 0]` range
  // form, and that's load-bearing. `useScroll` with a target/offset marks
  // `scrollYProgress` as hardware-accelerable through a native ViewTimeline, and
  // motion routes any `opacity` bound to a *range* transform onto it. The native
  // timeline stretches this 3% sub-range across a far wider span, so the card
  // never reaches 0 — it hangs near 0.4 opacity, a ghost of the title left over
  // the map on real phones. A function transform opts out of acceleration (motion
  // only accelerates the range form), so the fade runs the normal per-frame path
  // and clamps to 0 as intended. `y` is unaffected — it isn't an accelerated key
  // — but it shares the constant so the two stay in lockstep.
  const titleOpacity = useTransform(scrollYProgress, (p) =>
    clamp(1 - p / TITLE_FADE_END, 0, 1),
  );
  const titleY = useTransform(scrollYProgress, [0, TITLE_FADE_END], [0, -28]);
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /** Scroll so that `k` (0 = overview, 1…n = districts) is the framed stop. */
  const goToStop = useCallback(
    (k: number) => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      const target = top + (clamp(k, 0, districts.length) / districts.length) * range;
      window.scrollTo({
        top: target,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  const goActive = () => {
    if (active) router.push(`/districts/${active.slug}`);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Map of Sudurpaschim Province — scroll to fly between districts"
      className="relative"
      style={{ height: `calc(100dvh + ${districts.length * STOP_VH}dvh)` }}
    >
      {/* The pinned stage: exactly one screen, full bleed. */}
      <div
        ref={stageRef}
        role="group"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            goToStop(stopIndex + 1);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            goToStop(stopIndex - 1);
          } else if (e.key === "Enter") {
            e.preventDefault();
            goActive();
          }
        }}
        onPointerLeave={() => setHoverId(null)}
        className="paper-texture sticky top-0 h-[100dvh] w-full overflow-hidden outline-none ring-inset ring-brand/40 focus-visible:ring-2"
      >
        <motion.svg
          viewBox={viewBox}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          /*
           * The viewBox is framed against the measured viewport, which the server
           * can't know — it renders the 16/9 fallback, the client's first render
           * uses the real aspect. That difference is intentional, so the attribute
           * is exempt from hydration matching.
           */
          suppressHydrationWarning
        >
          <defs>
            <filter id="lift" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="#162c1f"
                floodOpacity="0.3"
              />
            </filter>
            {/* Softer shadow for the hovered (but not active) district. */}
            <filter id="lift-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodColor="#162c1f"
                floodOpacity="0.22"
              />
            </filter>
            <pattern
              id="hatch"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="7"
                stroke="#162c1f"
                strokeWidth="0.7"
                strokeOpacity="0.16"
              />
            </pattern>
          </defs>

          {/* District shapes (ordered as in districts.ts). */}
          {districts.map((d) => {
            const path = svgById[d.id];
            if (!path) return null;
            const isActive = d.id === active?.id;
            const isHover = d.id === hoverId && !isActive;
            const isOverview = !active;
            return (
              <motion.path
                key={d.id}
                d={path.d}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                filter={
                  flying
                    ? undefined
                    : isActive
                      ? "url(#lift)"
                      : isHover
                        ? "url(#lift-soft)"
                        : undefined
                }
                className="cursor-pointer"
                onPointerEnter={(e) => {
                  // Mouse only — on touch a tap would leave the hover state stuck.
                  if (e.pointerType === "mouse") setHoverId(d.id);
                }}
                onClick={() =>
                  isActive
                    ? goActive()
                    : goToStop(
                        districts.findIndex((x) => x.id === d.id) + 1,
                      )
                }
                initial={false}
                animate={{
                  fill: isActive
                    ? ACTIVE_FILL
                    : isHover
                      ? HOVER_FILL
                      : BASE_FILL,
                  stroke: isActive
                    ? ACTIVE_STROKE
                    : isHover
                      ? HOVER_STROKE
                      : BORDER_STROKE,
                  strokeWidth: isActive ? 1.5 : isHover ? 1.6 : 1,
                  strokeOpacity: isActive ? 0.7 : isHover ? 0.9 : 0.45,
                  opacity: isActive || isOverview ? 1 : isHover ? 0.92 : 0.4,
                  // The hovered district lifts off the paper a touch.
                  y: isHover ? -3 : 0,
                }}
                transition={{
                  default: { duration: 0.4, ease: "easeOut" },
                  y: reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 320, damping: 26 },
                }}
              />
            );
          })}

          {/* Hatch overlay on the active district for the drawn-in look. */}
          {activeSvg && (
            <path
              d={activeSvg.d}
              fill="url(#hatch)"
              stroke="none"
              className="pointer-events-none"
            />
          )}

          {/* Ink outline that traces itself around each newly framed district. */}
          <AnimatePresence mode="wait">
            {activeSvg && active && (
              <motion.path
                key={`trace-${active.id}`}
                d={activeSvg.d}
                fill="none"
                stroke={ACTIVE_STROKE}
                strokeWidth={2.6}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="pointer-events-none"
                initial={{ pathLength: reduced ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{
                  duration: reduced ? 0 : 1.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            )}
          </AnimatePresence>

          {/* Landmarks of the active district. */}
          <AnimatePresence mode="wait">
            {active && activeSvg && (
              <motion.g
                key={active.id}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
              >
                {landmarks.map((lm, i) => {
                  const px = activeSvg.cx + lm.dx;
                  const py = activeSvg.cy + lm.dy;
                  return (
                    <motion.g
                      key={lm.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: reduced ? 0 : 0.5 + i * 0.12,
                        duration: reduced ? 0 : 0.45,
                      }}
                    >
                      <g transform={`translate(${px} ${py}) scale(${uscale})`}>
                        <circle
                          cx={0}
                          cy={0}
                          r={9}
                          fill="#f6f5f2"
                          fillOpacity={0.9}
                        />
                        <circle cx={0} cy={0} r={7.5} fill="#1f3d2b" />
                        <Glyph kind={lm.kind} />
                        <text
                          x={13}
                          y={1}
                          dominantBaseline="middle"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 15,
                            fontWeight: 600,
                            fill: "#1f3d2b",
                            paintOrder: "stroke",
                            stroke: "#f6f5f2",
                            strokeWidth: 3.5,
                            strokeLinejoin: "round",
                          }}
                        >
                          {lm.name}
                        </text>
                      </g>
                    </motion.g>
                  );
                })}
              </motion.g>
            )}
          </AnimatePresence>
        </motion.svg>

        {/* Edge vignette so the glass panes have something to sit against. */}
        <div
          aria-hidden
          className="hero-vignette pointer-events-none absolute inset-0"
        />

        {/* ── Opening shot: title over the whole province ──────────────── */}
        {/*
         * Centring lives on this plain wrapper, not on the motion element below.
         * Motion builds `transform` from its own values, so anything else writing
         * that property on the same element is at its mercy. Keeping the two on
         * separate elements means the centring can't be clobbered, whatever the
         * animation does. Same split the district card already uses.
         */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-6 sm:inset-x-auto sm:left-8 sm:px-0">
          <motion.div style={{ opacity: titleOpacity, y: titleY }}>
            <div className="glass mx-auto max-w-xl rounded-3xl px-7 py-8 text-center sm:mx-0 sm:max-w-md sm:text-left">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent-ink">
                Sudurpaschim Province · Nepal
              </p>
              <h1 className="font-display mt-3 text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
                Explore Drishya
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-ink/70 sm:text-base">
                Nine districts of Nepal&apos;s far west, one at a time. Scroll to
                fly the map west to east — or pick a district from the ruler
                below.
              </p>

              {/* Scroll cue. */}
              <div className="mt-7 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
                  Scroll to explore
                </span>
                <span className="relative h-9 w-px overflow-hidden bg-line sm:h-7">
                  <span className="cue-dot absolute left-1/2 top-0 h-2.5 w-[3px] -translate-x-1/2 rounded-full bg-accent" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── District info card ───────────────────────────────────────── */}
        <div className="pointer-events-none absolute left-4 right-4 top-[calc(var(--header-h)+1rem)] z-20 sm:right-auto sm:left-8 sm:top-1/2 sm:max-w-sm sm:-translate-y-1/2">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
                transition={{ duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="glass-strong rounded-3xl px-6 py-5"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent-ink">
                  District {String(activeIndex + 1).padStart(2, "0")} ·{" "}
                  {String(districts.length).padStart(2, "0")}
                </p>
                <h2 className="font-display mt-1.5 text-5xl font-semibold leading-none text-ink sm:text-6xl">
                  {active.name}
                </h2>
                <p className="mt-2.5 text-sm font-medium text-slate">
                  {active.tagline}
                </p>
                <p className="mt-2 hidden text-sm leading-relaxed text-ink/70 sm:block">
                  {active.blurb}
                </p>
                {/*
                 * Brass CTA per the palette. Forest-deep ink on brass is 4.9:1;
                 * paper on brass would only be 2.8:1, so the label goes dark.
                 * Hover brightens rather than deepens — same language as the
                 * dock items and the map's hover state.
                 */}
                <button
                  onClick={goActive}
                  className="group pointer-events-auto mt-5 inline-flex items-center gap-1.5 rounded-full bg-brass px-4 py-2 text-sm font-semibold text-forest-deep shadow-sm transition-all hover:bg-brass-light hover:shadow-md hover:shadow-forest/25"
                >
                  Explore {active.name}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover chip: names the district under the pointer, always legible. */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
              className="glass pointer-events-none absolute bottom-28 right-4 z-20 rounded-2xl px-4 py-2.5 text-right sm:bottom-24 sm:right-8"
            >
              <p className="font-display text-xl font-semibold leading-tight text-ink">
                {hovered.name}
              </p>
              <p className="text-[11px] text-muted">{hovered.tagline}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-accent-ink">
                Click to frame
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative compass rose, in its own little glass housing. */}
        <div
          aria-hidden
          className="glass pointer-events-none absolute right-6 top-[calc(var(--header-h)+1.25rem)] z-20 hidden rounded-full p-2 sm:right-8 sm:block"
        >
          <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="#1f3d2b" strokeOpacity="0.35" />
            {/* North needle in brass-ink rather than bright brass: #b68d4c is
             * only 2.8:1 on paper, and a faint needle reads as a mistake. */}
            <path d="M28 11 L32 28 L28 33 L24 28 Z" fill="#8a6a2f" />
            <path d="M28 45 L24 28 L28 23 L32 28 Z" fill="#1f3d2b" opacity="0.45" />
            <text
              x="28"
              y="9"
              textAnchor="middle"
              style={{ fontSize: 8, fill: "#1f3d2b", fontWeight: 700 }}
            >
              N
            </text>
          </svg>
        </div>

        {/* Scroll progress rail, hugging the right edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 z-20 hidden h-40 w-px -translate-y-1/2 bg-stone sm:block"
        >
          <motion.div
            style={{ scaleY: railScale }}
            className="h-full w-full origin-top bg-gradient-to-b from-forest to-brass"
          />
        </div>

        {/* Bottom district ruler, pinned inside the stage on a glass tray. */}
        <div className="absolute inset-x-3 bottom-4 z-20 sm:inset-x-0 sm:bottom-6">
          <div className="glass mx-auto w-fit max-w-full rounded-2xl px-2 py-1.5">
            <DistrictNav
              districts={districts}
              activeIndex={activeIndex}
              onSelect={(i) => goToStop(i + 1)}
              onHover={setHoverId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
