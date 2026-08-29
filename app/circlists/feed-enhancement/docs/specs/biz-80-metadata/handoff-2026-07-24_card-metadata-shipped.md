---
date: '2026-07-24'
ticket: 'BIZ-80'
topic: 'card-metadata-shipped'
status: 'landed-needs-correction'
type: 'implementation'
---

# Handoff: card-metadata-shipped — enriched feed card landed; Swell door regressed in the new shape

## Current Focus

The enriched card is **implemented and looks right** — *List dense — foot,
**edge-matched*** is live in `app/feed.jsx`, seed items carry metadata, stale
playgrounds are gone, one reference remains. But **user review surfaced a real
regression that the next session must fix.**

### ⚠️ BLOCKER — the Swell door is not functional in the edge-matched shape
User (reviewing the live feed): *"the way the door is working, the analytics
door is not functional in this design shape… a pretty major issue."*

What changed: in the old card the `SwellDoor` sat on the **attribution row**
("added by one, **received by many**" — the door was the "many" at the right
edge). In the edge-matched rewrite it was relocated **into the footer action
cluster, left of delete** (`app/feed.jsx`, the `tab === 'read'` branch). In that
position it does **not work / read** as the analytics door should — treat it as
broken, not merely mis-styled.

Next session — this is a layout/IA problem, not a one-line fix. Do NOT just nudge
it. Diagnose first (does the modal still open? is the tap target colliding with
delete? has it lost the "received by many" meaning now it's detached from the
attribution and sits among the actions?), then decide the door's proper home in
the dense-foot card — likely back onto/near the attribution, not in the action
cluster. Re-verify on the **Read tab** with an item that has reactions.

### Pending (not a defect) — the loading state is changing
The user will **revise how the feed loading state works** and brief the next
session on it (waiting on a data update, ~11:00). Nothing to do yet — just don't
treat the current `FeedLoading` / `loadingFeed` behaviour as settled; expect a
spec. Not caused by this work.

Everything else below is done and correct.

## What landed

- **`app/feed.jsx` — `FeedCard` rewritten** to the edge-matched dense-foot card:
  - Body: favicon + **source** line, then the extracted **title** as the
    headline, with a **preview image** on the right (60px, `--radius-md`).
  - Footer below: avatar + attribution (left), recessive icon actions (right).
    The action cluster is pulled `marginRight: -12` so the trailing glyph's
    optical edge lands on the image's right edge — the alignment resolution.
  - **Open affordance = title + image only** (both `<a>` → `onOpen`); source,
    favicon, attribution, footer never open. Title hover underlines; thumb
    brightens (CSS in `circlists.html`: `.circ-cardtitle`, `.circ-thumblink`).
  - **Mark-as-read (Active tab)** = the tick → unchanged `onMarkRead` → Swell
    flow. **Read tab** puts `SwellDoor` where the tick sat (left of delete) —
    "added by one, received by many" preserved. **Delete** → `ConfirmDialog`.
  - Icon buttons reuse `.circ-cardaction-icon` (44px targets → mobile AA).
  - **Fallbacks never fabricate:** no preview → a source-keyed **tint block**
    (`FEED_TINTS`, the "bits of colour" the user endorsed); no favicon
    (`faviconExists:false`) → nothing; no title → the URL as a mono headline;
    source always falls back to the bare domain.
- **`app/seed-data.jsx`** — `IT(...)` gained an optional `meta` arg; a
  URL-keyed **`SEED_META`** map is folded onto items in `seedSpaces()`. The
  three real spaces get authored title/source (+ image on a few); the two
  **TEST-** spaces are intentionally left to derive a title + tint.
- **`app/main.jsx`** — `STATE_KEY` bumped `v4 → v5` so returning sessions
  rehydrate the new seed instead of stale localStorage (this was why metadata
  first appeared missing — the app persists spaces).

## Playground cleanup

- **Deleted:** `Card metadata playground{,v2,v3}.html` + `URL fallback
  playground.html` and all their `playground/pg{,2,3-cards,3-app,4}.jsx`.
- **Kept, renamed** as the single durable reference:
  `Feed card — dense-foot reference.html` (was the alignment playground) +
  `playground/cardref.jsx` (was `pg5.jsx`) + `playground/cardref-data.jsx`
  (was `pg3-data.jsx`, still exposes `window.PG3`). It shows the shipped
  **Edge-matched** card as option 1 plus the 4 alternative structures as the
  alignment-study record, with the **Density** lever = the small vs large
  (compact / comfortable) thumb comparison the user wanted retained.

## Critical References

- `docs/specs/biz-80-metadata/handoff-2026-07-24_card-metadata-v3-direction.md` — the prior (blocked) handoff; the alignment tension resolved here.
- `docs/specs/biz-80-metadata/PROMPT.md` — settled MVP rules (do not reopen).
- `CLAUDE.md` — brand + voice (accent `#047857`, danger `#991b1b`, no emoji, calm floor).

## Learnings

- **The alignment answer was "edge-matched," not a new layout.** Image stays
  right (left is **banned** — clutter + fallback text displacement); the fix was
  to snap the trailing action's optical edge onto the image's edge and stop
  treating the footer buttons as needing to align to a media *block*. The user
  accepted the remaining long-URL/tiny-image gap as an edge case, not a blocker.
- **Seed changes need the `STATE_KEY` bump** — spaces persist to localStorage;
  forgetting the bump makes new seed data silently invisible on a returning
  session. (Symptom seen this session: derived titles + bare-domain sources.)
- Verification shares the user's localStorage: `circ_state_v5` (app) and
  `pg_densefoot_align` (reference playground). Cross-origin favicons can't embed
  in html-to-image captures — blank in screenshots, load live.

## Action Items & Next Steps

1. **FIX THE BLOCKER — the Swell door.** Diagnose why the door is non-functional
   in the edge-matched footer (see Current Focus), then re-home it in the
   dense-foot card so "added by one, received by many" works again. Verify the
   modal opens from the Read tab. Layout decision, not a nudge.
2. **Await the loading-state spec** from the user (~11:00 data update) before
   touching `FeedLoading` / `loadingFeed`.
3. Review the live card in the real feed (Active + Read tabs, the no-image
   `danluu` card, the former-member card) and the reference playground.
4. Optional polish: revisit the long-URL + small-image gap if it ever grates;
   currently accepted as an edge case.
5. Before a demo build, delete the two **TEST-** seed spaces (flagged in
   `seed-data.jsx`).

## Artifacts

- `app/feed.jsx`, `app/seed-data.jsx`, `app/main.jsx`, `circlists.html` — the shipped card.
- `Feed card — dense-foot reference.html` + `playground/cardref{,-data}.jsx` — the durable reference.
- `uploads/card-previews/*` — the real stand-in preview images used by a few seed items.
