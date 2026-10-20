# Walk sweep: handoff, 2026-10-10

Brief: "MCP Game Store: account, Pass, streak and result fixes" (pasted 2026-10-10). Everything below is proposed behaviour and not ratified, except the trial length. The owner ratified 14 days in chat on 2026-10-10.

## Changes made

### 1. Account, sign-up and sign-in (`gs-auth.jsx`, `gs-username.jsx`, `gs-account.jsx`, `main.jsx`)
- The Account card now reads "[name] is your username."
- Email sign-up has Email, Username (starts empty, required, same rules) and Password. The account is created when the email code is accepted. The email route no longer has a username step.
- Google or Apple sign-up: the provider returns, then "Verify this device" (code sent to the account email), then Your username (starts empty), then Connect your AI. From the Pass page, checkout takes the place of Connect your AI.
- No account exists until a username is chosen. Before that the person stays signed out, so leaving and coming back starts sign-up again.
- The name generator and the three near-match buttons are gone. A taken name shows only the existing error.
- Checkout's "Cancel and return" goes to the Pass page, and the chosen plan stays selected because it is held in app state.
- One routing rule in `main.jsx` (`land`) covers every `go` and every browser Back:
  - Signed in: sign-up, sign-in, verify, username, recover, returning and home all land on Discover.
  - Signed out: Library, History, Account, update-card and checkout land on home.
  - Pass holder: checkout lands on Account.
- Apple with no account now creates an account, as Google does. Removed: the stop screen, the Config row "Apple account", and the state `apple-no-account` (also removed from QA).
- Google or Apple sign-in on a new device shows the code step. New Config row: "Device, for Google and Apple sign-in: Known / New".
- Deleting a Google or Apple account asks for a code sent to the account email, with "Send a new code". An email account still asks for its password.

### 2. The Pass, the trial and billing (`gs-billing.jsx`, `gs-account.jsx`, `gs-config.jsx`, `gs-home.jsx`)
- "Free plan" is now "free account" on the Pass card, the Pass page status ("You have a free account"), the Config rows and the state labels.
- The delete warning "Deleting also cancels your Pass." shows only while the account holds the Pass (trial, active, failed or ending).
- A Pass holder, the trial included, never reaches checkout. Every route there sends them to Account.
- The trial is 14 days (`GS_TRIAL_DAYS = 14`), and every date follows from it. Updated: buttons, buy-block heading, "Free for 14 days", the home Pass panel, the Config row "14-day trial" and the state label. Achievements named "Seven days in a row" are unchanged.
- The checkout reminder line now reads: "The payment provider emails you a reminder before your first payment."
- "Lock" wording became "freeze", exactly as in the brief's table. The icon and the dimming are unchanged.
- Cancelling while a payment has failed: the sheet reads "Today · Ends" and "Your Pass ends today." After confirming, the player sees the ended Pass card dated today, with no "Ending" and no Resume.
- Pass changes can fail. New Config row "Pass changes: Work / Fail".
  - Cancel, resume, switch and keep each show a red-x line under the control, and the card stays as it was.
  - The lines: "Your subscription wasn't cancelled. Try again." / "…wasn't resumed…" / "Your plan wasn't switched. Try again." / "Your switch to yearly is still set. Try again."

### 3. Product pages and the play dialog (`gs-game.jsx`, `gs-player.jsx`, `gs-connect.jsx`, `main.jsx`)
- The play box label is now "FREE WITH AN ACCOUNT". The line is per game: "Today's word / Today's groups / Today's case / This week's room, your streak and its achievements are free with an account."
- The product page no longer shows a result, a session link or played marks on "More games". The play control still follows access.
- Every signed-in player sees the link to their game page, on every game, 36,000 Summers Ago included.
- "How to connect" inside the play dialog marks the page it left. Back from How it works reopens the dialog on the same prompt, at every width.

### 4. Game pages (`gs-library.jsx`, `gs-puzzles-library.jsx`, `gs-casebook.jsx`, `gs-delve-library.jsx`, `gs-data.jsx`, `gs-discover.jsx`)
- The streak and the strip count only completed editions (`done`). The current edition adds nothing while in progress or failed, and breaks nothing until its day or week ends. This applies to the four dailies and Escape, Casebook (solved) and Delve (rescued). Casebook's streak figure is now derived from its record, not the fixed 3.
- The legend reads "Completed / Not completed", and the accessible label matches. 36,000 Summers Ago keeps "Played / Not played" because it counts days played and has no streak.
- New states: `library-mystery-never-played`, `library-word-streak-broken` (the completed replay appears in recent plays with the R chip; History in that state shows the same two plays, `phLog` in `gs-history.jsx`), and three in-progress states for a free account.
- In the Library list, Discover and Home marks, an edition in progress now says "In progress" for every player. The Config row "This week, or today: In progress" now applies to a free account.
- New line after the Pass-ended paragraph: "You can't earn any more of the frozen ones until the Pass returns." It shows only when something is frozen.
- Every achievement row now shows its name, its how-to line, and the earned date or progress.

