# Project: Circlists

## Reference docs — read when relevant
- `ARCHITECTURE.md` — app-wide structure: one app / three postures, how `inShell()` swaps only the chrome, deletable aids and droppable modules, the web-only-payments guard, code conventions. Read before touching routing, shells, or module load order.
- `MOBILE.md` — the app posture (native mobile): its two chrome states, containers, push motion, the chrome-vs-surface test for home, and the checklist for maintaining app and web together. Read before any app-posture work.
- `CHANGELOG.md` — major milestones over time (not granular). Read to catch up on where the product has been.
  - **Editing rule (strict):** one entry per *significant landed step* — a feature introduced, a rebrand, a model change, or a **fundamental change to how the app works or is structured** (an information-architecture rework, consolidating an overloaded concept, a flow being reshaped) even when it originates as a bug fix. What matters is whether the *shape* of the product changed, not the label on the task. NOT for iterative work: refinements, cosmetic bug fixes, size/spacing/timing tweaks, seed-data changes, enabling an option, renaming a key, motion detail, etc. never get their own entry or bullet.
  - Do NOT keep amending an entry as you iterate within a feature — the entry captures the *shape* of the step, written once, and then left alone. When in doubt, add nothing and ask. A single terse title + 2–4 shape-level bullets is the ceiling.
- `docs/ABOUT.md` — what the product is, who it's for, how it's sold, emotional intent, and the deliberate NOTs. Durable product essence.
- `brand/circlists-brand.md` — the Circlists brand pack: palette, mark, wordmark, lockup, type. Source of truth for all brand assets; the SVGs and raster set (favicons, PWA icons) live in `brand/assets/`, generators in `brand/scripts/`. The pack mirrors the company wiki (linked in `brand/README.md`) and may be overwritten by future syncs.
- `github.md` — the four-repo working context this project sits in: business-ops (where intent is refined into the prompts that arrive here), the monorepo (the stable project specs *and* the governance standards, including the binding `specs/governance/standards/ui-design.md`), the wiki (voice, positioning, brand), and prototypes-3f9c1a (where this project is published as `app/circlists/canon/`). Read it before looking for a spec, the PRD, copy voice, positioning, or the reasoning behind a prompt: those are read **live** from GitHub, not held here.
- `docs/BRANDING.md` — thin pointer to `brand/`, noting it's a manual copy of the wiki's brand directory.
- `brand/motion/circlists-motion.md` — spec for the mark's motion (pulse/spinner/micro keyframes, timings, curves). The `<style>`/`@keyframes` block gets stripped from the SVGs on upload, so the shipped `brand/motion/*.svg` files are static — do not treat that as a defect and do not edit them. When you need the motion, refer to this markdown spec as the source of truth for the curves, timings, and keyframes.
- `HOMEPAGE-DEMO.md` — the **homepage demo**: the app state a stranger plays with on `circlists.com`. It is part of the working line's output and **ships with every export** (`circlists-homepage-demo.html` + `demo/`). Read it before touching the demo entry, its overlay, its seed, or the module list either entry carries — and whenever a module is added to or removed from `circlists.html`.
- `GOTCHA.md` — hard-won, non-obvious traps (overlay/sheet motion, sandbox verification pitfalls). Read before touching animated overlays or "verifying" a mount transition.
  - **Editing rule:** only add an entry when the user approves it — do not append gotchas unprompted. Keep each entry terse: symptom → cause → fix → rule.
- `skills/build-playground/SKILL.md` (+ `references/`) — how to build a playground: the intent, the non-negotiables, picking the rig shape, then config/driver patterns and wiring in its references. Supersedes the old `PLAYGROUND.md`. Keep it current: when a playground teaches you something durable, add it here.
- `skills/build-candidate/SKILL.md` — how to build a **candidate build**: a second, unratified state of the app that *is* the app, carried by an overlay set over the one shared `app/` rather than a fork or a playground. The philosophy and the invariants; read before building any delta that has to be played as the product. Supersedes `docs/specs/candidate-builds/README.md` as the standard (that file stays as the reasoning record).
- `skills/frontend-ui-engineering/SKILL.md` (+ `references/accessibility-checklist.md`) — code-quality bar for building or reorganising the `app/` UI: composition, focused components (split past ~200 lines), state-management fit, WCAG 2.1 AA, and the anti-AI-aesthetic rules. Read before non-trivial UI work or refactors. It reinforces conventions the app already follows — deletable aids, `window`-based module decoupling, container/presentation split — so keep those intact when editing.

