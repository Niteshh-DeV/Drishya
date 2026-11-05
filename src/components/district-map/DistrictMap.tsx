"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useRouter } from "next/navigation";
import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Feature, Geometry } from "geojson";
import type {
  District,
  DistrictFeatureCollection,
  DistrictFeatureProperties,
  MapPlace,
} from "@/lib/types";
import { cloudinaryUrl } from "@/lib/images";
import { destinationHref } from "@/lib/site";
import { BASE_TILES } from "@/components/map/leaflet";

type ParkFeature = Feature<Geometry, { name?: string }>;

const MARKER_COLOR = {
  destination: "var(--color-forest)",
  hiddenGem: "var(--color-brass)",
};

const MARKER_LABEL = {
  destination: "Destination",
  hiddenGem: "Hidden gem",
  park: "Khaptad National Park",
};

const destinationIconCache = new Map<string, L.DivIcon>();

function MapPlaceCard({
  destination,
  point,
  district,
  onPointerEnter,
  onPointerLeave,
}: {
  destination: MapPlace | null;
  point: { x: number; y: number } | null;
  district: District;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}) {
  const reduced = useReducedMotion();
  const image = destination?.coverUrl;
  const flipLeft = point ? point.x > 280 : false;

  return (
    <AnimatePresence>
      {destination && point && (
        <div
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          className="pointer-events-auto absolute z-[1001] w-[min(17rem,calc(100%-2rem))]"
          style={{
            left: point.x,
            top: point.y,
            transform: `translate(${flipLeft ? "-100%" : "1rem"}, -50%)`,
          }}
        >
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.96 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 360, damping: 28, mass: 0.7 }
            }
            className="relative bg-place-card p-3.5 pl-4 text-place-ink shadow-[0_20px_45px_-20px_color-mix(in_srgb,var(--color-forest-deep)_60%,transparent)]"
          >
            {image ? (
              <img
                src={cloudinaryUrl(image, 224)}
                alt=""
                decoding="async"
                className="absolute -left-14 -top-12 h-24 w-28 object-cover shadow-lg"
              />
            ) : (
              <div
                aria-hidden
                className="absolute -left-14 -top-12 h-24 w-28 bg-forest/15 shadow-lg"
              />
            )}
            <div className="pl-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-place-ink/65">
                {district.name}
              </p>
              <h3 className="font-display mt-1 text-xl font-semibold leading-tight">
                {destination.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-place-ink/75">
                {destination.shortDescription}
              </p>
              <a
                href={destinationHref(destination)}
                className="mt-2 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-place-ink"
              >
                View place →
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MarkerGlow() {
  return (
    <svg aria-hidden className="absolute h-0 w-0">
      <defs>
        <filter id="district-marker-glow" x="-250%" y="-250%" width="600%" height="600%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function destinationIcon(
  isCentered: boolean,
  isHiddenGem: boolean,
  index: number,
) {
  const cacheKey = `${isCentered ? "centered" : "default"}-${
    isHiddenGem ? "hidden" : "destination"
  }-${index}`;
  const cachedIcon = destinationIconCache.get(cacheKey);
  if (cachedIcon) return cachedIcon;

  const color = isHiddenGem
    ? "var(--color-brass)"
    : "var(--color-forest)";
  const size = isCentered ? 38 : 32;
  const height = isCentered ? 46 : 40;

  const icon = L.divIcon({
    className: "district-destination-pin",
    html: `
      <svg aria-hidden="true" width="${size}" height="${height}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="--pin-delay: ${index * 90}ms">
        <path d="M16 39C16 39 29 25.4 29 14.5C29 7.596 23.18 2 16 2C8.82 2 3 7.596 3 14.5C3 25.4 16 39 16 39Z" fill="${color}" stroke="var(--color-paper)" stroke-width="2.5"/>
        <circle cx="16" cy="14.5" r="${isCentered ? 5.5 : 4.5}" fill="var(--color-paper)"/>
      </svg>
    `,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
  });
  destinationIconCache.set(cacheKey, icon);
  return icon;
}

function MapMarkerLayer({
  district,
  destinations,
  onHover,
}: {
  district: District;
  destinations: MapPlace[];
  onHover: (
    destination: MapPlace | null,
    point?: { x: number; y: number },
  ) => void;
}) {
  const map = useMap();
  const router = useRouter();
  const [centered, setCentered] = useState<MapPlace | null>(null);
  const touchTarget = useRef<string | null>(null);

  const showPlace = (destination: MapPlace) => {
    const point = map.latLngToContainerPoint(destination.position);
    onHover(destination, point);
  };

  useEffect(() => {
    const update = () => {
      const center = map.getCenter();
      const visible = destinations
        .map((destination) => ({
          destination,
          distance: map.distance(L.latLng(destination.position), center),
        }))
        .sort((a, b) => a.distance - b.distance)[0]?.destination;
      setCentered(visible ?? null);
    };
    update();
    map.on("moveend zoomend", update);
    return () => {
      map.off("moveend zoomend", update);
    };
  }, [destinations, map]);

  return (
    <>
      {destinations.map((destination, index) => {
        const isCentered = centered?.id === destination.id;
        return (
          <Marker
            key={destination.id}
            position={destination.position}
            icon={destinationIcon(isCentered, destination.hiddenGem, index)}
            eventHandlers={{
              mouseover: (event) => {
                const point = map.latLngToContainerPoint(event.latlng);
                onHover(destination, point);
              },
              mouseout: () => onHover(null),
              click: (event) => {
                const isTouch =
                  event.originalEvent.type === "touchend" ||
                  event.originalEvent.type === "touchstart";
                if (isTouch) {
                  if (touchTarget.current === destination.id) {
                    router.push(destinationHref(destination));
                    touchTarget.current = null;
                  } else {
                    touchTarget.current = destination.id;
                    showPlace(destination);
                  }
                  return;
                }
                router.push(destinationHref(destination));
              },
            }}
          />
        );
      })}
    </>
  );
}

/** Fits the map viewport to the district polygon once it has loaded. */
function FitToFeature({
  feature,
  destinations,
}: {
  feature: Feature;
  destinations: MapPlace[];
}) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.geoJSON(feature).getBounds();
    destinations.forEach((destination) => bounds.extend(destination.position));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [destinations, feature, map]);
  return null;
}

export default function DistrictMap({
  district,
  places: destinations,
}: {
  district: District;
  places: MapPlace[];
}) {
  const [feature, setFeature] = useState<Feature<
    Geometry,
    DistrictFeatureProperties
  > | null>(null);
  const [parkFeature, setParkFeature] = useState<ParkFeature | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<MapPlace | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const mapCloseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const hideMapPlace = () => {
    clearTimeout(mapCloseTimer.current);
    mapCloseTimer.current = setTimeout(() => {
      setHoveredPlace(null);
      setHoverPoint(null);
    }, 260);
  };

  const keepMapPlaceOpen = () => {
    clearTimeout(mapCloseTimer.current);
  };
  useEffect(() => {
    let cancelled = false;
    fetch("/data/sudurpaschim-districts.simplified.geojson")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load district boundaries");
        return response.json() as Promise<DistrictFeatureCollection>;
      })
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

  useEffect(() => {
    if (district.id !== "bajhang") return;
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
  }, [district.id]);

  return (
    <div
      className="relative h-[65vh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-line"
    >
      <MapContainer
        center={district.center}
        zoom={9}
        zoomSnap={0.25}
        scrollWheelZoom
        dragging
        doubleClickZoom
        touchZoom
        zoomControl
        className="h-full w-full"
      >
        <MarkerGlow />
        <TileLayer {...BASE_TILES} />
        {feature && (
          <>
            <GeoJSON
              data={feature}
              style={{
                color: "var(--color-forest)",
                weight: 2,
                fillColor: "var(--color-forest)",
                fillOpacity: 0.1,
              }}
            />
            <FitToFeature feature={feature} destinations={destinations} />
          </>
        )}
        {parkFeature && (
          <GeoJSON
            data={parkFeature}
            style={{
              color: "var(--color-brass)",
              weight: 2.5,
              dashArray: "7 5",
              fillColor: "var(--color-brass)",
              fillOpacity: 0.12,
            }}
          />
        )}
        <MapMarkerLayer
          district={district}
          destinations={destinations}
          onHover={(destination, point) => {
            clearTimeout(mapCloseTimer.current);
            if (!destination) {
              hideMapPlace();
              return;
            }
            setHoveredPlace(destination);
            setHoverPoint(point ?? null);
          }}
        />
      </MapContainer>

      <MapPlaceCard
        destination={hoveredPlace}
        point={hoverPoint}
        district={district}
        onPointerEnter={keepMapPlaceOpen}
        onPointerLeave={hideMapPlace}
      />

      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-xl border border-line bg-paper/95 px-3 py-2 text-xs shadow-sm">
        <p className="mb-1 font-semibold uppercase tracking-[0.14em] text-muted">
          Legend
        </p>
        <ul className="space-y-1">
          {(Object.keys(MARKER_LABEL) as (keyof typeof MARKER_LABEL)[]).map(
            (c) => (
            <li key={c} className="flex items-center gap-2 text-ink/80">
              {c === "park" ? (
                <span className="inline-block h-0 w-5 border-t-2 border-dashed border-brass" />
              ) : (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: MARKER_COLOR[c] }}
                />
              )}
              {MARKER_LABEL[c]}
            </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
