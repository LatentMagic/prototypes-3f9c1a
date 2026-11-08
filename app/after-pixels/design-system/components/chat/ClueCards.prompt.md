ClueCards sorts the facts found so far by kind. Block type `clues`.

```jsx
<ClueCards groups={[{kind:'Objects',facts:['Delphine Rooke had the iron poker.']},{kind:'Statements',facts:[{text:'Was Delphine Rooke in the dining room? No.',new:true}]}]}/>
```

- One card. Each kind is a section headed by its name and count; each fact sits on its own ruled line. A new fact is tinted and marked New at the end of its line.
- Always grouped. A flat list of clues didn't help players; sorted under kinds, it did.
- Mark only what this turn added. Next turn, drop the mark.
- Keep the kinds a game uses stable from turn to turn so the player finds the same heading in the same place.
- Optional fold: pass `collapsible` (starts open) or `collapsed` (starts closed). The card then sits behind a disclosure whose summary shows the title, a count (number of facts) and a chevron that turns when open. It is a native `<details>`, so it opens in a chat picture too. Use it where a card is reference material the player can scroll past, such as a long list of clues. Never fold the card the turn is about. In a block: `{type:'clues',collapsed:true}`.
