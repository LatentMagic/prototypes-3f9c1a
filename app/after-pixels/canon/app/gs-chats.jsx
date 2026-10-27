// ============================================================================
// After Pixels — "In your chat": three DS ChatPictures per game, and the home hero's.
// Sample turns, written to follow each game's seed record (gs-data.jsx), except Delve's, which are deployed.
// ============================================================================
const GS_CHAT_BY = 'After Pixels';
const GS_CHAT_MARK = 'assets/logo.svg';
const gscU = (text) => ({ from: 'user', text });
const gscAi = (tool, text, blocks, after) => ({ from: 'ai', tool, text, blocks, after });
const GSC_WIN = [{ label: 'Share result', icon: 'share' }, { label: 'Back to the games', icon: 'list' }];

const GSC_CB_SEARCH = [gscU('Ask Maeve Doyle where she was at ten.'),
  gscAi('casebook', '“In the bar, all evening. Ask anyone.” Maeve doesn’t look up from her glass.'),
  gscU('Search the bar.'),
  gscAi('casebook', 'The last drink on Maeve’s tab was poured at 9.40.', [{ type: 'clues', groups: [{ kind: 'Evidence', facts: [{ text: 'The bar ledger', new: true }] }] }, { type: 'stats', items: [{ label: 'Turn', value: '4 of 16' }] }])];
const GSC_CB_LIE = [gscU('Show Maeve the bar ledger.'),
  gscAi('casebook', '“Fine. I stepped out at quarter to ten. I went to the cliff stair, but he was already gone.”', [{ type: 'clues', groups: [{ kind: 'Evidence', facts: ['The bar ledger'] }, { kind: 'Statements', facts: [{ text: 'Maeve Doyle: lie exposed', new: true }] }] }, { type: 'stats', items: [{ label: 'Turn', value: '5 of 16' }] }])];

