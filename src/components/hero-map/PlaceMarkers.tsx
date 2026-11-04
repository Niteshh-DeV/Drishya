"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { MapPlace } from "@/lib/types";
import { geographicToHeroPoint } from "@/lib/placeMap";

interface PlaceMarkersProps {
  places: MapPlace[];
  markerScale: number;
  activeDistrictId?: string;
  onHover: (
    destination: MapPlace | null,
    event?: ReactPointerEvent<SVGGElement>,
  ) => void;
  onOpen: (
    destination: MapPlace,
    event?: ReactPointerEvent<SVGGElement>,
  ) => void;
}

export function PlaceMarkers({
  places,
  markerScale,
  activeDistrictId,
  onHover,
  onOpen,
}: PlaceMarkersProps) {
  const reduced = useReducedMotion();

  return (
    <g aria-label="MapPlaces">
      {places.map((destination, index) => {
        const [x, y] = geographicToHeroPoint(destination.position);
        const isCentered = destination.districtId === activeDistrictId;

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
              opacity: activeDistrictId && !isCentered ? 0.62 : 1,
              scale: isCentered ? 1.12 : 1,
            }}
            transition={{
              delay: reduced ? 0 : isCentered ? 0.12 + index * 0.08 : 0.6 + index * 0.12,
              type: "spring",
              stiffness: 300,
              damping: 28,
              mass: 0.7,
            }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") onHover(destination, event);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") onHover(null, event);
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
              onOpen(destination, event);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(destination);
              }
            }}
          >
            <g transform={`translate(${x} ${y}) scale(${markerScale})`}>
              <circle r={16} fill="transparent" pointerEvents="all" />
              <circle
                r={10}
                className="place-marker-pulse"
                fill="none"
                stroke="var(--color-dock-text)"
                strokeWidth={2.2}
                vectorEffect="non-scaling-stroke"
                filter="url(#marker-glow)"
              />
              <circle
                r={5}
                fill="var(--color-dock-text)"
                fillOpacity={0.96}
                stroke="var(--color-stone)"
                strokeWidth={0.9}
                vectorEffect="non-scaling-stroke"
                filter="url(#marker-glow)"
              />
            </g>
          </motion.g>
        );
      })}
    </g>
  );
}
