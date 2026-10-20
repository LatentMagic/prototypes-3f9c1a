---
date: '2026-10-15'
topic: 'chat-blocks'
status: 'complete'
type: 'implementation'
---

# Handoff: chat-blocks — parts a game draws in a chat

## Current Focus

Built. The owner's review of the sampler at phone and desktop width comes next. Nothing in the product has changed yet. Background only: the existing ChatPictures on product pages are untouched.

## Task(s)

The delta "MCP Game Store design system — parts a game draws in a chat" (owner's brief, with seven playtest images). Every item 1–11 is built as a component in `components/chat/`, and each one is also a `ChatPicture` block type.

## What was built and where

All the parts are in `components/chat/`. Each has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` and a kebab-case `.card.html`, and the cards are in the group "Components · Chat". The CSS is in `components/components.css` under "Chat parts", with an `mcp-cb-` prefix and `is-` states. The shared helper is `components/chat/chat-press.js`: `cbPress` renders a real button when the part is given a handler and an inert span otherwise, and `cbRich` turns `**bold**` in plain strings into bold text.

| Block `type` | Component | Key props |
|---|---|---|
| `tilegrid` | TileGrid | `rows:[{letters,marks}]`, `length`, `count`. Marks: `h` right place, `n` wrong place, `x` not in it; no mark = filled; space = empty |
| `wordboard` | WordBoard | `words`, `solved:[{label,words,tone?}]`, `picked`, `cols`, `onPick` |
| `choices` | ChoiceButtons | `items`, `picked`, `onChoose` |
| `confirm` | ConfirmCard | `title`, `question` (**bold**), `facts`, `note`, `confirm`, `cancel`, `answer`, `onConfirm`, `onCancel` |
| `stats` | StatRow | `items:[{label,value}]`, `grid` |
| `status` | StatusTag | `tone: live/won/lost/warn/idle`, `label` |
| `facts` | FactRows | `items:[{label,value}]`, `plain` |
| `entities` | EntityCards | `title`, `items:[{name,line,pic?,icon?,tone?,state?: out/picked}]`, `onPick` |
| `clues` | ClueCards | `groups:[{kind,facts:[string or {text,new}]}]`, `newLabel` |
| `result` | ResultCard | `title`, `status`, `line`, `stats`, `actions` (NavButtons items), `onGo` |
| `track` | Track | `items:[{label,value,max,tone: progress/threat/health,steps?}]` |
| `roll` | RollLine | `label`, `die`, `roll`, `mod`, `total`, `target`, `result: hit/weak/miss`, `outcome` |
| `nav` | NavButtons | `items:[{label,icon?,out?,note?,href?}]`, `stack`, `onGo` |
| `menu` | MenuRows | `items:[{name,line,art,icon,status,meta,action}]`, `search`, `onSearch`, `onGo` |

`ChatPicture` (`components/media/ChatPicture.jsx`, `.d.ts`) gained three additive things:
- A block whose `type` names a part renders that part with the rest of the block as its props.
- `ChatTurn.after`: blocks shown under the turn's text, for the moves and buttons at the foot of a turn.
- `height="auto"`: the picture grows to the whole conversation and doesn't scroll. It's for specimen pages only.

`Icon` gained `out`, `share` and `list`. The chat guidance in `components/media/ChatPicture.prompt.md` has a new "Chat parts" section that lists the set, with one line on when to use each. `readme.md` lists `components/chat/`.

How a session uses the parts: inside a `ChatPicture`, write a block (`{type:'tilegrid',rows:[…]}`) in `blocks` or `after`. Outside a picture, mount the component itself from the bundle namespace and pass handlers to make it live.

## Decisions on "Yours to decide"

- **Component, block, or both:** both. Each part is a component so it can be live (it takes handlers) and be used outside a chat. Each is also a block type so a turn stays plain JSON data, which is how the product already writes its chats (`app/gs-chats.jsx`). A block is just the component's props plus `type`, so there is one shape to learn.
- **Existing `tiles` block:** it stays as it is and does not wrap TileGrid. Its look (rounded 28px tiles in green and amber) appears in ratified product pictures that must render unchanged. Its guidance now says new pictures use `tilegrid`. Moving the product's Daily Word pictures to `tilegrid` would change how they look, so that is the owner's call.
- **Look:** the parts sit on the chat's light ground in this system's language: square corners, Hanken for text and Bricolage for titles. The host chat around them keeps its round bubbles and system type, so the game's parts stand apart from the host. Fenced parts have a panel fill and a 1px edge. The palette is ink and tone, plus status colours (StatusTag) and cover colours (word-board bands, entity initials).
- **Tile marks:** right place cover green, wrong place cover amber, not in it a flat tone with a soft letter, filled an ink edge, empty a light edge. Tiles are 32px with the letter at half the tile, and they shrink when a row wouldn’t fit (7 across fits in 300px). (Revised in the review pass below.)
- **Moves against going somewhere:** one button shape, full-width stacked rows. A move is its words alone; going somewhere leads with an icon. An `out` button adds an outward arrow and a second line, "Opens in your browser". (Revised in the review pass below.)
- **Size:** buttons are 34px tall with a 44px tap target. Text runs 12–17px. Entity pictures are 28px and menu art is 40px.
- **Group:** a new folder, `components/chat/`, shown in the card group "Components · Chat".

## Changes to the list

- Item 5 is split into **StatRow** and **StatusTag**.
- Item 9 is split into **Track** and **RollLine**.
- Item 10 is split into **NavButtons** and **MenuRows**.
- **FactRows** is new: labelled facts such as level or pack. It replaces the `mono` "Label  value" boxes the adventure pictures use today, and ConfirmCard uses it for Suspect, Weapon and Room.
- StatusTag is separate from `Tag` because Tag is drawn for the dark shop surface, and its in-progress and not-started looks don't work on the light chat.

## Acceptance check

- Items 1–10 render inside ChatPicture AI turns. Every card shows its part at 300px and 440px. The sampler shows them at 340px and 680px.
- I measured the layout at 300px: nothing scrolls sideways. One `dl` margin was leaving dead space above and below StatRow and FactRows; the root `.mcp-cb` rule now sets margin 0.
- TileGrid shows 3, 5 and 7 across in every state on its card.
- Every part has a card, a `.d.ts` and a `.prompt.md`, and the chat guidance lists the set.
- `docs/specs/chat-blocks/sampler/sampler.html` is one chat that uses every part. It is listed in `playgrounds.json`.
- The existing chat pictures are unchanged: the legacy blocks and the default props render as before, and every addition is opt-in.

## Review pass (same day)

The owner's review asked for more elegance, plainer buttons and nothing brittle. Changed:
- **Buttons:** ChoiceButtons and NavButtons are now one shape, full-width rows stacked one per line, 42px tall with a 1px edge on the panel fill. The inline wrap left ragged rows ("Deselect all" alone on a line). A move is its words alone; going somewhere leads with an icon. This replaces "ink edge against tone fill". ResultCard's Share and Back are the same rows. MenuRows' action is a compact outlined button.
- **ConfirmCard:** more padding, the facts between two hairlines, and the buttons stack with Confirm on top when the card is narrow, so "Confirm accusation" no longer wraps inside its button on a phone.
- **ClueCards:** one card per kind with its name inside in sentence case, and the facts as plain lines with no rules between them. The New mark is a tone label, not a black block. Kind labels everywhere are sentence case, not small capitals.
- **Tile marks:** right place is cover green and wrong place is cover amber, the colours players already read. The ink-only marks (an ink bar under the letter) read as half-drawn letters. Not in it stays a flat tone.
- **EntityCards:** no initials by default. They read as stray letters and said nothing the name didn't. A picture shows only for `pic` or `icon`.
- **Track:** the count sits next to its steps instead of at the far edge of a wide turn.

## Learnings

- `_ds_bundle.js` is only rebuilt at the end of a turn. While building, `docs/specs/chat-blocks/studies/dev-preview.html?card=<slug>[,<slug>]` (or `?card=sampler`) renders straight from the component sources.
- CSS subgrid inside these grids hung the screenshot tool, so FactRows uses `display:contents` rows and Track uses fixed label columns.
- The screenshot tool sometimes wraps button labels that are on one line in a real browser. Measure `offsetHeight` before you "fix" a wrap.

## Artifacts

- `components/chat/*` (14 components, 14 cards, `chat-press.js`)
- `components/components.css`, plus edits to `components/media/ChatPicture.{jsx,d.ts,prompt.md}` and `components/media/Icon.{jsx,d.ts}`
- `readme.md`, `playgrounds.json`
- `docs/specs/chat-blocks/{README.md, sampler/, studies/}`

## Action Items & Next Steps

1. The owner reviews the sampler on a phone. The main things to judge are the stacked button rows and the tile colours.
2. The product agent swaps the `list` and `mono` blocks in `app/gs-chats.jsx` for parts where they fit: `facts` for the Barrow pack, `roll` and `track` for Delve and 36,000 Summers Ago, `stats` for the Casebook turn count. This changes what those pictures look like, so it needs the owner's agreement first.
3. If the owner wants it, move Daily Word's `tiles` to `tilegrid`.
4. Possible later parts: a map or room grid (Escape and Delve still use `mono` for maps), and a timer.

## Other Notes

The sample copy in the cards and the sampler comes from `app/gs-chats.jsx`, `app/gs-data.jsx` and the playtest images. Some example numbers (the 3-digit lock, the seven-letter row, the missed roll) were added so every state appears. Treat them as specimen content.
