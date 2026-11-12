import type { ReactNode } from "react";

import { ArrowRightIcon } from "@/components/icons";
import { HashLink } from "@/components/shell/hash-link";
import { cn } from "@/lib/cn";

/**
 * The UnConference '26 CTA shape: a flat rectangle with two small diagonal
 * notches, bottom-left and top-right (the main site builds it from two 6x38
 * end caps around the "Request invite" button). Square otherwise, uppercase
 * DM Sans. Colours follow the main site's pass buttons: crimson, teal, gold.
 */
export const NOTCH = "[clip-path:polygon(0_0,calc(100%_-_7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%_-_7px))]";

const TONES = {
  crimson: "bg-crimson text-ink hover:bg-crimson-hover",
  teal: "bg-teal text-ink hover:bg-[#2a515a]",
  gold: "bg-gold text-cream-ink hover:bg-[#f3d98e]",
} as const;

const SIZES = {
  md: "min-h-11 px-5 text-[14px]",
  lg: "min-h-[52px] px-6 text-[16px] md:min-h-14 md:px-7 md:text-[17px]",
} as const;

/** The notched button classes, for client components that render their own element. */
export function notchClass(tone: keyof typeof TONES = "crimson", size: keyof typeof SIZES = "lg") {
  return cn(
    "group/notch inline-flex items-center justify-center gap-2.5 font-medium tracking-[0.04em] uppercase transition-colors duration-200 ease-soft",
    NOTCH,
    TONES[tone],
    SIZES[size],
  );
}

export function NotchLink({
  href,
  children,
  tone = "crimson",
  size = "lg",
  arrow = true,
  publicUrl,
  target,
  className,
}: {
  href: string;
  /** With a hash href: link to this public page + hash and scroll in-frame (HashLink). */
  publicUrl?: string;
  /** For links to other pages: "_top" for theproductfolks.com, "_blank" for third-party sites. */
  target?: "_top" | "_blank";
  children: ReactNode;
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
  arrow?: boolean;
  className?: string;
}) {
  const body = (
    <>
      {children}
      {arrow ? <ArrowRightIcon className="size-[18px] shrink-0 transition-transform duration-200 ease-soft group-hover/notch:translate-x-1" /> : null}
    </>
  );
  const cls = cn(notchClass(tone, size), className);
  if (publicUrl && href.startsWith("#")) {
    return (
      <HashLink hash={href as `#${string}`} publicUrl={publicUrl} className={cls}>
        {body}
      </HashLink>
    );
  }
  return (
    <a href={href} target={target} rel={target === "_blank" ? "noopener" : undefined} className={cls}>
      {body}
    </a>
  );
}
