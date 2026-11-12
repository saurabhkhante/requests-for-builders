/** Brand assets in public/brand, typed with each file's intrinsic size. */
const b = (path: string) => `/brand/${path}`;

export const TPF = {
  wordmark: { src: b("tpf/tpf-wordmark-white.avif"), w: 106, h: 64 },
} as const;
