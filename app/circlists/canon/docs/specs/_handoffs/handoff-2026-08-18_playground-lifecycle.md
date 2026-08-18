---
date: '2026-08-18'
topic: 'playground lifecycle and the launcher'
status: 'blocked'
type: 'exploration'
---

# Handoff: playground lifecycle — misaligned; restart from the user's own framing

## Current Focus

**The user's problem is not yet correctly understood, and this session went off the rails
trying to solve it.** Do not resume by building. Resume by re-reading the user's original
statement (quoted below), asking what it means concretely, and getting one shape ratified
before any file is written.

The user's original ask, verbatim (they re-pasted it once already this session because the
first interpretation was not useful):

> As you'll see and know, we have this concept of creating playgrounds, and there are a
> couple of things wrong with that at the moment: 1. They always drop into the route of the
> project, and that means I can easily traverse and go through them. There's a problem with
> that, because they blur with the main Circlists page and the candidate builds. There's no
> easy way to tell what's going on with them, nor is there really, on a filename, much
> information to go on. On top of that, it becomes difficult to clear them out one time when
> I want to clear them, because again, it's not clear what is meant to be in the list and
> what is just a playground. 2. I'm slightly concerned that when I download the prototype,
> this entire process takes a whole minute to zip up… I'm a bit of a data hoarder, so I like
> to keep things, but at the end of the day, I kind of think we do need to consider whether
> we should do a clear-out now and then… We also need to think about how we display
> playgrounds. What is the strategy for them? Do they always go into the docs/specs ticket
> space? If so, does that have an impact on creating some new surface for how we can navigate
> playgrounds?

Their last words this session: *"oh dear this is bad. very bad. i clearly havent explained
enough."* Treat the current `playgrounds.html` as a **rejected first attempt**, not a base.

## Task(s)

Done and **ratified**:

1. **The clear-out.** ~30 MB and ~150 files deleted: 76 loose screenshots + 1 photo + 2 og
   images from `uploads/`, five standalone bundles, and `uploads/{brand,motion,skills}` +
   `uploads/{SKILL.md,accessibility-checklist.md,gate.jsx}` (duplicates of committed files).
2. **The sweep rule** in `CLAUDE.md` (§ Sweep on session end): sweep unreferenced `uploads/`
   at session end; never leave a standalone bundle in the project; **exception** —
   `uploads/card-previews/` and `uploads/card-favicons/` are load-bearing.
3. **Placement**: a playground entry lives in `docs/specs/<ticket>/playground/` with its
   modules. Candidate builds stay at the root. (User confirmed twice: candidate builds at
   root are fine and are *not* playgrounds.)

Built but **NOT ratified — the misalignment**:

4. `playgrounds.html` at the root — a read-only index of tickets, candidate builds and rigs.
   Three earlier mock iterations (interactive config, then pending-edits bar, then
   read-only) were each rejected. The verifier then found two real defects in the built
   version (below). The user stopped the work here.

## Critical References

- `docs/specs/playground-lifecycle/README.md` — the full reasoning record: measured file
  sizes, the `<base href>` proof, options considered, and §6 "What landed".
- `CLAUDE.md` §§ *Where files live*, *Playgrounds — placement and the launcher*, *Sweep on
  session end*, *Ratification*.
- `skills/build-playground/SKILL.md` § Housekeeping — placement + launcher rule added.

## Recent changes

- `CLAUDE.md` — added § *Sweep on session end*; replaced the old "entry must sit at root"
  exception with § *Playgrounds — placement and the launcher*; added `playgrounds.html` to
  the root inventory.
- `skills/build-playground/SKILL.md:170` — Housekeeping now opens with placement, the
  `<base href>` mechanics, "add the rig to the launcher", and the no-bundles rule.
- `playgrounds.html` (new, root) — the rejected launcher. `INDEX` array at
  `playgrounds.html:64`.
- `docs/specs/playground-lifecycle/README.md` — synthesis + §6 what landed.
- `docs/specs/playground-lifecycle/base-href-probe.html` — the live probe (keep; it is the
  evidence for the loading rule).
- Deleted: `playgrounds-mock.html`, and the files listed under Task 1.

## Learnings

**The `<base href>` rule — verified, not theory.** A playground entry in
`docs/specs/<ticket>/playground/` loads if it carries `<base href="../../../" />`: that fixes
`tokens.css`, `swell.css`, favicons and every root-relative asset path *inside* app code
(e.g. `brand/assets/circlists-wordmark.svg` in `app/brand-motion.jsx:146`). **`<base>` does
not reach Babel** — it fetches `type="text/babel" src=` itself, relative to the document's
location — so app modules need longhand `src="../../../app/main.jsx"`, while the rig's own
sibling modules are plain filenames. The preview's "referenced file not found" warning on
base-relative paths is a false positive. Probe:
`docs/specs/playground-lifecycle/base-href-probe.html`. Precedent already in the tree:
`docs/specs/lm-626-champion-exit/whiteboard-marker-word.html:5`.

