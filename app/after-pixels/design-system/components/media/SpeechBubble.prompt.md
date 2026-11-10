SpeechBubble draws the words a player types into their chat, inline in a sentence, as a sent message. Use it for every string the player is told to type, so all of them are drawn the same way.

```jsx
<p>In any chat, type{' '}<SpeechBubble>Play After Pixels</SpeechBubble></p>
```

- It is the one round shape on the shop's own surface. Round corners are the host chat's look (ChatPicture keeps its round bubbles), so the bubble reads as the chat, not as the shop. Corners 1em, with the bottom right 0.2em: the tail of a sent message. Never fully round: a pill reads as a tag or a button.
- Off-white fill, page-colour text, Hanken at the size of the words around it, weight 500. Padding 0.15em above and below, 0.6em at the sides. It sits on the baseline and adds no height to its line.
- Join it to the word before it with a non-breaking space, so "type" and a short bubble never split. A short bubble never breaks; pass `wrap` for a long one: when it does not fit the rest of the line it moves to the next line whole, and breaks inside itself only when a line is too narrow for the whole bubble. It never leaves one of its words behind on the line before.
- It is not a control: no pointer, hover or press. Its lighter weight, round corners and tail keep it apart from the main Button, which shares its fill. Don't put a copy button inside it.
- Don't use bold quotes for typed words; use the bubble.
