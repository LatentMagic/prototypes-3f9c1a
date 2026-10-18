# Session pages playground

A rig that will hold three design options for the session page of each of five games: Casebook, Escape, Delve, Daily Word, Daily Mystery. No options are built yet: each slot renders Today with a "not built yet" marker.

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
- Share is live: it is canon's Share button and pop-up (`GsSharePopup`) showing the real text; Copy puts it on the clipboard. Unfinished states have no Share, as in canon.

## Deep links and storage

`?g=<game>&o=<0..4>&s=<state>` or `#<game>/<o>/<state>`, e.g. `index.html?g=delve&o=2&s=finished` or `index.html#delve/2/finished`. Both work on load and on an already-open page (`hashchange`); where both are present the hash wins. The address is always written back in one canonical form, the query, and the hash is dropped. Games: `casebook escape delve word mystery`. States: `finished lost unfinished earlier` (per game, see above). `o=0` is Today; `o=4` is the Share text view. "Copy link to this view" copies the canonical form. The URL beats storage. Selection (game, option, state per game, open groups) persists in `localStorage` key `pg_session-pages_v1`.

## Failure seeds

`seeds/failures.jsx` (playground only; canon is untouched) adds a lost play for the three games whose canon has none, shaped like the canon record beside each and limited to what the engine records (`_resources/grounding/<game>.md`, "What the engine can express"). All three are illustrative; no deployed session looks like them.

- **Delve Lost**: `GS_SESSIONS['delve-lost']`. Wren the Rogue, ending "Fell in the warren" (the setting's own words), 10 rolls (marks `🟩🟨🟥🟨🟥🟩🟥🟨🟥💀`), HP 11 to 0 on a natural 1, threat 6 of 12, 3 of 5 rooms reached.
- **Escape Lost**: `GS_SESSIONS['escape-lost']`. The engine has one outcome (escaped) and no clock, so the worst finish is a long one: 74 min against par 30, 3 hints (nudge, bigger nudge, the answer), 11 wrong tries. No forced lock: The Clockmaker's Study has none in its content. It reads "Escaped in 74 min, over par", not a loss.
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

## Files

`index.html` (loader) · `pg/games.js` (games, states) · `pg/share-data.js` (the shortlist's texts) · `pg/share.jsx` (share-text view) · `seeds/failures.jsx` (lost seeds) · `pg/store.js` (registry, selection, URL, storage) · `pg/rail.jsx` (rail body) · `pg/stage.jsx` (mounts Today or an option, Config hook) · `pg/boot.jsx` (dock) · `pg/pg.css` · `options/*.jsx` (15 placeholders).

## Known limits

- The loader writes canon's `unpkg` script tags with `document.write`; Chrome may log a warning and, on a 2G connection only, can block them.
- A link followed out of the session page (for example Back to the game) shows canon's real page; pick a row to return.
- Popups centre on the whole window, not the app column, at desktop width.
