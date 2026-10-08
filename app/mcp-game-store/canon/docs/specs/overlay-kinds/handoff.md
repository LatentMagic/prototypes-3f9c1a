# Overlay kinds — handoff (2026-10-08)

The rule "on a phone, an overlay is a bottom sheet" was replaced by the three kinds (dialog, menu, panel), ratified upstream for `ui-design.md` (monorepo draft PR #1002). This brings the app and the Delve two-pages playground in line.

## What changed
- `CLAUDE.md`: the overlay instruction now states the three kinds, word for word. "Never use one shape at every width" is gone. No other durable doc (`ARCHITECTURE.md`, `GOTCHA.md`, `app/README.md`) stated the old rule.
- `app/gs-account.jsx`: Delete your account? is now a centred window at every width (was a sheet below 640px).
- `app/gs-billing.jsx`: Switch to yearly/monthly? and Cancel your subscription? are now centred windows at every width (were sheets).
- `app/gs-parts.jsx`: the phone Menu now opens as a dropdown under the Menu button (was a sheet with a "Menu" title). Same items in the same order; the title is now the menu's accessible name. Outside press and Escape close it and return focus to the button, shared with the desktop account menu via `gsUseMenuDismiss`.
- `index.html` and `docs/specs/delve-two-pages/playground/index.html`: two rules, `.gs-menu-anchor` and `.gs-pop-cta`. The playground loads the same `app/` modules, so it picks up every fix above.

## Audit
| Surface | Kind | Phone | Desktop | Matches |
|---|---|---|---|---|
| Account menu (avatar) | Menu | not shown (Menu button instead) | dropdown at control | yes |
| Top-bar Menu | Menu | dropdown at control (was sheet) | not shown | fixed |
| Confirm it's you | Dialog | centred | centred | yes |
| Delete your account? | Dialog | centred (was sheet) | centred | fixed |
| Switch plan? | Dialog | centred (was sheet) | centred | fixed |
| Cancel subscription? | Dialog | centred (was sheet) | centred | fixed |
| Play in your AI | Panel | sheet | centred | yes |
| Share this result | Panel | sheet | centred | yes |
| Playground: Why sheet | Panel | sheet | centred | yes |
| Kit aids: Config, States, QA | Panel | sheet (was centred) | centred | fixed |

Play in your AI asks no question and takes no edit, and is not a list of commands, so the first kind that fits is panel. Share holds text that can grow, plus a Copy action: panel.

## Open items
- **Swap width:** 640px, the design system's `--bp-popup` and the app's existing `gs.narrow`. Kept because every panel already used it and the system defines it.
- **Sheet height:** content height, as the system's Popup draws it. None of the three panels outgrows a phone screen with current content.
- **Kit aids (ratified by the user, 2026-10-08):** Config, States and QA are panels, so below 640px they are bottom sheets, at most 84vh tall, scrolling inside. Change: a `data-shown` attribute in `app/config.jsx`, `app/states-ui.jsx`, `app/qa.jsx`, and one media block in both `index.html` files. **This is a kit change: carry it back to the kit.**
- The design system's guide still says "Pop-up = window on desktop, bottom sheet on phones". It lives in the design-system project and was not edited here.

## Staged states (`?state=<id>`)
- `delete-account-confirm` → press Delete your account.
- `switch-sheet-yearly`, `switch-sheet-monthly`, `switch-sheet-free-month`, `cancel-sheet`, `cancel-sheet-free-month`.
- Top-bar Menu: any page at 390px, press Menu (signed out and signed in show different items).
- Playground: `docs/specs/delve-two-pages/playground/index.html`, press Why.

The state ids still say "sheet". Renaming them breaks shared links, so they were left.

## Next
Carry the kit-aids change back to the kit, then update the design system's Popup guidance upstream.
