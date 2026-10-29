# Delve

The game spec for Delve, in the form of the [game spec template](README.md).

## 1. What the game is

A dungeon scenario that stands on its own and takes about half an hour. The player picks a hero, explores a small map of rooms, takes risks for rewards along the way and faces the climax at the end. Their AI narrates, passes the player's choices to the game and tells them what the dice decided.

Each week brings a new setting with its own theme, map, foes and story: a rescue from a goblin warren one week, something else entirely the next.

## 2. How it plays

The server keeps secret every room not yet entered, every way on and option not yet shown, each foe's weakness until a clue to it is found, and every roll to come. The player's view shows only what the hero has seen.

The server rolls every die. A roll is a d20 plus one of the hero's stats against a fixed target, and lands as a strong hit, a weak hit or a miss.

- **Act.** On a foe or hazard, a hit takes from its track and a miss hurts the hero and raises the threat. With no foe in the way, the hero may try one of the room's options instead, each once, paying its cost in threat. An option that forces a lock may be tried again after a miss, paying its cost each time, until the lock is open. A weak hit always costs something; gear lost by chance is never a key or a foe's weakness.
- **Go.** The hero takes a way on once nothing stands in the room. A locked way opens with its key, or by forcing it.
- **Take.** The hero picks up gear lying in the room, up to the carry limit; a full pack means dropping something first.
- **Use.** The hero spends an ability, uses gear, opens a lock with its key, or strikes a foe where it is weak.
- **Ask the oracle.** The server answers a question no rule covers, and its answer is canon.
- **Turn back.** In a map that goes down by levels, the hero may leave with what they have.
- **Choose.** When the middle turn is offered as a choice, the player picks one of its choices, and it comes as the turn. Nothing else can be done until they pick, nothing is rolled, and the choice cannot be undone.

Threat raises the stakes, never the odds: as it rises, weak hits cost more and the climax grows tougher. Full threat loses the run.

A run ends won, turned back, fallen or overrun. It is won when the climax foe is defeated, fallen when the hero runs out of hit points, and overrun when the threat fills.

Every edition can always still be won, and is tuned so that a player who reads the scenario wins most often, a cautious player wins about half the time, and a player who tries everything does worse than one who chooses well.

There are no hints, and no move asks the player to confirm it.

## 3. How to play

The opening gives the premise and offers the heroes, each with their stats, gear and abilities, and the run begins with the hero the player chooses. Each mechanic is explained the first time it comes into play: the first foe, option, lock, full pack, piece of gear, rising threat, choice at the middle turn, and each of the week's extra rules.

A player who comes back to an unfinished run gets the run as it stands: the room the hero is in, the hero, the threat and what has been found.

## 4. How it meets what every game provides

- Genre: Adventure.
- Archetype: scene.
- Franchise: none.
- Tags: fantasy, dice, dungeon.
- Records: every roll, move, option tried, use and take, and the middle turn with any choice made, in the order they came, then the ending with the damage taken, the longest streak of strong hits, whether the climax foe fell to its weakness, and the rooms reached. The page shows sessions, the streak and achievements.
- Completed: a run is completed when it is won. A run that falls, fills the clock or turns back is finished without completing it.
- Editions: one setting a week, so the play streak counts weeks played in a row, and the game keeps a win streak of weeks won in a row. The word for one edition is "run", and for more than one is "runs". Its editions go by name alone: the setting's name, as the share card gives it.
- Long-lived: no.
- Order: current. Earlier runs need the Pass. The free first edition, the first setting released, needs no Pass.
- In progress at once: several runs.
- Replays: None.
- Access: the first setting released is free; every other run needs the Pass.
- Free first edition: yes. A player without the Pass can play the first setting released (Decision-54).
- Sharing: yes, as below. It names the setting, the hero and the ending, counts the rolls and gives one mark per roll, with a crit as ✨ and a natural 1 as 💀. It names no room, foe or weakness.

```text
The Goblin Warren beneath Ashford Mill
Wren the Rogue · ✅ Elsie rescued · 14 rolls · longest streak 3
🟩🟨🟥🟩🟩🟩🟨🟥🟩✨🟨🟩🟩🟨
<link to the game's product page>
```

## 5. How the agent runs the game

- Role: Narrator. Each setting gives its narrator a title of its own, such as Dungeon Master or Storyteller, with its cast and voice.
- Shown each turn: the room as the hero sees it, the ways on, the open options with their costs, the roll and what it did, and the numbers: the threat, the hero's hit points and any foe's track.
- Differently here: the AI never narrates a fight or a challenge to an end the game has not reached, and never acts, speaks or feels for the hero.

## Achievements

