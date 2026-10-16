---
date: '2026-10-16'
ticket: '1153'
topic: 'discover-keep-delve-link'
status: 'complete'
type: 'fix'
---

# Handoff: two fixes in the main build

## What changed

1. **Discover keeps its search and filters** (`app/gs-pass-discover.jsx`). They now live in the page shell, not the body, and are written into the history entry (`gs.keep`, key `dcKeep`), as History and the editions list already do.
   - When the content reloads in place (loading, or Try again after a failed load), the body remounts under the shell and the filters stay.
   - Back returns them too. Before this change Back did not keep them either: the screen remounts per history entry and Discover wrote nothing into it.
2. **Delve's Library page, Pass holder, finished scene** (`app/gs-delve-library.jsx` `DvNow`): "See what’s out for you to play" under the card, as on the daily games and Casebook. The link is `CprNextLink`, now also published as `window.GsNextLink` from `app/gs-pass-library.jsx`.

## Clicks to reach each fix

**1. Discover keeps search and filters**
1. Open the prototype. Demo bar → **Free** (or **Pass**). You land on Library.
2. Top bar → **Discover**.
3. Type `de` in Search, then open **Filters** and pick a Genre and a Schedule.
4. Click a game in All games, then the browser's Back.
5. Discover shows the search and both filters still set, with the filtered wall.

**2. Delve's "See what’s out for you to play"**
1. Open the prototype. Demo bar → **Pass**.
2. You land on Library. Click **Delve**. (This week's scene is finished by default; Config's In progress hides the link, as on the other games.)
3. Under the This week card, below "Next scene": **See what’s out for you to play**. It opens Library.

## Calls made (builder's, not ratified)

- **Browser reload: left alone (owner, 2026-10-16).** A tab reload restarts the prototype at Home, signed out, by design. MCPG-018 AF-09 already requires the real site to keep Discover's search and filters through a browser reload; the developers build it from that.
- The in-place reload can only be staged from States (`loading-in-place`, `load-failed`), both of which open a fresh Discover, so there is no click path that sets filters and then reloads the content. The keep there is in the code; Back is the clickable check.
- Clicking Discover in the top bar while on Discover opens a new page with filters cleared, as before.
