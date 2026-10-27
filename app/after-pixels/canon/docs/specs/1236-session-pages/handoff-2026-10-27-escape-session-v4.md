# Handoff, 2026-10-27: Escape's session page, v4 (rebuilt)

The goal is `v4-goal.md` (the owner ratified it, 2026-10-27). The first v4 build was rejected and deleted, along with its handoff. This build starts again from v3's Design 1.

## Where

`docs/specs/1236-session-pages/playground/v4.html` (launcher: ticket 1236). It opens on Escape's session page with the Pass. Files: `pg-es4.jsx`, reusing `pg-es-core.jsx`, `pg-es-seed.jsx`, and `pg2Model` and `Pg2Card` from `pg-es2-line.jsx`. Storage key `pg_escape-session_v4`.

The bar has four independent picks plus the room: **Lock detail** 1 to 3 (named; the owner's focus after review 2), **Result** 1 to 3, **Escape** 1 to 3, **Hover** 1 to 3, and **Room** (Under, On par, Over, Inside). **Why** explains the current picks. The bar fits one row at 1185px (measured). Key S cycles the room.

## Against the goal

1. v3's Design 1 is kept as it was.
2. Par sits in from the edge, with its label centred on its tick.
3. Lock detail (rebuilt after the owner's second review, 2026-10-27: "white space, nothing aligned, a different shape and size on each click"). Three designs. Each keeps one shape whichever door you pick, and all share a head line (number, name, facts on one line; the story under it; "The chimney hatch closed" moved into the facts).
   - **1 Ledger:** one table across the card, with one row per try. Its columns are Try, Answer, Result, Hint first and The room said. Blank ruled rows fill up to the play's busiest lock, so the height never changes. A caret on the top rule points at the picked door.
   - **2 The stretch, zoomed:** a funnel runs from the picked stretch on the line to a full-width strip of every move in it, one column each.
   - **3 Every lock at once:** one column per lock, with tries stacked from the bottom so each column ends at its opening. Picking a door lights its column. Below the columns sit the picked lock's story and replies, with their space reserved.
4. Result: 1 Sentence ("Escaped in 28 min" / "Par 30 min · 2 min to spare"), 2 Three figures, 3 Time first.
5. Escape: 1 Plain door (no symbol anywhere), 2 Door left open (on the line, and at text size in the heading), 3 Daylight (cream past the exit, and "Escaped" set in cream).
6. Hover: 1 Lift (rises with a ring), 2 Door opens (cream doorway), 3 Stretch lights (the stretch of the line leading to that door). Each door lights together with its number, all three have a press state, and all respect reduced motion.
7. Spec: a try answers Open or Wrong (a near miss is quoted, still Wrong); a mechanism answers with its count; exactly par counts as under.

## Calls I made (not ratified)

- Added an on-par sample play (`escape-par`, out at 30 min), defined in `pg-es4.jsx` only. On par, the copy reads "out on the minute" and "0 min to spare".
- Dropped v3's Go to buttons and the first v4's Line by toggle, so the bar fits.
- Kept each lock's story line and "The chimney hatch closed." where v3 had them.

## Gaps

- The game doesn't record lock minutes, yet the line is drawn by minute.
- Near misses, partial readings and story lines are pass 2's sample record.
- The library card is still v2's Version 1 and out of v4's scope.
