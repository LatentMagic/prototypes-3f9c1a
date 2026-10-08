// ============================================================================
// [Platform] — demo content and the app context. All content is demo content.
// DS is the bound design system's namespace (loaded by _ds_bundle.js).
// ============================================================================
const DS = window.MCPGameStoreDesignSystem_ef1abd;
const GsCtx = React.createContext(null);
const useGs = () => React.useContext(GsCtx);

const GS = {
  today: 'Tuesday 6 October',
  link: 'https://platform.example/mcp',
  email: 'you@example.com',
  purchase: 'Purchases only ever happen on this site; your AI will never ask you to pay.',
  works: 'ChatGPT · Claude · OpenClaw · Hermes · any assistant that supports MCP connectors',
};

// Covers: a few flat basic shapes in the cover colours on a cover background.
const GS_SVG = (body) => '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">' + body + '</svg>';
const GS_ART = {
  daily: '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#1D1B3A"/><rect x="14" y="14" width="22" height="22" fill="#E5A63B"/><rect x="39" y="14" width="22" height="22" fill="#328A88"/><rect x="64" y="14" width="22" height="22" fill="#E5A63B"/><rect x="14" y="39" width="22" height="22" fill="#328A88"/><rect x="39" y="39" width="22" height="22" fill="#D66847"/><rect x="64" y="39" width="22" height="22" fill="#328A88"/><rect x="14" y="64" width="22" height="22" fill="#E5A63B"/><rect x="39" y="64" width="22" height="22" fill="#328A88"/><rect x="64" y="64" width="22" height="22" fill="#E5A63B"/></svg>',
  delve: GS_SVG('<rect width="160" height="120" fill="#421A28"/><rect x="50" y="40" width="60" height="80" fill="#A390B2"/><circle cx="80" cy="40" r="30" fill="#A390B2"/><rect x="64" y="52" width="32" height="68" fill="#1D1B3A"/><circle cx="80" cy="52" r="16" fill="#1D1B3A"/><rect x="64" y="88" width="32" height="8" fill="#E5A63B"/><rect x="68" y="100" width="24" height="8" fill="#E5A63B"/><rect x="72" y="112" width="16" height="8" fill="#E5A63B"/><rect x="22" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="25" cy="54" r="8" fill="#D66847"/><rect x="132" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="135" cy="54" r="8" fill="#D66847"/>'),
  escape: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="60" y="26" width="44" height="94" fill="#328A88"/><circle cx="94" cy="76" r="5" fill="#E5A63B"/><rect x="22" y="22" width="16" height="16" fill="#F2EBE0"/>'),
  murder: GS_SVG('<rect width="160" height="120" fill="#421A28"/><circle cx="72" cy="60" r="30" fill="none" stroke="#D66847" stroke-width="12"/><rect x="114" y="24" width="10" height="72" fill="#F2EBE0"/><rect x="114" y="24" width="10" height="20" fill="#E5A63B"/>'),
  word: GS_SVG('<rect width="160" height="120" fill="#163328"/><rect x="24" y="44" width="32" height="32" fill="#E5A63B"/><rect x="64" y="44" width="32" height="32" fill="#F2EBE0"/><rect x="106" y="46" width="28" height="28" fill="none" stroke="#328A88" stroke-width="4"/>'),
  derelict: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="100" cy="56" r="32" fill="none" stroke="#A390B2" stroke-width="10"/><rect x="28" y="74" width="20" height="20" fill="#D66847"/><circle cx="40" cy="30" r="4" fill="#F2EBE0"/>'),
  barrow: GS_SVG('<rect width="160" height="120" fill="#421A28"/><path d="M12 120L52 52L92 120Z" fill="#E5A63B"/><path d="M68 120L108 64L148 120Z" fill="#F2EBE0"/><rect x="100" y="20" width="16" height="16" fill="#328A88"/>'),
  casebook: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="30" y="40" width="18" height="80" fill="#F2EBE0"/><rect x="62" y="28" width="18" height="92" fill="#A390B2"/><rect x="94" y="46" width="18" height="74" fill="#D66847"/><circle cx="128" cy="26" r="12" fill="#E5A63B"/>'),
  hunter: GS_SVG('<rect width="160" height="120" fill="#163328"/><circle cx="52" cy="74" r="26" fill="#E5A63B"/><path d="M40 120L100 50L160 120Z" fill="#A390B2"/><rect x="18" y="104" width="14" height="14" fill="#328A88"/><rect x="128" y="20" width="10" height="10" fill="#F2EBE0"/>'),
};

// Working names: one constant each, so a name changes in one place.
const GS_NAME = { casebook: 'Casebook', hunter: '36,000 Summers Ago' };

