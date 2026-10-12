---
date: '2026-10-12'
topic: 'game-editions-list'
status: 'awaiting-review'
type: 'playground'
---

# Handoff: a game's list of editions (playground, third brief)

Brief: "a game's list of editions, playground" (2026-10-12, third). It settles that the plays card's link ("All cases", "All rooms", "All scenes") keeps going to History narrowed to the game, and that the list of editions needs its own way in from the library game page. This build replaces the second one, which put the list behind that link. It answers the open question in `handoff-2026-10-12-game-editions-list-review.md`. Nothing here is ratified.

## What was built, and where
- Entry: `docs/specs/game-editions-list/playground/index.html` (title only changed). Module: `pg-editions.jsx`, rewritten. `playgrounds.json` note updated. `app/` is unchanged.
- The real app with a bottom strip above the demo bar. Opens on Casebook's library game page with the Pass.
  - **Option 1 to 3** picks the option; **Why** gives stance, cost and the two names on Casebook.
  - **Go:** Escape, Casebook, Delve. **Find the way in** opens the current game's library game page and rings the way in to the list.
  - Viewer: the demo bar (signed out, free, Pass). Viewport: the app's Config. Selection persists under `pg_game_editions_v3`.
- Seams: `LbRecent` (wrapped: the app's card with a renamed link, plus the option's way in after it), `LbHead` (option 2 only), `LbTools` (History's List switch dropped), `GsDemoBar`, and each of the three games' `GS_LIBRARY` page (the list at route `{ page: 'record', list: true }`). Other games get the app's parts.

## Held in every option
- The card's link goes where it goes today: History narrowed to the game.
- The list page: back link to the game, H1, the app's search field and Filters, numbered pages of 24. Each edition once, newest first, from the app's `edList`. No result, no replay count.
- Search uses History's matcher: number, title or date.
- Without the Pass every edition is listed; one that needs the Pass carries the Pass tag and shows the app's `GsNeedsPass` where Play would be.
- Play opens the app's play dialog with the edition's prompt (`gs.playReq({ kind: 'edition', e })`).
- The list's state lives in the history entry, so Back returns it as left.

## The options (Casebook's words; each game uses its own)
1. **A card of its own, rows open a panel.** Way in: a clickable card "Every case" after "Your cases" ("Find any case by its number, name or date, and play it."). The card's link is renamed "All your cases". List H1 "Every case". Rows: name, "Played" or "In progress", date, Pass tag. A row opens a panel (bottom sheet on a phone): number and date, the line, the cast, length and suspects, the played note, and Play. Filters: Show (every, played, not played), Order.
   - Cost: one more card, so a phone scrolls further; Play is two steps from the row.
2. **A link in the page head, each edition has a page.** Way in: "Every case" beside "About Casebook" under the H1. The card's link is renamed "See in History". Rows: name and date only, Pass tag. A row opens the edition's page, led by the cover: number and week, H1 title, the line, facts, Play; below, the cast and, if played, "You've played this case." with "See in History" (History narrowed to the game, searched by number). Filters: Order.
   - Cost: a link is easy to pass on a phone; nothing on the list says what an edition is.
3. **The latest in a row, rows open in place.** Way in: a card row "Case list" spanning the page after the cards: the five latest cases as cards (each opens the list with that case open) and a last card "See the whole list". The card's link keeps "All cases"; the list is named "Case list" so the two read apart. Rows are the app's Disclosure: open in place to show number and week, the line, facts, Played, Play. Filters: Show (every case, ones you can play) for a player without the Pass, Order.
   - Cost: a band added to the library game page, repeating this week's case; open rows push the list down; the row title can't carry the date.

## Choices made on the open items, and why (proposed, none ratified)
- **Information is sample**, written for this rig (`PGE_INFO`): one line per Escape room and Delve scene by title, eight lines cycled for Casebook, length from the product page's tags, and Casebook's real cast. The app holds only number, title, date and cast.
- **Where info and prompt sit:** a panel (1), the edition's own page (2), the row itself (3). The prompt is always the app's play dialog, so it looks the same as everywhere else.
- **Played:** on the row (1), on the edition's page (2), inside the open row (3).
- **Way in and the link's name:** a card and "All your cases" (1), a head link and "See in History" (2), a card row "Case list" and "All cases" kept (3).
- **Without the Pass:** the Pass tag and `GsNeedsPass` in all three; option 3 adds a "Ones you can play" filter. The card's "Every other case" row stays as the app has it.
- Signed out sees the app as it is; the list is for signed-in players only.

## Not built or unresolved
- All new copy is unratified: the edition lines, "Find any case by its number, name or date, and play it.", "You question … .", "You've played this case.", "You're partway through this case.", "All your cases", "See in History", "Case list", "See the whole list", "Ones you can play".
- On Casebook the plays card reads "#45" while the list reads the case's name.
- Option 1's card sits in the card grid, so at desktop width it takes one cell with the other empty.
- The parked History playground (`docs/specs/history-filters-redesign/`) still holds its open question: does "Missed" on Played mean a lost play or an unplayed edition?
- `ready_for_verification` reports missing files for this entry: the known `<base>` false positive (GOTCHA 11). The rig renders.

## Round 2 (2026-10-12): options 2 and 2b
Feedback in chat: option 1's card doesn't work as the way in and leaves an empty grid cell. "See in History" is liked. Option 3's row is liked but lacks a clear way to the list. Nothing ratified.

**Option 2b added** (the strip shows it as "2b"). It is option 2 with a different head on a phone. From 640px up it is option 2.
- The cover grows to 128px (96 in option 2), and the two links stack.
- The head is as tall as the cover and the text is evenly spaced. To fit, the two stacked links are 32px tall, under the project's 44px phone minimum (the design system's links are 48px). The user agreed to this exception in chat; it is still to be written into the rules if kept.

