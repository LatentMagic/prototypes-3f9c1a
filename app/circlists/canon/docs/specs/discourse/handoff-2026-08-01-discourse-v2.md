---
date: '2026-08-01'
topic: 'discourse-v2'
status: 'in-progress'
type: 'exploration'
---

# Handoff: discourse v2 — the spine settled, continuation opened

Supersedes `handoff-2026-07-31-discourse-v2.md` (same work, one continuous
session; that file was folded into this one).

## Current Focus

**The user is reviewing `discourse-playground-v2.html` and has not yet answered
the open questions.** Nothing is decided. Do not build the next thing until they
come back with a continuation direction.

The one decision in front of them is **continuation** — which of K0–K6 the
product takes. Everything else in v2 is a spine derived from their own review
notes, presented so they can argue with any line of it.

Background only: v1 (`discourse-playground.html` + `pg-disc-*.jsx`) still runs and
is untouched. `app/`, `circlists.html` and `CHANGELOG.md` were not modified — a
playground is not a product-shape change.

## The source feedback, verbatim

This is the input the whole of v2 was derived from. Reproduced exactly as given
so the next session can check the derivation rather than trust it. Two reviewers:
**Jonny** (second pair of eyes) and **the user**.

### Jonny, on the v1 playground

- Wants to see posters thoughts before reading the thing. Important context in
  Jonny's opinion. Go's against reveal-only intent, so needs to be balanced.
- Guided statements - on the fence. Specialising interaction and holds hands.
  Also don't like for the same thing - turn off by being too opinionated,
  presumptions, or belittling.
- Table - not into the detachment personally
- Echo feels 'complimentary' to everything else, and very interesting, could be
  explored further
- Loves when reactions and reflections are together. Particularly on Read tab.
  Slightly harder on contribution because it may need to be a separate moment for
  interactivity. It's a beautiful synergy.
- Contributor more promitnnent on Question, and that's nice. You have the "higher
  priority" because of the ownership and because its a reply.

### The user, on the v1 playground

- I like the 'note' annotations on cards but like Jonny I think we should EXPLORE
  contributor thoughts (the cotribtuor one not conversation) being avialalb
  eup front
- Don't like the way the reveal hangs as you wait for the responses, I don't
  think that works anymore. That whole timeout basically doesn't work in that
  context. I agree with Jonny that I think you could have the separate elements
  maybe have value to think of in separate sections. I also personally quite like
  it all just coming together, although there's a spacing thing to consider.
  Because you're immediately getting into a scroll, basically
- Don't like Read having questions bloating card. This one is basically just that
  I think they have to be hidden, and we've already said that the one that we
  really like works really well.
- Do like that if you skip you can fix that on Read
- Table interesting but a problem. The idea here is just not being fully
  explored, which isn't the fault of the previous agent. It's just that I
  probably didn't give enough information. The point is that a card that gets to
  a certain point that has enough exploration could be separated, and one of the
  major points there is the ability to continue the conversation. That's what
  makes the table more interesting: whether we explore that. On its own, it
  doesn't make sense. And it's actually actively a problem because it's
  separating things out too much.
- No ability to CONTINUE conversation is a big miss in terms of the playground.
  this is a big one. I have no clear answers for this, but there has been
  literally zero ideation at this point from the agent around: what if we want to
  continue a discourse? How does that remain something that is still sort of
  novel and interesting and bespoke for our app, but also not some replication of
  just a Slack or WhatsApp feed? Maybe it could be, maybe it should be, but it
  feels like we need some ability to provide more than one response, basically. I
  think that's a really big ideation that needs to be done.
- Echo more example. Honestly, I just didn't understand this one, and I think I
  just need more to kind of understand how this applies, this whole example.
- Inside the door, is sick, could be a good grounding
- Card flip is also very cool, but liked less

### How the user asked for it to be handled

> I would just take things step by step, break into chunks. I would just take
> every individual point and ideate on all of them individually. Don't apply
> ideation straight away. Ideate on everything, try to extrapolate, try to butter
> it up, each point, and try to get into what it was that you think we were
> getting to. Bring all of that together, and then let's do a re.
>
> I would actually say, brand new HTML. Let's do version two. Don't edit, but a
> version two, big, bold, new steering, even better. […] Please be aware there
> have been some updates to the actual central app.

That instruction shaped the deliverable: **an ideation document first**
(individual → extrapolated → combined), **then** a brand-new file. v1 was not
edited. The app was re-read before building.

## The turn the exploration took

v1 offered eight rival answers to *where does discourse live*. Taking the notes
one at a time showed that question is largely settled, and that six of the eight
"directions" were not directions at all:

