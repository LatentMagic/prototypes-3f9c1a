WordBoard shows a grid of word chips with solved groups banded at the top. Block type `wordboard`.

```jsx
<WordBoard solved={[{label:'Fruits',words:['LIME','DATE','FIG','PLUM']}]} picked={['HAMLET']} words={['SCRABBLE','HAMLET','MACBETH','CITY']}/>
```

- Pass only the chips still in play in `words`; solved words live in their band.
- Band colours are the cover colours in a fixed order, so the first group found is always amber. Set `tone` only to match a game's own order.
- Put the count line ("1 of 4 groups found, 4 mistakes left") in a StatRow or the turn's text, and the moves (Submit, Shuffle) in ChoiceButtons under it.
