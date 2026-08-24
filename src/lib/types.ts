import type { FeatureCollection, Polygon } from "geojson";

/** Category of a point-of-interest shown on the district (Leaflet) map. */
export type PoiCategory = "guide" | "stay" | "hidden-gem";

/** A district of Sudurpaschim Province. Single source of truth: `src/data/districts.ts`. */
export interface District {
  id: string;
  name: string;
  /** URL slug — same as `id` (e.g. "kailali"). */
  slug: string;
  /** OCHA/COD admin-2 pcode (e.g. "NP0771"). */
  pcode: string;
  areaSqKm: number;
  /** Geometric center from the COD dataset, as [lat, lon]. */
  center: [number, number];
  /** Short characterisation shown in the hero info card. */
  tagline: string;
  /** One-to-two sentence intro. Starter content — verify/expand with the content team. */
  blurb: string;
}

/** A map marker (guide / stay / hidden gem). Sample data today; DB-backed later. */
export interface Poi {
  id: string;
  districtId: string;
  name: string;
  category: PoiCategory;
  /** [lat, lon] */
  position: [number, number];
  description: string;
}

/** Kind of landmark shown on the active district in the hero map — drives the glyph. */
export type LandmarkKind = "temple" | "peak" | "water" | "gem";

/**
 * A named landmark floated over a district in the hero map. `dx`/`dy` are offsets
 * (in SVG user units, same space as the district paths) from the district's label
 * centroid (`cx`/`cy`), so a landmark is positioned relative to its district.
 */
export interface Landmark {
  name: string;
  kind: LandmarkKind;
  dx: number;
  dy: number;
}

/** One district path in the hero SVG (`src/data/sudurpaschim-svg.json`). */
export interface DistrictSvgPath {
  id: string;
  name: string;
  pcode: string;
  area_sqkm: number;
  /** SVG path `d` attribute. */
  d: string;
  /** Label centroid X within the viewBox. */
  cx: number;
  /** Label centroid Y within the viewBox. */
  cy: number;
}

/** Shape of `src/data/sudurpaschim-svg.json`. */
export interface SudurpaschimSvg {
  width: number;
  height: number;
  viewBox: string;
  districts: DistrictSvgPath[];
}

/** Properties on each feature of the simplified district GeoJSON. */
export interface DistrictFeatureProperties {
  id: string;
  name: string;
  pcode: string;
  province: string;
  area_sqkm: number;
  center_lat: number;
  center_lon: number;
}

/** The simplified district FeatureCollection served from `/public/data`. */
export type DistrictFeatureCollection = FeatureCollection<
  Polygon,
  DistrictFeatureProperties
>;
