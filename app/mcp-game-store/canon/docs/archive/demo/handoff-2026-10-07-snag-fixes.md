# Handoff 2026-10-07: demo snag fixes

Supersedes the description of the home opening in the 2026-10-06 handoffs.

## What the build does
- Pictures of the product in use are real, unedited screenshots of a real AI app (rule: `assets/in-use/README.md`). The home opening shows one on the cover panel.
- The three screenshots on the Delve page are stand-ins showing a different game until real Delve ones exist.

## What landed
- Streak row (Daily Puzzles, Pass view; History): six filled, one empty four days ago. Figure changed to "Streak: 3 days".
- Home at phone width: the opening grid's column is now `minmax(0, 1fr)`, so the four cover pictures stay inside the side margin at 390px and 320px.

## Ratified
- 2026-10-07, by the user ("seems fine"): the empty square is the third from the left (oldest on the left, today on the right).
