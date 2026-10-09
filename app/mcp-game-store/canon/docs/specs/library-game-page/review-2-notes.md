# Review 2 notes: Casebook options 4 to 6 (2026-10-08)

The user's raw feedback, recorded as heard. Nothing here is ratified.

## Option 4, Briefing

Liked:
- The direction overall.
- This week's case card, and opening a case.
- Achievements: the coloured-in versus not-coloured-in badges. No further ideation wanted on achievements.

Problems:
- Share must be front and centre. It is missing from the main page, and on the case page it sits too far away.
- No hover animations.
- The main page is cluttered with text. "Your cases", then month, then week reads as bloated; simplify.
- Too much black and white; it is hard to tell things apart. Possibly a missing tertiary colour.
- "Show earlier cases" cannot be collapsed.
- Unsolved: pagination, and the infinite list problem. Repeated "Show more" is one possibility the user raised, not chosen.

## Built 2026-10-08: options 7 to 9

`playground/casebook-7-9.html` + `pg-casebook-7-9.jsx` (reuses `pg-casebook.jsx`). Share text is words only. No hover motion or third colour (held).
- 7 Split: one now card, this week | last week with Share, streak along the bottom. History: five at a time, Newer / Older.
- 8 Lead: this week in the big card with big figures; last week + Share and the streak beside it. History: one month at a time as tiles, arrow stepper.
- 9 Scoreboard: four stat tiles (turns, lies, streak, last week with Share). History: latest three, then "All cases" opens a searchable page, eight at a time.

## Review of options 7 to 9 (2026-10-08), raw notes, nothing ratified

Across all:
- Achievements: there will likely be about ten, not five. A scrolling row hides some of them. Needs a way to show them all, at least on desktop.

Option 7, Split (the user: "going in an absolutely fantastic direction"):
- Liked: this week with progress; the page is much cleaner; the history rows give good signal; Newer / Older stepping (good enough for now, though going far back is slow).
- Liked: the achievements' scrolling row on mobile.
- Unsure: always showing last week. Likes it, but it may take too much room on mobile.
- Streak squares read as a pattern, not as weeks passing. No fix proposed yet.
- "1 to 5 of 16": the total grows forever. Drop the count line, probably.
- History rows: still no hover, so it's unclear what's clickable; rows take too much room, with dead space mid-row.
- Case page: the turn list ("Question, Search, Show evidence…") is unreadable; it doesn't group or show what kind each turn is.

Option 8, Lead:
- Liked overall; cleaner. "This week" big card is good but needs work: the Accusation "To make" figure reads oddly.
- Streak reads a little better here; something still missing.
- Achievements same as 7; the scrolling row could work, seeded with more to prove it.
- Month stepper with tiles: likes the idea (and stepping through years), gut says no; five tiles leave one overhanging a row. Case pages unchanged.

