---
date: '2026-10-16'
ticket: '1153'
topic: 'pass-upsell-ratified-candidate'
status: 'in-review'
type: 'candidate build'
---

# Handoff: 1153 the ratified candidate build

The whole app with every decision in `decisions-2026-10-16-pass-upsell.md`, plus Discover tidied brought up to date. The main build at `index.html` is unchanged. Nothing here is accepted.

## Where it lives

- Entry: `docs/specs/1153-pass-upsell/candidate/pass-upsell-ratified.html`, storage key `kit_1153_pass-upsell-ratified`. In `playgrounds.html` under 1153, first, marked as a candidate.
- Overlays, in load order: `cand-pass-upsell-ratified-bridge.jsx` (the handle; sign-in lands on Library), `-store.jsx` (staging, the Pass paragraph and play-box copy), `-home.jsx` (Home, the Pass pill on GameCard and GamePick), `-game.jsx` (play box), `-pass.jsx` (Pricing), `-library.jsx` (Library and the four library game pages), `-discover.jsx`, `-aids.jsx` (one Config section, nine states, a QA entry).
- Candidate CSS: the marked block at the end of the entry's `<head>`.
- Nothing in `app/`, `_ds/`, the playground or the two Discover candidates changed.

## Clicks to every surface

States are in the pill → States → "Pass upsell (candidate)", numbered 1 to 9. They exist only on this page.

1. **Home**: open the candidate signed out. Pass pill on 36,000 Summers Ago's card, top right; no Free or First chips; the Barrow's coming-soon card reads CHAPTER 3; the Pass section is one paragraph with the pay line under it.
2. **Pricing**: Home → the Pass section → "the Pass". The pay line sits under the price and Choose a plan.
3. **Play boxes**: Home → Available games → Daily Word, Escape, the Barrow, 36,000 Summers Ago. Signed out or free.
4. **Landing after sign-in**: Home → Sign in → any method. Lands on Library. The demo bar's Free and Pass also land on Library from Home.
5. **Library, nothing played**: state 1. New for you, then the line "Everything else comes with the Pass."
6. **New for you, full**: state 2, or Config → New editions → Most not played.
7. **Free first part**: states 3 (in progress) and 4 (done: Share, the record link, "Keep playing with the Pass.", then "See what's out for you to play").
8. **The Barrow**: state 5 (free, done; no Chapter 3 line). State 8 → the Barrow's row shows it as a Pass holder, with "Chapter 3: coming soon".
9. **Finished daily**: state 6. The link under Daily Word's card opens Library.
10. **Pass ended**: state 7. "You stopped here…" with "Get the Pass again".
11. **Discover**: state 9 (free), or Discover from the top bar in any view.

## Ratified, built as decided

Everything in the decisions file except Connecting. The Discover items the owner ratified: Pass pill top right, Free and First chips off, "the Pass" the only Pass link, standalones treated apart.

## Proposals by the owner, 2026-10-16, built and not ratified

