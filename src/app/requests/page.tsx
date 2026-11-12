import type { Metadata } from "next";
import Image from "next/image";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HashLink } from "@/components/shell/hash-link";
import { TpfFooter } from "@/components/shell/tpf-footer";
import { PUBLIC_URLS } from "@/lib/public-urls";

import { NotchLink } from "../landing/_components/notch-cta";
import { TopBar } from "../landing/_components/top-bar";
import { Board } from "./_components/board";
import { copy as c, people, requests } from "./content";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  openGraph: { title: c.meta.title, description: c.meta.description },
  twitter: { card: "summary_large_image", title: c.meta.title, description: c.meta.description },
};

const visible = requests.filter((r) => !r.hidden);
const MAX_FACES = 6;
const NOTCH = "[clip-path:polygon(0_0,calc(100%_-_7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%_-_7px))]";

/**
 * Requests from Founders, Operators and VCs: the buildathon problem board.
 * Same chrome and type as /landing (bare route, TPF top bar). Embeddable on
 * the main Webflow site like /landing (see next.config.ts). Data and copy
 * live in ./content.ts.
 */
export default function RequestsPage() {
  return (
    <div data-bleed className="-mt-[var(--bar-h)]">
      <TopBar links={c.nav.links} cta={c.nav.cta} href="#pass" menuLabel={c.nav.menu} publicUrl={PUBLIC_URLS.requests} />
      {/* Dark hero, cream people grid (in Board), dark board, cream submit block, teal pass: alternates like /landing. */}
      <Hero />
      <Board />
      {c.submit.href ? <Submit /> : null}
      <Pass />
      <TpfFooter />
    </div>
  );
}

function Hero() {
  const askers = people.filter((p) => visible.some((r) => r.by === p.id));
  // Built to grow: a few faces, no counts (the list keeps changing).
  const faces = askers.filter((p) => p.photo).slice(0, MAX_FACES);
  return (
    // id matches /landing so the top bar's logo link scrolls back here.
    <section id="landing-hero" aria-labelledby="rfs-title" className="relative overflow-hidden">
      {/* Same UnConference '26 scene as /landing and the main site, so the launch page reads as part of the family. */}
      <Image src={c.hero.bg} alt="" fill preload sizes="100vw" className="pointer-events-none object-cover object-[50%_100%] select-none" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(33,53,53,0.78)_0%,rgba(33,53,53,0.55)_48%,rgba(33,53,53,0.05)_78%,rgba(33,53,53,0.5)_100%)]"
      />
      <RevealGroup
        onMount
        stagger={0.08}
        delay={0.05}
        className="frame relative flex min-h-[86svh] flex-col items-center pt-[calc(72px+clamp(28px,6vh,72px))] pb-[clamp(150px,24vh,320px)] text-center md:min-h-[100svh] md:pb-[clamp(180px,30vh,320px)]"
      >
        <RevealItem y={28}>
          <h1
            id="rfs-title"
            className="font-serif text-[clamp(48px,min(9.5vw,12vh),132px)] leading-[0.92] font-bold tracking-[-0.04em] text-ink [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]"
          >
            {c.hero.title.map((line, i) => (
              <span key={line} className={i === 1 ? "block text-gold" : "block"}>
                {line}
              </span>
            ))}
          </h1>
        </RevealItem>
        <RevealItem>
          <p className="mx-auto mt-[clamp(16px,2.6vh,28px)] max-w-[40ch] text-[17px] leading-[1.5] text-pretty text-ink/90 md:max-w-[52ch] md:text-[20px]">
            {c.hero.body}
          </p>
        </RevealItem>

        {/* Who's asking, up front: faces + companies carry the credibility. */}
        <RevealItem className="mt-[clamp(20px,3.4vh,38px)] flex flex-col items-center gap-3">
          <HashLink hash="#people" publicUrl={PUBLIC_URLS.requests} aria-label={c.hero.stats.people} className="flex -space-x-2.5">
            {faces.map((p) => (
              <span key={p.id} title={p.name} className="relative inline-block size-10 overflow-hidden rounded-full ring-2 ring-bg md:size-11">
                {p.photo ? (
                  <Image src={`/brand/rfs/${p.photo}`} alt="" fill sizes="44px" className="object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center bg-teal-light font-serif text-[14px] font-bold text-cream-ink">
                    {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                )}
              </span>
            ))}
            {/* More askers than faces: a quiet "…" bubble in the same ring. */}
            <span
              title={c.hero.more}
              aria-hidden="true"
              className="relative inline-flex size-10 items-center justify-center gap-[3px] rounded-full bg-[#2a3a37] ring-2 ring-bg md:size-11"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-[5px] rounded-full bg-ink/85" />
              ))}
            </span>
          </HashLink>
        </RevealItem>

        <RevealItem className="mt-[clamp(18px,3vh,32px)] flex justify-center">
          <HashLink
            hash="#board"
            publicUrl={PUBLIC_URLS.requests}
            className={`inline-flex min-h-[52px] items-center gap-2.5 bg-crimson px-6 text-[16px] font-medium tracking-[0.04em] text-ink uppercase transition-colors hover:bg-crimson-hover md:min-h-14 md:px-7 md:text-[17px] ${NOTCH}`}
          >
            {c.hero.browse} ↓
          </HashLink>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}

/** Invite to send a request of your own. Rendered only once copy.submit.href (the form) is set. */
function Submit() {
  return (
    <section aria-labelledby="rfs-submit-title" className="on-cream bg-cream text-cream-ink">
      <Reveal className="frame flex flex-col gap-7 py-16 md:flex-row md:items-end md:justify-between md:gap-12 md:py-24">
        <div>
          <p className="eyebrow text-cream-muted">{c.submit.eyebrow}</p>
          <h2 id="rfs-submit-title" className="mt-4 max-w-[18ch] font-serif text-[clamp(34px,5vw,60px)] leading-[1] font-bold tracking-[-0.03em] text-cream-ink">
            {c.submit.title}
          </h2>
          <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-cream-muted md:text-[18px]">{c.submit.body}</p>
        </div>
        <a
          href={c.submit.href}
          target="_blank"
          rel="noopener"
          className={`inline-flex min-h-[52px] shrink-0 items-center gap-2.5 self-start bg-cream-ink px-6 text-[16px] font-medium tracking-[0.04em] text-cream uppercase transition-colors hover:bg-crimson hover:text-ink md:min-h-14 md:self-auto md:px-7 ${NOTCH}`}
        >
          {c.submit.cta} ↗
        </a>
      </Reveal>
    </section>
  );
}

function Pass() {
  return (
    <section id="pass" aria-labelledby="rfs-pass-title" className="relative scroll-mt-20 overflow-hidden border-t border-rule bg-teal">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-[560px] w-[760px] max-w-[180vw] rounded-full bg-[radial-gradient(closest-side,rgba(189,45,83,0.45),transparent)] blur-2xl"
      />
      <div className="frame relative py-16 md:py-24">
        <Reveal>
          <p className="eyebrow text-ink/75">{c.pass.eyebrow}</p>
          <h2 id="rfs-pass-title" className="mt-4 max-w-[16ch] font-serif text-[clamp(38px,6vw,72px)] leading-[0.98] font-bold tracking-[-0.03em] text-ink">
            {c.pass.title}
          </h2>
          <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-ink/85 md:text-[19px]">{c.pass.body}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* To the Builder's Day page on the main site; _top leaves the iframe. */}
          <NotchLink href={PUBLIC_URLS.landing} target="_top">
            {c.pass.cta}
          </NotchLink>
        </Reveal>
      </div>
    </section>
  );
}
