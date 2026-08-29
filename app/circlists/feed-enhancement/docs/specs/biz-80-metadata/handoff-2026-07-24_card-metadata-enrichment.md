---
date: '2026-07-24'
ticket: 'BIZ-80'
topic: 'card-metadata-enrichment'
status: 'in-progress'
type: 'exploration'
---

# Handoff: card-metadata-enrichment — enriching a feed card past the bare URL

## Current Focus

An exploration playground is built and delivered; **no direction is chosen yet.**
The user likes the shape but has explicitly *not* studied the five options in
detail. Next session: wait for the user to pick a direction (or a mix), then
consolidate. Nothing is settled beyond the MVP rules in `PROMPT.md`.

## Task(s)

Built a configurable playground exploring how a Circlists feed card gets enriched
with extracted metadata (title / source / image). It renders the real Circlists
chrome: the left **rail** (normally the circle list) is the five card options; the
**heading** (normally the space name) is the config bar; the feed shows all five
seed cards in the selected treatment so every state and fallback is on screen at
once.

**Five directions:**
1. **Editorial** — wide preview, title headline, source + favicon, URL gone.
2. **Compact row** — thumbnail-left with favicon in corner, domain chip, keeps Open.
3. **Text-first** — title dominant, small tile right, URL kept as a truth-check line.
4. **Source-led** — tinted publication masthead; image shows only when real. **See open Q1.**
5. **Full-bleed** — image + title fused; deep source-keyed default so real/fallback read alike.

**Config levers (heading):** Favicon / Raw URL / Open button each Auto→override
(Auto = the option's own intended choice); Extraction outcome (As seeded / No
images / Total fail) walks the whole feed down the fallback cascade; Default
image style (tile options 1–3); Trace toggle.

## Critical References

- `docs/specs/biz-80-metadata/PROMPT.md` — the settled MVP rules; do not reopen them.
- `CLAUDE.md` — brand + voice rules (accent `#047857`, danger `#991b1b`, no emoji, calm floor).
- `PLAYGROUND.md` — the reusable playground conventions this artifact established.
- `tokens.css` + `app/primitives.jsx` — theme + `Icon`/`Avatar`/`LogoMark` this reuses.

## Recent changes

- `playground/pg-data.jsx` — seed feed + `PG.resolve(seed, cfg)`, the **sole**
  derivation of display fields; returns a `trace` object per field.
- `playground/pg-cards.jsx` — media primitives (Favicon, DefaultImage, PreviewImage) + the five treatments + trace strip.
- `playground/pg-app.jsx` — shell: rail options, config heading, feed; `mergeCfg` combines option defaults with heading overrides.
- `Card metadata playground.html` — host (Babel multi-file, load order = dep order).
- `PLAYGROUND.md` — populated from placeholder with conventions.

## Learnings

- **Traceability lives in one function.** All defaulting flows through
  `PG.resolve` in `pg-data.jsx:*`; the Trace toggle renders provenance *outside*
  the card so it never corrupts the design read. Any defaulting change goes here.
- **Auto+override config** keeps options genuinely distinct while still allowing
  a single lever to be A/B'd across all of them (`mergeCfg`).
- Verification clicks share the user's `localStorage` key `pg_cardmeta_v1` —
  reset it to clean defaults after probing so the user lands fresh.

## Artifacts

- `Card metadata playground.html` (root) — the deliverable.
- `playground/pg-data.jsx`, `playground/pg-cards.jsx`, `playground/pg-app.jsx`.
- `PLAYGROUND.md` (root) — conventions.
- `docs/specs/biz-80-metadata/{README,PROMPT,HANDOFF}.md`.

## Action Items & Next Steps

1. Get the user's chosen direction (single winner or a mix, e.g. Editorial
   headline + Source-led band). Do not consolidate before this.
2. Resolve **open Q1**: Option 4 deliberately breaks the "always fall back to a
   default image" rule (uses the source masthead band instead). Either give it a
   default image too, or keep it as the argument that not every card needs one.
   Flagged by user as "something to think about," unresolved.
3. Replace stand-in art: default images (rings/mono/tint/full-bleed fields) and
   preview images are CSS/SVG placeholders. Real default-image system is open
   ("surprise us" territory).

## Other Notes

- Editability is out of scope; rely on defaulting (per PROMPT).
- Author is not a field — Source does identity work; attribution line unchanged.
- Never a naked URL: failed extraction still shows source (domain) + default
  image + URL. No broken/empty card state.
- Seed coverage: publication+image ×3 (newsletter, GitHub, YouTube),
  bare-domain+no-image (danluu), total failure (title/source null, no image).
