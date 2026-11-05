"use client";

import dynamic from "next/dynamic";
import type { MapPlace } from "@/lib/types";

const RegionMap = dynamic(
  () => import("./RegionMap").then((module) => module.RegionMap),
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[58vh] min-h-[24rem] rounded-3xl border border-line sm:h-[min(78vh,52rem)] sm:min-h-[30rem]" />
    ),
  },
);

export function RegionMapLoader({ places }: { places: MapPlace[] }) {
  return <RegionMap places={places} />;
}
