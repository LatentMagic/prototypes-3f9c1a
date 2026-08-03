---
date: '2026-07-27'
topic: 'discourse-playground'
status: 'in-progress'
type: 'exploration'
---

# Handoff: discourse playground — what shape does an exchange take in Circlists?

## Current Focus

Two threads, both open:

1. **The exploration itself.** The playground is built and working; nothing has been chosen. The
   user needs to sit with it and pick which of the seven directions to push further, or which pair
   to merge. No design decision has been taken — do not treat any option as favoured.
2. **The playground's own craft.** The user explicitly wants this file used as a **reference for
   improving `PLAYGROUND.md`**. Their words: *"I'm not saying it's perfect. If anything, it has
   issues."* The config/rail layout took three attempts this session and that history is the most
   useful material in it. A note has been added to `PLAYGROUND.md` under
   **"Pending: review this playground and fold the lessons back in"** — that review is an
   outstanding action, deliberately not done yet.

Background only: the standalone bundle, the README.

## Task(s)

Built `docs/specs/discourse/discourse-playground.html` (+ five `pg-disc-*.jsx` modules) from a
self-contained brief the user pasted (see "Other Notes" for where the brief lives). The brief asked
for 5–7 genuinely distinct answers to: *what shape does discourse take in Circlists — the full loop
from a contributor's attached thought to a consumer's response — without becoming a chat tool?*

Delivered eight rail entries: the reaction-only baseline plus seven directions, each covering the
whole loop (attach → unseal → respond → lives), each stating its relation to The Swell.

| | Direction | Lives | Response | Swell relation |
|---|---|---|---|---|
| 00 | Reaction only (baseline) | nowhere | — | is the Swell |
| 01 | Passing notes | on the card | one note back per member | sequential |
| 02 | Marginalia | the card's margin | a note that annotates, never replies | sequential |
| 03 | The Table | a third tab | a note, in a place you enter | sequential |
| 04 | Guided statements | back of the card | a completed sentence stem | **merged** — your glyph picks the stems |
| 05 | Inside the door | the Reaction door | an epilogue at loop closure | **merged** — replaces the reveal |
| 06 | The Echo | on the card | an echo plus one word | **merged** |
| 07 | The question | on the card | an answer to the sharer's question | sequential |

Merges made and recorded: 05 folds both ideator seeds that put discourse inside the reaction
boundary (one permanent, one momentary) into one that keeps the moment *and* the record. 04 takes
the guided-statement seed and resolves what it left open by filtering response stems by the glyph
just left. 06 and 07 are our own.

## Critical References

- `PLAYGROUND.md` — conventions; now carries the third-playground section **and** the pending-review
  note this handoff exists to serve.
- `docs/specs/discourse/README.md` — the option table, the settled constraints, and the note that the
  static disc is a copy of the shipped Swell geometry.
- `GOTCHA.md` #2 and #5 — both bit during this session (see Learnings).

## Recent changes

New folder `docs/specs/discourse/`:

- `discourse-playground.html` — shell, copied app CSS, load order.
- `pg-disc-data.jsx` — options + `def` lever answers, levers, seed cards (real Backend Pod items
  from `app/seed-data.jsx` with discourse content attached), `pgdResolve()` as the single
  derivation point (`pg-disc-data.jsx:~300`).
- `pg-disc-parts.jsx` — bottom sheet, static disc + roster + glyph huddle (copied Swell geometry),
  thought/response renderers, the one composer covering note / stem / one-word / echo.
- `pg-disc-card.jsx` — the shipped enriched card copied, with one discourse slot (stack, margin,
  flip-to-back, or nothing).
- `pg-disc-places.jsx` — response moment, reaction door, Add sheet, Table tab, tabs, empty state.
- `pg-disc-app.jsx` — rail with three panes, phone stage, loop driver.
- `README.md`, `discourse-playground-standalone.html` (bundled; regenerate, never edit).

Also edited: `PLAYGROUND.md` (third-playground section + pending-review note).
**The prototype was not touched.** No `app/` file, no `circlists.html`, no `CHANGELOG.md` entry
(a playground is not a product-shape change).

## Learnings

- **Reuse the real interactive component, not a mock.** The mark-as-read beat mounts the shipped
  `SwellReactionFlow` (`app/swell-reactions.jsx`); the playground only owns `onMarkRead` /
  `onClose`. Unmounting the flow at commit (merged options) vs letting its reveal play (sequential
  options) is the entire difference between "merged with the reaction" and "after the reaction" —
  worth wiring, not describing. See `pg-disc-app.jsx` `commitReaction` / `closeFlow`.
