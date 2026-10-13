---
date: '2026-10-12'
topic: '1110-daily-word-mystery-content'
ticket: 'LM-1110'
status: 'awaiting-review'
type: 'candidate build'
---

# Handoff: Daily Word and Daily Mystery show the real games (LM-1110)

The brief's content and layout fixes are built as a candidate. The main build is unchanged apart from two aid files (see "What changed in app/"). Nothing here is ratified.

## How to open the candidate
- Open `/docs/specs/1110-daily-word-mystery-content/playground/index.html`, or `playgrounds.html` → LM-1110 → Candidate build.
- To walk it: the pill at the bottom right → QA → "LM-1110 Daily Word and Daily Mystery content". The steps are every state in brief item 7. On `session-puzzle` and `session-mystery`, press Share.

## What was built and where
- `playground/index.html`: a copy of the root `index.html` with `<base href="../../../../">`, two extra modules and one extra CSS block at the end of `<style>` (C1 to C5 and the wrap fixes). The block is marked `LM-1110 candidate`.
- `playground/pg-1110-data.jsx`: loads right after `app/gs-puzzles-library.jsx`, before `gs-history.jsx`, so History, the editions list and every row are built from it. It holds:
  - `GS_RESULT.word` and `GS_RESULT.mystery` reading `Missed` when lost;
  - the six sessions of brief item 1;
  - generated earlier Daily Mystery days in the real grammar;
  - the share text;
  - both games' chat pictures, the Daily Mystery pitch heading, the now-card lines and the three achievement lines.
- `playground/pg-1110-late.jsx`: loads before `main.jsx`. It holds the edition panel's body lines (`PGE_INFO`), the never-played plays card (the empty line only), and the chat row of equal-height pictures (S11).
- `measure.js`: the measuring script. It opens the candidate in an iframe per size, stages each state with `kitGoState`, and runs S1 to S15 with `getBoundingClientRect` and word-by-word `Range.getClientRects()`. Usage is in the file's head.

### What changed in app/ (main build)
- `app/states.jsx`: six states added (below). They also show in the main build's palette, where they open the main build's own content.
- `app/qa.jsx`: one entry, `only: 'PG_1110'`. It shows only in the candidate.
- `playgrounds.json`: the ticket added.

