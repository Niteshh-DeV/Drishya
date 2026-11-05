"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "motion/react";

/** Thin brass bar along the top edge that fills as the story is read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-[110] h-[3px] origin-left bg-brass"
    />
  );
}
