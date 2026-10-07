---
name: edit-before-it-leaves
description: Apply when a document, handoff, proposal, report, spec, skill, rule, prompt file or page is about to be handed over. Cuts bloat and repeated claims first, then fixes clarity, compresses, strips AI tells and proofreads, in that order. Not for chat replies, commit messages or scratch notes.
metadata:
  version: '0.1.0'
  author: LatentMagic
  source: consolidated from LatentMagic's cut-before-it-leaves principle and its editorial skills (structure, prose, debloat, proofreading)
---

# Edit before it leaves

The author cannot see their own bloat: every line had a reason once, and the reader pays for each. Before text is handed over, run these passes in order, on a read that did not write it where you can. Order matters: cutting first means the later passes polish only what survives.

**Content is sacrosanct.** Never change what an idea says, and never cut a decision, number, ask, hedge, condition or anything the user asked for. These passes change how it is organised and worded, and what is repeated.

## 1. Cut — should it exist?

Top down: the whole thing, then each section, then each line. On an edit, only what changed. A part stays only if you can name what breaks without it.

- A part that restates a neighbour is cut whole or folded in, not trimmed.
- Bloat: a why the reader cannot act on; an example that repeats its rule; process narrated in a report; a finding that changes no decision; a picture and a paragraph carrying the same thing.
- **Hunt the repeated claim.** The same point made twice, in any wording or form (a headline, a table row, a caption and a section body each saying it) is bloat even when no two lines match. List every claim that appears more than once and keep the one place the reader acts on it.
- Content that belongs in another document is cut or linked.

## 2. Shape — is it in the right order?

Front-load: the conclusion, status or ask first; evidence under it, never leading. Move what is buried. Put setup before action in a how-to, and abstract before detail in an explanation. Keep what helps a human reader: diagrams, numbered steps, a side-by-side comparison, a short orienting overview. Never cut structure the reader needs to save words.

## 3. Clarify — minimal fixes to wording

Fix only what impedes comprehension, never preference. Smallest fix that works. Fix unclear or awkward wording and ambiguous references ("it", "this", "the above"). Use one word for one concept. Preserve intentional voice. Where unsure, flag it rather than change it. A link's display text is a meaningful label, never a backtick-wrapped path.

## 4. Debloat — compress losslessly

- Unpack nominalizations: "the review of the logs was performed by the engineer" becomes "the engineer reviewed the logs".
- Cut metadiscourse ("it is important to note that"); state the claim.
- Strip pleonasm and circumlocution ("due to the fact that" becomes "because").
- Flatten expletive openers ("There are three factors that affect X" becomes "Three factors affect X").
- Never strip a hedge, modal or scope condition ("may", "tends to", "under X conditions"). Never swap a plain word for jargon to save characters. Keep a function word whose removal makes the reader re-read. Vary sentence length.

## 5. Unslop

Read `skills/unslop/SKILL.md` and apply it to what remains.

## 6. Proofread

Spelling and typos; grammar; repeated phrasing ("It was interesting that X, and it was interesting that Y"); logical or factual errors; weak arguments worth strengthening; no empty or placeholder links.

## Output

Apply the fixes. Reply with what was cut or changed and why, one line each, and anything flagged for the user's call (an uncertain wording fix, a weak argument). If nothing needed doing, say so.
