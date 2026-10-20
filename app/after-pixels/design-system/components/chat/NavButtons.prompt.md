NavButtons take the player somewhere: Show games, Back to games, Play again, Open in browser. Block type `nav`, usually in a turn's `after`.

```jsx
<NavButtons items={[{label:'Back to games',icon:'back'},{label:'Open games.harnessintent.com',out:true}]}/>
```

- Never a game move. If it plays, it is ChoiceButtons.
- A button that leaves the chat is `out`: it shows the arrow and says where it opens.
- Always give an icon: it is what tells going somewhere from a move. The rows stack, one per line.
- Icons: `list` for the games list, `back` for going back, `play` for playing again, `share` for sharing.