**Every option, playground only (`app/` unchanged):** Share and "See every turn" sit on one row on a phone. The app still stacks them below 640px; carry the change to `app/` when ratified.

**Back fixed.** The list's back link and the edition page's back link read `route.prev`, which holds only name and page. Any list entry therefore looked like it came from the library game page, so Back could land on the page before it, such as a session. The link that opens the page now sets `fromLib` or `fromList`, and Back steps back only when that flag is set. Otherwise it opens the game's library page or its list.

**The brief's changes, options 2 and 2b, for Escape, Casebook and Delve:**
- **Number:** the row title reads "#43 · The Widow’s Lantern". The number comes from the app's `edList`, so every edition already had one and no sample data was added.
- **Played mark:** the row's status slot reads "Played", with no icon. On a phone it sits under the title; on desktop it sits between the title and the date. It is the same slot History uses for a result, in the same muted style, so it reads as a status. It says "Played" and nothing else.
  - Only a finished play earns the mark. In progress and not finished carry none and count as not played. This is open.
- **Not played, in Filters:** a group "Show" before Order, with "Every case" (default) and "Not played". It follows History's pattern: a one-word label and the "All …" choice first. Each game uses its own word ("Every room", "Every scene").
- **When nothing matches:**
  - With a search: "No case you haven’t played matches that. Try a name, a number or a date."
  - With no search: "You’ve played every case."
- Sample mix: the seed already mixes played and not played in each game with the Pass.

**Unresolved:** all new copy above.

**Long names (2026-10-12).** With "36,000 Summers Ago" in the head, 2b breaks on a phone: the title takes three lines and "About …" wraps. The strip's "Long name" puts that name in the 2-family head to test this. Two variants are built (unratified), both with a 128px cover on a phone:
- **2c:** the cover above the title; the title and the stacked links get the full width.
- **2d:** the cover beside the title only; the links run in one row underneath both.

From 640px up, every 2-family head now centres its visible text against the cover; the links' box used to leave it sitting high.

