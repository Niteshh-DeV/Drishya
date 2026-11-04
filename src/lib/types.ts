import type { FeatureCollection, Polygon } from "geojson";

export type InterestTag =
  | "Culture"
  | "History"
  | "Religious"
  | "Nature"
  | "Wildlife"
  | "Adventure"
  | "Trekking"
  | "Relaxation"
  | "Archaeology";

export type Season = "Spring" | "Summer" | "Monsoon" | "Autumn" | "Winter";

export type BudgetLevel = "Low" | "Low-Medium" | "Medium" | "High";

export interface DestinationImage {
  id: string;
  publicId: string;
  secureUrl: string;
  originalFilename: string;
  sortOrder: number;
  isCover: boolean;
  credit?: string;
}

export interface Destination {
  id: string;
  /** URL slug — unique within the district. */
  slug: string;
  districtId: string;
  name: string;
  nameNepali?: string;
  category: string[];
  /** Nearest town / landmark, in plain prose. */
  nearestTown?: string;
  /** [lat, lon]. `null` where the source data is incomplete. */
  position: [number, number] | null;
  elevationM?: number;

  interestTags: InterestTag[];
  bestSeasons: Season[];
  /** Festival / hazard notes attached to the seasons above. */
  bestTimeNote?: string;
  budget: BudgetLevel;
  budgetNote?: string;
  hiddenGem: boolean;
  hiddenGemReason?: string;

  shortDescription: string;
  longDescription?: string;
  bestFor?: string;

  howToGetThere?: string;
  entryFee?: string;
  openingHours?: string;
  nearbyStaysFood?: string;
  safetyNotes?: string;

  media?: {
    photo: string;
    photoUrl?: string;
    credit: string;
    /** Cloudinary-backed gallery; omitted in seed sources until images are uploaded. */
    photos?: DestinationImage[];
  };

  /** Reference pages cited in the source doc. */
  sources?: string[];

  alternateNames: string[];
  culturalNote?: string;
  verify?: string[];
}

/**
 * The slice of a destination that map markers and hover cards need. Maps on
 * the home, /map and district pages receive this instead of the full
 * `Destination`, keeping long descriptions and galleries out of their payload.
 */
export interface MapPlace {
  id: string;
  slug: string;
  districtId: string;
  name: string;
  shortDescription: string;
  position: [number, number];
  hiddenGem: boolean;
  /** Original Cloudinary URL of the cover photo, if one is uploaded. */
  coverUrl?: string;
}

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
