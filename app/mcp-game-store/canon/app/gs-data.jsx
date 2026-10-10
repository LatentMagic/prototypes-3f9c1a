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
  works: 'ChatGPT · Claude · Gemini · OpenClaw · any assistant that supports MCP connectors',
};

// Covers: a few flat basic shapes in the cover colours on a cover background.
const GS_SVG = (body) => '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">' + body + '</svg>';
const GS_ART = {
  delve: GS_SVG('<rect width="160" height="120" fill="#421A28"/><rect x="50" y="40" width="60" height="80" fill="#A390B2"/><circle cx="80" cy="40" r="30" fill="#A390B2"/><rect x="64" y="52" width="32" height="68" fill="#1D1B3A"/><circle cx="80" cy="52" r="16" fill="#1D1B3A"/><rect x="64" y="88" width="32" height="8" fill="#E5A63B"/><rect x="68" y="100" width="24" height="8" fill="#E5A63B"/><rect x="72" y="112" width="16" height="8" fill="#E5A63B"/><rect x="22" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="25" cy="54" r="8" fill="#D66847"/><rect x="132" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="135" cy="54" r="8" fill="#D66847"/>'),
  escape: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="60" y="26" width="44" height="94" fill="#328A88"/><circle cx="94" cy="76" r="5" fill="#E5A63B"/><rect x="22" y="22" width="16" height="16" fill="#F2EBE0"/>'),
  murder: GS_SVG('<rect width="160" height="120" fill="#421A28"/><circle cx="72" cy="60" r="30" fill="none" stroke="#D66847" stroke-width="12"/><rect x="114" y="24" width="10" height="72" fill="#F2EBE0"/><rect x="114" y="24" width="10" height="20" fill="#E5A63B"/>'),
  // Daily Groups: four rows of four, one colour a group, as a solved board (added 2026-10-09, split-daily-puzzles).
  groups: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/>' + ['#E5A63B', '#328A88', '#D66847', '#A390B2'].map((c, r) => [0, 1, 2, 3].map((k) => '<rect x="' + (31 + k * 26) + '" y="' + (11 + r * 26) + '" width="20" height="20" fill="' + c + '"/>').join('')).join('')),
  word: GS_SVG('<rect width="160" height="120" fill="#163328"/><rect x="24" y="44" width="32" height="32" fill="#E5A63B"/><rect x="64" y="44" width="32" height="32" fill="#F2EBE0"/><rect x="106" y="46" width="28" height="28" fill="none" stroke="#328A88" stroke-width="4"/>'),
  derelict: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="100" cy="56" r="32" fill="none" stroke="#A390B2" stroke-width="10"/><rect x="28" y="74" width="20" height="20" fill="#D66847"/><circle cx="40" cy="30" r="4" fill="#F2EBE0"/>'),
  barrow: GS_SVG('<rect width="160" height="120" fill="#421A28"/><path d="M12 120L52 52L92 120Z" fill="#E5A63B"/><path d="M68 120L108 64L148 120Z" fill="#F2EBE0"/><rect x="100" y="20" width="16" height="16" fill="#328A88"/>'),
  casebook: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="30" y="40" width="18" height="80" fill="#D66847"/><rect x="62" y="28" width="18" height="92" fill="#A390B2"/><rect x="94" y="46" width="18" height="74" fill="#F2EBE0"/><circle cx="128" cy="26" r="12" fill="#E5A63B"/>'),
  hunter: GS_SVG('<rect width="160" height="120" fill="#163328"/><circle cx="52" cy="74" r="26" fill="#E5A63B"/><path d="M40 120L100 50L160 120Z" fill="#A390B2"/><rect x="18" y="104" width="14" height="14" fill="#328A88"/><rect x="128" y="20" width="10" height="10" fill="#F2EBE0"/>'),
};

// Working names: one constant each, so a name changes in one place.
const GS_NAME = { casebook: 'Casebook', hunter: '36,000 Summers Ago' };

