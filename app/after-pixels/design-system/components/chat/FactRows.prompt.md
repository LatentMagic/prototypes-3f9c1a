FactRows lists named facts: what the player carries, which level they're on, what an accusation names. Block type `facts`.

```jsx
<FactRows items={[{label:'Level',value:'1 of 5'},{label:'Pack',value:'torch, rope, 4 silver'}]}/>
```

- Use it in place of a `mono` box of "Label  value" lines.
- Numbers you count up or down belong in StatRow; progress towards an end belongs in Track.
- Optional fold: `fold="open"` or `fold="closed"` (block: `fold:'closed'`) puts the card behind a disclosure whose summary shows the title, a count (number of rows) and a chevron that turns when open. It is a native `<details>`, so it opens in a chat picture too. Fold a long ledger, for example `<FactRows title="Pack" fold="closed" items={…}/>`; `plain` drops the fence around the folded card too. Don't fold the card that answers the player's latest move.
