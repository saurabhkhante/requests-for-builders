/** Shared motion tokens. One curve everywhere (expo-out), short durations. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  /** Press, hover, toggle. */
  micro: 0.2,
  /** Accordions, sheets. */
  expand: 0.45,
  /** Section entry. */
  enter: 0.7,
} as const;

/** Gap between staggered children. */
export const STAGGER = 0.08;
