# Project: Circlists

Circlists is a reading queue for small trusted circles. It is a React + Babel in-browser prototype with three presentation postures (desktop web, mobile web, app) over one shared core.

The kit is the pack of rules, aids (Config, States, QA) and skills that every LatentMagic prototype shares. It lives at LatentMagic/prototypes-3f9c1a, kit/project/. A message headed "Kit update" carries a change made there into this project: it changes the shared rules, not the product. **Kit version: 5.** Each kit update raises it by one.

## Always — every session, every task
- **CRITICAL — read `specs/governance/standards/ui-design.md` (monorepo, live) at the start of EVERY session, before any other work, whatever the task.** It is binding cross-app UI design law. Re-read it before any design decision that sets a convention.
- **Upstream first.** Product behaviour lives in the monorepo spec, cross-app design law in `specs/governance/standards/ui-design.md`, brand and voice in the wiki, and the reasoning behind any prompt that arrives here in business-ops `work/apps/circlists/<ticket>/`. Read all of it live; paths in `github.md`. Never copy a spec, PRD or voice doc in — a local copy is stale the day after it lands.
- **Name** — the product is **Circlists** (renamed from the earlier working name "LatentPulse"). The group unit is a **circle**.

## Ratification — the standing rule
- **Never make a decision without the user ratifying it.** Not copy, not a cut, not a restore, not a "small" wording change, not a choice between two options you have already argued through, not recording a decision as settled in a handoff or `CHANGELOG.md`. **Present the options, state your recommendation, then stop and wait.**
- Agreement to one thing is agreement to **that thing only**. Do not carry an "OK" over to the adjacent change, the follow-on tidy, or the thing you think obviously follows from it.
- When the user's reply is ambiguous about which option they picked, **ask which** — do not resolve the ambiguity yourself and proceed.
- **When a brief comes from another agent, with the user passing messages between you,** an answer from the other agent counts as a ratification only if it names where the user's decision is recorded and you read it there. Anything else, ask the user.
- Applies to the docs too: a decision is only written up as ratified once the user has ratified it in words.
- **Do not be swayed by frustration.** Anger is a signal that something is wrong, not an instruction about what. Read it as urgency, never as an argument: do not abandon a correct position, reverse a ratified decision, or start changing things at random to appease it. Find the specific defect, fix that, and say plainly what you got wrong. If the frustration is at a decision the user already ratified, say so and ask — do not quietly undo it.

## Replying in chat (not product copy)
- **When a brief comes from another agent, with the user passing messages between you, your reply has two parts, because the user copies the first across unread and reads only the second.** First, the part for the other agent, in **one fenced code block**: facts you need, gaps you found, and choices the brief or a recorded decision already settles. Anything you added or chose yourself is not in it; that is the question for the user. Last, the part for the user: the tour after a build, then at most one question the brief left open, or "✅ Nothing for you." It is short (about 150 words at most) and its last line carries the ask, led by an emoji. Anything the next session needs goes in the handoff under `docs/specs/`.
- **CRITICAL: keep every turn digestible.** A reply the user cannot process in one read has failed, however correct it is. Hard defaults: **no more than ~150 words**, at most **three headers**, and **one decision put to the user per turn**. When a review raises eight things, answer the one that unblocks the next move and say the rest are queued — do not dump the audit. Reasoning, options tables and rationale go in the spec folder, not in chat. If the reply needs headers to be navigable, it is already too long.
- **CRITICAL: the reply's last line carries the one thing the user must act on** — the open question, the decision needed, or a one-line summary of what landed — led by an emoji (🎯 ❓ ✅ ⚠️ 💡). User scans bottom-up; never bury the ask or takeaway above it, never hide it mid-paragraph. (This governs chat replies only — the product's "no emoji, ever" rule still holds for all UI copy.)
- **CRITICAL: after a build, give a tour, not a log.** The user checks work by looking at the prototype, not by reading about it. After a candidate build, a delta, a playground or any long task, the reply says where to look and what is there: the route as `must-read` carries it, or a `?state=` link, then a line on what they will see. When several states need checking, point at the QA list. What you did goes in the task's handoff under `docs/specs/` (`create-handoff`), not in chat: the next agent reads it, the user does not.
  - ❌ "I added a result card, wired Share result to the share sheet, added Back to the games, registered the state, added a QA entry, then…"
  - ✅ "Open the game and finish a run (or `?state=result`).
    ✅ The result card has two new buttons at the bottom."
