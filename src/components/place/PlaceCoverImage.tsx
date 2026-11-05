import { ViewTransition } from "react";
import { ParallaxImage } from "@/components/site/ParallaxImage";
import { placeCoverName } from "@/lib/site";

/**
 * Full-bleed cover photo under the place title. It settles in with a slow
 * push-out and drifts against the scroll. Shares a view-transition name
 * with the destination's card photos (district list, hidden gems, places
 * in a story), so opening a card flies its photo up into this frame.
 */
export function PlaceCoverImage({
  destinationId,
  src,
  alt,
}: {
  destinationId: string;
  src: string;
  alt: string;
}) {
  return (
    <ViewTransition name={placeCoverName(destinationId)} share="morph" default="none">
      <ParallaxImage
        src={src}
        alt={alt}
        reveal={false}
        kenBurns
        loading="eager"
        strength={6}
        className="h-[min(78vh,52rem)] w-full"
      />
    </ViewTransition>
  );
}
