# Handoff: the Pass upsell proposal, 2026-10-15

One playground page holding the owner's decided changes to how the site mentions the Pass, each with its variations, switched in the real app. The main build (`index.html`, `app/`, `_ds/`) is unchanged. Nothing here is accepted or recorded as settled.

## Where it lives

- Entry: `docs/specs/1153-pass-upsell/playground/index.html`. Open it from `playgrounds.html` under "How the site mentions the Pass".
- Modules, all in that folder:
  - `pg-upsell-store.jsx`: settings (key `pg_pass-upsell-proposal_v1`), the display staging, the catalogue the panel shows, and `window.KitCandidate` (the app's one hook).
  - `pg-upsell-home.jsx`: A1 to A6.
  - `pg-upsell-game.jsx`: B.
  - `pg-upsell-library.jsx`: C, D, E, F2.
  - `pg-upsell-connect.jsx`: G.
  - `pg-upsell-aids.jsx`: states and QA.
  - `pg-upsell-rail.jsx`: the panel.
- Page-only CSS is the marked block at the end of the entry's `<head>`. The page keeps its own app key (`kit_pass-upsell-proposal_playground`).
- Re-published in this page only: `GsHome`, `GsCard`, `GsGameCard`, `GsSoonCard`, `GsPlayBox`, `GsLibrary`, `gsLibRow`, `PzNow`, `CbNow`, `GsPassCard`, `GsConnect`, and `GS_LIBRARY.casebook / delve / escape / barrow`. Discover keeps canon's cards (out of scope).
- Three of these are copies of canon with the change applied, because the change sits inside them: `GsHome`, `PzNow` and `CbNow` (one link added), and the library pages' bodies (canon's composition, with the first-part card in the now card's place). On integration the change goes into the canon file and the copy goes.

## How to reach things (clicks)

1. Open the page from the launcher.
2. At 1024px and wider the panel is docked on the left. "Hide panel" folds it to a strip; "Show the proposal" brings it back. Below 1024px, a strip above the demo bar names the current item and variation. Its arrows step through the variations in place, and "Open" opens the whole panel as a bottom sheet.
3. In the panel, pick a section, A to G. Each section has a "Who's looking" switch, and B, D and E also have a "Game" switch. Each item shows its tag, what changes and why, and its numbered variations. Pressing a variation changes the app at once, takes it to the surface if it isn't there, and rings what changed. "Show it in the app" goes there without changing anything.
4. States (the list glyph on the pill), group "Pass upsell proposal": new account, free first case in progress, free first case done, Pass ended, Pass holder.
5. QA (the check glyph): "Pass upsell proposal (playground)" visits the five states, and its note lists what to check in each section.
6. The demo bar still works. The panel reads the app's own state, so "The app now shows" stays true whichever control set it.

## Checked first: what canon already had

- **A3:** Home already puts the games before the Pass section (`gs-home.jsx`). Left as it is; shown as a check with no variations.
- **A5:** `SoonCard` takes the label and "Play chapter 1" as they are. Only the data (`GS_SOON`, `'CHAPTER 2'`) and the Barrow Library line were stale.
- **B3:** canon's box already says "Get the Pass", and its line reads "36,000 Summers Ago comes only with the [Platform] Pass." I replaced that line with the variation and kept the pay line after it. The button, heading and steps are unchanged.
- **D:** canon showed Play with Get the Pass both before and during the free first part. That is replaced as the brief says.
- **G:** canon has no "email me the link" page. None was drawn.

## Yours to decide: what I chose

- **The lock is not pressable**, and its accessible name is "Pass only". A press anywhere on the card opens the game, and the game's page explains the Pass. Why: a second target on the art sits exactly where people press to open the game, so on touch it would send them to the Pass page by mistake. It is the same three treatments, and the same call, as the Discover, tidied candidate, so the two proposals agree.
- **A1, my own wording (variation 4):** "With an account you play the daily puzzles and the start of select games. The Pass opens everything else." It has no count and no list of units, and says Pass once per line.
- **Where the lock shows for free and Pass:** Home is signed out only, so those views show the same card row as a product page's More games.

## Calls this brief set without the owner's ruling (each can be overruled)

- E's "Card shows: every visit / once, then gone" switch. The default is every visit. "Once" counts the card as shown once you leave the game page.
- Every copy variation's wording.
- D3's record facts (level 4, bronze ring, 6 pieces of loot) and the Barrow's run record (`pgu-barrow-ch1`, placeholder rolls).
- B's "Arrived from a friend's share" switch. It is display only and changes nothing on the page.
- **Mine:** with the Barrow, D2's first line ("This week's…") reads "Chapter 2 comes with the Pass.", because the Barrow has no week.
- **Mine:** Escape is restaged as a free first edition in this page only (`GS_GAMES`, `GS_PAGES`, the Library row, its first room's card and achievements).

## Placeholders

- Edition numbers are the seed's own: Daily Word No. 212, Daily Mystery No. 64. The brief's 213 is a placeholder too.
- The Barrow's level, loot, earned dates and run record.
- The returning card's label uses canon's last case or scene before the Pass ended.
- Install buttons open the existing placeholder destinations (`GS_AI_PLUGIN`).

## What I would pick, and why (none removed; the owner picks)

- **A1:** 4. It is true under the staging, has no count to go stale, and needs no second link.
- **A2:** 1. It keeps the section one block on a phone.
- **A4:** 1. It is the smallest mark that reads on every cover.
- **A5:** 1. The Coming soon chip already says the rest.
- **A6:** 1. The pay line now lives under the Pass section, and 4 breaks "nothing sells in chat".
- **B1:** 1. It is the only one that says the streak and achievements come free.
- **B2:** 1. It is short, and the label already says free.
- **B3:** 3. A stranger can't otherwise know what the Pass opens.
- **C:** 1. It reassures about records at the moment of signing up. **Account switch:** replaced, so the deal is said in one place.
- **D1:** 1 on desktop. The Pass sits beside Share without competing, and at 390px it stacks cleanly. **D2:** 2. It is always true.
- **D3:** the same design as D1.
- **E:** 1, every visit.
- **F2:** 1. It meets the owner's condition visibly. **Link:** 3, because 1 often lands on an empty list under the staging.
- **G:** 1 with lead line 2.

## F1's condition

F2 variations 1 and 2 meet it: the games not yet played sit visibly at the top of Library. Variation 3 meets it only through a link. A free account under canon's seed has played everything but the Barrow, so its "Not played yet" group holds one game. A new account sees C's card, which lists every game it opens.

## Upstream: design-system changes before integration

1. **Card lock (A4), certain.** `GameCard` needs a lock slot on the art (an `artMark` slot, positioned within `.mcp-gcard-art`), and so would `GamePick` and `GameTile` if the lock reaches them. The three treatments need a corner badge (28px square), a top-left chip, and a full-width bottom strip, all on `var(--page)` with a control-edge border so they read on every ground. Built here as `.pgu-lock` inside the art wrapper.
2. **`GameTile` in Library (F2).** It takes `art`, `title` and `kind` only, with no state slot (done, date, not started). F2 variation 2 puts the genre in `kind` and lets the group heading carry the state. A state slot is needed if tiles are to stand alone. The two-up phone grid is page layout (`.pgu-tiles`), not the component.
3. **The Pass section (A1 to A3).** It is a Home-only block (`gs-band` plus a stack), not a component. The subline needs no slot. The pay line belongs under it, not inside it above the link.
4. **`SoonCard` (A5).** It takes the label and "Play chapter 1" as it is. Only the data was stale.
5. **"What your account opens" (C).** It is the Library's own `ListRow` (lead, title, meta, end "Play") in a box, so it needs no new component. The Account variant reuses it.
6. **Play box label and line (B), done card's Pass line (D1), returning card (E).** All three are copy and layout inside existing parts (`Card`, `TextLink`, `Button`, `lb-card`), so they need no new component or slot.

## Left open, or not built

- `GsHome` is copied, so a canon change to Home won't show here until the copy is refreshed.
- Daily Groups is not shown on the surfaces this page owns. It still shows on Discover, which is out of scope.
- The demo bar's "free" from Home lands on Library only when F1 says Library. The brand mark still opens Discover for a signed-in player (canon).

## Next

The owner picks per item. Then the lock slot (and a tile state slot, if F2 variation 2 is picked) goes upstream. Then the picked changes are integrated into `app/`, and this folder is archived.
