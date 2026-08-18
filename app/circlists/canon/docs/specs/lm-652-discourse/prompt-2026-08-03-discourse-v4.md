---
date: '2026-08-03'
topic: 'discourse-v4'
status: 'ready'
type: 'prompt'
---

# Circlists — discourse playground v4

Self-contained prompt. Paste as the first message of a **new session** in the
Circlists project. Read it fully, read the listed sources, ideate, show the set,
then build.

You are picking up an exploration that has run three times. Round one succeeded.
Rounds two and three failed, in the same way, for a reason that is written down.
Your job is to get round one's variety back, widen it, and steer it with the
review notes — not to settle the question.

## Read first, in this order

1. `docs/specs/lm-652-discourse/PROMPT.md` — **the original brief. It is still the
   brief.** Everything in it that says "settled" is still settled.
2. `docs/specs/lm-652-discourse/postmortem-2026-08-03-discourse.md` — how v2 and v3
   failed. The five failures and the rules that follow are binding on you.
3. `docs/specs/lm-652-discourse/review-2026-07-30-v1-notes.md` — both reviewers on v1,
   verbatim. **These are steering on the options, not a verdict.**
4. `docs/specs/lm-652-discourse/README.md` — the v1 option table. (Its supersede banner
   points at v2 and is now wrong; fix it as part of this work.)
5. `docs/specs/lm-652-discourse/handoff-2026-07-27-discourse-playground.md` — how v1 was
   built, and its craft lessons.
6. `CLAUDE.md`, `PLAYGROUND.md`, `GOTCHA.md`, `wiki/circlists-copy-voice.md`,
   `tokens.css`, `brand/circlists-brand.md` — conventions, traps, copy voice,
   tokens. All binding.
7. `docs/specs/lm-652-discourse/ideation-2026-07-31-discourse-v2.md` — **read last, and
   read it sceptically.** Its Part 2 (continuation, K0–K6) is genuinely useful
   ideation. Its Part 3 "spine" is the mistake that killed the exploration. Mine
   the first; ignore the second.

Run the playground that worked before you design anything:
`discourse-playground.html` (+ `pg-disc-*.jsx`). That is the bar.

## The state of play

- **v1 — `discourse-playground.html`.** Eight structurally distinct directions:
  passing notes stacked on the card · marginalia in the margin · the Table as its
  own place · guided statements on the back of the card · inside the door · the
  Echo · the question · plus the reaction-only baseline (the card flip lives in
  those modules too). This is the surviving baseline and the shape of rig that
  worked.
- **v2 — rejected.** Promoted one review note into a global rule, folded six of
  the eight directions into a single "spine", and narrowed the whole question to
  continuation. Its seven options vary only how many times you may speak. The user
  could not get through it: "too complicated."
- **v3 — rejected.** Fixed the presentation (a flat list of twelve playable
  versions) without fixing the problem. Twelve names over one mechanism: "the same
  note occurring on a card… an emoji in a different place."

