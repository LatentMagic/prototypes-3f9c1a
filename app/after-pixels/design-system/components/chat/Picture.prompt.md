Picture is an image in an AI turn: the scene a game shows. Block type `picture`.

```jsx
<Picture src="assets/scene.svg" alt="A hero in armour on a ridge at dawn, a burning tower behind"/>
{type:'picture',src:'assets/scene.svg',alt:'A hero in armour on a ridge at dawn'}
```

- It is a turn's block, so it scrolls with the turns, as the rest of the chat does. Put it in `blocks` (above the text), or alone in a turn that carries only the tool call and the picture.
- Full width of the turn, 96px tall, cropped to fit (a wide banner suits). Always give `alt`.
- Beside the chat, show it in ChatSide, where it draws 2:1.
