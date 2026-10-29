MoveRow is one line of a play's record: the list at the end of every session page ("Every roll", "Every guess", "Every move"), read top to bottom. It takes ListRow as its model and opens nothing. For a list of things that each open, use ListRow.

```jsx
<Disclosure title="Every guess">
  <MoveList label="Every guess">
    <MoveRow label="Guess 1" parts={['CRANE', '1 in place, 1 elsewhere']}/>
    <MoveRow label="Hint" parts={['Letter 3 is O.']}/>
  </MoveList>
</Disclosure>
```

**What a game sends.** Each line is a label and its parts, as plain strings, in the order played. Nothing else: no type, tone, group, icon or time. The list's title is the game's. A game writes each line once: there are no short forms.

**One shape.** Two lines at every width. Line one is the label, ink, 600, 16/20. Line two is the parts, 14/20: the first in ink, the rest muted. No columns on wide screens.

**Line two wraps.** Parts sit side by side, 12px apart, while they fit. A part that doesn't fit starts a new line, and a long part wraps within itself at spaces, never mid-word. So rows in this list differ in height; a row whose parts fit on one line is 62px, like a ListRow.

**ListRow's look.** The same padding (10px 16px), type and line between rows, at every width. Inside a Card or a Disclosure the list runs to the edges.

**It opens nothing.** No chevron, no hover, no press, no focus stop. Never put a button or link in a row.

**On the session page** the list is a Disclosure titled with the list's title, closed, below the game's own section. It matches the width of the section above it, at every width.

**How a long list is cut short** is not settled: ListRow's guidance asks for numbered pages, the product spec for "Show more".

**Edge cases.** The "MoveRow edge cases" card renders the hardest lines at 320, 440 and 1024. A change to MoveRow passes it before it ships.
