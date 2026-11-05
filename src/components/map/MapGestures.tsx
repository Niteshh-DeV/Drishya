"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMap } from "react-leaflet";

/**
 * Keeps a map from trapping the page scroll.
 *
 * - Mouse/trackpad: the wheel scrolls the page until the map is clicked;
 *   from then on it zooms the map, until the pointer leaves. While active
 *   the container carries `data-wheel-zoom`, which tells Lenis to let go
 *   (see SmoothScroll).
 * - Touch: one finger scrolls the page, two fingers move and zoom the map.
 *
 * A short hint explains this the first time someone tries.
 */
export function MapGestures() {
  const map = useMap();
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const container = map.getContainer();
    const touch = window.matchMedia("(pointer: coarse)").matches;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const flash = (text: string) => {
      setHint(text);
      clearTimeout(timer);
      timer = setTimeout(() => setHint(null), 1600);
    };
    const activate = () => {
      if (map.scrollWheelZoom.enabled()) return;
      map.scrollWheelZoom.enable();
      container.dataset.wheelZoom = "on";
      setHint(null);
    };
    const deactivate = () => {
      map.scrollWheelZoom.disable();
      delete container.dataset.wheelZoom;
    };
    const onWheel = () => {
      if (!map.scrollWheelZoom.enabled()) flash("Click the map to zoom with the scroll wheel");
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1) flash("Use two fingers to move the map");
    };

    map.scrollWheelZoom.disable();
    if (touch) map.dragging.disable();

    container.addEventListener("wheel", onWheel, { passive: true });
    container.addEventListener("mousedown", activate);
    container.addEventListener("mouseleave", deactivate);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      clearTimeout(timer);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("mousedown", activate);
      container.removeEventListener("mouseleave", deactivate);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, [map]);

  return (
    <AnimatePresence>
      {hint && (
        <motion.p
          role="status"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-forest-deep/85 px-4 py-2.5 text-xs font-medium text-dock-text shadow-lg backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {hint}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
