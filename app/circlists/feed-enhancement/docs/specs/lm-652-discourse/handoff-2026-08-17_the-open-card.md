---
date: '2026-08-17'
ticket: 'LM-652'
topic: 'discourse — the open card'
status: 'in-progress'
type: 'implementation + exploration'
---

# Handoff: LM-652 discourse — the tucked-under card's swap, and a rebuilt C1

## Current Focus

**C1 is built and unjudged.** `pg-c1-face.html` carries five faces, a mark lever and a
length lever. The user has not yet picked. The next session's first job is to take their
pick and write it up — not to build anything further.

Everything below the transition work is background.

## Task(s)

Three things happened this session, in order.

1. **A review of the tucked-under card in the candidate** (`circlists-lm652.html`). Five
   problems named; the user ratified fixing the transition, the open/close asymmetry and
   the glyph, and explicitly ruled that the thought is shown **whole** — no cap, no
   Read more.
2. **The swap was rebuilt as real motion.** Closed and open were two different React
   trees; they are now one tree whose two cards move past each other. Three separate bugs
   were found and fixed inside that (see Learnings).
3. **C1 was deleted and rebuilt.** The previous C1 had ideated the *mechanic*, which was
   never the question and which the user considers settled. The rebuilt C1 fixes the
   mechanic and varies only what the card looks like once it has come forward.

## Critical References

- `CLAUDE.md` — the ratification rule. Nothing in Part B, and none of the open calls
  below, may be recorded as settled without the user saying so in words.
- `skills/build-playground/SKILL.md` — C1 was built to it: real app, real candidate row,
  chrome that is unmistakably not product, options carrying a stance and a cost.
- The binding constraint on every face: **nothing sits above a card's title.** It rules
  out mastheads and any carry-over placed before the title.

## Recent changes

All in `docs/specs/lm-652-discourse/cand-lm652-card.jsx` unless stated.

- `CandCardRow` is now one tree. Both cards are always mounted; opening moves them past
  each other. The old two-branch render is gone.
- `CandEdge` is no longer mounted. The sliver above an open thought is the **real link
  card**, clipped to `CAND_EDGE` (12px), whose visible band falls inside the card's own
  top padding — so it reads as blank paper with the card's border and top corners.
- `useCandHeight` — both cards carry explicit measured heights; `auto` cannot be animated.
- Geometry is driven by the **Web Animations API** in a `useLayoutEffect` on `[open]`,
  not by a CSS transition. 400ms, `cubic-bezier(0.32, 0.72, 0, 1)`, guarded by
  `prefers-reduced-motion`.
- `.cand-swap` in both entries now transitions only the soft properties (shadow, radius,
  background, border colour).
- The z-index flip happens where the two cards do **not** overlap — the open end of the
  travel — because the overlap animates to 0. Was a mid-travel flip; that was the pop.
- The X close control is gone. Open and close are the same glyph at the same right edge,
  pointing the way that card travels (up from the band, down from the face). The open
  card's visible sliver is also pressable.
- Extension points added for the playground: `Face`, `mark`, `openPaper` props on
  `CandCardRow`; `CandBandMark` and `CandStackGlyph` published.

## Learnings

Three transition bugs, each of which looked like the previous one:

1. **`auto` → px does not animate.** The closed card's height was `auto`, so the first
   frame of opening snapped it to a sliver and only then did the rest travel. Heights must
   be explicit at rest.
2. **A mid-travel z-index flip is visible.** The two cards overlap by 15px; flipping which
   one wins changes that strip in one frame. Close the overlap and flip where they do not
   touch.
3. **A CSS transition does not fire if the `transition` property arrives in the same style
   recalculation as the value it would animate.** React sets the class and the new height
   in one commit, so any "arm the class at toggle time" scheme fails — silently, with the
   card snapping and nothing in the console. This is why the geometry moved to the Web
   Animations API. **Candidate for `GOTCHA.md` — needs the user's approval first.**

Also worth knowing: **animations cannot be verified from the tooling side.** The capture
path clones the DOM and loses running animations, and probing the preview with rAF gets
throttled — both read as "it works" or "it snaps" regardless of the truth. Motion has to
be judged live by the user. This cost several rounds.

## Artifacts

- `circlists-lm652.html` — the candidate. Part A defects D1–D5 fixed in an earlier
  session; the swap motion landed in this one.
- `pg-c1-face.html` — the rebuilt C1 entry.
- `docs/specs/lm-652-discourse/pg-c1f-store.jsx` — options, levers, seed.
- `docs/specs/lm-652-discourse/pg-c1f-faces.jsx` — the five faces and the row that
  installs them (it mounts the candidate's own row; it does not copy it).
- `docs/specs/lm-652-discourse/pg-c1f-bar.jsx` — the header bar and the install.
- Deleted: `pg-c1-thought.html`, `pg-c1-store.jsx`, `pg-c1-card.jsx`, `pg-c1-surface.jsx`,
  `pg-c1-bar.jsx` — the invalid C1.
- Untouched and still live: `pg-c2-marks.html`, `pg-c3-return.html`,
  `pg-c4-thought-field.html`. **The user reports all three unreadable; all three load
  clean here** — they render, their bars work, and there are no console errors. Not
  reproduced, cause unknown. Ask what the user sees before changing anything.

### The C1 option set

Five faces, each a complete answer to both halves — what comes over from the link card,
and how the thought is set so it reads as somebody's words:

1. **Bare** — nothing but the title; the thought is the body of the card.
2. **Source line** — favicon and source under the title, in the card's own vocabulary.
3. **Thumbnail kept** — the preview image stays exactly where it is, beside the title.
4. **Said** — the thought set as speech, contributor in a left gutter.
5. **Inset** — the face stays the white card; the *thought* takes the paper.

Mark lever (the tell on the band, applied across all five): Chevron (what the build
carries), **Lines**, Second edge, Word, None. Length lever: Mixed / One line / Paragraph /
Paragraph + bullets.

## Action Items & Next Steps

1. **Take the user's C1 pick** — a face and a mark — and write it up. Do not build first.
2. **Part B copy is still unratified.** Four places (surface name, Add popover words,
   return banner, roster eyebrow); candidates were proposed in an earlier session and
   nothing was committed. They are still open.
3. **C2, C3 and C4: the user cannot read them; they load clean here.** Not reproduced.
   They do not reference any of the renamed pieces in `cand-lm652-card.jsx`, so this
   session's rework is an unlikely cause. Get the specific symptom from the user before
   changing them. Separately, C1 was rebuilt because it had answered the wrong question —
   worth re-reading C2–C4 against their briefs in case the same happened there.
3. **The CSS-transition-ordering trap is recorded** as `GOTCHA.md` entry 12, with the
   two related traps (`auto` is not interpolatable; a discrete z-index flip is visible
   where the elements overlap).
5. **`CHANGELOG.md` — nothing to add.** The swap is a refinement inside an existing
   feature, not a change to the shape of the product.

## Other Notes

Open calls made this session that the user has **not** ratified:

- The X close control was removed rather than kept alongside the new one.
- The open card's sliver is pressable as a second way back.
- The alternate face's content was left exactly as it was — no favicon, no source line, no
  colour brought in. The user asked about this twice; it is deliberately **not** decided,
  because it is the question C1 exists to answer.
- A short thought still renders an inert band with no chevron, and two bands that look
  alike can behave differently. Raised, not fixed.
- In C1, the close control is held constant across the mark options so the *opening* mark
  is judged on its own.

Standing instruction from the user, learned the hard way this session: **do not ideate the
mechanic.** The swap is settled. Ideation is for what the card looks like once it is open.
