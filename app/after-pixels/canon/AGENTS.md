# After Pixels prototype (canon)

After Pixels (afterpixels.com) is a library of games played by talking to your own AI (Claude, ChatGPT, any MCP assistant). The site sells the Pass and keeps your library, plays and history; this prototype is that site, edited here directly.

Paths below are relative to this folder (`app/after-pixels/canon/`); run commands from the repo root.

## Project map

- `app/` — the source, ES modules. `main.jsx` imports every `.jsx` file, maps each route to a component (its `switch`), and calls each exported `init<File>()` in order. Edit here.
- `app/registry.js` — the per-game registries: `GS_LIBRARY`, `GS_EDITIONS`, `GS_SESSION_BODY`.
- `app/gs-data.jsx` — seed data (games in `GS_GAMES`, sessions in `GS_SESSIONS`, the player) and `DS`, the design system's components.
- `app/states.jsx` — the state register (`KIT_STATE_REGISTER`).
- `app/canon.css` — imports the design system's `styles.css`, then every `app/*.css`.
- `build/` — `canon.js` and `canon.css`, which `index.html` loads. Generated; never edit.
- `../design-system/` — the design system canon builds from; there is no copy.

React 18 loads from unpkg as a page script, and `tokens.css` loads as its own stylesheet; Vite bundles the rest into `build/`.

A design or copy decision is the owner's. Build what the brief says; name anything you chose yourself in your report.

## Comments

- A comment states a rule the code keeps, with its reason, or says where a part sits in the product. Never narrate what the code plainly does, and never cite a task folder, handoff or ticket folder.
- Mark behaviour that a rebuild from screenshots would get wrong (adaptive styling, overlap or overflow handling, a value chosen against the default) with `// KEEP:`. State the outcome to keep in plain words, numbers included, then one clause of why. The agent that builds the product reads each `KEEP:` as "preserve this". If you change that behaviour, update or remove its `KEEP:` in the same edit.

<important if="you need to run commands to build, check or serve canon">

| Task | Command |
|---|---|
| Install, once per checkout or worktree | `npm ci` |
| Build | `npm run build` (`node tools/ap-names.mjs --check`, then Vite); `npm run build -- --watch` rebuilds on save |
| Build after a design-system change | `npm run build:ds`, then `npm run build` |
| Find where a name is declared | `grep -n -e "function <Name>\b" -e "const <Name>\b" -e "let <Name>\b" app/*.jsx` |
| Imports per file; init run order | `node tools/ap-names.mjs`; `node tools/ap-names.mjs --order` |
| Serve | `PORT=<port> npm start` (default 4321), then `http://localhost:<port>/app/after-pixels/canon/index.html` |
| Screenshot states | `PORT=<port> npm run check -- --app after-pixels --states <id>,<id> --widths 1440,390 --out <dir>` |
| Compare two screenshot runs | `npm run diff -- <dirA> <dirB>` |

- Any change needs a build, and `build/` is committed with it; a second build must leave `git status` clean. The commit hook builds and stages the output where `npm ci` installed it.
- Never serve with `python3 -m http.server`: it lets the browser cache the build, so edits do not show.
</important>

<important if="you are checking a change in the browser, or before committing one">
- A state is a URL: `?state=<id>`. `?state=index` lists every id; many come from lists the game files export (such as `DP_STATES`), so a grep of `app/states.jsx` misses them. `&fast` skips the 1.2 s page-arrival wait. Content still arriving carries `aria-busy="true"`.
- Screenshot with the check, not by hand, and name only the states your change touches: that takes seconds. It builds first (`--no-build` skips that), starts the server if none answers and stops it afterwards (run `npm start` yourself to click through), waits until the page is ready, writes `<dir>/<id>-<width>.png` (full page) and prints console errors per shot. An unknown id prints FAIL. Rerun a crashing state with `--react-dev` for React's warnings and full error messages.
- To prove a refactor changed nothing, run `--states all` (about 90 s) before and after, then `npm run diff` (diff images in `<dirB>/_diff/`; exit 1 on any difference). The `loading-*` states and `home` differ run to run on their own.
- Use `playwright-cli` only to click or type through a flow. Pass the session first: `playwright-cli -s=<name> open "<url>"`, then `-s=<name> click <ref>` with a ref from `-s=<name> snapshot`, and `-s=<name> screenshot --filename=<absolute path>`.
- A reload restarts the prototype on its seed data; that is not a finding.
</important>