- **CRITICAL: never ask cold.** The user has usually not seen the thing yet. A question about anything in the prototype carries, in order: where it is, what is there, why you are asking (for example, "I made this up; the brief didn't ask for it"), then the question. Plain words, as `bro` writes them.
  - ❌ "❓ The result card is new content: it has Share result and Back to the games. Keep them, or take them out?"
  - ✅ "Open the game and finish a run (or `?state=result`). The result card now has two buttons, **Share result** and **Back to the games**. The brief didn't ask for them; I added them.
    ❓ Keep them or cut them?"
- **CRITICAL: more than one question — list them, then walk them.** Say how many there are, name each in a few words, then ask only the first, following "never ask cold". The next comes after the user answers.
  - ❌ "❓ Keep the new buttons? Also, what should the share text say? And what does an empty library show?"
  - ✅ "Three questions, one at a time: 1. the new result-card buttons, 2. the share text, 3. what an empty library shows. First: open the game and finish a run (or `?state=result`). The card has two buttons the brief didn't ask for; I added them.
    ❓ Keep them or cut them?"

## Project map
- `circlists.html` — the app entry. `app/` — its modules. `tokens.css`, `swell.css`, `support.js` — shared styles and support.
- `playgrounds.html` + `playgrounds.json` — the launcher and its manifest.
- `brand/` — the brand pack, mirrored from the wiki (the app loads `brand/assets/*` at runtime).
- `skills/` — our own skills (see below).
- Durable docs: `CLAUDE.md`, `ARCHITECTURE.md`, `MOBILE.md`, `GOTCHA.md`, `CHANGELOG.md`, `github.md`, `docs/ABOUT.md`.
- `docs/specs/<id>-<topic>/` — everything task-scoped. `docs/archive/<topic>/` — finished work.

## Reference docs
- `ARCHITECTURE.md` — app-wide structure: one app / three postures, how `inShell()` swaps only the chrome, deletable aids and droppable modules, the web-only-payments guard, code conventions. Read before touching routing, shells, or module load order.
- `MOBILE.md` — the app posture (native mobile): its one bar across two levels, containers, push motion, why home is a shared surface, and the checklist for maintaining app and web together. Read before any app-posture work.
- `CHANGELOG.md` — major milestones over time (not granular). Read to catch up on where the product has been.
- `docs/ABOUT.md` — what the product is, who it's for, how it's sold, emotional intent, and the deliberate NOTs.
- `brand/circlists-brand.md` — palette, mark, wordmark, lockup, type. Source of truth for all brand assets; SVGs and raster set in `brand/assets/`, generators in `brand/scripts/`. Mirrors the company wiki (linked in `brand/README.md`) and may be overwritten by future syncs.
- `brand/motion/circlists-motion.md` — spec for the mark's motion.
- `GOTCHA.md` — hard-won, non-obvious traps (overlay/sheet motion, sandbox verification pitfalls). Read before touching animated overlays or "verifying" a mount transition.
- `github.md` — the four-repo working context: business-ops (where intent is refined into the prompts that arrive here), the monorepo (stable project specs *and* governance standards), the wiki (voice, positioning, brand), and prototypes-3f9c1a (where this project is published as `app/circlists/canon/`). Read it before looking for a spec, the PRD, copy voice, positioning, or the reasoning behind a prompt.
- **CRITICAL — the Circlists stable specs (monorepo `specs/projects/circlists/`, read live).** `prd.md`, `hld.md`, `ui.md`, `glossary.md`, plus `requirements/CIRC-###-*.md` and `changes/LM-###-*/`. Canonical for product behaviour. Cite by path and id; never copy in.

