"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type {
  District,
  DistrictFeatureCollection,
  DistrictFeatureProperties,
  MapPlace,
} from "@/lib/types";
import { BASE_TILES, KHAPTAD_DISTRICTS } from "@/components/map/leaflet";
import { MapGestures } from "@/components/map/MapGestures";
import { MapPlaceCard } from "@/components/map/MapPlaceCard";
import { PlaceMarkers } from "@/components/map/PlaceMarkers";
import { usePlacePreview } from "@/components/map/usePlacePreview";

type ParkFeature = Feature<Geometry, { name?: string }>;

/**
 * Frames the district and its pins once the boundary has loaded, then keeps
 * the view near it: you can zoom out one step and pan a little past the
 * border, not off to the plains of India.
 */
function FitToFeature({ feature, places }: { feature: Feature; places: MapPlace[] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.geoJSON(feature).getBounds();
    places.forEach((place) => bounds.extend(place.position));
    if (!bounds.isValid()) return;
    map.fitBounds(bounds, { padding: [28, 28], animate: false });
    map.setMinZoom(Math.max(map.getZoom() - 1, 6));
    map.setMaxBounds(bounds.pad(0.6));
  }, [places, feature, map]);
  return null;
}

export default function DistrictMap({
  district,
  places,
}: {
  district: District;
  places: MapPlace[];
}) {
  const frame = useRef<HTMLDivElement>(null);
  const { place, point, size, preview, leave, keep, clear } = usePlacePreview(frame);
  const [feature, setFeature] = useState<Feature<Geometry, DistrictFeatureProperties> | null>(null);
  const [parkFeature, setParkFeature] = useState<ParkFeature | null>(null);
  const showsPark = KHAPTAD_DISTRICTS.has(district.id);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/sudurpaschim-districts.simplified.geojson")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load district boundaries");
        return response.json() as Promise<DistrictFeatureCollection>;
      })
      .then((fc) => {
        if (!cancelled) setFeature(fc.features.find((f) => f.properties.id === district.id) ?? null);
      })
      .catch(() => {
        /* leave feature null — tiles + markers still render */
      });
    return () => {
      cancelled = true;
    };
  }, [district.id]);

  // Khaptad National Park reaches into four districts; draw it on each.
  useEffect(() => {
    if (!showsPark) return;
    let cancelled = false;
    fetch("/data/khaptad-national-park.geojson")
      .then((r) => r.json())
      .then((fc: { features?: ParkFeature[] }) => {
        if (!cancelled) setParkFeature(fc.features?.[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setParkFeature(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showsPark]);

  return (
    <div
      ref={frame}
      className="relative h-[65vh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-line"
    >
      <MapContainer
        center={district.center}
        zoom={9}
        zoomSnap={0.25}
        dragging
        doubleClickZoom
        touchZoom
        zoomControl
        className="h-full w-full"
      >
        <TileLayer {...BASE_TILES} />
        <MapGestures />
        {feature && (
          <>
            <GeoJSON
              data={feature}
              interactive={false}
              style={{
                color: "var(--color-forest)",
                weight: 2,
                fillColor: "var(--color-forest)",
                fillOpacity: 0.1,
              }}
            />
            <FitToFeature feature={feature} places={places} />
          </>
        )}
        {parkFeature && (
          <GeoJSON
            data={parkFeature}
            interactive={false}
            style={{
              color: "var(--color-brass)",
              weight: 2.5,
              dashArray: "7 5",
              fillColor: "var(--color-brass)",
              fillOpacity: 0.12,
            }}
          />
        )}
        <PlaceMarkers
          places={places}
          activeId={place?.id ?? null}
          onPreview={preview}
          onLeave={leave}
          onDismiss={clear}
        />
      </MapContainer>

      <MapPlaceCard place={place} point={point} size={size} onPointerEnter={keep} onPointerLeave={leave} />

      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-xl border border-line bg-paper/95 px-3 py-2 text-xs shadow-sm">
        <p className="mb-1 font-semibold uppercase tracking-[0.14em] text-muted">Legend</p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2 text-ink/80">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-forest" />
            Destination
          </li>
          <li className="flex items-center gap-2 text-ink/80">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-brass" />
            Hidden gem
          </li>
          {parkFeature && (
            <li className="flex items-center gap-2 text-ink/80">
              <span className="inline-block h-0 w-5 border-t-2 border-dashed border-brass" />
              Khaptad National Park
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
