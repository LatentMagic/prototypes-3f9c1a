# Kit v8: comments carry intent — handoff, 2026-10-27

- Version before: 7.
- Added: the comments rule in `ARCHITECTURE.md` § Conventions and `CLAUDE.md` § Code (word for word); kit version line now 8.
- Skipped: nothing. The audit (part B) has had two passes; the run-history sweep of the largest files is queued below.
- Comments deleted: 4 blocks (about 54 lines). `KEEP:` marks added: 35.

## Scope (owner, 2026-10-27: "clean up whatever you want")

In: `app/`, `circlists.html`, `support.js`, `tokens.css`, `swell.css`.

## Audit, by category

About 5,800 comment lines in scope. Categories checked across all of `app/`:

- **Short standalone and trailing comments** (all of `app/`): about 30 found, all mapping or intent (`// name → fund`, `// idle | reverify | verify | done`). None deleted.
- **Pointers and run history** (all of `app/`): `feed-sort.jsx` had a run-1/run-2 history passage and a pointer to "the run's rulings file"; both deleted (2). Leftovers in `main.jsx` and `feed-lens.jsx` point at another file's comment, with the reason given there, so they count as intent; kept.
- **Divider lines** (`// ====`, 131) and empty `//` paragraph breaks (202): framing for mapping headers; kept.
- **Special behaviour with no mark**, `KEEP:` added (11):
  - `wizard.jsx`: the 300px column; the body centres and scrolls when short; the subject ellipsis at 200px.
  - `talk-reveal.jsx`: about 32px between the disc and the roster.
  - `share-intake.jsx`: the held link on one line, scrolled, with a fade; 24px under the hairline.
  - `pricing-store.jsx`: no single-word line in the not-subscribed paragraph; where the status line breaks.
  - `pricing-circle.jsx`: sentences keep their own lines.
  - `pricing-page.jsx`: the not-subscribed title on two even lines.
  - `store-listings.jsx`: one phone-width column.

Files read in full for the special-behaviour pass: `feed-watching`, `talk-reveal`, `pricing-sheet`, `pricing-main`, `pricing-states`, `gate`, `startup`, `qa`, `circ-tweaks`, `feed-sort`, `wizard`, `states-ui`, `pricing-circle`, `pricing-page`, `feed-history`, `not-found`, `share-intake`, `talk-main`, `pricing-store`, `store-listings`.

## Second pass, 2026-10-27 (owner: "just do what you need to do")

- Searched the rest of `app/`, plus `circlists.html`, `support.js`, `tokens.css` and `swell.css`, for comments on overflow, wrapping, clipping, overlap, scrolling, stacking and values set against the default. Added 22 `KEEP:` marks across `feed`, `home-returns`, `liveliness`, `subscriptions`, `home`, `push`, `shell`, `talk-add`, `feed-search`, `pricing-account`, `talk-parts`, `talk-card`, `talk-return`, `swell-reactions` (2), `feed-lens` (3), `spaces` (2), `main` and `circlists.html` (dialog buttons).
- `feed-lens.jsx`: two run-by-run histories on the desktop panel's width and height cap (46 lines) replaced by two `KEEP:` marks stating the 340px width and the 78vh cap.

## Queued for the next session

Line-by-line sweep for run-by-run history ("run 9", "raised from", "was X until") in `feed-lens.jsx` (the rest), `main.jsx`, `states.jsx`, `swell-reactions.jsx` and `talk-card.jsx`: shrink each to the rule it keeps, or to a `KEEP:`. A comment that marks a ruling ("ratified", "Joe, date") is intent; keep it.

## Left alone

- `docs/specs/**` task code (playgrounds, candidates) and every task record in it.
- `docs/archive/`, `CHANGELOG.md`, old handoffs and prompts.
- `_ds/` (design-system mirror), `brand/` including `brand/scripts/` (wiki mirror), `skills/` (vendored).
- `/*EDITMODE-BEGIN*/` and `/*EDITMODE-END*/` markers in `circ-tweaks.jsx`, which are functional.
- The `STATE_KEY` version history in `main.jsx`: it gives the reason for each bump.

## Resolved

- 2026-10-27, owner ratified: the older `ARCHITECTURE.md` line "A comment may state what the code does…" is overruled by the new rule. That sentence is cut; the no-`docs/`-path rule stays.
