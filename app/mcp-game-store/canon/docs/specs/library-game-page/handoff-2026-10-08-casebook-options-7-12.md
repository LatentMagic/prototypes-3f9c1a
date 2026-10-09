---
date: '2026-10-08'
topic: 'library-game-page'
status: 'in-progress'
type: 'exploration'
---

# Handoff: library game page: Casebook options 7 to 12

## Current Focus

Options 10 to 12 are built and waiting for the user's review. The next session collects that review first, records it raw in `review-2-notes.md` under a new "Review of options 10 to 12" heading, and changes nothing until the user has finished. Options 4 to 9 are background.

## Task(s)

- Done: review of options 4 to 6, raw notes in `review-2-notes.md`.
- Done: options 7 to 9 built on a ratified scope, then reviewed (notes in the same file).
- Done: options 10 to 12 built on a second ratified scope.
- Open: review of 10 to 12, then pick a direction or set the scope for the next round.

## Critical References

- `docs/specs/library-game-page/review-2-notes.md`: every raw note, both ratified scopes, and what each build contains. Read this first.
- `CLAUDE.md` ratification rule: nothing below is settled unless it's marked ratified.
- The design system guide: hover is not specified there, and a third colour is not allowed.

## Decisions (ratified by the user in words, 2026-10-08)

- Scope for 7 to 9: what's happening now gets the most room. Priority is about how much space each part gets, not a fixed order. Each option deals with the history that grows without end in its own way.
- Scope for 10 to 12, stated as principles:
  - This week has two states: in progress, and finished with Share front and centre. Last week is dropped.
  - Every achievement can be seen, at about ten.
  - The game page shows only a short list of recent cases. "All cases" opens a separate page with search, order and a filter (solved, unsolved, not played), built to hold 45 or more cases.
  - Rows spend their space on signal.
- Achievements: one option keeps the scrolling row of ten. The others bring back the smaller treatments from 4 and 6.
- Hover is left to the design system agent and stays an open gap. Anything clickable must still read as clickable.

## Recent changes

- `playground/pg-casebook-7-9.jsx` and `playground/casebook-7-9.html`: options 7 Split, 8 Lead, 9 Scoreboard.
- `playground/pg-casebook-10-12.jsx` and `playground/casebook-10-12.html`: options 10 One card, 11 Two halves, 12 Tiles. This build:
  - seeds 28 more weeks (45 in all) and ten achievements, adding five new badges to `CB_BADGE`;
  - adds a Week row (In progress / Finished) and an "All cases" jump to the rig bar.
- `playgrounds.json`: both rigs are added at the top of the ticket's entries.
- `review-2-notes.md`: the raw notes, the two scopes, and the build summaries.

## Learnings

- The 7–9 and 10–12 HTML files are copies of `casebook.html`, each with its own CSS block added. They load the earlier modules in order (`pg-casebook.jsx`, then 7–9, then 10–12). The last module loaded sets `window.GsCasebook` and `window.GsDemoBar`, so it wins.
- The 10–12 rig bar has three rows, so `casebook-10-12.html` raises `.gs-root` bottom padding and the Config pill to 152px.
- The user felt a strobing effect on 4 to 6. They put it down to too much small text and too little grouping. Option 5's emoji share text may also have caused it. The share text is words only from 7 on.

## Artifacts

- `docs/specs/library-game-page/playground/casebook-7-9.html`, `pg-casebook-7-9.jsx`
- `docs/specs/library-game-page/playground/casebook-10-12.html`, `pg-casebook-10-12.jsx`
- `docs/specs/library-game-page/review-2-notes.md`
- `docs/specs/library-game-page/handoff-2026-10-08-casebook-options-7-12.md` (this file)

## Action Items & Next Steps

1. Collect the user's review of 10 to 12, raw, one option at a time.
2. Not checked yet: phone width and the Pass ended viewer on 10 to 12. Check both before or during the review.
3. Held, to put to the user one at a time:
   - the streak squares read as a pattern, not as weeks passing;
   - the case page's turn list ("Question, Search, Show evidence…") is unreadable and needs grouping by kind;
   - the user felt a third colour might be missing; the design system rules it out, so it needs a decision;
   - hover, waiting on the design system agent.
4. Not ratified: the user called "what's happening for you right now comes first" an important rule. Word it and ask before treating it as one.
5. Update `README.md` in this folder to list the 7–9 and 10–12 rigs and this handoff. It hasn't been done yet.
6. Done: the five screenshots in `uploads/` were deleted with the user's agreement. The Circlists reference survives only as a note in `review-2-notes.md`.

## Other Notes

- Keep chat replies short, with one question per turn, and write raw notes as they come during a review.
- The user wants scope written as principles, not as "built on 7 using 8".
- Rejected: option 5's table layout, because a row has no room for the stats about now. Also rejected: showing last week next to this week, which took too much room, especially on phones.
