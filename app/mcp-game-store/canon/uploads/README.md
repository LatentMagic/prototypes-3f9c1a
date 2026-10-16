# Discover candidates: two Claude Design prompts

One prompt per Discover direction, each producing a candidate build in the MCP Game Store prototype for Joe to judge there. Both are the same change shape and carry the same cross-cutting decisions (2026-10-15 log).

## Mode chosen: Delta, built as a candidate build

`biz-authoring:build-design-prompt` has no candidate mode. Delta fits: the canon prototype already exists in a live Claude Design project, and the brief states changes, what is preserved and acceptance criteria, leaning on the live session. Playground was rejected: it compares options for an open question and may be partial, while each direction here is a whole-app build of one chosen shape. The prototype's own `CLAUDE.md` defines a candidate build (whole app, kept apart in `docs/specs/<ticket>/candidate/` until accepted in words) and fires on the phrase "build this as a candidate build", so each prompt opens with it and names `skills/candidate-build/SKILL.md`.

## How to use

1. Open the live MCP Game Store Claude Design project.
2. Paste `discover-tidied-prompt.md` and attach the five images it names (`discover-6-1-c-tidy-1/2/3`, `landing-5c-band`, `landing-5c-n-note`). Wait for its handoff.
3. Then paste `discover-games-hub-prompt.md` and attach its three images (`discover-6-1-a-hub-top`, `-every-case-doors`, `-chapters-barrow`). Run them one after the other, not at once: both add an entry to `playgrounds.json`.
4. Open each from `playgrounds.html` under its ticket. Each carries its variations as rows in the kit's Config aid (the owner asked for variations inside the candidate, overriding the candidate-build skill's option-rail line), and its player states, two of them in the States register with addresses.

Both prompts follow the owner's 2026-10-15 ruling that the prototype only displays access: staging is display data (dailies free; first edition of Escape, Delve, Casebook free; Barrow chapter 1 free; the rest Pass), canon's game set is kept, no game is renamed or added.

## Left out on purpose

- `today-discover-band` is not attached: the skill bars screenshots of the builder's own build, and the builder can render canon's Discover itself.
- Each image is an example only; each prompt says what in it to ignore.

## Open, carried into the prompts as questions, not decisions

- Lock on hub tiles / the all-games wall: default off, per the ratified clean-list rule; a switch shows on.
- The hub's second door to earlier weekly and chapter editions sells something unplayable; shown, with a variation that removes it. Daily doors are canon's existing links.
- Free chips and the part-free mark were ruled for Home cards; carried to Discover as switches, not rulings.
- The Word pick label, the "Free to play" subline, and Casebook versus Delve as the second pick: each a named choice.
- Daily Groups hidden; the hub drops the picks and "Just added" rows.
- The lock belongs upstream in the design system before integration; both prompts build it in the overlay only and ask the handoff to say so.
