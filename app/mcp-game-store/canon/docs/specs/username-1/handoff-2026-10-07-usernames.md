---
date: '2026-10-07'
topic: 'usernames'
status: 'in-progress'
type: 'implementation'
---

# Handoff: usernames — store has a username and no real name

## Current Focus

**Account page Username card ratified by Joe, 2026-10-07** ("yep all good"): title "Username"; "**<name>** is your public name. You can change it once every 30 days."; field "New username", placeholder "Enter a new username"; button "Update username". In the wait the field is replaced by "You can change it again on 6 November." Rules appear only as errors after a failed save, on the card and on the Your username screen (helper and rules lines removed from both). User-menu identity block: name/email gap tightened. Everything else is built and unreviewed by Joe.

## Task(s)

Done: the prompt in the pasted "Store front end: usernames" (sections 1 to 3, stages and controls). Built and loading with no console errors; **not** click-tested at 390/320px and no verifier result came back. Sign-up lost First/Last name; new "Your username" route; Account card; username in menu, avatar, share card; register, Config row, QA entry.

## Critical References

- `docs/specs/username-1/handoff.md`: the prompt's required handoff (what built, addresses, changes from "not decided" direction).
- `CLAUDE.md`: ratification rule. Joe's "use what we have" ratified the Change email shape; the copy lines below are mine and unratified.
- Upstream prompt/design law are named in the product block of `CLAUDE.md` (still placeholders there).

## Recent changes

- `app/gs-username.jsx` (new): `gsGenName`, `gsUsernameRules`, `gsNear`, `GsUsernameField` (shared field, helper, rules, near-match buttons; `noRules`, `label`, `placeholder` props), `GsUsername` (screen), `GsUsernameForm` + `GsUsernameCard` (Account).
- `app/gs-auth.jsx`: name fields and rules removed; `useGsForm` gained `set`, `focus`, and `opts.tried`.
- `app/main.jsx`: `GS_USER_DEFAULT` is `{ username: 'MonaLaser', locked: false, email }`; `newAcct` state; `signedUp` goes to `username` (or checkout); `nameChosen`; `afterCheckout` (used by `paid` and checkout's "Cancel and return" in `app/gs-billing.jsx`); `setUser` passed to `buildStates`.
- `app/gs-parts.jsx`: `gsName` replaces `gsFullName`; avatar uses it. `app/gs-session.jsx`: share card shows `gs.user.username`.
- `app/gs-account.jsx`: `<GsUsernameCard />` above the Pass card.
- `app/states.jsx` (group Username, three ids), `app/qa.jsx` (`username-1`), `app/gs-config.jsx` (Username row). `index.html`: script tag, `.gs-sugg`, `.gs-name-pair` removed.

## Learnings

- Scripts do not share Babel scope: `GS_ACCT_CARD` from `gs-account.jsx` is not visible in `gs-username.jsx` (loaded earlier); its style is inlined.
- `locked` lives on `gs.user`, so the Config row and the Account card read one value. The form is a child mounted only when unlocked, so Config flips never leave a stale field.
- Joe's reactions so far: a prefilled field reads wrong; a large name plus label plus example placeholder plus helper plus rules reads as the same thing four times; "don't use your real name" is not wanted; invented example placeholders are not wanted. Prefer the Change email / Change password patterns (placeholder as hint).
- Nothing yet worth adding to `GOTCHA.md`.

## Artifacts

`app/gs-username.jsx`, edits listed above, `docs/specs/username-1/README.md`, `handoff.md`, this file.

## Action Items & Next Steps

2. Click-test: email sign-up, Google, Apple, Get the Pass (pay, and cancel at checkout), sign-in (no screen), taken name with suggestions, 2-char / space / digit-start errors, rename then menu/avatar/share card, wait line; at 390 and 320px.
3. Ask Joe to ratify the 3 error lines and the Your username screen as it now stands.
4. When signed off: delete the `username-1` QA entry; ask before a `CHANGELOG.md` entry.

## Other Notes

- Wait date is fixed text "6 November". Saving an unchanged name on Account does nothing.
- "Account, username change open" has no register entry: with the Change email shape the Account page is that state.
- Do not reintroduce Change / Save / Cancel or a prefilled field unless Joe asks.
