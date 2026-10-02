---
date: '2026-10-02'
ticket: 'per-person-pricing (no monorepo id yet)'
topic: 'account-card-integrated'
status: 'complete'
type: 'implementation'
---

# Handoff: account-card-integrated — Account Subscription card and Switch overlay built into the candidate

> **Latest:** `handoff-2026-10-02_subscribe-page-integrated.md` carries everything still live from this handoff. Start there.

## Current Focus

The Account card and the Switch overlay are both settled and built into the candidate. Next up is the **phone and desktop subscribe-page boards** (`playground/pg-subscribe-phone.html`, `playground/pg-subscribe-desktop.html`). Joe hasn't reviewed them yet, and nothing on them is ratified. Wrapping matters to Joe; see Learnings.

## Task(s)

- Done: reviewed the Account-card board with Joe. Notes and the ratification record are in `review-2026-10-02-account-card.md`.
- Done: built the ratified card into the candidate (`circlists-per-person-pricing.html`).
- Done (later session, same day): built a **Switch plan overlay board** (`playground/pg-switch-sheet.html`) at Joe's request ("a bloated monstrosity"), reviewed it with him, and built the ratified option into the candidate. The record is in `review-2026-10-02-switch-sheet.md`.
- Not done: subscribe-page boards; the "2 months free" wording; the "Resume subscription" label (open since an earlier handoff); a spec/upstream record of Keep <plan>.

## Critical References

- `review-2026-10-02-account-card.md` and `review-2026-10-02-switch-sheet.md` record what Joe ratified, in his words, and what he set aside.
- `skills/candidate-build/SKILL.md`: nothing in the candidate counts as ratified for `app/` or `CHANGELOG.md` until the whole candidate is.
- The CLAUDE.md ratification rule, plus the warning under Learnings about asking too much. Check the review notes before asking anything.

## Recent changes

Ratified 2 Oct by Joe in words: **02.1**, **N2** and **Keep <current plan>** on the Account card; **Switch 02.1, centred** ("Beautiful. Build it.").

- `cand-ppp-account.jsx`:
  - `PppNotSubscribed` (N2): "Subscribe" is a door link inside the line, with no button. Its 44px tap area is invisible. "your own." is joined by a no-break space.
  - `pppNb()` joins a phrase with no-break spaces.
  - `PppSubscribed` (02.1): the buttons sit in `.ppp-pair`, which is two columns once the card is 440px or wider and a stack below that. A lone button spans both columns. The card icon is on Update. While a switch is pending, a **Keep <plan>** button does `A.set({ pending: null })`, with no confirm. The billing foot is `.ppp-foot`. Cancel is red text below a rule (`.ppp-end`).
  - `PppSwitchSheet`, **rebuilt**: a before-and-after panel `.ppp-ba`. It reads Now, then the current plan and price, then an arrow (`arrow-right`), then "From <short date>" with the new plan and price. Each half's text is centred in its half, on a sunken panel with no row rules.
    - The buttons are **Switch to <plan>** and **Cancel**, as in canon's ConfirmDialog. There is no close button.
    - Gone: the plan card, the pill, the body sentence and "Nothing to pay today."
    - The behaviour is unchanged: on a free month the plan changes outright; otherwise `pending` is set.
  - Cancel sheet copy: prices and dates are wrapped in `pppNb`.
- `cand-ppp-sheet.jsx`: new `PppOverlayFrame` context. A board uses it to set sheet or modal per frame, and the overlay then takes no focus and no keys. It does nothing when absent, as in the candidate.
- `circlists-per-person-pricing.html` ppp CSS block:
  - `.ppp-row` wraps. `.ppp-card-cq`, `.ppp-pair`, `.ppp-foot*`, `.ppp-end` and `.ppp-link44` are in.
  - The new `.ppp-ba*` rules sit after `.ppp-actions-row`.
- `playground/pg-ppp.css`: the same CSS, kept in step. The copy block now also includes the overlay rules (`.ppp-scrim` … `.ppp-actions-row`) and `.ppp-ba*`. Board-only: `pg-ov-frame`, `pg-sw-rows`, `pg-ba*`.
- `playground/pg-switch-sheet.html` + `.jsx` (new board):
  - 00 is the mounted `PppSwitchSheet`, now 02.1.
  - 01 is one sentence, 02 the card's own rows, 02.1 before and after, and 04 no confirm, which is live and shares one store.
  - Each option shows as a bottom sheet at 320 and 390 and as a modal on desktop, over the real Account card. Controls: Plan now, Status.
- `playgrounds.json`: the Switch board's entry has been added.
- `github.md`: Last sync refreshed.

## Learnings

- **Wrapping, as Joe wants it.**
  - Prices, dates and "N days left" never split.
  - A label/value row stays on one line or stacks whole.
  - Don't use `text-wrap: balance` on short copy.
  - The allowed fix for an orphan is joining the last two words with a no-break space.
- **Button groups never wrap 2+1.** Use a grid that's either one row or a full stack.
- **Emphasis follows the action, not the layout.** Rare or destructive actions are quiet, and full weight goes to the confirm step. Don't propose writing this into CLAUDE.md again.
- **Iterate an option in place.** When Joe is refining one option, change that option. Don't add new numbered options (he swore at 02.2–02.6). Show him the changed option and let him react.
- **Don't keep asking.** When Joe says "fix the problem", find the specific defect and fix it in the build, then show it. Asking for confirmation on every step frustrated him this session. The ratification rule covers product decisions, not each move on a board.
- **No new devices.** A divider-and-disc arrow was rejected as not fitting the app. Right-aligned text and hugged widths were rejected too. The defect turned out to be the gap each half left after left-aligned short text, and centring the text in each half fixed it.
- **Overlays sit fine on the house pattern.** A thin confirm (title, a small panel, two buttons) matches canon's ConfirmDialog. Joe worried the modal would look thin, but it didn't once built.
- The "files not found" warning on nested entries is the base-href false positive. It also stops the background verifier from running, so checks have to be done by hand.

## Artifacts

- `cand-ppp-account.jsx`, `cand-ppp-sheet.jsx`, `circlists-per-person-pricing.html` (CSS)
- `playground/pg-ppp.css`, `playground/pg-account-card.jsx`, `playground/pg-switch-sheet.html`, `playground/pg-switch-sheet.jsx`
- `review-2026-10-02-account-card.md`, `review-2026-10-02-switch-sheet.md`
- This handoff.

## Action Items & Next Steps

1. Joe reviews the phone and desktop subscribe-page boards. Record his choices in a review notes file like the two above, then build them in one pass.
2. Check every candidate surface for wrapping against the rules above: subscribe page, checkout, sleeping-circle card, the cancel sheet, and the Switch panel at 320 with the longer "From" label.
3. Keep <plan> is new behaviour. It needs a record in the monorepo spec, via Joe's spec agent. The Switch overlay is now built, so its copy needs the same record.
4. Still open: the "Resume subscription" label and the "2 months free" wording. The Switch overlay no longer uses either the pill or "the price of 10 months".
5. Payment failed now shows Update payment card full width on its own. That's my call, not ratified, so flag it to Joe.
6. The Cancel sheet hasn't been reviewed against the Switch overlay's new shape. Don't change it unasked, but it's the natural next surface in this area.

## Other Notes

- 03.1 (buttons beside their rows on desktop, stacked on a phone): Joe liked it but set it aside. It stays on the Account board.
- Switch 04 (no confirm, with Keep <plan> as the undo) was not chosen. It stays on the board.
- `uploads/` has been cleared of this session's screenshots.
- Each turn, give Joe one decision and keep the reply short.
