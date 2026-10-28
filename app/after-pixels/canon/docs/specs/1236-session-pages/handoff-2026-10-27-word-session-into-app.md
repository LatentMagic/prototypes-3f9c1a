---
date: '2026-10-27'
ticket: '1236'
topic: 'word-session-into-app'
status: 'in-progress'
type: 'build'
---

# Handoff: Daily Word's session page, into the main build

## Current Focus

The owner reviews the board in the main build, Hard first at laptop height. One open call: whether the not-in-the-word tile still reads like an empty box now that empty slots are underlines (see Calls I made). Session page only: Daily Word's now card was not in this brief.

## Task(s)

- Done: option 1 ("Rows on grey") from the session-pages-2 playground (owner's upload, `uploads/daily-word-session-page/`, read and not copied in) built into the app, with the owner's rulings (`uploads/daily-word-session-page/RULINGS.md`), the screenshot bug fixed and the two "still owed" items addressed.
- Bug fixed: the grey ground was narrower than the board, so the right column of tiles hung off it. The playground set the board's width and the ground's padding separately (`word.css`, last rule). The board is now `width: max-content` and sized by its tiles, so the ground always wraps them.
- Fit: from 640px the tiles are sized to the window's height (`clamp(40px, (100vh - 620px) / 5, 72px)`), so Hard (five guesses and the hint) fits below the head at 1440×900 (56px tiles) and 1280×800 (40px). This was not checked by eye in this session; the verifier was asked to check it.

## Where

- Library → Daily Word → see the play. Hard, Failed and In progress through States: `session-word-hard`, `session-word-failed`, `session-word-in-progress`; today's play is `session-puzzle`.
- QA entry `word-1236`.

## Earlier handoffs

- `handoff-2026-10-27-escape-into-app.md`: Escape's session page and now card in the app; the session seams this build reuses.
- `handoff-2026-10-27-escape-library-card.md`, `-escape-lock-row-v2.md`, `-escape-session-playground.md`, `-escape-session-playground-pass-2.md`, `-escape-session-v3.md`, `-v4.md`, `-v5.md`: Escape's playground passes and rulings.
- `handoff-2026-10-27-session-page-areas.md`: the shared head and the game's own area.

## Recent changes

- `app/gs-word.jsx` (new, loads after `gs-escape.jsx`): the model (`wdScore`, `wdRead`), the board (`WdRow`, `WdHint`, `WdSlots`, `WdBoard`), the session body (board, then Every guess in a closed Disclosure, as Escape's), the session cover `GS_ART['word-sess']` and its tap handler, and the hooks `GS_SESSION_BODY.word` and `GS_SESSION_ART.word`.
- `app/gs-session.jsx`: one new seam, `window.GS_SESSION_ART[gid]`, a cover the session page shows instead of the game's own.
- `app/gs-data.jsx`: `word-today`'s hint is now "Letter 2 is T." (it said "contains the letter I", which the game never gives); new `word-hard` (No. 210) and `word-failed` (No. 208), the playground's plays.
- `index.html`: the `wd-*` styles in a last `<style>` block; the script tag.
- `app/states.jsx`: the three states above. `app/qa.jsx`: `word-1236`.

## Decided (owner, 2026-10-27, from RULINGS.md, carried as given)

- Tile colours: in place `#4CC38A` / `#08140E`; in the word `#E5A63B` / `#1B1917`; not in the word a `#918B80` outline, `#ABA79E` letter, no fill.
- Option 1, rows on a grey ground (`#302D2A`, the playground's value), centred; fits a laptop in Hard; not too big. Tiles have no hover.
- The hint is its own slim row where it was taken, its letter in its place; the word "Hint" at most.
- The cover's square rests small and thin, and grows and fills on hover, focus or tap.

## Calls I made (not ratified)

- **Empty slots (in progress) are an underline, not a box**, so an outlined tile always means a letter not in the word. This answers "wrong-letter tiles read like empty boxes" without touching the ruled miss tile. If the owner still sees the problem on a finished board, the next lever touches the ruling (a fill or no outline) and needs his word.
- **The hint has a solid 2px off-white edge** in place of the dashed box (the design system has no dashed edges). The dotted marks in the other columns are gone; "Hint" sits in the next column (the one before if the hint is letter 5), muted, 13px.
- **Tiles are square** at every width (the playground's were 0.9 high); square fits the height budget best.
- **The recoloured cover shows on the session page only.** Product pages, Discover, Library and the animated `GameArt` keep the old Word cover (amber, cream, teal outline).

## Gaps

- `app/gs-chats.jsx:25`, the product page's chat demo, still gives a "contains the letter I" hint, which the spec rules out. Out of this brief.
- Per-letter marks on a play in progress: the record holds counts until the day ends; the seed computes the marks from its answer (the playground's cost line).
- `word-hard` and `word-failed` aren't in the play log, so Your plays and History don't list them; they're reached through States only.

## Next

- Owner checks Hard at 1440×900 and 1280×800 and rules on the miss tile; then delete QA entry `word-1236`.
- Daily Word's now card on its library game page, if wanted (Escape's pattern: `EsNow` in `gs-escape.jsx`).
