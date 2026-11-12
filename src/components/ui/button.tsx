import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * TPF buttons: uppercase, tracked, 12px radius.
 *   primary   crimson fill. Hover lifts with a hard beige offset shadow, press goes flat.
 *   secondary hairline outline (no shadow: hairlines and offset shadows never mix).
 *   ghost     text only.
 *   light     beige fill, for cream sections or a second strong action on dark.
 * Pass `arrow` for the trailing arrow that nudges right on hover.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "light";
export type ButtonSize = "lg" | "md" | "sm";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-3 rounded-button font-bold uppercase tracking-[0.12em] " +
  "transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-soft " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const lift =
  "[@media(hover:hover)]:hover:-translate-x-[3px] [@media(hover:hover)]:hover:-translate-y-[3px] " +
  "active:translate-x-0 active:translate-y-0 active:shadow-none";

const variants: Record<ButtonVariant, string> = {
  primary: cn("bg-crimson text-ink hover:shadow-[5px_5px_0_var(--ink)]", lift),
  secondary: "border border-rule-strong text-ink hover:border-ink hover:bg-glass active:bg-soft",
  ghost: "text-muted hover:bg-glass hover:text-ink",
  light: cn("bg-ink text-bg hover:shadow-[5px_5px_0_var(--crimson)]", lift),
};

const sizes: Record<ButtonSize, string> = {
  lg: "min-h-14 px-[26px] text-[13px] md:min-h-16 md:text-sm",
  md: "min-h-12 px-5 text-[13px]",
  sm: "min-h-11 px-4 text-xs",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

function Content({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {arrow ? (
        <ArrowRightIcon className="size-4 shrink-0 transition-transform duration-200 ease-soft group-hover/btn:translate-x-1.5" />
      ) : null}
    </>
  );
}

type Shared = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Trailing arrow that nudges on hover. */
  arrow?: boolean;
};

type ButtonProps = ComponentProps<"button"> & Shared;

export function Button({ variant, size, fullWidth, arrow, className, type = "button", children, ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> &
  Shared & {
    className?: string;
    children: ReactNode;
  };

export function ButtonLink({ variant, size, fullWidth, arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}