// 'FREE' and 'PASS' render as the system's Free and Locked ("Pass") tags.
const GS_GAMES = {
  daily: { name: 'Daily Puzzles', art: 'daily', route: 'puzzles', blurb: 'Three small puzzles, new every day.', tags: ['FREE', '10 min', 'Solo'] },
  delve: { name: 'Delve', art: 'delve', route: 'delve', blurb: 'Get her out before the drums stop.', tags: ['PASS', '25–40 min', 'Solo', '12+'] },
  casebook: { name: GS_NAME.casebook, art: 'casebook', route: 'casebook', blurb: 'Ask the question they haven’t prepared for.', tags: ['PASS', 'Weekly'] },
  hunter: { name: GS_NAME.hunter, art: 'hunter', route: 'hunter', blurb: 'Grey dawn below Chauvet cave. Go where you like.', tags: ['PASS'] },
};
const GS_GAME_ORDER = ['daily', 'casebook', 'delve', 'hunter'];
// The small mark on a card. Pass: today's and this week's; free, signed in: today's only.
const gsMarks = (view) => (view === 'pass' ? { daily: 'Played today', casebook: 'Played this week', delve: 'Played this week' }
  : view === 'free' ? { daily: 'Played today' } : {});
const GS_SOON = [
  { name: 'Derelict', art: 'derelict', line: 'The same game, in science fiction · 15+' },
  { name: 'The Barrow of Hollowmere', art: 'barrow', line: 'A short campaign with levels and loot · 12+' },
];

const GS_PUZZLE_ORDER = ['escape', 'murder', 'word'];
const GS_PUZZLES = {
  escape: { name: 'Escape Room', art: 'escape', open: 'The door’s locked and you’re on the wrong side of it.' },
  murder: { name: 'Murder Mystery', art: 'murder', open: 'There’s a body, a locked door and a story that doesn’t add up. Your move.' },
  word: { name: 'Word Puzzle', art: 'word', open: 'You already know today’s answer. You can’t see it yet, so start guessing.' },
};
// Today's results by plan.
const GS_TODAY_PLAYED = {
  out: {},
  free: { word: 'word-today' },
  pass: { escape: 'escape-today', murder: 'murder-today', word: 'word-today' },
};
const GS_EARLIER = [
  { date: 'Monday 5 October', short: '5 October', played: { word: 'word-1005' } },
  { date: 'Sunday 4 October', short: '4 October', played: { murder: 'murder-1004' } },
  { date: 'Saturday 3 October', short: '3 October', played: {} },
];

const GS_ROLLS = [
  ['Stealth check', 'd20 11 + 3 = 14 vs 15', 'Weak hit: through, but heard'],
  ['Perception', 'd20 16 + 2 = 18 vs 12', 'Hit: you spot the sentry first'],
  ['Stealth check', 'd20 7 + 3 = 10 vs 14', 'Miss: the sentry sees you'],
  ['Bluff', 'd20 15 + 1 = 16 vs 15', 'Hit: he takes you for a deserter'],
  ['Athletics', 'd20 9 + 2 = 11 vs 13', 'Miss: the bone bridge gives, HP 9/12'],
  ['Survival', 'd20 18 + 2 = 20 vs 14', 'Hit: you find the fungus path'],
  ['Attack', 'd20 20 + 4 = 24 vs 13', 'Natural 20: the guard drops without a sound'],
  ['Stealth check', 'd20 12 + 3 = 15 vs 16', 'Weak hit: in, but the drums quicken'],
  ['Sleight of hand', 'd20 14 + 3 = 17 vs 15', 'Hit: Wren’s ropes are cut'],
  ['Defence', 'd20 5 + 2 = 7 vs 14', 'Miss: a spear finds you, HP 5/12'],
  ['Athletics', 'd20 13 + 2 = 15 vs 15', 'Hit: out through the escape tunnel'],
];

