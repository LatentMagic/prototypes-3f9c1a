---
date: '2026-08-18'
topic: 'addressable-states'
status: 'complete'
type: 'implementation'
---

# Handoff: addressable states — every staged state has a URL name

## Current Focus

The work landed and is ratified. **One thing is open:** whether to add a boot console line
printing the state names on load. It was offered as the second half of the discovery fix (the
head comment being the first); the user asked for "headline and changelog", the head comment
and CHANGELOG entry were written, and the boot line was left explicitly unbuilt pending a word.
Nothing else is outstanding.

Background only: the user's own console change (forwarding the query string onto the iframe
`src`) is outside this project — they said assume it works and build against it.

## Task(s)

**Problem solved.** The prototype is exported and served in an iframe from the user's console on
GitHub Pages; tickets for the real build link to it so an implementer can see the design. Every
such link opened the same place (Backend Pod's feed), so a ticket about leaving a circle, a
dormant circle, or a payment failing could not point at its own state — the reader had to know
the click path, and could not share where they got to. People were guessing and getting copy wrong.

**Shipped, all ratified in conversation:**

1. `app/states.jsx` — the states register. One entry per staged state, `{ group, id, label, stage }`.
   The staging functions moved here verbatim from Config's old `buildScenarios`.
2. `?state=<id>` on the entry, read once at mount, staged in an effect so it overrides the
   restored `localStorage` route.
3. `app/states-ui.jsx` — the palette (search, jump, copy link) and the index page.
4. The launcher pill split into two icon halves: settings (Config) and a list glyph (States).
5. `window.CIRC_STATES` — ids, labels, groups. Nothing runnable.
6. ARCHITECTURE.md → "Addressable states", incl. the do-not-delete note.
7. Head comment above `#root` in both entries; CHANGELOG entry.

**Explicitly not doing** (offered, deferred, none blocked): boot console line; generated markdown
table for ticket authors; posture/gate in the address; an agent-oriented landing on bare
`circlists.html`.

## Critical References

- `ARCHITECTURE.md` → **Addressable states** — the binding description, including the
  looks-inert-in-preview warning. Read before touching the resolver.
- `CLAUDE.md` → ratification rule. Every decision here was put to the user and waited on; the
  deferred items above are deferred, not pending-your-judgement.
- `skills/build-candidate/SKILL.md` — candidate builds inherit core changes for free; that
  inheritance was verified this session (see Learnings).

## Recent changes

- `app/states.jsx` — **new.** `circStateContext()` (staging closures over main.jsx's setters),
  `CIRC_STATE_REGISTER` (26 entries, 8 groups), `CIRC_STATE_INDEX_NAMES`, `window.CIRC_STATES`,
  `buildStates()` (binds the register: `states`, `byId`, `groups`, `reset`), `circResolveState()`,
  `circStateLink()`.
- `app/states-ui.jsx` — **new.** `StatesRow` (label, address, copy), `StatesGroups`,
  `circFilterGroups`, `StatesPalette`, `StatesIndex`.
- `app/config.jsx` — `ConfigLauncher` now renders the two-half pill and owns `statesOpen`; new
  props `statesGroups` / `onGoState` / `onOpenStatesIndex`; `groups` prop and the whole Scenarios
  block gone from `ConfigModal`; `onReset` made optional; `buildScenarios` and its ~150 lines of
  stagers deleted (moved to `states.jsx`). 469 → 305 lines.
- `app/main.jsx` — `landing` state from `circResolveState()` at `:~154`; `buildStates(...)`
  replacing `buildScenarios(...)`; `goState`; the deep-link effect (`deepLinked` ref, fires once,
  after mount); `showIndex` branch ahead of the forced-mobile branch in the return; launcher props.
- `circlists.html`, `circlists-lm652.html` — `.circ-config-btn` replaced by `.circ-launcher` /
  `.circ-launcher-half`; `.circ-states-*` and `.circ-index-*` blocks added; `states.jsx` +
  `states-ui.jsx` script tags before `config.jsx`; head comment above `#root`.
- `circlists-homepage-demo.html` — omitted-files table updated (the demo omits both new files).
- `ARCHITECTURE.md`, `CHANGELOG.md` — as above.

## Learnings

- **Config held two kinds of thing, and that was the real defect.** Settings you *hold* (posture,
  viewport, gate, payments, seed) versus states you *go to*. An address needs a register of its
  own before a URL name can mean anything; that is why this is an IA change and not a feature
  bolted onto Config.
- **The resolver is untestable in the design tool and looks dead.** No link can be handed to the
  page here, so `?state=` does nothing in preview, in every posture. It was exercised by driving
  `circResolveState()` directly with `history.replaceState` (known name, unknown name, `index`,
  nothing) and by clicking palette rows. **A future session must not conclude from a screenshot
  that the address reading is broken and delete it** — this is the exact failure ARCHITECTURE.md's
  note exists to prevent. Candidate for GOTCHA.md; **not added, needs user approval.**
- **A copied link is built from `document.referrer` when framed.** Inside the console the app's own
  URL is not an address anyone can open — the console page is. Falls back to
  `location.origin + pathname` when unframed or when no referrer is sent, and the URL is always
  shown next to the copy button so it can be taken by hand if the clipboard write fails.
- **Candidate builds inherit core changes for free, and this was the first test of that.** LM-652
  needed the same two script tags and the same CSS (its entry carries its own copy of both), and
  got them in the same pass. Its `cand-*` overlays needed no change. The homepage demo needed only
  its documentation table updated, because it derives by *omission* — the guards
  (`window.buildStates`, `window.StatesIndex`, `window.StatesPalette`) mean absent ⇒ shipped
  behaviour, no edit to the core.
- **A stager cannot assume its circle exists** (leaving drops it), hence `withSpace()` reseeding
  when the target id is missing — carried over from the old scenarios, still load-bearing.

## Artifacts

New: `app/states.jsx`, `app/states-ui.jsx`.
Updated: `app/config.jsx`, `app/main.jsx`, `circlists.html`, `circlists-lm652.html`,
`circlists-homepage-demo.html`, `ARCHITECTURE.md`, `CHANGELOG.md`.

## Action Items & Next Steps

1. **Ask about the boot console line** — the one open question. Do not build it unprompted.
2. **Ask before adding the GOTCHA.md entry** on the inert-looking resolver (per CLAUDE.md, gotchas
   are never appended unprompted). It is the highest-value thing not yet recorded.
3. When the user's console change lands, confirm end to end that a real `?state=` link arrives
   through the iframe `src`. Cannot be done from here.
4. Only if asked: the generated markdown table for ticket authors, posture/gate in the address, an
   agent-oriented landing on bare `circlists.html`.

## Other Notes

- **Bare `circlists.html` lands on the top circle, on Active, silently** — ratified, and it matches
  what the real app does on login. The index is *not* the no-name fallback; it is an address of its
  own (`?state=index` / `?state=states`) and the landing for a name the register does not hold.
  Do not "improve" this into a landing page.
- **An `id` is public once a ticket links to it.** Renaming or removing one breaks those links, and
  the index is the only thing that catches it. Treat the register's ids as an API.
- Naming: the group unit is a **circle**; the register's ids are kebab-case, as are all filenames here.
- Discarded: keeping a second registry separate from Config's list (drifts); using labels as URL
  names (churn, ugly in a URL); a sibling `states.json` (would not survive the single-file export,
  which is why `CIRC_STATES` is a global); routes in prototypes-3f9c1a (a page per state plus a
  rebuild each time one is added — the register can graduate to real paths later without the names
  changing); and a warning line in the prototype chrome for an unresolved name (the index carries
  that message without new surface or a judgement call about when to show it).
