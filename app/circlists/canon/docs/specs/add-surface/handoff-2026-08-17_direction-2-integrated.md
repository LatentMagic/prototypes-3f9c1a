---
date: '2026-08-17'
ticket: 'LM-652'
topic: 'add surface — direction 2 chosen and integrated'
status: 'complete'
type: 'exploration + implementation'
---

# Handoff: the add surface resolved to direction 2, and integrated into the candidate

## Current Focus

**Nothing is open.** The whiteboard's question — *which of the five add surfaces* — was
answered (direction 2), every part of it was resolved one at a time, and the result is in
the candidate (`circlists-lm652.html` via `docs/specs/lm-652-discourse/cand-lm652-add.jsx`).
The next session's first job is whatever the user brings; if they bring nothing, the
standing LM-652 queue is in `handoff-2026-08-17_reply-density-and-the-fold.md` (Part B copy
is the oldest item).

Background only: the three boards built this session are answered and can be archived once
the user is done comparing.

## Task(s)

The user reviewed the five add surfaces out loud and landed on **2, "The other side"** —
the only one that solved the space problem (a second face that is nothing but room to
write). 1 was "pretty" but resolved nothing, 3's warm-paper-everywhere was rejected
outright, 4 was rejected, 5's paste-link treatment was liked and was later harvested.

Direction 2 then had four open defects, each resolved with its own board, one ratification
each, in this order:

1. **The returned state** — `pg-wb-returned.html` (4 answers). Picked **1, "Clamped, and
   the cut is drawn"**. Then corrected twice by the user: the fade must be on the moment
   the thought runs to a **second** line (not only when it overruns), and the edit glyph is
   **centred at every height**. One rule, so the row never behaves differently at two lines
   than at three; the accepted cost is that an exactly-two-line thought gets the foot of its
   second line veiled.
2. **The way back off the writing face** — `pg-wb-return-ctl.html` (4 answers: arrow only /
   tick only / arrow + tick / as built). Picked **1, arrow only**; Done is gone. The user's
   own reasoning: a tick doesn't work when the act is just going back, and landing on the
   paper row teaches implicitly that the words are kept. The 44px arrow row was kept because
   the user liked the extra space it puts at the top.
3. **Saying the thought is optional** — resolved in words, not on a board. It is said by the
   **writing face's placeholder** so the face you commit from stays quiet:
   **"Say why you're sharing it, or leave it blank."** Earlier candidates were rejected for
   not parsing (noun phrase + imperative); this one uses the Swell caption's own
   command + command construction. Vetted live against the wiki voice doc.
4. **The link's slot** — `pg-wb-linkslot.html` (3 answers). Picked **3, "The glyph, on
   white"**: the surface's own white and the standard border, with a link glyph at the head
   of the row. No clipboard reading anywhere; auto-paste is parked, not rejected.

Then **integration**: `cand-lm652-add.jsx` was rewritten as direction 2.

## Critical References

- `CLAUDE.md` — the ratification rule (every call above was ratified in words) and the
  chat-brevity rule.
- `skills/build-playground/SKILL.md` — the three boards were built to it; `pg-wb-linkslot.html`
  mounts the **real** direction 2 (`window.OptOtherSide`) with only the slot swapped, rather
  than a copy of it.
- `docs/specs/add-surface/README.md` — the five directions, with each one's cost.
- `skills/frontend-ui-engineering/references/accessibility-checklist.md` — the bar that caught
  the focus defect below.

## Recent changes

`docs/specs/lm-652-discourse/cand-lm652-add.jsx` — rewritten. The header comment records
which board ratified which part.

- `CandLinkSlot` — the glyph-on-white slot, `forwardRef` so the surface still focuses the
  input on open. Carries the validation error itself (destructive border + `role="alert"`
  message); the shipped `Field` is no longer used here.
- `CandThoughtRow` — the returned state. `scrollHeight > 30` decides the fade (i.e. a second
  line exists), `maxHeight: 42` holds two lines, `alignItems: center` always.
- `CandRoom` — the writing face's auto-growing textarea, 6 rows at rest, 300/250px then
  scrolls, `max={500}` (the cap is unchanged from the previous field).
- One form, two faces: `linkFaceRef` / `writeFaceRef`, a `ResizeObserver` on the **active**
  face driving `faceH`, and `translateX(-50%)`. Both transitions drop under
  `prefers-reduced-motion` (`still`), matching `cand-lm652-card.jsx`.
- The inactive face carries **`inert`** — not `aria-hidden` (see Learnings).
- `submit` returns to the link face if fired from the writing face; Escape steps back off
  the writing face before it closes the surface; focus follows the face both ways (320ms,
  after the 300ms travel).
- Untouched by design: Mark as read, the whole Swell block **including its
  "How did it land?" heading and its own caption**, Add/Cancel, and the item shape
  (`watching`, `talkSeenAt`, `atAdd`, D2/D5 comments).

