---
date: '2026-08-03'
topic: 'discourse'
status: 'agreed'
type: 'postmortem'
---

# Discourse — what went wrong in v2 and v3

Written after the user rejected both v2 and v3. Read this **before** touching the
discourse exploration again, alongside `PROMPT.md` (the original brief) and
`review-2026-07-30-v1-notes.md` (the v1 notes).

Verdict, in the user's words: *"everything has gone completely off the rails…
we basically have lost all the variety that we've been exploring, and it's landed
very much on the same goddamn card as every single item."*

## What the exploration was for

The brief asked for **5–7 genuinely distinct answers** to what shape discourse
takes — varying *where it lives*, *what the response is*, *how brevity is
structural*, *when it reveals*, *whose thought it is*. Discourse spans three
things, and the variety was meant to run across all of them:

1. the thought attached on **contribution**,
2. the **reflections** other members give back,
3. whether and how a conversation **continues** — and how any of it is presented
   in a way that is novel and bespoke.

v1 delivered that: eight structurally different surfaces (notes stacked on the
card, marginalia in the margin, the Table as its own place, guided statements on
the back of the card, inside the door, the Echo, the question, the card flip).

## The five failures, in the order they happened

1. **The v1 notes were read as a verdict instead of as notes.** They were
   reactions to individual options — several of them enthusiastic ("inside the
   door is sick", "echo… could be explored further", "card flip is very cool",
   "a beautiful synergy"). Enthusiasm about a direction is an instruction to push
   *that direction* further. Instead the notes were treated as evidence that the
   question was settled.

2. **One note was promoted into a global rule, and that spent the variety.** "See
   the contributor's thought before reading" became the rule *reveal-on-read
   protects the conversation, not the invitation*, applied to every option at
   once. From there, six of the eight directions were reclassified as "levers or
   rules" and folded into a single ten-statement spine. **That paragraph is where
   the exploration died** — the thing that varied between options became the thing
   they all shared.

3. **The question was then narrowed to continuation alone.** Continuation was one
   note out of fifteen and a real gap, but it became the *whole* of v2 (K0–K6). So
   v2's seven options varied only turn discipline — an invisible rule about how
   many times you may speak. Nothing structural, nothing visual. The user never
   got through v2 at all: *"too complicated."*

4. **v3 fixed the presentation and not the problem.** The brief for v3 was right
   that the rail was the wrong model, and v3 duly became a flat list of twelve
   playable versions. But twelve names over one mechanism is still one mechanism:
   *"the same fuckin' note that's occurring on a card… but there's an emoji in a
   different place."* Changing how options are presented cannot restore variety
   that was deleted upstream.

5. **The contributed thought was wired, never designed.** Jonny asked whether the
   sharer's line could be seen on the card. The answer shipped as one generic line
   hanging under the attribution, identical in every version, and it looks bad:
   *"it looks disgusting on the card."* A question about putting content on a card
   is a request for **several designed treatments of that content**, not one
   default reused twelve times.

## The rules that follow

- **Notes on options are notes on options.** Extrapolating a note should
  *multiply* directions, not merge them. If an ideation pass ends with fewer
  distinct surfaces than it started with, it has gone wrong — say so and stop.
- **Never promote a preference into a global rule mid-exploration.** A rule that
  every option obeys is a rule the user can no longer see, compare, or reject.
- **A new dimension is a new axis, not a replacement question.** Continuation
  should have been ideated *within* the existing directions (what does continuing
  look like in the margin? at the table? inside the door?), not instead of them.
- **Variety must be visible.** If two options screenshot the same, they are one
  option. Test the set by looking at it, not by reading the labels.
- **Design the content, not just the plumbing.** Any new content class on a card
  (a sharer's line, a reflection, a takeaway) needs real typographic treatments,
  and different directions should treat it differently — that *is* the exploration.
- **Keep the source brief in the repo.** `PROMPT.md` exists now because the
  original was only ever in a chat thread, and three sessions drifted from it
  without anyone able to check.

## Where things stand

- **v1 (`discourse-playground.html` + `pg-disc-*.jsx`) is the surviving baseline.**
  It still runs and it still holds the variety. Its `README.md` carries a
  supersede banner pointing at v2 — that banner is now wrong.
- **v2 and v3 are rejected.** Their component layer (the record, the merged
  reactions-and-words door, the real reaction-flow wiring, the table-as-a-page
  typography) contains work worth salvaging, but their **option models are dead**.
- Nothing has ever been applied to `app/`. The product is untouched.
