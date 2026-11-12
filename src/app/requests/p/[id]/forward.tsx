"use client";

import { useEffect } from "react";

/** Sends people on to the public board. Crawlers don't run this, so they keep this page's preview. */
export function Forward({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}
