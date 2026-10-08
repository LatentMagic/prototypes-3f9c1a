---
date: '2026-10-07'
topic: 'delve-two-pages'
status: 'in-progress'
type: 'exploration'
---

# Handoff: a game's two pages, the Delve playground

## Current Focus

The playground is built. The user hasn't reviewed it yet. When they come back, ask the open question first: on the public page, should the one action take a Pass holder who has played to Your Delve (options 1 and 2), or let them play an earlier scene (option 3)? Nothing is ratified.

## Task(s)

The brief arrived in chat (not saved as a PROMPT.md). It asks how a game's public page and the player's own page ("Your Delve") work together, using Delve only. It asks for three options plus today's page, each shown for four viewers.

Settled in the brief, do not reopen:
- There are two pages, and the public page reads the same for every viewer. Only its one action changes.
- Reading the public page never needs sign-in.
- Install information sits with each game; the connect steps stay as they are.
- The playground uses the existing design system and is throwaway.

Known (current positions):
- A shared result links to the public page.
- Playing needs an account, and the Pass needs sign-in.
- The leaderboard shows only the player and their friends. What it ranks on is undecided.
- Friends are added by username.
- Delve's streak counts weeks, and the Pass starts with a free month.

The options:
- **0 Today.** `GsGamePage id="delve"`, unchanged. There is no own page.
- **1 The button knows you.** The public action is the bridge: "Start free month", then "Play this week's scene" once on the Pass, then "Go to your Delve" once played. Your Delve exists only with the Pass. Left off the public page: this week's card and More games.
- **2 Signed in, Delve is yours.** Signed in, every Delve link opens Your Delve, and the public page is reached through "About Delve". Your Delve exists for every account and does the selling. The public page is lean.
- **3 One header, two tabs.** One header (cover, name, action) with About and Your Delve tabs. Your Delve opens first once played. Your Delve has no actions of its own; when played, the header action is "Play an earlier scene".

The stance, cost and holdings for each option are in `PG_OPTS`, and the per-viewer rules are in `pgAction` / `pgLandsText` / `pgReachText` (`pg-two-pages.jsx`, top of file).

## Critical References

- `skills/build-playground/SKILL.md`: the rig rules this follows.
- `CLAUDE.md` § Files: the `<base>` depth, which is four levels here.
- `CLAUDE.md` § product page rule (ratified 2026-10-07): copy on the public page must not excuse or qualify.

## Recent changes

- `docs/specs/delve-two-pages/playground/index.html`: a copy of the root `index.html` with three changes:
  - `<base href="../../../../" />` added
  - a `/* playground */` CSS block, which sets strip padding and moves the launcher to `bottom: 104px`
  - the module tag added before `main.jsx`
- `docs/specs/delve-two-pages/playground/pg-two-pages.jsx`: overrides `window.GsDelve` (the route) and `window.GsDemoBar` (a two-row strip that replaces the demo bar). Its Viewer row drives `setDemoView` and `setConnected`. Own-page navigation is `gs.go('delve', { page: 'yours' | 'about' })`.
- `app/` was not touched.

## Learnings

- Overriding `window.GsX` from a module loaded before `main.jsx` works: main resolves the globals at render time. This avoids adding slots to `app/`.
- `PgBox`, `PgFacts` and `PgFinished` are marked copies of `GsPlayBox`, `GsFacts` and `GsFinished` (not exported from `app/gs-game.jsx`). If a second playground needs them, export them from `app/gs-game.jsx` instead of copying again.
- The preview's "file not found" warnings for this entry are false positives. The depth is right, and tokens and the override rendered on first load.

## Artifacts

- `docs/specs/delve-two-pages/playground/index.html`
- `docs/specs/delve-two-pages/playground/pg-two-pages.jsx`
- localStorage key `pg_two_pages_v1` (option, viewer, strip open).

## Action Items & Next Steps

1. The user reviews the playground on a phone, then picks a direction or a mix. Record the decision here with the date once it's ratified.
2. A full check has not run (it was blocked by the path warning). Click through all 4 options × 4 viewers at 320, 390 and desktop, then reset `pg_two_pages_v1` to its defaults.
3. Known gap: option 0 shows "played" for both Pass viewers, because today's page doesn't know about first plays.
4. Undecided: the achievement names and classes, which are made up for the playground. The four seeded past scenes all open the one demo session.

## Other Notes

- No ticket id yet. Rename the folder when one exists.
- Seed data is the playground's own (`PG_RECENT`, `PG_ACH`, `PG_FRIENDS`). Nothing in it is canon.