- Untouched. Win a run without losing a hit point. Mastery. Rule: the run was won and no hit point was lost.
- Hot Streak. Land three strong hits in a row. Mastery. Rule: the run's longest streak of strong hits was three or more.
- Know Thy Enemy. Bring down a foe by what it fears. Discovery. Rule: the climax foe was defeated and its weakness was used on it in that fight.
- Regular. Complete four weeks in a row. Completion. Rule: a play streak of four weeks.
- Ten Runs. Complete ten runs. Completion. Rule: ten finished runs, won or not.

## Content craft

Facets: Living world, Puzzle chains, Chance, Scene beats, Characters.

- Living world: applied in [The medium](#the-medium). Rooms say so once a foe falls, a lock opens or an option is used up.
- Puzzle chains: locks and keys, and the climax foe's weakness, hinted early and found through its clue, as in [The climax and its weakness](#the-climax-and-its-weakness).
- Chance: as [How it plays](#2-how-it-plays) sets out, threat raises the stakes, never the odds, and a player who chooses well does better than one who tries everything; each option shows its cost before it is tried.
- Scene beats: the set piece is played, not only told, as in [Shape and the week](#shape-and-the-week).
- Characters: each setting names the people its narrator voices, such as an ally, a lieutenant or the climax foe. They may colour freely in their own voice, but every fact they state about a way, a key, a foe or a weakness comes from the game or the oracle.

## Words

### Carry limit

In a [scene](../glossary.md#scene), how many pieces of [gear](#gear) the hero can carry, two or three by [setting](#setting). Taking more means dropping one, which stays in the room.

### Check

A d20 [roll](../glossary.md#roll) plus one of the hero's stats against a fixed target that the [threat](#threat) never raises. It resolves to an [outcome tier](../glossary.md#outcome-tier), which sets what happens to a [foe track](#foe-track) or an [option](#option).

### Clue

In a [scene](../glossary.md#scene), something an [option](#option) reveals and the hero keeps, such as what a foe fears. A [weakness](#weakness) is told to the player only through its clue.

### Crit

In a [scene](../glossary.md#scene), a natural 20 on a [check](#check): it takes double from a [foe track](#foe-track), refunds an [option](#option)'s cost, and gives back [inspiration](#inspiration).

### Exit

In a [scene](../glossary.md#scene), a way from one [room](#room) to another. It may stay hidden until something has happened, or be locked until its key is used or it is forced.

### Foe track

In a [scene](../glossary.md#scene), how much a foe or hazard can take before it is beaten, counting down on hits; at 0 it is defeated. While one is live, no [exit](#exit) opens.

### Gear

In a [scene](../glossary.md#scene), what the hero carries, up to the [carry limit](#carry-limit): passive gear such as armour always applies, a consumable works once, and a key opens its lock and is kept. Not Escape's [items](escape.md#item).

### Hero ability

In a [scene](../glossary.md#scene), something the hero can do a few times a run, such as a shield bash or a fire bolt: used, it strikes or heals at once with no roll. Not the hero's six stats, which a [check](#check) adds to the d20.

### Inspiration

A single use the hero starts with: spent on a [check](#check), it rolls two d20 and keeps the higher. A [crit](#crit) earns it back.

### Middle turn

In a [scene](../glossary.md#scene), the [setting](#setting)'s one twist halfway through the map, met on first entering its [room](#room): a setback, a windfall, a reveal, a betrayal, an ally or a quiet moment. It either simply happens or is offered as a choice between two or three trade-offs, each named so the player can weigh it.

### Module

In a [scene](../glossary.md#scene), an extra rule a [setting](#setting) switches on for its week, such as a torch that burns down or a climax foe that changes halfway. A setting takes one that adds pressure, one that adds opportunity and at most one twist.

### Option

In a [scene](../glossary.md#scene), an optional action a [room](#room) offers once no foe stands in it, such as searching a niche or forcing a gate. It costs [threat](#threat) to try, is tried once, and its [check](#check) decides whether it gives what it promises.

### Room

One place on the [setting](#setting)'s map, joined to others by [exits](#exit); it may hold a foe, [options](#option) and gear, and is shown only once the hero enters it.

### Run

What Delve's player reads for one of its weekly [scenes](../glossary.md#scene).

### Scene

One run through a [setting](#setting)'s map of [rooms](#room) to its climax, played to an end: won when the climax foe is defeated, [turned back](#turn-back) when the hero leaves a map that goes down by levels, fallen when the hero runs out of hit points, or overrun when the [threat](#threat) fills. Each scene is one [week](../glossary.md#week)'s instance on that week's [setting](#setting), with its own [seed](../glossary.md#seed); a finished scene is not played again until the next week.

### Set piece

In a [scene](../glossary.md#scene), the [setting](#setting)'s big moment, told on first entering its [room](#room), drawn from a family such as peril, duel, stealth or rescue that rotates week to week.

### Setting

The content a [scene](../glossary.md#scene) is played on: its heroes, its map of [rooms](#room) and their foes, [options](#option) and [gear](#gear), the [threat](#threat) and its costs, the [middle turn](#middle-turn), the [set piece](#set-piece), its [modules](#module), its endings, and the narrator's voice. Each week's edition has a setting of its own; the setting carries nothing of how the game is listed.

### Strong-hit streak

In a [scene](../glossary.md#scene), strong hits in a row; from two on, every [check](#check) has advantage until a weak hit or a miss breaks it. Not the player's [streak](../glossary.md#streak) of editions.

### Threat

In a [scene](../glossary.md#scene), the danger closing in, rising on misses, [option](#option) costs, weak-hit costs and going back. It raises the stakes, never the odds: as it rises, weak hits cost more and the climax foe grows tougher. Full threat loses the run.

### Turn back

In a [scene](../glossary.md#scene) whose map goes down by levels, the hero leaving with what they have once a level down and nothing stands in the room: a smaller win, and one of the run's endings.

### Weakness

In a [scene](../glossary.md#scene), what a foe fears, struck with a piece of [gear](#gear) or something the hero has prepared, for a heavy blow. It is never named to the player until its [clue](#clue) is found.

## Writing settings

What makes a setting work. The examples are from the first batch of settings, each played blind by a reader who saw only what a player sees.

### The medium

- Write for a 13-year-old, in plain words. A word the reader may not know is explained where it first appears, or replaced: "mill race" became "the flooded tunnel", and "brig" is "the ship's prison".
- Names are on screen. No room, way, option, gear or foe name gives away a secret, an answer or a room not yet entered. The objective and the threat's name show on every turn, so neither carries the name of a foe or room still to come: "The hunt", not "The creature's hunt".
- Every object the player is drawn to either matters or is plainly scenery. A locked chest with nothing to try on it reads as a puzzle the game forgot.
- Using gear has no hint, so each piece of gear says what it is for: "Poured on a torch it burns bright again; flung into a fire it flares up blinding white."
- Text stays true as the run moves. Once a foe falls, a lock opens or an option is used up, the rooms that describe it say so. A way's text cannot change, so it names where it leads, not what waits there.

### Rules and story

- Every rule has a reason in the story, and the story never promises a rule the game does not keep.
  - The climax is one foe. Never write a bodyguard or a second enemy into it.
  - Say why the risk rises: every miss raises the threat, and so does going back through a room already crossed. "Every rattle quickens the chant."
  - Say why the dark hurts: with the light run out, every foe's miss hurts more.
  - Words match effects. "Every alarm wails" for a small rise reads as broken.
- Costs are drawn anywhere: in any room, in any fight, after the room's foe has fallen, with the pack empty. A cost that names a foe, a piece of furniture or one room's feature turns up where it makes no sense.
- An ability or a strike can end any encounter, hazards included. Write each one so it fits a locked door or a rising flood as well as a foe.
- Each module is a piece of the story: the light is a torch, oxygen or a Geiger counter; a lieutenant wears the ward that shields the climax foe; a bargain's price is the villain learning you are coming.

### The climax and its weakness

- Hint at the climax foe's weakness early, and make getting it a real choice: two boons for one slot, a cost in threat, a detour, or a price later. Never "pick up the magic item".
- The weakness makes the fight shorter; it is never the only way to win. A foe that "cannot die" or that "shooting only makes angry" is beaten by fighting all the same, so the text says the fight is long and hard instead.
- The weakness takes at most two-fifths of the foe's track: it shortens the fight, never ends it.
- The won ending is true of every win, with the weakness or without it.
- A clue hunt withholds the weakness until enough pieces are found, so where the weakness is readied the text says what is still missing.
- No single missed roll should end the hunt: give it more pieces than it needs, or two ways to ready the weakness.

### Shape and the week

- The set piece is played, not just told: its room's encounter or options are the set piece. Its encounter takes more than one blow.
- The ending pays off the opening's promise. Each setting has three endings (won, fallen, overrun), four on a descent, and a share line for each that is worth posting, a loss included.
- No set-piece family returns within four weeks, and two weeks in a row never share a shape, a middle turn or a set of modules.
- Don't echo another game's editions: Escape already has a lifeboat, a polar station, a jailhouse and a gallery break-in.

### Before a setting ships

- Four to six rooms, about 12–18 rolls, about 30 minutes.
- Every hero can reach an ending from every state, and each player style wins within its band, the reader most of all.
- Play it blind, from the player's text alone, to an ending. The checks prove a setting can be finished; only a reader finds the line that rings false.
