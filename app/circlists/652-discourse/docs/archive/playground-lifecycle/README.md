# Playground lifecycle — where rigs live, how they're found, what we keep

Status: **settled 2026-08-18.** What landed is in §6; §1–5 is the reasoning record.

The ask bundled three complaints. They have three different causes and three
different fixes, and only one of them is about playgrounds at all.

---

## 1. What's actually wrong

### (a) The root is a mixed bag with no kind
Root currently holds `circlists.html` (the product), `circlists-homepage-demo.html`
(a permanent fixture that ships), `circlists-lm652.html` and
`circlists-lm666.html` (candidate builds), and — by the rule in `CLAUDE.md` —
every live playground entry too. Four *kinds* of thing, one flat list, no marker
of kind, no marker of life. A filename carries a slug and nothing else: not the
question it answers, not the date, not whether it's dead.

So: you can't tell what to open, and you can't tell what to delete. Those are the
same defect.

### (b) Nothing declares when a rig dies
A playground answers one question. Once the question is answered, the rig is
spent — but nothing in the process says so, so it lingers at root looking exactly
as live as the product. `docs/specs/README.md` tries to hold the state ("Live" /
"Settled but not yet archived") and is already out of date: it points at
`pg-discourse-v10.html` at root, which has since moved into
`docs/specs/lm-652-discourse/archive/`.

### (c) The download is slow — but not because of the specs
Measured, not guessed:

| Thing | Size |
|---|---|
| `uploads/discourse-playground-v7-standalone.html` | **5.90 MB** |
| `docs/specs/lm-652-discourse/discourse-playground-v4-standalone.html` | **1.74 MB** |
| `…/archive/pg-discourse-v9-standalone.html` | **1.76 MB** |
| `…/archive/pg-return-v12-standalone.html` | **1.77 MB** |
| `…/archive/pg-thought-stack-standalone.html` | **1.70 MB** |
| five bundles, total | **≈ 12.9 MB** |
| whole of `app/` (21 files, the actual product) | **0.36 MB** |
| a typical playground module (`pg-d9-app.jsx`) | 15 KB |
| a typical screenshot | 20–130 KB, and there are ~180 of them |

The hoarding instinct is not the problem. **All the JSX and markdown you have
ever kept is a rounding error** — the product itself is 360 KB. The weight is
(i) standalone bundles, which inline React + Babel + fonts and cost ~1.7–6 MB
*each*, and (ii) ~180 loose PNGs in `uploads/` and `screenshots/`. File *count*
(~450) also taxes the zip independently of bytes.

That reframes the retention question: you can keep every word of the reasoning
record forever at negligible cost. What you cannot keep for free is the
**runtime** — bundles and screenshots.

---

## 2. Root placement isn't actually required — proved

`CLAUDE.md` says an entry must sit at root so `app/*`, `tokens.css` and `brand/`
resolve. That's true of a naive entry, and it's the reason archived rigs go dark.
It's fixable with one line. `docs/specs/playground-lifecycle/base-href-probe.html`
is a live probe of a nested entry with `<base href="../../../" />`:

- `tokens.css` — **loads** (`--color-accent` = `#047857`)
- `brand/assets/circlists-wordmark.svg`, referenced root-relative *from inside
  `app/brand-motion.jsx`* — **loads**
- `<script type="text/babel" src="app/primitives.jsx">` — **does not load.**
  Babel fetches `src` itself and ignores `<base>`.

So the rule for a nested entry is exactly two mechanical things:

1. `<base href="../../../" />` in `<head>` — fixes CSS, favicons, and every
   root-relative asset path inside app code.
2. Babel `src=` paths written out relative: `src="../../../app/main.jsx"`.

The host preview prints a "referenced file not found" warning for the base-relative
paths. It's a false positive; the page loads.

---

## 3. Options

### Option 1 — Kind-prefix at root, nothing moves
Keep entries at root, make the kind legible in the name (`pg-…`, `cand-…`) and
add a register. Cheapest. Doesn't fix the blur — root still mixes product with
scratch, and clear-out is still a judgement call per file.
**Cost:** the root keeps growing; the register rots (it already has).

