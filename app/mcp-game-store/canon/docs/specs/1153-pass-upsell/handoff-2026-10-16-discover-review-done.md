---
date: '2026-10-16'
ticket: '1153'
topic: 'discover-review-done'
status: 'in-progress'
type: 'review'
---

# Handoff: 1153, the owner's Discover review in the ratified candidate

## Current Focus

Discover's open questions in `candidate/pass-upsell-ratified.html` are closed. The next move is the owner's to make: **accept the candidate in words** (then archive and merge), or name what's still wrong. Don't put new questions to him. He said "no more dumb questions" and asked not to face long queues. If he ratified something, it stays ratified. Only ask when a choice he can see is genuinely his to make, and then ask one question.

One thing is still unresolved from this session. The owner said his earlier Discover feedback "wasn't incorporated". The record holds three items, and all three are now dealt with (below). If he raises it again, ask what's missing. Don't guess.

## Task(s)

Done this session, all in the candidate only:
- **Play any time** row removed. The builder had added it and its title without the owner, and the owner called it redundant.
- **Free to play** lists every game with free play, picks included. It now repeats Escape, Delve and the Barrow from Just added. The owner ratified the repeat.
- **All games** tiles carry the Pass pill (`CprTile`), as the owner asked.
- **Discover doesn't sell the Pass** (owner, ratified). Only a game's product page and its Library page do. The Pass line and its rule are removed from Discover. This replaces his earlier proposal to copy Home's paragraph onto Discover.
- **Search and filters as History's**: ratified as built.
- **Word game pick label "A NEW WORD EVERY DAY"**: ratified. The owner calls these "game pick cards".
- **Daily Groups restored** as a free daily game (owner). It now shows on Discover, in Library and on its product page.

Planned, only after the owner accepts in words: archive `discover-tidied` and `discover-games-hub` per `skills/candidate-build`, merge, then ask about a `CHANGELOG.md` entry.

## Critical References

- `docs/specs/1153-pass-upsell/handoff-2026-10-16-pass-upsell-ratified-candidate.md`: the build handoff. Its last sections ("Owner's review of Discover", "What still needs the owner", "Daily Groups restored") record everything above, dated and attributed.
- `docs/specs/1153-pass-upsell/decisions-2026-10-16-pass-upsell.md`: the earlier ratified rules. It isn't updated with today's Discover decisions; the build handoff holds them.
- `CLAUDE.md` § Ratification, § Replying in chat.

## Recent changes

- `candidate/cand-pass-upsell-ratified-discover.jsx`: `cprSelection` returns `{ added, free }`. `free` is every non-Pass game (no dedupe), the `solo` row is gone, there's no `CprPassPara` block, and the new `CprTile` is canon's `GsTile` with `CprArt` (the pill).
- `candidate/cand-pass-upsell-ratified-store.jsx`: `CPR_STAGE` gains `groups: 'daily'`. `cprBoxCopy` returns `null` for groups, so its play box keeps canon's copy.
- `candidate/cand-pass-upsell-ratified-aids.jsx`: the QA note for Discover is updated.
- `candidate/pass-upsell-ratified.html`: the unused `.cpr-passline` CSS is removed.
- The build handoff gained the sections listed above. `handoff-2026-10-16-ratified-candidate-questions.md` has a status line: all answered.

## Learnings

- The "each game shows once" rule has no source. It first appears, unsourced, in the Discover, tidied build (15 Oct). The 16 Oct brief then reused it as its reading of "relevant selection". It stripped Daily Word out of Free to play, and the owner read that as Word being deleted. **An agent's reading passed from brief to brief becomes a rule nobody ratified.** Check a rule's source before building on it.
- "Daily Groups is not shown" also came from a brief, not the owner. The owner wanted it all along.
- Adding Groups as `daily` makes Home's data-driven Pass paragraph read "Three daily puzzles…". That's the ratified mechanism working as designed, not a copy change.
- The preview's 52 "referenced file not found" warnings on the entry are the `<base>` false positive (depth four). The page renders.

## Artifacts

- `docs/specs/1153-pass-upsell/candidate/pass-upsell-ratified.html` and its `cand-pass-upsell-ratified-*.jsx` files (Discover, store, aids changed)
- `docs/specs/1153-pass-upsell/handoff-2026-10-16-pass-upsell-ratified-candidate.md` (updated)
- This file

## Action Items & Next Steps

1. Wait for the owner to accept the candidate or name a defect. Don't open a question queue.
2. On acceptance: archive the two Discover candidates, merge (`skills/candidate-build` § Merging), carry today's Discover decisions and the Groups restoration into `app/`, then ask about `CHANGELOG.md`.
3. Merge-time items, the builder's to handle (listed in the build handoff § Needs the owner's decision about `app/`): `GS_SOON` chapter 3, the hero comment, `DcBody` going into `gs-discover.jsx`, the design-system lock slot on `GameCard`, `GamePick` **and `GameTile`**, and the per-edition played flag.
4. Still unwritten: the Daily Groups play box wording (the pattern gives "A new groups every day"). Raise it only if the owner looks at that box.
5. `README.md` in this folder still points at `handoff-2026-10-16-pass-upsell-review.md`. Point it at the build handoff and this file.

## Other Notes

- The owner is tired of process. Keep replies short, tell him where to look, and don't make him decide between near-equivalent options.
- Leftover builder calls, such as the finished-game link on Escape and Delve, Library's missing Played filter and Home's pay line, follow from ratified rules. Don't put them to the owner one by one.
