# Upstream and downstream repos

This project is the **prototype workspace** for Circlists. It sits in the middle
of a four-repo working context: intent is refined upstream, the prototype is
built here, and it is published downstream for development to build against.

Read all of it live. Only `brand/` is mirrored into this project.

```
business-ops  ──►  this project  ──►  prototypes-3f9c1a
(refine intent)    (build the rig)    (publish for dev)
       ▲                  ▲
       └── wiki ──────────┴── monorepo (spec + governance)
```

## business-ops — where the work comes from

repo: LatentMagic/business-ops
branch: main
path: work/apps/circlists/

The context space. This is where product intent is refined, disambiguated and
turned into tickets, and it is where the prompts that arrive here are drafted.
**It follows the same ticket convention we do** — one folder per ticket,
`<id>-<topic>`, `_archive/` for finished work. Read the ticket folder before
building against a prompt from it; the prompt is the tip of a much larger
reasoning record.

Per ticket folder:
- `CONTEXT.md` — the index. Goal, "Read first", "Now", the checklist, references.
  Start here, always.
- `_context/` — the accreting detail: `decisions.md` (ratified, pillar by
  pillar), `journal.md`, `reference.md` (standing constraints), `invariants.md`,
  `blind-spots.md`, `open-items.md`, `spec-impact.md`.
- `_resources/` — prompts, research, ideation, brain dumps, playground bundles.
- `_outputs/` — the epic and sub-issue plans that leave the folder.

It owns none of the truth: the monorepo spec is canonical for behaviour, the
wiki holds vetted product knowledge.

## monorepo — the spec and the governance

repo: LatentMagic/monorepo
branch: main

**Project specs** — `specs/projects/circlists/`: the stable set. `prd.md`,
`hld.md`, `ui.md`, `glossary.md`, plus `requirements/CIRC-###-*.md` and
`changes/LM-###-*/`. Canonical for behaviour. Cite by path and id; never copy in
(`ui.md` alone is 145KB). The code that makes it manifest is also in this repo,
and does not need reading for design work.

**Governance** — `specs/governance/`, catalogued in its `INDEX.md`. Two docs
bear directly on what we do here:
- `specs/governance/standards/ui-design.md` — **cross-app UI design law**, and
  binding: domain-aligned placement, responsive-by-default/adaptive-by-exception,
  consistent affordances, prefer-a-statement-to-a-disabled-control, non-flicker
  loading, rationed confirmation, deferred validation, focus restoration, touch
  floor. Read it before any design decision that sets a convention.
- `specs/governance/process/design-prototypes.md` — how our output is treated
  downstream (below).

## wiki — vetted product knowledge

repo: LatentMagic/wiki
branch: main
path: wiki/products/circlists/

Longstanding information: copy voice (`circlists-copy-voice.md` — read it live
before writing product copy), positioning, homepage, marketing. Its `brand/`
subdirectory is the **one thing mirrored here**, at the project root as
`brand/`, because the app loads `brand/assets/*` at runtime by that path.

## prototypes-3f9c1a — where this project is published

repo: LatentMagic/prototypes-3f9c1a
branch: main
path: app/circlists/

Downstream. This project is published there as `app/circlists/canon/` — a
snapshot of the workspace, including its docs — and served through a console at
`latentmagic.github.io/prototypes-3f9c1a`, which carries both the rendered
surface and the source. `app/circlists/next/` is a second state; the console is
where which states exist is read, not here. Also holds `homepage/`, `motion/`
and `brand/`.

Governance is explicit that what we ship is **a prototype, not a specification**
(`specs/governance/process/design-prototypes.md`): visual intent — design
language, tokens, layout, typography — is binding, and copy is direction rather
than contract, but implementation choices (animation, component selection,
structural markup) are re-evaluated against the real component library during
planning. Build for intent; do not expect the markup to survive.

## The mirroring rule

Mirror only what the app loads at runtime. That is `brand/` and nothing else.
Anything else needed from upstream gets read at the moment it is needed, so it
is never stale.

## Last sync

date: 2026-09-25T13:50:01Z
monorepo: read live — `specs/projects/circlists/ui.md` Decision-29 (the New pill's
accept: spinner in the pill's face, spent fade, silent failure) and Decision-31 (no
minimum beat), grounding LM-786 sort's pill loading. Nothing mirrored; no commit sha
resolved.

### Updated in this project
- LM-786 sort: one order per circle for the visit; the New pill loads in both
  orders and, under oldest first, switches to newest first once the cards land;
  refresh never changes the order; the sort control loads the new order's first
  page. Handoff in `docs/specs/lm-786-sort/`.

## Previous sync

