# Prototype kit

A starting pack for Claude Design prototypes. Its harness (rules, aids, skills) is product-neutral; its app content is the Golden Sample App. `project/` is exactly what sits at the root of a new Claude Design project: `CLAUDE.md`, `ARCHITECTURE.md`, `GOTCHA.md`, `index.html`, `playgrounds.html`, `playgrounds.json`, `tokens.css`, `app/`, `docs/`.

Nothing in `project/` names a real product: the app is the Golden Sample App, a worked baseline, and `CLAUDE.md`'s product block stays placeholders (this README names Circlists, where the kit was cut from). This repo is public, so nothing private goes in.

## History

Cut from the Circlists prototype (`app/circlists/canon/`, commit `dddbb6c`) on 2026-10-06. Everything since is in git: `git log -p -- kit/`. Rely on it rather than keeping a record here. The Versions list below names what each kit update carried.

## Viewing it

Live, with nothing to run: the app at https://latentmagic.github.io/prototypes-3f9c1a/kit/project/ and the launcher at https://latentmagic.github.io/prototypes-3f9c1a/kit/project/playgrounds.html, whose Example ticket holds one playground and one candidate build, both on the Golden Sample App's queue. In the console it is the Golden Sample App at https://latentmagic.github.io/prototypes-3f9c1a/#gsa/canon. Locally, run `node server.js` from the repo root and open the same paths under http://localhost:4321.

## Starting a new prototype from it

1. Drag the `kit/project/` folder into the new Claude Design project yourself. The Circlists project's files show dropped files landing in an `uploads/` folder, so check where they landed: if they sit under `uploads/` instead of the project root, the first instruction to the agent is to move them to the root with paths preserved. Connect GitHub to the project: the agent reads the product's specs from there. Then tell the agent to read `SETUP.md` and do what it says: it moves the files to the root if they landed under `uploads/`, clears the upload, opens the Golden Sample App's Home as it is, checks the config button, states and QA work, reports what it found (including whether `CLAUDE.md` was read without being told), and deletes itself. It builds no prototype.
2. Fill the product block at the top of `CLAUDE.md` (between `<!-- product:start -->` and `<!-- product:end -->`): the product's name, the GitHub paths its truth lives at, platform, where it is published, product skills, extra root files. `CLAUDE.md` differs between projects only inside that block; everything else in it is shared and never edited per product. There is no `PRODUCT.md`: GitHub describes the product, and nothing is kept locally to maintain.
3. Replace `tokens.css` with the product's tokens, keeping the property names.
4. Publish it: a prototype reaches the hosted console through the `APPS` table in this repo's `index.html` (entry file defaults to `latentpulse.html`; set `html` to `index.html`). State links only work at a published address.
5. Replace the Golden Sample App's screens, seed and states. `project/app/README.md` says which file to replace, which to keep, and how to add a state, a QA entry or a Config row.

Not yet verified. Each takes about a minute:

- Whether `CLAUDE.md` at the project root is read automatically. Check: after the files are in, ask the agent in a fresh chat what the first rule in `CLAUDE.md` is.
- Whether `AskUserQuestion` is gone from the picture and the built-in Frontend design skill exists: the rules assume the second.

## Carrying a change between prototypes

The kit is the source for every rule, aid and skill the prototypes share.

1. Make the change in `kit/project/`, check it in a browser where it renders, and push.
2. Carry it with one Kit carry brief, composed in the business-ops workspace (`biz-authoring:build-design-prompt`, Kit carry mode) and pasted unchanged into each project's Claude Design session. The brief carries only the new version, each rule word for word, standing alone, skipped if the file already says it and placed by meaning. Never drag a kit file over a project's copy or tell a project to overwrite one: the copies differ, and something is lost.
3. Raise the kit version by one in `project/CLAUDE.md` (the line beside "The kit"), add it to the list below, and have the brief set the same line in each project. A project's line then says which update it has.

Versions:

- **1** (2026-10-16): chat replies (tour not a log, never ask cold, list then walk), several candidates per ticket, comments never cite `docs/` paths and archive only when the owner asks.
- **2** (2026-10-16): a prototype has no real persistence — a reload restarting at Home, signed out, is never a finding; reload survival belongs to the specs. From the After Pixels (then MCP Game Store) project (MCPG-018).
- **3** (2026-10-17): a reload reopens the page named in the address (`#/<page>`) and nothing more, and React `createRoot` warnings after a reload that follows an address change are expected and need no fix. From the Golden Sample App.
- **4** (2026-10-18): every demo fact is held once, in the seed, and every surface reads it; no screen, state or rig types its own copy, and dates are relative to the seed's day zero. From the After Pixels (then MCP Game Store) project.
- **5** (2026-10-18): briefs come from another agent with the user passing messages by hand, so every reply ends in two parts, a block for the other agent and a last part for the user (at most one open question, or "Nothing for you"); an answer from the other agent ratifies only if it says where the decision is written down. It also carried the "Ratification - the standing rule" section into the shared rules, which had been in the first cut but in no version, so a project may lack it.
- **6** (2026-10-20): a handoff lists every earlier handoff in its folder under Earlier handoffs, each with what it holds, and a resuming session reads every earlier handoff in the folder as well as the latest; a Claude Design project has no git history, so the latest handoff is the only way to them. From the business-ops workspace.
- **7** (2026-10-27): the `in-your-own-words` skill (declared only), and a Brain dumps rule: when the user brain dumps, take it in without acting, then synthesize with them; a brain dump ratifies nothing. From the business-ops workspace.
- **8** (2026-10-27): comments carry intent, mapping and `// KEEP:` flags for the special (read by the agent that integrates the prototype), and no narration. From the business-ops workspace.
- **9** (2026-10-28): the Config modal redesigned: a section rail (Global, then one section per feature) beside the chosen section's controls, a drill-in list on a phone, and nothing that scrolls sideways. Products declare rows through `ConfigGroup` (`scope="global"` for whole-prototype settings), `ConfigRow`, `ConfigAction` and `ConfigNote` instead of writing `kit-config-row` markup; `ConfigSeg` is gone. From the business-ops workspace.

A change that starts in a project comes back the other way: the project's handoff names it as a kit change, it is made here, and its Versions line names the project it came from.

## Refreshing Impeccable

See `project/skills/impeccable/UPSTREAM.md` for the source, the pin, the licences and the omissions. LatentMagic's own text for the skill is `project/skills/impeccable-local/SKILL.md`, an adapter the agent reads first: it says what replaces upstream's Setup step and which commands are unavailable.
