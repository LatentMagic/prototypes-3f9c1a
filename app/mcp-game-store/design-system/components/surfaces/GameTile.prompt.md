GameTile is a game as a square picture, name and kind. It goes in the all-games wall (`mcp-gwall`) or in a sideways row (`CardRow kind="tiles"`), and nowhere else. Both give it the same size, so a tile looks the same everywhere. Never size a tile yourself.

```jsx
<div className="mcp-gwall">
  <GameTile className="mcp-art-host" art={<GameArt art="word" shape="square"/>}
    title={<button type="button" className="mcp-gtile-open mcp-art-link">Daily Word</button>} kind="Puzzle"/>
</div>
```

- A game appears in four forms only: GameCard, GamePick for Discover's two picks, GameTile in the wall or a tile row, ListRow in Library and History.
- Every GameTile is built the same way: the art is the game's square GameArt, the name is the one button. One shared tile part in the product, used by every screen. Coming soon has its own card, SoonCard.
- No blurb and no tags on a tile. If a tile needs them, it's a GameCard.
- The name is the tile's one link or button (`mcp-gtile-open mcp-art-link`), stretched over the tile so the whole tile opens the game and the art moves with it. Its underline is the text-link one (guidelines/visual-foundations.md, Underlines).
- A game that needs the Pass gets `pass` (a player without the Pass sees the mark on the picture; a Pass holder and every free game don't). The Pass is never a tag in the tag row, and the mark never carries a price.
