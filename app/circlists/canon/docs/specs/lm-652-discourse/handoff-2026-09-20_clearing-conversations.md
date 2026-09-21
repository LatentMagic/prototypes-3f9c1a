---
date: '2026-09-20'
ticket: 'LM-652'
topic: 'clearing-conversations'
status: 'in-progress'
type: 'exploration'
---

# Handoff: clearing conversations — three ways out of the returns bar, awaiting the user's pick

## Current Focus

**Nothing is ratified.** Three options were built and handed over; the user has
not yet played them or picked one. The next session's first move is to take the
user's reaction — not to build, and not to record anything as settled.

The last instruction acted on was "should be in discourse playground.json": the
rig was moved out of a standalone `docs/specs/clear-conversations/` folder and
into LM-652. That move is done and verified.

## Task(s)

**Done.** Built a playground offering three answers to "the returns bar needs a
button to clear conversations", covering both the in-circle bar and the home
strip, and filed it under LM-652.

**Not done, deliberately.** No change to `app/`. The two bars in the rig are
*forks*, and the shipped `app/talk-return.jsx` / `app/home-returns.jsx` are
untouched.

## Critical References

- `skills/build-playground/SKILL.md` — the rig follows it; nested-entry `<base>`
  rule is in `CLAUDE.md` under "Playgrounds — placement and the launcher".
- `CLAUDE.md` ratification rule — the reason this handoff records no decision.
- `app/talk-return.jsx` and `app/home-returns.jsx` — **source of truth** for both
  forked bars. Any fix to arrival/removal motion, the snapshot-while-open hold,
  or the head's wording belongs there first, then gets carried into the fork.

## Recent changes

New, all under `docs/specs/lm-652-discourse/`:

- `playground/pg-clear-conversations.html` — entry. A copy of `circlists.html`
  with `<base href="../../../../" />`, the pinned-bar chrome CSS, a rig-private
  `CIRC_STATE_KEY`, and the five rig modules loaded before `app/main.jsx`.
- `playground/pg-clr-store.jsx` — the question and the three options as prose,
  the clear act (`pgcTargets` / `pgcWrite`), and the seed wrap.
- `playground/pg-clr-head.jsx` — the shared parts: both head shapes, the ask, the
  receipt, the foot clear, and the one teaching line.
- `playground/pg-clr-bar.jsx` — fork of `CandFeedLead` (in-circle).
- `playground/pg-clr-home.jsx` — fork of `CircHomeReturns` (home strip).
- `playground/pg-clr-wire.jsx` — swaps both bars; declares `window.PGBAR`.
- `playground/pg-clr-topbar.jsx` — copy of `pg-cx-bar.jsx`, the rig's own chrome.
- `note-2026-09-19-clearing-conversations.md` — the written-up question, the
  fixed decision, the axis, and what the rig surfaced.

Edited: `playgrounds.json` — one entry at the top of the LM-652 ticket, and the
ticket's `touched` moved to 2026-09-19.

## The three options

All three do the same write: `talkSeenAt` moves to now on every card the bar
stands for — the same write `app/talk-surface.jsx` makes when you leave a
conversation. Nothing is deleted; nobody else's view moves. All three say so in
the same words: *"Marks them seen in your view. The conversations stay on the
cards."*

They differ **only** on what protects a mistaken tap, because the product
refuses toasts and so has no house undo to reach for:

1. `foot` — clear is the last row of the *open* panel. You cannot clear what you
   have not opened, so nothing asks and nothing needs undoing. Collapsed head is
   untouched.
2. `ask` — clear sits in the collapsed head, left of the chevron; pressing it
   turns the head into the question (count, circles spanned, Clear / Cancel) in
   the bar's own box. No dialog, no scrim.
3. `undo` — same head control, clears at once; the bar becomes its own receipt
   carrying Undo for ~8s, then plays its ordinary removal.

## Learnings

- **The user's two questions were answered asymmetrically, on purpose.** Q1 (one
  clear or one per circle) was taken as *settled by their lean* and held fixed
  across all three — a per-group clear rebuilds the circle bar inside home. Q2
  (undo) was made *the axis*, since it is the live disagreement. If the next
  session is asked to re-open Q1, the options do not currently vary on it.
- **The terminality gap is real and was found by building, not reasoning.** On
  home the panel bounds itself to six rows from three circles, but the clear ends
  the whole union — ten conversations in four circles on this seed. Option 2 is
  the only one that names this before the act; option 1 is the most exposed to it,
  because it implies "you are looking at what you are about to clear" and on home
  that is false.
- **The receipt had to live outside both bars.** It outlives the rows it is a
  receipt for, and the removal animation must not race it, so it sits in a
  module-level store (`PGCR` in `pg-clr-head.jsx`) that both bars read. Both
  forks gate their `out` phase on it.
- **Clearing is terminal by construction**, so the rig would be single-use
  without a way back — hence the "Put them back" lever, which re-seeds rather
  than tracking history.
- **The seed matters more than usual here.** A clear of four rows in two circles
  is not a decision anyone would hesitate over. The rig clones two extra talking
  circles the way `app/states.jsx`'s `stageHome({ crowd })` does, to put home at
  the strip's ceiling.
- **`<base href>` 404 warnings on nested entries are the known false positive**
  (CLAUDE.md). 45 of them here; the page loads. Nothing to add to `GOTCHA.md`.

## Artifacts

- Entry: `docs/specs/lm-652-discourse/playground/pg-clear-conversations.html`
- Modules: `docs/specs/lm-652-discourse/playground/pg-clr-*.jsx` (6 files)
- Note: `docs/specs/lm-652-discourse/note-2026-09-19-clearing-conversations.md`
- Manifest: `playgrounds.json` (LM-652 ticket)

## Action Items & Next Steps

1. **Take the user's reaction.** They have the route: the rig opens on home, tap
   pill 1 / 2 / 3, press Clear; press Backend Pod for the in-circle bar.
2. **If one ratifies**, it lands in `app/talk-return.jsx` and `app/home-returns.jsx`
   as a shared control — read `skills/candidate-build/SKILL.md` first if it should
   be played as the app before merging.
3. **Hold the CHANGELOG.** A clear on the returns bar plausibly clears the
   "fundamental change to how the app works" bar, but only once something lands
   and the user ratifies it. Nothing yet.
4. **If Q1 re-opens**, the per-group clear is the unbuilt option; the rig would
   need a fourth pill rather than an edit to the three.

## Other Notes

- The user said "you are welcome to adapt ui a touch". What was adapted: the
  collapsed head is split into three press targets in options 2 and 3, which is
  the honest cost of a one-press clear and is built rather than described. Option
  1 leaves the shipped head exactly as it is.
- Not built, and named as not built in the note: per-row dismiss, and a per-group
  clear on home.
- Rig state is under its own key (`pg_clr_v1` for the pill, `pg_clr_state_v1` for
  app state), so playing it never touches the product build's state.
