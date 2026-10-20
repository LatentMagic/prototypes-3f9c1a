---
date: '2026-10-13'
ticket: 'LM-1110'
topic: '1110-daily-word-mystery-content'
status: 'in-progress'
type: 'implementation: review with the owner done, rulings built in the candidate, checks not re-run'
---

# Handoff: LM-1110, the owner's review of the checks, and what is left

The owner walked through every failing check on 2026-10-13, one at a time, and ruled on each. The rulings are below, with what was built for them. The build itself, the full measurement tables and the samples are in `handoff-2026-10-12-daily-word-mystery-content.md`. This file does not repeat them.

## Current Focus

All review items are ruled. Next: **re-run the full set of checks** on the candidate (they have not run since today's changes), then report only what still fails, one item per turn. The owner had been asked "Should I run the full set of checks now?" and moved to a new session instead.

**Scope (owner, 2026-10-13):** only Daily Word and Daily Mystery are real. Every other game is made up until the owner says otherwise. Skip faults that only concern other games' content.

**How the owner wants to work:** one thing at a time, each with the route to it, a recommendation, and one question. Don't edit the candidate while the owner is reviewing it without saying so first, and never reload their preview (see Learnings).

## Task(s)

- Done: brief items 1 to 8 in the candidate (`docs/specs/1110-daily-word-mystery-content/playground/`). Six new states are in `app/states.jsx`, the QA entry in `app/qa.jsx` (`only: 'PG_1110'`), the ticket in `playgrounds.json`.
- Done: the owner's review of F1 to F6, O1, O2 and W (rulings below).
- Done: `measure.js` changed for the rulings (S11, S12, S13).
- Not done: re-running the checks.
- Not done: the home hero moved onto `GsChatScroll`.
- Not done: the design-system proposal carried upstream.
- Not done: the look checks P1 to P5 (a separate session runs `validate-ui`).
- Not done: carrying the candidate into `app/`.

## Critical References

- `CLAUDE.md`: the ratification rule, and § Designing.
- `docs/specs/1110-daily-word-mystery-content/handoff-2026-10-12-daily-word-mystery-content.md`: the build, the wording list, the full tables.
- `docs/specs/1110-daily-word-mystery-content/measure.js`: the checks, as code.
- The design system's guidelines: `/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/guidelines/` (`voice.md`, `layout-and-patterns.md`).

## Rulings, 2026-10-13 (all by the owner, in words)

### Chat pictures (F1)
- The three chat pictures on a product page scroll, using the home hero's pattern. It is built as one shared part, `GsChatScroll` in `playground/pg-1110-late.jsx`:
  - default height 290px; a `fill` prop stretches it to its box
  - opens on the latest turn and scrolls back
  - `GsChatRow` uses it
  - CSS: `.gs-chatscroll` rules at the end of the candidate block in `playground/index.html`
- The owner called it "phenomenal" and, with the scroll bar, "perfect".
- The pill:
  - arrow only, no text; its spoken name is "Back to the start"
  - 28px tall, 12px from the top
  - the home pill's shadow (one layer, `0 4px 12px rgba(0,0,0,.18)`)
  - on hover: the background tints towards `--c-send-fg` and it rises 1px; on press it shrinks to `.97`
  - an invisible `::before` keeps the tap area 44px tall
  - Rejected: a 44px circle ("too large, looks like the submit button"), and a two-layer shadow ("too harsh").
- The owner asked for the home hero to move onto `GsChatScroll`, so its pill loses "Earlier in the case". **Not done.**
- S11 is rewritten in `measure.js`: one height, each opens on its latest turn, every turn reachable by scrolling, pill shown only once scrolled up.

### Wrapping (F2, F3)
- **`text-wrap: balance` is banned on blurbs and body lines.** It narrows every line and empties the right side. It must never be used to pass S9. All five candidate rules that used it are removed (`.gs-more > p`, `.lb-ach-sub, .gs-chatcap`, `.lb-lay > .lb-card > p`, `.gs-lines > li`, `.pge-panel > p`). No copy is to be lengthened to make up for it (the owner said "unimportant").
- These stay as they are: the play box's small line, the How it plays steps, and the Daily Word pitch heading's wrap at 390 ("right for a title").
- The soon cards, Daily Groups' heading and the 36,000 Summers Ago History row are out of scope (made-up games).

### Tap targets (F4)
- A link inside a sentence is fine if it passes WCAG AA. It does: 2.5.8 asks for 24 × 24 and exempts inline targets. S12 no longer counts these.
- Not ruled: the footer's Privacy (42.7 wide) and Terms (35.6 wide), and the More games title links inside cards that are themselves the target.

### More games (raised by the owner during F4)
- More games must scroll sideways whenever fewer than three cards fit across. Built: the design system's `CardRow`, sized as on the home page (`gs-row4`), with the other six games, then the soon cards, then an "All games" link to the store, in the home page's order. It lives in `GsGamePage`, overridden in `playground/pg-1110-late.jsx`.
- Known and handed to another agent with a prompt (not fixed here): in both card rows (home and More games) every card takes the tallest card's height, which leaves dead space. The home card's Daily Mystery blurb still wraps narrowly because of its own `balance` rule.

### H1 overflow (F5)
- Leave it. The overflow is 2px, and the box doesn't clip, so nothing shows. S13 allows a vertical overflow under 4px on h1 to h3.

### Editions list rows (F6)
- Fixed in the candidate: the rows share one height, the tallest's (`.ed-results .mcp-rows { display: grid; grid-auto-rows: 1fr; }`). The design system's `ListRow` is untouched. The owner said it "looks fine".

### Daily Mystery now card (O1)
- No progress bar. Questions aren't progress.

### Cards side by side, and the footer (O2)
- Cards side by side must end level. The shorter card takes the spare space at its foot. The candidate's `.lb-lay > :not(.lb-runcard) { align-self: start; }` is removed. The achievements stay one per row from 900px.
- The footer stays pinned to the foot of the window on a short page (`.gs-root > .gs-ft { margin-top: auto; }`, unchanged). A trial that made it follow the content left space below the footer, and was reverted.

### Wording (W)
- Keep all ten as built. They were checked against the game's facts. The three achievement lines (6, 7, 8) will be replaced when the designer supplies the full set.

## Proposal for the design system (agreed to propose; not yet upstream)
Write these into `guidelines/layout-and-patterns.md`, so every session reads them before building:
- No `text-wrap: balance` on a blurb or body line.
- Cards side by side end level.
- A chat picture has a default height, scrolls, opens on its latest turn, and shows an arrow-only pill once scrolled up. It can stretch to fill its box. (Proposal: build this into `ChatPicture`, which today only clips.)
- A row of game cards is a `CardRow` that scrolls sideways, followed by an "All games" link to the store, as on the home page.
- The footer stays pinned to the foot of the window on a short page.

## How the checks are run

**Runner.** `measure.js` runs in the parent page of the live preview (`eval_js_user_view`), not in the candidate.
- `pg10Run(states, sizes)` opens the candidate in one fixed iframe per size and calls `kitGoState(id)` per state.
- Each state waits 500ms, then up to 6s for `.mcp-loader`, `.gs-part-wait` or `[aria-busy]` to clear, then 500ms.
- A state written `share:<id>` also presses Share and waits 900ms.
- Results land in `window.pg10.out[state][size]`. `pg10Table(state)` prints PASS, FAIL or n/a. `pg10Story(size)` runs S14.
- Load: `const s=document.createElement('script'); s.src='docs/specs/1110-daily-word-mystery-content/measure.js?'+Date.now(); document.head.appendChild(s)`.
- 26 states × 3 sizes (1440 × 900, 390 × 844, 390 × 664) takes 4 to 5 minutes. Poll `pg10.status`. Never start a second run while one is going. Reloading the script resets `pg10.out`.
- It runs in hidden iframes, so it does not move the owner's own view.

**The checks, and where each is weak:**
- **S1 (no sideways scroll).** Solid.
- **S2 (More games cards in a row are one height).** Written for the old grid. With `CardRow` the cards are one row by design, so check the result makes sense.
- **S3 (parts start level).** Also written for the old grid (`.gs-grid3 > .gs-more` with subgrid, now unused on product pages). Expect it to read differently.
- **S4 (no dead space in a card).** Will now flag the shorter of two level cards (O2) and short cards in `CardRow`. The level-cards case is ruled. The card-row case is with the other agent.
- **S5 (achievement titles level in a row).** n/a: achievements are one per row from 900px.
- **S6 (a taller row has a reason).** The editions rows are now one height, so they should pass.
- **S7 (gaps are one token).** On a two-column grid, measure the gap between tracks, not between children's boxes.
- **S8 (side-by-side blocks share a top).** Solid.
- **S9 (no overhang).** The bar (last line ≥ 40% of the line above, ≥ 2 words) is my reading. Its remaining failures on Word and Mystery are ruled fine. **Never fix S9 with `balance`.**
- **S10 (a wrapped title not narrower than the line under it).** The Daily Word pitch heading is ruled fine.
- **S11 (chats).** Rewritten today (see F1).
- **S12 (tap targets at 390).** Inline links in a sentence are exempt from today. Footer links and More games title links still flag (not ruled).
- **S13 (no text cut).** h1 to h3 may overflow vertically by under 4px.
- **S14 (one story).** Compares surfaces against strings I typed into `measure.js` from the brief. If they disagree, the brief wins.
- **S15 (a heading is closer to its content).** Solid.

## Learnings

- **Don't disturb the owner's preview.** Saving a candidate file sometimes reloaded their view mid-review. Once I reloaded it directly, against `CLAUDE.md`. They found both very disruptive. Other saves did not reach their view at all, so they had to refresh. When a change is for them to see, say "refresh" and give the route. Check the result in your own iframe (`show_html`, `save_screenshot`), not theirs.
- **Footer trade-off:** on a short page the extra height goes above the footer (pinned) or below it (following). The owner chose pinned. Say this trade-off out loud before changing either.
- **`text-wrap: balance` was my S9 workaround, and the owner rejected it outright.** Fix a short last line by layout levers or leave it. Never narrow the box.
- **Overriding:** replace `window.X` in a module that loads after it and before `main.jsx` (`pg-1110-late.jsx`). Top-level `const`s from other modules (`GsPlayBox`, `GsFacts`, `GsCover`) are reachable from there, as the `GsGamePage` override shows.
- `GS_RESULT` overrides must load before `gs-history.jsx` (why `pg-1110-data.jsx` sits after `gs-puzzles-library.jsx`).
- The six new states in the main build are still unchecked. `session-mystery-earlier`, `edition-mystery-done` and `session-mystery-in-progress` depend on session ids only the candidate creates (`mystery-live`, `mystery-1004`, `mystery-e<i>`). Open all six in the root `index.html` before calling the register change safe.
- `session-word-earlier` opens #210 (generated), not the brief's #211 (`word-1005`). Ask whether to repoint it.
- GOTCHA candidate (needs approval): S7 on a two-column grid measures the gap between tracks, not children's boxes.

## Recent changes (2026-10-13)

- `playground/pg-1110-late.jsx`: `GsChatScroll` (new), `GsChatRow` (now uses it), `GsGamePage` override (More games as `CardRow` plus "All games").
- `playground/index.html`, candidate CSS block:
  - removed C1 (`align-self: start`), C4 and the four other `balance` rules
  - added `.gs-chatscroll` with the pill styles
  - added `.ed-results .mcp-rows` (one row height)
  - the footer is unchanged after the trial was reverted
- `measure.js`: S11 rewritten, S12 exempts inline links, S13 tolerates heading overflow under 4px.
- `uploads/` cleared (nothing referenced it). This session's screenshots in `screenshots/` deleted.

## Action Items & Next Steps

1. Re-run all 26 states at all three sizes. Report only real failures, one per turn, Word and Mystery only.
2. Ask about the two unruled tap-target items: footer link widths, and More games title links inside cards.
3. Move the home hero onto `GsChatScroll` with the arrow-only pill (owner asked). Show it, and wait for a yes.
4. Check the six new states in the root `index.html`, and ask about `session-word-earlier` (#210 vs #211).
5. Carry the design-system proposal upstream, with the owner's yes on the exact wording.
6. After ratification, carry the candidate into `app/` (map in the 2026-10-12 handoff, § What I'd do next). Delete the QA entry and the candidate `<style>` block after.
7. A separate session runs `validate-ui` for P1 to P5.

## Artifacts

- `docs/specs/1110-daily-word-mystery-content/handoff-2026-10-12-daily-word-mystery-content.md`
- `docs/specs/1110-daily-word-mystery-content/handoff-2026-10-13-checks-and-failures.md` (this file)
- `docs/specs/1110-daily-word-mystery-content/measure.js`
- `docs/specs/1110-daily-word-mystery-content/playground/index.html`, `pg-1110-data.jsx`, `pg-1110-late.jsx`
