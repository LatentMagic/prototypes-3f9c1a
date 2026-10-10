# Handoff: decisions of 10 October

## Built
1. **Needs-Pass session page.** `GsNeedsPass` (`app/gs-session.jsx`) shows "Every other {case|scene|room} comes with the Pass." and a secondary "Get the Pass" ("Get the Pass again" when lapsed). Used by the empty page (`GsSessionNew`) and the played page (`GsSessionRecord`, `held`). Played keeps its result and Share; no Play, Replay or prompt.
2. **Earlier editions per game.** `GS_EARLIER_CLOSED = ['word','groups','mystery']` (`gs-data.jsx`). The "Playing earlier … comes with the Pass" line now shows on Escape only (`gs-puzzles-library.jsx`). Seed replays of earlier Groups/Mystery editions removed, and the random replay seed skips closed games (`gs-history.jsx`). `CLAUDE.md` "Who plays what" states the rule.
3. **Email sign-in.** Known device goes straight on (`gs-auth.jsx`); new device gets the code. Config row reads "Device, for email, Google and Apple sign-in".
4. **Your data card** on Account (`GsDataCopy`, `gs-account.jsx`), above Delete. Delete dialog unchanged.
5. **History date search.** A date matches the heading's date: play day on Played, edition day on Every edition. Dates match at a word start, so `6 October` no longer finds `16 October`.
6. **Casebook case page** (`CbCase`, `gs-casebook.jsx`) carries the shared controls; layout unchanged.

## States
- `session-new-needs-pass`: missed Escape edition, free account. `session-new-delve-needs-pass`: missed Delve scene, lapsed.
- `session-new-pass`: missed Escape edition, Pass. `session-new-groups-closed`: missed Groups, can't be played (new).
- `history-every-edition-groups` now shows closed; `history-every-edition-escape` is the playable one (new).
- Played earlier Delve on a free account: History, Delve rows, open one with the free account.
- Casebook: `session-casebook`, `library-casebook-case`, `library-casebook-replay`.

## Chosen
- **Line wording:** reuses the library pages' own line, with the game's noun from `GS_GAMES[gid].ed[0]`. Nothing new to ratify.
- **Escape's earlier editions stay playable with the Pass.** Item 2 names three games, and Escape's library line stays. Seed edition `escape2` is the missed example.
- **"Who plays what":** reworded to state the per-game rule; Escape is the one daily-schedule game with playable earlier editions.
- **Data copy:** its own card, "Your data", button "Get a copy" → Confirm it's you (password, or a code for Google/Apple) → "Your copy is ready." and "Download file" (JSON; account details alone if nothing played).
- **Date match:** the day under the heading (see 5).

## Already present
None of the six items was present as stated. The Pass table row, "Replay" chip and "Replays" filter are untouched.

## Casebook route differences
- Every route (History row, plays card, Library entry) goes through `cbGo` to the one case page, so they now behave alike.
- Before: no Replay/Play, no Pass line. Now: Play in progress; Replay + Share finished; Replay only on a replay record; line + "Get the Pass" without the Pass.
- Never-played case reached by `cbGo`/`sid` now shows the session page's empty form (`GsSessionNew gid ed`).
- Back link already used `LbBackTo`, same as the session page.
- Left different: the back link sits inside `main` (shared page: above it, 24px padding). No share-link route exists in the build.

## Left or unresolved
- `library-word-streak-broken` still shows a replay of yesterday's Daily Word, played that day. Left as a streak-state fixture; say if it should go.
- Not visually checked beyond the verifier pass; Casebook header spacing with the new buttons at 320px needs a look.
- Escape on the free account: its earlier edition needs the Pass, so History rows there show the new line.

## Next
Review item 6 header at phone width; decide Escape's rule with the owner.