## Addresses of the states (each `?state=<id>`)
- New: `library-mystery-editions`, `edition-mystery-earlier` (the first earlier case not played), `edition-mystery-done` (#62), `session-mystery` (`mystery-today`), `session-mystery-in-progress` (`mystery-live`), `session-mystery-earlier` (#62, `mystery-1004`).
- Existing ones measured: `word-signed-out`, `word-free`, `mystery-pass`, `library-word`, `library-mystery`, `library-word-in-progress`, `library-mystery-in-progress`, `library-mystery-never-played`, `library-word-streak-broken`, `library-word-editions`, `edition-word-earlier`, `edition-word-done`, `session-puzzle`, `session-word-in-progress`, `session-word-earlier`, `history`, `groups-pass`, `library-groups`.
- `session-word-earlier` opens #210, a generated day, as before. The brief's earlier Daily Word play (`word-1005`, #211) is reached from its row on the game page or in History.

## The two open items
1. **No progress bar on Daily Mystery's now card.** "Question 2 of 2" repeats the sentence above it ("You’ve asked the inspector two questions."). A full bar also reads as finished on a play that isn't.
2. **How the Achievements card fills its height (C1).** It is never stretched. Every card on the game page except the streak card keeps its own height (`.lb-lay > :not(.lb-runcard) { align-self: start }`). The streak card still fills as it does today. From 900px, where Achievements sits beside the plays card, its items form one list with a row each. In a third of the column, a title like "Solved with no mistakes" wrapped (S9, S10). The plays card's own fit logic is unchanged. When Achievements is shorter than four plays rows, the two cards now keep their own heights instead of stretching.

## Lines reworded
None. Every string is as the brief gives it. Two are only split into paragraphs:
- Daily Mystery chat 1: the AI's turn is two paragraphs, "Daily Mystery No. 64. … is dead." then "The body was found in the dining room. Read the clues, ask the inspector, then make one accusation."
- Daily Word chat 3: "The word contains the letter I. One hint left today." is one paragraph.

## Set by this brief (the owner has not ruled)
- The staged clock and numbers stay: Tuesday 6 October 2026, Daily Word #212, Daily Mystery #64.
- The third chat picture shows play not yet ended (MCPG-019).
- The desktop session page's empty width is not fixed; the session frame is not redesigned.

### Wording awaiting the owner (as built)
1. Daily Mystery pitch heading: "There’s a body and a story that doesn’t add up."
2. Daily Word chat 3 caption: "Ask for a hint and the engine gives one. Two a day."
3. Daily Mystery chat 1 caption: "A body, four suspects and an inspector who answers yes or no."
4. Daily Word now card, in progress: "You’ve used 2 of your 6 guesses. One letter is in place and two more are in the word."
5. Daily Mystery now card, finished: "You accused after two questions, and the weapon was wrong."
6. Daily Word achievement 3: "Solve Daily Word seven days running."
7. Daily Mystery achievement 1: "Solve a Daily Mystery case."
8. Daily Mystery achievement 3: "Solve a case seven days running."
9. Edition panel, Daily Word: "Five letters. Six guesses."
10. Edition panel, Daily Mystery: "One suspect, one weapon, one room. One accusation."

## Samples, not product rules
- The achievements are samples.
- The generated earlier Daily Mystery days are samples in the real grammar, not real cases. At most two questions each, `Was {suspect} in the {room}?` or `Did {suspect} have the {weapon}?`, answered Yes or No. The accusation is `{suspect}, with the {weapon}, in the {room}`. A wrong one gets one part wrong. Names come only from the brief's pool. Each day has 0, 1 or 2 questions and "No hints".
- Generated earlier Daily Word days keep their guesses. Their marks already count a repeated letter only as often as the answer holds it (`gsWordRow`); a lost one now reads `Missed`.

## Choices the brief didn't cover (proposed)
- **Share text cases no seed reaches.** Two or more Daily Word hints: "· 2 hints 💡💡". A Daily Mystery play with no questions: "· no questions", with no 🔎. Daily Mystery's share text carries no hint count, because the brief's format has none.
- **The blank line in Daily Word's share text.** The pop-up draws it inside the head line, so the card's gaps stay 4px (S7). Copy still pastes it as an empty line.
- **Chat pictures.** Each game's three pictures share the tallest picture's height, with its first turn below the 36px top fade. Before, Daily Word's and Daily Mystery's second pictures were cut by the fade at 348px.
- **Wrapping.** These fixes use `text-wrap` only: balanced lines on the now card's line, achievement lines, chat captions, More games blurbs, session record lines and the edition panel's line, and `pretty` on the pitch heading. All are in shared parts, so other games get them too.

## Left failing, or not built
**Failing on what this delta touched:**
- **S11 on Daily Word and Daily Mystery** (and Daily Groups, which shares the part). The frames are equal and nothing is cut, but the shorter pictures leave more than 48px above the first turn:
  - Daily Word: 196 / 36 / 226 at 1440.
  - Daily Mystery: 85 / 36 / 136.
  - The three conversations differ in height by up to 190px. No frame height fits all three within 48px without changing what the pictures hold. Owner's call: add the turn before each picture's first one, or loosen S11.

**Failing on what this delta did not touch**, reported and left:
- S9: the play box's small line; the pitch paragraphs; How it plays columns; both "coming soon" cards; History's 36,000 Summers Ago rows.
- S10: Word's and Groups' pitch headings at 390; "The Barrow of Hollowmere".
- S12 at 390: "How to connect", More games title buttons (24px tall), footer Privacy and Terms (under 44 wide), "About the Pass", "Turn on notifications".
- S13: the game page's H1 at 390 overflows its box by 2px (29 / 27).
- S6 at 390 on the list of editions: rows with the Played mark are 66px against 57px. No text wraps in them. The brief calls the list's rows not a fault.

**Not built:** none of brief items 1 to 8 is missing. The register label `mystery-pass` still reads "(today not solved)" in lower case. It is an aid label, left as it is in the main build.

## What I'd do next
1. The owner rules on the ten strings above and on S11's chat pictures.
2. Once ratified, carry `pg-1110-data.jsx` into `app/gs-data.jsx`, `gs-puzzles-library.jsx`, `gs-chats.jsx`, `gs-game.jsx` and `gs-session.jsx`; `pg-1110-late.jsx` into `gs-editions.jsx`, `gs-history.jsx` and `gs-chats.jsx`; and the CSS block into `index.html`. Then delete the QA entry.
3. A separate session validates the look checks P1 to P5.

## Measurements (after the last change, 2026-10-12)
Method: `measure.js`, one iframe per size, each state staged by `kitGoState`, about a second's settle. S7 on the pitch measures the gap between its grid tracks. S14 compares text against brief items 1 and 4 (`pg10Story`). Quoted strings are cut to their first words.

#### `word-signed-out`
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | PASS heights 419.4 ×3; 419.4 ×3, spread 0 | n/a one card per row | n/a one card per row |
| S3 | PASS spread per part (art, name, blurb, tags) 0/0/0/0; 0/0/0/0 | n/a one card per row | n/a one card per row |
| S4 | PASS 10 cards, 0 over | PASS 10 cards, 0 over | PASS 10 cards, 0 over |
| S5 | n/a no achievement grid | n/a no achievement grid | n/a no achievement grid |
| S6 | n/a no list | n/a no list | n/a no list |
| S7 | PASS More games card 12/12/12; pitch 36 | PASS More games card 12/12/12; pitch 24 | PASS More games card 12/12/12; pitch 24 |
| S8 | PASS pitch/How it plays 689.4 vs 689.4 | n/a nothing side by side | n/a nothing side by side |
| S9 | FAIL 41 blocks; “Today’s word, your…” 95/325, 3 words; “You can’t see…” 164.5/599.9, 4 words; “Your AI passes…” 204.4/580.8, 5 words | FAIL 41 blocks; “You can’t see…” 62.8/347, 2 words; “Your AI passes…” 112.9/339.2, 3 words; “Takes your guesses…” 83.8/321.3, 2 words; “The same game,…” 43.6/190, 1 word; “A short campaign…” 59/204.3, 2 words | FAIL as 390 × 844 |
| S10 | n/a no title wraps | FAIL “You already know…” 203.8 vs 350.4; “The Barrow of…” 139.9 vs 204.3 | FAIL as 390 × 844 |
| S11 | FAIL heights 427/427/427; blank 195.9/36/225.6; under fade no/no/no; content 159.1/319/129.4 in room 343 | FAIL heights 427/427/427; blank 174.1/36/225.6; under fade no/no/no; content 180.9/319/129.4 in room 343 | FAIL heights 427/427/427; blank 174.1/36/225.6; under fade no/no/no; content 180.9/319/129.4 in room 343 |
| S12 | n/a 390 only | FAIL 18 controls; under 44: How to connect 112.4×24, Daily Groups 124.7×24, Daily Mystery 135.2×24, Escape 70.9×24, Casebook 96.9×24, Delve 54×24, 36,000 Summers Ago 210.3×24, Privacy 42.7×44, Terms 35.6×44 | FAIL as 390 × 844 |
| S13 | PASS 41 checked, 0 cut | PASS 41 checked, 0 cut | PASS 41 checked, 0 cut |
| S14 | PASS 2 of 2 match (chat captions, chat turns) | PASS 2 of 2 match | PASS 2 of 2 match |
| S15 | PASS 16/16; 36/16; 36/16; 36/16 (box heading, pitch, chat, More games) | PASS same | PASS same |

#### `word-free`
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | PASS 419.4 ×6, spread 0 | n/a one card per row | n/a one card per row |
| S3 | PASS 0/0/0/0; 0/0/0/0 | n/a one card per row | n/a one card per row |
| S4 | PASS 10 cards, 0 over | PASS 10 cards, 0 over | PASS 10 cards, 0 over |
| S5 | n/a no achievement grid | n/a | n/a |
| S6 | n/a no list | n/a | n/a |
| S7 | PASS 12/12/12; pitch 36 | PASS 12/12/12; pitch 24 | PASS 12/12/12; pitch 24 |
| S8 | PASS 799.4 vs 799.4 | n/a nothing side by side | n/a nothing side by side |
| S9 | FAIL as word-signed-out (42 blocks) | FAIL as word-signed-out | FAIL as word-signed-out |
| S10 | n/a no title wraps | FAIL 203.8 vs 350.4; 139.9 vs 204.3 | FAIL 203.8 vs 350.4; 139.9 vs 204.3 |
| S11 | FAIL 427 ×3; blank 195.9/36/225.6; content 159.1/319/129.4 in 343 | FAIL 427 ×3; blank 174.1/36/225.6; content 180.9/319/129.4 in 343 | FAIL same as 390 × 844 |
| S12 | n/a 390 only | FAIL 20 controls; the nine listed for word-signed-out | FAIL same |
| S13 | PASS 42, 0 cut | PASS 42, 0 cut | PASS 42, 0 cut |
| S14 | n/a no today strings | n/a | n/a |
| S15 | PASS 16/16; 36/16; 36/16; 36/16 | PASS same | PASS same |

#### `mystery-pass`
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | PASS 419.4 ×6, spread 0 | n/a one card per row | n/a one card per row |
| S3 | PASS 0/0/0/0; 0/0/0/0 | n/a | n/a |
| S4 | PASS 10 cards, 0 over | PASS 10, 0 over | PASS 10, 0 over |
| S5 | n/a | n/a | n/a |
| S6 | n/a no list | n/a | n/a |
| S7 | PASS 12/12/12; pitch 36 | PASS 12/12/12; pitch 24 | PASS 12/12/12; pitch 24 |
| S8 | PASS 819.4 vs 819.4 | n/a | n/a |
| S9 | FAIL 42 blocks; “Today’s case, your…” 95/322.1, 3 words; “Voices the suspects…” 72.8/180.7, 1 word; “Holds the answer,…” 81.1/190.8, 1 word | FAIL “Today’s case…” 95/322.1, 3 words; “The same game,…” 43.6/190, 1 word; “A short campaign…” 59/204.3, 2 words | FAIL as 390 × 844 |
| S10 | n/a no title wraps | FAIL “There’s a body…” 352.4 vs 344.8 (passes); “The Barrow of…” 139.9 vs 204.3 (fails) | FAIL same |
| S11 | FAIL 381 ×3; blank 84.6/36.3/136.1; under fade no/no/no; content 224.4/272.8/172.9 in 297 | FAIL 403 ×3; blank 84.9/36.5/114.6; no/no/no; content 246.1/294.5/216.4 in 319 | FAIL same as 390 × 844 |
| S12 | n/a | FAIL 20 controls; How to connect 112.4×24, Daily Word 106.1×24, Daily Groups 124.7×24, Escape 70.9×24, Casebook 96.9×24, Delve 54×24, 36,000 Summers Ago 210.3×24, Privacy 42.7×44, Terms 35.6×44 | FAIL same |
| S13 | PASS 42, 0 cut | PASS 42, 0 cut | PASS 42, 0 cut |
| S14 | PASS 2 of 2 match (chat captions, chat turns) | PASS 2 of 2 | PASS 2 of 2 |
| S15 | PASS 16/16; 36/16; 36/16; 36/16 | PASS same | PASS same |

#### `library-word`, `library-word-in-progress`, `library-word-streak-broken`
Identical numbers in all three, except S14.
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | n/a no grid of like cards | n/a | n/a |
| S3 | n/a no grid of like cards | n/a | n/a |
| S4 | PASS 4 cards, 0 over | PASS 4, 0 over | PASS 4, 0 over |
| S5 | n/a one item per row (3 rows) | n/a one item per row | n/a one item per row |
| S6 | PASS 2 lists, rows equal | PASS 2 lists, rows equal | PASS 2 lists, rows equal |
| S7 | PASS Achievements card 8 | PASS 8 | PASS 8 |
| S8 | PASS now/streak 233 vs 233 | n/a stacked | n/a stacked |
| S9 | PASS 40 blocks, 0 over | PASS 40, 0 over | PASS 40, 0 over |
| S10 | n/a no title wraps | n/a | n/a |
| S11 | n/a no chat pictures | n/a | n/a |
| S12 | n/a | FAIL 21–22 controls; Privacy 42.7×44, Terms 35.6×44 | FAIL same |
| S13 | PASS 40, 0 cut | FAIL H1 “Daily Word” 162/162 × 29/27 | FAIL same |
| S14 | PASS 3 of 3 (library-word: now line, result, plays row); PASS 1 of 1 (in progress: now line); n/a (streak broken) | same | same |
| S15 | n/a no heading between blocks | n/a | n/a |

#### `library-mystery`, `library-mystery-in-progress`, `library-mystery-never-played`
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | n/a | n/a | n/a |
| S3 | n/a | n/a | n/a |
| S4 | PASS 4 cards, 0 over | PASS 4, 0 over | PASS 4, 0 over |
| S5 | n/a one item per row (3 rows) | n/a | n/a |
| S6 | PASS rows equal | PASS: “Closed with no hints and no questions” row 120.4 vs 80. The title is 273.6 wide on one line against a row of 272, and the line under it 314.2 against 272: both need the extra line | PASS same |
| S7 | PASS 8 | PASS 8 | PASS 8 |
| S8 | PASS 233 vs 233 | n/a | n/a |
| S9 | PASS 40 (never played 22), 0 over | PASS 0 over | PASS 0 over |
| S10 | n/a no title wraps | PASS “Closed with no…” 177.5 vs 136.3 | PASS same |
| S11 | n/a | n/a | n/a |
| S12 | n/a | FAIL Privacy 42.7×44, Terms 35.6×44 (never played adds “About the Pass” 106.6×24) | FAIL same |
| S13 | PASS 0 cut | FAIL H1 “Daily Mystery” 207/207 × 29/27 | FAIL same |
| S14 | PASS 3 of 3 (now line, Missed, plays rows #64 Missed, #63 Solved, #62 Solved, #59 Missed); PASS 1 of 1 in progress; PASS 1 of 1 never played (not-played line) | same | same |
| S15 | n/a | n/a | n/a |

#### `library-word-editions`, `edition-word-earlier`, `edition-word-done`, `library-mystery-editions`, `edition-mystery-earlier`, `edition-mystery-done`
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | n/a | n/a | n/a |
| S3 | n/a | n/a | n/a |
| S4 | PASS 1 card (list) or 2 (list and panel), 0 over | PASS same | PASS same |
| S5 | n/a | n/a | n/a |
| S6 | PASS rows equal | FAIL rows with the Played mark 65.4–66.4 vs 57; no text wraps in them (Word 18 of 24 rows, Mystery 17 of 24) | FAIL same |
| S7 | n/a no container this delta changes | n/a | n/a |
| S8 | n/a | n/a | n/a |
| S9 | PASS 107–117 blocks, 0 over | PASS 0 over | PASS 0 over |
| S10 | n/a | n/a | n/a |
| S11 | n/a | n/a | n/a |
| S12 | n/a | FAIL Privacy 42.7×44, Terms 35.6×44; panels with a prompt add “How to connect” 91.3×18.2 | FAIL same |
| S13 | PASS 0 cut | PASS 0 cut | PASS 0 cut |
| S14 | n/a no today strings | n/a | n/a |
| S15 | PASS “Every word/case” 36/36 | PASS 36/36 | PASS 36/36 |

#### `session-puzzle`, `session-word-in-progress`, `session-word-earlier`, `session-mystery`, `session-mystery-in-progress`, `session-mystery-earlier`
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | n/a | n/a | n/a |
| S3 | n/a | n/a | n/a |
| S4 | n/a no cards | n/a | n/a |
| S5 | n/a | n/a | n/a |
| S6 | PASS rows equal | PASS rows equal. Mystery earlier: rows 2 and 3 are 73 vs 49; their text is 445.8 and 554.3 wide on one line against a row of 358, so both need the line | PASS same |
| S7 | n/a | n/a | n/a |
| S8 | n/a | n/a | n/a |
| S9 | PASS 5–8 blocks, 0 over | PASS 0 over | PASS 0 over |
| S10 | n/a | n/a | n/a |
| S11 | n/a | n/a | n/a |
| S12 | n/a | FAIL 12 controls; Privacy 42.7×44, Terms 35.6×44 | FAIL same |
| S13 | PASS 0 cut | PASS 0 cut | PASS 0 cut |
| S14 | PASS: Word today 2 of 2 (lines, headline); in progress 2 of 2; Word earlier n/a (#210, generated); Mystery today 3 of 3 (lines, Missed, figures 2 questions · No hints); in progress 3 of 3; earlier 2 of 2 | same | same |
| S15 | PASS headline 16/16; list heading 36/16 | PASS 40/16; 36/16 | PASS 40/16; 36/16 |

#### Share pop-up: `session-puzzle` + Share, `session-mystery` + Share
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | n/a | n/a | n/a |
| S3 | n/a | n/a | n/a |
| S4 | PASS 2 cards (pop-up, share text), 0 over | PASS | PASS |
| S5 | n/a | n/a | n/a |
| S6 | PASS rows equal | PASS | PASS |
| S7 | PASS share text 4/4/4/4 (Word), 4/4 (Mystery) | PASS same | PASS same |
| S8 | n/a | n/a | n/a |
| S9 | PASS 9–10 blocks, 0 over | PASS 0 over | PASS 0 over |
| S10 | n/a | n/a | n/a |
| S11 | n/a | n/a | n/a |
| S12 | n/a | FAIL 13 controls; Privacy 42.7×44, Terms 35.6×44 | FAIL same |
| S13 | PASS 0 cut | PASS 0 cut | PASS 0 cut |
| S14 | PASS 1 of 1 each: the text above the link equals brief item 4 line for line | PASS | PASS |
| S15 | PASS 16/16; 36/16 | PASS 40/16; 36/16 | PASS 40/16; 36/16 |

#### `history` (S14 only, per the brief; the rest recorded)
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S14 | PASS 1 of 1: rows “Daily Word #212 · Solved in 3 of 6” and “Daily Mystery #64 · Missed” | PASS | PASS |
| S1, S4, S13 | PASS 1440 vs 1440; 1 card 0 over; 131 checked 0 cut | PASS same at 390 | PASS same |
| S9 | PASS 0 over | FAIL “36,000 Summers Ago · Day 18/17” 49.9/161.7, 2 words | FAIL same |
| S12 | n/a | FAIL “Turn on notifications” 129.5×21, Privacy, Terms | FAIL same |

#### `groups-pass`
| | 1440 × 900 | 390 × 844 | 390 × 664 |
|---|---|---|---|
| S1 | PASS 1440 vs 1440 | PASS 390 vs 390 | PASS 390 vs 390 |
| S2 | PASS 419.4 ×6, spread 0 | n/a one per row | n/a one per row |
| S3 | PASS 0/0/0/0; 0/0/0/0 | n/a | n/a |
| S4 | PASS 10, 0 over | PASS | PASS |
| S5, S6 | n/a | n/a | n/a |
| S7 | PASS 12/12/12; pitch 36 | PASS 12/12/12; 24 | PASS same |
| S8 | PASS 819.4 vs 819.4 | n/a | n/a |
| S9 | FAIL “Today’s groups…” 95/335.2; “Passes on your…” 40.6/208.7, 1 word; “Holds the groups,…” 66.7/194, 1 word | FAIL “Today’s groups…” 121.7/308.5; “Passes on your…” 110/323.3; soon cards as above | FAIL same |
| S10 | n/a | FAIL “Sixteen words hide…” 274.6 vs 330.9; Barrow 139.9 vs 204.3 | FAIL same |
| S11 | FAIL 367 ×3; blank 68.9/36/127.9; content 226.1/259/167.1 in 283 | FAIL same | FAIL same |
| S12 | n/a | FAIL as mystery-pass, with Daily Mystery in place of Daily Groups | FAIL same |
| S13 | PASS 0 cut | PASS | PASS |
| S14 | n/a | n/a | n/a |
| S15 | PASS 16/16; 36/16; 36/16; 36/16 | PASS | PASS |

#### `library-groups`
As `library-word` at every width, with the H1 “Daily Groups” at 191/191 × 29/27 (S13, 390), and S14 n/a.
