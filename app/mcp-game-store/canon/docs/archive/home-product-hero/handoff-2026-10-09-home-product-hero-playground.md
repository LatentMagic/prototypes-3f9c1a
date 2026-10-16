# Handoff: home hero, the product or a game

Date: 2026-10-09. Asked by the owner for Johnny. Nothing here is ratified.

## The question
The home hero sells one game (Casebook, home-hero option 9, ratified). Should the top instead sell what the product is better at, using the band line "Your AI does the talking. The game keeps the score." (home-how option 4, line c, ratified)? And how dense should the hero be?

## The rig
`playground/index.html` (with `pg-hero.jsx`) overrides `GsHome` and `GsDemoBar`; option 0 is the app's own `GsHome`. Nothing in `app/` changed. Strip: Option 0 to 3 (Why gives idea and cost), Density Roomy / Today / Compact. Key `pg_product_hero_v1`.

- 0, Today: one game at the top.
- 1, The promise, with play beside it: the line as H1, a subline on rules, dice and record, the Daily Word screenshot beside it.
- 2, Who does what: the line, then two short columns, your AI and the game.
- 3, The promise over the library: the line full width over the game covers; the screenshot moves to the how-it-works band.

In 1 to 3 the line moves to the top, so the lower band keeps only the Pass (1, 2) or the screenshot and the Pass (3). Density changes the hero's spacing and the gaps between bands; Compact also sets a smaller H1, which stays the largest type on the page.

## Open, for the owner
- Which option, and which density.
- "Second plate density" was read as hero density; say if something else was meant.
- New copy (the subline, option 2's columns, option 3's band heading) is draft and needs the voice pass.

## Checked
Desktop (924px) and phone layout (390px root) for every option; all three densities on options 0 to 2. No console errors. The automatic verifier can't resolve base-relative paths here; checks were by hand.
