---
date: '2026-10-22'
topic: 'brand-pack-2026-10-22'
status: 'open item'
type: 'catch-up from the design system'
---

# Handoff: brand pack 2026-10-22 and the design system's update list

## Task

The design system's catch-up list for the prototype (DS `docs/specs/brand-pack-audit/handoff-2026-10-22-brand-pack-audit.md` § Action Items, DS `docs/specs/usage-records-audit/audit-2026-10-22.md` § Decision), given by the owner on 2026-10-22.

## Recent changes

- `_ds/…019dca/`: refreshed from the design system (README, bundle, manifest, adherence, `tokens.css`, `components/components.css`, and `guide/` — foundations, behaviour, overlays, content).
- `brand/`: replaced with the wiki pack (`wiki/products/circlists/brand/`, wiki @49d264bee9dc), 71 files, in the pack's own subfolders: `assets/{icons,mark,wordmark,lockup,motion,native}/`, `scripts/`, `circlists-brand.md`. The old flat `brand/assets/*`, `brand/motion/` and `brand/circlists-brand.html` are gone.
- Paths moved to the new subfolders in `circlists.html`, `playgrounds.html`, `CLAUDE.md`, `app/primitives.jsx`, `app/brand-motion.jsx`, `app/store-listings.jsx`, `app/push-preview.jsx`.
- `tokens.css`: the bare `a` rule sets JetBrains Mono (standalone link, DS `guide/foundations.md` § Links). Destructive, new-words and 3xl comments now state the role only, matching the DS.
- `app/auth.jsx` LegalLink: `fontFamily: 'inherit'`, so the consent line's links keep the sentence's face under the new bare rule. Inline doorlinks are buttons and are unaffected.

## Rigs and candidates (owner, 2026-10-22: "just update them all")

- Every rig and candidate under `docs/specs/` repointed to the new subfolders (33 files), including lm-652's own `archive/` and the merged A3 and LM-652 candidates.
- Left alone: the three lm-652 standalone bundles (pending deletion), handoffs and notes (records of their day), and everything under `docs/archive/` (rule: archived paths are left to break).
