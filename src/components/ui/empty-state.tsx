import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  /** A past-event photo shown as a small tilted polaroid. */
  photo?: { src: string; alt: string };
  className?: string;
};

/** Empty, locked, error and "not yet" states. Hairline frame, serif title. */
export function EmptyState({ icon, title, children, action, photo, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-panel border border-rule px-6 py-12 text-center md:py-16",
        className,
      )}
    >
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={176}
          height={176}
          sizes="176px"
          className="photo-grade mb-6 size-36 -rotate-3 drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)] md:size-44"
        />
      ) : icon ? (
        <span className="mb-5 grid size-14 place-items-center rounded-full bg-glass text-ink [&>svg]:size-6">{icon}</span>
      ) : null}
      <h2 className="font-serif text-2xl font-bold text-balance text-ink md:text-[28px]">{title}</h2>
      {children ? <div className="mt-3 max-w-md text-base leading-relaxed text-pretty text-muted">{children}</div> : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
