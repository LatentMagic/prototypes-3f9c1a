# Handoff: connecting, and the prompts a player copies (playground)

2026-10-09. Nothing here is ratified. The source prompt is the one pasted into this session (Joe's statements of 2026-10-09 in `_context/log.md`).

## What was built, and where
- Rig: `docs/specs/connect-and-prompts/playground/index.html`, module `pg-connect.jsx` beside it. Listed in `playgrounds.json`.
- The Circlists page it is modelled on: `docs/specs/connect-and-prompts/circlists-mcp-page.html`. The two logos are inlined as paths in `pg-connect.jsx`.
- One change in `app/`: `gs-parts.jsx` reads the account-menu row's label from `window.GS_AI_ROW` (falls back to "Your AI"). The rig sets it to "How it works". It's a hook, not a behaviour change.
- Also changed on request, outside the brief: `GS.works` in `app/gs-data.jsx` now reads "ChatGPT · Claude · Gemini · OpenClaw · any assistant…" (Hermes removed). It shows on the home hero and on every product page's play box.

## How to reach each option
The strip at the bottom has four rows. **Option** 1 to 5 (Why shows its idea and cost). **Go**: 1 How it works, 2 Product page, 3 Editions, 4 Play again (a session page). **Game**: any of the seven. **View**: signed out, no Pass, Pass. The rig opens on How it works, as no Pass. The top bar's How it works (signed out) and the account menu's How it works row (signed in) both reach the page. Selection is kept in `pg_connect_v1`.

## The options
1. **The prompt in plain sight.** Every prompt is printed where its game starts, with Copy beside it, and one line above it: "Connect your AI first. Nothing plays until it's connected and signed in. How it works." Play controls on other pages open a dialog with that line, the prompt and Copy. How it works is a single document: Claude and ChatGPT buttons, then OpenClaw, Gemini and Other as a choice that swaps the steps, then the list-the-games prompt, disconnecting and help. Cost: a paragraph of instruction sits in the play box, and the warning is one sentence that's easy to skip.
2. **Connect, then paste, every time.** Play buttons stay as they are and open a panel with two numbered steps: connect your AI (Claude and ChatGPT buttons, a link to the steps for every AI), then paste this prompt. How it works shows the same sequence as three cards: connect (other AIs as disclosures), sign in when it asks, paste a prompt. Cost: a player who's already connected sees step 1 on every press, because the store can't know they've done it.
3. **The prompt does the telling.** One press copies. Every prompt ends with a sentence telling the AI to send the player to How it works if it can't find the games tool, so an AI that isn't connected says so itself. A dialog then confirms the copy and shows the text. How it works shows Claude and ChatGPT as tiles, other AIs as a list whose rows open their steps in a panel, and closes on a band with the list-the-games prompt. Cost: the strongest warning sits in the AI's reply, which the store doesn't control, and every prompt is a sentence longer.

4. **Compact cards, switcher** (after the first review). How it works keeps option 3's Claude and ChatGPT cards, compact, with primary Connect buttons sized to their label; option 1's switcher for other AIs, steps beside it; Start playing as option 3's bordered card, prompt and Copy on one line; Disconnecting and Help side by side. The "purchases only on this site" line is gone from the page. The product page is the app's play box with step 1 "Connect your AI first. How to connect" and a button that copies the prompt in one press ("Copy to play"). Editions and Play again open a short dialog: the prompt, Copy, one line.
5. **Option 4, with the Editions dialog.** How it works as 4 (the How it works pick, not yet ratified). Every play control, the product page included, says "Play in your AI" and opens option 1's Editions dialog without its repeated sentence: "Connect your AI first. How to connect", the prompt, Copy. (Earlier versions of 5, three cards and then option 2's panel, were dropped.)

