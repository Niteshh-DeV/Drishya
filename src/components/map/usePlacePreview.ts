"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { MapPlace } from "@/lib/types";

/**
 * Which place the map is previewing and where its pin is, plus the size of
 * the map frame for positioning the card. Leaving a pin closes the card
 * after a short grace period, so the pointer can travel from the pin onto
 * the card (and its link) without it vanishing.
 */
export function usePlacePreview(frame: RefObject<HTMLElement | null>) {
  const [place, setPlace] = useState<MapPlace | null>(null);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [frame]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const preview = useCallback((next: MapPlace, at: { x: number; y: number }) => {
    clearTimeout(closeTimer.current);
    setPlace(next);
    setPoint(at);
  }, []);

  const clear = useCallback(() => {
    clearTimeout(closeTimer.current);
    setPlace(null);
    setPoint(null);
  }, []);

  const leave = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(clear, 280);
  }, [clear]);

  const keep = useCallback(() => clearTimeout(closeTimer.current), []);

  return { place, point, size, preview, leave, keep, clear };
}
