---
date: '2026-09-21'
ticket: 'LM-652'
topic: 'clearing-conversations-round-two'
status: 'in-progress'
type: 'exploration'
---

# Handoff: clearing conversations — round two, rebuilt on a new axis, awaiting the user's pick

## Current Focus

**Nothing is ratified.** Round one was rejected outright; round two has been
built and handed over, and the user has not yet played it. The next session's
first move is to take their reaction — not to build, and not to record anything
as settled.

Background only: round one's shapes. They are gone from the rig and survive only
as the rejection record in this handoff and in the note.

## Task(s)

**Done.** Rebuilt the playground from the affordance up: three options that
differ on *what kind of thing the act is*, plus an undo lever that applies to
all three. Same entry, same five modules, same ticket folder.

**Not done, deliberately.** No change to `app/`. Both bars in the rig remain
*forks*; `app/talk-return.jsx` and `app/home-returns.jsx` are untouched.

## Why round one was rejected (2026-09-20)

The user rejected all three "quite strongly", and the rejection was of the
**affordance**, not the placement:

- The collapsed head's text "Clear" sat loose beside the bordered chevron —
  *"text - chevron - yuck"*, two registers colliding in the one row that is
  always on screen. Also judged inappropriate to expose on the collapsed bar at
  all.
- The foot-of-panel clear read as **one more conversation** — title over
  subtitle, in the rows' own grammar — and on home it was cut off from its own
  subject by "More in the circles below", so the foot carried noise.
- Undo was *"ok"*, but it was not a third idea: option 3 was option 2 with undo
  bolted on. **Only two options were actually invented.**

The user's instruction: engage with a deeper level of design beauty and
flexibility; three genuinely disparate options; permission for redesign given.
On undo specifically, they asked the real question — *is reversing normal for
notifications of this ilk?* — and reasoned that a one-click, somewhat terminal
act may earn one.

## The rule taken from the rejection

**The act may borrow the BAR's forms — the accent rule, the boxed 34px control,
the hairline, the card's own edges — and never the ROWS' forms.** No title over
subtitle, no trailing chevron, nothing that invites a press expecting a
conversation. This is written at the top of `pg-clr-head.jsx` so it survives the
next session.

## The three options (round two)

The axis is **what kind of thing the act is**:

1. `base` — **the base.** The open panel gains a floor: a full-bleed band across
   the card's own edges on `--color-surface-sunken`, hairline above, carrying the
   act, the true count, and the teaching line. Not a row: no chevron, no
   title/subtitle stack. It **absorbs** "More in the circles below", so the foot
   of the panel tells one story instead of two.
   *Cost:* two presses, and on home it sits at the furthest point in the panel
   from where you decided.
2. `pair` — **a peer of the chevron.** Nothing on the collapsed bar at all. Open
   it and the head changes register: the two lines fall to one short count (the
   list beneath now says what the subline was saying) and the space that buys
   goes to a second boxed control beside the chevron — same 34px height, same
   border, same radius. Two boxes of one material. Label drops to the glyph alone
   under a 400px container query.
   *Cost:* three targets in the head while open, and no room for the teaching
   line — this option teaches nothing before it acts.
3. `sweep` — **a gesture.** No control in either state; at rest this is exactly
   the shipped bar. Press the collapsed bar and pull left: the act is underneath,
   grey while the pull can still be taken back, **accent the moment a release
   would act** — that colour change is the whole of the confirmation. Release and
   the bar plays its ordinary removal.
   *Cost:* undiscoverable (the product swipes nowhere else), no keyboard path,
   and unreachable from the open panel.

**Undo is no longer an option — it is a lever** in the rig chrome (`Off` / `On`),
applying to all three, so reversal is judged on its own. On: the bar becomes its
own receipt for 8s carrying Undo, then plays its ordinary removal.

## Critical References

- `skills/build-playground/SKILL.md` — the rig follows it; the nested-entry
  `<base>` rule is in `CLAUDE.md` under "Playgrounds — placement and the
  launcher".
- `CLAUDE.md` ratification rule — why this handoff records no decision.
- `app/talk-return.jsx`, `app/home-returns.jsx` — **source of truth** for both
  forked bars. Arrival/removal motion, the snapshot-while-open hold and the
  head's wording belong there first, then get carried into the fork.
- `specs/governance/standards/ui-design.md` (monorepo, read live) — the touch
  floor and prefer-a-statement rules bear on option 3's discoverability cost.

## Recent changes

All under `docs/specs/lm-652-discourse/playground/`:

- `pg-clr-head.jsx` — **rewritten.** The borrow-the-bar-never-the-rows rule at
  the top, then `PgcWholeHead` (the shipped head, verbatim), `PgcBase`,
  `PgcPairHead`, `PgcSweep`, `PgcReceipt`, plus `PGCR` (the module-level receipt
  store) and the shared count/teaching helpers.
