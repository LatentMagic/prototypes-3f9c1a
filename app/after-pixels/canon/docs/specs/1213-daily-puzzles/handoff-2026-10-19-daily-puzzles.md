# Handoff: Where, Chain and Salvage (1213), 2026-10-19

Three Pass-only daily puzzles, built into `app/` the way Daily Groups is, and Daily Pin removed. Nothing here is ratified beyond the brief's own ratified list (Joe, 2026-10-19); every call below is mine and waits for the owner.

## What was built, and where

- `app/gs-where-chain-salvage.jsx` (new, loads after `gs-library.jsx`): each game's card, static cover, motion-art bodies, product page, chats, result formatters, today's and in-progress sessions, the templates earlier editions are drawn from, the Salvage seed simulator, the library seed (`DP_PZ`) and the staged states (`DP_STATES`).
- Small hooks elsewhere: `gs-puzzles-library.jsx` (spreads `DP_PZ` into `PZ`, calls `dpSession`), `gs-pass-library.jsx`, `gs-history.jsx` (editions, live sessions, the 40 by 30 row lead), `gs-editions.jsx`, `gs-player.jsx`, `gs-discover.jsx`, `gs-data.jsx` (`gsForms`), `main.jsx` (routes), `states.jsx`, `qa.jsx`, and the art CSS in `index.html` beside Daily Mystery's.
- Order: the three sit after Daily Mystery in `GS_GAME_ORDER`. They appear wherever Daily Groups does: Discover, Library, History and its filters, product pages, library game pages, editions lists, session pages, More games. Like Groups, they are not on Home and not in the picks.
- Today's edition is #21 of each (three weeks of seed). Streaks in the seed: Where 4, Chain 3, Salvage 3.

## Staged states

Group "Daily puzzles 1213". For each of `where`, `chain`, `salvage`: `{id}-signed-out`, `{id}-free`, `{id}-pass`, `library-{id}`, `library-{id}-in-progress`, `library-{id}-free`, `library-{id}-editions`, `session-{id}`. All are walked by the QA entry "Where, Chain and Salvage (1213)".

## The art

All three are drawn on the centred 4:3 stage Daily Word and Daily Mystery use, so square and wide frames show the whole piece with more ground; nothing is cropped or stretched. The static cover (product page, session head, library head) is the rest pose with the same numbers.

Redesigned 2026-10-19 after the owner rejected the first three. What was wrong with them: the Where and Chain moves were translations capped in pixels, so above a stage about 360px wide the end pose never arrived (the guess stopped short of the country, the word short of the line); Where's end pose (two squares touching) means "shares a border" in the game, not "found"; Salvage's fill copied Daily Word's move and faded through transparent. Every move now is a rotation, a scale from a fixed base or a fill, so the end pose lands exactly at every size.

### Where
The hint's needle and today's country. A compass needle left of centre, orange point and cream tail, pointing north-east; an amber square to its right, level with the needle's pivot. Forest ground.
- Always: the needle turns about its own centre and never touches the square; the square's centre sits on the needle's pivot line.
- May change: drawn on a centred 4:3 stage.
- Extends: from the centre.
- Hover: the needle swings 45° to point due east at the square, which rounds into a circle (a pin), 50ms behind. The hint points the way and the country is found.

### Chain
A line of words, worked inward from both ends. Five equal squares in a row on wine: solid cream at each end, empty orange, amber and lilac outlines between. A thin cream line runs from each end word to the first outline.
- Always: five squares of one size, evenly spaced; the line is a third of a square's height and centred on it; an outline sits inside its square's box.
- May change: drawn on a centred 4:3 stage.
- Extends: from the centre.
- Hover: the line grows inward from both ends and meets at the middle; orange and lilac fill as it reaches them (40ms behind), amber last (100ms). One cream line through five solid words: the chain is solved. Owner's idea, 2026-10-19.

### Salvage
A board mid-hunt. On indigo, pegs on a 24-unit grid: four cream misses and two orange hits side by side in the middle row, with a miss at the row's left end.
- Always: every peg is one size and sits on the grid; the wreck lies under the hits, three cells long, in the middle row.
- May change: drawn on a centred 4:3 stage.
- Extends: from the centre.
- Hover: the last dive lands as a third orange peg; the misses recede to nothing; the lilac wreck grows out under the three hits, 50ms behind. The search falls away and the wreck is found. Owner's pick, 2026-10-19: option 1 of the Salvage cover playground, with the misses receding added by the owner. Earlier designs (an aim ring, a boat and dive line) were rejected for telling no story.

