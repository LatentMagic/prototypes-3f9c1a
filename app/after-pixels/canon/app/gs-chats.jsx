// ============================================================================
// After Pixels — "In your chat": the DS ChatPictures per game (three, and four for Delve), and the home hero's.
// Sample turns, written to follow each game's seed record (gs-data.jsx), except Delve's, Guess's and Accuse's, written from a real play.
// ============================================================================
import React from 'react';
import { GS_ES1, DS, GS_GAMES } from './gs-data.jsx';

export const GS_CHAT_BY = 'After Pixels';
export const GS_CHAT_MARK = 'assets/logo.svg';
export const gscU = (text) => ({ from: 'user', text });
export const gscAi = (tool, text, blocks, after) => ({ from: 'ai', tool, text, blocks, after });
const GSC_WIN = [{ label: 'Share result', icon: 'share' }, { label: 'Back to the games', icon: 'list' }];

const GSC_CB_SEARCH = [gscU('Ask Maeve Doyle where she was at ten'),
  gscAi('casebook', '“In the bar, all evening. Ask anyone.” Maeve doesn’t look up from her glass.'),
  gscU('Search the bar'),
  gscAi('casebook', 'The last drink on Maeve’s tab was poured at 9.40.', [{ type: 'clues', groups: [{ kind: 'Evidence', facts: [{ text: 'The bar ledger', new: true }] }] }, { type: 'stats', items: [{ label: 'Turn', value: '4 of 16' }] }])];
const GSC_CB_LIE = [gscU('Show Maeve the bar ledger'),
  gscAi('casebook', '“Fine. I stepped out at quarter to ten. I went to the cliff stair, but he was already gone.”', [{ type: 'clues', groups: [{ kind: 'Evidence', facts: ['The bar ledger'] }, { kind: 'Statements', facts: [{ text: 'Maeve Doyle: lie exposed', new: true }] }] }, { type: 'stats', items: [{ label: 'Turn', value: '5 of 16' }] }])];

// Delve's fight chat, written for the page from an invented edition (Delve #40, a number clear of every real edition's): the figures follow one worked run of a Knight, and no edition secret appears.
export const GSC_DV_FIGHT_CAP = 'Every hero has a heavy swing of their own, and it hits harder.';
export const GSC_DV_FIGHT = [gscU('I use Sunder on the troll'),
  gscAi('delve', 'Your blade bites deep, and the troll roars loud enough to shake dust from the roof. Its club swings round in answer, and your shield takes the worst of it.', null, [{ type: 'roll', label: 'Sunder', roll: 13, mod: 3, target: 14, result: 'hit', outcome: 'Hit · 7 damage' }])];

export let GS_CHATS;
export let GS_HERO_CHAT;

