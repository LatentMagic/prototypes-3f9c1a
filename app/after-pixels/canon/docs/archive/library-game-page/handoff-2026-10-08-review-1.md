---
date: '2026-10-08'
topic: 'library-game-page'
status: 'in-progress'
type: 'exploration'
---

# Handoff: library-game-page, review of options 1 to 3

## Ratified (by the user, 2026-10-08)
- The history is a plain clickable list. Each row opens that session. An arrow or other signal on the row is allowed and open to ideation. No inline action (such as "Copy result") sits in the row.
- The next round is at least two new options, not a single option 4.
- The next round is a new playground, Casebook only, with three options.

## Liked, not ratified
- Option 3's flow: summary, then history list, then a session page per row.
- Option 3's progress tracking. Casebook's case titles.
- Option 2's Share button opening a panel with the text and Copy.

## Rejected in review
- Dead white space throughout (beside Copy, beside option 2's spotlight card as it changes size).
- Too much text in one space, with no grouping or containment.
- Achievements: no design work. Each needs an icon (route undecided: system line icons, cover shapes, or an outside set, which the design system says to ask about first).
- "Link to the game" label, link and "Copy link" say the same thing three times.
- Option 2's "This week's scene" can't be read; its edition list under "The week of…" is hard to find.
- The share text itself hasn't been designed.
- Option 3's footer floats mid-page on short pages.
- Option 1's session list doesn't read as openable and has no answer for months of sessions.

## Fixed
- Copy now works in the preview (fallback in `lgCopy`, `pg-library.jsx`).

## Built: Casebook, options 4 to 6 (awaiting review)
- `playground/casebook.html` + `playground/pg-casebook.jsx`. Strip: Option 4 / 5 / 6, Viewer. Key `pg_library_casebook_v1`.
- **4 Briefing**: this week's case card, then Your cases (latest six, then "Show earlier cases"); streak and an achievement badge grid in a side column. Case opens its own page; Share opens a panel. Share text in words only.
- **5 Register**: one full-width table (week, case, result, turns, lies), every case by month; achievements as a scrolling row of cards. Own page; Share panel; one emoji per move.
- **6 Case file**: a side panel holds this week, streak and a compact achievement list; a case opens in place of the list, with share text shown open and Copy attached to it. Each row carries a 16-turn strip. Share text as a grid of squares.
- Common to all: 17 weeks of seed (unplayed weeks shown to a Pass player only), status in colour, a 16-turn strip on every session, footer pinned to the bottom, badges drawn from the system's shapes (earned: full colour on a cover ground; to earn: outline).
- Pass ended: 4 shows earned badges only; 5 keeps all, progress stopped; 6 shows earned with a count.
- Invented, not ratified: case titles, records, badge art, the three share formats.

## Open
- Which of 4 to 6, or which parts.
- Achievement icon route (system shapes, as drawn here, or something else).
