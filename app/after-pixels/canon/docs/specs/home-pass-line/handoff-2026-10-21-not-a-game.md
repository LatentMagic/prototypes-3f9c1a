---
date: '2026-10-21'
topic: 'home-pass-line'
status: 'in-progress'
type: 'exploration (playground), round 5 built, unreviewed'
---

# Handoff: home-pass-line: the Pass card must read as not a game

## Current Focus

The owner reviews playground 5, which he hasn't seen yet. It asks two things he set (2026-10-21):
1. The Pass card stays a GameCard but must read clearly as not a game.
2. A line under "Available games", which a fixed card might make unnecessary. He still wants to see it.

Get his read on the five card treatments first. That answers whether a line is needed. One question at a time. Nothing is picked or ratified.

Also open, and not for this round: the card's copy (what's free, the price), and the pop at the end of the cover drawings.

## Owner on the cards (2026-10-21, later)

- 5: no. A game card can't grow taller than the others.
- 2: a nice attempt, no more.
- 3: "I love it". The lock was what the card needed. He doesn't mind 2, and a mix of 2 and 3 makes sense to him for the copy.
- At his request, 4 and 5 are gone and 4 is now **Label and lock**: card 2's label ("ONE PLAN, EVERY GAME") over card 3's lock and name. Nothing is picked. The lines (a to d) are next.
- The card now comes first in the row, for every card treatment (owner: on a phone the Pass isn't clear second). Replaces "always 2nd". He says it doesn't mean the concept is settled.

## Round 6 (2026-10-21, latest)

Owner on round 5: 3 is his favourite. The lines don't work; b to d's copy is poor. Card 3 says what the Pass gives but nothing says what's free. Unsure about link or button (the button pops more). Price is £3 a month or £30 a year ("£3.30" was £3 / £30). He asked for one playground that treats the copy whole (the card and whether a line is needed, the Free or Pass chip in a line included) and actions beyond his own ideas. Invariant: the card never grows the row.

Built: `playground-6/` (`pg-hp6-home.jsx`, key `pg_home-pass-line-6_v1`). Card 3 first. Copy 1 to 5 (`HP6_COPY`); action a to e (`HP6_ACTS`): price as the link, chevron, button on the picture, secondary or main full width. Why gives each a stance and a cost. The strip's meter says how much taller the Pass card is than the games.

Found: the DS TextLink's 44px touch area made the chip line 21px taller than the games, so See pricing grew the row in playgrounds 4 and 5 too. Playground 6 takes the excess back with a negative margin (`.hp6-card .mcp-gcard-tags > .mcp-lnk`). The full-width buttons (d, e) add 21px; that's what the meter shows. No copy adds height at desktop width. Not checked at phone width. All copy is mine and unratified.

Owner on the actions (2026-10-21): likes b (chevron, whole card) and d (secondary, full width). Nothing picked. Open: d makes the row 21px taller, which breaks his invariant.

## Round 7 (2026-10-21)

Owner: action b. Copy is off; two messages to explore, the Pass gets you every game and what's free. Bring back the original (Home's line today) and the reword ("Every game, every edition." + price); confirmed. No "two daily puzzles" in new takes. Built `playground-7/` (`pg-hp7-home.jsx`, key `pg_home-pass-line-7_v1`): copy 1 to 6. All new copy is mine and unratified.

## Task(s)

