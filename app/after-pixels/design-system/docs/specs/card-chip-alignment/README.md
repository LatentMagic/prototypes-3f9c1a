# Card chip alignment

## Decided (2026-10-15, owner)
Option 1 Fix, for Home's Available games and every CardRow of GameCards, plus the Coming soon pair.
- GameCard: picture, text (name and blurb, snug), chips. Inside a CardRow the row shares the three lines (subgrid); each card's chips are centred in the shared chip line. One row of chips sits level with the middle of Delve's two; no blank space under it.
- SoonCard: text from the top, chips on the card's bottom edge, so the pair's chips share one line.
- In the design system: `GameCard.jsx` (adds `mcp-gcard-text` round name and blurb), `.d.ts`, `.prompt.md`; `SoonCard.d.ts`, `.prompt.md`; `components.css` (`.mcp-gcard*`, `.mcp-soon-body`); CardRow prompt.

## Why it broke
- 2026-10-13, card-row-evenness: "shared lines" (four subgrid lines, chips centred). The owner's remembered version.
- 2026-10-13, card-snug-title option 1 "Snug, chips bottom": fixed the gap under one-line names by dropping the shared lines, and pinned chips to the bottom edge. Its stated cost was that a two-row chip set starts higher. That is the Delve gap.
- card-snug-title option 2 "Block, shared chips" had both (snug text, centred shared chips) and is what shipped here.

## Open, not changing now
The owner finds the Coming soon cards a little airy (white space between text and chips). Left as is.

Playground: `playground/card-chip-alignment.html` (0 Today, 1 Fix).
