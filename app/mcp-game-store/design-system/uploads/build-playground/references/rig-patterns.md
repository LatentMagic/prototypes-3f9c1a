# Rig patterns

## Config pattern: Auto + override

**Only where the rig genuinely has levers.** The default remains a flat list of
complete versions with no controls at all; reach for this section when a
comparison really does turn on two or three switches, not before.

Each option carries its **intended** answer to every lever (`def: {...}`). The
controls default to **Auto** (= use the option's own choice) and add explicit
overrides (On/Off, Show/Hide). Options stay genuinely distinct, and any single
lever can still be A/B'd across all of them. `mergeCfg(option, overrides)` is
the one place they combine, and a small "overridden" flag tells you the app is
no longer showing the selected option's own answer.

- **Publish every option's lever answers as a readout**, not just the
  overridable ones. Levers you chose not to expose still differ per option;
  a small table keeps them visible instead of buried in the data file.
- **Re-key the APP on config change** (`key={optId + JSON.stringify(ov)}`) so
  chrome swaps land cleanly and overlays don't survive an option change — and
  key the app **content only**. The key must never wrap the rig's own chrome:
  a key around the whole tree remounts the rail with it, dropping its scroll
  position, so every pick throws the reviewer back to the top of the list.

## Traceability

Where the question is about a derivation — extracted vs fallback vs default —
put **one** function in charge of computing display fields, have it return a
`trace` of which path each field took, and expose that trace as a strip rendered
*outside* each card (never overlaid, so it cannot corrupt the design read), with
fallbacks flagged in amber. A forced-outcome switch (As seeded / No images /
Total fail) that walks the whole feed down the cascade in one click is the
fastest way to watch a system degrade. This is one playground's answer to one
kind of question — reach for it when the question is a cascade, and ignore it
otherwise.

## When the question is a sequence

Some questions ("is this loop complete?") cannot be answered by a static render
— the beats have to be reachable. Give the playground a **driver**: one entry per
beat (attach → receive → respond → lives), each a button that puts the app in
that state. Placement is free (a rail pane, the bottom strip); on a narrow
viewport, dismiss the chrome as the driver fires so the app is actually visible.
Skip the driver entirely when the question is about how one surface looks.
