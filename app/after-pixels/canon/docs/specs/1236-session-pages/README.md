# 1236 Session pages

## What a session page is (owner, 2026-10-27)

A session page shows one play and how it went. Its top section belongs to the platform and is the same on every game: the cover, the title, Play and Share, for example; exactly what it holds is still to be designed. Below it, the play is told in the game's own terms: its design choices evoke the theme of this game, so it feels like this game and no other, while staying recognisably After Pixels. The background and chrome stay the store's; the game comes through in its elements. A page the player is excited to go and see.

Each game's session page is being redesigned one game at a time. Each page should feel like its own game and still read as part of After Pixels. Escape comes first.

## Escape: the question

What should Escape's session page be, built on the timeline, and how should it connect with the THIS WEEK card at the top left of Escape's library game page?

## Where it stands (2026-10-27)

Escape's session page (v5) and its now card are in the main build: `app/gs-escape.jsx`. Latest: `handoff-2026-10-27-escape-into-app.md`.

## Settled, not reopened here

- Every game's session page shares the same top section: the cover, the game's title, Play, Share and the like. Only the session's own information below it belongs to the game.
- Share is a button that opens the store's share pop-up. The share text is not on the page.
- The background, the page's chrome and the colours are the store's. A game's character lives in its elements.
- The bespoke content evokes its game in a way specific to that game, without straying so far from the design system that it no longer feels like After Pixels. (Owner, 2026-10-27, replacing "the door from the cover's flat shapes is as far as it goes".)
- No paragraphs. The first phone screen holds a headline, a few figures and one picture.
- Kept from the first exploration, not ratified yet: the timeline as the main picture, the cover's door as the mark for each lock, par shown quietly, and every move available on the page.
- The page shows only what the game records.
- Make "Every move" a plain list, collapsed behind its heading, below the session's own picture. It is not part of this playground: don't redesign it in any option. (Owner, 2026-10-27. The main build shows the list open, under an H2, not collapsed.)

## Scope (owner, 2026-10-27)

The library game page has four cards: THIS WEEK (the play you just made), the streak card, Achievements and Your rooms. This ticket covers only two things: the THIS WEEK card and the session page it opens.

The streak, Achievements and Your rooms cards have known problems with how they use space, including the empty space at the foot of the streak card. Those are out of scope. Leave them as the main build has them, and do not raise or fix them in this ticket.

Later games' session pages join this folder.

## Lessons for playgrounds (owner, 2026-10-27)

- **Test with a hard play.** Every playground in this ticket carries a hard sample play, built to the game spec's limits (for Escape: many locks, a lock with a long run of tries and all its hints, a mechanism that runs out of tries). The owner can't ratify a design he has only seen on easy data. Escape's is `escape-hard` in `playground/pg-es5.jsx`.
- **The v5 playground is a good harness.** Start the next game's playground from it: the real store, one bar with the picks and the room states, Why, and the sample plays held once.
- **Comment special styling in the code.** Any styling that changes with width, state or data (adaptive layout, a rule for one state only, a contrast fix, a hit-area rule) carries a short comment saying what it does and when, so an agent reading the code finds it without a spec ticket.
