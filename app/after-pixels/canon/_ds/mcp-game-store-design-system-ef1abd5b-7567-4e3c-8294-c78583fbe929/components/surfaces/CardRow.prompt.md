CardRow is a section heading with a sideways-scrolling row of cards under it; use it for a short set of games.

```jsx
<CardRow title="Free to play" sub="Casebook’s first case and Delve’s first scene are free.">
  <GameCard …/><GameCard …/><GameCard …/>
</CardRow>
```

- Pass the heading as `title` and any sentence as `sub`. Don't build your own heading block and pass it in: the arrows only stay on the heading line when CardRow lays the line out itself.
- Previous and Next appear on their own when the row overflows. Don't add a "See all" in their place; put it after the row as a TextLink. A row of games always ends with an "All games" TextLink to the store, under the row, or under the Coming soon cards if they follow it.
- A row of chat pictures is `CardRow kind="chat"` (see ChatPicture). A row of GameTiles is `CardRow kind="tiles"`: each tile is the wall's size at every width, about 2½ on a phone. Game cards are always `GameCard`s. The row lines up their picture, text and chips across every card; your own card markup won't line up. See GameCard.
- Any control that belongs to a heading sits on the heading's line, centred on its first line; the sentence goes under both.

## In the Game Store today

A note on the product as it stands, not a rule. It may be out of date; the product is the source.

- CardRows of games: Available games, Just added, Free to play, More games.
