---
date: '2026-08-03'
topic: 'discourse-v4'
status: 'for-review'
type: 'exploration'
---

# Handoff: discourse playground v4 — the set, widened and steered

## Current Focus

**The rig is built and nothing is chosen.** v4 answers the review literally: v1's
directions kept *as directions*, steered by the notes, widened to ten, with
continuation ideated inside each one. The user opens it, plays, and says which
directions are alive. No design decision has been taken; do not treat any entry
as favoured (the default selection is 01 because it needs no explanation, not
because it wins).

Read `docs/specs/discourse/ideation-2026-08-03-discourse-v4.md` first — it is the
reasoning, direction by direction. Read
`docs/specs/discourse/postmortem-2026-08-03-discourse.md` before changing
anything: its five failures are still binding.

## Task(s)

From `docs/specs/discourse/prompt-2026-08-03-discourse-v4.md`. Delivered:

| | Direction | Where it lives | Contributed content set as | Continuation | Line before the read |
|---|---|---|---|---|---|
| 00 | Reaction only | nowhere | — | none — the gap | n/a |
| 01 | The invitation | door | the line **is** the headline; title demoted | living line, locks when pointed at | yes |
| 02 | Passing notes | card | paired ledger, bracketed | one note back, addressed *to Priya* | yes |
| 03 | Marginalia | the card's gutter | notes outside the measure, initials | keep annotating, never a reply | held |
| 04 | The question | card | question a size up; answers subordinate | later turns must be questions | yes |
| 05 | Same | card | faces under the sentence, one word | pointing, unlimited and terminal | yes |
| 06 | The vanishing prompt | card | epigraphs, name after an em dash | say anything until somebody lands it | yes |
| 07 | Guided statements | back of the card | label-led, the stem stays | restate, replacing your old one | held |
| 08 | Inside the door | the door | glyph-as-avatar rows, one artefact | answer a person; rounds open on reading | sealed |
| 09 | The Swell speaks | on the disc | words as labels flanking the disc | none — momentary by design | sealed |
| 10 | The Table | feed + a page | one mono line; the Table as a page | speak twice at the table; land it | held |

**Ten designed treatments of contributed content over ONE fixture** — that is the
exploration, and it is what v2/v3 skipped (one generic line, reused, "disgusting
on the card"). Screenshot test applied: no two entries look alike.

Continuation uses v2's K0–K6 as *disciplines inside directions* (K1 in 01, K2 in
02 and 08, K4 in 04, K5 in 08, K6 in 06, K3+K6 in 10) and never as options in
their own right.

## Critical References

- `docs/specs/discourse/PROMPT.md` — the original brief. Still the brief.
- `docs/specs/discourse/postmortem-2026-08-03-discourse.md` — why v2/v3 died.
- `docs/specs/discourse/review-2026-07-30-v1-notes.md` — both reviewers, verbatim.
- `PLAYGROUND.md` — binding on the rig. `GOTCHA.md` #2 and #5 both apply here.

## Recent changes

New at the project root: `discourse-playground-v4.html` (+
`discourse-playground-v4-standalone.html`, compiled — regenerate, never edit).
New in `docs/specs/discourse/`:

- `ideation-2026-08-03-discourse-v4.md` — the ideation.
- `pg-d4-data.jsx` — the eleven directions, six levers, the seed cards with one
  superset of discourse content, `pgd4Resolve()` as the single derivation point.
- `pg-d4-parts.jsx` — sheet, copied Swell disc/roster/huddle, the **Same**
  primitive, the one composer (note / answer / stem / prompt / point).
- `pg-d4-content.jsx` — **the treatments.** The heart of the exploration.
- `pg-d4-card.jsx` — the copied card, with the invite inversion and the flip.
- `pg-d4-record.jsx` — the record sheets (rows / labels / invite / shipped door),
  the response moment, the Add sheet.
- `pg-d4-table.jsx` — the Table as a page, tabs, empty states.
- `pg-d4-app.jsx` — the rail and the wiring.

Also edited: `docs/specs/discourse/README.md` (supersede banner now points here).
**The prototype was not touched.** No `app/` file, no `circlists.html`, no
`CHANGELOG.md` entry.

## Learnings