## Prompt drafts
- Games: "Load the [Platform] games tool and show me the games it lists, with a line about each."
- Game: "Load the [Platform] games tool and start Delve. Run it exactly as the tool says."
- Edition: "Load the [Platform] games tool and start Casebook #45, "<title>". Run it exactly as the tool says." (Daily puzzles have no title: "Daily Word #312".)
- Option 3 adds to each: "If you can't find the tool, tell me to connect [Platform] first at platform.example/how."

## What I chose for the open items, and why
- **The word "prompt":** options 1 and 2 use it in buttons and headings ("Copy prompt"). Option 3 avoids it on buttons ("Copy to play") so we can compare.
- **What the copy control does:** 1 copies in place (the button becomes "Copied"). 2 copies inside the panel. 3 copies on the first press, before anything opens.
- **A visitor who has never connected:** every option shows the prompt to everyone. Signed out, each surface adds "You also need a [Platform] account. Start free". Option 2's How it works shows Start free in its sign-in step. Nothing sends a signed-out press to sign-up any more.
- **The product page:** the play box's first step now says how to connect, per option, and links to How it works. The play control is the game prompt for every view. Where a free player used to get "Get the Pass" as the button (36,000 Summers Ago), they now get the prompt, with Get the Pass as a link. On this edition's card, the play control uses that edition's prompt. Where the card had no play control (a Pass edition for a free player), it still has none, and that prompt is on the Editions page.
- **Play again** on a session's page gives the edition that session belongs to. (The library game page was listed here in error: in the seed it has no play control, so it was removed from the rig.)
- **Editions page:** a row opens its edition's prompt through the option's surface, in place of the old dialog with its placeholder line.
- **Claude and ChatGPT buttons** open placeholder addresses (`claude.ai/settings/connectors`, `chatgpt.com`) until the plugin pages exist.
- **Other AIs:** Gemini under Settings → Custom apps. OpenClaw reuses the old Connect screen's terminal step (`openclaw mcp add`), which is **unverified**. Other is generic.

## Ratified and landed (2026-10-09, Joe)
- Direction: How it works from option 4, the play dialog and product page from option 5, button "Play in your AI". Product page: the cover takes the play box's height from 900px, so they always end level.
- Landed in `app/`: `gs-connect.jsx` (How it works, the play dialog, prompt drafts), `main.jsx` (`gs.play` and `gs.playReq` open the dialog; `goHow` goes to How it works; `connect` is no longer signed-in only), `gs-parts.jsx` (account row "How it works"; the pop-up is the dialog), `gs-game.jsx` (play box step 1 and button, this edition's card), `gs-editions.jsx` (a row opens the dialog), `index.html` (styles), `states.jsx` (label). The rig still overrides these for comparison.
- Not changed: the home page's "See how it works" still scrolls to its own section. Prompt wording is still a draft.

## Queued from the first review (not built)
- Rig 1 copy: "Start playing" line, the repeated purchase line, the disconnect line. Product page rigs 1 and 3: overhanging text and dead space under the cover. Play again in rig 1 says too much. To be settled once a direction is picked.
- Library rows: "Not played" has no icon, so its row misaligns (`app/gs-library.jsx`, `LbStatus`). Casebook, no Pass: a UI bug to look at.

## Unresolved, or not built
- How it works in the top bar isn't marked as the current page while you're on it: the bar matches by route name, and the page lives on the `connect` route. Fixing it needs a route of its own in `main.jsx`.
- The old Connect screen's waiting state and "Connected" message are gone in every option, because the store can't know you're connected.
- None of the copy has been checked against the voice doc by its owner. The voice doc read was the design system's `guidelines/voice.md`; the monorepo UI standard (`specs/governance/standards/ui-design.md`) wasn't read live in this session.
- The pages' copy isn't final. OpenClaw's steps need checking.

## Next
Review the three options at phone and desktop width. Choose one direction, or a mix of parts (for example option 3's one-press copy with option 1's document page). Then ratify the prompt wording, and move the chosen pieces into `app/gs-connect.jsx`, `gs-parts.jsx` (the play pop-up), `gs-game.jsx` and `gs-editions.jsx`.
