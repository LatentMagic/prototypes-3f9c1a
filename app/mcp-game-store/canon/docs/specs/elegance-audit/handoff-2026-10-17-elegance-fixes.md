---
date: '2026-10-17'
topic: 'elegance-fixes'
status: 'in-progress'
type: 'implementation'
---

# Handoff: elegance fixes (one play record, Needs the Pass, one button width)

Date: 2026-10-17. Brief: the "elegance fixes" delta, pasted into chat on 2026-10-17. The example images it came with are in this folder (`what-stays-what-returns-library-hunter-pass-ended-*.png`); only the card in them counts, and its copy is placeholder.

Everything below is in `app/` and `index.html`. No candidate build, no rig. QA entry: **Elegance fixes, 17 October** (`app/qa.jsx`, key `elegance-fixes`). Delete it once signed off.

## Current focus

The build is done and waiting for the owner's sign-off. Next: rule on the three calls below (Summers Ago's card wording, Daily Groups' edition word, the Copy button inside fields). The owner ruled on the Filters button on 2026-10-17: it stays full width under the search field on phones.

**After the build: the push banner on phones** (`index.html`, `.gs-pushask-in > p`, under 720px). Settled by the owner on 2026-10-17, after three rounds: **centred, no padding beside it.** That means `text-align: center; text-wrap: pretty` and no `padding-left`. Don't add an inset to balance the ✕, don't left-align it, and don't go back to `balance`. The owner lost patience over this; treat it as settled.

## Design system

- All three parts the brief named were in the design-system project: `components/surfaces/NeedsPass.*`, the 640px button rule (`guidelines/visual-foundations.md`, Layout; built into `Button`/`ButtonPair` in `components.css`), and the empty-filter line (`guidelines/ui-standard.md`, Designed empty states).
- `_ds/` was brought up to the design system's current build, as published at its project root on 2026-10-17: `_ds_bundle.js`, `_ds_manifest.json`, `components/components.css` and `readme.md` replaced. Tokens were already identical. The cache key in `index.html` is now `?v=ds-2026-10-17` (was `chat16`).
- **Faults in the design system itself** (fixed app-side for now; carry them back):
  1. The button rule and NeedsPass's stacking are `@media` queries on the window, so they never reach the phone frame (Config → Viewport: Mobile in a wide window). `index.html` mirrors both as `@container gs` rules.
  2. NeedsPass's foot (`.mcp-npass-foot`) shrinks to its content inside a `align-items: flex-start` column, so under 640px its button is not full width. App fix: `.mcp-npass-foot { align-self: stretch }`.
  3. CardRow lines up GameCards (subgrid) but not GameTiles (`kind="tiles"`), so a wrapped tile name pushes its kind line down. App fix: the same subgrid for tiles, plus `text-wrap: balance` on the tile name. Belongs in CardRow.

## What changed, and where to look