These distil the durable essence. For exact tokens, components, and visual style, this project's own `tokens.css` and the brand pack (`brand/circlists-brand.md` + its SVGs) are the binding source — when in doubt on a specific value, they win. (Voice and the destructive-red `#991b1b` are captured in Key reminders below, not the pack.)

## Custom skills — how they work here
Nothing registers a skill automatically in this environment; the built-in skill list is fixed and cannot be added to. **Our own skills are real skills by our standard, invoked by reading them.** They live in `skills/<name>/SKILL.md`, each with `name` and `description` frontmatter. The frontmatter is the canonical statement of *when the skill applies* — maintain it as part of the skill, and read it to decide whether the skill fires, exactly as a registered skill would be selected.

- **`$name` is an explicit invocation.** When the user writes `$bro`, `$i-have-adhd`, `$digestible` — or any `$something` — look in `skills/` for that skill and read its `SKILL.md` (plus any `references/`, `examples.md` or sibling files it points to) before doing anything else. If there is no such skill, say so rather than guessing at what was meant. Some skills carry their own invocation syntax in their body (`/bro`, "stop adhd mode"); honour both theirs and `$name`.
- **Without a `$`, fire on the trigger conditions below.** Several of these are marked *declared only* — those never fire on their own, no matter how well the moment fits.
- Adding a skill: create `skills/<name>/SKILL.md` with the frontmatter, keep `SKILL.md` to intent + rules and push detail into sibling files, then add its trigger to the list below.

### How I write and reply
- `i-have-adhd` — **persistent once invoked**, for the whole session, until "stop adhd mode". Lead with the action, number multi-step work, restate state each turn, no preamble or closers.
- `digestible` — on any overload signal ("too much", "too long", "TLDR", "condense"), and proactively when a reply carries more than can be taken in at once. Sequence the signal in beats; never cut substance to look shorter.
- `bro` — restate the last message plainly, no jargon.
- `show-me` — when the point is structural or visual and prose is doing it badly.

### Thinking and self-audit — declared only
- `blind-spot` — post-output audit: what I'm least confident about, and what the user is missing. **Declared only.**
- `future-fragility` — the likeliest reason the current work breaks in three months. **Declared only.**

### Product and intent work
- `product-intent` — the **seat** for product-requirements work, held for the whole session: one grounded fork per turn with a recommendation and a self-critique, nothing recorded without explicit ratification. Load whenever intent is being developed, refined or ratified.
- `interview-me` — when an ask names a conventional artefact without who it serves or why now; challenges *whether that artefact* is right, one question at a time with a guess attached.
- `idea-refine` — when the idea is real but its shape is open: diverge to variations, converge to a direction, output a one-pager whose Not Doing list carries the trade-offs.

### Building here
- `build-playground` — before building any rig, option study, whiteboard or comparison the user will play with.
- `build-candidate` — before building a delta that has to *be* the app rather than sit beside it as options; and before touching an existing `circlists-<ticket>.html` entry or its `cand-*` overlays.
- `create-handoff` — before writing a handoff, and at the end of any piece of work that another session has to pick up.
- `frontend-ui-engineering` — before non-trivial `app/` UI work or any refactor.

**Where they disagree with this file, this file wins** — most of all the ratification rule and the last-line-carries-the-ask rule for chat replies.

## Where files live
- **Upstream first.** Product behaviour lives in the monorepo spec, cross-app design law in `specs/governance/standards/ui-design.md`, brand and voice in the wiki, and the reasoning behind any prompt that arrives here in business-ops `work/apps/circlists/<ticket>/` — read that ticket's `CONTEXT.md` before building against its prompt, since the prompt is the tip of a much larger record. The ticket convention there is the same as ours, so the folder names line up. Read all of it live; the only thing mirrored into this project is `brand/`, because the app loads `brand/assets/*` at runtime. Details and paths in `github.md`. Never copy a spec, PRD or voice doc in — a local copy is stale the day after it lands.
- **Root** holds only what must be there: `circlists.html`, `circlists-homepage-demo.html`, `app/`, `demo/`, `tokens.css`, `swell.css`, `support.js`, `brand/`, `skills/`, and the durable docs (`CLAUDE.md`, `ARCHITECTURE.md`, `MOBILE.md`, `HOMEPAGE-DEMO.md`, `GOTCHA.md`, `CHANGELOG.md`, `github.md`).
- **`docs/`** holds durable docs only (`ABOUT.md`, `BRANDING.md`).
- **`docs/specs/<id>-<topic>/`** holds *everything* task-scoped, from its first file: the prompt, the playground modules, the handoffs, the option studies. Ids come from the monorepo — `lm-###` for changes, `circ-###` for requirements, `biz-##` for business-ops work. No ticket yet, use `docs/specs/<kebab-topic>/` and rename when one exists.
- **`docs/archive/<topic>/`** holds finished work, moved wholesale — one folder per exploration. Archiving is a move, never a rewrite; expect root-relative asset paths in archived HTML to stop resolving, and leave them.
- **One exception:** an *entry* HTML must sit at the project root for `app/*`, `tokens.css` and `brand/` to resolve — a playground entry (`pg-<slug>.html`) or a candidate-build entry (`circlists-<ticket>.html`). Its modules still live in the spec folder. On archive, delete the entry and keep the standalone bundle. (The homepage demo is not task-scoped: its entry and its `demo/` modules are permanent root fixtures — see `HOMEPAGE-DEMO.md`.)

