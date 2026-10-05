# Handoff — mobile-readiness delta (5 Oct 2026)

**Start here.** Status, end of 5 Oct: the delta is built into canon and has been walked in part by the user. Nothing in it is ratified until the owner publishes to canon. The one correction since the build: Sign in with Apple is on web and app alike (the prompt's app-only line was the owner's own narrowing, now fixed upstream). One piece of follow-on work is open in its own folder: fitting sign-up (and sign-in) on one phone screen, `docs/specs/signup-one-screen/` (latest handoff there). `CHANGELOG.md` has an entry for this delta ("The app gets ready for the stores"); expect it to be amended once the proposed parts are ruled.

Source: the owner's design delta prompt (business-ops `store-launch/_subtasks/mobile-readiness/_outputs/prompts/2026-10-05_mobile-design-delta/prompt.md`), pasted into this session. Built into canon (`app/`), not a candidate. Nothing here is ratified until the owner publishes to canon.

## What was built, and where

| Item | Files | Check |
|---|---|---|
| 1 Not-subscribed line | `pricing-page.jsx` `PppWebHandoff`; `pricing-account.jsx` `PppNotSubscribed`; `pricing-store.jsx` `PppAppLine`; `spaces.jsx` `CalmPage` (title now optional) | `pppAppNoPay()` |
| 2 Account in the app | `pricing-account.jsx` `PppSubscribed`, `PppAccountCard`; `push.jsx` `CircPushSetting`; `spaces.jsx` `AccountSettings`/`PushRow` (pass `isApp`) | `pppAppNoPay()`; `isApp` prop |
| 3 Sign in with Apple | `auth.jsx` `AppleButton`, `SignIn`, `SignUp` | none: web and app alike (owner's correction, 5 Oct, superseding the prompt's app-only line) |
| 4 Report | `report-block.jsx` (new, droppable); `feed.jsx` card menu; `talk-surface.jsx` `CandTurn` | none (every posture) |
| 5 Block | `report-block.jsx`; `spaces.jsx` Members rows | none (every posture) |
| 6 Champion's row | `spaces.jsx` Members rows | none |
| 7 Start-up | `startup.jsx` (new, droppable); `main.jsx` routes `splash`, `cant-connect` | the route |
| 8 Mobile list, register, QA | `states.jsx` (`platform`, app entries, `CIRC_MOBILE_LIST`), `pricing-states.jsx`, `qa.jsx` | — |

`main.jsx` gained: the two routes, `isApp` passed to `AccountSettings`, `CircRB.bind` and `CircRBHost`, `setPlatform`/`setMobilePayments` handed to the register. `circlists.html` gained two script tags and a short CSS block.

`pppAppNoPay()` = `isApp && !mobilePayments` (`pricing-store.jsx`). Every money item keys on it; the notifications card keys on `isApp`.

## Addresses

- `app-splash` (held), `app-start-up` (plays: splash → loading → home), `startup-cant-connect` (any posture; Try again → loading → home)
- `ppp-app-create-not-subscribed` (tap New circle), beside `ppp-create-not-subscribed`
- `ppp-app-not-subscribed`, `ppp-app-free-month`, `ppp-app-active`, `ppp-app-lapsed`, beside their web twins
- `push-setting-in-app`, `app-home`, `app-circle`, `app-circle-settings`
- `report-link-reported`, `block-priya-second-circle`

App-only entries set Platform Mobile, Mobile payments Off. The twins (`push-setting-safari-tab`, `ppp-create-not-subscribed`, `ppp-not-subscribed`, `ppp-lapsed-account`, `ppp-active`, `ppp-free-month`) set Web. Other entries leave the Platform alone.

The mobile list is the pinned group **Mobile app: where it differs** in the States palette (the list glyph). QA (the tick) has **Mobile app: where it differs** and **Report and block: built, not ratified**.

## What canon already held

None of the items. The only near-miss: "This didn't load." / Try again existed as `FeedError` (the feed region), not as a start-up state; the new state copies its shape.

## Yours-to-decide — what I chose