**Where the download weight actually is** (measured): five standalone bundles were 12.9 MB
(one was 5.9 MB); `uploads/` screenshots ~10 MB; all of `app/` is 0.36 MB; a playground
module is ~15 KB. Text is a rounding error — the user's hoarding was never the problem.
**There are still ~6 more bundles** in `docs/specs/lm-652-discourse/archive/` and
`.../archive/early/` (`*-standalone.html`) — covered by the ratified no-bundles rule but
**not yet deleted**; raise before deleting since they sit inside archived work.

**Two live defects in `playgrounds.html`** (verifier, unfixed):
1. Every folder anchor 404s — the host serves no directory listings. 13 of 15 anchors are
   folder links, and on 11 cards it is the only link. Render paths as plain `<code>`, or
   link a file that exists (`README.md` where present).
2. "No rig — the record is in the folder" is **false** for at least five tickets. These all
   return 200: `docs/specs/biz-84-app-ia/app-ia-playground.html`,
   `docs/specs/lm-626-champion-exit/whiteboard-playground{,-v2,-v3}.html`,
   `docs/specs/lm-570/create-fund-desktop-container-options.html`,
   `docs/specs/lm-652-discourse/wb-new-words.html`,
   `docs/archive/lm-593-liveliness/liveliness-playground.html`, ~27 studies in
   `docs/archive/option-studies/`, 3 in `docs/archive/tab-arrival-signal/`, and 22 entries
   in `docs/specs/lm-652-discourse/archive/`. The index under-reports the tree it claims to
   derive from.

**Process learnings — the actual cause of this session going wrong:**
- The user asked for *synthesis and an opinion*. The first reply was a long doc plus a
  dense chat turn; they could not tell what was being recommended. Three turns were spent
  restating. **Lead with the recommendation in three lines.**
- **Do not build a mechanism the user has not asked for.** A config surface with
  `localStorage`-backed state, a pending-edits bar and a copy-paste-to-agent loop was built
  across three iterations and then correctly rejected ("this still feels like the wrong
  solution… i'm not convinced by your local storage point considering it could get wiped").
- **Do not invent maintenance.** A per-ticket `ticket.md` was proposed and rejected: this
  project is core design, not business operations, and that record lives in business-ops.
- Whipsawing on advice cost trust: the per-row hide toggle was removed on this agent's own
  recommendation, then the user reasonably asked "how am I supposed to configure this?"

## Artifacts

- `playgrounds.html` — rejected launcher (root).
- `docs/specs/playground-lifecycle/README.md` — reasoning record.
- `docs/specs/playground-lifecycle/base-href-probe.html` — loading proof.
- `CLAUDE.md`, `skills/build-playground/SKILL.md` — rules updated.

## Action Items & Next Steps

1. **Re-establish the ask before touching anything.** Get concrete on the user's own three
   words: *auto-populate*, *navigate*, *clear out*. Specifically unresolved: what "auto-
   populated" can mean given a static page cannot list a directory; whether the surface
   should show archived work at all; and whether anything beyond candidate + playground
   links belongs on it. They explicitly do **not** want handoffs, ticket metadata, or a
   config UI on it.
2. **Decide the fate of `playgrounds.html`** — repair (two defects above) or delete and
   restart from their framing. Ask; do not assume.
3. **Migration question, unratified:** ~35 existing rig entries in ticket folders load but
   have stale root-relative asset paths. Offered and not answered: move them into
   `<ticket>/playground/` and apply the `<base href>` fix so they load and can be listed.
4. **~6 remaining standalone bundles** in `docs/specs/lm-652-discourse/archive/` — flag,
   then delete under the ratified rule.
5. `docs/specs/README.md` is stale: it still says a playground entry must sit at the root
   and points at `pg-discourse-v10.html` there. Fix when the launcher question settles.

## Other Notes

- **Ratification discipline slipped and must be tight next session.** Present options,
  recommend, stop. One decision per turn.
- **Reply length matters as much as correctness here.** Under ~150 words, at most three
  headers, the ask on the last line. The user invoked `$digestible`, `$bro` and `$show-me`
  mid-session because replies were unreadable; a diagram carried more than three paragraphs
  did.
- No `CHANGELOG.md` entry was added — nothing about the product's shape changed, and the
  launcher is not ratified.
- Do not treat this handoff's Learnings as settled design. Only items 1–3 under Task(s) are
  ratified.
