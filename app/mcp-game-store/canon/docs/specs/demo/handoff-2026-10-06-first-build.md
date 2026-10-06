# Handoff 2026-10-06: nine-screen prototype, first build

No ticket yet. The prompt came in through chat (nine screens, home to a played game and its result).

## What landed
- `index.html` + `app/gs-*.jsx`: the nine screens, the shared top bar, the demo bar, and the play, share and menu pop-ups. Built on the bound design system's bundle (`_ds/…/_ds_bundle.js`).
- Sign up and sign in follow the Circlists prototype's `app/auth.jsx` flow and structure (two steps, the failure line, the Apple no-account stop, the one-time code, password recovery). Only the look and the name change.
- Billing follows Circlists's `app/subscriptions.jsx` provider boundary: a short "Opening secure payment" wait, then the provider's own page (stand-in), then back to the Pass screen.
- States register (`app/states.jsx`), one QA entry (`app/qa.jsx`) and Config rows (`app/gs-config.jsx`) for the hard-to-reach states.

## Decisions made while building, NOT ratified
1. "Get the Pass" on the Pass screen goes through the provider checkout stand-in before switching to Pass. The brief says it switches the view directly.
2. Signed out, "Get the Pass" and "Play in your AI" go to sign up first (billing and connecting need an account).
3. Sign-up adds "Verify your email" (a code) after "Create account", as Circlists does.
4. Copy written here, not in the brief: sign-up subtitle "One account for every game you play.", sign-in subtitle "Pick up where you left off.", the word-puzzle chat lines and caption, the session move lists, "Share this result", connect step 2 for each assistant.
5. The Google and Apple buttons carry no brand marks (the system has no third-party icons). Apple's button rules are not met.
6. Today's puzzles: free shows one solved (Word Puzzle); Pass shows all three played, to match History's six rows.
7. Streak labels read "Your streak" / "Your record" above "Streak: 12 days" / "Record: 41 solved, 6 missed".
8. Daily Puzzles carries no age tag on Games: the brief gives none.
9. Threat's up arrow is the system's back icon turned 90 degrees.

## Open
- Manage or cancel the Pass (Circlists's ManageFunding) is not built.
- Brand, voice and behaviour sources in the CLAUDE.md product block are still placeholders, so nothing was read live beyond the design system and its copy of `ui-design.md`.
