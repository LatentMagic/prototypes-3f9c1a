# Handoff: comments never cite `docs/` paths (kit update), 2026-10-16

## Rules added (word for word)
- `ARCHITECTURE.md` § Conventions: "Comments never cite a `docs/` path", before "Prefix.".
- `CLAUDE.md`: the decision bullet (Wrapping up) and the `docs/archive/<topic>/` bullet (Files) replaced.

## Lines changed (pointer removed, rule kept)
- `app/gs-player.jsx` header: delve-two-pages handoff path.
- `app/gs-puzzles-library.jsx`, `app/gs-puzzles.jsx`: split-daily-puzzles path.
- `app/gs-home.jsx` header: home-product-hero and home-hero paths.
- `app/gs-editions.jsx` header: game-editions-list path.
- `app/gs-library.jsx`: option-16 handoff path (header); filters-on-a-phone path (line ~166, topic name kept).
- `app/gs-casebook.jsx` header, `app/gs-casebook-data.jsx` header: library-game-page paths.
- `app/directory-listings.jsx`: "Brief: docs/specs/directory-listings/." removed.
- `app/gs-push.jsx` header: notifications path.
- `app/gs-site.jsx`: contact path in the Terms requirement and in the Contact page comment.
- `app/gs-session.jsx` (two), `app/gs-history.jsx` (two): replay-share path; history playground path reworded to "the History playground".
- `app/gs-discover.jsx`: games-and-library path (header); library-access path (Library listing rule).
- `app/gs-connect.jsx` header: connect-and-prompts path (topic name kept).
- `app/states.jsx`: "Final audit snags" group comment.
- `app/qa.jsx` titles: iffy-decisions, fixes, every-edition-playable, replay-share, failed-on-strip, notifications ("not ratified" kept), phone-snags-second-pass, final-audit-snags.
- `index.html` and the three 1153 entries: game-art-motion-more and soon-card-phone paths in shared CSS comments; the 1153 entries' own "Candidate only / Playground only" headers lost their self-path.
- `CLAUDE.md` product block: "until the owner has read the handoff" lost `docs/specs/free-and-pass/`.

## Decisions stated in comments, copied here to travel upstream
- 2026-10-08, ratified: top-bar item is "Library"; a player page is titled with the game's name alone (gs-player).
- 2026-10-08, ratified: library game page is option 16; order is now card, run, achievements, your plays; two columns from 900px (gs-library, gs-casebook).
- 2026-10-09: Daily Puzzles split into separate games (gs-puzzles-library).
- 2026-10-09, ratified: How it works is connect-and-prompts option 4's page, option 5's play dialog (gs-connect).
- 2026-10-09 (Joe): Discover is round 4 option 16 with two picks, Free to play, the Pass band, All games; Just added under the picks (gs-discover).
- 2026-10-10: History and Library filters are option 1b, one Filters panel (gs-library).
- 2026-10-11, ratified: home hero is home-product-hero option 4 (gs-home).
- 2026-10-11, ratified: Play until an edition is finished once, Play again after (gs-session).
- 2026-10-11, ratified: Pass and subscribe pages are option 5 (gs-billing).
- 2026-10-12 (owner): editions list settled; edition panel unratified (gs-editions). Daily Groups' own "Every…" wording (gs-data).
- 2026-10-13 (owner): Available games is a chosen sample, added to only on the owner's approval; More games uses the same list minus the page's own game; Daily Groups and Casebook taken off (gs-home).
- 2026-10-13 (owner): SoonCard on a phone, cover full width on top at 4:3 below 480px (index.html CSS).
- 2026-10-15 (owner): Terms' "Who we are" must carry Harness Intent Ltd's company number and registered office before Terms ship (gs-site).
- 2026-10-15, ratified: Contact page is option 2j (gs-site).
- 2026-10-15 (owner): Library lists a game only if some part is playable now, or the player has held the Pass (gs-discover).
- 2026-10-15 (owner): only the dailies go by number; named scenarios show the name alone (gs-editions).

## Left alone
- Data paths: `playgrounds.json`, `playgrounds.html`, `<script src>` lines in the 1153 entries.
- Topic names without a path ("delve-two-pages", "connect-and-prompts", "soon-card-phone option 2"): names, not pointers.
- History: `docs/archive/**`, `CHANGELOG.md`, old handoffs.
- `CLAUDE.md` line 148 (shared product-page block, not the product block): ends "handoff `docs/specs/989-36000-summers-ago/`". It is a broken pointer by the new rule, but kit-owned text. **Flag for the kit.**

## Unresolved
- Four open tickets moved to the archive last update (free-and-pass, notifications-2026-10-11, rhythm-filters, walk-sweep) failed the new archive test. Moved back to `docs/specs/` after this update, on the owner's go-ahead ("whatever you think is best", 2026-10-16). None had a launcher entry, so `playgrounds.json` is unchanged.
