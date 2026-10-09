# Handoff: Daily Puzzles splits into separate games, 2026-10-09

Built from the delta prompt of 2026-10-09 (upstream `inception/_outputs/demo-delta-split-daily-puzzles.md`) and `game-specs/daily-puzzles.md`, read live that day. Everything here is proposed design intent. Nothing below is ratified beyond what the prompt marks ratified.

## What was built

- **Seven games, one category each.** `GS_GAMES` in `app/gs-data.jsx`: Daily Word, Daily Groups, Daily Mystery, Escape, Casebook, Delve, 36,000 Summers Ago, in that order (`GS_GAME_ORDER`). Each carries `category`. The product page label is now `category · rhythm` (`GS_PAGES[id].rhythm` in `app/gs-game.jsx`).
- **Routes.** `puzzles` is gone. New routes: `word`, `groups`, `mystery`, `escape` (`app/main.jsx`). Each renders the standard product page, and the standard library game page with `page: 'record'`.
- **Product pages.** Four new `GS_PAGES` entries. Each daily's "Today" card and Escape's "This week's room" card is the shared `GsWeekCard`, which now also serves free games.
- **Library game pages.** `app/gs-puzzles-library.jsx` was rewritten: one config per game (`PZ`), one page factory, the same parts as Delve's page (now card, run, achievements, your plays, all page). Each game has its own streak.
- **Sample data.** The old puzzle sessions moved to their games on the same dates: `word-today`, `word-1005`, `mystery-today` (was `murder-today`), `mystery-1004` (was `murder-1004`), `escape-week` (was `escape-today`, still dated Tuesday 6 October). New: `groups-today`, `groups-1005`, `escape-0928`. Every session has a `gid`, and share links point to its game's page.
- **Share text.** Daily Word keeps its letter grid. Daily Groups and Daily Mystery follow the spec's formats. Escape uses one line. All of this is `shareHead` / `rows` in the session.
- **Cover.** Daily Groups got a new cover (`GS_ART.groups`): four rows of four squares, one cover colour a row, on indigo. It uses only the system's cover colours and ground. The old Daily Puzzles cover (`GS_ART.daily`) was removed.

## Removed (item 4)

- The home Today list, the Daily Puzzles feature card, and the Games page's wide daily card (`GsTodayList`, `GsDailyWide`). The dailies are now ordinary cards.
- The product page's Today section, "Earlier puzzles" and streak panel (`GsDailyToday`, `GsEarlier`, `GsPuzzleCard`, `GsStreakPanel`).
- The library page's Today card with a tile per puzzle (`DpToday`), and the "All three in a day" achievement.
- **History's streak panel.** It counted one streak across the three puzzles, which conflicts with a streak per game. History is now the list alone. Each game's streak is on its library game page.
- The home feature row's rule that held four cards still from 1100px. With seven cards, the row scrolls at every width, per the system's scrolling-row rule.

## Choices made (each open for the owner)

1. **Escape keeps the FREE mark.** It was free inside Daily Puzzles, so making it a Pass game would have changed what a free player gets. The prompt says not to change pricing.
2. **Escape reads as a weekly game,** the way Casebook and Delve do: "A NEW ROOM EVERY WEEK", "This week's room", "Played this week", a run counted in weeks, and a new room on Monday 12 October.
3. **Escape's achievements:** Escaped, Out in six, and Four weeks running. A weekly game can't play seven days in a row, so Four weeks running takes the place of that achievement.
4. **Covers:** Daily Word, Daily Mystery and Escape keep the covers they had as puzzles. Daily Groups gets the new one.
5. **Length:** each of the four shows "10 min", carried over from Daily Puzzles' "10 min each". Escape's real length is not known.
6. **Copy for the new pages** (pitches, blurbs, Games-page lines, now-card lines) is written to `voice.md` and is unseen by the owner.
7. **Pass games on a free plan** link to "Play a free game", which opens Games. It used to be "Play today's puzzles free".

## Lines that say what a free player gets (all placeholder)

- Pass page comparison row: "The free games: Short puzzles, new every day or every week." (`GS_COMPARE`, `app/gs-parts.jsx`)
- Games card label on the free games: "FREE WITH AN ACCOUNT", from the spec's "free with an account". (`app/gs-home.jsx`)
- Home, Get started step 2: "Play the free games. No card needed."
- Account, Pass card on the free plan: "You get the free games, and your results and streaks are kept. Get the Pass for the Pass games and every earlier edition."
- Pass ended, cancel and ending lines: "You're back on the free games." / "After that it's the free games." (`app/gs-billing.jsx`)
- Library game page on the free plan, your plays: "Results last until the end of the day. Earlier days (rooms) stay with the Pass."
- Connect your AI, once connected: "Tell your AI which game you want to play."

The Pass page's "Every earlier edition of the daily and weekly games" line is unchanged, because it is still true.

## Staged states

New or changed: `word-free`, `word-signed-out`, `groups-free`, `groups-pass`, `mystery-pass`, `escape-free`, `escape-pass`, `session-groups`, `session-escape`, `session-puzzle` (now Daily Word), and `library-{word,groups,mystery,escape}` with `-finished` and `-free` for each, plus `library-groups-all`. Removed: `puzzles-free`, `puzzles-pass`, `library-puzzles*`. The QA entry `split-daily-puzzles` walks them all.

## Not done / unresolved

- Every game still uses the Daily Word screenshot as a stand-in on "How it looks in your chat".
- Daily Mystery's question limit is not in the spec, so its now card has no progress bar.
- Old CSS for the removed blocks (`.gs-gdaily`, `.gs-today-list`, `.gs-pz-*`, `.gs-day-row`, `.gs-streak`, `.lb-tiles`) is still in `index.html`. It is unused and safe to delete.
- Home "Get started" step 3 still names three Pass games. This change didn't touch it, but it breaks the voice rule against listing games.
- `CLAUDE.md`'s screen map was updated to the new routes.

## Next

Ask the owner to confirm the Escape FREE mark and the free-player wording above. After that, delete the unused CSS and the QA entry once the work is signed off.
