---
date: '2026-10-17'
topic: 'no-replay'
status: 'in-progress'
type: 'implementation'
---

# Handoff: only chapter games can be started over

Date: 2026-10-17. Brief: the "only chapter games can be started over" delta, pasted into chat on 2026-10-17, after elegance-fixes. Everything is in `app/`, `index.html` and `CLAUDE.md`. No candidate build, no rig. QA entry: **Only chapters start over, 17 October** (`app/qa.jsx`, key `no-replay`). Delete it once signed off.

## Current focus

Built. Waiting for the owner to sign off and rule on the calls below.

## Ratified (owner, 2026-10-17)

- A daily or weekly edition, and a game with a fixed answer, has one play per edition. A room or scene is a weekly edition.
- A story or adventure chapter with no fixed answer can be started over after it is finished.
- No Replay chip, replay mark or Replays filter, for any game.

## What changed, and where

1. **One rule** (`gs-data.jsx`): `gsCanReplay` is gone. `gsStartsOver(k)` is true only for a game with no schedule and no fixed answer (`once`). `GS_ONCE_LINE` holds the finished-edition line. Escape and Delve are weekly, so they are now played once (they used to be replayable).
2. **Session page** (`gs-session.jsx`): Play again, its Pass tag and the Pass line are gone. A finished played-once session shows Share and `GS_ONCE_LINE`. A finished chapter or day shows **Start over** (secondary) beside Share. `gsReplayMark` is gone and share text has no replay mark.
3. **Case page** (`gs-casebook.jsx`): Play again and the Pass line are gone. A finished case shows Share and the line.
4. **Play dialog** (`gs-connect.jsx`): every route that starts an edition goes through it. A finished edition of a game played once (requested directly, or the current edition behind a game's Play) shows the line, with no prompt and no Copy. `gsSessEd` lost its `-r<n>` replay lookup and now resolves a Barrow session to its chapter.
5. **Editions panel** (`gs-editions.jsx`): a finished played-once edition stays as it was (result, line, See in History). A finished chapter shows "You’ve played this chapter. To start it over, paste this into your AI." with the prompt and Copy, and never a Pass line.
6. **Barrow head card** (`gs-pass-library.jsx`, `CprFirst`): chapter 1 finished has Start over before Share.
7. **History** (`gs-history.jsx`): replay seeds (`PH_HAND`, `PH_REPLAY`, `phClone`), the `again` flag, the Replay chip on rows and session figures, and the Replays filter are gone. Filters are Genre, Schedule, Game and Order. Counts read ordinary plays.
8. **Other**: account export lost `replay` (`gs-account.jsx`); Needs the Pass counts every play (`gs-pass-library.jsx`); streak comment (`gs-library.jsx`); `.rp-fig` CSS removed (`index.html`).
9. **Copy**: 36,000 Summers Ago: facts "A different day every time you start"; day line "One day, dawn to firelight. Start it over and it goes differently." The Court of Ash, Low Tide and Clockwork: "A different culprit / shore / vault every time you start". No daily, weekly or fixed-answer game had copy promising a second go.
10. **CLAUDE.md**: the product block now says which games can be started over and which can't.

## States

- Removed: `session-replay` (an Escape replay, `escape-week-r0`, which no longer exists). QA entry `replay-share` removed.
- Added: `session-barrow` (the Barrow's chapter 1 finished, Start over).
- Relabelled: `session-word-earlier`, `session-mystery-earlier` ("played once" in place of "no Play again").
- QA notes reworded: `every-edition-playable` and `phone-snags-second-pass` no longer mention Play again or Replay.
- Kept as they were: `session-escape`, `session-delve`, `session-delve-past`, `session-puzzle`, `session-casebook`, `session-hunter`, `edition-*-done`, `history`. They now show the new controls.

## Set by this brief, not ruled by the owner

- The finished-edition line is the deployed copy, word for word, and only where playing again is barred.
- The Pass line that replaced Play again goes.
- A finished edition keeps its result and Share.
- A chapter's start-over carries no Pass tag and no Pass line.
- In the Editions list and its panel, a finished chapter shows the played state and the start-over.

## Start-over: what I chose

- On a session page and the Barrow's head card: a secondary button, **Start over**, before Share, in a ButtonPair where Share exists. It opens the usual play dialog with that chapter's prompt. It is secondary so Share stays the main action, as Play again was.
- In the editions panel: the played line plus the existing prompt and Copy. The panel already offers a prompt there, so nothing new was added.

## Calls I made (need the owner's word)

- **The no-schedule games count as start-over games.** 36,000 Summers Ago, The Court of Ash, Low Tide and Clockwork have no editions and a new setup each time, so I treated them as having no fixed answer. The Court of Ash picks a culprit, but a new one each night.
- **Saltmarsh and Heist** (weekly, Pass-only) are now played once by the schedule rule. Nothing in their copy changed.
- **A game's Play button can land on the line.** On a product page, Play for a game whose current edition is finished (Daily Word for a Pass holder by default) opens the dialog with the line and no prompt. This follows "by any route"; say if Play should hide instead.

## Hits left alone

- `config.jsx` `dataset.replay`: the kit's re-click of a Config button, not a game replay.
- `_ds/` bundle: ListRow's `replay` prop, ChatPlayback's "Play again" label, and the system's own playground pages. The app no longer passes `replay`. ChatPlayback's play-again is the media player's control (left alone by the brief). Carry back to the design system: ListRow's Replay note has no use left.
- `gs-delve-library.jsx` `const again = gsLapsed(gs)`: a variable name, unrelated.
- `rpRow`, `rpTone`, `rpRecent`, `__rp`: names left from the replays playground; they hold no replay meaning now.
- "Try again" (errors), "Get the Pass again" (Account), "change it again" (username), "start again" (Config hint): unrelated.
- The `no-replay` QA entry names what is gone.
- `docs/` (old handoffs, archived playgrounds): history.

## Not built, or open

- The Barrow's chapter has no play in History, and its editions status is typed as Not played, so the editions panel never shows its start-over. It needs a play-log record (also listed in the elegance-fixes handoff).
- The Long Winter and Far Side (chapter games among the ten Pass-only games) have no Library page, so their start-over can't be seen.
- Not checked by hand at every width; walk the QA entry at 320 and 1280px.

## Next

1. Sign off the QA entry; rule on the three calls.
2. Give the Barrow a play-log record.
