"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import { districts } from "@/data/districts";
import { cloudinaryUrl } from "@/lib/images";
import { destinationHref } from "@/lib/site";
import type { DistrictFeatureCollection, DistrictFeatureProperties, MapPlace } from "@/lib/types";
import { BASE_TILES, PROVINCE_BOUNDS } from "@/components/map/leaflet";
import { MapGestures } from "@/components/map/MapGestures";
import { MapPlaceCard } from "@/components/map/MapPlaceCard";
import { PlaceMarkers } from "@/components/map/PlaceMarkers";
import { usePlacePreview } from "@/components/map/usePlacePreview";

type ParkFeature = Feature<Geometry, { name?: string }>;
type DistrictFeature = Feature<Geometry, DistrictFeatureProperties>;

/** Hands the Leaflet map up to the explorer, so the panel can fly it around. */
function MapHandle({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => onReady(map), [map, onReady]);
  return null;
}

/**
 * The province map: every destination with confirmed coordinates, over the
 * nine district boundaries. A district can be chosen from the panel or by
 * clicking it on the map — the map flies there, its places stay bright and
 * the rest fade. Hovering a place in the list lifts its pin.
 */
export function RegionMap({ places }: { places: MapPlace[] }) {
  const frame = useRef<HTMLDivElement>(null);
  const { place, point, size, preview, leave, keep, clear } = usePlacePreview(frame);
  const [map, setMap] = useState<L.Map | null>(null);
  const [boundaries, setBoundaries] = useState<DistrictFeatureCollection | null>(null);
  const [park, setPark] = useState<ParkFeature | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const districtLayer = useRef<L.GeoJSON | null>(null);
  const framed = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/data/sudurpaschim-districts.simplified.geojson").then((r) => r.json()),
      fetch("/data/khaptad-national-park.geojson").then((r) => r.json()),
    ])
      .then(([fc, parkFc]: [DistrictFeatureCollection, { features?: ParkFeature[] }]) => {
        if (cancelled) return;
        setBoundaries(fc);
        setPark(parkFc.features?.[0] ?? null);
      })
      .catch(() => {
        /* pins still render without the outlines */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const byDistrict = new Map<string, number>();
    for (const p of places) byDistrict.set(p.districtId, (byDistrict.get(p.districtId) ?? 0) + 1);
    return byDistrict;
  }, [places]);

  const shown = selected ? places.filter((p) => p.districtId === selected) : places;
  const selectedName = districts.find((d) => d.id === selected)?.name;

  // Frame the province once the outlines arrive (no animation), then fly to
  // a district when one is chosen and back out when the filter is cleared.
  // On wide screens the panel covers the left edge, so it's kept clear.
  useEffect(() => {
    if (!map || !boundaries) return;
    const feature = selected ? boundaries.features.find((f) => f.properties.id === selected) : null;
    const bounds = L.geoJSON(feature ?? boundaries).getBounds();
    if (!bounds.isValid()) return;
    const panel = window.matchMedia("(min-width: 1024px)").matches ? 400 : 24;
    const options = { paddingTopLeft: L.point(panel, 32), paddingBottomRight: L.point(32, 56) };
    clear();
    if (!framed.current) {
      framed.current = true;
      map.fitBounds(bounds, { ...options, animate: false });
      map.setMinZoom(map.getZoom() - 0.5);
      map.setMaxBounds(PROVINCE_BOUNDS);
    } else {
      map.flyToBounds(bounds, { ...options, duration: 1.1 });
    }
  }, [map, selected, boundaries, clear]);

  const isDimmed = useCallback((p: MapPlace) => Boolean(selected && p.districtId !== selected), [selected]);

  const districtStyle = useCallback(
    (feature?: Feature) => {
      const id = (feature as DistrictFeature | undefined)?.properties.id;
      const isSelected = id === selected;
      const isHovered = id === hoveredDistrict;
      return {
        color: isSelected ? "var(--color-brass)" : "var(--color-forest)",
        weight: isSelected ? 2.5 : isHovered ? 2 : 1.25,
        opacity: selected && !isSelected ? 0.5 : 0.9,
        fillColor: isSelected ? "var(--color-brass)" : "var(--color-forest)",
        fillOpacity: isSelected ? 0.1 : isHovered ? 0.16 : selected ? 0.02 : 0.06,
      };
    },
    [selected, hoveredDistrict],
  );

  // Restyle the existing layer rather than rebuilding it: a rebuilt layer
  // under the pointer would drop the hover it was reacting to.
  useEffect(() => {
    districtLayer.current?.setStyle(districtStyle);
  }, [districtStyle]);

  return (
    <div className="lg:relative">
      {/* Phones: the district chips sit above the map. */}
      <DistrictChips
        className="mb-4 lg:hidden"
        selected={selected}
        counts={counts}
        total={places.length}
        onSelect={setSelected}
      />

      <div
        ref={frame}
        className="relative h-[58vh] min-h-[24rem] overflow-hidden rounded-3xl sm:h-[min(78vh,52rem)] sm:min-h-[30rem] border border-line shadow-[0_30px_80px_-40px_color-mix(in_srgb,var(--color-forest-deep)_55%,transparent)]"
      >
        <MapContainer
          center={[29.3, 80.9]}
          zoom={8}
          zoomSnap={0.25}
          dragging
          doubleClickZoom
          touchZoom
          zoomControl={false}
          className="h-full w-full"
        >
          <MapHandle onReady={setMap} />
          <TileLayer {...BASE_TILES} />
          <MapGestures />
          {boundaries && (
            <GeoJSON
              ref={districtLayer}
              data={boundaries}
              style={districtStyle}
              onEachFeature={(feature: DistrictFeature, layer) => {
                layer.bindTooltip(feature.properties.name, {
                  sticky: true,
                  direction: "top",
                  offset: [0, -12],
                  className: "map-district-label",
                });
                layer.on({
                  mouseover: () => setHoveredDistrict(feature.properties.id),
                  mouseout: () => setHoveredDistrict(null),
                  click: () =>
                    setSelected((current) => (current === feature.properties.id ? null : feature.properties.id)),
                });
              }}
            />
          )}
          {park && (
            <GeoJSON
              data={park}
              interactive={false}
              style={{
                color: "var(--color-brass)",
                weight: 2,
                dashArray: "6 5",
                fillColor: "var(--color-brass)",
                fillOpacity: 0.1,
              }}
            />
          )}
          <PlaceMarkers
            places={places}
            activeId={hoveredRow ?? place?.id ?? null}
            isDimmed={isDimmed}
            onPreview={preview}
            onLeave={leave}
            onDismiss={clear}
          />
        </MapContainer>

        <MapPlaceCard place={place} point={point} size={size} onPointerEnter={keep} onPointerLeave={leave} />

        {/* Zoom buttons, in the palette, top right (the panel owns the left). */}
        <div className="absolute right-4 top-4 z-[1000] flex flex-col overflow-hidden rounded-2xl border border-line bg-paper/90 shadow-lg backdrop-blur">
          {[
            { label: "Zoom in", sign: "+", run: () => map?.zoomIn() },
            { label: "Zoom out", sign: "−", run: () => map?.zoomOut() },
          ].map((b, i) => (
            <button
              key={b.label}
              type="button"
              aria-label={b.label}
              onClick={b.run}
              className={`grid h-10 w-10 place-items-center text-lg text-ink transition-colors hover:bg-stone/30 ${i ? "border-t border-line" : ""}`}
            >
              {b.sign}
            </button>
          ))}
        </div>

        {/* Desktop: the explorer panel floats over the map's left edge. */}
        <aside className="glass-strong absolute bottom-4 left-4 top-4 z-[1000] hidden w-[22rem] flex-col rounded-2xl lg:flex">
          <div className="border-b border-line/70 px-5 pb-4 pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-ink">Explore by district</p>
            <DistrictChips className="mt-3" selected={selected} counts={counts} total={places.length} onSelect={setSelected} />
          </div>
          <PlaceList
            places={shown}
            districtName={selectedName}
            onHover={setHoveredRow}
            className="min-h-0 flex-1 overflow-y-auto px-2 py-2"
          />
        </aside>

        <ul className="pointer-events-none absolute bottom-4 right-4 z-[1000] flex gap-3 rounded-full border border-line bg-paper/90 px-4 py-2 text-[11px] text-ink/80 shadow-sm backdrop-blur">
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-forest" /> Destination
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brass" /> Hidden gem
          </li>
          {park && (
            <li className="hidden items-center gap-1.5 sm:flex">
              <span className="w-4 border-t-2 border-dashed border-brass" /> Khaptad National Park
            </li>
          )}
        </ul>
      </div>

      {/* Phones: the list follows the map. */}
      <div className="mt-6 lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-ink">
          {selectedName ? `Places in ${selectedName}` : "Every place on the map"}
        </p>
        <PlaceList places={shown} districtName={selectedName} onHover={setHoveredRow} className="mt-2" />
      </div>
    </div>
  );
}

