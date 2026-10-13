# Coming soon cards on a phone (2026-10-13)

## Decision
- **Ratified by the owner, 2026-10-13: option 2, stack on a phone.** Below 480px a SoonCard puts the cover full width on top at 4:3 and the text under it. The problem was the arrangement, not the art.
- Owner, 2026-10-13: the cover must fit the card. The stacked cover runs the card's full width as a 2:1 band; the art keeps its 4:3 at the band's height, centred, and its ground fills the sides (Cover fill extended sideways). Desktop unchanged. The 240px cap tried before it is gone.
- Board: `playground/index.html` (0 today, 1 better art, 2 stack, 3 cover kept 4:3).

## Where it lives
- Applied in this product as one local rule in `index.html` (`@container gs (max-width: 479px) .mcp-soon`).
- **For the design system:** SoonCard should carry this itself. Its prompt says covers fill beside the text at every width; that line changes to stacking below 480px. Once SoonCard ships it, delete the local rule.
