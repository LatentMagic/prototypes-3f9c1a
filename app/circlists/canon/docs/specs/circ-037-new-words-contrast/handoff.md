# Handoff — CIRC-037 new-words contrast (2026-09-24)

Correction from the 2026-09-24 delivery pulse (monorepo #851 shipped a darker tab and a screen-reader "New"; `canon` still showed the pre-contrast form).

## Changed
- `tokens.css` — new `--color-new-words: #5E9C86` next to `--color-sage`. Sage itself unchanged.
- `app/talk-surface.jsx` `CandTurn` — the row tab's `bright` branch paints `--color-new-words` instead of `--color-sage`. The tab stays `aria-hidden`, 3×22, in the row's flow.
- `app/talk-surface.jsx` `CandTurn` — unseen rows (`fresh`) get a visually-hidden "New" first in the name line, using the existing `.circ-vh` class (same pattern as the circle dot's ", new items").

- `app/talk-return.jsx` and `app/home-returns.jsx` — the returns banner's 3×22 tab (the source the row tab copied) also moves to `--color-new-words`. Ratified by the user 2026-09-24. No text alternative added there: the tab is `aria-hidden` beside the banner's visible text line, which already carries the state.

## Choices
- Dark value `#8BBFAD` recorded in the token comment only. `canon` has no dark theme; adding a lone `prefers-color-scheme` override would paint one dark-mode colour onto a light page.
- "New" sits before the name, per the shipped row, so it is announced first.

## Not built
- Dark mode value is not wired (no dark theme to wire it into).

## Next
- If a dark theme lands, set `--color-new-words: #8BBFAD` there.
