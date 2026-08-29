---
ticket: 'LM-652'
date: '2026-08-13'
topic: 'discourse-v10-playground'
status: 'awaiting-review'
type: 'exploration'
---

# Handoff: discourse v10 — three questions, nineteen answers

Nothing here is ratified. Everything is a candidate.

`discourse-playground-v10.html` (entry, project root) · modules
`docs/specs/lm-652-discourse/pg-d10-*.jsx`. It loads v9's shared machinery
(data · card · parts · add · flow · return · states) and its own three chapters,
rig and app. **v9's `pg-d9-rig.jsx` and `pg-d9-app.jsx` are deliberately not
loaded** — two React roots would fight over `#root`. v9 is untouched and still
playable at `discourse-playground-v9.html`.

## Why v10 exists

The v9 review found three things under-ideated, and all three were real:

1. **The reaction reveal was identical in all five states.** Mechanically true:
   every state's `reveal` was `SwellReview` + `D9JoinIn`, and every `write` was a
   textarea in a different frame. What happens when somebody leaves a thought in
   reflection to a post had never been ideated at all — only its wrapper had.
2. **Every return route sat on the Read tab.** An earlier round ruled out two
   specific PLACES (the circle's name, circle settings); that was carried forward
   as "nothing above the tab" and the whole circle scope went with it. None of
   v9's five are dropped here — three more are added beside them.
3. **The five add surfaces were one idea five times.** A URL field, a thought
   field, five frames.

So v10 is not five whole products. It is three questions with a flat list of
answers each, and it fixes the axis under test in one place while everything
else stays at v9 state 1 (the door opens a room) — two options differ by exactly
the thing being judged. In the return chapter the baseline's own affordance is
stripped first, so no option is ever seen next to v9's answer.

Picking an option enters the app **and puts you at the moment it lives in**: the
reaction modal for a reflection, the add surface for a contribution, somebody
speaking for a return.

## Chapter R — a reflection is…

| | Option | The act | The reveal |
|---|---|---|---|
| R1 | **Handed to somebody** | the surface names who has your words (last speaker, else the contributor) | a delivery, then the lines nobody has answered — answerable on the spot |
| R2 | **Your words ride your mark** | the field hangs off the glyph you gave; 140 chars | the disc IS the record: your line on your mark, touch a face to read a person, no-mark words at the rim |
| R3 | **Where you stand** | "you are the fourth here" above the field | the order people arrived, with what each said, you written in at your place |
| R4 | **Weight** | you type at the size your depth implies | a page of voices typeset at their own intensity; bare marks at the foot |
| R5 | **It becomes how you find it again** | you write inside a preview of the card | the card as it now reads on your shelf — and it reads that way on the shelf, in `R5Card` |
| R6 | **Nothing** | plain field | a receipt, and out. The null option, so the other five can be judged against something |

## Chapter N — the circle tells you…

N1–N5 are v9's five, kept exactly: the strip · who answered you · the cards
simply rise · the pill that opens as a list · the people. N6–N8 are circle scope:

- **N6 · Under the circle's name** — a band beneath the circle's own name,
  present on Active and Read alike; opens the list in place and walks you.
- **N7 · On the way in** — said once as you arrive, words already in it; dismiss
  or use it and it is gone. Nothing accumulates, nothing to clear.
- **N8 · On the circle, before you are in it** — the signal lives on the circle
  in the circles list: which circle, who, about what, read before entering.
  Home in the app posture; the rail's circle slot on the web.

## Chapter C — contributing is…

- **C1 · It arrives from where you were reading** — a share target: the page
  already resolved and titled, no URL field at all.
- **C2 · You compose the card** — no form. The card is the editing surface; the
  source line takes the link, the margin takes your words.
- **C3 · A link can be an answer** — asks where it goes first: its own card, or
  into a conversation already running, where it lands as an answer and reads as
  one at both ends (`answers` on the new card; a reply on the answered one).
- **C4 · It arrives with your mark on it** — the Swell pad is in the add surface;
  adding and reacting are one act and the card is never neutral. (Its cost is the
  thing that has been turned down before: a reaction before anyone has read it.)
- **C5 · The link now, the words when you have them** — the link goes over alone
  and the card keeps a leaf only you can see is empty. It waits, and never asks
  twice.

## Craft notes

- Each option carries a number, a name, a stance and a cost behind the rail's
  disclosure (PLAYGROUND 10, 11). The rail is one body in two places: docked at
  desktop width, the Home destination in the app posture.
- **Two rig mechanisms, not proposed data models.** `window.D10_PENDING` carries
  C4's reaction and C3's answer target out of the shipped add surface, whose
  submit only passes url + thought; `window.D10_ITEMS` publishes the live shelf
  to C3, which needs the running conversations. Both are cleared on close, on
  submit and on reset.
- **One documented copy:** `D10CircleRow` (in `pg-d10-return.jsx`) is
  `CirclesHome`'s row from `app/home.jsx`, geometry unchanged, with one line
  added. The shipped component takes only `spaces`, and its signal slot is
  documented as exclusive, so the discourse line cannot be passed in without
  changing `app/`. Not "improved" — see PLAYGROUND.md, copying is allowed once.
- Borders are longhands throughout (the v8 black-line bug).
- Selection and viewport persist to `pg_d10_v1`; Start over returns to R1 / Auto.
- Seed is v9's, unchanged: eleven live cards over twelve of silt, nine members.

## Walked end to end

R1 · R2 · R4 (reveals) · N6 · N7 · N8 (signal → list → travel → arrive) ·
C3 (into a conversation, both ends) · C4 (pad in the add sheet) · C5 (open leaf →
written → on the card). No console errors beyond Babel's own precompile warning.

## Open, for him

1. Which reflection, which return, which contribution — and which parts of which.
2. R3 and R4 both spend something the product has avoided: R3 an order people
   arrive in, R4 loudness. Are either acceptable?
3. C4 puts a reaction on a card before anybody has read it. Previously rejected;
   built here because contributing-and-reacting-as-one-act cannot be judged
   without it.
4. C3 changes what a card is. Direction, or too far?
5. Whether the three circle-scope options belong *instead of* the Read-tab five,
   or alongside them.
6. Standalone HTML export — not built this round.
