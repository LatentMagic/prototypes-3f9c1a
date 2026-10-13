// ============================================================================
// [Platform] — "In your chat": three DS ChatPictures per game, and the home hero's.
// Turns are invented, written to follow each game's seed record (gs-data.jsx).
// ============================================================================
const GS_CHAT_BY = '[Platform]';
const GS_CHAT_MARK = 'assets/logo.svg';
const gscU = (text) => ({ from: 'user', text });
const gscAi = (tool, text, blocks) => ({ from: 'ai', tool, text, blocks });

const GSC_CB_SEARCH = [gscU('Ask Maeve Doyle where she was at ten.'),
  gscAi('casebook', '“In the bar, all evening. Ask anyone.” Maeve doesn’t look up from her glass.'),
  gscU('Search the bar.'),
  gscAi('casebook', 'The last drink on Maeve’s tab was poured at 9.40.', [{ type: 'list', items: ['Found: the bar ledger', 'Turn 4 of 16'] }])];
const GSC_CB_LIE = [gscU('Show Maeve the bar ledger.'),
  gscAi('casebook', '“Fine. I stepped out at quarter to ten. I went to the cliff stair, but he was already gone.”', [{ type: 'list', items: ['Lie exposed: Maeve Doyle', 'Turn 5 of 16'] }])];

