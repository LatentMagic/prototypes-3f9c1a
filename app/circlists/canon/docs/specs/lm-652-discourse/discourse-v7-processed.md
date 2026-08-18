# Discourse — processing the v7 reactions

Written 2026-08-11, straight after onboarding on `discourse-v7-reactions.md`, the
v1 reviewer notes, the v2/v3 postmortem and the v4 handoff.

**Nothing here is ratified.** Sections 1–4 are a reading of what the user said,
in his terms. Sections 5–8 are **my opinion, offered as a verdict to accept,
amend or shred** — they are not decisions and nothing has been applied. The
prototype is untouched.

---

## 1. Where seven rounds got to

- **v1** — eight structurally distinct directions. Two reviewers gave notes *on
  options*. Enthusiasm for: inside the door, the Echo, the card flip, reactions
  and reflections together, the contributor's thought up front.
- **v2 / v3** — the notes were read as a verdict. One preference became a global
  rule, six directions were demoted to "levers", and the set collapsed to one
  mechanism wearing twelve names. Both rejected; the postmortem's five failures
  are still binding.
- **v4** — the directions restored as directions, widened to ten, continuation
  ideated inside each. Delivered, not reviewed in writing.
- **v5 / v6** — no record in this project.
- **v7** — thirteen directions (ten "final" plus three built from what the v1
  reviewers liked). This is what the dump reacts to.

Thirty-odd directions have now been built. That number matters to section 5.

## 2. The thirteen, in the user's terms

**Dead on the idea** — the objection is to the concept, not the build:

| | Direction | Why it died |
|---|---|---|
| 01 | The Question | "opinion is not something that's framed by a question"; mandating the interrogative, and it replaced the title |
| 02 | The Depths | "not relating to it. It is getting in the way" |
| 04 | The Seal | "we cannot expect people to come back" — time/completion gating |
| 05 | The Pulled Line | **vetoed.** "Contributors are serious people who have serious thoughts to share" |
| 07 | Seats | "That's not inclusive. This is an inclusive app" |
| 09 | Palimpsest | overwriting "is not fair to the contributor at all" |
| 12 | Said the Same | "a major gimmick", skipped |

**Dead on execution, idea not dismissed:**

| | Direction | The read |
|---|---|---|
| 03 | Countercard | over-engineered, and broken enough that it could not be interacted with |
| 06 | Sounding | "what a bunch of bloat" — but the sense of how the circle's depths distributed is "something to reflect on" |
| 08 | The Dispatch | "a bloated monstrosity… word vomit on the page" — and "interesting as an idea", because it is the only one attacking the real gap |

**Alive:**

| | Direction | What survived |
|---|---|---|
| 10 | The Stream | the *simple* version: a line when you contribute, a line when you mark read, skip if you have nothing. "That just works." Plus the open question of whether a circle simply has a chat. Showing the whole stream inside the response modal is "definitely broken" |
| 11 | The Record | "quite pretty"; replying to someone *while still leaving your own* line is "really interesting"; continuation is real and reachable. Defects: the door lost its circle, the reflections list outgrows the surface, the emoji repeats per entry |
| 13 | The Note | the sharer's note before the read: "I really like it" (needs a character cap); note shown on the card; the after-note surface above Active/Read is a real, reachable continuation |

## 3. The five objections that actually came out of the dump

These recur across directions and are the substantive output, more than any
per-direction verdict.

1. **No second screen.** Raised on 01, 02, 08, 11, 13. The attached thought
   belongs in the add popover; the reflection belongs in the reaction modal.
   Nothing gets a screen of its own.
2. **Do not scaffold what a member says.** Prompts, stems, questions, pulled
   quotes, seats, matching — all of it minimises the contribution. This one
   objection kills seven of thirteen.
3. **Reachability is credibility.** Half the set was judged by clicking a
   Continue button that went nowhere. Playground defects (dead routes, state
   resets, the double add, the door losing its disc) were indistinguishable from
   design failures, so the review is partly a review of bugs.
4. **More must become less.** Every feature has to reduce the sense of
   overwhelm, not add surface. Simple, lovable, complete.
5. **Return sits above continuation.** Agreed in substance in the appendix. A
   card sinks down the Read tab; there is no sort, no filter, no pin. Every
   direction assumed you would find your way back and none earned it.

