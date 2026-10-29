---
date: '2026-10-28'
ticket: '1236'
topic: 'word-now-card-v10'
status: 'superseded'
type: 'exploration'
---

# Handoff: Daily Word's now card, v10 playground (three concepts)

## Current Focus

The owner has v10 open. It shows three ideas for Daily Word's now card (top left of Library → Daily Word). Waiting on two things: his reaction to the concepts, and confirmation that Tag vs plain word is a switch inside each concept. He answered "Yeah" to "one of the three, or a switch inside each?", which was read as "inside each". Nothing about the card is ratified.

## Task(s)

- Done: the brief, `brief-2026-10-28-word-now-card.md`, restated and confirmed. The owner's emphasis: each concept must be bespoke to Daily Word and still fit the card and the page.
- Done: `playground/word-v10.html` + `pg-wd10.jsx`, on v9's harness. It opens Library → Daily Word, Pass, on the hard play. A fixed bar at the top holds three groups:
  - **Concept A · The board:** the session board at 32px tiles, numbered rows, the hint row 24px high with "Hint" in the column after the dashed tile.
  - **Concept B · Six tries:** six equal slots, three to a row at every width. Each guess is a row of letterless blocks (up to 36px). Unused guesses are flat `var(--line)` blocks, so they never read as outlined misses. The hint is marked under the guess that came after it.
  - **Concept C · The word:** the guess the play ended on at 56px tiles (44 on a card under 480px), with a trail of 10px blocks for the earlier guesses beside it and one sentence under it.
  - **Result:** the session page's Tag at 40px, or Escape's plain coloured word (`es-vd`). In progress shows the store's neutral result in both.
  - **Play:** In progress, Average, Hard and Failed, the same as Config → This edition.
- In every concept the picture replaces canon's paragraph and progress bar, as on Escape's card. The frame stays canon's: label, title, result top right, Share, record link, next word, and "See what's out for you to play".
- A and C put the picture at the left, with the head at top right and the foot at bottom right, but only when the card itself is 640px or wider (the card is a container). Narrower, they stack: head, picture centred, foot.

## Critical References

- `CLAUDE.md` § Page rules, library game page: the four-card grid, cards level by arrangement, fewest and most items.
- `brief-2026-10-28-word-now-card.md`: scope in and out.
- `README.md` § Settled: the result holds the top right on every now card; the result statement carries down from the session page.

## Earlier handoffs

- `handoff-2026-10-28-word-session-v9-built.md`: the session card built, and v9's harness. Start there.
- `handoff-2026-10-28-word-session-v8-canvas.md`, `-v7-result.md`, `-v6.md`, `handoff-2026-10-28-word-asset-and-edition-picks.md`, `handoff-2026-10-27-word-session-into-app.md`.
- `handoff-2026-10-27-escape-library-card.md`, `handoff-2026-10-27-escape-into-app.md`: Escape's now card, the model.
- `handoff-2026-10-27-session-page-areas.md`, `handoff-2026-10-27-escape-session-playground.md`, `-pass-2.md`, `handoff-2026-10-27-escape-session-v3.md`, `-v4.md`, `-v5.md`, `handoff-2026-10-27-escape-lock-row-v2.md`.

## Recent changes

- New: `docs/specs/1236-session-pages/playground/word-v10.html` (bar and concept styles, special cases commented) and `pg-wd10.jsx`:
  - `Pg10Result`, `Pg10Board`, `Pg10Slots`, `Pg10Word`, `Pg10Now`.
  - It replaces `GS_LIBRARY.word` here only, with a copy of `cprPzLibrary` (`app/gs-pass-library.jsx`) that has `Pg10Now` in the now card's place.
- New: `brief-2026-10-28-word-now-card.md`.
- `playgrounds.json`: the v10 entry under 1236.
- Nothing in `app/` changed.

## Learnings

- The harness takes about 10 seconds to load in the preview, because it transforms every app file with Babel. An early check finds no bar and an empty `<html>` class. Wait before deciding it's broken.
- Lay A and C out by the card's width, not the window's. At a laptop's two-column page the now card is about 530px, too narrow for picture beside head.

## Open issues (not raised with the owner except the first)

- In A, the hard play's board makes the now card taller than the streak card at laptop width, so the grid stretches the streak card and leaves space at its foot. Told the owner.
- B shows unused guesses. The session page shows only the rows played (ratified for In progress). B's slots are its concept, but this differs from that rule. Flag it if he picks B.
- C's sentences are drafts: "You found it on guess 5 of 6, with the hint.", "That was your sixth and last guess.", "That's guess 2 of 6 so far."
- Not checked yet: phone (390), and 1280 × 900 with a card of 640px or more, on all four plays.

## Action Items & Next Steps

1. Get his answer on Tag vs plain word (switch inside each, or one concept).
2. Take his reaction to A, B and C. Change only what he names.
3. Check each concept at 390 and 1280 on all four plays, with the streak card beside it.
4. Once he picks, build into `app/` only when he says build.
