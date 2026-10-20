---
date: '2026-10-15'
ticket: 'canonical-row'
topic: 'canonical-row'
status: 'in-progress'
type: 'implementation'
---

# Handoff: canonical-row — 19E approved and built into ListRow

## Current Focus

The owner approved 19E. `ListRow` in the design system is now 19E. Next: the product agent moves every row in the Game Store to the new props (prompt below). When the product has moved over and the owner signs off, archive this topic (`docs/specs/` to `docs/archive/`, update `playgrounds.json`).

## Task(s)

- Done: round 4 (`playground/canonical-row-4.html`), a copy of round 3 plus 19B (edition first), 19C (packed against the time), 19D (two lines at every width), 19E (19D with the result in ink).
- Done: owner picked 19E. Attacked it with hostile rows; fixed the gaps in the playground, then built it into `ListRow`.
- Done: `ListRow.jsx`, `ListRow.d.ts`, `ListRow.prompt.md`, the `.mcp-row` block in `components.css`, `rows.card.html`, and a new `rows-edge.card.html`.
- Planned: product adoption, then archive.

## Critical References

- `README.md` in this folder: the goal (one canonical row, every surface, every width) and the round rule (each round starts as a copy of the last).
- `components/surfaces/ListRow.prompt.md`: the rules as shipped.
- `CLAUDE.md`: product-agent prompts are one short line per change.

## Recent changes

- `components/surfaces/ListRow.jsx`: new props `game`, `replay`; `result` and `when` accept forms (longest first); the row fits its own text (game's name drops first, clean title cut, longest form that fits from 440, last form under 440); one console warning per problem; the accessible name is written from the full forms. `note` is deprecated (any value shows as Replay and warns).
- `components/components.css` (`.mcp-row` block): a slotted row is two 20px lines at every width, 62px; cover 56×42; when capped at 8rem; the 640px column layout is gone.
- `components/surfaces/rows.card.html`: History, Library, Every case, sub rows, states.
- `components/surfaces/rows-edge.card.html`: the edge-case rows at 320, 440 and 660, with a live check (row count, all 62px, no title wraps).
- Playground: `pg-row4-*` (19E strict rules, Edge cases in Worst case).

## Learnings

- A floating column comes from fixed slots that most rows don't fill. One two-line shape removes it at every width.
- On two lines, the game's name and the result blur when they share a voice. The result in ink with only the game quiet fixes it.
- A fixed width for when took 2px from "No mistakes" at 320; a cap (max-width) doesn't.
- Under 440 a long when ("Yesterday, 23:59") squeezed the title even inside its cap, so when also takes its last form under 440, as results do.
- A one-game list can't be detected from data (History splits days into separate RowLists), so the rule is tied to covers: the game's name shows only beside a cover.
- `_ds_bundle.js` recompiles at the end of a turn, so cards render the old row until then. The new row was checked by compiling `ListRow.jsx` directly in a scratch page (deleted): 24 edge rows, all 62px, nothing wrapped or cut.

## Artifacts

- `docs/specs/canonical-row/playground/canonical-row-4.html` (+ `pg-row4-app.jsx`, `pg-row4-data.jsx`, `pg-row4.css`)
- `docs/specs/canonical-row/notes.md` (round 4 sections)
- The component files above.

## Action Items & Next Steps

1. Send the product agent the prompt in Other Notes.
2. When it reports back, check History, Library, the game page's plays card, and every-edition lists at 320, 390 and 1024 against `rows-edge.card.html`.
3. On sign-off, archive the topic and update `playgrounds.json`.

## Other Notes

Product-agent prompt:

> The design system's ListRow is now the canonical row (two lines at every width; it fits its own text). Read `components/surfaces/ListRow.prompt.md` and move every ListRow in the product to it: pass titles and the game's name as parts, results and times as their forms, and Replay as on or off.
