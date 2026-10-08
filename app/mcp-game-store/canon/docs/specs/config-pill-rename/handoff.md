---
date: '2026-10-08'
topic: 'config-pill-rename'
status: 'done'
type: 'kit update'
---

# Handoff: "launcher" becomes "Config pill"

## Files touched (prose and comments only)
- `ARCHITECTURE.md`: three mentions (two table rows, the palette bullet).
- `GOTCHA.md`: one mention (pill mounted outside the frame).
- `app/README.md`: four mentions (file table, two known limits, focus note).
- `app/config.jsx`: header comment and the drag-position comment.
- `app/main.jsx`: the mount comment.
- `app/qa.jsx`, `app/states-ui.jsx`: header comments.

## Second pass (changed)
- `index.html`: the CSS section comment.
- `tokens.css`: the header comment.
- `docs/specs/delve-two-pages/playground/index.html`: the same CSS section comment (live rig, comment only).

## Left alone
- Identifiers and keys: `ConfigLauncher`, `kit-launcher*` classes, `kit_launcher_pos`.
- History: `docs/archive/**` (its playground's CSS comment was reworded on request; classes untouched), `docs/specs/demo/handoff-2026-10-06-home-rebuild.md`, `docs/specs/delve-two-pages/handoff-2026-10-07-two-pages-playground.md`.
- `skills/impeccable*`: "Launcher" there is upstream's script launcher, a different thing.
- `CLAUDE.md` and `playgrounds.html`: "launcher" there means the playgrounds page, as intended.
- No behaviour or copy changed.
