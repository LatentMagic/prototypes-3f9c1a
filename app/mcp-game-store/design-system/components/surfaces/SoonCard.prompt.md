SoonCard is the Coming soon card: a game that is not out yet, or the next chapter of a game that is. They come in a pair under a row of games (Home's Available games, a game page's More games), before the "All games" link.

```jsx
<div className="your-pair">{/* two columns from 720px, one below */}
  <SoonCard art={<Cover fill ground="indigo" extend="centre">{derelictSvg}</Cover>}
    title="Derelict" line="The same game, in science fiction"/>
  <SoonCard art={<Cover fill ground="wine" extend="bottom">{barrowSvg}</Cover>}
    label="CHAPTER 2" title="The Barrow of Hollowmere" line="A short campaign with levels and loot"
    play="Play chapter 1" onPlay={() => go('barrow')}/>
</div>
```

- Every SoonCard carries the Coming soon chip; it is what makes the pair read as a set. Never replace it, reword it or move the news into the label instead.
- A whole game: name, line, Coming soon. No label, no other chip, no way in.
- A chapter of a game that is out: the label names the chapter ("CHAPTER 2"), the line is the game's own blurb, and `play` adds one pressable chip ("Play chapter 1") after Coming soon, on the same row. That chip is the card's only way in. Don't write "Chapter 1 is out now" or any line about what is out; the chip says it.
- The card itself is never a link, and the name is plain text, also on a chapter: the card is about what is coming, and a pressable card would suggest the coming thing can be opened.
- No Pass tag and no Free tag on a SoonCard. What the game needs is said on its page.
- The cover is always `Cover fill` with the asset's ground and extend, so it grows to the card's height without stretching or cropping (game-art-motion.md "Extending a cover"). The pair shares one height, so both covers extend together. A cover has no motion here: the card is not pressable (game-art-motion.md "When art moves").
- The chips share one row: Coming soon first, then the play chip. They wrap only when the row is too narrow (a phone), and then the play chip goes under Coming soon.
- Label, name and line run from the top; the chips sit on the card's bottom edge. The pair shares one height, so both cards' chips are on one line whatever the text above them. Decided 2026-10-15 (docs/specs/card-chip-alignment/). Don't centre the text block: the chips then follow the text and land at different heights.