const GS_CHATS = {
  word: [
    { cap: 'Say you want to play. Everyone gets the same word today.', turns: [gscU('I want to play Daily Word.'),
      gscAi('daily-word', ['Daily Word No. 212 is ready. You have six tries to find the hidden five-letter word.', 'What’s your first guess?'])] },
    { cap: 'Green: right place. Amber: in the word, wrong place. Grey: not in it.', turns: [gscU('crane'), gscAi('daily-word', 'No letters in the word. 5 guesses left.'), gscU('slate'),
      gscAi('daily-word', 'S is in place. L and T are in the word. 4 guesses left.', [{ type: 'tiles', rows: [{ word: 'CRANE', marks: 'xxxxx' }, { word: 'SLATE', marks: 'gyxyx' }] }])] },
    { cap: 'Ask for a hint and the engine gives one. Two a day.', turns: [gscU('Give me a hint.'),
      gscAi('daily-word', 'The word contains the letter I. One hint left today.')] },
  ],
  groups: [
    { cap: 'Sixteen words hide four groups of four.', turns: [gscU('I want to play Daily Groups.'),
      gscAi('daily-groups', 'Find four groups of four. You can make four mistakes.', [{ type: 'mono', text: 'BASS   PIKE   FROST  RAIL\nCARP   CHORD  MIST   GATE\nSOLE   SCALE  HAIL   POST\nPERCH  NOTE   SLEET  PANEL' }])] },
    { cap: 'Each set of four goes to the engine, which checks it and counts your mistakes.', turns: [gscU('Bass, pike, carp, sole.'), gscAi('daily-groups', 'One away. 3 mistakes left.'),
      gscU('Pike, carp, sole, perch.'), gscAi('daily-groups', 'Three groups to go.', [{ type: 'list', items: ['Found: fish'] }])] },
    { cap: 'Afterwards, your AI explains the groups.', turns: [gscU('Rail, gate, post, panel.'),
      gscAi('daily-groups', ['All four groups, one mistake.', 'BASS was the trap: a fish, and a note.'], [{ type: 'list', items: ['Found: parts of a fence'] }])] },
  ],
  mystery: [
    { cap: 'A body, four suspects and an inspector who answers yes or no.', turns: [gscU('I want to play Daily Mystery.'),
      gscAi('mystery', ['Daily Mystery No. 64. A storm-bound weekend at Hollowmere House. Madame Odette Varga, the medium, is dead.', 'The body was found in the dining room. Read the clues, ask the inspector, then make one accusation.'])] },
    { cap: 'Two questions a day: was a suspect in a room, or did they have a weapon?', turns: [gscU('Was Delphine Rooke in the study?'), gscAi('mystery', 'The inspector says yes. One question left today.'),
      gscU('Did Arthur Penhallow have the paper knife?'), gscAi('mystery', 'Yes. That was your last question.')] },
    { cap: 'One accusation, checked by the engine.', turns: [gscU('It was Sebastian Wyle, with the iron poker, in the dining room.'),
      gscAi('mystery', 'Accuse Sebastian Wyle of the murder, with the iron poker, in the dining room? This is the one accusation today.')] },
  ],
  escape: [
    { cap: 'The door shuts behind you.', turns: [gscU('I want to play Escape.'),
      gscAi('escape', ['This week’s room: The Locked Study. A desk, a rug, a safe and a note pinned to the wall.', 'What do you search first?'])] },
    { cap: 'Each move goes to the engine, which decides what happens and keeps count.', turns: [gscU('Search the desk.'),
      gscAi('escape', 'A small brass key, taped under the drawer.', [{ type: 'list', items: ['Found: brass key', 'Move 1'] }]),
      gscU('Use the key on the door.'), gscAi('escape', 'It turns halfway and stops. Wrong lock. Move 2.')] },
    { cap: 'The way out, in seven moves.', turns: [gscU('Lever the hatch with the crowbar.'),
      gscAi('escape', 'The bolt gives and cold air comes up the ladder. You’re out in 7 moves.')] },
  ],
  casebook: [
    { cap: 'Three guests were still up. Sixteen turns to find out why.', turns: [gscU('I want to play Casebook.'),
      gscAi('casebook', ['The Last Night at Gull Point. The hotel’s owner was found at the foot of the cliff stair at midnight. Three guests were still up.', 'You have sixteen turns. Where do you start?'])] },
    { cap: 'Every statement is kept word for word, so any story can be checked.', turns: GSC_CB_SEARCH },
    { cap: 'The evidence breaks her story.', turns: GSC_CB_LIE },
  ],
  delve: [
    { cap: 'The scene opens. The engine sets up both tracks.', turns: [gscU('I want to play Delve.'),
      gscAi('delve', ['Rain on Gallows Hill. The sinkhole breathes cold air and, somewhere below, drums.', 'How do you go in?'], [{ type: 'mono', text: 'Progress  0 of 6\nThreat    0 of 6' }])] },
    { cap: 'A weak hit: progress, with a cost the engine applies.', turns: [gscU('I creep past the guard post.'),
      gscAi('delve', 'You slip by, but your lantern catches a goblin’s eye. Threat rises to 3.', [{ type: 'mono', text: 'Stealth  d20 11 + 3 = 14 vs 15\nWeak hit' }])] },
    { cap: 'The ending, with a link back to your full session.', turns: [gscU('I carry her across the bone bridge and run.'),
      gscAi('delve', ['You reach daylight as the drums stop. Rescued, with the threat clock at 5 of 6.', 'Every roll is on your session page.'], [{ type: 'mono', text: 'Athletics  d20 13 + 2 = 15 vs 15\nHit' }])] },
  ],
  barrow: [
    { cap: 'Chapter 1 opens at the broken seal.', turns: [gscU('I want to play The Barrow of Hollowmere.'),
      gscAi('barrow', ['The seal on the barrow lies in three pieces. Hoof prints lead inside and none come out.', 'Two doors: the stone one ahead, or the root-choked one to your left. Which do you take?'], [{ type: 'mono', text: 'Level  1 of 5\nPack   torch, rope, 4 silver' }])] },
    { cap: 'The engine rolls; your AI tells what happens.', turns: [gscU('I squeeze through the roots.'),
      gscAi('barrow', 'The roots give way to a low hall. Something glints under the dust.', [{ type: 'mono', text: 'Search  d20 15 + 2 = 17 vs 13\nHit · Bronze ring added to your pack' }])] },
    { cap: 'What you carry out goes with you.', turns: [gscU('I climb back to daylight.'),
      gscAi('barrow', ['You reach the hillside at dusk with five levels behind you.', 'Your pack and your wounds carry into chapter 2.'])] },
  ],
  hunter: [
    { cap: 'Grey dawn. The band sets out without waiting.', turns: [gscU('I want to play 36,000 Summers Ago.'),
      gscAi('summers', ['Grey dawn. The fire is ash and the band is already moving. Hunters head for the cliffs; gatherers set out for the plateau.', 'What do you do?'])] },
    { cap: 'The engine rolls the dice and keeps the time.', turns: [gscU('I follow the gatherers up to the plateau.'),
      gscAi('summers', 'Ren shows you where wild onions grow under the scree. By midday your bag is heavy.', [{ type: 'mono', text: 'Foraging  d20 14 + 2 = 16 vs 12\nHit' }])] },
    { cap: 'At the fire you hear what you missed.', turns: [gscU('I head back to the fire at dusk.'),
      gscAi('summers', ['The hunters are back with one ibex and a story: the young ones lost the herd at the river.', 'You weren’t at the river. Next time, you might be.'])] },
  ],
};
// The home hero's chat is the whole Casebook conversation from its product page; the hero scrolls it (gs-home.jsx).
const GS_HERO_CHAT = GS_CHATS.casebook.flatMap((c) => c.turns);

const GsChatPic = ({ turns, height, width, label }) => (
  <DS.ChatPicture turns={turns} mark={GS_CHAT_MARK} toolBy={GS_CHAT_BY} height={height} width={width} label={label} />
);
// The product page's row: the design system's CardRow kind="chat". It shares the width when the pictures fit and scrolls sideways
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
