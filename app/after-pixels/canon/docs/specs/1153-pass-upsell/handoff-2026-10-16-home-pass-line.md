---
date: '2026-10-16'
ticket: '1153'
topic: 'home-pass-line'
status: 'in-review'
type: 'playground change'
---

# Handoff: 1153 Home's Pass section, one more wording (A1)

One choice added to A1 in the playground. Nothing else changed. Nothing is accepted.

## How to reach it

1. Open `playgrounds.html` → **How the site mentions the Pass** → the playground (`docs/specs/1153-pass-upsell/playground/index.html`).
2. In the rail, section **A. Home**, item **A1**. Choice **1, "Two daily puzzles…", from the game data** is first and selected by default.
3. Press **Show it in the app**. Home opens signed out and the Pass section is ringed.
4. Under A1, the **Free dailies** switch: **Stage a third** changes "Two" to "Three"; **Two, as staged** changes it back.

## Where the line is built from

- `pguPassLine(v)` in `playground/pg-upsell-store.jsx` reads the playground's staging, `PGU_STAGE`:
  - the number of free dailies is the count of games staged `daily` (Daily Word and Daily Mystery), spelled out One to Ten, digits after that;
  - "the start of select games" appears while any game is staged `first`;
  - the verb follows: "comes" for one thing, "come" for more.
- The switch (`A1daily`) adds Daily Groups as `daily` to a copy of the staging used by this line only. No other surface reads it, and Groups still isn't shown anywhere on the page.
- `PguPassBand` in `playground/pg-upsell-home.jsx` renders it as one paragraph: the first sentence, then "Everything else comes with the Pass." running on after it and wrapping only where the width runs out, with "the Pass" as the link (owner, 2026-10-16).
- The pay line under it (A2 design 1) now sits 32px baseline to baseline from the line above, the same step as the two body lines (owner, 2026-10-16). This applies to every A1 choice.

## Owner's read so far

- 2026-10-16: **G dropped by the owner.** There is no one-click install in this product; players connect through the plugin, as the main build's How it works page already does (one Connect card each for Claude and ChatGPT, `app/gs-connect.jsx`). G and Glead are not carried forward; the main build's page stays as it is. The playground's G section is left in place, unused.

