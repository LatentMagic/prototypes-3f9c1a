# History playground: handoff, 2026-10-09

## Ratified by Joe, 2026-10-09 (in his words)

- **History is history: one long list of everything played.** A library game's "All…" link opens that same History with Show set to the game. No separate list per game. This is option 1's rule; options 2 and 3 are not picked.
- **Order is mandatory:** Newest first / Oldest first, the control the "All…" pages already use. Built in option 1 only.
- **Copy:** "A replay doesn't change your streak or your record." (The first draft, "…or the result you share", was wrong: every play, replays included, has its own share card.)
- **Loads:** History shows loading and load-failed in place, as Discover does. The list's box keeps a fixed 720px so nothing jumps; the controls stay usable. Staged by the strip's Load row (normal, held, failed).
- **`CLAUDE.md` rule changed** (shared part, so it goes back to the kit): the loading rule now reads "Every wait shows it is working, where the wait is…" and fires on "any action that changes state, or any content that loads".

## Parked, not decided

- **"Replay" as a marker.** Joe: close, not quite there. Revisit later.
- **Icon side.** Whether the status icon sits left or right of its label. Joe wants one universal rule, tried in the playground first (Config toggle), then fixed everywhere. Not built.
- **Page size.** History pages 24 plays; the app's "All…" pages page 12. Neither number is ratified.
- **Options 2 and 3** stay in the rig for reference only.

## Original handoff (before the rulings above)

The question was how History shows everything a player has played, replays included, and how a library game page and History connect by one rule for every game. The source is Joe's request of 2026-10-09 (`_context/log.md`, "History playground asked for"). Nothing below is ratified.

## What was built, and where it lives

- Entry: `docs/specs/history/playground/index.html`. It is a copy of the root `index.html` with `<base href="../../../../" />`, the playground CSS (`/* ---- playground: History ... */`) and one extra module.
- Module: `docs/specs/history/playground/pg-history.jsx`. It overrides `GsHistory`, `LbRow`, `LbRecent` and `GsDemoBar` on `window`. Nothing in `app/` changed.
- Listed in `playgrounds.json` under the ticket `history`.
- State key: `pg_history_v1` (which option, and whether the strip is open).

## How to reach each option

The rig opens on History, signed in with the Pass. The strip at the bottom has three rows:
1. **History**: the buttons 1, 2 and 3 pick the option. **Why** gives the idea, the rule and the cost. **Hide** folds the strip.
2. **Go**: History, then the library game pages that have replays seeded (Groups, Escape, Casebook, Delve, and 36,000 Summers Ago, which has no editions).
3. **View**: signed out, free, Pass. Free and Pass-ended keep today's History rules.

## The options

- **1 · One list, by day.** Every play is a row under the day it was played, and a replay is its own row marked "Replay". On the library game page, an edition played more than once reads "· 3 plays" and opens the play that counts. **Rule:** the library game page's full list is History filtered to that game, so the "All…" link opens History filtered, with a back button to the game, and the game's own all page goes. **Cost:** the list changes from editions to plays as you tap through, and editions you missed drop out of it.
- **2 · Editions, replays tucked under.** History lists editions, grouped by the week each came out. Replays sit under their edition as smaller rows, and each one opens its own record. The library game page uses the same rows. **Rule:** one edition row, with its replays under it, wherever it appears. Picking a game in History adds a "Go to <game>" link. **Cost:** a replay of an old edition files under that old week, and there are still two full lists.
- **3 · By game.** History has one card per game, ordered by latest play, each with that game's latest three plays. The card heading opens the library game page. On the library game page, an edition with several plays opens a panel listing them. **Rule:** History shows each game's latest plays, and the full list lives on the library game page. **Cost:** there is no time order across games, and replays push older plays off a card.

## Open items, what I chose, and why

- **Grouping.** Each option groups differently: 1 by the day you played, 2 by the week the edition came out (a week holds both daily and weekly games), 3 by game. Grouping is the main way the three options differ.
- **What an entry shows.** Each entry shows the game (unless History is filtered to one game), the edition, when it was played, and the result. A replay carries "Replay" in weight 600. Counts and stats were left out to keep it lean.
- **Copy (ratified, see top):** "A replay doesn't change your streak or your record." This is one line under the History heading. It restates the decided rule and avoids naming any kind of game.
- **Games with no editions** (36,000 Summers Ago). Every play is its own entry, and none is ever a replay. This keeps the rule the same for every game: a replay is a second play of the same edition.
- **Free player.** I reused today's behaviour. Free sees the free games' plays (today's only for the games marked played today). Pass ended also sees Pass-game plays from before 18 September.
- **Seed volume.** The seed is built from the library pages' own seeds: about forty days of the four puzzles, thirty weeks of Escape, Casebook and Delve, and eighteen days of 36,000 Summers Ago. That comes to about 230 plays plus replays, enough that "elegant, not bloated" gets a real test. History pages 24 plays (option 1) or 20 editions (option 2) at a time.

## Not built, or unresolved

- **The session page is untouched.** I read the fence ("the library game page may change… and nowhere else") as covering the session page. So a replay's record does not say it doesn't count, and it repeats its first play's lines with a new result.
- **Today's replays on the now card.** Today's edition is not in a library page's "Your…" list (that list starts at yesterday), so today's replays show only in History. The now card is the obvious place to show them, but it is inside each game's file and was left alone.
- Sessions for Delve and 36,000 Summers Ago all open the one existing session page, as they do in the app today.
- The free tier has a contradiction that predates this playground: History shows earlier free-game plays, while the library page says free results last today only.

## What I'd do next

After Joe picks an option, decide whether the session page of a replay should say it doesn't count, and whether the now card shows today's replays. Both sit outside this playground's fence and need his say before anyone builds them.
