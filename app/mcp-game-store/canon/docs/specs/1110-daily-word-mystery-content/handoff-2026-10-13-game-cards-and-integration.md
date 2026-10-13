---
date: '2026-10-13'
ticket: 'LM-1110'
topic: '1110-daily-word-mystery-content'
status: 'complete'
type: 'implementation: integrated into app/ and index.html; approved by the owner 2026-10-13'
---

# Handoff: LM-1110, game cards on the design system, and carrying the candidate into app/

This continues `handoff-2026-10-13-checks-and-failures.md` (the owner's rulings on the checks) and `handoff-2026-10-12-daily-word-mystery-content.md` (the build, wording and full tables). Read both. This file covers what happened after them: the design system's new game cards, built in the candidate, and the integration still to do.

## Current Focus

**Approved by the owner, 2026-10-13 ("This is completely approved").** This covers the integration, the design system's chat and card parts, "In your chat", and the product page copy delta. What's left is only cleanup, below under "After approval". It needs the owner's go-ahead per `CLAUDE.md`, because it deletes files.

### Cleanup (done 2026-10-13, owner's go-ahead)
- The LM-1110 QA entry is deleted from `app/qa.jsx`.
- The candidate folder (`playground/`) is deleted. `playgrounds.json` keeps the ticket with no rigs, so it shows as documents only.
- `measure.js` is deleted: it only ran against the candidate. Its checks are described in `handoff-2026-10-13-checks-and-failures.md` § How the checks are run, should anyone rebuild them against the root build.
- No `CHANGELOG.md` entry (owner, 2026-10-13).

### Still open
1. Propose to the design system: Discover's rows as a stated exception to "every row ends with All games", and `gsKeepLast` (a blurb's last two words kept together) as GameCard behaviour.
2. From earlier handoffs: `validate-ui` P1 to P5; the six LM-1110 states (`app/states.jsx`) opened in the root build; `session-word-earlier` (#210 vs #211); the Daily Word pitch history (`docs/specs/demo/PROMPT.md:205`); the LM-1110 brief itself is not in the project.

### Files this work touched (2026-10-13)
- `app/gs-data.jsx`: results, the six seeded sessions, Daily Word card line
- `app/gs-puzzles-library.jsx`: now card lines, achievements, generated Daily Mystery days
- `app/gs-session.jsx`: share text
- `app/gs-chats.jsx`: chats and captions; `GsChatRow` on `CardRow kind="chat"`, "In your chat"
- `app/gs-game.jsx`: product page copy, `gsFreeSmall`, More games row plus "All games"
- `app/gs-editions.jsx`: edition panel lines
- `app/gs-history.jsx`: `LbRecent` for a game never played
- `app/gs-parts.jsx`: `GsCard`, `GsPick`, `GsTile`, `gsKeepLast`; removed `GsChat`, `GsMe`, `GsAi`, `GsPanel`
- `app/gs-home.jsx`: `GsFeature` on `GsCard`; removed the hero's own scroll hook and pill
- `app/gs-discover.jsx`: removed `DcHead`, `DcPick`, `DcRowCard`, `DcTile`; picks in `mcp-gpicks`, wall in `mcp-gwall`
- `app/qa.jsx`: the LM-1110 entry, shown in the main build, then deleted at cleanup
- `playgrounds.json`: LM-1110's rig removed
- `index.html`: candidate styles in; old card, chat, scroll and pill styles out
- `_ds/mcp-game-store-design-system-ef1abd5b-7567-4e3c-8294-c78583fbe929/`: refreshed from the design system (bundle, manifest, CSS, tokens)
- `docs/specs/1110-daily-word-mystery-content/playground/` and `measure.js`: the candidate and its checks, deleted at cleanup
- `docs/specs/1110-daily-word-mystery-content/handoff-2026-10-13-game-cards-and-integration.md`: this handoff

**Integrated, 2026-10-13, same session (the owner asked for it after all).** The whole candidate is now in `app/` and the root `index.html`. See § Integration, below. What's left is **the owner's yes in the main build**: Home, Discover, Daily Word and Daily Mystery at phone and desktop width. After that come cleanup and a CHANGELOG question (Action Items).

The section below "Integration" is the earlier plan, kept for the record.

## Integration (done 2026-10-13)

- `app/gs-data.jsx`: `GS_RESULT` word and mystery losses read `Missed`. The six seeded sessions (`word-today`, `word-live`, `word-1005`, `mystery-today`, `mystery-live`, `mystery-1004`) are replaced by the candidate's. `GS_MYSTERY_QS` is new.
- `app/gs-puzzles-library.jsx`: the now card lines and three achievement lines. Generated earlier Daily Mystery days use the real grammar (`PZ_SUS`, `PZ_WPN`, `PZ_RMS`, `pzQn`, `pzAcc` replace `PZ_SUSPECTS`).
- `app/gs-session.jsx`: `gsShareBase` has Daily Word and Daily Mystery branches (brief item 4). `GsShareText` keeps a blank line.
- `app/gs-chats.jsx`: Daily Word and Daily Mystery chats. `GsChatScroll` is new, and `GsChatRow` now uses it.
- `app/gs-game.jsx`: Daily Mystery pitch heading and today line. More games is a `CardRow` (`gs-row4`), then the soon cards, then "All games".
- `app/gs-editions.jsx`: `PGE_INFO` word and mystery lines.
- `app/gs-history.jsx`: `LbRecent` shows the empty line for a game never played, and the old body is now `LbRecentList`.
- `app/gs-parts.jsx`: `GsCard`, `GsPick`, `GsTile` are new and exported. `GsGameCard` is `GsCard`.
- `app/gs-home.jsx`: `GsFeature` renders `GsCard`.
- `app/gs-discover.jsx`: `DcHead`, `DcPick`, `DcRowCard`, `DcTile` are deleted. The picks are in `mcp-gpicks`, the wall is `mcp-gwall`.
- `index.html`: the candidate's styles (old card CSS removed, the LM-1110 block added, comments updated). There's no `<base>` and no pg scripts.
- `app/qa.jsx`: the LM-1110 entry no longer needs `PG_1110`, so it shows in the main build. Delete it after the owner's yes.
- Checked in the main build at 1440 and 390 with no errors: the game-card numbers match the candidate exactly; three scrolling chats per product page; share text per brief item 4; generated cases in the real grammar; no "Not solved" left on those pages. Also opened `library-word`, `library-mystery`, `library-mystery-never-played` and `library-mystery-editions` with no errors.
- After integration (owner, 2026-10-13: "on mobile I cannot access all three"): "How it looks in your chat" is now the design system's `CardRow` (`GsChatRow` in `app/gs-chats.jsx`, title moved out of `GsGamePage`). On a narrow screen it scrolls sideways with Previous and Next; three across from a 1000px row. CSS `.gs-chatcrow` in `index.html`; the chat body is `overflow-x: hidden` so a sideways swipe moves the row. The old `.gs-chatrow` rules in `index.html` are now unused and can go.
- Design system update (designer, 2026-10-13), `_ds/` refreshed: ChatPicture scrolls itself and has the "Back to the start" pill; a row of chats is `CardRow kind="chat"`. `GsChatRow` now uses both. `GsChatScroll` is deleted. The home hero lost its own scroll hook and "Earlier in the case" pill (`useGsHeroScroll`), which the owner had asked for. The old `GsChat`, `GsMe`, `GsAi` and `GsPanel` are deleted, and so is their CSS, along with every `.gs-chatrow`, `.gs-chatscroll`, `.gs-chatcrow` and `.gs-hero-up` rule. Footer: already pinned (`.gs-root` column, `.gs-ft { margin-top: auto }`). "All games": Home and More games have it; Discover's Just added and Free to play are an exception: the all-games wall sits at the foot of the same page, so the case is covered (owner, 2026-10-13). Worth proposing to the design system as a stated exception to its "every row ends with All games" rule.
- Heading renamed "How it looks in your chat" → "In your chat" on every product page (owner, 2026-10-13), so it fits on one line beside the arrows at 390.
- Not touched: `playground/` still loads its overrides on top of the new `app/`, which is harmless. Delete the folder's candidate files after the owner's yes, then regenerate `playgrounds.json`.

## Delta: product page copy for Daily Word and Daily Mystery (2026-10-13)

Built straight into `app/`, because the candidate had already been integrated (the candidate loads `app/`, so it shows the same).

- **Daily Word** (`app/gs-game.jsx`, `app/gs-data.jsx`, `app/gs-chats.jsx`): card line, play box heading, pitch heading, both pitch paragraphs, chat 1 and chat 2 captions, all as given.
- **Daily Mystery**: play box heading, both pitch paragraphs, chat 2 caption, all as given.
- **Small line under Play**: one template now, `gsFreeSmall(edition)` in `app/gs-game.jsx`, giving "… your streak and your achievements are free with an account." for Daily Word, Daily Groups, Daily Mystery and Escape.
- `You already know today’s answer` appears nowhere in `app/` or `index.html`.
- **Reworded: none.** The card line "Six guesses to find today’s five-letter word." left "word." alone on its last line on the narrower cards (236 and 246px). Instead of rewording, `GsCard` and `GsPick` keep a blurb's last two words together (`gsKeepLast` in `app/gs-parts.jsx`), so it now ends "five-letter word." Two rewordings were tried and dropped: "Find today’s five-letter word in six guesses." and "Find today’s word: five letters, six guesses." Both still left one word at 246px.
- **Checked at 1440 and 390:** no changed line ends on one word. Card rows keep their heights (322 / 327). At 800 the Escape card's blurb has a short last line, but that's out of scope (made-up game).

## Earlier plan (before integration)

**Integrate the candidate into `app/` and the root `index.html`, in a fresh session (the owner asked for this).** Nothing in `app/` or the root `index.html` has been changed for the game cards yet. Everything below lives only in the candidate (`docs/specs/1110-daily-word-mystery-content/playground/`).

The owner saw the game cards in the candidate on 2026-10-13 and said "I am beyond happy". Take that as a yes to **the game cards as built in the candidate**. The owner then also approved the rest of the candidate for integration ("I think it's fine", 2026-10-13). Per `CLAUDE.md` § Ratification, the other open items in the earlier handoff (re-running checks, the home hero on `GsChatScroll`, the design-system proposal, the tap-target items) are still open. Don't count them as approved.

The design system's own instruction says: "This changes app/, so show the owner Home, Discover and the Daily Word and Daily Mystery pages at phone and desktop width, and get a yes before calling it done." That applies again after integration, in the main build.

## Task(s)

- Done (candidate): every game card now uses the design system's components (update of 2026-10-13, "one set of game cards").
  - **GameCard** in every CardRow: Home's Available games, More games on product pages, Discover's Just added and Free to play.
  - **GamePick** for Discover's two picks: a 3:1 picture, the label, name, blurb, tags, half the width each from about 730px, stacked on a phone.
  - **GameTile** in Discover's all-games wall.
  - **ListRow** in Library and History (already so).
  - Coming soon (`GsSoonCard`) unchanged, as the design system says.
- Done: `_ds/` refreshed from the design system source (bundle, manifest, `styles.css`, `components/components.css`, `tokens/`, `_adherence.oxlintrc.json`). The root build loads the same `_ds/`, so it already has the new components and CSS. It just doesn't use them yet.
- Done: measured in the candidate at 1440 × 900 and 390 × 844 on `home`, `games-free`, `word-free`, `mystery-pass`.
  - Every row's cards are one height. Picture, name and tags start level.
  - Tags sit centred in their line (a single line beside a two-line set is centred).
  - Pictures: 2:1 on cards, 3:1 on picks, 1:1 on tiles. Blurbs are 16px muted with normal wrapping.
  - No old card classes left. No console errors.
- **Not done: integration into `app/` and the root `index.html`** (Action Items 1 to 4).
- Not done: everything listed as not done in `handoff-2026-10-13-checks-and-failures.md` § Task(s), which still stands.

## Critical References

- `CLAUDE.md`: the ratification rule, § Designing, § Wrapping up (CHANGELOG: ask first; this is a candidate for an entry, since four card components became three design-system ones).
- The design system (read live, never copy in): `/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/components/surfaces/GameCard.prompt.md`, `GamePick.prompt.md`, `GameTile.prompt.md`, and the CardRow line in `guidelines/layout-and-patterns.md`.
- `docs/specs/1110-daily-word-mystery-content/playground/pg-1110-late.jsx:21-96`: the built game cards, which is what goes into `app/`.

## Recent changes (this session, candidate only)

- `playground/pg-1110-late.jsx:21-96`, new:
  - `window.GsCard({ id, mark })`: `DS.GameCard` with the art in `<div ref={useGsArtHost()}>`, the title as `gs-titlebtn mcp-art-link`, `mark` as a daily Tag, `GsTagList` as tags, class `mcp-art-host gs-host`.
  - `window.GsPick({ id, label })`: `DS.GamePick`, the same pattern plus `label`.
  - `window.GsTile({ id })`: `DS.GameTile`, square art, title `mcp-gtile-open mcp-art-link`, `kind={gsKind(g.category)}`. No mark: the design system says a tile has no tags, and `DcBody` never passed one.
  - Overrides that point the old names at them: `GsGameCard`, `GsFeature`, `DcRowCard` → `GsCard`; `DcPick` → `GsPick`; `DcTile` → `GsTile`.
  - `window.DcBody`: a copy of `app/gs-discover.jsx`'s `DcBody` with only two containers changed. The picks go from `gs-grid2` to `mcp-gpicks`, and the wall from `dc-wall` to `mcp-gwall`.
- `playground/index.html` (the copied part of the root CSS, not the candidate block):
  - Deleted `.gs-feat`, `.gs-feat-body`, `.gs-feat-body > :first-child`, `.gs-feat .mcp-cover-art`, `.gs-feat .mcp-art` and their comment.
  - Deleted `.gs-gcard .mcp-cover-art`.
  - Deleted `.dc-wall` (both), `.dc-tile`, `.dc-tile .mcp-cover-art`, `.dc-tile > .gs-coverbtn`, both `.dc-tile-name` rules, `.dc-tile-name:hover`, `.dc-tags`, `.dc-tile > .mcp-art, .dc-tile > .mcp-cover`.
  - Removed `.dc-tile-name` / `.dc-tile:has(...)` from five shared selectors (the `:active` link rule, the two cover hover rules, the three `.gs-host` stretch and focus rules), keeping the rest of each selector.
  - In the candidate block: deleted C3 (`.gs-grid3:has(> .gs-more)`, `.gs-grid3 > .gs-more`) and the earlier `.gs-more .mcp-art`.
  - **Kept**: `.gs-row4` (Home and More games size their row as four across), `.gs-grid2` (soon cards), `.gs-titlebtn` rules.
- Superseded in this session (don't use): `DS.RowCard`, then `DS.GameCard` with a `label` inside `.mcp-gcard-grid` for the picks. The design system replaced both with the current set within the hour.

## Learnings

- **The design system changed three times in one session** (RowCard → GameCard and GameTile → GameCard, GamePick and GameTile). Re-read its `components/surfaces/Game*.prompt.md` and refresh `_ds/` at the start of the integration session. If it has moved again, follow it and tell the owner what moved.
- **The owner couldn't see changes because I described them badly, not because they weren't there.** Twice I reported "done" while the owner was looking at something I hadn't changed (the root build, and Discover). Always say which build (candidate or main) and which page changed, with the route. Name rows by their on-screen heading ("Just added"), not by code names, and never use a term like "picks" without saying which cards they are.
- **Read the whole design-system message before building.** The first instruction covered Home and More games only, so Discover was left on old cards. The owner then widened it to "all card rows should match".
- **Overriding from `pg-1110-late.jsx` works for top-level `const`s in other modules** (`GsFeature`, `DcPick`, `DcBody`, `GsGamePage`): reassigning `window.X` before `main.jsx` takes effect, as the measurements confirm.
- **Measuring without moving the owner's view:** `eval_js_user_view` creates hidden iframes of the candidate per size, calls `kitGoState(id)`, waits about 3s, then measures. Run it async with results on `window.__rc` and poll, because a single call times out.
- **Tags centring is design-system CSS** (`.mcp-gcard-tags { align-content: center; align-self: stretch }`), not ours. If the owner asks "should this be centred?", that is where it's said.

## Action Items & Next Steps

Integration, in a fresh session (the owner's instruction):

1. **Refresh `_ds/`** and re-read the three Game* prompts and the CardRow line. Check that the bundle exports `GameCard`, `GamePick` and `GameTile`.
2. **Carry the game cards into `app/`:**
   - `app/gs-parts.jsx`: add `GsCard`, `GsPick`, `GsTile` (from `pg-1110-late.jsx:25-56`). Replace `GsGameCard` (`gs-parts.jsx:132`) with `<GsCard id mark />`. Export all four on `window` (`gs-parts.jsx:336`).
   - `app/gs-home.jsx`: `GsFeature` (`:7`) becomes `<GsCard id />`. Remove its now-unused markup. Line 125–126 stays.
   - `app/gs-discover.jsx`: delete `DcHead`, `DcPick`, `DcRowCard`, `DcTile` (`:17-58`). Use `GsPick`, `GsCard`, `GsTile` directly. `DcBody`: `gs-grid2` → `mcp-gpicks` (`:85`), `dc-wall` → `mcp-gwall` (`:101`).
   - Check no other file uses `DcHead`, `gs-gcard` or the removed classes (grep `app/`).
3. **Root `index.html`:** make the same CSS deletions as in Recent changes (root line numbers as of today: 448–450, 456, 460, 1025–1031, 1034, 1040–1042, 1049–1053, 1078, 1269). Keep `.gs-row4` and `.gs-grid2`.
4. **The rest of the candidate: approved for integration by the owner, 2026-10-13** ("I think it's fine"). The map is in `handoff-2026-10-12…` § What I'd do next, item 2. Carry it after the game cards:
   - `GsGamePage`'s More games as `CardRow` plus "All games" (trial, owner asked)
   - `GsChatScroll` / `GsChatRow` (owner liked them)
   - the remaining candidate CSS block
   - the data in `pg-1110-data.jsx`
5. **Show the owner, in the main build,** Home, Discover, Daily Word and Daily Mystery at phone and desktop width. Give the route, say "refresh", and don't reload their view. Wait for a yes.
6. After the yes: ask about a `CHANGELOG.md` entry. Delete the QA entry and candidate files only once everything in the candidate is carried over or dropped.
7. Still open from the earlier handoff: re-run checks (S2 and S3 were written for the old More games grid and need rewriting for `CardRow` + GameCard), the two tap-target items, the home hero on `GsChatScroll`, the design-system proposal, `validate-ui` for P1 to P5, the six new states in the root build, and `session-word-earlier` (#210 vs #211).

## Artifacts

- `docs/specs/1110-daily-word-mystery-content/handoff-2026-10-13-game-cards-and-integration.md` (this file)
- `docs/specs/1110-daily-word-mystery-content/handoff-2026-10-13-checks-and-failures.md`
- `docs/specs/1110-daily-word-mystery-content/handoff-2026-10-12-daily-word-mystery-content.md`
- `docs/specs/1110-daily-word-mystery-content/playground/pg-1110-late.jsx`, `playground/index.html`
- `_ds/mcp-game-store-design-system-ef1abd5b-7567-4e3c-8294-c78583fbe929/` (refreshed)

## Other Notes

- **Scope:** only Daily Word and Daily Mystery are real. Blank space in rows caused by other games' copy (for example Casebook's tags wrapping to two lines) is out of scope.
- **The owner's way of working:** one thing per turn, the route to it, a recommendation, one question. Never reload their preview. Say "refresh".
- **Superseded in the earlier handoff:** "in both card rows every card takes the tallest card's height … handed to another agent" is resolved by the design system's GameCard. "The home card's Daily Mystery blurb … its own `balance` rule" no longer applies: the card is now the design system's, which wraps normally.
- `uploads/` cleared at the end of this session (two screenshots, not referenced).