- 2026-10-16: **F1, ratified by the owner:** every signed-in player, free or Pass, lands on Library. F2: the owner likes the "Not played yet" group and design 2 (tiles); the heading's wording needs more ideas. At his request the tiles are now one row that swipes sideways (the design system's CardRow, Previous and Next once it overflows), and F2 has a staging switch, **Unplayed games → Most not played**, that treats every game but Daily Word as unplayed so a full row shows (5 for a free player, 6 with the Pass). Not decided.
- 2026-10-16: F2, the owner's rule to try: the row is for games with editions (daily, weekly, chapters) and shows those whose current edition you haven't played; standalones (36,000 Summers Ago) never go in it and stay in the list. Built for designs 1 and 2. Limit: "As staged" reads whether a game was played at all, because the seed has no per-edition played flag for every game; "Most not played" shows the rule fully. Heading wording: **"New for you"** (owner's pick, 2026-10-16), replacing "Not played yet" in designs 1 and 2. The Played filter keeps its own option name. **F2, owner, 2026-10-16: design 2 with "New for you" feels good; taken forward.**
- 2026-10-16: **A5, ratified by the owner:** a data fix. In the prototype chapter 2 of the Barrow is out, so the coming-soon card and the Barrow's lines say chapter 3. Canon still says chapter 2 (`app/gs-data.jsx` GS_SOON, `app/gs-barrow-library.jsx`); that is the mistake to fix on integration. Label: design 1, "CHAPTER 3", the main build's shape with the number moved on (my reading of "just show that Chapter 3 is coming"; say if a fuller label was meant).
- 2026-10-16: **E, owner's pick: design 1** ("You stopped here. Everything you earned is still yours." with the link "Get the Pass again"), **shown on every visit**. A5 was skipped in the A pass; the owner will go back to it.

- 2026-10-16: audit of D to G against today's calls (the Pass named once, "the Pass" linked inside the line, no separate Pass button or link beside it, no purchases line, nothing added beyond the brief). D1 and D3: all three designs put a separate Get the Pass (a button, a link, or an inline "Get the Pass") beside "…comes with the Pass." None links "the Pass" in the line. E: the line and a separate link ("Get the Pass again" and so on), so the same pattern question. D2, F1, F2, F2link and G: nothing found. No purchases line anywhere in D to G. Owner approved adding design 4 to D1 and D3: Share and the record link as they are, then D2's line with only "the Pass" linked, no button. Built. Not decided.
- 2026-10-16: D2, the owner found "This week's case…" true only until the next case is out, and "Every other case…" heavy-handed. He picked "Keep playing with the Pass." because it fits every game. Added as D2 design 4. Owner: D2 is settled by that pick and skipped in review; D1 design 4 with D2 design 4 is the shape he's taken forward.
- 2026-10-16: D3, the owner takes design 4. **Ratified:** the Barrow's "Chapter 3: coming soon" line shows only for Pass holders; a free or Pass-ended player's chapter-1 card ends on "Keep playing with the Pass." A5's Home card is unchanged, and A5's "Show the Library line" now opens as a Pass holder.
- 2026-10-16: F2link, the brief asked for one word covering daily and weekly games; it hadn't been explored. No such word exists in the product (the Library filter is Schedule: Daily, Weekly). The owner chose to try "See what's out for you to play". Added as F2link design 4. Not decided. **Owner, 2026-10-16: F2link is design 4, "See what's out for you to play".** It opens Library as it is (the New for you row on top), not a filtered list, so it is never empty.

- 2026-10-16: C, the owner found C1 to C3 off brief: C was meant to add the Pass line, but they replace the Library with a new card, rewrite every row's text, add Play buttons and drop search and filters. Added C4 at his request, "The usual Library, one line": the Library as it is, with "Everything else comes with the Pass." under the list, "the Pass" linked as in A1, no buttons. Shows only for a free account that has played nothing. **Ratified by the owner, 2026-10-16: C is C4.** The Account page item in C (Cacct) is set aside at his word ("ignore the other thing in there"); nothing changed there.

- 2026-10-16: the owner finished reviewing section B. **Picks: B1 design 2, B2 design 4, B3 design 4** (owner: "capture what I've already said"). B2 and B3 design 4 copy is mine, accepted as part of those picks.

- 2026-10-16: the pay line ("Purchases only ever happen on this site; your AI will never ask you to pay.") belongs on the Pass page, the owner says, placed quietly; he wasn't sure where. Built as a new playground section **H. The Pass page** (`playground/pg-upsell-pass.jsx`, re-publishing `GsPass` and `GsSubscribe`) with three choices: 1 under the price and Choose a plan, right-aligned with them; 2 under Get the Pass on Start your Pass; 3 a row at the end of What you get, "Your AI never asks you to pay" with "Purchases only ever happen on this site." under it, ticked for both (row name is my wording, not ratified). Clicks: rail → H → pick a choice → Show it in the app. Not decided. Correction, same day: choice 2 took the owner to the subscribe route (Start your Pass), which isn't Pricing. H now always opens Pricing; choice 2 is marked as off-brief and is the owner's to cut or replace.
- 2026-10-16: **H decided by the owner: choice 1**, the pay line under the price and Choose a plan, with adaptive alignment: right-aligned while the button sits beside the price, left-aligned wherever Choose a plan is full width (container under 640px, the same switch as `.gs-pass-foot`). Built.
- 2026-10-16: B3 (Pass-only play box) was missing a version in line with the session. Added design 4, "WITH THE PASS, short line": label WITH THE PASS, line "36,000 Summers Ago comes with the Pass.", no pay line, "the Pass" linked in the line as in B2 design 4 (corrected after the owner pointed out it didn't match B2). Play a free game cut from design 4 (owner, 2026-10-16). My copy, not ratified.

- 2026-10-16: choice 1 is the owner's favourite of A1's five choices so far. Logged as a preference, not a decision; A1 isn't settled.
- 2026-10-16: on A2, the owner said "we don't need A2. Too many HRs." He said it isn't an instruction to delete A2. Clarified: A2's design 1 (the muted line under the link) is already what A1 shows, and he doesn't want A2. Nothing changed.
- 2026-10-16: A6 (Home hero), decided by the owner: keep it as it is today (choice 1: Casebook, A NEW CASE EVERY WEEK). The other three choices are not taken. Delve is an agreed game and Casebook isn't, but the hero isn't redesigned until the games are chosen. **To do when 1153 lands in `app/`:** a code comment on the hero in `app/gs-home.jsx` saying Casebook there isn't decided, and that the element's pattern (one game's art, its schedule caption, a sample chat) stands whichever game it shows.
- 2026-10-16: B1 (a free daily's play box), the owner likes design 2, "Same label, short line" ("Free with an account. A new word every day."), because it takes the least space. Logged as a preference; B1 isn't settled.
- 2026-10-16: B2 (a free first part's play box), the owner found B2 at odds with his B1 pick and asked for a version as short as B1 design 2. Added as B2 design 4, "THE FIRST CASE, short line": label THE FIRST CASE (the Barrow: CHAPTER 1), line "Free with an account. Every other case comes with the Pass." The copy is mine and not yet ratified.
- 2026-10-16: B2, owner: the purchases line comes out of the play box, because the box is about playing the game. Done for free-first-part boxes (all B2 designs) in the playground; B3's Pass-only box still has it. In design 4, "the Pass" in "Every other case comes with the Pass." is now the link to the Pass page, and the separate Get the Pass link is dropped from that design so the box doesn't link to the Pass twice (my call, not yet ratified).
- 2026-10-16: A4, the owner likes design 2 (the Pass pill) and asked for it top right, so it stands out from the left-aligned title and text. Moved in the playground only (`.pgu-lock.is-chip`); both Discover candidates still have it top left. After seeing it: "I love it." Logged as a preference; A4 isn't settled.

## Calls made without the owner's ruling

- **No "About the Pass" link under choice 1.** The brief defines the choice as the line with one link, and the owner objected to two links to the same page. Choices 2 to 5 keep the link as before. Ratified by the owner, 2026-10-16.
- **Saved picks reset once.** Inserting a choice first moves the old choices down one number. A saved A1 pick from before would have pointed at the wrong choice, so it is dropped once (`A1rev`) and A1 opens on the new choice. No other saved setting is touched.

## What the line can't express

- **Nothing free at all:** the first sentence drops out and the line reads "Everything comes with the Pass."
- **Free dailies but no free first parts:** "Two daily puzzles come with your account."
- **A free first part but no free daily:** "The start of select games comes with your account."
- **Kinds of free play it can't name:** a whole game made free (Escape in canon) or a free medium game. A game staged neither `daily` nor `first` isn't counted. That needs a new kind in the staging, and wording for it.
- **Which games:** it doesn't say which games have a free start. Each game's page carries that.
- **Only puzzles:** it calls every free daily a "daily puzzle". A free daily that isn't a puzzle, such as a daily mystery, would be described wrongly. Under today's staging Daily Mystery is counted as one of the "two daily puzzles".
