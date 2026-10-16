---
date: '2026-10-16'
ticket: '1153'
topic: 'pass-upsell-merged'
status: 'complete'
type: 'merge'
---

# Handoff: 1153 merged into the main build

## Current Focus

None open. The owner accepted the ratified candidate entire on 2026-10-16 and it is now the main build. The next session starts on whatever the owner raises next. Everything below is background, plus three small `app/` follow-ups that the owner hasn't scheduled.

## Task(s)

Done this session, in order:
1. **Two recheck fixes** in the candidate. Daily Groups offers no Play to a Pass-ended player. New for you holds only what a player can play now, under any Config setting.
2. **A free player's Daily Groups Library page** shows the "Only with the Pass" card, as 36,000 Summers Ago's does (owner).
3. **The design system's Pass mark** replaced the candidate's own pill. GameCard, GamePick and GameTile take `pass`. The project's `_ds/` copy was refreshed from the design system project to get it.
4. **Merge** (`skills/candidate-build` § Merging a whole candidate), then the `CHANGELOG.md` entry the owner ratified.

## Critical References

- `docs/specs/1153-pass-upsell/handoff-2026-10-16-pass-upsell-ratified-candidate.md`: the full record of what the candidate holds, with clicks. Its "Merged, 2026-10-16" section lists what moved where.
- `skills/candidate-build/SKILL.md`: the merge steps that were followed.

## Recent changes

- Seed (owner, 2026-10-16): a free player hasn't played today's Daily Word or Escape's first room, so New for you holds both by default. `freeNew` in `gs-pass-store.jsx`; Config → Free: Word and Escape → Played restores the old seed. States `word-free`, `games-free`, `free-puzzle-result` and `pur-word-done` set Played, since their labels say played today.

- `app/gs-more-games.jsx`: the ten Pass-only games (Daily Cipher, Daily Pin, The Night Train, Saltmarsh, Heist, The Long Winter, Far Side, The Court of Ash, Low Tide, Clockwork). `main.jsx` routes them; `gs-pass-store.jsx` and `gs-pass-library.jsx` read their `added` flag.
- `app/gs-pass-library.jsx`: New for you is GameTiles in a sideways CardRow (owner, 2026-10-16), square pictures with the Pass mark, as Discover's wall. The design system now has `CardRow kind="tiles"` at the wall's size; `_ds/` was refreshed to get it. Every tile is the one `GsTile` in `app/gs-parts.jsx` (props `pass`, `page`); Discover's `CprTile` and Library's own tile were folded into it.
- `app/gs-pass-library.jsx`: Library rows' lead is the game's cover drawn as History's (`PhLead`), not `GpMini`. Canon's `GsLibrary` in `app/gs-discover.jsx` still has `GpMini`; the merged Library replaces it.

- `app/gs-pass-store.jsx`, `-home.jsx`, `-game.jsx`, `-pricing.jsx`, `-library.jsx`, `-discover.jsx`, `-aids.jsx`: the candidate's overlays, renamed off `cand-*`. `cpr-*` classes became `gs-pu-*`; `CandPUR` became `window.GsPassStage`. Demo-game lines removed.
- `index.html`: the "The Pass upsell (1153)" CSS block at the end of the head. The seven `gs-pass-*` scripts load after `gs-editions.jsx`, before `main.jsx`.
- `app/main.jsx`: `signedIn` and `setDemoView` land on `library`, not `games` (this was the bridge's job).
- `app/states.jsx`: `gsPassSet` helper, and ten states in group "Pass upsell" (ids `pur-*`), inserted before `library-groups-free`.
- `app/qa.jsx`: the "Pass ended: every case" entry.
- `CLAUDE.md` screen map: a `gs-pass-*.jsx` line.
- `playgrounds.json`: the ratified candidate's entry is `"on": false` and points at the archive.
- `CHANGELOG.md`: the 2026-10-16 entry.
- `_ds/mcp-game-store-design-system-…/`: bundle, manifest, styles, components.css and tokens refreshed from the design system project.

## Learnings

- **The preview's "53 referenced files not found" warning is the `<base>` false positive.** Every path it lists is one folder too deep. That page loaded throughout. Per `CLAUDE.md` § Files the warning can't confirm the depth, so a page has to be loaded to check.
- **A design-system update doesn't reach this project by itself.** `_ds/` is a copy. The new `pass` prop existed upstream while the local bundle had none. Compare against `/projects/ef1abd5b-…/_ds_bundle.js` before assuming a component prop exists.
- **`index.html`'s head was newer than the candidate's** (the underline rules). The merge kept `index.html`'s head and added only the candidate's marked block. Copying the candidate's whole head would have rolled those rules back.

## Artifacts

- Archive: `docs/archive/1153-pass-upsell/candidate/` holds `pass-upsell-ratified.html`, `cand-pass-upsell-ratified-*.jsx` (bridge, store, demo, home, game, pass, library, discover, aids).
- Still live in `docs/specs/1153-pass-upsell/`: `candidate/discover-tidied.html`, `candidate/discover-games-hub.html` and their `cand-discover-*` files, `playground/`, and the earlier handoffs.

## Action Items & Next Steps

1. **Ask the owner whether to archive the two Discover candidates and the playground.** The candidate handoff planned it after acceptance. They now load the merged `app/`, so sign-in lands on Library in them too. Ask; don't archive unasked.
2. Small `app/` follow-ups from the candidate handoff, not yet scheduled:
   - `GS_SOON` (`app/gs-data.jsx`) and `app/gs-barrow-library.jsx` still say chapter 2. `gs-pass-store.jsx` patches the data on top.
   - `app/gs-pass-discover.jsx` still holds a copy of canon's `DcBody` page shell. The real fix is in `app/gs-discover.jsx`.
   - New for you reads "played at all"; it needs a played flag per edition in the seed.
3. Update `docs/specs/1153-pass-upsell/README.md`: it still says nothing here is accepted.
4. **End of session:** `uploads/` holds screenshots and webp exports from 13–16 Oct. Delete what nothing references (`CLAUDE.md` § Files). Check `uploads/directory-listings/` and the READMEs before deleting.

## Other Notes

- **The ten games are in the main build** (owner, 2026-10-16), in `app/gs-more-games.jsx`. I first left them out on a builder's note calling them demo fill; that note was never ratified. Don't remove them again.
- The owner accepted the candidate entire. That settles the items it held as proposals or builder calls: the Pass-ended rule, "A NEW WORD EVERY DAY", and the calls listed in the candidate handoff.
- The states' ids kept their `pur-` prefix so any link handed out still opens them.
