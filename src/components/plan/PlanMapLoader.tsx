"use client";

import dynamic from "next/dynamic";
import type { MapPlace } from "@/lib/types";

const PlanMap = dynamic(
  () => import("./PlanMap").then((module) => module.PlanMap),
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[22rem] rounded-3xl border border-line sm:h-[26rem]" />
    ),
  },
);

export function PlanMapLoader(props: {
  places: MapPlace[];
  activeId: string | null;
  here: [number, number] | null;
}) {
  return <PlanMap {...props} />;
}
