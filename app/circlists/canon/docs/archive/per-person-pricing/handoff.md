# Handoff — per-person pricing candidate (2 Oct 2026)

> **Latest:** `handoff-2026-10-02_subscribe-page-integrated.md` carries everything still live from this and the later handoffs. Start there.

Built against the 2 Oct delta prompt (business-ops `work/apps/circlists/store-launch/_subtasks/pricing-model/`, read live: `CONTEXT.md`, `_context/decisions.md`, `_context/log.md`, `_resources/2026-10-02_joe-v7-read-thoughts.md`). Nothing here is ratified.

## Shape

A **candidate build**, not a playground and not a change to the main app: the main app (`circlists.html`) still runs the per-circle model, byte for byte.

- Entry: `docs/specs/per-person-pricing/circlists-per-person-pricing.html` (own state key `circ_state_ppp_v1`; subscription store `circ_ppp_v1`).
- Overlays, loaded before `app/main.jsx`: `cand-ppp-store` (the person's subscription), `-sheet` (the adaptive overlay), `-pricing` (/subscribe, checkout, update card), `-account` (the Account card and its sheets), `-circle` (sleeping circles, step-back line, copy), `-states` (register + Config), `-main` (publishes `window.CircPricing`, the one handle).
- Hooks opened in `app/` (all additive; absent `window.CircPricing` ⇒ shipped behaviour):
  - `main.jsx`: `openCreateSpace` defers to `CircPricing.openCreate`; `CircPricing.bind(api)`; `CircPricing.renderRoute(route)` runs before the route chain.
  - `spaces.jsx`: CreateSpace dots + lede; MembersSurface champion line, unchampioned line, Funding card withdrawal, champion footer; AccountSettings card slot; `CalmPage` exported.
  - `subscriptions.jsx`: Checkout takes an optional `offer`; `ProviderShell` exported.
  - `feed.jsx`: ConfirmDialog takes `CircPricing.confirmCopy[kind]`.
  - `qa.jsx`: entries take `only: '<window handle>'`; the pricing walk-through shows only in the candidate.

The brief said "built into the app itself"; Joe said in chat "a design delta, not a playground". I read those together as a candidate (it *is* the app, unratified). Merging is the ratification step (`skills/candidate-build/SKILL.md`, Merging).

## Surfaces: what each must get across, then what was built

**1. Subscription page, `/subscribe`** (`cand-ppp-pricing.jsx` `PricingScreen`)
Must say: members are free; a subscription is what lets you run circles, as many as you like; what it costs and when you first pay; that a card is needed (state 1).
Built (phone board 01.2, ratified 2 Oct; see `review-2026-10-02-subscribe-phone.md`): one screen, two states keyed only on `usedFreeMonth`, one centred column at every width (the two-column desktop is gone). Heading scales with the page, `clamp(24px, calc(8.57cqi + 0.34px), 30px)`. Plan cards P2; the yearly pill reads "Save £10". Under the plans, receipt rows in the Account card's `.ppp-row` style: state 1 "Due today £0.00" / "From <date> £50 a year"; state 2 "Due today £50" / "Renews <date>". Centred ticks. State 1: lede "Subscribe to run your own circles.", button Start free month, then "Cancel before <date> and pay nothing." ("A card is needed to start." is cut). State 2: lede "Joining circles is free. Subscribe to run your own.", button Subscribe. Prices, dates and each lede sentence never split. Address: the page writes `#/subscribe` while open and opens on it at boot (no server routes in a static prototype). A subscriber reaching it is sent to Account. X lands on Home, except from a take-over or resubscribe, where it returns to that circle.

**2. Create, not subscribed** — pricing → provider checkout → plain create form → setting up → the new circle. No dots anywhere (Joe, 2 Oct: subscribing is not a step of creating, and the form is one step). The form reads heading "New circle", button "Create circle", no arrow (board pg-create-button 01, ratified by Joe, 2 Oct). Sleeping circle (yours): body reads "Your subscription has ended. Everything in this circle is still here." (Joe, 2 Oct). Account card in the free month: same as Active (tick, "Active", no reminder line) except the date row reads "First payment" instead of "Next renewal"; staged as `ppp-free-month` (Joe, 2 Oct). Subscriber: Create opens the form. Create lede now "You champion it; everyone joins free."

**3. Account, not subscribed** (`PppNotSubscribed`)
Must say: you are using Circlists free; subscribing is what lets you run circles. No price.
Built: house card, "Subscription", one line (the lede sentence), secondary "Subscribe" → `/subscribe`. Two kinds of text, not three. A lapsed person sees the same card; it leads to state 2.

**4. Account, subscribed** (`PppSubscribed`)
Must say: your plan and the next money event; what is wrong and how to fix it (failed); what ending means for your circles and members (ending); the controls.
Built: four states — Free month (marker carries days left; First payment row; reminder line), Active (Plan, Next renewal), Payment failed ("Update the card within 30 days to keep your circles awake."), Ending (Ends on row; ruled take-over wording; Resume). Buttons in the canon Funding card arrangement: Update payment card and Switch secondary, Cancel subscription red tertiary; on Ending, Resume subscription (secondary) replaces Cancel. Resume behaves as canon: no confirm, cannot fail, returns to Active. Switch: sheet A with a P2 card of the plan you move to; confirming shows a "From <date>" row, no undo. Cancel: a confirm sheet. Update card: the provider page; on a failed payment it returns you to Active. No circle list.

**5. Sleeping circles** (`PppDormantSpace`)
Must say: why it sleeps, nothing is lost, who can wake it and what it costs them.
Built: member — "Take over this circle"; caption "Any member can take it over by starting their own subscription." or, already subscribed, "Your subscription covers it, so taking it over costs nothing more." (takes over at once, no page). Lapsed champion — "Start your subscription", "Subscribing again wakes every circle you champion." No "Restart" anywhere.

**6. Circle settings, champion** — the per-circle Funding card is withdrawn (managed funding left circle settings, 30 Sep). Footer: "You champion this circle, so you can't leave it. To hand it to another member, get in touch." with *get in touch* as a `circ-doorlink` mailto.

**7. Overlays** (`cand-ppp-sheet.jsx` `PppOverlay`) — bottom sheet at the app's sheet posture (<640px, phone frame, app), centred modal on desktop. Same words both ways. No entrance motion yet.

## Staged states (`?state=<id>`; posture from the window or Viewport)

`ppp-price-free`, `ppp-price-used`, `ppp-create-not-subscribed`, `ppp-create-subscribed`, `ppp-not-subscribed`, `ppp-lapsed` (home), `ppp-lapsed-circle`, `ppp-lapsed-account`, `ppp-lapsed-none-asleep`, `ppp-active`, `ppp-payment-failed`, `ppp-ending`, `ppp-switch-yearly`, `ppp-cancel`, `ppp-takeover`, `ppp-takeover-pricing`, `ppp-takeover-subscribed`, `ppp-step-back`, `ppp-no-circles`. Config → "Per-person pricing (candidate)": subscription status, free month available/used, plan. QA in the launcher walks them in order.

## Calls I made (open, for Joe)

- **Buttons:** back to canon's Funding-card arrangement (2 Oct, Joe: the L3 rows were rejected). Whether Switch shares Update card's secondary treatment is open.
- **Lede sentence:** used as given, on the non-subscriber card and the subscription page.
- **Subscription page:** superseded by board 01.2 (ratified 2 Oct). See surface 1 and `review-2026-10-02-subscribe-phone.md`.
- **Switch sheet:** A's copy kept; "Nothing to pay today." moved to the quiet line so the body doesn't end on one word at phone width. The P2 card plus "the price of 10 months, not 12" say the same thing twice. Worth a trim.
- **Copy changed to drop per-circle funding:** create lede, the non-champion crown line ("The Champion manages this circle's membership."), the unchampioned line ("after that any member can take it over."), the delete-account dialog ("cancels your subscription"). The Resume error lines were removed (2 Oct, Joe: canon's Resume cannot fail; that error handling belongs to the live app).

## Ruled in this session

- **Take-over landing (Joe, 2 Oct):** finishing a take-over lands in the circle taken over, awake, you its champion; closing returns to it asleep. Same for a lapsed champion resubscribing from one of their sleeping circles. The Home rule now reads: outside create and take-over, finishing or closing lands on Home. Not yet written back to business-ops `decisions.md`.

## Unresolved

- No sheet or modal entrance motion (GOTCHA: captures freeze keyframes at frame 0).
- Shipped `funding-*` states and the per-circle `ManageFunding` route still exist in the register; unreachable from the candidate's surfaces.

## Next

Joe walks QA; tune copy and the desktop pricing layout with him; then decide merge.

- Account, not subscribed (never or lapsed): one card, one layout, copy differs. Never: "Joining circles is free. Subscribe to run your own." + Subscribe. Lapsed: "Your subscription ended on <date>, so your circles are asleep. Nothing in them has been lost." + Subscribe again (adviser copy). Button follows the Account rule below (Joe, 2 Oct; replaces board 01.1). The door link is gone.
- Account rule (candidate only, Joe 2 Oct): every Account card act (Subscribe, Update email, Update password, Delete your account) is full width on a phone, own width and right-aligned on desktop. Hook: `.circ-acct-act` on the act row in `app/spaces.jsx`. Also landed on canon (`circlists.html`) by Joe's request, 2 Oct, ahead of the candidate merge; the candidate HTML carries a duplicate of the same rules, drop it at merge.
- Lapsed copy shows only when you champion at least one sleeping circle; a lapsed person with none gets the never-subscribed line (Joe, 2 Oct).
- Cancel overlay: board pg-cancel-sheet 02.4 (Joe, 2 Oct). The Switch before-and-after panel (Now · plan · price → From <short date> · Asleep · Nothing charged; free month: Free month · £0), then "Your circles go to sleep. Everything in them stays, and any member can take one over." The grey members line is gone. Buttons unchanged.
