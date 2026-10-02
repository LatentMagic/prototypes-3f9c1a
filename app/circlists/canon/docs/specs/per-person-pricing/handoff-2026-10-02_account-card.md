---
date: '2026-10-02'
ticket: 'per-person-pricing (business-ops store-launch/_subtasks/pricing-model)'
topic: 'account-card'
status: 'complete'
type: 'implementation'
---

# Handoff: account-card — the per-person Subscription card on Account, ready for a playground

> **Latest:** `handoff-2026-10-02_subscribe-page-integrated.md` carries everything still live from this handoff. Start there.

**Follows `docs/specs/per-person-pricing/handoff.md`** (2 Oct, the candidate build as first delivered). Read that first for the candidate's shape, hooks, surfaces, staged states and open calls; this handoff covers only what changed on the Account card since.

## Current Focus

Joe is still not happy with the Account Subscription card (`PppSubscribed` / `PppNotSubscribed`), but says it is now in a state to take into a **playground**. Next session: build that playground. Nothing about the card is ratified beyond the two rulings below.

Background only: the rest of the candidate (pricing page, create, sleeping circles, circle settings, overlays) is as described in `handoff.md`. Joe is walking the candidate surface by surface and expects to name more "particularly bad" surfaces that each get their own playground.

## Task(s)

Done this session (candidate build only; `circlists.html` untouched):
1. **Resume error lines removed** (Joe's brief correction, ratified). "Funding has ended and your circles are now asleep." and "The resumption could not be completed." should never have been asked for: canon's Resume cannot fail, and that error handling belongs to the live app. Removed the lines, the `alert`/`resume` store fields, the `ppp-resume-ended`/`ppp-resume-failed` states, the Config "Resume outcome" control and the QA steps. Resume now behaves exactly as canon's: no confirm, cannot fail, returns to Active.
2. **Back to buttons** (ratified: "we need to go back to buttons"). The L3 full-row action list is gone; the card uses canon's Funding-card arrangement (`app/spaces.jsx:509-514`): one wrapping row, `Update payment card` (secondary, card icon; canon label restored from "Update card") · `Switch to <plan>` (secondary) · `Cancel subscription` (tertiary, destructive colour). On Ending, `Resume subscription` (secondary, no longer accent) replaces Cancel.

Not done / open: see Action Items.

## Critical References

- Canon Funding card, the reference Joe measures against: `app/spaces.jsx:494-519` (marker + one line + buttons + small footer; `FUNDING_MARKERS` and `fundingStateLine` at `:278-285`).
- `skills/build-playground/SKILL.md`: rig shape, non-negotiables; mount `PppAccountCard`, never a stand-in.
- `specs/governance/standards/ui-design.md` (monorepo, live): consistent affordances, destructive actions signal themselves, every width designed, no overhanging line.

## Recent changes

- `docs/specs/per-person-pricing/cand-ppp-account.jsx`: `PppAction` and `PPP_ALERTS` deleted; `resume` is now `A.set({ status: 'active' })` (`:38`); buttons at `:55-61` in `.ppp-btns`.
- `docs/specs/per-person-pricing/cand-ppp-store.jsx`: `resume`, `alert` dropped from `PPP_DEFAULT` and the header comment.
- `docs/specs/per-person-pricing/cand-ppp-states.jsx`: two resume states and the Resume-outcome seg removed; status seg no longer clears `alert`.
- `docs/specs/per-person-pricing/cand-ppp-pricing.jsx`: `alert: null` dropped from checkout success.
- `app/qa.jsx:22-31`: note and steps no longer mention Resume outcomes.
- `docs/specs/per-person-pricing/circlists-per-person-pricing.html`: `.ppp-alert`, `.ppp-acts`, `.ppp-act*` rules removed; `.ppp-btns{display:flex;flex-wrap:wrap;gap:var(--space-2);margin-top:var(--space-4)}` added.
- `docs/specs/per-person-pricing/handoff.md`: surface 4, staged states, Calls and Copy bullets updated to match.
- `github.md`: Last sync refreshed.

## Learnings

- Joe's read of the first build: the Account card was **over-redesigned** relative to canon's Funding card. Default to canon's shape and vocabulary, and change only what per-person pricing forces. Do not invent new status treatments: no red information lines, and no accent-coloured Resume.
- The L3 row list failed mainly on hover (the row hover didn't read). Joe does not want rows explored further.
- Joe's own words on what's good: the rows (Plan, Next renewal, First payment, Ends on, From <date>) and the state lines (e.g. "Your circles then go to sleep…") stay.

## Artifacts

- Candidate entry: `docs/specs/per-person-pricing/circlists-per-person-pricing.html` (staged states `?state=ppp-active`, `ppp-free-month`, `ppp-payment-failed`, `ppp-ending`, `ppp-switch-yearly`, `ppp-cancel`, `ppp-not-subscribed`, `ppp-lapsed-account`, each with `-desktop`).
- Card: `docs/specs/per-person-pricing/cand-ppp-account.jsx`.
- Session handoff for the whole candidate: `docs/specs/per-person-pricing/handoff.md`.

## Action Items & Next Steps

1. **Build the Account-card playground** at `docs/specs/per-person-pricing/playground/`, mounting the real `PppAccountCard` across all states (active, free month, payment failed, ending, pending switch, not subscribed / lapsed) at phone and desktop width. Add it to `playgrounds.json`. The question it must make answerable: the button hierarchy.
2. **Open question put to Joe, unanswered:** should `Switch to <plan>` share `Update payment card`'s secondary treatment, or be distinct? My recommendation was to keep both secondary (both neutral and reversible; order separates them). Options for the rig to carry: both secondary; Switch as tertiary text; Update card as the only boxed button. Check the three-button row wrap at 320–390px (it wraps; whether it wraps elegantly is part of Joe's ask, "does it look elegant on both desktop and mobile?").
3. **Open, unflagged to Joe:** the label `Resume subscription` (canon says `Resume funding`; "subscription" mirrors `Cancel subscription`). Joe mentioned "we've renamed Resume Subscription". It's unclear whether he objects to the label or only to its accent styling. Ask.
4. Anything else Joe thinks the card doesn't need relative to canon ("a bit more than is necessary"): ask him to name it; do not cut on your own.

## Other Notes

- Ratification rule (CLAUDE.md): present options plus a recommendation, then wait. Only items 1 and 2 under Task(s) are ratified.
- The candidate shares `app/`; the hooks are additive and gated on `window.CircPricing`. Don't touch the main app's Funding card.
- No CHANGELOG entry: this is iterative candidate work.