Rig: `docs/specs/home-pass-line/playground-5/index.html`, reached from `playgrounds.html` → "A stronger Pass on Home" → "The Pass card, not a game". The strip has three controls:
- **Card 1 to 5:** 1 as it is (round 4's A); 2 a small-caps label "ONE PLAN, EVERY GAME" over the name; 3 the lock before the name; 4 a sentence for a name, "Play every game with the Pass"; 5 "Free" and "With the Pass" lines in the text.
- **Line a to d:** a none; b "Some games start free. Every game comes with the Pass."; c "Games marked [Pass mark] come with the Pass." with the design system's Pass mark set in the text; d as b with "the Pass" linked.
- **Link / Button** for See pricing.

The card is always 2nd in the row (owner, 2026-10-21). The mosaic picture stays as it is (owner). The card's text is round 4's A ("Every game, every edition. £3 a month or £30 a year.") except in cards 4 and 5. All copy is mine and unratified. Not checked at phone width.

What the owner said today, in order:
- **On playground 3:** 15's lift looks odd and its top edge is missing. 14 is a no in every way. 13's colour is wrong. 12 is a no. 11 is a no (price chips, the Pass mark on the card). 10 stays his favourite, possibly without the edge. He said the card's internals and the price were never really worked on.
- **On playground 4:** inverted is out ("I was wrong"). Even with a line under the row, the card reads as a game called The Pass. A doesn't say what's free. He isn't sure he likes "two daily puzzles" from the ratified Home line, and leans towards something generic like "select games for free" (not decided). B's line under the row "doesn't feel right", so he couldn't judge its copy. An earlier idea was the Pass chip set right against the row, with no padding.
- **Price:** he said "it needs to say £3.30 a month. I'm not sure." Unresolved. Ask what he meant before any price copy.

## Critical References

- Design law: `/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/guidelines/voice.md` (selling copy: plain words, lead with what you get; one "Pass" per line; a link names what's behind it), `visual-foundations.md`, `layout-and-patterns.md`.
- `docs/specs/1153-pass-upsell/handoff-2026-10-16-home-pass-line.md`: the ratified Home Pass line and its one-link rule.
- Canon: `app/gs-pass-home.jsx` (Home, `CprCard`), `app/gs-pass-store.jsx` (`cprPassLine`, `CPR_STAGE`, `CPR_SHOWN`), `app/gs-billing.jsx:14` (`GS_PLAN`).

## Earlier handoffs

- `docs/specs/home-pass-line/handoff-2026-10-21-pass-card.md`: playground 3's options 1, 2, 7 to 15 and the owner's notes on them; its Round 4 and Round 5 sections are superseded by this file.
- `docs/specs/home-pass-line/handoff-2026-10-20-feedback-session.md`: every feedback burst from 2026-10-20.
- `docs/specs/home-pass-line/handoff-2026-10-20-home-pass-options.md`: rounds 1 and 2, the build record and open calls.

## Recent changes

- Playground 3: `index.html` 14's mosaic is now `.mcp-gcard .hp2-mosaic.is-12 { aspect-ratio: 3 / 1 }`, so no covers are cut off. `pg-hp3-home.jsx` `HP3_OPTS` puts 9 after 8.
- Playground 4 (new): `docs/specs/home-pass-line/playground-4/`. Copy pairings A to E, Dark or Inverted, Link or Button. Superseded by 5 and kept for reference.
- Playground 5 (new): `docs/specs/home-pass-line/playground-5/pg-hp5-home.jsx` (`HP5_CARDS`, `HP5_LINES`, `Hp5Card`, `Hp5Home`, store key `pg_home-pass-line-5_v1`). Its `index.html` is playground 4's, with the round 5 styles at the end of the last `<style>`: `.hp5-*` and `.mcp-passmark.hp5-inmark`.
- Fixes carried in playgrounds 4 and 5 only, in the "Round 4" CSS block:
  - `.gs-host .mcp-lnk, .gs-host .mcp-btn { position: relative; z-index: 2 }`. The title's stretched hit area (`.gs-host .gs-titlebtn::after`) covered the card's link or button, so it never got its own hover or press.
  - The Chain cover's `.ga-ch-o` border width is capped at `9u`. Uncapped, `1.5px + on × 9u` grew the empty squares past their slot on hover.
- `playgrounds.json`: entries for playgrounds 4 and 5; the ticket was touched 2026-10-21.
- `app/`: nothing changed.

## Learnings

- Playgrounds 4 and 5 load at `<base>` depth 4, so the "52 files missing" warning is a false positive. Load the rig and look; the verifier won't fork for it.
- Both bugs above are also in canon: `index.html` (`.ga-ch-o`) and the card link stacking in `app/` card styles. **Ask the owner before fixing them in canon** (asked once at the end of round 4; no answer yet).
- The owner now sees a pop at the end of the drawing on every cover, not only Chain. The cause isn't found. Suspect the stagger: `transition-delay: calc(var(--s) * 1ms)` applies on hover in but not on hover out (`components.css:261-263`), or pieces whose transform finishes after the border. Check with frame captures before changing anything; it is design-system motion.
- The owner's messages arrive dictated and sometimes cut off mid-sentence. When the ending changes the meaning, ask.

## Artifacts

- `docs/specs/home-pass-line/playground-5/index.html`, `pg-hp5-home.jsx` (current)
- `docs/specs/home-pass-line/playground-4/index.html`, `pg-hp4-home.jsx`
- `docs/specs/home-pass-line/playground-3/index.html`, `pg-hp3-home.jsx`
- `docs/specs/home-pass-line/handoff-2026-10-21-not-a-game.md` (this file)

## Action Items & Next Steps

1. Ask the owner which card treatment (1 to 5) reads as not a game, then whether he still wants a line under the row, and which one. One question per turn.
2. Ask what "£3.30 a month" meant before writing any price copy.
3. Then ideate the card's copy: what's free, written generically, and the price. Keep the mosaic.
4. Find the cover pop (see Learnings). Ask before fixing it or the two bugs in canon.
5. Check the chosen card at phone width yourself.
6. Carried from earlier: diff the playground's hero and band against canon before anything moves into `app/gs-pass-home.jsx`; the ticket needs a tracker id; 4B and the What's free / Works with block are still parked.

## Other Notes

- He has repeatedly said the agent "thinks thinly" here. Each option has to be a real idea about the card's insides, not a surface tweak.
- Never answer an ambiguous reply with a build. Inverted, the off-white edge, lift (15), the cover colour fill (13), price chips and the Pass mark on the card (11) are all rejected; don't bring them back.
- `README.md` in this folder is stale (it names round 1 only). Update it on the next change that touches the folder.
