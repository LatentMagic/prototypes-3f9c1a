---
date: '2026-10-18'
topic: 'canon-delta-walk'
status: 'in-progress'
type: 'implementation'
---

# Handoff: walk rulings (achievements wording, product-page Play, several editions in progress, edition words, phone buttons)

Brief: the "walk rulings" delta pasted into chat on 2026-10-18, after audit-fixes. Everything is in `app/`, `index.html` and `CLAUDE.md`. No candidate build, no rig. QA entry: **Walk rulings, 18 October** (`app/qa.jsx`, key `canon-delta-walk`). Delete it once signed off.

## Current focus

Every item built. Waiting for QA sign-off and one owner call (below: where the earlier room and run live).

## What changed, and where

1. **Earned achievements** (`gs-library.jsx`). `lbAchView` marks an earned achievement in a game the player can no longer play as `state: 'kept'` (was `'locked'`). `lbAchLine` reads "Earned {date}" for every earned row. `LbBadge` lost its `locked` prop, dimming and lock; the `.is-locked` / `.lb-lock` CSS is gone from `index.html`. The section's two sentences are now one: "You can’t earn the rest until the Pass returns." The pop-up's "It carries on if the Pass returns." is gone.
   - Account (`gs-billing.jsx` `GsKeepLock`): the `locked` prop is gone; the line is fixed at all three places (lapsed card, ending card, cancel flow): "What freezes: your streaks, and progress toward achievements you haven’t earned yet."
2. **Product-page Play** (`gs-game.jsx` `GsPlayBox`, `gs-pass-game.jsx` `CprPlayBox`): Play raises `{ ...gsPlayReq(gs, name), page: true }` through `gs.playReq`. `gsReqEd` in `gs-connect.jsx` returns null for a request with `page`, so the played-once line never shows from it. Every other `kind: 'game'` caller is unchanged.
4. **Edition words**: `GS_GAMES.groups.ed` is `['puzzle', 'puzzles']` (`gs-data.jsx`). Delve was already `['run', 'runs']`, and no "scene" for an edition was left in `app/`. `edLink` "See all groups" and `edAll` "All groups" unchanged. The daily play box for Groups still returns canon's copy (`cprBoxCopy`): its line says "Free with an account", which Groups isn't.
5. **Phone buttons** (`index.html`): the under-640px full-width rule skips `.gs-copy .mcp-btn`; the rule's comment carries the new exemption (the rule is recorded there, not in `CLAUDE.md`). `GsAddress` (`gs-connect.jsx`) is a read-only text box (`.gs-copy-addr`, `role="textbox"`) that scrolls sideways under a finger; focus or a tap selects the address. An input's select-on-focus stopped the swipe, so it is no longer an input.
6. **Earlier editions line** (`gs-pass-library.jsx`, `CprDvLibrary`, `CprEsLibrary`): "Playing earlier runs/rooms comes with the Pass." for a free or Pass-ended player, in the dailies' form: "the Pass" linked inside the sentence (`CprPassEnd`), no separate About the Pass. Correction from the user, citing the owner's ruling of 2026-10-16 in the pass-upsell log (E4); the first build used About the Pass, as the brief worded it. Canon's old line in `gs-puzzles-library.jsx` `pzLibrary` (still with About the Pass) now uses the same form. A Pass holder never sees it.
7. **Contact**: already `support@[platform].example` and `hello@[platform].example`. Only the comment changed.

3. **Several editions in progress, Escape and Delve** (`gs-history.jsx`). Ruling relayed in chat: Q3, joint-audit log, 2026-10-18, narrowed to Escape and Delve (the log isn't in this project, so I couldn't read it).
   - Seed, SAMPLE: `PH_MORE` holds one earlier room, **Escape · The Lighthouse Keeper’s Log** (released 28 September, played 3 October 20:15, session `escape-r0-live`, two moves), and one earlier run, **Delve · The Drowned Chapel under Fenwick Marsh** (released 28 September, played 4 October 21:05, session `delve-r0-live`, three lines, threat 2 of 12). Both are in progress.
   - They exist only while `review.several` is on and the view is the Pass (`phMoreOn`): `phLog` adds their plays, and `edMore` adds them to the editions list as number 1, moving the others up one ("Room 2 · The Clockmaker’s Study").
   - What shows: the head card is still this week's edition (the fence). Your rooms and Your runs list both plays, each "In progress". The editions list shows both unmarked; an earlier edition's panel shows its prompt and Copy, with no warning. The panel prints no "partway through" line for any in-progress edition (`pgePlayedText` only runs for a played one); that was so before this work and is left as it was. History lists both. The Library row reads the most recent play.
   - No "carry on" spot exists in the app, so nothing had to point at the most recently played one.

