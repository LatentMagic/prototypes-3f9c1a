---
date: '2026-10-29'
topic: 'playground-mount'
status: 'complete'
type: 'implementation'
---

# Handoff: playground-mount — six playgrounds mount only on their own page

## Current Focus

Done. The rebuilt `_ds_bundle.js` carries all six guards (checked 2026-10-29).

## Task(s)

Brief: "After Pixels design system — playgrounds mount only on their own page" (pasted by the user from the product agent, 2026-10-29). `_ds_bundle.js` carries every `.jsx`, so six playgrounds mounted into `#root` on any page that loads the bundle, including the prototype and the other playground pages.

Ratified in the brief: a playground mounts only on a page that loads its own file. Nothing else about any playground changes.

## Recent changes

Each file's mount line now sits behind `if (document.querySelector('script[src$="<own filename>"]'))`, with a comment above it. Files were replaced with the attached copies after a diff showed they differ from the old ones only in the guard and comment.

- `docs/specs/canonical-row/playground/pg-row-app.jsx:168`
- `docs/specs/canonical-row/playground/pg-row2-app.jsx:153`
- `docs/specs/canonical-row/playground/pg-row3-app.jsx:151`
- `docs/specs/canonical-row/playground/pg-row4-app.jsx:206`
- `docs/specs/card-chip-alignment/playground/pg-chip-align.jsx:77`
- `docs/specs/card-snug-title/playground/pg-card-snug-title.jsx:98`

None was guarded before. Each playground page loads its file with a `src` ending in that filename, so the guard matches there.

## Learnings

- The bundle is regenerated at the end of the turn, not on demand. At write time the old bundle had no guards; `check_design_system` reported no issues.
- Other playground files also mount unguarded, but they are `.jsx.txt` or inline `<script>` in `.html`, so the bundle does not carry them: `chapter-coming-soon`, `card-row-evenness`, `chat-picture` (`*.jsx.txt`), and the `phone-snags`, `cover-beside-heading`, `underline-hover`, `chat-blocks` pages. Left as they are.
- Any new playground `.jsx` added to the project will be bundled; its mount needs the same guard.

- `pg-chip-align.jsx` read `GS_GAMES` at the top of its wrapper, before the mount guard. The bundle runs it before `pg-chip-data.jsx`, so it raised a caught `GS_GAMES is not defined`. Fixed 2026-10-29: the guard now sits first in the wrapper and returns early on other pages.

## Artifacts

- The six files above.
- This handoff and `docs/specs/playground-mount/README.md`.

## Action Items & Next Steps

1. ~~Grep `_ds_bundle.js` for `script[src$=` and confirm six hits.~~ Done: six hits.
2. The product agent refreshes `_ds/` and checks the prototype no longer draws the Canonical row rounds or Available games cards while loading.
3. Consider adding the mount-guard rule to `skills/build-playground/SKILL.md` so new playground `.jsx` files carry it (needs the user's ratification).
