# Specs

One folder per piece of work, from its first file. Everything task-scoped lives
in it: the prompt, the playground modules, the handoffs, the option studies.

Naming: the id comes from the monorepo — `lm-###-<topic>` for changes,
`circ-###-<topic>` for requirements, `biz-##-<topic>` for business-ops work. No
ticket yet, use `<kebab-topic>` and rename when one exists.

When the work finishes, move the whole folder to `docs/archive/`.

Nothing playable sits at the project root any more. A ticket's candidate build is
`docs/specs/<ticket>/circlists-<ticket>.html`; its rigs live in the same folder (new ones
in `<ticket>/playground/`). Both load from there via `<base href>` — see `CLAUDE.md`
§ Playgrounds.

## Finding a rig

`playgrounds.html` at the project root is the launcher: pick a ticket, then open its
candidate build or one of its rigs. It renders `playgrounds.json`, which is derived from
this tree — regenerate the manifest whenever a folder or entry moves.
