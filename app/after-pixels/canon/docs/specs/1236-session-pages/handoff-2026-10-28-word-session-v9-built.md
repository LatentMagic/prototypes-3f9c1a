---
date: '2026-10-28'
ticket: '1236'
topic: 'word-session-v9-built'
status: 'landed'
type: 'implementation'
---

# Handoff: Daily Word's session card, v9 picks built into the main build

## Current Focus

Daily Word's session card is settled and built. Next: **the library game page's now card** for Daily Word, with the result statement carried down to it. The open question is the chip (the store's Tag, as on the session page) or Escape's plain green text. The owner leans towards Escape's. Not yet asked this session: put it to him first.

## Task(s)

- Done: `playground/word-v9.html` + `pg-wd9.jsx`. It is the whole main build with a fixed bar at the top of the window, in place of the top bar's Discover / Library / History links (hidden there only). The groups are Rule (One rule 24, One rule 20, Pick each), Desktop (S, S2 20, S3 24, S5 32, S6 40), Phone (P16 to P32: chip to rule and rule to board only) and Hint marks (dotted, none, N2 inset a quarter tile). Viewport and Platform stay in Config.
- Done, in the main build, all ratified by the owner on 2026-10-28:
  - **The rule:** a faint rule (`1px solid var(--line)`) between the result tag and the board, 20px either side at every width. It lies flat under the tag below 900px and stands upright beside it from 900px. "20 on either side. Build it." The card's own padding is unchanged: 16 on a phone, 24 from 640px.
  - **The hint tile is grey:** `#918B80` dashed edge, `#ABA79E` letter.
  - **The hint's inner space:** 2px more padding each side on desktop. On a phone the row keeps its height, and the letter sits 1px above "Hint" (was 4), so the tile stays a rectangle.
  - **No marks either side of the hint (D5).** The dots clashed with the hint's dashed edge.
  - **In progress shows only the rows played.** The "In progress" tag carries the rest.
- His words for the batch: "everything from the playground", and "yes" to the In progress rows.
- Done, a defect fix: **an open session page now follows Config → This edition and the demo bar.** He opened today's Daily Word from the library game page, switched This edition to In progress, and the page didn't change, because it kept the id it was opened with. Now a session page showing this edition's play swaps to whatever Config picks, while it is open: in progress, or Average / Hard / Failed. An earlier edition's page is left alone. It covers every game on `PZ` / `DP_PZ`, plus Escape and Delve. Checked on Daily Word: finished → In progress → Failed.

## Critical References

- `CLAUDE.md`: the page rules for session pages and library game pages (the four-card grid), and the ratification rule.
- `docs/specs/1236-session-pages/README.md`: rules for every session page.
- `handoff-2026-10-27-escape-library-card.md`: Escape's now card, the model for Word's.

## Earlier handoffs

- `handoff-2026-10-28-word-session-v8-canvas.md`: the v8 canvas, its options, and the rulings that led to v9 (chip above on a phone, even spacing, never lose the card's padding). It has a short addendum of this session's builds.
- `handoff-2026-10-28-word-session-v7-result.md`: how the result statement became the store's Tag, and every rejected result idea.
- `handoff-2026-10-28-word-session-v6.md`: the agreed tiles, hint and numbers.
- `handoff-2026-10-28-word-asset-and-edition-picks.md`: the Daily Word cover, and Config → This edition.
- `handoff-2026-10-27-word-session-into-app.md`: the first Word board (later rejected).
- `handoff-2026-10-27-session-page-areas.md`: the three areas of a session page, and the owner's brain dump.
- `handoff-2026-10-27-escape-session-playground.md`, `-pass-2.md`, `handoff-2026-10-27-escape-session-v3.md`, `-v4.md`, `-v5.md`, `handoff-2026-10-27-escape-lock-row-v2.md`: Escape's session page rounds.
- `handoff-2026-10-27-escape-into-app.md`, `handoff-2026-10-27-escape-library-card.md`: Escape in the app, and its now card.

## Recent changes

- `index.html`, Daily Word block (about lines 1513–1565):
  - `.wd-card`: the base gap is 20 (was 16).
  - `.wd-dots`: no border.
  - `.wd-t.is-hint`: grey, with padding `clamp(…) + 2px`.
  - Phone rule: hint gap 1px.
  - `.wd-res`: `padding-bottom: 20px; border-bottom: 1px solid var(--line)` (was `margin-bottom: 8px`), with a KEEP comment.
  - From 900px: `column-gap: 20px` (was 32); `.wd-res` stretches, with `padding-left: 20px; border-left`.
- `app/gs-session.jsx`: new `gsThisEdSid(gs, sid)` above `GsSessionRecord`, with a KEEP comment. `GsSessionRecord` reads `sid` from it in place of `gs.route.id` (5 places).
- `app/gs-puzzles-library.jsx:122`: `c.todayBase` keeps the seeded today id, so `gsThisEdSid` can recognise this edition's plays.
- `app/gs-word.jsx`: `wdRead` no longer returns `spare`, `WdSlots` is gone, `WdBoard` draws only the rows played, and the comments are updated.
- New: `docs/specs/1236-session-pages/playground/word-v9.html`, `pg-wd9.jsx`.
- `playgrounds.json`: the v9 entry under 1236.

## Learnings

- **"Spacing" on a phone meant the gaps around the rule, not the card's padding.** v8 read his "even spacing" as one step for padding and gaps alike, so P24 and P32 shrank the tiles, which he saw as "zooming out". When he talks about spacing, ask which space before you widen the card's padding.
- **When he says build, build everything the playground shows that he has looked at,** unless he excludes something. Building only the rule cost a round.
- **When he reports a defect, check what he actually did before explaining it away.** I told him he was on an older day (true of v9, not of his path), and he was rightly annoyed. Reproduce his clicks first, then answer in one line.
- Top-level `const`s in the app's babel scripts (`ES_SIDS`, `PZ`, `DP_PZ`) are shared by name across scripts but aren't always on `window`. Guard them with `typeof X !== 'undefined'`, not `window.X`.
- **He wants to see a proposal as a switch, not read about it** ("I need to see it… just a new option").
- **He prefers as little adaptive styling as possible.** One value at every width won (20); only the rule's direction follows the existing layout switch at 900px.
- **v9's harness:** loading `pg-wd9.jsx` before `app/main.jsx` lets it wrap `window.ConfigExtra` and `window.buildStates` (`window.pg9Api` exposes the stager's setters, `setPlatform` included). Its own `KitCandidate.bind` opens the hard play signed in with the Pass. Reuse this for the now-card playground.
- The phone frame (`.kit-phone`, `height: min(872px, 100vh - 48px)`) needs the bar's 56px taken off, or it runs past the window. `word-v9.html` does this.

## Artifacts

- `index.html`, `app/gs-word.jsx` (built); `app/gs-session.jsx`, `app/gs-puzzles-library.jsx` (the Config fix)
- `docs/specs/1236-session-pages/playground/word-v9.html`, `pg-wd9.jsx`
- `playgrounds.json`

## Action Items & Next Steps

1. Ask the owner which treatment the now card's result gets: the chip, or Escape's plain green text. Never ask cold: say where the now card is and what it shows today.
2. If he wants to see them, build a v10 playground on v9's harness (`word-v9.html` / `pg-wd9.jsx`) that opens the Daily Word library game page, with the options as switches in the top bar. Keep the four-card grid rules in `CLAUDE.md`.
3. Spot-check the Config fix on Groups, Mystery, Escape and Delve: open today's play from the library game page, then switch This edition and the demo bar. A seed quirk: Daily Word's head date reads "Tue 6 October, 08:05" for some picks and "Tue 6 October" for others. Not raised with him.
4. Check the built session card at phone (390) and desktop (1280 × 900, 1280 × 800) on all four plays: States → "7. Session page: Daily Word…".
5. The QA entry `word-1236` (`app/qa.jsx:187`) stays until he signs off. Its note may still mention empty rows or dots; update it then.
6. Ask whether this earns a `CHANGELOG.md` entry. It's probably iterative, so likely not.

## Other Notes

- He is frustrated by repetition, lost requests and long replies. Keep replies short and ask one thing. Answer a question in words; build only when he asks to see it.
- v8 (`word-v8.html`) is superseded by v9 but is still listed in the launcher. Switch it off only if he asks.
- Not ratified: anything about the now card.
