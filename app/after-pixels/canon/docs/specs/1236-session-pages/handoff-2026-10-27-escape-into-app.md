---
date: '2026-10-27'
ticket: '1236'
topic: 'escape-into-app'
status: 'in-review'
type: 'build'
---

# Handoff: Escape's session page and now card, into the main build

## Where

- Session page: Library → Escape → See every move (states `session-escape`, `-on-par`, `-over`, `-hard`, `-in-progress`).
- Now card: Library → Escape (states `library-escape`, `-on-par`, `-over`, `-hard`, `-in-progress`, `-free`).
- Config → Library → "Escape, this week’s room": Under par / On par / Over par / Hard (`review.escape`). QA entry `escape-1236`.

## What landed (owner's brief, 2026-10-27: "integrate v5")

- `app/gs-escape.jsx` (new, loads after `gs-pass-aids.jsx`): the model, the line, the session page's result (The door), Lanes with Marks, the session body, the now card. Styles: the last `<style>` in `index.html` (`es-*`).
- `app/gs-puzzles-library.jsx` (foot): Escape's nine earlier rooms from the playground seed, so the streak, Your rooms and History read ten rooms.
- `index.html`, after `.lb-top`: every game's now card keeps its result at the top right at every width; the title wraps beside it (owner, 2026-10-27: "it applies everywhere").
- Config row, states and QA entry: see Where.
- `app/gs-data.jsx`: the room's record beyond its moves (par, the either-or exit, the clock hands' part count, lock minutes per play) and the sample plays `escape-par`, `escape-over`, `escape-hard`, held once.
- The record drops the typed cabinet lock's dial readings and the drawer's near miss (the spec: a typed lock answers only Open or Wrong). The clock hands' counts stay.
- `app/gs-session.jsx`: the two seams (`GS_SESSION_BODY`, `GS_SESSION_QUIET`) are now the real hook, comments updated.

## Decided (owner, 2026-10-27)

- **The card's result is one word, "Escaped"**: green under or on par, amber over par, no icon; in progress, the store's In progress. The minutes are on the line. Tried and dropped on the way: the open door with "Escaped" and the verdict (two titles); "✓ 2 min under par"; "✓ Escaped, 2 min under par" (the icon looks bad on a phone).
- **The result holds the top right on every game's now card**, the title wrapping beside it ("the best we can do. Let's leave it"; "it applies everywhere"). Moving it onto the label's row on phones was ruled out as too severe.
- **A door on the card opens the session page on that lock's lane** ("fucking brilliant"). Marked `KEEP:` in `gs-escape.jsx`.
- **"See what's out for you to play" stays under the card**, as on every game's card: not part of this change.
- **The card's lack of level with the streak card is a known problem for another time.**

## Calls I made (not ratified)

- **The card carries the result and the line, not the lanes.** The session page is one press away and has them.
- **The card's line keeps the door numbers and "Out 28 min"** at a smaller size (bar 20px).
- The record link opens the session page on the way out.
- A free player's card keeps "Keep playing with the Pass."
- **The free player's first-room card uses the same card** once played or started (`CprFirst` in `gs-pass-library.jsx`), under its own label.
- **Every move** is collapsed behind a Disclosure, as v5 has it.

## Gaps

- **Delve's long endings** ("Too late: the ritual was completed") crowd the top right of its now card on a phone. To solve when Delve's page is designed (owner, 2026-10-27). Noted beside the rule in `index.html`.
- The streak card beside the now card is shorter and shows space at its foot (known, out of scope).
- Your rooms and History still open `escape-week` whatever Config stages, so on Over or Hard they show this week as under par.
- The game records no lock minutes; the line is drawn by minute (in progress: this week's minutes).
- The v5 playground and earlier rigs don't load `gs-escape.jsx` and are unchanged; they stay as the ticket's record.

## Next

- The owner signs off; then the QA entry `escape-1236` is deleted.
- Next game's session page: start its playground from v5 (`README.md` § Lessons for playgrounds).
