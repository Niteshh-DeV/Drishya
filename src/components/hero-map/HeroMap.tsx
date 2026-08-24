"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import svgJson from "@/data/sudurpaschim-svg.json";
import { districts } from "@/data/districts";
import { landmarksForDistrict } from "@/data/landmarks";
import { framedViewBox, pathBounds, type Bounds } from "@/lib/pathBounds";
import type { LandmarkKind, SudurpaschimSvg } from "@/lib/types";
import { DistrictNav } from "./DistrictNav";

const svg = svgJson as SudurpaschimSvg;

/** Fixed stage aspect (the stage is `aspect-[4/3]`); used to frame the camera. */
const ASPECT = 4 / 3;
/**
 * Landmark pins and labels are authored around a 15-user-unit cap height, and
 * we want them to render at ~13 CSS px on every screen — so they stay legible
 * on a phone instead of shrinking with the stage.
 */
const MARKER_UNITS = 15;
const MARKER_PX = 13;

const CAMERA = { duration: 0.95, ease: [0.22, 1, 0.36, 1] as const };

// Parchment palette for the illustrated look.
const ACTIVE_FILL = "#e7d9bd";
const HOVER_FILL = "#ded2b8"; // inactive-but-hovered: warms toward the active tone
const INACTIVE_FILL = "#d3cdbd";
const ACTIVE_STROKE = "#234f3a"; // --color-brand-dark
const INACTIVE_STROKE = "#c7c0ad";

/** SVG paths keyed by district id (the JSON is in a different order than `districts`). */
const svgById = Object.fromEntries(svg.districts.map((d) => [d.id, d]));

