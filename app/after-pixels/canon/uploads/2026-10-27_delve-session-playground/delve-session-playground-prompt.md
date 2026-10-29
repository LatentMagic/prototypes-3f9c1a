# After Pixels: Delve's session page playground

Your job is to build a playground, following your own standard for building one.

Before anything else, read `docs/specs/1236-session-pages/README.md` in this project: it is kept up to date with what this work has settled, and it holds where this brief is older. Its "Lessons for playgrounds" apply here in full.

Then read how Escape, the first game done this way, was taken through: its newest handoff (`handoff-2026-10-27-escape-into-app.md`), its spec check (`escape-spec-2026-10-27.md`), the v5 playground it was settled in (`playground/v5.html`, `pg-es5.jsx`), and `app/gs-escape.jsx`, where Escape's session page now lives in the main build. Delve follows the same route. Daily Word is part-way along the same route: its session page is in the main build but still being explored, and its library game page card is not in yet. Read its newest handoffs for what it has learned, not as settled design (`handoff-2026-10-28-word-session-v7-result.md`, `handoff-2026-10-28-word-session-v6.md`, `handoff-2026-10-27-word-session-into-app.md`).

## Context

What a session page is for (owner, approved): A session page shows one play and how it went. Its top section belongs to the platform and is the same on every game: the cover, the title and Share, for example, with Play only where the game can be played again (a daily edition cannot); exactly what it holds is still to be designed. Below it, the play is told in the game's own terms: its design choices evoke the theme of this game, so it feels like this game and no other, while staying recognisably After Pixels. The background and chrome stay the store's; the game comes through in its elements. A page the player is excited to go and see.

After Pixels is a store of games played inside the player's own AI chat. Each game has a library game page, and each finished or in-progress play has a session page. We are redesigning the session pages one game at a time, so each feels like its game while still reading as part of After Pixels. In Delve the player picks a hero and explores a small dungeon of rooms; every risk is a d20 roll, and the run ends at a climax foe. Each week brings a new setting; the one shown here is The Goblin Warren beneath Ashford Mill.

A first exploration tried three directions. The images below show them. What the owner made of them follows, in two lists. Liked is not ratified, but each liked thing is the reason this playground exists: losing one is a failed option, not a fresh direction.

**Keep. Every option shows each of these on the session page itself.**

- **The key moments (option 3, "The moments").** The rolls a player would retell, each with what happened: the big success (a natural 20), the roll made exactly, the last roll that won the run, and the big miss. He loves these; they are far more interesting as dice than a row of dice.
- **The path through the rooms as the run's timeline (option 2, "Room by room").** The journey, room by room, including doubling back. He finds it says more about the run than the row of dice. Option 2 did it all right, not perfectly: its images show the idea, not the finished form.
- **Rooms reached and the threat level (option 1, "The dice").**

**Needs design.**

- **The path and the moments, together.** Option 3 has the moments but lost the timeline; option 2 has the timeline. Design the two as one: the moments joined to the path through the rooms. One idea he called "absolutely phenomenal": clicking or hovering a moment (say, the last roll) opens nothing, but highlights its place on the timeline and its roll, and selecting on the timeline highlights the moment.
- **The dice drawing.** The dice in all three options "don't feel very Delve". If dice are drawn, how they are drawn needs exploring so they belong to this game.
- **Space.** Option 1 leaves a large empty gap at the top right; option 2 wastes the space on its right. Use it.
- **Share** has fallen out of the top section, below the content. It belongs in the top section; moving it down costs space that should show the session. The main build's top section already holds it: reuse that.

This playground is the session page only. The library game page's top-left card comes after, in a follow-up that brings what the session page settles into it, since the two will share elements. Do not design the card here.

**The game's spec, attached: `delve.md`** (monorepo main `55ae858cb`, unchanged at 2026-10-27). Read it after the README: it is how Delve actually plays, and it outranks anything this brief says about the game. Where the two differ, follow the spec and say so in the handoff. Do not show anything the spec says the game does not do.

