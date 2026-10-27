# Handoff, 2026-10-27: Escape's session page playground

## What was built

A playground at `docs/specs/1236-session-pages/playground/index.html` (launcher: ticket 1236). It is the real store, opened with the Pass on Escape's library game page. Only two things change: the part of the session page under the shared head, and Escape's THIS WEEK card.

- `pg-es-core.jsx`: the settings store (`pg_escape-session_v1`), the seed it adds, the play model (`pgeBuild`) and the shared parts (the door, the number square).
- `pg-es-opt1.jsx`, `pg-es-opt2.jsx`, `pg-es-opt3.jsx`: each option's session body and card picture.
- `pg-es-rail.jsx`: the hooks into the app and the panel. The panel is docked at 1024px and wider. Below that it is a strip above the demo bar that opens the panel in the store's own Popup.
- `app/gs-session.jsx` gained one seam: `window.GS_SESSION_BODY[gid]`, if present, draws the session's own part in place of the move list. The main build never sets it, so nothing changes there.

## How to reach each part

Open the rig and use the bar at the bottom (see "The controls" below). Go to: Library card is Library → Escape; Session page is Library → Escape → See every move. To see the phone layout on a wide screen, use Config → Viewport: Mobile.

**Controls pattern, proposed for reuse (not ratified):** one folding bar above the demo bar holding the options, states and routes in a single row, the reasoning behind Why, and number keys. If the owner agrees, it goes into `skills/build-playground/` and back to the kit.

## The options

1. **The line.** One bar from going in to getting out. The cover's door marks the minute each lock gave way, and par is a thin mark. On a wide page, the name, minute, tries and hints are written under each door, so the separate legend is gone. On a phone, number squares sit under the doors with the lock list beneath, as before. Every move is a row of numbered squares with a door after each lock. You read one move at a time with Previous and Next. The card holds the same bar, small. Cost: you read the moves one at a time, and locks close together stack their labels.
2. **The rail.** The play reads top to bottom: in, the moves, each door with its minute, par where it fell, then out. The moves sit on the line between the doors, folded on a phone and open on a wide page. The card lays the line on its side, with a door per lock and its minute under it. Cost: the line is not to scale, and a long play makes a long phone page.
3. **The minutes.** A square for every minute: ten to a row on a phone, and thirty (par) to a row on a wide page. Doors stand in the minute each lock gave way. Over par spills onto the next row, and under par leaves empty squares. A ledger lists every move by lock, one line each, and the room's words open with a tap. The card holds the same squares, small. Cost: lock names are off the picture, and a longer par needs more rows.

## Calls I made (none ratified)

- **The shared head is the store's own** (`GsSessionRecord`), untouched: the result as H1, the date, the figures, then Share and the played-once line. On a phone, Share now sits under the figures.
- **The legend is plain words**, such as "2 tries · 1 hint: a nudge", "3 hints, up to the answer" or "First try". The ×N and hint-square marks are gone.
- **Unfinished means in progress.** Escape has no clock during play, so no option shows time or par until you're out. None of them says how many locks are left.
- **Over par is a second, sample play** of the same room (`escape-over`, 41 min, 4 hints, 7 wrong tries). Its moves and hint wording are invented sample data, held once in `pg-es-core.jsx`.
- **Lock minutes come from the seed**: 6, 17, 19 and 28 min, as in the first exploration. The game records them, but the store's seed doesn't hold them yet.
- The library card keeps its canon frame (label, title, result, Share, link, next room) and swaps only its picture and line. Its line is worked out from the play ("You got out in 13 moves, with 1 hint.").

## The streak card (2026-10-27, after review)

**What the owner asked for:** remove the white space at the foot of the streak card on the library game page, and nothing else. The card's design is the store's own and must not change.

**Cause:** cards side by side end level (owner, 2026-10-13). This playground's THIS WEEK card is taller than the store's, so the streak card beside it is stretched. The store caps the card's run at 132px (`.lb-runbody { max-height: 132px }`), and the spare height sits empty at the foot. The same gap shows on other library pages whenever the left card is taller.

**What went wrong this session:** two wrong fixes before the current one. Neither is in the files any more.
1. A redesigned streak card, with doors in place of the week bars. The owner rejected it, and it has been reverted.
2. Lifting the 132px cap so the bars grew into tall slabs. The owner rejected it, and it has been reverted.

**Where it stands now:** this has not been accepted by the owner, who may not have seen it. In the playground only, at 900px and up, the library layout places the cards so that the streak card keeps its natural height and Your rooms follows directly under it in the right column. THIS WEEK spans the left column's first two rows, with Achievements under it. It is the CSS block headed "Library game page, 900px and wider" in `playground/index.html`. It applies to every library game page in the rig, and the streak card itself is untouched.

**For the next session:** confirm with the owner, on screen, that the gap is gone and nothing else moved. Check Escape (finished, in progress) and one daily game. If it is accepted, the fix belongs in `app/` (`index.html` layout rules), not in the playground.

**Also:**
- Escape's run shows ten weeks: nine earlier sample weeks (`PGE_SAMPLE_PAST`) added through the shipped `LbRun`. Only the weeks and the count change.
- Left as built: the store's key shows "Failed" for Escape, which has no losing outcome. This is not raised with the owner yet.

**Lesson:** when the owner names one defect, fix that defect with the smallest structural change, and never restyle the component around it. Show the fix on screen before reporting it.

## The controls (changed 2026-10-27)

The panel is now one bar pinned above the demo bar, so the app keeps its full width and its own layout. It holds Option 1 to 3 (and Why, which opens the case for it and the cost), Room (Escaped, Over par, Unfinished), and Go to (Library card, Session page). The arrow folds it to a small tab at the bottom right. Keys: 1 to 3 for the option, S to step the room.

## Not built, or open

- Only the Pass view's card is built. A free player's first-room card (`CprEsLibrary`) is unchanged.
- History rows and the Your rooms list still read this week's under-par play in every state.
- Forced locks and a second room are in the record but not drawn: no seed play has either. Each option has a clear place for them: a forced door could be a struck door, and a second room a threshold on the line.
- In option 2, over par, par sits before the stretch where it fell, because the game records only lock minutes and not move minutes.

## Next

The owner plays the three options and picks one, or a mix. A likely mix is option 1's line with option 3's ledger. After that, ratify the legend wording and the over-par seed, then build the pick into `app/`.
