FactRows lists named facts: what the player carries, which level they're on, what an accusation names. Block type `facts`.

```jsx
<FactRows items={[{label:'Level',value:'1 of 5'},{label:'Pack',value:'torch, rope, 4 silver'}]}/>
```

- Use it in place of a `mono` box of "Label  value" lines.
- Numbers you count up or down belong in StatRow; progress towards an end belongs in Track.
- Optional fold: pass `collapsible` (starts open) or `collapsed` (starts closed). The card then sits behind a disclosure whose summary shows the title, a count (number of rows) and a chevron that turns when open. It is a native `<details>`, so it opens in a chat picture too. Use it where a card is reference material the player can scroll past, such as a long list of clues. Never fold the card the turn is about. In a block: `{type:'facts',collapsed:true}`.
