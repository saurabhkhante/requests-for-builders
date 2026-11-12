import { ImageResponse } from "next/og";

import { C, Face, clip, ogAsset, ogFonts, ogScale, personPhoto, scaled } from "../../_og/shared";
import { people, requests, tracks } from "../../content";

/**
 * One share image per problem (1080×1350, portrait for LinkedIn and X feeds).
 * Volunteers post this with their pick; the detail view's Share button
 * attaches it. Rendered from content.ts, so it never drifts.
 *
 * Add ?scale=2 (1–3) for a hi-res copy, e.g. 2160×2700.
 */
const VISIBLE = requests.filter((r) => !r.hidden);

export function generateStaticParams() {
  return VISIBLE.map((r) => ({ id: r.id }));
}

export async function GET(req: globalThis.Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const titleSize = r.title.length > 60 ? 76 : r.title.length > 40 ? 88 : 100;
  const role = [p.role, p.company].filter(Boolean).join(", ");

  const out = scaled(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `radial-gradient(circle at 0% 100%, rgba(189,45,83,0.42), rgba(22,34,32,0) 55%), ${C.bg}`,
          color: C.ink,
          fontFamily: "DM Sans",
          padding: "72px 80px 64px",
        }}
      >
        {/* Top: who's behind it, and what this is. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
          <img src={wordmark} width={150} height={90} alt="" />
          <div style={{ display: "flex", gap: 14 }}>
            {r.moonshot ? (
              <div style={{ display: "flex", background: C.gold, color: C.creamInk, borderRadius: 999, padding: "10px 22px", fontSize: 26, fontWeight: 600 }}>
                Moonshot
              </div>
            ) : null}
            <div style={{ display: "flex", border: `2px solid ${C.rule}`, borderRadius: 999, padding: "8px 22px", fontSize: 26, color: C.muted }}>
              {track}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 88, fontSize: 26, letterSpacing: 5, color: C.gold, fontWeight: 600 }}>
          REQUESTS FOR BUILDERS
        </div>
        <div style={{ display: "flex", marginTop: 26, fontFamily: "PT Serif", fontSize: titleSize, lineHeight: 1.04, letterSpacing: -1.5 }}>
          {r.title}
        </div>

        {/* Their words, marked as a quote. */}
        <div style={{ display: "flex", marginTop: 44, borderLeft: `5px solid ${C.crimson}`, paddingLeft: 30, fontSize: 34, lineHeight: 1.42, color: C.muted }}>
          {r.shareLine ? clip(r.shareLine, r.title.length > 40 ? 190 : 240) : `“${clip(r.shareQuote ?? r.request, r.title.length > 40 ? 190 : 240)}”`}
        </div>

        <div style={{ display: "flex", flexGrow: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Face person={p} src={photo} size={124} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 42, fontWeight: 600 }}>{p.name}</div>
            {role ? <div style={{ display: "flex", marginTop: 4, fontSize: 30, color: C.muted }}>{role}</div> : null}
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 52, paddingTop: 36, borderTop: `2px solid ${C.rule}`, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 600 }}>Builder’s Day · Sun 22 Nov · Bengaluru</div>
            <div style={{ display: "flex", marginTop: 6, fontSize: 26, color: C.muted }}>theproductfolks.com/request-for-builders</div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
          <img src={unconf} width={230} height={81} alt="" />
        </div>
      </div>
    ),
    1080,
    1350,
    ogScale(req),
  );

  return new ImageResponse(out.node, {
    width: out.width,
    height: out.height,
    fonts,
    // Rendering takes a couple of seconds; let the CDN keep it. Each deploy starts a fresh cache.
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=31536000, stale-while-revalidate=86400" },
  });
}
