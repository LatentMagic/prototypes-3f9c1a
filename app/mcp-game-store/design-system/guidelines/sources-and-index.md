# Sources and index

## Sources

- Local hand-off folder `design-system/` (README.md, rules.md, voice.md, design-system.html, circlists-reuse.md, ui-design.md, shots/). Copies are in `guidelines/source/` and `guidelines/source-shots/`. Decisions dated 2026-10-06.
- GitHub: [LatentMagic/monorepo @ main, `specs/governance/standards/`](https://github.com/LatentMagic/monorepo/tree/main/specs/governance/standards), chiefly [`ui-design.md`](https://github.com/LatentMagic/monorepo/blob/main/specs/governance/standards/ui-design.md), the cross-app UI standard. The `ui-design-gallery/*.webp` pictures in that folder are ~130-byte LFS pointers and could not be viewed. Explore the repo further (`error-handling.md`, `validation.md`, Circlists specs) for more context when designing.
- `guidelines/ui-standard.md` summarises what this system adopts from the standard.

**Not decided upstream** (do not invent): how shapes are assembled into a cover, the layout of any screen, product features. The owner supplied the logo mark (`assets/logo.svg`).


## Index

- `styles.css`: entry point, `@import`s only.
- `tokens/`: `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `motion.css`, `effects.css`, `base.css`.
- `components/components.css`: class styles (`mcp-*`) used by the React components.
- `components/actions/`: **Button**, **ButtonPair**, **TextLink**
- `components/forms/`: **TextField**, **SearchField**, **Checkbox**
- `components/feedback/`: **Tag**, **StatusMessage**, **ProgressBar**, **Loader**
- `components/surfaces/`: **Card**, **Heading**, **FormCard**, **Popup** (dialog, panel), **Menu**, **Disclosure**, **PageGrid**, **CardRow** + **GameCard**, **GamePick**, **GameTile**, **ListRow** + **RowList**
- `components/media/`: **Cover**, **Icon**, **GameArt** (moves only with the link or button it sits in, otherwise still; its built-in pieces are examples, not the game library)
- `ui_kits/shop/`: click-through composing the components (All games, game page with delete dialog, sign in; working states on Add to Claude, Delete save and Sign in).
- `guidelines/cards/`: foundation and pattern specimen cards.
- `guidelines/ui-standard.md`: adopted rules from the cross-app standard.
- `guidelines/game-art-motion.md`: game art motion, when art moves, hover surface, touch, and the describe-then-draw rule for art in each frame shape. The three pieces in it are examples.
- `assets/logo.svg` (mark) and `assets/logo/` (PNG 16, 32, 180, 512, 1024), supplied by the owner.
- `assets/shapes/`: the shape set (currentColor fills).
- `assets/icons/{line,ui}/`, `assets/covers/`, `assets/shape-blocks/`: SVGs extracted from the hand-off.
- `SKILL.md`, `github.md`, `thumbnail.html`.

Component inventory = every piece the hand-off's design-system.html defines. **Intentional additions:** `Icon` (wrapper so the hand-off's glyphs are reusable), `Heading` (the three heading sizes as one component), `ButtonPair` (the hand-off's `.pair` layout), `Menu` (the menu kind of overlay, added 2026-10-08 for the cross-app overlay rule), `PageGrid` and `ListRow`/`RowList` (2026-10-08, lifted from the Casebook library page review, option 16).
