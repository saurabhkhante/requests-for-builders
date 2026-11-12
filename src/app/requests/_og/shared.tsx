import { readFile } from "node:fs/promises";
import path from "node:path";
import { cloneElement, type CSSProperties, type ReactElement } from "react";

import type { Person } from "../content";

/**
 * Shared bits for the RFS share images (next/og). Fonts and brand files live
 * next to this file because next/og can't read woff2 or AVIF. Rendered from
 * content.ts, so the images never drift from the board.
 */
const OG_DIR = path.join(process.cwd(), "src/app/requests/_og");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export const C = {
  bg: "#162220",
  deep: "#0e1816",
  ink: "#eae6da",
  muted: "rgba(234, 230, 218, 0.66)",
  rule: "rgba(234, 230, 218, 0.18)",
  gold: "#eecd7a",
  crimson: "#bd2d53",
  teal: "#204149",
  tealLight: "#6fb4bb",
  creamInk: "#162220",
} as const;

export async function ogFonts() {
  const [regular, semibold, serif] = await Promise.all([
    readFile(path.join(OG_DIR, "dm-sans-400.woff")),
    readFile(path.join(OG_DIR, "dm-sans-600.woff")),
    readFile(path.join(OG_DIR, "pt-serif-700.ttf")),
  ]);
  return [
    { name: "DM Sans", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "DM Sans", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "PT Serif", data: serif, weight: 700 as const, style: "normal" as const },
  ];
}

async function dataUrl(file: string, mime: string) {
  const buf = await readFile(file);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export const ogAsset = (name: string) =>
  dataUrl(path.join(OG_DIR, name), name.endsWith(".png") ? "image/png" : "image/jpeg");

export const personPhoto = (p: Person) =>
  p.photo ? dataUrl(path.join(PUBLIC_DIR, "brand/rfs", p.photo), "image/jpeg") : Promise.resolve(null);

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Cut at a word boundary so the image never ends mid-word. */
export function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

export function Face({ person, src, size }: { person: Person; src: string | null; size: number }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img>
    <img src={src} width={size} height={size} alt="" style={{ borderRadius: size, objectFit: "cover" }} />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: C.tealLight,
        color: C.creamInk,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "PT Serif",
        fontSize: size * 0.36,
      }}
    >
      {initials(person.name)}
    </div>
  );
}

/** `?scale=` on an image route, clamped to 1–3. Anything else renders at 1x. */
export function ogScale(req: globalThis.Request) {
  const n = Number(new URL(req.url).searchParams.get("scale") ?? 1);
  return Number.isFinite(n) ? Math.min(3, Math.max(1, n)) : 1;
}

/**
 * Renders a w×h layout at w*s × h*s. The root keeps its w×h layout and is
 * scaled up; Satori scales around the centre, so it's shifted by
 * (s-1)/2 of its size to land in the top-left corner. At s = 1 the root is
 * returned untouched, so 1x output is unchanged.
 */
export function scaled(root: ReactElement<{ style?: CSSProperties }>, w: number, h: number, s: number) {
  if (s === 1) return { node: root, width: w, height: h };
  const node = (
    <div style={{ display: "flex", width: w * s, height: h * s }}>
      {cloneElement(root, {
        style: {
          ...root.props.style,
          width: w,
          height: h,
          flexShrink: 0,
          transform: `translate(${(w * (s - 1)) / 2}px, ${(h * (s - 1)) / 2}px) scale(${s})`,
        },
      })}
    </div>
  );
  return { node, width: Math.round(w * s), height: Math.round(h * s) };
}
