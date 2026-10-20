---
date: '2026-10-08'
topic: 'library-game-page'
status: 'in-progress'
type: 'exploration'
---

# Handoff: library game page: Casebook options 13 to 15 (final round)

## Current Focus

Options 13 to 15 are built and waiting for the user's review. The user wants this to be the final round. The next session collects the review first and writes it raw in `review-2-notes.md` under a new "Review of options 13 to 15" heading. It changes nothing until the user has finished. Then it asks which option, or which parts of each, becomes the direction. Options 4 to 12 are background.

## Task(s)

- Done: review of 10 to 12, written raw in `review-2-notes.md`. The user was disappointed. The page sprawled, every part ran full width, the streak and case list got no real design work, and 10's turn and state labels lost their formatting.
- Done: 13 to 15 built on the amended scope.
- Open: review of 13 to 15, then a direction.
- Not checked: phone width, the No Pass and Pass ended viewers, and 15's rail with No Pass (unplayed weeks are filtered out, so the rail should break where a week is missing).

## Critical References

- `docs/specs/library-game-page/review-2-notes.md`: every raw note, every scope, and what each build contains. Read the sections from "Review of options 10 to 12" down to "Built 2026-10-08: options 13 to 15" first.
- `CLAUDE.md` ratification rule. The user is frustrated, and that's urgency, not licence. Still put one decision at a time.
- The design system guide: hover isn't specified and a third colour isn't allowed. Both stay open.

## Decisions

Ratified by the user in words, 2026-10-08:
- Share is a button beside this week's result. Pressing it opens a pop-up with the share text. (The user said they ratified this earlier. Earlier notes didn't record it, so it was confirmed again.)
- 13 to 15 is meant to be the final round.
- Scope for 13 to 15, as the user's go-ahead with changes: every element running full width wastes space, so use grids and cards, side by side on desktop. Keep the now block's size in mind, with no fixed rule. The achievements grid from 11 can be reshaped and needn't be a full-width row. The rest of the proposal stood as written in the notes.

Not ratified:
- "What's happening for you right now comes first", still to be worded.

## Recent changes

- `playground/pg-casebook-13-15.jsx` (new). It loads after the 4–6, 7–9 and 10–12 modules and reuses `C10_CASES`, `C10_DONE`, `C10_ACH`, `c10Hist`, `C7Share`, `CbStatus` and `CbHead`. Its parts:
  - `C13Row`: one-line rows, folding to two lines under a 600px container;
  - `C13Session`: the case page, with turns grouped as Evidence shown, Searches and Questions;
  - `C13All`: the all-cases page, with three ways through (`pages`, `months`, `more`);
  - `C13Run`, `C14Cal` and `C15Weeks`: the three streak treatments.
- `playground/casebook-13-15.html` (new): a copy of the 10–12 HTML with a `c13-` CSS block added at the end of `<style>`, and the new script tag.
- `playgrounds.json`: the 13–15 rig is at the top of the ticket's entries.
- `review-2-notes.md`: the 10–12 review, the ratifications, the 13–15 scope and the build summary.

## Learnings

- Class collision. `.c13-turns` was already the case page's turn list (`display: grid`), and reusing it on a row cell broke the row. That cell is now `.c13-tc`. Check for an existing class before naming a new one in this shared CSS.
- Row columns appear only when the list container is at least 600px wide (`container: c13l`). In 13 and 15 the recent-cases card is narrower than that on a 1200px page, so rows show two lines there. Option 14's main column, and the all-cases list on a wide screen, get the column layout. Watch for this in review.
- The "file not found" warnings on rig pages are false alarms. The page loads through `<base href="../../../../">` (four levels) and renders. Confirmed by screenshot.

## Artifacts

- `docs/specs/library-game-page/playground/casebook-13-15.html`, `pg-casebook-13-15.jsx`
- `docs/specs/library-game-page/review-2-notes.md`
- `docs/specs/library-game-page/handoff-2026-10-08-casebook-options-13-15.md` (this file)

## Action Items & Next Steps

1. Collect the review of 13 to 15, raw, one option at a time. Write it as it comes.
2. Check phone width and the other two viewers, before or during the review.
3. Ask for a direction: one option, or named parts of each. One question per turn.
4. Still open, one at a time: a third colour, hover (waiting on the design system agent), and the "now comes first" wording.
5. Update this folder's `README.md`. It lists neither the 7–15 rigs nor the last two handoffs.

## Other Notes

- Keep chat replies short, with one question per turn. Don't dump an audit.
- The user wants ideas that change shape, not resized versions of the last round. Two things regressed in 10 to 12: everything ran full width, and held problems stayed parked. Don't park the streak or the case page again.
- Rejected so far: 5's table, last week shown beside this week, the scrolling achievements row as the only view, full-width blocks, and 12's separate cards.
