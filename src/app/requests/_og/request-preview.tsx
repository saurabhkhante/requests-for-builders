import { ImageResponse } from "next/og";

import { people, requests, tracks } from "../content";
import { C, Face, clip, ogAsset, ogFonts, personPhoto, scaled } from "./shared";

/**
 * Link preview for one problem (1200×630, the shape WhatsApp, LinkedIn and X
 * show full-width). Same look as the portrait share card, laid out sideways:
 * the problem on the left, the person asking on the right.
 *
 * Served at 1x by p/[id]/opengraph-image.tsx, and at any scale by
 * p/[id]/image?scale=2 (the file convention can't read query params).
 */
export const PREVIEW_SIZE = { width: 1200, height: 630 };

const VISIBLE = requests.filter((r) => !r.hidden);
export const visibleRequestIds = () => VISIBLE.map((r) => ({ id: r.id }));

export async function requestPreview(id: string, scale = 1) {
  const r = VISIBLE.find((x) => x.id === id);
  if (!r) return new Response("Not found", { status: 404 });
  const p = people.find((x) => x.id === r.by)!;
  const track = tracks.find((t) => t.id === r.track)?.label ?? "";
  const [fonts, photo, wordmark, unconf] = await Promise.all([
    ogFonts(),
    personPhoto(p),
    ogAsset("tpf-wordmark.png"),
    ogAsset("unconf.png"),
  ]);

  const titleSize = r.title.length > 52 ? 54 : r.title.length > 34 ? 62 : 72;
  const role = [p.role, p.company].filter(Boolean).join(", ");

  const out = scaled(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `radial-gradient(circle at 0% 100%, rgba(189,45,83,0.42), rgba(22,34,32,0) 50%), ${C.bg}`,
          color: C.ink,
          fontFamily: "DM Sans",
        }}
      >
        {/* Left: the problem. */}
        <div style={{ display: "flex", flexDirection: "column", width: 790, padding: "48px 40px 44px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
            <img src={wordmark} width={100} height={60} alt="" />
            <div style={{ display: "flex", flexGrow: 1 }} />
            {r.moonshot ? (
              <div style={{ display: "flex", background: C.gold, color: C.creamInk, borderRadius: 999, padding: "7px 16px", fontSize: 19, fontWeight: 600 }}>
                Moonshot
              </div>
            ) : null}
            <div style={{ display: "flex", border: `2px solid ${C.rule}`, borderRadius: 999, padding: "5px 16px", fontSize: 19, color: C.muted }}>{track}</div>
          </div>

          <div style={{ display: "flex", marginTop: 34, fontSize: 19, letterSpacing: 4, color: C.gold, fontWeight: 600 }}>REQUESTS FOR BUILDERS</div>
          <div style={{ display: "flex", marginTop: 14, fontFamily: "PT Serif", fontSize: titleSize, lineHeight: 1.04, letterSpacing: -1 }}>{r.title}</div>
          <div style={{ display: "flex", marginTop: 22, borderLeft: `4px solid ${C.crimson}`, paddingLeft: 20, fontSize: 23, lineHeight: 1.4, color: C.muted }}>
            {r.shareLine ? clip(r.shareLine, r.title.length > 34 ? 120 : 160) : `“${clip(r.shareQuote ?? r.request, r.title.length > 34 ? 120 : 160)}”`}
          </div>

          <div style={{ display: "flex", flexGrow: 1 }} />
          <div style={{ display: "flex", fontSize: 22, fontWeight: 600 }}>Builder’s Day · Sun 22 Nov · Bengaluru</div>
        </div>

        {/* Right: who's asking, big enough to recognise in a chat thumbnail. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 410,
            padding: "60px 36px 44px",
            borderLeft: `2px solid ${C.rule}`,
            background: "rgba(14,24,22,0.45)",
          }}
        >
          <div style={{ display: "flex", flexGrow: 1 }} />
          <div style={{ display: "flex", borderRadius: 999, border: `5px solid ${C.gold}` }}>
            <Face person={p} src={photo} size={210} />
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 32, fontWeight: 600, textAlign: "center" }}>{p.name}</div>
          {role ? (
            <div style={{ display: "flex", marginTop: 4, fontSize: 21, color: C.muted, textAlign: "center", justifyContent: "center" }}>{role}</div>
          ) : null}
          <div style={{ display: "flex", flexGrow: 1 }} />
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
          <img src={unconf} width={170} height={60} alt="" />
        </div>
      </div>
    ),
    PREVIEW_SIZE.width,
    PREVIEW_SIZE.height,
    scale,
  );

  return new ImageResponse(out.node, { width: out.width, height: out.height, fonts });
}