### Option 2 — Root is only what *is* the product (recommended)
Root holds exactly four entries, permanently: `circlists.html`,
`circlists-homepage-demo.html`, and the candidate entries `circlists-<ticket>.html`
(they *are* the app, unratified — that's why they belong). **Every playground entry
moves into its ticket folder** next to its modules, using the `<base href>` rule
above.

- Root becomes self-describing: if it's at root, it's the product.
- A rig is one self-contained folder: prompt, modules, entry, handoffs. Archiving
  becomes a move that **still works** (adjust the base depth once), instead of a
  move that kills the rig.
- Clear-out becomes folder-level, not file-level: delete a topic, not fourteen files.
- **Cost:** a rig is two clicks deeper, and every nested entry carries the base
  line. Nested playgrounds are also where the preview's false 404 warning shows up.

### Option 3 — Option 2 + a workbench surface
`workbench.html` at root: one page listing every rig — ticket, the question it
answers, date, status (live / settled / dead), link. Fed by a hand-kept
`docs/specs/register.md`, written as part of building a rig.
**Cost:** a surface to maintain, and it's the kind of thing that goes stale
silently. Worth it only if the folder view still hurts after Option 2 — a menu
over a tidy shelf is nice; a menu over a mess is a second mess.

---

## 4. Retention — proposed policy

Keep the paper, drop the runtime.

- **Keep forever** (cheap, and it's the reasoning record): handoffs, prompts,
  ideation, postmortems, playground modules (`.jsx`), the entry HTML.
- **Never keep** in-project: standalone bundles. They're a *delivery* artefact —
  generate, download, delete in the same session. This alone is ~12.9 MB.
  (`uploads/discourse-playground-v7-standalone.html`, 5.9 MB, is the single
  heaviest file in the project.)
- **Prune on archive:** screenshots. A handoff that quotes a screenshot keeps it;
  the other 170 go. `uploads/` is the worst offender because the preview drop
  history accumulates there untouched.
- **Sunset, don't hoard, at folder level:** when a topic is archived, it moves
  wholesale; when a topic has been archived for a quarter and the work shipped,
  the folder can go — the durable statement of what happened lives in
  `CHANGELOG.md` and upstream in business-ops, not here.

Expected effect of one clear-out under this policy: ~13 MB of bundles, ~8–10 MB of
screenshots, ~200 files off the count. That's the minute.

---

## 6. What landed

- **Placement.** A playground entry lives in `docs/specs/<ticket>/playground/` with its
  modules. Candidate builds (`circlists-<ticket>.html`) stay at the root — they *are* the
  app. State is where the folder lives: `docs/specs/` is active, `docs/archive/` is done.
- **`playgrounds.html`** at the root is a read-only launcher: ticket, its candidate build,
  its rigs, and a link to the folder. Its `INDEX` is derived from the tree and regenerated
  when rigs move.
- **No config surface.** An interactive version (state dropdowns, pin, waiting-on, a
  pending-edits bar over `localStorage`) was built and rejected: the store is wiped too
  easily to be a source of truth, and a config UI is a worse version of asking the agent,
  which writes the change permanently first time. Kinds collapsed to two — `candidate` and
  `playground`; whiteboard is a rig shape, not a kind.
- **No per-ticket metadata file.** `ticket.md` was proposed and rejected: this project is
  design, and that record belongs in business-ops.
- **The clear-out** ran under §4: ~30 MB and ~150 files (5 bundles, 76 loose screenshots,
  duplicated `uploads/brand|motion|skills`). `uploads/card-previews/` and
  `uploads/card-favicons/` are load-bearing and stay.

---

## 5. Recommendation

**Option 2 now** (placement rule + `<base href>`), **the retention policy
alongside it**, and **Option 3 only if the folder view still hurts**.

The order matters: tidying placement makes the register nearly unnecessary, and
building the register first means maintaining a map of a mess.

### Self-critique
- The base-depth line is a hand-maintained magic number; a rig moved from
  `docs/specs/x/` to `docs/specs/x/archive/` needs it changed from three to four
  levels, and the failure is silent-ish (unstyled page).
- Option 2 makes rigs less discoverable *by accident*. Today you trip over them
  at root, which is how you noticed the problem in the first place — that's a real
  loss if the register never gets written.
- The retention policy has one genuine casualty: a spent rig is only replayable
  if its entry + modules still load, and archived entries with a stale base depth
  won't. Either fix depth on archive, or accept archives are read, not run.

---

## 7. Correction — Babel *does* follow `<base href>` (2026-08-18)

§2 concluded that Babel ignores `<base>` and that app modules therefore need longhand
`src="../../../app/main.jsx"`. **That is wrong**, and it was proved wrong by applying it:
every module 404'd one level *above* the serve root, and bare sibling filenames resolved at
the root instead of the entry's folder.

The rule, verified across 55 entries now loading from their folders:

- `<base href="../../../" />` (one `../` per level) is the whole mechanism.
- **Every path is written root-relative, exactly as if the entry sat at the root** —
  `tokens.css`, `app/main.jsx`, `docs/specs/<ticket>/pg-foo.jsx`. Nothing else changes when
  a file moves down the tree except the base line.

So moving an entry into its folder costs one added line and no path edits at all — cheaper
than §2 claimed. `base-href-probe.html` still carries the old conclusion in its own copy;
it is kept as the historical probe, not as the rule.

## 8. What landed, second pass (2026-08-18)

- Both candidate builds moved into their ticket folders:
  `docs/specs/lm-652-discourse/circlists-lm652.html`,
  `docs/specs/lm-666-link-deletion/circlists-lm666.html`. The root now holds only
  `circlists.html`, the homepage demo, and the launcher.
- `<base href>` applied to 55 rig entries across `docs/specs/` and `docs/archive/`, so
  every archived study and whiteboard opens again from where it sits.
- `playgrounds.json` + a rewritten two-level `playgrounds.html`: a shelf of tickets
  (most recently touched first; documents-only and archive folded), then one ticket's
  candidate build, live rigs, and spent rigs. `"on": false` hides a row and keeps it.
- **Not done, still open:** legacy rigs sit directly in their ticket folder, not in
  `<ticket>/playground/`; the six standalone bundles in `lm-652-discourse/archive/` are
  listed as held-back but not deleted.