User, on a phone: 2c makes the head too tall, and 2d looks wonky. So two more variants were built, using size and wording before layout (unratified):
- **2e:** 2b with the title at 28px on a phone. That is the low end of the app's `.gs-h1` range (28–34px), so it is still the largest text on the page. "36,000 Summers Ago" takes two lines, and the head is a little taller than the cover.
- **2f:** 2e with the two links side by side on a card under the cover and title, on a phone only (the user's suggestion). The links are 48px tall there.

**"About this game"** (user's wording, 2026-10-12) replaces "About <game>" in every 2-family head at every width. With "Long name" on, the list link reads "Every day", that game's own unit; it has no list, so the link is there only to test the layout.

**One rule for every game (user, 2026-10-12):** a card for "About this game" alone looks wrong, and so does a third head state just for games with no editions. The head needs one adaptive rule that works with one link or two. Two variants are built (unratified). The strip's "One link" button shows the head as a game with no editions has it.
- **2g:** links in a row under the title, beside the cover. They wrap to the next line when they don't fit, so the head has no breakpoint of its own. On a phone the cover is 128px, the title 28px and the links 32px.
- **2h:** cover and title side by side, the links in a row beneath both, at every width. On a phone the cover is 128px and the title 28px.

**Playground tidied (2026-10-12, at the user's request).**
- The strip offers only **2g** and **2h**. Options 1, 2, 2b to 2f and 3 stay in `pg-editions.jsx` but are out of the strip (`PGE_LIVE`). The rows, number, played mark, Show filter and Back fix apply to both.
- "Long name" and "One link" are removed. They put "36,000 Summers Ago" on Casebook's page, which was confusing.
- The strip's Go row adds **36,000 Summers Ago**, its real library page. It has no editions, so its head shows "About this game" only.

**Also unresolved:** Whether an unfinished or in-progress edition counts as played. Whether "Played" in History's result slot can be confused with a result.

## Round 3 (2026-10-12): an edition opens over the list (option 2g)
Brief: "an edition opens over the list, playground, round 3". Nothing ratified.

**What changed (Escape, Casebook, Delve):**
- A row opens the edition in a panel over the list (`PgeEdPanel`, `DS.Popup kind="panel"`): a bottom sheet under 640px, a centred 480px window from 640px.
- The panel holds what the edition's page held: "CASEBOOK #45 · WEEK OF …", the title (the panel's heading), the line, the facts (length, suspects), "You question …", the played note and "See in History".
- The prompt and "Copy prompt" sit in the panel, with the play dialog's "Connect your AI first. How to connect" line. No play dialog opens.
- An edition that needs the Pass shows `GsNeedsPass` where the prompt would be and has no Copy button, as its page did.
- The edition's page (`PgeEdPage`, route `pgeEd`) is removed. No route in this option leads to one edition.
- The open edition is part of the list's state in the history entry, so closing leaves page, search, filters and scroll as they were, and Back from "See in History" returns to the list with the panel open.
- The line under Filters: already gone. The rig uses the app's `LbFilters`, which shows nothing under the button (2026-10-12). Nothing to change.

**Choices under Yours (proposed):**
- **Layout:** one column, the order of the old page minus the cover: what it is, then whether you've played it, then the prompt last, nearest its Copy button. Copy is the panel's one action and fills the row, as the design system asks for a single action.
- **No artwork.** Every edition of a game has the same cover, so it would say nothing the label doesn't, and on a phone it would push the prompt below the fold of the sheet.
- **The prompt shows at once.** A "Play" press that only reveals text adds a step and changes the panel's height after opening. The panel exists to start the edition, so its prompt is the main content.

**Unresolved:** whether Back from History should reopen the panel or return to the bare list; the new copy is still the old page's, unratified.

## Also fixed (2026-10-12, outside the brief, at the user's request)
Game cards in a row (Home's "Available games", Games' row cards) had uneven space at the bottom when tags wrapped. The card's body now fills the card: title and line at the top, tags at the bottom, so the spare space sits between them and every card ends on the same line. `app/gs-home.jsx`, `app/gs-discover.jsx`, `.gs-feat` in `index.html` and this rig's `index.html`. To be confirmed.
- Cause of the wrapping: the design system's `CardRow` sizes cards by `--n`, the number of cards. Home's row has seven, which pinned every card at the 220px minimum, so tags wrapped. Discover's "Just added" has four and reaches 280px. Home's row now sizes as four (`.gs-row4`), so its cards match "Just added" at every width. The `--n` behaviour for rows over four cards is a design-system question to carry back.
- 36,000 Summers Ago's "Pass" tag is a button with a 44px target, which made its tag row 16px taller than the others, so its tags ended 8px higher. The target now reaches past the tag (`.gs-tagbtn` negative block margin) and the row stays tag height. Every card on Home now ends 17px below its last tag.

## What I would do next
1. On Casebook with the Pass: Find the way in, open it, search "30", open #30, play, go back. Repeat for each option, on a phone and at desktop width.
2. Repeat on the free view, and on Escape.
3. Pick a direction, then settle its copy and the real information an edition carries.
