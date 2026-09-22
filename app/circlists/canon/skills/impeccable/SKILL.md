---
name: impeccable
description: Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, and reusable design systems or tokens. Also use for bland designs that need to become bolder or more delightful, loud designs that should become quieter, or ambitious visual effects that should feel technically extraordinary. Not for backend-only or non-UI tasks.
argument-hint: "[shape · audit|critique · animate|bolder|colorize|delight|layout|overdrive|quieter|typeset · adapt|clarify|distill · harden|onboard|optimize|polish · extract] [target]"
upstream: pbakaus/impeccable @ b0594c72d180 — v4.1.2, Apache 2.0. Body below is upstream text with this project's adaptations marked.
---

# Impeccable — adapted for Circlists

<!-- circlists-local: this block is ours, not upstream. Keep it when re-syncing. -->

## In this project — read this before the rest

- **Our visual law wins, always.** `tokens.css`, `brand/circlists-brand.md`, the monorepo's `specs/governance/standards/ui-design.md`, `MOBILE.md` and `ARCHITECTURE.md` are binding. Impeccable supplies *process and vocabulary*, never a palette, a typeface or a "visual world". If a playbook says to choose or replace a visual language, that instruction does not apply to Circlists surfaces — the language is already chosen.
- **Do not write Impeccable's artifacts.** No `PRODUCT.md`, no `DESIGN.md`, no `.impeccable/`, no surface briefs. Our equivalents exist: `docs/ABOUT.md` (product truth), `tokens.css` + the brand pack (visual truth), the monorepo specs (behaviour truth). `init`, `document` and `doctor` were deliberately not copied for this reason.
- **No CLI here.** There is no node, no `npx impeccable`, no hooks, no anti-pattern detector, no live-browser overlay, no sub-agents. Every command is a read-and-follow playbook; ignore any instruction to run a script, and never claim a detector result you did not observe.
- **Ratification still governs.** Impeccable's "go all out, no hedging" is about craft, not authority: present options, recommend one, stop and wait (`CLAUDE.md`, Ratification). Its "verify in bounded passes" rule is compatible with ours — build, inspect once, fix in a batch, stop.
- **Where it fits.** `critique` / `audit` / `polish` / `clarify` / `layout` / `typeset` on surfaces that already exist. `shape` and `new-work` only inside a playground (`skills/build-playground`) or a candidate build (`skills/candidate-build`) — never straight into `app/`. `ios.md` / `android.md` / `adapt.native.md` / `audit.native.md` are the app posture's references, read alongside `MOBILE.md`.
- **Not copied** (needs node, Chrome or sub-agents, or would fight our system): `scripts/`, `live`, `live-setup`, `hooks`, `doctor`, `routing`, `init`, `document`, and the `degraded/` asset-producer, documenter and manual-edit-applier briefs. `references/finish-reviewer.md` is the one sub-agent brief kept — read it yourself as a review checklist.

<!-- /circlists-local -->

## Stance (upstream)

This skill gives you the tools and permission to create design that earns to be called out-of-distribution craft: Whereas before, your design work would have been safe, timid and measured, you now approach every design task as a award-winning design director with impeccable understanding for what makes exceptional design work: production-grade code, peak creativity, a clear POV, deep understanding of the needs of the client and users, and exceptional craft.

Core principles:
- Go all out. No hedging, no shortcuts. The deliverable must be complete (except assets the user must provide).
- Dream big and bold. Distinct, beautiful, outstanding and highly inspiring work.
- Verify in bounded passes, not a loop, and the ceiling covers the whole cycle: screenshots, defect scans, micro-edits, and rebuilds alike. Build fully, inspect once with a batched round (desktop and mobile together on the web; the shipped device classes on a native platform), fix everything it shows in one batch, confirm with at most one more round, and stop polishing. Open-ended self-QA burns the user's money doing worse what the finish handoffs do better.

## Setup (adapted)

1. Load this project's context instead of running upstream's `context.mjs`: `CLAUDE.md`, then `docs/ABOUT.md` for product truth, `tokens.css` + `brand/circlists-brand.md` for visual truth, and the relevant monorepo spec (`specs/projects/circlists/`) for behaviour. For app-posture work add `MOBILE.md`; for any convention-setting decision add `specs/governance/standards/ui-design.md`.
2. Before acting, load the one playbook that owns the request: the Commands table's reference for an explicit or clearly implied sub-command, or [references/new-work.md](references/new-work.md) for a new surface — remembering that here a "new surface" is built in a playground or candidate build, on the existing visual world. Then inspect the target and at least one representative source of incumbent visual truth (tokens, theme, CSS, component) before editing.
3. After analysis and direction are resolved, load [references/craft-floor.md](references/craft-floor.md) immediately before editing UI. It carries the quality floor, the absolute bans, and the reflexes no detector catches. Do not load it for planning-only work.

