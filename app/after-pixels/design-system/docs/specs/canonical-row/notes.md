# Canonical row: research notes (2026-10-14)

## Where rows are used today (product `app/`)
- History (`gs-history.jsx`): cover, edLabel title ("Daily Word #212", "Escape · The Locked Study"), result, time, Replay; one RowList per day.
- Plays card on a game page (`LbRecent`): edName title, result, date, Replay; fitted to the achievements card's height.
- Every <edition> (`gs-editions.jsx`): "#44 · The Night Train to Fort William" or "#212", date, "Played".
- Library (`gs-discover.jsx`): cover, game name, what's waiting, last played.
- Replays on an edition's record: `sub` rows.

## Why rows drift (shipped ListRow)
1. When centres across both lines on a row without a note, so Replay rows and plain rows sit differently.
2. A sentence title wraps beside the date; the number-only lists never do, so two lists of the same kind look unlike.
3. From 640px the columns are fixed (240, 112, 80, 72): long results squeeze, unused columns stay reserved.
4. Two row modes (slots vs meta) with different shapes.
5. Separate RowLists per day only align because every width is fixed.

## Playground
`playground/canonical-row.html`: ideas 0 to 10, one row markup, five surfaces, four list widths, a worst-case seed.

## Audit (2026-10-14, second pass)
- 10's narrow rung (under 420px) inherits 1's wrapping run of facts. At 320 the time or Replay lands alone on a third line, and in Every case the date moves sideways depending on "Played". This is the "Replay rows look wonky" problem, but the readout said it held. Readouts for 1, 3 and 10 are now "Partly". **10b** fixes it by pinning the slots: result left and time right on line two, Replay under the time.
- 10's top rung puts the spare width between title and result (about 400px at 960). **10c** moves it between result and time.
- 5 · Eyebrow at 320: the gutter leaves the headline about 80px, so its title readout is now "Partly".
- The title separator (" ·") was generated content behind `:has()`. It's now real text (`.cr-sep`), so copy, selection and intrinsic sizing all include it.
- Screenshots (DOM re-render) can show ledger titles wrapping and spilling into the next row. That's a capture artifact: in the browser the title measures one line. Check the ledger in a real browser, not a capture.
- Playground: frames wider than the pane are scaled to fit (the caption says "shown at N%"), and 768 was added as an optional width to show the ledger near its 720 threshold.
- Product copy, for the owner: Library rows say "Done today · Today" (result and when repeat). That comes from `gsLibRow`, not the row design.

## Owner review of 10c (2026-10-15)
- History at 320 and 390 is the worst surface. Rows get very tall, and neighbouring rows have different heights.
- Rows don't line up with each other. Some fill line one, others fill line two. On some rows the result doesn't appear, and the time isn't vertically centred.
- Copy should adapt to the width: the narrow rung should be allowed a shorter result ("6 moves" in place of "Escaped in 6 moves") so a long result can't push the time and Replay around.
- 640 and 768 look good. The wide reorder in 10c makes less difference than hoped.
- Owner is reviewing History on phones across every idea. 9 also looks bad at 390. The likely conclusion is that phones need a new build, not a tweak to an existing idea.
- Open question: is 320 a hard floor, or do we design for 390 and accept a weaker 320? Most current phones are 375–430 wide. 320 covers only the iPhone SE (1st gen) and some small Androids and zoomed views.
- 8 · Nested: helps a lot on phones, but rejected for History. History must stay a flat list in time order, and grouping replays under a game confuses the timeline. Worth keeping: a replay row could have its own look, as a state of the canonical row, not a nested child.
- 7 · Truncate: can't hold the content. The "…" is good, but adaptive copy has more to give.
- None of 0–10 works for History at 320. Today's shipped row is close at 390, with plenty of room left. 768 is broken (the ledger threshold), which is a useful finding.
- Art: the cover rules (how art is drawn and sized) have to be part of this. When rows grow tall, the art looks wrong next to them at larger sizes.
- Next phase: open redesign across every context and surface, not only History. Same tenets as before: some rows have titles and some have numbers, and every surface has dense content. Nothing outside History has been rejected yet, but none of it has been reviewed either.
- Questions the redesign must answer:
  - What information does each surface fundamentally have to communicate?
  - What can be shortened, removed or replaced at each width?
  - How does state (played, replay, in progress, failed) change the row, and can state replace text?
  - What else beyond width (art, density, list context) should adapt?
- Next: tackle History on phones first.

## Round 2 (2026-10-15)
- Audit in `audit-row-content.md`. Main finding: at 320 a mixed-game title can't fit on one line beside a cover and the time (about 102px is left). The choice is to wrap, cut, or drop the game name.
- `playground/canonical-row-2.html`: 11 Clip, 12 Cover names the game, 13 Replay on the result line, 14 One line, 15 Fit by width (12 + 13 with short forms). All of them use fixed row heights, the Cover edge rule for art, and fixed columns from 640. Goals are one fixed row height, the same slots on every row, and a short form of the result for narrow widths.
- Owner rule (2026-10-15), fundamental to the canonical row: on a two-line row, the trailing column centres vertically when it holds one item (time alone). With two items (time and Replay) each sits on its own line. 15 no longer runs line two under the time; 11 and 12 centre the time on rows without Replay.
- Proposed, not agreed: 320 only has to work (no overlap or horizontal scroll, Replay reachable). Rows should look right from 360.

