# Handoff: directory listing mocks, 15 October 2026

## What was built, and where
- `app/directory-listings.jsx`: both pages (`DlClaudeListing`, `DlChatGptListing`), the register entries (`window.DL_STATES`) and the fonts. Loaded in `index.html` after `app/gs-chats.jsx`, before `app/states.jsx`.
- `app/main.jsx`: routes `directory-claude` and `directory-chatgpt` added to `GS_ROUTES` and `GS_BARE`, rendered through a `window` guard. The demo bar, play pop-up and push host are hidden on these two routes only (`GS_LISTING`).
- `app/states.jsx`: the register spreads in `window.DL_STATES` (absent means nothing added).
- `app/qa.jsx`: QA entry `directory-listings`.
- `ARCHITECTURE.md`: a row in the droppable-modules table.
- The eight reference images were uploaded to `uploads/mcp-games-listing-refs/`. They were moved to `uploads/directory-listings/`, the path the brief gives.

## How to reach each page
1. Open the prototype, then the Config pill at the bottom right.
2. States, then the group **Store listing**.
3. Pick `Directory listing: Claude connector` or `Directory listing: ChatGPT plugin`.
4. For phone width: Config, Viewport: Mobile. For desktop width: Viewport: Desktop (or auto in a wide window).

Or: Config pill, QA, `Directory listings`.

## Differs from the brief
- **Group title.** The brief names the group `Directory listings`. The owner said in chat that the entries go under "Store Listing" in States, so the group is `Store listing` (sentence case, like the other groups). The QA entry keeps the brief's title, `Directory listings`. Needs the owner to confirm.

## Yours to decide: what I chose
- Desktop with Viewport on auto: the header strip runs full width, and the content column is 960px, centred, as on the real pages. The ChatGPT sidebar stays 260px and the column sits centred to its right.
- The phone layout starts below 768px, measured on the app root.
- Fonts: Source Serif 4 for the Claude wordmark and page title, Instrument Sans for the rest of the Claude page, and the system sans stack for ChatGPT. Both Google faces are loaded by the module.
- Icons are simple inline line icons. The Claude asterisk and the ChatGPT ring-and-blossom are drawn as generic marks. Neither is a copy of the real logo.
- Focus shows a 2px dark outline. Link hover thickens the underline.

## Set by this brief (the owner has not ruled)
- Claude connector URL shown as `https://<domain>/mcp`.
- ChatGPT `Version` reads `1.0.0`.
- ChatGPT shows the `App` row and data notice; it omits Skills and Capabilities.
- Claude omits `ADDED`, Related connectors and the Verified trust notice.
- Ten placeholder `games_*` tool names.
- Gallery pictures: three (owner, 15 Oct: the brief's five was a mistake; then two; then add a third). The choice was left to me: `GS_CHATS.word[1]`, `GS_CHATS.casebook[1]`, `GS_CHATS.barrow[1]`, in games-list order. Two fit at desktop width, so the previous and next arrows show at desktop too (owner, 15 Oct), as on a phone.

## Where the numbers and images disagree (the images won)
- QuizHP 1440: `Sign in to add` starts at the facts column (x=912) rather than at the right edge of the block, so it sits there.
- QuizHP 1440 tool chips measure about 4px by 12px of padding, not 8px by 12px. Built at 4px by 12px.
- Figma 390: Tools stay in two columns on a phone, with long names cut off by an ellipsis. The brief says one column; built as two. The phone gallery's previous arrow is dimmed at the start and the next arrow at the end.
- The QuizHP 390 Community tag is smaller than at 1440 (about 12px text). The phone uses the smaller tag.

## Unresolved
- The chat pictures' tool label is canon's `GS_CHAT_BY` (`[Platform]`), as the brief asks. On this page it reads as a placeholder beside `MCP Games`.

## Next
- Check both pages against the 390 and 1440 images side by side. Tune the spacing that is only approximate (the gallery's top margin, the gap between the Tools and the footer).

## Proposed CHANGELOG entry (not written)
None proposed: this is a review aid, not a change to the product's shape.
