# Handoff 2026-10-07: free and the Pass

## Decisions (ratified by the user in chat, 2026-10-07)
- Home: the "Who gets what" block is removed. How it works step 3 reads "Get the Pass for the full game library and a streak that's kept." with the link "What's included" to the Pass page.
- Pass page: the two "Not paying / Paying" cards are replaced by one centred table, "What you get", columns Free and Pass (`GsCompare`, `GS_COMPARE` in `app/gs-parts.jsx`). The Pass column sits on a card-fill band.
- Rows and copy:
  - Daily Puzzles (free): "Short puzzles that change every day."
  - The first scene of Delve (free): "Start the adventure. The rest of it comes with the Pass."
  - Full game library (Pass): "Including every new game the day it lands."
  - Everything you missed (Pass): "Every earlier edition of the daily and weekly games, ready to play."
  - Your record (Pass): "Your results, streak and history stay with you. See where you stand."
- Delve's first scene is free (Johnny's request). Delve page, not paying: button "Play the first scene", link "See the Pass", small line "The first scene is free. Every scene after it is part of the [Platform] Pass." Card tag "First scene free".

## Open
- "See where you stand" hints at a leaderboard or sharing that no spec records yet.
- "Scene" is used for Delve's first level; confirm with Johnny it means the same thing.
- The "First scene free" tag, the Delve page lines and the Delve wiring were not reviewed line by line.
- Phone widths (390, 320) not checked by eye after the copy changes.

## Files
- Playground (finished): `docs/archive/home-free-and-pass/`.
- Also fixed: "Cancel before … and pay nothing." lost its spaces inside a flex row (`app/gs-billing.jsx`).
