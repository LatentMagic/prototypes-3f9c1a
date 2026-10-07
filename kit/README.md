# Prototype kit

A product-neutral starting pack for Claude Design prototypes. `project/` is exactly what sits at the root of a new Claude Design project: `CLAUDE.md`, `ARCHITECTURE.md`, `GOTCHA.md`, `index.html`, `tokens.css`, `app/`, `docs/`, `skills/`.

Nothing in `project/` names a product (this README names Circlists, where the kit was cut from). This repo is public, so nothing private goes in.

## Last cut

- Date: 2026-10-06.
- Cut from: the Circlists prototype at `app/circlists/canon/`, repo commit `dddbb6c`. Canon's working tree was dirty at the cut (`app/qa.jsx`, `app/states.jsx`, `app/spaces.jsx`); those changes landed later as `67eeb67`, so whether the cut took the commit or the dirty tree is not recorded. The difference is about 35 lines of Circlists content.
- Impeccable: 4.5.0 (the version is the pin; no commit id was available).

## Starting a new prototype from it

1. Drag the `kit/project/` folder into the new Claude Design project yourself. The Circlists project's files show dropped files landing in an `uploads/` folder, so check where they landed: if they sit under `uploads/` instead of the project root, the first instruction to the agent is to move them to the root with paths preserved. Connect GitHub to the project: the agent reads the product's specs from there. Then tell the agent to read `SETUP.md` and do what it says: it moves the files to the root if they landed under `uploads/`, clears the upload, puts "Hello world" on the placeholder screen, checks the config button, states and QA work, reports what it found (including whether `CLAUDE.md` was read without being told), and deletes itself. It builds no prototype.
2. Fill the product block at the top of `CLAUDE.md` (between `<!-- product:start -->` and `<!-- product:end -->`): the product's name, the GitHub paths its truth lives at, platform, where it is published, product skills, extra root files. `CLAUDE.md` differs between projects only inside that block; everything else in it is shared and never edited per product. There is no `PRODUCT.md`: GitHub describes the product, and nothing is kept locally to maintain.
3. Replace `tokens.css` with the product's tokens, keeping the property names.
4. Publish it: a prototype reaches the hosted console through the `APPS` table in this repo's `index.html` (entry file defaults to `latentpulse.html`; set `html` to `index.html`). State links only work at a published address.
5. Replace the placeholder screen and the states. `project/app/README.md` says which file to replace, which to keep, and how to add a state, a QA entry or a Config row.

Not yet verified. Each takes about a minute:

- Whether `CLAUDE.md` at the project root is read automatically. Check: after the files are in, ask the agent in a fresh chat what the first rule in `CLAUDE.md` is.
- Whether `AskUserQuestion` is gone from the picture and the built-in Frontend design skill exists: the rules assume the second.

## Before using it again

It will be stale. First, run `git log` and `git diff dddbb6c..HEAD` on `app/circlists/canon/`. Look at what changed in the shared files and carry over what improved:

- `CLAUDE.md`, `ARCHITECTURE.md`, `GOTCHA.md`
- `app/` (the machinery files, not the Circlists screens)
- `skills/`: `bro`, `build-playground`, `create-handoff`, `edit-before-it-leaves`, `frontend-ui-engineering`, `future-fragility`, `idea-refine`, `must-read`, `noise`, `show-me`, `unslop`
- `skills/impeccable-local/` and `skills/impeccable/` (see Refreshing Impeccable)

Then update "Last cut" above.

## Carrying a change between prototypes

Make the change to the shared machinery or rules here. Then, in each project, drag the changed file in again, or ask the agent to re-read it from this repo and write it over the project's copy, keeping that project's own product block. Projects send improvements back through the handoff, which is where `CLAUDE.md`, `GOTCHA.md` and `skills/build-playground/` changes proposed in a project are recorded.

The Circlists project's own `CLAUDE.md` has not been split into shared and product parts, so today it does not match the kit's. Until it is, changes flow by hand, both ways.

## What was taken, what was left

### Rules (`CLAUDE.md`)

