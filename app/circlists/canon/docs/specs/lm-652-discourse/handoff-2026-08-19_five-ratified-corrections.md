# LM-652 candidate — five ratified corrections

Date: 2026-08-19 · Entry: `docs/specs/lm-652-discourse/circlists-lm652.html`

Five ratified calls landed. Nothing else moved. Each was checked against the build first;
none was already present.

## What landed

**1 · Reply is always there.** `CandTalk` (`cand-lm652-surface.jsx`): the group's foot row
now draws `Reply` in every state, and the row itself renders whenever the turn has replies.
Pressing it while a tail is held back does both things in one press — `setShown(t.id)` unfolds
the group, then the composer opens beneath it. `More replies` / `Hide the rest` are unchanged;
the collapse itself is untouched. A turn with no replies keeps its own `Reply` (`CandTurn`).

**2 · The returns bar stays quiet on an unread card.** `CandFeedLead`
(`cand-lm652-return.jsx`) filters on `i.watching && i.read && candFresh(i).length > 0`.
Contributing still watches; hearing starts at the mark.
- **Held back** — the Pragmatic Engineer card (Active, watched, `pe3` after the mark): absent
  from the bar. Mark it read and it appears with `pe3` waiting.
- **Named as before** — the `go.dev/blog/pipelines`, `jvns.ca` and untitled-runbook cards, all
  on Read.

**3 · The Add popover's thought box warns like every other box.** `CandRoom`
(`cand-lm652-add.jsx`) gained the reference row: `{n} left`, 11.5px `fg-3`, right-aligned
beneath the words, drawn only inside the last 60 of 500 — the same trigger, treatment and
position `CandWrite` already uses. The link slot is untouched and uncapped.

**4 · The edit box commits on the field's edge.** `CandWrite` (`cand-lm652-parts.jsx`) keeps
the send arrow as the ONE control on the field's edge; the `Cancel` / `Save` row beneath the
field is gone from both edit boxes — the turn's edit (`cand-lm652-surface.jsx`) and the
thought's edit (`cand-lm652-card.jsx`). The disabled-`Save` guard is now the arrow's own rule:
it inks and fires only with words in the field. The way out is `CandEditOut`, a ✗ in the name
row — see below.

**5 · Any act of participation enrols you.** `candAddTurn` and `candAddThought` set
`watching: true`; adding the link already did. The mark goes through `app/main.jsx`'s
`markRead`, which now reads `window.CircCandidate.onMarkRead(item)` per call —
`candMarkReadPatch()` returns `{ watching: true }`. Enrolment never touches `talkSeenAt`:
enrolling is not reading, and the surface still moves the mark forward on leaving. Stacks with
item 2 — you can be enrolled before the mark, and nothing reaches you until it.

## Item 4's pair — settled by whiteboard, ratified 2026-08-19

First built as ✗ beside the arrow on the field's edge. The owner called that wrong on sight, so
it went to a whiteboard — `playground/wb-edit-commit.html`, four placements, each shown
mid-edit and near the 500 cap:

- **01** ✗ beside the arrow (as first built) · **02** ✗ stacked above it · **03** ✗ out of the
  field, in the name row · **04** the word `Discard` beside the arrow.

**03 was ratified.** The reason is the cap column: the field's edge already carries the
remaining-count and the arrow, so anything else put there competes with the count at the moment
the writer is under pressure. 03 empties that slot back to one control — `CandEditOut`, a 34px
ghost ✗ at the end of the name row, where the `⋯` that opened the edit stood; `fg-3` darkening
to `fg-1`, no fill (a grey state layer smudges on the warm paper). The arrow keeps the exact
corner and gutter (40px) it holds in every other box.

Two costs carried, not resolved: the ✗ shares the name row with the time, which is tighter on a
reply; and the way out now sits away from the thing it undoes. The 34px box is under the 44px
house floor, as the in-field send already is.

## What was opened in `app/`

`app/main.jsx`, `markRead` — one additive spread, read off `window` per call like every other
deletable aid:

```js
...(window.CircCandidate && window.CircCandidate.onMarkRead ? window.CircCandidate.onMarkRead(i) : null)
```

Absent, the write is byte for byte what it was; the main entry is unchanged.

## Not touched

The collapse's own rule, the fold, the design language, all copy, the reveal, the item-7 line,
seed fixtures. Nothing here is ratified as shipped — it is a candidate, awaiting review.
