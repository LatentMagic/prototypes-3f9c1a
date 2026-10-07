# Handoff: usernames (username-1)

Written 2026-10-07. Resume state is in `handoff-2026-10-07-usernames.md`.

## Built, and where
- **Sign-up form** (`app/gs-auth.jsx`): Email, Password, "Create account". First and last name fields and their errors are gone; autofocus is on Email.
- **Your username screen** (`app/gs-username.jsx`, route `username`): once per new account, after the email code or the Google/Apple return loader, before Connect your AI. On Get the Pass it comes after checkout, or on "Cancel and return" from checkout, before the Pass page. Never on sign-in.
- **Account page**: a Username card above the Pass card, on email and provider accounts.
- **Where the username shows** (`app/gs-parts.jsx`, `app/gs-session.jsx`): menu trigger, menu header (email beneath), avatar initial, and a small line on the share card. A rename shows at once.
- **Demo player**: MonaLaser. First and last name are removed from the app's source.

## Staged states
- `?state=username-new-account`: Your username screen
- `?state=username-taken`: Your username, taken
- `?state=account-username-wait`: Account, username in the 30-day wait
- Config row "Username: Free to change / Changed recently"; QA entry `username-1`.

## Changed from the written direction
- **Account card follows Change email, not Change / Save / Cancel.** Joe asked to use what the page already has. The card says "Your username is <name>.", then an empty "New username" field and one button, "Update username", the same shape as Change email. There is no resting "Change" state, so no separate "Account, username change open" register entry: the Account page is that state.
- No identity confirmation pop-up on rename (Change email has one because it changes a sign-in credential).
- During the wait the field is replaced by the muted line under the "Your username is" sentence, not a disabled field.

## Revised after review
- Helper line is now "This is your display name. Other players can see it." on both the screen and the card; "don't use your real name" is dropped.
- The card is one line ("Your username is <name>."), an empty "New username" field whose placeholder is the rule ("3 to 16 letters and numbers"), the display-name line, and the button. The separate rules line is dropped on the card; the errors still name each rule.

## Decided here
- Word lists for generated names are in `app/gs-username.jsx`.
- Saving the Account field unchanged does nothing and starts no wait. A case-only change counts as a change.
- A trailing underscore is allowed: the rules give no error for it.
- Near-matches are built from what was typed: `<Name>7`, `<Name>X`, `The<Name>`.
- Button label "Update username" is new copy, taken from "Update email".

## Not built / open
- The 30-day wait always reads "6 November"; it is not calculated.
- A new account has no username between sign-up and the Your username screen; the avatar falls back to the email initial there.

## Next
Joe's reaction on the Account card shape and the Get the Pass order.
