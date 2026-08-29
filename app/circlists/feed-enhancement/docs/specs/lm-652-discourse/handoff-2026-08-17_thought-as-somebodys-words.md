---
date: '2026-08-17'
ticket: 'LM-652'
topic: 'discourse — the thought as somebody''s words'
status: 'complete'
type: 'exploration + implementation'
---

# Handoff: LM-652 — how the contributed thought is set, and where it landed

## Current Focus

The name-led treatment is **built and ratified into the candidate**
(`circlists-lm652.html`). The last exchanges were spacing tuning, all applied. Nothing
is open on this thread.

What is still open, and was deliberately kept out: **the domain's position on the CLOSED
card** (it stays above the title, shipped anatomy). The foot placement was ratified for
the OPEN card only.

## Task(s)

Four rounds, three of them rejected. The rejections are the substance of this handoff —
see Learnings, because the same mistake was made three times.

1. **v1 whiteboard** (`pg-wb-thought-voice.html`) — four typographic treatments. Rejected:
   the four looked like one object with small edits.
2. **v2 whiteboard** (`pg-wb-thought-voice-v2.html`) — eight composed silhouettes.
   Rejected, but it produced the direction: option 2, "Name leads".
3. **Name-leads whiteboard** (`pg-wb-name-leads.html`) — six resolutions of the one
   direction. This is the board that worked.
4. **Register board** (`pg-wb-register.html`) — a decision visual, built because the user
   said plainly they could not tell what they were being asked to ratify.

Then the ratified design was built into the candidate.

## Critical References

- `CLAUDE.md` — the ratification rule. Everything below was ratified in words.
- `docs/specs/lm-652-discourse/handoff-2026-08-17_the-open-card.md` — the session before
  this one. Its standing instruction ("do not ideate the mechanic") still holds.
- `skills/show-me/SKILL.md` — the thing that unblocked the ratification.

## Recent changes

`docs/specs/lm-652-discourse/cand-lm652-card.jsx`

- `CandAltFace` rebuilt to the ratified treatment: a hairline runs the full width under
  the title (`margin: '-4px calc(var(--space-5) * -1) 0'`), then avatar 26 + name
  `600 14px` in **`--color-fg-1`** + time, then the thought at `12.5px / 1.85` in
  `--color-fg-2`.
- `CandSourceLine` gained a `foot` prop and MOVED to the foot row of the open card
  (`600 12.5px`, `--color-fg-3`), filling the bottom-left and putting the site's colour
  at both ends of the card. It no longer sits under the title on the open face.
- Band words 13.5px → **12.5px**, and the contributor's name in the band is now
  `--color-fg-1`, so the closed line matches the open thought exactly.
- Spacing, tuned live with the user: 8px above the rule, 18px between rule and name,
  4px between the thought and the foot row.

`docs/specs/lm-652-discourse/cand-lm652-surface.jsx`

- `CandIntro` rebuilt: the warm-paper slab is **gone**. Same anatomy as the card —
  avatar 26, name `600 14px` fg-1, "with the link · 6h", thought `12.5px / 1.85` fg-2 —
  then a hairline before the turns.

## Learnings

**The ideation kept failing for one reason, and it was mine.** Three boards in a row were
rejected as "all the same". The user's phrase for it: *"I feel like I'm looking at four
options that all just look exactly the same."* The bar they eventually ratified is the
one to hold from the start: **you should be able to tell the options apart from across the
room, before reading a word of the rationale.** One-variable swaps are a variable table,
not ideation.

**The framing the user wanted, stated properly.** Not "how do we style this text nicely".
It is semantic: what makes the thought read as *a named person in this circle speaking to
us*, and never as a pull-quote, extract or subheading belonging to the article. The trap
that kills most candidates: quotation marks, serif, italic, indent, a left rule — all of
them are the visual language of **citation**, so they push the words toward the article.

**Two type bugs cost a whole round each.**

