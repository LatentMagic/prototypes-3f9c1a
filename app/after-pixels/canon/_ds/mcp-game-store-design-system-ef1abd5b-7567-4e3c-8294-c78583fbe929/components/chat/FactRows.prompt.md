FactRows lists named facts: what the player carries, which level they're on, what an accusation names. Block type `facts`.

```jsx
<FactRows items={[{label:'Level',value:'1 of 5'},{label:'Pack',value:'torch, rope, 4 silver'}]}/>
```

- Use it in place of a `mono` box of "Label  value" lines.
- Numbers you count up or down belong in StatRow; progress towards an end belongs in Track.
