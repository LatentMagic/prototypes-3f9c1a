# Handoff — kit catch-up to 5 (2026-10-18)

- Version before: 2 (the file read 2 at session start; the earlier kit-5 update today set it to 5 before this catch-up). Gate applied as version 2.
- Added or replaced: E (replaced the version-2 "no real persistence" block with the version-3 block, incl. the `createRoot` bullet); H2 (replaced the earlier relay-reply bullet, landed today, with the new wording).
- Skipped, already there: A–D (version gate, ≥1); F (Data section already says demo facts are held once in the seed); G (all five bullets present); H1 (landed today); I (already reads Kit version: 5).
- Could not place: nothing.

## Snag
- E's wording assumes the app may write `#/<page>` into the address; the old block said a reload "restarts it at Home, signed out". Not checked against the build (the update says not to audit it).
