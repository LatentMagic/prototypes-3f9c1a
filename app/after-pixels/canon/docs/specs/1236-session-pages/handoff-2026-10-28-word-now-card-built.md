---
date: '2026-10-28'
ticket: '1236'
topic: 'word-now-card-built'
status: 'in-progress'
type: 'build'
---

# Handoff: Daily Word's now card, built (v11 D2 at 56)

## Current focus

v11's D2 at 56px tiles, built into the main build on the owner's "Build it" (2026-10-28). Not checked by the owner in the main build yet.

## Decisions (owner, 2026-10-28)

- The now card's title is the edition, "#212", the way Escape's card names its room; the label stays TODAY.
- The result is Escape's plain coloured word (Solved, Failed); In progress is the store's neutral result.
- The picture: the guess the play ended on at 56px tiles, beside a trail of six small rows (a guess not used is a flat block, so the card stays the same height between plays). No sentence: the rows carry the count and the hint.
- On a card 600px wide or more, the head, the picture and the result share the top row. Narrower, it stacks.
- The trail's hint is a 10px square of 1px dots under the letter it gave.
- Fractions (5/6) stay banned, as ruled in an earlier playground.
- The owner likes the direction of the result statement carrying down to the now card.

## What changed

- `app/gs-word.jsx`: `WdNow`, hooked into `window.PzNow` for `word` once played (Escape's pattern). Canon's card stays while nothing is played.
- `index.html`: the now card's styles, after the session page's.
- Playgrounds: `playground/word-v10.html` (C1, C2) and `playground/word-v11.html` (Now, D1 to D3, Tiles) stay as the record.

## Open, not for now (owner)

- "See what's out for you to play" shows only once the play is finished, as canon. The owner calls the row an invariant; whether it shows during In progress is a main-build question, not raised further.
- The foot (Share, See every guess, Next word) needs work later.
- In progress shifts slightly against Average (likely its padding). Noted, not asked to change.

## Next

1. Owner checks Library → Daily Word in the main build, all four plays, desktop and phone.
2. Ask before a CHANGELOG entry.
