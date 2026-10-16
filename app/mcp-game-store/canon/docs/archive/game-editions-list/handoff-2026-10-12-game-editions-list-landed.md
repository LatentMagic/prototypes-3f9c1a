---
date: '2026-10-12'
topic: 'game-editions-list'
status: 'in-progress'
type: 'integration'
---

# Handoff: the head, History's filters and Share landed in app/; edition pages left open

## Current Focus
The list is in `app/gs-editions.jsx` (owner: "the list itself is perfect and fine"). The edition page its rows open was moved over as built and is still undecided. Don't change it until the owner decides. States: `library-casebook-editions`, `library-casebook-edition`.

## What landed (owner said "integrate", 2026-10-12)
- **Design system synced.** `_ds/…/_ds_bundle.js` and `components/components.css` copied from the design system project (Cover `fill`, `.mcp-cover-head`).
- **Library game page head** (`LbHead`, `app/gs-library.jsx`): `<DS.Cover fill ground extend>` in `.mcp-cover-head`, with `.mcp-cover-head-text` and `.mcp-cover-head-links`. Link: "About this game". `.lb-head` puts it 24px above the first card. Optional `name` and `more` props are a playground seam.
- **GS_ART** (`app/gs-data.jsx`): every entry is now `{ ground, extend, svg }`. Consumers read `.svg`.
  - As the owner named: bottom for Casebook, Escape, Delve and 36,000 Summers Ago; centre for Daily Word, Daily Groups and Daily Mystery.
  - Barrow bottom, Derelict centre (ratified 2026-10-12).
- **History** (`GsHistory`, `app/gs-history.jsx`): option 1 without the tabs.
  - Played only, no List switch.
  - The Filters panel holds Genre, Schedule, Game, Replays (With / No / Only replays) and Order.
  - Clear all appears under the bar and in the empty state once anything is set.
  - Row titles come from the edition.
  - Daily-puzzle replays have left the log.
- **"See in History"** is now the plays card's link on every library game page (ratified earlier).
- **Share and its link share a row at every width** (`.lb-acts`, `index.html`).
- **States**: the seven `history-every-edition-*` states have been removed, along with their QA steps.

## Card art motion
The design system's art moves inside a link or button, or in an `mcp-art-host` card through its one stretched `mcp-art-link` (2026-10-12). Home, Discover and More games title buttons carry `mcp-art-link`; the local host rule is gone.

## Not done
- `pgeTall` and the `.pge-head-g` overrides are deleted. The rig's other dead options (2i, 2j, 1, 3) are still in `PGE_OPTS`.
- The `session-replay` state still opens a Daily Word replay, and `PH_BROKEN` still holds one.
- `uploads/` has not been cleared.
