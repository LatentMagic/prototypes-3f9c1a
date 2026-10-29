---
date: '2026-10-28'
ticket: '1236'
topic: 'delve-session-audit'
status: 'in-review'
type: 'audit'
---

# Handoff: audit of Delve's session playground v1, plus two new dice

## Objective

The owner had not reviewed v1 (`handoff-2026-10-28-delve-session-playground.md`). He asked for an audit against `delve.md`, with fixes for what is broken or wrong, an eye on wordiness, and two new ways to draw a roll. Hex stays. Faceted goes because it is the Roll20 emblem.

## Resume by reading, in order

1. This file.
2. `handoff-2026-10-28-delve-session-playground.md`: what v1 is, the four concepts and where the brief, spec and images sit (`uploads/2026-10-27_delve-session-playground/`; keep that folder, both handoffs point at it).
3. `delve.md` from that folder (the live spec upstream wins), then `README.md` in this folder.
4. `playground/pg-dv1.jsx`: `Dv1Die` draws all three dice; `DV1_HARD` is the hard play.

The owner's latest ask: pick a die. Faceted was cut on his word; Hex stays on his word.

## Where

`playground/delve-v1.html` + `pg-dv1.jsx`, edited in place. Bar → Die is now **Hex · Stone · Mark**. Nothing in `app/` changed.

## The two new dice (unratified)

Both keep Hex's code: strong hit filled green, weak hit an amber outline, miss a dark fill. A natural 20 gets a second rim, a natural 1 a crack, and two d20 a second shape behind.
- **Stone:** a square block with one corner cut, echoing the logo's asymmetry. It shows the kept number.
- **Mark:** the check itself. A bar as tall as the total stands on a base, with a line across at the target and the total under the base. "Made it exactly" touches the line, and a miss stops short of it. With two d20 the other die's total is a second bar behind. In C's strip the run becomes a small bar chart. It is a first drawing, and the bars are small at 30px.

## Fixed in the audit (owner asked for obvious cleanups; none ratified)

1. **Hard play broke the spec.** Roll 28 used two d20 after a single strong hit, with inspiration already spent. `delve.md` allows two d20 only from inspiration or a streak of two or more. It is now one d20, which leaves four rolls with two d20.
2. **A weakness leaked.** B and D printed the gear line raw ("A pepper pouch · Snaggle: track 3 → 1"), though v1's handoff said the page never names a weakness. It now reads "Used a pepper pouch". The gear is still named; spoilers stay open.
3. **Faceted removed** (`DV1_ROWS.die`, its CSS and path).
4. **Wordiness:**
   - Moment tiles drop "Roll N" and keep only the room.
   - Tile facts are cut to "action or stat · total vs target". The tier word and HP lost stay in the line under the picture.
   - Flags in B and D drop "Roll N ·".
   - Going back drops its threat cost ("The ritual +1") in B and D.
   - D drops "No rolls".
5. **Threat and HP pips:** at 3–6px wide the outlined pips looked like a barcode. They are now solid segments, with the empty ones in a quiet fill.

## Found, left for the owner

- C letters its moments A–D, and the bar's concepts are also A–D.
- B's "Descent" indents by the order rooms were first entered. The record has no depth, so the indent is not a depth.
- "First room" is invented: the record names no room before the first "Entered".
- On an overrun, the last roll is titled "The last roll". The threat filling ended the run, so that roll may not be the one that did it.
- Hovering a die previews it, though the system gives hover only to things that go somewhere or open. The owner asked for this, so it stays.
- The brief lists achievements as known, but no concept shows them.
- Still open from v1: the moment rule and spoilers.

## Not checked

Phone width (390) for Stone and Mark in every concept.

## Earlier handoffs

`handoff-2026-10-28-delve-session-playground.md` and every other `handoff-*.md` in this folder (Escape and Daily Word).

## Next

1. The owner picks a die (Hex, Stone, Mark) and reacts to the concepts.
2. Then the moment rule and spoilers.
