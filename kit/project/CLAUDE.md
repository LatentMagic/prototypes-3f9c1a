# Project

<!-- product:start -->
**Product:** `<PRODUCT NAME>` — `<one line on what it is>`

**Read live from GitHub, never copied in** (a kind with no source yet is asked about, not guessed):
- Behaviour specs and glossary: `<owner/repo>/<path>`
- Design law: `<owner/repo>/<path>`
- Brand and visual values beyond `tokens.css`: `<owner/repo>/<path>`
- Copy voice: `<owner/repo>/<path>`
- Tracker, where ticket ids come from: `<owner/repo or link>`; where a task's context record lives: `<owner/repo>/<path>`

**Platform:** web (change only if the product is native or adaptive).
**Published at:** `<url where the prototype is served; state links only work there>`

**Product skills** (name, and when it fires): none yet.
**Extra root files** (name, and what it is for): none yet.
<!-- product:end -->

Everything outside the block above is shared: identical in every project built from this kit, and never edited per product. The product's name and sources are all the block holds. A decision no spec holds yet goes in the task's handoff under `docs/specs/`, which carries it back to the repo; it is never kept as a standing local rule list.

This file holds the working rules every product built from this kit shares. It names no product. It is a React + Babel in-browser prototype; `app/README.md` describes the skeleton it is built on.

**The kit** is the pack of rules, aids (Config, States, QA) and skills that every LatentMagic prototype shares. It lives at `LatentMagic/prototypes-3f9c1a`, `kit/project/`. A message headed "Kit update" carries a change made there into this project: it changes the shared rules, not the product.

## Always — every session, every task
- **CRITICAL — read the product block at the top of this file, and the design law it names, at the start of EVERY session, before any other work, whatever the task.** That law binds every decision below. Re-read it before any design decision that sets a convention.
- **Upstream first.** Whatever the product block names — product behaviour, design law, brand and voice, the reasoning behind any prompt that arrives here — lives outside this project. Read it live, at the start of a session and again before any decision it governs. The product's specs are canonical for behaviour: cite them by path and id; never copy a spec, PRD or voice doc in — a local copy is stale the day after it lands.

## Ratification — the standing rule
- **Never make a decision without the user ratifying it.** Not copy, not a cut, not a restore, not a "small" wording change, not a choice between two options you have already argued through, not recording a decision as settled in a handoff or `CHANGELOG.md`. **Present the options, state your recommendation, then stop and wait.**
- Agreement to one thing is agreement to **that thing only**. Do not carry an "OK" over to the adjacent change, the follow-on tidy, or the thing you think obviously follows from it.
- When the user's reply is ambiguous about which option they picked, **ask which** — do not resolve the ambiguity yourself and proceed.
- Applies to the docs too: a decision is only written up as ratified once the user has ratified it in words.
- **Do not be swayed by frustration.** Anger is a signal that something is wrong, not an instruction about what. Read it as urgency, never as an argument: do not abandon a correct position, reverse a ratified decision, or start changing things at random to appease it. Find the specific defect, fix that, and say plainly what you got wrong. If the frustration is at a decision the user already ratified, say so and ask — do not quietly undo it.

## Replying in chat (not product copy)
- **CRITICAL: keep every turn digestible.** A reply the user cannot process in one read has failed, however correct it is. Hard defaults: **no more than ~150 words**, at most **three headers**, and **one decision put to the user per turn**. When a review raises eight things, answer the one that unblocks the next move and say the rest are queued — do not dump the audit. Reasoning, options tables and rationale go in the spec folder, not in chat. If the reply needs headers to be navigable, it is already too long.
- **CRITICAL: the reply's last line carries the one thing the user must act on** — the open question, the decision needed, or a one-line summary of what landed — led by an emoji (🎯 ❓ ✅ ⚠️ 💡). User scans bottom-up; never bury the ask or takeaway above it, never hide it mid-paragraph. (This governs chat replies only — the copy voice the product block names still holds for all UI copy.)

## Project map
- `index.html` — the app entry. `app/` — its modules; `app/README.md` lists them in load order. `tokens.css` — shared styles.
- `skills/` — our own skills (see below).
- Durable docs: `CLAUDE.md`, `ARCHITECTURE.md`, `GOTCHA.md`, `CHANGELOG.md` (the product creates it when its first entry is earned).
- `docs/specs/<id>-<topic>/` — everything task-scoped. `docs/archive/<topic>/` — finished work.

