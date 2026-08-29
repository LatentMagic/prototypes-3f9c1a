---
date: '2026-08-17'
ticket: 'LM-652'
topic: 'discourse — the readiness-walk delta (six changes)'
status: 'complete — awaiting review'
type: 'implementation'
---

# Handoff: LM-652 — what the readiness walk ruled, built

## Current Focus

**Nothing open from the delta itself.** All six changes landed in the candidate
(`circlists-lm652.html`). Nothing is ratified; review is the next step.

**One thing the reviewer must do first:** the seed change (item 6) only appears on a
fresh seed. Existing persisted state (`circ_lm652_state_v1`) predates it — Config →
**Reset to seeded data** (`app/config.jsx:203`) before judging the collapse or the wash.

## Task(s)

The pasted delta, six changes, all pre-ratified. Also landed ahead of it in the same
session: the watching control's tooltip copy (below).

**0 · Watching copy (ratified separately this session).** The on-state tooltip
described the state *and* instructed the mechanism (*"Watching — turn the corner back
down"*). Both controls now read **"Watch this conversation" / "Stop watching this
conversation"**, tooltip and `aria-label` alike — the surface's glyph
(`cand-lm652-surface.jsx`, `CandThreadHead`) and the card's fold toggle
(`cand-lm652-parts.jsx`, `CandFoldToggle`). The first edit hit only the fold toggle;
the string the user actually hovered was the surface's, fixed in the same session.

**1 · The held wash.** Done. **2 · Champion across any circle.** Done.
**3 · `⋯` on your own thought.** Done. **4 · Reply at the group foot.** Done.
**5 · `⋯` inline after the time on turns.** **Already true in the build** — the trigger
sits in the name row directly after the time (`CandTurnMenu` inside `CandTurn`'s byline
row); it carries no `margin-left: auto` and is not pinned to the card's edge. Nothing
changed. **6 · A deep reply group.** Built, see below.

## Critical References

- `skills/build-candidate/SKILL.md` — invariants 1, 5, 7 (one `app/`, load order,
  seeds extend). No `app/` file was touched by this delta.
- `docs/specs/lm-652-discourse/handoff-2026-08-17_conversation-surface.md` — the
  surface's audit and its still-open list.
- `docs/specs/lm-652-discourse/handoff-2026-08-17_turn-menu-and-tucked-card-spacing.md`
  — the popover flip and the surface-only spacing this builds on.

## Recent changes

`cand-lm652-parts.jsx`

- `candEditThought` / `candDeleteThought` — the thought edited in place (carries
  `edited: true`) and removed outright (the key is deleted, so the band and the stack
  go with it; no tombstone, because nothing hangs beneath a thought).
- `candTurnUnseen(t, cut)` — somebody else's undeleted words, landed after the mark.
- `CAND_WASH = 'rgba(139,191,173,0.34)'` — the same value `.circ-glow::after` uses.
- `CandFoldToggle` — the copy above.

`cand-lm652-surface.jsx`

- `CandTalk` freezes the visit's mark: `const cut = React.useRef(item.talkSeenAt || 0).current`.
  `isNew(t)` reads against it, so the wash holds for the whole visit however long the
  member reads.
- `shown` is now a lazy initializer: a group whose **held-back tail** (`kids.slice(2)`)
  carries anything unseen starts **open**.
- `CandTurn` takes `fresh` and paints the wash as its own ground
  (`background: CAND_WASH`, `radius-md`, `8px 10px` padding on a `-8px -10px` pull) —
  behind the words, not as a film over them, and with no keyframe.
- `CandTurn` takes `showReply`; the control now renders in the **rail's foot row**
  alongside *More replies* / *Hide the rest*, and stays inside the turn only when the
  group is empty. Suppressed in that row while that group's composer is open.
- `CandTurnMenu` takes an optional `onDelete` (defaults to `candDeleteTurn`) and is now
  published on `window`.
- `CandOwnDoor`: `(api.spaces || []).some(s => api.isChampion(s))`. Both lines verbatim.
- `CandSurfaceRoute` stamps `talkSeenAt = Date.now()` in an **unmount cleanup** (via an
  `apiRef`, since `api` is per-render).
- `CandThreadHead` copy.

`cand-lm652-card.jsx`

- `CandAltFace`: `edited` marker after the time; `isYou && !editing` draws
  `CandTurnMenu` after it; editing swaps `CandProse` for `CandWrite` + Cancel/Save at
  12.5px, so the words stay in their own register while being fixed.
- `CandCardRow`: the paper card's `overflow` is `visible` when **open and settled**
  (was always `hidden`) — otherwise the thought's menu is clipped by the card it opens
  inside. Still hidden while the two cards travel, so the swap is unchanged.

`cand-lm652-main.jsx`

- `goToCard` no longer stamps `talkSeenAt`. Entry has to leave the mark where it was or
  there is nothing for the wash to be read against.

`cand-lm652-data.jsx`

- `https://jvns.ca/blog/2026/02/dns-resolvers/` gains `jv0` (Marcus T., 28h) with
  **six replies** — four before this card's mark (`talkSeenAt = NOW - 10h`), two after
  it, both in the held-back tail. So the group **opens on arrival** and its two newest
  replies stand washed. Nothing else in the seed changed.

## Learnings

**The seen-stamp was in the wrong place for a wash to exist at all.** `goToCard`
stamped `talkSeenAt` on entry, which is correct for a *return banner* (the touch has
been acknowledged) and fatal for an *arrival wash* (the mark you are reading against is
now `now`, so nothing can be new). Moving the stamp to the route's unmount cleanup
serves both: the banner still clears when the member has been, and the visit has a
stable mark. The general trap: a single "seen" timestamp cannot be both the entry
receipt and the visit's waterline unless the visit holds its own copy.

**An overflow-hidden card cannot host a popover.** The paper card clips to `hidden` so
the swap can animate; the thought's new menu opens downwards inside it and was cut off
at the card's edge. Only safe to relax once the travel is finished — hence
`open && !moving`.

**The wash had to move from a film to a ground.** `.circ-glow` paints the sage *over*
the card as an `::after` and gets away with it because it fades out in 2.4s. Resting
permanently, a 34% film over 14.5px body text is a contrast cost with no end, so on a
turn the same colour is painted as the row's own background instead.

## Artifacts

- `circlists-lm652.html` — the candidate entry (**unchanged this session**; no new CSS
  was needed — the wash is inline, since it is state-driven per turn).
- `docs/specs/lm-652-discourse/cand-lm652-{parts,surface,card,main,data}.jsx`.

## Action Items & Next Steps

1. **Review the delta on a fresh seed** (reset first, see Current Focus). Demo path:
   Backend Pod → **Read** → the DNS card's conversation icon → the deep group is open,
   its two newest replies washed, *Hide the rest* and *Reply* in the group's foot row.
   Leave and re-enter: no wash. Own thought's `⋯`: same circle, Active → the
   Pragmatic Engineer card's band → open it → `⋯` after *You · 1h*; and on the surface
   of `go.dev/blog/pipelines` (Read, yours).
2. **The previous handoff's list still stands untouched** — Part B copy, the domain on
   the closed card, the "watching" *word*, `CAND_OWN_MIN = 3`, the `tab`-passthrough
   behaviour, the single-vs-two-action footer centring, and the C1–C5 entries still at
   the project root.
3. **Three `GOTCHA.md` candidates await approval** — the two carried from previous
   sessions, plus the entry/visit seen-stamp trap above.
4. **`CHANGELOG.md` — nothing added.** The delta refines an existing, unratified
   feature; it does not change the product's shape.

## Other Notes — calls made that the delta did not state

- **How a turn is marked seen: nothing marks a turn.** The *conversation* is marked
  seen, wholesale, when the member leaves it (unmount of `card:<id>`). No per-turn
  read-state, no viewport observer, no scroll-depth record — a per-turn ledger is a
  read-receipt store, which this product does not keep.
- **A turn arriving while the member is reading carries the wash immediately.** The
  visit's mark is frozen, so anything later than it glows the moment it renders. It is
  the same rule, not a special case; nothing is deferred to the next visit.
- **Leaving means leaving the surface, not the app.** Any exit from `card:<id>` stamps —
  back arrow, a delete that evicts the card, a route change. A tab close does not.
- **Own turns and tombstones never wash.** Your own words are not news to you, and a
  removed turn's line is a tombstone, not content.
- **The wash is the row's ground, at `radius-md`, bleeding 10px past the turn's text
  column** — turns have no card and no rule, so the wash needs its own quiet box to be
  a shape at all. It is not the card's `radius-lg`.
- **Replies wash individually, not as a group.** A group with one unseen reply shows one
  washed row; the parent turn is untouched if it was already read.
- **`⋯` on the thought uses the turn menu verbatim**, including its `What you said`
  label and its edge-flip. Delete acts immediately, exactly as a turn's does — no
  confirmation, since the card itself is not being removed.
- **The thought's edit field is 12.5px**, matching the thought's own register rather
  than a turn's 14.5px.
- **The `edited` marker draws on the thought's open face only**, where the time is.
  The band shows neither time nor marker, so nothing was added to it.
- **Deleting the thought closes the stack** and leaves the plain link card; on the
  surface the head card becomes an ordinary card. Nothing announces the removal.
- **Reply's row order** is *More replies* / *Hide the rest* first, then **Reply** — the
  tail control belongs to what is above it, and Reply is the exit from the group.
- **Item 5 was already true** and nothing was changed for it (see Task(s)).
- **The deep group went on the DNS card**, not the ACM card that already had a long
  tail: ACM carries the item-7 line, an edited turn, a tombstone *and* a tail, which is
  exactly the distortion the delta warned against. The ACM tail stays as the
  **collapsed** case (its mark is `NOW`, so nothing there is unseen); the DNS group is
  the **opens-on-arrival** case.
