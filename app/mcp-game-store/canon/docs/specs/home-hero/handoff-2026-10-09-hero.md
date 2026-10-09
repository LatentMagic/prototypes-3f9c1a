# Home hero, signed out

**Landed 2026-10-09.** Option 9 with subline a is now the home page hero (`app/gs-home.jsx`, styles in `index.html`).

## Decisions (ratified by the user, 2026-10-09)
- Keep the headline "Someone's lying to you. Go and find out who." and show the game it names, Casebook.
- Subline a: "Your AI plays every suspect, and some of them are lying. Find the proof that breaks their story." It is written from `game-specs/casebook.md` §1. Claude and ChatGPT are named once, in Works with.
- Art: one Casebook cover field with the existing screenshot set inside it, its border fully within the blue. The cover's bars and sun are rearranged around the screenshot.

## Open
- The screenshot shows Daily Word, not Casebook, because it's the only one there is. The user chose to keep it.
- "Start free" doesn't reach Casebook, which needs the Pass.
- `GsFeature` and `GsTodayList` are now exported from `gs-home.jsx` for the playgrounds.

## Playgrounds
`playground/`: options 1 to 3, 4 to 6, 7 and 8, and 9 (round 4).