- **Form at Create a circle: the page.** Every way into Create a circle (Home's New circle, "Start another circle", "champion your own", the conversation's door) already lands on one page, so the line reads the same wherever it is met; an in-place line would cover Home's row only. The page carries the ratified line alone, no heading, at 18px in ink, each sentence wrapping on its own; "Back to your circles" is its one action.
- **Block's treatment: not red.** `Block Priya` is ordinary ink; the confirmation's Block is the house primary. A block removes nothing and is undone in one press, so the destructive red would overstate it.
- **Billing foot on the app's card: removed.** "Billed to" repeats the email under the Account heading, and "Card ending 4242" points at an act the card cannot offer.
- **Apple's button:** black fill, white mark and label, 52px, full width, the house radius; label "Continue with Apple" (one of Apple's three permitted titles) to pair with Google's. Measured 274×52, the same as Google's. The mark is a stand-in path; the build takes Apple's asset. Apple's rules favour the system font for the label; I kept the app's, to match Google's — flagged.
- **Champion badge: the crown moves inline after the name.** Rejected: (a) "Champion" as the row's second line (it crowds the email, and a blocked champion would carry three things there); (b) a badge on the avatar (unreadable on a 32px disc, competes with the accent fill on your own avatar). The crown keeps its 16px, title and label; the name ellipsises before it does.
- **Can't-connect second line: left out.** The existing one names a circle's links, untrue at start-up; any other would claim a reason.
- **Mobile list:** the States palette, as a pinned group, because each entry opens a state; QA holds the walk.
- **Reported:** one word with a tick. More words would describe what happens next, which the owner removed from the dialog.

## Built, not ratified (Proposed)

- Reasons inside the Form dialog, optional, one tap (tap again to clear).
- After a block: the row reads `Blocked`, its menu holds `Unblock Priya`, no confirmation.
- The reach of a block beyond its account-wide scope: her cards leave Active, History, Saved, Watching, search, the filter and the Overview address (answered as a card deleted for you); her comments leave the conversation, the returns bar, the preview, New words and the dot; a top-level comment of hers that others answered keeps a row reading "Priya N. is blocked." (that wording is mine, proposed); Members and the home roster still list her.
- Report in the card menu: below the rule, above Delete. Comment report: the same quiet "···" glyph your own comments carry.
- The "Something else" placeholder: "Say what it is, or leave it blank." (the Add surface's construction).

## Unruled, left as canon

- **Ending and Payment failed in the app:** unchanged; both still show their buttons (Resume / Update payment card, Cancel subscription), the billing foot, and Update payment card still opens the provider's card page in the app.
- **Taking over a sleeping circle in the app:** the dormant page is unchanged ("Take over this circle"). Not subscribed, the tap reaches `PppWebHandoff`, which now reads the ratified line because it is one component. Subscribed, it takes over free, as on the web.
- **`WebHandoff`:** reached only by the register's `manage-funding` state in the app posture. No product path reaches it under per-person pricing.

## Checks

- The line at 375-ish (the phone frame), with each sentence balanced: no stranded word. "You can't manage your subscription in this app." is balanced too.
- Consent line at the frame width: sign-in ends ~655px down (inside 667); sign-up ends ~760px, so at 375×667 it sits below the fold; inside 844. Reported, not reordered.
- Not yet driven at a desktop width or at 320 in a real browser: the verifier's pass covers it.

## Unresolved

- Sign-up does not fit one phone screen, on web as well as app. Seven options are on a board at `docs/specs/signup-one-screen/playground/pg-signup-fit.html`, each drawing sign-up and sign-in. The user leans to 04 (Google, Apple, then Continue with email opening the form in place); 04 vs 04.1 is open. Not ratified; nothing built into `app/`.
- Sign-up's existing subtitle "One account, every circle you're part / of." strands a word at the phone frame. Pre-existing, not touched.
- `MOBILE.md`: Payments rewritten, a "Named content differences" table added, the checklist's `isApp` line qualified. `ARCHITECTURE.md`: the "only other posture-aware branch" line replaced, two droppable modules listed, the register's `platform` field described.

## Next

1. Owner walks QA → "Report and block: built, not ratified"; ratify or change, then clear that entry and amend the CHANGELOG entry.
2. Rule sign-up on one screen (`docs/specs/signup-one-screen/`), then build the chosen option into `app/auth.jsx`, sign-in included.
3. Owner walks QA → "Mobile app: where it differs" and confirms each app-only difference.
4. Swap the Apple stand-in mark for Apple's asset in the build.
5. Rule Ending and Payment failed in the app, and take-over.
6. Clear `uploads/` of anything unreferenced (the three prompt images and today's screenshot), with the user's word.
