# Discourse — what shape does an exchange take in Circlists?

`Discourse playground.html` (+ `pg-disc-*.jsx`). Built beside the prototype; the prototype is
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
