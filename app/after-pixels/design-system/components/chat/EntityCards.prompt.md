EntityCards shows the people, items or places in play. Block type `entities`.

```jsx
<EntityCards title="Suspects" items={[{name:'Delphine Rooke',line:'Had the iron poker'},{name:'Ivy Marchbank',line:'Never in the study',state:'out'}]}/>
```

- The name and line are the card. There is no picture by default; initials said nothing the name doesn’t. Pass `icon` for an object or `pic` for real art; it stays 28px.
- One line each, the thing the player needs to remember. Facts with their source go in ClueCards.
- Several kinds (suspects, weapons, rooms) are several EntityCards, each with its title.
- Pass `className="is-compact"` (block: `className:'is-compact'`) for name-only cards: they sit two to a row in a 300px chat instead of one.
- Optional fold: pass `collapsible` (starts open) or `collapsed` (starts closed). The card then sits behind a disclosure whose summary shows the title, a count (number of items) and a chevron that turns when open. It is a native `<details>`, so it opens in a chat picture too. Use it where a card is reference material the player can scroll past, such as a long list of clues. Never fold the card the turn is about. In a block: `{type:'entities',collapsed:true}`.
