---
date: '2026-09-21'
ticket: 'LM-652'
topic: 'clear-in-circle'
status: 'ratified'
---

# Note: clearing the returns bar, inside a circle

Nothing here is ratified. Four options are built; the next move is the user's
reaction.

## How the question got to this shape

Three earlier rounds asked where a clear lives in the bar, on home and in a
circle at once, and all three were rejected — the last exchange found why: the
panel's own composition had never been designed, so no control could look right
inside it. The user then split the work in two.

1. **Home is settled** (ratified 2026-09-21, now in `app/home-returns.jsx`): the
   panel is a **preview**, and there is **no clear on it**. See
   `note-2026-09-21-home-conversations-preview.md`.
2. **This rig** is the clear, in a circle, where the composition is the shipped
   bar's own.

Superseded: `handoff-2026-09-21_clearing-conversations-round-two.md` and the
three options in `playground/pg-clear-conversations.html` — that rig's question
spanned both surfaces and no longer exists in that form.

## Fixed by the brief, in all four options

- One act, every row. No per-row dismiss.
- Clearing **marks nothing as read**. The replies stay on each card's
  conversation; a new reply brings the row back. Every option with room says
  exactly that, in one sentence: *"Nothing is marked read. A new reply brings it
  back."*
- An empty bar is **gone** — no caught-up resting state.
- **Calm:** the clear never reads as the bar's main action. Opening a
  conversation is. So every act in the rig is the app's own recessive grammar
  (`.circ-cardaction`, `.circ-iconbtn`, the house secondary box) — no fill, no
  accent, no new state layer.
- The bar's arrival, collapse and removal behaviour is the shipped one. The rig
  forks the bar to add an affordance; it does not re-time it.

## The rule carried from the rejected round

The act may borrow the **bar's** forms — the boxed 34px control, the hairline,
the card's edges, the sunken surface — and never the **rows'** forms: no title
over a subtitle, no trailing chevron, nothing that invites a press expecting a
conversation. The second finding from that rejection was *"text — chevron —
yuck"*, so no option puts words beside the boxed chevron.

## Four were played; one survived

Played 2026-09-21: **the floor** (a sunken band at the panel’s foot holding a
bordered control and the teaching line), **the freed line** (the head’s second
line giving way to the act while open), **the corner** (a bare glyph in the
card’s top-right, reachable collapsed), and **the foot** (a quiet text act at
the panel’s foot).

The user’s read, same day:

- **The floor — rejected as bloat.** Band, button and sentence for an act that
  destroys nothing.
- **The freed line — rejected.** A hover-filled control has no business in the
  head, and it spent a lot of room on a small thing.
- **The corner — rejected outright.** An unlabelled cross reads "hide this bar".
- **The foot — kept**, and then stripped further.

### The one direction

A single quiet text act at the foot of the open panel, on the card’s own white.
No band, no bordered button, no second line.

- **The word is "Clear."** "Clear these" was rejected — the demonstrative does
  no work when the list is directly above the control.
- **It takes the rows’ own hairline**, so it is not read as another row and not
  read as another subline, and it steps to `--color-fg-2` at weight 500 — one
  shade darker than the sublines above it, nowhere near a row’s weight.
- *Cost, accepted:* nothing is reachable while the bar is collapsed, so clearing
  is two presses.

### The rule that came out of the rejection — worth keeping

**Microcopy teaches where the act has a consequence the member cannot see.**
Mark-as-read has one (it moves in your view and not in theirs), so it teaches.
Clearing has none — every reply stays on its card, nobody else’s view moves, and
a new reply brings the row back — so it teaches nothing. A sentence explaining a
harmless act is bloat in the place the product is meant to be calmest.

## Undo is a lever, not an option

It stayed a lever rather than becoming an option, so reversal is judged on its
own — and it doubles as the answer to *how the bar
leaves*: **Off** = the shipped removal, at once; **On** = the bar holds its place
for eight seconds as its own receipt carrying Undo, then plays that same
removal.

**The argument to put.** Clearing destroys no words — every reply stays on its
card — so what is lost is the **index** of which cards had words you had not
seen, and that cannot be reconstructed. It is also a one-press act with no
confirmation, and governance is explicit (`standards/ui-design.md`): ration
confirmation, and where undo is cheap it **replaces** confirmation rather than
adding to it. Against: notification surfaces usually decline undo, and eight
seconds is eight seconds of the bar still being there after you asked it to go.

## Also landed this session, outside the rig

- `app/home-returns.jsx` — the ratified home composition.
- `app/talk-return.jsx` — **only** the separator bug the user flagged: hairlines
  now sit between rows and nowhere else, replacing a `borderTop` on every row
  plus the stylesheet's transparent-first-child patch.

## Not built, and named as not built

Per-row dismiss; a dialog or toast confirmation; any clear on home; a gesture
(rejected 2026-09-21 as inappropriate); a clear inside the feed's lens — the
lens's own ruling is that only concealment can be cleared from it, so the act
does not belong there.

## Artifacts

- Entry: `docs/specs/lm-652-discourse/playground-clear-in-circle/pg-clear-in-circle.html`
- Modules: `pg-cc-store.jsx`, `pg-cc-bar.jsx`, `pg-cc-wire.jsx`, `pg-cc-topbar.jsx`
  (the last a copy of the clear rig's chrome, carrying a pointer to its source)
- Manifest: `playgrounds.json` (LM-652)
- Route: the rig opens on home — press **Backend Pod**, then the bar's chevron.
  One pill. "Put them back" re-seeds. Undo is the lever.