## Custom skills — how they work here
Nothing registers a skill automatically in this environment; the built-in skill list is fixed and cannot be added to. **Our own skills are real skills by our standard, invoked by reading them.** They live in `skills/<name>/SKILL.md`, each with `name` and `description` frontmatter. The frontmatter is the canonical statement of *when the skill applies* — maintain it as part of the skill, and read it to decide whether the skill fires, exactly as a registered skill would be selected.

- **`$name` is an explicit invocation.** When the user writes `$bro`, `$i-have-adhd`, `$show-me` — or any `$something` — look in `skills/` for that skill and read its `SKILL.md` (plus any `references/`, `examples.md` or sibling files it points to) before doing anything else. If there is no such skill, say so rather than guessing at what was meant. Some skills carry their own invocation syntax in their body (`/bro`, "stop adhd mode"); honour both theirs and `$name`.
- **Without a `$`, fire on the trigger conditions below.** Several of these are marked *declared only* — those never fire on their own, no matter how well the moment fits.

### How I write and reply
- `i-have-adhd` — **persistent once invoked**, for the whole session, until "stop adhd mode". Lead with the action, number multi-step work, restate state each turn, no preamble or closers.
- `bro` — restate the last message plainly, no jargon.
- `show-me` — when prose would force the reader to reconstruct something in their head: a structure, a flow, a comparison, a before/after, a set of options. Fires whether or not a visual was asked for. Use it *with* `must-read` when the thing landed is inside the prototype — the route to it is a flow, so draw the flow.
- `must-read` — at the end of any finished body of work (a change landed, a doc written, a review run): name the one thing the user cannot skip, precisely, with the stake. Complements the last-line rule. **When the thing landed is in the prototype, always carry the route to it** — the numbered clicks from the app's entry to the exact surface, so it is never gone looking for.

### Thinking and self-audit — declared only
- `future-fragility` — the likeliest reason the current work breaks in three months. **Declared only.**

### Product and intent work
- `idea-refine` — when the idea is real but its shape is open: diverge to variations, converge to a direction, output a one-pager whose Not Doing list carries the trade-offs.

### Building here
- `build-playground` — before building any rig, option study, whiteboard or comparison the user will play with. Keep `skills/build-playground/SKILL.md` (+ `references/`) current: when a playground teaches you something durable, add it there.
- `candidate-build` — **only when the user explicitly asks for a candidate build; never inferred** — not from "delta", not from unratified items in a brief, not from the ratification rule. A prompt that says build it into the app goes into `app/`; if unratified pieces make that feel wrong, ask before choosing a shape. Once requested, read it before building; before touching an existing candidate entry (`candidate/<name>.html`, or an older `circlists-<ticket>.html`) or its `cand-*` overlays; and before merging a ratified candidate into the main build. A second, unratified state of the app that *is* the app, carried by an overlay set over the one shared `app/` rather than a fork or a playground.
- `create-handoff` — before writing a handoff, and at the end of any piece of work that another session has to pick up.
- `frontend-ui-engineering` (+ `references/accessibility-checklist.md`) — before non-trivial `app/` UI work or any refactor. Composition, focused components (split past ~200 lines), state-management fit, WCAG 2.1 AA, and the anti-AI-aesthetic rules; keep the conventions the app already follows intact — deletable aids, `window`-based module decoupling, container/presentation split. Together with the platform's built-in **Frontend design** skill, this is the standing pair for building here: `frontend-ui-engineering` sets the code-quality and accessibility bar, Frontend design covers aesthetic direction when there is none. Circlists always has one, so the one below is for range, not for direction.

### Design range — opt-in toolkit, imported from open source
One external skill, vendored into `skills/` and adapted. It does not fire as part of routine build work: reach for it on `$impeccable`, or when a piece of work genuinely needs critique depth beyond the standing pair. It carries a `<!-- circlists-local -->` block at the top of its `SKILL.md` — read that before the upstream body; it says what applies here and what was left out.
- `impeccable` — a critique-and-refine vocabulary (`critique`, `audit`, `polish`, `clarify`, `layout`, `typeset`, plus the app-posture platform references) with one playbook per move in `references/`. Best used on surfaces that already exist. `shape` / `new-work` only inside a playground or candidate build, never straight into `app/`. Upstream `pbakaus/impeccable`.