Images, attached (examples of today's state, not targets). The left rail and the pink badges are the old playground's switcher; ignore them.

- `today-option1-store-ia-desktop-1440.png`, `today-option1-store-ia-mobile-390.png`: the dice.
- `today-option1-top-right-gap.png`: the owner's own capture of the empty top-right gap.
- `today-option2-store-ia-desktop-1440.png`, `today-option2-store-ia-mobile-390.png`: room by room.
- `today-option3-store-ia-desktop-1440.png`, `today-option3-store-ia-mobile-390.png`: the moments.
- `joe-solved-shared-2026-10-28.png`: the result statement's shared form (see The result statement).

Source of that exploration, readable from GitHub: `LatentMagic/prototypes-3f9c1a/app/after-pixels/playgrounds/session-pages/options/delve-1.jsx`, `delve-2.jsx`, `delve-3.jsx`, their model `options/delve-model.jsx`, and notes `notes/delve.md`. The store's own session page is `LatentMagic/prototypes-3f9c1a/app/after-pixels/canon/app/gs-session.jsx`.

## The question

What should Delve's session page be, built on the run's key moments joined to its timeline?

## Options

Explore three concepts: three different ideas of what this page is, not three versions of one idea. Each covers the session page, on desktop and phone, in each way The Goblin Warren's run ends (won, fallen, overrun) and unfinished, both ways: still in progress (the top section keeps its Play, as the main build has it) and the week ended before it was finished. Turned back exists only on a setting that goes down by levels, which this one does not: say in the handoff how each option would take a fourth ending.

## What is known

What the game records and can show, and nothing more. Add nothing the game does not record.

- The setting's name, the hero (name and class), and the play's date.
- How the run ended: won (the climax foe defeated), turned back, fallen (the hero ran out of hit points) or overrun (the threat filled). Hit points left, damage taken, threat reached, rooms reached.
- Each setting words its own endings, some long (for example "Too late: the ritual was completed"); the page shows that wording and must fit it on a phone.
- Every roll in order: which stat, the d20 (or two d20 with the higher kept, from inspiration or a strong-hit streak of two or more), the total against a fixed target, and whether it landed a strong hit, a weak hit or a miss. A natural 20 and a natural 1 stand out.
- What each roll was for: a foe or hazard, a room's option (paid for in threat), forcing a lock.
- The rooms in the order entered, including doubling back. Gear taken and used, abilities spent, locks opened by key or forced.
- The middle turn, and the choice made if it was offered as one.
- The longest streak of strong hits, and whether the climax foe fell to its weakness.
- Achievements earned (for example Untouched, Hot Streak, Know Thy Enemy).

Per-roll detail, the rooms moved between, and whether the foe fell to its weakness are recorded by the game but not all sent to the session page today. Hit points left and the threat reached are not named in the spec's record; they can be worked out from the rolls and damage. Show them, and say in the handoff which figures the page depends on, and whether each is recorded or worked out.

## Settled, do not reopen

- **The top section is the same on every game's session page:** the cover, the game's title and Share, for example, with Share inside it. Play shows only where the game can be played again; a finished Delve run cannot be (`delve.md`: Replays, none). Only the session's own information below it is bespoke to the game. Use the top section exactly as Escape's session page has it in the main build: its quiet head (`GS_SESSION_QUIET` in `app/gs-escape.jsx`), with no result or figures in it. Daily Word's head still shows its result; do not copy that. Do not design, vary or propose it in any option: it has its own playground.
- **Share is a button** opening the store's existing share pop-up. The share text is not embedded in the page.
- **The background, the page's chrome and the store's colours stay the store's.** A game's character lives in its elements, not in colour.
- **The bespoke part evokes Delve in a way specific to Delve,** without straying so far from the design system that it no longer feels like After Pixels. Every game's bespoke part sits the same distance from the design system: Delve's page sits no further from After Pixels than Escape's in the main build (`app/gs-escape.jsx`). Drawing the page in the game's own world went too far, for Escape and for Delve.
- **No white or cream ground** anywhere on the session page ("hurts my eyes"). Elements stand out against the dark page by contrast, not by a light panel behind them.
- **Success and failure are never told by colour alone:** a word or mark carries them too.
- **"Every move" is the existing collapsible list Escape and Daily Word already use** (`app/gs-escape.jsx`), below the session's own picture. Reuse that component as it is in every option. Do not design, vary or restyle it: it is not part of this playground.
- **No paragraphs.** The first phone screen holds a headline, a few figures and one picture.
- **The Keep list above** holds in every option, on the session page.

## Lessons from the earlier rounds

- **Nothing is fixed unless the owner ratified it in words.** Something an earlier build invented stays open, however long it has shipped in a playground.
- **Delve's hard play** (the README's lesson): every option carries one besides the ordinary plays, built to `delve.md`'s limits: the most rooms a setting allows, doubling back, a long run of rolls, a natural 20 and a natural 1, a roll with two d20, a lock forced, and a run that ends badly.
- **Check your own build before handing off.** Look at every option in every play state, hard play included, on desktop and phone. The bar fits on one row at the owner's width (about 1185px), with every control reachable without scrolling.

## The result statement

Not in the top section. Every session page has one: it states outright how the run ended, in Delve's own ending words, which are sometimes a sentence.

Owner's direction, not yet ruled (2026-10-28): one shared form across games, not a concept per option. The outcome in a success colour for a win, as in the attached `joe-solved-shared-2026-10-28.png` (an example), and warning yellow for a miss, always with words. Read how Escape's and Daily Word's session pages show their result today, and how each carries it to its library game page and now card; neither build shows this shared form fully yet. Where the README says the result statement gets its own ideation, this newer direction holds for this playground. Build the same form in every option, fitting a phone. Say in the handoff how you treated the long endings, and what you found in Escape and Daily Word.

## Open, for the owner to rule

Build these as each option sees fit, and say what each chose:

- **Which moments are picked.** Show the rule each option uses.
- **How each option shows the link between a moment and its place on the timeline.**
- **Spoilers.** Delve's share text names no room, foe or weakness. Whether a session page, which gets screenshotted, may name them is not settled.

**Your own space.** Keep everything for this in `docs/specs/1236-session-pages/`. Add Delve to its `README.md` in a few lines: the question above and what is settled. Replace its opening statement with the approved one quoted under Context, which is newer (Play only where the game can be played again). Do not change the README's result-statement rule; note the direction you followed in the handoff. Escape's work is already in this space and in the main build: leave both unchanged, and build Delve's playground beside the build, not in it; where a choice here is one every game would share (such as linking moments to a timeline), say so in the handoff.

**Hand off.** When the build is done, write `docs/specs/1236-session-pages/handoff-{YYYY-MM-DD}-delve-session-playground.md` so the next session can resume without this conversation: what you built and where, what each option is and how to reach it, what you chose for each open item and why, which choices would apply to every game, anything you could not build, and what you would do next.
