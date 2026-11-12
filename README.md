# Requests for Builders

A board of problems that founders, operators and VCs want solved, in their own words. Builders pick one and build it in four hours at **Builder's Day**, part of Product (Un)Conference '26 by The Product Folks: Sun 22 Nov, Bengaluru.

Live at [theproductfolks.com/request-for-builders](https://www.theproductfolks.com/request-for-builders) (a Webflow page that embeds this app's `/requests`).

## Run it

```sh
pnpm install
pnpm dev        # http://localhost:3000 (redirects to /requests)
pnpm build && pnpm start
```

This is **Next.js 16** (App Router, Cache Components, Turbopack, Tailwind 4). Some APIs and conventions differ from older Next.js versions; the bundled docs are in `node_modules/next/dist/docs/`.

## Routes

| Route | What it is |
| --- | --- |
| `/requests` | The board |
| `/requests/p/[id]` | Share page for one request. Serves its link preview, then forwards to the public board at `#<id>` |
| `/requests/p/[id]/opengraph-image` | Link preview, 1200×630 |
| `/requests/p/[id]/image` | Same link preview, accepts `?scale=` |
| `/requests/card/[id]` | Portrait share card, 1080×1350, accepts `?scale=` |
| `/requests/opengraph-image` | Board link preview, 1200×630 |

## Content

Everything lives in `src/app/requests/content.ts`: `people`, `requests`, `tracks`, and the page `copy`.

On each request:

- `request` is the sender's ask, lightly edited.
- `pitch` (optional) is our framing of a raw one-liner, never shown as a quote.
- `waysIn` are starting points written by the TPF team.
- `shareLine` is our one-line framing for share images, shown **without** quote marks.
- `shareQuote` is a shorter exact excerpt of their words, shown **in** quotes.

Share images use `shareLine` if set, else `shareQuote`, else `request`. Text is clipped at a word boundary:

- Portrait card: 190 characters if the title is longer than 40, else 240.
- Landscape link preview: 120 characters if the title is longer than 34, else 160.

Headshots are in `public/brand/rfs/` (the `photo` field on a person). Without one, the images show initials.

## Share images

The image layouts are in `src/app/requests/_og/` (`request-preview.tsx` for the landscape preview, `shared.tsx` for fonts, colours and helpers) and `src/app/requests/card/[id]/route.tsx` for the portrait card. They render from `content.ts`, so they never drift from the board.

### Hi-res copies

Add `?scale=2` (any value from 1 to 3) to render the same layout at a higher resolution:

```sh
curl -o card.png    "http://localhost:3000/requests/card/gold-purity?scale=2"      # 2160×2700
curl -o preview.png "http://localhost:3000/requests/p/gold-purity/image?scale=2"   # 2400×1260
```

The layout is laid out at its normal size, then scaled up, so it looks identical, just sharper. Without the parameter the output is unchanged.

Headshots in `public/brand/rfs/` are only 240×240, so faces look soft at 2x. Replacing them with square photos of 600px or more (same filenames) sharpens everything.

## exports/

Pre-rendered images, ready to post:

- `link-previews-2x/`: 55 link previews at 2400×1260, one per request id.
- `portrait-cards-2x/`: 55 portrait cards at 2160×2700.
- `board-preview.png`: the board's link preview.
- `launch-carousel/`: launch post material. `link-previews/` (12 picks plus a cover slide), `posters/` (posters plus a cover slide), `portraits/` (1080×1350 cards), and `carousel - posters.pdf`.
