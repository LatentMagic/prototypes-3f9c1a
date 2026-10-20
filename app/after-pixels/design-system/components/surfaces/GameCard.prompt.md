GameCard is the one game card. It works anywhere; inside a CardRow every card is one height. Use it wherever a game appears as a card: every CardRow (Available games, Just added, Free to play, More games).

```jsx
<CardRow title="More games">
  <GameCard art={<GameArt art="word" shape="wide"/>} title="Daily Word"
    blurb="You already know today’s answer. Start guessing." tags={<Tag kind="free">Free</Tag>}/>
</CardRow>
```

- A game appears in four forms only:
  - GameCard, in every CardRow;
  - GamePick, Discover's two picks;
  - GameTile, in the all-games wall;
  - ListRow, in Library and History.
  Coming soon has its own card, SoonCard. Don't write a page's own game card.
- Name and blurb sit snug under the picture, whatever the name's length (decided 2026-10-13, docs/specs/card-snug-title/).
- Chips: the row shares one chip line, as tall as the tallest chip set, and each card's chips are centred in it. Daily Word's one row sits level with the middle of Delve's two, with no blank space under it. Decided 2026-10-15 (docs/specs/card-chip-alignment/). This has regressed before: never pin chips to the card's bottom edge, and never give the card its own row heights inside a CardRow.
- Every card in a row is a GameCard. Don't wrap the slots in extra boxes.
- Don't stretch, grow or re-size the picture to fill height.
- Write names to two lines at most, blurbs to two lines and tags to one line at the narrowest card (220px). Longer copy still lines up, but it makes every card in the row taller.
- Blurbs wrap normally. Never `text-wrap: balance` on a blurb: it narrows every line and leaves the right side empty.
- When the whole card opens something, put that one link or button in `title` and stretch it over the card (`mcp-art-host` on the card via `className`, `mcp-art-link` on the button).
- A game that needs the Pass gets `pass` (a player without the Pass sees the mark on the picture; a Pass holder and every free game don't). The Pass is never a tag in the tag row, and the mark never carries a price.
- The Pass mark opens the Pass page on its own: pass `onPass` with `pass`. It is a second control on the card, above the stretched link, so pressing it never opens the game. Hover lifts its fill and brightens its edge, as the Secondary button does.
