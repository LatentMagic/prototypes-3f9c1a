---
name: impeccable-local
description: Read before `skills/impeccable/SKILL.md`, every time it is used. The adapter for running Impeccable inside this project, where nothing can be executed: what replaces its Setup step, what it does with its own PRODUCT.md and DESIGN.md (nothing is created here), what to do by hand in place of its hooks, and which commands are unavailable. Opt-in: read it only on `$impeccable`, or when work genuinely needs critique depth beyond the standing pair named in `CLAUDE.md`; routine build work and a bare polish request do not fire it.
metadata:
  author: LatentMagic
  version: "1.0.0"
---

# Impeccable, in this project

`skills/impeccable/` is upstream's text, unmodified (see its `UPSTREAM.md`). It was written for a coding agent with a shell, hooks, a browser overlay and sub-agents. None of those exist here: a skill is a folder of text the agent reads. This file says what changes. Where it disagrees with upstream's `SKILL.md`, this file wins; where either disagrees with `CLAUDE.md`, `CLAUDE.md` wins.

## 1. Setup: replace step 1

Upstream's Setup step 1 runs `scripts/impeccable context`. That script is not here and cannot run. **Do not try, and never report a result from it.** Skip upstream's "Launcher unavailable" message too: it is for a launcher that failed, and there is none. Load the context by reading instead, in this order:

1. `CLAUDE.md` (its product block names where product truth and the design law live), then `tokens.css` (visual truth).
2. The files the target surface is built from, and at least one representative source of the incumbent look (tokens, CSS, a shared component).
3. For a convention-setting decision, the design law the product block names.

Then continue with upstream's steps 2 and 3 as written: load the one playbook that owns the request (the Commands table's reference, or `reference/new-work.md` for a new surface), and read `reference/craft-floor.md` immediately before any UI edit.

## 2. PRODUCT.md and DESIGN.md

- **There is no `PRODUCT.md` here, and none is created.** Upstream reads and writes one for product truth; this project keeps that truth on GitHub, and the product block at the top of `CLAUDE.md` names where. Wherever upstream reads `PRODUCT.md`, read the upstream sources the product block names instead. Wherever it writes one (`init`, a brand commitment, "record a standing preference in PRODUCT.md"), write nothing: say it in the reply, or, if it is a decision no spec holds yet, record it in the task's handoff under `docs/specs/`. Wherever it says "missing PRODUCT.md routes through init", read: the product block and its sources own it, and `init` is not run. If a kind of truth the work needs has no source named, say so in one line and ask the user; that is a question, not a reason to interview them. Upstream's "offering init afterward" is suppressed. The platform upstream expects to read there is web unless the product block says otherwise.
- **There is no `DESIGN.md`.** Do not write one, and do not document the design into one. Visual truth is `tokens.css` plus the design law and brand values the product block's sources name. Where upstream says "read DESIGN.md", read those. Where it says "replace DESIGN.md", that instruction does not apply: the visual language is already chosen.
- **Do not write other Impeccable artifacts:** no `.impeccable/`, no surface briefs, no direction-contract files. Where upstream says to record something there, say it in the reply or put it in the task's folder under `docs/specs/`.

## 3. Our visual law wins

`tokens.css` and the design law the product block names are binding. Impeccable supplies process and vocabulary, never a palette, a typeface, a "visual world", a new aesthetic direction, a blocks library or a rewrite of any project file from its own init flow. If a playbook says to choose or replace a visual language, that does not apply to this product's surfaces. "Redesign" here means information architecture and layout, not identity. Upstream's "refinement preserves; redesign replaces" holds for everything else.

`CLAUDE.md`'s ratification rule governs: upstream's "go all out, no hedging" is about craft, not authority. Present options, recommend one, stop and wait. Upstream's "verify in bounded passes" is compatible with ours: build, inspect once, fix in a batch, stop.

## 4. No hooks: do the checks by hand

