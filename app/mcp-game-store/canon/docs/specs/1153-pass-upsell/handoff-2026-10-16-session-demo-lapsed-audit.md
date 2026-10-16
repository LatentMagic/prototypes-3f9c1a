---
date: '2026-10-16'
ticket: '1153'
topic: 'session-demo-games-lapsed-audit'
status: 'in-progress'
type: 'implementation'
---

# Handoff: 1153 session: demo games, Pass-ended cases, audit fixes

## Current Focus

Three deltas landed in the ratified candidate, `candidate/pass-upsell-ratified.html`. Nothing is open with the owner. The next session should:
1. Check the audit fixes in the browser. They are untested: no verifier ran, because the base-relative path warning blocks it on this nested page.
2. Pass the one open item to the owner's main agent (below).

Everything before this session is background. The build's running record is `handoff-2026-10-16-pass-upsell-ratified-candidate.md`; this session added its last three sections.

## Task(s)

- **Ten demo games** (done). All Pass-only. They are demo fill, not product intent, and must be removed before merging. The list and the removal hooks are in the build handoff, under "Ten demo games".
- **Pass-ended player's games** (done). The owner proposed it; it is not ratified. State "Pass ended: every case" stages four cases. The owner accepted in words that "never Pass only" applies to the rows of every Pass-ended player, state 7 included.
- **Audit fixes, items 1 to 9** (done, unchecked by eye). Items 1 to 5 are ratified. Items 6 to 9 are the main agent's calls.
- **QA list** (done, owner's ask). This page's QA list was cleared to one check, "Pass ended: every case". `app/qa.jsx` is untouched.

## Critical References

- `CLAUDE.md`: the ratification rule, and the chat rules (≤150 words, one ask, the ask on the last line).
- `handoff-2026-10-16-pass-upsell-ratified-candidate.md`: the build record, the clicks, which calls are ratified.
- `decisions-2026-10-16-pass-upsell.md`: the ratified decisions.

## Recent changes

All in `docs/specs/1153-pass-upsell/candidate/`. Nothing in `app/` changed.
- `cand-pass-upsell-ratified-demo.jsx` (new): the ten games' data, covers, pages, chats and Library text. It loads after the store overlay.
- `cand-pass-upsell-ratified-bridge.jsx`: pushes the demo routes into `GS_ROUTES`, `GS_FOOTER` and `GS_ARRIVES`. Adds `KitCandidate.Screen`, which renders a demo page and hands every other route to canon's `GsArrival`.
- `cand-pass-upsell-ratified-store.jsx`:
  - `CPR_LAPSED` and `cprLapsedOf` (the Pass-ended cases), with `lapsed` in `CPR_DEFAULTS`.
  - Daily Groups staged as Pass-only: `CPR_STAGE.groups = 'pass'` and the restage block after Escape's.
  - `cprFirstState`: a Pass holder's Barrow follows `bwDone`.
  - `cprEditions`: any game with chapters counts.
  - `cprPlayed`: demo games are unplayed.
- `cand-pass-upsell-ratified-library.jsx`:
  - `cprNowCard`: Return only when the free part is used and the game was played with the Pass.
  - `cprLibRow`: Pass-ended rows, Groups "Pass only", the Pass holder's Barrow "Finished".
  - `cprNewFor`: New for you for a free player.
  - The listed filter hides Pass-only games from free players.
  - `CprBwRecent`: the "Your chapters" row for chapter 1.
  - `cprPzLibrary`: a copy of canon `pzLibrary` for word, groups and mystery, with "the Pass" as the only link.
  - The Pass line is hidden under "No game matches".
- `cand-pass-upsell-ratified-game.jsx` (`CprPlayBox`): no label or line for a Pass holder; no line under a Pass-only box.
- `cand-pass-upsell-ratified-aids.jsx`: state `pur-pass-ended-every`; `KIT_QA` cleared, holding one check.
- `pass-upsell-ratified.html`:
  - The demo script tag.
  - CSS hiding "Your streak comes with the Pass.".
  - Balanced wrapping on Library cards under 560px.

## Learnings

- **Unknown routes.** `main.jsx`'s `GsScreen` switch can't name new routes, and `GsNotFound` and `GsScreen` are lexical consts. A new route therefore needs `KitCandidate.Screen`. The stand-in for `main.jsx`'s `idx` and `backNav`: a route object counts as a new page, and a back step is a `history.state.gsIdx` that didn't rise.
- **Lexical names beat window overrides.** Canon calls lexical names (`PzNow`, `lbAccess`), so re-publishing them on `window` has no effect inside canon components. The candidate's `CprPzNow` therefore never rendered on the daily pages; `cprPzLibrary` keeps canon `PzNow` so nothing visible changes.
- **The path warning.** `ready_for_verification` always reports 53 missing files here: the `<base>` warning, which is a false positive at depth 4. It stops the verifier, so check by hand.
- **Staging the user's view.** `eval_js_user_view` with `buildStates(api).byId[...]` fails (`api.reset` missing). The working route is clicking the States index: "Open the states index", then the group button, then the row. Calling the setters directly sent the user to Sign in. Proposed for `GOTCHA.md` only with the owner's approval.

## Artifacts

- The build record: `handoff-2026-10-16-pass-upsell-ratified-candidate.md`, sections "Ten demo games", "A Pass-ended player's games" and "Audit fixes".
- This file.

## Action Items & Next Steps

1. Check each audit item with the clicks in the build handoff: Pass view, free view, Config → Subscription → Payment failed and Ending. Then check 390 px wrapping on the Pass-ended Casebook and Barrow pages.
2. Open item for the owner's main agent, not the owner: a Pass-ended player who opens Daily Groups from Library still sees canon's page with Play.
3. Before merging:
   - Remove the demo fill: the file, its script tag, `Screen`, the route push and the lines marked "demo".
   - Decide whether the cleared QA list returns.
   - Archive both Discover candidates, per `skills/candidate-build`.

## Other Notes

- The owner wants short replies, the page opened in the right state when asked to look, and no questions he has already answered. Don't ask him about anything in the audit brief.
- The owner hasn't ruled on items 6 to 9 of the audit, or on the Pass-ended rule itself. Don't record either as settled.
- The `uploads/` sweep from `CLAUDE.md` hasn't been run this session.
