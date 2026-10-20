---
date: '2026-10-09'
topic: 'rows-and-replays'
status: 'blocked-on-user-direction'
type: 'exploration'
---

# Handoff: replay chip, replay filter, plays rows (History)

## Current Focus

Joe says the work has "lost its way". His last message attached `uploads/Screenshot 2026-10-09 at 10.49.38.png` (History, option 1: Daily Word and Escape rows with a Replay chip beside the title, "Today" heading). He did not say what is wrong in it. **Ask him what the screenshot shows that he rejects before changing anything.** Do not guess.

## Task, in Joe's words, in order

1. "Now you reach history and you see all of your replays." In All groups, maybe another filter for replays (optional). Also maybe a filter to remove replays.
2. Ideation on what the replay button/marker looks like; it isn't clear a play was a replay.
3. Your groups / rooms / escapes card is bloated at this number of plays. "I'm just looking for elegance." "2 plays" line-wraps and expands the row; Solved / Missed / Not played aren't left-aligned, Not played is janky.
4. Wants a playground, about three options, "deep ideation, not fixed decisions". "Ask yourself what should be shown on your groups and how it can be done elegantly."
5. After the first build: "it was supposed to be history. It's supposed to have a filter." Replay marker is a chip, aligned properly, no random dot. Align Not played with Solved/Missed. "Why is it saying two plays? It doesn't take you to anything." "Think about the user flow." "Attack it as a user."
6. Latest: "you've lost your way."

## What I built (state of the files)

`docs/specs/history/playground/rows.html` plus `pg-rows.jsx`. It loads after `pg-history.jsx`, sets the base to four levels up, and is listed in `playgrounds.json`. `app/` is unchanged.

- One row per play on History, the library plays card and the All pages. Each opens its own record. No "2 plays" count.
- Result in a fixed-width column with a fixed icon slot, so labels align.
- Replay chip, three placements (strip: Chip 1, 2, 3): beside the title; leading the meta line; under the result.
- Replay filter on History and the All pages: Show/Hide (1 and 3) or All plays / First plays / Replays (2).
- Visual check done only for option 1 on History.

## Learnings

- Reading Joe's requests as a pointer at the card's rows cost two rounds. His point was History plus a replay filter; the card was one concern among them.
- First build leaked stale CSS (`.pr-m`, `.pr-t`) into the new rows. Removed.
- The stray dot was the meta separator hitting the chip.
- "Your rooms" is Escape's existing heading (`app/gs-puzzles-library.jsx:52`), not new.
- Possible issue visible in the screenshot, unconfirmed: all of a day's Daily Word replays are chipped but only the earlier first play is not, so a replay can appear above its original. Also the seed shows the same edition, "Daily Word #212", on three rows.
- The preview's 40 "file not found" warnings are the `<base>` false positive.

## Open

- What Joe rejects in the screenshot.
- Chip placement 1, 2 or 3; Show/Hide against the three-way filter.
- Whether the library card should list plays or editions, and what a card row should open.
- Replay wording is draft.

## Next

1. Ask Joe the one question above; wait.
2. Check options 2 and 3, the All pages, Escape and phone width before showing him anything.
3. Port into `app/` only after he ratifies.
4. Earlier rulings: `docs/specs/history/handoff-2026-10-09-history-playground.md`.
