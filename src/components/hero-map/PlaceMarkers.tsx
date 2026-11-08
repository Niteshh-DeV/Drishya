"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { MapPlace } from "@/lib/types";
import { geographicToHeroPoint } from "@/lib/placeMap";

interface PlaceMarkersProps {
  places: MapPlace[];
  markerScale: number;
  activeDistrictId?: string;
  /** True while the camera flies; the pins fade out and return on settle. */
  hidden: boolean;
  /** `pin` is the marker element, for anchoring the preview card. */
  onHover: (destination: MapPlace | null, pin?: Element) => void;
  onOpen: (destination: MapPlace, touch: boolean, pin?: Element) => void;
}

/*
 * Every pin sits inside the hero SVG, so anything that animates on one redraws
 * the whole map. The pins therefore carry no filters (a gaussian glow on each
 * of ~40 pins was the costliest part of a camera frame), and only the framed
 * district's pins pulse. Memoised so hovering a district doesn't re-render
 * every pin.
 */
export const PlaceMarkers = memo(function PlaceMarkers({
  places,
  markerScale,
  activeDistrictId,
  hidden,
  onHover,
  onOpen,
}: PlaceMarkersProps) {
  const reduced = useReducedMotion();
  const pointerType = useRef<string | undefined>(undefined);

  // Pins sprinkle in once on load; after that only the framed district's stagger.
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    setEntering(false);
  }, []);

  // Each pin's position within its own district, for the arrival stagger.
  const localIndex = useMemo(() => {
    const count: Record<string, number> = {};
    return places.map((p) => {
      const i = count[p.districtId] ?? 0;
      count[p.districtId] = i + 1;
      return i;
    });
  }, [places]);

  // Framing switches mid-flight, while the pins are hidden; hold the overview
  // look until the camera lands so the framed district's pins visibly pop.
  const focus = hidden ? undefined : activeDistrictId;

  return (
    <motion.g
      aria-label="MapPlaces"
      initial={false}
      animate={
        hidden
          ? { opacity: 0, transitionEnd: { visibility: "hidden" } }
          : { opacity: 1, visibility: "visible" }
      }
      transition={{ duration: reduced ? 0 : hidden ? 0.15 : 0.3, ease: "easeOut" }}
    >
      {places.map((destination, index) => {
        const [x, y] = geographicToHeroPoint(destination.position);
        const isCentered = destination.districtId === focus;

        return (
          <motion.g
            key={destination.id}
            role="button"
            tabIndex={0}
            aria-label={`Open ${destination.name}`}
            className="place-marker pointer-events-auto cursor-pointer outline-none"
            style={{
              transformOrigin: `${x}px ${y}px`,
              pointerEvents: "all",
            }}
            initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            animate={{
              opacity: focus && !isCentered ? 0.62 : 1,
              scale: isCentered ? 1.12 : 1,
            }}
            transition={{
              delay: reduced
                ? 0
                : entering
                  ? 0.6 + index * 0.03
                  : isCentered
                    ? 0.08 + Math.min(localIndex[index], 6) * 0.06
                    : 0,
              type: "spring",
              stiffness: 300,
              damping: 28,
              mass: 0.7,
            }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") onHover(destination, event.currentTarget);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") onHover(null);
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
              pointerType.current = event.pointerType;
            }}
            // A click, not a pointerdown: a finger that lands on a pin to
            // scroll the page mustn't open it.
            onClick={(event) => {
              event.stopPropagation();
              onOpen(destination, pointerType.current === "touch", event.currentTarget);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(destination, false);
              }
            }}
          >
            <g transform={`translate(${x} ${y}) scale(${markerScale})`}>
              <circle r={16} fill="transparent" pointerEvents="all" />
              {isCentered && (
                <circle
                  r={10}
                  className="place-marker-pulse"
                  fill="none"
                  stroke="var(--color-dock-text)"
                  strokeWidth={2.2}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {/* A soft halo stands in for the old blur glow. */}
              <circle r={8.5} fill="var(--color-dock-text)" fillOpacity={0.2} />
              <circle
                r={5}
                fill="var(--color-dock-text)"
                fillOpacity={0.96}
                stroke="var(--color-stone)"
                strokeWidth={0.9}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </motion.g>
        );
      })}
    </motion.g>
  );
});
