# Handoff: landing from Connect playground

Date: 2026-10-09. Asked by the owner for Johnny. Nothing here is ratified.

## The question
When a player presses Connect (Authenticate) in their AI, the AI opens [Platform] in a browser to sign in. Should that page be the home page, or something more direct that still says what the product is, without being the Sign in page?

## The rig
`playground/index.html` (with `pg-authorize.jsx`) mounts the real app on a route `authorize`. It overrides `GsNotFound` for that route only, and `GsDemoBar`. Nothing in `app/` changed. Strip: Option 1 to 3 (Why gives idea and cost), Go 1 Arrive / 2 Connect / 3 Connected, Who: Claude or ChatGPT, signed out or signed in. Key `pg_authorize_v1`.

- 1, The home page with the request on top: the real home with a band naming the AI and Continue.
- 2, The request beside the product: sign-in on one half, what [Platform] is and every game on the other. Phone: sign-in first.
- 3, Connect first, the product after: sign-in with one product line; after Connect, a page of games with a prompt each and Back to the AI.

Shared by all three: Google, Apple and email (the app's own buttons and sign-in rules); a connect step saying what the AI may do, with Connect and Cancel; a not-connected page after Cancel; signed in, every option opens on the connect step. After Connect, options 1 and 2 hand straight back to the AI (shown as a marked playground stand-in).

## Open, for the owner
- Which option, or which parts combined.
- Email here is one form for new and returning players; a new account would still need the email code and a username. Not built.
- Consent wording ("will be able to", "can’t buy anything") is a draft and needs the voice pass and a check against what the server's MCP scopes really allow.
- Option 2's game list grows with the library and needs a cap.

## Checked
Desktop (924px) and phone layout (390px root) for every option and step; Claude and ChatGPT; email validation; Cancel. No console errors. The automatic verifier can't resolve base-relative paths here; checks were by hand.
