---
date: '2026-08-17'
topic: 'add-surface-whiteboard'
status: 'in-progress'
type: 'exploration'
---

# Handoff: add-surface whiteboard — five add surfaces built, the Swell's framing unresolved

## Current Focus

**Do not pick up the Swell-framing question unless the user opens it.** The session
ended badly: repeated attempts to resolve how The Swell should be framed inside the
add surface (heading? one line? nothing?) each read as adding bloat, and the user
told the assistant to stop. Nothing is ratified. The board stands as delivered.

If the user returns to this work, the live question is still *which of the five
surfaces* they want — that was the whiteboard's actual purpose and it has never been
answered. The Swell-framing lever is a side question that only becomes answerable
after a direction is chosen (the right answer differs per option).

## Task(s)

Built, from a self-contained prompt pasted in chat (the prompt is upstream in
business-ops; not mirrored here):

- A **whiteboard** — `pg-wb-add-surface.html` — carrying five committed, live
  answers to how the Add-a-link surface should look and behave, each drawn at both
  widths (390 bottom sheet + desktop popover), sharing one state per option.
- Live: typing, growth, the length switch (empty / one line / paragraph / +bullets),
  the mark-as-read toggle and The Swell arriving beneath it, the FAB dismissing and
  re-opening the surface.
- Then, at the user's request, a board-wide lever for how much framing The Swell
  carries. Iterated three times (see Learnings) and left at three modes.

The five (name / direction / cost / length rule) are tabulated in
`docs/specs/add-surface/README.md`.

## Critical References

- `skills/build-playground/SKILL.md` — the rig rules this follows (real components
  mounted, not redrawn; both widths; seeded for the problem).
- `docs/specs/lm-652-discourse/cand-lm652-add.jsx` — the **baseline** add popover
  being replaced (URL `Field` + `CandWrite` paper textarea + toggle + Swell at
  box 236). Every option must differ structurally from this; it is the prompt's
  named "bare textarea" fail state.
- `CLAUDE.md` — ratification rule. Nothing here is decided.

## Recent changes

- `pg-wb-add-surface.html` — root entry. tokens.css + swell.css + the app rules the
  surfaces depend on, then `app/primitives.jsx`, `app/swell-reactions.jsx`,
  `docs/specs/lm-652-discourse/cand-lm652-parts.jsx`, then the three modules.
- `docs/specs/add-surface/wb-add-parts.jsx` — frames, sheet/popover `Shell`, `Grow`
  (auto-growing textarea), `Collapse`, `SwellBlock` (mounts the real input trio),
  `ReadRow` (mounts `CandSwitch`), re-drawn `Fab`. `WBSwellMode` context at :77.
- `docs/specs/add-surface/wb-add-options.jsx` — the five options + `WB_OPTIONS`
  metadata (number, name, direction, cost, length rule).
- `docs/specs/add-surface/wb-add-board.jsx` — board, per-option header strip,
  `WB_SWELL_MODES` at :10.
- `docs/specs/add-surface/README.md` — the record of the five.

## Learnings

- **The Swell-framing knot, in full** (so the next session does not re-walk it):
  the user found the shipped "How did it land?" + "Your reaction for the circle."
  bloated under a toggle; disliked an invented mono eyebrow as *new syntax*;
  disliked the same words in mono because **the typeface itself is the new thing**;
  and disliked silence because "optional" and the reaction's role stop being
  communicated. Nothing textual satisfied both ends.
- **Why silence loses the message**: upstream, optionality is carried by the
  **Skip reaction** button. The add surface has no Skip (Add commits), so silence
  drops that message rather than inheriting it. This is the load-bearing fact.
- **Suggestions that were floated and NOT accepted** (do not re-propose unprompted):
  an empty ring at the disc centre (rejected — cannot change the Swell), a recessed
  tray, a hint line on the toggle row, and removing the Swell from the add surface
  altogether. The last one the user first agreed was "asking a lot", then rejected.
- **A structural read worth keeping**: at 232px the disc reads as a second question
  whatever sits above it, so copy above it tends to read as justifying its presence.
  Unresolved, and the user's call, not ours.
- **Process failure to avoid**: two lever changes were built without asking. The
  user asked explicitly for permission before execution. Ask first here.
- Mounted, not redrawn: `SwellPad` / `SwellPalette` / `SwellGlyphRadios`,
  `CandSwitch`, `CAND_PAPER`, `Field`, `Button`, `Avatar`. Only the FAB is redrawn,
  because the shipped one is `position: fixed` and cannot live inside a frame.
- Option 2's two faces animate height via a `ResizeObserver` on the active face
  (`wb-add-options.jsx`) — a one-shot measure left white space behind whenever the
  Swell collapsed mid-transition.

## Artifacts

- `pg-wb-add-surface.html` (root entry — must stay at root for `app/*`, `tokens.css`,
  `brand/` to resolve)
- `docs/specs/add-surface/wb-add-parts.jsx`, `wb-add-options.jsx`, `wb-add-board.jsx`
- `docs/specs/add-surface/README.md`

## Action Items & Next Steps

1. **Wait for the user.** No open build task. Do not touch the Swell framing.
2. When they return: ask which of the five (by number) they want to take forward,
   and whether they want any of them merged. That is the whiteboard's open question.
3. Only after a direction is picked: revisit the Swell block's framing *inside that
   option*, and offer the fork as the user's to call — accept the disc as-is, or
   reopen the settled "The Swell rides the add surface" item.
4. No `CHANGELOG.md` entry — a whiteboard is not a product-shape change.

## Other Notes

- The user was frustrated at the end of the session. Read it as urgency, not as an
  instruction: nothing correct here should be reversed, and nothing should be
  changed to appease it. Lead with their pick, not with more options.
- The five options are deliberately distinct on structure, not padding: 1 One box,
  2 The other side, 3 The note, 4 Asked, 5 Handed over. Two that screenshot the same
  would be one option — keep that bar if any are revised.
- The prototype itself (`circlists.html`, `app/*`) was not touched, by design.
