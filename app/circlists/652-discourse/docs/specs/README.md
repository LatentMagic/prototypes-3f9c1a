# Specs

One folder per piece of work, from its first file. Everything task-scoped lives
in it: the prompt, the playground modules, the handoffs, the option studies.

Naming: the id comes from the monorepo — `lm-###-<topic>` for changes,
`circ-###-<topic>` for requirements, `biz-##-<topic>` for business-ops work. No
ticket yet, use `<kebab-topic>` and rename when one exists.

When the work finishes, move the whole folder to `docs/archive/`.

## Live

- `lm-652-discourse/` — discourse. The live rig is `pg-discourse-v10.html` at
  the project root (a playground entry must sit at root for `app/*`,
  `tokens.css` and `brand/` to resolve); its modules are here.

## Settled but not yet archived

`lm-570/`, `lm-626-champion-exit/`, `biz-80-metadata/`, `biz-84-app-ia/`,
`motion/`.
