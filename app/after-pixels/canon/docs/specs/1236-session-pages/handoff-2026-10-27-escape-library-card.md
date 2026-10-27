---
date: '2026-10-27'
ticket: '1236'
topic: 'escape-library-card'
status: 'superseded'
type: 'exploration'
---

# Handoff: Escape's THIS WEEK card, carrying v5's session page down to the library game page

> Superseded 2026-10-27: the owner asked for v5 and the card built straight into the app, no playground. Read `handoff-2026-10-27-escape-into-app.md`.

## Current Focus

Design Escape's THIS WEEK card (the now card, top left of Library → Escape) from the session page settled in v5. The owner asked how to carry it down ("how do we downstream this to the library game page?"). Nothing is built yet; start with a playground, per `README.md` § Lessons for playgrounds. The session page itself is background: it is settled, so don't reopen it.

## Task(s)

- **Done, session page (v5):** `playground/v5.html`, `pg-es5.jsx`. Picks ratified by the owner, 2026-10-27 ("Yes" to The door, Lanes and Marks, with no moments):
  - Result 1, **The door:** the open door at cover size, "Escaped" with the verdict inline ("✓ 2 min under par" / "✓ On par" / "✕ 11 min over par"), the figures under it. In progress: the door shut, "Still inside".
  - Lock detail 2, **Lanes:** one lane per lock, two per row on desktop, the picked lane alone on a phone. Tries left to right to the lock's door; a lane that wraps to two rows is an accepted edge case.
  - Tries, **Marks:** one mark a try; a typed lock is dark (wrong) or lit (open); a mechanism's mark is split into its parts.
  - **No moments.**
  - From v4, still standing: the exit door left open on the line and in the result; Lift hover; par centred on its tick.
- **Accepted as they are (owner, 2026-10-27):** a short lane beside a long one has space at its foot; in progress, the lock you're working on has no lane.
- **Planned, the card:** everything below.

## Critical References

- `CLAUDE.md` § Page rules, library game page: four cards in two rows on one grid; cards in a row end level by arranging what's inside, never by stretching; check each card with its fewest and most items; on a phone they stack in order. This binds the card.
- `README.md` § Scope: this ticket covers only the THIS WEEK card and the session page. The streak, Achievements and Your rooms cards stay as the main build has them; don't raise or fix them.
- `handoff-2026-10-27-escape-lock-row-v2.md` § What the owner asked for: the card's earlier brief, still standing where v5 doesn't override it. Fit the space the card has and grow only if needed; no rule or "See what's out for you to play" under it; over par and in progress read as different results in the same design.

## Earlier handoffs

- `handoff-2026-10-27-escape-session-v5.md`: v5 in full: the alternatives not picked, the spec check, the hard play, the AA check and door spacing rule, with measured values.
- `handoff-2026-10-27-escape-session-v4.md`: v4's picks and the on-par sample play.
- `handoff-2026-10-27-escape-session-v3.md`: v3's three designs; the head seam `GS_SESSION_QUIET`.
- `handoff-2026-10-27-session-page-areas.md`: the owner's three areas of a session page; his review of the v2 card (Version 1 his favourite; "Out 28 min" under door 4; doors as tappable buttons as an idea).
- `handoff-2026-10-27-escape-lock-row-v2.md`: the v2 card (Version 1, still what the card shows); the minutes-in-progress decision.
- `handoff-2026-10-27-escape-session-playground-pass-2.md`: the seed's nine earlier rooms; the sample record.
- `handoff-2026-10-27-escape-session-playground.md`: the first rig; the session-body seam in `app/gs-session.jsx`.

## Recent changes

- `playground/pg-es5.jsx`: the hard play `escape-hard` (top of file); the line `Pg5Line` with the 32px door spacing rule; result `Pg5Result` (r 1); lanes `Pg5Lanes`; marks `Pg5Mark` (mode 2).
- `playground/v5.html`: the v5 style block (last `<style>` in `<head>`), every special case commented.
- `README.md` § Lessons for playgrounds: hard play, v5 as the harness, comment special styling.
- `playgrounds.json`: v5 entry under 1236.

## Learnings

- **A brief names what stays as well as what changes.** The owner asked for v4's lock columns with new insides, and v5 built three new layouts instead. When asked to update something, keep the thing and change only what was named.
- **Test on a hard play.** The cabinet lock at 18 tries broke Lanes on desktop, and close doors overlapped on a phone; neither showed on the easy plays. Build the hard play into the card's playground from the start.
- **A rule that fixes one width is usually a rule for every width.** The door spacing was first solved for the phone only; the owner asked why.
- **AA is the project's bar** (`frontend-ui-engineering`). Information also given as text needn't pass 1.4.11, but the owner chose to fix the fill anyway.
- Proposed for the kit (not yet carried): the hard-play and comment-special-styling lessons belong in `skills/build-playground/` and `CLAUDE.md` § Code. The owner may give an official fix for the comment rule.

## Artifacts

- `docs/specs/1236-session-pages/playground/v5.html`, `pg-es5.jsx` (session page, settled).
- `docs/specs/1236-session-pages/handoff-2026-10-27-escape-library-card.md` (this file).

## Action Items & Next Steps

1. Read the card as it stands: `Pg2Card` in `playground/pg-es2-line.jsx:104` (v2's Version 1), on Library → Escape in `v5.html`. Read `app/gs-puzzles-library.jsx` for the store's now card frame and the grid it sits in.
2. Put the open questions to the owner, one at a time (none settled):
   - Which of the session page's parts go on the card: the result (door, "Escaped", verdict), the line, the lanes? The card is a quarter of the page; the session page is one tap away.
   - Does the card's line keep the door numbers and "Out 52 min", or only the doors?
   - Are the card's doors tappable (the owner's v2 idea), opening the session page at that lock, or is the whole card one link?
   - How it stays level with the streak card beside it, which must not change.
3. Build a playground for the card: `playground/v6.html` from `v5.html`, its own storage key, the same Room states including Hard. Bar trimmed to the card's options and the room states only (owner's lesson; which "config" he meant is still to confirm).
4. Check it under, on par, over, hard and inside, at desktop and phone, with the streak card beside it.

## Other Notes

- `Pg2Card` reads `pgeSid` (`pg-es-core.jsx`), which knows only under, over and inside. The card shows this week's under-par play for On par and Hard. The card's playground needs `pg5Sid` or its own.
- The game doesn't record lock minutes, yet the line is drawn by minute. That gap stands for the card too.
- The sample record gives the cabinet lock (typed) dial readings; v5 reads them as plain Wrong. The record should drop them.
- The owner is quick to say when a build misses his ask; answer the specific miss, don't redo unasked parts.