<important if="you are adding a file, sharing a name between files, or writing code that runs at load">
- Declare each name in one file, `export` it and `import` it where used. A new `app/<name>.jsx` is imported from `main.jsx`; a new CSS file is `@import`ed in `app/canon.css`, after any file it must beat.
- A file whose top level writes to or reads another file's data (the registries, seed objects) does it inside an exported `init<File>()` that `main.jsx` calls. A read before the file it reads from has run gets `undefined`, so call the new init after the ones it needs. The build fails on a wrong order, except the pairs in `ACCEPTED` (`tools/ap-init-order.mjs`).
</important>

<important if="you are looking for the file that renders a screen">
Each route's component is imported into `main.jsx` from its file. Where that does not lead straight to the screen:

| Surface | Where |
|---|---|
| Home's hero chat | `GS_HERO_CHAT` in `gs-chats.jsx`, played in `gs-pass-home.jsx` |
| Product page (`word`, `delve`, `escape`…) | `gpGame` in `gs-player.jsx` → `GsGamePage` in `gs-game.jsx` |
| Library game page (the game's route, `page: 'record'`) | `GS_LIBRARY[id]`, set by the game's file: `gs-puzzles-library.jsx` (the daily puzzles and Escape), `gs-casebook.jsx`, `gs-delve-library.jsx`, `gs-hunter-library.jsx`, `gs-more-games.jsx`. `registerPassLibrary()` (`gs-pass-library.jsx`) then replaces the daily puzzles', Escape's, Casebook's and Delve's per the player's view, and adds the Barrow's. Card parts: `gs-library.jsx` |
| Editions list (`page: 'record'`, `list: true`) | `gs-editions.jsx`, opened from `LbHead`'s link and routed in `gpGame` |
| `session` | `gs-session.jsx`: the shared head (`GsSessHead`), then `GS_SESSION_BODY[gid]` (`gs-escape.jsx`, `gs-word.jsx`, `gs-delve.jsx`), else the result and `GsMoves` |
</important>

<important if="you are adding a route, or changing which routes show the top bar, play pop-up or demo bar">
A route in `GS_BARE` (`main.jsx`) shows no top bar, and a route in `GS_LISTING` shows no play pop-up or demo bar. For a game's route, both hold only on its product page: its library game page and editions list (`page: 'record'`) always carry them, so Play works there.
</important>

<important if="you are changing a fact a screen shows, or who can play a game">
Every fact a screen shows is held once and read from there, never retyped: in `gs-data.jsx`, or in the file that adds that game to `GS_GAMES` (`gs-where-chain-salvage.jsx`, `gs-more-games.jsx`). Who can play what is each game's `access` in `GS_GAMES`, derived by `gsAccess`. Each session's moves are `GS_SESSIONS[sid].lines`, titled by that session's own `listTitle`.
</important>

<important if="you are touching a game's editions">
Every game has editions. Its word for one is `GS_GAMES[gid].ed`; its editions are `GS_EDITIONS[gid]`, registered beside its library game page (the Barrow's in `gs-barrow-library.jsx`), and every page reads them through `edList` (`gs-history.jsx`). Never gate editions on a list of games: where a game differs (daily or weekly, chapters), the difference is data on the game.
</important>

<important if="you are building or changing UI">
Build from the design system's components (`DS.<Name>`) and canon's shared parts. Never build a one-off where one of these fits; if none does, say so in your report.
- Design system: the list is in `../design-system/readme.md`; each component's use is in `../design-system/components/<group>/<Name>.prompt.md`; guidelines (layout, overlays, loading) are in `../design-system/guidelines/`.
- Canon parts: `gs-parts.jsx` (covers, art, tags, cards, `GsStat`, top bar), `gs-site.jsx` (glyphs, spinners, `GsPart`, footer), `gs-session.jsx` (`GsMoves`, share pop-up; `GsSessHead` and `GsSessResult` are used only inside it, so export one before reusing it), `gs-library.jsx` (`LbHead`, `LbResult`, `LbAch` and the other library card parts). A now card is built on `LbNowCard`, which draws the label, title, result and action row (`LbActions`); a game passes its data and its picture.
- Changing a component is a design-system change: do it only when the brief asks.
</important>

<important if="you are building or changing a playground (options for a page, compared under ?pg=)">
A playground lives on its own `candidate/<name>` branch, never on `main`; `app/playground.jsx` (the settings bar that replaces the top bar under `?pg=<id>`) is the only part on `main`, and its header says how to build one.
</important>

<important if="you are writing a product string">
Read `../design-system/guidelines/voice.md` first.
</important>

<important if="you are writing or changing CSS">
- Use the design system's custom properties (its `tokens/*.css` and `components/components.css`; canon's own `tokens.css` holds only the aids' properties). Hierarchy is size and weight, never colour; 4px grid; readable from 320px.
- Product CSS is `app/*.css`, one file per area; each file's first comment says what it holds; no inline `<style>`. Find a rule with `grep -n "<class>" app/*.css`.
- **Import order in `app/canon.css` is the cascade: a later file wins a tie, so a rule that overrides another sits in a file imported after it.**
- Before adding a class, grep `app/` for it: a name already used elsewhere restyles that too. After a change to shared styles, check the home page and one page you did not touch.
- `!important` is kept where it beats an inline `style={{}}` or a design-system rule it cannot out-rank; test any removal with the check.
- If spacing needs a negative margin or a nudge value to look right, fix the structure instead.
- Never draw a dashed edge with `border` or `outline` `dashed` on a small box: iPhone Safari drops its side dashes, leaving only the top and bottom. Draw the dashes with four `linear-gradient` backgrounds, as `.wd-t.is-hint` (`gs-word.css`) and Delve's free pack slot (`gs-delve.css`) do.
- Content in the app posture reads its insets as `var(--safe-area-inset-top, env(safe-area-inset-top, 0px))`; only the app posture (Config → Platform, `isApp`) sets them.
</important>

<important if="you are changing an overlay, focus, or a fixed-position element">
- A `.focus()` inside an overlay that slides in from off-screen must pass `{ preventScroll: true }`, or the screen behind it jumps.
- `position: fixed` pins to the nearest ancestor with any transform, `translateX(0)` included. Only `.kit-phone-clip` keeps a transform at rest; remove any other once its transition ends.
</important>

<important if="you are adding or changing a CSS transition or animation">
- A CSS transition never runs if its `transition` property arrives in the same render as the new value. Keep the property on the element at all times, or drive the motion with `element.animate()`. Prove motion by measuring it over time, never by one screenshot.
</important>

<important if="you are changing the session page">
The top section is the platform's and the same for every game; below it the play is told in the game's own terms, on the store's background and chrome. Each game's part has a **result statement**, the element that states the outcome outright (Escape: the open door and "Escaped").
</important>

<important if="you are changing the library game page">
Four cards on one grid: the **now card** (the current or latest edition, carrying down the game's result statement, the element that states the outcome outright) and the **streak card** (the run of days or weeks played) above Achievements and Your plays. Never break, reorder or restack the rows on desktop. Cards in a row end level by arranging what is inside, never by stretching; check each card with its fewest and most items. On a phone they stack in the same order.
</important>

<important if="you are changing the product page">
It tells a stranger what they will do and why they would want it, using only true things; cut any line that excuses, hedges or lowers expectations, and never leave a slot blank.
</important>

<important if="your change makes a situation hard to reach (an account state, a failed play, a game mid-run)">
Add its state to `KIT_STATE_REGISTER` in `app/states.jsx` in the same change; that file's header gives the entry's shape and id rules. A state earns an entry only by being hard to reach: a screen you can click to from a registered state gets none. Its id names the situation (`payment-retrying`), never the code's internals, and never a width.
</important>
