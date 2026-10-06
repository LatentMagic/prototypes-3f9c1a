# Handoff — hidden email on Members (2026-10-05)

A member who hides their email at sign-in leaves the app holding an address ending `@privaterelay.appleid.com`. Mail from another member never reaches it, so Members no longer shows it as a contact.

## What changed
- `app/spaces.jsx`: `isHiddenEmail(e)` (matches `@privaterelay.appleid.com`). In the Members roster, where a row shows an email (your own row; the champion's row), a hidden address renders `Email hidden` in its place: same slot, 12px / 400 / `--color-fg-3`, italic (ratified), no link, icon or tooltip. Normal addresses unchanged.
- `app/states.jsx`: two register states in Members & funding, both on Book Club with existing members:
  - `members-champion-email-hidden` — Joe M. (champion) holds a relay address, seen by you as a member.
  - `members-own-email-hidden` — your own account holds a relay address; Joe M. normal.
- `stageNonChampion` now routes through the same staging with nothing hidden, so a hidden state run first does not leak into "Members — non-champion".

## Nameless member (2026-10-06)
A person can now join without a name. Canon had never had one.
- `app/spaces.jsx`: a Members row with no name reads **"A member"** in the name slot (and in its menu's accessible label). Avatar unchanged (two dots, from `initialsOf`).
- A nameless champion is matched to their row by `championEmail`, since the champion is otherwise identified by name. `unchampioned` now also checks `championEmail`, so a nameless champion still counts as a champion. Every "champion left" state already clears both fields, so none of them change.
- `app/states.jsx`: `members-champion-nameless-email-hidden` shows Joe M. as the nameless champion with a relay address, seen by you, reading "A member" over "Email hidden". Joe's row is rebuilt on every staging, so the nameless row never leaks into other states.
- Not touched or checked, and these may show a blank name for a nameless member: the Block dialog and Blocked label, reaction and comment attribution, the feed lens, "Added by" lines, and the Remove-member confirm.

## Ratified
- Treatment: italic (owner, 2026-10-06). "Quieter weight" could not be met with weight or colour: the address already sits at the lowest loaded weight (400) and the lowest AA text colour (`fg-3`).

## Built, not ratified
- Copy: **"Email hidden"** (proposed wording).

## Other places canon displays an email (not touched)
- Members, champion's Funding card: "Billed to {championEmail}" (`app/spaces.jsx`).
- Account page: your address under the title; Change email flow ("Enter the code sent to …") (`app/spaces.jsx`).
- Funding page "Billed to", provider checkout Email field, Manage funding header (`app/subscriptions.jsx`).
- Per-person pricing Account card "Billed to" (`app/pricing-account.jsx`).
- Sign-in / sign-up code entry and recovery code ("Enter the 6-digit code sent to …") (`app/auth.jsx`).
- Invite card: the address typed for a link (`app/invite-link.jsx`) — input, not display of a member.
