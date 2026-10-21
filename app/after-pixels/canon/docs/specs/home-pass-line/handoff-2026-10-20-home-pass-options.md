---
date: '2026-10-20'
topic: 'home-pass-line'
status: 'in-progress'
type: 'exploration (playground)'
---

# Handoff: home-pass-line — a stronger Pass on Home, options 0 to 4

## Current Focus

Waiting for the owner (and Jonny) to pick one of options 1 to 4 to take forward. Nothing is decided. Next session: act on the pick (refine it in the playground, or ask before taking it into `app/`).

Brief (owner, relaying Jonny, 2026-10-20): the Pass line halfway down Home should be stronger. It could move to the top, or just be more visual. Selling the Pass matters, but it must stay elegant, mobile-first and not too overt. Four alternatives in a playground.

## Task(s)

- Done: playground with today (0) and four options, in the real app, signed out.
  1. **In the hero.** A `WHAT’S FREE` label and the account/Pass line (`CprPassPara`) sit above Works with, set the same way (label + muted line). The mid-page band goes.
  2. **A Pass card.** Same place as today. `DS.Card` with a 120×76 shape block top right (indigo, four cover-colour bars), heading, line, price (`GS_PLAN`), pay line.
  3. **Straight after the hero.** The band moves above Available games. Price set at 24px beside the line from 900px, under it on a phone.
  4. **Shown in the games.** The band stays mid-page and adds `DS.CardRow kind="tiles"` of every Pass-only game (`CPR_STAGE[k] === 'pass'`), each a `GsTile` with its Pass mark.
- Done, round 2 (after the owner's first notes): 1A, 1B, 4A, 4B added to the strip.
  - **1A** The free line and Works with in one block under one rule (`.hpl-facts`), 12px apart, the free line at the copy column's full measure: two lines on desktop.
  - **1B** The same block as two columns from 640px.
  - **4A** No Pass band. Available games gets the CardRow `sub` sentence: the Pass mark (`.mcp-passmark`, static) as a key, then the Pass line (`HplKey`).
  - **4B** As 4A, plus the Pass mark as a link on the hero picture's top right, where a card draws it (Casebook is a Pass game).
- Each option has a stance and a cost, shown under **Why** in the strip (`HPL_OPTS` in the module).
- Not done: a check at phone width (the Config pill's Viewport: Mobile). Only 1, 2 and 3 were looked at on desktop.

## Critical References

- `docs/specs/1153-pass-upsell/handoff-2026-10-16-home-pass-line.md`: the ratified one-link rule ("the Pass" inside the line is the only link, no Get the Pass button) and how the line is built (`cprPassLine` in `app/gs-pass-store.jsx`).
- Design law: `/projects/ef1abd5b-…/guidelines/visual-foundations.md` (shape block for surfaces with no cover, flat fills, no gradients) and `voice.md` (selling pages: plain words, lead with what you get).

## Recent changes

- `docs/specs/home-pass-line/playground/index.html`: copy of root `index.html` with `<base href="../../../../" />`, a playground `<style>` block (classes `hpl-*`) and one script after `app/gs-pass-aids.jsx`.
- `docs/specs/home-pass-line/playground/pg-hpl-home.jsx`: re-publishes `GsHome` as `HplHome`. The option store is under `localStorage` `pg_home-pass-line_v1` (default 1). The black bottom strip (0–4, Why, Show, Hide) is mounted in its own root.
- `playgrounds.json`: new ticket `home-pass-line` at the top, generated 2026-10-20.
- `app/`: nothing changed.

## Learnings

- The preview warns that 52 files are missing for this entry. The warning is a false positive: the depth is 4, which matches `docs/specs/home-pass-line/playground/`. The page was loaded and rendered.
- Canon's `CprHome` (`app/gs-pass-home.jsx:34`) takes no slot. The hero and the games band are copied into the module (`HplField`, `HplHero`, `HplGames`). If canon's hero changes, the copy drifts.
- The screenshot tool draws the fixed strip at odd heights. In the real browser it is pinned to the bottom.
- `DS.Card` doesn't pass on `data-*` props, so the ring target is the inner `.hpl-card-in`.

## Artifacts

- `docs/specs/home-pass-line/playground/index.html`
- `docs/specs/home-pass-line/playground/pg-hpl-home.jsx`
- `docs/specs/home-pass-line/handoff-2026-10-20-home-pass-options.md` (this file)

## Action Items & Next Steps

1. Get the owner's pick of 1 to 4 (or a combination, e.g. 1 with 2).
2. Check every option at phone width (390) with Config → Viewport: Mobile, in particular the 2 card's shape block beside the heading and the 3 split.
3. Put the unratified copy and calls below to the owner, one at a time.
4. Once an option is accepted in words, ask before taking it into `app/gs-pass-home.jsx`. The ticket needs a tracker id, then this folder is renamed.

## Owner's first notes on the options (2026-10-20, not a pick)

- **General:** getting to the Pass early feels good.
- **1:** likes the extra room it gives the video top right. Too much text in a row, though. Worth a 1A / 1B: tighter margins so the line runs to two lines, and a more elegant treatment.
- **2:** nice, but the shape block reads as money-oriented, and it's one more card among many.
- **3:** reaching the Pass sooner counts for it, but it looks a bit wonky and reads as one more row. Could be fixable; not drawn to it.
- **4:** interesting, but needs a bigger idea. Don't list every Pass game; Available games already shows a chosen set and already marks what's behind the Pass. Avoid one more row at the bottom.

## Owner's second notes (2026-10-20, not a pick)

- **1A:** cleaner. Works with should share the free line's measure (fixed: both full width).
- **1B:** interesting: lengthens the picture a touch and fits the content. Wants its own playground on how What's free and Works with work best together, possibly as a pattern.
- **4A:** interesting, needs tweaking. Add a few Pass games so one or two land in the first four (done in 4A/4B only: `HPL_KEY_GAMES`, Groups 2nd, hunter-gatherer 4th; canon's `GS_HOME_GAMES` untouched). The key's Pass mark should not be a link; it would repeat "the Pass" link in the line.
- **4B:** read as doing nothing; the hero mark is easy to miss.

## Other Notes

Drift to check before merging (owner, 2026-10-20):
- The main build (`index.html`, `app/`) has moved on since this playground was made. The playground copies canon's hero and games band (`HplField`, `HplHero`, `HplGames`), so diff those against current `app/gs-pass-home.jsx` and `gs-home.jsx` before taking any option in.
- The product now has a name, **After Pixels**. The playground's copy may still use the old working name; check every string on merge. No renaming has been done here yet, by the owner's choice.


Calls made without the owner's ruling (all open):
- Label `WHAT’S FREE` (1), row title "Comes with the Pass" (4).
- Price on Home (2, 3), read from `GS_PLAN`. Today's Home shows no price.
- Pay line kept on Home in 0, 2, 3 and 4 as canon has it, and dropped in 1. Whether it stays on Home was already open (1153).
- Shape block colours in 2: cover orange, lilac, cream and the success green on indigo. The green is a status colour, which may break the rule that keeps status colours apart from art. Swap it for a cover colour if challenged.
- 4A and 4B drop the Pass band, so Home loses the pay line and the Pass heading.
- The Pass mark used as a key in running text (4A, 4B) is a new use of a design-system part, not one the system names.
- Row 4 lists every Pass-only game, including the ten in `gs-more-games.jsx`, so it grows with the library.
