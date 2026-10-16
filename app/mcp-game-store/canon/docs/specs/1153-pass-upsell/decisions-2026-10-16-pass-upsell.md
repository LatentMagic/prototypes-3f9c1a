---
date: '2026-10-16'
ticket: '1153'
topic: 'pass-upsell-decisions'
status: 'review done; candidate next'
type: 'decision record'
---

# 1153 How the site mentions the Pass: what the owner decided

The owner reviewed the playground with the builder on 2026-10-16. This file records the outcome in words, for someone who hasn't seen the build. The playground is at `docs/specs/1153-pass-upsell/playground/index.html`; the running log of the session is `handoff-2026-10-16-home-pass-line.md`. Nothing here is in `app/` yet.

## Rules that run through every surface

- When a line mentions the Pass, **"the Pass" in that line is the link** to the Pass page. There's no second link or button to the Pass next to it.
- The line "Purchases only ever happen on this site; your AI will never ask you to pay." **lives on the Pricing page**, not in a game's play box.
- Lines are as short as they can be. Nothing gets added that the brief didn't ask for: no extra buttons, no rewritten main-build copy.
- Copy stays true when the catalogue or the week changes. No "this week's…" for something that will be replaced, no counts typed in by hand.

## Home

- **The Pass section** is one paragraph: "Two daily puzzles and the start of select games come with your account. Everything else comes with the Pass." Only "the Pass" is linked, and the section has no separate "About the Pass" link. The paragraph wraps only when the line runs out of room. The number of free daily puzzles and the "start of select games" clause come from the game data, so a third free daily reads "Three" with no copy edit.
- **Pass-only games on the game cards:** a small square "Pass" pill with a padlock, in the **top right** of the cover art. It isn't pressable (pressing the card opens the game). Its accessible name is "Pass only", and Pass holders don't see it. The Free and "First … free" chips come off the cards.
- **The Barrow's coming-soon card** says "CHAPTER 3". In the prototype chapter 2 is out, so the main build's "chapter 2 coming soon" is wrong. Fix it in `app/gs-data.jsx` (`GS_SOON`) and `app/gs-barrow-library.jsx`.
- **The hero stays as it is** (Casebook). Casebook isn't a ratified game, but the hero isn't redesigned until the games are chosen. When this lands, add a code comment on the hero saying Casebook isn't decided, and that the pattern stands whichever game it shows.
- **Open:** the owner doesn't want a separate treatment for the pay line on Home. Whether it should stay under Home's Pass section at all, now that it lives on Pricing, isn't confirmed.

## Pricing page

- The pay line sits in small type **under the price and the Choose a plan button**. It's right-aligned while the button sits beside the price, and left-aligned wherever the button goes full width (container under 640px, the same switch the button uses).

## A game's product page: the play box

- **A free daily game:** the label names today's edition in the game's own word ("TODAY'S WORD · NO. 212"), and the line under the button reads "Free with an account. A new word every day."
- **A game whose first part is free** (the first case, room or scene, or chapter 1 of the Barrow): the label is "THE FIRST CASE" ("CHAPTER 1" for the Barrow), and the line reads "Free with an account. Every other case comes with the Pass." in the game's own word, with "the Pass" linked. There's no separate Get the Pass link.
- **A Pass-only game** (36,000 Summers Ago): the label is "WITH THE PASS" and the line reads "36,000 Summers Ago comes with the Pass." with "the Pass" linked. The Get the Pass button stays, and the "Play a free game" link goes.
- None of the play boxes has the pay line.

## Library

- **After signing in, every player lands on Library**, free or Pass.
- **A free account that has played nothing** sees the usual Library: the main build's rows, search and filters, unchanged. Under the list is one line, "Everything else comes with the Pass.", with "the Pass" linked. No buttons are added. The Account page's sentence stays as it is.
- **"New for you"**, at the top of Library, is one sideways-scrolling row of the design system's game tiles (CardRow, Previous and Next once it overflows). It holds **games with editions (daily, weekly, chapters) whose current edition you haven't played**. A standalone game such as 36,000 Summers Ago never goes in it. Everything else is listed as rows below under "Your games". When there's nothing new, the row isn't shown. In the playground the row reads whether a game has been played at all, because the seed has no played flag per edition. Building it properly needs that per-edition flag.
- The main build's row text "Today's hunt is ready" for 36,000 Summers Ago is odd for a standalone game, but the owner is leaving it.

## A game's Library page

- **The free first part's card:** before and during it shows Play. Once it's done, it shows the result, Share and the record link, then "Keep playing with the Pass." with "the Pass" linked and no button. This wording is true for every game and every week. The same goes for the Barrow's chapter 1.
- **The Barrow's "Chapter 3: coming soon" line** shows only to Pass holders. A free or Pass-ended player can't play the next chapter.
- **A finished daily or weekly game** has one link under its card, "See what's out for you to play". It opens Library as it is, with New for you on top, never a filtered or empty list.
- **A player whose Pass has ended** sees one card on the game they last played: "You stopped here. Everything you earned is still yours." with the link "Get the Pass again", on every visit. The owner chose this knowingly, even though it puts a separate link beside the line.

## Connecting

- **No change.** There's no one-click install in this product. Players connect through the plugin, as the main build's How it works page already does (`app/gs-connect.jsx`). The playground's install designs aren't carried forward.

## Still open or queued

- On a game's Library page, the main build's lines "Your streak comes with the Pass." and the achievements text starting "Every other…" haven't been checked against the rules above.
- Design-system work before integration: a lock slot on the art of `GameCard` (and `GamePick` and `GameTile` if the lock reaches them), and a state slot on `GameTile` if New for you needs one.
- The Pass pill sits top right in the playground only. Both Discover candidates still have it top left.
- Which Discover candidate goes forward: the owner leans to "Discover, tidied", with problems still to name. See `handoff-2026-10-15-discover-tidied.md`.
