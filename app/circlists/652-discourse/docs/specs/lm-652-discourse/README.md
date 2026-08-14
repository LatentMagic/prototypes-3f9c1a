# LM-652 — Discourse

What shape an exchange takes in Circlists, from a contributor's attached thought to a reader's
response, without the app becoming a chat tool. All discourse work lives in this folder.

**Where it is now — the candidate build (2026-08-14).** The delta prompt landed and was built as
`circlists-lm652.html` at the project root: the same `app/*` files, then the `cand-lm652-*.jsx`
overlay set (this folder) re-publishing only what the delta changes. Its own persisted-state key
(`circ_lm652_state_v1`); teardown = delete the entry + the cand files. The additive hooks it needed
in `app/` (main.jsx candidate hooks, swell-reactions internals export + reveal override) leave the
main app pixel-identical. Receipt: [`handoff-2026-08-14_candidate-first-build.md`](handoff-2026-08-14_candidate-first-build.md).
**Nothing is ratified.** The playground rigs below remain as exploration record.

**Where it was before — v10.** All playground entries are now in [`archive/`](archive/) —
`pg-discourse-v10.html` (modules `pg-d10-*.jsx` in this folder; it also loads v9's shared
machinery), `pg-discourse-v9.html`, `pg-return-v12.html`, `pg-thought-stack.html`,
`pg-thought-v11.html`, and the four whiteboards (`pg-wb-*`,
`pg-whiteboard-thought-on-card.html`). Superseded rigs v7–v8 and the early v1–v4 work are there
too. **They no longer run from the archive** — a playground entry needs to sit at the project root
for `app/`, `tokens.css` and `brand/` to resolve, so to open one again, move it back to the root.
The five standalone bundles alongside them (`*-standalone.html`, v9/v10/r12/thought-stack/
thought-v11) do run from anywhere. **Nothing is ratified.**

**Where the next build lands — intention (2026-08-14).** The incoming delta is **not** going into the
main app and **not** a playground: it is a **candidate build** — a second entry
(`circlists-lm652.html`) loading the same `app/*` files plus a small overlay set carrying only the
delta, published downstream as its own state. Shape, alternatives considered, teardown, and the one
untested assumption it rests on: [`../candidate-builds/README.md`](../candidate-builds/README.md).
**Read it before building.** Intention, untested, not a process — and its `app/` export change is not
approved.

**Two flags for the incoming build prompt (2026-08-14).** Recorded at the owner's request, ahead of a
large prompt that brings several threads together. Flags, not decisions — the prompt governs.

1. **The Swell optionally in the add popover: C4 is the inspiration.** `pg-discourse-v10.html`, option
   **C4 · "It arrives with your mark on it"** (`pg-d10-contribute.jsx:205`, `C4Add`) is where the idea
   comes from and should be credited as such. It is **not a model of the execution** — the owner's
   note is that it can be done better and, at minimum, must be thought through mindfully rather than
   lifted.
2. **No add-a-link thought input has looked beautiful yet.** Across every rig so far the contributor's
   thought field reads bloated and inelegant, and it does not give **up to 500 characters** enough
   room to stay readable and visible while writing. This is a known gap, flagged so whoever builds
   designs it deliberately rather than inheriting a previous field.

**The fold and watching — working decision (2026-08-14).** The fold stays, but as a **signal only**:
it displays that a card is being watched and is **not pressable**. The mechanism lives on the new
surface. Two flags for whoever builds that surface: the toggle needs a genuinely beautiful treatment
— nothing in the playgrounds so far is a model to copy — and **the word "watching" is probably
wrong**. The functionality has to be there regardless. Not being solved in this round. **Working
decision, not ratified — may change.**

**The way into discourse — working decision (2026-08-14).** The card's emoji door-analytics button
is replaced by a **brand-new icon**, and that icon opens a **new full surface** — reached and left
the way circle settings is, not a modal. That surface holds **the conversational thread and the door
analytics** together; it is the only way in. The modal in `pg-return-v12.html` goes. The thought band
belongs on **Active, not Read** — on Read the way in is this icon to the surface. **Working decision,
not ratified — may change.**

**Thought on a card — working decision (2026-08-14).** The stack from `pg-thought-stack.html`
(`pg-st-stack.jsx`): the thought as a band under the card, the card in front overlapping it, opening
to the alternate state. Take it with the **warm paper** band for the time being — `ST_PAPERS.warm`,
`#F2F1EB` on a `#DEDCD3` border, which is not a token yet. **Working decision, not ratified — may
change.**

**Return notification — working decision (2026-08-14).** For builds from here on, the return
statement is **W4 from `pg-return-v12.html`** (`pg-r12-return.jsx`, `W12Strip`): the strip at the
head of the feed, the touch made explicit, standing on whichever tab you are on, opening the list in
place. Chosen because the bar has fixed geometry and a control that comes and goes makes the corner
move on a silent day, whereas the feed has no fixed shape. Its two known costs stand: it scrolls
away, and it appears at the head of both Active and Read. The top-bar routes (W1/W2/W5, and the ten
control forms in `pg-wb-control-forms.html`) were explored and set aside. **Working decision, not
ratified — may change.**

