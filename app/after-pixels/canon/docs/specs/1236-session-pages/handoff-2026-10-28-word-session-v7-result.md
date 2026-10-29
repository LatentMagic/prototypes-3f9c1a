---
date: '2026-10-28'
ticket: '1236'
topic: 'word-session-result'
status: 'landed'
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

## Round 7, eight objects (owner, 2026-10-28)

He read them from the bottom. Cover: no, the art asset keeps coming back and makes no sense under the head's cover. Stamp on the board: no, it covers the solved word. Plaque: acceptable, but the double rule is a new theme. Ticket and ruler: no, they look like a football scorecard. Seal: strays from the game. Key: acceptable, but too much green, and a button with depth isn't an agreed surface. Receipt: it now looks even more like a football card; round 6's version was more interesting. "Getting somewhere, but not there yet."
- **Lesson: stay inside the language already set.** That is the game spec and what the session page already draws (tiles, the dashed hint tile, the card, the DS type). No new surfaces, depth, double rules or cover art, nothing over the board, little green, and nothing that looks like a sports scorecard.

## Round 6, eight concepts (owner, 2026-10-28)

- 1 Crossword: no, it repeats the tiles. 2 Headline: it repeats the chrome (the No.) and sets a sentence in title type, which is wrong. 3 Trophy: a floating duplicate of the row, though it would be acceptable if it were held as a special object. 4 Tally: a big no, it doesn't evoke the game. 5 Day crossed off: it signals nothing. 6 Quote: a big no. 8: broken.
- **7 Receipt: the most interesting.** It "felt like a game card". Use "Solved", not "Found".

## Landed in the main build (2026-10-28)

- `app/gs-word.jsx` and the Daily Word block in `index.html` now hold v6's board (square tiles, numbers, the dashed hint row) in one card, with D beside it: the store's Tag at heading size, centred on the board. It reads "Solved", "Failed" or "In progress". The head carries no result (`GS_SESSION_QUIET.word`). The old grey-ground board is gone.
- The hint misalignment is fixed: from 900px the number column is exactly 1ch, in the numbers' own font, on every row. The hint row's empty one had been narrower and pulled the hint left. The same fix is in `pg-wd7.jsx`.
- Reach it: States → "7. Session page: Daily Word, the hard play", or Library → Daily Word → Your plays → a play.
- Not done: the now card (open, below). The playground bar's other switches (Numbers, The 5, Failed says) were playground-only.

## Decided (owner, 2026-10-28)

- **The result statement is the store's status Tag**, scaled up beside the board, centred on the board's height (round 11, D): "Solved" in green, "Failed" in amber, "In progress" in the neutral fill.
- The left hug: beside something, the number column is only as wide as its digit.
- **The now card, still open.** Decide it when the library game page is built: either the chip, or plain coloured text as Escape uses ("Solved" in green). The owner leans towards Escape's way. It depends on what else carries over to the card, and on whether the card is thematic enough without the chip.

## Next session: start here

1. **Bug (owner, 2026-10-28): on a phone the hint is a full-size square tile**, not the half-height row. Likely cause: the phone rule in `index.html` (`@container gs (max-width: 639px) { .wd-hrow { height: max(48px, calc(var(--t) * .75)) } … }`) now reads `--t`, which moved from `.wd-board` to `.wd-card`. Check it against the v6 reference and fix it.
2. **Open: on a phone, does the result chip go above the board or below it?** For now it is above, centred, with 24px to the board. The owner leans towards the top but hasn't decided.
3. Landed since the D build: the chip is one tile high at every size (`--t` and `--g` are now set on `.wd-card`, shared by the board and the chip), and on a phone it is centred.
4. Check the landed page at phone and desktop widths, on all four plays.
5. Daily Word's now card on the library game page: the chip, or Escape's plain green text (the owner leans towards Escape's).

## Earlier "start here" (superseded)

- **Go wide.** Make a sheet of about eight rough concepts for Word's result statement. Each should be a different concept, not a layout of the same parts, and some should be deliberately too far. The owner reacts best to everything shown together on one sheet.
- Starting points from Word's world (not yet shown): the found word written in like a crossword answer; a dated daily stamp, like a newspaper's; the last row lifting off as the trophy; on Failed, the word's outline with its one missing letter.
- Fixed: the tiles, the hint and the numbers. The 5 carries the signal better than "to spare".
- Round 5 (A Lockup, B In one line, C The row's own number) has had no reaction yet, beyond "not creative enough".
- Never again: "Solved" as the same heading every time, "/6", a six-slot bar, big blocks of green, words that aren't English ("5th", "5 Guess"), sentences per row, board and keys.

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
- This session's screenshots in `uploads/` were used and deleted. The older ones (05.37 to 06.26, and 27 Oct) were left alone.
