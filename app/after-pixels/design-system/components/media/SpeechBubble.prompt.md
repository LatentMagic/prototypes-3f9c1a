SpeechBubble draws the words a player types into their chat, inline in a sentence, as a sent message. Use it for every string the player is told to type, so all of them are drawn the same way.

```jsx
<p>In any chat, type{' '}<SpeechBubble>Play After Pixels</SpeechBubble></p>
```

- It is the one round shape on the shop's own surface. Round corners are the host chat's look (ChatPicture keeps its round bubbles), so the bubble reads as the chat, not as the shop. Corners 1em, with the bottom right 0.1em, and a small curved tail (about .3em, in the bubble's own fill, drawn in CSS so it follows hover) out at the bottom right: the tail of a sent message. Never fully round: a pill reads as a tag or a button.
- Off-white fill, page-colour text, Hanken at the size of the words around it, weight 500. Padding 0.15em above and below, 0.6em at the sides. It sits on the baseline and adds no height to its line.
- Join it to the word before it with a non-breaking space, so "type" and a short bubble never split. A short bubble never breaks; pass `wrap` for a long one: when it does not fit the rest of the line it moves to the next line whole, and breaks inside itself only when a line is too narrow for the whole bubble. It never leaves one of its words behind on the line before.
- It is static unless it is given `copy`. Static, it is not a control: no pointer, hover or press. Its lighter weight, round corners and tail keep it apart from the main Button, which shares its fill.
- Gap: the component sets a 4px margin before it, on the spacing scale, so it never sits tight against the word before it. The sentence still carries its own space.
- `copy` makes it a button that copies its words: the same shape, fill, weight and tail, with no mark added, so at rest it looks exactly like the static bubble and says it is clickable only by the pointer cursor and the hover. Touch has no hover, so use it only where the page says the typed line copies and a tap is not the only way to learn that. Hover (mouse only) takes the fill half a step toward the page colour, as the main Button does; press scales to .97 with the Button's press fill, held 120ms; focus is a 2px off-white outline. After a press the words swap to "Copied", at the words' own size and weight, for 2400ms, with the bubble keeping its width; no tick, no toast. Its touch target is 44px tall whatever the size of the text. Pass `onCopy` to copy through the host's own routine.
- Don't use bold quotes for typed words; use the bubble.