// 'FREE' and 'PASS' render as the system's Free and Locked ("Pass") tags.
// category: one per game, printed before the rhythm in the product page's label (proposed values, split-daily-puzzles).
// free: free in full (every edition, a streak, its achievements). first: a free player gets the game's one first edition. Neither: only with the Pass.
// ed: the game's own word for one of its editions, [singular, plural] (walk-sweep-2). Players never see a platform-wide word.
const GS_GAMES = {
  word: { name: 'Daily Word', category: 'PUZZLE', art: 'word', route: 'word', ed: ['word', 'words'], free: true, daily: true, blurb: 'You already know today’s answer. Start guessing.', tags: ['FREE', 'Daily', '10 min'] },
  groups: { name: 'Daily Groups', category: 'PUZZLE', art: 'groups', route: 'groups', ed: ['groups', 'groups'], free: true, daily: true, blurb: 'Sixteen words hide four groups. Find all four.', tags: ['FREE', 'Daily', '10 min'] },
  mystery: { name: 'Daily Mystery', category: 'PUZZLE', art: 'murder', route: 'mystery', ed: ['case', 'cases'], free: true, daily: true, blurb: 'There’s a body and a story that doesn’t add up.', tags: ['FREE', 'Daily', '10 min'] },
  escape: { name: 'Escape', category: 'PUZZLE', art: 'escape', route: 'escape', ed: ['room', 'rooms'], free: true, blurb: 'The door’s locked and you’re on the wrong side of it.', tags: ['FREE', 'Weekly', '10 min'] },
  casebook: { name: GS_NAME.casebook, category: 'MYSTERY', art: 'casebook', route: 'casebook', ed: ['case', 'cases'], blurb: 'Ask the question they haven’t prepared for.', first: true, tags: ['FIRST', 'Weekly', '25–40 min'] },
  delve: { name: 'Delve', category: 'ADVENTURE', art: 'delve', route: 'delve', ed: ['scene', 'scenes'], first: true, blurb: 'Get her out before the drums stop.', tags: ['FIRST', 'Weekly', '25–40 min'] },
  hunter: { name: GS_NAME.hunter, category: 'LEARNING', art: 'hunter', route: 'hunter', blurb: 'Grey dawn below Chauvet cave. Go where you like.', tags: ['PASS', '2 hours'] },
};
const GS_GAME_ORDER = ['word', 'groups', 'mystery', 'escape', 'casebook', 'delve', 'hunter'];
// How often a game releases an edition, read from its card tags: 'daily', 'weekly', or null (no editions). The Daily / Weekly filters use it.
const gsRhythm = (k) => { const t = GS_GAMES[k].tags; return t.includes('Daily') ? 'daily' : t.includes('Weekly') ? 'weekly' : null; };
const GS_RHYTHMS = [['daily', 'Daily'], ['weekly', 'Weekly']];
// Sample data, not decided: each game's spec will say whether its earlier editions can be played. Here Daily Word's can't; every other game's can.
const GS_EARLIER_CLOSED = ['word'];
const gsGameOfRoute = (route) => GS_GAME_ORDER.find((k) => GS_GAMES[k].route === route) || null;
// This edition's play of each free game, by plan: today's for a daily, this week's for Escape.
// Finished by default; Config (This week, or today) turns every screen to in progress together (lbNow, gs-library.jsx).
const GS_TODAY_PLAYED = {
  out: {},
  free: { word: 'word-today', groups: 'groups-today', mystery: 'mystery-today', escape: 'escape-week' },
  pass: { word: 'word-today', groups: 'groups-today', mystery: 'mystery-today', escape: 'escape-week' },
};
// This player's plays of this edition. Config "Free account, today: Not played" empties a free account's (state free-not-played-today).
const gsTodayPlayed = (gs) => (gs.view === 'free' && gs.review && gs.review.today === 'none' ? {} : GS_TODAY_PLAYED[gs.view] || {});
// The small mark on a card, per game. Pass: this edition of each game played; free, signed in: the free plays only.
const gsMarks = (view, gs) => {
  const m = {};
  // An edition in progress is never shown as played (Config: This week, or today).
  const live = !!(gs && gs.review && gs.review.week === 'live');
  const mark = (k) => (live ? 'In progress' : GS_GAMES[k].daily ? 'Played today' : 'Played this week');
  Object.keys(gs ? gsTodayPlayed(gs) : GS_TODAY_PLAYED[view] || {}).forEach((k) => { m[k] = mark(k); });
  if (view === 'pass') { m.casebook = mark('casebook'); m.delve = mark('delve'); }
  return m;
};
const GS_SOON = [
  { name: 'Derelict', art: 'derelict', line: 'The same game, in science fiction' },
  { name: 'The Barrow of Hollowmere', art: 'barrow', line: 'A short campaign with levels and loot' },
];

const GS_ROLLS = [
  ['Stealth','d20 11 + 3 = 14 vs 15','Weak hit'],
  ['Perception','d20 16 + 2 = 18 vs 12','Hit'],
  ['Stealth','d20 7 + 3 = 10 vs 14','Miss'],
  ['Bluff','d20 15 + 1 = 16 vs 15','Hit'],
  ['Athletics','d20 9 + 2 = 11 vs 13','Miss, HP 9/12'],
  ['Survival','d20 18 + 2 = 20 vs 14','Hit'],
  ['Attack','d20 20 + 4 = 24 vs 13','Natural 20'],
  ['Stealth','d20 12 + 3 = 15 vs 16','Weak hit'],
  ['Sleight of hand','d20 14 + 3 = 17 vs 15','Hit'],
  ['Defence','d20 5 + 2 = 7 vs 14','Miss, HP 5/12'],
  ['Athletics','d20 13 + 2 = 15 vs 15','Hit'],
];

