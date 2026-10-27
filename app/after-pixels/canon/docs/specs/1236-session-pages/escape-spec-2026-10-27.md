# Escape

> Snapshot of the game spec as the owner supplied it on 2026-10-27. The live spec may have moved on since; check it before relying on this.

The game spec for Escape, in the form of the [game spec template](README.md).

## 1. What the game is

The player is locked in a room and must find the way out. They examine objects, find locks and open them with answers worked out from clues spread around the room. Along the way they carry items, set mechanisms and choose between ways on, and the room changes as they solve it: things appear, descriptions change, and the exit may open onto a second room. Their AI sets the scene, passes the player's moves to the game and tells them what came back. There is one room a week, and it takes about half an hour.

## 2. How it plays

The server keeps secret everything the room has not yet shown: hidden objects, locks, items and mechanisms, every description not yet read, each lock's answer, each mechanism's solution, and every hint not yet taken. The player's view lists only what is shown.

The player examines a shown object to read it, and picks up any item on it. They can examine it again only once its description has changed since they last read it. They open a lock by entering an answer, which the server marks right or wrong. A wrong answer is a wrong try. A room may list near misses, wrong answers a player will predictably give, each with a reply of the room's own. A near miss is answered with that reply and still counts as a wrong try, on a typed lock and a mechanism alike: the reply changes, never the count. Opening a lock can reveal objects or locks, change a description, give an item, close another lock, or add a piece of the story.

A mechanism is dials, switches or levers. The player sets each part, and the server opens what it opens if the setting is the solution, or gives the room's feedback for that setting, such as "three of five lamps light", and counts a wrong try. A near miss on a mechanism gets the room's reply after the feedback, and spends a try, so the tries still stop the player working through every setting. A mechanism allows a set number of wrong settings, after which it refuses more until the player takes its next hint.

The player may use a carried item on something in the room. A pairing the room lists does what the room says, and the item is used up or kept. Any other use gets a flat no, counts no wrong try, and changes nothing. A room may have one combination of two items, which makes a third. Any other combination gets a flat no.

Some locks come in either-or pairs: opening one closes the other for the rest of the room. Some locks can be forced with the item the room names for them. A forced lock opens as if solved, and counts on the finish card.

There is no fail state and no clock in play. Every room can always be finished: from any point, a way to the exit remains. Time against par shows only once the player is out.

Each lock and each mechanism has three hints, taken in order. The first two point the way, and the third gives the answer or the solution. A hint spends no try, and it restores a mechanism's tries. A pairing or the combination may have three hints too, the third naming the target or the pair. They are offered only while the player could make that use now, so a hint never names something the room has not shown.

## 3. How to play

The game gives the player the room's story and sets the scene, then leaves them to explore by examining objects and entering answers on the locks they find. The opening tells the player what they have, hints included. Items, mechanisms, forcing, either-or locks and the second room are explained when the player first meets them, not before.

A player who comes back to an unfinished room gets the room as it stands: what they have found, in the order they found it, what they carry, the locks they have found and the hints they have had.

## 4. How it meets what every game provides

- Genre: Puzzle.
- Archetype: room.
- Franchise: none.
- Tags: weekly, escape-room, puzzle.
- Records: each examination, answer, setting, use, combination, force and hint, in the order they came, then the escape with the hints taken, the wrong tries, the locks forced, whether it was at or under par, and whether the room had a second room. The page shows sessions, the streak and achievements.
- Completed: the room is completed when the player escapes. Escape has no fail state, so every finished room is completed.
- Editions: one room a week, so the play streak counts weeks played in a row. Every finished room is completed, so the game keeps no win streak. The word for one edition is "room", and for more than one is "rooms". Its editions go by name alone: the room's name, as the share card gives it.
- Long-lived: no.
- Order: current. Earlier rooms need the Pass. The free first room, the first room released, needs no Pass. An escaped room stays escaped.
- In progress at once: several rooms.
- Replays: None.
- Access: the first room released is free; every other room needs the Pass.
- Free first edition: yes. A player without the Pass can play the first room released (Decision-54).
- Sharing: yes, as below. It names no object, lock or answer. A finished card gives the time, whether it was under or over par (exactly par counts as under), the hints, the wrong tries, and the locks forced when any were. A count of no hints or no forced locks is left out. A card made mid-room says only how many locks are open, never how many remain.

