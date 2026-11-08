"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getDistrict } from "@/data/districts";
import { clamp } from "@/lib/heroCamera";
import type { MapPlace } from "@/lib/types";
import { cloudinaryUrl } from "@/lib/images";
import { destinationHref } from "@/lib/site";

const CARD_W = 320;
/** Rough card height, for keeping it inside the stage. */
const CARD_H = 104;
/** How far the photo hangs off the card's left edge. */
const PHOTO_OUT = 44;
const GAP = 16;
const EDGE = 12;
/** Keeps the overhanging photo clear of the floating dock. */
const TOP_CLEAR = 96;
/**
 * Below this stage width a card beside the pin runs off a phone screen, so it
 * docks along the bottom over the district ruler instead (same inset as the
 * ruler's tray). Tapping the map closes it and brings the ruler back.
 */
const DOCK_BELOW = 640;

interface PlaceHoverCardProps {
  destination: MapPlace | null;
  /** The pin's centre in stage pixels. */
  position: { x: number; y: number } | null;
  stage: { w: number; h: number };
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

export function PlaceHoverCard({
  destination,
  position,
  stage,
  onPointerEnter,
  onPointerLeave,
}: PlaceHoverCardProps) {
  const reduced = useReducedMotion();
  const docked = stage.w > 0 && stage.w < DOCK_BELOW;

  // Beside the pin: to the right if the card and its photo fit, else to the
  // left, and clamped inside the stage either way.
  let left = 0;
  let top = 0;
  if (position && !docked) {
    const fitsRight = position.x + GAP + PHOTO_OUT + CARD_W + EDGE <= stage.w;
    const fitsLeft = position.x - GAP - CARD_W - PHOTO_OUT >= EDGE;
    left = clamp(
      !fitsRight && fitsLeft ? position.x - GAP - CARD_W : position.x + GAP + PHOTO_OUT,
      EDGE + PHOTO_OUT,
      stage.w - CARD_W - EDGE,
    );
    top = clamp(position.y - CARD_H / 2, TOP_CLEAR, stage.h - CARD_H - EDGE);
  }

  const image = destination?.coverUrl;
  const photoClass = docked
    ? "h-20 w-20 shrink-0 object-cover"
    : "absolute -left-11 -top-6 h-28 w-28 object-cover shadow-lg";

  return (
    <AnimatePresence>
      {destination && position && (
        <motion.div
          key={destination.id}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          // Taps on the card mustn't reach the stage, which closes it.
          onClick={(event) => event.stopPropagation()}
          className="pointer-events-auto absolute z-30"
          style={
            docked
              ? { left: EDGE, right: EDGE, bottom: 16 }
              : { left, top, width: CARD_W }
          }
          initial={{
            opacity: 0,
            y: reduced ? 0 : docked ? 24 : 14,
            scale: reduced || docked ? 1 : 0.94,
            filter: reduced || docked ? "none" : "blur(5px)",
          }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            y: reduced ? 0 : docked ? 24 : 8,
            scale: reduced || docked ? 1 : 0.97,
            filter: reduced || docked ? "none" : "blur(3px)",
          }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 360,
                  damping: 30,
                  mass: 0.7,
                }
          }
        >
          <Link
            href={destinationHref(destination)}
            aria-label={`Explore ${destination.name}`}
            className={`group relative flex min-h-24 items-center bg-place-card text-place-ink shadow-[0_20px_45px_-20px_color-mix(in_srgb,var(--color-forest-deep)_55%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-place-ink ${
              docked ? "gap-4 p-3 pr-4" : "px-5 py-5 pl-24"
            }`}
          >
            {image ? (
              <img
                src={cloudinaryUrl(image, 224)}
                alt=""
                decoding="async"
                className={photoClass}
              />
            ) : (
              <div aria-hidden className={`${photoClass} bg-forest/15`} />
            )}
            <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
              <div className="min-w-0">
                {docked && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-place-ink/70">
                    {getDistrict(destination.districtId)?.name}
                  </p>
                )}
                <h2 className="font-display text-xl font-semibold leading-tight sm:text-2xl">
                  {destination.name}
                </h2>
              </div>
              <span
                aria-hidden
                className="shrink-0 p-1 text-2xl leading-none transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
