# Card row evenness

Asked 2026-10-13: cards in a `CardRow` take the tallest card's height and leave dead space (Home "Available games", the product page's More games). Define `CardRow` so its cards come out even, and propose three ways.

## Findings
- Cause of the dead space: `.mcp-crow-track` is a grid, so every card stretches to the tallest. Home's `GsFeature` pushes its tags down (`.gs-feat-body > :first-child { flex: 1 0 auto }`), so the spare height sits in the middle. More games' `GsGameCard` is `align-content: start`, so it sits at the bottom.
- In both rows the tallest card is a made-up game (Escape: a three-line blurb and two lines of tags at 220px). Daily Word and Daily Mystery are two lines each.
- The narrow wrap on Daily Mystery's home blurb ("There’s a body and a / story that doesn’t add up.") does not come from `text-wrap: balance`. In the current product (`app/` plus the LM-1110 candidate) no blurb has it; the computed value is `wrap`. The cause is the card's width: four cards to a row at the 220px minimum leaves about 186px of text, and "story" does not fit on line one. At 1440px it wraps "There’s a body and a story that / doesn’t add up." Removing the ban's rules is already done; nothing is left to remove.
- The two cards are two layouts of one job: picture, name, blurb, tags. Home uses gaps of 16 and 8; More games uses 12.

## Options (playground: `playground/card-row-evenness.html`)
Options 1 to 3 share one card anatomy: picture, name, blurb, tags, with one 12px gap.
- **0 Today.** As built.
- **1 Shared lines.** The row owns four lines and every card's parts sit on them (subgrid). Parts start level and cards are the same height. Cost: a shorter part leaves the rest of its line blank, and the tallest card in the row sets the lines even when it is scrolled out of view.
- **2 Fixed shape.** Name one line, blurb two lines, tags one line on the bottom edge. Every card is the same shape everywhere. Cost: a copy rule (blurb in two lines, tags in one, at 220px); copy that breaks it grows its card.
- **3 Picture takes the slack.** The picture grows to fill the card; the text sits on the bottom edge. No blank space. Cost: pictures vary in height and names do not start level.

The strip's readout gives each row's height spread, how far apart the names start and the most blank space in one card, live, at any width.

## Unified (2026-10-13, trial)
The owner asked for one definition. In the playground's copy of the app, Home's `GsFeature` and More games' `GsGameCard` are now one card, `GsGameCard` (`playground/app/gs-parts.jsx.txt`): picture (2:1), name, blurb, tags as the card's direct children, 12px gap. The row layout is one CardRow rule (`.mcp-gcard` in `pg-card-row-evenness.css`). Option 3 was dropped (the owner: pictures must never move). Options left: 0 one card with no rule, 1 shared lines, 2 fixed shape. Both rows now measure the same: 270px cards, 322px tall, name at 147, blurb at 183, tags at 243 (option 1) or 278 (option 2).

## Decided (2026-10-13, owner)
Option 1, shared lines, with one card for every CardRow.
- In the design system: `GameCard` (`components/surfaces/GameCard.jsx`, `.d.ts`, `.prompt.md`), its CSS (`.mcp-gcard*` after the CardRow block in `components/components.css`), CardRow's `.d.ts` and `.prompt.md`, `guidelines/layout-and-patterns.md` (CardRow line) and the CardRow card.
- Copy rule: blurbs written to two lines and tags to one at 220px. Longer copy still aligns but makes the whole row taller.
- The product swaps `GsFeature` and `GsGameCard` onto `DS.GameCard` (prompt sent to the product agent the same day).
