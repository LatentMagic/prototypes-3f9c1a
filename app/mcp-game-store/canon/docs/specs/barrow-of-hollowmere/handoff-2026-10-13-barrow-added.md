# The Barrow of Hollowmere: added as a game (2026-10-13)

The owner asked for the Barrow as a new adventure game: on the storefront, with a library page and an edition. Content was left to Claude. **Ratified by the owner, 2026-10-13:** a free player gets chapter 1. Nothing else below is ratified.

## Choices made without ratification
- **Access (ratified):** the same as Delve. A free player gets chapter 1 (`first: true`), and every other chapter comes with the Pass.
- **Library page is a placeholder (owner, 2026-10-13):** not designed and not meant to be yet; adequate as it stands.
- **Library page:** "All chapters" sits next to "About this game" and opens the editions list (`eds: true` puts it in `ED3` with no schedule). Your chapters is the player's own plays. The chapter card spans the row, so Achievements and Your chapters pair up as they do on Delve's page.
- **Editions:** chapters (`ed: ['chapter', 'chapters']`). Chapter 1, "Under the Hill", is out. Chapter 2 is the Coming soon SoonCard, and its "Play chapter 1" chip opens the Barrow's page.
- **No schedule:** no Daily or Weekly tag, so it stays out of History's seeds and the Daily/Weekly filters.
- **Nobody has played it yet:** no sessions, no achievements earned, and Your chapters is empty.
- Sample copy: pitch, chat turns, achievements, "At your own pace", "45–60 min".

## Files
- `app/gs-barrow-library.jsx` (new). Edited: `gs-data.jsx`, `gs-game.jsx`, `gs-chats.jsx`, `gs-player.jsx`, `gs-discover.jsx`, `main.jsx`, `states.jsx`, `index.html`.
- States: `barrow-free`, `barrow-pass`, `library-barrow`, `library-barrow-free`, `barrow-all-chapters`.