- **The shipped Swell keeps its disc internal.** `swell-reactions.jsx` exports only `RX_GLYPHS`,
  `SwellDoor`, `SwellReviewModal`, `SwellReactionFlow` — so the static disc had to be copied
  (`pg-disc-parts.jsx`, `pgdPos` / `pgdLayout`). Keep the numbers in step with the source, or
  export the internals if a future playground needs them again.
- **A copy of the card body is unavoidable** when content must sit *inside* the card's border.
  Wrapping the real `FeedCard` cannot work.
- **3D flips: don't trust `backface-visibility` alone.** Toggle `visibility` per face with
  `transition: visibility 0s linear <half-duration>` so exactly one face is painted.
- **GOTCHA #2 confirmed again.** The sandbox pauses rAF: a mounted sheet sat at `translateY(374px)`
  and screenshotted as absent while being perfectly fine. Measure `getComputedStyle().transform`
  instead of believing a capture.
- **Verification clicks pollute the user's saved state.** A stray click left
  `attach: 'required'` in `pg_discourse_v1`; the rail then read "overridden" on the user's first
  look. Reset the key at the end of every probing pass (PLAYGROUND.md already says this — it was
  still missed).
- **Layout — the session's real lesson.** Three columns (options 320 + phone 402 + config 352)
  need ~1100px; the user's window is ~1050px, so the config column fell below the fold and the
  playground read as broken. Their reaction was strong ("entirely broken"). Do not assume a wide
  desktop. Landed on: one sticky left rail with three panes (Directions / Config / The loop) and
  the phone taking the rest. **This is the part to re-examine when updating PLAYGROUND.md** — the
  three-pane rail is a workaround, not obviously the right answer, and it costs you seeing the
  options and the config at once.

## Artifacts

- `docs/specs/discourse/discourse-playground.html` (+ `pg-disc-data|parts|card|places|app.jsx`)
- `docs/specs/discourse/discourse-playground-standalone.html` — self-contained, 1.7 MB.
  Compiled output: edit the sources and re-run the bundler; never edit it directly.
- `docs/specs/discourse/README.md`
- `PLAYGROUND.md` — updated.

## Action Items & Next Steps

1. **Choose.** The user opens the playground, picks two or three directions that feel alive, and
   says which to push further or which pair to merge. Nothing is decided yet.
2. ~~**Review this playground and update `PLAYGROUND.md`**~~ — DONE 2026-07-30. `PLAYGROUND.md` was
   rewritten around six non-negotiables (real app, no bezel, works on a phone, collapsible chrome,
   1024×720 minimum, real components) plus a "pick the rig" section naming the three shapes
   (whiteboard / config-at-bottom / config rail). The playground itself was fixed at the same time:
   the phone bezel is gone (posture follows the window, `< 1024` = app posture, as `main.jsx`), and
   the three-pane rail now collapses — docked on wide, and the app posture's Home destination on a
   phone (Home is the circles list, so it is the directions list), reached by the bottom bar's Home
   slot with the app's own push. The rail replacing the circle rail is settled as correct; a copied disc
   is acceptable once, export on the second ask; the loop driver generalises to any sequence
   question. Original wording of the ask, for reference: Read the pending note already in `PLAYGROUND.md`, use this file and the
   playground itself as the evidence, and fold in what actually held up. Open questions to answer
   in that review:
   - Is the three-pane rail right, or should config and options be visible together (which means
     shrinking or scaling the phone)?
   - Should there be a standing rule about the minimum viewport a playground must work at?
   - Does "drive the loop from a side panel" generalise, or was it specific to this question?
   - Is a copied disc acceptable, or should shipped components export their internals for
     playground reuse?
3. **If a direction is chosen**, the next step is a proper spec for it, not more playground work —
   and the copy has to go through `wiki/circlists-copy-voice.md`.
4. Only if asked: add a `GOTCHA.md` entry for the flip / `backface-visibility` trap. Per
   `CLAUDE.md`, gotchas need the user's approval — do not append it unprompted.

## Other Notes

- **The brief is not in the repo.** It was pasted into chat as "Circlists — discourse playground"
  and is summarised in `docs/specs/discourse/README.md`. If it matters, ask the user to re-paste it
  and save it as `docs/specs/discourse/PROMPT.md` (the convention `docs/specs/biz-80-metadata/`
  follows).
- **Settled and honoured in every option — do not reopen:** reveal-on-read · no threads · no unread
  badges or kudos tallies · communal library, individual read-state · sharing before reading is a
  valid register · the Swell and the Reaction door are unchanged · the design language is locked.
- The performance-pressure risk (how often a member's name surfaces is itself a share count) is
  designed around via the **Names** lever: 02 and 06 default to avatar-only. Not dismissed, not
  resolved.
- No ticket id was given for this work. If one is issued, rename the folder to
  `docs/specs/<ticket>-discourse/` and update the reference in `PLAYGROUND.md`.
