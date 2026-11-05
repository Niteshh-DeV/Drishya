"use client";

import { ReactLenis } from "lenis/react";

/**
 * Weighted, eased scrolling for mouse wheels and trackpads (Lenis). Touch
 * keeps the phone's own momentum, and Lenis switches itself off for
 * visitors who prefer reduced motion.
 *
 * Read the instance anywhere with `useLenis()` from "lenis/react" — the hero
 * camera and the footer's "Back to top" do — and fall back to window
 * scrolling when it's undefined.
 */
export function SmoothScroll() {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        // Panels with their own scrollbars (the quick-facts menu, the
        // editor's text areas) scroll natively under the pointer.
        allowNestedScroll: true,
        // Clicking a link mid-glide shouldn't carry the glide onto the next page.
        stopInertiaOnNavigate: true,
        // Over a map that has been clicked, the wheel zooms the map instead
        // (see MapGestures); everywhere else, including other maps, it scrolls.
        prevent: (node) => Boolean(node.closest?.('.leaflet-container[data-wheel-zoom="on"]')),
      }}
    />
  );
}
