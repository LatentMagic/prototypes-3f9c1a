---
date: '2026-10-28'
ticket: '1236'
topic: 'delve-v4-e4'
status: 'in-progress'
type: 'implementation'
---

# Handoff: Delve session page, E4: the character sheet as its own card, four concepts

## Current Focus

The owner reviews v3 (`playground/delve-v3.html`; not reviewed at all yet, see `handoff-2026-10-28-delve-v3-e3.md`) and then v4 (`playground/delve-v4.html`). Nothing is ratified.

## The owner's brain dump (2026-10-28), as input, not decisions

- The sheet is a **separate card**, a band on top of the session content. He expects this to change later ideation ("a lot more rooms").
- Open: vertical beside the session card on desktop (like the library game page) or horizontal, and how a phone takes it.
- More content gets in the way, mostly on a phone.
- Permission to "think a bit like hex": I read this as giving things their own shape or character, as the die's hex does, so the sheet speaks visually rather than in words. **Not confirmed; ask.**
- Things can be clicked into and folded away; stay terse; don't show everything just because it exists.
- Four concepts in one playground.

## Built

`playground/delve-v4.html` + `pg-dv4.jsx`. The bar: Play (In progress first, since mid-run is the sheet's point), Concept, Why.
- **1 · Strip**: a horizontal band of figures: hero, HP, threat, pack (with glyphs), ability uses, inspiration. The stats sit in a Disclosure.
- **2 · Rail**: on a page 1000px or wider, a 304px card beside the session card. Below that width it is a band: hero, HP, threat, with the rest in a Disclosure.
- **3 · Tokens**: shapes instead of words. Hexes are what touches the die (the stats; inspiration, rimmed like a natural 20, which gives it back). Squares are things (gear, ability). Bars are the tracks. A tap names a token on the caption line.
- **4 · In hand**: slots for what is left to use (gear, empty pack space, ability, inspiration), with spent ones greyed. Bars for HP and threat; the stats on one line.

Shared: the "Character sheet" heading. Armour has its own glyph, a shield. A used item is grey and struck through. A key is kept and notes the lock it opened (delve.md, Gear). The session card is v3's concept 1, held fixed, with v3's sheet removed.

## Calls I made (for the owner to judge)

- The sheet's sample facts are invented: Con and Cha, the abilities (Shield bash, Backstab, 2 uses each) and the starting gear. Str, Dex, Int and Wis come from the records. They live in the seed (`DV_HEROES`, per-session `sheet`).
- Rail breakpoint: 1000px of page width.
- Concept 3's default caption is "Tap any piece to read it."

## Recent changes

- `pg-dv-seed.jsx`: `DV_CARRY`, `DV_HEROES`, `DV_GEAR_DOES`, and a `sheet` on each play.
- `pg-dv3.jsx`: its bar no longer mounts when `window.DV3_NO_BAR` is set. v3 itself is unchanged.
- `delve-v4.html` takes v3's styles from `delve-v3.html` at load, so they aren't copied.
- `playgrounds.json`: v4 entry.

## Next

1. Review v3 (concept pick, diamond, natural words: see the v3 handoff).
2. Review v4; confirm what "hex" meant.
3. Nothing into `app/`; no CHANGELOG entry.
