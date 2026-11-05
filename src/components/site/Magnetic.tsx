"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react";

/**
 * Leans its child toward the cursor while the pointer is over it and
 * springs back on leave — for the few primary buttons on a page. Mouse
 * pointers only; touch and reduced motion leave the button where it is.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className = "inline-block",
}: {
  children: ReactNode;
  /** Share of the pointer's offset from the centre the button follows. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const spring = { stiffness: 220, damping: 18, mass: 0.6 };
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  function onMove(event: PointerEvent<HTMLSpanElement>) {
    if (reduced || event.pointerType !== "mouse" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * strength);
    y.set((event.clientY - (box.top + box.height / 2)) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  );
}