## Ask the owner

- **Where the earlier room and run live.** I put them only in the two-in-progress states. Added to the seed for good, each would be its game's first release, so it would become the free first edition and Room or Run 1 everywhere, in place of the Clockmaker's Study and the Goblin Warren (game-pages-refresh). My recommendation: keep them staged.

## What I chose

- **Several in progress shown as a row each** in the game page's own list of plays (Your rooms, Your runs), with its status. That card already shows one row per play, so it needed no new part.
- **"k of n earned" on a game the player can no longer play**: n is the game's full achievement count (`items.length`), the same total the Needs the Pass card's foot uses; k is the earned ones. Before, n was the rows shown, which on such a page were only the earned ones ("3 of 3"), so it read as complete. Kept (user, 2026-10-18).

## Set by this brief (owner has not ruled)

- The pop-up line "It carries on if the Pass returns." is gone, and the What freezes sentence is fixed at all three places. So the cancel flow loses its "carries on if the Pass returns" reassurance, and "Pass-only games" no longer appears in What freezes.
- Daily Groups' editions-list heading and Show option ("All groups") stay.
- Staged states for item 3: four register entries (below).

## Places that called an earned achievement frozen, locked or dimmed (changed)

- `gs-library.jsx`: `lbAchView` comment and state, `LbBadge` comment and lock, `lbAchLine`, the section's sentences, the pop-up line.
- `gs-billing.jsx`: `GsKeepLock` sentence and its three `locked` tails.
- `index.html`: `.lb-badge.is-locked`, `.lb-lock` CSS.
- `CLAUDE.md` product block: "shown earned and locked, and carry on if the Pass returns" now reads "shown as earned (owner, 2026-10-18); only the streak and progress toward the rest freeze until the Pass returns."
- `app/qa.jsx` `free-and-pass` note: "Pass ended: frozen achievements." reworded.
- No state ids renamed. Streak frozen weeks (`lbFrozen`, `is-fz`, the legend's Frozen) left alone.

## History hits left unchanged

- `docs/archive/streak-when-access-ends/handoff-2026-10-11-streak-when-access-ends.md` (line 31: "Earned {date} · Frozen").
- `docs/specs/free-and-pass/handoff-2026-10-09-free-and-pass.md` (line 9: "earned, to earn, or locked").
- `docs/specs/elegance-audit/handoff-2026-10-18-audit-fixes.md` (lines 24 and 40: "earned-and-locked", "· Frozen wording stays").

## Escape and Delve: places that assume one edition in progress

- `gs-library.jsx` `lbNow`: one status and one open per game (Delve: `delve-live`; Escape: `PZ.escape.liveSid`).
- `gs-puzzles-library.jsx` `PZ.escape.liveSid` and `PzNow` / `gs-pass-library.jsx` `CprPzNow`: one "See your moves so far".
- `gs-delve-library.jsx` `DvNow`: one this-week card, `delve-live`.
- `gs-pass-library.jsx` `CPR_FIRST.delve` / `.escape` and `PH_FIRST_LIVE` (`gs-history.jsx`): one first-edition live form.
- `gs-pass-library.jsx` `cprLibRow`: one "In progress" from the latest play.
- The editions panel (`gs-editions.jsx`) gives no warning about another edition in progress: none was built, so nothing to remove.

## States added

- `library-escape-two-in-progress`, `editions-escape-two-in-progress`, `library-delve-two-in-progress`, `editions-delve-two-in-progress` (Pass, this week in progress, `several: true`). None removed.

## Not built, out of scope

- The streak strip leaves the earlier editions out. They are in progress, so they count for nothing either way.
- The game's chat line for a second start ("Starting this one. The other is saved where you left it.") is the game's own text, out of the prototype's scope.

## Next

1. Owner's call on where the earlier room and run live.
2. Walk the QA entry at 320px and 1280px.