- **Discover's search and filters work like History's**: one search field and a Filters panel (Genre, Schedule). The tidied build's open chips and its Free chip are gone. When nothing matches: the message and Clear all, as History.
- **Discover's Pass line is Home's paragraph**, built from the same data, "the Pass" its only link. Above All games, gone with the Pass.
- **"Relevant selection", my reading, to be asked first**: no game shows twice above All games; standalones apart from games with editions; no "this week". Built as: picks Casebook and Daily Word → Just added (games with editions only: the Barrow, Delve, Escape) → Free to play (what's left with free play: Daily Mystery; not shown with the Pass) → **Play any time** (standalones: 36,000 Summers Ago). "Play any time" is my title.

## From the tidied build, still unratified

- **Delve pick label** "A NEW SCENE EVERY WEEK": not used, since Casebook stays the second pick.
- **Word pick label**: changed to "A NEW WORD EVERY DAY". "FREE EVERY DAY" put a price claim on a card after the Free chips came off.
- **Free row subline**: cut. It named Casebook and Delve, which aren't in the row.
- **Free row title**: "Free to play", kept.
- **The note once every first part is played**: not carried over. The Pass paragraph now says the same thing. With it went the rule that hides the free row once everything is played.
- **Second pick**: Casebook, kept.

## Calls I made without the owner

- **The finished-game link on Escape's and Delve's first part**, not only Casebook's, because both are weekly games.
- **Library has no Played filter.** The playground's filter belonged to an option that wasn't taken.
- **Home's pay line stays under the Pass section**, as the playground had it. Whether it stays there is still open.
- **No lock on Discover's wall tiles.** Superseded: the owner asked for the pill on them, 2026-10-16.
- **The Barrow is unplayed by default**, as in canon. Config → The Barrow, chapter 1 sets it to Finished.

## Needs the owner's decision about `app/` (on merge)

- `GS_SOON` in `app/gs-data.jsx` and `app/gs-barrow-library.jsx` still say chapter 2. The candidate patches the data from its overlay.
- The hero comment goes into `app/gs-home.jsx`; it is on the candidate's copy of Home.
- Discover's body is file-scoped (`DcBody`), so the candidate copies canon's 15-line page shell. On merge, the change goes into `gs-discover.jsx` and the copy goes.
- Design system: a lock slot on `GameCard` and `GamePick`.
- New for you needs a played flag per edition; the seed reads whether a game was played at all.

## Still open from the review

- "Your streak comes with the Pass." and the "Every other…" achievements text on a game's Library page aren't checked against the rules.
- Once the owner accepts this candidate in words: archive both Discover candidates, then merge (`skills/candidate-build`). No `CHANGELOG.md` entry until then.

## Owner's review of Discover, 2026-10-16

The owner reviewed state 9 and asked for fixes. What changed, in the candidate only:
- **Play any time** is gone. The builder added it, title and all, without the owner. The owner asked who added it and called it redundant.
- **Free to play** now lists every game with free play, picks included, so Daily Word is back. The owner said it was missing. It now repeats Escape, Delve and the Barrow from Just added. The owner ratified the repeat on 2026-10-16.
- **All games** tiles carry the Pass pill (`CprTile`), as the owner asked. The design-system lock slot on `GameTile` is still to do upstream.

**Ratified by the owner, 2026-10-16:** Discover doesn't sell the Pass. Only a game's product page and its Library page do. The Pass line and its rule above All games are removed. This replaces the owner's earlier proposal to copy Home's paragraph onto Discover.

Still open, nothing changed:
- Daily Groups is still hidden; the 15 Oct brief hid it.
- The owner said his earlier Discover feedback wasn't built. The record holds only three items: search and filters like History's, the Pass line from Home, and "make the selection relevant". Ask him what's missing.
- **Search and filters as History's** (one search field, a Filters panel with Genre and Schedule, Clear all when nothing matches): the owner ratified it as built, 2026-10-16.
- **Who set "each game shows once"**: it first appears, unsourced, in the Discover, tidied build (15 Oct). The 16 Oct brief then used it as its reading of "relevant selection". The owner never ratified it, and now it's dropped.

## What still needs the owner (triaged 2026-10-16)

The owner doesn't want long question queues. The only items that change what a player sees and that he hasn't ratified:
1. The Word pick label, "A NEW WORD EVERY DAY" (the builder's copy).
2. Daily Groups hidden on Discover.

The rest are builder calls that follow from ratified rules, or merge mechanics. Don't put them to the owner one by one.

## Daily Groups restored, 2026-10-16

The owner asked for Daily Groups back as a free daily game. It's in `CPR_STAGE`, so it now appears on Discover (Free to play, All games), in Library, and everywhere else the staging reaches. What follows from that:
- Home's Pass paragraph, built from the data, now opens "Three daily puzzles…", as the ratified rule says it should.
- The Groups play box keeps canon's label and line, because the "A new … every day" pattern gives "A new groups every day". The wording is still to come.

## Ten demo games, 2026-10-16: demo fill, not product intent

The owner asked for the store at a believable size. These ten games are invented filler, unrelated to any real or planned game. **Remove them before merging.** All are Pass-only, with the pill wherever Pass-only games show it.

| Name | Rhythm | Genre |
|---|---|---|
| Daily Cipher | Daily | Puzzle |
| Daily Pin | Daily | Learning |
| The Night Train | Weekly | Mystery |
| Saltmarsh | Weekly | Adventure |
| Heist | Weekly | Puzzle |
| The Long Winter | In chapters | Adventure |
| Far Side | In chapters | Learning |
| The Court of Ash | Standalone | Mystery |
| Low Tide | Standalone | Learning |
| Clockwork | Standalone | Puzzle |

- Data, covers, product pages, one chat each: `candidate/cand-pass-upsell-ratified-demo.jsx`. Covers are static `GS_ART` SVGs, like the Barrow's.
- Hooks to remove with it: the script tag in `pass-upsell-ratified.html`; `Screen` and the route push in the bridge (main.jsx's screen switch can't name new routes); every line marked "demo" in the store and library overlays. Two small generic changes stay correct without them: `cprEditions` counts any game with chapters, and Library hides any Pass-only game from a free player, not only 36,000 Summers Ago.
- Nobody has played them, so a Pass holder sees the edition games in New for you. A free player sees them on Discover only. Their Library page is canon's generic player page, with empty counts.
- They also get a switch in Account → Notifications, which lists every game.

## A Pass-ended player's games, 2026-10-16: proposed by the owner, not ratified

The owner wants to see this working before he decides. The rule: once a Pass ends, each game's free first part is open again. On the Library page of a game they played with the Pass, an unplayed free first part shows the free card with Play; a used one shows "You stopped here. Everything you earned is still yours." with "Get the Pass again". A game they only played for free shows the free card, done. In Library, a game with a free first part never reads "Pass only" for them.

Clicks: pill → States → "Pass ended: every case" opens Library. Then open:
1. **Escape**: the free first-room card with Play. Row: "Your free room is ready".
2. **Casebook**: "You stopped here…". Row: "Free case done".
3. **The Barrow**: "You stopped here…", labelled CHAPTER 2. Row: "Free chapter done".
4. **Delve**: the free first-scene card, done. Row: "Free scene done".

- Staged in the store as `CPR_LAPSED` (`lapsed: 'every'`). The default Pass-ended player (state 7) keeps its cards. Its Library rows changed, because the "no Pass only" rule applies to every Pass-ended player: Escape now reads "Free room done", Casebook "Free case done", Delve "Free scene done". The owner accepted the rows applying to every Pass-ended player (2026-10-16); the rule itself is still his proposal.

## Audit fixes, 2026-10-16

Ratified by the owner:
1. **A Pass holder's play box has no Pass line.** Open any product page in the Pass view (demo bar → Pass). The line under the button is gone.
2. **Daily Groups needs the Pass.** Signed out or free: the Pass pill on its cards and tiles (Discover, Library), and the Pass-only box on its product page. Home's Pass paragraph now reads "Two daily puzzles…". In Library, a free or Pass-ended player's row reads "Pass only".
3. **New for you holds only what the player can play.** Free view → Library: today's free dailies not yet played, and any free first part not started. Each one leaves once played; the row hides when empty. With the seed, a free player sees only the Barrow. Config → New editions → Most not played fills it. A Pass holder's row is unchanged.
4. **"The Pass" is the only Pass link** on Daily Word, Daily Groups and Daily Mystery's Library pages: "Playing earlier words comes with the Pass." Free view → Library → Daily Word. About the Pass is gone.
5. **"Your streak comes with the Pass." is off** every Library page: Free view → Library → Casebook, Delve or Escape. The frozen weeks stay.

The main agent's calls, not ratified:

6. Item 1 also holds under Config → Subscription → Payment failed and Ending. Both count as holding the Pass.
7. A Pass holder's play box shows no label: no "FIRST CASE FREE", no "ONLY WITH THE PASS".
8. The Pass-only box for a free or signed-out player keeps its label and Get the Pass, with no line under the button. Free view → 36,000 Summers Ago or Daily Groups.
9. Errors fixed:
   - "Everything else comes with the Pass." no longer shows under "No game matches": state 1, then search "zzz".
   - "Your chapters" lists chapter 1 once it's finished: state 5, and the Pass-ended Barrow page.
   - Config → The Barrow, chapter 1 → Finished works for a Pass holder: Pass view → Library → the Barrow. Its row reads "Finished".
   - At phone width, Library card headings and lines wrap balanced, so none ends on one or two words alone. Checked by rule, not by eye at 390 px.

Left alone: a Pass-ended player who opens Daily Groups from Library still sees the canon page with Play, as before. Should the Pass-only change reach that page?
- The seed has no Pass-ended plays per game, so the streak and recent plays on these pages are still the shared seed's. For example, Delve still lists Pass-era scenes.