1. `tokens.css` carries an element rule `p, .p { font: 400 var(--text-md)/... ; color: var(--color-fg-1) }`.
   An element rule beats an inherited font, so every `<p>` inside a styled block rendered
   at **16px near-black** regardless of the container's declared size. In v2 that meant the
   lead sentence of all eight options rendered at exactly title size in exactly the ink
   the user had ruled out — the whole board was judged with that defect in it. Fix:
   `.th p { font: inherit; color: inherit; margin: 0 }`.
2. A board that renders the same closed-card markup for every option silently contradicts
   each option's stance on the surface the user named as non-negotiable. Every option needs
   its own expression at every scale — or, where a treatment genuinely cannot survive one
   line, that IS its cost and belongs in the bar.

**When the user cannot picture the trade-off, stop arguing it in prose.** Two turns were
spent trying to get "same anatomy, register tracks the surface" ratified in words. One
side-by-side board settled it in a single turn — and the answer was the opposite of my
recommendation.

**Vet the surface before proposing a treatment for it.** The conversation surface's turns
are `14.5px` **black** with 26px avatars and `600 13.5px` black names
(`cand-lm652-surface.jsx:59-73`). My whiteboards had drawn them 13px grey, which flattered
every option. Reading the real values is what produced the actual question.

**The open card is WARM PAPER.** Every board in this session drew it white before the user
caught it. `CAND_PAPER = { bg: '#F2F1EB', bd: '#DEDCD3' }` (`cand-lm652-parts.jsx:9`).

Nothing here is proposed for `GOTCHA.md`.

## Artifacts

- `circlists-lm652.html` — the candidate, carrying the ratified treatment.
- `pg-wb-name-leads.html` — the board that worked. Six resolutions of the name-led
  direction; worth keeping as the record of what was ruled out and why.
- `pg-wb-register.html` — the decision visual (A vs B, plus a junk third row).
- `pg-wb-thought-voice.html`, `pg-wb-thought-voice-v2.html` — the two rejected boards,
  moved to `docs/specs/lm-652-discourse/archive/`. Their root-relative asset paths no
  longer resolve; that is expected and left alone.
- `docs/specs/lm-652-discourse/cand-lm652-card.jsx`, `cand-lm652-surface.jsx`.

## Action Items & Next Steps

1. **The domain on the closed card is still open.** The user raised it at the top of this
   session — inline with the title, above it, or left alone — and it was parked so it
   would not dilute the thought question. It now has a natural answer to be judged
   against: the open card puts favicon and domain at the foot.
2. **Part B copy is still unratified** — surface name, Add popover words, return banner,
   roster eyebrow. Carried over untouched from the previous handoff.
3. **C2, C3 and C4 playgrounds: the user reported them unreadable; they load clean.**
   Still not reproduced. Get the specific symptom before changing anything.
4. **`pg-wb-name-leads.html` and `pg-wb-register.html` are still at the project root.**
   Archive them the same way once the closed-card domain question is settled — the
   name-leads board is the reference for it.
5. **`CHANGELOG.md` — nothing to add.** This is a display decision inside an existing
   feature, not a change to the shape of the product.

## Other Notes

Ratified in words this session:

- Name-led: the person heads the block, the thought runs small and quiet beneath.
- The name is **black**. Grey was explicitly rejected — grey is the product's word for
  secondary, and every name on the conversation surface is black.
- The avatar is **in**, now, not later ("especially when we look to introduce avatars in
  the future properly").
- The hairline stays, with the stated option to drop it later if it reads as bloat.
- **A, not B**: the register is pixel-identical on both surfaces. Growing the words to
  14.5px on the conversation page made the contribution look like another turn.
- The intro's warm-paper slab is gone from the conversation surface. The warm paper CARD
  in the feed is untouched and out of bounds.
- The title's affordance was **not** touched. The user explicitly ruled out changing it
  now, while flagging that "is it clear the title is clickable" is a real question for the
  main card and worth raising separately.

Rejected directions, so they are not re-proposed: mono/"the hand" (mono is the link and
URL voice); a second paper block for the thought; bare black; anything at title size;
inverted hierarchy (the title is the link's only affordance and cannot be minimised);
name in grey.
