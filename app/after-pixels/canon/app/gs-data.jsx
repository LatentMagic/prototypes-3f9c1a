// ============================================================================
// After Pixels — seed data and the app context. Content is sample unless its comment says it is deployed.
// DS is the bound design system's namespace (loaded by _ds_bundle.js).
// ============================================================================
import React from 'react';

export const DS = window.MCPGameStoreDesignSystem_ef1abd;
export const GsCtx = React.createContext(null);
export const useGs = () => React.useContext(GsCtx);

export const GS = {
  today: 'Tuesday 6 October',
  link: 'https://afterpixels.com/mcp',
  email: 'you@example.com',
  purchase: 'Purchases only ever happen on this site; your AI will never ask you to pay.',
  works: 'ChatGPT · Claude · Gemini · OpenClaw · any assistant that supports MCP connectors',
};

// Covers: a few flat basic shapes in the cover colours on a cover background. Each declares its ground and how it extends
// when a Cover fills a taller box (design system Cover `fill`, guidelines/game-art-motion.md "Extending a cover"):
// bottom when the shapes stand on the bottom edge, centre when they float. { ground, extend, svg }
export const GS_SVG = (body) => '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">' + body + '</svg>';
export const GS_ART = {
  delve: { ground: 'wine', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><rect x="50" y="40" width="60" height="80" fill="#A390B2"/><circle cx="80" cy="40" r="30" fill="#A390B2"/><rect x="64" y="52" width="32" height="68" fill="#1D1B3A"/><circle cx="80" cy="52" r="16" fill="#1D1B3A"/><rect x="64" y="88" width="32" height="8" fill="#E5A63B"/><rect x="68" y="100" width="24" height="8" fill="#E5A63B"/><rect x="72" y="112" width="16" height="8" fill="#E5A63B"/><rect x="22" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="25" cy="54" r="8" fill="#D66847"/><rect x="132" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="135" cy="54" r="8" fill="#D66847"/>') },
  escape: { ground: 'indigo', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="60" y="26" width="44" height="94" fill="#328A88"/><circle cx="94" cy="76" r="5" fill="#E5A63B"/><rect x="22" y="22" width="16" height="16" fill="#F2EBE0"/>') },
  murder: { ground: 'wine', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><circle cx="72" cy="60" r="30" fill="none" stroke="#D66847" stroke-width="12"/><rect x="114" y="24" width="10" height="72" fill="#F2EBE0"/><rect x="114" y="24" width="10" height="20" fill="#E5A63B"/>') },
  // Daily Groups: four rows of four, one colour a group, as a solved board.
  groups: { ground: 'indigo', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/>' + ['#E5A63B', '#328A88', '#D66847', '#A390B2'].map((c, r) => [0, 1, 2, 3].map((k) => '<rect x="' + (31 + k * 26) + '" y="' + (11 + r * 26) + '" width="20" height="20" fill="' + c + '"/>').join('')).join('')) },
  word: { ground: 'forest', extend: 'centre', svg: '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice"><rect width="160" height="120" fill="#163328"/><rect x="24" y="44" width="32" height="32" fill="#4CC38A"/><rect x="64" y="44" width="32" height="32" fill="#E5A63B"/><rect class="wd-cover-miss" x="104" y="44" width="32" height="32" fill="#918B80" stroke="#918B80"/></svg>' },
  derelict: { ground: 'indigo', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="100" cy="56" r="32" fill="none" stroke="#A390B2" stroke-width="10"/><rect x="28" y="74" width="20" height="20" fill="#D66847"/><circle cx="40" cy="30" r="4" fill="#F2EBE0"/>') },
  barrow: { ground: 'wine', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><path d="M12 120L52 52L92 120Z" fill="#E5A63B"/><path d="M68 120L108 64L148 120Z" fill="#328A88"/><rect x="100" y="20" width="16" height="16" fill="#F2EBE0"/>') },
  casebook: { ground: 'indigo', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="30" y="40" width="18" height="80" fill="#D66847"/><rect x="62" y="28" width="18" height="92" fill="#A390B2"/><rect x="94" y="46" width="18" height="74" fill="#F2EBE0"/><circle cx="128" cy="26" r="12" fill="#E5A63B"/>') },
  hunter: { ground: 'forest', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><circle cx="52" cy="74" r="26" fill="#E5A63B"/><path d="M40 120L100 50L160 120Z" fill="#A390B2"/><rect x="18" y="104" width="14" height="14" fill="#328A88"/><rect x="128" y="20" width="10" height="10" fill="#F2EBE0"/>') },
};

// Working names: one constant each, so a name changes in one place.
export const GS_NAME = { casebook: 'Casebook', hunter: '36,000 Summers Ago' };

// 'FREE' and 'PASS' render as the system's Free and Locked ("Pass") tags.
// category: one per game, printed before the rhythm in the product page's label (proposed values).
// access: who plays what, held here once. 'daily' free to play (the current edition, a streak, its achievements); 'first' a free player
// gets the game's one first edition; 'pass' only with the Pass. free, first and the card's access tag are derived from it (gsAccess); never type them.
// once: the game has a fixed answer, so a finished play is never started again, with or without a schedule. Read it through gsStartsOver only.
// edAll: the editions list's H1 and Show option where "Every " + ed[0] doesn't read (Daily Groups).
// edLink: the editions link's own text, where "Every " + ed[0] doesn't read (Daily Groups).
// eds: the game has editions but no schedule (the Barrow's chapters), so it has an editions list without a Daily or Weekly filter.
// ed: the game's own word for one of its editions, [singular, plural]. Players never see a platform-wide word.
export const GS_GAMES = {
  word: { access: 'daily', name: 'Daily Word', category: 'PUZZLE', art: 'word', route: 'word', ed: ['word', 'words'], daily: true, once: true, blurb: 'Six guesses to find today’s five-letter word.', tags: ['Daily', '10 min'] },
  groups: { access: 'pass', name: 'Daily Groups', category: 'PUZZLE', art: 'groups', route: 'groups', ed: ['puzzle', 'puzzles'], edLink: 'See all groups', edAll: 'All groups', daily: true, once: true, blurb: 'Sixteen words hide four groups. Find all four.', tags: ['Daily', '10 min'] },
  mystery: { access: 'daily', name: 'Daily Mystery', category: 'PUZZLE', art: 'murder', route: 'mystery', ed: ['case', 'cases'], daily: true, once: true, blurb: 'There’s a body and a story that doesn’t add up.', tags: ['Daily', '10 min'] },
  escape: { access: 'first', name: 'Escape', category: 'PUZZLE', art: 'escape', route: 'escape', ed: ['room', 'rooms'], blurb: 'The door’s locked and you’re on the wrong side of it.', tags: ['Weekly', 'About 30 min'] },
  // Casebook is episodic: cases are its editions, with no schedule, so it lists them through eds.
  casebook: { access: 'pass', name: GS_NAME.casebook, category: 'MYSTERY', art: 'casebook', route: 'casebook', ed: ['case', 'cases'], eds: true, once: true, blurb: 'Ask the question they haven’t prepared for.', tags: ['25–40 min'] },
  delve: { access: 'first', name: 'Delve', category: 'ADVENTURE', art: 'delve', route: 'delve', ed: ['run', 'runs'], blurb: 'Get her out before the ritual is complete.', tags: ['Weekly', '25–40 min'] },
  // Chapters are its editions; a free player gets chapter 1. Sample content.
  barrow: { access: 'first', name: 'The Barrow of Hollowmere', category: 'ADVENTURE', art: 'barrow', route: 'barrow', ed: ['chapter', 'chapters'], eds: true, edLink: 'All chapters', edAll: 'All chapters', blurb: 'Bring the lost bell home from the barrow. Your hero carries on.', tags: ['Several sessions'] },
  hunter: { access: 'pass', name: GS_NAME.hunter, category: 'LEARNING', art: 'hunter', route: 'hunter', blurb: 'Grey dawn below Chauvet cave. Go where you like.', tags: ['2 hours'] },
};
// Derives a game's free, first and its access tag ('FREE' | 'FIRST' | 'PASS', first in tags) from access.
export const gsAccess = (g) => { g.free = g.access === 'daily'; g.first = g.access === 'first'; g.tags = [{ daily: 'FREE', first: 'FIRST', pass: 'PASS' }[g.access], ...g.tags.filter((t) => !['FREE', 'FIRST', 'PASS'].includes(t))]; return g; };
Object.values(GS_GAMES).forEach(gsAccess);
export const GS_GAME_ORDER = ['word', 'groups', 'mystery', 'escape', 'casebook', 'delve', 'barrow', 'hunter'];
// How often a game releases an edition, read from its card tags: 'daily', 'weekly', or null (no editions). The Daily / Weekly filters use it.
export const gsRhythm = (k) => { const t = GS_GAMES[k].tags; return t.includes('Daily') ? 'daily' : t.includes('Weekly') ? 'weekly' : null; };
export const GS_RHYTHMS = [['daily', 'Daily'], ['weekly', 'Weekly']];
// Every earlier edition of every game that releases them can be played; the Pass decides who.
// Two kinds of game. A daily or weekly edition, and a game with a fixed answer, is played once: a finished one
// shows GS_ONCE_LINE and nothing that starts it. A story or adventure chapter (no schedule, no fixed answer) can be started over
// as a new session, which counts for nothing new. Read everywhere through this.
export const gsStartsOver = (k) => !!k && !!GS_GAMES[k] && !gsRhythm(k) && !GS_GAMES[k].once;
export const GS_ONCE_LINE = 'You’ve played this one. It can’t be played again.';
export const gsGameOfRoute = (route) => GS_GAME_ORDER.find((k) => GS_GAMES[k].route === route) || null;
// This edition's play of each free daily, by plan: today's. Daily Groups is Pass-only and Escape's free room is its first edition (cprFirstState), so a free account has neither here.
// Finished by default; Config (This week, or today) turns every screen to in progress together (lbNow, gs-library.jsx).
export const GS_TODAY_PLAYED = {
  out: {},
  free: { word: 'word-today', mystery: 'mystery-today' },
  pass: { word: 'word-today', groups: 'groups-today', mystery: 'mystery-today', escape: 'escape-week' },
};
// This player's plays of this edition. Config "Free account, today: Not played" empties a free account's (state free-not-played-today).
export const gsTodayPlayed = (gs) => (gsFresh(gs) || (gs.view === 'free' && gs.review && gs.review.today === 'none') ? {} : GS_TODAY_PLAYED[gs.view] || {});
// A new account (made in the prototype, or Config Account: New): nothing played anywhere.
export const gsFresh = (gs) => { gs = gs || window.gsApi; return !!(gs && gs.user && gs.user.fresh); };
// The one date a Pass ended on: the day this player's own Pass ended (sub.endedOn, set when it ends in the prototype
// or by Config Pass ended: Today), else the sample, 18 September. Every date printed about a Pass ending comes from here.
const GS_ENDED_SAMPLE = new Date(2026, 8, 18);
export const gsEndedOn = (gs) => { gs = gs || window.gsApi; return gs && gs.sub && gs.sub.endedOn ? new Date(gs.sub.endedOn) : GS_ENDED_SAMPLE; };
// Search text: lower case, no apostrophes, and a comma between digits dropped, so 36000 finds 36,000 Summers Ago.
export const gsNorm = (s) => (s || '').toLowerCase().replace(/(\d),(?=\d)/g, '$1').replace(/[’'‘]/g, '').trim();

// Coming soon: a game not out yet, and the Barrow's next chapter, chapter 3; its chip opens the Barrow's page.
export const GS_SOON = [
  { name: 'Derelict', art: 'derelict', line: 'The same game, in science fiction' },
  { name: GS_GAMES.barrow.name, art: 'barrow', line: GS_GAMES.barrow.blurb, label: 'CHAPTER 3', play: 'Play chapter 1', route: 'barrow' },
];

// The share card's link for the games whose deployed card names /discover/<game>.
export const gsLink = (gid) => 'https://afterpixels.com/' + (['casebook', 'escape', 'delve', 'barrow'].includes(gid) ? 'discover/' : '') + GS_GAMES[gid].route;
// Required wherever the Barrow's rules material is used (verbatim).
export const GS_BARROW_CREDIT = 'Rules material from the System Reference Document 5.2.1 by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd, licensed under the Creative Commons Attribution 4.0 International License (https://creativecommons.org/licenses/by/4.0/legalcode).';

// ---- Move lines (1236 move-list delta, owner 2026-10-29: clinical). Each line says what the move was, in the game's own words,
// and holds only what the game's engine and spec allow. Every game writes { label, parts }: the label names the line, the first
// part is what happened, the rest qualify it. Sample plays; the wording follows each game's session-record.ts. ----
const GS_ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
const gsJoin = (xs) => (xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);
// Daily Word / Guess: what each letter of a guess scored, as the game's page says it: "S is in place. L and T are in the word."
// A letter the guess repeats is named by its place ("the second L"), so the two never read as one.
export const gsGuessParts = (word, answer) => {
  const w = word.split(''); const a = answer.split(''); const marks = w.map(() => 'miss'); const left = {};
  a.forEach((ch, i) => { if (w[i] === ch) marks[i] = 'hit'; else left[ch] = (left[ch] || 0) + 1; });
  w.forEach((ch, i) => { if (marks[i] !== 'hit' && left[ch]) { marks[i] = 'near'; left[ch] -= 1; } });
  if (marks.every((m) => m === 'hit')) return ['Every letter is in place'];
  const name = (ch, i) => (w.filter((x) => x === ch).length > 1 ? 'the ' + GS_ORD[w.slice(0, i + 1).filter((x) => x === ch).length - 1] + ' ' + ch : ch);
  const say = (kind, tail) => { const n = w.map((ch, i) => (marks[i] === kind ? name(ch, i) : null)).filter(Boolean); if (!n.length) return null;
    const t = gsJoin(n) + (n.length === 1 ? ' is ' : ' are ') + tail; return t.charAt(0).toUpperCase() + t.slice(1); };
  return [say('hit', 'in place'), say('near', 'in the word'), say('miss', 'not in the word')].filter(Boolean);
};
// A Daily Word play: each entry is a guess (a word) or a line passed through (the hint, as ['Hint', 'Letter 2 is T.']).
const gsWordLines = (answer, seq) => { let n = 0; return seq.map((x) => (typeof x === 'string' ? ['Guess ' + (n += 1), x, ...gsGuessParts(x, answer)] : x)); };
// Escape: moves are numbered across moves only (hints and items are not moves). A name sits mid-sentence in lower case.
const gsEsLines = (steps) => { let n = 0; return steps.map((x) => (x[0] === 'Hint' || x[0] === 'Item' ? x : ['Move ' + (n += 1), ...x])); };
export const gsEsHint = (lock, rung, text) => ['Hint', 'The ' + lock, 'Hint ' + rung + ' of 3', text];
// Wrong answers a sample player types: the letters of a four-letter lock, then permutations of the cabinet's four digits.
export const GS_ES_WORDS4 = ['GEAR', 'TIME', 'HAND', 'BELL', 'HOUR', 'SAND', 'WIND', 'DUST'];
const GS_ES_DIG4 = ['1234', '1479', '9147', '4719', '7149', '1947', '4179', '9741', '7491', '1974', '4197', '9471', '7194', '1497', '4917', '9174', '7941', '4971'];
const GS_ES_WORDS5 = ['TRAIN', 'STEAM', 'TRACK', 'PLATE']; const GS_ES_DIG3 = ['123', '482', '907', '256'];
// Delve: a name sits mid-sentence in lower case ("Entered the warren"), as the engine writes it.
const gsDvName = (n) => n.replace(/^The /, 'the ');

// ---- Delve run 1, The Goblin Warren beneath Ashford Mill: two recorded plays of the deployed engine. ----
export const GS_DV_TURNCOAT = 'As the sentries come at you, a scrawny goblin chained to the wall behind them wrenches at his rusted staple, his back striped from the whip. It gives, and he scrambles free and turns on his masters with murder in his eyes.';
const GS_DV_WON = [
  ['Wisdom', 'Search the lock-keeper\'s niche', 'Failure', 'Natural 1', 'Rolled 1 + 0 = 1 against DC 12', 'HP 12/13'],
  ['Room', 'Entered the chime run'],
  ['Dexterity', 'Miss', 'Rolled 9 + 1 = 10 against DC 12', 'HP 11/13'],
  ['Dexterity', 'Weak hit', 'Rolled 11 + 1 = 12 against DC 12'],
  ['Dexterity', 'Strong hit', 'Rolled 18 + 1 = 19 against DC 12'],
  ['Room', 'Entered the warren'],
  ['Turn', 'The turncoat joins', GS_DV_TURNCOAT],
  ['Strength', 'Weak hit', 'Rolled 9 + 3 = 12 against DC 12'],
  ['Strength', 'Weak hit', 'Rolled 13 + 3 = 16 against DC 12', 'HP 9/13'],
  ['Strength', 'Strong hit', 'Rolled 17 + 3 = 20 against DC 12'],
  ['Dexterity', 'Rifle the stolen sacks', 'Success', 'Natural 20', 'Rolled 20 + 1 = 21 against DC 12'],
  ['Room', 'Entered Snaggle\'s den'],
  ['Gear', 'Used a pepper pouch', 'Snaggle: track 3 → 1'],
  ['Strength', 'Strong hit', 'Rolled 18, the higher of 15 and 18, + 3 = 21 against DC 12'],
  ['Gear', 'Took the iron key'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'],
  ['Lock', 'Opened the bone gate with the iron key'],
  ['Room', 'Entered the shrine cavern'],
  ['Strength', 'Strong hit', 'Rolled 19, the higher of 11 and 19, + 3 = 22 against DC 12'],
  ['Strength', 'Strong hit', 'Rolled 17, the higher of 17 and 9, + 3 = 20 against DC 12'],
];
const GS_DV_LIVE = [
  ['Oracle', 'Is anyone awake down here?', 'Yes', 'Rolled d100 23 against 25'],
  ['Room', 'Entered the chime run'],
  ['Dexterity', 'Weak hit', 'Rolled 13 + 3 = 16 against DC 12'],
  ['Dexterity', 'Strong hit', 'Rolled 16 + 3 = 19 against DC 12'],
  ['Room', 'Entered the warren'],
  ['Turn', 'The turncoat joins', GS_DV_TURNCOAT],
  ['Dexterity', 'Strong hit', 'Rolled 14 + 3 = 17 against DC 12'],
  ['Dexterity', 'Strong hit', 'Rolled 14, the higher of 8 and 14, + 3 = 17 against DC 12'],
  ['Intelligence', 'Study the wall scratchings', 'Success', 'Rolled 19, the higher of 19 and 15, + 1 = 20 against DC 12'],
  ['Room', 'Entered Snaggle\'s den'],
  ['Dexterity', 'Strong hit', 'Rolled 14, the higher of 14 and 5, + 3 = 17 against DC 12'],
  ['Dexterity', 'Strong hit', 'Rolled 18, the higher of 18 and 7, + 3 = 21 against DC 12'],
  ['Dexterity', 'Climb to the skeleton on the high ledge', 'Success', 'Natural 20', 'Rolled 20, the higher of 20 and 6, + 3 = 23 against DC 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'],
];
export const GS_DV_ENDINGS = ['Elsie rescued', 'Too late: the ritual was completed', 'Fell in the warren'];

// ---- Escape No. 1, The Clockmaker’s Study (par 30). GS_ES1 is the room's deployed text (content/escape/1.v3.json); GS_ES1_LINES is a
// sample play of it, written as the engine writes a line: a typed try keeps what was typed, a mechanism names its parts. ----
export const GS_ES1 = {
  bench: 'A workbench scattered with tools. On a tray sits a train of four brass gears with 20, 9, 3 and 11 teeth. The crank turns the 20-tooth gear, which turns the 9, which turns the 3, which turns the 11. The tray reads “One tooth, one letter.” Below it, a drawer with a four-letter lock.',
  clock: 'A tall case clock, stopped, its hands stiff. There is a winding hole in its face.',
  cabinet: 'A glass cabinet with a four-digit lock. Through the glass, four pocket watches hang on tagged chains: Thursday’s shows nine o’clock, Monday’s seven, Wednesday’s one, Tuesday’s four. A brass plate on the frame: “My code is my watches’ hours, Monday to Thursday.”',
  portrait: 'A girl of about ten, reaching up to a tall clock, a locket at her throat lost in the gloom. Beneath, in Ezra’s hand: “Ada.”',
  fire: 'Cold ashes in an iron grate. The panelling beside it is carved with tiny gears, too shadowed to make out.',
  door: 'A narrow oak door, hidden in the panelling until now, with a four-letter lock.',
  drawer: 'Inside the drawer lies a small brass key, its bow shaped like a clock face.',
  diary: 'Among the pocket watches lies a page torn from Ezra’s diary: “Ada went to live with her mother across the sea. Her train left at four o’clock. I said goodbye to her on the platform a quarter of an hour before it went, and stood there alone until it had gone. I stopped every clock in the house that day. Set the case clock to the moment I said goodbye, and this room will show you where I am.”',
  clockWound: 'A tall case clock, wound but silent. Its hands now turn freely: the hour hand to any hour, the minute hand to the hour, quarter past, half past or quarter to.',
  hands: 'The hands click home at a quarter to four, and the case clock begins to tick. The cloud outside breaks.',
};
const GS_ES1_LINES = gsEsLines([
  ['Examined the workbench', GS_ES1.bench],
  ['Tried GEAR on the workbench drawer', 'Wrong'],
  gsEsHint('workbench drawer', 1, 'Count the gears’ teeth, and read each count as a letter.'),
  ['Tried TICK on the workbench drawer', GS_ES1.drawer],
  ['Item', 'Picked up the brass winding key', 'A small brass key, its bow shaped like a clock face.'],
  ['Examined the case clock', GS_ES1.clock],
  ['Used the brass winding key on the case clock', 'Used up', GS_ES1.clockWound],
  ['Examined the glass cabinet', GS_ES1.cabinet],
  ['Tried 1479 on the cabinet lock', 'Wrong'],
  ['Tried 7419 on the cabinet lock', GS_ES1.diary],
  ['Set the clock hands: Hour hand 3, Minute hand 45', GS_ES1.hands],
  ['Examined the portrait', GS_ES1.portrait],
  ['Examined the fireplace', GS_ES1.fire],
  ['Examined the oak door', GS_ES1.door],
  ['Tried TOCK on the oak door lock', 'Out'],
]);

// ---- Casebook, Case 1: The Last Night at Gull Point (deployed case; this play of it is sample). Turn codes: F search found, N search found nothing, Q question,
// H evidence shown and the story stood, B lie exposed, A the accusation (unnumbered). ----
export const GS_CB_REC = [
  { c: 'F', act: 'Search', what: 'Searched the hotel bar', out: 'Found the bar ledger' },
  { c: 'F', act: 'Search', what: 'Searched the harbour noticeboard', out: 'Found the ferry notice' },
  { c: 'F', act: 'Search', what: 'Searched the lighthouse stairs', out: 'Found a green silk scarf, Pike’s broken watch' },
  { c: 'F', act: 'Search', what: 'Searched Pike’s office', out: 'Found a letter of dismissal, a partnership deed, Pike’s will' },
  { c: 'Q', act: 'Question', what: 'Asked Maeve Doyle about Tobias Pike' },
  { c: 'B', act: 'Show evidence', what: 'Showed the bar ledger to Maeve Doyle', out: 'Lie exposed' },
  { c: 'B', act: 'Show evidence', what: 'Showed the ferry notice to Tobias Pike', out: 'Lie exposed' },
  { c: 'Q', act: 'Question', what: 'Asked Dr. Celia Rourke about Pike’s broken watch' },
  { c: 'B', act: 'Show evidence', what: 'Showed a green silk scarf to Dr. Celia Rourke', out: 'Lie exposed' },
  { c: 'H', act: 'Show evidence', what: 'Showed Pike’s will to Dr. Celia Rourke', out: 'Their story stood' },
  { c: 'B', act: 'Show evidence', what: 'Showed What Tobias heard to Dr. Celia Rourke', out: 'Lie exposed' },
  { c: 'A', act: 'Accusation', what: 'Dr. Celia Rourke', out: 'Right' },
];
// The session page's rows: numbered turns, then the accusation.
const gsCbLines = (rec) => rec.map((r, i) => (r.c === 'A' ? ['Accused ' + r.what, r.out] : ['Turn ' + (i + 1), r.what, ...(r.out ? [r.out] : [])]));

// Today's Daily Mystery questions, shared by the finished play and its in-progress form.
const GS_MYSTERY_QS = [['Question 1', 'Was Delphine Rooke in the study?', 'The inspector said yes'], ['Question 2', 'Did Arthur Penhallow have the paper knife?', 'The inspector said yes']];
// Session records: sample plays (Delve's lines are the deployed engine's, above).
export const GS_SESSIONS = {
  // Delve run 1 won, Bryn the Fighter.
  delve: {
    kind: 'delve', gid: 'delve', game: 'Delve', art: 'delve', result: 'Elsie rescued', date: 'Monday 5 October',
    figures: ['Threat 5/12', '11 rolls', '1 natural 20', 'HP 9/13'],
    tracks: { progress: 5, rooms: 5, threat: 5, threatMax: 12 },
    listTitle: 'Every roll', lines: GS_DV_WON,
    endings: GS_DV_ENDINGS, reached: 'Elsie rescued',
    // What the session page's sheet and run card read (app/gs-delve.jsx): the setting, the hero, the tracks' ends, abilities used, inspiration.
    setting: 'The Goblin Warren beneath Ashford Mill', end: 'won', hero: 'Bryn the Fighter', hpMax: 13, threat: 5, threatMax: 12, sheet: { used: { 'Shield bash': 1 }, insp: true },
    share: 'Elsie rescued',
    shareLines: ['The Goblin Warren beneath Ashford Mill', 'Bryn the Fighter · ✅ Elsie rescued · 11 rolls · longest streak 5', '💀🟥🟨🟩🟨🟨🟩✨🟩🟩🟩'],
  },
  // Daily Word and Daily Mystery tell one story per game on every surface: today's play, its in-progress form and one earlier play.
  'word-today': {
    kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 212, answer: 'STILL', hints: 1, result: 'Solved in 3 of 6', date: GS.today,
    listTitle: 'Every guess', share: 'Solved in 3 of 6',
    lines: gsWordLines('STILL', ['CRANE', 'SLATE', ['Hint', 'Letter 2 is T.'], 'STILL']),
  },
  // Sample plays for the session page (1236). No. 210, the hard play: solved on the fifth guess with the hint; after ROBOT only
  // letter 4 was green, so the hint gave letter 1. No. 208, lost: the SHA_E trap, four letters in place from guess 2 to 6.
  'word-hard': {
    kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 210, answer: 'FLOOR', hints: 1, result: 'Solved in 5 of 6', date: 'Sunday 4 October',
    listTitle: 'Every guess', share: 'Solved in 5 of 6',
    lines: gsWordLines('FLOOR', ['CRANE', 'ROBOT', ['Hint', 'Letter 1 is F.'], 'FROGS', 'FLOUR', 'FLOOR']),
  },
  'word-failed': {
    kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 208, answer: 'STEAL', loss: true, hints: 1, result: 'Failed', date: 'Friday 2 October',
    listTitle: 'Every guess', share: 'Failed',
    lines: gsWordLines('STEAL', ['CRANE', ['Hint', 'Letter 4 is A.'], 'METAL', 'PETAL', 'DECAL', 'SEPAL', 'SHOAL']),
  },
  // This week's room, No. 1 The Clockmaker’s Study, played on Tuesday: escaped in 28 min, under par, 1 hint, 2 wrong tries.
  'escape-week': {
    kind: 'puzzle', gid: 'escape', game: 'Escape', art: 'escape', result: 'Escaped in 28 min, under par', date: GS.today,
    figures: ['28 min, under par', '1 hint', '2 wrong tries'],
    listTitle: 'Every move', share: 'Escaped in 28 min, under par', shareLines: ['Escape No. 1 · escaped in 28 min, under par · 1 hint 💡 · 2 wrong tries'],
    lines: GS_ES1_LINES,
  },
  'mystery-today': {
    kind: 'puzzle', gid: 'mystery', game: 'Daily Mystery', art: 'murder', number: 64, q: 2, hints: 0, result: 'Failed', loss: true, date: GS.today,
    setting: 'a storm-bound weekend at Hollowmere House', victim: 'Madame Odette Varga, the medium',
    figures: ['2 questions', 'No hints'], listTitle: 'Every question', share: 'Failed',
    lines: [...GS_MYSTERY_QS, ['Accusation', 'Sebastian Wyle, with the iron poker, in the dining room', 'Wrong', 'The suspect, the weapon and the room were all wrong']],
  },
  'word-1005': {
    kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 211, answer: 'CHAIN', result: 'Solved in 4 of 6', date: 'Monday 5 October',
    listTitle: 'Every guess', share: 'Solved in 4 of 6',
    lines: gsWordLines('CHAIN', ['CRANE', 'CHANT', 'CHAIR', 'CHAIN']),
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
  // Case 1, The Last Night at Gull Point, solved.
  casebook: {
    kind: 'case', gid: 'casebook', game: GS_NAME.casebook, art: 'casebook', result: 'Solved', date: 'Monday 5 October',
    figures: ['11 of 16 turns', '4 of 4 lies exposed', 'You accused Dr. Celia Rourke'], listTitle: 'Every turn', share: 'Solved',
    shareLines: ['Casebook: The Last Night at Gull Point', '✅ solved · 11 of 16 turns · 4 lies exposed'],
    lines: gsCbLines(GS_CB_REC),
  },
  'mystery-1004': {
    kind: 'puzzle', gid: 'mystery', game: 'Daily Mystery', art: 'murder', number: 62, q: 2, hints: 0, result: 'Solved', date: 'Sunday 4 October',
    setting: 'the annual gala of the Royal Botanical Society', victim: 'Dr Ambrose Kell, the collector',
    figures: ['2 questions', 'No hints'], listTitle: 'Every question', share: 'Solved',
    lines: [['Question 1', 'Was Mr Graves in the study?', 'The inspector said yes'], ['Question 2', 'Did Dr Helena Strand have the curtain cord?', 'The inspector said yes'],
      ['Accusation', 'Ivy Marchbank, with the vial of foxglove, in the wine cellar', 'Right']],
  },
};
// This edition's play as Config → This edition picks it (gsEdPick): Average, Hard (every try and hint used, still won) or Failed.
// Same edition, same answer as today's play and its in-progress form. A game with no entry for a pick keeps its seeded play.
Object.assign(GS_SESSIONS, {
  'word-today-hard': { ...GS_SESSIONS['word-today'], result: 'Solved in 5 of 6', share: 'Solved in 5 of 6',
    lines: gsWordLines('STILL', ['CRANE', 'SLATE', ['Hint', 'Letter 2 is T.'], 'STOOL', 'STALL', 'STILL']) },
  'word-today-failed': { ...GS_SESSIONS['word-today'], loss: true, result: 'Failed', share: 'Failed',
    lines: gsWordLines('STILL', ['CRANE', 'SLATE', ['Hint', 'Letter 2 is T.'], 'STALL', 'SPILL', 'SKILL', 'SWILL']) },
  'groups-today-hard': { ...GS_SESSIONS['groups-today'], result: 'All 4 groups, 3 mistakes', share: 'All 4 groups, 3 mistakes', figures: ['4 of 4 groups', '3 mistakes'],
    shareHead: 'Daily Groups #88 · 3 mistakes', rows: ['🟪🟦🟦🟦', '🟦🟦🟦🟦', '🟨🟨🟨🟪', '🟨🟨🟨🟨', '🟪🟪🟪🟩', '🟪🟪🟪🟪', '🟩🟩🟩🟩'],
    lines: [['Try 1', 'BASS · PIKE · CARP · SOLE', 'One away'], ['Try 2', 'PIKE · CARP · SOLE · PERCH', 'Found: fish'], ['Try 3', 'FROST · MIST · HAIL · NOTE', 'One away'], ['Try 4', 'FROST · MIST · HAIL · SLEET', 'Found: weather'],
      ['Try 5', 'CHORD · SCALE · NOTE · RAIL', 'One away'], ['Try 6', 'BASS · CHORD · SCALE · NOTE', 'Found: music'], ['Try 7', 'RAIL · GATE · POST · PANEL', 'Found: parts of a fence']] },
  'groups-today-failed': { ...GS_SESSIONS['groups-today'], loss: true, result: '2 of 4 groups', share: '2 of 4 groups', figures: ['2 of 4 groups', '4 mistakes'],
    shareHead: 'Daily Groups #88 · 4 mistakes', rows: ['🟪🟦🟦🟦', '🟦🟦🟦🟦', '🟨🟨🟨🟪', '🟨🟨🟨🟨', '🟪🟪🟪🟩', '🟪🟩🟩🟪'],
    lines: [['Try 1', 'BASS · PIKE · CARP · SOLE', 'One away'], ['Try 2', 'PIKE · CARP · SOLE · PERCH', 'Found: fish'], ['Try 3', 'FROST · MIST · HAIL · NOTE', 'One away'], ['Try 4', 'FROST · MIST · HAIL · SLEET', 'Found: weather'],
      ['Try 5', 'CHORD · SCALE · NOTE · RAIL', 'One away'], ['Try 6', 'NOTE · RAIL · GATE · BASS', 'Not a group']] },
  // Daily Mystery asks at most two questions. Today's culprit is a SAMPLE: the seeded play accused the wrong person.
  'mystery-today-avg': { ...GS_SESSIONS['mystery-today'], loss: false, q: 1, result: 'Solved', share: 'Solved', figures: ['1 question', 'No hints'],
    lines: [GS_MYSTERY_QS[0], ['Accusation', 'Delphine Rooke, with the curtain cord, in the conservatory', 'Right']] },
  'mystery-today-hard': { ...GS_SESSIONS['mystery-today'], loss: false, result: 'Solved', share: 'Solved',
    lines: [...GS_MYSTERY_QS, ['Accusation', 'Delphine Rooke, with the curtain cord, in the conservatory', 'Right']] },
});
export const GS_ED_SIDS = {
  word: { average: 'word-today', hard: 'word-today-hard', failed: 'word-today-failed' },
  groups: { average: 'groups-today', hard: 'groups-today-hard', failed: 'groups-today-failed' },
  mystery: { average: 'mystery-today-avg', hard: 'mystery-today-hard', failed: 'mystery-today' },
  escape: { hard: 'escape-hard' },
};
// The finished play Config → This edition picks for a game, or null to keep the seeded one.
export const gsEdPick = (gid, gs) => { gs = gs || window.gsApi; const e = gs && gs.review && gs.review.ed; return (e && GS_ED_SIDS[gid] && GS_ED_SIDS[gid][e]) || null; };
// This edition in progress (Config: This week, or today): the record so far. No sharing until it ends.
Object.assign(GS_SESSIONS, {
  'word-live': { kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 212, answer: 'STILL', live: true, result: 'In progress', date: GS.today, listTitle: 'Every guess', share: null,
    lines: gsWordLines('STILL', ['CRANE', 'SLATE']) },
  'groups-live': { kind: 'puzzle', gid: 'groups', game: 'Daily Groups', art: 'groups', live: true, result: 'In progress', date: GS.today, figures: ['2 of 4 groups', '1 mistake'], listTitle: 'Every try', share: null,
    lines: [['Try 1', 'BASS · PIKE · CARP · SOLE', 'One away'], ['Try 2', 'PIKE · CARP · SOLE · PERCH', 'Found: fish'], ['Try 3', 'FROST · MIST · HAIL · SLEET', 'Found: weather']] },
  'mystery-live': { kind: 'puzzle', gid: 'mystery', game: 'Daily Mystery', art: 'murder', number: 64, q: 2, hints: 0, live: true, result: 'In progress', date: GS.today,
    figures: ['2 questions', 'No hints'], listTitle: 'Every question', share: null, lines: GS_MYSTERY_QS.slice() },
  'escape-live': { kind: 'puzzle', gid: 'escape', game: 'Escape', art: 'escape', live: true, result: 'In progress', date: GS.today, listTitle: 'Every move', share: null,
    lines: GS_SESSIONS['escape-week'].lines.slice(0, 4) },
  // Delve run 1 in progress, Wren the Rogue.
  'delve-live': { ...GS_SESSIONS.delve, live: true, result: 'In progress', figures: ['Threat 3/12', '8 rolls', '1 natural 20', 'HP 11/11'], tracks: { progress: 4, rooms: 5, threat: 3, threatMax: 12 }, lines: GS_DV_LIVE, reached: null, share: null, shareLines: null,
    hero: 'Wren the Rogue', hpMax: 11, threat: 3, sheet: { used: { Backstab: 1 }, insp: true } },
});
// The old earlier-room id reads this week's.
GS_SESSIONS['escape-0928'] = GS_SESSIONS['escape-week'];

export const gsLapsed = (gs) => gs.view !== 'pass' && !!gs.sub.hadPass;
// A session's date is its play's, written onto it from the play log (gs-history.jsx).
export const gsSessDate = (s) => s.date;

// The scroller: the phone frame's screen when forced-mobile, else the document.
const gsScroller = () => document.querySelector('.kit-phone-screen') || document.scrollingElement || document.documentElement;
export const gsScrollTop = () => { gsScroller().scrollTop = 0; };

// ---- Results: one formatter per game. Every result line (rows, session pages, the now card) is built here from the play's facts. ----
export const gsMis = (n) => (n === 0 ? 'no mistakes' : n === 1 ? '1 mistake' : n + ' mistakes');
export const GS_RESULT = {
  word: (r) => (r.ok ? 'Solved in ' + r.guesses + ' of 6' : 'Failed'),
  groups: (r) => (r.found === 4 ? 'All 4 groups, ' + gsMis(r.mistakes) : r.found + ' of 4 groups'),
  mystery: (r) => (r.ok ? 'Solved' : 'Failed'),
  // Escape has no lost outcome: every room can be finished. par: 'under par' | 'at par' | 'over par'.
  escape: (r) => 'Escaped in ' + r.min + ' min, ' + r.par,
  casebook: (r) => (r.ok ? 'Solved' : 'Wrong accusation'),
  // The setting's own ending words (The Goblin Warren beneath Ashford Mill).
  delve: (r) => ({ won: 'Elsie rescued', ritual: 'Too late: the ritual was completed', fell: 'Fell in the warren' })[r.end],
  // A day that ended without an ending reads as the app's unfinished status.
  hunter: (r) => (r.restarted ? 'Not finished' : 'Finished'),
};

// ---- Escape: what the room records beyond the moves, read by the session page and the now card (app/gs-escape.jsx). ----
// Par and the either-or exit are the room's; a mechanism's part count is the lock's. A typed lock answers only Open or Wrong.
export const GS_ES1_PAR = 30;
export const GS_ES1_CLOSED = { 'oak door lock': 'The chimney hatch' };
export const GS_ES_PARTS = { 'clock hands': 2 };
// Each finished play: its time and the minute each lock gave way, in the order they opened; esParts: a mechanism's
// wrong settings as [right, of], keyed by move. The in-progress play is this week's cut short, so it reads this week's minutes.
GS_SESSIONS['escape-week'].esTimes = { min: 28, opened: [6, 17, 19, 28] };
// Sample plays of this week's room, staged by Config → Escape (review.escape) and This edition: Hard. Exactly par counts as under.
GS_SESSIONS['escape-par'] = { ...GS_SESSIONS['escape-week'], result: GS_RESULT.escape({ min: 30, par: 'under par' }), share: GS_RESULT.escape({ min: 30, par: 'under par' }),
  figures: ['30 min, on par', '1 hint', '2 wrong tries'], shareLines: ['Escape No. 1 · escaped in 30 min, on par · 1 hint 💡 · 2 wrong tries'], esTimes: { min: 30, opened: [7, 18, 21, 30] } };
GS_SESSIONS['escape-over'] = { ...GS_SESSIONS['escape-week'], result: GS_RESULT.escape({ min: 41, par: 'over par' }), share: GS_RESULT.escape({ min: 41, par: 'over par' }),
  figures: ['41 min, over par', '4 hints', '7 wrong tries'], shareLines: ['Escape No. 1 · escaped in 41 min, over par · 4 hints 💡 · 7 wrong tries'],
  esTimes: { min: 41, opened: [9, 27, 34, 41] }, esParts: { 12: [1, 2] },
  lines: gsEsLines([
    ['Examined the workbench', GS_ES1.bench],
    ['Tried GEAR on the workbench drawer', 'Wrong'],
    ['Tried TIME on the workbench drawer', 'Wrong'],
    gsEsHint('workbench drawer', 1, 'Count the gears’ teeth, and read each count as a letter.'),
    ['Tried TICK on the workbench drawer', GS_ES1.drawer],
    ['Item', 'Picked up the brass winding key', 'A small brass key, its bow shaped like a clock face.'],
    ['Examined the case clock', GS_ES1.clock],
    ['Examined the glass cabinet', GS_ES1.cabinet],
    ['Tried 1479 on the cabinet lock', 'Wrong'],
    gsEsHint('cabinet lock', 1, 'Each watch has a day on its tag. The plate says what order to read them in.'),
    ['Tried 9147 on the cabinet lock', 'Wrong'],
    gsEsHint('cabinet lock', 2, 'Put the watches in order Monday to Thursday, then read the hour each one shows.'),
    ['Tried 4719 on the cabinet lock', 'Wrong'],
    gsEsHint('cabinet lock', 3, 'Monday 7, Tuesday 4, Wednesday 1, Thursday 9. The answer is 7419.'),
    ['Tried 7419 on the cabinet lock', GS_ES1.diary],
    ['Used the brass winding key on the case clock', 'Used up', GS_ES1.clockWound],
    ['Set the clock hands: Hour hand 4, Minute hand 45', '1 of 2 hands click into place.'],
    ['Set the clock hands: Hour hand 3, Minute hand 45', GS_ES1.hands],
    ['Examined the portrait', GS_ES1.portrait],
    ['Examined the fireplace', GS_ES1.fire],
    ['Examined the oak door', GS_ES1.door],
    ['Tried TICK on the oak door lock', 'Wrong'],
    ['Tried TOCK on the oak door lock', 'Out'],
  ]) };
// The hard play: a run built to the Escape spec's limits, to test every Escape surface. Six locks; the cabinet lock (typed)
// takes eighteen tries and all three hints; the clock hands (a mechanism) answer each setting with a count and need a hint.
// Out at 52 min, over par. All invented.
GS_SESSIONS['escape-hard'] = (() => {
  const L = []; const mv = (what, res, more) => L.push(more ? [what, res, more] : [what, res]);
  const tryOn = (lock, list, k, from) => { for (let i = 0; i < k; i += 1) mv('Tried ' + list[from + i] + ' on the ' + lock, 'Wrong'); };
  const setHands = (h, m, lit) => mv('Set the clock hands: Hour hand ' + h + ', Minute hand ' + m, lit + ' of 2 hands click into place.');
  mv('Examined the workbench', 'Gears of four sizes lie by the drawer.');
  tryOn('workbench drawer', GS_ES_WORDS4, 1, 0); mv('Tried TICK on the workbench drawer', 'The drawer slides open.');
  L.push(['Item', 'Picked up the brass winding key', 'A small brass key, its bow shaped like a clock face.']);
  mv('Examined the glass cabinet', 'Seven watches behind glass, each stopped.');
  tryOn('cabinet lock', GS_ES_DIG4, 9, 0); L.push(gsEsHint('cabinet lock', 1, 'Each watch has a day on its tag. The plate says what order to read them in.'));
  tryOn('cabinet lock', GS_ES_DIG4, 4, 9); L.push(gsEsHint('cabinet lock', 2, 'Put the watches in order Monday to Thursday, then read the hour each one shows.'));
  tryOn('cabinet lock', GS_ES_DIG4, 4, 13); L.push(gsEsHint('cabinet lock', 3, 'Monday 7, Tuesday 4, Wednesday 1, Thursday 9. The answer is 7419.'));
  mv('Tried 7419 on the cabinet lock', 'The cabinet door swings open.');
  mv('Examined the case clock', 'Its hands are stopped; the winding hole is empty.');
  mv('Used the brass winding key on the case clock', 'Used up', GS_ES1.clockWound);
  setHands(5, 30, 0); setHands(3, 30, 1); setHands(4, 45, 1);
  L.push(gsEsHint('clock hands', 1, 'Ezra’s diary page says which moment to set.'));
  setHands(3, 15, 1); mv('Set the clock hands: Hour hand 3, Minute hand 45', 'Both hands click home.');
  mv('Examined the writing desk', 'A three-dial lock on the lid.');
  tryOn('writing desk lock', GS_ES_DIG3, 1, 0); mv('Tried 731 on the writing desk lock', 'The lid lifts.');
  mv('Examined the map case', 'A five-letter lock under the railway map.');
  tryOn('map case lock', GS_ES_WORDS5, 3, 0); L.push(gsEsHint('map case lock', 1, 'The map marks one station in red.'));
  mv('Tried ROUTE on the map case lock', 'The drawer opens on a ticket.');
  mv('Examined the oak door', 'Four letters, and the ticket fits the slot.');
  tryOn('oak door lock', GS_ES_WORDS4, 1, 1); mv('Tried TOCK on the oak door lock', 'Out');
  const r = GS_RESULT.escape({ min: 52, par: 'over par' });
  return { ...GS_SESSIONS['escape-week'], result: r, share: r, figures: ['52 min, over par', '5 hints', '27 wrong tries'],
    shareLines: ['Escape No. 1 · escaped in 52 min, over par · 5 hints 💡 · 27 wrong tries'], lines: gsEsLines(L),
    esTimes: { min: 52, opened: [3, 21, 30, 34, 44, 52] }, esParts: { 25: [0, 2], 26: [1, 2], 27: [1, 2], 28: [1, 2] } };
})();

// A row's result in its forms, longest first (ListRow): the short form is the score alone, or the game's own short word.
export const gsForms = (s) => {
  let m; if (!s) return s;
  if ((m = /^(?:Solved|Escaped) in (.+)$/.exec(s))) return [s, m[1]];
  if ((m = /^All 4 groups, (.+)$/.exec(s))) return [s, m[1][0].toUpperCase() + m[1].slice(1)];
  if ((m = /^Found in (.+)$/.exec(s)) || (m = /^All 5 wrecks, (.+)$/.exec(s))) return [s, m[1]];
  if ((m = /^Solved, (.+)$/.exec(s))) return [s, m[1][0].toUpperCase() + m[1].slice(1)];
  if (/ (is|are) ready$/.test(s)) return [s, 'Ready'];
  if (/^Done (today|this week)$/.test(s) || /^(Every|Free) \w+ done$/.test(s)) return [s, 'Done'];
  return s;
};