Option 9, Scoreboard:
- Showing only the latest three to five cases on the page, then "All cases" opening its own page with search: "brilliant", mandatory.
- The all-cases page must hold about 40 to 50 cases. Older / Newer is not good enough there.
- Reference (Circlists, the user's other app; screenshot 2026-10-08): a Display menu with Order (Newest first, Oldest first) and a Filter list.

Across all, decided in review (not yet ratified as a rule):
- Drop last week from the now block. It was there to carry Share. Instead, this week has two states: in progress, and finished (with Share). That frees room for signal.
- Favourite is 7, without last week; 8's this-week card is the strongest treatment of now.

## Scope for options 10 to 12 (ratified by the user, 2026-10-08, with the changes below)

- Hover: left to the design system agent, which is working on it; it stays an open gap. Every clickable thing must still read as clickable.
- Achievements: one option keeps the scrolling row, seeded to ten, so the user can feel it. The others bring back the smaller treatments from 4 and 6 (badge grid, compact list).

## Proposed scope for options 10 to 12 (revised, superseded by the above with the principles below)

Principles each option answers in its own way:
- What's happening for you this week gets the most room. It has two states, switchable in the rig: in progress (where you stand and what's left to do) and finished (your result, with Share front and centre). Nothing from an earlier week competes with it.
- Every achievement is visible without hunting, even at about ten.
- The game page carries only a short list of your most recent cases. "All cases" opens a separate page.
- The all-cases page stays easy to use at about 45 cases and beyond: search, sort (newest or oldest first), filter (solved, unsolved, not played), and a bounded way through the list.
- Every clickable surface has a hover effect (the user's instruction, 2026-10-08; the design system leaves hover undecided, so this sets it for the rig).
- Rows and cards spend their space on signal, with no dead gaps.
- Still held: the streak reading as weeks passing, the case page's turn list, a third colour.

## Built 2026-10-08: options 10 to 12

`playground/casebook-10-12.html` + `pg-casebook-10-12.jsx` (loads after the 4–6 and 7–9 modules). Seed: 45 weeks, ten achievements. Rig rows: Option, Viewer, Week (In progress / Finished), plus an All cases jump.
- 10 One card: this week in one big card; achievements in the scrolling row; all cases in numbered pages of ten.
- 11 Two halves: where you stand | what's next (finished: share text with Copy); badge grid; all cases as one list that loads ten more near the end, tools pinned.
- 12 Tiles: number tiles, Share beside the title once finished; compact two-column list; all cases by month with a month index.
No hover (left to the design system).

## Review of options 10 to 12 (2026-10-08), raw notes, nothing ratified

Option 10, One card:
- The now card is far too big. Finished state leaves a lot of empty space.
- Achievements in the scrolling row look good but don't work: you can't easily see all of them.
- Case rows repeat the big rows with empty space from 7. They're also worse: the labels for turns and state lost their formatting. The user called it a bad regression.

Option 11, Two halves:
- The user meant "importance" to set priority. They didn't mean this week should fill the page. This build takes up far too much room and will look bad on phones.
- Share: the share text is fine here. The user says they ratified a Share button that opens a modal (a pop-up), and that works best. Only the button deserved the prominent spot, not the text. (That ratification isn't in these notes. It needs confirming before it's recorded.)
- Achievements look great. Of the three options, 11 has the best achievements.
- The case list got no real design work, again.
- The case page is messier: odd type and too much bold. Wrong.

Option 12, Tiles:
- The separate cards are wrong for this.
- The streak still doesn't read as weeks passing in order. It's been raised before and still isn't fixed.

Across all:
- The user sees fundamental gaps in the ideas, despite all the earlier feedback, and is disappointed.

## Ratified by the user, 2026-10-08

- Share is a button beside this week's result. Pressing it opens a pop-up with the share text.
- The user wants options 13 to 15 to be the final round.

## Scope for options 13 to 15 (the user's go-ahead, 2026-10-08, with these changes)

- The main problem: every element runs the full width, which wastes space. Use grids and cards. Parts sit side by side on desktop.
- "One short block" isn't a rule. Just keep the now block's size in mind.
- Achievements: the grid from 11 can be reshaped to fit the layout. It doesn't have to be a full-width row.

The proposal it amends:

- Compact first. The game page shows now, achievements and recent cases, each kept small.
- Now: one short block with the same height in both states. Finished swaps the figures for the result and the Share button.
- Achievements: the badge grid from 11, in all three.
- Streak: each option tries a different way to show weeks passing in order (dated, with missed weeks visible).
- Case rows: one compact line each. Turns and state get clear labels. The whole row reads as clickable.
- Case page: turns grouped by kind. Two text sizes and a single bold weight.
- All cases page: search, order and filter stay. Each option tries one way to move through 45 or more cases.
- What varies between 13, 14 and 15: the now block, the streak and the way through all cases.

## Built 2026-10-08: options 13 to 15

`playground/casebook-13-15.html` + `pg-casebook-13-15.jsx` (loads after the 4–6, 7–9 and 10–12 modules). The same in all three: one-line case rows (date, title, result, turns, lies) that fold to two lines when narrow; the case page with its turns grouped as Evidence shown, Searches and Questions; the achievements grid from 11, shaped to its column; Share as a button that opens the pop-up.
- 13 Desk: two columns. This week beside a dated 10-week streak timeline, where weeks played in a row join into one bar. Cases beside achievements. All cases: numbered pages of twelve.
- 14 Sidebar: this week and a streak calendar (a month to a row, each week's square dated) in a side column. Cases and achievements in the main column. All cases: by month, with a list to jump to.
- 15 Weeks: this week as a short card written in sentences. The streak runs down the side of your cases as a line that breaks at a missed week. Achievements in a column beside. All cases: twelve at a time, with Show older cases.
- All cases in all three: search, order and filter sit in a side column on desktop.

## Review of options 13 to 15 (2026-10-08), raw notes, nothing ratified

Recorded in the order given. Where a note doesn't name its option, it's marked.

- 13 overall: generally loved. Loved the effort.
- 13 This week: looks a little dead. On mobile it looks a little janky.
- 13 streak: weeks in a row is cool.
- Cases and achievements (option not named, read as 13): on mobile, achievements must come first. Your cases' whitespace is wrong and must match achievements.
- This week across all: the in-progress state always looks more elegant than finished, and it does here too.
- 13: your cases has too much priority. It comes last in the IA.
- (Option not named, read as 14) This week looks better, but it's a little data-y.
- (Option not named, read as 14) Didn't like the three weeks.
- Achievements are cool. Concern: achievements run long on mobile, though that may just be how it is.
- 13 again: your cases may carry too much content.
- Case page: fine. Probably not worth more ideas until the game itself is better designed.
- 13's case list: loved.
- 14: has the same case list, case search and case page as the others.
- 15: has the best This week. Didn't like the events.
- Asked: should this become 16 and 17, or just one?

## Built 2026-10-08: option 16 (the user chose one option over two)

`playground/casebook-16.html` + `pg-casebook-16.jsx` (loads after the 13–15 module and adds 16 to its strip, so 13 to 15 stay there to compare).
- 13's layout, two columns on desktop: This week beside the streak, then achievements beside your cases.
- This week from 15. Finished keeps the turns bar, the same shape as In progress. Share sits with the turns link in one row of actions, which stacks on a phone.
- The streak is 13's run of weeks. Under 480px it shows the last six.
- Achievements come before your cases at every width. Your cases come last and show four rows of title, date and result, with the same card spacing as achievements.
- No rail and no events from 15. The case page and All cases are unchanged from 13.

## Ratified by the user, 2026-10-08: 16 is the direction

- Top-row revision: the result sits beside the title. "You've played every week since…" is cut. The next-case line shares one row with Share and the turns link. Both top cards are shorter.
- 16 goes into every library game page. How each game fills it is not ratified yet (see `handoff-2026-10-08-option-16-direction.md`).

## Option 5, Register

Rejected as a layout:
- The signal about this moment in time comes first: stats for the in-progress case, or the most recent one. A table row cannot carry them, and the page must not lose them. The user called this an important rule (not yet worded or ratified as one).

Liked:
- Achievements as a row of cards at the bottom. They give signal; whether they fit depends on the layout picked.

Problems:
- The case page is the same as option 4's. It looks fine, but something about it is still wrong.
- The case page feels strobing or motion-sick-making (the user's words). Cause not yet found.
- Text size may fail accessibility.

## Option 6, Case file

Liked:
- Something different.
- The left panel's content: progress so far, next case.
- Achievements.
- The mini squares are well done, but too much for this page.

Problems:
- Misalignment: the right column has a heading and the left card doesn't, so the tops of the two don't line up.
- The weeks-in-a-row block wastes space; it could sit on one row.
- History gets far too much weight. Each row is a big thing. History should be one moment on the page; what's happening now matters more.
- For real history detail, you go to History. Otherwise the page bloats.

## Across all three

- The strobing is likely too much small text and too little compartmentalisation (the user's reading).

## Scope for options 7 to 9 (ratified by the user, 2026-10-08, with the changes below)

- Casebook only, the same three viewers.
- Priority is set by real estate, not by a fixed order. Now (this week's case: in-progress stats or the latest result, with Share right beside it) gets the most room; achievements as cards and history get less. Order is part of it, not the rule.
- History will grow without end, and each of 7, 8 and 9 resolves that on this page, each in a different way (pagination, a click-through, or another route). Moving it all to the History page is not the answer by itself.
- Every option: one grid, so column tops and headings line up; the streak on one row; fewer, larger text sizes in a few clear compartments; no turn strips or squares on this page.
- What varies between 7, 8 and 9: how the now block is built.
- Held for separate decisions: a third colour (the design system keeps the shop colourless), and hover motion (the design system says to ask first).
