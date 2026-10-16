# Upsell proposal build: one Claude Design prompt

One prompt that builds a single proposal page, with a mini playground per section, in the MCP Game Store prototype. It carries every decided change from Joe's 2026-10-15 review, each with variations to choose between, and the open items as variations only. Source: `_resources/ratified-2026-10-15.md`, the 2026-10-15 log, and the proposal's content.

## Mode chosen: Playground, built in the live canon project

`biz-authoring:build-design-prompt` says a Playground fits an open question with several plausible answers, built beside the prototype and never into it. That is what "the proposal with some mini playgrounds" is: a page beside the app, nothing accepted into `app/`, real components mounted with switches. Candidate build was rejected: it is the whole app, and canon's skill says it is only on an explicit request (as the Discover prompts used). Delta was rejected: it builds into the app.

Departures from the Playground template, all declared:
- It runs in the live canon session, not a fresh one, because Joe asked canon to build it.
- It states the decided changes as the floor, and supplies copy variations (Joe wants copy choices; the wording is not final).
- It names placement, widths and several switches itself (the situation switch, E's every-visit/once switch, C's Account-sentence switch, the share-arrival switch), where the template leaves them to the builder.
- It supplies design options for about nine items (A4 lock, A6 hero, B, C, D1 done card, F2 Library, G connect, and the copy sets), where the template leaves design to the builder; three are named from the record's lever (card lock, done card, Library).
The template's closing hand-off line is kept; the skill is not named for the builder.

## How Joe pastes it

1. Open the live MCP Game Store Claude Design project (`https://claude.ai/design/p/9aec15ee-6c7b-496d-ae68-b88b64b5ccaf`).
2. Paste `upsell-proposal-prompt.md` into the live session.
3. Attach the twelve images in this folder: `home-1-2-a-band-true-line`, `home-1-3-a-lock-only-closed`, `home-1-3-a-escape-no-mark`, `home-1-1-a-hero-caption`, `arrival-2-2-c-today-first`, `arrival-2-4-b-empty-library`, `free-part-done-3-1-a-mid-case`, `free-part-done-3-1-a-1st-visit`, `end-of-road-3d-1`, `landing-5-1-a-library-landing`, `landing-5-1-a-foot-find-another-game` (all .webp) and `barrow-ch1-done-frame.png`.
4. Wait for its handoff, then open the page from `playgrounds.html`.

## Left out on purpose

- No screenshots of canon itself (the skill bars the builder's own build): the `today-*` shots and Joe's mobile play-box screenshot are not attached; the prompt describes them in words.
- Proposal content is carried as the argument inside each item (what, why, what the image shows), not as the whole file: `_outputs/proposal-content.md` is 60 KB and still lists dropped options. It can be attached as a second file if Joe wants the full text.
- Not in scope, as ruled: Discover, chat-side copy, the Pass page.

## Calls the record did not settle (all listed open in the prompt)

- Copy variations are mine (Joe asked for choices; none is a ruling), including the Pass-only play-box lines (from research section 13).
- A3 placement choices, E's "every visit / once" switch, C's Account-sentence switch, the display-only share-arrival switch.
- Canon already puts the Pass section below the games; the prompt says to leave it.
- Mode choice and the departures above.

## Not grounded

- Whether the Claude Design project can read the business-ops repo: nothing is pointed at it, all is inlined.
- Library already takes a preselected Genre and Schedule from the route (`gs-discover.jsx:123-125`); there is no played/unplayed filter, so F2's link needs a new one (the prompt says so).
- `ui.md` for the product was not found; the cross-app standard `ui-design.md` binds.
