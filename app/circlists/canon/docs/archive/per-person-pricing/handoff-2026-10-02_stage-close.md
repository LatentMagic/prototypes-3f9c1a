---
date: '2026-10-02'
ticket: 'per-person-pricing (business-ops store-launch/_subtasks/pricing-model; no monorepo id yet)'
topic: 'stage-close'
status: 'in-progress'
type: 'implementation'
---

# Handoff: stage-close: Cancel overlay settled, Account button fix on canon, QA stage close to done

The latest. It continues `handoff-2026-10-02_qa-pass.md`, which still holds the full list of what Joe ratified in the QA walk (create form, dots, Account card states, lapsed card, button rule, scenario lists). Read that for the detail. `handoff.md` remains the per-surface reference and is up to date.

## Current Focus

The QA stage is close to done. Nothing is waiting on Joe this turn. Next session: ask whether anything else is open from his QA walk, or whether this stage is closed. If it is closed, the next move is his: spec records, then a merge decision.

## Since the qa-pass handoff

- **Cancel overlay settled:** board `playground/pg-cancel-sheet` **02.4** (Joe: "perfect. integrate"), built into the candidate in `cand-ppp-account.jsx` `PppCancelSheet`.
  - It reuses the Switch overlay's before-and-after panel (`.ppp-ba`). It reads Now · <plan> · <price>, then an arrow, then From <short date> · **Asleep** · Nothing charged.
  - In the free month, the left half reads Free month · £0.
  - Under the panel, at body size: "Your circles go to sleep. Everything in them stays, and any member can take one over." (`.ppp-cx-line`, `text-wrap: pretty`, last two words joined).
  - The small grey members line is gone. The buttons are unchanged: Cancel subscription (destructive) and Keep subscription.
  - The path there:
    - The adviser argued for the panel because it puts Switch and Cancel in one family, and because it shows the charge.
    - "Circles asleep" in the panel plus the named sentence was too cluttered. Joe's adviser said only one fix was needed. So the panel went back to Asleep, and the sentence carries "Your circles".
    - Copy B ("Everything in them stays") was picked over "Members keep everything in them", which Joe called stiff.
    - The panel rule: a confirm that changes what you pay, from a date, gets the panel. That is Switch and Cancel only. The other confirms act at once and stay sentences.
- **Switch in the free month:** Joe agreed it needs no change. The overlay is the same in both states. Only the card afterwards differs (the plan changes at once, with no pending row).
- **Account button rule landed on canon** (Joe asked, ahead of any merge): `circlists.html` now carries the `.circ-acct-act` rules. On a phone, Update email, Update password and Delete your account are full width. From 760px, or in the desktop posture, they sit at their own width, right-aligned. Delete your account moves from left to right on desktop.
  - The hook is a class on the act rows in `app/spaces.jsx`.
  - The candidate HTML carries a duplicate of the same rules. **Drop it at merge.**
  - This is the only candidate piece on canon.

## Open

1. Spec records via Joe's spec agent: everything ratified today (see qa-pass "Open" 2), plus the Cancel overlay and the canon button rule.
2. Still from earlier: the "Resume subscription" label; Payment failed showing Update full width on its own; the lapsed date is a placeholder (`pppDay(-14)`).
3. A possible upstream proposal, if Joe wants: the Account button rule, and "the panel for confirms that change what you pay", for `ui-design.md`.
4. CHANGELOG: none written. The canon button fix is a refinement, so it gets no entry, unless Joe says otherwise.

## Learnings

- **"Integrate" after a pick means build it now, at every width.** Don't ask first. And when Joe asks for tweaks to see, add them to the board straight away: "What, you haven't done them yet?"
- **Advice relayed from his advisers comes pasted in.** Treat it as Joe's steer once he endorses it ("0.24 is perfect"). Until then, show it on the board.
- **Check 320 by eye for stranded short last lines** before reporting a board. `text-wrap: pretty` plus a non-breaking space between the last two words fixed it here.

## Artifacts

- Candidate entry: `docs/specs/per-person-pricing/circlists-per-person-pricing.html`.
- New board: `playground/pg-cancel-sheet.html` + `.jsx` (02.4 chosen), listed in `playgrounds.json`.
- Canon: `circlists.html` (`.circ-acct-act` block next to `.circ-vh`).

## Other Notes

- `uploads/`: today's screenshots are all deleted. `card-previews/` and `card-favicons/` are load-bearing.
- `screenshots/`: this session's checks are deleted.