Two flags on W4 for whoever implements it. Its form, the sage rule and the copy's shape all read well
and are kept — but **the copy itself has to change**: it no longer walks you back to a card, it takes
you to the new surface, so the second line ("Pick one to go back to it" / "See which cards") and the
line above it need rethinking. Not being done in this round. And the **circular chevron target on the
right is not settled** — no other button in the product is a circle, so decide deliberately whether
it belongs here or whether the house control shape should be used; there is no design-system
precedent for it yet.

| File | For |
|---|---|
| [`handoff-2026-08-14-return-button-and-prebuild-decisions.md`](handoff-2026-08-14-return-button-and-prebuild-decisions.md) | **Latest — start here.** The working decisions above, and why. |
| [`handoff-2026-08-12-discourse-v8-return.md`](handoff-2026-08-12-discourse-v8-return.md) | The v8 return round. |
| [`handoff-2026-08-12-discourse-v8-playground.md`](handoff-2026-08-12-discourse-v8-playground.md) | Carries the **verbatim v8 prompt**. Still the brief. |
| [`handoff-2026-08-11-discourse-v7-processing.md`](handoff-2026-08-11-discourse-v7-processing.md) | The v7 review and the four ratified laws. |
| [`postmortem-2026-08-03-discourse.md`](postmortem-2026-08-03-discourse.md) | Why v2 and v3 died. Still binding. |
| [`PROMPT.md`](PROMPT.md) | The original round-one brief. |

Earlier rounds and their handoffs are all in this folder. Everything below is the round-one record,
kept as it was written.

---

# Discourse — what shape does an exchange take in Circlists? (round one)

> **Continued in v4 (2026-08-03).** v2 and v3 were both rejected — they folded these eight
> directions into one mechanism. See
> [`postmortem-2026-08-03-discourse.md`](postmortem-2026-08-03-discourse.md) for how, and treat
> their option models as dead. **v4 is the live rig**: these directions kept as directions,
> steered by [`review-2026-07-30-v1-notes.md`](review-2026-07-30-v1-notes.md), widened to ten, with
> continuation ideated inside each one — [`ideation-2026-08-03-discourse-v4.md`](ideation-2026-08-03-discourse-v4.md),
> then `discourse-playground-v4.html` (+ `pg-d4-*.jsx`, handoff
> [`handoff-2026-08-03-discourse-v4.md`](handoff-2026-08-03-discourse-v4.md)). The original
> brief is [`PROMPT.md`](PROMPT.md) and is still the brief. This file stays as the record of round
> one; v1 is still on disk and still runs.

`discourse-playground.html` (+ `pg-disc-*.jsx`). Built beside the prototype; the prototype is
untouched.

**The question.** A contributor wants to attach a thought to what they share; a consumer wants to
respond — to that thought, or to the share. A reaction says something landed but does not close the
loop. What closes it is belonging: collaborative, on the pulse together. This explores the whole
loop as one shape — thought attached → thought received → response given → the exchange lives
somewhere — without Circlists becoming a chat tool.

## What's in it

Eight rail entries: the reaction-only **baseline** (00) and seven directions, each carrying a claim
and its trade-off, each answering every lever.

| | Direction | Where discourse lives | Response |
|---|---|---|---|
| 00 | Reaction only (baseline) | nowhere | — |
| 01 | Passing notes | on the card | one note back, per member |
| 02 | Marginalia | the card's margin | a note that annotates, never replies |
| 03 | The Table | a third tab | a note, in a place you enter |
| 04 | Guided statements | the back of the card | a completed sentence stem |
| 05 | Inside the door | the Reaction door | an epilogue, written at loop closure |
| 06 | The Echo | on the card | an echo plus one word |
| 07 | The question | on the card | an answer to the sharer's question |

**Merges.** 05 merges the two ideator seeds that both put discourse inside the reaction boundary
(one permanent, one momentary) — it keeps the moment *and* the record. 04 takes the guided-statement
seed and resolves what it left open by filtering the response stems by the glyph you just left, so
it is merged with the Swell rather than adjacent to it.

**Every option states its relation to the Swell.** 04/05/06 merge into the reaction moment (the
reveal step *is* the exchange). 01/02/03/07 are sequential — the Swell plays, then the response.
The baseline is reaction only.

## Using it

- **Rail** = the directions. The selected one expands with claim + trade-off.
- **Heading** = levers, all defaulting to **Auto** (each option's own intended answer): attach
  obligation, unread marker, where you respond, response shape, length, names — then the data/state
  switches (thoughts, responses, shared-pre-read) right of the hairline.
- **Side column** = the loop, end to end. Each of the four beats has a button that drives the phone
  to it, plus a readout of the option's answer to every lever and the seeds it draws from.
- Selection and overrides persist (`pg_discourse_v1`). "Reset feed" clears anything you marked read.

## Settled, and honoured everywhere

Reveal-on-read (nothing another member attached is visible until you have read the item) · no
threads · no unread badges or kudos tallies · communal library, individual read-state · sharing
before reading is a valid register, never punished · the Swell and the Reaction door are unchanged.

## Notes for whoever picks this up

- The Swell input is the **real shipped component** (`app/swell-reactions.jsx`), so the reaction beat
  is not a mock. The static disc in the discourse surfaces is a copy of its geometry
  (`pg-disc-parts.jsx`) because the shipped module keeps its disc internal — keep the numbers in step.
- The performance-pressure risk is designed around, not dismissed: `attrib: 'muted'` (02, 06) drops
  the name from a note and leaves the avatar, so how often a member's name appears is not itself a
  per-person scoreboard. Toggle **Names** in the heading to see both.
