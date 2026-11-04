/**
 * Cloudinary delivery helpers. Uploaded originals are multi-megabyte phone
 * photos; inserting a transformation after `/upload/` lets Cloudinary resize
 * and pick WebP/AVIF per browser, so a 112px hover thumbnail of Ghatal Temple
 * no longer downloads the full 5 MB original.
 */
export function cloudinaryUrl(url: string, width: number): string {
  const marker = "/image/upload/";
  const at = url.indexOf(marker);
  if (at === -1) return url;
  const head = url.slice(0, at + marker.length);
  const tail = url.slice(at + marker.length);
  return `${head}f_auto,q_auto,c_limit,w_${width}/${tail}`;
}

/** Cover photo for a destination: the first image in sort order. */
export function coverImageUrl(destination: {
  media?: { photos?: { secureUrl: string }[] };
}): string | undefined {
  return destination.media?.photos?.[0]?.secureUrl;
}
