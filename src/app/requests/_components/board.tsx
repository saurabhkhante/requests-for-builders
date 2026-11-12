"use client";

import { animate, AnimatePresence, motion, useMotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { EASE } from "@/components/motion/ease";
import { HashLink } from "@/components/shell/hash-link";
import { PUBLIC_URLS } from "@/lib/public-urls";
import { cn } from "@/lib/cn";

import { copy, people, tracks, type Person, type PersonType, type Request } from "../content";
import { CARD_CLASS, cardLabel, Monogram, NUMBER, PERSON, RequestCardBody, subline, Tags, VISIBLE } from "./request-card";

/** Only people with at least one visible request. */
const ASKERS = people.filter((p) => VISIBLE.some((r) => r.by === p.id));
/** People shown before "Show all", so a long list doesn't bury the problems. */
const PEOPLE_PREVIEW = 8;
const TYPES: readonly PersonType[] = ["Founder", "Operator", "VC"];
const TYPE_LABEL: Record<PersonType, string> = { Founder: "Founders", Operator: "Operators", VC: "VCs" };
/** Phones show the grid a page at a time ("Load more"); md and up always show everything. */
const PAGE = 6;
/** Height of the fixed site header the filter bar sticks under (top-16 / md:top-[72px]). */
const headerH = () => (window.innerWidth >= 768 ? 72 : 64);


function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-[14px] leading-none whitespace-nowrap transition-colors duration-200 ease-soft",
        active ? "border-ink bg-ink text-cream-ink" : "border-rule-strong text-ink/80 hover:border-ink/60 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function Board() {
  const [person, setPerson] = useState<string | null>(null);
  const [track, setTrack] = useState<string | null>(null);
  const [type, setType] = useState<PersonType | null>(null);
  const [q, setQ] = useState("");
  const [allPeople, setAllPeople] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [barHidden, setBarHidden] = useState(false);
  // Whether the filter bar is stuck under the header. Only then does it get a solid
  // backdrop; in place it sits on the page itself, so it reads as part of the section.
  const [stuck, setStuck] = useState(false);

  // Phones: tuck the sticky filter bar away while scrolling down the grid, bring it
  // back on any scroll up. Desktop has room, so it always stays.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const anchor = filtersTop.current?.getBoundingClientRect().top ?? 0;
      setStuck(anchor <= headerH() + 0.5);
      const down = y > last + 4;
      const up = y < last - 4;
      if (window.innerWidth >= 768 || anchor > 0 || up) setBarHidden(false);
      else if (down) setBarHidden(true);
      if (down || up) last = y;
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const shown = useMemo(
    () =>
      VISIBLE.filter((r) => {
        const p = PERSON.get(r.by);
        if (person && r.by !== person) return false;
        if (track && r.track !== track) return false;
        if (type && p?.type !== type) return false;
        if (q.trim()) {
          const hay = [r.title, r.request, r.pitch, p?.name, p?.company].join(" ").toLowerCase();
          if (!q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w))) return false;
        }
        return true;
      }),
    [person, track, type, q],
  );

  const filtered = !!(person || track || type || q.trim());

  // Phones: how many cards are showing. Tied to the filters, so any filter change starts
  // again at the first page (no effect needed). All cards are always rendered; the ones
  // past the limit are hidden below md with CSS, so server and client render the same.
  const filterKey = [person, track, type, q.trim()].join("|");
  const [more, setMore] = useState({ key: filterKey, n: PAGE });
  const limit = more.key === filterKey ? more.n : PAGE;
  // Read by the deep-link handler below, which is registered once.
  const view = useRef({ filterKey, shown });
  useEffect(() => {
    view.current = { filterKey, shown };
  });

  // The filter bar is sticky, so people tap chips deep in the grid. Filtering then
  // shrinks the page under them and the browser drops them at the footer. Jump back
  // to the top of the results first (only when they're already past it).
  const filtersTop = useRef<HTMLDivElement>(null);
  const toResults = () => {
    const el = filtersTop.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" });
  };

  const clear = () => {
    toResults();
    setPerson(null);
    setTrack(null);
    setType(null);
    setQ("");
  };

  // Deep links open that request: ?p=gold-purity (what share links use, passed in by the
  // Webflow embed) or #gold-purity. Checked on load and on hash change.
  useEffect(() => {
    const sync = () => {
      const id = new URLSearchParams(window.location.search).get("p") || window.location.hash.slice(1);
      if (!NUMBER.has(id)) return;
      setOpenId(id);
      // Keep the linked card on the page behind the detail, even past the first page on phones.
      const { filterKey: key, shown: list } = view.current;
      const i = list.findIndex((r) => r.id === id);
      if (i >= 0) setMore((m) => ({ key, n: Math.max(m.key === key ? m.n : PAGE, Math.ceil((i + 1) / PAGE) * PAGE) }));
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  // Opening from a card adds a history entry, so the phone's back button (or swipe back)
  // closes the detail instead of leaving the page. Deep links and prev/next only replace it.
  const pushed = useRef(false);
  const urlFor = (id: string | null) => {
    const params = new URLSearchParams(window.location.search);
    params.delete("p");
    const search = params.size ? `?${params}` : "";
    return window.location.pathname + search + (id ? `#${id}` : "");
  };
  const open = (id: string | null, how: "push" | "replace" = "replace") => {
    setOpenId(id);
    if (how === "push" && id) {
      window.history.pushState({ rfs: id }, "", urlFor(id));
      pushed.current = true;
    } else window.history.replaceState(null, "", urlFor(id));
  };
  const close = () => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back(); // popstate below closes it
    } else open(null);
  };
  useEffect(() => {
    // Back/forward between our own entries: the hash says what's open.
    window.history.scrollRestoration = "manual";
    const onPop = () => {
      const id = window.location.hash.slice(1);
      if (NUMBER.has(id)) setOpenId(id);
      else {
        pushed.current = false;
        setOpenId(null);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // A person view shows all of that person's requests, so it replaces the other filters
  // (and picking a track or type leaves the person view). Stacking them gave empty results.
  const pickPerson = (id: string) => {
    setPerson((cur) => (cur === id ? null : id));
    setTrack(null);
    setType(null);
    setQ("");
    document.getElementById("board")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ---------- Who's asking (cream, so the page alternates like /landing) ---------- */}
      <section id="people" aria-labelledby="people-title" className="on-cream scroll-mt-20 bg-cream text-cream-ink">
        <div className="frame py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="people-title" className="font-serif text-[clamp(32px,4.4vw,52px)] leading-[1] font-bold tracking-[-0.02em] text-cream-ink">
                {copy.people.title}
              </h2>
            </div>
            <p className="text-[15px] text-cream-muted">{copy.people.body}</p>
          </div>
          {/* Phones: everyone in one swipeable row, so the problems start sooner. */}
          <ul className="-mx-4 mt-7 flex snap-x items-start gap-1 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(90deg,#000_82%,transparent)] [scrollbar-width:none] sm:hidden">
            {ASKERS.map((p) => {
              const active = person === p.id;
              return (
                <li key={p.id} className="snap-start">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => pickPerson(p.id)}
                    className="flex w-[100px] flex-col items-center gap-2 rounded-xl px-1 py-2 text-center"
                  >
                    <Monogram
                      person={p}
                      className={cn("size-16 bg-cream-card text-[20px] ring-2 ring-offset-2 ring-offset-cream", active ? "ring-cream-ink" : "ring-transparent")}
                    />
                    <span className="flex flex-col gap-1">
                      <span className={cn("line-clamp-2 text-[13px] leading-tight text-cream-ink", active && "font-semibold")}>{p.name}</span>
                      {subline(p) ? <span className="line-clamp-2 text-[11px] leading-[1.3] text-cream-muted">{subline(p)}</span> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <ul className="mt-8 hidden auto-rows-fr gap-2.5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {(allPeople ? ASKERS : ASKERS.slice(0, PEOPLE_PREVIEW)).map((p) => {
              const active = person === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => pickPerson(p.id)}
                    className={cn(
                      "flex h-full w-full items-center gap-3.5 rounded-[0_0_16px_0] border p-3.5 text-left transition-colors duration-200 ease-soft",
                      active ? "border-cream-ink bg-cream-card" : "border-cream-rule hover:border-cream-ink/40 hover:bg-cream-card/60",
                    )}
                  >
                    <Monogram person={p} className="size-12 bg-cream-card text-[17px]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[16px] font-semibold text-cream-ink">{p.name}</span>
                      <span className="mt-0.5 line-clamp-2 block text-[14px] leading-snug text-cream-muted">{subline(p) || p.type || " "}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {ASKERS.length > PEOPLE_PREVIEW ? (
            <button
              type="button"
              onClick={() => setAllPeople((v) => !v)}
              className="mt-5 hidden text-[15px] font-semibold text-cream-ink underline decoration-cream-ink/40 underline-offset-4 hover:decoration-cream-ink sm:inline-block"
            >
              {allPeople ? copy.people.less : copy.people.all}
            </button>
          ) : null}
        </div>
      </section>

      {/* ---------- Board ---------- */}
      <section id="board" aria-labelledby="board-title" className="scroll-mt-16">
        <div className="frame pt-14 pb-16 md:pt-20 md:pb-24">
          <p className="eyebrow text-muted">{copy.board.eyebrow}</p>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 id="board-title" className="mt-3 font-serif text-[clamp(32px,4.4vw,52px)] leading-[1] font-bold tracking-[-0.02em] text-ink">
              {copy.board.title}
            </h2>
            <label className="flex h-12 w-full items-center gap-2.5 rounded-full border border-rule-strong px-4 focus-within:border-ink md:w-[340px]">
              <SearchIcon className="size-[18px] shrink-0 text-muted" />
              <span className="sr-only">{copy.board.filters.search}</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={copy.board.filters.search}
                className="h-full w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
              />
            </label>
          </div>

          <div ref={filtersTop} aria-hidden="true" className="mt-8 scroll-mt-16 md:scroll-mt-[72px]" />
          {/* Filters: sticky under the top bar so they stay at hand while scrolling the grid.
              In place they're see-through (same ground as the section). Once stuck, a full-bleed
              backdrop fills in up behind the header, painted with the body's own fixed gradient
              so it's the same colour as the page around it. iOS Safari ignores fixed
              backgrounds (the body gradient then spans the page, flat bg mid-page), so bg-bg there. */}
          <div
            className={cn(
              "sticky top-16 z-20 -mx-4 border-b border-rule py-3 transition-transform duration-300 ease-soft before:pointer-events-none before:absolute before:inset-x-[calc(50%-50vw)] before:-top-16 before:bottom-0 before:-z-10 before:bg-bg before:bg-fixed before:bg-[linear-gradient(180deg,#121a17_0%,#213535_30%,#213535_58%,#001314_100%)] supports-[-webkit-touch-callout:none]:before:bg-none md:top-[72px] md:mx-0 md:translate-y-0 md:before:-top-[72px]",
              stuck ? "before:block" : "before:hidden",
              barHidden && "-translate-y-[calc(100%+64px)]",
            )}
          >
            {/* Phones: two rows. From on top (three chips, fits without swiping), then Track
                as its own swipeable row faded at the edge. Desktop: one row that wraps. */}
            <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center md:gap-x-6">
              <div className="flex items-center gap-2 overflow-x-auto px-4 [mask-image:linear-gradient(90deg,#000_88%,transparent)] [scrollbar-width:none] md:flex-wrap md:overflow-visible md:px-0 md:[mask-image:none]">
                <span className="eyebrow w-14 shrink-0 text-muted md:w-auto md:pr-1">{copy.board.filters.track}</span>
                <Chip active={!track} onClick={() => { toResults(); setTrack(null); setPerson(null); }}>
                  {copy.board.filters.all}
                </Chip>
                {tracks.map((t) => (
                  <Chip key={t.id} active={track === t.id} onClick={() => { toResults(); setTrack(track === t.id ? null : t.id); setPerson(null); }}>
                    {t.label}
                  </Chip>
                ))}
              </div>
              <div className="order-first flex items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:order-none md:overflow-visible md:px-0">
                <span className="eyebrow w-14 shrink-0 text-muted md:w-auto md:pr-1">{copy.board.filters.from}</span>
                {TYPES.map((t) => (
                  <Chip key={t} active={type === t} onClick={() => { toResults(); setType(type === t ? null : t); setPerson(null); }}>
                    {TYPE_LABEL[t]}
                  </Chip>
                ))}
                {person ? (
                  <Chip active onClick={() => { toResults(); setPerson(null); }}>
                    {PERSON.get(person)?.name} <span aria-hidden="true">×</span>
                  </Chip>
                ) : null}
              </div>
              {filtered ? (
                <button
                  type="button"
                  onClick={clear}
                  className="hidden shrink-0 text-[14px] font-semibold whitespace-nowrap text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink md:ml-auto md:inline"
                >
                  {copy.board.clear}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 text-[14px] text-muted" aria-live="polite">
            {/* Count only while filtering; the full board shows no totals (the list keeps growing). */}
            <span>
              {filtered ? copy.board.showing(shown.length) : null}
              {filtered && person ? ` from ${PERSON.get(person)?.name}` : ""}
            </span>
            {/* On phones the Track row scrolls sideways, so Clear lives here where it's always in reach. */}
            {filtered ? (
              <button type="button" onClick={clear} className="font-semibold text-ink underline decoration-ink/40 underline-offset-4 md:hidden">
                {copy.board.clear}
              </button>
            ) : null}
          </div>

          {shown.length ? (
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              <AnimatePresence initial={false} mode="popLayout">
                {shown.map((r, i) => (
                  <motion.li
                    key={r.id}
                    className={cn(i >= limit && "max-md:hidden")}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <Card r={r} onOpen={() => open(r.id, "push")} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : null}
          {shown.length > limit ? (
            <button
              type="button"
              onClick={() => setMore({ key: filterKey, n: limit + PAGE })}
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full border border-rule-strong text-[15px] font-semibold text-ink transition-colors hover:border-ink/60 md:hidden"
            >
              {copy.board.more(shown.length - limit)}
            </button>
          ) : null}
          {shown.length ? null : (
            <p className="mt-10 text-[17px] text-muted">
              {copy.board.empty}{" "}
              <button type="button" onClick={clear} className="font-semibold text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink">
                {copy.board.clear}
              </button>
            </p>
          )}
        </div>
      </section>

      <Detail
        id={openId}
        // Prev/next walk the list as it's filtered now; a deep link outside it walks the whole board.
        list={openId && shown.some((r) => r.id === openId) ? shown : VISIBLE}
        onStep={(id) => open(id)}
        onClose={close}
      />
    </>
  );
}

function Card({ r, onOpen }: { r: Request; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-label={cardLabel(r)} className={CARD_CLASS}>
      <RequestCardBody r={r} />
    </button>
  );
}

function Detail({ id, list, onStep, onClose }: { id: string | null; list: readonly Request[]; onStep: (id: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const r = id ? VISIBLE.find((x) => x.id === id) : undefined;
  const p = r ? PERSON.get(r.by) : undefined;
  const i = r ? list.findIndex((x) => x.id === r.id) : -1;
  const prev = i > 0 ? list[i - 1] : undefined;
  const next = i >= 0 && i < list.length - 1 ? list[i + 1] : undefined;
  // Which way the last step went, so the new request slides in from that side.
  const [dir, setDir] = useState(0);
  const step = (to: Request | undefined, d: number) => {
    if (!to) return;
    setDir(d);
    onStep(to.id);
  };
  // Swipe sideways and drag-to-dismiss are for touch; on desktop dragging would fight text selection.
  const touch = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );
  // Drag the top of the sheet down to close it.
  const y = useMotionValue(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (r && !d.open) d.showModal();
    if (!r && d.open) d.close();
    document.documentElement.style.overflow = r ? "hidden" : "";
    if (!r) y.set(0);
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [r, y]);

  // A new request starts at its top.
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [id]);

  // Arrow keys step through on desktop.
  useEffect(() => {
    if (!r) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(next, 1);
      if (e.key === "ArrowLeft") step(prev, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const navBtn =
    "inline-flex size-11 items-center justify-center rounded-full text-cream-ink transition-colors hover:bg-cream-card disabled:pointer-events-none disabled:opacity-30";

  return (
    <dialog
      ref={ref}
      aria-labelledby="rfs-detail-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 mt-auto h-[92svh] max-h-none w-full max-w-none overflow-visible bg-transparent p-0 text-cream-ink backdrop:bg-black/70 backdrop:backdrop-blur-sm md:m-auto md:h-auto md:max-h-[86svh] md:w-[min(680px,calc(100vw-48px))]"
    >
      {r && p ? (
        <motion.div
          style={{ y }}
          className="on-cream flex h-full max-h-[inherit] animate-[sheet-in_0.4s_cubic-bezier(0.22,1,0.36,1)] flex-col overflow-hidden rounded-t-[20px] bg-cream md:animate-[sheet-up_0.3s_cubic-bezier(0.22,1,0.36,1)] md:rounded-[0_0_24px_0]"
        >
          {/* Header doubles as the drag handle on phones. */}
          <motion.div
            onPan={touch ? (_, info) => y.set(Math.max(0, info.offset.y)) : undefined}
            onPanEnd={
              touch
                ? (_, info) => {
                    if (info.offset.y > 110 || info.velocity.y > 600) {
                      animate(y, window.innerHeight, { duration: 0.22, ease: EASE }).then(onClose);
                    } else animate(y, 0, { type: "spring", stiffness: 500, damping: 40 });
                  }
                : undefined
            }
            className="shrink-0 touch-none border-b border-cream-rule px-3 pb-2 md:touch-auto md:px-6 md:py-2"
          >
            <span aria-hidden="true" className="mx-auto mt-2 mb-1 block h-1 w-10 rounded-full bg-cream-ink/20 md:hidden" />
            <div className="flex items-center justify-between gap-2">
              <span className="eyebrow pl-2 text-cream-muted">RFS {NUMBER.get(r.id)}</span>
              <div className="flex items-center gap-0.5">
                {list.length > 1 && i >= 0 ? (
                  <>
                    <button type="button" onClick={() => step(prev, -1)} disabled={!prev} aria-label={copy.detail.prev} className={navBtn}>
                      <ChevronLeftIcon className="size-5" />
                    </button>
                    <span className="min-w-[4.5rem] text-center text-[14px] text-cream-muted tabular-nums" aria-live="polite">
                      {copy.detail.position(i + 1, list.length)}
                    </span>
                    <button type="button" onClick={() => step(next, 1)} disabled={!next} aria-label={copy.detail.next} className={navBtn}>
                      <ChevronRightIcon className="size-5" />
                    </button>
                  </>
                ) : null}
                <button type="button" onClick={onClose} aria-label={copy.detail.close} className={cn(navBtn, "ml-1")}>
                  <CloseIcon className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>
          <div ref={body} className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
            <motion.div
              key={r.id}
              initial={dir ? { opacity: 0, x: dir * 56 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              drag={touch ? "x" : false}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 || info.velocity.x < -500) step(next, 1);
                else if (info.offset.x > 70 || info.velocity.x > 500) step(prev, -1);
              }}
              className="px-5 pt-6 pb-8 md:px-8 md:pt-8"
            >
              <Tags r={r} className="text-cream-muted" />
              <h3 id="rfs-detail-title" className="mt-4 font-serif text-[clamp(30px,4vw,38px)] leading-[1.08] font-bold tracking-[-0.02em]">
                {r.title}
              </h3>
              <div className="mt-6 flex items-center gap-3.5">
                <Monogram person={p} className="size-12 text-[17px]" />
                <span>
                  <span className="block text-[17px] font-semibold">{p.name}</span>
                  <span className="block text-[15px] text-cream-muted">{[subline(p), p.type && !p.role.toLowerCase().includes(p.type.toLowerCase()) ? p.type : null].filter(Boolean).join(" · ")}</span>
                </span>
              </div>

              {/* Their words first, as a quote. Our framing of a short reply comes after, labelled as ours. */}
              <p className="eyebrow mt-8 text-cream-muted">{copy.detail.request}</p>
              <blockquote className="mt-3 border-l-[3px] border-crimson pl-4 text-[18px] leading-[1.6]">{r.request}</blockquote>
              {r.pitch ? (
                <>
                  <p className="eyebrow mt-8 text-cream-muted">{copy.detail.pitch}</p>
                  <p className="mt-3 text-[18px] leading-[1.6]">{r.pitch}</p>
                </>
              ) : null}

              {r.waysIn.length ? (
                <>
                  <p className="eyebrow mt-8 text-cream-muted">{copy.detail.waysIn}</p>
                  <ul className="mt-3 flex flex-col gap-3">
                    {r.waysIn.map((w) => (
                      <li key={w} className="flex gap-3 text-[17px] leading-[1.55]">
                        <span aria-hidden="true" className="mt-[0.6em] inline-block size-2 shrink-0 rotate-45 bg-crimson" />
                        {w}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[15px] leading-snug text-cream-muted">{r.moonshot ? copy.detail.moonshotNote : copy.detail.waysInNote}</p>
                </>
              ) : null}

              <ShareKit r={r} p={p} />
            </motion.div>
          </div>
          <div className="flex shrink-0 gap-2.5 border-t border-cream-rule px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] md:px-8 md:py-4">
            <HashLink
              hash="#pass"
              publicUrl={PUBLIC_URLS.requests}
              onClick={(e) => {
                // Cmd/ctrl-click etc. open the public page as usual (HashLink skips those).
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                // Close first: the page is scroll-locked while the dialog is open, and closing may
                // step back in history, so scroll once that has settled.
                e.preventDefault();
                onClose();
                setTimeout(() => document.getElementById("pass")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
              }}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 bg-crimson px-6 text-[15px] font-medium tracking-[0.04em] text-ink uppercase transition-colors hover:bg-crimson-hover [clip-path:polygon(0_0,calc(100%_-_7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%_-_7px))] sm:flex-none"
            >
              {copy.detail.cta} →
            </HashLink>
            <ShareButton r={r} p={p} />
          </div>
        </motion.div>
      ) : null}
    </dialog>
  );
}

/* ---------- Sharing ---------- */

const shareLink = (id: string) => `${copy.share.linkBase}/${id}`;
const cardSrc = (id: string) => `/requests/card/${id}`;

function shareText(r: Request, p: Person, forX = false) {
  const who = [p.role, p.company].filter(Boolean).join(", ");
  return copy.share.text({ title: r.title, name: forX && p.x ? `@${p.x}` : p.name, who, link: shareLink(r.id) });
}

/** Clipboard API is blocked in iframes without clipboard-write; fall back to execCommand. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const t = document.createElement("textarea");
    t.value = text;
    t.setAttribute("readonly", "");
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand("copy");
    t.remove();
    return ok;
  }
}

/**
 * The share image as a File, fetched once a request has been open for a moment (not on
 * every swipe past it) so the Share tap can call navigator.share straight away (iOS
 * drops the tap if we await a fetch first). Until it's ready, Share sends the link.
 */
function useCardFile(id: string) {
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    let live = true;
    const t = setTimeout(() => fetch(cardSrc(id))
      .then((res) => (res.ok ? res.blob() : null))
      .then((b) => {
        if (live && b) setFile(new File([b], `rfs-${id}.png`, { type: "image/png" }));
      })
      .catch(() => {}), 900);
    return () => {
      live = false;
      clearTimeout(t);
      setFile(null);
    };
  }, [id]);
  return file;
}

/**
 * Footer button. On phones it opens the native share sheet with the image attached,
 * so LinkedIn, X or WhatsApp get a ready post. Anywhere that can't (or inside an
 * iframe without web-share), it scrolls to the share options instead.
 */
function ShareButton({ r, p }: { r: Request; p: Person }) {
  const file = useCardFile(r.id);
  const onShare = async () => {
    const text = shareText(r, p);
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: r.title });
        return;
      }
      if (navigator.share) {
        await navigator.share({ text, url: shareLink(r.id), title: r.title });
        return;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
    document.getElementById("rfs-share")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <button
      type="button"
      onClick={onShare}
      className="inline-flex min-h-12 items-center justify-center border border-cream-ink/30 px-5 text-[15px] font-medium tracking-[0.04em] uppercase transition-colors hover:bg-cream-card"
    >
      {copy.share.native}
    </button>
  );
}

function ShareKit({ r, p }: { r: Request; p: Person }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { label: copy.share.linkedin, href: `https://www.linkedin.com/feed/?shareActive=true&text=${enc(shareText(r, p))}` },
    { label: copy.share.x, href: `https://x.com/intent/post?text=${enc(shareText(r, p, true))}` },
    { label: copy.share.whatsapp, href: `https://wa.me/?text=${enc(shareText(r, p))}` },
  ];
  const btn =
    "inline-flex min-h-11 items-center justify-center rounded-full border border-cream-ink/25 px-4 text-[14px] font-semibold transition-colors hover:border-cream-ink/60 hover:bg-cream-card";
  return (
    // Just the links: shared links preview as the problem's card on their own.
    <div id="rfs-share" className="mt-9 scroll-mt-4">
      <p className="eyebrow text-cream-muted">{copy.share.title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={btn}>
            {l.label}
          </a>
        ))}
        <button
          type="button"
          className={btn}
          onClick={async () => {
            if (await copyText(shareLink(r.id))) {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
        >
          <span aria-live="polite">{copied ? copy.share.copied : copy.share.copy}</span>
        </button>
      </div>
    </div>
  );
}
