# Handoff, 2026-10-27: kit v8, comments carry intent

- Version before: 7 (now 8).
- Added: the comments rule, in `ARCHITECTURE.md` § Conventions and `CLAUDE.md` § Code (its own block).
- Skipped: nothing of the rule was already there. The older "Comments never cite a `docs/` path" rule stays beside it.
- Comments: 1 deleted as narration; 80 `KEEP:` marks added (32 in `app/*.jsx`, 48 in `index.html`'s styles). Stale comments corrected in the same pass: Escape no longer "has one room so far" (`gs-data.jsx`, `gs-puzzles-library.jsx`, `gs-history.jsx`), and Escape's result comments in `gs-escape.jsx` and `index.html`.

## How the audit ran

Every comment in `app/*.jsx`, `index.html` and `tokens.css` (about 1,100) was listed and sorted by kind. Almost all were intent (a rule with its reason) or mapping (file heads, section labels, seed labels), and stayed. Special behaviour that carried no mark (adaptive layout, overflow and overlap handling, hit areas, contrast fixes, cards ending level, focus return) got a `KEEP:` stating the outcome; where the old comment described the method, it was rewritten to the outcome.

## Left alone

- History: `CHANGELOG.md`, `docs/archive/`, every handoff and prompt in `docs/specs/`.
- Task-folder code under `docs/specs/*/` (playgrounds, rigs, candidate builds): left as each ticket's record. Clean a rig's comments when it is next built on.
- `skills/` (vendored and kit skills), `_ds/` (the design system's bundle), `playgrounds.html` (no comments).
- Kit aid files (`states.jsx`, `states-ui.jsx`, `qa.jsx`, `config.jsx`, `primitives.jsx`, `main.jsx`): audited; their long explanatory heads are intent and stay. Three `KEEP:` marks added in `config.jsx`, `main.jsx` and `primitives.jsx`, which the kit may want carried back.
- Code, identifiers, classes and keys: untouched.
