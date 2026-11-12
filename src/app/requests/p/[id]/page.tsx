import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { copy, people, requests } from "../../content";
import { Forward } from "./forward";

/**
 * Share link for one problem: /requests/p/<id>.
 *
 * The public board lives on Webflow, which serves one fixed preview for every
 * link. This page exists so a shared link previews as that problem's card
 * (photo, title, their words) in WhatsApp, LinkedIn and X. Crawlers read the
 * tags below and stop; people are sent on to the Webflow page with the problem
 * open (#id, which the Webflow embed passes into the board's iframe).
 *
 * The forward is client-side on purpose: a server redirect would send crawlers
 * to Webflow too, and they'd show its generic image again.
 */
const VISIBLE = requests.filter((r) => !r.hidden);

export function generateStaticParams() {
  return VISIBLE.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const r = VISIBLE.find((x) => x.id === id);
  if (!r) return {};
  const p = people.find((x) => x.id === r.by);
  const who = p ? [p.role, p.company].filter(Boolean).join(", ") : "";
  const title = `${r.title} · Requests for Builders`;
  const description = `From ${p?.name ?? "a builder"}${who ? ` (${who})` : ""}. ${copy.share.previewTail}`;
  const url = `${copy.share.linkBase}/${r.id}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = VISIBLE.find((x) => x.id === id);
  if (!r) notFound();
  const target = `${copy.share.publicUrl}#${r.id}`;
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-4 px-6 text-center">
      <Forward to={target} />
      <p className="eyebrow text-muted">Requests for Builders</p>
      <h1 className="max-w-[22ch] font-serif text-[clamp(28px,6vw,44px)] leading-[1.05] font-bold text-ink">{r.title}</h1>
      <a href={target} className="text-[15px] font-semibold text-ink underline decoration-ink/40 underline-offset-4">
        Open the problem
      </a>
    </main>
  );
}
