---
date: '2026-10-28'
ticket: '1236'
topic: 'word-asset-and-edition-picks'
status: 'in-progress'
type: 'implementation'
---

# Handoff: word-asset-and-edition-picks — Daily Word's cover everywhere; Config → This edition

## Current Focus

The owner is working through the gaps in `handoff-2026-10-27-word-session-into-app.md` one at a time. Pick up in this order:
1. **The owner is bringing a redesign of the Config button.** Wait for it. Don't restructure Config further first.
2. Daily Word's now card on its library game page ("we'll come to that", owner).
3. The product page's chat demo hint (`app/gs-chats.jsx:25`, "contains the letter I"). The owner is taking this himself ("I'll capture that"); don't touch it.

## Task(s)

- **Done: the session-page cover is Daily Word's cover everywhere** (owner: "this is the asset now for Daily Word"). `GS_ART.word` is the green, amber and grey-miss drawing; the session-only `word-sess` art and the `GS_SESSION_ART` seam are gone. Word is out of `GS_ART_MOTION`, so the design system's animated `GameArt` 'word' is no longer used.
- **Done: still on the session page** (owner: "shouldn't be a motion asset … as it is with every other session page"). Not focusable, no tap handler. The miss block rests as the small thin outline wherever nothing hosts it (owner's screenshot: the Library row showed it filled, which was wrong).
- **Done: row hover moves covers, for every game** (owner: "they should all have the hover effect on the entire row hover. Check history as well"). Library, History and Your plays row leads are `GsArt`, driven by the design system's `--on`.
- **Done: Config → Every game → This edition**: Not played / In progress / Average / Hard / Failed. The owner chose Config over States, then said "you just manage it" for the rest.
- **Done: game-specific Config rows moved into their own sections**: Escape (par), The Barrow of Hollowmere (chapter 1).
- **Done: Daily Word's History holds a hard play (#210) and a failed play (#208).**

## Critical References

- `CLAUDE.md` product block: the session-page rule (the top section belongs to the platform; below it, the game in its own terms) and the library-game-page grid rule.
- Design system `components/components.css:255-263`: the `--on` game-art rule every cover hover now relies on.

## Earlier handoffs

- `docs/specs/1236-session-pages/handoff-2026-10-27-word-session-into-app.md`: Daily Word's session page build, the owner's RULINGS.md tile colours, the unratified calls (underline empty slots, solid hint edge, square tiles) and the open miss-tile question.
- `docs/specs/1236-session-pages/handoff-2026-10-27-escape-into-app.md`: Escape's session page and now card; the session seams.
- `docs/specs/1236-session-pages/handoff-2026-10-27-session-page-areas.md`: the shared head and the game's own area.
- `docs/specs/1236-session-pages/handoff-2026-10-27-escape-library-card.md`, `-escape-lock-row-v2.md`, `-escape-session-playground.md`, `-escape-session-playground-pass-2.md`, `-escape-session-v3.md`, `-escape-session-v4.md`, `-escape-session-v5.md`: Escape's playground passes and rulings (v4 is where the "hard play" idea comes from).

## Recent changes

- `app/gs-data.jsx`: `GS_ART.word` (line ~27) is the new cover, a plain svg with `class="wd-cover-miss"` on the third block. New today plays `word-today-hard`, `word-today-failed`, `groups-today-hard`, `groups-today-failed`, `mystery-today-avg`, `mystery-today-hard`. `GS_ED_SIDS` (game → pick → session id) and `gsEdPick(gid, gs)`, both exported.
- `app/gs-puzzles-library.jsx` (after the `c.all` build): `pin` (edition index → hand-built session) on `PZ.word` (`{ 2: 'word-hard', 4: 'word-failed' }`). `c.today` is now a getter: `esFinished` for Escape, else `gsEdPick(id) || base`.
- `app/gs-escape.jsx:8-10`: `esFinished(gs)` (This edition: Hard, then the par pick, then `escape-week`); `esSid` uses it.
- `app/gs-history.jsx`: `phCur` puts the picked play onto this edition's row in `phLog`; `PhLead` is always `GsArt` landscape.
- `app/gs-discover.jsx:109`: Library row lead is `GsArt` landscape. `app/gs-player.jsx:94-95`: Your plays button gets `mcp-art-host`, lead is `GsArt` in `.pg-mini-art`.
- `app/gs-parts.jsx:16`: Word removed from `GS_ART_MOTION`.
- `index.html`, last `<style>` block: `.wd-cover-miss` scale, stroke and fill driven by `var(--on, 0)`; `.pg-mini-art`. The old hover, focus and `data-wd-open` rules are gone.
- `app/gs-word.jsx`: the `word-sess` art, the pointerup tap handler and the `GS_SESSION_ART` line are deleted. `app/gs-session.jsx`: `const art = s.art;`.
- `app/gs-config.jsx`: Every game group (`edVal`, `setEd`), Escape group, Barrow group (renders `window.GsBarrowConfigRow`). `app/gs-pass-aids.jsx`: Barrow row split out as `GsBarrowConfigRow`.
- `app/main.jsx:18`: `ed: null` in `GS_REVIEW_DEFAULT`.
- `app/states.jsx`: `session-escape-hard` and `library-escape-hard` now stage `{ ed: 'hard' }`.
- `app/qa.jsx` (end): QA entry `this-edition-picks`.

## Learnings

- Cover motion belongs to the design system's `--on` (`components.css:255-263`): any pressable `.mcp-row`, `.mcp-card`, `.mcp-art-host` or `.mcp-cover` sets it on hover, focus or press. Drive custom art from `var(--on)`, never from your own `:hover` selectors. That way it moves in every host and stays still where there is none.
- The play for the current edition is read through `PZ[id].today` across lbNow, the puzzle library pages, share text and (via `phCur`) History. Change it there, not per surface.
- The History log is built once at load (`gs-history.jsx`, `PH_ALL`), so anything that varies with Config has to be applied in `phLog`.
- No States shortcuts for what Config already reaches in one click (owner, 2026-10-28: two such states were added and cut).
- Mistakes this session the owner flagged (don't repeat): treating the new asset as a session-only override; dropping keyboard focus from a surface while moving something else; asking a question he had already answered.

## Artifacts

- This handoff. Superseded draft of the same name, overwritten.

## Action Items & Next Steps

1. Wait for the owner's Config redesign; fold This edition, Escape and the Barrow sections into it.
2. Daily Word's now card (Escape's pattern: `EsNow`, `app/gs-escape.jsx:197`).
3. If wanted: hard and failed plays for Casebook, Delve, Where, Chain, Salvage and the ten Pass-only games (add to `GS_ED_SIDS`; Casebook and Delve read `cbWeek` and `DV_DONE`, not `PZ`, so they need their own hook). The Barrow and 36,000 Summers Ago have no hard or failed play.
4. Upstream gap: the design system's `GameArt` 'word' still draws the old cover; update it at the source.
5. Still open from the last handoff: Hard at 1440×900 and 1280×800, the miss-tile ruling, then delete QA `word-1236`.

## Other Notes

- Calls I made, none ratified: "Not played" still applies only to a free account; nothing is picked by default, so each game stays as seeded; Escape's par pick is used for Average or no pick; Mystery's right answer today (Delphine Rooke, curtain cord, conservatory) is an invented sample; Word's today plays (hard: CRANE, SLATE, hint, STOOL, STALL, STILL; failed: CRANE, SLATE, hint, STALL, SPILL, SKILL, SWILL) are invented to match the seeded STILL.
- The owner is frustrated with this ticket's earlier work ("this work is bad"). Keep replies short, one question at a time, and don't ask what he has already said.
- `uploads/` holds the owner's screenshot from this session (`Screenshot 2026-10-28 at 05.37.01.png`); it is consumed and can be deleted at session end.