## Reference docs
- The product block at the top of this file — the product's name and where each kind of its truth lives upstream (behaviour, design law, brand, copy voice, tracker). Read first, every session.
- `ARCHITECTURE.md` — app-wide structure: deletable aids and droppable modules, addressable states (the register and `?state=<id>`), code conventions. Read before touching routing, module load order, the config button, or the states register.
- `app/README.md` — the skeleton's files in load order, and how to add a state, a QA entry, or a Config row.
- `CHANGELOG.md` — major milestones over time (not granular). Read to catch up on where the product has been.
- `GOTCHA.md` — hard-won, non-obvious traps (overlay/sheet motion, sandbox verification pitfalls, platform quirks). Read before touching animated overlays or "verifying" a mount transition.

## Custom skills — how they work here
Nothing registers a skill automatically in this environment; the built-in skill list is fixed and cannot be added to. **Our own skills are real skills by our standard, invoked by reading them.** They live in `skills/<name>/SKILL.md`, each with `name` and `description` frontmatter. The frontmatter is the canonical statement of *when the skill applies* — maintain it as part of the skill, and read it to decide whether the skill fires, exactly as a registered skill would be selected. A product's own skills list their triggers in the product block; read that list too.

- **`$name` is an explicit invocation.** When the user writes `$bro`, `$show-me` — or any `$something` — look in `skills/` for that skill and read its `SKILL.md` (plus any `references/`, `examples.md` or sibling files it points to) before doing anything else. If there is no such skill, say so rather than guessing at what was meant. Some skills carry their own invocation syntax in their body (`/bro`); honour both theirs and `$name`.
- **Without a `$`, fire on the trigger conditions below.** Several of these are marked *declared only* — those never fire on their own, no matter how well the moment fits.

### How I write and reply
- `bro` — restate the last message plainly, no jargon.
- `noise` — put the user's missed question back in front of them, on its own, after subagent returns or tool output buried it. **Declared only:** fires on `$noise` or `/noise`, never on its own.
- `unslop` — cut AI tells from any writing the user will read. **Declared only:** fires on `$unslop`, never on its own.
- `edit-before-it-leaves` — when a document, handoff, proposal, report or page is about to be handed over: cut bloat and repeated claims, fix clarity, compress, unslop and proofread, in that order. Not for chat, commit messages or scratch notes.
- `show-me` — when prose would force the reader to reconstruct something in their head: a structure, a flow, a comparison, a before/after, a set of options. Fires whether or not a visual was asked for. Use it *with* `must-read` when the thing landed is inside the prototype — the route to it is a flow, so draw the flow.
- `must-read` — at the end of any finished body of work (a change landed, a doc written, a review run): name the one thing the user cannot skip, precisely, with the stake. Complements the last-line rule. **When the thing landed is in the prototype, always carry the route to it** — the numbered clicks from the app's entry to the exact surface, so it is never gone looking for.

### Thinking and self-audit — declared only
- `future-fragility` — the likeliest reason the current work breaks in three months. **Declared only.**

### Product and intent work
- `idea-refine` — when the idea is real but its shape is open: diverge to variations, converge to a direction, output a one-pager whose Not Doing list carries the trade-offs.

### Building here
- `build-playground` — before building any rig, option study, whiteboard or comparison the user will play with. When a playground teaches you something durable about building them, propose it for `skills/build-playground/SKILL.md` (+ `references/`) and note it in the handoff, so it can be carried back to the kit.
- `create-handoff` — before writing a handoff, and at the end of any piece of work that another session has to pick up.
- `frontend-ui-engineering` (+ `references/accessibility-checklist.md`) — before non-trivial `app/` UI work or any refactor. Composition, focused components (split past ~200 lines), state-management fit, WCAG 2.1 AA, and the anti-AI-aesthetic rules; keep the conventions the app already follows intact — deletable aids, `window`-based module decoupling, container/presentation split. Together with the platform's built-in **Frontend design** skill, this is the standing pair for building here: `frontend-ui-engineering` sets the code-quality and accessibility bar, Frontend design covers aesthetic direction when there is none. Once the product has one (`tokens.css` and the design law the product block names), the skill below is for range, not for direction; until then, ask.

### Design range — opt-in toolkit, imported from open source
One external skill, vendored into `skills/impeccable/` exactly as upstream ships it, with LatentMagic's adapter beside it in `skills/impeccable-local/`. It does not fire as part of routine build work: reach for it on `$impeccable`, or when a piece of work genuinely needs critique depth beyond the standing pair. **Read `skills/impeccable-local/SKILL.md` first, then `skills/impeccable/SKILL.md`** — the adapter says what applies here, what replaces upstream's Setup, and what was left out.
- `impeccable` — a critique-and-refine vocabulary (`critique`, `audit`, `polish`, `clarify`, `layout`, `typeset`, plus the native-platform references) with one playbook per move in `skills/impeccable/reference/`. Best used on surfaces that already exist. `shape` / `new-work` only inside a playground, never straight into `app/`. Upstream `pbakaus/impeccable`.