```text
Escape · The Clockmaker's Study · escaped in 28 min, under par · 1 hint 💡 · 2 wrong tries
<link to the game's product page>
```

## 5. How the agent runs the game

- Role: Game host.
- Shown each turn: what came back, then the room as the player has found it. While in the room, nothing about elapsed time or par.
- Differently here: the AI never decodes a cipher, combines clues, says which clue opens which lock, suggests an item's use or a mechanism's setting beyond passing on a hint the game gave, or says what forces a lock. It reports a mechanism's feedback exactly as the game words it, and adds atmosphere but never a clue or an object the room has not shown.

## Achievements

- Clean Getaway. Escape without a hint or a wrong try. Mastery. Rule: the escape took no hints, had no wrong tries and forced no lock.
- Beat the Clock. Escape under par. Mastery. Rule: the escape was at or under par.
- Not So Fast. Discover there's more than one door to get through. Discovery. Rule: the room escaped had a second room.
- Regular. Escape four weeks in a row. Completion. Rule: a play streak of four weeks.
- Ten Rooms. Escape ten rooms. Completion. Rule: ten rooms escaped.

## Content craft

Facets: Living world, Puzzle chains.

- Living world: applied in [Writing rooms](#writing-rooms). When a lock opens, the objects and the room it changes say so, and every object the player is drawn to matters or is plainly atmosphere.
- Puzzle chains: applied in [Story and answers](#story-and-answers). Each step's clue is shown before its lock can be solved, and every answer is foreshadowed in the room's text.
- Departs: Wrong attempts. A use or combination of items the room does not list gets a flat "Nothing happens.", so it never confirms which pairing the room has.

## Words

### Dial

A structure setting a [room](#room) turns up from its simplest: shape, [phases](#phase), rooms, clues per lock, routes, red herring, [items](#item), finale or story. Each room's edition tags name its dials, and together they are its setup: two weeks running never turn up the same dials, and the content check refuses a schedule that does. Not a [mechanism](#mechanism)'s dials, which are its parts.

### Either-or lock

One of a pair of [locks](#lock) where opening either closes the other for good, so the player commits to one way on. The game says so when the first of the pair is found, and the room is proven to stay escapable whichever is opened.

### Forced lock

A [lock](#lock) opened without solving it, by using the [item](#item) the room names for it. Only a lock the room marks forceable can be forced; the game says so when it is found, without naming the item. Each forced lock is counted on the [share card](../glossary.md#share-card).

### Hint rung

One step of a [hint ladder](../glossary.md#hint-ladder) for a [lock](#lock) or an [item](#item)'s use: a nudge, a bigger nudge, then the answer or the target. A rung is given only for a lock the player has found and not opened, or for a use of carried items the player could make now.

### Item

A thing the player carries: picked up by examining the [object](#object) it is on, or given when a [lock](#lock) opens.

### Lock

A puzzle that takes either a typed answer of a stated kind, such as four digits, or a setting of a [mechanism](#mechanism). It sits on an [object](#object) and is found by examining that object once the lock is shown, which it may be from the start or once one or more other locks open. Opened, it reveals its contents and may change the room (a [phase](#phase)). A lock may be closed for good by its [either-or](#either-or-lock) partner, or [forced](#forced-lock). Opening the one exit lock escapes the room. Answers compare without case, spaces or punctuation.

### Mechanism

A [lock](#lock) of dials, switches or levers: the player sets a value for each part and the game reports how many are right, such as "three of five lamps light". Each wrong setting counts, a near miss included; once its tries run out, a [hint rung](#hint-rung) for it lets the player try again, and with no rung left the tries are unlimited.

### Object

A thing the player can examine for its description, which may carry clues and may change as locks open. Examining an object finds the shown [locks](#lock) on it and picks up the [items](#item) on it.

### Par

A [room](#room)'s target time. It is told only once the player escapes: the time from entering to escaping, under or over par, on the [share card](../glossary.md#share-card).

### Phase

The [room](#room) changing when a [lock](#lock) opens: objects, locks or [items](#item) appear, a description changes, an item is given, or an [either-or](#either-or-lock) partner closes.

### Room

One [week](../glossary.md#week)'s puzzle: a story, the [objects](#object) in it, the [locks](#lock) on them, its [items](#item), and a [par](#par). It changes in [phases](#phase) and may open onto a [second room](#second-room). The player is shown only what the room has revealed and they have found. Not Daily Mystery's rooms, which are places in its [cast](daily-mystery.md#cast).

### Second room

The [phase](#phase) a passage [lock](#lock) opens: the [room](#room) takes the second room's title and description and its contents appear. The passage is never the exit, and the first room's objects can still be examined.

### Signature trick

A [room](#room)'s central aha moment, such as lights out or a book cipher, drawn from a fixed catalogue and named in the room's edition tags with its [trick family](#trick-family).

### Trick family

The group a [signature trick](#signature-trick) belongs to: deduction, reversal, sound and light, story, text is the puzzle, or wordplay week. Families rotate so one returns no sooner than four clear weeks later; the content check refuses a schedule that brings one back sooner.

## Writing rooms

What makes a room work. The examples are from the Clockmaker's Study, which was redesigned three times before it held up.

### The medium

- Every aha happens while reading. The player sees no picture and hears no sound, so a trick whose cleverness lies in sound, colour or an image collapses in text. A music box that "plays F, A, C, A, D, E" hands over the letters, and sol-fa needs music knowledge.
- No answer can be typed without solving the puzzle:
  - Letters on screen give the word away when they can be read off at a glance. Gears stamped K, I, T, C spell TICK, so sorting them is busywork. Show tooth counts read as A=1 instead. Shown letters are fair only when the puzzle is choosing and ordering them.
  - Names are on screen too. An object, lock or item name never contains an answer or gives away something the room hasn't shown yet.
  - The theme gives the word away: TIME in a clockmaker's room is the first guess.
  - Short answers are coin flips. For a mechanism, weigh its number of settings against its tries.
- Assume a 13-year-old with no specialist knowledge. The alphabet, telling time, days of the week and simple arithmetic are fine. Morse, musical notation, foreign words and trivia are not, unless the room teaches them in its own text.
- One reading, one answer. Spell out the order wherever order matters. Where a misreading is likely ("a quarter to four" as 4:45), give that misreading a near-miss reply.
- An answer can be fairly given in more than one form, such as a person's full name, surname or code name. Accept every form that names only the right answer.

### Story and answers

- Every answer means something in the story: why would this character set this code? FACADE was arbitrary, and SUN had no link to a clockmaker. Change the word rather than explain it in a hint.
- The finale pays off the opening: TICK first, TOCK last. Build the finale from what the player gathered.
- Write the chain out as step → clue source → answer → what it unlocks. Each step hands over the next thing, and nothing can be solved before its clue is shown. Two tracks may run side by side and meet: the drawer gives the key, the cabinet the time, and both are needed at the clock.
- A deduction has exactly one answer. Each wrong candidate is ruled out by something the room states, and every fact needed, down to a walking time, is in the room's text.
- The room delivers what its opening promises. Reveal the story in pieces as locks open, and land it in the exit text.
- Every object the player is drawn to either matters or is plainly atmosphere. A red herring is a deliberate dial, never an accident.
- The room's text names or plainly implies what each item is for: a frozen padlock with "something warm might free it" scrawled beside it.

### Trick and theme

- Choose the signature trick first, then the setting that makes it native: a clockmaker's study for setting the hour. When the theme suggests a trick the medium rules out, the medium wins.
- The signature trick is the room's memorable beat. If a supporting puzzle outshines it, strengthen the trick or retag the room honestly.
- Aim for four to six puzzles across at least three puzzle types. Each uses a different kind of thinking from the trick, and no setup is repeated. The room's tags (trick, family, dials, puzzle types) are true of the room.
- Items and mechanisms belong to the setting: a winding key for a stopped clock, and feedback worded as "{correct} of {parts} hands click into place".
- No trick family returns sooner than four clear weeks later, and two rooms in a row never turn up the same set of dials.

### Trick catalogue

| Family             | Trick                    | How it plays                                                                       | In text                                           |
| ------------------ | ------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------- |
| Text is the puzzle | The room is the cipher   | The opening hides a message: capitals, every third word, first letters of objects. | Works.                                            |
| Text is the puzzle | Hidden in the list       | The object names, in order, spell the answer.                                      | Works.                                            |
| Text is the puzzle | Overlay                  | A document reads as nonsense until a second one gives the word positions.          | Works.                                            |
| Text is the puzzle | Redactions               | The missing words of a blacked-out report are found around the room.               | Works.                                            |
| Text is the puzzle | Invented language        | Labelled objects teach a script, so the last inscription becomes readable.         | Works if the room teaches every symbol.           |
| Text is the puzzle | Book cipher              | A catalogue turns page and line numbers into words.                                | Works.                                            |
| Sound and light    | Music box                | A tune given as note names spells a word.                                          | Weak: gives the letters away or needs music.      |
| Sound and light    | Flickering lamp          | Long and short flashes are Morse.                                                  | Weak unless the room supplies the code.           |
| Sound and light    | Lights out               | After a phase, the same objects read differently.                                  | Works.                                            |
| Sound and light    | Set the hour             | Setting a clock changes the light in the descriptions.                             | Works: the Clockmaker's Study.                    |
| Deduction          | Unreliable diary         | One entry lies, and its date is the code.                                          | Works.                                            |
| Deduction          | Who's lying              | Exactly one claimant tells the truth.                                              | Works.                                            |
| Deduction          | Timeline                 | Receipts and tickets place each person.                                            | Works.                                            |
| Deduction          | Inventory audit          | What is missing from a ledger is the answer.                                       | Works.                                            |
| Deduction          | Odd one out              | One signature, coin or letter is forged.                                           | Works if the difference is stated in words.       |
| Deduction          | Recipe                   | The right order, from a recipe split across the room.                              | Works.                                            |
| Story              | The twist rereads a clue | Learning who wrote a note changes its meaning.                                     | Works.                                            |
| Story              | Told backwards           | Logs are found in reverse, and the code depends on reordering them.                | Works if each log says what came before or after. |
| Story              | Intercom                 | Someone trapped elsewhere describes their room, and your answers open their doors. | Works.                                            |
| Reversal           | Break in                 | The goal is to get into the vault, not out.                                        | Works.                                            |
| Reversal           | The real goal            | The door was never locked; the will or the name is what matters.                   | Works.                                            |
| Reversal           | Second room              | The exit opens on another room.                                                    | Works.                                            |
| Reversal           | The map is the room      | A floor plan shows what is hidden where.                                           | Works if the plan is described in words.          |
| Reversal           | Lock it up               | The answers seal something in before you leave.                                    | Works.                                            |
| Wordplay week      | Puns                     | Every lock answers to a homophone from the setting.                                | Works; check guessability.                        |
| Wordplay week      | Puzzle number            | The room's own number is part of the final code.                                   | Works.                                            |

### Before a room ships

- Three hints per lock and mechanism: a nudge, a bigger nudge, then the answer. A pairing or combination the way out needs has three too, the third naming its target or its pair; the content check refuses one without them. No rung names anything the room has not shown by the time the player can make that use.
- Walk the chain as a player, from the player's text alone. That a room can be finished is checked automatically; that its clues lead where they were meant to lead is not.
- The shortest solve is about 10–15 moves, and par matches how long the room really plays.
