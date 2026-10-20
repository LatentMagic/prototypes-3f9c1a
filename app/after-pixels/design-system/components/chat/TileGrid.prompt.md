TileGrid draws letters in squares: a guess, a board, a code, any row of letter slots. Block type `tilegrid` in a ChatPicture AI turn.

```jsx
<TileGrid length={5} count={6} rows={[{letters:'CRANE',marks:'xxxxx'},{letters:'SLATE',marks:'hnxnx'}]}/>
{type:'tilegrid',length:5,rows:[{letters:'NURSE',marks:'xxxnn'}]}
```

- Marks: `h` right place (green), `n` in it but wrong place (amber), `x` not in it (flat tone, soft letter). No mark is a typed letter not yet judged; a space is an empty tile.
- It does not assume five letters or a word answer. A three-digit lock or a seven-letter anagram is the same part.
- A letter sits inside its square at half the tile's size. Never put letters beside tiles or draw tiles yourself.
- One row stands on its own; two or more are fenced as one unit. Pass `count` to show the tries still to come.
- The legacy `tiles` block (word + marks g/y/x) stays for the pictures already drawn. New pictures use `tilegrid`.
