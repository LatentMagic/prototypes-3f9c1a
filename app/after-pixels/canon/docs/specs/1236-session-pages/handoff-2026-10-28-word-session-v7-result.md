---
date: '2026-10-28'
ticket: '1236'
topic: 'word-session-result'
status: 'in-progress'
type: 'exploration'
---

# Handoff: Daily Word's session page, the result (v6 playground, second session)

## Current Focus

Ideas for **what Daily Word's result is**: what it says, what form it takes and how it looks. The owner's ruling (2026-10-28, with a screenshot of the "Solved ✓ / In 5 of 6" block): "you have permission to ideate that. Think big picture." Every option so far kept that block and only moved it around or changed what sat beside it. He rejected all of them on that basis. **The message itself is the open design space.** Everything else (tiles, hint, numbers) is decided.

Two new ideas are built and waiting for his reaction (asked: "Is either of these the kind of thinking you mean?"):
1. **The word**: the result is the word as far as you got it, in large type over a rule for each letter, with the guess that put each letter in place under it (or "Hint"). Failed: SHA_E, the missing place a dashed rule. In progress: only the places found so far.
2. **Closing in**: one large figure per guess for the letters in place (0, 1, hint, 2, 4, 5). Failed shows the stall: 2, 4, 4, 4, 4, 4.
3. **Against six** is unchanged from earlier in the session. He called it the only one that kept his rules, but it still uses the same "Solved ✓" block.

## Owner's ruling on all three (2026-10-28, later)

All three are rejected. A full redesign is needed. The tiles, hint and numbers are agreed and stay.
- **Mandatory: the result statement.** An element of its own that states the outcome outright, like Escape's "Escaped" with its door. It is shared across games, themed per game, and carries down to the library game page. It needs its own ideation, and "not found in 6" as a quiet caption is not it. (Logged in `README.md` § Settled.)
- **What sits beside the tiles says something the tiles don't.** 1 and 2 only restated the board. 2 also couldn't be read.
- **No redundancy.** "In 6" is always 6. "6/6" with "All 6 guesses used" says it three times.
- **3:** the concept has something, but it's only a first sketch. "4/6" reads as a fraction, as if you did 4 out of 6. The track reads as a progress bar you failed to fill. "Not solved" could be amber (minor).
- **Shape:** tiles on the left and the content on the right would give the card a better shape. 1's use of space was acceptable.

## v7 (`playground/word-v7.html`, `pg-wd7.jsx`): two rounds, all rejected (owner, 2026-10-28)

v7 keeps v6's board. The numbers are always on (agreed; no switch).
- Round 1, all rejected: the row (share-card squares beside "Solved"; looked misaligned against the board), spelt in tiles (confusing; delete), the winning tile ("5 Guess" isn't English). Every one kept the same "Solved" heading: "the same Solved text every time".
- Round 2, all rejected: "Found in five" (plain text, "does nothing"), the badge (too much green, confusing next to the tiles), "5th" (not English).
- His closest was v6's Against six, which failed because "4/6" read as a fraction and the track as a progress bar left unfilled.
- What the misses share: plain text alone does nothing; a large block of status colour competes with the tiles; the words must read as plain English. Escape works because it has a mark (the door) that isn't the game's own data, with one plain word.

## Task(s)

- Done: wrote the rules that apply to every game into `README.md` § Settled and § Lessons for playgrounds. The owner ratified two of them as rules on 2026-10-28: the head doesn't show the result, and a card holds only real content.
- Done: Failed uses 6 guesses (owner, 2026-10-28; v6 handoff corrected).
- Done: the card ends at the tiles. Next to other content, the numbers' mirrored right gutter goes (KEEP comment in `pg-wd6.jsx`, `@container gs (min-width: 900px)` block). **Not ratified**: it changes how the agreed numbers are drawn. Asked, no answer yet.
- In progress: the result ideas (above).

## Critical References

- `README.md` (this folder): the rules that apply to every session page.
- `daily-word-spec-2026-10-28.md`: records, six tries, one hint, share format.
- `handoff-2026-10-28-word-session-v6.md`: what is agreed and must not be touched (tiles, hint, numbers).

## Earlier handoffs

- `handoff-2026-10-28-word-session-v6.md`: v6's agreed tiles, hint and numbers, and the first three card designs.
- `handoff-2026-10-28-word-asset-and-edition-picks.md`: the Daily Word cover, and Config → This edition.
- `handoff-2026-10-27-word-session-into-app.md`: the Word board shipped to `app/gs-word.jsx` (later rejected).
- `handoff-2026-10-27-session-page-areas.md`: the three areas of a session page, and the owner's brain dump.
- `handoff-2026-10-27-escape-session-playground.md`, `-pass-2.md`, `-v3.md`, `-v4.md`, `-v5.md`, `handoff-2026-10-27-escape-lock-row-v2.md`: Escape's session page rounds, including how the result was ideated there.
- `handoff-2026-10-27-escape-into-app.md`, `handoff-2026-10-27-escape-library-card.md`: Escape shipped into the app, and its now card.

## Recent changes

- `playground/pg-wd6.jsx:28-31`: the result model (`head`, `vd`, `spare`). "1 hint" removed from the result: the hint row already says it.
- `playground/pg-wd6.jsx:76-116`: `pgwPlaces`, `pgwStatus`, designs 1 (`PgwWord`) and 2 (`PgwRun`).
- `playground/pg-wd6.jsx:118-129`: design 3 (`PgwTally`).
- `playground/pg-wd6.jsx:203+`: from 900px the result sits beside the board, never above it.
- Bar: Design 1 to 3 (store key `d`).
- `README.md`: new lines in Settled and Lessons. `handoff-2026-10-28-word-session-v6.md`: the Failed line corrected.

## Learnings

- **Rejected; don't bring back:** a sentence per row ("1 in place, 2 in the word"; the owner has said more than once he hates it); board and keys (rejected before, and again); always drawing six rows ("I don't like the fixed length of 6"); the result stacked on top of the board (it makes the board long and narrow, a "snake"); the result moved to one side unchanged (dead space).
- The failure to avoid: rearranging the same "Solved ✓ / In N of 6" block and calling it new ideas. Rethink the message itself.
- Re-check `handoff-*` for what was already agreed or rejected before asking. This session asked the 5-vs-6 question again and rebuilt rejected ideas.

## Artifacts

- `docs/specs/1236-session-pages/playground/pg-wd6.jsx` (updated)
- `docs/specs/1236-session-pages/README.md` (updated)
- `docs/specs/1236-session-pages/handoff-2026-10-28-word-session-v6.md` (Failed line)

## Action Items & Next Steps

1. Get the owner's reaction to designs 1 and 2. If neither fits, ideate further on the message itself, not on where it sits.
2. Ask whether the numbers' right gutter stays dropped when something sits beside the board.
3. Where the result goes on a phone (open). For now it is above the board in all three.
4. The status wording "Found on guess 5" / "Not found in 6" is my own; not ratified.
5. Then carry the result to Daily Word's now card (Escape's pattern).

## Other Notes

- Not ratified: all result copy, the 900px breakpoint, and showing the word on the session page (design 1 shows only the letters that were placed; a failed play never reveals the missing letter).
- The owner is frustrated with how often agents repeat themselves. Keep replies short, ask one question at a time, and never re-ask what a handoff already settles.
- `uploads/Screenshot 2026-10-28 at 06.57.53.png`: the owner's screenshot of the block; used, and can be deleted at session end.