`circlists-lm652.html:426` — `.cand-glyphbtn:hover` added for the back arrow.

`docs/specs/add-surface/wb-add-options.jsx` — direction 2 brought up to the ratified state
and made mountable: `LinkRow` (the ratified slot) is the host's default, `LinkSlot` prop
overrides it, `ThoughtRow` extracted, Done removed, 44px arrow row, new placeholder.
Exports `OptOtherSide`, `ThoughtRow`, `LinkRow`. The hairline above the Swell was removed in
options 1/2/4/5 earlier in the session, and the Swell block's spacing tightened
(`wb-add-parts.jsx`: bottom padding 16 → 12, so caption→buttons matches buttons→edge at 20).

New boards: `docs/specs/add-surface/wb-returned.jsx`, `wb-return-ctl.jsx`, `wb-link-field.jsx`
with entries `pg-wb-returned.html`, `pg-wb-return-ctl.html`, `pg-wb-linkslot.html`.

`github.md` — `## Last sync` refreshed for the live voice-doc read.

## Learnings

- **`aria-hidden` does not remove focusability.** Both faces are always mounted, so with
  `aria-hidden` alone a Tab from the link face landed in the off-screen textarea, and from
  the writing face it reached **Add** — the surface could be submitted from a pane the member
  could not see. `inert` on the inactive wrapper removes focus *and* AT exposure in one
  attribute, so the `aria-hidden` goes with it. Worth proposing for `GOTCHA.md`; **not added,
  no approval asked yet**.
- **The shipped `Field` carries its own `margin-bottom: var(--space-4)`**
  (`app/primitives.jsx:141`). Any replacement slot must carry it or the surface loses the gap
  between the link and what follows — the user spotted this immediately.
- **A "cut" test measured against `clientHeight` is not what the eye wants.** Fading only
  when the text overruns two lines means a two-line thought and a three-line thought look
  like different components. The rule the user ratified is *is there a second line*.
- **Copy has to parse as one sentence.** "Why you're sharing it. Or leave it blank." was
  rejected as not making English sense — a noun phrase cannot be joined to an imperative.
  The Swell caption's construction (command, comma, command) is the pattern to reuse.
- **Process note, from the user's own words: stop inventing problems.** After integration I
  listed four "open" items; the user's read was that they were mostly made up, and they were
  right (the prompt wording and auto-paste were mine, not defects). Say what is actually
  blocking, and nothing else.
- **Also: don't ask what "write it up" versus "integrate" means twice.** The work is a
  feature of the 652 candidate; integration was always the point. This cost the user two
  turns and real frustration.

## Artifacts

- `docs/specs/lm-652-discourse/cand-lm652-add.jsx` — the integrated surface.
- `circlists-lm652.html` — the candidate carrying it.
- `pg-wb-add-surface.html` + `docs/specs/add-surface/wb-add-{parts,options,board}.jsx` — the
  five-direction whiteboard, with direction 2 now at its ratified state.
- `pg-wb-returned.html`, `pg-wb-return-ctl.html`, `pg-wb-linkslot.html` + their modules.
- `pg-wb-swell-framing.html` + `wb-swell-framing.jsx` — the earlier Swell-framing board,
  still unratified.

## Action Items & Next Steps

1. **Drive the candidate's FAB** and judge the integrated surface in the app rather than on a
   board. Nothing is known to be wrong with it.
2. **Archive the four add-surface boards** (`pg-wb-add-surface`, `pg-wb-returned`,
   `pg-wb-return-ctl`, `pg-wb-linkslot`) once the user is done comparing — entries delete,
   modules move to `docs/archive/add-surface/`.
3. **The Swell's framing inside the add surface is still unratified.** The candidate keeps
   "How did it land?" + its caption; the whiteboard uses a single caption and no heading. They
   disagree on purpose — the framing question was never answered. Do not touch it unless the
   user opens it (see `handoff-2026-08-17_add-surface-whiteboard.md` for the full knot).
4. **Standing LM-652 queue** (unchanged): Part B copy, "watching" is probably the wrong word,
   the domain on the closed card, `CAND_OWN_MIN`, C2–C4 reported unreadable but never
   reproduced.
5. **Two things the user raised and parked, not rejected:** a new heading for the popover
   (the voice doc asks us not to name the mechanism, and it currently says "Add a link"), and
   auto-populating the slot from the clipboard.
6. **`CHANGELOG.md` — nothing to add.** This is the shape of one surface inside an existing
   candidate feature, not a change to how the product works.

## Other Notes

- The user's stated read of the whole exercise: what solved the space problem is the second
  face. Everything else was detail hung off that.
- Direction 2's cost stands and was accepted knowingly: the words are out of sight when you
  commit, which is exactly why the returned row had to be got right.
- Rejected and not to be re-proposed: a tick as the only control on the writing face
  (implies its opposite — that leaving another way discards the words), Done alongside the
  arrow, and any wording that adds a second "optional" to the link face.
