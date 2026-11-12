"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * App-wide motion settings. reducedMotion="user" makes every motion
 * component skip transform animations (y, scale, rotate, layout) when the
 * visitor prefers reduced motion, while opacity still fades. Because it
 * decides at animation time, server and client render the same initial
 * styles, so there is no hydration mismatch.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
