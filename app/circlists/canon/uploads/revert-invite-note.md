# Revert: Circle invites go back to the address-bound card

Claude Design has no version control, so this is the "before" for one change. Everything else in the last export stays: the Apple sign-in stop, the sign-in failure line, the report-failure line, Config's sign-in rows.

## What to undo

The invite card (Circle settings → Invite a member) was changed from "type the friend's email, get a link bound to that address" to "press Get a link, no address, link works once and lasts 7 days".

Go back to the earlier behaviour: the champion types the friend's address and the card hands back a link **bound to that address**, to copy and send. The app mails nothing. Nothing is remembered: no invited list, no pending row, no delivery state, no revoke, no resend.

## The swap

1. **`app/invite-link.jsx`** holds almost all of it. `invite-link.before.jsx` beside this note is the whole file as it was; replace the current file with it. (It is the only file the card lives in; `app/spaces.jsx` only calls it.)
2. **`app/spaces.jsx`**, the Accept-invite error page body:
   - now: `An invite link works once and lasts 7 days. Ask whoever invited you for a new one.`
   - before: `It may have expired or been revoked.`
3. **`app/states.jsx`**, Invitations group:
   - `invite-invalid` label was `Accept invite — invalid` (now `Accept invite — a spent, expired or broken link`).
   - Remove the state `invite-link-card` ("Get a link — the card, no address; press again for another").
   - `stageInviteRefusal` was `() => { … window.CIRC_INVITE_MINT_FAIL = true; … }` with no `fail` parameter; now it is `(fail = true)` and sets `= fail`. Revert to the no-parameter form.
4. **`app/qa.jsx`**, the `invite-links-and-sign-in-stops` list: drop the "Get a link: press it, then Get another link…" step and `invite-link-card` from its `steps`; fix the note's item 1 (it describes the no-address card). Leave the other items.
5. **`docs/specs/invite-links-and-sign-in-stops/`**: note in its handoff that the invite part was reverted.

Check by reading, not by memory: if the current file differs from this description, the current file wins on what is there, and `invite-link.before.jsx` wins on what to restore.
