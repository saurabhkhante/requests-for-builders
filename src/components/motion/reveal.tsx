"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { DURATION, EASE, STAGGER } from "./ease";

/**
 * Entry reveals: opacity + a small rise, once. Under reduced motion they
 * fade only (MotionProvider drops the transform, so the first render is the
 * same on server and client). Wrap server-rendered content; the children stay server
 * components.
 *
 *   <Reveal>…</Reveal>                          one block, on scroll into view
 *   <Reveal onMount delay={0.1}>…</Reveal>      above the fold, on load
 *   <RevealGroup as="ul"> <RevealItem as="li">…  staggered children
 */

const TAGS = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  span: motion.span,
} as const;

type Tag = keyof typeof TAGS;

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Rise distance in px (8 to 24 reads best). */
  y?: number;
  /** Animate on mount instead of when scrolled into view. */
  onMount?: boolean;
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
  id?: string;
};

function itemVariants(y: number, delay = 0): Variants {
  return {
    hidden: { opacity: 0, y },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.enter, ease: EASE, delay },
    },
  };
}

function trigger(onMount: boolean, amount: number) {
  return onMount
    ? { initial: "hidden", animate: "shown" }
    : { initial: "hidden", whileInView: "shown", viewport: { once: true, amount } };
}

export function Reveal({ children, as = "div", className, delay = 0, y = 16, onMount = false, amount = 0.2, id }: RevealProps) {
  const M = TAGS[as];
  return (
    <M id={id} className={className} variants={itemVariants(y, delay)} {...trigger(onMount, amount)}>
      {children}
    </M>
  );
}

type GroupProps = Omit<RevealProps, "y"> & {
  /** Seconds between children. */
  stagger?: number;
};

/** Staggers its RevealItem children. Has no motion of its own. */
export function RevealGroup({
  children,
  as = "div",
  className,
  delay = 0,
  stagger = STAGGER,
  onMount = false,
  amount = 0.15,
  id,
}: GroupProps) {
  const M = TAGS[as];
  const variants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <M id={id} className={className} variants={variants} {...trigger(onMount, amount)}>
      {children}
    </M>
  );
}

export function RevealItem({
  children,
  as = "div",
  className,
  y = 16,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  y?: number;
}) {
  const M = TAGS[as];
  return (
    <M className={className} variants={itemVariants(y)}>
      {children}
    </M>
  );
}
