---
date: '2026-10-08'
topic: 'library-game-page'
status: 'in-progress'
type: 'implementation'
---

# Handoff: library game page: option 16 is the direction, to be built into every library game page

## Current Focus

The user picked option 16 and asked for it on every library game page in the app (`app/gs-player.jsx`, route `page: 'record'`, for Delve, Daily Puzzles, Casebook and the hunter-gatherer game). Nothing in `app/` has changed yet. The 16 layout was designed for Casebook. Fitting it to the other three games involves decisions nobody has ratified yet (below, "Proposed mapping"). Get the mapping ratified first, one game at a time if the user prefers, then build.

## Task(s)

- Done: the review of 13 to 15, written raw in `review-2-notes.md`.
- Done: option 16 built in `playground/casebook-16.html` + `pg-casebook-16.jsx`, then revised once (top row made shorter).
- Ratified: 16 is the direction, and it goes into every library game page.
- Open: the per-game mapping, then the build in `app/`.
- Not checked on 16: the No Pass and Pass ended viewers, and the phone layout after the top-row revision. The foot of This week was hidden behind the rig strip in screenshots.

## Critical References

- `docs/specs/library-game-page/review-2-notes.md`, from "Review of options 13 to 15" down: the notes and what 16 contains.
- `CLAUDE.md` ratification rule. "Implement across all" ratifies the direction. It doesn't ratify how each game fills it.
- Upstream game specs, read live: LatentMagic/business-ops `work/apps/mcp-game-store/inception/_outputs/game-specs/`. Read them before mapping each game.

## Decisions

Ratified by the user in words, 2026-10-08:
- One option (16), not two.
- 16's top-row revision: the result (Solved) sits beside the title. "You've played every week since…" is cut. The next-case line shares one row with Share and the turns link. This week and the streak are both shorter.
- 16 is the direction for every library game page.

## What 16 is (Casebook)

- Two columns from 900px (`2fr / minmax(320px, 1fr)`): This week beside the streak, then achievements beside your cases. On a phone, in that order: This week, streak, achievements, your cases.
- This week: a label, the title with the result beside it, one sentence of figures, the turns bar (kept when finished), then a row of Share, the turns link and "The next case arrives on…".
- Streak: a figure plus "weeks in a row", then a run of 10 dated weeks where weeks played in a row join into one bar. Under 480px it shows six. Legend: Played, Missed.
- Achievements: the grid from 11.
- Your cases: four rows, each a title over its date and result, inside a card with the same padding as achievements. "All cases" opens the page of numbered pages of twelve, with search, order and filter in a side column.
- Case page: 13's, turns grouped by kind. Leave it until the game itself is better designed (user, 2026-10-08).

## Proposed mapping (not ratified)

- Casebook: 16 as built.
- Delve: This week's scene, with the ending ("Close call") in place of Solved and the progress track as the bar. Streak in weeks. Achievements from `GP_ACH`. Your scenes last.
- Daily Puzzles: Today in place of This week, with one row per puzzle and its result. Streak in days. No achievements are seeded, so that card is left out until some exist. Your puzzles last.
- Hunter-gatherer game: it has no editions, so there's no This week and no streak. The top row becomes your last day. No achievements. Your days last.

## Recent changes

- `playground/pg-casebook-16.jsx` (new): `C16Now`, `C16Run`, `C16Row`, `C16Cases`, `C16Lay`. It pushes option 16 onto `C13_OPTS` and opens on 16 once (`pg_cb16_seen`).
- `playground/casebook-16.html` (new): a copy of the 13–15 page with a `c16-` CSS block added at the end of `<style>` and the new script tag.
- `playgrounds.json`: the 16 rig is first in the ticket's entries.
- `review-2-notes.md`: the 13–15 review and the 16 build note.

## Learnings

- `run_script` won't write a file that shrinks by more than half. A slice with a wrong boundary tripped it once. Log the indices before saving.
- The rig strip covers the bottom of the first screen in screenshots. Hide it before judging the This week foot.
- The "file not found" warnings on rig pages are still false alarms (`<base href="../../../../">`). Confirmed by screenshot.

## Artifacts

- `docs/specs/library-game-page/playground/casebook-16.html`, `pg-casebook-16.jsx`
- `docs/specs/library-game-page/review-2-notes.md`
- this handoff

## Action Items & Next Steps

1. Put the proposed mapping to the user, one game at a time. Read each game's upstream spec first.
2. Once it's ratified, build in `app/gs-player.jsx`. Lift the `c13-`/`c16-` CSS needed into the app's styles. Split past ~200 lines per `frontend-ui-engineering`. Add states for the new situations (finished week, No Pass, Pass ended) to `app/states.jsx`.
3. Check phone and desktop widths and all three viewers.
4. Ask whether this earns a `CHANGELOG.md` entry. It probably does, because the shape of the library page changes.
5. Update this folder's `README.md`, which still lists only the first two rigs and handoffs.
6. Still open: a third colour, hover (waiting on the design system), and the wording for "now comes first".