function DistrictChips({
  selected,
  counts,
  total,
  onSelect,
  className = "",
}: {
  selected: string | null;
  counts: Map<string, number>;
  total: number;
  onSelect: (id: string | null) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label="Choose a district" className={`flex flex-wrap gap-1.5 ${className}`}>
      {[{ id: null as string | null, name: "All", count: total }, ...districts.map((d) => ({ id: d.id, name: d.name, count: counts.get(d.id) ?? 0 }))].map(
        (d) => {
          const on = selected === d.id;
          return (
            <button
              key={d.id ?? "all"}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(on && d.id ? null : d.id)}
              className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                on ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink/40 hover:text-ink"
              }`}
            >
              {d.name} <span className={on ? "text-paper/70" : "text-muted/70"}>{d.count}</span>
            </button>
          );
        },
      )}
    </div>
  );
}

function PlaceList({
  places,
  districtName,
  onHover,
  className = "",
}: {
  places: MapPlace[];
  districtName?: string;
  onHover: (id: string | null) => void;
  className?: string;
}) {
  if (places.length === 0) {
    return (
      <p className={`px-3 py-6 text-sm leading-relaxed text-muted ${className}`}>
        No places in {districtName ?? "this district"} have confirmed map coordinates yet. Its district
        page lists everything we know so far.
      </p>
    );
  }
  return (
    <ul className={className} onPointerLeave={() => onHover(null)}>
      {places.map((p) => (
        <li key={p.id}>
          <Link
            href={destinationHref(p)}
            onPointerEnter={() => onHover(p.id)}
            onFocus={() => onHover(p.id)}
            onBlur={() => onHover(null)}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-paper/70 focus-visible:bg-paper/70 focus-visible:outline-none"
          >
            {p.coverUrl ? (
              <img
                src={cloudinaryUrl(p.coverUrl, 120)}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-11 w-11 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span aria-hidden className="h-11 w-11 shrink-0 rounded-lg border border-line bg-stone/20" />
            )}
            <span className="min-w-0 flex-1">
              <span className="font-display block truncate text-lg leading-tight text-ink transition-colors group-hover:text-accent-ink">
                {p.name}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.16em] text-muted">
                {districts.find((d) => d.id === p.districtId)?.name}
                {p.hiddenGem && <span className="text-accent-ink"> · Hidden gem</span>}
              </span>
            </span>
            <span aria-hidden className="card-arrow text-accent-ink opacity-0 transition-opacity group-hover:opacity-100">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