1. **One play record.** `app/gs-history.jsx`: `PH_FIRST` (now with Escape's first room), `phFirstSt`, `phFirstRec`, `phPlayedOn`, `phFirstAch`. The free first case, scene or room has one record in the play log: not started, in progress or ended, switched by the same control as this week's play (`cprFirstState` reads `lbWeekDone`). History and the game page's plays list (`phVisible`), the editions list (`edList`), the case page (`cbFirstOf` in `gs-casebook.jsx`), the head card (`CPR_FIRST` in `gs-pass-library.jsx`), the Library rows (`gsLibRow`, `cprLibRow`) and the first edition's achievement dates all read it. New in-progress records: `delve-first-live`, `escape-first-live` sessions. Library dates are now play dates (Casebook's first case: 3 Dec 2025, not 1 Dec). States: `pur-first-in-progress`, `library-casebook-free-in-progress`, `library-delve-free-in-progress`, `library-list-free-in-progress`, `pur-first-done`.
2. **Played-edition panel.** `gs-editions.jsx`: "See in History" is a full-width secondary button. `index.html`: every panel's scrolling body has 4px of padding (offset by a −4px margin so nothing moves), so a focus ring is never clipped. States: `edition-word-done`, `edition-mystery-done`, `edition-casebook-done`.
3. **Unfinished session page.** `gs-session.jsx`: game name small, "Not finished" the H1, the date chip shortened as the other heads do. States: `session-groups-unfinished`, `session-delve-unfinished`.
4. **Needs the Pass.** `LbNeedsPass` in `gs-pass-library.jsx` wraps `DS.NeedsPass` and fills it from the play record (last play date, editions played, achievements earned) or, for never-had, the achievements total. It replaces `HgClosed`, `CprReturn` and `CprClosed` (all deleted, with their CSS). It takes the now card's grid place; the Barrow's spans the row as its chapter card does. States: `library-hunter-pass-ended`, `library-hunter-pass-ended-today`, `fp-hunter-library-lapsed`, `library-casebook-pass-ended`, `library-delve-pass-ended`, `fp-casebook-library-lapsed`, `fp-delve-library-lapsed`, `pur-pass-ended`, `pur-pass-ended-every`, `library-groups-free` (never-had). Account: `gs-billing.jsx`, `pass-card-lapsed` reads "Get the Pass again".
5. **Empty filter or search.** Library (`gs-pass-library.jsx`), Discover (`gs-pass-discover.jsx`) and History (`gs-history.jsx`, now outside the box) show "Nothing matches that." and a Clear all link (`.gs-nomatch`). `filter-empty-discover` now sets `kind`/`rhythm`; both filter states now use Adventure + Daily, which matches nothing (Learning + Daily matched Daily Pin on both pages). State labels updated to match.
6. **Cover art.** `GsCover` takes `fit` (`gs-parts.jsx`); the product page's hero uses it. See choices below. States: `casebook-pass`, `casebook-free`.
7. **One button width.** `index.html`: the container mirror of the system rule; the per-surface width rules (`.gs-hero-act`, `.gs-buy`, `.gs-card-acts`, `.gs-pair-even`, `.gs-acts`, `.gs-pass-foot`) are removed. Under 640px `.lb-acts` stacks with the link beneath its button, `.lb-pass` stacks, and the Filters bar wraps so its button sits under the search field. The top bar's wrapper carries the system's `mcp-menu-wrap` hook, so Menu and the account button keep their width.
8. **CardRow.** See design-system fault 3. State: `pur-new-account`, and Library at phone width.

## Choices this brief left to me

- **Cover fit (item 6):** the hero's art is drawn with `preserveAspectRatio` "meet", anchored by the art's declared extend (bottom-standing art to the bottom edge, floating art centred), on the art's own ground colour. The whole picture shows at any frame shape; the frame still follows the side card's height and nothing was added to the card.
- **Wrapped CardRow name (item 8):** the row shares three lines across its tiles (picture, name, kind) with CSS subgrid, as it already does for game cards; names balance across their lines, so none ends on a lone word.
- **Repeats under the card:** on 36,000 Summers Ago, I dropped "That was the last day you played before your Pass ended." from the last-day card, because the Needs the Pass card above already says the player stopped there. The last-day card keeps its label, title, facts and link, which the card doesn't carry. Casebook, Delve, Escape, the Barrow and Daily Groups had no repeated line.

## Set by the brief, not ruled by the owner

- A play in progress hides what only an ended play has: result, Share, and the achievements it would earn. (The head card, the case page and the achievement dates already follow it.)
- The played-edition panel's one action is a full-width secondary button "See in History".

## Calls I made (need the owner's word)

- **36,000 Summers Ago has no editions,** so its card reads "LAST PLAYED · 17 SEP", "Play the whole game." and "You earned 6 achievements.", by the system's rule. The prompt's example passes `word="day"` for it, which would read "Play every day as it comes out." I followed the rule, not the example.
- **Daily Groups' edition word is "groups"** (singular and plural), so the card reads "Play every groups as it comes out." The data says the same word doesn't read in the play box either. Fixing it needs either a singular for Groups or a rule in NeedsPass; I left it.
- ~~The Filters button goes full width under the search field under 640px.~~ Ratified by the owner, 2026-10-17 ("filter width looks fine").

## Buttons left at natural width under 640px

- Menu triggers in the top bar (Menu, the account button): exempt by the rule.
- Popup actions (Close, Copy, Done, Clear): exempt by the rule.
- The Copy button inside a prompt or link field (`.gs-copy`, Connect and the play pop-up): it is part of the field, on the field's own row. Say if it should stack too.

## Not built, or still open

- **The Barrow has no play in History.** Its chapter-1 record, row (14 Oct) and achievement dates are still typed in `gs-pass-library.jsx`; they agree with each other but don't come from the play log. It has no in-progress form.
- **Pass holders' achievement dates** (`got` on `CB_ACH`, `DV_ACH`, `HG_ACH`) are still typed. Only the free first edition's dates come from the record.
- **The ten Pass-only games** (`gs-more-games.jsx`) have no Library game page. A player whose Pass ended sees them in Library, and their record page is the old player page with sample "played" content and no play control, so it shows no Needs the Pass card. They need a page.
- **The editions list's empty search** still says "Nothing matches that. Try a name…" with no Clear all. The brief named only Library, Discover and History.
- **Not verified by hand at every width.** The preview throttled timers too hard for a full sweep, so the button audit covered about a dozen states. `validate-ui` in a fresh session should walk the QA entry at 320, the phone frame and desktop.

## Learnings

- Babel scripts share one global lexical scope: a top-level `const` in one `app/` file is visible to the others when they run, but reassigning `window.x` doesn't change what other files see. To change a function, edit its source; you can't patch it by reassigning it.
- The design system's responsive rules are `@media` queries on the window; this app's are `@container gs`. Any system rule tied to width needs a container mirror in `index.html`, or it never reaches the phone frame.
- In the preview, `kitGoState(id)` stages a state from a script. Don't loop it over every state: timers are throttled and the sweep crawls (≈10 min for 196 states, never finished). Check states in small batches.
- Possible `GOTCHA.md` entry (not added; needs the owner's approval): the design system's `@media` rules miss the phone frame.

## Next

1. Carry the three design-system faults back to the design system.
2. Rule on the three calls above.
3. Give the Barrow a play-log record and the ten Pass-only games a Library page, so both read the record like everything else.
