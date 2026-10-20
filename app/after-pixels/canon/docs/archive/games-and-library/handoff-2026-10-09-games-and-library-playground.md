---
date: '2026-10-09'
topic: 'games-and-library'
status: 'in-progress'
type: 'exploration'
---

# Handoff: games-and-library: Games page options 1 to 3 and the Library page, built as a playground

## Current Focus

The rig is built and waiting for Joe's review. Next: Joe tries options 1 to 3 signed out and signed in, at phone and desktop width, and picks a direction (or a combination). Nothing here is ratified. The background verifier did not run, because the nested-entry "file not found" warning is a false positive (see Learnings). Nobody has clicked through the rig yet.

## Task(s)

- **Source:** the playground prompt pasted in chat on 2026-10-09 ("MCP Game Store: Games page and Library page playground"), from Joe's words in `_context/log.md` and `joe-on-page-structure-2026-10-09.md`. No ticket id yet.
- **The question:** how does the Games page show every game with its information, and stay good at about 12 games and beyond?
- **Done:**
  - Three Games page options.
  - One Library page.
  - Top-bar Games and Library as plain links.
  - 12 sample games.
  - A strip of controls.
- **Not done:** the review, a pick, building the chosen design into `app/`.

### Games page options (strip: Games 1 / 2 / 3; Why shows idea and cost)
1. **A row for each kind** (`PgG1`). One heading per category, each with a sideways-scrolling card row (`.gs-feats`, the design system's scrolling card row). Cost: cards past the first few stay hidden until you scroll; a kind with one game gets a row of one.
2. **One grid with search and filter** (`PgG2`). Every game in one `gs-grid3`, using the fullest card (a copy of the prototype's Games card: kind label, tags, free or Pass line, edition line). Above the grid: `DS.SearchField` and kind chips. Cost: nothing leads; the unfiltered phone page is long.
3. **By how often it's new** (`PgG3`). Sections for "New every day", "New every week" and "Play any time", in wide cards (cover beside text from a 460px card width). Cost: you can't pick a kind; the grouping holds only while each game has one rhythm.

In all three, a card opens the product page, signed in or out. The "Played today / this week" mark is the prototype's existing `gsMarks`, kept as it was.

### Library page (one design, `PgLibrary`)
- H1 "Library". Signed in only.
- Layout: the app's all-plays layout (`lb-alllay`, `lb-tools`, `LbChoice`). Search, Kind and Order sit in a side column from 900px and stack on a phone. Beside them, one `lb-box` of `DS.ListRow`s.
- Each row: the game's name; a meta line with its kind and this player's state (`PG_ME`: "Played today", "Part of the Pass", "Not played yet"…); a chevron. Order: last played, or A to Z.
- Each row opens that game's library game page.
- **Faded row** (strip: Pass rows plain / faded, off by default): a Pass game is muted for a player without the Pass and stays clickable. The prompt calls this an idea, not a decision.

### Top bar
Games and Library are plain links with no dropdown. Library shows only when signed in. Nothing else in the bar changed. Implemented by overriding `window.GsGamesNav`, `GsNavExtra` and their `…Menu` versions.

## Critical References

- Settled limits, which every option holds:
  - A card opens the product page, never the library game page.
  - Pages are the same signed in and out.
  - No breadcrumbs.
  - Say "product page" and "library game page".
  - No "buy", "install", "owned" or "your games".
- Design law: `LatentMagic/monorepo` `specs/governance/standards/ui-design.md`, and the bound design system (`_ds/…/`).
- `skills/build-playground/SKILL.md`: rig rules (the real app, the strip, the Viewport control through the Config pill).

## Recent changes

- `docs/specs/games-and-library/playground/index.html`: a copy of the root `index.html` with three changes:
  - `<base href="../../../../" />`;
  - a "playground: Games and Library" CSS block at the end of `<style>` (`.pg-strip-*`, `.gl-*`);
  - one extra script tag for `pg-games-library.jsx` before `app/main.jsx`.
- `docs/specs/games-and-library/playground/pg-games-library.jsx`: all playground code.
  - Placeholder games are added into `GS_GAMES`, `GS_ART` and `GS_PAGES`.
  - `PG_ORDER` sets the 12-game order.
  - Cards, the options, the Library, a stand-in library page for placeholder games, the nav overrides and `PgStrip` (which replaces `window.GsDemoBar`).
- `playgrounds.json`: new ticket `games-and-library` at the top.
- `app/`: untouched.

## Learnings

- **Routes.** `main.jsx`'s `GS_ROUTES` can't grow from outside `app/`, so the rig reuses route `games`:
  - the Library is `games` + `{ lib: true }`;
  - a placeholder game's product page is `games` + `{ pid }`;
  - its library game page is `games` + `{ pid, page: 'record' }`.
  
  `pgOpen` and `pgOpenLib` route correctly for every game. Shipping the chosen design needs a real `library` route.
- **Overrides work.** Babel-compiled top-level `const`s are reachable globals, so `window.GsGames = …` before `main.jsx` replaces the screen. Earlier rigs rely on this too (`pg-hero-4.jsx`).
- **App code doesn't know the placeholder routes.** App components that call `gs.go(g.route)` for a placeholder game land on Games. The rig avoids this with copied cards (`PgCardRow` and `PgCardGrid` from `gs-home.jsx`; `PgLibCard` from `gs-player.jsx` `GpCard`), each carrying a source pointer.
- **False warning.** The preview's "38 referenced files not found" is a false positive at four `../`. The depth was checked by eye: tokens and covers render. The same warning stops `ready_for_verification` from forking the verifier, so check by hand.

## Artifacts

- `docs/specs/games-and-library/playground/index.html`
- `docs/specs/games-and-library/playground/pg-games-library.jsx`
- `docs/specs/games-and-library/README.md`
- `playgrounds.json`
- `localStorage` key `pg_games_library_v1` (option, faded, strip open). The rig opens signed out on Games.

## Action Items & Next Steps

1. Click through by hand, since the verifier didn't run:
   - each option at 390px and at 1024px or wider;
   - signed out, free and Pass;
   - the Library's search, filter and order, and the faded toggle;
   - a placeholder card through to its product page and back.

   Then reset `pg_games_library_v1`.
2. Put the pick to Joe: one option, or a combination (for example 1's rows with 2's search). Record the ratified decision here, with its date.
3. Ask Joe about the faded row.
4. Build the pair into `app/`: a real `library` route, plain Games and Library links in `gs-parts.jsx` and `gs-player.jsx`, and `GsGames` replaced in `gs-home.jsx`. Add states to `app/states.jsx` and a QA entry in `app/qa.jsx`.

## Other Notes

**Sample content, not decisions.**
- Five placeholder games: Daily Cipher (Puzzles, free, daily), Derelict (Adventure), Harbour Master (Strategy), The Barrow of Hollowmere (Adventure) and The Scribe of Ur (Learning activity).
- One placeholder kind, Strategy.
- Derelict and the Barrow reuse the prototype's coming-soon names and covers.

**My own choices, not ratified.**
- The "Coming soon" cards are left off every option.
- Placeholder product pages use the app's template with sample copy.
- Their library game page is a stand-in that says it isn't built.

**Unresolved.**
- Placeholder games don't appear in "More games" on product pages, which reads `GS_GAME_ORDER`.
- The Library has no empty state, since every game is always listed.

**Left as they are, per the prompt.**
- The signed-in home and the logo's target.
- The words "Games" and "Library".
- History.
- Pricing.
- The product page and library game page designs.
- How play is launched.
