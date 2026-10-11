# Handoff 2026-10-11: the Pass page and the subscribe page, playground

## What was built
- Rig: `docs/specs/pass-and-subscribe/playground/index.html` with `pg-pass.jsx`. It is the real app with a bottom strip, listed in `playgrounds.json`. Nothing in `app/` changed.
- The rig overrides `GsPass`, `GsCheckout` and `GsDemoBar` on `window`. The subscribe page is the `pass` route with `step: 'subscribe'`, because `main.jsx` has no route for it.
- Strip: Option 1 to 3 (Why gives the idea, what it assumes, the cost), Viewer (Signed out, No Pass, Trial used, Pass), Pass page or Subscribe. To force phone width, use the app's own Config pill.

## The options
1. **Price and one button.** Under the heading: "It costs £— a month or £— a year." and a primary "Choose a plan" button, then the comparison. The subscribe page is one centred step.
2. **Plans beside the table.** Yearly and monthly cards, each showing its price, sit beside the comparison (stacked on a phone, cards first). "Choose yearly" or "Choose monthly" opens the subscribe page with that plan chosen. Same subscribe page as 1.
3. **One sentence, then the table.** The price and the way on share one sentence, with "Choose a plan" as its link. The subscribe page stands on its own: the plan block beside "What the Pass adds", with a link back to the comparison. Two columns on desktop.

## Choices made for open items (not ratified)
- Onward control: "Choose a plan" (1, 3) and "Choose yearly" / "Choose monthly" (2). None of these say subscribe or pay, so the Pass page never reads as the start of a purchase.
- Subscribe page heading and button: the copy is GsBuyBlock's, with its heading raised to the page h1: "Start your 14-day trial" / "Start 14-day trial", or "Start your Pass" / "Get the Pass" once a trial has been used (MCPG-012 AF-02). The yearly plan is first and chosen by default.
- A Pass holder sent to the subscribe page is moved to Account (AF-06). The Pass page for a holder keeps today's "You have the Pass" and "Manage in account", with no price and no onward control (AF-05).
- Leaving the provider's page without paying returns to the subscribe page with the plan still chosen (EF-01). The app today returns to the Pass page.
- A visitor who presses the button signs up, then goes to the provider's page (AF-03), using the app's own `getPass`.

## Unresolved
- The subscribe page has no URL of its own in the app. Another route (home, Account, a locked game) can only link to it once `main.jsx` gets a `subscribe` route.
- Option 3's "What the Pass adds" copies the Pass-only rows of `GS_COMPARE` (not exported from `app/gs-parts.jsx`). If 3 is picked, export it.
- The Pass page price line has no plan detail beyond the two prices. Whether it shows the per-month figure for yearly is open.

## Next
The owner picks an option. Then add the `subscribe` route in `main.jsx`, retire `GsBuyBlock` from `GsPass`, and point `afterCheckout` at the subscribe page.

## Round 2 (same day)
- Option 2 broke a settled rule: per-plan buttons are a plan choice on the Pass page. It stays in the rig only for the record.
- Option 4: the Pass as a card at the top, and a subscribe page trimmed to the plans, what is due, the button and the cancel line. The owner rejected the card: it fights the table and reads as a card, not a heading.
- Option 5: a plain heading, then What you get. The price, yearly first ("£— a year or £— a month"), and Choose a plan close the comparison under the Pass column. A holder sees "You have the Pass" and "Manage in account" on the heading's line. The subscribe page is option 4's.
- The owner confirmed the price is allowed on the Pass page (MCPG-012 BF-03).
- **Ratified 2026-10-11 by the owner:** option 5 is the base to refine. Nothing else is ratified yet: the trimmed subscribe page, dropping "You have a free account", and dropping the billing and purchase lines are all still proposals.
- Next: a design pass over the rest of the flow (subscribe page, the provider page, the return), on top of option 5.
- **Ratified 2026-10-11 by the owner:** the subscribe page as built in options 4 and 5 holds everything it needs.
- **Decided 2026-10-11 by the owner, for now:** £3 a month and £30 a year, with "£2.50 a month" shown beside yearly. Set in the rig only (pg-pass.jsx patches GS_PLAN); app/ and the provider page's own fixed strings still say £—.

## Landed in the prototype (2026-10-11, owner asked to integrate)
- `app/gs-billing.jsx`: GsPass is option 5; GsBuyBlock is gone; the new GsSubscribe page holds the plans. Prices are £3 a month and £30 a year (`due`, `GS_YEAR_MONTH`), and the provider page uses them too.
- `app/gs-parts.jsx`: GsCompare takes an optional `foot`.
- `app/main.jsx`: a `subscribe` route (top bar, footer, page load). A Pass holder sent there goes to Account (AF-06). Cancel on the provider page returns to `subscribe` (EF-01).
- `app/gs-auth.jsx`: signing in from the purchase sign-up returns to `subscribe` (AF-04). `app/states.jsx`: two subscribe states.
- Not done: no CHANGELOG entry yet (ask first). The QA steps naming `pass-page-trial-*` still point at the Pass page.
