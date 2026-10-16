# Handoff: failed vs not played on the streak strip (2026-10-15)

Open question from the owner: should the library game page's streak strip show a failed edition differently from one not played? Nothing is decided; `app/` is untouched.

## The rig
`docs/specs/failed-vs-missed-strip/playground/index.html` (launcher: Failed and not played on the streak strip). An option board: the same 14 seeded Daily Word days (2 to 15 October; streak 4; two failed and two not played inside the 10 the strip shows; one of each inside the phone's 6), three options side by side, each at desktop width and at 390. Tap a day: its record opens in the app's panel.

1. Two states, as now: Completed / Not completed.
2. Three states: Completed / Failed (the plain outline with a cross, not red; the legend's square has a full X corner to corner) / Not played. Revised 2026-10-15 after the owner leaned to 2.
3. Three states, quiet: failed shares the Not completed outline and carries a small dot; the legend gains a Failed entry.

## Calls made (unratified)
- Legends say "Not played", not "Missed", per the failed-not-missed delta.
- Option 3 uses a dot, not a tint or tooltip: a tint is colour alone, and a tooltip doesn't work on a phone.
- The strip today is a picture (no taps). Every option makes each day a button; that change is shared, not an option.
- The record is a panel standing in for the session page.

## Decision
Option 2, ratified by the owner 2026-10-15 ("Integrate"), with the cross not red and the legend's square carrying a full X in the outline's colour.

## In the app
- `LbRun` (`app/gs-library.jsx`): a `failed` day gets `is-fail` (the outline plus the DS `close` icon); legend Completed / Failed / Not played for streak games. 36,000 Summers Ago keeps Played / Not played. `lbRunOf` carries `failed`.
- The strip stays a picture: days are not tappable (owner, 2026-10-15; the brief's tap line was not wanted). The playground still has taps.
- `failed` set in `gs-puzzles-library.jsx` (today only once it has ended in a loss), `gs-delve-library.jsx`, `gs-casebook.jsx` (`cbWeeks`).
- CSS beside the strip rules in `index.html`. QA entry `failed-on-strip`. Whatever wins changes `LbRun` in `app/gs-library.jsx` and the strip CSS in `index.html`.
