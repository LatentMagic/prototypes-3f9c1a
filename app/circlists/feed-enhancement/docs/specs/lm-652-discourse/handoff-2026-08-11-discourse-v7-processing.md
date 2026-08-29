---
ticket: 'LM-652'
date: '2026-08-11'
topic: 'discourse-v7-processing'
status: 'in-progress'
type: 'exploration'
---

# Handoff: discourse v7 processing — the dump turned into laws, and the corpus eliminated

## Current Focus

**The owner has taken an asset pack away to talk through by voice, on a walk.**
Nothing is waiting on this session. When he comes back, the open move is the one
he has not yet ratified: whether to ideate — on paper, no rig — the two areas he
deliberately refused to outlaw, **a place that cannot wait and cannot grow**, and
**a talk surface with a floor and a ceiling** (`discourse-pack/06-the-brief.md`).

Do not start that work unprompted; it was offered and not answered.

Background only: the offer to extract the `pg-d7-*.jsx` sources back out of
`discourse-playground-v7-standalone.html`. Raised, not answered, only worth doing
if something is to be built on v7.

## Task(s)

The session began with *"onboard thoroughly, process everything, tell me where you
think we should go"* — no build asked for, and none done. Four things landed:

1. **Onboarding** across v1→v7: the brief, the v1 reviewer notes, the v2/v3
   postmortem, the v4 handoff, the v7 bundle's own claim/cost table, plus
   `CLAUDE.md`, `PLAYGROUND.md`, `GOTCHA.md`, `MOBILE.md`, `ABOUT.md`,
   `CHANGELOG.md`.
2. **A processing pass** over the v7 dump — `docs/specs/lm-652-discourse/discourse-v7-processed.md`.
3. **The laws, ratified individually** via a form, after the owner rejected the
   session's first recommendation. Then every direction in the corpus run through
   them — `docs/specs/lm-652-discourse/discourse-2026-08-11-elimination-sheet.md`.
4. **A portable asset pack** — `discourse-pack/`, eight files, self-contained,
   downloaded by the owner for a conversation with a separate agent.

### Ratified this session — the four laws

Put to him one at a time; these are decisions, not readings.

| | Law |
|---|---|
| **L1** | Nothing waits on other people — no unlocking on elapsed time, on everyone having read, or on a cadence |
| **L2** | Nobody is excluded from speaking |
| **L3** | Nothing written is overwritten or replaced |
| **L4** | Nothing grows without bound — finite by construction, not policed by rules |

**Ruled preferences, not laws** (they argue, they do not kill): no scaffolding
what a member says · no second screen · the contributor's note may be public
before the read.

**Ruled philosophy, explicitly not a law:** *a feature must remove more than it
adds* — his words, *"it's not so much a law."*

**Ruled NOT laws, and this is the load-bearing outcome:** *no new place alongside
Active and Read*, and *no permanently open talk surface*. Both rejected because
they are *"half baked but interesting"* and **need more grounded ideation**. The
laws are not permitted to settle those two.

## Critical References

- `docs/specs/lm-652-discourse/discourse-v7-reactions.md` — the verbatim dump. Primary source for
  everything above; nothing supersedes it.
- `docs/specs/lm-652-discourse/postmortem-2026-08-03-discourse.md` — the five failures
  that killed v2/v3. Still binding.
- `CLAUDE.md` — the ratification rule. Enforced hard this session, correctly.

## Recent changes

New, all additive; no existing file edited, no `app/` file touched, no
`CHANGELOG.md` entry (exploration, per `PLAYGROUND.md`).

- `docs/specs/lm-652-discourse/discourse-v7-processed.md` — the processing pass over the dump:
  the thirteen sorted into dead-on-idea / dead-on-execution / alive, the five
  cross-cutting objections, five candidate answers to return, and a
  recommendation the owner rejected (see Learnings).
- `docs/specs/lm-652-discourse/discourse-2026-08-11-elimination-sheet.md` — the laws, the grid
  over ~30 directions, what survived, and "ship nothing" argued as a contender.
- `discourse-pack/00…07` — the portable pack, superset of both notes plus the
  product primer, the history, and a "working with me" file.

## Learnings

- **The first recommendation was rejected, and the rejection is instructive.**
  Proposing that unseen words *arrive* through the app's liveliness grammar was
  heard immediately as notifications: *"my alarm bells are going off in terms of
  unnecessary complexity, unnecessary bloat."* Anything resembling a new
  signalling layer will trip the same wire. Do not re-propose it in different
  clothes.
- **A five-question form about user need overwhelmed him** — *"they're just sort
  of overwhelming and detailed, and it just doesn't feel like the right questions
  to be asking at this stage."* Those questions were research about need, asked of
  one person mid-design. Withdrawn, and recorded as withdrawn in
  `discourse-pack/06-the-brief.md` so they are not asked cold again.
- **Elimination beats generation with this owner.** The move that worked was
  taking his own rejections, stating them as laws, and putting them up one at a
  time for individual ratification. He engaged with all ten instantly. When he
  says *"I don't know how to find my way to an answer"*, the answer is not more
  options — it is a way of removing them.
- **The grid is permissive by design and that is the finding.** Four laws kill
  eleven directions; every kill is unboundedness, deferral, exclusion or
  destruction. Three of those kills are incidental to the idea — The Record dies
  on the very defect he named and survives if bounded; The Dispatch dies on its
  cadence, not its instinct; The Stream dies on being a river. The survivors are
  one family, not fifteen options.
- **v5, v6 and v7 have no docs or sources in this project.** The v7 bundle cites
  `FINAL-TEN.md`, `v1-revisit-THREE.md` and `pg-d7-CONTRACT.md`; none exist here.
  Only `discourse-playground-v7-standalone.html` (compiled, 12.6k lines) came
  back, so v7 can be read but not edited. Its claim/cost table is at line ~4370
  and its per-direction modules follow as inline `text/babel` blocks — that is how
  the thirteen were reconstructed for the grid.
- Nothing for `GOTCHA.md` from this session; no approval sought.

## Artifacts

- `discourse-pack/` — 8 files, downloaded by the owner
- `docs/specs/lm-652-discourse/discourse-2026-08-11-elimination-sheet.md`
- `docs/specs/lm-652-discourse/discourse-v7-processed.md`

## Action Items & Next Steps

1. **Wait.** He is discussing the pack with a separate agent. Whatever comes back
   supersedes the reading in these documents — the laws do not.
2. **If he says go:** ideate the two live briefs on paper. A place that cannot
   wait (L1) and cannot grow (L4), answering return; and a talk surface that is
   finite by construction and is not a second attention centre. Prose first, no
   rig.
3. **If a rig is later wanted,** it is a whiteboard — static, one comparison, no
   app, no config (`PLAYGROUND.md`'s first shape). Another playable rail of
   directions was rejected outright: too diffuse.
4. **Only if asked:** extract `pg-d7-*.jsx` out of the v7 bundle so v7 is
   editable again.

## Other Notes

- **Rejected this session, do not revive without him raising it:** building a
  single baseline direction; building another playground from the current
  position; seeding a playground heavily enough to fail.
- **Standing veto:** The Pulled Line (v7 05). It survives the laws and is dead
  anyway — a verdict outranks a grid.
- **The floor is described, not proposed.** Attach in the add popover, reflect in
  the reaction modal, the door holds the record, the note is public before the
  read. He described it himself — *"that just works"* — but building it as one
  baseline was explicitly rejected. Do not read the sheet as a proposal to build
  it.
- The shape question is treated as spent: ~30 directions, and every one that
  scaffolded a member's speech died on the same sentence. More shapes return to
  the same family.
