import Image from "next/image";

import { cn } from "@/lib/cn";

import { copy, people, requests, tracks, type Person, type PersonType, type Request } from "../content";

/**
 * The request card as it appears on the board, shared so other pages (the
 * Builder's Day sneak peek) show exactly the same card. The wrapper element is
 * the caller's: a button on the board (opens the detail), a link elsewhere.
 */

/**
 * Board order: one request per person per round, people in the order set in
 * content.ts (the first 8 lead). Keeps the same person's cards apart while
 * staying stable between server and client renders.
 */
function interleave(list: readonly Request[]): Request[] {
  const queues = people.map((p) => list.filter((r) => r.by === p.id)).filter((q) => q.length > 0);
  const out: Request[] = [];
  for (let round = 0; out.length < list.length; round++) {
    const before = out.length;
    for (const q of queues) if (q[round]) out.push(q[round]);
    if (out.length === before) break; // requests whose author isn't in people[]
  }
  return out.concat(list.filter((r) => !out.includes(r)));
}
export const VISIBLE = interleave(requests.filter((r) => !r.hidden));
export const PERSON = new Map(people.map((p) => [p.id, p]));
export const TRACK = new Map(tracks.map((t) => [t.id, t.label]));
/** Public number per request ("RFS 07"), in board order. */
export const NUMBER = new Map(VISIBLE.map((r, i) => [r.id, String(i + 1).padStart(2, "0")]));

/** Monogram colour by who they are: same family as the pass colours. */
const TONE: Record<PersonType | "none", string> = {
  Founder: "bg-crimson text-ink",
  Operator: "bg-teal-light text-cream-ink",
  VC: "bg-gold text-cream-ink",
  none: "bg-rule-strong text-ink",
};

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function subline(p: Person) {
  return [p.role, p.company].filter(Boolean).join(", ");
}

export function Monogram({ person, className }: { person: Person; className?: string }) {
  if (person.photo)
    return (
      <span aria-hidden="true" className={cn("relative inline-block shrink-0 overflow-hidden rounded-full bg-rule", className)}>
        <Image src={`/brand/rfs/${person.photo}`} alt="" fill sizes="96px" className="object-cover" />
      </span>
    );
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-serif font-bold", TONE[person.type ?? "none"], className)}
    >
      {initials(person.name)}
    </span>
  );
}

export function Tags({ r, className }: { r: Request; className?: string }) {
  return (
    <span className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <span className="rounded-full border border-current/25 px-2.5 py-1 text-[13px] leading-none">{TRACK.get(r.track)}</span>
      {r.moonshot ? <span className="rounded-full bg-gold px-2.5 py-1 text-[13px] leading-none font-semibold text-cream-ink">{copy.board.moonshotTag}</span> : null}
    </span>
  );
}

/** Classes for the card's wrapper (button or link). */
export const CARD_CLASS =
  "group flex h-full w-full flex-col rounded-[0_0_20px_0] border border-rule bg-deep p-5 text-left transition-[transform,box-shadow,border-color] duration-300 ease-soft hover:-translate-y-1 hover:border-rule-strong hover:shadow-[6px_6px_0_0_var(--crimson)] focus-visible:-translate-y-1 md:p-6";

export function cardLabel(r: Request) {
  return `${copy.board.open}: ${r.title}, from ${PERSON.get(r.by)?.name ?? ""}`;
}

/** What's inside a card: number and tags, title, pitch, who's asking. */
export function RequestCardBody({ r }: { r: Request }) {
  const p = PERSON.get(r.by)!;
  return (
    <>
      <span className="flex items-start justify-between gap-3">
        <span className="eyebrow pt-1 text-muted">RFS {NUMBER.get(r.id)}</span>
        <Tags r={r} className="justify-end text-muted" />
      </span>
      <span className="mt-5 line-clamp-3 font-serif text-[22px] leading-[1.15] font-bold text-ink md:text-[24px]">{r.title}</span>
      <span className="mt-3 mb-5 line-clamp-3 text-[16px] leading-relaxed text-ink/75 md:text-[15px]">{r.pitch ?? r.request}</span>
      <span className="mt-auto flex items-center gap-3 border-t border-rule pt-4">
        <Monogram person={p} className="size-10 text-[14px]" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-ink">{p.name}</span>
          {subline(p) ? <span className="block truncate text-[14px] text-muted">{subline(p)}</span> : null}
        </span>
        <span aria-hidden="true" className="text-[20px] text-muted transition-transform duration-300 ease-soft group-hover:translate-x-1 group-hover:text-ink">
          →
        </span>
      </span>
    </>
  );
}
