---
date: '2026-10-20'
topic: 'home-pass-line'
status: 'superseded by handoff-2026-10-21-pass-card.md'
type: 'exploration (playground), feedback round'
---

# Handoff: home-pass-line — where the options stand, for a fresh feedback session

## Current Focus

The owner reviewed every option and has no pick yet; he isn't sure what the next step is. The next session runs a feedback round: walk him through the strip one option at a time, collect reactions, then agree the next step. Build nothing until he names it.

He expected round 2 to be a bigger redesign. 4A and 4B differ only by a 66×26 chip, which he couldn't see (see 4B below). The next session should be ready to offer bolder, whole-page moves, but only after asking.

Brief (owner, relaying Jonny, 2026-10-20): the Pass line halfway down Home should be stronger. It could move to the top or just be more visual. Selling the Pass matters, but it has to stay elegant, mobile-first and not too overt.

## Task(s)

The rig: `docs/specs/home-pass-line/playground/index.html`, launched from `playgrounds.html` → "A stronger Pass on Home". The strip at the bottom picks 0, 1, 1A, 1B, 2, 3, 4, 4A, 4B; **Why** shows each option's stance and cost; **Show** rings the Pass mention in pink.

Where each option stands with the owner (2026-10-20, notes only, nothing picked):
- **0 Today.** Baseline.
- **1 In the hero.** He likes the extra height it gives the video top right. It reads as text, text, text.
- **1A** (free line and Works with in one block under one rule, both at full measure). Cleaner. Works with was first left at 44ch; now both run full width.
- **1B** (the same block as two columns from 640px). The most interesting to him: it lengthens the picture a touch and fits the content. He wants **its own playground** on how What's free and Works with work best, possibly as a pattern used elsewhere. Not started.
- **2 A Pass card.** Nice, but the shape block reads as money-oriented, and it's one more card.
- **3 Straight after the hero.** Reaching the Pass sooner counts for it. Looks a bit wonky and reads as one more row.
- **4 Shown in the games.** Needs a bigger idea. Don't list every Pass game; Available games already shows a chosen set with Pass marks.
- **4A** (no Pass band; the Available games sentence carries the Pass mark as a key, then the Pass line). Interesting, needs tweaking. He asked for a few Pass games in the row so one or two land in the first four: done in 4A/4B only (`HPL_KEY_GAMES` in the module: Groups 2nd, hunter-gatherer 4th). The key's mark stays a plain chip, not a link; "the Pass" in the line is already the link.
- **4B** (4A plus a Pass mark on the hero picture, top right over the sun). He couldn't tell it from 4A. Two paths were offered and **no answer was given**: cut it, or rebuild it around the hero caption reading "A NEW CASE EVERY WEEK, WITH THE PASS" (new copy, unratified).

Not done: any check at phone width (Config → Viewport: Mobile). Every option has been looked at on desktop only.

## Critical References

- `docs/specs/home-pass-line/handoff-2026-10-20-home-pass-options.md`: the full build record: how each option is built, both rounds of owner notes, and the list of unratified calls.
- `docs/specs/1153-pass-upsell/handoff-2026-10-16-home-pass-line.md`: the ratified one-link rule ("the Pass" inside the line is the only link; no Get the Pass button).
- Design law: `/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/guidelines/visual-foundations.md`, `voice.md`, `layout-and-patterns.md`.

## Recent changes

- `docs/specs/home-pass-line/playground/pg-hpl-home.jsx`: options are keyed `0 1 '1A' '1B' 2 3 4 '4A' '4B'` in `HPL_OPTS`; new parts `HplMark`, `HplKey`, `HPL_KEY_GAMES`; `HplField` takes `mark`; `HplGames` takes `opt` and passes the CardRow `sub`.
- `docs/specs/home-pass-line/playground/index.html`: playground `<style>` block gained `.hpl-facts`, `.hpl-fact`, `.hpl-key`, `.hpl-mark`, `.hpl-mark-hero`.
- `app/`: nothing changed.
- `docs/specs/home-pass-line/playground-3/` (owner asked for it, 2026-10-20): the Pass card alone. Module `pg-hp3-home.jsx`: `HP3_OPTS` (drawing 1 to 3) and `HP3_PLACES` (1st, 2nd, 3rd), styles `.hp3-*`. The card is not a GameCard: it spans the row’s three lines, so the canon line (`cprPassLine`) fits in the picture’s height. Unratified: the heading, the price line and the See pricing label; a light card on the dark shop.
- `docs/specs/home-pass-line/playground-2/` (owner asked for it, 2026-10-20): new rig, options 1 to 4, mobile first. 1 is round 2’s 4A with a shorter key; 2 to 4 are new. Module `pg-hp2-home.jsx` (`HP2_OPTS`, Why holds stance and cost); styles are the `.hp2-*` block in its `index.html`. Unratified: the new key, chip and Pass-card copy; the band reshapes the DS Pass mark. A Pass game first on a phone was the owner’s passing thought, which he leaned against; not built.

