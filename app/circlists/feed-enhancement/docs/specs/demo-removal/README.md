# demo-removal — working notes

The prompt: the prototype is only the app; every file and line of prose describing,
building, or maintaining the homepage demo is removed. The app's generic capabilities
(preview gate + `window.CIRC_FORCE_GATE`, tolerance of absent aid and droppable
modules, `window.CIRC_STATE_KEY`, `window.CIRC_TWEAK_DEFAULTS`, the baked-in
favicons and preview images) stay untouched.

## What the demo was, before removal — 2026-09-13

Three files, plus prose. Nothing in `app/` was ever demo-specific: the demo derived
from the app by **omitting** modules, never by editing a survivor.

| File | What it held |
|---|---|
| `circlists-homepage-demo.html` | the demo entry, at the root beside `circlists.html`. **The entry was the manifest** — the downstream build read its `<script>` tags to know which modules to compile and in what order, so an unlisted module was simply not in the demo. Its head comment carried the omitted-files table and the reason for each omission. |
| `demo/demo-overlay.jsx` | loaded first, before every app module. Armed the preview gate (`window.CIRC_FORCE_GATE = true`) and set the demo's own persisted-state key (`window.CIRC_STATE_KEY`). Deliberately did **not** set `window.CIRC_TWEAK_DEFAULTS`. Nothing else. |
| `demo/demo-seed.jsx` | the demo's **own** seed, loaded instead of `app/seed-data.jsx`, publishing the same surface (`window.CircSeed = { M, IT, seedSpaces, DEFAULT_USER }`). Hand-written parallel content: two circles doing the ordinary thing well. Its content was a proposal, meant to be swapped by editing the two space blocks. |
| `HOMEPAGE-DEMO.md` | the doc: what the demo was for, the file table above, the omitted-module list with the reason each was unreachable, and the "keeping it alive" rules. |

Modules the demo omitted (each guarded in `main.jsx`, so absent ⇒ shipped behaviour):
`app/seed-data.jsx` (replaced by the demo seed), `app/talk-data.jsx` (dev-seed discourse
fixtures), `app/config.jsx`, `app/states.jsx`, `app/states-ui.jsx`,
`app/circ-tweaks.jsx`, `app/tweaks-panel.jsx`, and `app/invite-link.jsx`.

Standing rules that went with it: the demo seed did not inherit from `app/seed-data.jsx`,
so any seed change was two changes and had to bump `window.CIRC_STATE_KEY` in the overlay,
with silence — not an error — as the failure mode; and whether a merged candidate feature
appeared in the demo was always a separate owner decision.

The demo is now built and maintained outside this project. The capabilities it used
survive here, generically: the preview gate and its `window.CIRC_FORCE_GATE` switch,
the app tolerating absent aid and droppable modules, `window.CIRC_STATE_KEY`,
`window.CIRC_TWEAK_DEFAULTS`, and the baked-in favicons and preview images under
`uploads/card-favicons/` and `uploads/card-previews/`.

## What was removed here

### Files deleted

`circlists-homepage-demo.html`, `demo/demo-overlay.jsx`, `demo/demo-seed.jsx`, the `demo/`
folder, `HOMEPAGE-DEMO.md`. No launcher, index or `playgrounds.json` row linked the entry.

### Rewordings — capabilities described on their own terms

| Where | Was | Now |
|---|---|---|
| `app/main.jsx` (tweak fallback) | "the delete-only homepage-demo derivation drops them" | "a build that omits the aids drops them" |
| `app/main.jsx` (aid handles) | "delete-only homepage-demo derivation" | "a build can omit any of them" |
| `app/main.jsx` (preview gate) | "in the exported homepage demo: set `window.CIRC_FORCE_GATE`… in the embed" | "from an embedding page: set `window.CIRC_FORCE_GATE = true` before the app mounts" |
| `app/config.jsx` | "the omission-based homepage-demo derivation can drop the whole aid" | "a build can drop the whole aid" |
| `app/states.jsx` | "The homepage-demo entry simply does not list them." | "A build that omits the aids simply does not list them." |
| `app/spaces.jsx` | "which is how the homepage demo omits it" | "which is how a build can omit it" |
| `uploads/circlists-favicons/README.md` | "so the homepage-demo build can stop calling Google's live favicon service" | "so no build has to call Google's live favicon service" |
| `skills/impeccable/SKILL.md` | "the app and the homepage demo are **Operate**" | "the app is **Operate**" |

Removed outright: the `HOMEPAGE-DEMO.md` doc-list bullet, the root-inventory entries,
the candidate-build parenthetical and the whole "Seed data — the standing rule" section
in `CLAUDE.md`; the derivation sentence in `ARCHITECTURE.md`; the demo entry in
`docs/specs/CLAUDE.md`'s merge step; step 6 of `skills/candidate-build/SKILL.md`.

`docs/archive/`, handoffs and `CHANGELOG.md` are untouched — they record the past.

Also dropped: the "homepage-demo framing" mention in `CLAUDE.md`'s `design-taste-frontend`
bullet and in that skill's own Circlists block (marketing surfaces and option studies stand).
