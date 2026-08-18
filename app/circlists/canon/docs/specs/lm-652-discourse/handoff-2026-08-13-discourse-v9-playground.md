---
ticket: 'LM-652'
date: '2026-08-13'
topic: 'discourse-v9-playground'
status: 'awaiting-review'
type: 'exploration'
---

# Handoff: discourse v9 — five states, built from the v8 brain dump

Nothing here is ratified. The five states are candidates. This document records
what the v8 review asked for and where each item landed, so the next session can
tell a deliberate answer from an omission.

`discourse-playground-v9.html` (entry, project root) · modules
`docs/specs/lm-652-discourse/pg-d9-*.jsx`. Load order is set in the entry HTML
and is dependency order: seed-data · primitives · brand-motion · liveliness ·
pg-d9-swell · feed · shell · spaces · app-shell · then data · card · parts · add ·
flow · return · states-a · page · states-b · rig · app.

No standalone bundle yet — it was not asked for this round. Regenerate from the
entry if it is wanted; never hand-edit one.

---

## The five states

| | State | Thought on the card | Attach surface | Talk lives | Way in | Watching mark | Return |
|---|---|---|---|---|---|---|---|
| 1 | **The door opens a room** | a sage rule down the margin, with the byline under it | the link, then the room, then a live preview of the card as it will read | in the door's sheet — reactions folded to a strip, the thread given the space | the Reaction door, with a talk bubble inside it | the bubble fills with ink | a strip above the shelf naming who spoke; opens into the list, walks card to card |
| 2 | **The card has a page** | a warm ground with the contributor's face on it | two plates; your avatar and name already on the second one | the card's own page | the attribution row | a sage stripe down the card's left edge | one line about people, then the walk continues on the pages themselves |
| 3 | **Talk in the feed** | a mono eyebrow naming the speaker, then the words | one canvas — paste the link into what you are writing and it lifts itself into a chip | inside the card's border, on Read | nothing to open | the folded corner, which is also the watch control | position only: moved cards rise above a hairline |
| 4 | **Talk rides the Swell** | a bordered leaf with the mark's ring in the gutter | written on that same leaf | the disc, with the thread written out in full beneath it | the door | a sage ring in the door | a pill that opens as a list in place, then travels you |
| 5 | **The thought is the spine** | the thought IS the headline; the article becomes its citation | inverted — words first and big, link second | a sheet anchored to the thought, answers hanging off it | the words themselves | the card's time line says the age of the talk, at full weight while unread | faces above the shelf; touch a person, not a card |

Each carries its stance, its return mechanism and its cost behind the
disclosure in the rail.

---

## What the v8 review asked for, and where it is

### Fixed as an invariant, in all five

- **The input's black bottom line.** Real bug, found and fixed. `D8Write` set the
  `border` shorthand and then a conditional `borderBottom`; React clears the
  longhand when the condition is false, and the UA's own dark textarea border
  came back through the gap. Every border in v9 is a longhand — in the shared
  parts and in every state file.
- **The thought is under-ideated.** The largest miss and the largest change.
  There are now five treatments, one per state, and every one names the speaker
  as part of its form — that is what stops the words reading as the page's own
  standfirst. `D9ThoughtMargin` · `D9ThoughtSaid` · `D9ThoughtHand` ·
  `D9ThoughtPlate` · `D9ThoughtSpine`, all in `pg-d9-parts.jsx`.
- **The attach popover was a field, not a surface.** Five surfaces, each
  committing to a different idea of what writing a thought is: the preview that
  assembles the card as you type · the plate that is signed before you write ·
  the one canvas that lifts a pasted link out into a chip · the leaf the thought
  will be read on · the inversion where words lead. `pg-d9-add.jsx`.
- **Skip the reaction and still leave words.** Now stated where it applies
  ("A reaction, words, both or neither. Nothing here is required."), and the
  commit button says which outcome you are choosing — *Just mark it read* until
  there is something to leave, *Leave it with the circle* after. A reaction
  already given can be taken back off.
