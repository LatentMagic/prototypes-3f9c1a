---
date: '2026-10-06'
topic: 'demo'
status: 'in-progress'
type: 'implementation'
---

# Handoff: demo — nine-screen [Platform] prototype, home page rebuilt

## Current Focus

The home page was rebuilt after the follow-up (`FOLLOW-UP-2026-10-06.md`) called the first opening inelegant and too much like selling. The next session should get the user's verdict on the new home page first. Two questions are open in chat:
1. Keep the payment provider checkout between "Get the Pass" and the Pass view, or switch straight to Pass as the brief says?
2. Is 34px (the design system's page-title size) big enough for the home headline, or may the home page go larger?

Everything else is background until those are answered.

## Task(s)

- Done: all nine screens from `PROMPT.md`, linked; the demo bar; the play, share and menu pop-ups; account popover on desktop, menu sheet on phone.
- Done: sign up and sign in copy the flow of the Circlists prototype's `app/auth.jsx` (project 3f1df829…, read live). Billing copies its `app/subscriptions.jsx` provider boundary (`ProviderShell`, `Checkout`).
- Done: home page rebuilt. The opening is headline, sub-line, "Start free" plus "See how it works", "Works with…". On the right is the word-puzzle chat window on a flat-shape panel. Then Games, How it works, Who does what, Who gets what, and the foot line, each section on a ruled band.
- Done: a Screens group in the states register covering every screen and its free and Pass versions.
- Not verified: the background verifier was interrupted once and has not reported on the rebuild. Screens other than Home have not been checked by eye at 320px, at the phone frame, or on desktop.

## Critical References

- `CLAUDE.md`: the ratification rule. Every item under "Unratified decisions" below needs the user's word before it is treated as settled.
- The design system guide (bound at `_ds/mcp-game-store-design-system-ef1abd5b-…/`) and its copy of `ui-design.md` (`/projects/ef1abd5b-…/guidelines/source/ui-design.md`).
- `PROMPT.md`, the brief, holds the exact wording for screen 4 (Delve).

## Recent changes

- `index.html`: the design system's stylesheets and bundle are loaded; product CSS is in the "[Platform] product" block (container queries on `.gs-root`); the launcher is moved to `bottom: 60px` to clear the demo bar.
- `app/gs-data.jsx`: demo content (games, puzzles, sessions, rolls, history), covers as flat-shape SVGs, the scroll helpers.
- `app/gs-parts.jsx`: top bar, account menu, demo bar, play pop-up, chat window parts, tags, stat tile, track.
- `app/gs-home.jsx`: Home (rebuilt), Games, Pass.
- `app/gs-delve.jsx`, `app/gs-puzzles.jsx`, `app/gs-session.jsx` (Session and History), `app/gs-auth.jsx`, `app/gs-connect.jsx` (Connect and the checkout stand-in).
- `app/main.jsx`: route, view (out/free/pass), connected and review state; the `gs` context; `window.gsApi`.
- `app/states.jsx`: the Screens, Plans, Sign in and Billing groups. `app/qa.jsx`: one entry, "nine-screens". `app/gs-config.jsx`: Config rows for the AI connection, provider failure, Apple account and card declined. `app/config-extra.example.jsx` is deleted.

## Learnings

- `_ds_bundle.js` also writes `window.TopBar`, `AllGames`, `GamePage` and `SignIn` (from its shop UI kit). Every product global here is prefixed `Gs` to avoid them.
- The kit's `button:focus-visible` and `input:focus-visible` rules colour focus in the kit's blue accent. `.gs-root :focus-visible` overrides them with the system's off-white.
- `DS.Tag` is `nowrap` at a fixed height, which overflows at 320px for long tags. `.gs-root .mcp-tag` lets them wrap.
- Pop-up posture follows the measured root width (`gs.narrow`, under 640px) rather than the viewport, so the phone frame on a desktop screen still gets a sheet.
- The uploaded PDF can be read as text but not rendered to an image here (it timed out). Its only page is an earlier Delve game page with a free first scene, which the brief rules out. Nothing was taken from it except as confirmation of the Delve content.

## Artifacts

- `docs/specs/demo/PROMPT.md`: the original prompt, verbatim.
- `docs/specs/demo/FOLLOW-UP-2026-10-06.md`: the follow-up, verbatim.
- `docs/specs/demo/2026-10-06_prop-chat-games-platform-poc.pdf`: the PDF the user supplied, moved from `uploads/`.
- `docs/specs/demo/handoff-2026-10-06-first-build.md`: the first build's handoff, with the first list of unratified decisions.
- `docs/specs/demo/README.md`: the index.

## Action Items & Next Steps

1. Get answers to the two open questions under Current Focus.
2. Check every screen at 320px, at the phone frame and on desktop, with the user's live view for pop-ups and sheets (GOTCHA 2). Fix what breaks.
3. Go through the unratified decisions with the user, one per turn.
4. If the user wants it: Manage or cancel the Pass (Circlists's `ManageFunding`), brand marks on the Google and Apple buttons, and Apple's button rules.
5. Once the user signs off, delete the QA entry "nine-screens" (`app/qa.jsx`) and ask whether this earns a `CHANGELOG.md` entry.

## Other Notes

### Unratified decisions (beyond those in the first-build handoff)
- The home opening uses the word-puzzle chat on a flat-shape panel (indigo ground, amber, teal, cream and orange shapes). This treats the panel as a cover for the shop.
- The home order is now Hero, Games, How it works, Who does what, Who gets what. The brief listed How it works first.
- New home copy: the button "See how it works", the link "All games", and How it works step 1 now ends "Copy one link into its settings, once."
- The states register now lists every screen. ARCHITECTURE.md says the register is not a sitemap; the user asked for this, but the rule should be revisited with them.

### Home proposal and logo (second pass)
- Ratified by the user, 2026-10-06: the Proposal is the home page; the old version and its Config switch are removed. The Daily Puzzles card tag reads "10 min" (was "about 10 min").
- Proposal: a WORKS WITH label under the buttons; the headline goes up to 52px on desktop, on two lines broken after "you."; the opening shows the word puzzle inside an AI app window (title bar with window buttons, "Reply to your AI" box) over four real game covers; the two game cards are wide, with today's three puzzles listed inside Daily Puzzles and "PART OF THE PASS / A new scene every week" plus the first two pitch sentences inside Delve; How it works uses the brief's wording exactly; Who does what is two columns without cards; Who gets what has "Start free" and "£— / See the Pass" at the foot of its two cards.
- The logo from the design system (`assets/logo.svg`) is in the top bar next to "[Platform]", is the favicon, and marks every "[PLATFORM] ·" server panel in the chat windows.
- Not addressed yet: a site footer (legal, a page on connecting your AI). The Circlists reference site has one.

### Constraints
- No new colours or fonts. Phone first. Every overlay must be a sheet on a phone and a window on desktop.
- The user is frustrated with how the home page looked. Read that as urgency about first impressions. It is not licence to redesign other screens without asking.
- The product block in `CLAUDE.md` is still placeholders. No brand, voice or behaviour sources can be read live yet.
