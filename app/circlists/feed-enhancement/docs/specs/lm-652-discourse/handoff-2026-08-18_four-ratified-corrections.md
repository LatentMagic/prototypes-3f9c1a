# LM-652 candidate — four ratified corrections

Date: 2026-08-18 · Entry: `docs/specs/lm-652-discourse/circlists-lm652.html`

Four ratified calls landed on the candidate. Nothing else moved. Nothing here is a new
decision except the one flagged below as mine.

## What landed

**1 · The card's page is called Overview.** Already true in the build
(`cand-lm652-main.jsx`, `renderRoute` → `subView.title`). Verified, left alone. The thread's
`the conversation` eyebrow is untouched.

**2 · The sales line needs the contributor in the conversation.** `cand-lm652-parts.jsx`
keeps `CAND_OWN_MIN = 3` (replies from other people) and gains `CAND_OWN_MINE = 1` (replies
written by you), with `candOwnTurns(item)` counting your undeleted turns. `CandOwnDoor`
(`cand-lm652-surface.jsx`) now requires both. The thought is deliberately NOT counted: it is
given with the link, outside the conversation.

Seed fixtures, tagged in `cand-lm652-data.jsx` — **search that file for `@fixture`**:
- `@fixture item-7-sales-line` — `go.dev/blog/pipelines` (Backend Pod, Read, yours): three
  replies from others plus `gp4` from you. The line shows.
- `@fixture item-7-near-miss` — the Pragmatic Engineer card (Active, yours): three replies
  from others, none of yours. The line is absent until you reply, then it appears.
- Also qualifying: ACM Queue "Postmortems" (`ac1c`, `ac3` from you).

Seed changes only reach a state that has not been persisted yet — reset the candidate's state
(`circ_lm652_state_v1`) to see `gp4`.

**3 · Every card carrying a thought opens.** `CandBandFace` (`cand-lm652-card.jsx`) is now a
button in every case, with its Lines mark; the `!held` inert branch is gone. `held` is still
measured, but only the `edge` mark option reads it. A card with no thought is untouched.

**4 · The fold only ever holds turns you have already seen.** `CandTalk`
(`cand-lm652-surface.jsx`): a group whose tail past two carries anything unseen is open on
arrival, so no unseen reply sits behind an unmarked control. `More replies` still carries no
count and no marker.

The delta's second clause — `Hide the rest` withheld until every reply in the group has been
seen — was **overturned by the owner on 2026-08-18**: it removed the member's control of their
own page, leaving no way to settle a group without leaving the surface. `Hide the rest` is now
always available on an open group; hiding a tail that still holds unseen words is the member's
choice to make. Seen is read against the visit's frozen waterline, so the state holds for the visit.
- **Forced open** — `jvns.ca` DNS card: two of the six replies under `jv0` landed after the
  mark.
- **Still collapses** — ACM Queue card: `talkSeenAt` is now, so nothing is unseen.

## My call, flagged for review

Item 3 left the open face's control set to me. **I kept the `⋯` overflow menu (Edit / Delete)
in the thought's own name row, after the time** — the arrangement the long-thought variant
already used — and deleted the band's inline menu that the short variant carried.

Why: the name row scopes those controls to *the person's words*; the foot row belongs to the
*card* (source, mark as read, remove the link), so putting Edit and Delete there would put two
scopes on one line. And with the band now an opening control everywhere, a menu inside it would
be a control inside a control.

Consequence: editing your own short thought is one press longer than before — open the card,
then `⋯` → Edit. The band's edit-request plumbing (`editReq` / `editRequest`) and the
`bandMenu` z-index raise are removed as dead code.

## Not touched

Everything else: the design language, the copy, the reveal item, Part B copy, the "watching"
word, the domain on the closed card. `app/` was not opened.
