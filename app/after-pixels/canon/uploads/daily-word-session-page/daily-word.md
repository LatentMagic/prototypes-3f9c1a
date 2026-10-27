# Daily Word

The game spec for Daily Word, in the form of the [game spec template](README.md).

## 1. What the game is

The player guesses a five-letter word in six tries. Their AI passes each guess to the game and shows how it scored. The AI gives no help unless asked, and a day allows one hint. There is one word a day.

## 2. How it plays

The server keeps the day's word secret. It marks each guess letter by letter: in the word and in its place, in the word but elsewhere, or not in the word. No guess is confirmed before it is made. The hint always gives where a letter goes: the place of the first letter the player has not yet placed (not green), such as "Letter 2 is R." It never says only that the word has a letter, and it spends no guess. It is refused only when every place is already placed.

## 3. How to play

The game tells the player to guess the word in six tries, and it says how it marks each guess. The opening also tells the player how many hints they have. It tells a player who comes back to an unfinished day how many guesses are left and that the day continues.

## 4. How it meets what every game provides

- Genre: Puzzle.
- Archetype: word.
- Franchise: none.
- Tags: daily, word, puzzle.
- Records: each guess with its marks, each hint, whether the word was found and in how many guesses. The page shows sessions, progress, the streak and achievements.
- Completed: the day is completed when the word is found. A day where the six guesses run out without it is not completed.
- Editions: one word a day, so the play streak counts days played in a row, and the game keeps a win streak of days won in a row. The word for one edition is "word", and for more than one is "words". Its editions go by number, from No. 1. Each edition has its own word, chosen ahead from the game's word list and checked before it is published.
- Long-lived: no.
- Order: current. Earlier words need the Pass. There is one play of each word.
- In progress at once: not yet declared.
- Replays: None.
- Access: today's word and its hint are free.
- Free first edition: none, since today's word is already free.
- Sharing: yes, as below. It hides every letter.

```text
Daily Word No. 412 · 4/6 · 1 hint 💡

⬛🟨⬛⬛⬛
🟨⬛🟩⬛⬛
⬛🟩🟩🟨⬛
🟩🟩🟩🟩🟩
<link to the game's product page>
```

## 5. How the agent runs the game

- Role: Game host.
- Shown each turn: the whole board drawn in the chat, one row of tiles per guess so far, each tile one letter in the colour the game gave it.
- A lone five-letter word that could be a guess or another action (pausing, restarting, asking for a hint, or chatting): the AI asks which the player means, naming both, and does neither until answered. A word with no other reading is a guess.

## Achievements

- Week. Keep your Daily Word streak for 7 days. Completion. Rule: a win streak of 7 days.
- Month. Keep your Daily Word streak for 30 days. Completion. Rule: a win streak of 30 days.
- Year. Keep your Daily Word streak for 365 days. Completion. Rule: a win streak of 365 days.
- One Shot. Solve the word with your first guess. Mastery.
- Just in Time. Solve the word with your sixth and last guess. Mastery.
- Ten Wins. Solve 10 Daily Words. Completion.

Daily Word has no discovery achievement, since a word puzzle has nothing to find.

## Content craft

Facets: none beyond the core, since a word puzzle has no world, chain, chance or characters.
