"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** Sizing for the frame, e.g. "h-[min(58vh,34rem)] w-full". */
  className?: string;
  /** How far the photo drifts against the scroll, as a % of its height. */
  strength?: number;
  /** Ken Burns push-out on load, for covers. */
  kenBurns?: boolean;
  /**
   * Wipe in from behind a curtain on first view. Off for covers that a card
   * photo morphs into: the morph needs the cover visible from the start.
   */
  reveal?: boolean;
  loading?: "lazy" | "eager";
}

/**
 * A photo that wipes in from behind a curtain as it scrolls into view, then
 * drifts slightly slower than the page, so it reads as a window onto the
 * place rather than a picture on the paper. The photo is scaled up inside
 * its frame so the drift never shows an edge. Under `prefers-reduced-motion`
 * the photo is simply there and holds still; the element tree stays the same
 * so the server's starting styles are always replaced (see Reveal).
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  strength = 7,
  kenBurns = false,
  reveal = true,
  loading = "lazy",
}: ParallaxImageProps) {
  const frame = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const drift = reduced ? 0 : strength;
  const y = useTransform(scrollYProgress, [0, 1], [`-${drift}%`, `${drift}%`]);

  return (
    <motion.div
      ref={frame}
      className={`overflow-hidden ${className}`}
      {...(reveal && {
        initial: { clipPath: "inset(100% 0% 0% 0%)" },
        whileInView: { clipPath: "inset(0% 0% 0% 0%)" },
        viewport: { once: true, margin: "0px 0px -10% 0px" },
        transition: reduced ? { duration: 0 } : { duration: 1.3, ease: [0.76, 0, 0.24, 1] as const },
      })}
    >
      <motion.div className="h-full w-full" style={{ y, scale: 1 + (strength * 2.4) / 100 }}>
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className={`h-full w-full object-cover ${kenBurns ? "ken-burns" : ""}`}
        />
      </motion.div>
    </motion.div>
  );
}
