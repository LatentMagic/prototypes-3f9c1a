---
date: '{current date, YYYY-MM-DD}'
ticket: '{ticket / task id if any — omit if none}'
topic: '{short task name}'
status: '{complete | in-progress | blocked}'
type: '{handoff type, e.g. implementation, debugging, exploration}'
---

# Handoff: {topic} — {short description}

## Current Focus

{Latest unresolved user intent. What the next session should continue first. Name what is background only.}

## Task(s)

{What was done, in progress, planned. Reference the artifact(s) worked from.}

## Critical References

{OPTIONAL. 2–3 docs, decisions, or files the next session must follow — e.g. CLAUDE.md rules, a docs/ file, tokens.css. Omit this section if none.}

## Recent changes

{Edits made — `path/to/file.ext:line` references over code dumps.}

## Learnings

{Patterns, root causes, gotchas the next session should know. File paths welcome. Note anything worth adding to GOTCHA.md (only with user approval, per CLAUDE.md).}

## Artifacts

{Files produced or updated.}

## Action Items & Next Steps

{Concrete next moves, ordered by priority rather than chronology.}

## Other Notes

{OPTIONAL. Operator context, caveats, preferences, active constraints, do-not-do guidance, discarded paths. Omit this section if none.}