Taken from canon in canon's order and wording: Ratification (all five bullets), Replying in chat (without the emoji parenthetical's product reference), Project map, Reference docs, the custom-skills mechanism and its groupings, Design range, Before building, Designing, Files, playground placement, state-is-a-scenario, Wrapping up.

Changed only where canon named Circlists: file names, ids, and "read `ui-design.md`" became "read the product block at the top of `CLAUDE.md`, and the design law it names".

Added: the product block; the config, states and QA pointer in the Code section, plus its "keep them current" rule (not in canon); "a product's own skills list their triggers in the product block"; "and whatever the product block lists as extra root files"; the `<important>` block recording a decision no spec holds in the task's handoff; "before writing any UI string" in the copy rule; the playground module path `docs/specs/<ticket>/playground/pg-foo.jsx`; "cite by path and id" kept in Upstream first; build-playground and `GOTCHA.md` changes noted in the handoff so they come back to the kit.

Left in Circlists as its law: Name, accent green and danger red, calm is the floor, communal library, the three-postures block, copy-voice contents, the stable-specs row, `MOBILE.md`, `brand/` rows, `github.md`, the `uploads/` exception, the mark's motion.

There is no `PRODUCT.md`, by the owner's ruling: "GitHub should describe the product." The kit's only product-specific text is the fenced block at the top of `CLAUDE.md`: the name and the GitHub paths the agent reads live. A rule a spec already holds is pointed at, never restated.

### Architecture and gotchas

