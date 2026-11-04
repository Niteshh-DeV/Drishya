"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MapPlace } from "@/lib/types";
import { cloudinaryUrl } from "@/lib/images";
import { destinationHref } from "@/lib/site";

interface PlaceHoverCardProps {
  destination: MapPlace | null;
  position: { x: number; y: number } | null;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

export function PlaceHoverCard({
  destination,
  position,
  onPointerEnter,
  onPointerLeave,
}: PlaceHoverCardProps) {
  const reduced = useReducedMotion();
  const image = destination?.coverUrl;
  const viewportWidth =
    typeof window === "undefined" ? 1024 : window.innerWidth;
  const flipLeft = position ? position.x > viewportWidth - 330 : false;

  return (
    <AnimatePresence>
      {destination && position && (
        <div
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          className="place-hover-card pointer-events-auto absolute z-30 w-[min(20rem,calc(100vw-2rem))]"
          style={{
            left: position.x,
            top: position.y,
            transform: `translate(${flipLeft ? "-100%" : "1rem"}, -50%)`,
          }}
        >
          <motion.div
            key={destination.id}
            initial={{
              opacity: 0,
              y: reduced ? 0 : 14,
              scale: reduced ? 1 : 0.94,
              filter: reduced ? "none" : "blur(5px)",
            }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              y: reduced ? 0 : 8,
              scale: reduced ? 1 : 0.97,
              filter: reduced ? "none" : "blur(3px)",
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
            className="relative flex min-h-24 items-center bg-place-card px-5 py-5 pl-24 text-place-ink shadow-[0_20px_45px_-20px_color-mix(in_srgb,var(--color-forest-deep)_55%,transparent)]"
          >
            {image ? (
              <motion.img
                layoutId={destination.slug}
                src={cloudinaryUrl(image, 224)}
                alt=""
                decoding="async"
                className="absolute -left-11 -top-6 h-28 w-28 object-cover shadow-lg"
              />
            ) : (
              <div
                aria-hidden
                className="absolute -left-11 -top-6 h-28 w-28 bg-forest/15 shadow-lg"
              />
            )}
            <div className="flex min-w-0 items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold leading-tight sm:text-2xl">
                {destination.name}
              </h2>
              <Link
                href={destinationHref(destination)}
                aria-label={`Explore ${destination.name}`}
                className="group shrink-0 rounded-full p-1 text-place-ink transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-place-ink"
              >
                <span aria-hidden className="text-2xl leading-none">
                  →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