### Motion rules, as built
400ms on `--ease-art` both ways; stagger 0 to 50ms, going in only; no translations, so no travel to cap; shapes stay whole; nothing touches an edge; the frame never scales; transitions reverse from where they are; reduced motion sets `--on` to 0 (the system's rule). Hosts are the system's: cards, picks and tiles (`mcp-art-host` with `mcp-art-link`), and clickable `ListRow`s, where the three now draw their moving piece at the 40 by 30 lead in Library and History.

### Calls where the design system says nothing
- Stroke where an outline means something: 5 units of the 160-unit stage, never under 1.5px (1.25px would fall at the 40px lead). The ring is 4 units, same floor.
- Smallest feature at the 40px lead: 12 units of the stage (3px at 40 by 30). The Where triangle (16 by 14) and the Salvage ring (20) are the smallest shapes.
- Where's needle turns 45°. The system caps travel in pixels and says nothing on rotation; at a 240px stage the needle's point sweeps about 30px. Needs the owner's call.

## Open rules and unstated calls

Where
- Distance shown in km to the nearest 10 km ("1,110 km away"); a player can ask for miles. Touching reads "0 km, shares a border".
- The hint is the 8-point compass direction, centre to centre, from the latest guess.
- Only the 193 UN member states count. Territories, Kosovo, Taiwan and Palestine are refused at no cost as "not a country in this game". Mock play uses only uncontested countries; distances in it are approximate.
- Result: "Found in 3 of 6" or "Not found"; the answer is shown after a loss.

Chain
- No hint and no overall limit: every chain ends with the whole line shown.
- Solved means every hidden word found by the player. Any word given away makes the day a fail ("2 of 3 words found") and breaks the streak.
- Two-word phrases count as links; plurals never appear in a line, and a plural guess is taken as its singular.
- Word lengths stay hidden: the player sees only the first letter, and more as wrong guesses reveal them.

Salvage
- Wrecks never touch, not even at a corner.
- One hint, costing no dive: sonar on a row or column says how many wreck squares it holds.
- Complete means every wreck found within 30 dives. "Sunk" names the wreck by its length ("Sunk: the wreck of 3").
- Board symbols: not dived ·, miss ○, hit ✕, sunk ■.
- Earlier seas come from a seeded simulator, so every record obeys the rules.

Share text (all three end with the product page link; no NYT colours or squares)
- Where: `Where #21 · found in 3 of 6 · 1 hint`, then one mark per guess: ○ 1,000 km or more, ◐ 100 to 990 km, ● under 100 km, ◉ found.
- Chain: `Chain #21 · solved · 2 wrong guesses`, then one mark per word, ends included, joined by dashes: ● first time, ◐ after a wrong guess, ○ given away.
- Salvage: `Salvage #21 · all 5 wrecks · 22 of 30 dives · 1 hint`, then one mark per dive in order, ten to a line: ○ miss, ✕ hit, ■ the dive that sank a wreck.

Achievements (three each, as Groups has)
- Where: Found; Found without the hint; Seven days in a row.
- Chain: Solved; Solved with no wrong guesses; Seven days in a row.
- Salvage: Every wreck found; Five dives to spare (25 dives or fewer); Seven days in a row.

Other calls: genre Puzzle for all three; lengths 5, 10 and 15 min; edition words country, chain, sea; product page copy, chat captions and library lines written to the voice guide.

## Removed

- Daily Pin, from `app/gs-more-games.jsx` (its card, cover, product page, chat, Library row and route). Nothing else referred to it.
- No other geography daily existed. Saltmarsh and Low Tide are places, not geography games.

## Not done, or left open

- `CLAUDE.md`'s product block still says "Ten more Pass-only games (Daily Cipher to Clockwork)"; it is now nine. Needs the owner's say before the block changes.
- The other games' Library and History leads stay still covers; only the three new ones move there.
- The nine more games (`GS_MORE_IDS`) render without the top bar, demo bar or play pop-up (`main.jsx` lists them as bare listing pages). Not touched; worth a look.
- No `CHANGELOG.md` entry written; three new games may earn one. Asking.

## Next

Owner review of the art concepts and the open rules above, then the share marks, which are the least tested call.
