# Handoff: circlists-match-2 (the Pass, checkout, subscription states)

Built 2026-10-07 from Part 2 of the prompt, using the text only.

## What was built, and where
- `app/gs-billing.jsx`: dates and prices (every price is `£—`, dates use no-break spaces), the Pass card in every state, the Switch and Cancel sheets, the buying block, the Pass page, checkout (single card, no interstitial, no declined state, no settling screen) and the update-card page.
- `app/main.jsx`: `sub` = `{ status: none|free|active|failed|ending, plan, freeUsed, pending, fromFree, renew }` and `choice` (the plan picked on the Pass page, Yearly by default). The demo view is **derived** from `sub`, so the demo bar and the config rows can't disagree. Free sets `none` with the free month available. Pass sets `active`, monthly.
- Removed: the "Opening secure payment" screen, the declined state, the "Card at checkout" config row, the `card-declined` register entry and its note.

## Staged states
Pass card: `pass-card-none`, `pass-card-monthly`, `pass-card-yearly`, `pass-card-free-month`, `pass-card-pending-switch`, `pass-card-payment-failed`, `pass-card-ending`, `pass-card-lapsed`.
Billing: `pass-page-free-month`, `pass-page-free-used`, `checkout`, `update-card`, `switch-sheet-yearly`, `switch-sheet-monthly`, `switch-sheet-free-month`, `cancel-sheet`, `cancel-sheet-free-month`.
Config rows: Subscription, Free month, Plan. QA entry: `circlists-match-2`.

## Decisions
- 2026-10-07, ratified by the owner: **Pass page** is one page, like for like with Circlists.

## Yours to decide: what I chose (for ratification)
- **Pass page (ratified, see above):** one page. The comparison comes first, then the buying block. A Pass holder sees their Pass card in place of the buying block. The Paying card's own price and button are gone.
- **Sheets:** the system's Popup. A bottom sheet below 640px, a centred window above. On a phone the buttons stack with the primary first; on desktop they share one row, with Cancel (or Keep) on the left.
- **Plan cards and pill:** bordered cards with a square radio mark (the system has no round controls). The picked card gets a 2px off-white border. The pill is the system's success Tag.

## Open or unresolved
- Demo dates: today is 6 October 2026, to match `GS.today`. Defaults are renewal 18 October 2026 (monthly) and 18 September 2027 (yearly), and a lapse on 18 September 2026. A checkout sets a real renewal date from today.
- In the free month, the card shows whichever plan was chosen. The prompt's table showed Monthly as its example.

## Next
Ratify the three choices, then clear the QA entry. The pricing plan itself is still open upstream.
