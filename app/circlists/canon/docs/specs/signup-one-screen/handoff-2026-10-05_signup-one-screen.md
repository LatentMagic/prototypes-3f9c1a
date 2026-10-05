---
date: '2026-10-05'
topic: 'signup-one-screen'
status: 'in-progress'
type: 'exploration'
---

# Handoff: signup-one-screen — fitting sign-up (and sign-in) on one phone screen

## Current Focus

The user is reviewing the playground. They lean to **04 Email on request** ("a strong way to progress if it's considered a normal way of doing things"). The open question to them: when the email form opens, keep Google and Apple above it (**04**) or replace them with a "Use Google or Apple instead" line (**04.1**)? Nothing is ratified. Do not build into `app/` until they ratify an option in words.

Background: the mobile-readiness delta was built into canon earlier the same day. Its handoff is `docs/specs/mobile-readiness/handoff.md`. Read it only if the work touches that delta.

## Task(s)

- **Done: the playground** `docs/specs/signup-one-screen/playground/pg-signup-fit.html` + `pg-signup-fit.jsx`, listed in `playgrounds.json` (ticket slug `signup-one-screen`).
  - An option board. Each option draws **sign-up and sign-in side by side**, composed from the app's own parts (`Field`, `Button`, `OrDivider`, `AppleButton`, `ConsentLine`, `TextLink`, `OutLink`, `Wordmark`). 00 mounts the shipped `SignUp`/`SignIn`.
  - Each page is drawn whole, scaled to the window, with a dashed line where the screen ends. Readouts below: "Fits, Npx spare", "Fits by Npx only" (under 24px, amber: the screen estimate cannot promise it), or "Runs Npx past".
  - Screen picker: SE Safari 375×548, SE app 375×647, 15 Safari 393×659, 15 app 393×793, Laptop 1366×625. These are approximate visible heights.
  - Horizontal scroll, with a jump row of option buttons. "Full screen" per page opens it at the real window size, for testing on a phone.
- **Options:** 00 Today · 01 Less air (on a phone the screen is the card, the rhythm one notch down) · 02 + the password rule moves into its label and the subtitle goes · 03 + Google and Apple first · 04 Email on request (Google, Apple, then Continue with email, which opens the form in place) · 04.1 the same, but the open form replaces the buttons with a one-line way back · 05 every control at the 44px floor and Sign in moved under the heading.
- **Measured** (sign-up / sign-in):
  - SE app: 00 −301/−190 · 01 −97/−18 · 02 −42/+12 hair · 04 +215/+215 · 05 +11 hair/+59.
  - SE Safari: only 04 and 04.1 fit (+116).
  - Laptop 625: 04 +143. 05 runs 61 past.
  - Opened, on SE app: 04 sign-up −42, sign-in +12 hair. 04.1 +55/+110.
- **Done earlier this session:** Continue with Apple is on web and app alike (the owner's correction). `auth.jsx` has no `isApp` gate. The app-only sign-in/sign-up states, the mobile-list lines and the QA steps were removed. MOBILE.md, ARCHITECTURE.md and the mobile-readiness handoff were updated. CHANGELOG entry "The app gets ready for the stores — 2026-10-05" was written at the user's request.

## Critical References

- `CLAUDE.md`: the ratification rule. Present options, recommend, wait.
- monorepo `specs/governance/standards/ui-design.md` (live): no overhanging line, the touch floor, consistent affordances. "Fill by arranging, not stretching" bears on the laptop read.
- `skills/build-playground/SKILL.md`: playground rules, including "frame the whole surface" and "put the objection on the page as a fact".

## Recent changes

- `docs/specs/signup-one-screen/playground/pg-signup-fit.jsx`: `PG_OPTIONS` (copy, stances, costs), `PgAuth` (variant page, both kinds), `PgFrame` (measure + fold), `PgBoard`.
- `docs/specs/signup-one-screen/playground/pg-signup-fit.html`: `<base href="../../../../">`, board CSS (`.pg-grid` horizontal scroll-snap, `.pg-below`, `.pg-screenend`, `.pg-read[data-v]`).
- `app/auth.jsx`: `AppleButton` always rendered under Google on `SignIn` and `SignUp`.
- `CHANGELOG.md`: top entry.

## Learnings

- The first board cropped each page to the screen height inside a scrolling box taller than the window. Pages that fit read as not fitting, with no CTA in view. Draw the whole page, scaled, with the fold drawn on it.
- A 12px fit on an estimated screen height is not a fit. Treat anything under 24px as too close to call.
- Any sign-up fix changes sign-in too (same frame, order and providers). Always draw both.
- "One screen" can only mean the page on arrival. Once a field takes focus, the keyboard takes about half the screen and every form scrolls.
- The preview's "referenced file not found" warning for this rig is the base-relative false positive. The page loads; tokens render.

## Artifacts

- `docs/specs/signup-one-screen/playground/pg-signup-fit.html`, `.jsx`
- `playgrounds.json` (new ticket entry at the top)
- `CHANGELOG.md`

## Action Items & Next Steps

1. Get the user's read on the board. If 04 or 04.1: confirm which, and whether sign-in takes the same pattern. The board assumes it does; ask, don't assume.
2. On ratification, decide with the user whether it lands straight in `app/auth.jsx` (`SignIn`, `SignUp`, maybe `AuthFrame` for the phone frame) or as a candidate build (only if they ask for one).
3. Settle the open details in words before building: the label ("Continue with email"), where focus lands, what Back does with the form open, whether the email form remembers being open across the sign-up ↔ sign-in switch, and the error and OTC paths after Create account.
4. Check every width the change ships at: 320, 375, 390, desktop. Check the share-intake sign-in lead (`ShareSignInLead`) still sits above the card.
5. Ask before any CHANGELOG addition for this.

## Other Notes

- The user wants short replies and one decision per turn. Last line leads with an emoji and carries the ask.
- The user wants no two-screen wizard. 04 is in-place disclosure on one page, and they accept it if it is a normal pattern. It is: providers first, then "Continue with email" opening the form.
- Not done: sign-in alone has not been reviewed as its own surface. Recovery/OTC are untouched.
