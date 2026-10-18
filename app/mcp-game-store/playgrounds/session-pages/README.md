# Session pages playground

A rig that holds three design options for the session page of each of five games: Casebook, Escape, Delve, Daily Word, Daily Mystery. The shared foundation (`shared/`) and all fifteen options (three per game) are built.

Open `index.html` through `server.js` (or the deployed site). It lives outside `canon/`, so a canon export never touches it.

## What it mounts

Canon's real app, by path. `index.html` sets `<base href="../../canon/">`, reads `canon/index.html` live (its styles and its script tags, in its order) and loads canon's own modules and `main.jsx` unchanged. Nothing from canon is copied, so a re-export is picked up with no edit here. The selected page replaces only the routed page, through canon's own `window.KitCandidate.Screen` hook; the top bar, footer, popups, demo bar, Config pill and Share pop-up are canon's.

**Today** is canon's own session page, finished or unfinished, on its real seeded data:

- Escape, Delve, Daily Word, Daily Mystery: the shared session page, `GsSession` (`app/gs-session.jsx`), at route `session` with a session id.
- **Casebook: its own record page, not the shared session page.** Current canon routes Casebook to `CbCase` in `app/gs-casebook.jsx` (route `casebook`, `page: 'record'`), reached through `GsCasebook`. `GS_SESSIONS.casebook` exists in `gs-data.jsx` but no route reaches it. Today mounts `GsCasebook`. A Casebook option receives the case record `cbWeek(api)` (`CB_DONE` or `CB_LIVE`), not a `GS_SESSIONS` entry: different shape (`turns`, `lies`, `rec`, `verdict`, `title`).

## Rail, viewport

