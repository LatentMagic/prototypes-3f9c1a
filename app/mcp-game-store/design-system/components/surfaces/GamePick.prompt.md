GamePick is one of Discover's two picks: a game featured by hand, above the rows. Use it only there; a game in a row is a GameCard.

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
