# Handoff — button loading (2026-10-12)

Source: delta instruction "a busy button shows its own ring" (ui.md Decision-13, Decision-53). Written for the prototype session; applied here only where this design system holds the same text.

## Changed
- `README.md` § Visual foundations, loading bullets. Now names both indicators: the brand spinner (standalone, centred, no copy) and the in-button ring (before the label, press to result). Keeps "the brand spinner never sits inside a button". Lists the server-waiting buttons. Get a link: button only disables, link box shows the brand spinner at small size.
- `assets/brand/motion/circlists-motion.md` § Spinner: added a Placement line with the same rule.

Wording choice: kept "the brand spinner never sits inside a button" verbatim and added "the ring is what a button shows" right after it, so the sentence can't be read alone as banning any spinner in a button.

## Checked, left alone
- `components/button/Button.jsx` / `.d.ts`: already draw the ring on `loading` and say the brand spinner never sits in a button. No change.
- `CLAUDE.md`, `SKILL.md`: no loading statement.
- `docs/specs/overlays-and-working-state/handoff-overlays-and-working-state.md`: history.

## Not done here (prototype territory; CLAUDE.md: never edit the prototype from here)
- `GOTCHA.md`, `ARCHITECTURE.md`, prototype `CLAUDE.md`: not in this project.
- `docs/specs/per-person-pricing-as-shipped/handoff.md`: closing the busy-confirm-button item.
- Get a link box wait (brand spinner small, no ring in the button).

## Next
Run those three in the prototype session. Done: the exported ring is now `Ring` (`components/button/`), with `Spinner` kept as a deprecated alias. Drop the alias once consumers have moved.
