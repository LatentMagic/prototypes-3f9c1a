# Session pages 2

A playground of three options for each game's session page. Each option is a whole page: canon's top section, the option's own area, then "Every move" as canon's plain list, closed. Built for Daily Word; Escape, Delve and Daily Mystery are added the same way. The first session-pages playground (`../session-pages/`) is left as it was.

## Mounting

`index.html` sets `<base href="../../canon/">`, reads `canon/index.html` live (its styles and scripts, in its order) and loads canon's modules and `main.jsx` unchanged. Nothing in `canon/` is copied or edited. The page replaces only the routed page, through canon's `window.KitCandidate.Screen`; the top bar, footer, popups and demo bar are canon's.

- `harness/page.jsx`: `Sp2Page` = back link, `Sp2Top` (canon's session head, composed from canon's parts as `GsSessionRecord` draws it: cover, edition, result, date, Play for a play in progress, Share, the played-once line), the option's area (`.sp2-area`, a container named `sp2`), `Sp2EveryMove` (canon's list in the design system's Disclosure, closed).
- `harness/stage.jsx`: stages the state as canon's states register does, mounts the page, and puts the rail in canon's Config modal below 1024.
- `harness/rail.jsx`, `harness/boot.jsx`: the rail, docked at 1024 and up.
- `harness/store.js`: option registry and selection. Address `?g=<game>&o=<1..3>&s=<state>`; storage key `pg_session-pages-2_v1`.

## Cache

Every playground script and stylesheet loads with `?v=<version>` (`harness/games.js`, and the two script tags in `index.html`'s head). Bump all three on each push, so a returning browser gets the new build.

## Adding a game

1. Add an entry to `harness/games.js`: id, name, `css`, `files`, and its states (`{ id, label, sid, week }`, `sid` a `GS_SESSIONS` key).
2. Under `games/<id>/`, seed any session the state needs (add to `GS_SESSIONS`), and write one file per option:

```jsx
(function () {
  const Area = ({ s, sid, stateId }) => { /* the option's own area only */ };
  sp2Option('delve', 1, { name: 'Short name', stance: 'The idea, one sentence.', cost: 'What it gives up.', Component: Area });
})();
```

The option draws only its area. It never draws the top section or the list. Size it with `@container sp2 (min-width: ...)`. Prefix its classes with the game.

## Daily Word

`games/word/model.jsx` holds the three plays, the recoloured cover and the tiles. The seeds follow the record (`libs/mcp-games/backend/daily-word/src/lib/domain/session-record.ts`) and the game spec: each hint names a letter in its place ("Letter 2 is T."). A failed play never prints the answer.

- **Solved** No. 212: CRANE, SLATE, hint (letter 2 is T), STILL.
- **Failed** No. 208: CRANE, hint (letter 1 is S), SHADE, SHAME, SHAPE, SHARE, SHAVE.
- **In progress** No. 212: CRANE, SLATE, no hint.

Colours come from the **colour config** in the rail, under the options (in the Config modal below 1024px), from `games/word/colours.jsx`. It sets CSS variables on `<html>`, so the cover and options 1 and 2's tiles change together. Its settings: the cover ground; the colours for in place, in the word and not in the word; how not in the word is drawn (filled; outline; the cover block; or the letter alone); and the letter colour on each. Each has named presets and a hex field. Options: 1 Rows, fixed width; 2 the same rows in the store's card, wider from 640px (board up to 760px, tiles up to 96px tall) and on the content column's left edge; 3 Large board, hint beside (option-1.jsx registers 1 and 2). One palette, brand green (A, the owner's choice, 2026-10-27), takes one click, with a reset beside it: the cover on its own forest ground (`#163328`), success `#4CC38A`, the tiles on the dark page. Palettes B and C are gone; any `&pal=` in the address (an old `b` or `c` included) opens on A. Each colour shows its contrast against the page and the cover ground. The choice is kept in `localStorage` (`pg_session-pages-2_word-colours_v2`); a stored B or C falls back to A. No light or cream ground is used (owner, 2026-10-27).

The cover's block for a letter not in the word rests as a small, thin grey outline; on hover, keyboard focus (the cover is focusable) or a tap, it grows to full block size and fills. With reduced motion it switches without the growth. The config's Filled keeps it full, Outline keeps it at rest. The Backgrounds sheet's covers do the same. The board's tiles have no hover. An empty slot's edge is `#746E65` (`--wd-empty-edge`), 3:1 against the card and the page.

Option 3 sits on the page itself, with no ground or panel behind the board and hint, as the Backgrounds sheet's idea 3 (owner, 2026-10-27). Its hint is the drawing and a one-word "Hint" label; the sentence ("Hint, after guess 2: Letter 2 is T.") is its `aria-label`.

The cover override changes `GS_ART.word` in memory, so only the static cover is recoloured. The design system's animated `GameArt` for Daily Word (library, Discover) keeps its old colours.
