---
name: create-handoff
description: Write a handoff document so a fresh session can resume the work. Use when pausing or switching context, or when the user asks for a handoff. Outputs handoff-{YYYY-MM-DD}-{topic}.md into the task's spec folder (docs/specs/<ticket-topic>/), or docs/specs/_handoffs/ for a holistic, non-task session handoff.
metadata:
  author: LatentMagic
  version: "1.2.0"
---

# create-handoff

Compact session state into a handoff file so another session can resume. Thorough substance, lean prose.

## Phases

### Phase 0 — Ground

Err toward more context, not less. Capture the top-level objective plus the lower-level detail needed to resume. Prefer `path:line` references over code dumps; use a short inline snippet only for a specific error.

Capture:

- Date — the current date from the system context (this is a filesystem project, not a git checkout; there is no commit hash or branch to read).
- The ticket / task id if the work has one (e.g. a tracker id), taken from the spec folder name or the user.

Summarise the context. Proceed.

### Phase 1 — Synthesise

1. Read [handoff-template.md](assets/handoff-template.md) for the output shape.
2. Identify the latest unresolved user intent — that is the Current Focus.
3. Compose the frontmatter and section content for the template.

### Phase 2 — Write

Write the handoff to the task's spec folder as `docs/specs/<ticket-topic>/handoff-{YYYY-MM-DD}-{topic}.md` (kebab-case folder; `topic` is short kebab-case). If the handoff is holistic — spanning the session rather than one task — write it to `docs/specs/_handoffs/handoff-{YYYY-MM-DD}-{topic}.md` instead (a dated, append-only session record).

When the task folder does not exist yet, create it and add a short `README.md` indexing the handoff (and the original `PROMPT.md` if there is one).

Tell the user the file path.

## Resuming

To resume from a handoff: read the latest `handoff-*.md` in the task's spec folder (or the latest file in `docs/specs/_handoffs/` for a session handoff) and treat it as starting context — what was done, what remains, where things stand — not a spec to re-validate. Read the files it cites; don't re-read beyond them. Also skim `CLAUDE.md` (its product block names where the product's truth lives), `CHANGELOG.md` if the product has created one, and any doc the handoff names under `docs/`.

---

## CRITICAL: PRESERVE RESUME CONTEXT, DO NOT TRUNCATE

- DO NOT omit the objective, current focus, unresolved decisions, validation state, or next action
- DO NOT dump code when `path:line` references or short snippets are enough
- ONLY write the handoff file at the output path and return its path
