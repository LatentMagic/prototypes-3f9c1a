---
date: '2026-10-08'
topic: 'playgrounds-launcher'
status: 'done, pending review'
type: 'kit update'
---

# Handoff: playgrounds launcher

## What changed
- `playgrounds.html` (root): the launcher, written as given. Reached at `/playgrounds.html`, not linked from the app.
- `playgrounds.json` (root): manifest, `generated` 2026-10-08, two tickets.
- `CLAUDE.md`: the Root bullet names both files; the launcher bullet sits before "A state is a scenario, never a width." Nothing else touched.

## Audit
| Playground | In manifest before | Now |
|---|---|---|
| `docs/specs/delve-two-pages/playground/index.html` | no (no manifest) | yes |
| `docs/archive/home-free-and-pass/playground/index.html` | no | yes |

No playground sits at the root or under `app/` or `skills/`. No playground was moved, renamed or edited.

## Choices to ratify
- **`product`** is `[Platform]`, the name the product block carries. Change it when the product is named.
- **Ticket ids** are `—` for both: neither folder has a tracker id (`delve-two-pages`, `home-free-and-pass`). Rename when tickets exist.
- **`home-free-and-pass`** is `state: "archive"` with its rig under `archive`, and `"base": "docs/archive/"` so the ticket page shows the right folder. It was the finished rig for the `demo` ticket's free-and-Pass work.
- **Names and notes** come from each folder's README, handoff and `<title>`.
- **`touched`** dates come from file modification times (8 Oct and 7 Oct).
- **Documents-only tickets** (`demo`, `username-1`, `989-36000-summers-ago`, and the rest) are not listed. The brief asks only for playgrounds. Say if you want them on the page.

## Tokens
Every token the page uses is in `tokens.css`: `--color-page`, `--color-fg-1/2/3`, `--color-border-1/2`, `--color-surface-sunken`, `--color-accent`, `--font-sans`, `--font-mono`, `--text-sm`, `--text-xl`, `--duration-base`, `--ease-quiet`. Nothing missing. The tokens are the kit's light values, so the launcher renders light.

## Next
Regenerate `playgrounds.json` in the same change as any new rig.
