"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type {
  District,
  DistrictFeatureCollection,
  DistrictFeatureProperties,
  PoiCategory,
} from "@/lib/types";
import { poisForDistrict } from "@/data/sample-pois";

/*
 * Marker colours follow the palette's roles: forest for guides, slate-teal for
 * stays, brass for hidden gems (the palette's named "hidden gem" accent).
 */
const CATEGORY_COLOR: Record<PoiCategory, string> = {
  guide: "#1f3d2b",
  stay: "#364a45",
  "hidden-gem": "#b68d4c",
};

const CATEGORY_LABEL: Record<PoiCategory, string> = {
  guide: "Guides",
  stay: "Stays",
  "hidden-gem": "Hidden gems",
};

/** Fits the map viewport to the district polygon once it has loaded. */
function FitToFeature({ feature }: { feature: Feature }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.geoJSON(feature).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [feature, map]);
  return null;
}

export default function DistrictMap({ district }: { district: District }) {
  const [feature, setFeature] = useState<Feature<
    Geometry,
    DistrictFeatureProperties
  > | null>(null);
  const pois = poisForDistrict(district.id);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/sudurpaschim-districts.simplified.geojson")
      .then((r) => r.json())
      .then((fc: DistrictFeatureCollection) => {
        if (cancelled) return;
        setFeature(fc.features.find((f) => f.properties.id === district.id) ?? null);
      })
      .catch(() => {
        /* leave feature null — tiles + markers still render */
      });
    return () => {
      cancelled = true;
    };
  }, [district.id]);

  return (
    <div className="relative h-[65vh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-line">
      <MapContainer
        center={district.center}
        zoom={9}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {feature && (
          <>
            <GeoJSON
              data={feature}
              style={{
                color: "#1f3d2b",
                weight: 2,
                fillColor: "#1f3d2b",
                fillOpacity: 0.1,
              }}
            />
            <FitToFeature feature={feature} />
          </>
        )}
        {pois.map((poi) => (
          <CircleMarker
            key={poi.id}
            center={poi.position}
            radius={8}
            pathOptions={{
              color: "#f6f5f2",
              weight: 2,
              fillColor: CATEGORY_COLOR[poi.category],
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              {poi.name}
            </Tooltip>
            <Popup>
              <strong>{poi.name}</strong>
              <br />
              <span style={{ textTransform: "capitalize" }}>
                {poi.category.replace("-", " ")}
              </span>
              <br />
              {poi.description}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-xl border border-line bg-paper/95 px-3 py-2 text-xs shadow-sm">
        <p className="mb-1 font-semibold uppercase tracking-[0.14em] text-muted">
          Legend
        </p>
        <ul className="space-y-1">
          {(Object.keys(CATEGORY_LABEL) as PoiCategory[]).map((c) => (
            <li key={c} className="flex items-center gap-2 text-ink/80">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLOR[c] }}
              />
              {CATEGORY_LABEL[c]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
