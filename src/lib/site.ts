/** Absolute site origin, used for metadata, sitemap, robots and JSON-LD. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://drishya.vercel.app";

export function destinationHref(place: { districtId: string; slug: string }) {
  return `/districts/${place.districtId}/${place.slug}`;
}

/**
 * View-transition name shared by a destination's card photo (district list,
 * hidden gems, places in a story) and its cover on the destination page, so
 * opening a card flies the photo into place. Each name may appear only once
 * per page.
 */
export function placeCoverName(destinationId: string): string {
  return `place-cover-${destinationId}`;
}