- 1024 and up: the rail is permanently docked left (no toggle). Below 1024: it sits in the app's own Config modal (the pink pill). Canon has no rail, drawer or menu button to stand in for (its top bar Menu button, under about 720px of app width, opens a link popup), so the Config aid is the app's own control for it. Picking a row closes the modal. At 1024 the app column is 704px wide, so the app's own top bar already shows its narrow form there.
- Viewport Auto / Desktop / Mobile and Platform are canon's own Config rows, with canon's phone frame. Mobile at a desktop width keeps the rail docked beside the framed phone.
- Rows: number and name on the face; stance and cost behind the `+` on each row. One group is open at a time when you pick; headers toggle freely.
- State switcher per game (canon's `ConfigSeg`): Casebook Solved / Lost / Unfinished; Escape Escaped / Lost / Unfinished; Delve Won / Lost / Unfinished; Daily Word Solved / Failed / Unfinished / Earlier; Daily Mystery Solved / Failed / Unfinished. Canon has no lost Delve, Escape or Casebook session, so those three Lost states are playground seeds (below). States are staged the way canon's states register does it (`app/states.jsx`): Pass view, connected, `review.week`, then `go()`.
- Share on Today is canon's own: it is canon's Share button and pop-up (`GsSharePopup`) showing the real text; Copy puts it on the clipboard. Unfinished states have no Share, as in canon.

## Deep links and storage

`?g=<game>&o=<0..5>&s=<state>&e=<element>&l=<layout>` or `#<game>/<o>/<state>`, e.g. `index.html?g=delve&o=2&s=finished` or `index.html#delve/2/finished`. Both work on load and on an already-open page (`hashchange`); where both are present the hash wins. The address is always written back in one canonical form, the query, and the hash is dropped. Games: `casebook escape delve word mystery`. States: `finished lost unfinished earlier` (per game, see above). `o=0` is Today; `o=4` is the Share text view; `o=5` is Notes. "Copy link to this view" copies the canonical form. The URL beats storage. Selection (game, option, state per game, open groups, the two switches) persists in `localStorage` key `pg_session-pages_v1`.

## Element and Layout switches

Rail header, above the games: two global switches (every game and option), persisted in `pg_session-pages_v1` (`el`, `ly`) and deep-linkable (`?e=store|between|game&l=built|ia`; the URL beats storage; they never restage the page).

- **Element: Store / Between / Game.** How far the page's key element is drawn from the store's own look: Store is the design system as it is; Between is the element in the cover's flat shapes; Game is the element drawn in the game's world. Chrome, grounds, the head, the Share button, the Record and the two typefaces for anything a player reads stay the store's at every stop (fable-plan section 1).
- **Layout: As built / IA pass.** As built is the option as it shipped; IA pass is the same option cut down for a phone (short lines, structure, collapse and visuals, no paragraphs; the essential signal above the fold at 390).
- Defaults are **Store** and **As built**: every option renders exactly what it rendered before the switches existed.
- The old colour switch (Near / Middle / Far, `?d=`) is retired. `?d=` is ignored; `shared/game-tokens.css` and the `data-dist` rules are inert (`data-dist` is always `near`) and are left in place for a later clean-up.

**The contract for an option (and for game builders adding stops later).**

1. The component receives two more props: `element` (`'store' | 'between' | 'game'`) and `layout` (`'built' | 'ia'`). They are the *effective* values: what the player asked for if this option draws it, else the default.
2. An option declares what it draws in `pgOption`: `elements: ['store', 'between', 'game']` and `layouts: ['built', 'ia']`. Omitted means `['store']` and `['built']`, so every existing option keeps working untouched.
3. Ask for a stop the option does not declare and the harness hands it `store` / `built` and puts a small marker on the page label (`... · Game element not built yet`) and in the rail note under the switches. The option does nothing special.
4. The default path (`element === 'store' && layout === 'built'`) must render exactly what it rendered before; a screenshot diff holds it. Branch inside the component on the two props; do not fork the file.
5. Every mark at Between and Game is one recorded event (the data never changes, only the drawing). The option's `cost` line lists the event-to-mark mapping; a mark that needs a field the engine does not send is seeded and says so. Lettering inside a drawing is art, allowed only where the fact is also in the design system's type.
6. `Ss.Page` sets `data-element` and `data-layout` on `.ss-page` (for CSS in an option's `css`); `Ss.useView()` returns `{ element, layout }` for kit parts.
7. Add the option's stance and cost for each new stop (an IA line and an element line), so the `+` on the rail row says what the stop does.

## Failure seeds

`seeds/failures.jsx` (playground only; canon is untouched) adds a lost play for the three games whose canon has none, shaped like the canon record beside each and limited to what the engine records (`_resources/grounding/<game>.md`, "What the engine can express"). All three are illustrative; no deployed session looks like them.

- **Delve Lost**: `GS_SESSIONS['delve-lost']`. Wren the Rogue, ending "Fell in the warren" (the setting's own words), 10 rolls (marks `🟩🟨🟥🟨🟥🟩🟥🟨🟥💀`), HP 11 to 0 on a natural 1, threat 6 of 12, 3 of 5 rooms reached.
- **Escape Lost**: `GS_SESSIONS['escape-lost']`. The engine has one outcome (escaped) and no clock, so the worst finish is a long one: 74 min against par 30, 3 hints, all on the oak door lock in the engine's order (nudge, bigger nudge, the answer), 13 wrong tries. No forced lock: The Clockmaker's Study has none in its content. It reads "Escaped in 74 min, over par", not a loss.
- **Daily Word Failed**: `GS_SESSIONS['word-e4']` (No. 208, the number canon's own history gives it: `212 - 4`; Today and every option say the same). Answer LIGHT, six guesses, the last four each four letters in place (the -IGHT trap). Canon has no lost Word session; `games.js` named this id with no seed behind it. The seed keeps the answer only to compute marks: no engine field holds it on a loss, so no page prints it.
- **Daily Mystery** `mystery-today` gets `wrong = ['room']` (S: which accusation part missed; needs the engine to send it).
- **Casebook Lost**: `window.PG_CB_LOST`, built with canon's `cbMake` and shown on canon's own `CbCase`. Dawn comes with the case unsolved: all 16 turns used, 1 lie exposed, 5 stories that stood, then the wrong name (Tobias Pike).

Options receive these as `session` like any other state (Casebook's `session` is the case record).

## Share text view

Rail entry **T Share text**, after the options (`o=4`), for every game. **N Notes** follows it (`o=5`): `pg/notes.jsx` renders `notes/<game>.md` (headings, lists, paragraphs, bold, code, links) on a sheet like this one; the files hold the recommendation, the IA verdicts, the element spec and the open questions for the game. A whiteboard, not the app: a full-window sheet over the app with no shell. It shows the three candidates A to C from `_resources/ideation/share-shortlist.md` section 2, each as a Triumph and a Failure, with the recommended one (B for every game) marked. **A and C are exactly as the shortlist writes them. The recommended one is generated at render time from `SsOutcome` on the seeded plays** (so it is the amended text the options copy: shortlist B plus fable-steer section 4), and says so on the sheet; the seeds' own numbers differ from the shortlist's illustrations (a Daily Word failure is No. 208, say). Each text sits in a chat bubble inside a 393-column and a 360-column phone frame, side by side where the window has room and stacked where it has not (phone, and 1024 with the dock). System font, 16px, bubble at about 80% of the screen width.

The bubble is a **simulation** of a WhatsApp message and the widths are **approximate**: real phones, fonts and text-size settings wrap differently. Where the window is narrower than a frame the whole frame is scaled down, with its width caption saying so; wrapping is unchanged by that. The texts are proposals, none deployed, and the link is a placeholder. `pg/share-data.js` is generated from the shortlist; regenerate it rather than hand-editing it. The sheet's eyebrow is `#7a005c` (the app's pink is 2.96:1 on the light sheet).

## The option contract

One module per option: `options/<game>-<n>.jsx` (`n` = 1..3), already present as placeholders. A module registers itself with `pgOption`:

```jsx
(function () {   // wrap: Babel scripts share one global scope
  const DelveTwo = ({ Today, session, share, stateId /* ... */ }) => { /* render the whole page body */ };
  pgOption('delve', 2, {
    name: 'Ledger',                 // on the rail face
    stance: 'One sentence: the idea.',   // behind the + disclosure
    cost: 'One sentence: what it gives up.',
    Component: DelveTwo,            // omit and the slot shows Today, marked "not built yet"
    css: ':scope .gs-h1 { ... }',    // optional
    shareText: (session, canonLines, ctx) => canonLines,  // optional
  });
})();
```

**Props the component receives** (it replaces only the routed page; canon's top bar, footer and popups stay):

| prop | meaning |
|---|---|
| `gid`, `game` | game id (`delve`) and name (`Delve`) |
| `optionN` | 1..3 |
| `stateId`, `stateLabel` | `finished`, `Won` ... |
| `sid` | the `GS_SESSIONS` id (null for Casebook) |
| `session` | the record: `GS_SESSIONS[sid]`, or the case record for Casebook (see above) |
| `share` | `{ lines, canonLines, supported }`: the text this option shares, canon's text, and whether Share exists in this state (false when unfinished) |
| `Today` | a component rendering canon's own page for this state, for an option that wraps or extends it |
| `element`, `layout` | the effective Element and Layout switches (see above) |
| `api` | canon's app context (`window.gsApi`): `api.go`, `api.view`, `api.play` ... |

**Game models (fix round 1).** An optional `options/<game>-model.jsx` loads before that game's options 1 to 3, so a game's reader (`PgCb`, `PgMystery`, `EsModel`, `DvModel`) need not live in option 1. It is a plain `(function () { ... })();` that sets its `window` global. **Add the game id to `window.PG_MODELS` in `pg/games.js`** when you add the file (the loader requests only listed files, so an unlisted game costs no 404). All five games are listed. The loader probes each listed file and loads it only if it exists (one 404 per absent file in the network log, no page error), so a game without a model file loads its options as before.

**Share text rules (fix round 1 leftovers).** The link is the product-page form `mcpgames.example/discover/<game>` (placeholder domain, deployed path shape). Delve's outcome line is word-wrapped at 24 characters (the ending is the setting's own words, never cut); the tape is rows of at most 8, balanced. Casebook's share says "lies broken" (ruled in share-shortlist B and fable-steer section 4, and "4 lies exposed" is 25 characters) while the page says "exposed" (deployed): kept on purpose, an open question for the owner. A Daily Word loss with no answer on the record shows no grid in the share and no letter marks on the board, never a solved row.

**Share text errors.** The harness wraps an option's `shareText` in try/catch: a throw gives `share.lines = null` (no Share) and a visible `role="alert"` note above the option, never a blank app. An abandoned play (`unfinished`) passes `canonLines` null.

Everything else is canon's: `useGs()`, `DS.*`, `GsCover`, `LbBackTo`, `window.GsSharePopup` and the rest are on `window`.

**Share text.** `shareText(session, canonLines, ctx)` returns an array of lines (or null for no Share). The harness passes the result as `share.lines`. An option that draws its own Share control opens canon's pop-up with it:

```jsx
const [open, setOpen] = React.useState(false);
{share.supported && <DS.Button onClick={() => setOpen(true)}>Share</DS.Button>}
<GsSharePopup open={open} onClose={() => setOpen(false)} lines={share.lines} />
```

An option that only wraps `<Today />` shows canon's Share with canon's text; to override the text, draw the Share control as above. Canon's text for each game is `gsShareText(session)` (`gs-session.jsx`; Casebook: `cbShareLines`).

**Per-option CSS.** `css` is injected only while that option is on screen and removed when it leaves. Write `:scope` for the option's root: it becomes `.pgo-<game>-<n>`, the class of a `display: contents` wrapper around the option. Prefix any class you add (`dv2-`), never restyle canon's classes outside `:scope`, and never edit `pg/pg.css`.

**Rules that still hold** (from canon's build-playground skill and CLAUDE.md): mount canon's parts, do not re-implement them; an option may add an affordance but never quietly remove canon's (a removal is the stated stance and cost); the real data from the seed, no typed copies; a decision on copy or design is the owner's, not the option's.

## The shared foundation (`shared/`)

Loaded for every option. An option mounts these; it does not re-draw them. Global `Ss` (kit) and `SsOutcome` (text).

**Outcome and share text: `SsOutcome[game](session)`** (`shared/outcome.js`; `word`, `mystery`, `casebook`, `escape`, `delve`) returns `{ h1, mark, label, lines, link, live, ended, status, stats, ... }`. `status` is `'done' | 'live' | 'ended'` and is always set. **Every game and every record shape is safe:** a live, abandoned (`unfinished`, not live) or half-built record returns `h1` "In progress" or "Not finished", `lines` null and `stats` for the open play; it never throws and never prints `NaN`. A Casebook record with no verdict, a Delve record with no share lines and an Escape record with no finishing time are `ended`. **`stats`** is the head's fact strip for that game and state, carrying only what the h1 does not say (Word: none when done, Guesses and Hints open; Mystery: Questions, plus Hints on a loss or an open play; Casebook: Turns and Lies exposed; Escape: Time, Hints, Wrong tries when done; Delve: Rolls, HP, Natural 20s). Pass it straight to `Ss.Head`; options should stop computing their own (an option that still does keeps working). `h1` is the outcome line without its emoji (build-rulings 1); `lines` is the exact share text (null while unfinished); both the page and the Share card read the one function, so they cannot drift. Texts are share-shortlist B with fable-steer section 4. Mystery: a solve with no hints is "Solved, no hints"; with hints it is "Solved · N hints" and the questions go on their own line; a loss adds hints to its count line. Escape lists "N locks forced" when there are any (a `Force ... with ...` move, or a figure). Escape reads its room name and par from the record (`s.room`, `s.par`) or the seed (`window.PG_SEED.escape`, `seeds/editions.js`; `out.roomSeeded`, `out.parSeeded` say which): when the record's own "under par" or "over par" disagrees with the seed's par, the page says only "Escaped, under par" and invents no minutes. Hours parse ("1 h 14 min" is 74). Delve prints "1 roll". Word also returns `play.rows` (guesses with marks and captions, hints in place); Casebook returns `cells`; Escape `par`, `min`; Delve `hero`, `tape`. Data not on today's record is derived from the seed (shortlist label S) and the option's cost line says "needs the engine to send X".

**Components (`shared/session-kit.jsx`)**

| Part | Props | Notes |
|---|---|---|
| `Ss.Page` | `gid` | Ground wrapper (`data-game`, `data-element`, `data-layout`), container, back link (`LbBackTo`). Children: Head, `.ss-body`, Record. |
| `Ss.Head` | `gid, art, label, date, h1, mark, stats, sub` | Cover 96px on a phone, 144px above (the library's); Label is plain text (the back link above already goes to the game page); a daily game's date has no clock time. `mark` (`out.mark`) puts canon's check or error glyph, in the status colour, before the h1 (text stays white). `stats` (`{label, value}`, 0 to 4) only for what the h1 does not say; none, no strip. Styled as canon's product-page fact strip (`gs-facts`): label over value, no border, one line. Capped so the hero starts above the fold at 390x844; on a phone an h1 that would wrap past two lines steps down to 22px. |
| `Ss.Cells` | `rows, cols, size, label` | The one square-cell component. A cell is `{ t, k, sub }`; kinds `hit near miss filled empty hint mark1 mark2 mark3 plain`. Size `md` 52px, `lg` 64px, `fit`. |
| `Ss.Strip` | `cells, perRow, size, label` | One run of cells, wrapped. |
| `Ss.Card` | `kicker, title, facts, tag{text,tone}` | The one card kind: kicker, title, up to three facts, optional status tag (status colour for status only). |
| `Ss.ShareCard` | `status, lines, gid, session, sid, api` | The action card: share text in a monospace block exactly as it will paste, Copy inside it (copies, then "Copied"), the played-once line or Start over. `say` (live only) is the option's one line about the game in progress ("4 guesses left"). `status` is `done`, `live` (Play), `kept` (Needs the Pass), `ended` (Not finished). Never floats; no pop-up. A `done` card given no lines (an abandoned play) shows the `ended` card instead of throwing. |
| `Ss.Record` | `title, lines, open` | The ruled list as a Disclosure titled with the count, closed at every width. An option passes `open` only when its hero does not show the play. 200-line paging. |
| `Ss.GameLink`, `Ss.OnceLine` | `gid` | The link back to the game page; the played-once line. |

The design system's `TileGrid` is chat-only (light ground, 32px cap), so `Ss.Cells` is the web member of that family and is the proposed promotion. Everything else is canon's: `DS.Button`, `DS.TextLink`, `DS.Disclosure`, `GsCover`, `LbBackTo`, `GsNeedsPass`.

**Layout.** Head, then `.ss-body` (Hero, then `.ss-side` with the Share card), then Record. Two columns (2fr/1fr) from a 960px page width, because the side column is the narrowest place the share block sits beside the Hero; below that the Share card sits under the Hero. The page is its own container (`@container ss`), so use `@container ss (min-width: ...)` in an option's css, not viewport media queries.

**How an option uses it.** Copy `options/word-1.jsx`. Shape: `pgOption(...)` with `shareText: (session) => window.SsOutcome.<game>(session).lines`; a component that calls `Ss.useOutcome(gid, session)`, then returns `<Ss.Page>` with `<Ss.Head h1={out.h1} .../>`, `<div className="ss-body"><section className="ss-hero ss-surface">...hero...</section><aside className="ss-side"><Ss.ShareCard status lines={share.lines} .../></aside></div>` and `<Ss.Record/>`. Hero surfaces come from `--ss-*` tokens. Prefix your own classes (`dv2-`) and scope css with `:scope`.

## Files

`index.html` (loader) · `pg/games.js` (games, states, `PG_MODELS`) · `pg/share-data.js` (the shortlist's texts) · `pg/share.jsx` (share-text view) · `seeds/failures.jsx` (lost seeds) · `seeds/editions.js` (`PG_SEED`: facts the engine does not send yet) · `pg/store.js` (registry, selection, URL, storage) · `pg/rail.jsx` (rail body, the two switches) · `pg/notes.jsx` and `notes/<game>.md` (the Notes entry) · `pg/stage.jsx` (mounts Today or an option, Config hook) · `pg/boot.jsx` (dock) · `pg/pg.css` · `shared/` (`outcome.js`, `session-kit.jsx`, `kit.css`, `game-tokens.css`) · `options/*.jsx` (the three options per game, plus an optional `<game>-model.jsx`).

## Known limits

- The loader writes canon's `unpkg` script tags with `document.write`; Chrome may log a warning and, on a 2G connection only, can block them.
- A link followed out of the session page (for example Back to the game) shows canon's real page; pick a row to return.
- Popups centre on the whole window, not the app column, at desktop width.
