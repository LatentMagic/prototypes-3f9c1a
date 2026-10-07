---
date: '2026-10-06'
topic: 'demo'
status: 'in-progress'
type: 'implementation'
---

# Handoff: demo — home page proposal ratified, logo added

## Current Focus

No question is open. Next: the critical pass over the remaining screens (Action Items 2).

Background: the user asked for a critical pass over the whole prototype ("attack it") before reviewing it. Only the home page has had that pass. The other eight screens have not been checked by eye at 320px, at the phone frame or on desktop.

## Task(s)

- Done, ratified 2026-10-06: the home page "Proposal" replaces the previous home page. The old version and its Config switch are deleted.
- Done, ratified: the Daily Puzzles card tag reads "10 min" (`app/gs-data.jsx:31`), and the Daily Puzzles game page tag reads "10 min each" (`app/gs-puzzles.jsx:90`).
- Done, ratified ("That's great. Yes"): the opening layout. On desktop, two columns centred against each other. Left: the headline on two lines broken after "you." (each half a nowrap span, sized `clamp(34px, calc(4.6cqi - 4px), 52px)`), the sub-line, "Start free" and "See how it works", and the WORKS WITH label and list. Right: the word-puzzle chat in an AI app window over four game covers.
- Done, not separately ratified: the logo (`assets/logo.svg`, copied from the design system) in the top bar next to "[Platform]", as the favicon, and before every "[PLATFORM] ·" server panel label in all chat windows. The user asked for the logo; where it appears was my call.
- Done, not separately ratified: the framed chat window (`GsChat framed`: title bar with three square window buttons, "Reply to your AI" box, no caption). The user asked for "a more obvious mockup" and approved the result as part of the opening.
- Done, ratified 2026-10-07: the home "Available games" section. Home shows four picked games, never the whole library; "All games" holds the rest. A card is cover, name, one line and tags; detail is one click away. 1100px and up: four across. Below that: one sideways row (cards ~82% wide on phones, 220–280px otherwise), light snap to centre. "Coming soon" cards stay underneath.
- Done, ratified 2026-10-07: the Games page. Daily Puzzles is one wide card (240px cover beside it on 720px+) holding today's three puzzles, side by side from 1100px. Casebook, Delve and Hunter-gatherer are three even cards with a 3:1 cover strip and their "Part of the Pass" detail. Coming soon stays underneath. Hunter-gatherer's weekly detail is a gap ("—") until upstream supplies it.
- Done: page headings sit 36px below the top bar at every width (`.gs-main` padding; `.gs-wrap` now sets only inline padding).
- Not done: a site footer (legal, connecting your AI). The Circlists reference site has one. Not raised with the user as a question yet.
- Not done: the cover SVGs use colour codes instead of the system's named tokens (`--cover-bg-indigo`, `--cover-amber` etc. in `tokens/colors.css`). The user was told; the switch waits for their go-ahead.

## Critical References

- `CLAUDE.md`: the ratification rule, and one decision per reply with the ask on the last line.
- `docs/specs/demo/PROMPT.md`: the brief. Home copy stays word for word from it.
- The design system guide (`_ds/mcp-game-store-design-system-ef1abd5b-…/`). The 52px home headline goes past the system's 34px page-title size. The user approved the look, but not a rule change in the system.

## Recent changes

- `app/gs-home.jsx`: `GsHome` is the proposal: `GsFeature` (a wide game card), `GsTodayList` (today's three puzzles inside the Daily Puzzles card), and the hero with `.gs-hero-covers`. The old home, `GS_HERO_SHAPES` and the variant switch are deleted.
- `app/gs-parts.jsx`: `GsChat` gets a `framed` prop and an optional caption. `GsPanel` puts the logo before its label. `GsWordChat` takes `framed`. `GsTopBar` shows the logo mark in the brand button.
- `app/gs-config.jsx`: the Home page row is removed.
- `app/gs-data.jsx:31`: "10 min".
- `index.html`: favicon links. CSS for `.gs-brand-mark`, the panel label, the framed chat (`.gs-win-dots`, `.gs-composer`), the "home proposal" block (`.gs-hero3`, `.gs-hero-art3`, `.gs-hero-covers`, `.gs-feat`, `.gs-today*`, `.gs-who2`, `.gs-card-foot`), and the 900px container rules for the hero. `.gs-br-wide` is now unused.

## Learnings

- `DS.Cover`'s box (`.mcp-cover-art`) sets a 4:3 ratio and a `--line` background. To change the ratio, set it on that box, not on the SVG, or a grey bar shows (`.gs-feat .mcp-cover-art { aspect-ratio: 16/10 }`).
- A full-width headline above a two-column hero left the left column short and the bottom left empty. Keeping the headline in the column, centred against the art, balanced it.
- The PDF can be read as text only. Rendering it to an image times out. It is the earlier Delve page and has no home or install content.

## Artifacts

- `docs/specs/demo/handoff-2026-10-06-home-proposal.md` (this file)
- `assets/logo.svg`, `assets/logo-32.png`, `assets/logo-180.png`

## Action Items & Next Steps

2. Carry on with the critical pass, one screen at a time: Games, Delve, Daily Puzzles, Session, History, Pass, sign up and sign in, Connect. Check each at 320px, at the phone frame and on desktop. Put findings to the user one decision per turn.
3. Ask whether the home page wants a site footer.
4. With the user's go-ahead, switch the cover SVGs to the named cover tokens.
5. Still open from earlier handoffs: keep the checkout step before the Pass view switches? The unratified items in `handoff-2026-10-06-first-build.md` and `handoff-2026-10-06-home-rebuild.md`.
6. Once signed off, delete the QA entry "nine-screens" (`app/qa.jsx`) and ask about a `CHANGELOG.md` entry.

## Other Notes

- The user is sensitive to first impressions and to empty space in layouts. Check balance at desktop width before showing anything.
- When offering alternatives, say plainly which one is on screen and how to tell them apart. "Proposal" and "Current" confused the user.
