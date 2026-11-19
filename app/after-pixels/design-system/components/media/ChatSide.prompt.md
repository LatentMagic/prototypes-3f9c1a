ChatSide is the game drawn beside a chat on a wide page, with its edition label. It uses the chat's own parts, so the board, the clues or the picture look the same here as in the chat.

```jsx
<ChatSide label="Delve #40" blocks={[{type:'picture',src:'assets/scene.svg',alt:'A hero on a ridge at dawn'}]}/>
<ChatSide label="Guess #33" blocks={[{type:'tilegrid',length:5,count:6,rows}]}/>
<ChatSide label="Accuse #112" blocks={[{type:'clues',groups}]}/>
```

- Put it in a box beside a ChatPicture (`fill`), and give that box a height. The two read as one stage.
- Show it only where there is room; on a phone the same parts sit in the chat's turns instead, so the chat does not repeat what the side shows.
- A tile row is 40px at most; clue cards are at most 360px wide; a picture is 2:1, at most 400px wide.
- Inert: nothing in it responds to a tap.