- **A reader was writing into nothing.** The contributor's thought is now at the
  head of the reaction surface, so a reflection is an answer to something. This
  is the answer to "you are not responding to anyone in an explicit way" that
  does not turn the surface into a thread.
- **Committing ended the act.** The reveal is now the way in: the circle is
  there, the tail of the conversation is under it, every line is answerable, and
  the composer is one tap away. Joining the conversation at the moment of
  reaction needs no second trip.
- **It was not a conversation.** Replies are anchored under what they answer,
  every line carries *Answer <name>*, and answering later is the same control as
  speaking at the read. A long record collapses to first line · *Everything said
  in between* · the tail, so two lines and forty read the same shape.
- **The Reaction door may never be removed.** Enforced in `pg-d9-card.jsx`, not
  per state: on Read every card gets the door unless the state supplies its own
  actions, and each state that does still includes it. v8 broke this in state 2
  and lost a card's worth of evidence.
- **No card flip.** Dropped entirely. A flip that also expands cannot be made to
  work, and it was never the idea — it was the wrapper around the idea.
- **The watching row was 44px and a sentence, five times.** Now one glyph, the
  mark's ring, filled when you are watching, with the sentence as its title.
- **A way back to the article, from everywhere.** `D9ToArticle` sits in every
  record surface's header, and the card's page leads with the article.
- **Staleness.** Built: a conversation that has not moved in a fortnight leaves
  the watched set on its own. Standing a card up by hand overrides it.

### Kept, and taken further

- **The dark speaker bubble** (v8 state 4, "really cool") is state 1's mark, and
  it now lives *inside the door* rather than beside it — one control, not a
  second button in the action row.
- **The green corner** (v8 state 2, "really pretty") is state 3's fold. It is now
  the watch control as well as the ornament, drawn as one SVG path that takes the
  card's own 11px inner radius so it sits flush in the corner.
- **The new surface instead of a modal** (v8 state 5, the thing he liked best) is
  state 2's page — but marking read stays the modal it always was, which is the
  half of v8 state 5 that was rejected.
- **Thoughts and reactions on one affordance** (v8 state 4) is state 1's whole
  premise.
- **Cards rising in Read** (v8 state 3) is state 3's entire return mechanism, and
  it is the only state that has no signal at all.
- **The "still moving" section** is gone as a *housing*. Read re-orders; it never
  holds a second list you have to get out of.

### Rejected in the review, and not rebuilt

Micro dots as a talking mark (all of 6.1/6.2) · anything on the circle's name ·
anything in circle settings · reactions before the reveal · anything in the
Active feed, which is where the loading pill lives. Return sits on Read in all
five states, or nowhere.

---

## Craft notes

- **The app is mounted, not rebuilt.** Shell, app-posture shell, tabs, the Swell
  (pad, palette, glyph radiogroup, scatter, review, door), the empty state, the
  confirm dialog, the liveliness grammar, tokens, members surface.
- **Two copies, both stamped, neither tuned.** `pg-d9-swell.jsx` is
  `app/swell-reactions.jsx` verbatim with a wider `window` export;
  `pg-d9-card.jsx` is `FeedCard` with the state slots, because discourse has to
  sit inside the card's border. The real fix for the first is exporting those
  internals from `app/` — still not taken, still open for a verdict.
- **Posture follows the window** (< 1024 = the app posture). Rail docked at
  desktop width, Home destination on a phone. Viewport: Auto / Mobile.
- Seeded circle unchanged from v8: eleven live cards over twelve of silt, so the
  shelf is deep enough for return to be worth something. Nine members.
- Selection and viewport persist to `pg_d9_v1`; reset returns to `room` / `auto`.

## Open, for him

1. Which of the five, or which parts of which.
2. State 5 demotes the article. Is that a direction or a step too far?
3. State 1 asks one control to carry both records. Is the bubble learnable?
4. Whether the Swell internals should be exported from `app/`.
5. Whether a standalone HTML export is wanted this round.