const GS_SESSIONS = {
  delve: {
    kind: 'delve', gid: 'delve', game: 'Delve', art: 'delve', result: 'Rescued', date: 'Monday 5 October', lapsedDate: 'Monday 14 September',
    figures: ['Threat 5/6', '11 rolls', '1 natural 20', 'HP 5/12'],
    tracks: { progress: 6, threat: 5 },
    listTitle: 'Every roll', lines: GS_ROLLS,
    endings: ['Clean rescue', 'Close call', 'Alone', 'Caught'], reached: 'Close call',
    share: 'Rescued · threat 5/6 · 11 rolls · 1 natural 20',
  },
  'word-today': {
    kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 212, result: 'Solved in 3 of 6', date: GS.today,
    listTitle: 'Every guess', share: 'Solved in 3 of 6',
    lines: [['Guess 1', 'SLATE', '1 in the word'], ['Guess 2', 'TONIC', '2 in place, 1 in the word'], ['Guess 3', 'TORCH', 'Solved']],
  },
  // This week's room, played on Tuesday.
  'escape-week': {
    kind: 'puzzle', gid: 'escape', game: 'Escape', art: 'escape', result: 'Escaped in 7 moves', date: GS.today,
    listTitle: 'Every move', share: 'Escaped in 7 moves', shareHead: 'Escape 🚪 The Locked Study · out in 7 moves',
    lines: [['Move 1', 'Search the desk', 'Brass key'], ['Move 2', 'Use key on door', 'Wrong lock'], ['Move 3', 'Look under rug', 'Hatch, bolted'],
      ['Move 4', 'Read note on wall', 'Four numbers'], ['Move 5', 'Enter numbers on safe', 'Opens'],
      ['Move 6', 'Take crowbar', 'Crowbar'], ['Move 7', 'Lever hatch', 'Out']],
  },
  'mystery-today': {
    kind: 'puzzle', gid: 'mystery', game: 'Daily Mystery', art: 'murder', result: 'Missed', loss: true, date: GS.today,
    listTitle: 'Every question', share: 'Missed', shareHead: 'Daily Mystery #64 · ❌ Missed · 🔎🔎🔎',
    lines: [['Question 1', 'Who found the body?', 'The cook'], ['Question 2', 'Who had the key?', 'Nobody'],
      ['Question 3', 'Where was the gardener at nine?', 'Unclear'], ['Accusation', 'The gardener', 'Wrong']],
  },
  'word-1005': {
    kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 211, result: 'Solved in 4 of 6', date: 'Monday 5 October',
    listTitle: 'Every guess', share: 'Solved in 4 of 6',
    lines: [['Guess 1', 'CRANE', '1 in place, 1 in the word'], ['Guess 2', 'STORE', '3 in place'], ['Guess 3', 'SPREE', '2 in place, 1 in the word'], ['Guess 4', 'SHIRE', 'Solved']],
  },
  // Daily Groups. Fish 🟦, weather 🟨, music 🟪, fence 🟩. Share rows hide every word.
  'groups-today': {
    kind: 'puzzle', gid: 'groups', game: 'Daily Groups', art: 'groups', result: 'All 4 groups, 1 mistake', date: GS.today,
    figures: ['4 of 4 groups', '1 mistake'], listTitle: 'Every try', share: 'All 4 groups, 1 mistake',
    shareHead: 'Daily Groups #88 · 1 mistake', rows: ['🟪🟦🟦🟦', '🟦🟦🟦🟦', '🟨🟨🟨🟨', '🟪🟪🟪🟪', '🟩🟩🟩🟩'],
    lines: [['Try 1', 'BASS · PIKE · CARP · SOLE', 'One away'], ['Try 2', 'PIKE · CARP · SOLE · PERCH', 'Found: fish'],
      ['Try 3', 'FROST · MIST · HAIL · SLEET', 'Found: weather'], ['Try 4', 'BASS · CHORD · SCALE · NOTE', 'Found: music'], ['Try 5', 'RAIL · GATE · POST · PANEL', 'Found: parts of a fence']],
  },
  'groups-1005': {
    kind: 'puzzle', gid: 'groups', game: 'Daily Groups', art: 'groups', result: 'All 4 groups, no mistakes', date: 'Monday 5 October',
    figures: ['4 of 4 groups', 'No mistakes'], listTitle: 'Every try', share: 'All 4 groups, no mistakes',
    shareHead: 'Daily Groups #87 · no mistakes', rows: ['🟨🟨🟨🟨', '🟦🟦🟦🟦', '🟩🟩🟩🟩', '🟪🟪🟪🟪'],
    lines: [['Try 1', 'OAK · ASH · ELM · YEW', 'Found: trees'], ['Try 2', 'JACK · KING · QUEEN · ACE', 'Found: playing cards'],
      ['Try 3', 'MARS · VENUS · PLUTO · EARTH', 'Found: planets'], ['Try 4', 'BOW · STERN · DECK · HULL', 'Found: parts of a ship']],
  },
  'escape-0928': {
    kind: 'puzzle', gid: 'escape', game: 'Escape', art: 'escape', result: 'Escaped in 9 moves', date: 'Monday 28 September',
    listTitle: 'Every move', share: 'Escaped in 9 moves', shareHead: 'Escape 🚪 The Flooded Cellar · out in 9 moves',
    lines: [['Move 1', 'Go to shelves', 'Jar of keys'], ['Move 2', 'Use keys on door', 'None fit'], ['Move 3', 'Look up', 'Hatch'],
      ['Move 4', 'Stack crates', 'Too low'], ['Move 5', 'Drain water', 'Cover, stuck'], ['Move 6', 'Lever cover', 'Lifts'],
      ['Move 7', 'Reach into drain', 'Brass key'], ['Move 8', 'Open cabinet', 'Ladder'], ['Move 9', 'Climb through hatch', 'Out']],
  },
  casebook: {
    kind: 'case', gid: 'casebook', game: GS_NAME.casebook, art: 'casebook', result: 'Solved', date: 'Monday 5 October', lapsedDate: 'Sunday 13 September',
    figures: ['11 of 16 turns', '4 lies exposed'], listTitle: 'The record', share: 'Solved · 11 of 16 turns · 4 lies exposed',
    lines: [
      ['Confront', 'Maeve Doyle, the bar ledger', 'Lie exposed'],
      ['Confront', 'Tobias Pike, the ferry notice', 'Lie exposed'],
      ['Confront', 'Dr. Celia Rourke, the green scarf', 'Lie exposed'],
      ['Confront', 'Dr. Celia Rourke, what Tobias heard', 'Lie exposed'],
      ['Accusation', 'Dr. Celia Rourke', 'Right'],
    ],
  },
  'mystery-1004': {
    kind: 'puzzle', gid: 'mystery', game: 'Daily Mystery', art: 'murder', result: 'Solved', date: 'Sunday 4 October',
    listTitle: 'Every question', share: 'Solved', shareHead: 'Daily Mystery #62 · ✅ Solved · 🔎🔎🔎',
    lines: [['Question 1', 'Who heard the shot?', 'Everyone'], ['Question 2', 'Who was outside?', 'The neighbour'],
      ['Question 3', 'Whose dog was it?', 'Not the neighbour'], ['Accusation', 'The neighbour', 'Right']],
  },
};
// This edition in progress (Config: This week, or today): the record so far. No sharing until it ends.
Object.assign(GS_SESSIONS, {
  'word-live': { kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', live: true, result: 'In progress', date: GS.today, listTitle: 'Every guess', share: null,
    lines: [['Guess 1', 'SLATE', '1 in the word'], ['Guess 2', 'TONIC', '2 in place, 1 in the word']] },
  'groups-live': { kind: 'puzzle', gid: 'groups', game: 'Daily Groups', art: 'groups', live: true, result: 'In progress', date: GS.today, figures: ['2 of 4 groups', '1 mistake'], listTitle: 'Every try', share: null,
    lines: [['Try 1', 'BASS · PIKE · CARP · SOLE', 'One away'], ['Try 2', 'PIKE · CARP · SOLE · PERCH', 'Found: fish'], ['Try 3', 'FROST · MIST · HAIL · SLEET', 'Found: weather']] },
  'mystery-live': { kind: 'puzzle', gid: 'mystery', game: 'Daily Mystery', art: 'murder', live: true, result: 'In progress', date: GS.today, listTitle: 'Every question', share: null,
    lines: [['Question 1', 'Who found the body?', 'The cook'], ['Question 2', 'Who had the key?', 'Nobody']] },
  'escape-live': { kind: 'puzzle', gid: 'escape', game: 'Escape', art: 'escape', live: true, result: 'In progress', date: GS.today, listTitle: 'Every move', share: null,
    lines: GS_SESSIONS['escape-week'].lines.slice(0, 4) },
  'delve-live': { ...GS_SESSIONS.delve, live: true, result: 'In progress', lapsedDate: undefined, figures: ['Threat 3/6', '9 rolls'], tracks: { progress: 4, threat: 3 }, lines: GS_ROLLS.slice(0, 9), reached: null, share: null },
});

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
  DS, GsCtx, useGs, GS, GS_ART, GS_NAME, GS_GAMES, GS_GAME_ORDER, gsGameOfRoute, gsMarks, GS_SOON, GS_TODAY_PLAYED, gsTodayPlayed,
  GS_ROLLS, GS_SESSIONS, gsLapsed, gsSessDate, gsScroller, gsScrollTop, gsScrollToId,
});
