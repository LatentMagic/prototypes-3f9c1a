---
date: '2026-10-09'
topic: 'editions'
status: 'awaiting-review'
type: 'exploration'
---

# Handoff: the Editions page playground

## What was built
`docs/specs/editions/playground/index.html` and `pg-editions.jsx`. The entry is a copy of root `index.html`, with `<base href="../../../../">`, the playground CSS added and the module loaded before `main.jsx`. It is listed in `playgrounds.json`. `app/` is unchanged.

The module wraps `window.GsGamePage`, so `{ page: 'editions' }` on any game's route shows the Editions page. It copies `GsWeekCard` to add "All editions" beside the edition heading on the product page, and copies `LbRecent` to add "All editions" beside "All…" on the library game page. 36,000 Summers Ago gets neither.

The strip has four rows: Option 1/2/3 (with Why and Hide), Game (the six games with editions), Go (1 Product page, 2 Editions, 3 Library game page) and View (signed out, no Pass, Pass). It opens on Casebook, no Pass, Editions. State is stored in `pg_editions_v1`.

The line is a placeholder, "Start <game> #<n>". Copying uses `lbCopy`. Every edition gives its line in every view, and a Pass edition carries `GsPassTag` plus "comes with the Pass · About the Pass". Nothing blocks.

## Options
1. **Ledger.** One row per edition shows the number and name, the date, a Pass mark or a Latest tag, and your result. Pressing a row opens a dialog with the line, Copy and "See your session". The tools are search, order and Show (All, Played, Not played). Cost: the line is one press away.
2. **Line on every row.** Rows are grouped by month, and every row carries its line and a Copy line button. The result links to the session. Cost: rows are tall, the line repeats, and the daily lists are long.
3. **Calendar and one edition.** Day cells sit under each month: filled if played, with a small Pass dot. The picked edition shows in full in a sticky panel with the line and Copy, and search jumps to a number or date. Cost: titles stay hidden until a cell is picked.

## Open items, as explored (none ratified)
- **What a row shows.** 1 is minimal, 2 carries the line itself, and 3 shows one edition in full at a time.
- **Product page, Casebook and Delve, signed in without the Pass.** 1 keeps today's sentence "The first edition is free." 2 adds a "Play the first case/scene" button that opens its line. 3 makes "The first case is free" a link to the Editions page with that edition picked.
- **Editions page, the free first edition.** 1 gives it no mention beyond the missing Pass mark. 2 pins it above the list for every visitor. 3 tags it "Free to everyone" when it is picked.

## Not built or unresolved
- Signed-out visitors see no results. A Pass-ended player sees results only for the first edition (simplified).
- Results for the puzzle games are invented seed data and ignore free and Pass history.
- The phone width and the signed-out flow have not been checked by eye.
- History's filter removal (proposed in the brief) is not touched here.

## Next
1. Get the owner's pick on 1, 2 or 3, and on each first-edition treatment.
2. Port the pick into `app/`: a real `editions` route in `main.jsx`, and the links in `gs-game.jsx` and `gs-library.jsx`.
3. Make the unplayed rows in `LbAll` lead to the line, or retire `LbAll` in favour of the Editions page.
