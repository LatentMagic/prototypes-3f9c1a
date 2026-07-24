# Handoff — Swell modal, mobile low-count whitespace

## Status: REVERTED. Problem NOT fixed. Misdiagnosed once — read this before retrying.

## The actual problem (per user, confirmed)
The Swell review modal — the "How it landed" modal opened by the **door** (Read-tab card) and shown as the **reveal** (after reacting) — looks great on desktop but **wrong on mobile when there are few reactions (esp. n=1)**. It looks puny/tiny with too much empty space, and a recent commit made it *worse* by removing some whitespace such that there's now doubled whitespace below.

**The culprit is the ROSTER, not the disc.** The roster is the wrapping list of name-chips below the circle (`reacted.map(...)` + `skipped.map(...)` in `SwellReview`). That is where the low-count whitespace / sizing problem lives. Do **not** go down the path of "the disc glyphs are pinned to a fixed size" — that was my wrong theory.

## What I did wrong (so you don't repeat it)
I fixated on the disc: I added count-based glyph scaling (`swellSizeScale`), a centre-pull in `swellLayout`, and a door-only "drop the reserved palette band" branch in `SwellReview`. It made the *disc* look better in isolation but did **not** address the roster, which is the real issue. The user was clear and correct; all of that has been reverted. `app/swell-reactions.jsx` is now back to its pre-session state (verified: no `swellSizeScale` / `sizeScale` / `reserveBand` / `pullFree` / `band` references remain).

## Where to look (`app/swell-reactions.jsx`)
- **`SwellReview`** — shared body (header + disc + roster) used by BOTH the reveal and the door modal. The roster is the `flexWrap` block near the end: `reacted.map(...)` renders reaction chips, `skipped.map(...)` renders read-ring chips. Sizing/spacing constants (`box`, `pad`, `narrow`, `marginTop`) live here. **Start here.**
- **`SwellReviewModal`** — the door's modal wrapper (padding, width, `maxHeight: 88vh`). `narrow = innerWidth < 520`.
- **`SwellReactionFlow`** — the react MOMENT (input pad → reveal). Owns modal padding/margins for the reveal path.
- `narrow`/`box`/`pad` are computed from `window.innerWidth` in multiple places — a recent whitespace tweak likely touched one of these `marginTop`/spacing values and is the "doubled whitespace" regression. Worth diffing history around the roster/spacing.

## HARD CONSTRAINT — do not break this
When you react and it advances to the reveal (the timeout/fade step), **the circle (disc) must be pixel-pinned** — same size AND position across input → reveal. It must not move or resize. This is non-negotiable per the user. (The disc pinning relies on the reserved palette band around the disc in `SwellReview` — the `box`/`inset`/`pad` geometry. My reverted attempt to drop that band on the door path is exactly the kind of change that risks the pin; leave the disc geometry alone unless you've proven the pin holds by measuring input-disc rect vs reveal-disc rect.)

## Suggested next step
Re-investigate with the roster as the subject. Reproduce at a true mobile width (~390px) with a 1-reaction item (seed data has one: `firstonehere.com`, single 👍 from You). Figure out why the roster + surrounding spacing reads as puny/over-spaced at low counts, and whether the modal itself should shrink-to-fit rather than the content floating in a large panel. Get the diagnosis validated before building.

## Note
- No CHANGELOG entry (nothing landed).
- I reset seed data during the prior session's testing; state should be clean.
