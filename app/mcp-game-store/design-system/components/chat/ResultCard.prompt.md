ResultCard closes a game. Block type `result`.

```jsx
<ResultCard title="The Clockmaker’s Study" status="Escaped" stats={[{label:'Time',value:'55 min'},{label:'Par',value:'30 min'}]} actions={[{label:'Share result',icon:'share'},{label:'Back to the games',icon:'list'}]}/>
```

- It reads as one unit you could screenshot. Don't split the stats or the buttons out of it.
- Two to four stats. The story of the ending goes in the turn's text, not the card.
- The buttons are NavButtons: they go somewhere, they don't play.