- **Settled by the notes** — the sharer's line goes on the card (both reviewers
  asked for it independently); the conversation stays behind the door (bloat
  complaint); the record merges reactions and words (Jonny's "beautiful
  synergy"); the reveal's five-second timer dies (the "hang"); the preface
  outranks the responses (Jonny on the question option); pointing/echo is a verb,
  not a place (Jonny's "complementary").
- **Demoted to levers** — guided statements, names, marginalia's muted
  attribution, the Read card's density.
- **Parked** — the card flip; the Table as a destination that removes items from
  the feed.
- **The real gap** — continuation. Zero ideation existed. v2's rail is seven
  answers to it, each with a different theory of why it does not become a chat.

The sharpened rule that unlocked most of it: **reveal-on-read protects the
conversation, not the invitation.**

## Task(s)

Done:

1. Ideated every note individually and wrote it up —
   `docs/specs/discourse/ideation-2026-07-31-discourse-v2.md`. Part 1 is note by
   note; Part 2 is the continuation ideation (K0–K6); Part 3 is the ten-statement
   spine; Part 5 is the six open questions.
2. Re-read the central app before building (`app/feed.jsx`,
   `app/swell-reactions.jsx`, `app/app-shell.jsx`, `app/shell.jsx`,
   `app/seed-data.jsx`, `tokens.css`, `audit-2026-07-31-liveliness-set.md`).
3. Built `discourse-playground-v2.html` + five `pg-d2-*.jsx` modules.
4. Fixed one verifier finding (see Recent changes).
5. Added the supersede banner to the v1 `README.md`.

Not done, deliberately: no product change, no `CHANGELOG.md` entry, no standalone
bundle, no `GOTCHA.md` entry (needs user approval per `CLAUDE.md`).

## Critical References

- `docs/specs/discourse/ideation-2026-07-31-discourse-v2.md` — **read first.**
  The reasoning behind every default in the rig, and the six open questions.
- `PLAYGROUND.md` — the rig conventions v2 follows: no bezel, posture follows the
  window at `< 1024`, the config rail IS the circle rail, the app's own
  `MobileDrawer` below the breakpoint, Home in the app posture.
- `GOTCHA.md` #2 (sheet mount motion) and #5 (a transformed ancestor pins
  `position: fixed`) — both apply to `D2Sheet`.
- `wiki/circlists-copy-voice.md` — every line of copy in the rig went through it;
  keep that true.

## Recent changes

### Refinement pass, 2026-08-01 (second session — beauty + completeness, spine unchanged)

- **The seal now works under defaults.** `D2_SPINE.preface` was `'card'`, which
  ignored `preface.seal` — the Add sheet's checkbox and `D2Held` were inert on
  Auto while shape statement 02 promised sealing. Default is now `'sealed'`.
  Your own line is never hidden from you (a seal holds it back from *others*);
  your own sealed share shows the line plus the held marker.
- **Add is real.** "Add" on the Add sheet now lands the item at the top of
  Active with your line (or your question, or your seal) — the loop's beat 1→2
  is demonstrable instead of described. Cleared by Reset feed and on option
  change.
- **Reveal-on-read now holds at the Table.** An unread item's table entry shows
  its head and a held note, never the conversation (previously the whole
  exchange leaked to a member who hadn't read the item).
- **Table entries breathe.** The always-open composer collapsed behind "Add to
  this"; the mono-URL head became a proper title.
- Smaller: door reachable when words exist without reactions; "said the same"
  follows the Echo lever ("echoed"); the question-register hint is neutral on
  the Add sheet (K4's turn-specific copy only in the record); a sealed
  question's supporting line renders in the record under the ask; the character
  counter appears only once you type.
- `docs/prd-2026-08-01-circlists.md` — point-in-time copy of the canonical PRD
  (was not stored in the project).
- `discourse-playground-v2-standalone.html` — bundled for phone review.

- `docs/specs/discourse/pg-d2-record.jsx` — `D2Row` now gates the `to {name}`
  marker on `res.turns === 'addressed'`. It was rendering under every direction,
  so K0/K1/K3/K5/K6 appeared to demonstrate an addressed-reply affordance they
  forbid. Display gate only; no logic change.
- `docs/specs/discourse/README.md:1` — supersede banner pointing at v2.

## Learnings

- **The five-second reveal is the bug the notes were circling.** The shipped
  `SwellReactionFlow` sets `step = 'reveal'` on commit and dismisses itself after
  `hold = 5000` — fine for a disc, hostile once there are words to read. v2 keeps
  the shipped **input** (real pad, real gesture) and unmounts the flow *inside*
  `onMarkRead`, so the reveal step never plays; the record mounts in its place
  with `noEnter`, so the panel appears to stay and the content rises into it.
  That single wiring change is the "one breath" — `commitReaction` in
  `pg-d2-app.jsx`.
- **A merged record needs two registers, not one list.** Members who left words
  render as full lines; members who only reacted stay as the shipped roster chips
  underneath. Flattening everything into equal rows made an eight-reactor item
  unreadable.
- **The door needed a signal, and the app already had one.** Unseen words light
  the liveliness **micro dot** on the door — no count, no badge, no new
  vocabulary — and it drops the moment the record opens. Whether that reads as
  arrival or as an unread count by other means is open question 5.
- **`\uXXXX` escapes do not work in JSX text.** Three strings shipped as literal
  `\u2014` in the first pass. In JSX children use the character itself or wrap it
  in an expression (`{'\u2014'}`); escapes are only interpreted inside JS string
  literals. **Worth a `GOTCHA.md` entry — ask the user first.**
- **Avatar identity for the current user.** The shipped card labels the line "you"
  but draws the avatar from the *account* name. Doing the first without the second
  puts a "YO" avatar next to an "SR" one on the same screen. `d2Who()` in
  `pg-d2-record.jsx` is the single place that maps it.
- **A lever that renders in every direction is a lie about the direction.** The
  `to {name}` bug: fixtures carried addressed replies, so directions that forbid
  them still displayed them. When adding a fixture field, check which options are
  allowed to render it.

## Artifacts

- `discourse-playground-v2.html` — entry at the project root, so `app/*` and
  `tokens.css` resolve.
- `docs/specs/discourse/pg-d2-data.jsx` — the spine as Auto lever answers
  (`D2_SPINE`), the ten shape statements tagged with their source note
  (`D2_SHAPE`), K0–K6 (`D2_OPTIONS`), levers, fixtures, and `d2Resolve()` as the
  single derivation point.
- `docs/specs/discourse/pg-d2-parts.jsx` — the sheet (bottom sheet narrow /
  centred dialog wide, the shipped Swell's own breakpoint; `noEnter` for the
  one-breath handoff), copied disc geometry, preface/held renderers, the pointing
  control, one composer for every response shape.
- `docs/specs/discourse/pg-d2-card.jsx` — the shipped enriched card copied, plus
  the preface hanging off the attribution and the micro dot on the door.
- `docs/specs/discourse/pg-d2-record.jsx` — the record (door and moment are the
  same surface) and the Add sheet.
- `docs/specs/discourse/pg-d2-table.jsx` — the table as a page, tabs, empty states.
- `docs/specs/discourse/pg-d2-app.jsx` — the four-pane rail, the app surface, the
  loop driver.
- `docs/specs/discourse/ideation-2026-07-31-discourse-v2.md` — the ideation record.
- `docs/specs/discourse/README.md` — v1 index, now carrying the supersede banner.

## Action Items & Next Steps

1. **Get the continuation decision.** K0–K6, in the rig's Continue pane. The read
   from here: **K3 with K6's ending** is strongest (continuation exists, bounded
   by place, and has a real end); **K2** is the most surprising (addressed but
   flat gives genuine back-and-forth at a cost you can calculate); **K4** is the
   one to be sceptical of — beautiful and probably too clever.
2. **Get answers to the six open questions** in Part 5 of the ideation doc:
   sealing your own preface, whether a line can be changed after it is left,
   "Same" vs "Echo", whether the micro dot reads as arrival, the question
   register on the Add sheet, and whether any of the ten spine statements is
   wrong.
3. **Once a direction is chosen: write a spec, not more playground.** The rig has
   done its job at that point.
4. Only if the user asks: a standalone bundle for phone review; a `GOTCHA.md`
   entry for the JSX escape trap.

## Other Notes

- Honoured throughout, unchanged: communal library / individual read-state · no
  unread counts, badges or kudos tallies · sharing before reading is a valid
  register · the reaction pad is the shipped component · the design language is
  locked to `tokens.css` and the brand pack.
- Deliberately **changed** from v1's settled list, on the strength of the notes:
  reveal-on-read no longer hides the sharer's line, and "no threads" is replaced
  by seven candidate disciplines rather than a prohibition. Both are proposals,
  not decisions — if the user rejects either, most of v2 needs rethinking, so
  confirm before building on them.
- **Do not fork a surface per posture.** v2 renders one surface through the app's
  own shells, same as the product (`CLAUDE.md`, `ARCHITECTURE.md`).
- `pg_d2_discourse_v1` in `localStorage` holds selection, overrides, pane and
  posture. Reset to clean defaults (K3, the shape pane, Auto) after probing.
- Two of Jonny's likes were parked rather than built: the card flip (lovely
  craft, answers a question nobody has) and marginalia as its own direction. The
  v1 modules still hold that code if either comes back.
