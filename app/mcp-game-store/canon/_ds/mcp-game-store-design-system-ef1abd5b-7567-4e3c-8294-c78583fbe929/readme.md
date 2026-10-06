# MCP Game Store Design System

Working title. MCP Game Store is a shop of small games you play by talking to an AI assistant (Claude or ChatGPT) over MCP. Players browse covers, connect their assistant, and start a game in chat. New games arrive every day: daily puzzles, a weekly interrogation, murder mysteries, escape rooms, dungeon quests, word puzzles.

The system is one dark surface: warm near-black pages, off-white type and actions, square corners, and colour that lives only in game covers and status. The shop itself has no colour.

## Sources

- Local hand-off folder `design-system/` (README.md, rules.md, voice.md, design-system.html, circlists-reuse.md, ui-design.md, shots/). Copies are in `guidelines/source/` and `guidelines/source-shots/`. Decisions dated 2026-10-06.
- GitHub: [LatentMagic/monorepo @ main, `specs/governance/standards/`](https://github.com/LatentMagic/monorepo/tree/main/specs/governance/standards), chiefly [`ui-design.md`](https://github.com/LatentMagic/monorepo/blob/main/specs/governance/standards/ui-design.md), the cross-app UI standard. The `ui-design-gallery/*.webp` pictures in that folder are ~130-byte LFS pointers and could not be viewed. Explore the repo further (`error-handling.md`, `validation.md`, Circlists specs) for more context when designing.
- `guidelines/ui-standard.md` summarises what this system adopts from the standard.

**Not decided upstream** (do not invent): how shapes are assembled into a cover, the layout of any screen, product features, thin-line vs solid icons. The owner supplied the logo mark (`assets/logo.svg`).

## Index

- `styles.css`: entry point, `@import`s only.
- `tokens/`: `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `motion.css`, `effects.css`, `base.css`.
- `components/components.css`: class styles (`mcp-*`) used by the React components.
- `components/actions/`: **Button**, **ButtonPair**, **TextLink**
- `components/forms/`: **TextField**, **SearchField**, **Checkbox**
- `components/feedback/`: **Tag**, **StatusMessage**, **ProgressBar**, **Loader**
- `components/surfaces/`: **Card**, **Heading**, **ShapePanel**, **Popup**, **Disclosure**
- `components/media/`: **Cover**, **Icon**
- `ui_kits/shop/`: click-through composing the components (All games, game page with delete pop-up, sign in).
- `guidelines/cards/`: foundation and pattern specimen cards.
- `guidelines/ui-standard.md`: adopted rules from the cross-app standard.
- `assets/logo.svg` (mark) and `assets/logo/` (PNG 16, 32, 180, 512, 1024), supplied by the owner.
- `assets/shapes/`: the shape set (currentColor fills).
- `assets/icons/{line,solid,ui}/`, `assets/covers/`, `assets/shape-blocks/`: SVGs extracted from the hand-off.
- `SKILL.md`, `github.md`, `thumbnail.html`.

Component inventory = every piece the hand-off's design-system.html defines. **Intentional additions:** `Icon` (wrapper so the hand-off's glyphs are reusable), `Heading` (the three heading sizes as one component), `ButtonPair` (the hand-off's `.pair` layout).

## Content fundamentals

Voice: **cold open, with a dare.** One line from inside the game, then the copy turns to the reader and puts them on the spot. Excitement comes from stakes, never adjectives.

- First sentence is inside the game's situation, present tense. Address "you", never "players", "users" or "we".
- Last sentence gives the next move ("Your move.", "Say what you do first.").
- Max 15 words a sentence, three sentences a blurb. Everyday words, contractions, British spelling (colour, centred).
- Never: exclamation marks, em dashes, question hooks ("Ready to play?"), hype words (amazing, epic, thrilling, immersive, unleash, awaits, fun), "not just X but Y", delve, adjective triplets, realm/portal, shelf/book/box imagery, story names/places/clues.
- Never state unrecorded product facts: prices, "free", trials, durations, a product name. (The hand-off shows a "Free" tag; check before shipping it.)
- Emoji: none.
- Casing: sentence case for headings, buttons and labels ("Add to Claude", "Delete save", "All games").
- Buttons name the action: "Choose a game", "Delete save", "Keep it", "Stay connected". Never "OK" or "Submit".
- Two settings. Shop front takes the full voice. Working screens (instructions, errors, confirmations) say the plain thing first, then at most one short voice line. Errors and payments never carry a dare.

Samples chosen by the owner:
- Headline: "Someone's lying to you. Go and find out who." Under it: "Small games you play by talking to Claude or ChatGPT. New ones every day."
- Murder mystery: "There's a body, a locked door and a story that doesn't add up. Your move."

Drafts, not yet seen by the owner (full list in `guidelines/source/voice.md`):
- Nothing played: "You haven't played anything yet. Pick one and see what it does when you talk back." Button: "Choose a game".
- Payment failed: "Your card was declined and nothing has been charged." Button: "Try again".
- Disconnect: "Disconnect your assistant? Your saved progress stays. It won't be able to start games." Buttons: "Disconnect", "Stay connected".

## Visual foundations

- **Colour.** Warm neutrals: page #1B1917, card #262320, pop-up #322E2A, line #37332E, control edge #918B80; text #F0EEE8, muted #ABA79E. The single accent is off-white #EDE8DF (main button, links, selected-tab line, small labels, progress, ticks). Status: success #4CC38A, warning #FFD23A, error/delete #FF6B5E, each with a dark on-colour. Strong colour appears only in covers, shape blocks and status. No blue, no navy ground, no player-chosen colour.
- **Type.** Bricolage Grotesque 700 at -0.01em for headings (34 / 24 / 20px; cover names 15px; disclosure titles 17px). Hanken Grotesk 400 body 16/1.5, 600 for labels (14px), buttons (16px) and small labels (13px). Inputs never under 16px. `text-wrap: balance` on headings.
- **Spacing.** 4, 8, 12, 16, 24, 36px. Controls 48px high; touch floor 44px.
- **Corners.** Radius 0 everywhere, including inputs, tags, pop-ups and checkboxes. The only round things are the spinner and circles inside cover art.
- **Surfaces.** Page, card and pop-up are told apart by fill, outline and shadow. Card: 1px line border + `--shadow-card` (0 1px 2px, 0 6px 12px -6px, 55% black). Pop-up window: 1px control-edge border + card shadow. Sheet: control-edge top line + upward `--shadow-sheet`. No inner shadows, no glow.
- **Backgrounds.** Flat solid fills only. No gradients, textures, photos, blur or full-bleed imagery. Imagery is the covers: flat geometric shapes (squares, circles, triangles, bars) in solid cover colours on indigo #1D1B3A, wine #421A28 or forest #163328. The three covers in the system are examples, not ratified designs. A screen with no cover gets a small 120×76 shape block in the top-right corner of its panel.
- **Transparency.** Only the 55% black dim behind pop-ups, and `color-mix` tints (14% fills for neutral tags and status messages, 45% for their borders).
- **Motion.** One curve, cubic-bezier(.16,1,.3,1). Press 120ms, label swap 160ms (old label rises out, new one rises in from 6px), dim 200ms, dropdown 220ms (height via grid rows, chevron rotates 180°), pop-up 260ms (sheet slides up; window fades while rising from -46% to -50%). No bounces. All motion off under `prefers-reduced-motion`.
- **Press states.** Every button answers a press: scale .97 and darken (main mixes 74% off-white into page; secondary fills 16% text; delete mixes 78% red with black). Links drop to .55 opacity. Pressed look holds for at least 120ms on quick taps.
- **Hover.** Not specified in the hand-off beyond the pointer cursor. Show the pointer on every interactive element; don't invent hover colours without a decision.
- **Focus.** 2px off-white outline, 2px offset. Inputs also turn their border off-white.
- **Borders.** 1px #37332E for structure, 1px #918B80 on inputs and pop-ups, 1.5px #918B80 on secondary buttons, dashed 1.5px for the locked tag.
- **Layout.** Phone first, then widen. On desktop, arrange rather than stretch: full-width buttons belong on phones; on wide screens buttons keep natural width. Pairs share one width (secondary first, then main). No stranded phone-width column on desktop. No fixed elements are defined.

## Adaptive patterns (from ui-design.md)

- **Pop-up = window on desktop, bottom sheet on phones.** `Popup` swaps at 640px by default (`breakpoint` prop; per-surface values are allowed). Same title, text and buttons in the same order at both widths.
- Hover becomes tap on touch.
- Destructive actions look different before the press: red link for light actions, filled red for heavy ones.
- Prefer a plain statement to a disabled control.
- Errors inline, after the first submit, then live; a refused submit moves focus to the first invalid field.
- Focus returns to the opener when a pop-up closes. Escape and the dim close it.
- No toasts: the changed state is the acknowledgement (e.g. "Add to Claude" → "Added").
- Confirm only serious, hard-to-undo actions, naming the consequence.

## Iconography

- The hand-off defines its own 24px SVG set, extracted to `assets/icons/` and wrapped by `Icon`. Shop icons (search, back, close, lock, play, settings) exist in two drawings: **line** (1.75 stroke, square caps, mitred joins) and **solid** (filled, sharp corners). Which one ships is **not decided**; use one per screen, `line` by default.
- UI glyphs (check 2.25 stroke, warn, error, chevron-down) are single-style and used inside states: field errors, status messages, label swap, disclosure.
- All icons use `currentColor`. Default size 20px; 14px inside tags; 28px in specimens.
- No icon font, no PNG icons, no emoji, no unicode glyphs as icons. No third-party set is used; if one is needed, ask first.
