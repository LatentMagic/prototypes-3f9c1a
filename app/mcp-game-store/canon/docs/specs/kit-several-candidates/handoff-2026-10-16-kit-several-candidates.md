# Handoff: several candidate builds per ticket (kit update), 2026-10-16

## Why
The kit allowed one candidate per ticket (`candidate/index.html`; "If it exists, stop"). Two rival Discover candidates for ticket 1153 therefore landed in two invented ticket folders, beside a third folder for the Pass upsell playground. The prompts carried no ticket id, so each agent named a folder after its own piece.

## Kit update applied
- `CLAUDE.md`: the bullets "A candidate build lives in its ticket folder", "`playgrounds.html` at the root is the launcher", "Where it lives.", "How the owner opens it." and "Accepted: merge. Refused: throw away." replaced with the kit's blocks. No product wording differed in these, so the blocks went in as given.
- `docs/specs/CLAUDE.md`: first paragraph of the merged/thrown-away section, and the "Archiving is a move" bullet.
- `docs/archive/README.md`: first sentence.
- `skills/candidate-build/SKILL.md`: diagram and paragraph, invariants 1, 6, 10, and the sections Placement and naming, Making the entry, Merging a whole candidate, Throwing one away, The write-up.
- `playgrounds.html`: the count and group label lines.

### Two defects in the pasted kit, and what I did
- **Making the entry, step 5, is cut off mid-sentence** ("To show a candidate screen, uncomment `Screen` in the bridge and point it at the"). I applied the block up to the end of the last whole sentence and left the fragment out. The kit should send the full sentence.
- **Merging a whole candidate** arrived without its `##` heading. I kept the heading.

### Follow-up corrections (kit, same day)
- Step 5's last sentence: added ("To show a candidate screen … stay as they were."). This closes the cut-off noted above.
- Invariant 4: already ended with the two sentences on states and QA. No change.
- "Root means…" in `CLAUDE.md`: already read `Root means "this is the product", never a candidate of it.` No change.

## Audit (whole project)
**Change (made)**
- The kit's own targets above.
- `skills/candidate-build/SKILL.md` frontmatter: "a second, unaccepted state" → "another, unaccepted state".

**Leave alone**
- Storage keys `kit_discover-tidied_candidate`, `kit_discover-games-hub_candidate`, `kit_pass-upsell-proposal_playground`, `pg_pass-upsell-proposal_v1`: they keep working; renaming them would reset review state.
- File names `cand-discover-tidied-*.jsx`, `cand-discover-games-hub-*.jsx`: already fit `cand-<name>-*`.
- "both entries" in invariant 1 and in Placement: in the ratified blocks verbatim.
- `app/qa.jsx` comment on "a candidate build's walk-through": generic, and `app/` is out of scope.

**History**
- `docs/archive/1110-daily-word-mystery-content/` handoff ("The candidate folder…"), `docs/archive/candidate-build-kit/`, old handoffs and prompts.

## Owner's instruction, same session: group 1153, archive the rest
- `docs/specs/1153-pass-upsell/` now holds `candidate/discover-tidied.html`, `candidate/discover-games-hub.html` (with their `cand-*` files), `playground/` (Pass upsell, A to G), the three handoffs and a new README. Script paths in the three entries and paths in the three handoffs were rewritten to the new folder. The three old one-paragraph READMEs were replaced by the one README.
- Every other folder under `docs/specs/` moved to `docs/archive/<same name>/`. `docs/specs/` now holds `1153-pass-upsell/`, this folder, `CLAUDE.md` and `README.md`.
- `playgrounds.json` regenerated: one 1153 ticket with two candidates and one rig; this ticket, documents only; every other ticket `state: "archive"` with its entries under `archive` at `docs/archive/` paths.

## Left unresolved (owner to decide)
- **Stale paths after archiving.** About 20 comments in `app/` and several QA titles in `app/qa.jsx` cite `docs/specs/<folder>/`; the product block in `CLAUDE.md` cites `docs/specs/free-and-pass/` and `docs/specs/989-36000-summers-ago/`. Those now live under `docs/archive/`. Not changed: `app/` was out of scope, and the product block is owner-held.
- Archived playgrounds no longer run (their script paths point at `docs/specs/`), as the archive README expects.

## Audit: why `app/` and `CLAUDE.md` cite `docs/specs/` (2026-10-16)
Not needed for anything to run; nothing reads these paths. They are provenance comments.
- **Cause (kit).** Two rules with no rule between them: "cite specs by path and id" (Always § Upstream first) and "record a decision in the task's handoff under `docs/specs/`" (Wrapping up). Nothing says where a decision's provenance goes in code, or that a `docs/specs/` path moves on archive. Agents filled the gap by citing the local folder.
- **Second smell.** Several comments hold the decision itself ("owner, 2026-10-13: Available games is NOT meant to hold every game", gs-home.jsx; "REQUIRED when Terms are written", gs-site.jsx). That is a local rule list in code, which the kit forbids elsewhere.
- **Proposal for the kit (not ratified).** Code comments may say what a piece does and a constraint it must keep; never a `docs/` path. Provenance lives in the handoff and travels upstream; code cites the upstream spec id if anything.
- **Consequence of this session's blanket archive.** `CLAUDE.md` says the free-and-Pass rules are unratified "until the owner has read the handoff (`docs/specs/free-and-pass/`)", and `app/qa.jsx` keeps "not ratified" walk-throughs for notifications, rhythm-filters, walk-sweep and free-and-pass. Those folders were open work and are now in the archive.

## Next
Owner checks the launcher; decides on the stale paths.
