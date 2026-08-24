import { districts } from "./districts";
import type { Poi } from "@/lib/types";

/**
 * SAMPLE / PLACEHOLDER points-of-interest so the district (Leaflet) map has
 * markers to render during development. Each district gets one guide, one stay
 * and one hidden gem, offset from the district center.
 *
 * TODO: replace with real, DB-backed records once the guide/stay/hidden-gem
 * data model and content exist (later phase).
 */
function near(
  [lat, lon]: [number, number],
  dLat: number,
  dLon: number,
): [number, number] {
  return [lat + dLat, lon + dLon];
}

export const samplePois: Poi[] = districts.flatMap((d) => [
  {
    id: `${d.id}-guide-1`,
    districtId: d.id,
    name: `${d.name} Local Guide`,
    category: "guide",
    position: near(d.center, 0.03, 0.03),
    description: `Sample local guide for ${d.name}. Replace with a real guide profile.`,
  },
  {
    id: `${d.id}-stay-1`,
    districtId: d.id,
    name: `${d.name} Homestay`,
    category: "stay",
    position: near(d.center, -0.025, 0.02),
    description: `Sample stay in ${d.name}. Replace with a real listing.`,
  },
  {
    id: `${d.id}-gem-1`,
    districtId: d.id,
    name: `${d.name} Hidden Gem`,
    category: "hidden-gem",
    position: near(d.center, 0.02, -0.03),
    description: `A sample local-only spot in ${d.name}. Replace with a curated gem.`,
  },
]);

export function poisForDistrict(districtId: string): Poi[] {
  return samplePois.filter((p) => p.districtId === districtId);
}
