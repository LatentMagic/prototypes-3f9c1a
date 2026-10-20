# Canonical row: content audit (2026-10-15)

Read from the product's current `app/` (gs-history.jsx, gs-data.jsx, gs-editions.jsx, gs-discover.jsx) and the owner's review of round 1 (notes.md).

## What each surface has to say
A fact stays in the row only if a player scanning the list uses it to pick a row (ListRow rule).

- **History** (mixed games, under day headings): which game, which edition, how it went, what time, whether it was a replay. Longest title: "Casebook · The Night Train to Fort William". Longest result: "All 4 groups, no mistakes".
- **Plays card** (one game, no headings): edition, result, date, replay. The game is the page.
- **Every case / Every word** (one game): number and name (or number alone), date, whether played. No result.
- **Library** (one row per game): game, what's waiting, last played. Longest: "This week's room is ready", "The Barrow of Hollowmere".

## The width budget at 320
A 320 frame leaves a 286px list. Row padding takes 32, a cover 56 + 12 gap, the chevron 20 + 12. That leaves **154px** for line one. A time beside the title takes another 52, leaving **102px**.

"Escape · The Locked Study" needs about 205px at 16px 600. So at 320 a mixed-game title fits neither beside the time nor alone on its line. There are only three ways out: let it wrap (rows grow and differ, which is round 1's problem), cut it with "…", or drop words. The cover already names the game, so the game's name is the first candidate to drop.

## What can be shortened, removed or replaced
- **Game name in History**: the cover says it. It can go from the visible title on phones, but stays in the row's accessible name and on the page it opens. Library keeps the name, because there the row is the game.
- **Result**: the tick or cross already gives the verdict, so a short form only needs the score.
  - "Escaped in 6 moves" → "6 moves"
  - "Solved in 3 of 6" → "3 of 6"
  - "All 4 groups, 1 mistake" → "1 mistake"
  - "Still locked in" → "Locked in"
  - "Today's groups are ready", "This week's room is ready", "Chapter 1 is ready" → "Ready"
  - "Done today", "Done this week" → "Done"
  - Already short, unchanged: "Missed", "Solved", "Rescued", "Hero fell", "Ritual done", "In progress", "Not finished", "Pass only", "Free case done", "Played".
  The product would supply both forms. The short form is never invented by truncating.
- **Time**: already minimal (22:05 under a day heading, 6 Oct elsewhere).
- **Chevron**: says "opens" (ListRow rule). It could be removed on a phone, since the whole row is the target, but that removes an affordance and has to be a stated cost.

## State
- **Replay** is the only state that adds a slot. Round 1 gave it its own place (right, under the time), which makes Replay rows a different shape or leaves a hole in rows without it. It can also be a prefix on the result line ("Replay · ✓ 6 moves") or an icon. An icon breaks ListRow's "never a symbol that has to be learnt" rule.
- **Win, loss, none**: carried by the icon, so the words can shorten.
- **In progress, Not finished, Not played**: these replace the result text and need no extra slot.

## Art
The Cover rule beside a heading is that the cover shares a top and bottom edge with the text, and the art never stretches. Rows should follow it. On a two-line row the cover matches the two lines (56×42). On a one-line row it sets the row height (40×30). A small cover floating in a tall row is what looked wrong in round 1.

## Wide
The 720 ledger threshold in round 1 broke at 768 because its columns sized to content. In round 2 every option uses fixed columns from 640px of list width, so 768 is just a roomier version of the same shape.

## Playground
`playground/canonical-row-2.html` has options 11 to 15. 0 is the shipped row, for reference.
