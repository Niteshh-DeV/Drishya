"use client";

import dynamic from "next/dynamic";
import type { Destination, District } from "@/lib/types";

/*
 * Leaflet touches `window`, so the map must not render on the server. In the
 * App Router `ssr: false` is only allowed inside a Client Component — hence
 * this thin 'use client' wrapper around the dynamic import.
 */
const DistrictMap = dynamic(() => import("./DistrictMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[65vh] min-h-[420px] w-full items-center justify-center rounded-xl border border-line bg-paper/50 text-sm text-muted">
      Loading map…
    </div>
  ),
});

export function DistrictMapLoader({
  district,
  destinations,
  compact = false,
}: {
  district: District;
  destinations: Destination[];
  compact?: boolean;
}) {
  return (
    <DistrictMap
      district={district}
      destinations={destinations}
      compact={compact}
    />
  );
}
