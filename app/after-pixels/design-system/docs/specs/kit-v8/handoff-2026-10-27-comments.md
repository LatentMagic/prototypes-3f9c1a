# Kit v8: comments carry intent (2026-10-27)

- **Version before:** 7 (now 8).
- **Added:** the comments rule to `CLAUDE.md` (new `## Code` section) and to `ARCHITECTURE.md` § Conventions. `ARCHITECTURE.md` did not exist; it was created holding only that section.
- **Skipped:** nothing in the update was already present.
- **Audit:** 0 comments deleted (none was pure narration), 33 `KEEP:` marks added.

## Audit scope

Every comment in `components/**` (`.jsx`, `.js`, `.css`, cards), `tokens/*.css`, `styles.css`, `guidelines/cards/*.html`, `ui_kits/shop/*`, root HTML pages and `docs/specs/**/*.html`: 193 comments in 134 files.

## Marks added

- `components/components.css`: 18 existing outcome comments prefixed `KEEP:` (button widths, held link, locked tag padding, SoonCard, Needs the Pass, cover beside a heading, overlays, game art, chat pill, pause control, TileGrid, Choice/NavButtons, ConfirmCard, CardRow heading, GameCard chips, Pass mark, touch selection, tag under press); 3 new (CardRow track scrollbar and snap, sheet safe-area padding, popup button pair under 300px). CSS uses `/* KEEP: */`.
- `Button.jsx`, `press.js`, `ChatPicture.jsx`, `ChatPlayback.jsx`: existing hold/scroll comments prefixed.
- `CardRow.jsx`: end-button focus prefixed; one new (one card per press, reduced motion jumps).
- `ListRow.jsx`: three fit and accessible-name comments prefixed; one new (shortest forms under 440px, refit on fonts and resize).
- `Popup.jsx`: measuring comment rewritten as a `KEEP:` outcome; one new (focus in and back, Escape and dim close unless busy).

## Left alone

- `/* @kind other */` annotations in `components.css` and `tokens/motion.css` (compiler markers, not prose).
- Section labels in `tokens/*.css` and `components.css` (`/* ChatPicture */`, `/* Status */`…) and component header comments in `components/**` (mapping).
- `guidelines/source/design-system.html` (the original hand-off source).
- `docs/archive/**`, earlier handoffs and READMEs under `docs/specs/**`, `handoff-overlays-and-working-state.md`, `uploads/**`.
- `_ds_bundle.js` and other compiler output.
- No code, identifiers, classes or keys were changed.
