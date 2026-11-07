// ============================================================================
// After Pixels — "In your chat": the DS ChatPictures per game (three, and four for Delve), and the home hero's.
// Sample turns, written to follow each game's seed record (gs-data.jsx), except Delve's, trimmed from a real play, and Guess's, written from one.
// ============================================================================
import React from 'react';
import { GS_ES1, DS, GS_GAMES } from './gs-data.jsx';

export const GS_CHAT_BY = 'After Pixels';
export const GS_CHAT_MARK = 'assets/logo.svg';
export const gscU = (text) => ({ from: 'user', text });
export const gscAi = (tool, text, blocks, after) => ({ from: 'ai', tool, text, blocks, after });
const GSC_WIN = [{ label: 'Share result', icon: 'share' }, { label: 'Back to the games', icon: 'list' }];

const GSC_CB_SEARCH = [gscU('Ask Maeve Doyle where she was at ten.'),
  gscAi('casebook', '“In the bar, all evening. Ask anyone.” Maeve doesn’t look up from her glass.'),
  gscU('Search the bar.'),
  gscAi('casebook', 'The last drink on Maeve’s tab was poured at 9.40.', [{ type: 'clues', groups: [{ kind: 'Evidence', facts: [{ text: 'The bar ledger', new: true }] }] }, { type: 'stats', items: [{ label: 'Turn', value: '4 of 16' }] }])];
const GSC_CB_LIE = [gscU('Show Maeve the bar ledger.'),
  gscAi('casebook', '“Fine. I stepped out at quarter to ten. I went to the cliff stair, but he was already gone.”', [{ type: 'clues', groups: [{ kind: 'Evidence', facts: ['The bar ledger'] }, { kind: 'Statements', facts: [{ text: 'Maeve Doyle: lie exposed', new: true }] }] }, { type: 'stats', items: [{ label: 'Turn', value: '5 of 16' }] }])];

