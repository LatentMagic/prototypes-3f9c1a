# Handoff: cover motion rule (2026-10-11)

## What changed and where

- `guidelines/game-art-motion.md`: new section **When art moves**, above Hover surface. It carries the rule word for word as a quote, then three cases (on a card or link, on its own, small art) and one paragraph on how the build applies it. The opening scope line now says "any game's art, whichever component draws it" in place of "on a card, tile or link". The `mcp-art-host` sentence moved out of Hover surface into the new section.
- `components/components.css` (game art block):
  - `@property --on` registered with initial value 0, so art outside any host computes its resting form. Before this, `--on` was undefined outside a host, which made the `calc()` declarations invalid: the Casebook and 36,000 Summers Ago suns, for example, rendered square at rest.
  - The pose (`--on:1`) and the in-going stagger now apply only to a host that is pressable: `a[href]`, `button`, `[role=button]` or `[role=link]` that is a `.mcp-card`, `.mcp-row`, `.mcp-cover` or carries `.mcp-art-host`. `.is-pressed` (from `usePress`) now also plays the pose.
  - Reduced motion: transitions stay off, and `--on` is forced to 0 on `.mcp-art` itself, so it holds for every host type.
- `components/media/GameArt.jsx`, `GameArt.d.ts`, `GameArt.prompt.md`: describe the rule and the hosts. The prompt example used a `link` prop that `Card` does not have; now `href`. It also shows a bare `GameArt` as the still case.
- `guidelines/sources-and-index.md`: GameArt line and game-art-motion entry updated.
- `docs/specs/cover-motion-rule/check.html`: a probe page reading the computed `--on` for five cases. Results: bare art 0; `div.mcp-art-host.is-on` 0; `a.mcp-art-host.is-on` 1; non-clickable `div.mcp-card.is-pressed` 0; `button.mcp-row.is-link.is-pressed` 1.

## What was already present

- The motion, timing, stagger, travel caps, hold and touch behaviour: unchanged.
- Hover surface already said the whole card is the target and that hover, focus and press all play the pose. That stands.
- The guidance did not say what a cover outside a card or link does. In the build, `mcp-art-host` worked on any element, so a non-clickable `Card` with that class (or any `div`) moved its art on hover. That contradicted the rule and is fixed.
- A clickable `Card`, `ListRow` or `Cover` holding `GameArt` only moved if the author also added `mcp-art-host`. Under the rule they are the nearest pressable thing, so they are now hosts on their own.
- The product project (`app/`, `index.html`) does not use `mcp-art-host` or `GameArt` yet, so nothing there needed changing.

## Decisions under "Yours to decide"

- **Where the rule sits:** its own section, **When art moves**, before Hover surface. It decides whether art moves at all; Hover surface and Touch then describe how. Illustrated in words (three cases) and with a still `GameArt` in the component prompt. No new specimen card: the existing Motion card already shows art inside links.
- **Very small art:** it moves. A 40px lead in a clickable `ListRow` plays the same pose with the row. Travel is in container units and capped, so small art moves a little and finishes in the same time. A size threshold would add a second rule and a value to maintain, for a case the caps already handle.

## Unresolved

- "Nearest" is met for the cases the system builds. If a pressable thing is nested inside another pressable thing (not valid HTML for `a` in `a`, but possible with `role=button`), hovering the outer one also moves art inside the inner one. Not handled; no component does this today.
- `Cover` draws its own SVG covers, which have no motion. If a `Cover` is given `GameArt` as children and an `onClick`, the art now moves with it.
