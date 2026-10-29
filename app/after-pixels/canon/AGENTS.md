# After Pixels prototype (canon)

After Pixels (afterpixels.com) is a library of games played by talking to your own AI (Claude, ChatGPT, any MCP assistant). The site sells the Pass and keeps your library, plays and history; this prototype is that site, edited here directly.

Paths below are relative to this folder (`app/after-pixels/canon/`); run commands from the repo root.

A no-build React page: `index.html` loads React and Babel from unpkg, the design system bundle, then each `app/*.jsx` as a `text/babel` script, in a fixed order. Files share everything through `window` (`Object.assign(window, { ... })`); nothing is imported.

## Where a screen lives

`main.jsx` maps each route to a `window` component (`app/main.jsx:48-80`). **A later file can republish a name an earlier one set, and the last in `index.html`'s load order wins.** Before editing a component, find every copy with `grep -nE "\b<Name>\b *[:,}]" app/*.jsx` and edit the one in the file `index.html` loads last.

| Route or surface | File that renders it |
|---|---|
| `home` | `gs-pass-home.jsx` (replaces `gs-home.jsx`'s; the hero chat is still in `gs-home.jsx`) |
| `games` (Discover) | `gs-pass-discover.jsx` (replaces `gs-discover.jsx`'s) |
| `library` | `gs-pass-library.jsx` (replaces `gs-discover.jsx`'s) |
| Product page (`word`, `delve`, `escape`…) | `gs-player.jsx` `gpGame` → `GsGamePage` in `gs-game.jsx`; game facts in `gs-data.jsx` `GS_GAMES` |
| Library game page (same route, `page: 'record'`) | `window.GS_LIBRARY[id]`; see below |
| `session` | `gs-session.jsx`: one shared head (`GsSessHead`), then the game's own body from `window.GS_SESSION_BODY[gid]` (`gs-escape.jsx`, `gs-word.jsx`, `gs-delve.jsx`), else the result and `GsMoves` |
| `history` | `gs-history.jsx` |
| `pass` / `subscribe`, `checkout`, `update-card` | `gs-pass-pricing.jsx` / `gs-billing.jsx` |
| Auth, `username`, `connect`, `account` | `gs-auth.jsx`, `gs-username.jsx`, `gs-connect.jsx`, `gs-account.jsx` |
| Top bar, footer, loaders, `legal`, `offline` | `gs-parts.jsx`, `gs-site.jsx` |
| Where, Chain, Salvage; ten more Pass-only games | `gs-where-chain-salvage.jsx`; `gs-more-games.jsx` |

A library game page is set by the game's file (`gs-puzzles-library.jsx` for the daily puzzles and Escape, `gs-casebook.jsx`, `gs-delve-library.jsx`, `gs-hunter-library.jsx`). `gs-pass-library.jsx` then wraps every game but hunter per the player's view and adds the Barrow (`:186`, `:218`), and `gs-editions.jsx:134-139` wraps each game with editions to show its editions list. Card parts are in `gs-library.jsx`.

Seed data (games, sessions, the player) is in `gs-data.jsx`; every fact a screen shows is held once there and read from it, never retyped. Who can play what is each game's `access` in `GS_GAMES`, derived at `gs-data.jsx:59`. Each session's moves are `GS_SESSIONS[sid].lines`, titled by that session's own `listTitle`.

## Styles

- Tokens: the design system's `tokens/*.css` and `components/components.css`, linked from `index.html:17-25` (canon's own `tokens.css` holds only the aids' properties). Use their custom properties; hierarchy is size and weight, never colour; 4px grid; readable from 320px.
- Product CSS is `app/*.css`, one file per area, all linked from `index.html:26-41` (no inline `<style>`). **Link order is the cascade: a later file wins a tie, so a rule that overrides another sits in a file linked after it.** Each file's first comment says what it holds. Find a rule with `grep -n "<class>" app/*.css`.

Shell and aids: `aids.css` (Config, States and QA palettes, phone frame, base reset), `gs-shell.css` (`.gs-root`, utilities, links, grids, session head, tags, top bar, demo bar), `gs-site.css` (loaders, footer, legal, not found, user menu).
Screens: `gs-home.css`, `gs-cards.css` (Discover, Library lists, game cards and their motion art), `gs-game.css` (product page), `gs-player.css`, `gs-library-page.css` (cards, streak, now card, editions list), `gs-session-history.css` (session parts every game shares; History), `gs-auth.css` (sign in, username), `gs-connect.css` (How it works, play dialog), `gs-account.css`, `gs-pass.css` (pricing, upsell, Home Pass card).
Game session bodies: `gs-escape.css`, `gs-word.css`, `gs-delve.css`.

- `!important` is kept where it beats an inline `style={{}}` or a design-system rule it cannot out-rank; test any removal with the check.
- Before adding a class, grep for it: a name already used elsewhere restyles that too (`GOTCHA.md` 13).

## Reuse before you build

Build from the design system's components, `DS.<Name>` (`const DS` at `gs-data.jsx:5`), and canon's shared parts. Never build a one-off where one of these fits; if none does, say so in your report.
- Design system: the list is in `_ds/mcp-game-store-design-system-ef1abd5b-…/readme.md`; each component's use is in `../design-system/components/<group>/<Name>.prompt.md`. Guidelines (voice, layout, overlays, loading): `../design-system/guidelines/`.
- Canon parts: `gs-parts.jsx` (covers, art, tags, cards, `GsStat`, `GsTrack`, top bar), `gs-site.jsx` (glyphs, spinners, `GsPart`, footer), `gs-session.jsx` (`GsSessHead`, `GsSessResult`, `GsMoves`, share pop-up), `gs-library.jsx` (`LbHead`, `LbResult`, `LbAch` and the other library card parts).
- Canon loads its own copy of the design system in `_ds/`; `../design-system/` is the source. Changing a component is a design-system change: do it only when the brief asks, in both copies (`4d5bdfc` is one).

## Serve and check

- Serve with `PORT=<port> npm start` (default 4321), then open `http://localhost:<port>/app/after-pixels/canon/index.html`. Never `python3 -m http.server`: it lets the browser cache JSX, so edits do not show.
- A state is a URL: `?state=<id>` (ids in `app/states.jsx`, or `?state=index` for the list). Add `&fast` to skip the staged 1.2 s page-arrival wait. Content still arriving carries `aria-busy="true"`.
- **Screenshot with the check, not by hand:**
  `PORT=<port> npm run check -- --app after-pixels --states <id>,<id> --widths 1440,390 --out <dir>`
  It starts the server if none answers, waits until the page is ready, writes `<dir>/<id>-<width>.png` (full page) and prints console errors per shot. An unknown id prints FAIL. Name only the states your change touches: that takes seconds.
- To prove a refactor changed nothing, run `--states all` (about 3 min) before and after, then `npm run diff -- <dirA> <dirB>` (diff images in `<dirB>/_diff/`; exit 1 on any difference). The `loading-*` states and `home` differ run to run on their own.
- Use `playwright-cli` only to click or type through a flow. Pass the session first: `playwright-cli -s=<name> open "<url>"`, then `-s=<name> click <ref>` with a ref from `-s=<name> snapshot`, and `-s=<name> screenshot --filename=<absolute path>`.
- A reload restarts the prototype on its seed data; React `createRoot` warnings after a reload are expected. Neither is a finding.

A change that makes a situation hard to reach (an account state, a failed play, a game mid-run) adds its state in the same change: read `ARCHITECTURE.md` § Addressable states first.

## Owner rulings that bind every change

- A design or copy decision is the owner's. Build what the brief says; name anything you chose yourself in your report.
- **Session page:** the top section is the platform's and the same for every game; below it the play is told in the game's own terms, on the store's background and chrome. Each game's part has a **result statement**, the element that states the outcome outright (Escape: the open door and "Escaped").
- **Library game page:** four cards on one grid: the **now card** (the current or latest edition, carrying the result statement down) and the **streak card** (the run of days or weeks played) above Achievements and Your plays. Never break, reorder or restack the rows on desktop. Cards in a row end level by arranging what is inside, never by stretching; check each card with its fewest and most items. On a phone they stack in the same order.
- **Product page:** it tells a stranger what they will do and why they would want it, using only true things; cut any line that excuses, hedges or lowers expectations, and never leave a slot blank.
- Earlier rulings and handoffs: `docs/specs/<ticket>/` (e.g. `docs/specs/1236-session-pages/README.md`).

## Code and record

- Before writing a comment, a style object or a new module, read `ARCHITECTURE.md` § Conventions.
- `CHANGELOG.md`: one short entry per step that changes the product's shape, never for tweaks or fixes.
- Never add a `GOTCHA.md` entry without the owner's yes; propose it in your report.
- A playground or rig: follow `kit/project/skills/build-playground/SKILL.md` (from the repo root), and regenerate `playgrounds.json` in the same change.

Read on demand: `ARCHITECTURE.md` (postures, deletable aids, states, conventions); `GOTCHA.md` before animated overlays, `position: fixed` inside a transform, or moving styles in; `app/README.md` before adding a Config row or QA entry.
