---
date: '2026-08-17'
ticket: 'LM-652'
topic: 'conversation-surface-readiness'
status: 'in-progress'
type: 'implementation'
---

# Handoff: conversation surface — the fold, the tucked thought's menu, and the mark for new words

## Current Focus

The surface's own grammar is settled for this round. The last unresolved thread is
**the watching vocabulary** — whether "watching" is the word the product uses for
enrolling in a conversation, still open from the earlier readiness walk
(`handoff-2026-08-17_readiness-walk-delta.md`). Everything below is landed and
reviewed; nothing in it is waiting on a decision.

One caveat the next session inherits: the user's stored state was polluted mid-round
by a QA lever that wrote `talkSeenAt: 0`. A migration now normalises it on load
(see Learnings), so a reseed is optional rather than required — but the seeded
20h-mark demo on **Go Concurrency Patterns** only comes back after a reseed.

## Task(s)

Four things landed, in order:

1. **Reply withdraws behind the fold.** While a reply group holds a tail back, the
   group's foot shows only "More replies". Reply appears once nothing is hidden.
   Rationale in-file: answering a turn whose replies you have not read is answering
   half a conversation, and the two controls side by side read as a pair of equal
   choices. The conversation's own composer at the foot is always open, so there is
   never a state with no way to speak.
2. **The tucked thought's `…` menu on a one-line band.** A thought the band shows
   whole has no open control, so its author previously had no way to fix or withdraw
   it. The menu now takes the mark's place. Edit has nowhere to write on the band, so
   it brings the thought card forward and lands in the editor there.
3. **The mark for new words: the margin tab, replacing the full-turn wash.**
   Ratified from a whiteboard (option 02). The return banner's own tab — sage, 3×22,
   radius 2 — standing in the turn row's flow at the row's own gap. Always in the
   geometry, so a turn does not move when it colours.
4. **QA staging in Config** (`window.ConfigExtra`), because the arrival mark cannot
   be staged from inside the surface.

Thought-delete stays **unconfirmed** (no modal). The user raised that it cannot be
reinstated, and settled on leaving it: the same rule holds elsewhere, so a modal here
would be inconsistent. The reinstatement question is a separate one about the whole
delete grammar and is **not** open against this control.

## Critical References

- `skills/build-candidate/SKILL.md` — the candidate is the app carried by an overlay
  over one shared `app/`, never a fork.
- `CLAUDE.md` — the ratification rule, and kebab-case file naming.
- `docs/specs/lm-652-discourse/handoff-2026-08-17_readiness-walk-delta.md` — the
  unstated calls from the previous round; still the reference for anything this
  handoff does not name.

## Recent changes

**`docs/specs/lm-652-discourse/cand-lm652-surface.jsx`**
- `CandTurn:156` — the wash is gone. A `tab(bright)` element is the row's first
  child on every turn (including the deleted tombstone, where it is transparent),
  so seen and unseen turns share one geometry.
- `CandTalk:~240` — `cut` falls back to `Date.now()` when the card has no mark.
- `CandTalk` rail `marginLeft` 36 → **49** (3px tab + 10px gap), so a reply's tab
  lines up under its parent's avatar rather than under the tab above it.
- `CandTalk:~284` — Reply gated on `rest === 0`.
- `CandTurnMenu:93` — takes `onOpenChange`, so an owner can raise its row while the
  panel is out.

**`docs/specs/lm-652-discourse/cand-lm652-card.jsx`**
- `CandBandFace` — takes `api`, `onEdit`, `onMenu`; renders `CandTurnMenu` in the
  `!held` branch when the thought is yours.
- `CandAltFace` — takes `editRequest`; an effect opens the editor when it bumps.
- `CandCardRow` — `editReq` and `bandMenu` state; the row wrapper takes
  `position: relative` + `zIndex: 30` while the band's menu is open; the paper
  card's `overflow` is now `moving ? 'hidden' : 'visible'`.

