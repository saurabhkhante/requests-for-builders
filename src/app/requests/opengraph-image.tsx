import { ImageResponse } from "next/og";

import { C, Face, ogAsset, ogFonts, personPhoto } from "./_og/shared";
import { copy, people, requests } from "./content";

/**
 * Link preview for the board (1200×630). Also exported as a PNG for the
 * Webflow page's Open Graph setting, since shared links point there.
 */
export const alt = "Requests for Builders: problems from founders, operators and VCs for Builder's Day, Sun 22 Nov, Bengaluru";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const visible = requests.filter((r) => !r.hidden);
  // Same order as the hero faces: the first people in content.ts with a photo.
  const faces = people.filter((p) => p.photo && visible.some((r) => r.by === p.id)).slice(0, 8);
  const [fonts, bg, wordmark, photos] = await Promise.all([
    ogFonts(),
    ogAsset("hero-bg.jpg"),
    ogAsset("tpf-wordmark.png"),
    Promise.all(faces.map(personPhoto)),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.bg, color: C.ink, fontFamily: "DM Sans" }}>
        <img src={bg} width={1200} height={629} alt="" style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(180deg, rgba(22,34,32,0.9) 0%, rgba(22,34,32,0.78) 60%, rgba(22,34,32,0.45) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", paddingTop: 44 }}>
          <img src={wordmark} width={110} height={66} alt="" />
          <div style={{ display: "flex", marginTop: 26, fontSize: 22, letterSpacing: 5, color: C.ink, opacity: 0.85, fontWeight: 600 }}>
            BUILDER’S DAY · SUN 22 NOV · BENGALURU
          </div>
          <div style={{ display: "flex", marginTop: 14, fontFamily: "PT Serif", fontSize: 104, lineHeight: 0.98, letterSpacing: -3 }}>Requests</div>
          <div style={{ display: "flex", fontFamily: "PT Serif", fontSize: 104, lineHeight: 0.98, letterSpacing: -3, color: C.gold }}>for Builders</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 26, color: C.ink, opacity: 0.88 }}>{copy.hero.from}</div>
          <div style={{ display: "flex", marginTop: 26 }}>
            {faces.map((p, i) => (
              <div key={p.id} style={{ display: "flex", marginLeft: i ? -14 : 0, borderRadius: 999, border: `4px solid ${C.bg}` }}>
                <Face person={p} src={photos[i]} size={64} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts, headers: { "Cache-Control": "public, max-age=3600, s-maxage=31536000, stale-while-revalidate=86400" } },
  );
}