Both rejected rigs still contain component work worth salvaging (see "What to
reuse"). Their **option models are dead** — do not restore either.

## What v4 is

**A wider, better-steered set of genuinely distinct directions than v1 had, with
continuation ideated inside each one.**

The ask from the review was for *more* variety, or at least steering on the
existing variety. Answer that literally.

1. **Keep v1's directions as the live set. Do not merge them into a rule.** Each
   one stays a separate, fully designed answer.
2. **Steer each one with the notes.** Specifically:
   - **Echo** — Jonny found it complementary and very interesting; the user did
     not understand it. It needs *more examples, in more places*, until it is
     obvious on sight. Consider the plainer word ("Same") alongside it.
   - **Inside the door** — "sick, could be a good grounding". Push it hardest.
   - **Reactions and reflections together** — "a beautiful synergy", especially on
     Read. Also: the five-second reveal timeout does not work once there are words
     to read. Fix that where it appears.
   - **The contributor's thought up front** — both reviewers want to explore it.
     **Explore it, do not rule it in.** Some directions show it before the read,
     some hold it back, and the reveal-on-read tension is *shown* rather than
     resolved. This is the single mistake that killed v2 — see failure 2 in the
     postmortem.
   - **Guided statements** — on the fence: helpful scaffold, presumptuous
     residue. Present the strong version (a prompt that leaves nothing of the
     app's words in the record) and the weak one (a stem that stays), so the
     difference can be seen.
   - **The Table** — Jonny disliked the detachment; the user's correction is that
     the Table only makes sense as the place a conversation may *continue*, and
     that nothing should be moved out of the feed. Rebuild it on that basis.
   - **The question register** — the contributor reads as higher priority because
     they own it and the response is a reply. Keep that typographic instinct.
   - **The card flip** — "very cool, liked less". Keep it in the set; do not
     delete work the reviewers liked.
   - **Read-tab bloat** — the user does not want the conversation growing the
     card. That is a real constraint, but it is one direction's answer, not
     everyone's.
3. **Add continuation as a new axis inside each direction, not as a replacement
   question.** Ask what continuing looks like *in that direction's own idiom* —
   in the margin, at the table, inside the door, on the back of the card, beside
   the reaction. K0–K6 in the v2 ideation are good raw material for the
   *disciplines*; do not ship them as options in their own right.
4. **Add new directions where the notes point somewhere none of the eight go.**
   More is wanted. Do not pad — but do not prune to be tidy either.
5. **Design the content, not just the plumbing.** A sharer's line, a reflection, a
   takeaway are new content classes on a real card. Give each direction its own
   typographic treatment of them. The v2/v3 version — one generic line hanging
   under the attribution, reused everywhere — was called disgusting on the card,
   and that judgement was correct. Multiple *designed* treatments of contributed
   content is not decoration; it is the exploration.

## Your judgement, not theirs

You make the calls: which directions are in, how each is designed, what
continuation looks like in each. The reviewer's judgement needs tactile context to
exist at all, so it arrives after the rig does. That means the screenshot test
below is *yours* to apply before handover — nobody is going to catch a
look-alike option for you.

## The shipping test

**If two directions screenshot the same, they are one direction.** Look at the
set, side by side, before you hand it over. Any option whose difference can only
be found by reading its label is not an option.

Second test: **nothing in the reviewer's path explains itself.** No shape
statements, no theory cards, no claim/trade-off essays in front of the app. The
rail carries a name and one line; the app carries the idea. Theory goes in the
ideation doc.

## Process

1. **Ideate first, in a document** — `docs/specs/lm-652-discourse/ideation-2026-08-03-discourse-v4.md`.
   Take each of v1's directions, apply the steering above, say what continuation
   looks like inside it, and say how its contributed content is *designed*
   differently. Add your own new directions. Keep it terse — this is a working
   doc, not an essay, and the v2 ideation's length was part of why nothing got
   read.
2. **Do not check in before building.** No questions form, no list of candidate
   directions for approval, no asking which to keep. The job is that you ideate
   and the user reacts *afterwards*, with the built app in their hands — an
   opinion about a one-line pitch is worthless to them, and asking for one is the
   same failure in a smaller form. Own the set; carry the ideation through to the
   rig in one pass. Ask only if something genuinely blocks you.
3. **Build**, new files, kebab-case: `discourse-playground-v4.html` +
   `docs/specs/lm-652-discourse/pg-d4-*.jsx`. Fork; never mutate v1, v2 or v3 files.
4. Deliver a standalone bundle (`discourse-playground-v4-standalone.html`) for
   phone review, and write `handoff-2026-08-03-discourse-v4.md` in the existing
   handoff format.

## What to reuse

Fidelity comes from reuse, and there is a lot on disk. Fork these into `pg-d4-*`
rather than rebuilding, and keep the design work that survived:

- **v1 (`pg-disc-*.jsx`)** — the eight directions' actual surfaces, the copied
  Swell disc geometry, the card with a discourse slot, the flip. This is your
  starting point.
- **v2 (`pg-d2-*.jsx`)** — worth salvaging even though its option model is dead:
  the record where reactions and words are one artefact; the wiring that unmounts
  the shipped reaction flow at commit so the record takes the sheet's place with
  no timer; the table set as a page rather than a transcript.
- **The app itself** — the shipped reaction pad (`app/swell-reactions.jsx`), the
  door, the shells (`app/shell.jsx`, `app/app-shell.jsx`), the cards
  (`app/feed.jsx`), the seed data. Mount the real components; never mock one.

## The rig

Per `PLAYGROUND.md`, which is binding:

- The real app, engaged the normal way. No bezel; posture follows the window at
  `< 1024` (`main.jsx`'s own breakpoint). Forced-Mobile viewport control uses the
  app's own phone frame.
- The direction selector stands where the circle rail stands: docked at ≥ 1024,
  the app's own `MobileDrawer` behind the top bar's menu button below it, the
  **Home** destination in the app posture.
- It must work at 1024×720 and on a 390-wide phone. It will be opened on a phone.
- Levers: keep them, keep them secondary and out of the reviewer's way. The
  variety must be reachable without configuring anything.
- Each direction pre-seeded so its distinctive moment is one or two natural
  touches away, and play state kept per direction so switching back is not a loss.
- No `app/` change, no `circlists.html` change, no `CHANGELOG.md` entry.

## Locked — do not reopen

The design language, and the settled list in `PROMPT.md`: reveal-on-read (as a
tension to explore in *how* it is applied, never as a rule to delete) · no comment
threads · calm is the floor, no badges or kudos tallies · communal library,
individual read-state · sharing before reading is a valid register · the Swell and
the Reaction door stay as shipped · accent `#047857` for primary actions, active
states and focus rings only · hierarchy by size and weight, never colour · 4px
grid · readable from 320px · voice per `wiki/circlists-copy-voice.md` · no emoji
in copy, ever (reaction glyphs are data and are fine).

## Output

- `docs/specs/lm-652-discourse/ideation-2026-08-03-discourse-v4.md` — the ideation,
  direction by direction, terse.
- `discourse-playground-v4.html` + `pg-d4-*.jsx` — the rig: v1's directions
  steered and pushed, plus new ones, each visibly distinct, each covering the loop
  end to end including continuation.
- `discourse-playground-v4-standalone.html` — bundled for phone review.
- `handoff-2026-08-03-discourse-v4.md`.
- `docs/specs/lm-652-discourse/README.md` — supersede banner corrected to point here.
