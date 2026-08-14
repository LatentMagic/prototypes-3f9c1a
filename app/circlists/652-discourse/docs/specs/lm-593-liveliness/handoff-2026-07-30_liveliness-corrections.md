---
date: '2026-07-30'
ticket: 'LM-593'
topic: 'liveliness-corrections'
status: 'complete'
type: 'implementation'
---

# Handoff: liveliness corrections — config stripped, NEW rule fixed, spinner resolves in place

## Current Focus

Nothing is open. This session corrected three mistakes the previous agent landed; all three are in
and were seen working in the app. The only thing awaiting the user's eye is **timing**: the resolve
holds ~1.1s after the ring closes (`.circ-sig-settle`, 1500ms total) and the arrival wash runs
1900ms — the user was told to say the word if either rest wants to be longer or shorter. Do not
pre-emptively change them.

Read [`handoff-2026-07-29_liveliness-integrated.md`](handoff-2026-07-29_liveliness-integrated.md)
first — it is the standing spec for the grammar and it has been **updated in place** by this session
(a correction block at the top, plus corrected sections). It is accurate as of now.

## Task(s)

Three corrections, all requested directly by the user, all done:

1. **Strip design options out of `app/config.jsx`.** The previous agent shipped card time, arrival
   halo, last-seen rule and nothing-new answer as Config rows, plus an "Unfound" staging button.
   The user's position: *playground config does not go in the real config file* — those are the
   product, not settings. All removed. Config → Liveliness is now **staging only**: background
   activity, and *In this circle* / *In another*.
2. **The last-seen rule.** `EARLIER` was rejected — it leans on what came *before*, when the rule
   exists to point at what is latest. Now `NEW`, drawn **above** the arrivals. The user confirmed
   `NEW` is right; the *implementation* was then broken (label read as a header for the whole feed,
   since nothing closed the group) and was fixed with a seam. See Learnings.
3. **The arrival.** The user only ever meant the halo's *colour*, not a halo: the **card itself**
   goes light green and resolves to white. The ring/box-shadow treatment is gone.
4. **The nothing-new resolve.** Was two components cut together (`BrandSpinner` → `PulseMark`),
   which read as brutal. Now the spinner's own arc closes into a complete ring, in place.

## Critical References

- [`handoff-2026-07-29_liveliness-integrated.md`](handoff-2026-07-29_liveliness-integrated.md) — the
  grammar, the hard rules, and the **Rejected — do not reintroduce** list (now including playground
  switches in Config, and swapping in a second mark for the resolve).
- `CLAUDE.md` — accent green is actions/active/focus only, never status; sage is the mark's light.
  Also the CHANGELOG editing rule: **this session's work earns no entry** (refinement + bug fix, no
  change to the shape of the product). The 2026-07-29 liveliness entry already stands; do not amend it.
- `brand/motion/circlists-motion.md` — the spinner's rotor/arc timings the resolve is built on.

## Recent changes

- `app/config.jsx:205+` — Liveliness section reduced to Background activity + two stage buttons.
  Removed rows: Card time, Arrival halo, Last-seen rule, Nothing-new answer; removed the *Unfound*
  button and its hint.
- `app/main.jsx:136` — `live` state is now `{ activity: 'off' }` only. Removed `timestamps`,
  `divider`, `halo`, `settle` and every read of them (`FeedCard showTime` is now unconditional, the
  wash always fires, the resolve always fires, the divider always renders).
- `app/main.jsx` — deleted `queueItem` and `liveActions.queue`; `refreshSpace` settle timer
  1300 → 1500ms to match the CSS.
- `app/main.jsx:517-518` — `<FeedDivider />` at `i === 0` (when `divIdx > 0`) and `<FeedSeam />` at
  `i === divIdx`.
- `app/liveliness.jsx` — `FeedDivider` is variant-free and renders `NEW`; new `FeedSeam`; exported on
  `window`. `CircleSignal state="settled"` now renders `<BrandSpinner resolving />` instead of
  `PulseMark`. Header comment block rewritten to hold the corrected rules.