const GS_SESSIONS = {
  delve: {
    kind: 'delve', game: 'Delve', art: 'delve', result: 'Rescued', date: 'Monday 5 October', lapsedDate: 'Monday 14 September',
    figures: ['Threat 5/6', '11 rolls', '1 natural 20', 'HP 5/12'],
    tracks: { progress: 6, threat: 5 },
    listTitle: 'Every roll', lines: GS_ROLLS,
    endings: ['Clean rescue', 'Close call', 'Alone', 'Caught'], reached: 'Close call',
    share: 'Rescued · threat 5/6 · 11 rolls · 1 natural 20',
  },
  'word-today': {
    kind: 'puzzle', game: 'Word Puzzle', art: 'word', number: 212, result: 'Solved in 3 of 6', date: GS.today,
    listTitle: 'Every guess', share: 'Solved in 3 of 6',
    lines: [['Guess 1', 'SLATE', 'T is in the word'], ['Guess 2', 'TONIC', 'T and O in place, C is in the word'], ['Guess 3', 'TORCH', 'Solved']],
  },
  'escape-today': {
    kind: 'puzzle', game: 'Escape Room', art: 'escape', result: 'Escaped in 7 moves', date: GS.today,
    listTitle: 'Every move', share: 'Escaped in 7 moves',
    lines: [['Move 1', 'Search the desk', 'A brass key'], ['Move 2', 'Try the key in the door', 'Wrong lock'], ['Move 3', 'Look under the rug', 'A hatch, bolted'],
      ['Move 4', 'Read the note on the wall', 'Four numbers, smudged'], ['Move 5', 'Try the numbers on the safe', 'It opens'],
      ['Move 6', 'Take the crowbar from the safe', 'Got it'], ['Move 7', 'Lever the hatch open', 'Out']],
  },
  'murder-today': {
    kind: 'puzzle', game: 'Murder Mystery', art: 'murder', result: 'Missed', loss: true, date: GS.today,
    listTitle: 'Every question', share: 'Missed',
    lines: [['Question 1', 'Who found the body?', 'The cook, just after nine'], ['Question 2', 'Who had the key?', 'Nobody admits to it'],
      ['Question 3', 'Where was the gardener at nine?', 'His story changes'], ['Accusation', 'The gardener', 'Wrong: it was the cook']],
  },
  'word-1005': {
    kind: 'puzzle', game: 'Word Puzzle', art: 'word', number: 211, result: 'Solved in 4 of 6', date: 'Monday 5 October',
    listTitle: 'Every guess', share: 'Solved in 4 of 6',
    lines: [['Guess 1', 'CRANE', 'R and E are in the word'], ['Guess 2', 'STORE', 'S, T and E in place'], ['Guess 3', 'SPREE', 'S, R and E in place'], ['Guess 4', 'SHIRE', 'Solved']],
  },
  casebook: {
    kind: 'case', game: GS_NAME.casebook, art: 'casebook', result: 'Solved', date: 'Monday 5 October', lapsedDate: 'Sunday 13 September',
    figures: ['11 of 16 turns', '4 lies exposed'], listTitle: 'The record', share: 'Solved · 11 of 16 turns · 4 lies exposed',
    lines: [
      ['Confront', 'Maeve Doyle, the bar ledger', 'She admits drinking in the bar after being sacked'],
      ['Confront', 'Tobias Pike, the ferry notice', 'He admits hiding from a debt collector, and hearing a woman arguing at a quarter to eleven'],
      ['Confront', 'Dr. Celia Rourke, the green scarf', 'She admits going up for five minutes'],
      ['Confront', 'Dr. Celia Rourke, what Tobias heard', 'She admits going back up; they argued on the landing'],
      ['Accusation', 'Dr. Celia Rourke', 'Right'],
    ],
  },
  // Every blank is null and shows as a muted "—": nobody has decided it.
  hunter: {
    kind: 'day', game: GS_NAME.hunter, art: 'hunter', result: null, date: 'Monday 5 October', lapsedDate: 'Saturday 12 September',
    figures: [null], listTitle: null, share: null, lines: [],
  },
  'murder-1004': {
    kind: 'puzzle', game: 'Murder Mystery', art: 'murder', result: 'Solved', date: 'Sunday 4 October',
    listTitle: 'Every question', share: 'Solved',
    lines: [['Question 1', 'Who heard the shot?', 'Everyone, at ten'], ['Question 2', 'Who was outside?', 'The neighbour, walking the dog'],
      ['Question 3', 'Whose dog was it?', 'Not the neighbour’s'], ['Accusation', 'The neighbour', 'Right']],
  },
};
// Newest first: today's three puzzles, then 5 and 4 October. One loss.
const GS_HISTORY = ['word-today', 'escape-today', 'murder-today', 'delve', 'casebook', 'hunter', 'word-1005', 'murder-1004'];

// A lapsed player's Pass-game plays predate the day their Pass ended (18 September).
const gsLapsed = (gs) => gs.view !== 'pass' && !!gs.sub.freeUsed;
const gsSessDate = (s, gs) => (gsLapsed(gs) && s.lapsedDate) || s.date;

// The scroller: the phone frame's screen when forced-mobile, else the document.
const gsScroller = () => document.querySelector('.kit-phone-screen') || document.scrollingElement || document.documentElement;
const gsScrollTop = () => { gsScroller().scrollTop = 0; };
const gsScrollToId = (id) => {
  const el = document.getElementById(id); if (!el) return;
  const sc = gsScroller();
  const base = sc === document.scrollingElement || sc === document.documentElement ? 0 : sc.getBoundingClientRect().top;
  sc.scrollTop = el.getBoundingClientRect().top - base + sc.scrollTop - 16;
};

Object.assign(window, {
  DS, GsCtx, useGs, GS, GS_ART, GS_NAME, GS_GAMES, GS_GAME_ORDER, gsMarks, GS_SOON, GS_PUZZLE_ORDER, GS_PUZZLES, GS_TODAY_PLAYED, GS_EARLIER,
  GS_ROLLS, GS_SESSIONS, GS_HISTORY, gsLapsed, gsSessDate, gsScroller, gsScrollTop, gsScrollToId,
});
