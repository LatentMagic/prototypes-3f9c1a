# Handoff, 2026-10-27: the session page's three areas, and the v2 card review

The owner's picture of the session page, and his first review of the v2 library card (Version 1). Spoken in a brain dump on 2026-10-27; not yet ratified as rules. Playground: `playground/v2.html`. Earlier handoff: `handoff-2026-10-27-escape-lock-row-v2.md`.

## The session page has three areas (owner's picture)

1. **The chrome**, at the top.
2. **The bespoke content**, about this session.
3. **Every move**, the list, at the bottom.

- The chrome and Every move share one language across all games, with small differences where sessions differ.
- **The chrome does not show the result.** "Escaped, 2 min under par" or "3 out of 5" is specific to the session, so it belongs in the bespoke area and gets bespoke design. Today the store's chrome carries it in the head.
- The same applies to every future game and every future playground: the result is designed as part of the bespoke content.

## Why the v2 card falls short

The library card now carries the session's picture (the lock row) but not its result. The result is still a plain text line under the row. The owner calls this a major gap: the result is the most important session content and has had none of the design work.

## Version 1 card review (owner, 2026-10-27)

- Better than before.
- Still unclear when they got out. "Out 28 min" should sit directly below door 4, so it is clear what it belongs to.
- "Par 30 min" should be centred on its tick.
- The result line ("Escaped, 2 min under par · 30 moves · 1 hint") is acceptable but not pretty. It needs care. The next playgrounds should explore it.
- The result wording is part of a conversation the owner is having with another agent; that brief will come in here.

## Versions 1 to 3 compared (owner, 2026-10-27)

- Few differences between them. Version 1 is his favourite: it makes more of the timeline. It wastes some space, above the row most of all.
- Version 1 loses the door names (Version 2's). On the library page, names may not belong at all.
- **Idea: doors as tappable buttons** that open something (a modal or similar, kind open) with the lock's detail. Possibly the way to use the space well, especially on mobile.
- Version 2 breaks on mobile.
- "Out 28 min" (1) against "2 min spare" (3): no firm preference. He sees 3's gap as the backup. He dislikes "Par 30 min" sitting above the exit in 3.
- His lean: Version 1's labels, with "Par 30 min" centred on its tick. "2 min spare" above it is the fallback. How to make "Par 30 min · Out 28 min" read better is open; another playground pass could settle it.
- The result still needs a design (see above).

## Session page review (owner, 2026-10-27)

- The shared chrome at the top works well. It needs its own playground, but not in this ticket.
- **Out of the chrome:** "1 hint, 2 wrong tries", "Escaped in 28 min" and the line it sits in. That content moves into the bespoke design.
- The use of space is good.
- Every move is built right, as it should be for now.
- The scaffolding is largely right, apart from those chrome corrections.
- Bespoke content: review to come.

## Bespoke content review (owner, 2026-10-27)

### Version 1

- **Clickable moments are a keeper.** Tapping a moment to see where it sits on the row is good, and every game should have something like it.
- Closest miss and Longest stretch light the same door. Switching between them looks like nothing happened, so it feels broken.
- The look of the moment buttons isn't good, though the idea is.
- The doors can't be tapped. Probably right here, since one door can belong to two moments.
- **Rejected for its labels.** The door labels on the desktop page are too inelegant. On mobile the legend under the row works better.
- **Mobile breaks the interaction.** To tap the way-out moment you scroll to the bottom, then scroll back up to see what changed. **Rule he named:** when tapping something changes a picture, the control and the picture must be on screen together. This failure is structural, not wrapping or formatting, and future work must bear it in mind.

### Version 2

- No real design work in it. On the session page it is almost the same as Version 1. The page names every door in all three versions, so Version 2's one idea, named doors, adds nothing here; only the way-out wording changes ("Out at minute 28").

### Version 3

- No real design work in it either. The owner reads Versions 1 to 3 as one design.

## The goal of the bespoke content (owner's brain dump, 2026-10-27, not ratified)

- Grounding in what the game records isn't enough. The bespoke part's **elements and pictures are themselves designed to evoke the game**: the record shown as the thing it is in play, not as plain numbers or a generic chart.
- **The balance:** not the design system drawn literally, and not so far from it that you no longer feel you're on the platform. His deliberately bad example: D&D rolls drawn as real dice goes too far.
- **An example he likes:** a Daily Word prototype (screenshot, 16:56) shows each guess as the game's own tiles (blank, amber, cream), with shapes grounded in the design system. The main build shows bare letters. He may pull it closer to the system still.
- **Escape so far:** the timeline is a good start and works on the library card. The session page adds more content, and that content hasn't been designed ("buttered up"). Of the session pages so far, Escape's is the weakest.
- **Not everything has to be shown.** What goes in is the designer's call; he wants ideas to react to.

## Next: playground v3 (owner, 2026-10-27)

- **Three designs** of Escape's bespoke content (owner, 2026-10-27).
- **Session page first**, then carried down to the library card (owner, 2026-10-27). The owner may suggest this order for future games to the other agent.
- **The result gets design ideation**, on the session page first. Today it is a plain two-line block ("Escaped, 2 min under par" over "13 moves · 1 hint"), on the card as well. The owner calls that bad.
- Nothing above is built yet.
