---
date: '2026-10-28'
ticket: '1236'
topic: 'word-session-v8-canvas'
status: 'superseded'
type: 'exploration'
---

# Handoff: Daily Word's session card, v8 canvas (chip spacing, faint rule, hint row)

## Current Focus

The owner is choosing on the canvas (`playground/word-v8.html`, Launcher → 1236 → "Daily Word session card, v8 canvas"). Last question put to him: **N1, N2 or N3** for the length of the hint row's dots. Not yet answered either:
- Phone spacing: P16, P20, P24 or P32.
- Desktop: S, S3, S5 or S6.
- Hint row marks: D1 to D5.
- In progress, section E: rows played only, or one empty row.

Once those are settled, carry them into the main build (`index.html` Daily Word block, `app/gs-word.jsx`), then move on to the library game page's now card.

## Task(s)

- Done: the canvas, `playground/word-v8.html` + `playground/pg-wd8.jsx`. It renders the main build's own Word body (`GS_SESSION_BODY.word`) in fixed-width frames, each its own `gs` container, and reads tile / chip / hint sizes off the DOM under each label. Every option is playground CSS in `word-v8.html`. Nothing in `app/` was changed for them.
- Done, in the main build: on a phone the hint had turned square. Fixed (see Recent changes).
- Done, on the canvas only: the hint tile is grey on every frame.
- Not done: nothing chosen on the canvas is in the main build yet.

