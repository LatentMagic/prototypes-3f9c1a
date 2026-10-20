MenuRows is the games list in a chat, or any row-per-entry menu. Block type `menu`.

```jsx
<MenuRows search="Find a game" items={[{name:'Daily Word',line:'Six guesses to find today’s five-letter word.',art:GS_ART.word.svg,status:{label:'In progress',tone:'live'},action:{label:'Play',icon:'play'}}]}/>
```

- Art is the game's cover art at 40px. Never bigger.
- The action goes somewhere (Play, Review, Continue), so it is drawn as a NavButton.
- A field is allowed here and nowhere else. In a game, the player types in the chat.
