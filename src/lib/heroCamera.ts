import type { Bounds } from "./pathBounds";

/** `[minX, minY, width, height]` — one camera position (an SVG viewBox). */
export type Frame = [number, number, number, number];

/**
 * Fraction of a segment, either side of a stop, where the camera sits still
 * before flying on. Must stay under 0.5 so neighbouring plateaus never overlap.
 *
 * Kept modest so the camera keeps moving as you scroll — a large hold reads as
 * lag (you scroll, nothing happens, then it lurches). This leaves ~60% of each
 * segment for the fly and ~40% as dwell to read the district card.
 */
export const HOLD = 0.2;

export const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/** Zero first derivative at both ends, so plateau→fly→plateau has no jolt. */
export const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/**
 * The camera position at scroll progress `p` (0…1) across `stops`.
 *
 * Each stop owns a plateau where the camera holds still; between plateaus it
 * eases from one frame to the next. That dwell is what makes it read as a
 * camera being flown rather than a viewBox being dragged.
 */
export function frameAt(stops: Frame[], p: number): Frame {
  const n = stops.length;
  if (n < 2) return stops[0];

  const seg = 1 / (n - 1);
  const hold = HOLD * seg;
  const t = clamp(p, 0, 1);

  const k = Math.min(n - 2, Math.floor(t / seg));
  const from = stops[k];
  const to = stops[k + 1];

  const flyStart = k * seg + hold;
  const flyEnd = (k + 1) * seg - hold;
  if (t <= flyStart) return from;
  if (t >= flyEnd) return to;

  return zoomBetween(from, to, smootherstep((t - flyStart) / (flyEnd - flyStart)));
}

/**
 * The frame `u` (0…1) of the way from `from` to `to`, zoomed at an even rate.
 *
 * Blending the four numbers linearly makes a zoom-in crawl at the start and
 * rush at the end: the overview → Darchula dive more than doubles its zoom
 * speed on the way in. Changing the size geometrically zooms by the same
 * factor for every bit of scroll. The centre is tied to the size, so the map
 * still scales about the one point that stays put on screen; frames of
 * (nearly) the same size simply pan.
 */
export function zoomBetween(from: Frame, to: Frame, u: number): Frame {
  const w = from[2] * (to[2] / from[2]) ** u;
  const h = from[3] * (to[3] / from[3]) ** u;
  const dw = from[2] - to[2];
  const k = Math.abs(dw) > from[2] * 1e-4 ? (from[2] - w) / dw : u;
  const cx0 = from[0] + from[2] / 2;
  const cy0 = from[1] + from[3] / 2;
  const cx = cx0 + (to[0] + to[2] / 2 - cx0) * k;
  const cy = cy0 + (to[1] + to[3] / 2 - cy0) * k;
  return [cx - w / 2, cy - h / 2, w, h];
}

/** How far off-centre to seat the subject, as a fraction of the frame. */
export interface Seat {
  /** Positive moves the subject right, clear of a card to its left. */
  x: number;
  /** Positive lifts the subject up, clear of a card below it. */
  y: number;
}

/**
 * Slide a frame so the subject sits clear of the hero's text. Lowering minX
 * moves the artwork right; raising minY moves it up.
 */
export function seatFrame(f: Frame, seat: Seat): Frame {
  return [f[0] - f[2] * seat.x, f[1] + f[3] * seat.y, f[2], f[3]];
}

/**
 * Where to seat the subject at a given stage aspect and stop.
 *
 * Landscape: the glass card sits to the left for both the overview and each
 * district, so the subject is pushed right — a centred frame would put the card
 * straight on top of it and leave dead paper either side.
 *
 * Portrait (phones): there is no room *beside* the map, so the cards stack over
 * it. The two cards sit in different places, so they need different seats:
 *  · the overview title is centred, so the province stays put behind it — the
 *    frosted card reading over the map is the intended look;
 *  · a district card pins to the top, so the framed district drops toward the
 *    lower half to clear it. Lifting it (positive y) would shove it *under* the
 *    card, which is the bug this replaced.
 */
export function seatBias(aspect: number, isOverview: boolean): Seat {
  if (aspect > 1.15) return { x: 0.15, y: 0 };
  return { x: 0, y: isOverview ? 0 : -0.12 };
}

/** Re-export so hero camera consumers need only one import. */
export type { Bounds };
