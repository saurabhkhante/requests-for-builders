import type { NextConfig } from "next";

// /requests is embedded full-screen in an iframe on theproductfolks.com/request-for-builders,
// so only TPF's own domains and its Webflow staging site may frame it. Everything else stays unframeable.
const FRAMERS = "https://www.theproductfolks.com https://theproductfolks.com https://*.webflow.io";
const shared = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  async redirects() {
    return [{ source: "/", destination: "/requests", permanent: false }];
  },
  async headers() {
    return [
      { source: "/requests", headers: [{ key: "Content-Security-Policy", value: `frame-ancestors ${FRAMERS}` }, ...shared] },
      {
        source: "/:path((?!requests$).*)",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" }, { key: "X-Frame-Options", value: "DENY" }, ...shared],
      },
    ];
  },
};

export default nextConfig;
