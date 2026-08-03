# Project: Circlists

## Reference docs — read when relevant
- `ARCHITECTURE.md` — app-wide structure: one app / three postures, how `inShell()` swaps only the chrome, deletable aids and droppable modules, the web-only-payments guard, code conventions. Read before touching routing, shells, or module load order.
- `MOBILE.md` — the app posture (native mobile): its two chrome states, containers, push motion, the chrome-vs-surface test for home, and the checklist for maintaining app and web together. Read before any app-posture work.
- `CHANGELOG.md` — major milestones over time (not granular). Read to catch up on where the product has been.
  - **Editing rule (strict):** one entry per *significant landed step* — a feature introduced, a rebrand, a model change, or a **fundamental change to how the app works or is structured** (an information-architecture rework, consolidating an overloaded concept, a flow being reshaped) even when it originates as a bug fix. What matters is whether the *shape* of the product changed, not the label on the task. NOT for iterative work: refinements, cosmetic bug fixes, size/spacing/timing tweaks, seed-data changes, enabling an option, renaming a key, motion detail, etc. never get their own entry or bullet.
  - Do NOT keep amending an entry as you iterate within a feature — the entry captures the *shape* of the step, written once, and then left alone. When in doubt, add nothing and ask. A single terse title + 2–4 shape-level bullets is the ceiling.
- `docs/ABOUT.md` — what the product is, who it's for, how it's sold, emotional intent, and the deliberate NOTs. Durable product essence.
- `brand/circlists-brand.md` — the Circlists brand pack: palette, mark, wordmark, lockup, type. Source of truth for all brand assets; the SVGs and raster set (favicons, PWA icons) live in `brand/assets/`, generators in `brand/scripts/`. The pack mirrors the company wiki (linked in `brand/README.md`) and may be overwritten by future syncs.
- `wiki/` — mirror of the company wiki's Circlists directory (product entity, positioning, homepage, marketing strategy, **copy voice**). `wiki/circlists-copy-voice.md` is the source of truth for copy voice — read it before writing any product copy. May grow stale; re-uploaded wholesale on sync. The wiki's `brand/` subdirectory lives at the **project root** (`brand/`), not under `wiki/`, because the app loads `brand/assets/*` at runtime by that path.
- `docs/BRANDING.md` — thin pointer to `brand/`, noting it's a manual copy of the wiki's brand directory.
- `brand/motion/circlists-motion.md` — spec for the mark's motion (pulse/spinner/micro keyframes, timings, curves). The `<style>`/`@keyframes` block gets stripped from the SVGs on upload, so the shipped `brand/motion/*.svg` files are static — do not treat that as a defect and do not edit them. When you need the motion, refer to this markdown spec as the source of truth for the curves, timings, and keyframes.
- `PLAYGROUND.md` — conventions for building playgrounds. Currently a deliberate placeholder; when you build a playground, read it and populate it with what actually helped so future playgrounds get easier.
- `GOTCHA.md` — hard-won, non-obvious traps (overlay/sheet motion, sandbox verification pitfalls). Read before touching animated overlays or "verifying" a mount transition.
  - **Editing rule:** only add an entry when the user approves it — do not append gotchas unprompted. Keep each entry terse: symptom → cause → fix → rule.
- `skills/frontend-ui-engineering/SKILL.md` (+ `references/accessibility-checklist.md`) — code-quality bar for building or reorganising the `app/` UI: composition, focused components (split past ~200 lines), state-management fit, WCAG 2.1 AA, and the anti-AI-aesthetic rules. Read before non-trivial UI work or refactors. It reinforces conventions the app already follows — deletable aids, `window`-based module decoupling, container/presentation split — so keep those intact when editing.

These distil the durable essence. For exact tokens, components, and visual style, this project's own `tokens.css` and the brand pack (`brand/circlists-brand.md` + its SVGs) are the binding source — when in doubt on a specific value, they win. (Voice and the destructive-red `#991b1b` are captured in Key reminders below, not the pack.)

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
- **Voice:** direct, present-tense, verb-led. Evergreen copy (no first-visit/temporal framing). Calm and non-blaming at failures. No emoji, ever.
- **Calm is the floor.** Avoid anxiety, performance pressure, FOMO by design.
- **Communal library, individual read-state.** Delete is everyone-delete, not private dismissal. No "who read it" signals. URLs only.
- **Three presentation postures, one shared core.** Desktop web, mobile web, and **app** (native mobile). `main.jsx` routes every in-shell surface through `inShell()`, which swaps ONLY the chrome; everything inside is the same shared component, so a shared-surface change must land in all three with no per-posture edit — never fork a surface for the app. Web is frozen. Mechanism and module rules in `ARCHITECTURE.md`; the app posture's own IA in `MOBILE.md`.

## Replying in chat (not product copy)
- **CRITICAL: the reply's last line carries the one thing the user must act on** — the open question, the decision needed, or a one-line summary of what landed — led by an emoji (🎯 ❓ ✅ ⚠️ 💡). User scans bottom-up; never bury the ask or takeaway above it, never hide it mid-paragraph. (This governs chat replies only — the product's "no emoji, ever" rule still holds for all UI copy.)
