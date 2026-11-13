"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { BASE_TILES, PROVINCE_BOUNDS } from "@/components/map/leaflet";
import { MapGestures } from "@/components/map/MapGestures";
import { MapPlaceCard } from "@/components/map/MapPlaceCard";
import { PlaceMarkers } from "@/components/map/PlaceMarkers";
import { usePlacePreview } from "@/components/map/usePlacePreview";
import type { MapPlace } from "@/lib/types";

/** The traveller's own location: an ink dot in a paper ring. */
const herePin = L.divIcon({
  className: "",
  html: `<span style="display:block;width:16px;height:16px;border-radius:999px;background:var(--color-ink);border:3px solid var(--color-paper);box-shadow:0 0 0 6px color-mix(in srgb,var(--color-ink) 18%,transparent)"></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

/**
 * Frames the results whenever they change: at once the first time, then a
 * short flight, so changing a filter shows where the new shortlist lies.
 */
function FitResults({ points }: { points: [number, number][] }) {
  const map = useMap();
  const reduced = useReducedMotion();
  const framed = useRef(false);

  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points).pad(0.2);
    if (framed.current && !reduced) {
      map.flyToBounds(bounds, { maxZoom: 11, duration: 0.9 });
    } else {
      map.fitBounds(bounds, { maxZoom: 11, animate: false });
    }
    framed.current = true;
  }, [map, points, reduced]);

  return null;
}

/**
 * The planner's shortlist on the province map. `activeId` lifts the pin of
 * the card under the pointer; `here` is the traveller's location, drawn
 * only when it falls inside the province.
 */
export function PlanMap({
  places,
  activeId,
  here,
}: {
  places: MapPlace[];
  activeId: string | null;
  here: [number, number] | null;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const { place, point, size, preview, leave, keep, clear } = usePlacePreview(frame);
  const inside = here && PROVINCE_BOUNDS.contains(here) ? here : null;

  const points = useMemo(
    () => [...places.map((p) => p.position), ...(inside ? [inside] : [])],
    [places, inside],
  );

  return (
    <div
      ref={frame}
      className="relative h-[22rem] overflow-hidden rounded-3xl border border-line sm:h-[26rem]"
    >
      <MapContainer
        center={[29.3, 80.9]}
        zoom={8}
        zoomSnap={0.25}
        minZoom={7}
        maxBounds={PROVINCE_BOUNDS}
        className="h-full w-full"
      >
        <TileLayer {...BASE_TILES} />
        <MapGestures />
        <FitResults points={points} />
        {inside && <Marker position={inside} icon={herePin} title="You are here" interactive={false} />}
        <PlaceMarkers
          places={places}
          activeId={activeId ?? place?.id ?? null}
          onPreview={preview}
          onLeave={leave}
          onDismiss={clear}
        />
      </MapContainer>

      <MapPlaceCard place={place} point={point} size={size} onPointerEnter={keep} onPointerLeave={leave} />

      <ul className="pointer-events-none absolute bottom-4 right-4 z-[1000] flex gap-3 rounded-full border border-line bg-paper/90 px-4 py-2 text-[11px] text-ink/80 shadow-sm backdrop-blur">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-forest" /> Destination
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brass" /> Hidden gem
        </li>
        {inside && (
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink" /> You
          </li>
        )}
      </ul>
    </div>
  );
}
