"use client";

import { useEffect, useRef } from "react";
import type L from "leaflet";
import { useRouter } from "next/navigation";
import { Marker, useMap } from "react-leaflet";
import { placePin } from "@/components/map/leaflet";
import { destinationHref } from "@/lib/site";
import type { MapPlace } from "@/lib/types";

/**
 * Destination pins shared by the district maps and the province map.
 *
 * - Pointer: hovering a pin previews it (`onPreview` with the pin's tip in
 *   container pixels); clicking opens the place.
 * - Touch: the first tap previews, a second tap on the same pin opens it.
 *   Leaflet 1.9 reports taps as plain clicks, so the pointer type is read
 *   from the `pointerdown` that started them.
 * - Keyboard: pins are focusable; Enter opens the place.
 *
 * `activeId` lifts and enlarges one pin (hovered here or in a list);
 * `isDimmed` fades pins outside the current filter. Both are classes on the
 * pin's existing element, so icons are never rebuilt.
 */
export function PlaceMarkers({
  places,
  activeId,
  isDimmed,
  onPreview,
  onLeave,
  onDismiss,
}: {
  places: MapPlace[];
  activeId: string | null;
  isDimmed?: (place: MapPlace) => boolean;
  onPreview: (place: MapPlace, point: { x: number; y: number }) => void;
  onLeave: () => void;
  /** The map moved or was tapped away from a pin: close the preview. */
  onDismiss: () => void;
}) {
  const map = useMap();
  const router = useRouter();
  const markers = useRef(new Map<string, L.Marker>());
  const lastPointer = useRef<string>("mouse");
  const tapped = useRef<string | null>(null);

  useEffect(() => {
    const container = map.getContainer();
    const onPointerDown = (event: PointerEvent) => {
      lastPointer.current = event.pointerType;
    };
    container.addEventListener("pointerdown", onPointerDown, true);
    // A preview pinned to pixels would drift off its pin once the map
    // moves; a tap on open map is how a phone closes it.
    const dismiss = () => {
      tapped.current = null;
      onDismiss();
    };
    map.on("movestart zoomstart click", dismiss);
    return () => {
      container.removeEventListener("pointerdown", onPointerDown, true);
      map.off("movestart zoomstart click", dismiss);
    };
  }, [map, onDismiss]);

  useEffect(() => {
    for (const place of places) {
      const element = markers.current.get(place.id)?.getElement();
      element?.classList.toggle("is-active", place.id === activeId);
      element?.classList.toggle("is-dim", Boolean(isDimmed?.(place)));
    }
  }, [places, activeId, isDimmed]);

  const preview = (place: MapPlace) => onPreview(place, map.latLngToContainerPoint(place.position));
  const open = (place: MapPlace) => router.push(destinationHref(place));

  return (
    <>
      {places.map((place, index) => (
        <Marker
          key={place.id}
          ref={(marker) => {
            if (marker) markers.current.set(place.id, marker);
            else markers.current.delete(place.id);
          }}
          position={place.position}
          icon={placePin(place.hiddenGem, index)}
          title={place.name}
          alt={place.name}
          riseOnHover
          eventHandlers={{
            mouseover: () => {
              if (lastPointer.current === "mouse") preview(place);
            },
            mouseout: () => {
              if (lastPointer.current === "mouse") onLeave();
            },
            click: () => {
              if (lastPointer.current !== "mouse" && tapped.current !== place.id) {
                tapped.current = place.id;
                preview(place);
                return;
              }
              tapped.current = null;
              open(place);
            },
            keypress: (event) => {
              if ((event.originalEvent as KeyboardEvent).key === "Enter") open(place);
            },
          }}
        />
      ))}
    </>
  );
}
