---
date: '2026-07-24'
ticket: 'BIZ-80'
topic: 'card-metadata-v2'
status: 'in-progress'
type: 'exploration'
---

# Handoff: card-metadata-v2 — image-forward regenerate of the enrichment playground

## Current Focus

v2 is delivered and out for review; **no direction chosen yet.** The user has
reacted in depth (see Learnings) and asked for a fresh 10-option regenerate.
Latest landed intent: **the OG image is fundamental — it must appear on every
treatment when one exists**, collapsing to text only when extraction genuinely
returned none. That reshape is done. Next session: wait for the user to pick an
**image treatment** + an **open model** (or a mix), then consolidate. Do not
consolidate before the pick.

## Task(s)

Regenerated the card-metadata playground as **v2**, same harness as v1 (rail =
options, heading = config, feed = every seed card in the chosen treatment). v1
(`Card metadata playground.html` + `playground/pg-*.jsx`) is preserved untouched.

**Ten directions, all image-forward + compact** (image shown whenever present,
text-only when absent): 1 Thumb left · 2 Thumb right · 3 Wide top · 4 Inset
preview · 5 Source band (image below the masthead) · 6 Big thumb · 7 Inline open
· 8 List dense · 9 URL opens · 10 Hover quiet.

**Config levers (heading):** Open via (Auto/Title/URL/Button — the star lever,
the open-affordance question), Favicon (Auto/On/Off), Raw URL (Auto/Show/Hide),
Extraction outcome (As seeded/No images/Total fail), Trace. Dropped from v1: the
Default-image lever and the show/hide Open toggle.

## Critical References

- `docs/specs/biz-80-metadata/PROMPT.md` — the settled MVP rules; do not reopen.
- `docs/specs/biz-80-metadata/handoff-2026-07-24_card-metadata-enrichment.md` — the v1 handoff (prior structure, original 5 options).
- `uploads/card-previews/SOURCES.md` — the real OG stand-in images the user supplied, and what each represents.
- `CLAUDE.md` — brand + voice (accent `#047857`, danger `#991b1b`, no emoji, calm floor); `tokens.css` + `app/primitives.jsx` (Icon/Avatar/LogoMark) reused.

## Recent changes

- `playground/pg2-data.jsx` — seed of 8 cards; real local preview images wired
  in (`uploads/card-previews/*`); long-title + long-URL stress cards + total-fail;
  `resolve()` returns `faviconUrl` (Google s2 service) and `trace.image` is now
  `preview | none` (no default-image path); 10 `OPTIONS` (`def.open`, `def.url`).
- `playground/pg2-cards.jsx` — atoms (Favicon, `CardImage`/`Square`/`Wide`,
  Headline, SourceRow, UrlSlot, Foot) + the ten treatments; every treatment
  renders the image when `card.hasImage`.
- `playground/pg2-app.jsx` — shell; `mergeCfg` resolves Open-via/Favicon/Raw-URL
  against each option's `def`; `localStorage` key `pg_cardmeta_v2`.
- `Card metadata playground v2.html` — host + CSS (`.pg-media/.pg-wide/.pg-inset`,
  urlpill, openchip, hover-reveal). Load order = dep order.

## Learnings

- **Durable review decisions (do not relitigate):**
  - Loading mechanics (optimistic / popover / inline) are implementation's call — **out of scope**, not a design lever.
  - **Image fallback = no image.** No OG image → nothing; no backup/default art. The v1 source-keyed default-image system is gone.
  - **But the OG image is fundamental** — present it on every treatment when it exists. (These two are consistent: earned by existence, never faked.)
  - **Compact is the governing constraint** — no oversized hero images; OG resolution is untrusted. The Pragmatic Engineer OG is a generic "Subscribe" brand card, and it looks poor stretched wide (options 3/5) — concrete evidence for restrained thumb sizes.
  - The **open affordance** ("how do you open a link") was the key thing v1 missed by reducing it to a show/hide toggle — now the "Open via" lever + options 7/9.
  - Don't over-stack truth signals (title + domain + source + URL + attribution + open was too much).
- **Favicon-as-a-second-attribution** is a distinct unbuilt thread. Current favicons are real *domain* favicons; the user's alternate idea was a favicon acting as another kind of attribution on the card. Not yet prototyped.
- Verification clicks share the user's `localStorage` (`pg_cardmeta_v2`); reset it to clean defaults (`option:1`, all `auto`) after probing so the user lands fresh. html-to-image can't embed cross-origin favicons — they render blank in screenshots but load live (confirmed 8/8 via the live view).

## Artifacts

- `Card metadata playground v2.html` (root) — the deliverable.
- `playground/pg2-data.jsx`, `playground/pg2-cards.jsx`, `playground/pg2-app.jsx`.
- `uploads/card-previews/` — real OG stand-ins (`github-react.png`,
  `youtube-maxres.jpg`/`hqdefault.jpg`, `pragmatic-engineer.jpg`,
  `blog-overreacted.png`) + `SOURCES.md`.
- v1 preserved: `Card metadata playground.html` + `playground/pg-*.jsx`.

## Action Items & Next Steps

1. Get the user's pick: an **image treatment** (thumb size/side vs. wide/inset
   vs. band) + an **open model** (title / inline / URL / button), possibly a mix.
   Then consolidate to one card.
2. Confirm the **restrained thumb sizing** is right vs. the wider options — the
   wide treatments crop OG cards (esp. brand cards) awkwardly.
3. Decide the **favicon-as-attribution** thread: real domain favicon (current)
   or a distinct on-card attribution. Prototype if wanted.
4. Real images are stand-ins in `uploads/card-previews/`; production default-
   image system is moot now (fallback = no image).

## Other Notes

- Editability out of scope; rely on defaulting (per PROMPT).
- Never a naked/broken card: failed extraction still shows source (domain) +
  attribution + URL-as-headline; verified via Extraction = Total fail.
- Seed coverage: 4 with-image (PE brand card, react repo card, YouTube frame,
  overreacted blog art), 1 bare-domain no-image (danluu), 2 stress (long title,
  long URL), 1 total failure.
