"use client";

import { useEffect, useRef } from "react";

import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/cn";

import type { Person } from "../content";
import { Monogram, subline } from "./request-card";

/** Drift speed, px per second. Slow enough to read a name as it passes. */
const SPEED = 26;
/** After a swipe (or its momentum) settles, wait this long before drifting again. */
const RESUME_MS = 2200;

/**
 * Phones: everyone behind the ideas as a row of cards that drifts on its own
 * (a marquee) but is still a real scroller: swipe it either way, tap a card to
 * filter the board. The list is rendered twice so the drift loops without a
 * seam (the copy is hidden from screen readers and the tab order). Any scroll
 * we didn't make (a swipe, its momentum, a trackpad) pauses the drift, which
 * picks up from wherever it was left. Off screen it doesn't run; with reduced
 * motion it never drifts and is just a swipeable row.
 */
export function PeopleMarquee({
  list,
  active,
  onPick,
  className,
}: {
  list: readonly Person[];
  active: string | null;
  onPick: (id: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    let last = 0;
    let pos = el.scrollLeft;
    let held = false;
    let visible = false;
    let resumeAt = 0;

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(t - last, 64) : 0;
      last = t;
      // Someone else moved it (swipe, momentum, trackpad): follow, then wait.
      if (Math.abs(el.scrollLeft - pos) > 2) {
        pos = el.scrollLeft;
        resumeAt = t + RESUME_MS;
        return;
      }
      if (held || !visible || t < resumeAt) return;
      // One full set: from the first card to the first card of the copy.
      const first = el.querySelector("li");
      const again = el.querySelector<HTMLElement>("li[data-loop]");
      const loop = first && again ? again.offsetLeft - first.offsetLeft : el.scrollWidth / 2;
      pos += (SPEED * dt) / 1000;
      if (pos >= loop) pos -= loop;
      el.scrollLeft = pos;
    };

    const hold = () => {
      held = true;
    };
    const release = () => {
      held = false;
      resumeAt = performance.now() + RESUME_MS;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);
    el.addEventListener("touchstart", hold, { passive: true });
    el.addEventListener("touchend", release);
    el.addEventListener("touchcancel", release);
    el.addEventListener("pointerdown", hold);
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("touchstart", hold);
      el.removeEventListener("touchend", release);
      el.removeEventListener("touchcancel", release);
      el.removeEventListener("pointerdown", hold);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
    };
  }, [reduced]);

  const row = (copy: boolean) =>
    list.map((p, i) => {
      const on = active === p.id;
      return (
        <li key={`${copy ? "b" : "a"}-${p.id}`} aria-hidden={copy || undefined} data-loop={copy && i === 0 ? "" : undefined} className="flex">
          <button
            type="button"
            aria-pressed={copy ? undefined : on}
            tabIndex={copy ? -1 : undefined}
            onClick={() => onPick(p.id)}
            className={cn(
              "flex w-[136px] flex-col items-center gap-3 rounded-[0_0_16px_0] border px-3 pt-4 pb-3.5 text-center transition-colors duration-200 ease-soft",
              on ? "border-cream-ink bg-cream" : "border-cream-rule bg-cream-card",
            )}
          >
            <Monogram person={p} className="size-[68px] bg-cream text-[22px] ring-2 ring-cream" />
            <span className="flex flex-col gap-1">
              <span className="line-clamp-2 text-[14px] leading-tight font-semibold text-cream-ink">{p.name}</span>
              {subline(p) ? <span className="line-clamp-2 text-[12.5px] leading-[1.3] text-cream-muted">{subline(p)}</span> : null}
            </span>
          </button>
        </li>
      );
    });

  return (
    <div
      ref={ref}
      className={cn(
        "-mx-4 overflow-x-auto [scrollbar-width:none] [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_90%,transparent)] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      <ul className="flex w-max items-stretch gap-2.5 px-4 py-1">
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}
