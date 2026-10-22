GamePick is a game featured by hand, above the rows, always one of a pair. Use it only for that; a game in a row is a GameCard.

```jsx
<div className="mcp-gpicks">
  <GamePick className="mcp-art-host" art={<GameArt art="casebook" shape="wide"/>} label="A NEW CASE EVERY WEEK"
    title={<button type="button" className="gs-titlebtn mcp-art-link">Casebook</button>}
    blurb="Ask the question they haven’t prepared for." tags={…}/>
  <GamePick … label="FREE EVERY DAY" …/>
</div>
```

- Always two, in `.mcp-gpicks`, so they line up. Both have a label.
- The label says why it's picked, not what the game is.
- The picture is 3:1. Don't resize it to fill.
- A game that needs the Pass gets `pass` (a player without the Pass sees the mark on the picture; a Pass holder and every free game don't). The mark opens the Pass page on its own: pass `onPass` with `pass`. The Pass is never a tag in the tag row, and the mark never carries a price.

## In the Game Store today

A note on the product as it stands, not a rule. It may be out of date; the product is the source.

- The pair is Discover's two picks.
