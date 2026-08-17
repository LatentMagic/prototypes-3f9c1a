---
date: '2026-08-17'
ticket: 'LM-652'
topic: 'discourse — reply density and the watching control'
status: 'in-progress'
type: 'implementation + exploration'
---

# Handoff: LM-652 — C5 landed, the fold demoted, reply density rebuilt

## Current Focus

**Nothing is open on the work itself.** The last three exchanges were tuning
(`⋯` placement, the rail's hit area, the collapse control) and all landed. The
next session's first job is whatever the user brings; if they bring nothing, the
standing queue is under Action Items — the copy set (Part B) is the oldest item
and has now been carried across five handoffs.

Background only: `pg-c6-watching.html` is answered and can be archived once the
user is done comparing.

## Task(s)

Five pieces, in order, each ratified in words before it was built.

1. **C5 option 3 integrated** into `circlists-lm652.html` — the contributor's
   thought leaves the thread entirely and arrives tucked under the head card as
   the real `CandCardRow` at `tab="active"`. The user picked it from the C5 rig.
2. **Arrival-glow bug fixed** — the sage wash was painting over the whole row
   and only showing above the tucked card.
3. **The fold measured and demoted.** As a control it cleared neither
   accessibility floor (numbers in Learnings). It is a signal again; the
   watching control moved to the conversation's header row.
4. **C6 playground built and judged** — four homes for that control. The user
   picked option 1 (the folded-page glyph on the row) and it is in the candidate.
5. **The reply-density delta executed** — a pasted four-part instruction: one
   rail per group, tail collapsed past two, reply furniture receded, Edit/Delete
   off the resting turn. Then two rounds of correction on the last part.

## Critical References

- `CLAUDE.md` — the ratification rule and the chat-brevity rule. Both were held
  this session; the brevity rule is what kept the accessibility findings to one
  decision per turn.
- `skills/build-playground/SKILL.md` — C6 was built to it (option 3 of C5 and
  option 3 of C6 both mount shipped components rather than lookalikes).
- The pasted delta lives only in the chat. Its four clauses and its acceptance
  criteria are restated in Recent changes below; there is no `PROMPT.md` for it.

## Recent changes

`docs/specs/lm-652-discourse/cand-lm652-surface.jsx`

- `CandSurfaceHead` added — wraps the head card in `CandCardRow` at
  `tab="active"` with `corner`. Now the default `HeadWrap`; C5's slot still wins
  when present.
- `CandCornerSignal` added and is the default `FoldCtl`; a new `window.CandFoldCtl`
  slot lets a rig swap what the corner draws. `CandFoldToggle` is unmounted but
  still exported (C2/C6 resolve it).
- `CandThreadHead` added — the eyebrow, a hairline, and the watching control at
  the end of the row. Replaces the bare eyebrow as the default opening.
  `CandIntro` is unmounted, still exported.
- `CandTurnMenu` added — the `⋯` on your own turns, opening Edit/Delete in the
  app's menu shape (`app/spaces.jsx:311-315` is the pattern). Sits in the name
  row immediately after the time, `alignSelf: center`, 44px target by inset
  padding.
- `CandTurn`: reply furniture recedes with depth (avatar 26→22, name 13.5→12.5 in
  `fg-2`, time 11.5→11); **body stays 14.5px**. Reply stays drawn; Edit/Delete
  left the resting turn.
- `CandTalk`: one rail per reply group (was one per reply), the composer moved
  inside it, `shown` state holds which tails are open, `More replies` /
  `Hide the rest` at the group's foot.
- The corner is drawn by the surface **only** when the card has no thought — a
  card with one carries it inside the link card instead.

`docs/specs/lm-652-discourse/cand-lm652-card.jsx`

- `CandCardRow` takes `corner`; the fold is drawn inside the link-card box and
  hidden while the thought is in front, so it travels and clips with the card it
  belongs to.

`circlists-lm652.html`

- `.circ-glow:has(.cand-swap)::after { display: none }` plus the same keyframe
  replayed on `.circ-glow > div > .cand-swap:first-child::after`.
- `.cand-watchglyph` hover/focus ink.
- `.cand-turnacts` and `.cand-rail` were both added and then removed again (see
  Learnings) — nothing of either remains in any entry.

`docs/specs/lm-652-discourse/pg-c6-*.jsx`, `pg-c6-watching.html` — the rig.

## Learnings

**The fold's numbers, so nobody re-measures them.** Watching = `#BCD5CA`,
**1.55:1** on the card; not watching = `#E6E6E6`, **1.25:1**. WCAG 1.4.11 wants
3:1, which needs roughly 70% accent (`#6FA68E`) — a badge, not a turned-down
corner. Target: a 32px box clipped to a triangle is ~22px of real target, under
the house floor of 44 **and** under WCAG 2.2's 24; the spacing exception cannot
save it because the thumbnail's link sits directly beneath. The corner cannot
hold both problems at once, which is what forced the control off it.

**A shipped wash does not survive a stack.** `.circ-glow::after` paints one rect
at `inset: 0`; the moment a row contains two cards it washes both, and the band's
opaque paper leaves only the strip above it visible. Anything painting over a
row has to be re-pointed at the element it means when that row becomes a stack.

**Absolute positioning belongs to the thing that moves.** The fold was pinned to
the head-card wrapper, so when the link card slipped behind and clipped to its
sliver the corner stayed floating at the top-right over the opened thought. It
now lives inside the link card. Desktop only hid it by luck of the widths.

**Two rejected mechanics, both mine, both worth not re-proposing.**

1. **Hover-to-reveal Edit/Delete.** The convention is real (Slack, GitHub,
   Google Docs) but always as a stable top-right toolbar. Revealing text buttons
   *below* the words reflowed the thread as the pointer travelled, and the user's
   read was "janky/broken". Replaced by the always-drawn `⋯`.
2. **Pressing the rail to collapse.** Nothing on touch says a line is pressable,
   so a gesture nobody can see is not a recovery route. Replaced by
   `Hide the rest` at the group's foot, mirroring `More replies`.

**Copy calls made and ratified:** `Hide the rest`, not "Collapse" (interface
jargon), not bare "Hide" (doesn't say what goes), not "Fewer replies" (collapses
to nothing meaningful).

**On the glyph, argued and settled.** Industry splits eye (watch: GitHub, Jira,
Trello) and bell (notify: forums, Reddit, YouTube). We use neither — the eye
reads as surveillance in a product with no who-read-it signals, the bell is the
notification-anxiety vocabulary. The folded page trades recognition for calm and
for matching the corner; the user liked that pressing it teaches what the corner
means. A bare triangle was considered and dropped: no referent at 17px.

Nothing proposed for `GOTCHA.md`.

## Artifacts

- `circlists-lm652.html` — the candidate, carrying all of the above.
- `pg-c6-watching.html` + `docs/specs/lm-652-discourse/pg-c6-{store,ctl,wire}.jsx`
  — the watching-control rig. Answered; option 1 chosen.
- `docs/specs/lm-652-discourse/cand-lm652-{surface,card}.jsx`.

## Action Items & Next Steps

1. **Part B copy is still unratified** — surface name, Add popover words, return
   banner, roster eyebrow. Fifth handoff carrying it.
2. **"Watching" is still probably the wrong word.** Flagged repeatedly, never
   addressed; it now appears in the row's label and its aria-label.
3. **The domain on the closed card is still open** (raised 2026-08-17, parked).
4. **`CAND_OWN_MIN` = 3 is still a placeholder** awaiting ratification.
5. **Seed data has no turn with more than one reply**, so the collapse is only
   reachable by adding replies by hand. The delta said to leave mock data alone;
   worth asking whether a deeper thread should be seeded to judge it.
6. **C2, C3 and C4: reported unreadable, still not reproduced.** Get the symptom
   before changing anything.
7. **Archive the root rigs** — `pg-c1`…`pg-c6`, `pg-wb-name-leads`,
   `pg-wb-register` — once their questions are settled.
8. **`CHANGELOG.md` — nothing to add.** Refinements inside an existing feature.

## Other Notes

Ratified in words this session:

- C5 **option 3**: the thought belongs to the card, not the thread.
- The fold is a signal, never a control.
- C6 **option 1**: the folded-page glyph at the end of the conversation's header
  row, secondary ink off, accent on.
- Edit/Delete behind an always-drawn `⋯`, no hover mechanic.
- `More replies` / `Hide the rest`; no counts anywhere.
- Once opened, a tail stays open for the visit unless the member closes it.

Open calls carried from the previous handoff and still unratified: passing `tab`
to `FeedCard` by `item.read` (an unread card on the surface shows Mark as read +
Delete and no roster door), and whether the single-action footer's centring
should apply to the two-action footer as well.
