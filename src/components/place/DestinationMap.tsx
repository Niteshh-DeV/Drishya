"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BASE_TILES, teardropPin } from "@/components/map/leaflet";

const destinationPin = teardropPin("var(--color-brass)", "destination-map-pin");

export function DestinationMap({
  name,
  position,
}: {
  name: string;
  position: [number, number];
}) {
  return (
    <div className="h-64 overflow-hidden rounded-2xl border border-line sm:h-80">
      <MapContainer
        center={position}
        zoom={12}
        scrollWheelZoom
        dragging
        doubleClickZoom
        touchZoom
        zoomControl
        className="h-full w-full"
      >
        <TileLayer {...BASE_TILES} />
        <Marker position={position} icon={destinationPin} title={name}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
