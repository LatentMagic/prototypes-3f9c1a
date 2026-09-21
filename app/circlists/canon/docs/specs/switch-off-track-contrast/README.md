# Switch OFF-track contrast fix

Brings the prototype's Mark-as-read switch (`CandSwitch`, `app/talk-parts.jsx`) back in line with the shipped delivery on WCAG 1.4.11.

## Change
- OFF-track fill: `--color-border-1` (`#DCDCD8`) → new token `--color-border-3` (`#949490`).
- Added `--color-border-3` to `tokens.css`, between `--color-border-1` and `--color-fg-3` — a warm mid-neutral for resting UI-component states.
- Contrast against `--color-surface` (`#FFFFFF`): **3.04:1** (WCAG 1.4.11 floor is 3:1). Previous value was ~1.38:1.
- ON track, knob, size, shape, motion, and the Swell beneath — unchanged.
