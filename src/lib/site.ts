/** Absolute site origin, used for metadata, sitemap, robots and JSON-LD. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://drishya.vercel.app";

export function destinationHref(place: { districtId: string; slug: string }) {
  return `/districts/${place.districtId}/${place.slug}`;
}
