"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BASE_TILES, teardropPin } from "@/components/map/leaflet";

const pin = teardropPin("var(--color-brass)", "story-map-pin");

export interface StoryMapPlace {
  id: string;
  name: string;
  href: string;
  position: [number, number];
}

/**
 * Every place a story mentions, framed together. One place opens at the
 * same zoom as a destination page; several fit inside the view.
 */
export function StoryMap({ places }: { places: StoryMapPlace[] }) {
  const single = places.length === 1;
  const bounds = single
    ? undefined
    : L.latLngBounds(places.map((p) => p.position)).pad(0.25);

  return (
    <div className="h-72 overflow-hidden rounded-2xl border border-line sm:h-96">
      <MapContainer
        {...(single ? { center: places[0].position, zoom: 11 } : { bounds })}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer {...BASE_TILES} />
        {places.map((place) => (
          <Marker key={place.id} position={place.position} icon={pin} title={place.name}>
            <Popup>
              <a href={place.href}>{place.name}</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
