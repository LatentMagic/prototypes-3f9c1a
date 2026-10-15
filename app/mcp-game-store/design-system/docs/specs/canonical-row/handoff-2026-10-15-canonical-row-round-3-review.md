---
date: '2026-10-15'
topic: 'canonical-row'
status: 'in-progress'
type: 'exploration'
---

# Handoff: canonical-row — round 3 reviewed, 19 is the owner's lean, wide layout (768+) open

## Current Focus

The owner has reviewed round 3 (`docs/specs/canonical-row/playground/canonical-row-3.html`) and likes **19 Words give way, quiet result** up to 640px. The page is set up for their review: option 19, no rail (options in the header), all seven widths per surface. Three questions about 768+ are open and the owner wants a **conversation before any build** (see Action Items). A subgrid attempt at the wide layout was built without being checked, broke wide History, and was rolled back at the owner's request; they were angry about it. Rule for the next session: no structural change without checking 768 and 1024 before handing back, and when the owner asks a question, answer it first.

## Task(s)

- Done: round 3 built (16, 17, 18) and reviewed. Owner picked the direction of 16 and asked for 19 (16 with the result's words muted so Replay is the only ink on line two). Agreed: cut with "…" rather than grow the row.
- Done, from review: titles measured and cut in JS so the "…" never follows a space or "·" (`c3Fit`); 16/19 title "says as much as fits" (game · edition, then edition alone beside a cover, then cut) instead of a 440 rung; a row with nothing on line two centres its title (`has-r` class); Casebook demo rows carry a scenario only.
- Tried and dropped: shortening the year under 440 (1 Dec ’25) saved 12px, not worth a rule.
- Tried and rolled back: from 640, list-owned content-sized columns via subgrid, plus a 920 measure. The 920 rule was first put inside the `crl` container query, which cannot style its own container; moved out, it then showed the subgrid breaking History (heading rows tall, rows misplaced). Rolled back to fixed columns and 760.
- Ruled, owner pushing back three times: a row on a game's own page (Every word, Every case, Plays card) does not repeat the game's name. Every word's bareness is content; the candidate is the answer word once played. The owner may still want this revisited.
- Open: the wide layout (768+), three questions below.

## Critical References

- `docs/specs/canonical-row/notes.md`: all owner reviews and rulings for round 3 (sections "Round 3", "Owner review", "Owner review 2", "Owner review 3").
- `components/surfaces/ListRow.prompt.md` line 34: the measure rule ("about 760px of reading width, wider only for columns").
- `CLAUDE.md`: the `<base>` missing-file warning is a false positive (eight doubled paths listed every time); product-agent prompt rules.
- Earlier handoffs: `handoff-2026-10-15-canonical-row-round-3.md` (how round 3 was built), `handoff-2026-10-15-canonical-row-round-2.md`, `handoff-2026-10-14-canonical-row-playground.md`.

## Recent changes

- `playground/pg-row3-data.jsx`: option 19 added; 16/19 `adapt` text says "the title says as much as fits".
- `playground/pg-row3-app.jsx`: `c3Fit` (measured title cut, game's name dropped first in `.o16/.o19` beside a cover; runs in a layout effect with `ResizeObserver` and `document.fonts.ready`); `.c3-e` renders empty with `data-full`; `has-r` class; rail removed, "Option" segment added to the header; defaults `opt:19, view:'opt', widths: all`; storage key `pg_canonical-row-3_v3`.
- `playground/pg-row3.css`: `.o19 .c3-r{color:var(--muted)}`; `.c3:not(.has-r) .c3-t{grid-row:1/span 2}`; `.pg{display:block}` and wrapping strips; wide block is the original fixed columns (`minmax(0,1fr) 12rem 4rem var(--cqw) 20px`) and `.sf>.crbox{max-width:760px}`.
- `playground/pg-row-data.jsx`: Casebook seed rows lost their `num`; recipe "scenario · date · Played".
- `notes.md`: reviews, rulings, the rollback.

## Learnings

- A `@container` rule cannot style the query container itself; `.sf>.crbox` (the `crl` container) must be styled outside the `crl` query.
- `li{display:contents}` + subgrid rows needs borders moved to the row and heading `li`s kept as blocks spanning `1/-1`; the attempt still rendered wrong in History and was not diagnosed before rollback. If retried, build it in a copy and check 768/1024 first.
- `eval_js`/`screenshot` (agent viewport) were unavailable this session ("Agent viewport not ready"); `eval_js_user_view` and `screenshot_user_view` worked. Save and restore `window.scrollY` when scrolling the user's view.
- Owner's review style: they review with the thing in hand, scroll width by width, and want one page, no rail, every width visible. They ask questions and expect the answer stated first, in one line, before any action.
- Reset: set `pg_canonical-row-3_v3` to `{opt:19,view:'opt',worst:false,widths:[320,360,390,440,640,768,1024],surf:'history',w:390,voice:true}`.

## Artifacts

- `docs/specs/canonical-row/playground/canonical-row-3.html` (asset "Canonical row, round 3"), `pg-row3-data.jsx`, `pg-row3.css`, `pg-row3-app.jsx`; `pg-row-data.jsx` (Casebook seed)
- `docs/specs/canonical-row/notes.md`, `README.md`

## Action Items & Next Steps

1. Have the conversation the owner asked for on 768+, three decisions, no building until they pick:
   - The "wave": ragged titles before a result column at a fixed offset. Options: result follows the title (ragged results), or columns sized to the list's content (subgrid, retried carefully), or keep fixed columns.
   - The measure at 1024: widen from 760 to about 920 for the one-line (column) layout, per ListRow's "wider only for columns". Fits "The Night Train to Fort William".
   - White space on Your rooms at 768+: not the game's name (it's on Escape's page); either narrower columns or the card not spanning full width, which is the product's page layout.
2. Make exactly the chosen change, check 768 and 1024 in the user's view before handing back.
3. On a final pick, fold 19 into the design system's `ListRow` (prompt, `.jsx`, `components.css`, `rows.card.html`): container-query rungs, measured title cut, title parts (game, edition), short result prop, Cover sizes by line count, `has-r` centring, muted result words, fixed wide columns. Run `check_design_system`.
4. Product-agent message: one line per change, including supplying a short result for every outcome and title parts.
5. Still open from the owner: Every word rows feel bare; decide whether a word row carries the answer once played.

## Other Notes

- 320 must work; design target 375 to 390. History is a flat list in time order. Casebook rows are scenario or number, never both (product data bug, owner will fix in the product).
- The owner prefers concise replies and is explicit that they do not want to micromanage: turn each piece of feedback into a rule the row carries.
