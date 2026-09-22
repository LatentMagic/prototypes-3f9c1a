---
name: show-me
description: >-
  Make information land for the reader — pick the form that carries it best rather than
  leaving it as prose. Use when explaining a structure, a process or pipeline, a comparison,
  a trade-off, a change (before/after), a hierarchy or ownership split, progress or
  proportion, a sequence of events, a decision with several options, code structure or
  control flow, or any answer where prose alone would force the reader to reconstruct
  something in their head. Applies whether or not the user asked for a visual: the trigger is
  information that is hard to take in as prose, not someone saying "draw me a diagram".
  Output is usually inline text drawings — arrow chains, trees, bars, rails, small grids —
  with Mermaid or a standalone HTML file as the fallback for anything larger.
metadata:
  source: https://github.com/humanlayer/skills
---

Help the user understand the current topic visually. **The job is comprehension, not decoration** — work out what the reader has to end up holding, not what the answer contains, and draw that. A clean drawing of a secondary point has failed, however well made. **What needs drawing** is sometimes the one thing the user is stuck on; more often it is whichever part of the answer prose carries worst. **Then take whatever lands it** — one view or several. No preamble, brief prose.

Two constraints govern every device below:

- **Keep fenced lines under ~100 characters.** Nothing wraps inside a fence, so width is a hard budget. 100 fits a laptop and most code lines; a phone scrolls a little, which costs less than crushing the content. The sentence beside the drawing is free at any length.
- **Draw with `──▶`, `◀──`, `│`, `├──`, `└──`, `█`, `░`, `↑`, `↓`.** These render. Bare `→` and `←` do not.

## For state and process

- Show proportion, progress, or relative size as a bar of block characters. **No track, not a bar** — every row draws its unfilled remainder to the same width, or the reader has lengths with nothing to read them against. Blank line between rows.

```text
diff examples   ████████░░░░  -48

mermaid fence   ██░░░░░░░░░░   -9

duplicate tree  ██░░░░░░░░░░   -9
```

- Show a pipeline or a run of stages as an arrow chain, marked where it matters:

```text
intake ──▶ refine ──▶ ticket ──▶ build
                      ↑ stalls here
```

- Show what happened and when as a dated rail:

```text
Apr 02  │ ticket raised
Apr 11  │ blocked on API ◀── here
Apr 18  │ target
```

- Show a trade-off across two axes as a small grid:

```text
           cheap       costly
big win    do now      plan it
small win  if spare    drop
```

- Show a change as two labelled blocks, **Before:** and **After:** — never two bare ones the reader has to diff by eye.

- Lift one finding out of the flow as a blockquote, when the wording itself is the point.

Weak on a phone, use sparingly:

- A table suits a handful of cases side by side, but it is the weakest device here. Around three columns and a few words per cell; past that it wraps into a block and labelled blocks read better.

- A box drawn from `┌─┐` cards one number or one verdict. Borders break on uneven content or a narrow screen — short, and rare.

## For code

- Show logic or an algorithm as pseudocode — plain indented lines, no syntax.

- Show runtime control flow as a call tree:

```text
submitForm
  createSession
    persistPrompt
    launchAgent
  navigateToSession
```

- Show UI structure as a component tree, carrying the path and the state that matter:

```tsx
<SessionPage> (src/routes/session.tsx)
  useSessionEvents()
  <SessionToolbar>
```

- Show file responsibility or a broad refactor as a shallow file tree. The same shape carries any hierarchy — who owns what, how a scope breaks down, which decision sits under which.

- Show the whole block when most of it is new, when cutting context would hide ownership or order, or when the user needs something copyable.

- Use `diff` when the shape already exists and the point is what changes — a component tree, a file tree, a call tree, a control flow, a rule being reworded. Match the diff to the topic's own shape. Watch the width here: diffed content arrives at whatever length it already was, and the `+`/`-` column takes two more. Shorten an overrunning line to fit rather than pasting it long.

## As a fallback

Mermaid does not render in the terminal — the user gets the source. Reach for it only when the visual lands somewhere that renders it, and the thing drawn is big enough to be worth building and agreeing on.

- Show component interaction, control flow, or data flow with Mermaid, on a surface that renders it.

- Same threshold for a file. For a visual UI, layout, state comparison, or concept too dense for Mermaid, write one focused HTML file — a diagram, an infographic, or a short slide deck. Real labels and data, readable on a phone. Then open it with whatever the platform provides — `open` on macOS, `xdg-open` on Linux — or hand the reader the path.

## Whichever you use

- Point at what the visual is for. **Bold** the node that carries the finding, or mark it inline — `◀── this`, `# owns state` — and leave the rest plain. Contrast is the mechanism, so mark sparingly; marking everything marks nothing.

```text
src/
├── commands/    # parses actions
├── sessions/    # owns state ◀── leak
└── transport/   # sends requests
```

- Copy the example, not the description of it. Every example here draws every rule its device has; a shape improvised past the example is the one that comes out wrong.

- Place each visual next to the short text it supports. Keep only what answers the user's current question.

- Prose often wins. A weak diagram costs more than the sentence it replaced.
