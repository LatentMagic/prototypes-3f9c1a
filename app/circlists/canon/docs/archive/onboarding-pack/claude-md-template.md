# The project's standing instructions (`CLAUDE.md`)

One file at the project root, read on every turn. It is not documentation — it is
the set of decisions you refuse to re-litigate. Keep it under ~100 lines: past
that it stops being read carefully.

It does three jobs, in this order:

1. **Index the durable docs**, each with a one-line "read when relevant" trigger.
   The agent cannot read everything every turn; the index is what makes the rest
   of the doc set reachable at the right moment.
2. **State the non-negotiables** — naming, palette rules, voice, the one or two
   architectural invariants that must never be violated.
3. **Say how to reply in chat**, which is separate from how to write product
   copy and is otherwise constantly confused with it.

## Template

```md
# Project: <Name>

## Reference docs — read when relevant
- `ARCHITECTURE.md` — app-wide structure: <the one invariant it protects>. Read before touching routing, shells, or module load order.
- `CHANGELOG.md` — major milestones over time (not granular). Read to catch up on where the product has been.
  - **Editing rule (strict):** one entry per *significant landed step* — a feature introduced, a rebrand, a fundamental change to how the app works or is structured — even when it originates as a bug fix. What matters is whether the *shape* of the product changed, not the label on the task. NOT for iterative work: refinements, cosmetic fixes, spacing/timing tweaks, renames, seed-data changes. Do NOT keep amending an entry as you iterate. A terse title + 2–4 shape-level bullets is the ceiling. When in doubt, add nothing and ask.
- `docs/ABOUT.md` — what the product is, who it's for, emotional intent, and the deliberate NOTs. Durable product essence.
- `brand/<name>-brand.md` — palette, mark, wordmark, type. Source of truth for all brand assets; assets in `brand/assets/`.
- `GOTCHA.md` — hard-won, non-obvious traps. Read before touching animated overlays or "verifying" a mount transition.
  - **Editing rule:** only add an entry when the user approves it. Terse: symptom → cause → fix → rule.
- `PLAYGROUND.md` — conventions for building playgrounds. When you build one, read it and populate it with what actually helped.
- `skills/frontend-ui-engineering/SKILL.md` — code-quality bar for the `app/` UI. Read before non-trivial UI work or refactors.

These distil the durable essence. For exact tokens and visual style, `tokens.css`
and the brand pack are binding — when in doubt on a specific value, they win.

## Key reminders
- **File naming: kebab-case, always.** Lowercase, no spaces, no title case, no underscores — including downloadable deliverables and bundled output. Spaces break shell use, URLs, and tooling downstream.
- **Name** — the product is **<Name>**. The <core unit> is a **<term>**.
- **Accent `<hex>`** = primary actions, active states, focus rings only. Never status, never decoration.
- **Danger `<hex>`** = destructive treatment only. Never substitute for the accent.
- **Hierarchy via size and weight, never colour.** 4px grid. Readable from 320px.
- **Voice:** <3–5 adjectives>. Evergreen copy (no first-visit/temporal framing). Calm and non-blaming at failures. No emoji, ever.
- **<The one architectural invariant>** — e.g. "one shared core, N presentation postures: a shared-surface change lands in all of them with no per-posture edit; never fork a surface."

## Replying in chat (not product copy)
- **CRITICAL: the reply's last line carries the one thing the user must act on** — the open question, the decision needed, or a one-line summary of what landed — led by an emoji (🎯 ❓ ✅ ⚠️ 💡). The user scans bottom-up; never bury the ask above it. (Chat replies only — the product's "no emoji" rule still holds for all UI copy.)
```

## Why each piece is there

- **Naming rule first.** It is the most frequently violated and the cheapest to
  state. Filenames leak into URLs, downloads, and the user's shell.
- **Colour rules as *role* statements, not palettes.** "Accent = primary actions
  only, never decoration" survives a rebrand; a hex list does not.
- **"Hierarchy via size and weight, never colour."** One sentence that prevents
  the single most common drift in agent-built UI.
- **An explicit editing rule on any doc that grows.** Without it, changelogs turn
  into commit logs and gotcha files into diaries. Both then go unread.
- **The chat rule.** Agents bury the question mid-paragraph. Forcing it to the
  last line changes the working rhythm more than any other line here.
- **"When in doubt, add nothing and ask."** Cheap to write, saves a lot of
  cleanup.
