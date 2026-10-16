---
date: '2026-10-16'
ticket: '1153'
topic: 'pass-upsell-review'
status: 'in-progress'
type: 'review'
---

# Handoff: 1153 Pass upsell, owner review of the two Discover candidates

## Current Focus

The owner reviews the two candidate builds next, before the playground. They are rival answers to one question (what Discover becomes), and the playground leans on one of them (Discover, tidied: A1's card art, the one-line Pass band). If the games hub wins, those parts of the playground need redoing.

Order:
1. **Discover, tidied** (candidate).
2. **Discover as a games hub** (candidate).
3. **The Pass upsell changes, sections A to G** (playground).

Take the owner's picks one at a time. Nothing in either candidate is accepted until the owner says so in words (`CLAUDE.md` § Candidate builds; `skills/candidate-build/SKILL.md` invariant 9).

## Task(s)

Read these first. Each has the full demo path, the axes, the calls made without the owner's ruling, and the builder's recommendation for each axis:
- `docs/specs/1153-pass-upsell/handoff-2026-10-15-discover-tidied.md`: Config axes A to I; recommends A2, B1, C1, D1 (lock on the wall off), Eb, F change, G none, H Casebook, I both off. One piece of unratified copy: the Delve pick label "A NEW SCENE EVERY WEEK".
- `docs/specs/1153-pass-upsell/handoff-2026-10-15-discover-games-hub.md`: Config axes A to G; eight "calls that need your eye"; one open question (weekly and chapter doors lead to editions nobody can play yet; C3 removes them).
- `docs/specs/1153-pass-upsell/handoff-2026-10-15-pass-upsell-proposal.md`: sections A to G, placeholders that need filling, design-system changes needed first.

How to open: `playgrounds.html` → **How the site mentions the Pass** (1153) → Candidate builds / Playgrounds. Direct paths:
- `docs/specs/1153-pass-upsell/candidate/discover-tidied.html`
- `docs/specs/1153-pass-upsell/candidate/discover-games-hub.html`
- `docs/specs/1153-pass-upsell/playground/index.html`

Inside each candidate the pill at the bottom right holds Config (the axes, first section), States (the new player states under Screens), and QA (the walk-through). These exist only on the candidate's page.

## Critical References

- `skills/candidate-build/SKILL.md`: § "Merging a whole candidate" and § "Throwing one away". Both now act on one candidate; the ticket's other candidate stays unless the owner says otherwise.
- `CLAUDE.md` § Ratification: one decision per turn; agreement to one axis is not agreement to the next.
- Design law: MCP Game Store Design System (product block in `CLAUDE.md`). Both candidates need a lock slot on the art of `GameCard`, `GamePick` and `GameTile` before integration; the hub also needs a slot under `GameTile`.

## Recent changes (this session, 2026-10-16)

- The three pieces were in three invented folders (`discover-tidied`, `discover-games-hub`, `pass-upsell-proposal`). They are now one ticket: `docs/specs/1153-pass-upsell/`. The candidate entries were renamed from `candidate/index.html` to `candidate/<name>.html`; script paths inside the entries and the handoffs were rewritten. The handoffs keep their 2026-10-15 text otherwise, so some say "the candidate" or name the old folder in prose.
- Storage keys are unchanged (`kit_discover-tidied_candidate`, `kit_discover-games-hub_candidate`, `kit_pass-upsell-proposal_playground`, `pg_pass-upsell-proposal_v1`), so any review state survives.
- Kit updates applied: several candidates per ticket (`docs/specs/kit-several-candidates/`), comments never cite `docs/` paths and archive only when asked (`docs/specs/kit-comment-paths/`), kit version line (version 1).
- Every other ticket folder went to `docs/archive/`, except four that are still open and were moved back: `free-and-pass`, `notifications-2026-10-11`, `rhythm-filters`, `walk-sweep`.
- `playgrounds.json` regenerated: 1153 is the only playable ticket; everything else is archived or documents only.

## Learnings

- Why the three were split: the kit allowed only one candidate per ticket, and the prompts carried no ticket id. Both are fixed in the kit. Full write-up: `docs/specs/kit-several-candidates/handoff-2026-10-16-kit-several-candidates.md`.
- Neither candidate's verification was re-run after the move. Load each once and confirm the Discover changes render before the owner reviews (the `<base href>` depth is unchanged, four levels).

## Artifacts

- `docs/specs/1153-pass-upsell/` (README, three handoffs, `candidate/`, `playground/`)
- `docs/specs/kit-several-candidates/handoff-2026-10-16-kit-several-candidates.md`, `kit-note-comments-cite-docs.md`
- `docs/specs/kit-comment-paths/handoff-2026-10-16-kit-comment-paths.md`

## Action Items & Next Steps

1. Open both candidates once to confirm they load from the new paths.
2. Walk the owner through **Discover, tidied**: one axis per turn, in order A to I, following its handoff.
3. The same for **Discover as a games hub**, axes A to G, then its eight calls and its open question.
4. Ask which candidate goes forward. Then merge one and archive the other, per the skill. Nothing goes into `CHANGELOG.md` without the owner's wording.
5. Then the playground, sections A to G. Redo any of it that depended on the candidate not taken.

## Other Notes

- The owner keeps chat replies short: one question per turn, last line carries the ask (`CLAUDE.md` § Replying in chat).
- `CLAUDE.md` line 148 (the shared product-page rule) still cites `docs/specs/989-36000-summers-ago/`, which is now archived. It is kit-owned text and is flagged in the comment-paths handoff; leave it.
