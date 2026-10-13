# docs/specs — the rules for task-scoped work

Read this before creating, moving or clearing out anything under `docs/specs/`.
Placement and the launcher are in the root `CLAUDE.md`; this file covers what
happens to a ticket folder over its life.

## A candidate build after it is merged, or thrown away

A candidate build stops being a candidate the moment the owner accepts or
refuses it. Either way its folder is archived and its launcher entry switched
off; nothing is deleted. An archived candidate is read, not run.

`skills/candidate-build/SKILL.md` § "Merging a whole candidate" holds the steps,
in order, once; § "Throwing one away" holds the refusal. Follow them there. They
are not restated here.

## Everything else

- Anything task-scoped lives in `docs/specs/<ticket>/` from its first file.
- Archiving is a move of the whole folder, never a rewrite. Expect archived
  entries' `<base href>` depth to need one adjustment if the nesting changes.
- Never keep a standalone bundle here. Generate, hand over, delete in the same
  session.