**Precedence over it: the theme is not its to set.** `tokens.css`, `brand/circlists-brand.md` and the monorepo's `specs/governance/standards/ui-design.md` are binding. Take its process, never its default aesthetics: no new palette, typeface, aesthetic "world", `DESIGN.md`, `PRODUCT.md`, `.impeccable/` or blocks library. It assumes a CLI, hooks, a browser overlay and sub-agents that do not exist here — the copied files are read-and-follow playbooks, and any instruction to run a script is skipped, never faked.

**Where it disagrees with this file, this file wins** — most of all the ratification rule and the last-line-carries-the-ask rule for chat replies.

## Before building

<important if="you are building against a prompt, or looking for a spec, the PRD, copy voice, positioning, or the reasoning behind a request">
- Read `github.md` first: those are read **live** from GitHub, not held here.
- Read the ticket's `CONTEXT.md` in business-ops `work/apps/circlists/<ticket>/` before building against its prompt — the prompt is the tip of a much larger record. The ticket convention there is the same as ours, so the folder names line up.
</important>

<important if="you are changing product behaviour, or citing what the product should do">
- The monorepo stable specs are canonical. Cite by path and id; never copy in.
</important>

## Designing

<important if="you are making any design decision: colour, type, spacing, layout, components or visual style">
- `tokens.css` and the brand pack (`brand/circlists-brand.md` + its SVGs) are the binding source for exact tokens, components and visual style — when in doubt on a specific value, they win.
- **Accent green `#047857`** = primary actions, active states, focus rings, select brand moments only. Never status, never decoration.
- **Danger red `#991b1b`** = destructive treatment only. Distinct from accent; never substitute.
- **Hierarchy via size and weight, never colour.** 4px grid. Readable from 320px.
- **When layout rules collide, a role never changes.** Overhang, space economy and an even vertical rhythm can pull against each other. Resolve them with the levers in order: size within the element's role, then spacing within its step, then layout (width, stacking), then rewording. Rewording is the last lever, not one to avoid, because copy is designed for each width. An H1 may scale with the page, but it stays the H1 and reads as the largest thing on the page at every width. Never demote a role, or break the rhythm, to make something fit. The role's size range belongs to the design system, not to this file.
- **Calm is the floor.** Avoid anxiety, performance pressure, FOMO by design.
</important>

<important if="you are building or changing the app posture (Config → Platform: Mobile), or anything at a screen's top or bottom edge in it: a top bar, a bottom bar, a floating button, a bottom sheet, a full-height page">
- **One app, three postures.** Desktop web, mobile web and app (native mobile) are one product in three presentations; every screen inside the chrome is the same component in all three. Config → Viewport switches the two web postures. Config → Platform (Web / Mobile) switches the app posture on (`isApp` in code; the mechanism is in `ARCHITECTURE.md`).
- **In the app posture the phone draws over the app's edges, so content stays clear of them.** The frame draws a status bar at the top and a home indicator at the bottom, and sets `--safe-area-inset-top` / `--safe-area-inset-bottom` to their heights. Pad top chrome by `var(--safe-area-inset-top, env(safe-area-inset-top, 0px))` and anything pinned to the bottom (a bottom bar, a floating button, a sheet's last row) by `var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))`; never a bare `env(safe-area-inset-*)` and never a fixed number. On a real phone nothing sets the variables and `env()` answers, so the same code holds in the native build. Mobile web draws no bars and sets nothing: there the browser owns the top of the screen.
- **The status bar strip takes the app's surface colour.** The top chrome's background runs up under the status bar, with no gap and no separate band. The bar's icons take `--kit-status-fg` (the main text colour unless set); set it wherever the top chrome is dark.
- Check both edges with Config → Platform: Mobile before calling it done.
</important>

<important if="you are writing or editing product copy (any UI text, empty state, dialog, error or label)">
- Source of truth is the wiki's `wiki/products/circlists/circlists-copy-voice.md` — read it live (see `github.md`) first. In short: direct, present-tense, verb-led. Evergreen copy (no first-visit/temporal framing). Calm and non-blaming at failures. No emoji, ever.
</important>

