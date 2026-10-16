---
date: '2026-10-08'
topic: 'delve-two-pages'
status: 'in-progress'
type: 'decision'
---

# Handoff: delve-two-pages, the user picks option 2 as the route

## Current Focus

The user reviewed the four-route playground (`playground/index.html`) and chose option 2, "Separate page, top bar and strip", as the direction. The next piece of work is a new playground for the two questions below that are marked as ideation. Don't polish the current playground.

## Ratified (user, 2026-10-08)

- **Direction: option 2 in some form.** The game page and the player page are separate pages.
- **Keep the card at the top of the game page.** Showing the cover twice is fine.
- **The way in is a link inside that card.** The link is probably enough on its own, though the wording is still open.
- **Keep the top-bar dropdown that lists your games.** Delve is missing from it in the current build, which is a bug.
- **Keep the way back as it is now** (the "About Delve" link on the player page). It needs no redesign in a playground.
- **Remove the breadcrumb.** The top bar already carries the route, and "Adventures" isn't a real category.
- **Remove the main button from the player page.** Someone on that page already has the game.
- **Remove option 3's row.**
- **Remove option 1 (Tabs).** Tabs had already been ruled out, and option 1 shouldn't have been built. That was the agent's error.

## For ideation in the next playground (not decided)

1. **Replace "your" and "yours".** The word is wrong everywhere it appears: the player page title ("Your Delve"), the card, and the dropdown ("Yours"). Explore names for the player page and the dropdown. The user liked what each of these surfaces does and objects only to the naming.
2. **What a signed-in game page shows, in place of the never-played / has-played split.** Splitting the page by play history asks too much of a product page and doesn't feel normal for a platform. Explore what fits a signed-in viewer instead.

## Out of scope

- What "history" means, and whether it shows as a tab or anything else. It isn't part of the next playground.
- The game page redesign (the facts row, the description going stale, the way back).

## Still open, not raised again

- Signed-out label: "Start free month" (the old rig) or "Get the Pass" (the app). The user hasn't decided.

## Artifacts

- `playground/index.html`, `playground/pg-routes.jsx`: the four-route playground the user reviewed. Leave it unchanged. It's the record of this review.
- `app/gs-parts.jsx`: two empty slots added to the top bar for option 2's dropdown.
- `handoff-2026-10-08-option-review.md`: the earlier review of options 0 to 3.

## Next steps

1. Agree the new playground's scope with the user (the two ideation questions above), then build it in `docs/specs/delve-two-pages/` or a new ticket folder, whichever the user prefers.
2. Fix the missing Delve entry in the dropdown when the next build touches it.
