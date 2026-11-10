StepCard is one step of how something goes, as a card: a picture, a name, one line. Use it for a short run of steps that read in order, such as How it works' Playing. It is not a game: a game is shown only as GameCard, GamePick, GameTile or ListRow.

```jsx
<StepCards>
  <StepCard art={<img src="assets/how-it-works/step-1.svg" alt=""/>} title="Pick a game" line="Choose from your AI’s list, or ask by name."/>
  <StepCard art={<img src="assets/how-it-works/step-2.svg" alt=""/>} title="Play it in the chat" line="Tell your AI your move. The game plays it out."/>
  …
</StepCards>
```

- Always inside `StepCards`, an ordered list. It lays the cards out two by two in a row under 520px and four across from 520px, and never scrolls sideways. Don't put StepCards in a CardRow.
- The cards share three lines (picture, name, line), as GameCards do in a CardRow: each part starts level and every card is one height. Don't give a card its own row heights.
- The picture is 2:1 and never stretches. It is new still art in cover colours on a cover ground (indigo, wine or forest), with neighbouring cards on different grounds. No motion: the card is never pressable. Give an `img` an empty `alt` when the name and line say what it shows.
- Padding 12px, 16px from an 852px row. 12px between picture and name, 4px between name and line.
- Name: at most 20 characters, no lone last word at a 96px text column. Line: at most about 45 characters, and the lines of one set within about 10 characters of each other, since the longest sets every card's height.
- No chips, Pass mark, link or button on the card.