## Learnings

- The preview's "52 files missing" warning for this rig is a false positive (`<base>` depth 4 matches the folder). It also stops the background verifier from forking, so verify the rig by loading it directly.
- The DS `CardRow` takes a `sub` sentence (`.mcp-crow-sub`) under its title; 4A uses it.
- The DS Pass mark has no standalone component; it is the class `.mcp-passmark`, positioned absolute by default. 4A/4B set it static.

## Artifacts

- `docs/specs/home-pass-line/playground/index.html`, `pg-hpl-home.jsx`
- `docs/specs/home-pass-line/handoff-2026-10-20-home-pass-options.md`
- `docs/specs/home-pass-line/handoff-2026-10-20-feedback-session.md` (this file)

## Action Items & Next Steps

1. Ask the owner what he wants from the session: a walk through the strip for reactions, or straight to a next step. One question at a time.
2. Get his answer on 4B: cut it, or rebuild it around the caption.
3. Ask whether the 1B playground should be a new rig in this ticket or more options in this strip, then build it.
4. Ask whether he wants bolder, whole-page alternatives (he expected them in round 2) before building any.
5. Check every surviving option at phone width before putting it forward as a pick.
6. After a pick is accepted in words, ask before anything goes into `app/gs-pass-home.jsx`. The ticket still needs a tracker id.

## Other Notes

- Drift (owner, 2026-10-20): the main build has moved on, and the product is now named **After Pixels**. The playground copies canon's hero and games band, so diff them against current `app/gs-pass-home.jsx` / `gs-home.jsx` before merging. The owner said not to act on this yet.
- The open, unratified calls (labels, price on Home, pay line dropped in 1/1A/1B/4A/4B, Pass mark as a key, the 4A/4B game order) are listed in the options handoff under Other Notes. None is decided.
- Feedback burst 1 (owner, 2026-10-20, notes only, nothing picked): 1A works and he likes it on desktop, but it fails at phone width: it reads as text, text, text, and might need adaptive styling. It also doesn't make the Pass pop, which was part of the point. 1B is fine but needs work on its content; at phone width it collapses to the same text-heavy layout. 4B: he expected a full redesign and didn't get one. 4A is interesting. He wants to go back to the original brief.
- Feedback on playground-2 (owner, 2026-10-20, notes only): 1's new key is bad; it lost the canon line's signal (what comes free with an account), and on a phone "Comes with the Pass" wraps under the mark, so it doesn't read as a sentence. 2 is interesting, but nothing links to the Pass until a chip is pressed, and it widens the set of games; maybe six games as three and three; probably not the right shape. 3 interests him most ("could be the thing"): it needs the copy back, a link to pricing at its foot, and to look less like another game. Where it sits is open, including first on a phone, as long as the next game still peeks in. 4 is a no; keep the DS Pass chip as it is. He asked for a new playground on 3.
- Feedback on playground-3 (owner, 2026-10-20): 1 and 3 (light cards) firmly rejected, removed from the strip. 2 is the only acceptable one. He expected See pricing as a text link (the button is all right). Losing the Pass heading and band feels like more loss than gain; he asked for three more. Built 4 (wide, heading and pay line back), 5 (held at the row start from 560px), 6 (short card plus the band back), and a Link / Button switch (link by default).
- Owner, 2026-10-20, later: 4, 5 and 6 rejected (no two-wide card; 5 and 6 add nothing). He wants round 2’s 3 back in the rig, 2 kept, and three new ideas on the same principle. On the rig as 1, 2, 7, 8, 9 (numbers not reused). Lesson: "I need 3 more" and "go back to the Jira board" (drawing board) were misread; ask when a reply is ambiguous.
- Owner, 2026-10-20, later still: disappointed nothing stayed close to 1; the goal is 1 made to pop a little while keeping its elegance. Built 10 to 12, each 1’s GameCard and mosaic with one or two changes.
- Owner, 2026-10-20, end of day: switching options must not scroll (fixed: only Show scrolls, and the row keeps its place). Not keen on the off-white edge as the way to pop; built 13 to 15 on 1 without it (cover-indigo fill, bigger picture, raised). Next session: he picks the best parts across 10 to 15 and we combine them.
- The owner gives feedback in bursts as he looks. Log each burst in the handoff as notes, never as a pick.