**`docs/specs/lm-652-discourse/cand-lm652-parts.jsx`**
- `candFresh` — a falsy mark means no baseline: nothing is unseen.
- `CAND_WASH` is retained as an export but is no longer read by the surface.

**`docs/specs/lm-652-discourse/cand-lm652-main.jsx`**
- `candMigrateMarks(api)` + a one-shot `setTimeout` from `bind()`.

**`docs/specs/lm-652-discourse/cand-lm652-qa.jsx`** — new. `window.ConfigExtra`.

**`app/config.jsx:254`** — renders `window.ConfigExtra` when present. The only `app/`
edit, and it is inside the deletable Config aid.

**`circlists-lm652.html`** — one script tag for `cand-lm652-qa.jsx`.

## Learnings

- **A falsy read mark cannot simply be reinterpreted.** Treating `talkSeenAt: 0` as
  "never visited" made those cards report zero unseen words *forever*, including
  words arriving after the reload — the opposite of healing. The fix is to
  **normalise the stored value**, not the reading of it: `candMigrateMarks` maps any
  card with talk and no usable mark to a real timestamp at its newest words.
  Absent and `0` then mean the same durable thing, and later arrivals light.
- **A QA lever must write values the product could have written.** The `0` came from
  a staging button. It now winds back to `oldest turn − 1s`.
- **Nothing in the card row created a stacking context.** The band is one line tall,
  so its menu panel opened under the *next feed card* — z-index inside the row was
  irrelevant until the row itself was raised. Worth a `GOTCHA.md` entry if the user
  approves; not added.
- **The reply rail and the margin tab share a gutter.** The tab is at x=0, the rail
  13px inboard. This was named as option 02's stated cost and accepted.
- **Sandbox verification of this surface is slow.** Reaching a conversation takes
  banner → roster row, and the screenshot harness re-renders the DOM (scroll
  positions reset, and `overflow`/stacking read differently). Drive it with staged
  clicks in one `multi_screenshot` call rather than a chain.

## Artifacts

- `docs/specs/lm-652-discourse/wb-new-words.html` — the whiteboard: 00 today's
  baseline, 01 the waterline, 02 the margin mark (ratified), 03 the unread byline.
  Each with a stance and a cost, seeded with a run of new turns at the foot *and* one
  new reply buried in an older group.
- `docs/specs/lm-652-discourse/cand-lm652-qa.jsx` — the Config staging block.
- Root is now only `circlists.html`, `circlists-homepage-demo.html`,
  `circlists-lm652.html`. Thirteen `pg-*.html` entries were deleted on the user's
  instruction; their modules remain in the spec folders, so any of them can be
  re-entried by writing a new root HTML with the same script tags.

## Action Items & Next Steps

1. **Resolve the watching vocabulary** — the one open decision. Present options,
   recommend, stop.
2. **Walk the margin tab on the app posture** (Config → Platform → Mobile). It has
   only been read on desktop web. The 13px gutter is the thing to check at 390px.
3. **Consider whether the roster banner should carry the tab too** — it says who
   spoke, but nothing in the shelf uses the new mark. Not raised with the user yet;
   do not build it unprompted.
4. **`CHANGELOG.md` has not been touched.** The margin tab replacing the wash is
   arguably a shape-level change to how new words are read, but it sits inside an
   unratified candidate, so nothing is landed to record. Ask before writing an entry.

## Other Notes

- The user's patience ran thin twice this round, both times on the same failure:
  answering a plain bug report with analysis instead of a fix. When the report is
  "X shouldn't do Y", read it as a defect and fix it; ask only when two readings lead
  to opposite changes.
- The user reads screenshots closely and reports real defects from them. Take a
  reported visual defect as true even when the code looks correct — twice it was
  polluted local state, which is a real defect in the staging, not a false alarm.
- Do not re-open the thought-delete modal question.