Upstream's hooks run a detector after every UI edit and a deeper pass at the end of the turn. Neither runs here. Do both yourself, from upstream's own `reference/craft-floor.md`:

- **Before the first UI edit of a turn:** read `reference/craft-floor.md` (its "Verify" and "Refuse" lists). It says it expects a hook to enforce the mechanical checks; here you are the hook.
- **After each batch of UI edits:** check what you changed against the "Refuse" list line by line. A hit means rewrite that element.
- **Before ending a turn that touched UI:** run the "Verify" list against the rendered result, not the code, at phone and desktop width together in one round. If the user asked for `polish`, follow `reference/polish.md` as well. Claim only what you observed: contrast, overflow and spacing are readings from the render, not impressions. If you could not render it, say so.

The finish reviewer, the documenter, the asset producer and the manual-edit applier were sub-agents. They do not exist here; the review above replaces the first, and the rest are not replaced.

## 5. Commands

Available as read-and-follow playbooks (each is a table row in upstream's `SKILL.md` pointing at a file in `reference/`): `shape`, `extract` (propose the tokens and components to pull out; write nothing into a design-system file until the user ratifies it), `critique`, `audit`, `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize` (colour only from `tokens.css`; hierarchy stays size and weight, never colour, per `CLAUDE.md`), `typeset`, `layout`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `craft` (a deprecated alias for new-work), and `new-work` for a new surface. Where the product is native or adaptive, `adapt.native.md`, `audit.native.md`, `ios.md` and `android.md` apply as upstream says.

**Unavailable. Decline in one line and offer the nearest playbook:**

- `init` / `teach` — see section 2.
- `document` — there is no `DESIGN.md`.
- `live`, `generate` — they need the browser overlay. Offer `bolder`, `quieter` or `layout` on the source, or a playground (`skills/build-playground/`).
- `hooks`, `doctor`, `pin` — they manage state and shortcuts that do not exist.
- The no-argument command menu and workflow-selection questions (both were built from CLI context, and `reference/routing.md` is not shipped): ask which move the user wants, or pick the one the request implies, as upstream's own routing says for an explicit request.

**Steps inside the playbooks that cannot run: skip them, never fake them.** Any step that calls `scripts/impeccable` or names `detect`, `critique-storage`, `concept-seed`, `build-phase`, `generate-image`, `comp-spec`, `comp-diff`, `embed-prompt`, `serve-question`, `component-review` or `live-server`; any step that generates or captures an image or comp; any step that reads or writes `.impeccable/`. A sub-agent step that is a review is done by you, inline (see `critique` below); the documenter, asset producer and manual-edit applier are not replaced (section 4). In `new-work`, the dealt "roll" of directions is made by a script: instead, lay out the directions yourself, recommend one, and stop and wait. This overrides upstream's "no substitute, no skip" for the roll: that rule protects a script that is not here. A detector result you did not observe is never reported.

**`critique` is run by you, in two passes, one after the other, in place of its two sub-agents.** Upstream's own fallback applies: finish and record Assessment A (the design review, from the source and, where you can render it, the rendered page), then do Assessment B, then synthesize. Assessment B's detector cannot run, so do it by hand: check the surface against upstream's detector categories and `reference/craft-floor.md`'s "Refuse" list, reporting only what you observed. Do not let B's findings shape A. The report's first line is the banner upstream requires for a degraded run: `⚠️ DEGRADED: single-context (no sub-agents or detector in this environment; Assessment B done by hand)`. Upstream's "a skipped detector is a failed critique" does not apply to a detector that is not there; a skipped Assessment A or B does.

## 6. Where it fits

`critique`, `audit`, `polish`, `clarify`, `layout` and `typeset` on surfaces that already exist. `shape` and `new-work` only inside a playground (`skills/build-playground/`), never straight into `app/`.

## 7. Not shipped

The files left out of `skills/impeccable/` are listed in its `UPSTREAM.md`. Links to them in upstream's `SKILL.md` and references will not resolve; that is expected.
