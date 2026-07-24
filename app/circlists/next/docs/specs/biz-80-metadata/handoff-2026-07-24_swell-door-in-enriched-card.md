---
date: '2026-07-24'
ticket: 'BIZ-80'
topic: 'swell-door-in-enriched-card'
status: 'in-progress'
type: 'design+implementation'
---

# Handoff: re-homing the Swell door in the enriched (edge-matched) card

## Current Focus

The enriched card (BIZ-80) shipped, but the **Swell door** (the Read-tab
reaction affordance) did not fit its new shape. This session ran a design
exploration, the user picked a direction (**option 12**), it was integrated
into the real app, and then the user tightened one **essential geometric rule**
in a knock-up. **The approved geometry is proven in the knock-up but NOT yet
folded back into the real card — that is the next action.**

### The essential rule (the user said this repeatedly; honour it)
The action **icons — tick, delete, and the door's OPEN icon (arrows-out) —
must sit WITHIN the preview image's horizontal band.** Concretely, at a 600px
column the image spans x≈599–661 (62px). Delete's glyph right edge locks to the
image's right edge; the primary icon (tick / arrows) sits one slot to its left;
the pair is pulled **tight (gap 0)** so the two glyphs span exactly the image
width, and the **permanent hairline falls on the image centreline**.
- The **only** element allowed to break the band is the **emoji huddle**, which
  extends *outward to the left* into the attribution. So no glyph count ever
  pushes the icons off the image — and **no adaptive rule is needed**.
- The door's arrows icon must land in the **exact same slot as the tick**
  (measured: tick centre 607, arrows centre 607 across 1/3/0 glyphs). Achieve
  this by putting the arrows in a **44px centred sub-slot** at the door button's
  right, with the huddle in a left span that widens the button leftward without
  moving the arrows. Do NOT put the huddle inside the centred box (that shoves
  the arrows over — the exact bug the user rejected).

### Next action — fold the knock-up geometry into the real card
Source of truth for the geometry: **`Permanent hairline - edge-aligned
actions.html`** (approved knock-up; verified by measurement). Port it into
`app/feed.jsx` + `app/swell-reactions.jsx`:
1. Footer action cluster: **`gap: 0`** (currently `gap: doorHasGlyphs ? 8 : 2`),
   keep `marginRight: -13` (was -12) so delete's glyph edge hits the image edge.
2. **Permanent hairline** between primary and delete on BOTH tabs (active
   tick+delete and read door+delete) — currently it only renders when
   `doorHasGlyphs`. It should be always-on, sitting on the centreline.
3. Rework `SwellDoor` (`app/swell-reactions.jsx`) so the **arrows sit in a 44px
   centred sub-slot** and the huddle hangs left (see knock-up `Door`). The bare
   (all-skipped) door is then just the arrows in that slot = identical to tick.
4. **Retire the container-query adaptivity** added this session
   (`.circ-attrib-pre` + `@container (max-width:380px)` in `circlists.html`, and
   the `attribPre` split in `feed.jsx`). The leftward-growth model makes it
   unnecessary — the attribution simply ellipsizes. Confirm with the user before
   deleting, since they liked the adaptive drop earlier; the knock-up supersedes it.
5. Re-measure in the live app (Read tab, an item with reactions + the new
   all-skips-with-image seed item) to confirm tick/arrows/delete glyphs sit in
   the image band and tick centre == arrows centre.

## What landed this session (in the real app)

- **Option 12 integrated** into `app/feed.jsx`: on Read-tab items with glyphs, a
  1px hairline separates the door from delete and the cluster gap opened to 8.
  (This is the LOOSE version — the next session tightens it to the rule above.)
- **`SwellDoor` bare state** (`app/swell-reactions.jsx`): when everyone skipped
  (no glyphs) the door now uses the 44px centred icon-button box (matches tick),
  no negative margin — so it sits in the tick's slot. Keep this; the port
  generalises it.
- **Hairline gated on glyphs** (`doorHasGlyphs`) so a bare door doesn't get a
  weird lone hairline. The next session makes the hairline permanent instead
  (per the rule) — supersedes this gating.
