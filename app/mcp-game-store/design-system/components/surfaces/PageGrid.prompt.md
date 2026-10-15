PageGrid lays out a working page (a game's library page, an account page) as cards that sit side by side on desktop and stack on a phone. It's one proven answer to the page layout principles in `readme.md`, not a required shape: if a page's content wants a different arrangement, build that, as long as it follows the principles.

```jsx
<PageGrid>
  <Card title="This week">…</Card>            {/* main column, row 1 */}
  <Card title="Streak">…</Card>               {/* side column, row 1 */}
  <Card title="Achievements">…</Card>         {/* main column, row 2 */}
  <Card title="Your cases" action={<TextLink href="/cases">All cases</TextLink>}>
    <RowList>…</RowList>
  </Card>
</PageGrid>
```

- Write children in phone order. Desktop pairs them row by row, so put the two things that belong together next to each other in the source.
- Cards in one row stretch to the same height and start at the same top. Give both a title or neither, so headings line up.
- Every card uses the same padding. Don't pad one card differently from its neighbour.
- The most important card gets the wide column, not the whole page. Nothing runs full width by default; if a card truly needs the full row, put it outside the grid.
- The two columns switch on at 900px of the grid's own width (container query), not the window's.
