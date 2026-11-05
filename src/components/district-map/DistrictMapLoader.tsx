"use client";

import dynamic from "next/dynamic";
import type { District, MapPlace } from "@/lib/types";

/*
 * Leaflet touches `window`, so the map must not render on the server. In the
 * App Router `ssr: false` is only allowed inside a Client Component — hence
 * this thin 'use client' wrapper around the dynamic import.
 */
const DistrictMap = dynamic(() => import("./DistrictMap"), {
  ssr: false,
  loading: () => (
    <div className="skeleton grid h-[65vh] min-h-[420px] w-full place-items-center rounded-2xl border border-line text-xs uppercase tracking-[0.2em] text-muted">
      Loading map…
    </div>
  ),
});

export function DistrictMapLoader({
  district,
  places,
}: {
  district: District;
  places: MapPlace[];
}) {
  return <DistrictMap district={district} places={places} />;
}
