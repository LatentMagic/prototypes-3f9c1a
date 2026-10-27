# Handoff, 2026-10-27: Escape's lock row, playground v2

Replaces the pass 1 and 2 rig (`playground/index.html`, now off in the launcher). The owner kept option 1's line, dropped options 2 and 3, and rejected all of the session page work.

## Where

`docs/specs/1236-session-pages/playground/v2.html` (launcher: ticket 1236). It opens on Library → Escape with the Pass. The bar above the demo bar has Version 1 to 3, Room (Under par, Over par, In progress), and Go to (Library card, Session page). Keys: 1 to 3, S.

Files: `pg-es2-line.jsx` (the row, the card, the session body), `pg-es2-rail.jsx` (hooks and bar). It reuses `pg-es-core.jsx` (play model, seed, moments) and `pg-es-seed.jsx`, with its own storage key `pg_escape-session_v2`.

## What the owner asked for (2026-10-27)

1. The doors overhang the bar, and par sits above it as a tick.
2. Where you got out reads against par.
3. One result line, not "You got out in…" plus "Escaped in 28 min, under par".
4. Fit the space the card already has. Grow taller only if needed. The streak card is not being redesigned.
5. The rule and "See what's out for you to play" under the card are deleted.
6. Over par reads as a different result. In progress reads as in progress, in the same design.
7. The session page keeps the store's layout: the shared head, the main card, then Every move as a plain list, collapsed. The main card is the library card's lock row, expanded. Every move is outside this playground's design work (also in `README.md` § Settled).
8. The main card has the move count ("Escaped in N moves"). Near misses get no block of their own: the biggest is the closest-miss moment, and the rest show as a small mark on their lock's door. Story lines stay in Every move.

## The three versions (builder's, not ratified)

1. **Out above.** Par and "Out 28 min" both above the bar. Numbers only under the doors on the card.
2. **Named doors.** Each door named under the bar; the last door is labelled "Out 28 min". The result line moves under the title.
3. **The gap.** The bar ends at par or your exit, whichever is later. Above it, "2 min spare" or "11 min over".

Shared: one result line ("Escaped, 2 min under par" / "Escaped, 11 min over par" in the warning colour, with the over-par stretch shaded / "In progress"), then moves and hints. On the session page each door carries its name, minute, tries, hints and near misses (as a list under the row below 560px).

## Calls I made (not ratified)

- **Either-or:** shown as one short line on the way-out moment, "The chimney hatch closed." It names the other exit and nothing about how to find either.
- **Near-miss marks:** amber squares above the door, session page only, not on the card.
- **In progress:** the locks opened so far sit at this week's minutes, and a white edge marks where the play stands. Minute text is hidden (see Decided).
- The result wording ("Escaped, 2 min under par") departs from the store's `GS_RESULT.escape` ("Escaped in 28 min, under par").

## Decided: minutes while a room is in progress (owner, 2026-10-27)

While a room is in progress, the minutes are hidden. Progress shows as it already does (opened doors on the bar, the white edge where the play stands); only the minute text goes. No further work on the in-progress row beyond that.

Built: the session page's door facts drop "Minute N" in progress, and the row's spoken label gives the lock count, not minutes. The card had no minute text in progress already. Door positions still sit on the time scale.

## Gaps

- **Lock minutes are recorded by the game but not sent to the session page.** All three versions depend on them. The game needs to send them.
- Every move is the store's list as it is, inside the design system's Disclosure. Fixing it is a separate pass.
- Known side effects from pass 2 still stand (share line "Escape No. 1", earlier rooms' short sample plays).