date: 2026-09-24T11:26:21Z
wiki: read live — `wiki/products/circlists/circlists-copy-voice.md` (voice check for
History's empty-state copy). business-ops: fetched one LM-786 prompt image
(`lm-786-feed-controls/_outputs/prompts/2026-09-24_history-end-line.png`) to test
whether the prompt's linked images can be read; the copy was deleted afterwards.
Nothing mirrored; no commit sha resolved.

### Updated in this project
- LM-786: the Read tab is now History (every card), with the "Include cards in
  Active" switch, paging on both tabs, the failed-load foot and History's end line
  (`app/feed-history.jsx`, `main.jsx`). Handoff in `docs/specs/lm-786-history/`.

## Previous sync

date: 2026-09-21T08:23:34Z
monorepo: read live — `specs/governance/standards/ui-design.md` (the binding
cross-app design law) and `specs/projects/circlists/requirements/`
`CIRC-034-see-which-circles-hold-something.md`, both grounding LM-652 work on
home’s Conversations panel and the in-circle returns bar. Searched
`specs/projects/circlists/` for the returns bar and found nothing: the bar is
not specced upstream yet, so the prototype is ahead of the spec here. Nothing
mirrored; no commit sha resolved (tree hash only).

### Updated in this project
- Home’s Conversations panel recomposed (`app/home-returns.jsx`): the
  per-circle headings are gone, the circle now reads on each row’s metadata
  line beside who spoke, and the head carries intent rather than a count —
  CIRC-034 states the home raises no count of any kind.
- The in-circle returns bar gained one act (`app/talk-return.jsx`): a footnote
  "Clear" at the foot of the open panel, which moves `talkSeenAt` forward on
  every watched card and marks nothing read.
- Row separators and hover geometry fixed in both: hairlines sit between rows
  only, sharing the hover fill’s edges, with the fill stopping clear of them.

## Previous sync

date: 2026-09-14T10:44:02Z
prototypes-3f9c1a: pulled from `app/circlists/canon/` (branch main) — this was a
reverse sync, not the usual publish-out. Work happened in a separate clone of
this project while the workspace was offline, and landed in the downstream
canon copy instead of here first. Brought back: `circlists.html`, `tokens.css`,
`swell.css`, `support.js`, `playgrounds.html`, `playgrounds.json`, and all of
`app/*.jsx` (7 new files, 16 changed, 14 unchanged). `brand/` assets differed
only by C2PA provenance metadata baked in by whatever tool touched them —
content unchanged, left alone. Root docs (`CLAUDE.md`, `ARCHITECTURE.md`,
`MOBILE.md`, `GOTCHA.md`, `CHANGELOG.md`, this file) and `docs/specs/` /
`docs/archive/` were NOT overwritten — canon's copies are missing ticket
folders this workspace has (`docs/specs/_handoffs`,
`docs/specs/switch-off-track-contrast`), so a blind overwrite would have lost
work; those need a real two-way reconciliation, not a pull. No commit sha
resolved (tree-only copy).

### Updated in this project
- Feed gained sort, lens (view/filter panel), saved, search and card-share
  surfaces (`app/feed-sort.jsx`, `feed-lens.jsx`, `feed-saved.jsx`,
  `feed-search.jsx`, `card-share.jsx`), plus `app/home-returns.jsx` and
  `app/not-found.jsx`. `main.jsx`, `home.jsx`, `states.jsx`, `spaces.jsx` and
  others grew substantially to wire these in.
- Add-surface direction 2: the writing face's placeholder is now
  "Say why you're sharing it, or leave it blank." — the Swell caption's own
  command + command construction, which is what makes it parse.

## Previous sync

date: 2026-08-17T10:25:35Z
wiki: read live — `wiki/products/circlists/circlists-copy-voice.md` (voice check for the
add surface's Swell caption). Nothing mirrored; no tree/commit resolved this turn.

### Updated in this project
- Add-surface whiteboard: The Swell's framing lever resolved to a single caption
  under the disc, no heading. Copy vetted against the wiki's voice rules.

## Previous sync

date: 2026-08-14T15:34:00Z
monorepo tree: 3a7d49e49ac9
wiki tree: f77c6f4e1789 (wiki/products/circlists/)
business-ops tree: 4c6ce4b9ae73 (work/apps/circlists/)
prototypes tree: 4dea94e0f327 (app/circlists/)

### Updated in this project
- Reorganised onto the `docs/specs/` → `docs/archive/` standard.
- Deleted the local `wiki/` mirror and the local PRD copy; both read live now.
- Mapped the full four-repo working context here, replacing a three-repo note.

## Screen map

| Surface | Built from |
| --- | --- |
| `circlists.html` + `app/*` | monorepo `specs/projects/circlists/ui.md`, `hld.md`; governance `standards/ui-design.md` |
| `pg-*.html` rigs | a prompt in business-ops `work/apps/circlists/<ticket>/_resources/prompts/` |
| brand assets (`brand/`) | wiki `wiki/products/circlists/brand/` |
| product copy | wiki `wiki/products/circlists/circlists-copy-voice.md` |
