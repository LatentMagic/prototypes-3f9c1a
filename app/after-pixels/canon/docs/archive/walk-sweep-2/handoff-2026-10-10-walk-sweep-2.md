# Handoff — walk-sweep-2, 2026-10-10

Two changes on top of the walk-sweep delta, built in `app/`. Neither was present before this session.

## What was built
- **Pass wording (section 1).** Pass table row is now "Play earlier editions" (`gs-parts.jsx`, `GS_COMPARE`). The line under the four puzzle games' session lists is now "Playing earlier editions comes with the Pass." (`gs-puzzles-library.jsx`). The `CLAUDE.md` product block says the same. No qualifier was added. History's "Replay" chip and "Replays" filter are unchanged.
- **Each game's word (section 2).** `GS_GAMES[id].ed = [singular, plural]` in `gs-data.jsx` is the single source. Changed text:
  - Card tag "First edition free" now reads "First case free" (Casebook) and "First scene free" (Delve) on the home, Games, library and game cards (`GsTagList` takes `ed`).
  - Product page week card, free player: "… comes with the Pass. The first case/scene is free." (`gs-game.jsx`).
  - Library achievements, free player: "These are the achievements the first case/scene can earn. Every other case/scene comes with the Pass." (`gs-library.jsx` `LbAch` takes `ed`, which the Casebook and Delve pages pass in).
  - Library card marks: "First case played", "First scene played", and the "Free first …" fallback (`gs-discover.jsx`).
  - Games page, Free to play: "Casebook's first case and Delve's first scene are free." (`gs-discover.jsx`).

## Choices (proposed, for the owner to ratify)
- **Words:** Daily Word "word", Daily Groups "groups" (no singular), Daily Mystery "case", Escape "room", Casebook "case", Delve "scene". These are the prompt's drafts, and each matches what the game's own pages already say. Only Casebook's and Delve's words show anywhere at present, because only those games have a "first one free" line. Groups' missing singular doesn't come up yet. If a singular is needed later, "puzzle" is the candidate.
- **The Free to play line names both games' words.** I didn't drop the noun there, because "free for their first" doesn't read as a sentence.
- **Play pop-up prompt:** it already names an edition as "<Game> #214, “Title”", with no noun. The rule allows this, so I left it.
- **"Playing earlier editions comes with the Pass"** stays word for word on each puzzle game's page because section 1 ratified it, even though each of those pages covers one game.

## "Edition" still shown to a player, and why it stays
- `gs-parts.jsx` Pass table: "Play earlier editions" (ratified) and "The first edition of select games". Both labels span games and need a noun.
- `gs-puzzles-library.jsx`: "Playing earlier editions comes with the Pass." (ratified).
- `gs-billing.jsx`: "the Pass-only games and editions" and "every game and every edition". These span games and need a noun.
- `gs-discover.jsx` Pass band: "every edition of every game". Spans games.
- `gs-home.jsx`: "Play every game and every edition." Spans games. The What's new entry 1.6, "Every earlier edition in one place" and "Open any past edition…", also spans games. It describes the Editions page, which was removed. Rewording it is out of scope here; flagging it for the owner.
- `gs-history.jsx`: the "Every edition" list switch, the "<Game> editions" title, "Loading editions" and "No editions match that." History is under "Do not change".
- Fallback text "edition" in `GsTagList`, `LbAch` and the card mark, for a game without `ed`. No current game reaches it.
- `gs-config.jsx` hint. This belongs to the prototype aid, not the product.

## Next
- Owner to ratify the word for each game, and to decide on the What's new 1.6 entry.
- Earlier handoffs (`free-and-pass`, `history-only`) quote the old wording. They are historical records and were left as they are.
