# README audit — 2026-10-22

`README.md` is 91 lines and ~9,600 characters. A reader reaches the first rule (Visual foundations) after about 40 lines of sources, index and component lists.

## Findings

1. **It repeats CLAUDE.md.** "Sources" restates the order of truth, and "Future" repeats CLAUDE.md § Future word for word in meaning. README is for consumers; CLAUDE.md is for whoever maintains the system.
2. **Governance mirrors a live spec.** "Governance" summarises `ui-design.md` section by section. CLAUDE.md says never to keep a mirrored spec, and a summary drifts silently. A pointer to the live file does the same job.
3. **Visual foundations mixes three kinds of content.** It has token roles (accent, danger, sage, radii, motion), behaviour rules (loading, the working state, touch) and an overlay kind guide with a long inventory line. They are read at different times.
4. **The overlay inventory is one 900-character line.** It can't be scanned. A table, in its own file, can.
5. **The content rules are a summary of the wiki's copy voice.** That's useful to consumers, but it's another mirror and needs a pointer to its source of truth (it has one).
6. **The namespace note is stale-adjacent.** The namespace is still `LatentPulseDesignSystemV010_019dca` while the project is now titled "Cirlists Design System" (with the typo). Worth fixing the title; the namespace follows from it.
7. **It says where tokens are used in the product,** e.g. "Every button that waits on the server uses it: sign-in, sign-up, Add, Cancel…" and the overlay inventory's product surface list. By the owner's rule of 2026-10-22 (a design system states what exists and its role, not how a product consumes it), these lists belong to the product, not here.

## Proposal

The README becomes a short front door (~30 lines): one paragraph on what Circlists is, the index, the component list, and links. The detail moves into `guide/`, one file per topic:

- `guide/foundations.md` — colour, type, links, spacing, radii, shadows, motion: each token's role.
- `guide/behaviour.md` — loading (spinner vs ring), the working state, touch targets, status without colour fills.
- `guide/overlays.md` — the three kinds, how to pick, and what changes shape on a phone.
- `guide/content.md` — the copy rules summary, pointing at the wiki's copy voice.

Cut, not moved: Sources and Future (CLAUDE.md has them), the governance summary (replaced by a link to the live `ui-design.md`), and the product-usage lists in finding 7.

Not decided: whether `SKILL.md` should point into `guide/` too (it currently restates parts of the README).

## Decision

2026-10-22, ratified by the owner: split and cuts as proposed. Done: `README.md` is now a ~45-line front door, and the detail is in `guide/foundations.md`, `behaviour.md`, `overlays.md` and `content.md`. `SKILL.md` step 1 points into `guide/`. The destructive line in `guide/foundations.md` uses the owner's 2026-10-22 wording ("destructive actions and errors").

Still open: the Danger card's subtitle reads "Destructive confirms and their triggers only", which is narrower than the ratified wording.
