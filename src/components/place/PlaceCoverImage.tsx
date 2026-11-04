"use client";

import { motion } from "motion/react";

/**
 * Full-bleed cover photo. Shares its `layoutId` with the hero-map hover card
 * thumbnail so the image can carry over when a place is opened from the map.
 */
export function PlaceCoverImage({
  slug,
  src,
  alt,
}: {
  slug: string;
  src: string;
  alt: string;
}) {
  return (
    <motion.img
      layoutId={slug}
      src={src}
      alt={alt}
      decoding="async"
      className="h-[min(70vh,48rem)] w-full object-cover"
    />
  );
}
