---
date: '2026-10-12'
topic: 'history-filters-redesign'
status: 'awaiting-review'
type: 'playground'
---

# Handoff: History's filters, redesigned (playground)

Brief: the playground prompt of 2026-10-12, "History's filters, redesigned playground". Nothing here is ratified.

## What was built, and where
- Entry: `docs/specs/history-filters-redesign/playground/index.html`. Module: `pg-history.jsx` in the same folder. Listed in `playgrounds.json`.
- The entry is today's root `index.html` with a `<base>`, the rig's CSS and one script tag added. `app/` is unchanged.
- The rig is the real app with a bottom strip, above the app's demo bar. It opens on History with the Pass.
  - **History 0 to 3** picks the option. **Why** opens its stance and cost.
  - **Go** opens History, or the Casebook, Escape or Daily Word library game page, so the "All…" link can be pressed.
- Viewport: the app's own Config (Auto or Mobile). Viewer: the app's demo bar (signed out, free, Pass). Selection persists under `pg_history_filters_v1`.
- The module replaces `GsHistory` and `GsDemoBar`. Option 0 mounts the app's `GsHistory` unchanged. Options 1 to 3 rebuild History from the app's own helpers and parts (`phVisible`, `phEds`, `phHay`, `phMatch`, `edLabel`, `edName`, `DS.ListRow`, `LbChoice`'s look, `LbGamePick`, `RpPages`, `GsPart`).

## What today does (read from the app, 2026-10-12)
- **Bar.** Search beside one secondary "Filters" button. The panel holds List (Played / All), Genre, Schedule, Game, Plays and Order. The line under the bar names what is changed, so after picking List it reads only "All".
- **List is not a filter.** It changes what a row is, from a play to an edition. It is the only way to reach a missed edition.
- **Every-edition list.** Replays sit beneath their edition as indented `sub` rows reading "Replay" with a date and time. The seed gives Daily Word, Daily Groups and Daily Mystery replays, which the settled rules forbid.
- **"All cases" link.** On a library game page it opens `history { game, from }`, which is the Played list narrowed to the game.

## The options
- **0 · Today.** The app as it stands, apart from the seed change below.
- **1 · Two lists.**
  - Stance: "Played" and "All editions" are tabs under the heading, outside the filters. With one game narrowed, the second tab names the game's word ("All cases", "All rooms").
  - The Filters panel holds only narrowing: Genre, Schedule, Game, Replays, Order. It narrows the same way on either tab.
  - "All cases" opens the All cases tab for that game.
  - Cost: one more row of controls on a phone. The Library would take the panel but not the tabs.
- **2 · One list, three kinds of row.**
  - Stance: there is no switch. Three toggles on the page, under "Show", say which rows the list holds: First plays, Replays, Not played. History opens with the first two on. Not played adds each missed edition under the day it came out.
  - The Filters panel holds Genre, Schedule, Game and Order.
  - "All cases" opens the game with all three on.
  - Cost: each edition exactly once takes two taps. A first play sits under the day it was played, so a weekly edition's row can sit days after it came out.
- **3 · Every control on the page.**
  - Stance: no Filters button. One row of controls under search, each showing its value: List (Played / All editions), Games, Replays, Order.
  - Game, Genre and Schedule merge into one Games control, a panel with All games, the two schedules, the genres and each game, searchable.
  - "All cases" opens All cases for that game.
  - Cost: two lines of controls on a phone, and genre and schedule cannot be combined.

## Choices made on the open items, and why (proposed, none ratified)
- **Seed, every option, 0 included:** replays of the three daily puzzles are removed from the play log, because the brief says no option shows one. In option 0 this is the one difference from the app.
- **Replays in the every-edition list (options 1 and 3, and option 2's mixed list).** A replay is its own row after its edition, with the same title and look as any row and "Replay" in the note. Rows in that list carry no time, so no row has a date and time format of its own.
- **Plays renamed Replays**, with "With replays / No replays / Only replays". "No replays" on the every-edition list leaves each edition once, so the choice means the same thing on both lists.
- **Clear all** appears on the page whenever anything is set, and also in the empty state. It clears search and narrowing, and in option 2 it puts the toggles back to First plays and Replays. It leaves the list itself (Played or All editions) alone, because that is where you are, not something you set. The panel's own Clear still clears only the panel.
- **Row titles** come from the edition everywhere ("Daily Word #212"; "#212" with one game narrowed), so a played row and a missed row read alike in option 2.
- **H1 stays "History"** in options 1 to 3. The tab or control names the list. Today's app changes the H1 to "All cases".
- **The Filters button keeps secondary weight** in 1 and 2: once the list is not in it, reaching an edition no longer depends on it.
- **No tooltip, hint or first-run pattern** in any option.

## Not built or unresolved
- The Library is not built. Each option's cost line says how it would carry over.
- Option 3's menus line up with their control's right edge when there is no room to the right. That alignment is measured, as in the filters-on-a-phone rig.
- New copy ("All editions", "With replays", "No replays", "Only replays", "Show", "First plays", "Not played" as a toggle, "Clear all", "Daily games", "Puzzle games") has not been ratified.
- `PH_BROKEN` (state `library-word-streak-broken`) still holds a Daily Word replay. The rig does not reach that state.
- The settled rule "see every edition … each once" is met in option 2 only with Replays off. Whether that is enough is the owner's call.

## What I would do next
1. Walk each option on a phone and at desktop width: find a missed Casebook case from History, then from the Casebook page's "All cases" link.
2. Pick one direction, then build the Library's half of it in the same rig before anything goes into `app/`.
