---
date: '2026-08-03'
topic: 'discourse-v3'
status: 'for-review'
type: 'exploration'
---

# Handoff: discourse v3 — twelve versions, played not configured

Built from `docs/specs/lm-652-discourse/brief-2026-08-03-discourse-v3.md`. v1 and v2 are
untouched and still run.

## Current Focus

**The user plays `discourse-playground-v3.html` (or the standalone bundle on a
phone) and reacts to the versions.** Their reaction is the output. Nothing is
decided; do not build the next thing until they come back with which versions
feel alive.

## What changed from v2, and why

v2's engineering was sound and its presentation model was wrong. The user's
framing, verbatim in the brief: *"I just want to go over 5, 10, or 15 distinct
options and react to them… I don't configure; I play with the actual app."* The
four-pane rail (Shape / Continue / Levers / Loop) made variety reachable only by
configuration, and every play item was about continuation — one slice of the
broader v1 feedback.

So v3 replaces **the rail and the selection model only**. The v2 component layer
is mounted unchanged: `pg-d2-data.jsx` (items, levers, `d2Resolve`),
`pg-d2-parts.jsx`, `pg-d2-card.jsx`, `pg-d2-record.jsx`, `pg-d2-table.jsx`.

What the reviewer now sees: a flat list of twelve named versions of the app. Tap
one and the app in front of them IS that version, seeded so its moment is a touch
or two away. No shape statements, no theory cards, no loop driver, no lever panes
in the path. The levers survive behind a secondary **"Under the hood"** button, as
the brief allows.

When the user asked about the version list, they answered with context rather than
a selection: they had never got through v2 because it was too complicated, and
curating a list was itself the kind of work they were objecting to. So all twelve
were built and nothing was put back to them to taxonomise.

## The twelve versions

Ordered by how much talking the app allows, calmest first. Definitions live in
`pg-d3-data.jsx` (`D3_VERSIONS`); each carries a full set of lever answers, the
`def` that `d2Resolve` reads, the tab you land on, and a seed arrangement.

| | Version | The idea |
|---|---|---|
| 01 | Reasons on the card | The invitation is on the card; the conversation stays behind the door |
| 02 | Sealed by the sharer | The author decides whether their line travels or waits |
| 03 | The record, in one breath | Reaction commits, the same sheet becomes the record, no timer |
| 04 | Same | One tap points at a sentence — the participation floor |
| 05 | One line each | The floor: one line, forever, no pointing |
| 06 | A line you can rewrite | Yours until somebody points at it (K1) |
| 07 | Answer a person | Addressed replies, depth capped at one (K2) |
| 08 | Rounds | Closed by reading, never by a clock (K5) |
| 09 | Every turn after the first is a question | (K4) |
| 10 | Take it to the table | A room you walk into; landing drains it (K3 + K6) |
| 11 | Land it | Say anything until somebody writes the takeaway (K6) |
| 12 | Ask, don't tell | The sharer's question register everywhere |

01–04 and 12 come from the broader v1 feedback that v2 had folded into its spine
and stopped showing as choices; 05–11 are K0–K6 as playable apps rather than rail
entries.

## Seeding — how each version's moment is reached

Two mechanisms in `pg-d3-data.jsx`, both feed arrangement only:

- `d3Hoist([urls])` reorders the feed so the demonstrating item is first in its
  tab. No scrolling to find the point.
- `tab` lands you where the version happens (`active` for the share-side
  versions, `read` for the record-side ones, `table` for 10).
- Two content transforms: `d3Seal()` puts held markers in Active for 02, and
  `d3Ask()` rewrites prefaces into questions for 12 (`D3_ASKS`).

Reachability per version is one or two natural touches: mark the top card read
(01–03, 12) or open the top read item's door (04–09, 11); 10 opens on the table.

## Play state

Held **per version** (`play[vid]` in `pg-d3-app.jsx`), so switching away and
coming back is not a loss — the v2 defect the brief named. `Reset this version` is
under the hood.

## Conventions honoured

- Posture follows the window at `< 1024` (`main.jsx`'s own breakpoint). The
  version list stands where the circle rail stands: docked at ≥ 1024, the app's
  own `MobileDrawer` behind the top bar's menu button below it, the **Home**
  destination in the app posture. No bezel unless Viewport is forced to Mobile.
- One surface through the app's own shells; no per-posture fork.
- `tokens.css` + brand pack only; accent `#047857`; no emoji in copy; every line
  through `wiki/circlists-copy-voice.md`.
- `PLAYGROUND.md` gained the user-approved rule: **playgrounds are played, not
  configured** (top of Non-negotiables).
- No `app/` change, no `circlists.html` change, no `CHANGELOG.md` entry — a
  playground is not a product-shape change.

## Artifacts

- `discourse-playground-v3.html` — entry at the project root.
- `docs/specs/lm-652-discourse/pg-d3-data.jsx` — the twelve versions and their seeding.
- `docs/specs/lm-652-discourse/pg-d3-app.jsx` — the list, the levers behind it, the app
  surface.
- `discourse-playground-v3-standalone.html` — bundled for phone review. Compiled
  output: regenerate, never edit.
- `PLAYGROUND.md` — updated.

## Action Items & Next Steps

1. **Play it and react.** Which versions feel alive, which are dead, which two
   want merging. No need to answer anything else.
2. When two or three survive: write a spec, not more playground.
3. Still open from v2 and deliberately not asked again here: whether a line can be
   changed after it is left, "Same" vs "Echo", and whether the door's micro dot
   reads as arrival rather than an unread count by other means. All three are
   playable in the versions above.
4. Only if asked: a `GOTCHA.md` entry for the JSX `\uXXXX` escape trap (needs
   user approval per `CLAUDE.md`).

## Other Notes

- `pg_d3_discourse_v1` in `localStorage` holds the selected version, overrides and
  posture. v2's key is separate and untouched.
- Version 05 turns pointing off and 04 turns it on, so the pair reads as the
  argument for the participation floor. If either is cut, cut them together.
- `d2Resolve` reads `opt.def.turns`, so a version object must always carry `def`
  — that is the only coupling between the v3 data layer and the v2 one.