## 4. What is genuinely live material

Four things, and three of them are statements of a problem:

- 11's reply-to-someone-while-still-leaving-your-own (a mechanic).
- 08's "you don't know readers 3 and 4 have arrived" (a problem).
- 09's cascade — reading fourth is not the same as reading first (a problem).
- The return problem itself (the problem above the others).

---

## 5. Opinion — the shape question is spent

Seven rounds and thirty-odd directions. Every direction that scaffolded speech
died on the same sentence, and the three still standing (10, 11, 13) are three
views of one thing:

- a line the contributor may attach when adding, **in the add popover**;
- a line any member may leave when marking read, **inside the reaction modal**,
  skippable;
- the door holding the record — glyph, spoken depth, line, merged;
- the note visible before the read; everything the circle says after, behind it.

That is not a fourteenth direction. It is the floor, and the dump describes it
without arguing for it ("that just works, again with some problems to resolve").
Generating more shapes will keep returning here, because what is unresolved is
not the shape of an utterance. **My recommendation: stop ideating discourse
shape.**

Noted, not contradicted: building one baseline direction was rejected, and so was
building another playground from the current position. Nothing here proposes
either.

## 6. Opinion — decide return, on paper, and decide it small

Five honest answers to *how do you get back to something you have read*:

- **(a) You don't.** The conversation is the moment you close the loop; there is
  no coming back. Calmest, and it deletes continuation as a feature. Cost: the
  first reader never sees the eighth's thought — the loss the user names as his
  own objection.
- **(b) It comes to you.** Words that land on cards you have already read arrive
  through the app's existing arrival grammar — the quiet dot, the pill, accepting
  as the only thing that moves content. No new tab, no sorting, no pins.
- **(c) The card comes back.** A card with new words re-enters Active for those
  who have read it. Cheap, uses two existing tabs. Cost, in his words: a card
  that keeps returning becomes a chore.
- **(d) A place to go.** The separate surface — Table, after-note, a third row.
  Explored three times; nothing has convinced him yet, and "three rows doesn't
  work very well".
- **(e) A digest.** The contributor's digest already discussed: what you shared,
  what came back. Solves the contributor's case and nobody else's.

**My call: (b), with (a) as the honest fallback.** Reasoning: the only unsolved
*fact* in the dump is that you cannot know readers 3 and 4 arrived — an arrival
problem, not a place problem. The app already has one settled, ratified grammar
for arrival (micro dot, New pill, no counts, no badges, accepting is the only
thing that moves content). Spending that grammar on words costs no new surface,
no sorting and no pins, which is the only way this passes "more becomes less".
The Dispatch was reaching for this and failed on being a periodical — a cadence,
a masthead, latency and a page of prose — not on the instinct.

**What I would overrule: (d).** Three rigs have offered a separate surface and
none has earned it. A fourth attempt is the same round again.

## 7. Opinion — continuation is a budget, not a place

Two utterances per member per item, then the item is closed. The user floated
this himself ("you can basically respond twice"). It keeps brevity structural,
never becomes a thread, and makes the record finite — which is the fix for his
own complaint that 11's reflections list outgrows its surface.

**What I would overrule: the chat.** A permanently open circle-wide talk surface
gives the app a second attention centre where the queue has been the only one,
and it is the direction most exposed to the not-Slack/not-WhatsApp invariant,
which is settled in `PROMPT.md`.

## 8. Ground rules for whatever comes next

- **Nothing unreachable ships.** Either an affordance is wired end to end or it
  is not drawn. Half of v7's review was spent on dead buttons.
- **No second screens.** Attach in the popover, reflect in the reaction modal.
- If the next artefact is a rig, it is a **whiteboard** — static, one comparison,
  no app, no config (`PLAYGROUND.md`'s first shape) — not another rail of
  playable directions.

## 9. Housekeeping worth a decision

v5 and v6 have no record here. v7 exists **only** as
`discourse-playground-v7-standalone.html` (compiled); the `pg-d7-*.jsx` sources
and the docs it cites (`FINAL-TEN.md`, `v1-revisit-THREE.md`,
`pg-d7-CONTRACT.md`) are absent. v7 therefore cannot be edited, only re-read out
of the bundle. If any of it is to be built on, the sources want extracting back
out first — worth deciding, not worth doing unasked.
