"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion flag. It is `false` on the server and during
 * hydration, then flips to the real preference right after, so the first
 * client render always matches the server HTML. motion's own
 * `useReducedMotion` reads the media query on the first client render and
 * causes hydration mismatches when it differs from the server.
 *
 * Only use it for behaviour (scroll smoothing, timers, transitions). For
 * entry styles, rely on <MotionProvider> (MotionConfig reducedMotion="user"),
 * which drops transforms and keeps opacity for people who ask for less motion.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