export const GsChatPic = ({ turns, height, width, label }) => (
  <DS.ChatPicture turns={turns} mark={GS_CHAT_MARK} toolBy={GS_CHAT_BY} height={height} width={width} label={label} />
);
// KEEP: the product page's chat row (the design system's CardRow kind="chat") shares the width when the pictures fit and scrolls sideways
// with Previous and Next when they don't. Each ChatPicture scrolls itself, opens on its latest turn and has its own "Back to the start" pill.
export const GsChatRow = ({ id }) => {
  const name = GS_GAMES[id].name;
  return (
    <DS.CardRow kind="chat" title="In your chat">
      {(GS_CHATS[id] || []).map((x, i) => (
        <figure key={i} className="mcp-chatfig">
          <GsChatPic turns={x.turns} label={name + ' being played in a chat'} />
          <figcaption>{x.cap}</figcaption>
        </figure>
      ))}
    </DS.CardRow>
  );
};

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsChats() {
GS_CHATS = {
  // Guess: the product page's three chats, written for the page from a real play (2026-11-07, No. 34) and the game spec:
  // every turn shows something the game really does, marked as the engine marks. The demo path (SPRAY, GUARD, then the word)
  // is chosen so that the two guesses shown and the share row leave fifteen words open: no chat gives No. 34's word away.
  word: [
    { cap: 'Ask for today’s word and the board opens on your first guess.', turns: [gscU('Play Guess on After Pixels'),
      gscAi('guess', ['Guess No. 34 is ready. You have six guesses and one hint to find the hidden five-letter word.', 'What’s your first guess?'])] },
    { cap: 'Each guess builds on the letters the one before it found.', turns: [gscU('Spray'),
      gscAi('guess', ['R and A are in the word, both in other places.'], [{ type: 'tilegrid', length: 5, count: 1, rows: [{ letters: 'SPRAY', marks: 'xxnnx' }] }]),
      gscU('Guard'),
      gscAi('guess', ['A is in place now.'], [{ type: 'tilegrid', length: 5, count: 2, rows: [{ letters: 'SPRAY', marks: 'xxnnx' }, { letters: 'GUARD', marks: 'xxhnx' }] }])] },
    { cap: 'Your shared result shows how you did and hides every letter.', turns: [gscU('Share my result'),
      gscAi('guess', 'You found it in 3 of 6 guesses, and you didn’t use your hint.', null, [{ type: 'mono', text: 'Guess No. 34 · 3/6\n\n⬛⬛🟨🟨⬛\n⬛⬛🟩🟨⬛\n🟩🟩🟩🟩🟩\nhttps://afterpixels.com/discover/guess' }])] },
  ],
  groups: [
    { cap: 'Sixteen words hide four groups of four.', turns: [gscU('Play Daily Groups on After Pixels'),
      gscAi('daily-groups', 'Find four groups of four. You can make four mistakes.', [{ type: 'wordboard', words: ['BASS', 'PIKE', 'FROST', 'RAIL', 'CARP', 'CHORD', 'MIST', 'GATE', 'SOLE', 'SCALE', 'HAIL', 'POST', 'PERCH', 'NOTE', 'SLEET', 'PANEL'] }])] },
    { cap: 'Each set of four goes to the engine, which checks it and counts your mistakes.', turns: [gscU('Bass, pike, carp, sole'), gscAi('daily-groups', 'One away. 3 mistakes left.'),
      gscU('Pike, carp, sole, perch'), gscAi('daily-groups', 'Three groups to go.', [{ type: 'wordboard', solved: [{ label: 'Fish', words: ['PIKE', 'CARP', 'SOLE', 'PERCH'] }], words: ['BASS', 'FROST', 'RAIL', 'CHORD', 'MIST', 'GATE', 'SCALE', 'HAIL', 'POST', 'NOTE', 'SLEET', 'PANEL'] }])] },
    { cap: 'Afterwards, your AI explains the groups.', turns: [gscU('Rail, gate, post, panel'),
      gscAi('daily-groups', ['All four groups, one mistake.', 'BASS was the trap: a fish, and a note.'], [{ type: 'wordboard', solved: [{ label: 'Fish', words: ['PIKE', 'CARP', 'SOLE', 'PERCH'] }, { label: 'Weather', words: ['FROST', 'MIST', 'HAIL', 'SLEET'] }, { label: 'Music', words: ['BASS', 'CHORD', 'SCALE', 'NOTE'] }, { label: 'Parts of a fence', words: ['RAIL', 'GATE', 'POST', 'PANEL'] }], words: [] }])] },
  ],
  // Accuse: the product page's three chats, written for the page from a real play (2026-11-07) and the game spec. The case is not a real
  // edition: the monorepo case generator's deal for an unused seed (900001), dressed in the circus cast, numbered 112 to clear every real edition.
  // The clues settle Madame Zara, the brass bugle and the big top; the hint is that solver's first step. The share link is a literal: the build's init-order check rejects gsLink here.
  mystery: [
    { cap: 'You can set the clues against each other before you commit to anything.', turns: [gscU('Play Accuse on After Pixels'),
      gscAi('accuse', ['The Marvello Circus has played its last show, and Signor Marvello, the ringmaster, is dead.',
        'Each suspect was in a different place with a different weapon. One of them is the killer.',
        'Every clue is given. You have 2 hints and one accusation.'],
        null, [{ type: 'entities', className: 'is-compact', title: 'Suspects', items: [{ name: 'Coco' }, { name: 'Bella Flint' }, { name: 'Ivan the Mighty' }, { name: 'Madame Zara' }] },
         { type: 'entities', className: 'is-compact', title: 'Weapons', items: [{ name: 'Poisoned toffee apple' }, { name: 'Iron tent peg' }, { name: 'Sleeping draught' }, { name: 'Brass bugle' }] },
         { type: 'entities', className: 'is-compact', title: 'Places', items: [{ name: 'Big top' }, { name: 'Cook tent' }, { name: 'Generator truck' }, { name: 'Costume tent' }] },
         { type: 'clues', fold: 'closed', groups: [{ kind: 'Clues', facts: ['1. Madame Zara handled the brass bugle.', '2. Whoever handled the brass bugle was not in the costume tent.', '3. Coco was in the cook tent.', '4. Ivan the Mighty was in the generator truck.', '5. The killer was in the big top.'] }] }])] },
    { cap: 'When you’re stuck, a hint shows you the next step toward the answer.', turns: [gscU('A hint, please'),
      gscAi('accuse', ['Madame Zara was not in the costume tent.'], null, [{ type: 'clues', groups: [{ kind: 'Hint', facts: [{ text: 'Madame Zara was not in the costume tent.', new: true }] }] }])] },
    { cap: 'You get the verdict on your accusation, and a short ending.', turns: [gscU('Madame Zara, the brass bugle, the big top'),
      gscAi('accuse', null, [{ type: 'confirm', title: 'Confirm your accusation', question: 'Accuse **Madame Zara**, with the **brass bugle**, in the **big top**?', confirm: 'Confirm accusation', cancel: 'Cancel' }]),
      gscU('Confirm accusation'),
      gscAi('accuse', ['Solved: suspect, weapon and place were all right.', 'Madame Zara did it, with the brass bugle, in the big top. She left incense behind.']),
      gscU('Share my result'),
      gscAi('accuse', null, null, [{ type: 'mono', text: 'Accuse No. 112 · solved · 1 hint 💡\nhttps://afterpixels.com/discover/accuse' }])] },
  ],
  // Escape No. 1 as played in the staged record (gs-data.jsx GS_ES1). No answer is ever printed.
  escape: [
    { cap: 'The door locks behind you. Look around.', turns: [gscU('Play Escape on After Pixels'),
      gscAi('escape', ['Escape No. 1, The Clockmaker’s Study. Ezra Vale, the clockmaker, has not been seen for a week. You let yourself into his study to look for him, and the door locks behind you.', 'What do you examine first?'])] },
    { cap: 'Every lock has three hints. A hint never costs a try.', turns: [gscU('Examine the workbench'),
      gscAi('escape', GS_ES1.bench),
      gscU('Give me a hint for the drawer'),
      gscAi('escape', 'Count the gears’ teeth, and read each count as a letter.', [{ type: 'facts', items: [{ label: 'Lock', value: 'The workbench drawer' }, { label: 'Hint', value: '1 of 3' }] }])] },
    { cap: 'Out, with your time against par.', turns: [gscU('I try my answer on the oak door lock'),
      gscAi('escape', 'The lock gives and the oak door swings open. Escaped in 28 min, under par, with 1 hint and 2 wrong tries.', null, [{ type: 'result', title: 'The Clockmaker’s Study', status: 'Escaped', stats: [{ label: 'Time', value: '28 min, under par' }, { label: 'Hints', value: 1 }, { label: 'Wrong tries', value: 2 }], actions: GSC_WIN }])] },
  ],
  casebook: [
    { cap: 'Three guests were still up. Sixteen turns to find out why.', turns: [gscU('Play Casebook on After Pixels'),
      gscAi('casebook', ['The Last Night at Gull Point. The hotel’s owner was found at the foot of the cliff stair at midnight. Three guests were still up.', 'You have sixteen turns. Where do you start?'])] },
    { cap: 'Every statement is kept word for word, so any story can be checked.', turns: GSC_CB_SEARCH },
    { cap: 'The evidence breaks her story.', turns: GSC_CB_LIE },
  ],
  // Delve: the product page's four chats, written for the page from an invented edition (Delve #40, The Orc Caves under Raven Hill) and the game spec: the figures follow one worked run of a Knight, every turn shows something the game really does, and no edition secret appears.
  // Each block is the design system's part for what the game's script has the AI draw: entities, roll, track (health).
  delve: [
    { cap: 'See each hero’s strengths, health and defence side by side before you pick.', turns: [gscU('Play Delve on After Pixels'),
      gscAi('delve', ['Delve #40: The Orc Caves under Raven Hill', 'Orcs from the caves under Raven Hill have burned the watchtower above Brackenford. At dawn they march on the village.', 'Which hero will you take?'],
        null, [{ type: 'entities', title: 'Heroes', items: [{ name: 'Garrick, the Knight', line: 'Best at Strength, Toughness · 23 HP · Defence 10' }, { name: 'Tamsin, the Ranger', line: 'Best at Agility, Charm · 21 HP · Defence 14' }, { name: 'Selwyn, the Wizard', line: 'Best at Wits, Wisdom · 17 HP · Defence 12' }]}])] },
    { cap: 'A slip costs you health. Then try it another way.', turns: [gscU('I cross slowly and test every plank'),
      gscAi('delve', 'The fourth plank snaps under your boot. You swing down hard against the rock and haul yourself back. Deep in the hill, the drums beat faster.', null, [{ type: 'roll', label: 'Agility', roll: 6, mod: 1, target: 12, result: 'miss', outcome: 'Failure · 4 damage' }, { type: 'track', items: [{ label: 'Garrick’s health', value: 19, max: 23, tone: 'health' }] }]),
      gscU('I haul myself along the ropes'),
      gscAi('delve', 'You grip the ropes and haul yourself across, hand over hand, to the far side.', null, [{ type: 'roll', label: 'Strength', roll: 15, mod: 3, target: 12, result: 'hit', outcome: 'Success' }])] },
    { cap: GSC_DV_FIGHT_CAP, turns: GSC_DV_FIGHT },
    { cap: 'Your result is ready to post, with one mark for every roll you made.', turns: [gscU('Sunder, on the orc chief'),
      gscAi('delve', ['The Orc Caves under Raven Hill: Won', 'Skarn, the orc chief, crashes down among his own war drums, and the caves fall silent.', 'You climb out into the grey light of dawn. The drums are silent, and Brackenford wakes safe.'],
        null, [{ type: 'roll', label: 'Sunder', roll: 20, mod: 3, target: 14, result: 'hit', outcome: 'Critical hit · 14 damage' }]),
      gscU('Can I get the share card?'),
      gscAi('delve', 'Here’s your share card:', null, [{ type: 'mono', text: 'The Orc Caves under Raven Hill\nGarrick the Knight · ✅ Brackenford is safe · 17 rolls · longest streak 3\n🟨🟥🟩🟩🟩🟥🟩🟩🟨🟩🟩🟥🟩🟩🟥🟩✨\nhttps://afterpixels.com/discover/delve' }])] },
  ],
  barrow: [
    { cap: 'Choose a hero. The engine sets the world.', turns: [gscU('Play The Barrow of Hollowmere on After Pixels'),
      gscAi('hollowmere', ['Mist lies on the marsh, and the village of Hollowmere has lost its bell to the barrow. Elder Maud is asking for help.', 'Will you go as a fighter, a rogue or a wizard?'])] },
    { cap: 'Every attack is a roll the engine makes, and the dice are the truth.', turns: [gscU('I attack the skeleton with my longsword'),
      gscAi('hollowmere', 'Your blade bites through old bone. The barrow skeleton falls apart on the stone.', [{ type: 'mono', text: 'Attack  d20 14 + 5 = 19 vs 13\nHit, 8 damage' }])] },
    { cap: 'Stop when you like. Your hero carries on to the next chapter.', turns: [gscU('I ring the bell in the chapel tower'),
      gscAi('hollowmere', 'The Bell of Hollowmere is home. The mist draws back from the marsh. Your hero is ready for the next chapter.', [{ type: 'mono', text: 'Quest complete\n+100 XP' }])] },
  ],
  hunter: [
    { cap: 'Grey dawn. The band sets out without waiting.', turns: [gscU('Play 36,000 Summers Ago on After Pixels'),
      gscAi('summers', ['Grey dawn. The fire is ash and the band is already moving. Hunters head for the cliffs; gatherers set out for the plateau.', 'What do you do?'])] },
    { cap: 'The engine rolls the dice and keeps the time.', turns: [gscU('I follow the gatherers up to the plateau'),
      gscAi('summers', 'Ren shows you where wild onions grow under the scree. By midday your bag is heavy.', [{ type: 'roll', label: 'Foraging', roll: 14, mod: 2, target: 12, result: 'hit' }])] },
    { cap: 'At the fire you hear what you missed.', turns: [gscU('I head back to the fire at dusk'),
      gscAi('summers', ['The hunters are back with one ibex and a story: the young ones lost the herd at the river.', 'You weren’t at the river. Next time, you might be.'])] },
  ],
};
// The home hero's chat is the whole Casebook conversation from its product page; the hero scrolls it (gs-home.jsx).
GS_HERO_CHAT = GS_CHATS.casebook.flatMap((c) => c.turns);
}
