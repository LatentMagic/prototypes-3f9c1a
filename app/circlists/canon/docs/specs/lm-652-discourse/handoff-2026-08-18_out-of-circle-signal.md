---
date: '2026-08-18'
ticket: 'LM-652'
topic: 'out-of-circle signal whiteboards'
status: 'in-progress'
type: 'exploration'
---

# Handoff: out-of-circle signal — two whiteboards, nothing picked

## Current Focus

The question on the table: **how does a member learn that a circle they are not in has
conversation activity waiting for them** — and, upstream of that, **whether the product
should say so at all.** The user came in leaning towards *doing nothing*, worried about
bloat: the rail already carries a micro dot for unseen link cards, conversation will
outrun link-adding, and a dot that fires on talk would be lit constantly at ten circles.

Two whiteboards were built and handed over. **The user has reacted to the first and asked
for the second; they have not yet reacted to the second.** The next session's first job is
to take their reading of `wb-bold-row.html` — which of 01–05, or none — and only then
decide anything. Nothing is ratified. Nothing has been landed in the candidate build.

Their reaction to board one, verbatim in substance:

- The descriptions of stance/clears/cost "work really, really well" — keep that form.
- The green dot: "God, it's just gonna keep popping up and popping up." The volume strip
  landed; option 01 (widen the dot) is effectively dead in their read.
- **Bold text was the surprise and the thing they like** — they recognised it as the team-chat
  grammar and asked to explore it further. This is the live direction.
- **04 (a line at the foot of the rail) is out** — not relevant to the circle you are in,
  and it reads as bloat.
- **05 (the bar answers for every circle) is liked but deferred** — they said an in-app
  **home screen** is the more appropriate surface for a cross-circle list. Worth keeping on
  the record for whenever home is next opened (`MOBILE.md` — in the app, Home *is* the
  circles list).
- They asked: where are we with the in-circle returns signal, is there synergy, and is
  there a red-team take that would push them off 03 (bold). Board two answers all three.

