NeedsPass stands where a game's play control would be when the player cannot play without the Pass. It takes the form "What stays, what returns": the left half is what the player keeps, the right half what the Pass brings back.

```jsx
// Had the Pass (lapsed)
<NeedsPass game="36,000 Summers Ago" word="day"
  record={{last:'2026-09-17', played:12, earned:6}} onGet={() => go('pass')}/>
// Never had the Pass
<NeedsPass game="36,000 Summers Ago" word="day" total={24} onGet={() => go('pass')}/>
```

- Pass facts, never copy. Every line is built by rule from what the platform holds, and no game supplies its own wording:
  - Left label: the edition word and the player's last session (`YOUR LAST DAY · 17 SEP`). A chapter game shows the chapter number in the date's place (`YOUR LAST CHAPTER · 3`). A game with no editions: `LAST PLAYED · 17 SEP`. Never-had: no label.
  - Left heading: lapsed "You stopped here. Everything you earned is still yours."; never-had "{game} comes only with the Pass." (the game's name).
  - Left foot (lapsed only): "You played {n} {edition words} and earned {k} achievements.", from the player's record. A clause whose count is 0 is dropped.
  - Right label: lapsed `WHAT COMES BACK`; never-had `WHAT YOU GET`.
  - Right first line, from the edition word: "Play every {edition word} as it comes out." A game with no editions: "Play the whole game."
  - Right second line: lapsed "Pick up where you stopped."; never-had "Earn {total} achievements." (the game's achievements total).
  - Button: a secondary `Button`, "Get the Pass again" or "Get the Pass". It goes to the Pass page.
- Never "frozen", never a line in the game's world, never a promise of earlier editions. No price, discount or checkout on the card.
- The card keeps its size and its grid place in every state. It never shrinks and never merges into a neighbour.
- Under 640px of screen the halves stack, left above right, and the button is full width (the system's one button width). Nothing to set.