const GS_CHATS = {
  word: [
    { cap: 'Say you want to play. Everyone gets the same word today.', turns: [gscU('I want to play Daily Word.'),
      gscAi('daily-word', ['Daily Word No. 212 is ready. You have six tries to find the hidden five-letter word.', 'What’s your first guess?'])] },
    { cap: 'Green: right place. Amber: in the word, wrong place. Grey: not in it.', turns: [gscU('crane'), gscAi('daily-word', 'No letters in the word. 5 guesses left.'), gscU('slate'),
      gscAi('daily-word', 'S is in place. L and T are in the word. 4 guesses left.', [{ type: 'tilegrid', length: 5, count: 6, rows: [{ letters: 'CRANE', marks: 'xxxxx' }, { letters: 'SLATE', marks: 'hnxnx' }] }])] },
    { cap: 'Ask for a hint and the engine gives one. Two a day.', turns: [gscU('Give me a hint.'),
      gscAi('daily-word', 'The word contains the letter I. One hint left today.')] },
  ],
  groups: [
    { cap: 'Sixteen words hide four groups of four.', turns: [gscU('I want to play Daily Groups.'),
      gscAi('daily-groups', 'Find four groups of four. You can make four mistakes.', [{ type: 'wordboard', words: ['BASS', 'PIKE', 'FROST', 'RAIL', 'CARP', 'CHORD', 'MIST', 'GATE', 'SOLE', 'SCALE', 'HAIL', 'POST', 'PERCH', 'NOTE', 'SLEET', 'PANEL'] }])] },
    { cap: 'Each set of four goes to the engine, which checks it and counts your mistakes.', turns: [gscU('Bass, pike, carp, sole.'), gscAi('daily-groups', 'One away. 3 mistakes left.'),
      gscU('Pike, carp, sole, perch.'), gscAi('daily-groups', 'Three groups to go.', [{ type: 'wordboard', solved: [{ label: 'Fish', words: ['PIKE', 'CARP', 'SOLE', 'PERCH'] }], words: ['BASS', 'FROST', 'RAIL', 'CHORD', 'MIST', 'GATE', 'SCALE', 'HAIL', 'POST', 'NOTE', 'SLEET', 'PANEL'] }])] },
    { cap: 'Afterwards, your AI explains the groups.', turns: [gscU('Rail, gate, post, panel.'),
      gscAi('daily-groups', ['All four groups, one mistake.', 'BASS was the trap: a fish, and a note.'], [{ type: 'wordboard', solved: [{ label: 'Fish', words: ['PIKE', 'CARP', 'SOLE', 'PERCH'] }, { label: 'Weather', words: ['FROST', 'MIST', 'HAIL', 'SLEET'] }, { label: 'Music', words: ['BASS', 'CHORD', 'SCALE', 'NOTE'] }, { label: 'Parts of a fence', words: ['RAIL', 'GATE', 'POST', 'PANEL'] }], words: [] }])] },
  ],
  mystery: [
    { cap: 'A body, four suspects and an inspector who answers yes or no.', turns: [gscU('I want to play Daily Mystery.'),
      gscAi('mystery', ['Daily Mystery No. 64. A storm-bound weekend at Hollowmere House. Madame Odette Varga, the medium, is dead.', 'The body was found in the dining room. Read the clues, ask the inspector, then make one accusation.'])] },
    { cap: 'Two questions a day: was a suspect in a room, or did they have a weapon?', turns: [gscU('Was Delphine Rooke in the study?'), gscAi('mystery', 'The inspector says yes. One question left today.'),
      gscU('Did Arthur Penhallow have the paper knife?'), gscAi('mystery', 'Yes. That was your last question.')] },
    { cap: 'One accusation, checked by the engine.', turns: [gscU('It was Sebastian Wyle, with the iron poker, in the dining room.'),
      gscAi('mystery', null, [{ type: 'confirm', title: 'Confirm your accusation', question: 'Accuse **Sebastian Wyle** of the murder, with the **iron poker**, in the **dining room**?', facts: [{ label: 'Suspect', value: 'Sebastian Wyle' }, { label: 'Weapon', value: 'Iron poker' }, { label: 'Room', value: 'Dining room' }], note: 'This is the one accusation today.', confirm: 'Confirm accusation', cancel: 'Cancel' }])] },
  ],
  // Escape No. 1 as played in the staged record (gs-data.jsx GS_ES1). No answer is ever printed.
  escape: [
    { cap: 'The door locks behind you. Look around.', turns: [gscU('I want to play Escape.'),
      gscAi('escape', ['Escape No. 1, The Clockmaker’s Study. Ezra Vale, the clockmaker, has not been seen for a week. You let yourself into his study to look for him, and the door locks behind you.', 'What do you examine first?'])] },
    { cap: 'Every lock has three hints. A hint never costs a try.', turns: [gscU('Examine the workbench.'),
      gscAi('escape', GS_ES1.bench),
      gscU('Give me a hint for the drawer.'),
      gscAi('escape', 'Count the gears’ teeth, and read each count as a letter.', [{ type: 'facts', items: [{ label: 'Lock', value: 'The workbench drawer' }, { label: 'Hint', value: '1 of 3' }] }])] },
    { cap: 'Out, with your time against par.', turns: [gscU('I try my answer on the oak door lock.'),
      gscAi('escape', 'The lock gives and the oak door swings open. Escaped in 28 min, under par, with 1 hint and 2 wrong tries.', null, [{ type: 'result', title: 'The Clockmaker’s Study', status: 'Escaped', stats: [{ label: 'Time', value: '28 min, under par' }, { label: 'Hints', value: 1 }, { label: 'Wrong tries', value: 2 }], actions: GSC_WIN }])] },
  ],
  casebook: [
    { cap: 'Three guests were still up. Sixteen turns to find out why.', turns: [gscU('I want to play Casebook.'),
      gscAi('casebook', ['The Last Night at Gull Point. The hotel’s owner was found at the foot of the cliff stair at midnight. Three guests were still up.', 'You have sixteen turns. Where do you start?'])] },
    { cap: 'Every statement is kept word for word, so any story can be checked.', turns: GSC_CB_SEARCH },
    { cap: 'The evidence breaks her story.', turns: GSC_CB_LIE },
  ],
  // Delve: the deployed product page's chats. Each block is the design system's mono block, one line per row.
  delve: [
    { cap: 'The run opens: the first room, its ways on, and the numbers.', turns: [gscU('Delve, as Bryn the Fighter.'),
      gscAi('delve', 'Knee-deep water, a chant far off. Crawl upstream, or search the niche first?', [{ type: 'mono', text: 'The flooded tunnel\nWays on    Upstream crawl\nThe ritual 0/12 (low)\nBryn       13/13 hit points' }])] },
    { cap: 'A weak hit: the sentries give ground, at a cost the game draws.', turns: [gscU('I charge the sentries, sword first.'),
      gscAi('delve', 'One sentry tumbles, but his friend squeals for help. The ritual is at 2 of 12.', [{ type: 'mono', text: 'd20 10+3 = 13 vs DC 12\nWeak hit\nGoblin sentries: 4 → 3\nCost: an alarm · ritual +1' }])] },
    { cap: 'The ending, with a link back to your full session.', turns: [gscU('I hurl the lamp oil into his brazier.'),
      gscAi('delve', 'Grizzletooth flees, and you lead Elsie out into the moonlight. Every roll is on your session page.', [{ type: 'mono', text: 'Grizzletooth: defeated\nBryn the Fighter\n✅ Elsie rescued · 13 rolls' }])] },
  ],
  barrow: [
    { cap: 'Choose a hero. The engine sets the world.', turns: [gscU('I want to play The Barrow of Hollowmere.'),
      gscAi('hollowmere', ['Mist lies on the marsh, and the village of Hollowmere has lost its bell to the barrow. Elder Maud is asking for help.', 'Will you go as a fighter, a rogue or a wizard?'])] },
    { cap: 'Every attack is a roll the engine makes, and the dice are the truth.', turns: [gscU('I attack the skeleton with my longsword.'),
      gscAi('hollowmere', 'Your blade bites through old bone. The barrow skeleton falls apart on the stone.', [{ type: 'mono', text: 'Attack  d20 14 + 5 = 19 vs 13\nHit, 8 damage' }])] },
    { cap: 'Stop when you like. Your hero carries on to the next chapter.', turns: [gscU('I ring the bell in the chapel tower.'),
      gscAi('hollowmere', 'The Bell of Hollowmere is home. The mist draws back from the marsh. Your hero is ready for the next chapter.', [{ type: 'mono', text: 'Quest complete\n+100 XP' }])] },
  ],
  hunter: [
    { cap: 'Grey dawn. The band sets out without waiting.', turns: [gscU('I want to play 36,000 Summers Ago.'),
      gscAi('summers', ['Grey dawn. The fire is ash and the band is already moving. Hunters head for the cliffs; gatherers set out for the plateau.', 'What do you do?'])] },
    { cap: 'The engine rolls the dice and keeps the time.', turns: [gscU('I follow the gatherers up to the plateau.'),
      gscAi('summers', 'Ren shows you where wild onions grow under the scree. By midday your bag is heavy.', [{ type: 'roll', label: 'Foraging', roll: 14, mod: 2, target: 12, result: 'hit' }])] },
    { cap: 'At the fire you hear what you missed.', turns: [gscU('I head back to the fire at dusk.'),
      gscAi('summers', ['The hunters are back with one ibex and a story: the young ones lost the herd at the river.', 'You weren’t at the river. Next time, you might be.'])] },
  ],
};
// The home hero's chat is the whole Casebook conversation from its product page; the hero scrolls it (gs-home.jsx).
const GS_HERO_CHAT = GS_CHATS.casebook.flatMap((c) => c.turns);

const GsChatPic = ({ turns, height, width, label }) => (
  <DS.ChatPicture turns={turns} mark={GS_CHAT_MARK} toolBy={GS_CHAT_BY} height={height} width={width} label={label} />
);
// KEEP: the product page's chat row (the design system's CardRow kind="chat") shares the width when the pictures fit and scrolls sideways
// with Previous and Next when they don't. Each ChatPicture scrolls itself, opens on its latest turn and has its own "Back to the start" pill.
const GsChatRow = ({ id }) => {
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

Object.assign(window, { GS_CHATS, GS_HERO_CHAT, GsChatPic, GsChatRow });
