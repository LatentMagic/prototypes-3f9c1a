# Handoff, 2026-10-27: Escape's session page, playground v3 (rebuilt)

The first v3 was rejected (owner, 2026-10-27): it dropped the timeline, which he never asked for. Only its clock was "kind of interesting". v3 was deleted and rebuilt on v2's timeline. Lesson: build on what the owner said works, and a scope summary names what stays as well as what changes.

Goal: `README.md` § What a session page is (owner, 2026-10-27). The review it answers: `handoff-2026-10-27-session-page-areas.md`.

## Where

`docs/specs/1236-session-pages/playground/v3.html` (launcher: ticket 1236). It opens on Escape's session page with the Pass. Bar: Design 1 to 3 (and Why), Room (Under par, Over par, In progress), Go to (Session page, Library card). Keys 1 to 3, S. Files: `pg-es3.jsx`; reuses `pg-es-core.jsx`, `pg-es-seed.jsx`, `pg2Model` from `pg-es2-line.jsx`. Storage key `pg_escape-session_v3`.

## Ratified going in (owner, 2026-10-27)

Three designs; session page first, then carried down to the library card; the result designed into the bespoke part, not the head; no minutes while in progress.

## The three designs (not ratified)

All three are v2's timeline. Shared: "Par 30 min" centred on its tick; "Out 28 min" under the exit door, which is lit from behind; every door is a button and its detail opens directly under the line, so control and picture stay on one screen; the verdict against par heads the card ("2 min under par" in the success colour, "11 min over par" in warning, "Still inside" in progress), with moves, hints and wrong tries under it.

1. **Doors you open.** The line as v2 drew it. The lock you tap shows each try as a row of blank tumblers lit as the room answered (dark wrong, amber right letters in the wrong order, cream per dial home), with hints, story and "Closest miss" / "First try" marked on their row.
2. **Every move on the line.** Every move drawn inside the bar as a square, stretch by stretch. Moments are buttons that light their own squares, so closest miss and longest stretch on one lock now look different. Needs a key.
3. **The clock.** The first v3's square clock face, kept because the owner found it interesting. Would need a square on the card.

## Calls I made (not ratified)

- Head (rig only, seam `window.GS_SESSION_QUIET` in `app/gs-session.jsx`; the main build never sets it): room name as H1, game name above, date; no result or figures.
- The wording above; tumblers never show letters or digits; cover colours (teal, amber, cream) on the game's elements, as the Word tiles do.
- The library card is v2's Version 1, unchanged.

## Gaps

- The game records lock minutes but doesn't send them to the session page; every design uses them.
- Near misses, partial readings and story lines are pass 2's sample record.