### 5. Session pages and sharing (`gs-session.jsx`, `gs-history.jsx`, `gs-casebook.jsx`, `gs-delve-library.jsx`)
- "Play again" carries the Pass tag inside the button when a player without the Pass would need it. Pressing it still opens the prompt.
- One share text: `gsShareText`, the session page's. Delve's game page now uses it too. Casebook keeps `cbShareLines`, now the only Casebook text, because its results open Casebook's own case page.
- A replay (`s.again`) shows no Share on its session page. A Casebook replay page shows no share block.
- The state `session-casebook` now opens Casebook's case page (`c0928`).

### 6. Home and not-found (`gs-home.jsx`, `gs-site.jsx` via `land`)
- What's new 1.9 now reads: "Copy any result as text" / "You can copy any finished result as text and paste it anywhere. The full record of rolls, guesses and statements stays on its session page."
- Signed in, "Go home" opens Discover, and so does any route to home. New state `not-found-signed-in`.

### Docs
- `CLAUDE.md`: the trial is 14 days.
- Superseded notes added at the top of `docs/specs/free-and-pass/handoff-2026-10-09-free-and-pass.md` and both `docs/specs/username-1/` handoffs. Their bodies are history and were not rewritten.

## Staged states (`?state=<id>`)
`username-new-account`, `sign-in-new-device-provider`, `delete-account-code-provider`, `pass-cancel-sheet-payment-failed`, `pass-cancel-fails`, `pass-resume-fails`, `pass-switch-fails`, `pass-keep-fails`, `library-mystery-never-played`, `library-word-streak-broken`, `library-casebook-free-in-progress`, `library-delve-free-in-progress`, `library-list-free-in-progress`, `not-found-signed-in`.

Changed: `username-new-account` and `username-taken` now open signed out, after a Google sign-up, and `session-casebook` now opens Casebook's case page. The QA walk is "Walk sweep 2026-10-10" in `app/qa.jsx`.

## Yours-to-decide choices
- **Back over an auth page while signed in:** lands on Discover, the signed-in home. It matches the demo switch.
- **The Pass mark on Play again:** the system's Pass tag inside the button. It reads as a mark, not a gate.
- **The share text kept:** the session page's (`gsShareText`), because it is the general builder, already used by the puzzle game pages. Casebook's own text stays its only one.
- **Wording:** the box label and line, the reminder line, the four failure lines, the frozen line, What's new 1.9, the code-step copy on delete, and the in-progress lines on the first case and first scene. All are quoted above.

## Asked to list, not changed
- "FREE IN FULL" survived only in the old Games page in `gs-home.jsx` (`GsGames`, `GsGameMore`, `GS_MORE`). Discover replaced it (`gs-discover.jsx` overwrites `window.GsGames`), so no player could see it. Deleted 2026-10-10 with the owner's go-ahead; git history keeps it.
- Code comments say "free in full" (`gs-data.jsx`, `gs-library.jsx`). They are not shown to players.
- `gs-player.jsx` `GpPlayer` seed links Casebook plays to session `casebook`. It is a fallback page that nothing reaches while `GS_LIBRARY.casebook` exists.
- Discovery hints: no achievement line names a hidden thing outright. Possible flags: Delve's "Find the tunnel out of the warren." and "Find your way into the drifting freighter's hold." name places.

## Already present, or did not match
- Escape strings such as "The door's locked" and "Still locked in" are game content, not Pass wording, and were left alone.
- The brief says "lock" wording should never describe what happens when a Pass ends. Code identifiers (`state: 'locked'`, `is-locked`) are unchanged because they are not shown.

## Unresolved
- The new routing rule (`land`) hasn't been walked by hand at phone width. The play-dialog reopen on Back depends on the dialog not pushing its own history entry.
- If a free account plays its first case while its Pass has lapsed, the case shows as finished. In-progress staging covers a free account that has never held the Pass.
