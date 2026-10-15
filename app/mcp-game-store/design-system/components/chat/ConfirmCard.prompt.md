ConfirmCard asks a final, one-way move back before it lands. Block type `confirm`.

```jsx
<ConfirmCard title="Confirm your accusation" question="Accuse **Sebastian Wyle** of the murder, with the **iron poker**, in the **dining room**?" facts={[{label:'Suspect',value:'Sebastian Wyle'}]} note="This is the one accusation today." confirm="Confirm accusation"/>
```

- Only for moves that can't be undone: an accusation, a final answer, spending the last try. Everyday moves go straight through.
- Confirm sends the move; Cancel sends nothing to the game and returns to play.
- Side by side, Cancel then Confirm. When the card is narrow (a phone) they stack with Confirm on top.
- Name the move in the Confirm label. Keep the note to what happens next.
