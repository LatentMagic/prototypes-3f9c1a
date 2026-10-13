---
date: '2026-10-13'
topic: 'barrow-of-hollowmere'
status: 'in-progress'
type: 'implementation'
---

# Handoff: The Barrow of Hollowmere — added as a game, SoonCard adopted, one card-name decision open

## Current Focus

**Open decision, waiting on the owner:** The Barrow's name takes two lines on game cards, so every card in a row reserves a two-line name slot and the one-line names sit above an empty line (Available games on Home, More games on game pages). Nothing on GameCard is broken; the design system sizes the name slot to the longest name in the row. Recommended: a shorter card-only name ("Hollowmere"), full name kept on its own pages. Options: 1 shorter card name, 2 take the Barrow out of card rows, 3 accept the taller line. The owner has not chosen. Do not apply any until they do.

## Task(s)

- **SoonCard adopted** (done). The product's own Coming soon card is replaced by `DS.SoonCard` (`app/gs-parts.jsx`, `GsSoonCard`). The Barrow card carries label CHAPTER 2 and a "Play chapter 1" chip that opens the Barrow's page. Derelict is a whole game with no chapter chip.
- **Barrow added as a game** (done, content is sample). Storefront, product page, library page, chapter 1 as its edition. Details and unratified calls: `docs/specs/barrow-of-hollowmere/handoff-2026-10-13-barrow-added.md`.
- **SoonCard on a phone** (done, owner ratified option 2). Below 480px the cover runs full width on top as a 2:1 band, with the art at 4:3 centred and its ground filling the sides. One local rule in `index.html` (`@container gs (max-width: 479px)`). Record: `docs/specs/soon-card-phone/`.
- **Daily Word art** (done). The design system's updated GameArt now draws Daily Word (three equal tiles, outline tile fills on hover). The local copy was removed: `ga-w` rules in `index.html` and the `word` entry in `GS_ART_LOCAL` of `app/gs-parts.jsx`; `'word'` added to `GS_ART_MOTION`.
- **Design-system refresh.** The project's bundled copy under `_ds/` was out of date and was re-copied from source twice (`_ds_bundle.js`, `components/components.css`). `index.html` loads them with `?v=word3` so the browser cache does not serve the old one.

## Critical References

- `CLAUDE.md`: ratification rule (no decision without the owner's words) and the replying rules.
- `components/surfaces/SoonCard.prompt.md`, `GameCard.prompt.md`, `guidelines/game-art-motion.md` in the design system source (`/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/`).
- `docs/specs/barrow-of-hollowmere/handoff-2026-10-13-barrow-added.md`: the unratified list.

## Recent changes

- `app/gs-data.jsx`: `GS_GAMES.barrow` (ADVENTURE, `first: true`, `eds: true`, chapters as `ed`); `GS_SOON` Barrow entry (`label`, `play`, `route`); added to `GS_GAME_ORDER`.
- `app/gs-game.jsx`: product page content for `barrow`. `app/gs-chats.jsx`: three sample chat turns. `app/gs-player.jsx`: library band copy; "Go to your" drops a leading "The".
- `app/gs-barrow-library.jsx` (new): library page (placeholder, owner says not designed yet and fine as is), `bwEds` for All chapters. `app/gs-editions.jsx`: `ED3` includes games with `eds`. `app/gs-history.jsx`: `bwEds` for the Barrow.
- `app/gs-parts.jsx`: the cover helper for wide card art now draws a Barrow-style cover (art at the box's height, centred, on its own ground) so the row's picture slot keeps its ratio.
- `app/states.jsx`: `barrow-free`, `barrow-pass`, `library-barrow`, `library-barrow-free`, `barrow-all-chapters`.
- `playgrounds.json` and `docs/specs/soon-card-phone/playground/index.html`: board of four cover options.

## Learnings

- The picture slot and the name slot in a card row are both sized by the row's largest item. A new game with a long name or a differently shaped cover changes every card in the row. Check rows after adding any game.
- The preview caches the design system's bundle and CSS. After copying a new copy in, change the `?v=` on both links or the old one keeps rendering (this caused "the chips are still on two rows").
- The verifier's "referenced file not found" warning on nested playgrounds is a false positive when `<base>` depth is right; it also skips the automated check.
- Candidate for GOTCHA.md (needs the owner's approval): the cache-busting point above.

## Artifacts

Files listed under Recent changes, plus `docs/specs/soon-card-phone/handoff-2026-10-13-stack-on-phone.md` and `docs/specs/barrow-of-hollowmere/handoff-2026-10-13-barrow-added.md`.

## Action Items & Next Steps

1. Get the owner's answer on the Barrow's card name (above). Then apply it in one place and check Home, a game page's More games, and Discover at phone and desktop width.
2. Ask the owner whether the Barrow's chapter 2 / Delve question is closed: "Play chapter 1" now opens the Barrow's own page, not Delve's.
3. Design system: SoonCard should carry the below-480px stacking itself; then delete the local rule in `index.html`.
4. Ask before adding a CHANGELOG entry (a new game is a shape change).
5. `uploads/` holds four screenshots from this session; delete them when the owner is done with them.

## Other Notes

- The owner is frustrated by regressions. Keep replies short, say plainly what was touched, and put one decision per turn. GameCard was never edited; the owner asked that it not be.
- The Barrow's content (pitch, achievements, chat turns, "45–60 min", "At your own pace") is sample and not ratified. Game names are working titles.
