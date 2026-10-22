# Foundations

Each token's role. Values are in `tokens.css`; swatches and scales are on the Colors, Type and Spacing cards.

## Colour

- **One accent**: Emerald `#047857`. For primary actions, the active tab, focus rings, selection, live controls and brand moments. Never status, never decoration.
- **Destructive** `#991B1B`: destructive actions and errors. Its weight is proportionate to the consequence: a trigger that only opens a confirm is recessive (destructive-secondary).
- **Sage** `#8BBFAD` is the mark's halo and the arrival wash. **New words** `#5E9C86` marks unseen comments. **Thought paper** has its own warm sheet.
- Neutrals are warm and paper-leaning: Cream page, White surface, Ink text, three text steps.
- `--color-accent-warm` and `--color-accent-cool` are not approved, and `--color-surface-raised` is reserved. Don't use them.

## Type

- **Inter** for text. **JetBrains Mono** for small labels, markers, status pills, section labels, URLs and standalone link text.
- Hierarchy comes from size and weight, never colour. **Attribution sits at title weight.**
- Sizes, line heights and tracking are separate scales; no size is paired with a line height.

## Links

Two forms. The underline is always present, never hover-only.

- **Standalone** (a link on its own, e.g. an email address): JetBrains Mono, Ink, border-1 underline at rest, Ink on hover. The bare `a` rule.
- **Inline** (inside a sentence): Inter, Emerald, underline at Emerald 35% at rest, full Emerald on hover and focus-visible.

## Space, shape, depth, motion

- 4px grid. Radii 4 / 8 / 12, with pill for markers only.
- Shadows: flat by default, raised for popovers, overlay for dialogs and sheets.
- Motion is quiet (`--ease-quiet`, 100–200ms). `prefers-reduced-motion` is honoured everywhere.
