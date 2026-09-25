# Handoff — CIRC-039 returns-bar head wrap

## What changed
`app/talk-return.jsx`, the bar's toggle button (~line 174–179):
- Head line (`{head}`): removed `whiteSpace: nowrap` (it was declared twice) and `overflow: hidden`; added `textWrap: pretty` and `overflowWrap: break-word`. It now wraps to a second line when it does not fit, in both collapsed and open states.
- Button padding `0 12px 0 14px` → `8px 12px 8px 14px`. At one line the button is still held at `minHeight: 56`, so nothing moves; when the head wraps, the two-line head plus subline gets 8px breathing room instead of touching the bar's edges.

## Unchanged
Subline (names, "… spoke") keeps `nowrap` + ellipsis. Rows, choreography, clear footnote, `--color-new-words`, and every other surface untouched.

## Open items
- The 8px vertical padding went beyond the literal instruction; the user ratified keeping it (it is invisible at single-line widths).

## Next
Check the shipped app's wrapped height at 320px against this and align padding if it differs.
