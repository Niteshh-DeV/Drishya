"use client";

import { useEffect, type RefObject } from "react";

/**
 * Closes an open menu on Escape and, when `inside` is given, on any press
 * outside that element. Escape returns focus to `trigger`, so keyboard
 * users land back where they opened the menu.
 */
export function useDismiss({
  open,
  close,
  inside,
  trigger,
}: {
  open: boolean;
  close: () => void;
  inside?: RefObject<HTMLElement | null>;
  trigger?: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      close();
      trigger?.current?.focus();
    }
    function onPointer(event: PointerEvent) {
      if (inside?.current && !inside.current.contains(event.target as Node)) close();
    }

    document.addEventListener("keydown", onKey);
    if (inside) document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close, inside, trigger]);
}
