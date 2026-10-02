---
date: '2026-10-02'
board: playground/pg-switch-sheet.html
---

# Switch overlay review

## Ratified
- **02.1, centred** (2 Oct, "Beautiful. Build it."): before and after on a sunken panel. Now, an arrow, then From <short date> with the plan moved to; each half's text centred in its half. Buttons Switch to <plan> and Cancel, no close button. No plan card, no pill, no quiet line. Built into `cand-ppp-account.jsx` `PppSwitchSheet`; CSS `.ppp-ba*` in the candidate entry and `pg-ppp.css`.

## Said along the way (not decisions)
- "Nothing to pay today" is redundant.
- 01's sentence reads badly; 02 reads as state, not a change, and repeats the card behind it.
- Right-aligned text, hugged widths, a hairline split and an arrow disc were all rejected.
- Change the option in place; don't add new numbered options while iterating one.

## Still open
- 04 (no confirm, Keep <plan> as the undo): not chosen; the confirm stays.
