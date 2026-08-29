---
date: '2026-08-14'
ticket: 'LM-652'
topic: 'thought-on-card-reveal'
status: 'awaiting-review'
type: 'exploration'
---

# Handoff: the thought on a card — six reveals, one shelf

Nothing here is ratified. Every option is a candidate. The user has said the next
session is **tuning** — expect targeted display changes to individual options, not
a re-ideation, and change only what is named.

Entry `pg-thought-v11.html` (project root, so `app/*`, `tokens.css` and
`uploads/card-previews/*` resolve) · modules
`docs/specs/lm-652-discourse/pg-t11-*.jsx`. v9 and v10 are untouched and still
playable; v11 loads only v9's card copy (`pg-d9-card.jsx`) and the swell module,
never v9's or v10's rig or app — two React roots would fight over `#root`.

## Current Focus

Tuning how the options **display**. Two rounds of that already landed this
session (see Recent changes); the shape of the six is settled enough to judge, so
the next session should take specific complaints one at a time and resist
redesigning an option that was not mentioned.

Still open underneath it: which family, and which option inside it. The fork the
brief opens is whether either family can hold a LONG thought closed and reveal it
elegantly, so the judgement comes from playing the length control on each.

## The six

Margin — the thought inside the card's head, sage rule in the gutter, card ink.

| | Option | Closed budget | The reveal | Travel |
|---|---|---|---|---|
| M1 | Runs on | two lines, soft edge; the gutter rule runs on past the words, further when there is more | in place | pushes the shelf down |
| M2 | Lifted forward | one line, soft edge; the name left to the footer row | the card comes off the shelf, words whole, scrim behind | nothing moves |
| M3 | Rises over | one line, soft edge | a panel rises out of the card's own head and stands over the cards ABOVE it | nothing below moves |

