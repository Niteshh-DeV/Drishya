import type { District } from "@/lib/types";

/**
 * The 9 districts of Sudurpaschim Province — the single source of truth for
 * names, slugs, centers and intro copy across the app (hero info card, district
 * pages, nav, etc.). Centers come from the COD `npl_admin2` dataset.
 *
 * NOTE: `tagline`/`blurb` are STARTER content. Verify and expand district
 * history, culture, safety and destinations with the content team (see the
 * project spec). Do not treat these as authoritative.
 */
export const districts: District[] = [
  {
    id: "darchula",
    name: "Darchula",
    slug: "darchula",
    pcode: "NP0775",
    areaSqKm: 2339.6,
    center: [29.92581, 80.78907],
    tagline: "Border peaks & river valleys",
    blurb:
      "Nepal's north-western frontier, where the Mahakali river and the Api–Nampa Himal meet the India and Tibet borders.",
  },
  {
    id: "bajhang",
    name: "Bajhang",
    slug: "bajhang",
    pcode: "NP0767",
    areaSqKm: 3458.6,
    center: [29.72253, 81.24604],
    tagline: "Remote Himalayan highlands",
    blurb:
      "A high Himalayan district ringed by the Saipal range and reaching into Khaptad National Park — the largest district in the province by area.",
  },
  {
    id: "bajura",
    name: "Bajura",
    slug: "bajura",
    pcode: "NP0768",
    areaSqKm: 2297.7,
    center: [29.61058, 81.57657],
    tagline: "Alpine pastures & pilgrimage",
    blurb:
      "An alpine district known for the Badimalika pilgrimage and the high meadows of Khaptad.",
  },
  {
    id: "baitadi",
    name: "Baitadi",
    slug: "baitadi",
    pcode: "NP0774",
    areaSqKm: 1492.5,
    center: [29.50811, 80.55843],
    tagline: "Temple-dotted hills",
    blurb:
      "A mid-hill district of terraced farms and hilltop temples overlooking the Mahakali basin.",
  },
  {
    id: "achham",
    name: "Achham",
    slug: "achham",
    pcode: "NP0769",
    areaSqKm: 1700.1,
    center: [29.0678, 81.29407],
    tagline: "Terraced mid-hills",
    blurb:
      "Terraced mid-hills along the Seti and Budhiganga rivers, bordering Khaptad National Park to the north.",
  },
  {
    id: "doti",
    name: "Doti",
    slug: "doti",
    pcode: "NP0770",
    areaSqKm: 2050.4,
    center: [29.18817, 80.86231],
    tagline: "Historic hill capital",
    blurb:
      "A historic hill district and the site of the Shaileshwari temple near Dipayal.",
  },
  {
    id: "dadeldhura",
    name: "Dadeldhura",
    slug: "dadeldhura",
    pcode: "NP0773",
    areaSqKm: 1502.1,
    center: [29.20907, 80.50091],
    tagline: "Green ridgeline town",
    blurb:
      "A green ridge-top district on the Mahakali highway, known for the Ugratara temple.",
  },
  {
    id: "kailali",
    name: "Kailali",
    slug: "kailali",
    pcode: "NP0771",
    areaSqKm: 3285.5,
    center: [28.73133, 80.90418],
    tagline: "Terai plains & wetlands",
    blurb:
      "The province's Terai gateway — wide plains, the Karnali river and the Ghodaghodi lake wetlands.",
  },
  {
    id: "kanchanpur",
    name: "Kanchanpur",
    slug: "kanchanpur",
    pcode: "NP0772",
    areaSqKm: 1617.6,
    center: [28.84467, 80.28316],
    tagline: "Grasslands & national park",
    blurb:
      "The far-western corner of Nepal, home to Shuklaphanta National Park's grasslands and swamp deer.",
  },
];

/** Fast lookup by slug/id (both are identical). */
export const districtsBySlug: Record<string, District> = Object.fromEntries(
  districts.map((d) => [d.slug, d]),
);

export function getDistrict(slug: string): District | undefined {
  return districtsBySlug[slug];
}