### What the canvas holds now (top to bottom)
- **S, S3, S5, S6:** desktop at 1280px, hard play and In progress. S is as built (32 between, no rule). S3, S5 and S6 have a faint upright rule (`1px solid var(--line)`, the board's height) with 24, 32 or 40px either side.
- **P16, P20, P24, P32:** phone at 390px, all four plays, chip above, faint rule under it. One step X sets the card's padding on every side, chip to rule, and rule to board. `--t` is recomputed for the wider padding (`.c8-ev`), so the board still fits.
- **E:** In progress on P16, three ways: rows played only, one empty row, every row (as built).
- **N1, N2, N3:** the hint row's dots, not the full width. N1 is full width, as built. N2 is inset half a tile from both ends of the board. N3 is a one-tile run either side of the hint only. Each is shown on P16, again staged with the hint at letter 3 (`.c8-mid`, staging only), and on S5.
- **D1 to D5:** the dots' style, at full width. D1 as built, D2 fainter (the `--line` colour), D3 a faint solid line, D4 dashed, D5 none. These were built when I misread a question. They may no longer be wanted.

## Owner's rulings this session (2026-10-28)

- **Built (v9 → main build):** a faint rule between the chip and the board, 20px either side at every width: flat under the chip below 900px, upright beside it from 900px. The card's padding is unchanged (16 phone, 24 from 640px). `index.html` Daily Word block, with a KEEP comment. Chosen on `playground/word-v9.html` ("One rule, 20 either side").
- **Built (owner: "everything from the playground"):** the grey hint (`#918B80` edge, `#ABA79E` letter); 2px more padding inside the hint on desktop, 1px between letter and "Hint" on a phone; no marks either side of the hint (D5).
- **Built (owner, "yes"):** In progress shows only the rows played; the empty rows are gone (`WdBoard`, `app/gs-word.jsx`).

- **Desktop session page is all good**, provided the chip matches the tiles. Measured: tile 56 × 56, chip 56 high at 1280 × 900; on a 390px phone, tile 49, chip 49.
- **Phone: the chip goes above.** Below is worse: "we need to get the signal quicker". B and D are dropped.
- **Spacing is even.** A big space above and a small one below "looks horrific". Start from the card's base padding (16 on a phone) and explore around it. Smaller than that doesn't work.
- **Never lose the card's padding around the tiles.** He has had to correct this more than once.
- **Desktop rule:** S3 only works with more space either side. 16 either side (S4) is out.
- **The hint tile goes grey**, like a letter not in the word (`#918B80` edge, `#ABA79E` letter), not off-white. He asked once; I lost it for a round, and he had to ask again.
- **The hint row's dots** made S3 "feel a little bit weird". He wants to see them not running the full width (section N).
- **In progress:** he doesn't like all six rows showing and leans towards smaller, with the "In progress" chip carrying it. I agreed: rows played only. He hasn't ruled on it.

## Critical References

- `docs/specs/1236-session-pages/README.md`: rules for every session page.
- `handoff-2026-10-28-word-session-v6.md`: the agreed tiles, hint and numbers.
- `CLAUDE.md` page rules for session pages, and the ratification rule.

## Earlier handoffs

- `handoff-2026-10-28-word-session-v7-result.md`: how the result statement became the store's Tag beside the board, and every rejected result idea.
- `handoff-2026-10-28-word-session-v6.md`: v6's agreed tiles, hint and numbers.
- `handoff-2026-10-28-word-asset-and-edition-picks.md`: the Daily Word cover, and Config → This edition.
- `handoff-2026-10-27-word-session-into-app.md`: the first Word board in `app/gs-word.jsx` (later rejected).
- `handoff-2026-10-27-session-page-areas.md`: the three areas of a session page, and the owner's brain dump.
- `handoff-2026-10-27-escape-session-playground.md`, `-pass-2.md`, `handoff-2026-10-27-escape-session-v3.md`, `-v4.md`, `-v5.md`, `handoff-2026-10-27-escape-lock-row-v2.md`: Escape's session page rounds.
- `handoff-2026-10-27-escape-into-app.md`, `handoff-2026-10-27-escape-library-card.md`: Escape in the app, and its now card.

## Recent changes

- `index.html`, Daily Word block, phone rule (`@container gs (max-width: 639px)`, about line 1538): the hint row is `max(34px, calc(var(--t) * .7))` high (was `max(48px, .75t)`), its letter 16px (was 18), with a KEEP comment. Cause: the numbers became always-on, their gutters shrank phone tiles to about 49px, and the 48px floor caught up with them.
- `docs/specs/1236-session-pages/playground/word-v8.html`: the canvas page and every option's CSS (`.c8-ev`/`.c8-x*`, `.c8-vr-*`, `.c8-none`/`.c8-one`, `.c8-n-*`, `.c8-d-*`, `.c8-mid`, the grey hint).
- `docs/specs/1236-session-pages/playground/pg-wd8.jsx`: the frames and option lists (`PG8_SIDE`, `PG8_PHONE`, `PG8_SHORT`, `PG8_DOTS`).
- `playgrounds.json`: the v8 entry under 1236.

## Learnings

- **Scope playground CSS to its own markup.** `.c8-sec h2` also matched the chip (`<h2 class="wd-tag">`) and added 16px under it. Every measured spacing was wrong until it became `.c8-sec > h2`. This could go in `GOTCHA.md`, but only if the owner approves.
- When the owner rejects some options, keep the rest. I removed the larger spacing options along with the ones he rejected, and he had to ask for them back.
- When he asks a question, answer it in words. Twice I built options instead, which cost a round and annoyed him.
- His "spacing" means the same step everywhere, card edge included. It doesn't mean varying the space on one side.
- The canvas skips every script after `app/main.jsx` (the aids). The four `createRoot` console warnings are harmless.

## Artifacts

- `docs/specs/1236-session-pages/playground/word-v8.html`, `pg-wd8.jsx` (new)
- `index.html` (the hint fix)
- `playgrounds.json` (v8 entry)

## Action Items & Next Steps

1. Get his pick for N, then the phone P option, the desktop S option, the D marks (or drop section D), and E. One question at a time.
2. Carry what he picks into the main build:
   - the grey hint;
   - the phone spacing, with the rule and a KEEP comment, because the rule is adaptive styling;
   - the desktop rule and spacing;
   - the dots' length and style;
   - In progress without empty rows: `WdBoard` in `app/gs-word.jsx` draws `p.spare` empty rows.
   Ask before each one that he hasn't ratified in words.
3. Re-check the main build at phone and desktop widths, on all four plays.
4. Then the library game page's now card: the chip, or Escape's plain green text (he leans towards Escape's).

## Other Notes

- The owner is frustrated by repetition, lost requests and over-long replies. Keep replies short, ask one thing, and answer questions directly.
- Not ratified: any spacing value, the rule itself, the dots, and In progress without empty rows. The grey hint is his request, but it isn't in the main build yet.
- `uploads/Screenshot 2026-10-28 at 08.26.18.png` was this session's. It's referenced nowhere, so delete it at the end of the session.
