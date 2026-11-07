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

/** Curated place categories; a destination can have several. */
export type Category =
  | "Temple"
  | "Religious Site"
  | "Historical Site"
  | "Archaeological Site"
  | "Cultural Heritage"
  | "Lake & Wetland"
  | "River"
  | "Waterfall"
  | "Cave"
  | "Viewpoint"
  | "Mountain & Trek"
  | "Meadow"
  | "Forest & Wildlife"
  | "Park & Recreation"
  | "Town & Village"
  | "Landmark";

/** A reference cited by the source doc: a link, a named archive, or both. */
export interface SourceRef {
  url?: string;
  label?: string;
}

export interface DestinationImage {
  id: string;
  publicId: string;
  secureUrl: string;
  originalFilename: string;
  /** Lowest sortOrder is the cover photo. */
  sortOrder: number;
  credit?: string;
}

export interface Destination {
  id: string;
  /** URL slug — unique within the district. */
  slug: string;
  districtId: string;
  name: string;
  nameNepali?: string;
  category: Category[];
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

  /** Cloudinary gallery in display order; filled from the database, not seed files. */
  photos?: DestinationImage[];
  /** Credit line for the gallery as a whole, shown under the cover photo. */
  photoCredit?: string;

  /** References cited in the source doc. */
  sources?: SourceRef[];

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

/** Matches the `UserRole` enum in prisma/schema.prisma. */
export type UserRole = "traveler" | "guide" | "admin";

export type BlogPostStatus = "draft" | "pending" | "published" | "rejected";

/** One block of a blog post, in reading order. */
export interface BlogPostSection {
  id: string;
  heading?: string;
  body: string;
  imageUrl?: string;
  imageCaption?: string;
}

/** A destination a post is about — enough for a linked card and a map pin. */
export interface BlogPlaceLink {
  id: string;
  slug: string;
  districtId: string;
  name: string;
  shortDescription: string;
  /** `null` where the destination has no verified coordinates. */
  position: [number, number] | null;
  coverUrl?: string;
}

/** What a post card needs. Dates are ISO strings so the object stays serializable. */
export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl?: string;
  coverCredit?: string;
  authorName: string;
  /** The author's Google/Facebook profile photo, when they have one. */
  authorImage?: string;
  /** Written by the Drishya team (no traveler account behind it). */
  byTeam: boolean;
  /** The author's account, for the link to their traveler page. Absent on team posts. */
  authorId?: string;
  publishedAt: string;
  readingMinutes: number;
  districtIds: string[];
  tags: InterestTag[];
}

export interface BlogPost extends BlogPostSummary {
  /** The author's own bio, from their profile. */
  authorBio?: string;
  sections: BlogPostSection[];
  destinations: BlogPlaceLink[];
}

/** An image already uploaded to Cloudinary. */
export interface BlogImage {
  publicId: string;
  url: string;
}

/** What the writing form sends and edits — a post before it is saved. */
export interface BlogPostInput {
  title: string;
  excerpt: string;
  authorName: string;
  cover?: BlogImage;
  coverCredit?: string;
  sections: {
    heading?: string;
    body: string;
    image?: BlogImage;
    imageCaption?: string;
  }[];
  destinationIds: string[];
  tags: InterestTag[];
}

/** A row on the author's "My stories" page. */
export interface AuthorPostSummary {
  id: string;
  slug: string;
  title: string;
  status: BlogPostStatus;
  updatedAt: string;
  /** The reviewer's note when a story was sent back or taken down. */
  reviewNote?: string;
}

/** The signed-in traveler's own profile, for the account page. */
export interface AccountProfile {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  role: UserRole;
  joinedAt: string;
}

/**
 * A traveler's public page. Only people with at least one published story
 * have one; it never shows their email or unpublished work.
 */
export interface TravelerProfile {
  id: string;
  name: string;
  image?: string;
  bio?: string;
  joinedAt: string;
  posts: BlogPostSummary[];
}

/** Matches the `GuideStatus` enum in prisma/schema.prisma. */
export type GuideStatus = "draft" | "pending" | "published" | "rejected";

/** What a guide card in the directory needs. Contact details are never part of it. */
export interface GuideSummary {
  id: string;
  name: string;
  /** Uploaded portrait, else the account's Google/Facebook photo. */
  image?: string;
  headline: string;
  /** Districts they work in, in the order they listed them. */
  districtIds: string[];
  languages: string[];
  specialties: InterestTag[];
  guidingSince?: number;
}

/** A published guide's public page. */
export interface Guide extends GuideSummary {
  about: string;
  /** The guide's own words on what they charge; unchecked. */
  rates?: string;
  places: BlogPlaceLink[];
  /** Which contact methods exist, so the page can say what it will reveal. */
  contactMethods: ("phone" | "whatsapp" | "email")[];
  publishedAt: string;
}

/** Handed only to signed-in visitors, by a server action. */
export interface GuideContact {
  name: string;
  phone?: string;
  whatsapp: boolean;
  email?: string;
}

/** What the guide application form sends and edits. */
export interface GuideProfileInput {
  headline: string;
  about: string;
  guidingSince?: number;
  photo?: BlogImage;
  rates: string;
  phone: string;
  whatsapp: boolean;
  contactEmail: string;
  licenceNo: string;
  districtIds: string[];
  destinationIds: string[];
  specialties: InterestTag[];
  languages: string[];
}

/** A destination as offered in the writing form's place picker. */
export interface DestinationOption {
  id: string;
  name: string;
  districtId: string;
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
