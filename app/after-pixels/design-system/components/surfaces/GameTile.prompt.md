GameTile is a game as a square picture, name and kind. It goes in the all-games wall (`mcp-gwall`) or in a sideways row (`CardRow kind="tiles"`), and nowhere else. Both give it the same size, so a tile looks the same everywhere. Never size a tile yourself.

```jsx
<div className="mcp-gwall">
  <GameTile className="mcp-art-host" art={<GameArt art="word" shape="square"/>}
    title={<button type="button" className="mcp-gtile-open mcp-art-link">Daily Word</button>} kind="Puzzle"/>
</div>
```

- A game appears in four forms only: GameCard in a row, GamePick for a pair featured by hand, GameTile in the wall or a tile row, ListRow in a list of games or plays.
- Every GameTile is built the same way: the art is the game's square GameArt, the name is the one button (plain text on a `soon` tile, which has no way in). One shared tile part, never a screen's own. A game not out yet has its own card, SoonCard.
- No blurb and no tags on a tile. If a tile needs them, it's a GameCard.
- The name is the tile's main link or button (`mcp-gtile-open mcp-art-link`), stretched over the tile so the whole tile opens the game and the art moves with it. Its underline is the text-link one (guidelines/visual-foundations.md, Underlines).
- A game that needs the Pass gets `pass` (a player without the Pass sees the mark on the picture; a Pass holder and every free game don't). The mark opens the Pass page on its own: pass `onPass` with `pass`; it sits above the stretched name, so pressing it never opens the game. The Pass is never a tag in the tag row, and the mark never carries a price.
- The top-right corner holds one chip at most: Coming soon (`soon`) wins, then the Pass (`pass`), then First free (`first`).
- A game whose first edition is free and the rest need the Pass gets `first` (lock and "First free"), for a player without the Pass. It is not a control; the tile opens the game, whose page says the rest.
- A game that is out for now and coming back gets `soon`: "Coming soon" with no lock, the tile dimmed behind it, no way in and no hover, focus or press effect. Pass `title` as plain text and leave `mcp-art-host` off. A game not out yet, or a game's next chapter, is a SoonCard instead.
