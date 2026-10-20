# Chapter coming soon

## Decided (2026-10-13, owner)
Option 1j: the Coming soon card for a chapter keeps the pair's Coming soon chip, adds a CHAPTER 2 label, keeps the game's blurb, and has one pressable "Play chapter 1" chip after Coming soon on the same row as its only way in. The name is plain text; no Pass tag. Covers extend to the card's height. In the design system: `SoonCard` (`components/surfaces/SoonCard.*`, card `soon-card.card.html`), `Tag kind="open"`, CSS `.mcp-soon*` and `.mcp-tag-open` in `components/components.css`, and a line in `guidelines/layout-and-patterns.md`. The owner is trying it in the product.

Asked 2026-10-13: some games will arrive in chapters, so a game can be out while its next chapter is not. Scope: how the Coming soon card shows that. Where else the chapter appears (the game page, the library page) is out of scope. The whole-game Coming soon card does not change.

## Options (playground: `playground/chapter-soon-card.html`)
An option board. The game is The Barrow of Hollowmere: chapter 1 out, chapter 2 coming. Each option is the Barrow's card in the Coming soon pair on Home, beside Derelict (unchanged). Options 4, 6 and 7 assume the Barrow is a Pass game; 6 and 7 assume Derelict is too.
- **0 Today.** No chapter card.
- **1 Label.** CHAPTER 2 above the name, "Chapter 1 is out now.", Coming soon tag. The name opens the game.
- **2 In the tag.** The whole-game shape; the tag reads "Chapter 2 coming soon".
- **3 In the name.** "The Barrow of Hollowmere: Chapter 2" as the title.
- **4 Out and soon.** The blurb, the Pass tag and a "Chapter 2 soon" tag.
- **5 Play chapter 1.** CHAPTER 2 label, Coming soon tag and a "Play chapter 1" link as the way in.
- **6 Same tags, both.** 4 applied to the pair: Pass and Coming soon on both cards; the Barrow adds a Chapter 2 tag.
- **7 Three tags, both.** Pass, Coming soon and what is coming on both: New game on Derelict, Chapter 2 on the Barrow.

Round 2 (building on 1; the owner disliked "Chapter 1 is out now" and wanted a description kept):
- **1a** Label, the game's description, Coming soon tag.
- **1b** 1a plus the Pass tag.
- **1c** 1a plus a "Play chapter 1" link.
- **1d** CHAPTER 2 · COMING SOON as the label; the tag is Pass.
- **1e** The same label; a "Play chapter 1" link and no tag.

Round 3 (building on 1b; invariant: CHAPTER 2 label, description, Coming soon chip). A Covers switch extends both covers to the card's height:
- **1b** Pass, Coming soon.
- **1f** First chapter free, Coming soon (the product's free-start tag, as on Delve and Casebook; no Pass tag).
- **1g** First chapter free, Pass, Coming soon.
- **1h** 1b with the name as plain text: the card is not a way in.

Round 4 (owner liked 1f but not a clickable name; 1g dropped). Name is plain text in both:
- **1i** Coming soon chip, then a Play chapter 1 link on the same row. No Pass tag.
- **1j** Coming soon chip, then a new pressable Play chapter 1 chip (the Pass tag's outline and chevron, play glyph).

The earlier rig (`playground/chapter-coming-soon.html`, placement across Home, game page and library) was off scope and is superseded.

Handoff: `handoff-2026-10-13-chapter-coming-soon.md`.
