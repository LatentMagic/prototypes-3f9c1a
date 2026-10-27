ChatPicture shows a game being played in a plain chat window; use it on a game's product page for "How it looks in your chat", in place of a screenshot of another company's app.

```jsx
<ChatPicture mark="assets/logo.svg" toolBy="After Pixels" turns={[
  {from:'user',text:'I want to play Daily Word.'},
  {from:'ai',tool:'daily-word',text:'Six tries to find the hidden five-letter word. What’s your first guess?'},
  {from:'user',text:'amaze'},
  {from:'ai',tool:'daily-word',blocks:[{type:'tiles',rows:[{word:'AMAZE',marks:'xxxxx'}]}],text:'No hits. 5 guesses left.'},
]}/>
```

- The chat has no logo or store name in its header. The branding is the tool-call card (`mark`, `toolBy`). Leave `title` off on product pages.
- `blocks` is what a game returns, shown above the turn's text; `after` holds blocks shown under it (the moves and buttons at the foot of a turn). `tiles`, `list` and `mono` are the original three. Every other block is a chat part (below). Reach for a part before a `list` or `mono`, and add a part to `components/chat/` before drawing a one-off.
- Keep it short: the default 290px body, about 360px wide. Pass the whole conversation, latest turn last.
- Two or more pictures sit in `<CardRow kind="chat">`, each wrapped in a `<figure className="mcp-chatfig">` with its caption as a `<figcaption>` under the picture. The row shares the width when they fit (300-380px each) and scrolls sideways with Previous and Next when they don't, at any width. Never switch it at a screen-width breakpoint or build your own row.

```jsx
<CardRow kind="chat" title="How it looks in your chat">
  {chats.map(c=><figure key={c.cap} className="mcp-chatfig"><ChatPicture turns={c.turns} mark={mark} toolBy="After Pixels"/><figcaption>{c.cap}</figcaption></figure>)}
</CardRow>
```
- It scrolls. It opens on the latest turn and the reader can scroll up to every earlier one; a longer conversation scrolls, it never makes the picture taller. Once scrolled up, the top edge fades and a small arrow-only pill appears at the top centre (28px tall, 12px down, tap target 44px); pressing it scrolls back to the first turn. Its spoken name is "Back to the start" (`more`). Don't build your own scroll or pill around it.
- `fill` stretches it to the box it sits in (e.g. a hero field) instead of the 290px height; give that box a height.
- One colour only: the off-white ground, var(--off-white) (#EDE8DF), with the warm grey send button (var(--control-edge), white arrow). Never dark.
- To show the chat being played rather than finished, use `ChatPlayback` with the same turns (see `playback/ChatPlayback.prompt.md`).
- `height="auto"` grows the picture to the whole conversation with no scroll. Only for specimen pages and previews; product pages keep the scrolling picture.

## Chat parts

What a game draws inside an AI turn. Each is a component in `components/chat/` and a block type here (the block is the part's props plus `type`). Inside a picture they are inert; given a handler, the same components are live. They draw in this system's language (square corners, Hanken and Bricolage, ink and tone on the chat's light ground) while the chat around them keeps its round bubbles, so the game's parts stand apart from the host. All are compact, sized to the chat's text, and fit 300px with no sideways scroll.

- `tilegrid` · TileGrid: letters in squares, a row or a grid of any length (guesses, codes, letter slots).
- `wordboard` · WordBoard: word chips to pick from, solved groups banded.
- `choices` · ChoiceButtons: the moves at the foot of a turn (put it in `after`). Each sends the move it names.
- `confirm` · ConfirmCard: a one-way move asked back, Cancel and Confirm.
- `stats` · StatRow: two to four small counters.
- `status` · StatusTag: one game status word.
- `facts` · FactRows: labelled facts (level, pack), in place of a `mono` box.
- `entities` · EntityCards: suspects, items, rooms, characters, each a name and one line.
- `clues` · ClueCards: what the player knows, grouped by kind, this turn's facts marked New. Never a flat list.
- `result` · ResultCard: how a game ended, one fenced unit with Share and Back.
- `track` · Track: progress, threat or health as steps or a bar.
- `roll` · RollLine: one roll, the number needed and the outcome.
- `nav` · NavButtons: buttons that go somewhere (Show games, Back, Play again, Open in browser), drawn apart from moves. One that leaves the chat says so.
- `menu` · MenuRows: one row per game with its art, line, status and action. The only part that may hold a text field.

Moves and going somewhere share one button shape: full-width rows, stacked. A move is its words alone (ChoiceButtons, ConfirmCard); going somewhere leads with an icon (NavButtons, MenuRows, ResultCard). Keep that split: a player must tell “do this in the game” from “go somewhere”.