- `pg-clr-store.jsx` — **rewritten.** New axis in the header comment, new
  `PGC_OPTIONS` prose (dir + cost per option), `PGC.undo` added to the persisted
  state. The act (`pgcTargets` / `pgcCount` / `pgcWrite`) and the seed wrap are
  unchanged.
- `pg-clr-bar.jsx` / `pg-clr-home.jsx` — **rewritten** against the three new
  shapes; `opt === 'pair' && open` swaps the head, `opt === 'sweep' && !open`
  wraps it, `opt === 'base' && open` appends the band. Home suppresses the
  leftover note under `base`.
- `pg-clr-wire.jsx` — new blurb; `levers()` now returns the Undo toggle plus
  "Put them back".
- `pg-clear-conversations.html` — one CSS block added above the chrome styles:
  `.pgc-base` hover/press, `.pgc-pairbox` hover/press, and the
  `@container (max-width: 400px)` rule that drops `.pgc-pairword`.

Edited: `playgrounds.json` (LM-652 `touched` → 2026-09-20, note rewritten),
`note-2026-09-19-clearing-conversations.md` (round-one rejection recorded, axis
replaced, undo reasoning added).

## Learnings

- **Round one's defect was grammar, not geometry.** Both rejected shapes were in
  defensible *places*; they failed because they spoke in the rows' visual
  language. Moving a control does not fix that — changing what forms it borrows
  does. Hence the rule above, and hence an axis about *kind* rather than
  *placement*.
- **"Three options" means three inventions.** Bolting protection onto an existing
  shape reads as a variant, not an option. Protection was demoted to a lever
  precisely so it could not masquerade as the third idea.
- **The case for undo here is the index, not the content.** Clearing destroys no
  words — every conversation stays on its card — so the loss is the *index* of
  which cards had words you had not seen, which cannot be reconstructed
  afterwards. That is the argument to put to the user, and it is the same
  argument notification surfaces usually decline.
- **The sweep needs its click eaten.** A drag that ends on the head would
  otherwise expand the bar, so `PgcSweep` swallows the click in the capture
  phase (`onClickCapture`) when the pointer actually moved. Pointer capture is
  taken only once the gesture locks to the x axis, so vertical scroll survives.
- **The terminality gap persists and now discriminates between options.** Home's
  panel bounds itself to six rows from three circles while the clear ends the
  whole union (ten in four circles on this seed). `base` is the only option that
  carries the total *and* the circle count at the point of the act; `pair`
  carries it in the head's line; `sweep` carries nothing, because a gesture
  cannot say anything.
- **`<base href>` 404 warnings on nested entries remain the known false
  positive** (CLAUDE.md). 45 of them here; the page loads. Nothing for
  `GOTCHA.md`.

## Artifacts

- Entry: `docs/specs/lm-652-discourse/playground/pg-clear-conversations.html`
- Modules: `docs/specs/lm-652-discourse/playground/pg-clr-*.jsx` (6 files)
- Note: `docs/specs/lm-652-discourse/note-2026-09-19-clearing-conversations.md`
- Manifest: `playgrounds.json` (LM-652 ticket)
- Superseded: `handoff-2026-09-20_clearing-conversations.md` (round one)

## Action Items & Next Steps

1. **Take the user's reaction.** Route: the rig opens on home → tap pill 1 / 2 /
   3 → for `base` and `pair` open the strip, for `sweep` drag the collapsed strip
   left. Press Backend Pod for the in-circle bar. "Put them back" re-seeds.
2. **Put the undo question separately.** Toggle the lever on any option. The
   index argument (above) is the recommendation to make; the user has not ruled.
3. **If one ratifies**, it lands in `app/talk-return.jsx` and
   `app/home-returns.jsx` as one shared control — read
   `skills/candidate-build/SKILL.md` first if it should be played as the app
   before merging.
4. **Hold the CHANGELOG.** Nothing has landed and nothing is ratified.
5. **If Q1 (one clear vs per-circle) re-opens**, the per-group clear is still the
   unbuilt option and would need a fourth pill, not an edit to the three.

## Other Notes

- **Held fixed across all three, from the user's earlier lean:** one clear for the
  whole home strip, never one per circle group — a per-group clear rebuilds the
  circle's own bar inside home.
- Round two was built under explicit permission for redesign. `base` no longer
  leaves the shipped head untouched in the open state's foot; `pair` is the only
  option that touches the head itself; `sweep` is the only one that touches
  nothing.
- Not built, and named as not built in the note: per-row dismiss, per-group clear
  on home, and any dialog or toast.
- Rig state stays under its own keys (`pg_clr_v1`, `pg_clr_state_v1`), so playing
  it never touches the product build's state.
