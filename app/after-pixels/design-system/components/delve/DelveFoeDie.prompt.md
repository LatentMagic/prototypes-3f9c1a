DelveFoeDie is the foe's roll in a Delve held roll's Foe roll row.

```jsx
<DelveFoeDie value={15} hit surface="popup"/>
<DelveFoeDie value={7} surface="popup"/>
<DelveFoeDie value={15} other={6} hit surface="popup"/>
```

- When the foe rolled with advantage (after the hero's heavy attack misses), pass `other`: an empty diamond sits behind the die, with no number.
- Filled red when the foe hit, an outline when it missed; the row's words say which, so colour is never the only signal.
- Always a diamond. The hero's roll is a hexagon, so the two never read as the same kind of die.
