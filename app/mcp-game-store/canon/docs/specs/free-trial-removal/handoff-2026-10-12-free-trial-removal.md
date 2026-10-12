# Handoff: the Pass has no free trial (2026-10-12)

Brief: "MCP Game Store: the Pass has no free trial" (pasted 2026-10-12). The Pass is paid from the first day, £30 a year or £3 a month.

## What changed, and where
- `app/gs-home.jsx`: the Pass band reads "Play every game in full. £30 a year or £3 a month."
- `app/gs-billing.jsx`
  - `GsSubscribe`: one state. "Start your Pass", rows "Due today" (plan's `due`) and "Renews" (one plan-length from the demo today), button "Get the Pass". The "Cancel before … and pay nothing." line is gone.
  - `GsCheckout`: the figure is the plan's `due`, the line is "Then {price} from {date}.", the button is "Pay and subscribe" ("Processing…"), and the call is `gs.paid()`.
  - `GsPassCard`: no `free` status. `GS_SUB_HOLDS` is `['active','failed','ending']`. Every active card shows "Next renewal". Resume always goes to `active`.
  - `gsSubDate`: the trial line is gone. `GS_TRIAL_DAYS` is gone. The header comment and the comments about renewal, the switch and the Pass page no longer mention a trial or a first payment.
  - `GsSwitchSheet`: only the scheduled branch is left: "From {date}", "Nothing is paid now.", and the switch is pending.
  - `GsCancelSheet`: the before side is always the plan name and price. `free` and `fromFree` are gone.
- `app/main.jsx`: `paid()` takes no argument and sets `active`, `hadPass: true`, and a renewal one plan-length out. The status comment drops `free`. `GS_SUB_DEFAULT` drops `fromFree`.
- `app/gs-account.jsx`: the delete pop-up's "never charged" line is gone.
- `freeUsed` → `hadPass` in `main.jsx`, `gs-billing.jsx`, `gs-data.jsx`, `gs-config.jsx`, `gs-casebook.jsx`, `gs-delve-library.jsx`, `gs-hunter-library.jsx`, `gs-puzzles-library.jsx` and `states.jsx`. Behaviour is unchanged.
- `app/gs-config.jsx`: Subscription is None / Active / Payment failed / Ending. The row "Had the Pass before" (No / Yes) is bound to `hadPass`. Any Subscription other than None sets it to Yes. The hint text is reworded as the brief says.
- `app/qa.jsx`: `pass-card-trial`, `switch-sheet-trial` and `cancel-sheet-trial` are removed from every list. "Trial reads 14 days everywhere." is removed.
- `CLAUDE.md`: "The Pass is £30 a year or £3 a month, paid from the first day." replaces the trial sentence.
- `playgrounds.json`: "Four viewers: signed out, no Pass, had the Pass before, Pass."
- Playgrounds, key only: `pass-and-subscribe/playground/pg-pass.jsx`, `library-game-page/playground/pg-library.jsx`, `pg-casebook.jsx`, `pg-casebook-7-9.jsx`, `pg-casebook-10-12.jsx`, `pg-casebook-13-15.jsx`, and `history/playground/pg-history.jsx`. No other playground had a hit.

## State ids
- Removed: `pass-card-trial`, `switch-sheet-trial`, `cancel-sheet-trial`, `subscribe-trial-available`.
- `subscribe-trial-used` → `subscribe`, labelled "Subscribe page".
- `pass-card-lapsed` keeps its id. Its label is now "Lapsed".
- Checked: no other state was using the id `subscribe`.

## Yours
- Closing up: once the branches were removed, nothing was left without a natural end. The subscribe page ends on its button, the same as the old non-trial branch. The switch sheet keeps its one paragraph and its one confirmation ("You switch to {plan} from {date}."), and focus moves to Keep. No spacing changes were needed.
- Collapsed views (change 8): the subscribe page and checkout. They no longer read `hadPass`.
- Left alone: the Pass page. It already reads neither `hadPass` nor `freeUsed`, so `pass-page-never-subscribed` and `pass-page-subscribed-before` render the same page. Both states stay, as the brief says. Any difference left between them is in the Pass card and the lapsed pages, which still need the flag.

## Closing search survivors
- `app/`, root files: no `trial`, `first payment`, `£0`, `pay nothing`, `never charged`, `freeUsed`, `fromFree` or `GS_TRIAL` survives. Every `14` is unrelated: dates ("14 September", "14 Sep"), dice rolls ("d20 14 + 2"), "10–14 rolls", icon sizes (`size={14}`), SVG coordinates and paths, the 1400 ms checkout timer, and the 140 and 14px values in `config.jsx` and `states-ui.jsx`.
- `docs/specs/**` dated handoffs: history, left alone. These are `walk-sweep/`, `free-and-pass/`, `fixes/`, `iffy-decisions-2026-10-11/`, `final-audit-snags/`, `circlists-match-2/handoff.md` (which names `freeUsed` and `fromFree`), `library-game-page/handoff-2026-10-08-playground-built.md` (`freeUsed`), and `pass-and-subscribe/` handoffs.
- `library-game-page/playground/casebook-13-15.html` and `pg-casebook-13-15.jsx`: `c14-…` class names. Unrelated.
- `pass-and-subscribe/playground/pg-pass.jsx`: this playground keeps its own trial copy. `PsBuy` and `PsSubFour` show "Start your 14-day trial", "£0.00", "Start 14-day trial" and "Cancel before … and pay nothing.", and one viewer is labelled `'Trial used'`. History, left alone: the owner said on 2026-10-12 that historic playgrounds are not to be touched. Only the `hadPass` key was renamed.
