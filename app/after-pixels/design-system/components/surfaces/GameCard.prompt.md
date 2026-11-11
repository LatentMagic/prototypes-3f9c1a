GameCard is the one game card. It works anywhere; inside a CardRow every card is one height. Use it wherever a game appears as a card, whatever the row is called.

```jsx
<CardRow title="More games">
  <GameCard art={<GameArt art="word" shape="wide"/>} title="Daily Word"
    blurb="You already know today’s answer. Start guessing." tags={<Tag kind="free">Free</Tag>}/>
</CardRow>
```

- A game appears in four forms only:
  - GameCard, in every CardRow;
  - GamePick, a pair of games featured by hand above the rows;
  - GameTile, in the all-games wall or a tile row;
  - ListRow, in a list of games or plays.
  A game not out yet has its own card, SoonCard; a game out for now in a row is a GameCard with `soon`. Don't write a page's own game card.
- A step of how something goes (a picture, a name, a line, never a game) is a StepCard, not a GameCard: GameCard's rules are about games, and its chip line leaves a blank row when empty.
- Name and blurb sit snug under the picture, whatever the name's length.
- Chips: the row shares one chip line, as tall as the tallest chip set, and each card's chips are centred in it. One line of chips sits level with the middle of another card's two, with no blank space under it. This has regressed before: never pin chips to the card's bottom edge, and never give the card its own row heights inside a CardRow.
- A sized game's time chip is its size's chip, `Tag` `kind="daily"` with `TIME_CHIPS[size]` (see Tag); never type its time.
- Every card in a row is a GameCard. Don't wrap the slots in extra boxes.
- Don't stretch, grow or re-size the picture to fill height.
- Write names to two lines at most, blurbs to two lines and tags to one line at the narrowest card (220px). Longer copy still lines up, but it makes every card in the row taller.
- Blurbs wrap normally. Never `text-wrap: balance` on a blurb: it narrows every line and leaves the right side empty.
- When the whole card opens something, put that one link or button in `title` and stretch it over the card (`mcp-art-host` on the card via `className`, `mcp-art-link` on the button).
- A game that needs the Pass gets `pass` (a player without the Pass sees the mark on the picture; a Pass holder and every free game don't). The Pass is never a tag in the tag row, and the mark never carries a price.
- The Pass mark opens the Pass page on its own: pass `onPass` with `pass`. It is a second control on the card, above the stretched link, so pressing it never opens the game. Hover lifts its fill and brightens its edge, as the Secondary button does.
- The top-right corner holds one chip at most: Coming soon (`soon`) wins, then the Pass (`pass`), then First free (`first`). The tag row holds two chips at most and keeps the schedule tag (Daily, Weekly), so none of these is ever a tag.
- A game whose first edition is free and the rest need the Pass gets `first` (lock and "First free"), for a player without the Pass. It is not a control; the card opens the game, whose page says the rest.
- A game that is out for now and coming back gets `soon`: "Coming soon" with no lock, the card dimmed behind it, no way in and no hover, focus or press effect. Pass `title` as plain text and leave `mcp-art-host` off. A game not out yet, or a game's next chapter, is a SoonCard instead.

## In the Game Store today

A note on the product as it stands, not a rule. It may be out of date; the product is the source.

- CardRows of GameCards: Available games, Just added, Free to play, More games.
- GamePicks: Discover's two picks.
- ListRows of games: Library and History.
