---
date: '2026-10-08'
topic: 'library-game-page'
status: 'in-progress'
type: 'exploration'
---

# Handoff: library-game-page, playground with options 1 to 3 built, awaiting review

## Current Focus

The playground is built and waiting for the user's review. The open question to the user is which option goes forward, or which parts of each. Nothing has been ratified. Don't polish the rig before that answer comes back.

## Task(s)

- Done: a playground for the prompt at LatentMagic/business-ops `work/apps/mcp-game-store/inception/_outputs/playground-library-game-page.md`. Read it live; it is not copied here.
- Done: three arrangements, each covering all nine items in the prompt, for all four games and the three viewers.
  - **1 Ledger**: one page. A session opens in place, with its share text open under it and a Copy button. Streak, achievements and the game's own part sit in a side column on desktop and come after the list on a phone. Pass ended: earned achievements stay listed and what was left to earn becomes one line.
  - **2 Spotlight**: one session shows large in a card (the latest result by default). The list beside it (below it on a phone) picks which session. Share is a button that opens a panel (`DS.Popup kind="panel"`) with the text and Copy. Pass ended: the full list stays, with progress frozen at the end date.
  - **3 Overview**: a summary with tiles for the current edition, where you left off and the streak, then a flat list. Each row opens its own session page; "Copy result" copies straight from the row. The session page shows the share text block. Pass ended: earned achievements are folded behind one `DS.Disclosure`, and nothing left to earn is shown.
- Not started: any decision. Both owner questions are open: whether a session's detail sits on this page or on its own page, and how the share text is reached.

## Critical References

- The prompt (path above) and the four draft specs beside it in `_outputs/game-specs/` (daily-puzzles, casebook, delve, 36000-summers-ago). Lines marked "(proposed)" are guesses.
- `skills/build-playground/SKILL.md`: the rig follows it (real app, bottom strip, numbered options with stance and cost).
- `CLAUDE.md` § Files: the `<base href="../../../../" />` mechanism the entry relies on.

## Recent changes

- `docs/specs/library-game-page/playground/index.html`: a copy of `index.html` with `<base>`, a new title, a `/* ---- playground: the library game page ---- */` CSS block at the end of `<style>`, and `pg-library.jsx` loaded before `app/main.jsx`.
- `docs/specs/library-game-page/playground/pg-library.jsx`: seed (`LG_S` sessions, `LG` per game), shared parts (`LgHead`, `LgStreak`, `LgCurrent`, `LgLeftOff`, `LgResult`, `LgShareBlock`, `LgAch`, `LgOwn`), the options (`LgLedger`, `LgSpot`, `LgOverview` + `LgSessionPage`), and the strip (`LgStrip`, `LG_OPTS` hold each option's idea and cost). At its end it overrides `window.GsPuzzles/GsCasebook/GsDelve/GsHunter` (only the `record` route; anything else falls through to `app/gs-player.jsx`'s screens) and `window.GsDemoBar`.
- `docs/specs/library-game-page/README.md`: upstream pointers and the seed choices.
- `playgrounds.json`: new active ticket `library-game-page`.
- No changes to `app/`.

## Learnings

- **The four specs weren't attached to the prompt.** They live upstream in `_outputs/game-specs/`, and so does the prompt itself.
- **The preview's "32 referenced files not found" warning is the false positive described in CLAUDE.md.** The `<base>` depth (four levels) was counted, and the page was confirmed to render with tokens and the real top bar. The warning also stops the background verifier from running, so states were checked by screenshot instead: option 2 Casebook, option 3 Daily Puzzles, option 1 36,000 Summers Ago with the Pass ended.
- **The "Pass ended" viewer** is `setDemoView('free')` then `setSub({ freeUsed: true })`, which is `gsLapsed` in `app/gs-data.jsx:141`.
- **Every viewer sees the same sessions,** so the rig doesn't decide which games are free. Unplayed earlier editions ("Not played") show only to a Pass player. The app's own `lapsedDate` logic is ignored here.
- The localStorage key is `pg_library_game_v1`. It was reset to defaults after probing (option 1, Delve, Pass, strip open).

## Artifacts

- `docs/specs/library-game-page/playground/index.html`
- `docs/specs/library-game-page/playground/pg-library.jsx`
- `docs/specs/library-game-page/README.md`
- `playgrounds.json`

## Action Items & Next Steps

1. Get the user's reaction: which option, or which parts. Record anything they ratify in a new handoff here, dated, with who ratified it.
2. If they pick parts across options, build the combination as a fourth option in the same rig. Leave options 1 to 3 as the record.
3. Raise these seed choices with the user only if they matter to the decision. None is ratified:
   - Spec names for Daily Puzzles (Daily Word, Daily Groups, Daily Mystery) rather than the app's (Word Puzzle, Escape Room, Murder Mystery).
   - Daily Mystery's limit of 5 questions.
   - Delve heroes shown by class only ("Rogue"); the spec's share sample says "Vex the Rogue".
   - Earlier Casebook cases have no names.
   - 36,000 Summers Ago's day summary is invented from the spec's list of records.
   - Only Delve fills the game's own part ("Your heroes").
4. At session end, clear `uploads/` of anything unreferenced (four screenshots from earlier sessions sit there).

## Other Notes

- Not in scope, left alone as the prompt says: how play starts or resumes (no play button is shown), the free line, what History and the Library list, Daily Puzzles as one game or several, and the product page's design.
- The copy is plain, working-screen voice. The one Pass line for a player without the Pass is "Achievements come with the Pass.", followed by a "What's included" link.
