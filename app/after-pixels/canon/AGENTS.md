# After Pixels prototype (canon)

After Pixels (afterpixels.com) is a library of games played by talking to your own AI (Claude, ChatGPT, any MCP assistant). The site sells the Pass and keeps your library, plays and history; this prototype is that site, edited here directly.

Paths below are relative to this folder (`app/after-pixels/canon/`); run commands from the repo root.
Source is ES modules: `app/main.jsx` imports every `app/*.jsx`, and `npm run build` bundles them into `build/canon.js` and `build/canon.css`, which `index.html` loads (React loads as a page script first; the design system's bundle and stylesheet are built in). Edit `app/`, then rebuild; never edit `build/`.
- **Build:** `npm run build` (`tools/ap-names.mjs --check`, then Vite). Any change requires a build: a design-system change runs `npm run build:ds` first. **Never push to `main` without running it and committing `build/`**: Pages serves the committed files, no hook enforces it, and a second build must leave `git status` clean. `npm run build -- --watch` rebuilds on save.
- **Add a file or name:** declare a name in one file only (a second declaration fails the build), `export` it, `import` it where used, and `import` a new `app/<name>.jsx` from `main.jsx` (a CSS file: `@import` in `app/canon.css`, after any file it must beat). `window` carries only `KIT_STATES`, `KIT_STATE_NOTES`, `kitGoState`, `gsApi`, `KitCandidate`, `__gsTrap` and the design system. `node tools/ap-names.mjs --check` fails on a missing import (otherwise it throws only when that screen renders); without `--check` it lists each file's imports.
- **Load-time code:** a file whose top level writes to or reads another file's data (the registries in `app/registry.js`, seed objects) does it inside an exported `init<File>()` that `main.jsx` calls, in order: a read before the file it reads from has run gets `undefined`. Keep that order when adding one. `npm run build` fails if an init runs before one it needs; `node tools/ap-names.mjs --order` prints each init in run order with what it sets and why it sits after the inits it needs.

## Where a screen lives

`main.jsx` maps each route to a component (`case 'games': return <GsGames />` and the rest of its `switch`). Each name is declared in one file: find it with `grep -nE "(function|const|let) <Name>\b" app/*.jsx`.

| Route or surface | File that renders it |
|---|---|
| `home` | `gs-pass-home.jsx` (the hero chat is in `gs-home.jsx`) |
| `games` (Discover) | `gs-pass-discover.jsx` |
| `library` | `gs-pass-library.jsx` |
| Product page (`word`, `delve`, `escape`…) | `gs-player.jsx` `gpGame` → `GsGamePage` in `gs-game.jsx`; game facts in `gs-data.jsx` `GS_GAMES` |
| Library game page (same route, `page: 'record'`) | `GS_LIBRARY[id]` (`app/registry.js`); see below |
| `session` | `gs-session.jsx`: one shared head (`GsSessHead`), then the game's own body from `GS_SESSION_BODY[gid]` (`gs-escape.jsx`, `gs-word.jsx`, `gs-delve.jsx`), else the result and `GsMoves` |
| `history` | `gs-history.jsx` |
| `pass` / `subscribe`, `checkout`, `update-card` | `gs-pass-pricing.jsx` / `gs-billing.jsx` |
| Auth, `username`, `connect`, `account` | `gs-auth.jsx`, `gs-username.jsx`, `gs-connect.jsx`, `gs-account.jsx` |
| Top bar, footer, loaders, `legal`, `offline` | `gs-parts.jsx`, `gs-site.jsx` |
| Where, Chain, Salvage; ten more Pass-only games | `gs-where-chain-salvage.jsx`; `gs-more-games.jsx` |

A library game page is set by the game's file (`gs-puzzles-library.jsx` for the daily puzzles and Escape, `gs-casebook.jsx`, `gs-delve-library.jsx`, `gs-hunter-library.jsx`). `initGsPassLibrary()` then wraps every game but hunter per the player's view and adds the Barrow, and `initGsEditions()` wraps each game with editions to show its editions list. Card parts are in `gs-library.jsx`.

Seed data (games, sessions, the player) is in `gs-data.jsx`; every fact a screen shows is held once there and read from it, never retyped. Who can play what is each game's `access` in `GS_GAMES`, derived by `gsAccess` in `gs-data.jsx`. Each session's moves are `GS_SESSIONS[sid].lines`, titled by that session's own `listTitle`.

## Styles

- Tokens: the design system's `tokens/*.css` and `components/components.css`, imported through `../design-system/styles.css` by `app/canon.css` (canon's own `tokens.css` holds only the aids' properties). Use their custom properties; hierarchy is size and weight, never colour; 4px grid; readable from 320px.
- Product CSS is `app/*.css`, one file per area, imported by `app/canon.css` and built into `build/canon.css` (no inline `<style>`). **Import order is the cascade: a later file wins a tie, so a rule that overrides another sits in a file imported after it.** Each file's first comment says what it holds. Find a rule with `grep -n "<class>" app/*.css`.
- Shell and aids: `aids.css` (Config, States and QA palettes, phone frame, base reset), `gs-shell.css` (`.gs-root`, utilities, links, grids, session head, tags, top bar, demo bar), `gs-site.css` (loaders, footer, legal, not found, user menu).
- Screens: `gs-home.css`, `gs-cards.css` (Discover, Library lists, game cards and their motion art), `gs-game.css` (product page), `gs-player.css`, `gs-library-page.css` (cards, streak, now card, editions list), `gs-session-history.css` (session parts every game shares; History), `gs-auth.css` (sign in, username), `gs-connect.css` (How it works, play dialog), `gs-account.css`, `gs-pass.css` (pricing, upsell, Home Pass card).
- Game session bodies: `gs-escape.css`, `gs-word.css`, `gs-delve.css`.

- `!important` is kept where it beats an inline `style={{}}` or a design-system rule it cannot out-rank; test any removal with the check.
- Before adding a class, grep for it: a name already used elsewhere restyles that too (`GOTCHA.md` 13).

## Reuse before you build

Build from the design system's components, `DS.<Name>` (`DS`, exported by `gs-data.jsx`), and canon's shared parts. Never build a one-off where one of these fits; if none does, say so in your report.
- Design system: the list is in `../design-system/readme.md`; each component's use is in `../design-system/components/<group>/<Name>.prompt.md`. Guidelines (voice, layout, overlays, loading): `../design-system/guidelines/`.
- Canon parts: `gs-parts.jsx` (covers, art, tags, cards, `GsStat`, `GsTrack`, top bar), `gs-site.jsx` (glyphs, spinners, `GsPart`, footer), `gs-session.jsx` (`GsSessHead`, `GsSessResult`, `GsMoves`, share pop-up), `gs-library.jsx` (`LbHead`, `LbResult`, `LbAch` and the other library card parts).
- Canon builds the design system from `../design-system/` (its `styles.css` and `_ds_bundle.js`); there is no copy. Changing a component is a design-system change: do it only when the brief asks, then run `npm run build:ds` (writes `_ds_bundle.js`) and `npm run build`.

## Serve and check

- In a fresh checkout or worktree, run `npm ci` once. Build first (`npm run build`). Serve with `PORT=<port> npm start` (default 4321), then open `http://localhost:<port>/app/after-pixels/canon/index.html`. Never `python3 -m http.server`: it lets the browser cache the build, so edits do not show.
- A state is a URL: `?state=<id>` (`?state=index` lists every id; many are generated by lists the game files export, such as `DP_PZ_STATES`, so a grep of `app/states.jsx` misses them). Add `&fast` to skip the staged 1.2 s page-arrival wait. Content still arriving carries `aria-busy="true"`.
- **Screenshot with the check, not by hand** (it runs `npm run build` first; `--no-build` skips that, `--react-dev` serves development React for React warnings and full error messages, so rerun a crashing state with it):
  `PORT=<port> npm run check -- --app after-pixels --states <id>,<id> --widths 1440,390 --out <dir>`
  It starts the server if none answers (and stops it afterwards: run `npm start` yourself to click through), waits until the page is ready, writes `<dir>/<id>-<width>.png` (full page) and prints console errors per shot. An unknown id prints FAIL. Name only the states your change touches: that takes seconds.
- To prove a refactor changed nothing, run `--states all` (about 90 s) before and after, then `npm run diff -- <dirA> <dirB>` (diff images in `<dirB>/_diff/`; exit 1 on any difference). The `loading-*` states and `home` differ run to run on their own.
- Use `playwright-cli` only to click or type through a flow. Pass the session first: `playwright-cli -s=<name> open "<url>"`, then `-s=<name> click <ref>` with a ref from `-s=<name> snapshot`, and `-s=<name> screenshot --filename=<absolute path>`.
- A reload restarts the prototype on its seed data; that is not a finding.
- A change that makes a situation hard to reach (an account state, a failed play, a game mid-run) adds its state in the same change: read `ARCHITECTURE.md` § Addressable states first.

## Owner rulings that bind every change

- A design or copy decision is the owner's. Build what the brief says; name anything you chose yourself in your report.
- **Session page:** the top section is the platform's and the same for every game; below it the play is told in the game's own terms, on the store's background and chrome. Each game's part has a **result statement**, the element that states the outcome outright (Escape: the open door and "Escaped").
- **Library game page:** four cards on one grid: the **now card** (the current or latest edition, carrying the result statement down) and the **streak card** (the run of days or weeks played) above Achievements and Your plays. Never break, reorder or restack the rows on desktop. Cards in a row end level by arranging what is inside, never by stretching; check each card with its fewest and most items. On a phone they stack in the same order.
- **Product page:** it tells a stranger what they will do and why they would want it, using only true things; cut any line that excuses, hedges or lowers expectations, and never leave a slot blank.

## Code and record

- Before writing a comment, a style object or a new module, read `ARCHITECTURE.md` § Conventions.
- `CHANGELOG.md`: one short entry per step that changes the product's shape, never for tweaks or fixes.
- Never add a `GOTCHA.md` entry without the owner's yes; propose it in your report.

Read on demand: `ARCHITECTURE.md` (postures, deletable aids, states, conventions); `GOTCHA.md` before animated overlays, `position: fixed` inside a transform, or moving styles in; `app/README.md` before adding a Config row or QA entry.