- `app/brand-motion.jsx:40` — `BrandSpinner` gained `resolving`: wraps the arc in
  `.circ-spinner-arcwrap` and renders a full `.circ-spinner-ring` circle (same r/stroke) outside the
  rotor group.
- `circlists.html` — `.circ-arrive` is now a wash (`::after` sage overlay fading out, plus the rise);
  removed `circ-arrive-halo`. `.circ-sig-settle` rewritten for the cross-fade; added
  `.circ-spinner-ring`, `circ-arc-out`, `circ-ring-in`. Added `.circ-fseam`; removed `.circ-fdiv-s`,
  `.circ-fdiv-rule`, `.circ-fdiv-slabel`. Reduced-motion block extended to both.
- `docs/specs/lm-593-liveliness/handoff-2026-07-29_liveliness-integrated.md` — correction block at
  the top; the last-seen-rule and nothing-new sections rewritten; stale open-question and
  action-item text removed.

## Learnings

- **In a newest-first feed, a label alone cannot mark the boundary.** `NEW` above index 0 is also the
  top of the list, so it reads as a header for the entire feed — which is exactly what the user saw
  and reported as "everything new is just appearing below new". The group needs **two** edges: label
  + hairline at the top (`.circ-fdiv`), plain hairline where seen items resume (`.circ-fseam`).
  This is the whole reason `EARLIER` seemed to work before — a bottom-anchored label can only name
  what is below it, and that is the trap.
- **How to resolve a spinner without a jump.** You cannot smoothly interpolate a running
  `stroke-dasharray` animation to a closed circle — any fixed keyframe start jumps. The trick that
  works: cross-fade the arc out against a full ring of identical radius and stroke, and *leave the
  rotor spinning*. A closed ring rotating is indistinguishable from a still one, so the transition
  is continuous and no second component is needed.
- **`live` options in Config were not a neutral default.** They read as unfinished product. When a
  design question is open, the user wants it *decided in the design* and shown to them, not exposed
  as a switch. Config exists to **stage scenarios** the silent grammar cannot otherwise show.
- Nothing here has earned a GOTCHA.md entry, though the two bullets above are candidates if either
  recurs — **ask the user before adding** (CLAUDE.md rule).

## Artifacts

- `app/config.jsx`, `app/main.jsx`, `app/liveliness.jsx`, `app/brand-motion.jsx`, `circlists.html`
- `docs/specs/lm-593-liveliness/handoff-2026-07-29_liveliness-integrated.md` (updated in place)
- `docs/specs/lm-593-liveliness/README.md` (updated — open questions closed)
- This file.

## Action Items & Next Steps

1. **Wait on the user's read of the timings** — resolve rest and arrival wash. Change nothing until
   they react.
2. The user said "I've got a few others" — more corrections are coming. Expect them to be small and
   to follow the same instinct: less decoration, less claiming.
3. `docs/ABOUT.md` and `CLAUDE.md` still do not mention liveliness. Worth a line now the grammar is
   settled — **ask first**.
4. Housekeeping, unprompted so far and worth raising rather than doing: stale `circ_state_v7/v8/v9`
   keys are still in localStorage, and `pending`/`queued` persist into `circ_state_v10`, so a reload
   can resurrect a New pill from a previous session.

## Other Notes

- **Do not reintroduce** anything on the rejected list in the 07-29 handoff. The two added this
  session: playground switches in `app/config.jsx`, and a second mark swapped in for the resolve.
- The user's corrections consistently mean *less*, not *different*. When they asked for "a slightly
  nicer approach" to the divider sentence, the previous agent produced a whole new treatment plus
  switches; what was wanted was one word changed. Read scope narrowly.
- Verification of motion cannot be done from the main agent's static screenshot; the divider fix was
  confirmed visually (Tuesday Book Club: `NEW`, two cards, seam, rest), the resolve was reasoned
  from the CSS. If a future session needs to *see* the resolve, stage it with Config → *In another*
  then click the circle you are already in.
