# Handoff: kit catch-up to version 5

2026-10-18. Shared rules only; nothing in the build changed.

- Version before: 5 on the line, but the content stood at about 2 (the line was set to 5 earlier today without the missing rules, see `docs/specs/kit-5-update/`). So every item was checked by content, not by the version gate.
- Added or replaced: C (replaced the older "Record it in the task's handoff" bullet), D second bullet (pill bullet now names the app's states list), E (replaced the older reload block; adds the address and `createRoot` rules), F (new demo-facts block, after the pill block in the Code section), H2 (replaced the earlier wording).
- Skipped, already there: A, B, D first bullet, G, H1, I.
- Could not place: nothing.

## Snags
- F names kit files (`app/gsa-data.jsx`, `gsaSeed()`, `GSA_DAY0`) as the pattern; this project's seed is `app/gs-data.jsx`. No change needed: the rule marks those names "in the kit" and points to `app/README.md` for the local file.
- E describes the app writing its page into the address (`#/<page>`); whether this app does was not checked (no build audit, per the brief).
