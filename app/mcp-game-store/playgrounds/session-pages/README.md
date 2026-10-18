# Session pages playground

A rig that holds three design options for the session page of each of five games: Casebook, Escape, Delve, Daily Word, Daily Mystery. The shared foundation (`shared/`) and Daily Word option 1 are built; every other slot renders Today with a "not built yet" marker.

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

`?g=<game>&o=<0..4>&s=<state>` or `#<game>/<o>/<state>`, e.g. `index.html?g=delve&o=2&s=finished` or `index.html#delve/2/finished`. Both work on load and on an already-open page (`hashchange`); where both are present the hash wins. The address is always written back in one canonical form, the query, and the hash is dropped. Games: `casebook escape delve word mystery`. States: `finished lost unfinished earlier` (per game, see above). `o=0` is Today; `o=4` is the Share text view. "Copy link to this view" copies the canonical form. The URL beats storage. Selection (game, option, state per game, open groups) persists in `localStorage` key `pg_session-pages_v1`.

## Distance switch

Rail header, above the games: **Near / Middle / Far**, global (every game and option), default Near. Persisted in `pg_session-pages_v1` (`dist`) and deep-linkable as `d=near|middle|far` (`?g=word&o=1&s=finished&d=far`; the URL beats storage; it never restages the page). It is a token layer, not a build: options write the same named regions (`.ss-head`, `.ss-hero`, `.ss-side`, `.ss-record`) and `Ss.Page` sets `data-dist` on `.ss-page`.

| Layer | What changes |
|---|---|
| Near | Today's design-system tokens only. `shared/game-tokens.css` adds nothing. |
| Middle | The Hero card (`.ss-hero`) fills with the game's ground (`--game-ground`); marks inside it may use `--game-mark-1..3`. Rest of the page as Near. |
| Far | The whole page body takes `--game-ground`; every card uses `--game-ground-card` and `--game-ground-line`; marks anywhere. Store chrome stays `--page`. |

`shared/game-tokens.css` is the one file of per-game tokens (ground and three marks per game, plus the two derived tokens), written to read as candidate design-system additions, with the measured contrast table in its header. Findings: teal is shapes only (fails 4.5 as text everywhere, and fails even 3:1 on the Far forest card); orange is graphics only on wine and forest; lilac is text-safe on indigo only. Indigo against `--page` is 1.06:1, so Casebook and Escape change by hue only (the rail says so under Far).