**Precedence over it: the theme is not its to set.** `tokens.css` and the design law the product block names are binding. `skills/impeccable-local/SKILL.md` says what it may and may not do here.

**Where it disagrees with this file, this file wins** — most of all the ratification rule and the last-line-carries-the-ask rule for chat replies.

## Before building

<important if="you are building against a prompt, or looking for a spec, the PRD, copy voice, positioning, or the reasoning behind a request">
- Read the sources the product block names: those are read **live**, not held here.
- Read the task's own context record, where the product block says it lives, before building against its prompt — the prompt is the tip of a much larger record.
</important>

## Designing

<important if="you are making any design decision: colour, type, spacing, layout, components or visual style">
- `tokens.css` and the design law and brand values the product block names are the binding source for exact tokens, components and visual style — when in doubt on a specific value, they win.
- **Hierarchy via size and weight, never colour.** 4px grid. Readable from 320px.
- **When layout rules collide, a role never changes.** Overhang, space economy and an even vertical rhythm can pull against each other. Resolve them with the levers in order: size within the element's role, then spacing within its step, then layout (width, stacking), then rewording. Rewording is the last lever, not one to avoid, because copy is designed for each width. An H1 may scale with the page, but it stays the H1 and reads as the largest thing on the page at every width. Never demote a role, or break the rhythm, to make something fit. The role's size range belongs to the design system, not to this file.
</important>

<important if="you are writing or editing product copy (any UI text, empty state, dialog, error or label)">
- Read the product's voice doc live, as the product block names it, **before** writing any UI string — not after it is challenged.
</important>

<important if="you are building or changing any overlay: a sheet, modal, dialog or popover">
- **Only a panel changes shape on a phone.** A surface that opens over the page and takes focus is one of three kinds, sorted by its job. Ask in this order; the first that fits is the kind.
  - **Dialog.** Asks one question or takes one short edit, and nothing behind it can be used until it is answered or dismissed: a confirmation, a proof of identity, a rename. Its content is fixed and never scrolls. Centred at every width. A dialog that outgrows the space above the on-screen keyboard becomes a page or a panel, never a taller dialog.
  - **Menu.** A short list of commands opened from a control; choosing one runs it and closes the menu. It opens at its control at every width. A list long enough to scroll is a panel.
  - **Panel.** Anything else the user stays in and works with: a composer, a picker, a list that can grow or scroll. A bottom sheet on a phone. On desktop it is anchored to its control or centred, the project's call.
  - What appears over the page without taking focus, such as a tooltip or a status message, is none of these and does not swap.
- Check every overlay at phone and desktop width before calling it done.
</important>

<important if="you are building or changing any action that changes state: a submit, save, send, delete, confirm or pay">
- **Every action that changes state shows it is working.** From the press until the result, the control that was pressed shows a loading indication and cannot be pressed again; usually that is the submit button. A prototype has no real wait, so stage one long enough to see.
</important>

## Code

<important if="you are touching module load order, the config button, the states register, or QA">
- **The pill at the bottom right is the prototype's own aid, not the product:** Config (review settings you hold while looking), States (an address you open: `?state=<id>`, and a link to hand someone), and QA (the states a piece of work in flight needs checking against). `app/README.md` says how to add a state (`KIT_STATE_REGISTER` in `app/states.jsx`), a QA entry (`KIT_QA` in `app/qa.jsx`) and a Config row (`window.ConfigExtra`); `ARCHITECTURE.md` § Addressable states says what earns a state an entry.
- **Keep them current (a rule added by this kit).** Work that adds a hard-to-reach situation adds its state to the register in the same change; a QA entry is deleted once the work is signed off.
- **JSX over `window`, load order fixed in `index.html`**, and the aids are deletable: see `ARCHITECTURE.md` § Deletable aids and § Conventions.
</important>

## Files

<important if="you are creating, naming, moving or archiving any file or folder">
- **File naming: kebab-case, always.** Lowercase kebab-case with no spaces — `checkout-playground-standalone.html`, `pg-checkout-app.jsx`, `handoff-2026-07-27-checkout-playground.md`. No spaces, no title case, no ` - ` separators, no underscores. This includes downloadable deliverables and bundled output. Spaces in paths break shell use, URLs and tooling on the user's end.
- **Root** holds only what must be there: `index.html`, `playgrounds.html`, `playgrounds.json`, `app/`, `tokens.css`, `skills/`, the durable docs, and whatever the product block lists as extra root files.
- **`docs/`** holds durable docs only.
- **`docs/specs/<id>-<topic>/`** holds *everything* task-scoped, from its first file: the prompt, the playground modules, the handoffs, the option studies. Ids come from the product's tracker, as the product block names it. No ticket yet, use `docs/specs/<kebab-topic>/` and rename when one exists.
- **`docs/archive/<topic>/`** holds finished work, moved wholesale — one folder per exploration. Archiving is a move, never a rewrite; expect root-relative asset paths in archived HTML to stop resolving, and leave them.
</important>