Background only, not touched this session: the four open questions from
`handoff-2026-08-18_open-questions-whiteboards.md` (way-through mark, send, leaving the
writing face, the surface's name) and everything queued behind them.

## Task(s)

Two whiteboards, per `skills/build-playground` (whiteboard shape: no app shell, no React,
no config — static idle-beside-changed frames, everything visible by scrolling). The user
explicitly said a config rig was not appropriate here.

**Board one — `wb-out-of-circle.html`.** Six answers to the job, each with three frames
(rail quiet · circles moved · after the member has dealt with it), because the two debts do
not clear on the same act:

- 00 leave the rail alone (the elegance benchmark, and the user's own lean)
- 01 the dot means the circle moved (deliberately does not distinguish; over-clears)
- 02 the talk mark stands in the left edge (the conversation's sage 3×22 tab at rail scale)
- 03 the name carries it (weight/ink — the one the user latched onto)
- 04 one line at the foot of the rail (words, specific, an inbox risk)
- 05 the return bar answers for every circle (rail untouched; scope widens)

Plus a **ten-circle volume strip** (four links, eleven people spoke, six of ten circles) —
built specifically to answer the user's bloat fear — an adjacent panel showing the return
bar's own sage tab as the notification that discharges on open (their own proposal,
rendered, marked as reference not an option), and three "for context, not options"
industry references.

**Board two — `wb-bold-row.html`.** Five readings of bold, all under one stated rule:
*a circle's name is bold exactly when that circle's return bar is standing.*

- 01 bold · 02 bold, and the quiet recede · 03 bold for anything, and the dot retires
- 04 ink, not weight · 05 bold, with the sage tab for what is new since you last looked

Plus the same ten-circle strip (dots vs bold vs bold-with-receding), a **synergy section**
(rail says which circle → bar says which cards → margin tab says which turns, with the
selected-row collision shown as a frame), and a **six-point red team** against bold.

## Critical References

- `skills/build-playground/SKILL.md` — the rig rules both boards follow; the whiteboard
  shape is the first thing to reach for.
- `docs/specs/lm-652-discourse/cand-lm652-return.jsx` — the return bar the whole synergy
  argument rests on (its sage tab is `3×22 r2`, `cand-lm652-return.jsx:29`).
- `app/liveliness.jsx` + `app/shell.jsx:26-56` — `CircleSignal`'s one-slot-three-states
  rule and the rail row's real geometry (44px, 11px padding, 3px accent bar, raised white
  surface). Both boards reproduce these values by hand; if the rail changes, they drift.
- `CLAUDE.md` — the ratification rule, which governs every line above.

## Recent changes

- `docs/specs/lm-652-discourse/wb-out-of-circle.html` — new, board one.
- `docs/specs/lm-652-discourse/wb-bold-row.html` — new, board two.
- `playgrounds.json` — two entries added under LM-652 ("Talk in another circle", "The bold
  row"). No other manifest change; nothing archived.
- `app/*` and the candidate build (`circlists-lm652.html`, `cand-lm652-*.jsx`) were **not
  touched**, and no `CHANGELOG.md` entry was added (a playground is not a shape change).

## Learnings

- **The volume strip did the persuading, not the prose.** Ten circles seeded at the volume
  the pain lives at (six of ten moved) is what killed option 01 in one look. Seed for the
  problem, not for coverage — `build-playground` non-negotiable 13, confirmed again.
- **Bold's real argument is that it defines nothing new.** It is the return bar's existence
  projected onto the row, so its clearing rule is already written: card by card, with the
  bar. Any future option should be pressure-tested the same way — *what existing state is
  this a second rendering of?*
- **Where bold strains** is the selected row: weight already means *you are here*, so the
  circle you are in cannot also say it owes you a reply. Rendered as a frame on board two
  rather than argued in prose.
- **`box-sizing: border-box` is not in `tokens.css`.** A bare whiteboard that redraws app
  geometry must set `*{box-sizing:border-box}` itself, or a 44px row with 11px padding
  renders at 66px and the rail's rhythm is wrong. `wb-new-words.html` has the same gap.
- **The preview's "referenced file not found" warning for `tokens.css` is the known false
  positive** for base-relative paths (`CLAUDE.md` § Playgrounds). The page loads; screenshots
  confirm tokens resolve. `ready_for_verification` will not fork its verifier because of it.
- Nothing here warrants a `GOTCHA.md` entry, and none was added (needs user approval).

## Artifacts

- `docs/specs/lm-652-discourse/wb-out-of-circle.html`
- `docs/specs/lm-652-discourse/wb-bold-row.html`
- `playgrounds.json` (updated)

## Action Items & Next Steps

1. **Collect the reading of board two** — which of 01–05, or none. If the reply is ambiguous
   about which reading they mean, ask; do not resolve it (CLAUDE.md).
2. **Then settle the prior question**, which is still open and outranks the styling: *does
   the rail say anything at all?* 00 (say nothing) remains live and is the user's stated
   lean; a pick on a bold variant is not a pick on that.
3. **Land nothing until ratified in words** — not in the candidate, not in `README.md`, not
   in `CHANGELOG.md`.
4. **If bold is chosen**, the open sub-questions are: the hidden text a screen reader gets
   (the dot ships `, new items` — `app/liveliness.jsx:96`), whether quiet rows recede, and
   what the selected row does. None is answered by the board.
5. **Keep 05 on the record for the home screen.** The user parked it there deliberately.
6. **Archive both boards once resolved**: move the two HTML files under
   `docs/archive/`, move their manifest entries to the ticket's `archive` list.

## Other Notes

- The user asked for exploration and a red team, and got both; **no recommendation has been
  ratified.** For the record, the recommendation given in chat was: 00 now, with 05 as the
  elegant answer if the job must be served — offered as a lean, not a decision.
- Do not open the next session by supplying a fresh recommendation unprompted, and do not
  read "built it" as "chose it".
- Both boards restate the settled laws they honour (no counts, badges, toasts or status
  colour; the micro dot keeps meaning unseen link cards; sage is a mark's light, never a
  resting state). If a future option breaks one, it has to say so on its face.
