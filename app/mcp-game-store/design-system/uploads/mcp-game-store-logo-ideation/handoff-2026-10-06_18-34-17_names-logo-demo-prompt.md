---
date: '2026-10-06T18:34:17+01:00'
git_commit: '0de418ed'
branch: 'main'
repositories: ['latentmagic-business-ops']
topic: 'mcp-game-store inception'
status: 'in-progress'
type: 'exploration'
---

# Handoff: mcp-game-store inception — names, logo, demo prompt, product paragraph

## Current Focus

Joe left with four things in hand and none of them closed. First to pick up is whichever he reports on: the Claude Design build from `_outputs/demo-prompt.md`, the heading font, or the logo. The earlier design-system pack work (previous handoff, 17:18) is background.

## Task(s)

- **Demo prompt: written, reviewed once, fixed, not yet pasted as far as this session knows.** `_outputs/demo-prompt.md`: nine screens (home, sign-up as the linked Circlists prototype, connect your AI, Delve page, Daily Puzzles page, games, session page with share, history, Pass) with a "Demo view: signed out / free / Pass" bar. Built from `_resources/research/jonny-mockup-inventory.md`. An Opus seat reviewed it ("paste after these fixes"); the eight fixes were applied by the main thread and the fixed version was not re-reviewed.
- **Logo: a favourite, not final.** Joe likes "missing piece", colour pairing B (green squares, orange circle) and the circle lifted out of its slot. Assets in `_outputs/logo/`. Board: https://claude.ai/artifact/Cf88sMM1gXnsmvpy3CfxSB (version 4).
- **Names: nothing chosen.** 30 from Gemini in `_resources/research/names-gemini.md`. Joe is thinking about "Missing Piece" as a name idea ("maybe theres something in Missing piece being like MCP, but it needs work").
- **Heading font: reopened.** Joe on Bricolage at card-title size: "I fucking hate it". He sent five options from Claude Design; the main thread recommended Schibsted Grotesk and checking it at small size. No answer.
- **Product paragraph: draft.** `_outputs/product-description.md`. Joe: "otherwise this is good", then asked for the Steam / Battle.net / NYT Games platform element; the version with that sentence was copied to his clipboard and not confirmed.

## Critical References

- `_context/log.md`, entries from "Joe asked for name and logo ideation" onward: his words on every item above.
- `_outputs/demo-prompt.md` and the note above its fenced block.
- `_resources/research/logo-lookalikes.md`.

## Recent changes

- `_outputs/voice.md` and `_outputs/design-system/voice.md` line 33: "Nobody has caught today's killer yet." cut at Joe's request; `_outputs/design-system-pack.zip` rebuilt. The copy inside Claude Design is his to update.
- `CONTEXT.md`: three checklist rows added (name, logo, heading font) and five references.

## Learnings

- Joe's "beats" of Jonny's mockup meant the platform it implies (front door, way in, features inside), not the sections of the one page. Ask what a demo is for before writing its prompt.
- A product description is written from Joe's own lines in the log (agency, a home for many games, AI lightly to highly involved), never from the demo. How it installs is "very much open and very much unknown" and stays out. "New way" is out. He wants the platform sense of Steam, Battle.net, NYT Games.
- Gemini logo runs through `agy` took about 33 minutes each for two of five and reported ERROR while still returning complete answers.
- No SVG-to-PNG tool is installed (no rsvg-convert, ImageMagick, cairosvg); the PNGs were drawn by a small pure-Python script.
- A whois test that checks "not found" before "Creation Date" reports registered names as free (it did for missingpiece.com). The six free .com names were rechecked and hold; the .io column was not rechecked.
- The Impeccable detector's low-contrast flag on `logo-board/index.html` (#ABA79E on white) is a false positive; the validator confirmed by looking.

## Artifacts

- `_outputs/logo-board/` (index.html, logo-1..5.svg, logo-4a..c.svg, logo-missing-piece.svg, concepts.md)
- `_outputs/logo/` (logo.html, logo.svg, logo-1024/512/180/32/16.png)
- `_outputs/demo-prompt.md`, `_outputs/product-description.md`
- `_resources/research/`: names-gemini.md, jonny-mockup-beats.md, jonny-mockup-inventory.md, logo-lookalikes.md, logo-lookalikes-gemini.md
- `_resources/validations/2026-10-06_document-validator-logo-board-first-screen.png`

## Action Items & Next Steps

1. Take Joe's report on the Claude Design demo build and log it in his words. If it came back thin, the reviewer's split is: opening plus screens 1, 4, 5, 6; then 2 and 3; then 7 to 9.
2. Heading font: get his answer (everywhere or only small; Schibsted Grotesk at card-title size), then change `rules.md` and the pack.
3. Logo: before it is called final, an image search and a trade mark register search. The three reworkings and the colour pairings on the board were drawn by the main thread and not validated by a separate seat.
4. Names: if "Missing Piece" stays alive, a Gemini round on names that carry the idea or the initials; missingpiece.com and .io are taken.
5. Confirm the product paragraph's platform sentence.
6. Still open from before: icon style, the visuals skill, Jonny meeting notes, the Telegram thread.

## Other Notes

- One question per turn. Joe reads on a phone. Show short lines in chat before building.
- Things in the demo prompt that are Joe exploring, not decided: Daily Puzzles free and Delve paid; not paying = today's puzzles, nothing kept; paying = weekly games, past puzzles, streak, record; no free first Delve scene ("only for now, i'm open to everything"). Jonny's mockup had the free scene and he will notice.
- Jonny's list of ten things he loves about his mockup is not recorded anywhere reachable.
- `../monorepo-games` is read only. `../prototypes/kit/` is not for our files.
