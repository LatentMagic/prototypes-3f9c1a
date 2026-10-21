---
date: '2026-10-21'
topic: 'home-pass-line'
status: 'in-progress'
type: 'exploration (playground), combine round'
---

# Handoff: home-pass-line: the Pass as a card in Available games

## Current Focus

The owner reviews 10 to 15 in playground 3. From those, and from 1 and 2, he picks the best parts to combine into one card. Ask which parts, one question at a time. Build the combination only once he has named its parts. Nothing is picked or ratified yet.

**The goal, in the owner's words, restated:** take round 2's option 3 (playground 3's **1**, the Pass as a card the size of a game with a grid of Pass covers as its picture), make it pop a little more, and keep its elegance. Stay close to 1. Every drift from 1 this session cost his trust.

Brief (owner, relaying Jonny, 2026-10-20): the Pass line halfway down Home should be stronger. It could move to the top or just be more visual. Selling the Pass matters, but it has to stay elegant, mobile-first and not too overt.

## Round 5 (2026-10-21, later)

Owner on round 4: inverted is out. The card still reads as a game, even with a line under the row. A's copy doesn't say what's free; he's unsure about "two daily puzzles" and leans towards something like "select games for free" (not decided). In B the line under the row reads wrong; a Pass chip set in the line was one earlier idea. The pop at the end of the cover drawings is on every card, not only Chain. Still open.

His two asks, as a new playground: (1) the card stays a GameCard but must read as not a game; (2) ideate a line under "Available games", which fixing the card might make unnecessary.

Built: `docs/specs/home-pass-line/playground-5/` (`pg-hp5-home.jsx`, key `pg_home-pass-line-5_v1`). Card 1 to 5 (as is, a label over the name, the lock in the name, a sentence for a name, Free and Pass side by side) times line a to d (none, plain, with the Pass mark set in the text, with "the Pass" linked), plus Link or Button. All the copy is mine.

## Round 4 (2026-10-21, later)

The owner reviewed playground 3. His notes: 15's lift looks odd and its outline is missing at the top. 14 is a no in every way. 13's colour is wrong; an inverted card might be the way. 12 is a no. 11 is a no (price chips, the Pass mark on the card). 10 is still his favourite, maybe without the outline. The card's internals and the price were never properly worked on. He thinks a line under "Available games" may be what's missing.

Agreed shape (owner, 2026-10-21): a new playground. The mosaic stays. The options are copy pairings: the line under the row plus the card's text, price and link. Dark or inverted is a switch. Link or button stays a switch. The card is always 2nd.

Built: `docs/specs/home-pass-line/playground-4/` (`pg-hp4-home.jsx`, key `pg_home-pass-line-4_v1`), pairings A to E. All the copy is mine, not ratified. E's £2.50 a month is £30 / 12 from `GS_PLAN`. The owner said "£3.30 a month" and wasn't sure, so the price question is still open.

Fixed in playground 4 only:
- The card's link and button sat under the title's stretched hit area (`.gs-host .gs-titlebtn::after`), so they never got their own hover. They now sit above it.
- Chain's cover: an empty word's border could grow past half the word's width (`1.5px + on × 9u`), so the square swelled beyond its slot on hover. That's the pop, worst on small tiles. It's now capped at 9u.
- Both bugs are in canon too (`index.html`, `app/` cards). Ask before fixing them there.

## Task(s)

The rig: `docs/specs/home-pass-line/playground-3/index.html`, reached from `playgrounds.html` → "A stronger Pass on Home" → "The Pass card". The strip at the bottom holds four controls:
- the option: 1, 2, 7 to 15
- the card's place in the row: 1st, 2nd or 3rd
- See pricing as a Link (the default) or a Button
- Why / Show / Hide

Switching an option or a place doesn't scroll the page or the row. Only Show scrolls.

Where each option stands (owner, 2026-10-20, notes only):
- **1** round 2's 3 as built (`Hp3Mosaic`). This is the base. Known issues: it reads as another game, it has no Pass line and no link to pricing.
- **2** edged card (`Hp3Edged`): the only one of 1 to 3 he could accept. He doesn't like the off-white edge as the way to pop.
- **7 to 9** (stack, cycling cover, Pass run): further from 1 than he wanted. No verdict given.
- **10** 1 plus the edge, with See pricing as its last line (`Hp3Ten`).
- **11** covers light up in turn, the Pass mark on the picture, the prices as tags (`Hp3Eleven`).
- **12** ruled covers, the canon Pass line, the price and the link (`Hp3Twelve`).
- **13** filled in cover indigo `#1D1B3A` (`Hp3Thirteen`). The design system keeps colour to covers and status, so this breaks it; say so.
- **14** 12 covers run to the card's edges (`Hp3Fourteen`).
- **15** raised: the pop-up surface, a deeper shadow, lifted 6px (`Hp3Fifteen`). This can read as hovered or picked.
- He reviewed 10 to 12 only in part; 13 to 15 are unreviewed.

Rejected, gone from the strip: the light cards (old 1 and 3), 4 (two games wide), 5 (held at the start), 6 (short card plus the band back). Option numbers are never reused.

Not checked: 10 to 15 at phone width. 7 to 9 and 1 at 1st place were checked on a phone (the next card peeks in).

## Critical References

- `docs/specs/home-pass-line/handoff-2026-10-20-feedback-session.md`: every feedback burst from 2026-10-20, in order (Other Notes).
- `docs/specs/1153-pass-upsell/handoff-2026-10-16-home-pass-line.md`: the ratified one-link rule for Home's Pass line.
- Design law: `/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/guidelines/visual-foundations.md`, `voice.md`, `layout-and-patterns.md`.
- Canon: `app/gs-pass-home.jsx` (Home), `app/gs-pass-store.jsx` (`cprPassLine`, `CPR_STAGE`, `CPR_SHOWN`).

## Recent changes

- `docs/specs/home-pass-line/playground-3/pg-hp3-home.jsx`: `HP3_OPTS` (stance and cost per option), one component per option (`Hp3Mosaic`, `Hp3Edged`, `Hp3Stack`, `Hp3Cycle`, `Hp3Lead`/`Hp3RunCard`, `Hp3Ten` to `Hp3Fifteen`), mapped in `Hp3Home`; the store `hp3Store` (key `pg_home-pass-line-3_v1`: opt, at, cta).
- `docs/specs/home-pass-line/playground-3/index.html`: the `.hp3-*` / `.hp2-mosaic` styles at the end of the playground `<style>` block.
- `docs/specs/home-pass-line/playground-2/`: round 2's rig (options 1 to 4), superseded by playground 3 and kept for reference.
- `playgrounds.json`: entries for playground-2 and playground-3.
- `app/`: nothing changed.

## Learnings

- The preview's "52 files missing" warning for these rigs is a false positive (`<base>` depth 4 is right). It also stops the background verifier from forking, so load the rig and look at it directly.
- Phone-width checks: set Config → Viewport: Mobile, then scroll the phone frame's scrolling element, not the window.
- A remount `key` on `DS.CardRow` resets the row's scroll. Don't key it on the option.
- Misreads this session: "Jira board" meant drawing board. "I need 3 more" meant three more variations of the option in hand, not new shapes. When a reply is ambiguous, ask; never answer one with a build.

## Artifacts

- `docs/specs/home-pass-line/playground-3/index.html`, `pg-hp3-home.jsx`
- `docs/specs/home-pass-line/playground-2/index.html`, `pg-hp2-home.jsx`
- `docs/specs/home-pass-line/handoff-2026-10-21-pass-card.md` (this file)

## Earlier handoffs

- `docs/specs/home-pass-line/handoff-2026-10-20-feedback-session.md`
- `docs/specs/home-pass-line/handoff-2026-10-20-home-pass-options.md`

## Action Items & Next Steps

1. Ask the owner to look through 10 to 15 (13 to 15 are unseen), then ask which parts to take from each. One question at a time.
2. Build the combination as a new option (16) on the same strip, close to 1. Check it at phone width yourself, at 1st and 2nd place.
3. Open, unratified: the card's copy (title "The Pass", "Every game, every edition.", price line, See pricing), whether it carries the canon Pass line, its place in the row, link or button, whether the Pass band leaves Home.
4. After a pick is accepted in words, ask before anything goes into `app/gs-pass-home.jsx`. Diff the playground's hero and band against current canon first (drift noted 2026-10-20). The ticket still needs a tracker id.
5. Still parked from round 2: 4B's fate and a playground on 1B's What's free / Works with block.

## Other Notes

- 13's indigo is a cover colour set on a card. The design law keeps colour to covers and status, so raise that if he likes 13.
- `uploads/` holds a large backlog of earlier screenshots from other tickets. None landed this session, so none were cleared.
