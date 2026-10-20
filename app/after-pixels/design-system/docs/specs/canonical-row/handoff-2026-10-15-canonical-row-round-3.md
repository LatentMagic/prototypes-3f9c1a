---
date: '2026-10-15'
topic: 'canonical-row'
status: 'in-progress'
type: 'exploration'
---

# Handoff: canonical-row — round 3, three complete versions on settled slots, awaiting the owner's review

## Current Focus

Round 3 is built and open: `docs/specs/canonical-row/playground/canonical-row-3.html`, options 16 to 18 plus 0 (shipped ListRow). The owner asked for three complete versions that reflect every request so far, instead of reviewing round 2 first. Next: the owner reviews round 3 (and round 2 if they want it), starting with History at 320 and 390 in the default "One surface, every option" view. Take notes in `notes.md` while they review. Do not change `ListRow` until they pick. Rounds 1 and 2 are background: round 1 was rejected for History on phones; round 2 (11 to 15, 15b, 15c) is built but **unreviewed**.

## Task(s)

- Done: reflection across rounds 1 and 2 and the owner's notes. Conclusion: the owner's trailing-column rule (time alone centres on both lines; time and Replay take a line each) fixes the slots: title top left, result bottom left, time top right, Replay under it, cover and chevron spanning both lines. What remains open on a phone is arithmetic: a 320 frame leaves 154px per line, and the cover (68), chevron (32), time column (52) and full words don't all fit. So each round 3 option spends one of them and keeps the rest.
- Done: round 3 playground. 16 Words give way (12 finished: edition-only title beside a cover and short result under 440px of list width). 17 Chevron gives way (no chevron under 640; full words and game's name hold to 400; short forms under 400). 18 Picture gives way (a phone row names the game once: rows whose title names the game lose the cover under 440 and the words take its width; Library rows, which are the game, keep the cover; short result only under 360). All share two 20px lines (62px rows) under 640, Cover rule sizes (56×42 / 40×30), no-wrap titles with "…", and one line of fixed columns from 640 (title · result · Replay 4rem · time · chevron).
- Done: two new shared proposals, flagged in the lede for review: the title has two voices (game's name quiet, 400 muted; edition in ink 600), with a "Game's name: Quiet / Ink" toggle; page lists keep a 760px measure from 640 (ListRow's wide-screen rule).
- Done: registered in `playgrounds.json`, README and `notes.md` ("Round 3") updated.
- Planned: the owner's pick, fold into the design system's `ListRow`, product-agent message.

## Critical References

- `CLAUDE.md`: playground rules, the `<base>` false-positive warning (the missing-file check listed eight doubled paths for round 3; the page loads), product-agent prompt rules.
- `docs/specs/canonical-row/notes.md`: owner review of round 1, the trailing-column rule (2026-10-15), round 2 and round 3 sections.
- `docs/specs/canonical-row/audit-row-content.md`: the width budget and short forms every round 3 option relies on.
- `components/surfaces/ListRow.prompt.md` and `components/media/Cover.prompt.md`: 17 breaks "the chevron at rest says opens" on phones; 18 changes where a cover appears; the two-voice title and the measure would both be new prompt text. Any pick needs the prompt rewritten.

## Recent changes

- `playground/canonical-row-3.html`: entry. Loads `pg-row.css` (round 1 chrome), `pg-row3.css`, `pg-row-data.jsx` (seeds, surfaces, art), `pg-row2-data.jsx` (for `cqShort`), `pg-row3-data.jsx`, `pg-row3-app.jsx`.
- `playground/pg-row3-data.jsx`: `CQ3_PAINS` (same height, works at 320, full name, says the game once, "opens" cue, art on every surface) and `CQ3_IDEAS` (stance, cost, behaviour across widths, readouts).
- `playground/pg-row3.css`: the `.c3` row and container queries on `crl` at 639, 439, 399, 359 and 640. `.sf>.crbox{max-width:760px}` is the measure. `.is-voice .c3-g` is the quiet game voice.
- `playground/pg-row3-app.jsx`: `C3Row` (one markup: `.c3-lead`, `.c3-t` > `.c3-g`/`.c3-e`, `.c3-r` > `.c3-rl`/`.c3-rs`, `.c3-w`, `.c3-x`, `.c3-go`; classes `has-lead`, `has-g`, `has-x`), `C3DsList` (option 0), frames, two views, the voice toggle. State in `localStorage` under `pg_canonical-row-3_v1`.
- `notes.md` Round 3 section; `README.md` lists round 3; `playgrounds.json` has the round 3 entry first under `canonical-row`.

## Learnings

- Rows carry a `has-g` class when the title names a game. 18 keys the cover off it, so Library (title is the game, no `game` field) keeps its cover without a per-surface rule. The product would need the same distinction: `ListRow` gets the game's name as a separate part, or a flag.
- With `grid-template-areas` the Replay slot shares the trailing column with the time (`"t w g" "r x g"`), so the column is as wide as the wider of the two and the time stays right-aligned under both rules. Rows without Replay use `"t w g" "r w g"` and `align-items:center` centres the time.
- Thresholds are list widths, not frame widths: a frame is 32px wider than its list (`.sf` padding). Round 3 speaks of list widths throughout, as round 2 did.
- Approximate budgets used: "The Locked Study" ~125px at 16px/600; "Escape · The Locked Study" ~205; "Escaped in 5 moves" with icon ~148 at 14px; "All 4 groups, no mistakes" with icon ~190. 16's line one at 320 is 102px, so the long names are cut until 360; 17's is 134; 18's is 170.
- Reset: set `pg_canonical-row-3_v1` to `{opt:16,view:'surf',worst:false,widths:[320,360,390,768],surf:'history',w:390,voice:true}` (the storage guard blocks `removeItem`).

## Artifacts

- `docs/specs/canonical-row/playground/canonical-row-3.html` (asset "Canonical row, round 3"), `pg-row3-data.jsx`, `pg-row3.css`, `pg-row3-app.jsx`
- `docs/specs/canonical-row/notes.md`, `README.md`, `playgrounds.json` (updated)

## Action Items & Next Steps

1. Owner reviews round 3: History at 320 and 390 first, then the other surfaces in "One option, every surface". Ask them to react to the two shared proposals (two-voice title; 760px measure) as well as the pick. Note everything in `notes.md`.
2. If they want round 2 too: `canonical-row-2.html`, especially 15, 15b and 15c, which hold the same slots but put Replay on the result line.
3. On a pick, re-read `ListRow.jsx`, `ListRow.prompt.md`, `Cover.prompt.md` and the `.mcp-row*` block in `components/components.css`. Add container-query rungs, a `short` result prop, title parts (game, edition), the Cover sizes tied to line count, fixed wide columns with Replay beside the time, and remove the `no-note` centring and the meta mode. 17 also needs a phone rule for the chevron; 18 a rule for when a row shows its cover.
4. Update `rows.card.html` with real product copy, render it, compare with the product, run `check_design_system`.
5. Product-agent message, one line per change, including supplying a short result for every outcome.
6. Not yet tested: Safari, real product covers at 56×42 beside edition-only titles, and the measure on the product's wide pages.

## Other Notes

- The owner prefers concise replies and wants to review with the thing in hand, not from descriptions.
- 320 is a floor that must work; the design target is 375 to 390 (owner's proposal, not yet agreed: rows should look right from 360).
- History must stay a flat list in time order; nested replays are rejected. A replay row may have its own look as a state of the canonical row.
- Earlier handoffs: `handoff-2026-10-15-canonical-row-round-2.md`, `handoff-2026-10-14-canonical-row-playground.md`.
