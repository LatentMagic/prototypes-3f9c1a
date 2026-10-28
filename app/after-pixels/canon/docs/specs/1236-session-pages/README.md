# 1236 Session pages

## What a session page is (owner, 2026-10-27)

A session page shows one play and how it went. Its top section belongs to the platform and is the same on every game: the cover, the title, Play and Share, for example; exactly what it holds is still to be designed. Below it, the play is told in the game's own terms: its design choices evoke the theme of this game, so it feels like this game and no other, while staying recognisably After Pixels. The background and chrome stay the store's; the game comes through in its elements. A page the player is excited to go and see.

Each game's session page is being redesigned one game at a time. Each page should feel like its own game and still read as part of After Pixels. Escape comes first.

## Escape: the question

What should Escape's session page be, built on the timeline, and how should it connect with the THIS WEEK card at the top left of Escape's library game page?

## Where it stands (2026-10-27)

Escape's session page (v5) and its now card are in the main build: `app/gs-escape.jsx`. Latest: `handoff-2026-10-27-escape-into-app.md`.

Daily Word's session page (the playground's option 1, rows on grey) is in the main build: `app/gs-word.jsx`. The owner rejected it on 2026-10-28; its redesign is the v6 playground (`playground/word-v6.html`, `handoff-2026-10-28-word-session-v6.md`). Also: `handoff-2026-10-28-word-asset-and-edition-picks.md` (Daily Word's cover everywhere, Config → This edition).

## Settled, not reopened here

- Every game's session page shares the same top section: the cover, the game's title, Play, Share and the like. Only the session's own information below it belongs to the game.
- Share is a button that opens the store's share pop-up. The share text is not on the page.
- The background, the page's chrome and the colours are the store's. A game's character lives in its elements.
- The bespoke content evokes its game in a way specific to that game, without straying so far from the design system that it no longer feels like After Pixels. (Owner, 2026-10-27, replacing "the door from the cover's flat shapes is as far as it goes".)
- No paragraphs. The first phone screen holds a headline, a few figures and one picture.
- Kept from the first exploration, not ratified yet: the timeline as the main picture, the cover's door as the mark for each lock, par shown quietly, and every move available on the page.
- The page shows only what the game records.
- **The head does not show the result.** The result ("Escaped, 2 min under par", "3 out of 5") is specific to the session, so it belongs in the game's own part and is designed there, for every game. (Owner, 2026-10-27; ratified as a rule 2026-10-28.)
- **Every session page has a result statement: an element of its own, mandatory.** It states the outcome outright ("Escaped"; Escape adds the open door). It is shared language across every game, themed per game, and it carries down to the library game page. It is designed as an element, with its own ideation, never a quiet caption. (Owner, 2026-10-28: "this is a really fundamental thing"; "worth logging".)
- **The result is designed, never a plain line.** It says plainly whether you succeeded, and success is never carried by colour alone. (Owner, 2026-10-27: v4 goal, and the review of v2's result line.)
- **When tapping something changes a picture, the control and the picture are on screen together**, at every width. (Owner, 2026-10-27.)
- **The record is drawn as the thing it is in play**, not as plain numbers or a generic chart, and not so literally that it leaves the design system (his example of too far: rolls drawn as real dice). (Owner, 2026-10-27.)
- **A card only reads as a card if it holds real content, not dead space.** (Owner, 2026-10-28, said of Daily Word, "just like Escape"; ratified as a rule the same day.)
- **On every game's now card, the result holds the top right at every width**, the title wrapping beside it. (Owner, 2026-10-27: "it applies everywhere".)
- Make "Every move" a plain list, collapsed behind its heading, below the session's own picture. It is not part of this playground: don't redesign it in any option. (Owner, 2026-10-27. The main build shows the list open, under an H2, not collapsed.)

## Scope (owner, 2026-10-27)

The library game page has four cards: THIS WEEK (the play you just made), the streak card, Achievements and Your rooms. This ticket covers only two things: the THIS WEEK card and the session page it opens.

The streak, Achievements and Your rooms cards have known problems with how they use space, including the empty space at the foot of the streak card. Those are out of scope. Leave them as the main build has them, and do not raise or fix them in this ticket.

Later games' session pages join this folder.

## Lessons for playgrounds (owner, 2026-10-27)

- **Nothing is an invariant unless the owner ratified it in words.** Something an earlier build invented stays open, even after it has shipped in a playground. (Owner, 2026-10-27.)
- **A brief names what stays as well as what changes.** When asked to update something, keep it and change only what was named. Escape's v3 dropped the timeline nobody asked to drop, and v5 replaced v4's columns when only their insides were to change.
- **Session page first, then carry it down to the now card.** (Owner, 2026-10-27, for Escape; he may suggest the order for future games.)
- **A rule that fixes one width is usually a rule for every width.** (Owner, 2026-10-27, on door spacing: "why is this a mobile-only problem?")
- **Test with a hard play.** Every playground in this ticket carries a hard sample play, built to the game spec's limits (for Escape: many locks, a lock with a long run of tries and all its hints, a mechanism that runs out of tries). The owner can't ratify a design he has only seen on easy data. Escape's is `escape-hard` in `playground/pg-es5.jsx`.
- **The v5 playground is a good harness.** Start the next game's playground from it: the real store, one bar with the picks and the room states, Why, and the sample plays held once.
- **Comment special styling in the code.** Any styling that changes with width, state or data (adaptive layout, a rule for one state only, a contrast fix, a hit-area rule) carries a short comment saying what it does and when, so an agent reading the code finds it without a spec ticket.
