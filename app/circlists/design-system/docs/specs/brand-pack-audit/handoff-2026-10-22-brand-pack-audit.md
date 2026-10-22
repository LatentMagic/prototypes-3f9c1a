---
date: '2026-10-22'
topic: 'brand-pack-audit'
status: 'complete'
type: 'audit and catch-up'
---

# Handoff: brand-pack-audit — design system brought up to the 2026-10-22 brand pack

## Current Focus

Done. The open items are what the prototype needs (below) and resolved: destructive's scope (audit, References disagree 4) and the move of `audit/` into `docs/specs/` (2026-10-22, owner).

## Task(s)

Audited the design system against `circlists-brand-pack-2026-10-22` and the prototype (`prototypes-3f9c1a` @ `e8ec4a56d399`), then fixed everything in the Behind group. Audit: `docs/specs/brand-pack-audit/audit-2026-10-22.md`.

## Critical References

- `CLAUDE.md`: order of truth, ratification, no mirrored specs.
- `docs/specs/brand-pack-audit/audit-2026-10-22.md`: every difference, in three groups.

## Recent changes

- `assets/brand/`: replaced with the pack's `assets/` byte for byte (48 files: `mark/ wordmark/ lockup/ icons/ motion/ native/` plus their READMEs). Their relative links to `../../circlists-brand.md` don't resolve here; the spec lives in the wiki.
- `cards/brand-mark.html`, `brand-wordmark.html`, `pattern-arrivals.html`, `thumbnail.html`: paths changed to the new subfolders.
- `cards/brand-app-icons.html`: new paths; the notification favicon added; the push badge moved onto a white tile, because the black silhouette on the old black tile didn't show.
- `cards/colors-accent.html`: Emerald named; Soft (reserved) added. `colors-neutrals.html`: Cream, White and Ink named, text-neutral roles from the spec, border-strong and scrim added.
- `cards/type-scale.html` (new): weights, sizes, line heights and tracking, as separate lists.
- `cards/pattern-inline-link.html`: now the **Links** card, with both forms; the inline form gets the reduced-motion rule.
- `cards/type-mono.html`: standalone link example added.
- `README.md` § Visual foundations: type and link lines; index updated. `SKILL.md` step 5: asset folders.
- `docs/specs/README.md`: scaffolded.

## Choices made (open items the brief left to this session)

- **Asset layout:** the pack's own subfolders, so a future pack drops in wholesale with no remapping.
- **Spec and board not kept:** `circlists-brand.md` and `circlists-brand.html` were deleted with `uploads/`, per CLAUDE.md (no mirrored specs). They are in the wiki.
- **Missing colours** go on the existing cards (accent soft on Accent, border-strong and scrim on Neutrals) rather than on new cards.
- **The type scale** is one new card. The existing heading and body cards keep their pairings, because they show the prototype's element rules, not the scale.
- **The motion `Placement` line** dropped with the byte-for-byte replacement. Its rule is still in `README.md` and the Button source.
- **The "Coming soon" pill** was not added to the Mono card: neither reference gives it a style.

## Not covered and References disagree

See the audit's two sections. Not covered: thought-paper tokens, arrival wash, surface-press, breakpoints, dense touch, every pattern and spacing card, all components. Disagree: standalone link face; the prototype's stale `_ds/`; the old `canon/brand/`; destructive's scope.

## Decisions

- 2026-10-22, ratified by the owner: the brand spec's destructive usage note ("v1 only on the last-member Leave") is stale. Destructive is the colour for destructive actions and errors; the README and Delete dialog stand. General rule: a design system states that a token exists and its role, not how a product consumes it.

## Action Items & Next Steps

What the prototype needs to match (its own update):
1. Refresh `canon/_ds/` from this design system; its `tokens.css` is not the current one.
2. Replace `canon/brand/` with the 2026-10-22 pack.
3. Give standalone links JetBrains Mono, as the spec says (the bare `a` rule sets no face).
5. Upstream (brand pack / prototype `tokens.css`): the destructive comment's "v1 only on the last-member Leave" usage note is stale; see Decisions.

## Other Notes

The C2PA `<metadata>` block in the pack's SVGs is provenance, not geometry; don't strip it, or the files stop matching the pack.

## Prototype catch-up report (2026-10-22)

The prototype reported all five items done. It found one gap here: this system's bare `a` rule set no font, against `guide/foundations.md` § Links. Fixed: `tokens.css` `a` now sets JetBrains Mono, and the inline-link class on the Links and Empty state cards sets Inter.
