---
date: '2026-08-14'
ticket: 'LM-652'
topic: 'candidate-build-route'
status: 'in-progress'
type: 'exploration'
---

# Handoff: candidate-build-route — where the incoming discourse delta gets built, and two flags recorded for it

## Current Focus

**Wait for the delta prompt.** It is coming, and it is a *delta* prompt, not a playground prompt. When
it lands, build it as a **candidate build** per
[`docs/specs/candidate-builds/README.md`](../candidate-builds/README.md), against the five working
decisions already in [`README.md`](README.md).

Nothing was built this session. No option is open for design work.

## Task(s)

**Done — onboarded** to the discourse context base and the doc specs: `CLAUDE.md`, `github.md`,
`ARCHITECTURE.md`, `GOTCHA.md`, the LM-652 README's five working decisions, and the handoff chain
(v7 processing and its four ratified laws, v8 carrying the verbatim brief, the 08-14 thought-on-card
reveal round, the 08-14 return-button/prebuild round).

**Done — two flags recorded** for the incoming prompt, at the owner's request, in `README.md` above the
working decisions. Flags, not decisions; the prompt governs.

1. **C4 is the inspiration** for the Swell optionally riding the add popover
   (`pg-d10-contribute.jsx:205`, `C4Add`). Credited as the source, explicitly **not** a model of the
   execution — to be thought through, not lifted.
2. **No add-a-link thought input has looked beautiful yet.** Every rig's contributor field reads
   bloated and inelegant and gives 500 characters too little room to stay readable while writing. A
   known gap to design deliberately.

**Done — the candidate-build question answered and written up.** The owner asked how the prototype can
carry a second, unratified version of the app without forking it, and without it being a playground:
this instance has to *be* the app. Answer, and its reasoning, in
`docs/specs/candidate-builds/README.md`; linked from the top of `README.md`.

- **One `app/`, two entries.** `circlists.html` stays the app; `circlists-<ticket>.html` loads the same
  `app/*` files in the same order, then a small overlay set (`cand-<ticket>-*.jsx`) that re-publishes
  only the names the delta changes. Later assignment to `window` wins, so nothing in `app/` is copied
  and a shared-surface fix lands in both entries.
- **Access costs nothing** — it is a file at the project root, opened like `pg-*.html`.
- **Teardown is deletion** — when a piece ratifies, its delta moves into `app/` and the overlay file
  that carried it is deleted.
- **Set aside:** building into the app behind a Config flag (the owner dropped the Config route
  himself), a copied `app/` variant directory, and a playground.
- **Settled:** the candidate hooks into the **real** `FeedCard` and the **real** Swell. Copying them,
  as v8 and v10 did, is a defect, not an option.
- **Agreed sequence:** build the first candidate, *then* write `skills/build-candidate/SKILL.md` from
  what it took and note it in `CLAUDE.md`. Not before.

## Critical References

- `docs/specs/candidate-builds/README.md` — the candidate-build route. Read before building the delta.
- `docs/specs/lm-652-discourse/README.md` — the five working decisions, plus the two new flags.
- `CLAUDE.md` — ratification; and the reply rules, which were enforced hard again this session.

## Recent changes

- `docs/specs/candidate-builds/README.md` — new. The route, the alternatives considered, access,
  teardown, the untested assumption, and the settled no-copies note.
- `docs/specs/lm-652-discourse/README.md` — two inserts above the working decisions: the
  candidate-build pointer, and the two flags for the incoming prompt.
- Nothing in `app/`, no `pg-*` file, no `CHANGELOG.md` entry.

## Learnings

- **The untested part of the candidate route is the override-after-load step.** v8 and v10 both gave up
  there and photocopied `app/swell-reactions.jsx` and `FeedCard`, because the Swell keeps its internals
  in Babel scope and `FeedCard` has no extension slots
  (`handoff-2026-08-12-discourse-v8-playground.md`, craft notes). Making it work needs a narrow,
  additive change to `app/` — export the Swell internals, give `FeedCard` its call-out slots, both read
  off `window` like the existing droppable modules.
- **"`app/` is frozen" does not outrank building properly.** I put the copy-instead route to the owner
  as a choice; it is a defect and should never have been offered. Where doing it properly needs a small
  additive change to `app/`, make it and document it.
- **Length was the session's repeated failure.** Long replies went unread — "I cannot read 5,000-word
  essays". What worked: one beat, then stop. Also stop bundling non-questions into a list of questions
  when asked for questions, and do not re-raise something already agreed.
- **Downstream repo states are not the owner's concern here.** Framing the route around
  `canon`/`next` publishing was noise; `next` is being retired anyway.

## Artifacts

- `docs/specs/candidate-builds/README.md` (new)
- `docs/specs/lm-652-discourse/README.md` (updated)
- this handoff

## Action Items & Next Steps

1. **Wait for the delta prompt.** Do not start design work on any part of it.
2. **When it lands, build it as a candidate build**, hooking the real components; read
   `docs/specs/candidate-builds/README.md` first.
3. **Build against the five working decisions** in `README.md`, not against `pg-return-v12.html` as it
   stands — its modal is replaced by the new surface.
4. **Carry the four open implementation flags:** the watching toggle's treatment and its name
   ("watching" is probably wrong), W4's copy rewrite, the circular chevron target, and the beautiful
   thought input.
5. **After the build,** write `skills/build-candidate/SKILL.md` from what it took and note it in
   `CLAUDE.md`.

## Other Notes

- **What the prompt is expected to cover,** from the owner: the new add-link popover with the thought
  (Swell optional), a mark-as-read toggle on the roster, the new card and its new state, a new reveal
  surface, the Active/Read return affordance, the fold, the new button replacing the reaction door and
  the conversational surface it opens, and that surface's content including a watching toggle.
- **His answers to the gaps I raised:** the reflection *is* covered by the prompt; there is no
  withheld/unread state to design because **you can only read from Read**; **staleness is owned by
  going quiet and by being able to unwatch**; the business-ops ticket is **LM-652**.
- **Reply style, enforced.** One beat per reply, then stop. No forms. No volunteered recommendations.
  Lead with the action; last line carries the single thing to act on, led by an emoji. Frustration this
  session was at length and at offering bad options as choices — not at any decision.
- Nothing here is ratified beyond what is explicitly marked settled.
