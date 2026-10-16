---
date: '2026-10-09'
topic: 'connect-and-prompts'
status: 'in-progress'
type: 'implementation'
---

# Handoff: connect-and-prompts — How it works and the play dialog, landed in the app

## Current Focus

The direction is ratified and in `app/`. Next: the queued fixes below, starting with the "Not played" misalignment and the Casebook (no Pass) bug. Ask before writing the `CHANGELOG.md` entry (asked, not yet answered).

## Task(s)

- **Done, ratified by Joe 2026-10-09:** How it works from rig option 4; every play control opens option 5's dialog; product page button "Play in your AI"; on the product page the cover takes the play box's height from 900px so they end level.
- **Done:** removed the library game page from the rig (it has no play control in the seed; the first handoff said it did, in error).
- **Rig:** `docs/specs/connect-and-prompts/playground/` keeps options 1–5 for comparison. Options 4 and 5 were added this session. The first handoff (`handoff-2026-10-09-connect-and-prompts-playground.md`) has every option and the review notes.

## Critical References

- `CLAUDE.md`: ratification, product page rule, the overlay kinds (the play dialog is a Dialog).
- `GOTCHA.md` 13 (new): check class names before moving styles into the app.

## Recent changes

- `app/gs-connect.jsx`: rewritten. How it works (`GsConnect`), the play dialog (`GsPlayDialog`), prompt drafts (`gsPromptText`), `gsPlayReq` (session page → its edition), `GsHowLink`. Logos and placeholder plugin addresses inlined.
- `app/main.jsx`: `gs.play(name)` and `gs.playReq(req)` open the dialog for every view; `goHow` goes to `connect`; `connect` removed from `GS_SIGNED_IN_ONLY`.
- `app/gs-parts.jsx`: account row reads "How it works"; `GsPlayPopup` renders `GsPlayDialog`.
- `app/gs-game.jsx`: `GsPlayBox` step 1 "Connect your AI first. How to connect", button "Play in your AI" (Get the Pass where the player can't play); `GsWeekCard` opens the current edition's prompt.
- `app/gs-editions.jsx`: a row opens the dialog; `edLine` removed.
- `index.html`: `hw-*` styles and the cover-height rule, at the end of `<style>`. `app/states.jsx`: state `connect` relabelled "3. How it works".

## Learnings

- The first move of styles broke the home page: `gs-band` and `gs-ai` already existed. Renamed to `hw-*`, home checked. Now `GOTCHA.md` 13.
- The user's dictation hears "Editions" as "additions".
- `gs.connected` and the old Connect screen's waiting state are no longer used by play; `setConnected` remains for states and Config.

## Artifacts

- `app/gs-connect.jsx`, `app/main.jsx`, `app/gs-parts.jsx`, `app/gs-game.jsx`, `app/gs-editions.jsx`, `app/states.jsx`, `index.html`, `GOTCHA.md`.
- `docs/specs/connect-and-prompts/playground/pg-connect.jsx`, `index.html` (rig).
- `docs/specs/connect-and-prompts/handoff-2026-10-09-connect-and-prompts-playground.md` (updated).

## Action Items & Next Steps

1. "Not played" row misalignment: `app/gs-library.jsx:43` `LbStatus` has no icon for `none`; proposed fix is an empty icon slot. Not yet ratified.
2. Casebook, no Pass: a UI bug the user saw; not yet looked at.
3. Home page "See how it works" (`app/gs-home.jsx:71`) still scrolls to the home section; ask whether it should go to How it works.
4. Prompt wording is a draft; ratify with the owner. OpenClaw steps unverified; plugin addresses are placeholders.
5. How it works in the top bar isn't marked current (route matching in `gs-parts.jsx`).
6. Ask about the `CHANGELOG.md` entry; regenerate `playgrounds.json` if the rig moves; clear `uploads/` of unreferenced screenshots at session end.

## Other Notes

- Rejected this session: How it works options 1–3 and 5, product page options 1–4, option 5's earlier forms (three cards; option 2's panel).
- Don't edit the rig's options 1–3; they stay for comparison until the folder is archived.
