"use client";

import dynamic from "next/dynamic";
import type { MapPlace } from "@/lib/types";

const RegionMap = dynamic(
  () => import("./RegionMap").then((module) => module.RegionMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[min(72vh,52rem)] min-h-[34rem] animate-pulse rounded-3xl border border-line bg-stone/30" />
    ),
  },
);

export function RegionMapLoader({ places }: { places: MapPlace[] }) {
  return <RegionMap places={places} />;
}
