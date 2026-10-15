GameArt draws a game's flat-shape art and gives it the system's hover motion; use it wherever a game's art appears.

The three built-in pieces (`groups`, `casebook`, `hunter`) are examples of the method, not the game library. Do not treat them as the games in a product or use them as placeholders for real games; use the owner's art, or add a piece.

```jsx
<a className="mcp-art-host" href="/groups"><GameArt art="groups" shape="square"/><span>Daily Groups</span></a>
<Card href="/casebook"><GameArt art="casebook" shape="wide"/>…</Card>
<GameArt art="word"/>  {/* nothing pressable around it: still */}
```

- A cover plays its motion as the hover, focus and press response of the nearest pressable thing it sits in; with nothing pressable around it, it is still.
- A clickable `Card`, `ListRow` or `Cover` is the host on its own. For any other link or button, put `mcp-art-host` on the whole `<a href>` or `<button>`, never only the image. The class does nothing on an element that is not pressable.
- A card with a second control inside: `mcp-art-host` on the card box, `mcp-art-link` on its one main link or button stretched over the card. The art moves with that link and rests over the second control.
- Motion: 400ms, one curve, shapes nearly in step (stagger 50ms at most), held until the pointer leaves. On touch it plays while a finger is down. Nothing overrides the long-press menu.
- Pieces recompose for each frame shape; add a new piece by writing its description first (`guidelines/game-art-motion.md`).
