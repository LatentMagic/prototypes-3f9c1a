# Handoff: first-release-games

Built 2026-10-07 from Part 4 of the prompt. All game copy is the prompt's draft, verbatim, and the owner hasn't checked it.

## What was built, and where
- `app/gs-game.jsx`: one page template (`GsGamePage`) and per-game content (`GS_PAGES`) for Daily Puzzles, Casebook, Delve and the hunter-gatherer game. Order: breadcrumb and cover, play box, facts row, pitch beside who does what, chat screenshots, a finished play, Delve's stat tiles, today's or this week's one, streak (Daily Puzzles only), more games. `gs-delve.jsx` was deleted. `gs-puzzles.jsx` now holds only the Daily Puzzles parts.
- `app/gs-data.jsx`: `GS_NAME` (one constant each for Casebook and "Hunter-gatherer game (working title)"), two covers, cards, `GS_GAME_ORDER`, `gsMarks`, the two sessions, and History, which now has eight rows.
- `app/gs-home.jsx`: Home shows four wide cards, then the two "Coming soon" cards, then "All games". Games lists the four games, then "Coming soon".
- `app/gs-session.jsx`: shows a gap as "—".

## Staged states
No new staged screens were strictly needed. QA steps can only be state ids, though, so I added `casebook-free`, `casebook-pass`, `hunter-free`, `hunter-pass`, `games-free`, `games-signed-out`, `session-casebook` and `session-hunter`. QA entry: `first-release-games`.

## Yours to decide: what I chose (for ratification)
- **Covers:** Casebook is three upright bars (the suspects) and a lamp on indigo. The hunter-gatherer game is a low sun and a hill on forest.
- **Facts row:** five labelled cells in a ruled band, all five in one row at 1000px and wider, with any extra tags under it.
- **Finished-play preview:** a card with a small cover, the result, the figures and "See a finished session (demo)", beside the share card.
- **Grid order:** Daily Puzzles, Casebook, Delve, hunter-gatherer game.

## Stand-ins
Every "How it looks in your chat" slot shows the Daily Word screenshot (`assets/in-use/daily-word-claude-code-2026-10-05.png`): one on Daily Puzzles (a real one), three on Delve, one on Casebook and one on the hunter-gatherer game.

## Blanks left as "—"
- Daily Puzzles: what your AI does, age.
- Casebook: age, how long, players, screenshot caption, the third line of the Home wide card. The wrong-accusation result isn't written, and no such session was built.
- Hunter-gatherer game: what your AI does, age, how long, how often, players, screenshot caption, the play box's third step, and the session's result, figures, record title and share line.

## Open or unresolved
- The Daily Puzzles play box has no small print: its Pass line and its purchase line are both left out.
- The Delve and Casebook "this week" cards in the Pass view show as already played ("Rescued", "Solved"), to agree with the "Played this week" marks. That means "Play in your AI" shows only on the hunter-gatherer card.
- Delve's former tag row is now its facts row, as the prompt says.

## Next
Ratify the four choices, write the blanks upstream, and replace the stand-in screenshots.


## Decision: footer coverage (ratified by the user, 2026-10-07)
The footer shows across the whole store, including History, Account, Your AI and session pages. Left clean: sign-in, sign-up, checkout, not-found, loading (single-purpose screens; a footer is a way out). Reason: Games and game pages are both shop window and signed-in home, so a footer that appears and vanishes reads as a glitch; Terms, Privacy and Refunds stay one click away where people pay or manage a subscription. Implemented in `GS_FOOTER` (`app/main.jsx`). Also: the footer's "resources / Connect via MCP" column was removed.