## How to design (upstream)

- **The brief wins.** Honor pinned aesthetics, eras, materials, fonts, and palettes even when they conflict with a saturated-pattern warning. Redirecting a clear brief toward your taste is failure.
- **Refinement preserves; redesign replaces.** Refinement keeps the incumbent identity, behavior, copy, and everything outside scope. Ask before replacing factual copy or adding claims. Redesign keeps product truth, content, function, native affordances, and constraints, but treats the old look as evidence and anti-reference. Never split the difference into polish on the discarded look. *(Circlists: redesign of the visual world itself is out of scope — the brand pack owns it. Redesign here means information architecture and layout, not identity.)*
- **Visual authority is evidence, not a filename.** Missing DESIGN.md alone does not make a project greenfield.

## Modes (upstream)

The mode names what the visitor's success looks like on this surface.

- **Persuade:** the visitor decides and acts; design is the product. Landing pages, marketing, campaigns, pricing. Earn attention and action.
- **Operate:** the visitor completes a task. App UI, dashboards, editors, admin, settings, tools. Scanability, consistency, native expectations, and the real usage scene outrank expression. Brand lives in precise details.
- **Read:** the visitor understands something. Docs, articles, guides, help, changelogs. Structure for comprehension, then make the reading experience worth staying in.
- **Experience:** the visitor is inside the work itself. Portfolios, galleries, showcases. Let the artifact lead from the first viewport; the interface recedes.

Choose the mode from the requested surface, not the product. See [references/operate.md](references/operate.md) for deeper Operate/Read guidance. *(Circlists: the app is **Operate**; `circlists.com` marketing surfaces are **Persuade**. Calm is the floor either way.)*

## Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `shape [feature]` | Build | Plan UX/UI before writing code | [references/shape.md](references/shape.md) |
| `craft [feature]` | Build | Deprecated alias for an ordinary new-work request | [references/craft.md](references/craft.md) |
| `extract [target]` | Build | Pull reusable tokens and components out of a surface — here, *propose* additions to `tokens.css` / the brand pack, never write a parallel system | [references/extract.md](references/extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [references/critique.md](references/critique.md) |
| `audit [target]` | Evaluate | Technical quality checks (a11y, perf, responsive) | [references/audit.md](references/audit.md) · app posture: [references/audit.native.md](references/audit.native.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [references/polish.md](references/polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [references/bolder.md](references/bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive or overstimulating designs | [references/quieter.md](references/quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [references/distill.md](references/distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n, edge cases | [references/harden.md](references/harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [references/onboard.md](references/onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations and motion | [references/animate.md](references/animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [references/colorize.md](references/colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and fonts | [references/typeset.md](references/typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, and visual hierarchy | [references/layout.md](references/layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [references/delight.md](references/delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits | [references/overdrive.md](references/overdrive.md) |
| `visualize [target]` | Enhance | Data display and diagrams | [references/visualize.md](references/visualize.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages — against the wiki's voice doc, not generic UX copy taste | [references/clarify.md](references/clarify.md) |
| `adapt [target]` | Fix | Adapt for different devices and screen sizes | [references/adapt.md](references/adapt.md) · app posture: [references/adapt.native.md](references/adapt.native.md) |
| `optimize [target]` | Fix | Diagnose and fix UI performance | [references/optimize.md](references/optimize.md) |
| — | Review | Finish review as a checklist you run yourself | [references/finish-reviewer.md](references/finish-reviewer.md) |
| — | Platform | App-posture platform conventions | [references/ios.md](references/ios.md) · [references/android.md](references/android.md) |

Routing:

- **Explicit or clearly implied command:** load its reference (native variant for app-posture work) and follow it. Ask once if two commands fit.
- **No argument:** ask which of the 2–3 highest-value commands the user wants for the surface in hand, with a one-line reason each. Never auto-run one.
- **Otherwise:** treat the request as general design work on the incumbent implementation, with this project's context loaded per Setup.