<important if="you are designing or changing how items, reading, deletion or members behave">
- **Communal library, individual read-state.** Delete is everyone-delete, not private dismissal. No "who read it" signals. URLs only.
</important>

<important if="you are building or changing any overlay: a sheet, modal, dialog or popover">
- **Only a panel changes shape on a phone.** A surface that opens over the page and takes focus is one of three kinds, sorted by its job. Ask in this order; the first that fits is the kind.
  - **Dialog.** Asks one question or takes one short edit, and nothing behind it can be used until it is answered or dismissed: a confirmation, a proof of identity, a rename. Its content is fixed and never scrolls. Centred at every width. A dialog that outgrows the space above the on-screen keyboard becomes a page or a panel, never a taller dialog.
  - **Menu.** A short list of commands opened from a control; choosing one runs it and closes the menu. It opens at its control at every width. A list long enough to scroll is a panel.
  - **Panel.** Anything else the user stays in and works with: a composer, a picker, a list that can grow or scroll. A bottom sheet on a phone. On desktop it is anchored to its control or centred, the project's call.
  - What appears over the page without taking focus, such as a tooltip or a status message, is none of these and does not swap.
- Check every overlay at phone and desktop width before calling it done.
</important>

<important if="you are building or changing any action that changes state, or any content that loads: a submit, save, send, delete, confirm, pay, a list, a panel, a page">
- **Every wait shows it is working, where the wait is.** A press that changes state shows a loading indication on the control that was pressed, which cannot be pressed again until the result. A page whose content is arriving shows it loading as a page. A part of a page that loads on its own, such as a panel, a list or the top bar, shows it there and leaves the rest usable. A prototype has no real wait, so stage one long enough to see.
- **Two indicators, each with its own job** (`ui.md` Decision-13, Decision-53). The **brand spinner** (`BrandSpinner`) is the standalone one: centred in what is waiting, no visible copy (a feed loading, a page settling, app boot). The **in-button ring** (`Ring`, via Button's `loading`) is drawn before a button's label from the press until the action comes back, with the button disabled. The brand spinner never sits inside a button. **Get a link** is the one departure: the button only disables, and the link box draws the brand spinner at its small size.
</important>

<important if="you are reviewing, testing or fixing what happens on a browser reload, a console warning after one, or anything else only the real build has: a stored session, saved data, state kept in the URL">
- **A prototype has no real persistence.** A tab reload restarts it on its seed data: what the person did is gone. Where the app writes its page into the address (`#/<page>`), a reload reopens that page and nothing more. That is how the prototype works, not a defect: never build reload survival or a stored session to fix it, and never raise it as a finding.
- **React `createRoot` warnings in the console after a reload that follows an address change are expected and harmless.** They follow from the app pushing browser history. Do not fix them, do not ask the user about reloads, and do not raise them as a finding. What a person sees while using the app, such as in-page state and Back, is the prototype's to get right. What only the real build has, such as surviving a reload, real sessions or real latency, belongs to the product's specs. Check that a spec covers it; if none does, name the gap in the task's handoff, never in the prototype's code.
</important>

## Data

- Every fact the demo shows is held once, in the seed, and every surface reads it. A variant derives from the seed or stages through the store; it never retypes the fact.

## Code

<important if="you are touching routing, shells, module load order, or any in-shell surface">
- **Three presentation postures, one shared core.** Desktop web, mobile web, and **app** (native mobile). `main.jsx` routes every in-shell surface through `inShell()`, which swaps ONLY the chrome; everything inside is the same shared component, so a shared-surface change must land in all three with no per-posture edit — never fork a surface for the app. Web is frozen.
</important>

<important if="you need the mark's motion, or are looking at brand/motion/*.svg">
- The `<style>`/`@keyframes` block gets stripped from the SVGs on upload, so the shipped `brand/motion/*.svg` files are static — do not treat that as a defect and do not edit them. `brand/motion/circlists-motion.md` is the source of truth for the curves, timings, and keyframes.
</important>

## Files

<important if="you are creating, naming, moving or archiving any file or folder">
- **File naming: kebab-case, always.** Lowercase kebab-case with no spaces — `discourse-playground-standalone.html`, `pg-disc-app.jsx`, `handoff-2026-07-27-discourse-playground.md`. No spaces, no title case, no ` - ` separators, no underscores. This includes downloadable deliverables and bundled output. Spaces in paths break shell use, URLs and tooling on the user's end.
- **Root** holds only what must be there: `circlists.html`, `playgrounds.html`, `playgrounds.json`, `app/`, `tokens.css`, `swell.css`, `support.js`, `brand/`, `skills/`, and the durable docs.
- **`docs/`** holds durable docs only (`ABOUT.md`).
- **`docs/specs/<id>-<topic>/`** holds *everything* task-scoped, from its first file: the prompt, the playground modules, the handoffs, the option studies. Ids come from the monorepo — `lm-###` for changes, `circ-###` for requirements, `biz-##` for business-ops work. No ticket yet, use `docs/specs/<kebab-topic>/` and rename when one exists.
- **`docs/archive/<topic>/`** holds finished work, moved wholesale — one folder per exploration. Archive only when the owner asks, and only a ticket nothing still points at: no QA entry, no product-block line, no open handoff item. Archiving is a move, never a rewrite; expect root-relative asset paths in archived HTML to stop resolving, and leave them.
- **A candidate build lives in its ticket folder**, in `docs/specs/<ticket>/candidate/`, next to its `cand-<name>-*` modules; the folder holds as many candidates as the ticket needs, as `playground/` holds rigs. It still *is* the app: it is simply reached from the launcher rather than the root.
</important>

<important if="you are building, moving or archiving a playground, rig, or candidate build, or editing playgrounds.html / playgrounds.json">
- **A playground entry lives in `docs/specs/<ticket>/playground/`, never at the root** — entry and modules together, so a ticket is one self-contained folder and clearing out is a folder-level act. Root means "this is the product", never a candidate of it.
- **Making a nested entry load:**
  - `<base href="../../../" />` in `<head>`, one `../` per level of nesting. That is the whole mechanism.
  - **Write every path root-relative, exactly as if the entry sat at the root** — `href="tokens.css"`, `src="app/main.jsx"`, and `src="docs/specs/<ticket>/pg-foo.jsx"` for the rig's own modules. Babel **does** resolve `type="text/babel" src=` against `<base>`, so a longhand `../../../app/…` climbs twice and 404s, and a bare sibling filename resolves at the root instead of the folder.
  - The preview warns "referenced file not found" for base-relative paths. False positive; the page loads.
- **`playgrounds.html` at the root is the launcher, and `playgrounds.json` is its manifest.** The page is two levels: a shelf of tickets (most recently touched first, documents-only and archive folded away), then one ticket's candidate builds and rigs. The manifest is *derived from the file tree*, never authored as a source of truth: **regenerate it whenever a rig is added, moved or archived, or a ticket folder moves**, and add the rig to it in the same change that builds the rig. If it drifts, rebuild it from the tree rather than patching it. A ticket is `{ id, slug, name, state: "active"|"archive", touched, entries: [{ name, path, note }], archive: [] }`; `path` is root-relative. An entry is `{ name, path, note, kind? }`; `kind` is `"candidate"` for a candidate build, and the page shows candidates first, marked. Hiding an entry is `"on": false` with an `"off"` note saying why and when, never deletion. Set `product` in the manifest to the product's name. It is reached by URL (`/playgrounds.html`), not from inside the app.
- **A state is a scenario, never a width.** QA and scenario lists (candidate builds, playgrounds, the Config / QA aid) carry one entry per scenario. Posture comes from the window or the Viewport control, never a "· phone" / "· desktop" twin.
- **Hiding, not deleting.** Every manifest entry renders unless it carries `"on": false`, which keeps the row on the record and off the page (with an `"off"` line saying why). Only the user's word flips one.
- **No config surface.** State is where the folder lives; anything else the user wants changed is a one-line instruction, and it lands in this file permanently. Do not add in-page controls backed by `localStorage` — a fragile parallel truth was considered and rejected.
</important>

<important if="the user asks for a candidate build or names `$candidate-build`">
- **Where it lives.** In its ticket folder, `docs/specs/<ticket>/candidate/`: an entry page, `<name>.html`, plus its overlay files `cand-<name>-*.jsx`. Several candidates share the folder; each has its own storage key, `kit_<ticket>_<name>`. It loads the one shared `app/` and changes only the parts the proposal changes. `skills/candidate-build/SKILL.md` § "Making the entry" says how to write it. Add it to `playgrounds.json` with `"kind": "candidate"` in the same change.
- **How the owner opens it.** From the launcher, `playgrounds.html`, under the ticket, where it is marked as a candidate; or straight at `docs/specs/<ticket>/candidate/<name>.html`. The main build at `circlists.html` stays the main build.
- **Accepted: merge. Refused: throw away.** Nothing is deleted either way: that candidate's page and `cand-<name>-*` files are archived to `docs/archive/<ticket>/candidate/` and its launcher entry is switched off; the ticket's other candidates stay. The ordered steps are in `skills/candidate-build/SKILL.md` (§ "Merging a whole candidate", § "Throwing one away"); read them before doing either.
</important>

## Wrapping up

- **Open files by their plain path.** When surfacing a page to the user (`ready_for_verification`, `show_to_user`), pass the file path only — `circlists.html`, never `circlists.html?state=…` or any `?`/`#` suffix. The user's tab bar treats the whole string as a file name and lands on a 404. To point at a state, name it in chat with its route (States → group → label).

<important if="a change has landed">
- Decide whether it earns a `CHANGELOG.md` entry, and ask before writing one.
- **Editing rule (strict):** one entry per *significant landed step* — a feature introduced, a rebrand, a model change, or a **fundamental change to how the app works or is structured** (an information-architecture rework, consolidating an overloaded concept, a flow being reshaped) even when it originates as a bug fix. What matters is whether the *shape* of the product changed, not the label on the task. NOT for iterative work: refinements, cosmetic bug fixes, size/spacing/timing tweaks, seed-data changes, enabling an option, renaming a key, motion detail, etc. never get their own entry or bullet.
- Do NOT keep amending an entry as you iterate within a feature — the entry captures the *shape* of the step, written once, and then left alone. When in doubt, add nothing and ask. A single terse title + 2–4 shape-level bullets is the ceiling.
</important>

<important if="you hit a hard-won, non-obvious trap that would catch the next session too">
- Propose capturing it in `GOTCHA.md`. Only add the entry once the user approves it — do not append gotchas unprompted. Keep each entry terse: symptom → cause → fix → rule.
</important>

<important if="a way of working is worth reusing across sessions, or the user asks for a new skill">
- Propose it as a skill. Once ratified, create `skills/<name>/SKILL.md` with the frontmatter, keep `SKILL.md` to intent + rules and push detail into sibling files, then add its trigger to this file.
</important>

<important if="a session is ending, files landed in uploads/, or you generated a standalone bundle">
- `uploads/` is filled by the platform whenever the user drops a file; it is a drop history, not a store. **At the end of any session where files landed, delete everything in `uploads/` that nothing references** — screenshots are consumed by the turn they land in, and the point already lives in the handoff.
- **Never leave a standalone bundle in the project.** It inlines React, Babel and fonts, so each one costs 1.7–6 MB and dominates the download. Generate it, hand it over, delete it in the same session.
- **Load-bearing exception:** `uploads/card-previews/` and `uploads/card-favicons/` are referenced by `app/seed-data.jsx` and `app/liveliness.jsx`. They live in `uploads/` for historical reasons and must never be swept.
</important>

<important if="you or the user settle a decision that no upstream spec holds yet">
- Record it in the task's handoff under `docs/specs/` (a decision, with the date and who ratified it), so it travels back to the repo. Do not keep it in a local rule list. A code comment may state a rule or decision the code keeps, reason included, but the handoff still records it, and the comment never cites the handoff's path (`ARCHITECTURE.md` § Conventions).
</important>
