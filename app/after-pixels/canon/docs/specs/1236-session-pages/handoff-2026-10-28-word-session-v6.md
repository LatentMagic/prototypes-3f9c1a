---
date: '2026-10-28'
ticket: '1236'
topic: 'word-session-v6'
status: 'superseded'
type: 'playground'
---

# Handoff: Daily Word's session page, v6

The owner rejected the built session page (2026-10-28) and gave the session-pages-2 option 1 board as the reference (screenshot 06.02.39): match it exactly, except that the grey ground wasn't centred on the board. Then: "I hate that massive grey background." Config waits until this is settled.

## Where

`docs/specs/1236-session-pages/playground/word-v6.html` (launcher: ticket 1236). It loads `index.html` live and adds `pg-wd6.jsx` before `app/main.jsx`. Nothing in `app/` changed. Bar: Design 1 to 3, Play (Solved, Hard, Failed, In progress). Storage key `pg_word-session_v6`.

## Agreed (owner, 2026-10-28, in words: "the numbers, the tiles, the hint, that's all agreed. Don't touch it")

As built in `pg-wd6.jsx` at the end of this session. Don't change any of it.
- **Tiles:** square; from 640px `clamp(56px, (100vh - 560px) / 5, 72px)`, gap 8px; on a phone from the column width up to 64px, gap 6px. Colours as ruled 2026-10-27.
- **Hint:** its own row, half a tile high (at least 40px), the hint tile exactly one tile wide in its letter's column, 1.5px dashed off-white edge, the letter at the left and "Hint" at the right. Padding, letter and label scale with the tile. Dotted marks across the rest of the row.
- **Numbers:** guess numbers in a left gutter, mirrored by an empty right gutter so the tiles stay centred (bar: Numbers On).
- The card is as wide as the board, centred. Every guess stays the shared full-width row.

## Owner's words, 2026-10-28 (not yet placed as a rule)

- "Just like Escape, it needs to feel like a card somehow, but it can only feel like a card if it encapsulates real space, not dead space." He suggested it may belong in the session page rule. Where it is written is his call.
- Wants variety across the options so he can judge them.
- Failed uses 6 guesses, as the spec says (`daily-word-spec-2026-10-28.md`: six tries; Just in Time is the sixth guess). An earlier "5 guesses" was superseded; owner confirmed 6 on 2026-10-28.
- Game spec saved as `daily-word-spec-2026-10-28.md`, at his request.

## The three designs (not ratified)

The tiles and hint row are the reference's (0.9 high, dashed hint with "Hint" beside the letter, dotted marks). There's no grey ground. Each card holds the result ("Solved", tick, "In 5 of 6"; a small five-square picture of the last guess, as Escape's door) and the board.
1. **Hugging card**: the card is as wide as the board, centred.
2. **Notes beside rows**: full-width card, each row numbered, with the record's words beside it ("1 in place, 2 in the word"; the hint's "Letter 1 is F.").
3. **Board and keys**: board left; result and the keyboard as the game left it on the right.

## Calls I made (not ratified)

- Head: "Daily Word" over "No. 210", with no result (as Escape's).
- Result copy: "Solved / In 5 of 6", "Not solved / All 6 guesses used", "In progress / 4 guesses left".
- Tiles sized from the window's height from 640px (40 to 64px high), so Hard fits under the head on a laptop.