Surfaces inside an option read these tokens, never a game colour directly: `--ss-card`, `--ss-line`, `--ss-cell`, `--ss-cell-line`, `--ss-mark-1..3` (neutral at Near, the game's marks at Middle in the Hero and at Far).

## Failure seeds

`seeds/failures.jsx` (playground only; canon is untouched) adds a lost play for the three games whose canon has none, shaped like the canon record beside each and limited to what the engine records (`_resources/grounding/<game>.md`, "What the engine can express"). All three are illustrative; no deployed session looks like them.

- **Delve Lost**: `GS_SESSIONS['delve-lost']`. Wren the Rogue, ending "Fell in the warren" (the setting's own words), 10 rolls (marks `🟩🟨🟥🟨🟥🟩🟥🟨🟥💀`), HP 11 to 0 on a natural 1, threat 6 of 12, 3 of 5 rooms reached.
- **Escape Lost**: `GS_SESSIONS['escape-lost']`. The engine has one outcome (escaped) and no clock, so the worst finish is a long one: 74 min against par 30, 3 hints (nudge, bigger nudge, the answer), 11 wrong tries. No forced lock: The Clockmaker's Study has none in its content. It reads "Escaped in 74 min, over par", not a loss.
- **Daily Word Failed**: `GS_SESSIONS['word-e4']` (No. 210). Answer LIGHT, six guesses, the last four each four letters in place (the -IGHT trap). Canon has no lost Word session; `games.js` named this id with no seed behind it. The seed keeps the answer only to compute marks: no engine field holds it on a loss, so no page prints it.
- **Daily Mystery** `mystery-today` gets `wrong = ['room']` (S: which accusation part missed; needs the engine to send it).
- **Casebook Lost**: `window.PG_CB_LOST`, built with canon's `cbMake` and shown on canon's own `CbCase`. Dawn comes with the case unsolved: all 16 turns used, 1 lie exposed, 5 stories that stood, then the wrong name (Tobias Pike).

Options receive these as `session` like any other state (Casebook's `session` is the case record).

## Share text view

Rail entry **T Share text**, after the options (`o=4`), for every game. A whiteboard, not the app: a full-window sheet over the app with no shell. It shows the three candidates A to C from `_resources/ideation/share-shortlist.md` section 2, each as a Triumph and a Failure, exactly as written there, with the recommended one (B for every game) marked. Each text sits in a chat bubble inside a 393-column and a 360-column phone frame, side by side where the window has room and stacked where it has not (phone, and 1024 with the dock). System font, 16px, bubble at about 80% of the screen width.

The bubble is a **simulation** of a WhatsApp message and the widths are **approximate**: real phones, fonts and text-size settings wrap differently. Where the window is narrower than a frame the whole frame is scaled down, with its width caption saying so; wrapping is unchanged by that. The texts are proposals, none deployed, and the link is a placeholder. The data is generated from the shortlist (`pg/share-data.js`); regenerate it rather than hand-editing it.

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
| `api` | canon's app context (`window.gsApi`): `api.go`, `api.view`, `api.play` ... |

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

**Outcome and share text: `SsOutcome[game](session)`** (`shared/outcome.js`; `word`, `mystery`, `casebook`, `escape`, `delve`) returns `{ h1, mark, label, lines, link, live, ended, ... }`. `h1` is the outcome line without its emoji (build-rulings 1); `lines` is the exact share text (null while unfinished); both the page and the Share card read the one function, so they cannot drift. Texts are share-shortlist B with fable-steer section 4. Word also returns `play.rows` (guesses with marks and captions, hints in place); Casebook returns `cells`; Escape `par`, `min`; Delve `hero`, `tape`. Data not on today's record is derived from the seed (shortlist label S) and the option's cost line says "needs the engine to send X".

**Components (`shared/session-kit.jsx`)**

| Part | Props | Notes |
|---|---|---|
| `Ss.Page` | `gid` | Ground wrapper (`data-game`, `data-dist`), container, back link (`LbBackTo`). Children: Head, `.ss-body`, Record. |
| `Ss.Head` | `gid, art, label, date, h1, mark, stats, sub` | Cover 96px on a phone, 144px above (the library's); Far dissolves it into the ground. Label is plain text (the back link above already goes to the game page); a daily game's date has no clock time. `mark` (`out.mark`) puts canon's check or error glyph, in the status colour, before the h1 (text stays white). `stats` (`{label, value}`, 0 to 4) only for what the h1 does not say; none, no strip. Styled as canon's product-page fact strip (`gs-facts`): label over value, no border, one line. Capped so the hero starts above the fold at 390x844. |
| `Ss.Cells` | `rows, cols, size, label` | The one square-cell component. A cell is `{ t, k, sub }`; kinds `hit near miss filled empty hint mark1 mark2 mark3 plain`. Size `md` 52px, `lg` 64px, `fit`. |
| `Ss.Strip` | `cells, perRow, size, label` | One run of cells, wrapped. |
| `Ss.Card` | `kicker, title, facts, tag{text,tone}` | The one card kind: kicker, title, up to three facts, optional status tag (status colour for status only). |
| `Ss.ShareCard` | `status, lines, gid, session, sid, api` | The action card: share text in a monospace block exactly as it will paste, Copy inside it (copies, then "Copied"), the played-once line or Start over. `say` (live only) is the option's one line about the game in progress ("4 guesses left"). `status` is `done`, `live` (Play), `kept` (Needs the Pass), `ended` (Not finished). Never floats; no pop-up. |
| `Ss.Record` | `title, lines, open` | The ruled list as a Disclosure titled with the count, closed at every width. An option passes `open` only when its hero does not show the play. 200-line paging. |
| `Ss.GameLink`, `Ss.OnceLine` | `gid` | The link back to the game page; the played-once line. |

The design system's `TileGrid` is chat-only (light ground, 32px cap), so `Ss.Cells` is the web member of that family and is the proposed promotion. Everything else is canon's: `DS.Button`, `DS.TextLink`, `DS.Disclosure`, `GsCover`, `LbBackTo`, `GsNeedsPass`.

**Layout.** Head, then `.ss-body` (Hero, then `.ss-side` with the Share card), then Record. Two columns (2fr/1fr) from a 960px page width, because the side column must hold the longest share line (27 characters) unwrapped; below that the Share card sits under the Hero. The page is its own container (`@container ss`), so use `@container ss (min-width: ...)` in an option's css, not viewport media queries.

**How an option uses it.** Copy `options/word-1.jsx`. Shape: `pgOption(...)` with `shareText: (session) => window.SsOutcome.<game>(session).lines`; a component that calls `Ss.useOutcome(gid, session)`, then returns `<Ss.Page>` with `<Ss.Head h1={out.h1} .../>`, `<div className="ss-body"><section className="ss-hero ss-surface">...hero...</section><aside className="ss-side"><Ss.ShareCard status lines={share.lines} .../></aside></div>` and `<Ss.Record/>`. Hero colours come from `--ss-*` tokens so Near / Middle / Far work with no extra code. Prefix your own classes (`dv2-`) and scope css with `:scope`.

## Files

`index.html` (loader) · `pg/games.js` (games, states) · `pg/share-data.js` (the shortlist's texts) · `pg/share.jsx` (share-text view) · `seeds/failures.jsx` (lost seeds) · `pg/store.js` (registry, selection, URL, storage) · `pg/rail.jsx` (rail body) · `pg/stage.jsx` (mounts Today or an option, Config hook) · `pg/boot.jsx` (dock) · `pg/pg.css` · `shared/` (`outcome.js`, `session-kit.jsx`, `kit.css`, `game-tokens.css`) · `options/*.jsx` (`word-1.jsx` built; 14 placeholders).

## Known limits

- The loader writes canon's `unpkg` script tags with `document.write`; Chrome may log a warning and, on a 2G connection only, can block them.
- A link followed out of the session page (for example Back to the game) shows canon's real page; pick a row to return.
- Popups centre on the whole window, not the app column, at desktop width.
