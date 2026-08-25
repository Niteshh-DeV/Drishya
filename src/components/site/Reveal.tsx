"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  /** Seconds of stagger — pass `i * 0.06` when revealing a list. */
  delay?: number;
  /** Travel distance in px before settling. */
  y?: number;
  className?: string;
}

/**
 * Reveals its children once, as they scroll into view: a short rise out of a
 * blur with an ease-out-expo settle. `margin` fires it slightly before the
 * element reaches the fold so the motion is already underway when you see it.
 * Collapses to a plain wrapper under `prefers-reduced-motion`.
 */
export function Reveal({ children, delay = 0, y = 26, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
