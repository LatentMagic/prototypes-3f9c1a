---
date: '2026-10-02'
ticket: 'per-person-pricing (business-ops store-launch/_subtasks/pricing-model; no monorepo id yet)'
topic: 'lapsing-takeover-playground'
status: 'built'
type: 'playground'
---

# Handoff: lapsing take-over playground

This continues `handoff-2026-10-02_stage-close.md`. It was built against business-ops `_outputs/prompts/2026-10-02_lapsing-takeover/prompt.md`, which carries the 2 Oct rule: take-over is gated, and create is allowed with a warning. Nothing here is ratified, and the candidate is untouched.

## What was built, and where
- **Entry:** `playground/pg-lapsing-takeover.html`. A dark header bar sits above the real candidate, which is framed in an iframe.
- **App:** `playground/pg-lapsing-takeover-app.html`. This is a copy of the candidate entry with the rig module added. It has its own state key, `circ_state_pg_lto_v1`, and its subscription store is remapped to `pg_lto_ppp_v1`.
- **Module:** `playground/pg-lapsing-takeover.jsx`. It re-publishes the sleeping circle, the create lede and the create foot for each option.
- **Notes:** `playground/pg-lapsing-takeover-notes.md`. Each option's name, stance and cost, plus the tensions.
- **One app hook:** `app/spaces.jsx` CreateSpace renders `CircPricing.createFoot()` under the Create button. The hook is absent in the candidate and in canon, so nothing changes there.
- **Launcher:** listed in `playgrounds.json` under Per-person pricing.

## Addresses
There are no URL params. The header holds the selection, saved in `pg_lto_v1`.
- Option **1 / 2 / 3**.
- State **Ending** (ends 28 Oct) or **Payment failed** (fix by 1 Nov).
- Start at **Sleeping circle** (Sunday Long Reads, 6 members, champion Ada L.) or **New circle**. New circle goes to Home and presses New circle.
- Viewport **Auto** (follows the window) or **Phone** (the app's own forced-mobile frame).
- Any change restages the scene from the start.

## Options in one line each (detail in the notes)
1. **Fix first, on the screen.** The circle's button is Resume or Update card. Take over comes after it. On create, a line under the lede.
2. **Fix in the take-over sheet.** The take-over opens a Now → From panel with Resume and take over. On create, a note in the same panel before the form.
3. **Fix on the button.** Resume and take over, or Update card and take over, in one tap. On create, a line under the button with an inline resume link.

## Calls I made (open)
- **Update card returns to where it was opened** (the circle, or the form), not Account. Cancel returns you to the sleeping circle.
- **Dates:** the rig sets `PPP_RENEW_DAYS` to 26 so the Account card and the options agree on 28 Oct. The fix-by date is today plus 30, matching "within 30 days".
- **"Not now"** dismisses option 2's create note.
- **Me:** Priya is seeded as the user. "Priya N." is folded into "You" across the seed.
- **Ada L. is the sleeping circle's champion.** The brief named no champion.

## Ruled (Joe, 2 Oct), and built into the candidate
- **Take-over: option 1, Ending and Payment failed.** The sleeping circle's button is the fix: Resume subscription, or Update payment card (the card page returns to the circle). Then Take over this circle, with a receipt line ("Subscription resumed." / "Card updated."). Built in `cand-ppp-circle.jsx` `PppDormantSpace`; card return in `cand-ppp-pricing.jsx` `PppCardPage` (ctx `card-circle` / `card-create`); `fixed` added to the store.
- **Create: option 3, both states.** One line under Create circle: "It goes to sleep on <date> unless you resume your subscription / update the card." Resume works in place; Update card carries what's typed. Built as `PppCreateFoot`, through the `CircPricing.createFoot` hook (`cand-ppp-main.jsx`).
- **No overhanging line:** sleeping-circle body and captions set one sentence per line (`.ppp-s`), in the candidate and the rig.
- **States:** `ppp-takeover-ending`, `ppp-takeover-failed`, `ppp-create-ending`, `ppp-create-failed`.
- Candidate dates come from its own constants (ends today + 18, fix by today + 30); the rig's 28 Oct is rig-only.

## Next
Done: the Account card on Payment failed is board `playground/pg-failed-card` **02.1** (Joe, 2 Oct, "love it"). The line and Update payment card are one row of the card's table under Plan's hairline; the line takes the row-key style; stacks on a phone (container query, 440). Built in `cand-ppp-account.jsx` `PppSubscribed` (`.ppp-fail-row`). The `ppp-card-line` for failed is gone.

Next: ask Joe what's still open from QA.
