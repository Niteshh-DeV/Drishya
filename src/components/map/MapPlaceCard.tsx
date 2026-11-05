"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getDistrict } from "@/data/districts";
import { cloudinaryUrl } from "@/lib/images";
import { destinationHref } from "@/lib/site";
import type { MapPlace } from "@/lib/types";

const CARD_W = 272;
const GAP = 22;
const EDGE = 12;
/** Below this map width a side card would cover its own pin. */
const DOCK_BELOW = 640;

/**
 * Preview card for the pin under the pointer (or the one tapped on a
 * phone). On a wide map it opens on whichever side of the pin has room and
 * is clamped inside the map; on a narrow one it docks along the bottom
 * edge, clear of the pin. The whole card opens the place. `point` is the
 * pin's tip in map-container pixels; `size` is the container.
 */
export function MapPlaceCard({
  place,
  point,
  size,
  onPointerEnter,
  onPointerLeave,
}: {
  place: MapPlace | null;
  point: { x: number; y: number } | null;
  size: { w: number; h: number };
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}) {
  const reduced = useReducedMotion();
  const cardH = place?.coverUrl ? 268 : 150;
  const docked = size.w > 0 && size.w < DOCK_BELOW;

  let left = 0;
  let top = 0;
  let fromRight = false;
  if (point && !docked) {
    // The pin's body sits ~20px above its tip; centre the card on it.
    const pinY = point.y - 20;
    fromRight = point.x + GAP + CARD_W + EDGE > size.w && point.x - GAP - CARD_W > EDGE;
    left = fromRight ? point.x - GAP - CARD_W : Math.min(point.x + GAP, size.w - CARD_W - EDGE);
    top = Math.max(EDGE, Math.min(pinY - cardH / 2, size.h - cardH - EDGE));
  }

  return (
    <AnimatePresence>
      {place && point && (
        <motion.div
          key={place.id}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          className="glass-strong pointer-events-auto absolute z-[1001] overflow-hidden rounded-2xl text-ink"
          style={docked ? { left: EDGE, right: EDGE, bottom: EDGE } : { left, top, width: CARD_W }}
          initial={{
            opacity: 0,
            x: reduced || docked ? 0 : fromRight ? 10 : -10,
            y: reduced || !docked ? 0 : 14,
            scale: reduced || docked ? 1 : 0.97,
          }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced || !docked ? 0 : 14, scale: reduced || docked ? 1 : 0.97 }}
          transition={reduced ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href={destinationHref(place)} className={`group block ${docked ? "flex" : ""}`}>
          {place.coverUrl && (
            <img
              src={cloudinaryUrl(place.coverUrl, 560)}
              alt=""
              decoding="async"
              className={docked ? "w-28 shrink-0 bg-stone/30 object-cover" : "h-32 w-full bg-stone/30 object-cover"}
            />
          )}
          <div className={docked ? "min-w-0 p-3.5" : "p-4"}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              {getDistrict(place.districtId)?.name}
              {place.hiddenGem && <span className="text-accent-ink"> · Hidden gem</span>}
            </p>
            <h3 className="font-display mt-1 text-[1.45rem] leading-tight text-ink transition-colors group-hover:text-accent-ink">
              {place.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
              {place.shortDescription}
            </p>
            <span className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">
              Open place <span aria-hidden className="card-arrow">→</span>
            </span>
          </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
