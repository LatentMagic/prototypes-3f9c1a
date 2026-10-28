ListRow is one thing in a list of things that each open: plays, editions, games, saves. A clickable Card is for one thing that stands alone; a ListRow is for many of the same kind. The lines of one play's record (a session page's "Every roll", "Every guess") open nothing: they are MoveRows, which share ListRow's look.

```jsx
<RowList label="Today">
  <ListRow onClick={open} lead={<Cover game="escape"/>} title="The Locked Study" game="Escape" result={['Escaped in 5 moves', '5 moves']} tone="ok" when="19:30" replay/>
  <ListRow onClick={open} lead={<Cover game="groups"/>} title="#88" game="Daily Groups" result={['All 4 groups, 1 mistake', '1 mistake']} tone="ok" when="09:16"/>
</RowList>

<RowList label="Every case">
  <ListRow onClick={open} title="The Night Train to Fort William" result="Played" when="28 Sep"/>
</RowList>
```

**One shape.** A row with a result, when or Replay is two 20px lines at every width, 62px: title over result; when on the right, centred, or on line one over Replay. A row with nothing on line two centres its title. No columns on wide screens: the same row, with a longer first line. Every row in a list is the same height.

**No Tag on a result row.** A row with a result, when or Replay takes no `end`; the row drops it and warns. Whether an edition is the newest is its place in the list.

**Three voices.** The title (what was played) is ink, 600. The result (how it went) is ink, 400; its tone colours only the icon. The game's name is the only quiet text. When is quiet; Replay is ink, 600.

**The row fits its own text.** Pass the parts; never a finished string.
- Title: the edition as the product names it, without the game: its number ("#212"), its name ("The Locked Study"), or both where the game goes by number and its editions also have names ("#14 · The Name"). The row only takes the game's name out; it never drops a number or a name the product writes. The game's name goes in `game`, and only in a list that mixes games, beside a cover; without a cover the row drops it. A list of one game never says the game. A game with no edition is its own title, in ink.
- Too long: the game's name goes first, whole. Then the title is cut, never after a space or a dot. Titles never wrap.
- Result and when take their forms, longest first: `['All 4 groups, no mistakes', 'No mistakes']`, `['6 Oct, 12:40', '6 Oct']`. From 440px of row width the row shows the longest that fits; under 440 every result and when shows its last form, so a phone list reads the same down the rows. Write the short form as the score alone ("5 moves", "3 of 6"); the icon carries the verdict. A result short enough already ("Solved", "Missed", "Played") needs one form.
- When takes forms where a longer one adds a fact: a list with no day headings passes the date with its time ("6 Oct, 12:40", then "6 Oct").
- When is at most 8rem. Under a day heading it is the time alone ("23:59"): the heading already says "Yesterday". A short form never drops a fact the list needs: a replay listed under its edition keeps its date ("6 Oct, 12:40").
- Replay is `replay`: on or off. The row writes the word.
- The row warns in the console, once, when a form still doesn't fit, a game is passed without a cover, or `note` carries text other than Replay.

**What goes in a row.** Put a fact in the row only if a player scanning the list would use it to pick a row; everything else goes on the page the row opens. When two facts compete, keep the one that differs from row to row.
- Result in full as the first form ("Solved in 3 of 6", not "Solved"). A missed edition keeps its name and says "Not played". In a list of every edition, "Played" marks a finished one; nothing marks the rest.
- Free text that isn't a result (a save's details) goes in `meta`, which wraps as one line.

**A library of games** (one row per game the player can open) answers one question on every row: is there something for me to play now? The result says so, in the game's own words: "Today's word is ready" (short form "Ready"), "In progress", "Done today" ("Done"), "Done this week" ("Done"), "Free case done", "Pass only". Finished states take `tone="ok"`; ready, in progress and Pass only take no tone. When is the last-played date ("Today", "10 Oct"); a game never played leaves when empty. No genre, streak or other facts in the row. Lead is the game's cover and the title is the game's name, with no `game`.

**Plays of one thing** sit under it as `sub` rows: one line, indented to the title, no separator above.

**An edition's record page** lists its replays under a "Replays" heading as `sub` rows, each opening that play: after the result, before the detail. Only on the first play's record, not on a replay's own page. Show only plays the player can see.

**How many to show** depends on the place: beside a neighbouring card, as many as match its height (every row is 62px, so count, don't measure); on a phone, a few and a link to the rest. A list that grows without end gets its own page with search, order, a filter and numbered pages, not "Show more".

**Behaviour.** The whole row is one target; no inline actions, they belong on the page it opens. The chevron at rest says "opens". Hover (mouse only): fill lifts one step, chevron turns full text colour and nudges right. Press: deeper fill. Focus: 2px off-white ring inside the row. Inside a Card the list bleeds to the card's edges. The accessible name is written from the full forms, so text hidden to fit is still read.

**Wide screens.** Give a long list a measure (about 760px) rather than running it the full page. A short row on a wide list leaves space between title and when; that is expected.

**Edge cases.** The "ListRow edge cases" card renders the rows that broke earlier rows at 320, 440 and 1024. A change to ListRow passes it before it ships.
