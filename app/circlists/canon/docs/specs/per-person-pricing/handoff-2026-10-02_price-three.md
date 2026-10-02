# Handoff — price change to £3 / £30 (2 Oct 2026)

The candidate has already been merged into `app/` (the old candidate is in `docs/archive/per-person-pricing/`). I made these changes in `app/`.

## Changed
- `app/pricing-store.jsx`: `PPP_PLANS` is now £3 / £3.00 / "£3 a month" and £30 / £30.00 / "£30 a year". Every price in the app reads from it. Added `wasTrial` and `pppResumed(st)`.
- `app/pricing-page.jsx`: the yearly pill now says "£2.50 a month" instead of "Save £10".
- `app/pricing-account.jsx`: cancelling in the free month records `wasTrial`. Resume goes back to the free month, and the Ending date uses the free-month date.
- `app/pricing-circle.jsx`: both Resume links (circle and create form) use `pppResumed`.
- `app/pricing-states.jsx`: added `ppp-active-yearly`, `ppp-switch-monthly`, `ppp-switch-free-month`, `ppp-cancel-free-month`, `ppp-pending-switch`.
- `app/qa.jsx`: the QA list has a single entry, `price-three`, covering the acceptance states.

## States touched
ppp-price-free, ppp-price-used, ppp-create-not-subscribed, ppp-takeover-pricing, ppp-active, ppp-active-yearly, ppp-free-month, ppp-payment-failed, ppp-ending, ppp-pending-switch, ppp-lapsed-account, ppp-switch-yearly, ppp-switch-monthly, ppp-switch-free-month, ppp-cancel, ppp-cancel-free-month.

## Could not change
- No delete-account dialog shows a price, so it needed no change.
- The legacy per-space files (`subscriptions.jsx`, `main.jsx` comments) already say £3 and were left as they are.
- Nothing has been checked on screen yet.

- `PPP_TRIAL_DAYS` changed from 12 to 18 to match `PPP_RENEW_DAYS` (Joe, 2 Oct), so every end date is the same on every screen.

## Next
Go through the QA entry at phone and desktop widths.
