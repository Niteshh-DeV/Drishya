"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import type { FeatureCollection, Geometry } from "geojson";
import type { MapPlace } from "@/lib/types";
import { destinationHref } from "@/lib/site";
import { BASE_TILES, teardropPin } from "@/components/map/leaflet";

const pin = teardropPin("var(--color-forest)", "region-destination-pin");
const gemPin = teardropPin("var(--color-brass)", "region-destination-pin");

type DistrictBoundaries = FeatureCollection<
  Geometry,
  { id: string; name: string; province: string }
>;

function FitRegion({
  boundaries,
  places,
}: {
  boundaries: DistrictBoundaries | null;
  places: MapPlace[];
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = boundaries
      ? L.geoJSON(boundaries as never).getBounds()
      : L.latLngBounds([]);
    places.forEach((place) => bounds.extend(place.position));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [boundaries, places, map]);

  return null;
}

export function RegionMap({ places }: { places: MapPlace[] }) {
  const [boundaries, setBoundaries] = useState<DistrictBoundaries | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/data/sudurpaschim-districts.simplified.geojson")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load district boundaries");
        return response.json() as Promise<DistrictBoundaries>;
      })
      .then((data) => {
        if (!cancelled) setBoundaries(data);
      })
      .catch(() => {
        if (!cancelled) setBoundaries(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-[min(72vh,52rem)] min-h-[34rem] overflow-hidden rounded-3xl border border-line shadow-[0_25px_70px_-35px_color-mix(in_srgb,var(--color-forest-deep)_45%,transparent)]">
      <MapContainer
        center={[29.2, 80.9]}
        zoom={8}
        zoomSnap={0.25}
        scrollWheelZoom
        dragging
        doubleClickZoom
        touchZoom
        zoomControl
        className="h-full w-full"
      >
        <TileLayer {...BASE_TILES} />
        <FitRegion boundaries={boundaries} places={places} />
        {boundaries && (
          <>
            <GeoJSON
              data={boundaries}
              style={{
                color: "var(--color-forest-deep)",
                weight: 4,
                opacity: 0.95,
                fillColor: "var(--color-forest)",
                fillOpacity: 0.035,
              }}
            />
            <GeoJSON
              data={boundaries}
              style={(feature) => ({
                color:
                  feature?.properties?.id === "bajhang"
                    ? "var(--color-brass)"
                    : "var(--color-forest)",
                weight: 1.5,
                opacity: 0.8,
                fillColor: "var(--color-paper)",
                fillOpacity: 0.02,
              })}
              onEachFeature={(feature, layer) => {
                layer.bindTooltip(feature.properties.name, {
                  sticky: true,
                  direction: "center",
                  className: "region-district-label",
                });
              }}
            />
          </>
        )}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.position}
            icon={place.hiddenGem ? gemPin : pin}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              <span>{place.shortDescription}</span>
              <br />
              <a href={destinationHref(place)}>View place →</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
