---
date: '2026-07-24'
ticket: 'BIZ-80'
topic: 'card-metadata-v3-direction'
status: 'blocked'
type: 'exploration'
---

# Handoff: card-metadata-v3-direction — direction chosen (List dense — foot); blocked on a footer-action ↔ image alignment tension

## Current Focus

The direction is **decided** and mostly built in v3, but we hit a **structural
snag the user is unhappy with and I could not resolve with nudges**: in *List
dense — foot*, the thumbnail is a filled block flush to the card's right content
edge, while the footer's delete/tick are glyphs inside padded square hit-targets.
Right-aligning the buttons to the same edge leaves the trailing glyph optically
inset from the image; pulling the button out (`marginRight: -6`) improved it but
still doesn't align, and pulling it further breaks the button's even hit-area
(and the mobile AA target the user already flagged). The user's read — correct —
is that **aligning action glyphs to a media block's edge is a category error**,
and the wider arrangement (small image top-right + two lonely icons bottom-right
with dead space between) "looks awful." **This is a layout-direction question,
not a pixel fix. Do NOT attempt another margin tweak. Next session should
reframe the dense-foot footer/media relationship (options below) and bring the
user a couple of genuinely different structures.**

Everything else in the spec is settled — see Learnings.

## Task(s)

- Narrowed v2's ten options to **four** in v3 (2 Thumb-right, 2 List-dense) and
  the user landed on **List dense — foot**.
- Built a separate **URL-fallback study** (`URL fallback playground.html` +
  `playground/pg4.jsx`) to settle how the failed-extraction URL headline reads;
  resolved: **mono ("machine font"), stays black, slightly smaller** — the user
  likes it, especially on long URLs.
- Added a **Density: Compact / Comfortable** lever to dense-foot so the roomier
  thumb-right sizing lives in the same card (Comfortable ≈ the expanded look).
- Attempted the footer-action alignment fix — **not resolved** (see Current Focus).

## Critical References

- `docs/specs/biz-80-metadata/PROMPT.md` — settled MVP rules; do not reopen.
- `docs/specs/biz-80-metadata/handoff-2026-07-24_card-metadata-v2.md` — the prior (v2, ten-option) handoff.
- `CLAUDE.md` — brand + voice (accent `#047857`, danger `#991b1b`, no emoji, calm floor); `tokens.css` + `app/primitives.jsx` (Icon/Avatar/LogoMark) reused. Real app card to match: `app/feed.jsx:22-78` (the hairline foot lives at `:57-66`).

## The settled spec (List dense — foot)

- Layout **List dense — foot**; **HR off**; **image on the right**.
- **Favicon fallback = none** (no fabricated globe/monogram); **image fallback =
  none**. **Text displacement when no favicon is accepted.**
- **Open affordance = title + image only** (both clickable); source, favicon,
  attribution, footer are NOT open targets. Hover underlines the title; thumb
  brightens.
- **Mark-as-read = a bare tick that opens the Swell modal**; **delete opens a
  confirm modal** — both are real-app behaviours (implementation), playground
  keeps the tick inert.
- **Failed title → URL becomes the headline**, in **mono, black (`fg-1`), 14px**
  (slightly smaller than a real title). Source still falls back to the bare
  domain.

## Recent changes

- `playground/pg3-cards.jsx` — `DenseFoot` now reads `cfg.density`
  (compact 46px thumb / comfortable 72px + larger title); actions wrapper got
  `marginLeft:auto, marginRight:-6` (the unresolved alignment attempt). `Title3`
  renders the fallback URL as an `<a class="pg-url-headline">`. `Thumb3`/`Title3`
  are the only links (open affordance); `OpenZone3` is a plain layout `<div>`.
- `playground/pg3-app.jsx` — `DEFAULT_OV3` now `hr:false, density:'compact'`,
  default option `4`; added the **Density** control; removed the old Raw-URL lever.
- `Card metadata playground v3.html` — `.pg-url-headline` → `fg-1`, 14px; open
  affordance CSS (`a.pg-title:hover`, `.pg-thumblink:hover .pg-media`), removed
  the whole-card hover-lift.
- `playground/pg3-data.jsx` — both stress cards carry real images; `NO_FAVICON`
  = the two example hosts **+ danluu.com** (bare-domain-source sites don't ship a
  favicon; the live service's globe is itself a fabrication).
- `playground/pg4.jsx` + `URL fallback playground.html` — the URL-headline study:
  Mono-dark / Sans-plain / Domain-headline+path / Truncated, with URL-length and
  image toggles.

## Learnings

- **The alignment problem is structural.** A media thumbnail (filled block, flush
  to the content edge) and footer icon actions (centered glyphs in padded
  hit-targets) are different object classes; they will not optically agree at a
  shared right edge, and forcing it degrades the button's touch target. Stop
  nudging. Candidate reframes for next session:
  1. **Don't relate them** — align footer buttons as buttons (their own edge),
     accept the image is its own column; test whether the "misalignment" reads
     fine once we stop chasing it.
  2. **Kill the footer** — go with *List dense — fused* (actions on hover, no
     foot). This sidesteps the tension entirely; worth re-showing head-to-head.
  3. **Image on the LEFT in dense** — leaves a clean text right-edge for the
     actions to align to, no competing media block.
  4. **Reconsider the empty-space read** — the lonely tick+delete bottom-right
     (esp. on the long-URL fail card, 2nd screenshot) is the ugliness; a fuller
     or differently-placed footer may matter more than the pixel alignment.
- **Durable, do-not-relitigate:** image fallback = no image; favicon fallback =
  nothing (never fabricate); OG image is fundamental when present; compact is
  the governing constraint; open affordance = title + thumb only; mono URL
  headline is an intentional honesty signal (raw address ≠ extracted title).
- Verification shares the user's `localStorage`: `pg_cardmeta_v3` (reset to
  `{option:4,ov:{}}`) and `pg_urlfallback`. html-to-image can't embed the
  cross-origin favicons — blank in screenshots, load live.
- User + "Jonny" both prefer the **compact** density; the comfortable/expanded
  thumb-right is retained (options 1–2 + Density=comfortable) as a reference in
  case image-generation later wants the larger thumb.

## Artifacts

- `Card metadata playground v3.html` + `playground/pg3-{data,cards,app}.jsx` — the deliverable; opens on List dense — foot.
- `URL fallback playground.html` + `playground/pg4.jsx` — the URL-headline study.
- v1/v2 preserved: `Card metadata playground.html` (+ `pg-*`), `Card metadata playground v2.html` (+ `pg2-*`).

## Action Items & Next Steps

1. **Resolve the footer-action ↔ image tension as a layout decision**, not a
   tweak — prototype reframes 1–3 above and show the user 2–3 distinct
   structures. This is the blocker.
2. Once structure is agreed, **consolidate to a single real card** in the app
   (`app/feed.jsx`) — wire the tick → Swell modal and delete → confirm modal
   (both already exist in the app), and honour the settled spec.
3. Confirm **mobile AA**: tick/delete ≥44px targets in the real build (playground uses 36px).
4. Fold the chosen URL-fallback treatment (mono/black/14px) into the final card (already in v3).

## Other Notes

- Editability out of scope (per PROMPT). Never a naked/broken card: a failed
  extraction still shows source (domain) + attribution + URL-as-headline.
- Do not add a revealed "Open" button — deliberately removed; the open target is
  the title + image only.