## Round 3 (2026-10-15)
- Built before the owner reviewed round 2, on their request for three complete versions. Reflection: the owner's trailing-column rule fixes the slots (title top left, result bottom left, time top right, Replay under it, cover and chevron spanning). What remains open on a phone is arithmetic: 154px per line at 320, and cover (68), chevron (32), time column (52) and full words don't all fit. So each option spends one thing.
- `playground/canonical-row-3.html`: 16 Words give way (12 finished: edition-only title and short result under 440), 17 Chevron gives way (no chevron under 640, full words to 400), 18 Picture gives way (no cover under 440 where the title names the game; Library keeps it; full result to 360).
- New shared proposals to review: the title has two voices (game's name quiet, edition in ink; a toggle shows it in ink), and a page list keeps a 760px measure from 640 (ListRow's wide-screen rule). Wide layout is title · result · Replay · time, Replay in its own 4rem column next to the time, mirroring the phone.
- Owner review (2026-10-15): drawn to 16's cleanliness; believes the covers plus a filter carry enough signal for edition-only titles. Likes the fainter text in 18. Asked for 16 with a quiet result, so Replay pops; added as 19. Noted this is as much adaptive rules as a row. Default view now 19, 320 beside 390, key `pg_canonical-row-3_v2`.
- Owner review 2 (2026-10-15): likes 19 at 320; agreed rule: cut with "…" rather than grow the row. Fixes: the "…" no longer follows a space (titles are now measured and cut in JS, trailing space and "·" trimmed); a row with nothing on line two centres its title (`has-r` class), so Every word's unplayed rows no longer sit high; 16/19's title now says as much as fits (game · edition, then edition alone beside a cover, then cut) instead of a 440 rung. Flagged by owner, not fixed here: Casebook rows should carry a scenario or a number, not both (product data); Every word rows are bare because the seed only has a number (product question: what else a word row can show).
- Tried and dropped (2026-10-15): shortening the year under 440 (1 Dec ’25) saved 12px, not worth a rule. Dates keep their full year.
- Rule stated: a row on a game's own page (Every word, Every case, Plays card) does not repeat the game's name. Every word's bareness is content; the candidate is the answer word once played.
- Casebook seed fixed (owner): rows carry a scenario, not a number as well. Every word stays bare on purpose: the title rule (say as much as fits) has nothing more to say when the product gives a row only "#212"; open product question.
- Owner review 3 (2026-10-15): loves it to 640; at 768+ the fixed columns read as a wave and leave holes (Your rooms). Tried a subgrid (list-owned, content-sized columns) and a 920 measure; it broke the wide History (tall heading rows, list not filling the frame) and was rolled back at the owner's request. Wide layout is back to fixed columns and a 760 measure. Open: what to do at 768+.
- Reset: set `pg_canonical-row-3_v3` to `{opt:16,view:'surf',worst:false,widths:[320,360,390,768],surf:'history',w:390,voice:true}`.


## Round 4

Round 4 (`canonical-row-4.html`, `pg-row4-*`) is a copy of round 3. The owner asked that each new round duplicates the last so nothing is lost. Added 19B: 19 with the title flipped, the edition first in ink and the game's name after it, quiet. Because the game's name comes last, it is dropped whole before the edition is cut, on every row, not only rows with a cover. Storage key `pg_canonical-row-4_v1`.

Owner review of 19B: the edition first in white reads cleaner because the white lines up. Their problem is the wide layout (640+): fixed columns leave empty slots, so "Played" floats mid-row on Every case and there is a big gap when a row has no Replay. Groups look right on a phone and wrong on a long row. Added 19C (no fixed result column: result, Replay where there is one, and time pack against the right edge) and 19D (the phone's two lines at every width, no 640 columns).

Owner settled on 19E (19D with the result in ink; the game's name is the only quiet text). The wide-list space on short rows (Daily Word) is accepted; no narrower cap. "Played" stays in the result slot and "Replay" in the trailing slot: they never share a surface (Played: Every case, Every word; Replay: History, Your rooms) and answer different questions. The owner likes Library's "…is ready" and "Pass only" results as they are.

### Attack on 19E (playground build)

Seeded and worst-case data, every surface, 320 to 1024: 343 rows, all 62px, no overlaps, no result cut, no title wraps. Hostile rows injected into History:

- Game with no number or name rendered " · Escape". Fixed: the game's name becomes the title, in ink.
- A long time ("Yesterday, 23:59") takes its full width and squeezes the title to "Th…" at 320. Needs a rule: times have a short form with a set width.
- A result with no written short form gets one guessed by trimming words, and an unknown long result still cuts at 320. Needs a rule: every result is written with its short form.
- Replay is free text ("Replay 3" passed). Needs a rule: it is on or off.
- A list of one game still shows the game's name on every row unless the data leaves it out. Needs a rule.
- Held: no time, no result, Replay with no result, one unbroken 45-letter name, number-only editions.

### 19E hardened for approval

19E now enforces its rules in the row (listed in its detail panel): title from parts, game's name alone in ink when there's no edition, one-game lists drop the game's name, written short forms only (unknown results keep the full form and warn), a set time column (a longer time is cut and warns, never the title), Replay on or off. Worst case adds an Edge cases day to History and passes the game's name on every Every case row. Re-run: 385 rows, all 62px, no overlaps, no stray dots.

### Forms for responsive text

The row takes a result or time as its forms, longest first, and shows the longest that fits its slot. Under 440 a result goes straight to its last form, so a phone list reads the same down the rows. A plain string gets its written short form. "Yesterday" never needs shortening in History: the day header says it, so the time's last form is "23:59". The time column is a cap, not a set width, so short times don't take room from the result. Re-run: 385 rows, all 62px, no result or time cut at any width.
