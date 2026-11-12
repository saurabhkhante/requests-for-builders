"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type AnchorHTMLAttributes } from "react";

import { CloseIcon } from "@/components/icons";
import { HashLink } from "@/components/shell/hash-link";
import { TPF } from "@/lib/brand";
import { cn } from "@/lib/cn";

/**
 * Top bar after the main UnConference '26 site (.unconf26-nav-copy): a
 * floating panel inset from the edges with rounded bottom corners, a dark
 * glass blur (it reads grey over the cream sections), TPF logo left,
 * uppercase links in the middle with the section you're in shown in
 * crimson, and a gold ticket hanging on the right as the pass button.
 *
 * `external` links (other pages) open in the top window and stay out of the
 * scroll spy. With `publicUrl`, in-page links (hash hrefs, logo, ticket) point
 * at the public Webflow page instead of the framed vercel.app URL.
 */
export type TopBarLink = { label: string; href: string; external?: boolean };

export function TopBar({
  links,
  cta,
  href,
  menuLabel,
  publicUrl,
}: {
  links: readonly TopBarLink[];
  cta: string;
  href: string;
  menuLabel: string;
  /** Public page this one is framed on (see PUBLIC_URLS). */
  publicUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  // Scroll spy: the link whose section crosses the upper third of the screen.
  useEffect(() => {
    const els = links
      .filter((l) => !l.external && l.href.startsWith("#"))
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "landing-final" ? null : `#${e.target.id}`);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // The closing CTA isn't in the nav, so reaching it clears the highlight.
    const final = document.getElementById("landing-final");
    if (final) io.observe(final);
    const onTop = () => window.scrollY < 200 && setActive(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [links]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Phones: a tap outside the bar or a real scroll closes the menu.
    const onDown = (e: PointerEvent) => !header.current?.contains(e.target as Node) && setOpen(false);
    const y0 = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - y0) > 24 && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <header ref={header} className="fixed inset-x-0 top-0 z-40 mx-auto w-[95%] max-w-[1180px] rounded-b-[20px] bg-black/20 text-ink backdrop-blur-[60px] lg:w-[78%]">
      <div className="relative flex h-16 items-center pr-[76px] pl-5 md:h-[72px] md:pr-[92px] md:pl-8">
        <BarLink href="#landing-hero" publicUrl={publicUrl} aria-label="The Product Folks, back to top" className="shrink-0">
          <Image src={TPF.wordmark.src} alt="The Product Folks" width={TPF.wordmark.w} height={TPF.wordmark.h} preload className="h-9 w-auto md:h-11" />
        </BarLink>

        <nav aria-label="Sections" className="mx-auto hidden md:block">
          <ul className="flex items-center">
            {links.map((l) => (
              <li key={l.href}>
                <BarLink
                  href={l.href}
                  external={l.external}
                  publicUrl={publicUrl}
                  aria-current={active === l.href ? "true" : undefined}
                  className={cn(
                    "block px-2.5 py-4 text-[14px] uppercase transition-colors duration-200 ease-soft lg:px-3.5 lg:text-[15px]",
                    active === l.href ? "text-crimson" : "text-ink/70 hover:text-ink",
                  )}
                >
                  {l.label}
                </BarLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="landing-menu"
          aria-label={menuLabel}
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex size-11 items-center justify-center text-ink md:hidden"
        >
          {open ? (
            <CloseIcon className="size-5" />
          ) : (
            <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
              <span className="h-[1.5px] w-full bg-current" />
              <span className="h-[1.5px] w-full bg-current" />
            </span>
          )}
        </button>

        <TicketLink href={href} publicUrl={publicUrl} label={cta} className="absolute top-0 right-4 md:right-6" />
      </div>

      {open ? (
        <nav id="landing-menu" aria-label="Sections" className="border-t border-ink/10 px-5 pb-4 md:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-ink/10 last:border-b-0">
                <BarLink
                  href={l.href}
                  external={l.external}
                  publicUrl={publicUrl}
                  onClick={() => setOpen(false)}
                  className={cn("block py-3.5 text-[15px] uppercase", active === l.href ? "text-crimson" : "text-ink")}
                >
                  {l.label}
                </BarLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

/**
 * One link in the bar. External: a plain link out of the frame. Hash href with
 * a publicUrl: HashLink (public URL on hover, smooth scroll on click).
 * Otherwise a plain anchor, as before.
 */
function BarLink({
  href,
  external,
  publicUrl,
  ...rest
}: { href: string; external?: boolean; publicUrl?: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (external) return <a href={href} target="_top" {...rest} />;
  if (publicUrl && href.startsWith("#")) return <HashLink hash={href as `#${string}`} publicUrl={publicUrl} {...rest} />;
  return <a href={href} {...rest} />;
}

/**
 * Gold admit-one ticket hanging from the top edge, like the main site's
 * "Request passes" stub but drawn in SVG so it says our CTA. Swings a touch
 * on hover.
 */
function TicketLink({ href, publicUrl, label, className }: { href: string; publicUrl?: string; label: string; className?: string }) {
  const words = label.toUpperCase().split(" ");
  const line1 = words.slice(0, -1).join(" ") || words[0];
  const line2 = words.length > 1 ? words[words.length - 1] : "";
  const bars = [2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 1, 3, 1];
  let x = 10;
  return (
    <BarLink
      href={href}
      publicUrl={publicUrl}
      aria-label={label}
      className={cn(
        "block origin-top transition-transform duration-300 ease-soft hover:rotate-[-4deg] hover:translate-y-0.5 focus-visible:rotate-[-4deg]",
        "[filter:drop-shadow(0_6px_10px_rgba(0,0,0,0.35))]",
        className,
      )}
    >
      <svg viewBox="0 0 56 78" className="block h-[66px] w-auto md:h-[78px]" aria-hidden="true">
        <defs>
          <linearGradient id="tkt-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6dc8e" />
            <stop offset="0.45" stopColor="#d9ae52" />
            <stop offset="0.7" stopColor="#f0d07c" />
            <stop offset="1" stopColor="#c4913a" />
          </linearGradient>
        </defs>
        <path d="M0 0H56V41A5 5 0 0 0 56 51V78H0V51A5 5 0 0 0 0 41Z" fill="url(#tkt-gold)" />
        <text x="28" y={line2 ? 16 : 22} textAnchor="middle" fontFamily="var(--font-serif), serif" fontSize="8.4" fontWeight="700" fill="#4a3410">
          {line1}
        </text>
        {line2 ? (
          <text x="28" y="27" textAnchor="middle" fontFamily="var(--font-serif), serif" fontSize="8.4" fontWeight="700" fill="#4a3410">
            {line2}
          </text>
        ) : null}
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx={11 + i * 4.85} cy="46" r="1.15" fill="#7a5a1e" />
        ))}
        {bars.map((w, i) => {
          const rect = <rect key={i} x={x} y="56" width={w * 0.7} height="14" fill="#3b2a0c" />;
          x += w * 0.7 + 1.05;
          return rect;
        })}
      </svg>
    </BarLink>
  );
}
