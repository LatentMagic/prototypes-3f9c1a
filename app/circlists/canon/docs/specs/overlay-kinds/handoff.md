# Handoff — overlay kinds (2026-10-08)

Brief: the delta "three kinds of overlay, and which one changes on a phone". Rule ratified, going into `ui-design.md` via monorepo draft PR #1002. The live `ui-design.md` still carries the old adaptive line ("a desktop modal … becomes a bottom sheet on a phone") until that PR lands.

## Built
- `CLAUDE.md`: the "Overlays adapt" bullet replaced by the three kinds, word for word; the check-both-widths instruction kept; "never one shape at every width" removed.
- `app/pricing-account.jsx`: Switch plan passes `modal` to `PppOverlay`, so it is a centred dialog at every width with stacked buttons at phone width (`.circ-dlg-act`), the same shape as Cancel subscription. Copy and content unchanged. Comment in `app/pricing-sheet.jsx` updated.
- Cancel subscription: already a centred dialog. Left.
- View options: already a bottom sheet below 640 (`app/feed-lens.jsx`, `isSheetPosture`). Left.

## Staged states
- Switch plan: States → per-person pricing → "Account, switch to yearly (sheet A)" (`ppp-switch-yearly`); also `ppp-switch-monthly`, `ppp-switch-free-month`, `ppp-switch-fails`, `ppp-switch-busy`. The label still says "sheet A"; renaming it is unratified.
- Cancel subscription: `ppp-cancel`, `ppp-cancel-free-month`, `ppp-cancel-failed-payment`.
- View options: no state. Open any circle, press View. Use Config → Viewport (or a window under 640) for the phone shape.

## Open items
- View options swap width, height, long Filter: no new choice made, because it was already built and working. It follows Add: 640 (BIZ-136, 2026-09-14, the real app's Add-surface value). Height is capped by `circSheetMaxHeight` against the measured visible height, top edge at least 88px inside it. A long Filter list scrolls the sheet as one region; the list itself is uncapped on a phone.

## Docs
- `GOTCHA.md`, `ARCHITECTURE.md`: no statement of the old rule.
- Design system README: no statement of the old rule; one stale breakpoint (see audit 5).
- `MOBILE.md` "Bottom sheet — Add only": no longer holds. In the app posture View options, The Swell, its door and Who reacted are also sheets. Proposed wording, unratified: "Bottom sheet — panels (the three kinds in `CLAUDE.md`): Add, View options, The Swell, Who reacted."

## Unresolved, next
1. Ratify the `MOBILE.md` wording.
2. Audit mismatches 1 (sign-up gate as a dialog) and 4 (one 640 swap width) need a ruling; see `audit.md`.
3. Verify at 390 that the Switch dialog's before-and-after row fits (440 max, 358 at 390).
4. Ask whether this earns a `CHANGELOG.md` entry.
