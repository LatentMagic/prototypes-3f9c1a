# Session pages 2

A playground of three options for each game's session page. Each option is a whole page: canon's top section, the option's own area, then "Every move" as canon's plain list, closed. Built for Daily Word; Escape, Delve and Daily Mystery are added the same way. The first session-pages playground (`../session-pages/`) is left as it was.

## Mounting

`index.html` sets `<base href="../../canon/">`, reads `canon/index.html` live (its styles and scripts, in its order) and loads canon's modules and `main.jsx` unchanged. Nothing in `canon/` is copied or edited. The page replaces only the routed page, through canon's `window.KitCandidate.Screen`; the top bar, footer, popups and demo bar are canon's.

- `harness/page.jsx`: `Sp2Page` = back link, `Sp2Top` (canon's session head, composed from canon's parts as `GsSessionRecord` draws it: cover, edition, result, date, Play for a play in progress, Share, the played-once line), the option's area (`.sp2-area`, a container named `sp2`), `Sp2EveryMove` (canon's list in the design system's Disclosure, closed).
- `harness/stage.jsx`: stages the state as canon's states register does, mounts the page, and puts the rail in canon's Config modal below 1024.
- `harness/rail.jsx`, `harness/boot.jsx`: the rail, docked at 1024 and up.
- `harness/store.js`: option registry and selection. Address `?g=<game>&o=<1..3>&s=<state>`; storage key `pg_session-pages-2_v1`.

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

Tile colours (`games/word/word.css`) are used in every option and on the cover:

- In place: `#2B6448`, filled. The old cover's forest ground `#163328` at the same hue, lifted to 28% lightness so it reads on a dark ground.
- In the word: `#E5A63B`, the cover's amber, filled.
- Not in the word: an outline in `#918B80`, the store's control edge, with a muted letter. It is never filled on a tile, so a filled tile always outranks it.
- A guess not yet made: an outline in `#37332E`, the store's line colour.

No light or cream ground anywhere (owner, 2026-10-27). The cover's ground becomes indigo `#1D1B3A`, a cover ground already in the palette. Its outlined block is the not-in-the-word block, and it fills on hover. The override changes `GS_ART.word` in memory, so only the static cover is recoloured. The design system's animated `GameArt` for Daily Word (library, Discover) keeps its old colours.
