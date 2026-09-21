---
date: '2026-09-21'
ticket: 'LM-652'
topic: 'home-conversations-preview'
status: 'awaiting-reaction'
---

# Note: home's Conversations preview — showing which circle, without the headings

Nothing here is ratified. The rig is built and handed over; the next move is the
user's reaction.

## How this question got separated from Clear

Three rounds went on where a clear control lives in the returns bar. All three
were rejected, and the last exchange (2026-09-21) found why: the panel's own
composition had never been designed, so no control could look right inside it.
The user then split the work — **Clear is off the homepage** ("the lean is much
more to do with this being a preview"), and Clear in a circle is judged later.
This rig is the homepage panel alone.

## Ratified as correct, already shipped, not up for exploration

- at most **3 circles**, at most **6 rows**, chosen **freshest first** across the
  whole union
- **"More in the circles below."** when the bound held something back
- the collapse/expand card itself

## Held fixed by the brief

- **No count anywhere.** The panel's head was the last count on the home screen;
  CIRC-034 states the home "raises no count of links, arrivals or unread items
  anywhere". The head now carries who spoke instead — `Marcus T., Lena P. and
  others spoke` — and reads the same line open and shut.
- **No clear, no mark-all-seen.**
- Calm, populated, never a to-do list. Existing tokens and type only.

## Fixed across all four options, each the removal of a named defect

1. **The head is one line.** Two lines in the one row that is always on screen,
   one of which was a count, was a third of the panel's text before the list
   even opened.
2. **No per-row hairline.** `borderTop: 1px --color-border-2` on all six rows is
   the "strange, only semi-opaque lines" in the user's read — six of them under
   three headings is what registers as text bloat. The card keeps its one
   head/list seam; spacing does the rest.
3. ~~No per-row chevron.~~ **Reversed in round two, on the user's word.** Round
   one dropped it on `app/home.jsx`'s 2026-09-09 ruling for the circle rows
   beneath. The user's correction: the in-circle bar's rows carry a chevron and
   these are the same rows, so consistency of affordance wins (governance
   `standards/ui-design.md`). It costs the title ~26px on a phone; the only other
   way to settle it is to drop the chevron in the circle too, which is wider than
   this rig's scope.
4. One height per row, clipped never wrapped (CIRC-034); 44px touch floor
   (governance `standards/ui-design.md`).

## Round two (2026-09-21, same day) — what the user's read changed

Round one was judged a good direction with three problems, and all three were
acted on rather than argued:

- **The head.** Names promoted to the head read as a header of people — "the use
  of the names has always been a subpoint" — and once every row says who spoke, a
  head repeating it is duplication. The head now carries **intent**, and its
  wording is a **lever** rather than a decision taken here: `Conversations you are
  watching` / `New replies in your circles` / `Replies since you last looked`. No
  count in any of them.
- **The conflict the user named.** They liked the tail — the rows read as the
  conversations do inside a circle, with one tag added — but it costs most of the
  title on a phone; and the subline, which costs nothing, drops the people, "a
  fundamental part of what's being communicated in Circle". The resolution is
  option 1 below: the circle comes **off the title line and onto the metadata
  line, beside the people**. Nothing is given up; the names take the ellipsis.
- **The run is gone.** Rejected outright.

## The four options — the axis is where the circle lives

1. **The meta line** (new, and the recommendation) — the title has line one to
   itself; line two carries the circle and the people together, `Backend Pod ·
   Marcus T. and Lena P.` The circle leads and holds its width; the names take
   the ellipsis. *Cost:* line two does two jobs, and at 320px it is the people
   who get cut — you see that somebody spoke and not always who. The circle also
   reads first on every row, which is emphasis it did not ask for.
2. **The tail** — the circle at the end of the title line. *Cost:* the title
   gives way to it, and on a phone that is most of the title; the right edge goes
   ragged.
3. **The subline** — the circle takes row two outright, the people leave. The
   calmest of the four, and nothing competes for width at any size. *Cost:* it
   drops the people.
4. **Unsaid** — the panel does not say; the circles list beneath carries the map
   with its own dots (CIRC-034). *Cost:* it breaks the strip's stated rule, and
   the seed's duplicate title across two circles renders as two identical rows.

## Not built, and named as not built

Any clear control; any per-row dismiss; the in-circle bar (`app/talk-return.jsx`
is untouched — the rig swaps `window.CircHomeReturns` only).

## Artifacts

- Entry: `docs/specs/lm-652-discourse/playground-circle-attribution/pg-home-conversations.html`
- Modules: `pg-hp-store.jsx`, `pg-hp-panel.jsx`, `pg-hp-wire.jsx`, `pg-hp-topbar.jsx`
  (the last a copy of the clear rig's chrome, carrying a pointer to its source)
- Manifest: `playgrounds.json` (LM-652)
- Superseded question: `note-2026-09-19-clearing-conversations.md` — still open,
  now scoped to a circle
