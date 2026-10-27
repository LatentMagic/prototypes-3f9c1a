# Handoff, 2026-10-27: Escape's session page, v5

Goal: the owner's review of v4 (2026-10-27, in chat). Lock detail goes the way of v4's 3, Every lock at once, with three more takes on it; Result needs fresh ideation; Escape 2 and Hover 1 are picked. Earlier: `handoff-2026-10-27-escape-session-v4.md`, `v4-goal.md`.

## Where

`docs/specs/1236-session-pages/playground/v5.html` (launcher: ticket 1236). Opens on Escape's session page with the Pass. Files: `pg-es5.jsx`, reusing `pg-es-core.jsx`, `pg-es-seed.jsx`, `pg2Model` and `Pg2Card` from `pg-es2-line.jsx`. Storage key `pg_escape-session_v5`. Bar: Lock detail 1 to 3, Result 1 to 3, Tries (Tiles, Marks), Room (Under, On par, Over, Inside), Why. Key S steps the room.

## The owner's v4 review (2026-10-27)

- Lock detail: go with 3, Every lock at once, as it is on desktop. On a phone, only the lock you picked. The words under the locks (name, facts, story) are too many: integrate tersely or drop; he'd rather nothing sat beyond the locks. Wrong-all-dark / Open-all-lit tiles say nothing Daily Word's tiles would; open to a better idea. He feels something from v3 was lost and is happy to go this way.
- Escape: 2, Door left open ("really cool"). The open door at the end of the line had lines running through it; fix.
- Result: none of the three. "Escaped in 30 min" reads as a sentence and doesn't say you escaped; a big time repeats the line. Needs pure ideation.
- Hover: 1, Lift.
- The line, on par and over, "looks brilliant". On par, the par tick over the exit door looks off; left to the builder.

## Fixed in v5

- The open exit door is filled dark (page colour), so the bar no longer shows through its frame.
- On par, the lower par tick is dropped and the upper one stops short of the exit door.

## The three lock details (not ratified)

All three show every lock on desktop and only the picked lock on a phone (below 720px), at a height reserved for the play's busiest lock. No story, replies or minutes under the locks; the either-or ("The chimney hatch closed") sits in the exit lock's facts.
1. **Columns:** v4's 3 cut down. Tries stacked from the foot, hints as their own rows, the lock's door and its facts at the foot.
2. **Lanes:** one lane per lock, a small line like the big one: tries and hints left to right, running to the lock's door at the right edge.
3. **Scorecard:** a grid, one ruled slot per try (Try 1 to the play's most), a hint shown in the slot of the try it came before.

4. **v4** (added after the owner's correction, 2026-10-27: he asked for v4's lock elements kept and only their insides updated; 1 to 3 replaced them instead). v4's columns as they were; inside, each try reads to the spec, the minute and the either-or sit in the column caption, nothing under the columns. The owner sees something in Columns and in Scorecard, and asks what Scorecard does with more doors and more content; neither is thrown away.

**Tries:** Tiles (as many as the answer's characters or the mechanism's parts) or Marks (one mark a try; a mechanism's mark split into its parts).

## The three results (not ratified)

None states your time; the line has it. Each says you escaped and how that stands against par.
1. **The door:** the open door at cover size beside "Escaped", then "Under par · 2 min to spare" (check icon and word, not colour alone), then the figures.
2. **At the exit:** "Escaped" and the verdict sit over the line's right end, where you got out; the minutes left before par are tinted on the bar.
3. **Stamped:** "Escaped" with the store's success or warning Tag, Under par or Over par; minutes to spare lead the figures.

## Spec check (Escape spec snapshot, 2026-10-27)

- A typed lock answers Open or Wrong. The sample record (pass 2) gives the cabinet lock, a typed 4-digit lock, mechanism readings ("2 of 4 dials"). v5 reads those as plain Wrong. The record itself is unchanged; it should drop them.
- A mechanism (the clock hands) answers with its count, shown as "1 of 2" and as parts lit.
- Hints are shown as their rung (1 to 3; 3 is the answer).
- Exactly par counts as under: on par reads "Under par, out on the minute".
- Not drawn, as no sample play has them: forced locks, a mechanism refusing tries until a hint, a second room. Near misses show as Wrong; their reply stays in Every move.

## Hard play (added 2026-10-27, owner agreed to it)

Room → Hard. `escape-hard`, in `pg-es5.jsx` only, all invented: six locks, out at 52 min (over par), 46 moves, 5 hints, 27 wrong tries. The cabinet lock (typed) takes eighteen tries and all three hints, so its lane wraps on desktop too (owner: a lane on two lines is an edge case to manage, not avoid); the clock hands (a mechanism) take three wrong settings, a hint, then one more wrong before opening, each answered with a count. No second room, no forced lock. First finding: Lanes runs off the card's right edge on the cabinet lock on desktop.

## Open after the owner's v5 review (2026-10-27)

- **Moments** (pass 2's First try, Closest miss, Longest stretch, The way out; the owner called clickable moments "a keeper") were lost when v3's Design 1 was picked, which never had them. Not dropped by decision. The owner is unsure he cares, and sees no room for them on the hard play. Parked.
- **Lanes** (Lock detail 2): the owner calls the current lanes great.
- **Result**: The door (1) is probably best. Its verdict now sits on the line with "Escaped" (owner: "at least inlined"). Still open.

## Mobile AA check (2026-10-27, Room → Hard, phone width)

- Text passes: text 13.5:1, muted 6.5:1, success 7.1:1, warning 10.8:1 on the card. Marks, the lane line and borders (control edge) 4.6:1.
- **Fixed, 1.4.11 (non-text, 3:1):** the owner chose to solve it (2026-10-27; AA is the project's bar). The elapsed fill is lighter (40% text, was 34%): 3.1:1 against the empty track, was 2.6:1. The over-par fill (50% warning, was 42%) is 3.5:1, was 2.9:1. A door against the fill under it is now about 1.1:1; its overhang against the card is 3.8:1, and its number and spoken name also carry it.
- **Targets, fixed (owner, 2026-10-27: "why is this a mobile-only problem?"):** doors keep at least 32px apart at every width, each with a 32 × 44px hit area. Doors that would sit closer are spread instead: every gap becomes 32px plus its share of the remaining width by minutes, so a longer wait still looks longer (owner asked to keep "an impression of the spacing"); the first and last doors stay on their minutes, the ones between drift a little off the time scale. On the hard play at phone width the gaps are 68, 49, 40, 52 and 48px for waits of 18, 9, 4, 10 and 8 min (measured). Desktop doesn't change with today's plays. Not ratified.
- Lanes on a phone: the lane line now runs through every row when a lane wraps (it stopped after the first).

## Decided (owner, 2026-10-27)

- Result wording: "2 min under par" (tick), "On par" (tick), "11 min over par". The owner is happy with all three.
- A lane that runs to two lines on desktop is an edge case; leave it.

## Calls I made (not ratified)

- All three of the above lock details, results and the Tiles/Marks switch.
- The on-par sample play (`escape-par`) carried over from v4, defined in `pg-es5.jsx` only.
- The closed exit door's dark fill; the on-par tick.

## Gaps

- The game doesn't record lock minutes, yet the line is drawn by minute (as v4).
- The library card is still v2's Version 1.
