---
date: '2026-10-05'
topic: 'signup-one-screen'
status: 'in-progress'
type: 'exploration'
---

# Handoff: signup-one-screen, the auth frame (two steps, no card, where the brand lives)

## Current Focus

The user is walking **`playground/pg-auth-02.html`** (02 explored) and will say where the brand mark lives: **02.1** mark above the title, **02.2** mark on the title, **02.3** mark in the header, **02.4** wordmark at the foot. Their earlier flags, which 02.1–02.4 answer: the wordmark looks wrong locked to the top and would look wrong locked to the heading. The buttons look too big for their column. Without the card the page is cluttered with small text. The same container should serve sign-in and sign-up. They said "right direction, not perfect yet".

Nothing is ratified for `app/`. Do not build into `app/auth.jsx` until the user ratifies the final shape in words.

## What the user has said, in order (their words carry the ratification)

1. **04 Email on request is the direction**: Google, Apple, then Continue with email. Ratified in words ("04 is just simply the way to go").
2. **Every part of sign-in and sign-up fits one screen.** "Really inappropriate that any part of sign-in or sign-up doesn't fit onto one screen … very unprofessional." This is the hard requirement.
3. **Two steps, normal industry pattern.** Step 1 holds the providers and Continue with email. Step 2 is the email form alone with a **back arrow**, no Google or Apple. I first kept the providers on step 2 (reading 04 literally); the user expected a back button and was right. The proposal file was updated in place to match.
4. **Drop the white card.** Accepted "that direction", i.e. 02: no card at any width, as the Create circle page. Why Create circle dropped it (`app/wizard.jsx` header comment): on desktop a floating panel read as a modal, which is wrong for a real full-page route. The user had misremembered it as card-on-desktop.
5. **Explore 02 as its own playground**: options to react to, the brand's position as the main axis. "Replicate the harness, don't rewrite what you don't have to."
6. **No screen picker**: use canon's Config (Platform / Viewport) for posture instead.

## Task(s)

