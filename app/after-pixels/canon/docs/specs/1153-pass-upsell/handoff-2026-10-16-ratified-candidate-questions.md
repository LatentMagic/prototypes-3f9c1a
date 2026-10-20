---
date: '2026-10-16'
ticket: '1153'
topic: 'ratified-candidate-questions'
status: 'in-progress'
type: 'review'
---

# Handoff: 1153, the ratified candidate's open questions

## Status, 2026-10-16

All three questions are answered. See the build handoff, § Owner's review of Discover. Next come the queued items below.

## Current Focus

The owner has the new candidate build (`candidate/pass-upsell-ratified.html`) and will answer its open questions in the next session, **one at a time**. Ask the first question only, following CLAUDE.md "never ask cold". Each answer is ratified only in the owner's words. Record it in the build handoff and change nothing next to it.

The questions, in order:

1. **What "relevant selection" means on Discover.** The owner said "update the actual selection to be relevant" and nothing more. My reading: no game shows twice above All games, games with editions and standalones kept apart, no "this week". Built as: picks Casebook and Daily Word → Just added (the Barrow, Delve, Escape) → Free to play (Daily Mystery; not shown with the Pass) → **Play any time** (36,000 Summers Ago; I wrote this title). Where to look: pill → States → 9. Discover, free account. This was asked in chat on 2026-10-16 and not yet answered. Ask it again first.
2. **Discover's search and filters work like History's.** One search field and a Filters panel (Genre, Schedule), with Clear all when nothing matches. The tidied build's open chips and its Free chip are gone. The owner proposed this, but the build isn't ratified.
3. **Discover's Pass line is Home's paragraph**, built from the same data, "the Pass" its only link. It sits above All games and is gone with the Pass. The owner proposed this, but the build isn't ratified.

After those, queued in this order: the open items in the build handoff's "From the tidied build, still unratified", then "Calls I made without the owner", then "Still open from the review".

## Task(s)

- Done: built the candidate from `handoff-2026-10-16-ratified-candidate.md` and `decisions-2026-10-16-pass-upsell.md`, and brought Discover, tidied up to date.
- In progress: the owner's review of the questions above.
- Planned, only once the owner accepts in words: archive both Discover candidates, then merge (`skills/candidate-build`).

## Critical References

- `docs/specs/1153-pass-upsell/handoff-2026-10-16-pass-upsell-ratified-candidate.md`: the build's own handoff. It has clicks to every surface, ratified versus proposed, my unratified calls, and the merge notes for `app/`.
- `docs/specs/1153-pass-upsell/decisions-2026-10-16-pass-upsell.md`: what the owner ratified.
- `CLAUDE.md` § Ratification and § Replying in chat: one question per turn, the ask on the last line.

## Recent changes

- New: `candidate/pass-upsell-ratified.html` (the entry, storage key `kit_1153_pass-upsell-ratified`, candidate CSS at the end of `<head>`).
- New: `candidate/cand-pass-upsell-ratified-{bridge,store,home,game,pass,library,discover,aids}.jsx`.
- `playgrounds.json`: a 1153 entry with `"kind": "candidate"`, listed first; `touched` set to 2026-10-16.
- Nothing in `app/`, `_ds/`, the playground or the two Discover candidates changed.

## Learnings

- Discover's body (`DcBody`) is file-scoped in `app/gs-discover.jsx`, so the candidate copies canon's page shell in `cand-pass-upsell-ratified-discover.jsx`. On merge, the change goes into `gs-discover.jsx`.
- The preview's "referenced file not found" warning on the entry is the `<base>` false positive. The depth is four `../`. The page loaded with its title, the Pass pill and the Pass paragraph, checked in the user's view.
- The seed has no played flag per edition. New for you reads whether a game was played at all; Config → New editions → Most not played shows it full.

## Artifacts

- `docs/specs/1153-pass-upsell/candidate/pass-upsell-ratified.html` and its eight `cand-pass-upsell-ratified-*.jsx` files.
- `docs/specs/1153-pass-upsell/handoff-2026-10-16-pass-upsell-ratified-candidate.md`.
- This file.

## Action Items & Next Steps

1. Ask question 1 alone: where it is (state 9), what is there, why ("my reading of a short instruction"), then the question.
2. Apply each answer to the candidate only. Record it, dated and naming the owner, in the build handoff.
3. Move to the next question only after the owner answers.
4. Update `README.md` in this folder to point at the ratified candidate as the latest. It still names `handoff-2026-10-16-pass-upsell-review.md`. I haven't asked about this yet.
5. Once the owner accepts the candidate in words: archive, merge, then ask about a `CHANGELOG.md` entry.

## Other Notes

- The verifier hadn't reported back when this was written. Check the candidate loads before the first question.
- Don't build ahead of answers or carry one "OK" over to the next item.