`ARCHITECTURE.md` took the deletable-aids table (rows are the kit's files), Addressable states (neutral ids, `kitResolveState`, `KIT_STATES`), the note that the resolver looks inert, and Conventions. Left: the three postures, the swap, web-only payments, the `platform` field and "Mobile app: where it differs", the paragraph naming a monorepo process doc, and a stale `canon/`, `next/` sentence.

`GOTCHA.md` took canon's 1, 2, 5 to 13, reworded to drop episode names, files and first-person confessions, and added the SVG-stripping platform fact. Canon's 3 and 4 are Circlists-only and left. The kit's entries are renumbered 1 to 12 (canon's 13 is the kit's 11); the intro's code/judgement split was recounted, and `build-playground/references/fidelity-and-wiring.md` cites "GOTCHA #3".

`docs/` ships `specs/README.md`, `specs/_handoffs/README.md` and `archive/README.md`, the last two new, so the paths the rules name exist. Not shipped: `docs/ABOUT.md` (its skeleton fed an earlier `PRODUCT.md`), `docs/specs/CLAUDE.md` (it concerned candidate builds).

### App machinery (`app/`, `index.html`, `tokens.css`)

Prefix `kit` / `KIT`. Every file from `states.jsx` to `config-extra.example.jsx` is a deletable aid. The Circlists screens and states stayed behind; a placeholder screen and a neutral state register replace them.

Differences from canon:

- State ids are validated: lowercase letters, digits, single hyphens, unique, not `index` or `states`. Others are refused at load with a console error.
- The dialogs' scroll lock is counted (`kitLockScroll`), so stacked dialogs release it only when the last closes.
- A `kit-config-btn-secondary` button in the Config modal runs its handler, then closes the modal.
- Tweaks was left out (`tweaks-panel.jsx`, `app-tweaks.jsx`): the owner does not use the panel, and Claude Design supplies its own when a project wants one. The Viewport setting is plain state in `main.jsx`, the config button always shows, and `tokens.css` alone decides the accent.
- The playground `<base href>` is four `../`, not canon's three (below).

Known limits are listed in `project/app/README.md`.

### Skills

Byte-identical to canon: `bro`, `must-read`, `noise` (copied from `biz-standards:noise`, v1.0.2), `unslop` (copied from this workspace's `.agents/skills/unslop`), `frontend-ui-engineering`'s reference. Written for the kit: `edit-before-it-leaves`, one skill consolidating intent-mode's `principle-cut-before-it-leaves` with `biz-editorial` structure, prose, debloat and proofreading, with the workspace-only references (subagent dispatch, other principles) removed. Edited from canon: `future-fragility` (the `$ARGUMENTS` token and `argument-hint` removed: nothing substitutes them here); `idea-refine` (`AskUserQuestion` replaced by asking in chat, the knowledge-store line pointed at the product block, `/ideate` in examples replaced by `$idea-refine`, `author: LatentMagic` replaced by a `source` line); `frontend-ui-engineering` (`source` line). `idea-refine` and `frontend-ui-engineering` come from `addyosmani/agent-skills` (MIT, Copyright (c) 2025 Addy Osmani; both paths exist upstream); the licence text sits beside each as `LICENSE-addyosmani-agent-skills-MIT`. `show-me` adds a `LICENSE` and one sentence about Mermaid. `show-me` is identical, plus a `LICENSE` (MIT, HumanLayer, fetched from its repo; canon had no licence text).

`create-handoff`: the "adapted for Circlists" author and version and the `BIZ-80` examples removed; the filename is now `handoff-{YYYY-MM-DD}-{topic}.md` (no underscore, as `CLAUDE.md` § Files requires), in the task's folder or `docs/specs/_handoffs/`. `build-playground`: Circlists specifics replaced with product-neutral nouns; rule 4 (the config rail replacing the app's rail) keeps canon's shape with a "Product slot" bullet for a separate native posture. `i-have-adhd` removed from the groupings and the `$name` examples, by decision. `candidate-build` not shipped, by decision.

### Impeccable

Version 4.5.0. `SKILL.md` and `reference/` are byte-identical to upstream, under upstream's names. Omitted because they need execution: `scripts/`; and in `reference/` `init`, `document`, `doctor`, `hooks`, `live`, `live-setup`, `generate`, `routing`, `component-review`, `region-map`, `visualize`, and `degraded/` (four files). 30 reference files shipped. Added: `LICENSE`, `NOTICE.md`, `LICENSE-ehmo-platform-design-skills-MIT` (from `ehmo/platform-design-skills`, whose copyright line reads only "2026"), `UPSTREAM.md`. Links in upstream's text to omitted files dangle by design.

### Rules dropped because their machinery did not ship

- Candidate builds: the skill, its trigger, "a candidate build lives in its ticket folder", the rail-node and `tools/new-candidate.sh` mention.
- Launcher and manifest: `playgrounds.html`, `playgrounds.json`, "regenerate it whenever a rig is added", "hiding, not deleting", "add the rig to the launcher".
- "No config surface": it was about the launcher page, and as worded it collides with the shipped Config aid.
- `github.md` and the rules sending the agent to it; its job moved to the product block's sources.
- Canon's motion-SVG rule, kept as a platform fact in `GOTCHA.md` 12.

### Calls made without a decision

1. Playground `<base href>`: canon says three `../` but the folder it names is four deep, and canon's own gotcha records the failure. The kit says four, and qualifies the "false positive" sentence as `GOTCHA.md` 11 does. This changes a rule's content, not only its names.
2. `CHANGELOG.md` does not exist in the kit. The rules name it as created by the product when its first entry is earned.
3. Third-party origin of `future-fragility` and `must-read` is unverified; shipped without added attribution. (`idea-refine` and `frontend-ui-engineering` are verified as `addyosmani/agent-skills`, MIT, credited.)
4. Rules kept as canon words them, though they read oddly in a fresh project:
   - `shape` / `new-work` "only inside a playground, never straight into `app/`" reads as forbidding the first build.
   - The standing pair assumes the platform's built-in Frontend design skill exists in every project; unverified.
   - "Hierarchy via size and weight, never colour. 4px grid. Readable from 320px" is a house rule with no source found.
   - The `uploads/` sweep and "never leave a standalone bundle" assume platform behaviour not confirmed for a new project.
   - The emoji-led last line of a chat reply is a LatentMagic working-style choice.

## Refreshing Impeccable

See `project/skills/impeccable/UPSTREAM.md` for the source, the pin, the licences and the omissions. LatentMagic's own text for the skill is `project/skills/impeccable-local/SKILL.md`, an adapter the agent reads first: it says what replaces upstream's Setup step and which commands are unavailable.
