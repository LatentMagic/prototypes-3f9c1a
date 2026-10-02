---
date: '2026-10-02'
ticket: 'per-person-pricing (business-ops store-launch/_subtasks/pricing-model; no monorepo id yet)'
topic: 'qa-pass'
status: 'in-progress'
type: 'implementation'
---

# Handoff: qa-pass: Joe's QA walk through the candidate, fixes landed, stage close to done

This replaces `handoff-2026-10-02_subscribe-page-integrated.md` as the latest. Read that one for the settled subscription page, Account card and Switch overlay. `handoff.md` stays the per-surface reference and is updated to match this.

## Current Focus

Joe thinks this stage is close to done. The one open question when the session ended was his: **do the Cancel and Switch overlays behave differently in the free month?** The answer is yes (see Open). Next, confirm whether that needs a look or the stage is closed.

## Ratified this session (Joe, 2 Oct, in words)

- **Subscription page, free month used:** the lede is now "Subscribe to run your own circles.", the same as the free-month page (`cand-ppp-pricing.jsx`).
- **No wizard dots:** they're gone from both the subscription page and the create form. Subscribing is not a step of creating, and the form is one step. Hooks: `CircPricing.createFlow()` returns null (`cand-ppp-main.jsx`). The pricing header shows the circle's name only from Take over.
- **Create form:** the heading reads **"New circle"** and the button **"Create circle"**, with no arrow (board `pg-create-button` 01). "Create" on its own and "Create [name]" were rejected. Hooks: `CircPricing.createTitle` / `createLabel`, plus `title` / `submitLabel` props on `CreateSpace` (`app/spaces.jsx`).
- **Your sleeping circle:** the body reads "Your subscription has ended. Everything in this circle is still here." (`cand-ppp-circle.jsx`).
- **Account card, free month:** the same as Active (tick, "Active", no reminder line), except the date row reads **"First payment"** instead of "Next renewal". It's staged as `ppp-free-month`. The reminder email is still required by law (DMCC, expected January 2027), but the line isn't needed on Account.
- **Not-subscribed Account card:** one card for both never-subscribed and lapsed, and only the copy differs. There is no third state.
  - Never: "Joining circles is free. Subscribe to run your own." with a **Subscribe** button.
  - Lapsed (adviser copy): "Your subscription ended on <date>, so your circles are asleep. Nothing in them has been lost." with a **Subscribe again** button.
  - The lapsed copy shows **only if you champion at least one sleeping circle**. A mixed case (some taken over, some asleep) still gets it. Anyone else gets the never line.
  - The text link is gone, and the button is back.
  - The repetition of Subscription / Subscribe / Subscribe again is approved as is.
- **Account button rule (candidate only):** every Account card act (Subscribe, Update email, Update password, Delete your account) is **full width on a phone, and at its own width, right-aligned, on desktop**. Hook: a `.circ-acct-act` class on the act row in `app/spaces.jsx`. Canon has no CSS for it, so canon is unchanged. The rules live in the candidate HTML and follow the 760px breakpoint plus `data-circ-posture`.
  - Rejected first: board 01.1 (button beside the line). Centring the button on the heading and line together was rejected outright: "centred against nothing".
- **QA / scenario lists:** one entry per scenario, with no "· phone" / "· desktop" twins. The posture comes from the window or Viewport. This is written into `CLAUDE.md` ("A state is a scenario, never a width").
  - `cand-ppp-states.jsx` no longer forces the layout.
  - The QA steps (`app/qa.jsx`) were rewritten to match. Stale `-desktop` ids made rows unclickable.
  - Added: `ppp-lapsed-circle`, `ppp-lapsed-account` and **`ppp-lapsed-none-asleep`** (new: lapsed, every circle handed over).

## Open

1. **Cancel overlay: settled** as board `pg-cancel-sheet` 02.4, built into the candidate (see `handoff.md`). **Free-month differences in the overlays** (as found before the board): Joe asked whether there is one. There is, and the overlays are unchanged:
   - **Cancel** in the free month says "Your free month carries on until <date> and nothing is charged. Your circles then go to sleep." When active, it says "Your circles keep running until <date>, then go to sleep."
   - **Switch** in the free month applies at once (`plan` changes, no pending). When active, it is pending from the next renewal, and the card shows a From <date> row plus Keep <plan>.
2. **Carried over from the last handoff, still open:**
   - The "Resume subscription" label.
   - Payment failed shows Update payment card full width on its own.
   - The spec records needed via Joe's spec agent: Keep <plan>, the Switch copy, the subscription page copy, and now the create form, Account button rule and lapsed card copy.
3. **The lapsed date is a placeholder** (`pppDay(-14)`): the candidate keeps no end date.
4. **Upstream to propose, if Joe wants:** the Account button rule for `ui-design.md`. Its home in canon is `app/spaces.jsx` at merge.

## Boards this session (`playground/`, all in `playgrounds.json`)

- `pg-create-button`: 01 chosen.
- `pg-lapsed-card`: superseded by the adviser's copy.
- `pg-not-subscribed-button`: superseded by the Account button rule. 01.1 was chosen first, then replaced.

## Learnings

- **"My board" can mean the candidate.** When Joe asks to reopen something, reopen the page he was last on. Don't guess at a playground. This cost his temper.
- **A second agent's advice can reverse a ratified pick.** When Joe reports one, ask whether he agrees before changing anything. Here he didn't.
- **A partial quote from Joe is often new copy.** "▎ This circle is asleep. ▎ Your subscription has ended…" was copy to apply, not a bug report.
- **QA steps live in two files:** `cand-ppp-states.jsx` (the register) and `app/qa.jsx` (the walk). Change both, or rows go dead.
- Babel button widths are inline styles (`width: 100%` / `auto`), so CSS overrides need `!important`.
- Tool trap: `str_replace_edit` rejects an empty-match edit, and a two-edit call that reverts itself silently does nothing. Check that the insert landed.

## Artifacts

- Candidate: `docs/specs/per-person-pricing/circlists-per-person-pricing.html` + `cand-ppp-*.jsx`.
- `app/` hooks touched: `spaces.jsx` (CreateSpace `title` / `submitLabel` and the `createTitle` / `createLabel` hooks; `.circ-acct-act` on three act rows) and `qa.jsx` (steps).
- `CLAUDE.md`: the scenario-not-width rule.

## Other Notes

- No CHANGELOG entry: this is iterative candidate work.
- `uploads/`: today's five screenshots are deleted. Older files are untouched, and `card-previews/` / `card-favicons/` are load-bearing.
- `screenshots/`: this session's check captures are deleted.
