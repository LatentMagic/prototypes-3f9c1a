# Handoff: take-over buttons, same width

## Changed
- `circlists.html`, inside `@container (min-width: 520px)`: when `.circ-dormant-actions` holds two `.circ-btn` (Leave and the take-over button), it becomes an inline grid of equal `1fr` columns, centred. Both buttons take the longer label's width. Applies to every take-over label (Take over this circle, Resume subscription, Update payment card with its icon).
- `app/qa.jsx`: new entry "Take-over buttons, same width" (candidate-only, like the pricing entry), with a desktop-width note.

## Untouched by construction
- Phone layout: the rule sits only in the 520px container query.
- Suspended screen: Leave plus a mailto link (not a `.circ-btn`), so the selector does not match.
- Own-circle asleep screen: a single button, no match.

## States (existing, none added)
`ppp-takeover` (no subscription), `ppp-takeover-subscribed` (Active), `ppp-takeover-ending`, `ppp-takeover-failed`.

## Not done
Not measured in a browser yet. The selector uses `:has()`; an engine without it keeps the previous auto widths.
