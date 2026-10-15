---
date: '2026-10-14'
topic: 'canonical-row'
status: 'in-progress'
type: 'exploration'
---

# Handoff: canonical-row — ten ideas for one row on every list, awaiting the owner's pick

## Current Focus

The playground is built and open. Next: the owner picks an idea. After the audit the recommendation is **10b · Ladder, pinned time**, with **10c** as the owner's call for the wide rung. When they pick, fold it into the design system's `ListRow` (`components/surfaces/ListRow.jsx`, its CSS in `components/components.css`, `ListRow.prompt.md`, `rows.card.html`), then give the product agent a one-line prompt per change (rules in `CLAUDE.md`). Do not touch `ListRow` before the pick.

## Task(s)

- Done: researched every row use in the product (`/projects/9aec15ee-6c7b-496d-ae68-b88b64b5ccaf/app/`), the shipped `ListRow`, and `design-system/ui-design.md` (local folder; adaptive rules, No overhanging line, Consistent width, No mismatched shapes).
- Done: playground with ideas 0 (shipped ListRow) to 10, five surfaces, widths 320/390/640/960, a Worst case seed, and two views (one idea on every surface; one surface with every idea).
- Done: registered in `playgrounds.json` (ticket `canonical-row`, active, 2026-10-14).
- Planned: implement the picked idea in the DS; update the card and prompt; write the product-agent message.

## Critical References

- `CLAUDE.md`: playground placement, `<base href="../../../../">`, the false-positive missing-file warning, the rules for product-agent prompts, and that components come from the product's current code and copy.
- `docs/specs/canonical-row/notes.md`: where rows are used and why they drift.
- `components/surfaces/ListRow.prompt.md`: the current rules for row content (what goes in a row, library rows, sub rows). An idea that contradicts it (9 · Outcome first) has to rewrite it.

## Recent changes

- `docs/specs/canonical-row/playground/canonical-row.html`: the entry page; loads `styles.css`, `_ds_bundle.js` and the three modules below.
- `docs/specs/canonical-row/playground/pg-row-data.jsx`: cover SVGs (copied from `app/gs-data.jsx` GS_ART), seeds per surface (`CR_SEED`, worst case behind a flag), `CR_SURFACES`, `CR_IDEAS` (stance, cost, behaviour across widths, a readout on the four pains), `CR_PAINS`.
- `docs/specs/canonical-row/playground/pg-row-css.js`: CSS for each idea, built from three layouts: `S` stack, `G` gutter (with `GW` for wide), `L` ledger (CSS subgrid owned by the list); injected as `<style id="cr-ideas">`.
- `docs/specs/canonical-row/playground/pg-row-app.jsx`: `CRow` (one markup for every idea: `.cr-lead`, `.cr-t` > `.cr-g`/`.cr-n`/`.cr-m`, `.cr-f` > `.cr-r`/`.cr-w`/`.cr-x`, `.cr-go`), `crNest` (idea 8), `useFit` (idea 4 measures the list), `DsList` (idea 0, the shipped `DS.ListRow`), the surfaces, frames, rail and controls. State is kept in `localStorage` under `pg_canonical-row_v1`.
- `docs/specs/canonical-row/playground/pg-row.css`: base row styles, surfaces and playground chrome. The rail is docked from 1024px; below that it is a horizontal strip.
- `docs/specs/canonical-row/notes.md`: research notes.
- `playgrounds.json`: the new ticket entry, file kept in its compact style.

## Learnings

- Root causes of drift in the shipped row: `.no-note` centres when across both lines (`components.css`, `.mcp-row.is-slots.no-note>.mcp-row-when`), so rows with and without Replay differ. The wide columns are fixed (240/112/80/72 plus the end column), so long results get squeezed and unused columns stay reserved. There are two row modes (slots and meta). History is one RowList per day, so its days only line up because every width is fixed.
- The title is kept in separate parts (game, number, name) so each idea composes it. A real space text node goes before `.cr-m`, and `.cr-m` is inline-block. A wrapping title then breaks as "Escape ·" / "The Locked Study", never in the middle of a name. Idea 7 resets `.cr-m` to inline so its line clamp works.
- Dot separators in a wrapping run of facts: every item gets a 20px `::before` dot, the run has a -20px margin, and `clip-path` hides the dot at the start of each line.
- A result with no note beside it spans into the note's cell (`.cr:not(:has(.cr-x)) .cr-r{grid-column:r-start / x-end}`). This rule must be reset (`grid-column:r`) in every wide or ledger layout, or the result covers other columns.
- In the ledger, children need `grid-row:1`. The gutter's `grid-area` values would otherwise leave stale row lines under a subgrid. The selectors also need `.cr.has-lead` to beat the gutter's specificity.
- The `localStorage` guard blocks `removeItem`; to reset the playground, set the key to its defaults: `{opt:10,view:'opt',worst:false,widths:[320,390,640,960],surf:'history',w:390}`.
- Cross-project paths can't be read by `grep` or `run_script`; use `read_file` on `/projects/9aec15ee-…/app/*.jsx` directly.

## Artifacts

- `docs/specs/canonical-row/playground/canonical-row.html` (asset "Canonical row playground")
- `docs/specs/canonical-row/playground/pg-row-data.jsx`, `pg-row-css.js`, `pg-row-app.jsx`, `pg-row.css`
- `docs/specs/canonical-row/notes.md`
- `playgrounds.json` (updated)

## Audit (second pass)

See `notes.md` › Audit. In short: 10's narrow rung failed the Replay test, and the readouts overclaimed (1, 3, 5 and 10 are corrected). 10b and 10c were added and nothing was removed. The separator is now real text, and wide frames scale to fit. Screenshots can show false title wraps in the ledger, so verify the ledger in a browser.

## Action Items & Next Steps

1. Get the owner's pick (or a combination). Re-read `ListRow.jsx`, `ListRow.prompt.md` and the `.mcp-row*` block in `components.css` before changing anything.
2. If 10, 10b or 10c is picked (10b: the narrow rung is the pinned stack, `P` in `pg-row-css.js`; 10c: the ledger's title column is `auto` and the result is `1fr`): move the S/G/L layouts into `components.css` under `.mcp-row`/`.mcp-rows`, as container queries at 420 and 720px. Make `RowList` take section headings, so History can be one list whose day headings share the ledger columns. Split `title` into parts (`game`, `num`, `name`) or keep a string with an optional `kicker`. Remove the `no-note` centring and the meta mode, and keep `sub` rows.
3. Update `rows.card.html` to show the three shapes at their widths, with real product copy. Render it and compare with the product.
4. Run `check_design_system`. Write the product-agent message: one short line per change, saying what changed, why, and where to read it.
5. Not yet tested: the docked rail at 1024px and wider (the preview was about 924px wide), and how Safari renders subgrid.

## Other Notes

- The owner wants concise answers. Never invent copy: seeds come from `gs-data.jsx`, `gs-history.jsx`, `gs-editions.jsx`, `gs-discover.jsx`, `gs-casebook-data.jsx` and `gs-delve-library.jsx`. Times of day and a few dates (the Library worst case, the older Escape plays) are seed data.
- The Hunter game's days (36,000 Summers Ago) and the replays on a record page were left out of the surfaces. Add them if the owner asks.
- Archive the folder to `docs/archive/` when the owner closes the topic, and update `playgrounds.json` when you do.
