# Handoff — one record (2026-10-18)

Delta: every demo fact held once, in the seed. No behaviour or visitor-facing copy changed. No earlier folder for this work existed.

## Changed
- `CLAUDE.md`: new "## Data" section directly above "## Code", carrying the rule in the brief's words.
- `app/seed-data.jsx`: `window.CircSeed` now exposes `SEED_META`, `CARD_LAST4` ('4242') and `stagedCircle(id, email)`. New block "Staged circles" holds the six circles the register stages (`sp-empty`, `sp-solo`, `sp-one` "Reading Room", name held once; `sp-full` "Design Guild" with its ten members and three items; `sp-late` "Sunday Reads" and `sp-pile` "Field Notes", one six-person list, champion Ana R. derived from it). `sp-empty` and `sp-one` share one You + Sam R. list; `sp-solo` is You alone. They are a seed extension, not part of `seedSpaces()`, so no other state or saved snapshot meets them.
- `app/liveliness.jsx`: `CIRC_DROPS` is six bare URLs; `circNextDrop` folds `SEED_META[url]` onto the arrival.
- `app/pricing-page.jsx`: yearly pill reads `pppPerMonth(PPP_PLANS.yearly)` (full price / 12), "£2.50 a month" today.
- `app/spaces.jsx:588`, `app/subscriptions.jsx:187`, `app/pricing-account.jsx:76`: read `window.CircSeed.CARD_LAST4`.
- `app/pricing-states.jsx`: `ppp-takeover-pricing` ctx carries only `spaceId`; `pppStage` fills `name` from the staged list (the seed's `sp-book`).
- `app/states.jsx`:
  - `seedOf(id)` helper reads a circle off a fresh seed.
  - `stageHome` and `stageShareIntake` `sleep` read the champion from the seed's sleeping circle `sp-test-weekend` (Priya N.) via `sleepChamp()`, rather than retyping it.
  - `stageDormant` keeps the seed champion of `sp-test-weekend` unless `cfg` names one; the four Priya N. entries (`dormant-circle`, `dormant-champion-left-retaken`, `suspended-by-us`, `invite-dormant`) pass only `dormancy`. `dormant-champion-left` still passes `champion: null`.
  - `stageHiddenEmail` and `stageNoChampion` read Joe M. (name and address) from `sp-book`'s seed champion.
  - The six typed circles read `stagedCircle(...)`.
  - Comment at the bare-URL constant: the "Seed data — the standing rule" sentence removed. Invite-refusal comment: "ten members, at the cap" (reasoning holds: `full` is `members.length >= SPACE_CAP`).

## Rendering that may differ
- None. `home-asleep` and `share-intake-picker` briefly crowned Joe M. on the slept circle; owner ruled 2026-10-18 it stays Priya N., now read from `sp-test-weekend`'s seed champion.

## Set by this brief, not ruled by the owner
- The Data section sits directly above "## Code".
- The card digits live in one seed value (`CARD_LAST4`) read by all three surfaces.
- All six register circles became a seed extension (`stagedCircle`), not seed entries; builder's call per brief.

## Left in place
- Billing model: `PRICE_PER_SPACE = 3` (`subscriptions.jsx:12`) and `PPP_PLANS` (`pricing-store.jsx:15-16`) untouched; which is canon is the owner's call.
- `CIRC_LATE`, `CIRC_PILE` link lists (states.jsx).
- Noticed, not touched: `CIRC_BARE_URL` (states.jsx) retypes a seed URL; `RELAY_EMAIL`; `blocked: ['Priya N.']` and Priya/Joe in state labels; `stageHome` crowd clones' names ("Thursday Cinema", "Platform Guild"); `CIRC_LONG_DESC`; `'sam.rivera@googlemail.com'` in `account-sso`; Frontend Guild card titles typed in `GUILD_CARDS` instead of `SEED_META`; `stageFunding`/`stageCircleDescription`/`stageInviteRefusal` set `champion: 'You'` (DEFAULT_USER-derived, not a seed name).

## Persisted state
No `seedSpaces()` output changed, so old snapshots stay valid; key not bumped.

## Next
Owner rules on the three "set by this brief" items and the billing model. Consider moving `GUILD_CARDS` metadata into `SEED_META` and `CIRC_BARE_URL` to a seed export.
