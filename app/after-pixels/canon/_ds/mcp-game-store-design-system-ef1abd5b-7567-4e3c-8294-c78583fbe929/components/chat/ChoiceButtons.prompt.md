ChoiceButtons offers the next moves: what to examine, where to go, what to take. Block type `choices`, usually in a turn's `after` so it sits under the text.

```jsx
<ChoiceButtons items={['Search the desk','Lift the rug','Try the safe','Read the note']}/>
{type:'choices',items:['Search the desk','Lift the rug'],picked:'Search the desk'}
```

- Every button sends the move it names, in the player's words. Never a button that sends a question the player didn't ask, and never one that goes somewhere: that is NavButtons.
- They stack as full-width rows, one per line, so a long move never wraps the set into a ragged block. No icons: an icon means NavButtons.
- Two to five moves. Short verbs first ("Search the desk"), no full stops.
- On an earlier turn, set `picked` so the reader sees which move led to the next turn.
