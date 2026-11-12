"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

/**
 * In-page link for pages framed on theproductfolks.com (/landing, /requests).
 *
 * A plain href="#pass" resolves against the iframe, so hovering shows
 * builders-day-gamma.vercel.app/... and cmd-click or "copy link" hands people a
 * vercel.app URL. This link points at the public Webflow page instead
 * (publicUrl + hash; the Webflow embed passes the hash into the frame), and a
 * plain click just scrolls inside the frame.
 */
export function HashLink({
  hash,
  publicUrl,
  onClick,
  ...rest
}: { hash: `#${string}`; publicUrl: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", hash);
  };
  return <a href={`${publicUrl}${hash}`} onClick={handle} {...rest} />;
}
