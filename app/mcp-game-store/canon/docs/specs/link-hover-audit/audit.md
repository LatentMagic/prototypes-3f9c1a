# Link hover audit (2026-10-09)

Design system rule (`components.css`, `.mcp-lnk`): the underline starts at 45% strength and 4px offset. On hover (mouse only) it goes to full strength, drops to 6px offset and the text turns white. Press drops opacity to .55.

## A. Already correct
`DS.TextLink`, 22 uses (auth, library "See every…", "All games", "Cancel subscription" and others). No change.

## B. Hand-built copies of the link look. Mechanical: match the system
| Where | Today | Fix |
|---|---|---|
| `.gs-inlink` (sign-in/up footers, "What's included" x3) | underlined, no hover | add the hover |
| `.gs-ft-mail`, `.gs-support`, consent and legal `a` | underlined, colour change only | add the offset move |
| `.gs-ft-link` (Privacy, Terms, Refunds) | no underline until hover, then it pops in | fade it in on the same timing |

## C. Decision 1: game card titles (screenshot 1)
`.gs-titlebtn`, `.dc-tile-name`: underline appears instantly when the card is hovered, pressed or focused. The box already lifts its fill and the cover zooms, and focus already draws a 2px ring on the card.
- 1a. Drop the title underline. The box says it. **Recommended.**
- 1b. Keep it, but animate it like a link (fade and offset).
- 1c. Keep as is.

## D. Decision 2: "Casebook >" in the home hero (screenshot 2)
`.gs-hero-name`: no hover at all, only a press dim.
- 2a. Chevron nudges 4px right and the name gets the link underline fading in. **Recommended.**
- 2b. Chevron nudge only (same as card and row chevrons).
- 2c. Underline only.

## E. Decision 3: bar and menu text
`.gs-navlink` (top bar), `.gs-menu-item` (menu), `.gs-brand`: no hover. The current page already carries a 2px bar.
- 3a. Same underline fade on hover, not on the current page. **Recommended.**
- 3b. Colour change only.
- 3c. Leave.

## F. Not touched
Buttons, tags, cover buttons (they already zoom and outline), list rows (fill and chevron).
