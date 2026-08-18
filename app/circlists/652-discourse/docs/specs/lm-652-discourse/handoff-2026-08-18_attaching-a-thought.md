---
date: '2026-08-18'
ticket: 'LM-652'
topic: 'attaching a thought'
status: 'complete'
type: 'exploration → implementation'
---

# Handoff: attaching a thought — the empty band, ratified and integrated

## Current Focus

Nothing open. Option 4 ("Opens, then settles") was ratified in words and is integrated
into the candidate build; the last instruction was to summarise and write this handoff.

**Not done, deliberately:** no `CHANGELOG.md` entry. The user was asked and has not
ratified one. Ask before writing it. It probably qualifies — a card can now gain a
thought after the fact, which changes the shape of contribution — but that is the
user's call, not the next session's.

## Task(s)

Two playgrounds, then an integration.

1. **`pg-attach-thought.html`** — five answers to *where* the affordance lives, drawn
   in both the Active feed and Overview, with a lever for the card's two states
   (never had a thought / thought just deleted): empty band, pen in the foot row,
   Overview-writes-it, bare edge, card menu. **The user picked the empty band**
   ("genuinely gorgeous"), with a reservation about the writing field's controls.
2. **`pg-empty-band.html`** — five resolutions of that band, since the band itself was
   settled and only what follows the press was open. Three grow it in place (as built /
   no close at all / a pair beneath), two open the card (stays up / opens then settles).
   **The user ratified option 4, "Opens, then settles"** — "absolute perfection".
3. **Integrated 4 into the candidate build** (`circlists-lm652.html`). Not a fork, not
   a flag: the empty band is now a state of the shipped band, and the writing field a
   face of the shipped paper card.

## Critical References

- `skills/build-candidate/SKILL.md` — the candidate build *is* the app; deltas land in
  `cand-*` overlays over the one shared `app/`.
- `docs/specs/lm-652-discourse/cand-lm652-card.jsx` — where the whole integration lives.
- `CLAUDE.md` — ratification rule; nothing recorded as settled without the user's words.

## Recent changes

Integration, all in the candidate:

- `cand-lm652-card.jsx:91` — `candCanWrite(item)`: your own card, no thought, not pending.
- `cand-lm652-card.jsx:95` — `CandBandFace` returns the **empty band first**, before any
  read of `item.thought`. This ordering is load-bearing (see Learnings).
- `cand-lm652-card.jsx:~285` — `CandWriteFace`: the alt face's geometry (title + cross,
  hairline, your name) with a field for the words and `Add` in the foot row beside the
  source line.
- `cand-lm652-card.jsx:~395` — `showBand` now covers a writable card as well as one with
  a thought, so the row is the same either way.
- `cand-lm652-card.jsx:~420` — `heldFace` state: holds `'write'` (after Add) or `'alt'`
  (after Delete) through the closing travel, cleared when closed and settled.
- `cand-lm652-parts.jsx:205` — `candAddThought(api, item, text)`, added beside
  `candEditThought` / `candDeleteThought` and exported at line 227.

Playgrounds (kept, for the reasoning record):
`playground/pg-attach-thought.html` + `pg-652t-{store,attach,wire}.jsx`;
`playground/pg-empty-band.html` + `pg-band-{store,row,wire}.jsx`.
Both registered in `playgrounds.json` under LM-652.

## Learnings

- **`CandBandFace` reads `item.thought` at the top of its body.** An early-return for the
  empty state added *below* those reads crashes every card that has a band
  (`Cannot read properties of undefined (reading 'by')`), taking the whole app blank.
  The branch must come first. Cost one blank-page debugging round.
- **A row that stops matching its own predicate is unmounted mid-gesture.** In the rig,
  the moment the thought landed the item was no longer "yours with no thought", so the
  playground row was swapped for the shipped one — which mounts closed and still. Both
  "3 and 4 look identical" and "it disappears instead of collapsing" traced to this one
  cause. The rig solved it with `PGB.hold`; the candidate does not need it, because the
  card there is always the same row.
- **Resolve-then-collapse reads as two events.** Swapping the open face to the finished
  thought before closing shows the result and *then* moves. Hold the face you were
  looking at through the travel and let the band underneath (already remeasured at the
  new height) be what you land on. Applies equally to delete — that was a separate,
  explicitly requested fix.
- **A stacking flip must follow state, not the animation.** `setFront(false)` inside the
  `moving` effect left the flip standing on any close that ran without a travel (option
  switch, reset), and the tucked band then painted *over* the card. It now follows `open`
  unconditionally. Worth considering for `GOTCHA.md` — needs user approval.
- **Rig hygiene:** a reset that only undid one field could not undo a card read or deleted
  while playing. `pgbReset` now restores the whole circle from `pgbItems()`.

## Artifacts

- `docs/specs/lm-652-discourse/cand-lm652-card.jsx` (integration)
- `docs/specs/lm-652-discourse/cand-lm652-parts.jsx` (`candAddThought`)
- `docs/specs/lm-652-discourse/playground/pg-attach-thought.html` (+ 3 modules)
- `docs/specs/lm-652-discourse/playground/pg-empty-band.html` (+ 3 modules)
- `playgrounds.json` (both rigs registered)

## Action Items & Next Steps

1. **Ask about the `CHANGELOG.md` entry.** Do not write it unprompted.
2. **Overview is unverified.** The integration reaches it through the same `CandCardRow`,
   so it should hold, but the empty band and the round trip were only played in the
   Active feed. Check the head card on the conversation surface.
3. **App posture unverified.** Per `MOBILE.md` this is a shared surface and needs no
   per-posture edit, but it has not been looked at in the app shell.
4. **Consider whether the empty band belongs on the Read tab.** Today `showBand` is
   `tab === 'active'` only, inherited unexamined from the shipped rule.
5. **Ask before archiving the two rigs.** They carry the reasoning behind a ratified
   decision.

## Other Notes

- The user's reservation that started rig 2 was specifically the **X hanging off the side
  of the field, out of sympathy with the send control**. Option 4 dissolves it rather than
  solving it: the cross becomes the open face's own cross, and Add sits in the foot row.
  If 4 is ever revisited, that problem returns.
- Discarded with reasons on the record, in each rig's option notes: the foot-row pen and
  the card menu (both add a third control to a row already under scrutiny), the bare edge
  (unlabelled, under the 44px floor), Overview-writes-it (the feed never says the door
  exists), and the in-place resolutions.
- The `<base href>` "referenced file not found" preview warnings on every nested entry are
  the known false positive recorded in `CLAUDE.md`. The pages load.