<important if="you are building, moving or archiving a playground or rig">
- **A playground entry lives in `docs/specs/<ticket>/playground/`, never at the root** — entry and modules together, so a ticket is one self-contained folder and clearing out is a folder-level act. Root means "this is the product".
- **Making a nested entry load:**
  - `<base href="../../../../" />` in `<head>`, one `../` per level of nesting — four for `docs/specs/<ticket>/playground/`. That is the whole mechanism.
  - **Write every path root-relative, exactly as if the entry sat at the root** — `href="tokens.css"`, `src="app/main.jsx"`, and `src="docs/specs/<ticket>/playground/pg-foo.jsx"` for the rig's own modules. Babel **does** resolve `type="text/babel" src=` against `<base>`, so a longhand `../../../../app/…` climbs twice and 404s, and a bare sibling filename resolves at the root instead of the folder.
  - The preview warns "referenced file not found" for base-relative paths. It is a false positive only when the `<base>` depth is right, and the warning reads the same either way, so it can never confirm the depth: count the `../` against the file's own depth, load the page, and confirm one token-driven thing rendered before handing it over. Never explain the warning away without having looked (`GOTCHA.md` 11 is how it went wrong).
- **`playgrounds.html` at the root is the launcher, and `playgrounds.json` is its manifest.** The page is two levels: a shelf of tickets (most recently touched first, documents-only and archive folded away), then one ticket's rigs. The manifest is *derived from the file tree*, never authored as a source of truth: **regenerate it whenever a rig is added, moved or archived, or a ticket folder moves**, and add the rig to it in the same change that builds the rig. If it drifts, rebuild it from the tree rather than patching it. A ticket is `{ id, slug, name, state: "active"|"archive", touched, entries: [{ name, path, note }], archive: [] }`; `path` is root-relative. Hiding an entry is `"on": false`, never deletion. Set `product` in the manifest to the product's name. It is reached by URL (`/playgrounds.html`), not from inside the app.
- **A state is a scenario, never a width.** QA and scenario lists (playgrounds, the Config / QA aid) carry one entry per scenario. Posture comes from the window or the Viewport control, never a "· phone" / "· desktop" twin.
</important>

## Wrapping up

<important if="a change has landed">
- Decide whether it earns a `CHANGELOG.md` entry, and ask before writing one.
- **Editing rule (strict):** one entry per *significant landed step* — a feature introduced, a rebrand, a model change, or a **fundamental change to how the app works or is structured** (an information-architecture rework, consolidating an overloaded concept, a flow being reshaped) even when it originates as a bug fix. What matters is whether the *shape* of the product changed, not the label on the task. NOT for iterative work: refinements, cosmetic bug fixes, size/spacing/timing tweaks, seed-data changes, enabling an option, renaming a key, motion detail, etc. never get their own entry or bullet.
- Do NOT keep amending an entry as you iterate within a feature — the entry captures the *shape* of the step, written once, and then left alone. When in doubt, add nothing and ask. A single terse title + 2–4 shape-level bullets is the ceiling.
</important>

<important if="you hit a hard-won, non-obvious trap that would catch the next session too">
- Propose capturing it in `GOTCHA.md` (a shared file: say so in the handoff so it can be carried back to the kit). Only add the entry once the user approves it — do not append gotchas unprompted. Keep each entry terse: symptom → cause → fix → rule.
</important>

<important if="you or the user settle a decision that no upstream spec holds yet">
- Record it in the task's handoff under `docs/specs/` (a decision, with the date and who ratified it), so it travels back to the repo. Do not keep it in a local rule list.
</important>

<important if="a way of working is worth reusing across sessions, or the user asks for a new skill">
- Propose it as a skill. Once ratified, create `skills/<name>/SKILL.md` with the frontmatter, keep `SKILL.md` to intent + rules and push detail into sibling files, then add its name and trigger to the product block's product skills line.
</important>

<important if="a session is ending, files landed in uploads/, or you generated a standalone bundle">
- `uploads/` is filled by the platform whenever the user drops a file; it is a drop history, not a store. **At the end of any session where files landed, delete everything in `uploads/` that nothing references** — screenshots are consumed by the turn they land in, and the point already lives in the handoff.
- **Never leave a standalone bundle in the project.** It inlines React, Babel and fonts, so each one costs 1.7–6 MB and dominates the download. Generate it, hand it over, delete it in the same session.
</important>