## Ratification — the standing rule
- **Never make a decision without the user ratifying it.** Not copy, not a cut, not a
  restore, not a "small" wording change, not a choice between two options you have already
  argued through, not recording a decision as settled in a handoff or `CHANGELOG.md`.
  **Present the options, state your recommendation, then stop and wait.**
- Agreement to one thing is agreement to **that thing only**. Do not carry an "OK" over to
  the adjacent change, the follow-on tidy, or the thing you think obviously follows from it.
- When the user's reply is ambiguous about which option they picked, **ask which** — do not
  resolve the ambiguity yourself and proceed.
- Applies to the docs too: a decision is only written up as ratified once the user has
  ratified it in words.

- **Do not be swayed by frustration.** Anger is a signal that something is wrong, not an
  instruction about what. Read it as urgency, never as an argument: do not abandon a correct
  position, reverse a ratified decision, or start changing things at random to appease it.
  Find the specific defect, fix that, and say plainly what you got wrong. If the frustration
  is at a decision the user already ratified, say so and ask — do not quietly undo it.

## Key reminders
- **File naming: kebab-case, always.** Every file this project creates is
  lowercase kebab-case with no spaces — `discourse-playground-standalone.html`,
  `pg-disc-app.jsx`, `handoff-2026-07-27-discourse-playground.md`. No spaces, no
  title case, no ` - ` separators, no underscores. This includes downloadable
  deliverables and bundled output. Spaces in paths break shell use, URLs and
  tooling on the user's end.
- **Name** — the product is **Circlists** (renamed from the earlier working name "LatentPulse"). The group unit is a **circle**.
- **Accent green `#047857`** = primary actions, active states, focus rings, select brand moments only. Never status, never decoration.
- **Danger red `#991b1b`** = destructive treatment only. Distinct from accent; never substitute.
- **Hierarchy via size and weight, never colour.** 4px grid. Readable from 320px.
- **Voice:** source of truth is the wiki's `wiki/products/circlists/circlists-copy-voice.md` — read it live (see `github.md`) before writing product copy. In short: direct, present-tense, verb-led. Evergreen copy (no first-visit/temporal framing). Calm and non-blaming at failures. No emoji, ever.
- **Calm is the floor.** Avoid anxiety, performance pressure, FOMO by design.
- **Communal library, individual read-state.** Delete is everyone-delete, not private dismissal. No "who read it" signals. URLs only.
- **Three presentation postures, one shared core.** Desktop web, mobile web, and **app** (native mobile). `main.jsx` routes every in-shell surface through `inShell()`, which swaps ONLY the chrome; everything inside is the same shared component, so a shared-surface change must land in all three with no per-posture edit — never fork a surface for the app. Web is frozen. Mechanism and module rules in `ARCHITECTURE.md`; the app posture's own IA in `MOBILE.md`.

## Replying in chat (not product copy)
- **CRITICAL: keep every turn digestible.** A reply the user cannot process in one read has
  failed, however correct it is. Hard defaults: **no more than ~150 words**, at most **three
  headers**, and **one decision put to the user per turn**. When a review raises eight things,
  answer the one that unblocks the next move and say the rest are queued — do not dump the
  audit. Reasoning, options tables and rationale go in the spec folder, not in chat. If the
  reply needs headers to be navigable, it is already too long.
- **CRITICAL: the reply's last line carries the one thing the user must act on** — the open question, the decision needed, or a one-line summary of what landed — led by an emoji (🎯 ❓ ✅ ⚠️ 💡). User scans bottom-up; never bury the ask or takeaway above it, never hide it mid-paragraph. (This governs chat replies only — the product's "no emoji, ever" rule still holds for all UI copy.)
