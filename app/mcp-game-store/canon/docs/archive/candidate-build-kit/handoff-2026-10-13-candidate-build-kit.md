---
ticket: candidate-build-kit
date: 2026-10-13
status: landed, awaiting review
---

# Handoff: candidate-build kit update

An earlier, wrong version of this update (with a shell script) was applied and fully rolled back, then this version was applied. No `tools/` folder exists.

## Changed
- Added `skills/candidate-build/SKILL.md` and `docs/specs/CLAUDE.md`, word for word.
- `CLAUDE.md`: blocks a to e only.
- `playgrounds.html`: candidates first under "Candidate build", marked, counted.
- `app/main.jsx`: the hook. `app/gs-push.jsx`: `GS_PUSH_KEY = window.KIT_STATE_KEY || 'gs_push_v1'`.

## Decisions (mine, for review)
- **Hook place.** The root's `appTree` is a context provider around the chrome (top bar, footer, popups). `Screen` replaces only the routed page (`GsArrival`), inside the provider, so chrome and `useGs()` keep working. Replacing the whole tree would drop the context.
- **`api`.** The root's own context object `gs` (route, view, sub, user, go, setView, setSub, setReview, play…), passed to `bind` and to `Screen`.
- **Storage key.** The product's only storage is push settings in `app/gs-push.jsx`, not the root. `config.jsx`'s `kit_launcher_pos` is the aid pill's position and stays shared.

## Audit
- Existing candidate builds: none. The LM-1110 handoffs call their work a "candidate", but it was a playground, since merged into `app/` and deleted. Left as history. No `kind: candidate` entries in `playgrounds.json`.
- Root hook and launcher: now present.
- Skill and specs CLAUDE.md exist. Paths they name exist: `skills/build-playground/SKILL.md`, `skills/create-handoff/SKILL.md`, `docs/archive/`, `app/states.jsx`, `app/qa.jsx`, `GOTCHA.md`.
- Rules saying a candidate is deleted: none standing. The deletion note in the LM-1110 handoff is history; left alone.

## Not done
- The launcher was not rendered with a test candidate entry (the main agent can't view it). Add one `kind: candidate` entry and look once.

## Next
Nothing until a candidate build is requested.