- **The five-second reveal timeout is deleted where words appear in it, and only
  there.** Merged directions (01, 05, 07, 08, 09) unmount the shipped
  `SwellReactionFlow` at commit and the record takes the sheet's place, dismissed
  by you — `commitReaction` in `pg-d4-app.jsx`. Sequential directions (02, 03,
  04, 06, 10) keep the shipped reveal exactly as it ships, because it carries no
  words; the response sheet opens when it closes. That asymmetry is the honest
  difference between "merged with the reaction" and "after it", and it is wired,
  not described.
- **A flipper sized by the taller face leaves the front card half empty.** Fix:
  the hidden face goes `position:absolute; inset:0` inside a `position:relative`
  flipper, so height follows the *visible* face. (Keep the `visibility` toggle
  per GOTCHA/PLAYGROUND — `backface-visibility` alone is not enough.)
- **Marginalia has to sit outside the measure or it is not marginalia.** A block
  under the footer reads as content. `.d4-mgrid` uses a **container query** on
  `.circ-card` (which already sets `container-type: inline-size`) to put the notes
  in a 200px gutter beside the body at ≥ 520px and in a left-ruled gutter beneath
  it below that.
- **Words positioned radially around a disc collide.** The first pass pinned each
  line at its author's glyph angle and the labels overlapped into mush. Fixed
  slots — half the lines flanking each side, disc in the middle, stacking under
  the disc below 560px — reads as the same diagram and cannot collide.
- **Pointing keys must be per item.** `dir.id + '-t'` made one *Same* tap light up
  every card. Keys are prefixed with the item id.
- **Derive the sharer from the card's own attribution.** Fixtures that name their
  own author drift from the seed ("Marcus T." vs "Added by Sam R."). `pgd4Sharer`
  reads the attribution and rewrites the thought's author and any `to:` reference,
  and drops a response from the sharer. Note the regex: strip a trailing period
  only after a lowercase letter, or "Marcus T." loses its initial's stop.
- **Play state is per direction** (`plays[dirId]`), so switching away and back is
  not a loss — v1 wiped it on every pick.
- Verification clicks share the user's `localStorage`. `pg_discourse_v4` was reset
  to clean defaults at the end of the pass.

## Artifacts

- `discourse-playground-v4.html` + `docs/specs/discourse/pg-d4-{data,parts,content,card,record,table,app}.jsx`
- `discourse-playground-v4-standalone.html` — self-contained, ~1.7 MB, for phone review
- `docs/specs/discourse/ideation-2026-08-03-discourse-v4.md`
- `docs/specs/discourse/README.md` — banner corrected

## Action Items & Next Steps

1. **Play it and react.** Which directions are alive, which are dead, which pair
   should merge. The set is deliberately wider than v1's, so pruning is expected —
   but prune by playing, not by reading the list.
2. **06 next to 07 is a deliberate A/B**: the same scaffold with and without the
   app's words surviving into the record. If 07 loses, that answers Jonny's fence
   about guided statements without another round.
3. **08 is the one pushed hardest** ("inside the door is sick"). If it holds, the
   next step is a spec, not more playground work — and the copy goes through
   `wiki/circlists-copy-voice.md`.
4. **Not resolved on purpose:** whether the sharer's line belongs before the read.
   Five directions say yes, three hold it, two seal it. The **Sharer's line**
   lever A/Bs it across all of them. Do not promote whichever you prefer into a
   global rule — that is failure 2 in the postmortem.
5. Only if asked: a `GOTCHA.md` entry for the flipper-height trap. Per
   `CLAUDE.md`, gotchas need approval — it is not appended.

## Other Notes

- Levers are down to six and folded behind a disclosure in the rail, because v1's
  nine made the reviewer configure to find the variety. Every direction is
  pre-seeded so its distinctive moment is one or two touches away; the four beat
  buttons (Attach a line / Mark one read / Respond / Continue) drive the loop.
- Salvaged from the rejected rigs: v2's record-as-one-artefact and its unmount-at-
  commit wiring (now 08), and its table-as-a-page typography (now 10). Their
  option models are not restored.
- The static disc is still a **copy** of the shipped Swell geometry
  (`pg-d4-parts.jsx`), because `app/swell-reactions.jsx` keeps its disc internal.
  This is the second playground to copy it — per `PLAYGROUND.md`, the next ask
  should export the internals from the shipped module instead.
