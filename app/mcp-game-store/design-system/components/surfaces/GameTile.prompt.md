GameTile is a game in the all-games wall: square picture, name, kind. Use it only there; anywhere else a game shown as a card is a GameCard.

```jsx
<div className="mcp-gwall">
  <GameTile className="mcp-art-host" art={<GameArt art="word" shape="square"/>}
    title={<button type="button" className="mcp-gtile-open mcp-art-link">Daily Word</button>} kind="Puzzle"/>
</div>
```

- A game appears in four forms only: GameCard in a row, GamePick for Discover's two picks, GameTile in the wall, ListRow in Library and History. Coming soon has its own card, SoonCard.
- No blurb and no tags on a tile. If a tile needs them, it's a GameCard.
- The name is the tile's one link or button (`mcp-gtile-open mcp-art-link`), stretched over the tile so the whole tile opens the game and the art moves with it.
