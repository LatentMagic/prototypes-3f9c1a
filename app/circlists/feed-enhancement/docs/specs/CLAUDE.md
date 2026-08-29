# docs/specs — the rules for task-scoped work

Read this before creating, moving or clearing out anything under `docs/specs/`.
Placement and the launcher are in the root `CLAUDE.md`; this file covers what
happens to a ticket folder over its life.

## A candidate build after it is merged

A candidate build stops being a candidate the moment its delta lands in `app/`.
From then on its entry re-applies changes the app already carries, so it is not
a second state of the product — it is a record.

On merge:

1. **Merge the delta into `app/`**, renaming any `cand-*` CSS classes to house
   names and adding the styles to every live entry that loads the changed module
   (`circlists.html`, `circlists-homepage-demo.html`, and any live playground
   entry). The bridge file (`cand-*-main.jsx`) is scaffolding — delete it rather
   than merging it.
2. **Move the whole ticket folder to `docs/archive/<ticket>/`.** A move, never a
   rewrite. Repoint the entry's own `<script src="docs/specs/…">` lines at the
   new path; the `<base href>` depth is unchanged when the folder stays three
   levels deep.
3. **Turn its `playgrounds.json` rows off** — `"on": false` with
   `"off": "Merged into the main build <date>."` The row stays on the record and
   off the page.
4. **One `CHANGELOG.md` entry**, if the merge changed the shape of the product.

Do not delete the overlays. They are a few KB and they are the record of what
was ratified; an archived candidate is read, not run.

## Everything else

- Anything task-scoped lives in `docs/specs/<ticket>/` from its first file.
- Archiving is a move of the whole folder, never a rewrite. Expect archived
  entries' `<base href>` depth to need one adjustment if the nesting changes.
- Never keep a standalone bundle here. Generate, hand over, delete in the same
  session.