// Delve's fight chat, trimmed from the same playtest (turns 10 and 11); no event is changed and no edition secret appears. Shared with the page-copy playground.
export const GSC_DV_FIGHT_CAP = 'Try a bold move or a quick blow, and a lucky 20 lays the second guard flat.';
export const GSC_DV_FIGHT = [gscU('I’ll try a somersault over the first guard and hit him'),
  gscAi('delve', 'You vault over the first guard’s spear and kick him from behind. He goes down in a clatter of bronze. The second guard swings his spear at you, but you’re no longer where you were, and the point scrapes stone.', null, [{ type: 'mono', text: 'Somersault: d20 16 +3 Agility = 19 against DC 13\nHit · one guard falls\nGuard’s counter: d20 11 against defence 14\nMiss · no damage' }]),
  gscU('now a plain quick hit on the other guard'),
  gscAi('delve', 'You dart in and land a quick blow, and the stars come out of that helmet. A natural 20 lands twice as hard, and the second guard goes down groaning beside the first.', null, [{ type: 'mono', text: 'd20 20 +3 Agility = 23 against DC 12\nCritical hit · the guards are defeated' }])];

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
    { cap: 'Ask for today’s word and the board opens on your first guess.', turns: [gscU('Play Guess on After Pixels.'),
      gscAi('guess', ['Guess No. 34 is ready. You have six guesses and one hint to find the hidden five-letter word.', 'What’s your first guess?'])] },
    { cap: 'Each guess builds on the letters the one before it found.', turns: [gscU('Spray.'),
      gscAi('guess', ['R and A are in the word, both in other places. S, P and Y aren’t in it.', 'You have 5 guesses left.'], [{ type: 'tilegrid', length: 5, count: 1, rows: [{ letters: 'SPRAY', marks: 'xxnnx' }] }]),
      gscU('Guard.'),
      gscAi('guess', ['A is in place now. R is in the word, but not where you put it. G, U and D aren’t in it.', 'You have 4 guesses left.'], [{ type: 'tilegrid', length: 5, count: 2, rows: [{ letters: 'SPRAY', marks: 'xxnnx' }, { letters: 'GUARD', marks: 'xxhnx' }] }])] },
    { cap: 'Your shared result shows how you did and hides every letter.', turns: [gscU('Share my result.'),
      gscAi('guess', 'You found it in 3 of 6 guesses, and you didn’t use your hint.', null, [{ type: 'mono', text: 'Guess No. 34 · 3/6\n\n⬛⬛🟨🟨⬛\n⬛⬛🟩🟨⬛\n🟩🟩🟩🟩🟩\nhttps://afterpixels.com/discover/guess' }])] },
  ],
  groups: [
    { cap: 'Sixteen words hide four groups of four.', turns: [gscU('Play Daily Groups on After Pixels.'),
      gscAi('daily-groups', 'Find four groups of four. You can make four mistakes.', [{ type: 'wordboard', words: ['BASS', 'PIKE', 'FROST', 'RAIL', 'CARP', 'CHORD', 'MIST', 'GATE', 'SOLE', 'SCALE', 'HAIL', 'POST', 'PERCH', 'NOTE', 'SLEET', 'PANEL'] }])] },
    { cap: 'Each set of four goes to the engine, which checks it and counts your mistakes.', turns: [gscU('Bass, pike, carp, sole.'), gscAi('daily-groups', 'One away. 3 mistakes left.'),
      gscU('Pike, carp, sole, perch.'), gscAi('daily-groups', 'Three groups to go.', [{ type: 'wordboard', solved: [{ label: 'Fish', words: ['PIKE', 'CARP', 'SOLE', 'PERCH'] }], words: ['BASS', 'FROST', 'RAIL', 'CHORD', 'MIST', 'GATE', 'SCALE', 'HAIL', 'POST', 'NOTE', 'SLEET', 'PANEL'] }])] },
    { cap: 'Afterwards, your AI explains the groups.', turns: [gscU('Rail, gate, post, panel.'),
      gscAi('daily-groups', ['All four groups, one mistake.', 'BASS was the trap: a fish, and a note.'], [{ type: 'wordboard', solved: [{ label: 'Fish', words: ['PIKE', 'CARP', 'SOLE', 'PERCH'] }, { label: 'Weather', words: ['FROST', 'MIST', 'HAIL', 'SLEET'] }, { label: 'Music', words: ['BASS', 'CHORD', 'SCALE', 'NOTE'] }, { label: 'Parts of a fence', words: ['RAIL', 'GATE', 'POST', 'PANEL'] }], words: [] }])] },
  ],
  // Accuse as the logic case, with the approved chat change (not yet deployed): the case once, then only what changes; no notebook in chat.
  mystery: [
    { cap: 'The case once: suspects, weapons, places and every clue.', turns: [gscU('I want to play Accuse.'),
      gscAi('accuse', ['Accuse No. 64. A storm-bound weekend at Hollowmere House. Sir Edmund Hale, the host, is dead.',
        'Each suspect was in a different place with a different weapon. One of them is the killer.',
        'Suspects: Nora Finch, the housekeeper. Sebastian Wyle, the nephew. Colonel Ashby, the old soldier. Mrs Dorothy Vane, the neighbour.',
        'Weapons: the candlestick, the iron poker, the curtain cord, the letter opener.',
        'Places: the library, the conservatory, the wine cellar, the music room.',
        'Clues:', '1. Nora Finch carried the letter opener.', '2. Whoever was in the wine cellar carried the curtain cord.', '3. Colonel Ashby was not in the wine cellar.', '4. The killer was in the wine cellar.', '5. Mrs Dorothy Vane never carried the curtain cord.',
        'Every clue is given. Work out from them who did it, with what, and where.',
        'You have 2 hints and one accusation.'])] },
    { cap: 'Your AI never solves the case for you. When you’re stuck, take a hint.', turns: [gscU('Who had the curtain cord? Just tell me.'),
      gscAi('accuse', 'That’s yours to work out, but a hint can help. You have 2 hints left. Shall I take one?'),
      gscU('Yes, give me a hint.'),
      gscAi('accuse', ['Colonel Ashby never carried the curtain cord.', 'Hints left: 1'])] },
    { cap: 'One accusation, checked part by part.', turns: [gscU('It was Sebastian Wyle, with the curtain cord, in the wine cellar.'),
      gscAi('accuse', null, [{ type: 'confirm', title: 'Confirm your accusation', question: 'Accuse **Sebastian Wyle**, with the **curtain cord**, in the **wine cellar**?', facts: [{ label: 'Suspect', value: 'Sebastian Wyle' }, { label: 'Weapon', value: 'Curtain cord' }, { label: 'Place', value: 'Wine cellar' }], note: 'This is the one accusation in this case.', confirm: 'Confirm accusation', cancel: 'Cancel' }])] },
  ],
  // Escape No. 1 as played in the staged record (gs-data.jsx GS_ES1). No answer is ever printed.
  escape: [
    { cap: 'The door locks behind you. Look around.', turns: [gscU('Play Escape on After Pixels.'),
      gscAi('escape', ['Escape No. 1, The Clockmaker’s Study. Ezra Vale, the clockmaker, has not been seen for a week. You let yourself into his study to look for him, and the door locks behind you.', 'What do you examine first?'])] },
    { cap: 'Every lock has three hints. A hint never costs a try.', turns: [gscU('Examine the workbench.'),
      gscAi('escape', GS_ES1.bench),
      gscU('Give me a hint for the drawer.'),
      gscAi('escape', 'Count the gears’ teeth, and read each count as a letter.', [{ type: 'facts', items: [{ label: 'Lock', value: 'The workbench drawer' }, { label: 'Hint', value: '1 of 3' }] }])] },
    { cap: 'Out, with your time against par.', turns: [gscU('I try my answer on the oak door lock.'),
      gscAi('escape', 'The lock gives and the oak door swings open. Escaped in 28 min, under par, with 1 hint and 2 wrong tries.', null, [{ type: 'result', title: 'The Clockmaker’s Study', status: 'Escaped', stats: [{ label: 'Time', value: '28 min, under par' }, { label: 'Hints', value: 1 }, { label: 'Wrong tries', value: 2 }], actions: GSC_WIN }])] },
  ],
  casebook: [
    { cap: 'Three guests were still up. Sixteen turns to find out why.', turns: [gscU('Play Casebook on After Pixels.'),
      gscAi('casebook', ['The Last Night at Gull Point. The hotel’s owner was found at the foot of the cliff stair at midnight. Three guests were still up.', 'You have sixteen turns. Where do you start?'])] },
    { cap: 'Every statement is kept word for word, so any story can be checked.', turns: GSC_CB_SEARCH },
    { cap: 'The evidence breaks her story.', turns: GSC_CB_LIE },
  ],
  // Delve: the product page's four chats, trimmed from a real playtest (2026-11-06); no event is changed and no edition secret appears.
  // Each block is the design system's mono block, one line per row.
  delve: [
    { cap: 'See each hero’s strengths, health and defence side by side before you pick.', turns: [gscU('hey, I want to play Delve'),
      gscAi('delve', ['Delve #5: The Labyrinth of Crete', 'Every year King Minos of Crete makes Athens send young people to him as tributes, a sort of payment. They are fed to the Minotaur, a monster half man and half bull, kept in a maze called the Labyrinth. This year you are one of them.', 'Choose your hero:'],
        null, [{ type: 'mono', text: 'Leon, the Wrestler\nBest at Strength, Toughness · 23 HP · Defence 10\nIone, the Bull-leaper\nBest at Agility, Charm · 21 HP · Defence 14\nMira, the Temple scholar\nBest at Wits, Wisdom · 17 HP · Defence 12' }]),
      gscU('I’ll go with Ione'),
      gscAi('delve', 'You are Ione, a bull-leaper. You trained to somersault over charging bulls, so you are quick and light, and very hard to hit.')] },
    { cap: 'A miss costs you. Spend your inspiration to try again: two dice, and the better one counts.', turns: [gscU('I watch the walls for a bit, then dart through the gap that stays open longest'),
      gscAi('delve', 'You watch the stone slide and pick your gap. You dart for it, but it’s the wrong one. A wall swings shut and catches you across the ribs.', null, [{ type: 'mono', text: 'd20 7 +3 Agility = 10 against DC 12\nFailure · 4 damage' }]),
      gscU('ok try again, I’ll use my inspiration this time and vault through when the carved wall lines up'),
      gscAi('delve', 'The stone shudders and then stops, with a straight path laid down the hall.', null, [{ type: 'mono', text: 'd20s 1 and 15, kept 15 +3 Agility = 18 against DC 12\nSuccess · inspiration spent' }])] },
    { cap: GSC_DV_FIGHT_CAP, turns: GSC_DV_FIGHT },
    { cap: 'The run ends with its result, and a row of your rolls to post: green landed, red missed, a spark for a 20.', turns: [gscU('go for the somersault to finish it'),
      gscAi('delve', ['The Minotaur goes down, and this time it does not get up. The den goes quiet at last.', 'You won Delve #5. The next run opens next week.']),
      gscU('nice, share my result'),
      gscAi('delve', 'Here’s your result, ready to copy:', null, [{ type: 'mono', text: 'The Labyrinth of Crete\nIone the Bull-leaper · ✅ the Minotaur beaten · 15 rolls · longest streak 2\n🟥🟥🟩🟩🟩✨🟥🟥🟥🟩🟩🟥🟥🟩🟩' }])] },
  ],
  barrow: [
    { cap: 'Choose a hero. The engine sets the world.', turns: [gscU('Play The Barrow of Hollowmere on After Pixels.'),
      gscAi('hollowmere', ['Mist lies on the marsh, and the village of Hollowmere has lost its bell to the barrow. Elder Maud is asking for help.', 'Will you go as a fighter, a rogue or a wizard?'])] },
    { cap: 'Every attack is a roll the engine makes, and the dice are the truth.', turns: [gscU('I attack the skeleton with my longsword.'),
      gscAi('hollowmere', 'Your blade bites through old bone. The barrow skeleton falls apart on the stone.', [{ type: 'mono', text: 'Attack  d20 14 + 5 = 19 vs 13\nHit, 8 damage' }])] },
    { cap: 'Stop when you like. Your hero carries on to the next chapter.', turns: [gscU('I ring the bell in the chapel tower.'),
      gscAi('hollowmere', 'The Bell of Hollowmere is home. The mist draws back from the marsh. Your hero is ready for the next chapter.', [{ type: 'mono', text: 'Quest complete\n+100 XP' }])] },
  ],
  hunter: [
    { cap: 'Grey dawn. The band sets out without waiting.', turns: [gscU('Play 36,000 Summers Ago on After Pixels.'),
      gscAi('summers', ['Grey dawn. The fire is ash and the band is already moving. Hunters head for the cliffs; gatherers set out for the plateau.', 'What do you do?'])] },
    { cap: 'The engine rolls the dice and keeps the time.', turns: [gscU('I follow the gatherers up to the plateau.'),
      gscAi('summers', 'Ren shows you where wild onions grow under the scree. By midday your bag is heavy.', [{ type: 'roll', label: 'Foraging', roll: 14, mod: 2, target: 12, result: 'hit' }])] },
    { cap: 'At the fire you hear what you missed.', turns: [gscU('I head back to the fire at dusk.'),
      gscAi('summers', ['The hunters are back with one ibex and a story: the young ones lost the herd at the river.', 'You weren’t at the river. Next time, you might be.'])] },
  ],
};
// The home hero's chat is the whole Casebook conversation from its product page; the hero scrolls it (gs-home.jsx).
GS_HERO_CHAT = GS_CHATS.casebook.flatMap((c) => c.turns);
}
