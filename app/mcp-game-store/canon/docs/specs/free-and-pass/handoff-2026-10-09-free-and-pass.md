# Handoff: free and the Pass (2026-10-09)

> Superseded in part on 2026-10-10 by `docs/specs/walk-sweep/handoff-2026-10-10-walk-sweep.md`: the trial is 14 days, "free plan" is "free account", "lock" is "freeze", and the checkout reminder line names the payment provider.

Status: built in the prototype, **proposed, not ratified**. QA entry `free-and-pass` in `app/qa.jsx` lists the steps until ratified.

## What was built, and where
- **Rules, once.** `CLAUDE.md` product block: new "Who plays what" line; the "Delve first scene free", "results last today only" and "Pass holds history, streak, record" statements are gone.
- **Access model.** `app/gs-library.jsx`: `lbAccess(gs, id)` returns `all` / `first` / `none`; `lbPast(gs)` is "has held the Pass"; `lbAchView` sorts achievements into earned, to earn, or locked. Game flags in `app/gs-data.jsx`: `free` (in full), `first` (Casebook, Delve).
- **Product pages** (`gs-game.jsx`): dailies and Escape "FREE IN FULL"; Casebook and Delve "FIRST CASE / SCENE FREE", with a play button for a free player and "Get the Pass" link; 36,000 Summers Ago "ONLY WITH THE PASS". Week card says the week's edition comes with the Pass for Casebook and Delve.
- **Discover, Home, Library list**: tag "First edition free" on Casebook and Delve cards; Free to play holds the four free-in-full games plus a line naming Casebook and Delve; Pass band and Home "Get started" no longer name games; Library rows read "First edition played", "Only with the Pass", "Last played 13 September" (lapsed).
- **Library game pages**: dailies and Escape (`gs-puzzles-library.jsx`) full for everyone. Casebook and Delve: first-edition card, achievements the first edition can earn, no streak, a "With the Pass" row for other editions. 36,000 Summers Ago: closed page for a free player; Pass-ended player keeps last day, days and locked achievements.
- **History** (`gs-history.jsx` `phVisible`): free sees dailies, Escape and the first edition of Casebook and Delve; Pass ended sees everything before 18 September.
- **Trial**: seven days everywhere (`GS_TRIAL_DAYS`); Config and states say "trial". State ids renamed `*-trial*`.
- **Pass page, cancel flow, Pass cards**: see below. Top bar has a **Pass** link for signed-in players.

## Staged states (`?state=<id>`)
Group "Free and Pass": `fp-word-library-free`, `fp-escape-library-free`, `fp-casebook-library-free`, `fp-delve-library-free`, `fp-hunter-library-free`, `fp-casebook-library-lapsed`, `fp-delve-library-lapsed`, `fp-hunter-library-lapsed`, `fp-product-casebook-free`, `fp-product-hunter-free`, `fp-pass-page-signed-out`. Existing: `games-free`, `free-history`, `lapsed-history`, `pass-card-none`, `pass-card-lapsed`, `pass-page-trial-available`, `pass-page-trial-used`, `cancel-sheet`, `cancel-sheet-trial`, `switch-sheet-trial`, `pass-card-trial`. Config: Subscription (None, In the trial, ...) and Seven-day trial (Available, Used).

## Decisions for the owner
1. **First edition.** Casebook: "A Cold Window", the oldest case in the seed (week of 1 December 2025), solved. Delve: "The Cold Hold", the oldest scene (week of 16 March 2026), ritual done. Seeded as played by a free player. Casebook's seed now always plays it.
2. **Locked achievement look.** Same badge, dimmed to half strength and desaturated, with a small off-white lock at its lower right. Line reads "Earned 14 September · Locked". Opening it adds "It carries on if the Pass returns." A card note says why. Chosen so it still reads as earned, not as something still to earn (outlined).
3. **Partial-free marker.** A neutral tag "First edition free" (not the green Free tag, not the Pass tag). Discover's Free to play group holds only free-in-full games, with one line naming Casebook and Delve, so neither reads as Pass only nor as free in full.
4. **Way to the Pass page.** A "Pass" item in the signed-in top bar and phone menu. The Account page has its own frame and reaches it through the Pass card.
5. **Reminder line.** A reminder "a week before" a seven-day trial ends is the start of it, so checkout now says "the day before". Please confirm.
6. Link text "What's included" became "About the Pass".

## Pass page copy (exact; draft)
Heading: `[Platform] Pass`
Status (signed in): "You're on the free plan" / "You have the Pass"
- "One plan opens every game and every edition, and every new game when it arrives. Nothing is sold game by game."
- "Free play stays free. It needs an account and no card, and nothing you have is taken away. The Pass starts with a seven-day trial."
- Pass ended adds: "Your Pass ended on 18 September. **You keep** your results, your History and the achievements you earned. **What locks:** the Pass-only games and editions, and the achievements earned in them. They are locked until you get the Pass again."
Buy block: "Start your seven-day trial", "Choose how you pay.", button "Start 7-day trial", "Cancel before 13 October 2026 and pay nothing." Trial used: "Start your Pass", "Get the Pass".

Cancel flow: "You keep the Pass until it ends. **You keep** your results, your History and the achievements you earned. **What locks:** the Pass-only games and editions, and the achievements earned in them. They lock when it ends, and unlock again if the Pass returns."
Free Pass card: "You're on the free plan. Free play needs no card, and your results and History are kept. The Pass opens every game and every edition."

## Not done / left
- Session pages for Casebook's first case use the case page; no new session records beyond `delve-first`.
- Loaded pages were not walked at 320px.
- Next: owner reads the copy above; ratify, then delete the QA entry and add a CHANGELOG line (ask first).
