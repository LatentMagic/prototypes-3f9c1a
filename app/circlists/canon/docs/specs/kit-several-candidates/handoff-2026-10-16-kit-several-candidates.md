---
date: 2026-10-16
task: Kit update, several candidate builds per ticket
status: landed
---

# Handoff: several candidate builds per ticket

## Objective
Carry the kit rule into the prototype: a ticket can now hold several candidates, each `docs/specs/<ticket>/candidate/<name>.html` with its own `cand-<name>-*.jsx` files and storage key `kit_<ticket>_<name>`. Merging or throwing away acts on one candidate. Nothing in `app/` changes, and nothing is migrated.

## Changed
- `CLAUDE.md`
  - Files block: replaced the bullet "A candidate build lives in its ticket folder".
  - Playground block: replaced the bullet "`playgrounds.html` at the root is the launcher".
  - **New block** `<important if="the user asks for a candidate build or names $candidate-build">`, placed just before "## Wrapping up", carrying Where it lives / How the owner opens it / Accepted: merge. Refused: throw away. This project had no such block, so there was nothing to replace. I added it because the acceptance criteria require the bullets to be in the file.
  - Custom-skills line for `candidate-build`: "an existing `circlists-<ticket>.html` entry" became "an existing candidate entry (`candidate/<name>.html`, or an older `circlists-<ticket>.html`)". This was an audit correction.
- `docs/specs/CLAUDE.md`: heading is now "…after it is merged, or thrown away", with the kit's first paragraph. The old four steps (move the whole ticket folder, delete the bridge) contradicted the new rule, so I replaced them with a pointer to the skill. The kit names the skill as the one place the steps are stated. The archive bullet was replaced.
- `docs/archive/README.md`: replaced the first sentence of the body paragraph. The rest of the paragraph is unchanged and now sits on one line.
- `skills/candidate-build/SKILL.md`: replaced the diagram and the paragraph after it, invariants 1, 6 and 10, Placement and naming, and the body of Merging a whole candidate (the heading is kept, because the kit's block has none). Added Making the entry and Throwing one away, which did not exist here. Replaced The write-up. Everything else is as it was.
- `skills/build-playground/SKILL.md`: "candidate build and rigs" became "candidate builds and rigs". This was an audit correction.
- `playgrounds.html`: pluralised the `counts` line and the group label, as the kit gives them.
- `playgrounds.json`: added the top-level field `"product": "Circlists"`, as the new launcher bullet requires. No entry was touched.

## Product wording kept (the open item the kit left to me)
The kit's blocks use kit names. This project's own names replace them, because the kit names would produce a candidate that does not load:
- `index.html` became `circlists.html`. That is the main entry here, and there is no `index.html`.
- `window.KitCandidate` became `window.CircCandidate`. `app/main.jsx:163` reads `CircCandidate`.
- `window.KIT_STATE_KEY` became `window.CIRC_STATE_KEY`. `app/main.jsx:60` reads `CIRC_STATE_KEY`.
- Invariant 6: the kit's parenthetical says the placeholder persists nothing. That is false here, so it now says Circlists persists its state and `app/main.jsx` already reads the key this way.
- Placement: the kit says "`CLAUDE.md` § Files has the full mechanism". Here the mechanism is "Making a nested entry load" in the playground block, so the pointer now names that.
- The storage key pattern `kit_<ticket>_<name>` is used as the kit gives it. It is new, so there is no product wording to keep.

## Resolved by the kit agent (2026-10-16)
- **Making the entry, step 5:** the kit's brief cut the sentence off. It now ends "…point it at the component. The root `circlists.html` and `app/` stay as they were." (`index.html` became `circlists.html`.)
- **Invariant 4** gained the kit's two closing sentences on staged states and the QA walk-through, so the reference from Placement now lands. Kit names became this project's: `window.kitResolveState` became `window.circResolveState` (`app/states.jsx:1278`) and `window.KIT_QA` became `window.CIRC_QA` (`app/qa.jsx:99`). `window.buildStates` is the same in both. `app/pricing-states.jsx` already wraps these two this way.
- **"Root means…":** the owner approved the change. It now reads, matching the kit: Root means "this is the product", never a candidate of it.

## Audit (whole project, searched for candidate / cand- / circlists-<ticket> / candidate/index / kit_ / "Candidate build")
**Change (done):** the root `CLAUDE.md` skills line and the two bullets; the steps in `docs/specs/CLAUDE.md`; the skill sections; `skills/build-playground/SKILL.md:212`; the two `playgrounds.html` lines.

**Leave alone:** existing entries `docs/specs/lm-652-discourse/circlists-lm652.html`, `docs/specs/a3-invite-link/circlists-a3.html` and the archived `circlists-lm666.html` and `circlists-per-person-pricing.html`; existing `cand-lm652-*` and `cand-a3-*` files; keys `circ_lm652_state_v1`, `circ_lm666_state_v1` and `circ_state_ppp_v1`; every `app/` comment and hook (`main.jsx`, `qa.jsx`, `talk-*.jsx`, `spaces.jsx`, `swell-reactions.jsx`), since `app/` is out of scope and they speak of "a candidate" generically; the manifest notes, which name each ticket's own single candidate and are true; the header total in `playgrounds.html` ("N candidates", always plural), which is not a one-per-ticket assumption; the `a3-invite-link/README.md` and `lm-652-discourse/README.md` descriptions of their own candidate; and the GOTCHA.md reference to `cand-lm652-card.jsx`.

**History:** `CHANGELOG.md` (lines 38, 134, 150, 181 and 196); every handoff under `docs/specs/` and `docs/archive/`; `docs/archive/playground-lifecycle/README.md`; and `docs/specs/_handoffs/`.


## Checks
- No `candidate/index.html` exists in the project, so nothing had to be kept in place. The existing `circlists-<ticket>.html` entries were not touched.
- No current ticket holds a live candidate, so the plural label only shows once one does. The logic matches the kit.
- `app/` is untouched.

## Next
Nothing open.