/** Tiny centered glyph per landmark kind, drawn in ±4 local units (paper on brand). */
function Glyph({ kind }: { kind: LandmarkKind }) {
  const paper = "#f7f5f0";
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

  const bounds = useMemo<Record<string, Bounds>>(() => {
    const out: Record<string, Bounds> = {};
    for (const d of svg.districts) out[d.id] = pathBounds(d.d);
    return out;
  }, []);

  const defaultIndex = useMemo(() => {
    const i = districts.findIndex((d) => d.id === "kailali");
    return i === -1 ? 0 : i;
  }, []);

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  /** District under the pointer, if any — drives the premium hover state. */
  const [hoverId, setHoverId] = useState<string | null>(null);
  const active = districts[activeIndex];
  const activeSvg = svgById[active.id];
  const landmarks = landmarksForDistrict(active.id);

  const hovered =
    hoverId && hoverId !== active.id
      ? districts.find((d) => d.id === hoverId)
      : undefined;

  const initialFrame = useMemo(
    () => framedViewBox(bounds[districts[defaultIndex].id], ASPECT),
    [bounds, defaultIndex],
  );

  const vx = useMotionValue(initialFrame[0]);
  const vy = useMotionValue(initialFrame[1]);
  const vw = useMotionValue(initialFrame[2]);
  const vh = useMotionValue(initialFrame[3]);
  const viewBox = useMotionTemplate`${vx} ${vy} ${vw} ${vh}`;

  const [frameW, setFrameW] = useState(initialFrame[2]);
  /** Rendered stage width in CSS px — converts user units to on-screen px. */
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    setStageW(el.clientWidth);
    const ro = new ResizeObserver(([entry]) =>
      setStageW(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pan/zoom the camera to the active district.
  useEffect(() => {
    const target = framedViewBox(bounds[active.id], ASPECT);
    setFrameW(target[2]);
    const opts = reduced ? { duration: 0 } : CAMERA;
    const controls = [
      animate(vx, target[0], opts),
      animate(vy, target[1], opts),
      animate(vw, target[2], opts),
      animate(vh, target[3], opts),
    ];
    return () => controls.forEach((c) => c.stop());
  }, [active.id, bounds, reduced, vx, vy, vw, vh]);

  // Marker/label scale so pins stay ~constant on screen across district sizes
  // AND across viewports (the viewBox is framed to the stage aspect, so the
  // SVG's px-per-unit is exactly stageW / frameW).
  const uscale =
    stageW > 0 ? (MARKER_PX / MARKER_UNITS) * (frameW / stageW) : 1;

  const goActive = () => router.push(`/districts/${active.slug}`);
  const step = (delta: number) =>
    setActiveIndex((i) => (i + delta + districts.length) % districts.length);

  return (
    <div className="w-full">
      <div
        ref={stageRef}
        role="group"
        aria-label="Map of Sudurpaschim Province — one district at a time"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          } else if (e.key === "Enter") {
            e.preventDefault();
            goActive();
          }
        }}
        onPointerLeave={() => setHoverId(null)}
        className="paper-texture relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line shadow-[0_30px_60px_-30px_rgba(31,42,36,0.35)] outline-none ring-brand/40 focus-visible:ring-2"
      >
        <motion.svg
          viewBox={viewBox}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="lift" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="#1f2a24"
                floodOpacity="0.25"
              />
            </filter>
            {/* Softer shadow for the hovered (but not active) district. */}
            <filter id="lift-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodColor="#1f2a24"
                floodOpacity="0.18"
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
                stroke="#234f3a"
                strokeWidth="0.7"
                strokeOpacity="0.12"
              />
            </pattern>
          </defs>

          {/* District shapes (ordered as in districts.ts). */}
          {districts.map((d) => {
            const path = svgById[d.id];
            if (!path) return null;
            const isActive = d.id === active.id;
            const isHover = d.id === hoverId && !isActive;
            return (
              <motion.path
                key={d.id}
                d={path.d}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                filter={
                  isActive
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
                    : setActiveIndex(districts.findIndex((x) => x.id === d.id))
                }
                initial={false}
                animate={{
                  fill: isActive
                    ? ACTIVE_FILL
                    : isHover
                      ? HOVER_FILL
                      : INACTIVE_FILL,
                  stroke: isActive || isHover ? ACTIVE_STROKE : INACTIVE_STROKE,
                  strokeWidth: isActive ? 1.2 : isHover ? 1.6 : 1,
                  strokeOpacity: isActive ? 0.35 : isHover ? 0.75 : 1,
                  opacity: isActive ? 1 : isHover ? 0.92 : 0.55,
                  // The hovered district lifts off the parchment a touch.
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
            {activeSvg && (
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
                      delay: reduced ? 0 : 0.55 + i * 0.12,
                      duration: reduced ? 0 : 0.45,
                    }}
                  >
                    <g transform={`translate(${px} ${py}) scale(${uscale})`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={9}
                        fill="#f7f5f0"
                        fillOpacity={0.85}
                      />
                      <circle cx={0} cy={0} r={7.5} fill="#2f6d4f" />
                      <Glyph kind={lm.kind} />
                      <text
                        x={13}
                        y={1}
                        dominantBaseline="middle"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 15,
                          fontWeight: 600,
                          fill: "#1f2a24",
                          paintOrder: "stroke",
                          stroke: "#f7f5f0",
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
          </AnimatePresence>
        </motion.svg>

        {/*
         * Legibility scrim: the info card sits over the map, so fade the
         * parchment in from the left behind it. Pointer-transparent so the
         * districts underneath stay hoverable.
         */}
        <div
          aria-hidden
          className="hero-scrim pointer-events-none absolute inset-y-0 left-0 w-full sm:w-[62%]"
        />

        {/* Info overlay. */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
            className="pointer-events-none absolute left-5 top-5 max-w-[min(20rem,70%)] sm:left-8 sm:top-8"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              District {String(activeIndex + 1).padStart(2, "0")} ·{" "}
              {String(districts.length).padStart(2, "0")}
            </p>
            <h2 className="font-display mt-1 text-5xl font-semibold leading-none text-ink sm:text-6xl">
              {active.name}
            </h2>
            <p className="mt-2 text-sm font-medium text-brand">
              {active.tagline}
            </p>
            <p className="mt-2 hidden text-sm leading-relaxed text-ink/70 sm:block">
              {active.blurb}
            </p>
            <button
              onClick={goActive}
              className="group pointer-events-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-medium text-paper shadow-sm transition-all hover:bg-brand-dark hover:shadow-md hover:shadow-brand/20"
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
        </AnimatePresence>

        {/* Hover chip: names the district under the pointer, always legible. */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
              className="pointer-events-none absolute bottom-5 right-5 rounded-2xl border border-line bg-paper/85 px-4 py-2.5 text-right shadow-[0_10px_30px_-12px_rgba(31,42,36,0.45)] backdrop-blur sm:bottom-8 sm:right-8"
            >
              <p className="font-display text-xl font-semibold leading-tight text-ink">
                {hovered.name}
              </p>
              <p className="text-[11px] text-muted">{hovered.tagline}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
                Click to frame
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative compass rose. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-5 top-5 hidden opacity-60 sm:right-8 sm:top-8 sm:block"
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="#234f3a"
              strokeOpacity="0.35"
            />
            <path d="M28 11 L32 28 L28 33 L24 28 Z" fill="#c8623a" />
            <path
              d="M28 45 L24 28 L28 23 L32 28 Z"
              fill="#234f3a"
              opacity="0.5"
            />
            <text
              x="28"
              y="9"
              textAnchor="middle"
              style={{ fontSize: 8, fill: "#234f3a", fontWeight: 700 }}
            >
              N
            </text>
          </svg>
        </div>
      </div>

      {/* Bottom district ruler. */}
      <div className="mt-5">
        <DistrictNav
          districts={districts}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onHover={setHoverId}
        />
      </div>
    </div>
  );
}