- **Done: `playground/proposal-email-on-request.html` + `.jsx`.** Today's card and rhythm in two steps (back arrow on step 2 via `AuthFrame`'s `onBack`). Kept as the record. Superseded by the frame playgrounds.
- **Done: `playground/pg-auth-frame.html` + `pg-auth-frame.jsx` (rig) + `pg-auth-frame-pages.jsx` (pages).** 00 Today · 01 card on desktop only · 02 no card anywhere (Create circle's frame) · 03 brand on step 1 only. User took 02.
- **Done, under review: `playground/pg-auth-02.html` + `pg-auth-02-pages.jsx`.** Reuses the rig and pages above through `window.AF_RIG`. Options 02 (reference) and 02.1–02.4. All 02.x options use 44px buttons, a 360 column on desktop (400 on a phone) and the small print (terms, switch line) pinned to the screen's foot. Strip levers (Auto + override): **Buttons** 52/44, **Small print** under buttons / at foot.
- **Settled in every option, not yet put to the user as a decision:** step 2 drops the subtitle and the switch line (step 1 holds both), and the password rule sits beside its label ("Password · At least 8 characters"). That is what lets step 2 fit a small phone's browser. Confirm before building.

## Measurements (natural page height vs visible height)

- Visible heights used: iPhone SE Safari 548, SE app 647, iPhone 15 Safari 659, 15 app 793, laptop 1366×625.
- pg-auth-frame (before 02.x): 01/02/03 fit every phone. 01 on laptop: step 2 sign-up runs 30px past (the card's padding).
- 02.x at a 380 phone width: sign-up step 2 is 02.1 583 · 02.2 531 · 02.3 531 · 02.4 573 (px). So on SE Safari (548), 02.1 runs ~40px past and 02.4 ~30px, while 02.2/02.3 fit by a hair. All fit SE app. These were read in a short preview iframe, where `--af-vh` floors the vh-based padding; real devices add a few px. The costs in `AF02_OPTIONS` say this.

## Critical References

- `CLAUDE.md`: the ratification rule (present, recommend, stop); replies ≤150 words, one decision, last line led by an emoji.
- monorepo `specs/governance/standards/ui-design.md` (read live this session): no overhanging line, fill by arranging not stretching, consistent width, touch floor (44), text-input 16px floor.
- `skills/build-playground/SKILL.md`: number + name + stance + cost per option; mount the app's parts; the Auto + override levers (`references/rig-patterns.md`).

## Recent changes

- `docs/specs/signup-one-screen/playground/pg-auth-frame.jsx`: the rig. Reads `window.AF_RIG` (`key`, `options`, `levers`), else its own `AF_OPTIONS`. Mounts canon's `ConfigLauncher` (`app/config.jsx`) for Platform/Viewport; Mobile (either) frames the page in the app's `.circ-phone`. Fit readout = a hidden copy at `--circ-vh: 0` (`.af-measure`) vs the visible height. `--af-vh` (1% of the drawn screen) feeds the wizard-body paddings so they follow the screen, not the window. Sets `--af-strip` so the launcher clears the strip (only when the launcher has no saved drag position).
- `pg-auth-frame-pages.jsx`: `AF_COPY`, `AfProviders({size})`, `AfForm({size, hintInLabel})`, `AfConsent`, `AfSwitch`, `AfHead`, options 00–03.
- `pg-auth-02-pages.jsx`: `Af02Page({cfg})` with `cfg.brand` above|title|header|foot, `cfg.btn` 52|44, `cfg.print` stack|foot; `AF02_OPTIONS`; `window.AF_RIG`.
- `pg-auth-frame.html` / `pg-auth-02.html`: `<base href="../../../../">`. The CSS carries, verbatim from `circlists.html`: the config launcher and modal, `.circ-wizard-body` by posture and the phone frame. `.af-b44` drops `AppleButton`'s inline 52 to 44.
- `playgrounds.json`: three new entries under `signup-one-screen` (02 explored, the auth frame, the proposal).
- Nothing in `app/` changed this round.

## Learnings

- `eval_js` async loops with `setTimeout` time out in the preview. Drive the rig synchronously with `ReactDOM.flushSync(() => el.click())`, and read layout straight after.
- `ready_for_verification` refuses these rigs (base-relative "file not found", a false positive), so the background verifier never forks. Check them by hand: flushSync measurements, one screenshot, then delete the screenshots.
- Babel `text/babel` scripts share top-level `const`s across files (auth.jsx's unexported `AppleButton` and `OrDivider` resolve). Redeclaring a name in a second file is a SyntaxError, hence `AF02_OPTIONS` + `window.AF_RIG` instead of a second `AF_OPTIONS`.
- vh in `.circ-wizard-body` measures the window, not a drawn phone. The rig overrides it with `--af-vh`.

## Artifacts

- `docs/specs/signup-one-screen/playground/pg-auth-02.html`, `pg-auth-02-pages.jsx` (current)
- `docs/specs/signup-one-screen/playground/pg-auth-frame.html`, `pg-auth-frame.jsx`, `pg-auth-frame-pages.jsx`
- `docs/specs/signup-one-screen/playground/proposal-email-on-request.html`, `.jsx`
- `docs/specs/signup-one-screen/playground/pg-signup-fit.html`, `.jsx` (the original seven-option board)
- `playgrounds.json`

## Action Items & Next Steps

1. Get the user's pick for the brand (02.1–02.4), plus any change to the 44 buttons, the 360 column or the small print at the foot. Iterate inside `pg-auth-02-pages.jsx` (add 02.x options; don't fork the rig).
2. Put the step-2 copy trims to the user as their own decision (subtitle and switch line off step 2, password rule in the label).
3. Settle in words before building: the label "Continue with email"; focus on step 2 (first field); what browser Back does at step 2; whether step 2 survives a sign-up ↔ sign-in switch (the rig resets to step 1); the error and OTC paths after Create account; where Forgot password goes.
4. On ratification, build into `app/auth.jsx` (`SignIn`, `SignUp`, the frame). Every auth surface shares `AuthFrame` (OTC, Recovery, the share-intake `lead`), so decide with the user whether they move to the new frame too. Check 320, 375, 390 and desktop, plus `ShareSignInLead` above the page.
5. Ask before any `CHANGELOG.md` entry. Update this folder's `README.md` to name this handoff as latest.
6. Swap the Apple stand-in mark for Apple's asset at build (from the mobile-readiness handoff).

## Other Notes

- The user reads visually, not reports: show, then ask one short question. They were frustrated once this session when I misread "04" and when replies felt like reports; keep to plain language.
- Pre-existing, untouched: sign-up's subtitle strands "of." inside today's card at phone width. On desktop the consent line ends on "Policy." alone (pg-auth-frame).
- `uploads/Screenshot 2026-10-05 at 09.50.14.png` (the user's real-app sign-in) arrived this session. Clear it with the user's word at session end.

---

## Inline reference: the previous handoff (`handoff-2026-10-05_signup-one-screen.md`), verbatim

> ---
> date: '2026-10-05'
> topic: 'signup-one-screen'
> status: 'in-progress'
> type: 'exploration'
> ---
>
> # Handoff: signup-one-screen — fitting sign-up (and sign-in) on one phone screen
>
> ## Current Focus
>
> The user is reviewing the playground. They lean to **04 Email on request** ("a strong way to progress if it's considered a normal way of doing things"). The open question to them: when the email form opens, keep Google and Apple above it (**04**) or replace them with a "Use Google or Apple instead" line (**04.1**)? Nothing is ratified. Do not build into `app/` until they ratify an option in words.
>
> Background: the mobile-readiness delta was built into canon earlier the same day. Its handoff is `docs/specs/mobile-readiness/handoff.md`. Read it only if the work touches that delta.
>
> ## Task(s)
>
> - **Done: the playground** `docs/specs/signup-one-screen/playground/pg-signup-fit.html` + `pg-signup-fit.jsx`, listed in `playgrounds.json` (ticket slug `signup-one-screen`).
>   - An option board. Each option draws **sign-up and sign-in side by side**, composed from the app's own parts (`Field`, `Button`, `OrDivider`, `AppleButton`, `ConsentLine`, `TextLink`, `OutLink`, `Wordmark`). 00 mounts the shipped `SignUp`/`SignIn`.
>   - Each page is drawn whole, scaled to the window, with a dashed line where the screen ends. Readouts below: "Fits, Npx spare", "Fits by Npx only" (under 24px, amber: the screen estimate cannot promise it), or "Runs Npx past".
>   - Screen picker: SE Safari 375×548, SE app 375×647, 15 Safari 393×659, 15 app 393×793, Laptop 1366×625. These are approximate visible heights.
>   - Horizontal scroll, with a jump row of option buttons. "Full screen" per page opens it at the real window size, for testing on a phone.
> - **Options:** 00 Today · 01 Less air (on a phone the screen is the card, the rhythm one notch down) · 02 + the password rule moves into its label and the subtitle goes · 03 + Google and Apple first · 04 Email on request (Google, Apple, then Continue with email, which opens the form in place) · 04.1 the same, but the open form replaces the buttons with a one-line way back · 05 every control at the 44px floor and Sign in moved under the heading.
> - **Measured** (sign-up / sign-in):
>   - SE app: 00 −301/−190 · 01 −97/−18 · 02 −42/+12 hair · 04 +215/+215 · 05 +11 hair/+59.
>   - SE Safari: only 04 and 04.1 fit (+116).
>   - Laptop 625: 04 +143. 05 runs 61 past.
>   - Opened, on SE app: 04 sign-up −42, sign-in +12 hair. 04.1 +55/+110.
> - **Done earlier this session:** Continue with Apple is on web and app alike (the owner's correction). `auth.jsx` has no `isApp` gate. The app-only sign-in/sign-up states, the mobile-list lines and the QA steps were removed. MOBILE.md, ARCHITECTURE.md and the mobile-readiness handoff were updated. CHANGELOG entry "The app gets ready for the stores — 2026-10-05" was written at the user's request.
>
> ## Critical References
>
> - `CLAUDE.md`: the ratification rule. Present options, recommend, wait.
> - monorepo `specs/governance/standards/ui-design.md` (live): no overhanging line, the touch floor, consistent affordances. "Fill by arranging, not stretching" bears on the laptop read.
> - `skills/build-playground/SKILL.md`: playground rules, including "frame the whole surface" and "put the objection on the page as a fact".
>
> ## Recent changes
>
> - `docs/specs/signup-one-screen/playground/pg-signup-fit.jsx`: `PG_OPTIONS` (copy, stances, costs), `PgAuth` (variant page, both kinds), `PgFrame` (measure + fold), `PgBoard`.
> - `docs/specs/signup-one-screen/playground/pg-signup-fit.html`: `<base href="../../../../">`, board CSS (`.pg-grid` horizontal scroll-snap, `.pg-below`, `.pg-screenend`, `.pg-read[data-v]`).
> - `app/auth.jsx`: `AppleButton` always rendered under Google on `SignIn` and `SignUp`.
> - `CHANGELOG.md`: top entry.
>
> ## Learnings
>
> - The first board cropped each page to the screen height inside a scrolling box taller than the window. Pages that fit read as not fitting, with no CTA in view. Draw the whole page, scaled, with the fold drawn on it.
> - A 12px fit on an estimated screen height is not a fit. Treat anything under 24px as too close to call.
> - Any sign-up fix changes sign-in too (same frame, order and providers). Always draw both.
> - "One screen" can only mean the page on arrival. Once a field takes focus, the keyboard takes about half the screen and every form scrolls.
> - The preview's "referenced file not found" warning for this rig is the base-relative false positive. The page loads; tokens render.
>
> ## Artifacts
>
> - `docs/specs/signup-one-screen/playground/pg-signup-fit.html`, `.jsx`
> - `playgrounds.json` (new ticket entry at the top)
> - `CHANGELOG.md`
>
> ## Action Items & Next Steps
>
> 1. Get the user's read on the board. If 04 or 04.1: confirm which, and whether sign-in takes the same pattern. The board assumes it does; ask, don't assume.
> 2. On ratification, decide with the user whether it lands straight in `app/auth.jsx` (`SignIn`, `SignUp`, maybe `AuthFrame` for the phone frame) or as a candidate build (only if they ask for one).
> 3. Settle the open details in words before building: the label ("Continue with email"), where focus lands, what Back does with the form open, whether the email form remembers being open across the sign-up ↔ sign-in switch, and the error and OTC paths after Create account.
> 4. Check every width the change ships at: 320, 375, 390, desktop. Check the share-intake sign-in lead (`ShareSignInLead`) still sits above the card.
> 5. Ask before any CHANGELOG addition for this.
>
> ## Other Notes
>
> - The user wants short replies and one decision per turn. Last line leads with an emoji and carries the ask.
> - The user wants no two-screen wizard. 04 is in-place disclosure on one page, and they accept it if it is a normal pattern. It is: providers first, then "Continue with email" opening the form.
> - Not done: sign-in alone has not been reviewed as its own surface. Recovery/OTC are untouched.