- **Adaptive "Added by"** (candidate for removal, see next-action #4):
  `.circ-attrib-pre` dropped via `@container (max-width:380px)` on `.circ-card`
  (`circlists.html`); container-type is safe because `SwellReviewModal` portals
  to `.circ-phone-screen`/`body`, not inside the card.
- **Seed:** new Backend Pod Read item `go.dev/blog/errors-are-values` — read,
  WITH a preview image, all readers skipped — so the bare (glyph-less) door can
  be compared against image cards. `STATE_KEY` bumped **v5 → v6**
  (`app/main.jsx`); seed changes are invisible without the bump.

## Design exploration (context for why 12 won)

- **`Reaction store - card fit options.html`** — 16 options. Round 1 (01–11):
  01 = the broken current door; 02 count pill; 03 purpose-built ripple icon;
  04 source-line; 05 image-corner badge; 06 attribution read-out; 07 full-width
  strip; 08 vertical token; 09 faces; 10 distribution bar; 11 text link.
  Round 2 (12–16, built on user steers, all keep the original huddle+arrows):
  **12 = original door + hairline divider (CHOSEN)**; 13 door centred / delete
  under image; 14 original door on source line; 15 stretched long band; 16
  summary line above footer.
- User's reasoning: keep the arrows-out (reads as "opens / expands"); keep the
  glyph huddle (first/most order); disliked reinvented icons; the uneven-delete
  bothered them; wanted the minimal diff (12). Then escalated to the
  fit-within-the-image rule above.

## Pending (unchanged from prior handoff)
- **Loading-state revision** still expected from the user — do not treat
  `FeedLoading` / `loadingFeed` as settled. Not caused by this work.

## Critical References
- `Permanent hairline - edge-aligned actions.html` — **approved geometry, source
  of truth for the port.** Has a tinted image band + edge guides; measured.
- `docs/specs/biz-80-metadata/handoff-2026-07-24_card-metadata-shipped.md` — the
  prior handoff (the card that shipped; the door regression this one resolves).
- `Reaction store - card fit options.html` / `Reaction door - option 12 mobile.html`
  — the exploration + the mobile/attribution study.
- `CLAUDE.md` — brand + voice (accent `#047857`, danger `#991b1b`, no emoji in
  UI copy, calm floor). `GOTCHA.md` #3 — why the door modal portals out.

## Learnings
- **Measure, don't eyeball, for alignment.** The "17px poke" was exactly two 8px
  gaps + the 1px hairline; `eval_js` on `getBoundingClientRect()` pinned it and
  proved the tight fit (tick glyph 598 vs image 599, arrows centre == tick
  centre 607). Screenshots/description alone kept the bug alive for rounds.
- **"Fit within the image" = the icon glyphs live inside [image.left,
  image.right]; the emoji huddle is the sole exception (grows left).** This is
  the load-bearing rule for the whole treatment.
- Two 44px AA targets span exactly the 62px image only at **gap 0**; any gap or
  hairline *between* them would spill the glyphs — so the hairline sits on the
  centreline between the two adjacent buttons, not as extra spread.
- JSX **text** doesn't interpret `\uXXXX` — use literal “ ” — em-dashes too.
  (Bit the exploration files twice this session.)

## Action Items & Next Steps
1. Port the knock-up geometry into `app/feed.jsx` + `app/swell-reactions.jsx`
   (see "Next action" 1–5). Make the hairline permanent; arrows in a 44px slot.
2. Confirm with user, then retire the container-query "Added by" adaptivity.
3. Re-measure live (Read tab, reactions + the new all-skips-with-image seed).
4. Await the loading-state spec before touching `FeedLoading`.
5. Before a demo build, delete the two **TEST-** seed spaces (`seed-data.jsx`).

## Artifacts
- `app/feed.jsx`, `app/swell-reactions.jsx`, `app/seed-data.jsx`, `app/main.jsx`,
  `circlists.html` — the real app (loose option 12 + bare-door fix + seed).
- `Permanent hairline - edge-aligned actions.html` — approved geometry to port.
- `Reaction store - card fit options.html`, `Reaction door - option 12 mobile.html`
  — exploration + mobile study.
