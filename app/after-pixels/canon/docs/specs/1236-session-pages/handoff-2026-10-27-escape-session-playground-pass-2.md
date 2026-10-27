# Handoff, 2026-10-27: Escape's session page playground, pass 2

Builds on `handoff-2026-10-27-escape-session-playground.md`. Same rig: `docs/specs/1236-session-pages/playground/index.html`, bar → Go to → Session page. Bar → Why now also gives each option's spoiler call and how its moments link.

## The streak card and Escape's history

**Where it stands:** the streak card is the main build's, design and layout untouched, including the empty space at its foot. The playground's two earlier changes to it are gone: the 900px layout block in `index.html`, and the sample weeks fed to the card alone (`PGE_SAMPLE_PAST` and the `LbRun` wrapper). The streak, Achievements and Your rooms cards are out of scope for this ticket (owner, 2026-10-27; see `README.md` § Scope).

**Escape's history (owner, 2026-10-27):** the owner asked for a history of at least five, held in the seed so every surface reads the same one. `pg-es-seed.jsx` loads straight after `app/gs-puzzles-library.jsx`, before `app/gs-history.jsx`. It gives `PZ.escape` nine earlier rooms, seven of them played, each with its own session page. The streak card, Your rooms, History and Achievements all read them from there, and nothing else in the playground adds weeks. The streak reads 6 when this week is played and 5 while it is in progress. Achievements now shows 2 of 5 earned. The room names, times and moves are invented. Checked in the owner's preview on Library → Escape.

**Lesson:** a fact goes into the seed once and every surface reads it. Never feed one card its own copy.

**Known side effects, not fixed:**
- This week's room is now the tenth, but its share line still says "Escape No. 1".
- A free player's first room would be The Night Ferry, the oldest. The rig opens with the Pass, so it doesn't show.
- Earlier rooms' session pages are short sample plays: two locks, and no near misses or story.

## New sample record (all invented, held once in `pg-es-core.jsx`)

- Near misses: move 2 of both plays (the drawer), "Right letters, wrong order."
- Partial readings: this week, move 7, cabinet 2 of 4 dials. Over par: move 7 1 of 4, move 9 3 of 4, move 12 the clock hands 1 of 2.
- A story line for each lock, and the exit text on the oak door.
- Either-or: the oak door was taken, so the chimney hatch closed.
- None of this adds moves, so the store's figures (13 moves, 2 wrong tries) still hold. A near miss or a partial reading counts as a wrong try.

## Shared by all three

- **Move count.** The section heading is the game's own headline, "Escaped in 13 moves" ("So far: 3 moves" while unfinished). The shared head above it is unchanged.
- **Setting a mechanism.** Nothing added. Every option already starts each move with its verb (Examine, Try, Use, Set).
- **Combining two items.** Left out of all three. No seed play has a combination, and adding one would mean inventing moves. "Used up" already shows on the move where the key goes in. No option shows "kept".
- **Partial readings and near misses** show as the move's outcome word ("2 of 4 dials", "Near miss"), wherever the option shows outcomes.

## Key moments

**Rule (the owner's call, not ratified):** the first lock opened at the first try with no hint; the closest miss (the highest partial reading, otherwise the first near miss); the longest stretch to a lock, if it took 4 moves or more; the way out. Each appears only if the play has one, in move order. Code: `pgeMoments` in `pg-es-core.jsx`.

- This week: First try (clock hands, move 9) · Closest miss (cabinet, 2 of 4 dials, move 7) · Longest stretch (5 moves to the cabinet lock) · The way out (oak door, move 13).
- Over par: no first try. Closest miss (cabinet, 3 of 4, move 9) · Longest stretch (6 moves, cabinet) · The way out.
- Unfinished: Closest miss only (the near miss at move 2).

The moments sit in a row of buttons. Selecting one lights its place on the timeline, and selecting on the timeline lights the moment. Neither opens anything new.

## Each option

1. **The line.** *Added:* moments under the line, each tied to a move. Picking a moment steps the move reader to that move, lights its door and number on the line, and for the longest stretch shades its squares. Stepping onto a moment's move lights the moment. The move reader shows near-miss and partial replies, each lock's story line when it opens, and the either-or line on the exit. *Left out:* the story and either-or lines on the line itself, because the labels already stack. *Spoilers: shows everything,* one move at a time. No typed answer is ever printed (the store's rule).
2. **The rail.** *Added:* moments above the rail. The first try and the way out light their door row. The closest miss and the longest stretch light their stretch, and the move itself when the stretch is open. Pressing a lock's name on the rail steps through its moments, and pressing the closest-miss move selects it. The either-or line sits under the exit door, and story lines under each door. *Spoilers: middle.* What you did and how it went is shown. The room's words (replies, near misses, readings, hints, story) wait behind one switch for the whole page, "Show what the room said", which is off by default.
3. **The minutes.** *Added:* moments under the squares. A moment lights its door square, or for the longest stretch the minutes between the two doors, and its line in the ledger. Door squares can be pressed, and so can ledger lines. Each lock's group ends with a "The story so far" line ("How it ends" for the exit), and the exit group's header carries the either-or line. *Spoilers: the strictest.* Every word of the room's opens one line at a time, with a tap.

## Correction: lock minutes

The game records the minute each lock opened, but it does not send those minutes to the session page today. All three options still show them: on the line (1), in the rail's gutter (2), and as the squares and ledger headers (3). Option 3 depends on them most, then option 1. Option 2 would still read without them. **This needs the game to send the minutes.**

## Not built, or open

- The moment rule, each option's spoiler call, and the sample record are all unratified.
- The over-par stall and the closest miss fall on the same lock, so in option 3 they light the same door. The stall also shades the minutes.
- A moment shared by two moves can't happen under this rule. If the rule changes, `pgeNextMoment` steps through moments on one lock.
- The library card is unchanged in this pass.