The background card — REBUILT (was T1–T3, `pg-t11-tuck.jsx`, deleted). A real
second CARD behind the card: `--color-surface` white, `--color-border-1`,
`--radius-lg`, standing 6px wider on each side so its corners show, with the
FRONT card carrying `--shadow-raised` so it visibly sits on top of something.
The old family painted `--color-surface-sunken` (#F5F5F2) on a #FAFAF7 canvas —
2% apart, on a token meaning "a sunken well inside a card" — so it read as a slot
cut into the page. There is no gradient mask anywhere in the family now.

**The closed band follows one rule: it never truncates.** It shows the thought's
opening sentence WHOLE, measured against one line by a hidden probe of the same
width; if that sentence will not fit, the line becomes a label instead — the
name and the extent ("Marcus T. · a paragraph", "· four points"). Fits and
does-not-fit are both live in the seed copy (three each), so the band is judged
in both states.

| | Option | The reveal | Travel |
|---|---|---|---|
| B1 | Comes round | the second card comes round from behind and lands in front of the shelf, aligned to the card above it — two cards, one unit | pushes the shelf down |
| B2 | Comes over | slides up over the card in its own footprint, hairline header carrying the link title so the words never float free | nothing moves |
| B3 | Turns over | two cards, one slot, and the slot turns: the link folds away, the thought comes to the front, and the band below swaps to carry the link's title | the slot's own height only |

Each carries its direction and its cost in the bar, never inside the app frame.

## The answer to the question nobody had answered

The brief asked what the closed state should SIGNAL — that there is something
here, and roughly how much. Three different answers are built, deliberately:
**M1** puts the depth in the gutter rule (it runs on past the cut words), **T1/T2**
put it in how far the slip shows below the foot, **M2/M3/T3** put it in a fixed
budget of words plus one accent verb. Those three answers are as much under
review as the two families, and the winner can be mixed into either family.

## Critical References

- `skills/build-playground/SKILL.md` — mount the shipped component; posture
  follows the window (`< 1024`); Auto never frames, Mobile does; no dead controls.
- `tokens.css` — `--color-sage` is the mark's light, used here only as the
  margin's rule; accent only on the fold verb.
- `GOTCHA.md` 2 and 5 — html-to-image lies about fixed overlays and mid-transition
  opacity (M2's scrim and T3's page both misrender in captures and are correct in
  a real browser); the phone frame's clip layer is the containing block M2's fixed
  lift measures against.

## Recent changes

- `pg-thought-v11.html` — entry. v10's style block verbatim, plus the bar's dark
  tooling styles and the four reveal keyframes.
- `pg-t11-data.jsx` — nine cards, six Active (two with no preview, one that never
  carries a thought at any setting), three Read so the tab beside Active is not
  hollow. Every card that can carry words carries them at all three lengths in
  that member's own register (`T11_WORDS`).
- `pg-t11-words.jsx` — the shared word setting, the measured clip (the closed
  budget, mechanically), byline, fold, Esc/click-away hooks.
- `pg-t11-margin.jsx` — M1–M3, the lifted card, `T11Whole`.
  - **Fixed after review:** M3's rising panel overlapped its own card's action row
    (hardcoded `bottom: 60`). Now `bottom: calc(var(--space-4) + var(--tap-target-min)
    + var(--space-2) + 4px)`; measured 2px clearance at paragraph and bullets
    (a one-line thought has no fold, so nothing opens).
- `pg-t11-back.jsx` — B1–B3 (replaces `pg-t11-tuck.jsx`, deleted).
  - **Fixed after review (twice):** the sheaf's stacked leaves read as several
    cards under the card. `T11Edges` is **deleted**; there is now exactly ONE slip
    per card in all three options, depth carried by how far it shows
    (`t11Depth`, T2's own height). Then T1's slip was cut from ~66px to ~38px by
    putting the clause and the fold on one baseline and dropping the byline; T3's
    page lost its grey slab — the words are the page's matter, 16px/1.65 under a
    hairline, max 62ch.
- `pg-t11-bar.jsx` · `pg-t11-app.jsx` — the bar and the app.

## Learnings (the rebuild)

- **Grey was the whole mistake.** A background card is a CARD: same white, same
  border, same radius. What makes "behind" legible is the FRONT card's shadow and
  the back card standing wider on each side, not a darker fill — and
  `--color-surface-sunken` on `--color-page` is 2% of contrast, so it read as a
  hole in the page rather than paper behind the card.
- **A soft edge is a web-drawer idiom, not paper.** The band shows one complete
  unit or a label; nothing is ever half-shown, so there is nothing to fade.
- **A paragraph means eight to fifteen lines**, not two. The seed copy was too
  short to show what a long contribution costs the shelf, which made every option
  look cheaper than it is. All five members' words were rewritten long.
- `display:block` does not make a `<button>` fill its parent — buttons size to
  fit-content, so the band needs an explicit `width`.
- html-to-image does not honour `backface-visibility`, so B3's reverse face
  captures mirrored on every card. The fold now ALSO steps opacity at the midpoint
  (60ms at 190ms into a 420ms turn), which is both renderer-proof and stops the
  hidden face taking clicks.

## Learnings (the first attempt)

- The shipped card's slot set (`pg-d9-card.jsx:11`) carries the margin family with
  no change at all; the tuck family cannot use it, because a slip BEHIND the card
  cannot live inside the card's border — so tuck options wrap the card
  (`pg-t11-app.jsx`, `opt.wrap`). That asymmetry is real, not a rig artefact:
  tucked-under costs a wrapper in `app/feed.jsx` if it ships.
- **The sheaf should never have been more than one object.** Stacking leaves under
  a card was a bad call on my part, caught on sight — not a hidden trap: one
  object below the card, whose extent varies, was the only honest reading of
  "paper behind the card" from the start. Not a GOTCHA entry.
- A slip that repeats what the footer row already says (the contributor's name on
  its own line) is where the bloat came from. The byline is a lever, and in the
  tuck family the footer wins it.
- The closed budget is best implemented as a measured clip, not a line clamp: one
  component then holds one line, two lines or a strip, and the soft edge only
  paints when something is actually held back (`pg-t11-words.jsx`).
- The top bar carries no circles menu and no settings gear, and there is no Add:
  this rig has no drawer, no settings surface and no add surface, and a dead
  control poisons the review it appears in (PLAYGROUND rule 8). Mark-as-read moves
  the card to the Read tab directly — the shipped reaction flow is not loaded,
  since none of the six touch it.
- `str_replace_edit` on these files: the source contains literal `\u2014` / `\u2019`
  escapes, so an `old_string` must double-escape them (`\\u2014`) or it will not
  match.

## Artifacts

`pg-thought-v11.html` ·
`docs/specs/lm-652-discourse/pg-t11-{data,words,margin,tuck,bar,app}.jsx` ·
`docs/specs/lm-652-discourse/prompt-2026-08-14-thought-on-card.md` · this handoff.
Throwaway captures in `screenshots/` — delete on tidy.

## Action Items & Next Steps

1. Take the user's tuning notes per option; change only the option named.
2. Play the length control on each of the six — the four lengths are the axis the
   fork turns on; then decide family, then reveal.
3. Open several at once on M1 and T1 — the push-down families are what the
   ten-open-cards test is aimed at.
4. Standalone HTML export — not built.

## Other Notes

- `pg_t11_v1` holds option, config and viewport. Reset to M1 / a paragraph /
  preview present / every card / Auto.
- Nothing in `app/` was touched, and there is no `CHANGELOG.md` entry: a
  playground is not a product-shape change.
