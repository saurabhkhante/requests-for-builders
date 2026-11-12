/**
 * Public homes of the pages framed on theproductfolks.com. Links meant for
 * people never point at vercel.app. Kept out of any "use client" module so
 * server components get the real strings (a client module hands them a
 * client reference instead, which renders as "undefined").
 */
export const PUBLIC_URLS = {
  landing: "https://www.theproductfolks.com/product-unconference-2026-buildersday",
  requests: "https://www.theproductfolks.com/request-for-builders",
  unconference: "https://www.theproductfolks.com/product-unconference-2026",
} as const;
