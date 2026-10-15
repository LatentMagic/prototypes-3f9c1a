StatRow shows a few counters: guesses left, clues found, turns, time. Block type `stats`.

```jsx
<StatRow items={[{label:'Guesses left',value:4},{label:'Turn',value:'5 of 16'}]}/>
```

- Two to four counters. More than four is a FactRows list.
- Values are short: a number, "5 of 16", "55 min".
