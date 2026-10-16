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
