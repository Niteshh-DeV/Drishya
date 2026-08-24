import type { Landmark } from "@/lib/types";

/**
 * Landmarks floated over each district in the hero map. Positions are offsets
 * (`dx`/`dy`, in SVG user units) from that district's label centroid in
 * `sudurpaschim-svg.json`, so a pin sits near the middle of its district.
 *
 * NOTE: names are STARTER content, grounded in the real features named in each
 * district's `blurb` (see `districts.ts`). The content team should verify and
 * expand these — they are here to make the hero feel alive, not to be an
 * authoritative gazetteer.
 */
export const landmarksByDistrict: Record<string, Landmark[]> = {
  darchula: [
    { name: "Api–Nampa Himal", kind: "peak", dx: -34, dy: -46 },
    { name: "Mahakali River", kind: "water", dx: 26, dy: 54 },
  ],
  bajhang: [
    { name: "Saipal Range", kind: "peak", dx: -42, dy: -32 },
    { name: "Khaptad edge", kind: "gem", dx: 30, dy: 44 },
  ],
  bajura: [
    { name: "Badimalika", kind: "temple", dx: -30, dy: -22 },
    { name: "Khaptad Meadows", kind: "gem", dx: 22, dy: 42 },
  ],
  baitadi: [
    { name: "Hilltop Temples", kind: "temple", dx: -26, dy: -30 },
    { name: "Mahakali Basin", kind: "water", dx: 24, dy: 36 },
  ],
  achham: [
    { name: "Seti River", kind: "water", dx: -36, dy: -24 },
    { name: "Budhiganga", kind: "water", dx: 30, dy: 34 },
  ],
  doti: [
    { name: "Shaileshwari", kind: "temple", dx: -30, dy: -26 },
    { name: "Dipayal", kind: "gem", dx: 26, dy: 34 },
  ],
  dadeldhura: [
    { name: "Ugratara", kind: "temple", dx: -26, dy: -26 },
    { name: "Green Ridge", kind: "gem", dx: 24, dy: 30 },
  ],
  kailali: [
    { name: "Karnali River", kind: "water", dx: -42, dy: -34 },
    { name: "Ghodaghodi Lake", kind: "water", dx: 42, dy: 40 },
  ],
  kanchanpur: [
    { name: "Shuklaphanta", kind: "gem", dx: 8, dy: -30 },
    { name: "Grassland Swamps", kind: "water", dx: 26, dy: 40 },
  ],
};

export function landmarksForDistrict(id: string): Landmark[] {
  return landmarksByDistrict[id] ?? [];
}
