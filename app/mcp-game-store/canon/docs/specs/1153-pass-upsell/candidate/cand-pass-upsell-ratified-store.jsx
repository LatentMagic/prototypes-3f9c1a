// Candidate (pass-upsell-ratified): the staging every overlay reads, the copy built from it, and a small review store.
// Loads after every app/ file it reads and before the other cand-pass-upsell-ratified-* files. Nothing here is accepted.

// ---- Review store: what the Config row and the states set. Not saved. ----
// bwDone: the Barrow's chapter 1 is finished (canon has nobody playing it). newEds: 'seed' reads the seed's played data;
// 'most' treats every game but Daily Word as having an unplayed current edition, so New for you can be seen full.
const CPR_DEFAULTS = { bwDone: false, newEds: 'seed' };
const cprStore = {
  v: { ...CPR_DEFAULTS }, subs: new Set(),
  get() { return this.v; },
  set(p) { this.v = { ...this.v, ...p }; this.subs.forEach((f) => f()); },
};
const useCpr = () => {
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); cprStore.subs.add(f); return () => cprStore.subs.delete(f); }, []);
  return cprStore.v;
};

// ---- Display staging (owner, 2026-10-15: display data, never policy). Daily Word, Daily Groups and Daily Mystery a free daily
// (Groups restored by the owner, 2026-10-16); the first edition of Escape, Casebook and Delve; the Barrow's chapter 1;
// 36,000 Summers Ago Pass-only. ----
const CPR_STAGE = { word: 'daily', groups: 'daily', mystery: 'daily', escape: 'first', casebook: 'first', delve: 'first', barrow: 'first', hunter: 'pass' };
const CPR_SHOWN = GS_GAME_ORDER.filter((k) => !!CPR_STAGE[k]);
// A game with editions (daily, weekly, chapters). A standalone such as 36,000 Summers Ago has none.
const cprEditions = (k) => k === 'barrow' || !!gsRhythm(k);
const cprLocked = (gs, k) => CPR_STAGE[k] === 'pass' && gs.view !== 'pass';
// Escape restaged as a free first edition, in this page only (canon: gs-data.jsx, gs-game.jsx).
GS_GAMES.escape.free = false; GS_GAMES.escape.first = true; GS_GAMES.escape.tags = ['FIRST', 'Weekly', '10 min'];
GS_PAGES.escape.box = { ...GS_PAGES.escape.box, free: false, first: true, label: 'FIRST ROOM FREE', button: 'Play the first room',
  small: 'The first room is free with an account. Every other room comes with the [Platform] Pass.' };
delete GS_TODAY_PLAYED.free.escape;
// The Barrow's coming-soon card names chapter 3 (owner, 2026-10-16). On merge this is a fix to GS_SOON in app/gs-data.jsx.
GS_SOON.forEach((g, i) => { if (g.route === 'barrow') GS_SOON[i] = { ...g, label: 'CHAPTER 3' }; });
// The Barrow's finished chapter 1: a record to open. Level, ring and loot are placeholders; canon holds no Barrow result.
GS_SESSIONS['cpr-barrow-ch1'] = { kind: 'puzzle', gid: 'barrow', game: GS_GAMES.barrow.name, art: 'barrow', result: 'Finished', date: 'Wednesday 14 October',
  figures: ['Level 4 of 5', '6 pieces of loot'], listTitle: 'Every roll', lines: GS_ROLLS.slice(0, 8), share: 'Chapter 1 finished · level 4 · 6 pieces of loot' };

// Where a free first part stands for this player: 'pass' | 'none' | 'live' | 'done'.
const cprFirstState = (gs, id) => {
  if (gs.view === 'pass') return 'pass';
  if (gsLapsed(gs)) return 'done';
  if (gsFresh(gs)) return 'none';
  if (id === 'barrow') return cprStore.get().bwDone ? 'done' : 'none';
  if (!lbWeekDone(gs)) return 'live';
  return 'done';
};
// Has this player played the game at all. The seed has no played flag per edition, so New for you reads this.
const cprPlayed = (gs, k) => {
  if (cprStore.get().newEds === 'most' && !gsFresh(gs)) return k === 'word';
  if (gsFresh(gs)) return false;
  if (k === 'barrow') { const s = cprFirstState(gs, 'barrow'); return s === 'live' || s === 'done'; }
  if (k === 'hunter') return gs.view === 'pass' || gsLapsed(gs);
  return true;
};

// ---- Home's Pass paragraph, built from the staging (owner, 2026-10-16): a third free daily reads "Three" with no copy edit. ----
const CPR_NUM = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const cprPassLine = () => {
  const st = Object.values(CPR_STAGE); const n = st.filter((k) => k === 'daily').length; const first = st.includes('first');
  const parts = [];
  if (n) parts.push((CPR_NUM[n] || String(n)) + ' daily puzzle' + (n > 1 ? 's' : ''));
  if (first) parts.push(parts.length ? 'the start of select games' : 'The start of select games');
  const p1 = parts.length ? parts.join(' and ') + (parts.length > 1 || n > 1 ? ' come' : ' comes') + ' with your account. ' : '';
  return { p1, lead: (parts.length ? 'Everything else' : 'Everything') + ' comes with ' };
};
// The line with "the Pass" as its only link.
const CprPassPara = ({ className }) => {
  const gs = useGs(); const c = cprPassLine();
  return <p className={className}>{c.p1}{c.lead}<button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</p>;
};
// A sentence ending "…the Pass." with "the Pass" linked.
const CprPassEnd = ({ text, className }) => {
  const gs = useGs(); const head = text.slice(0, -'the Pass.'.length);
  return <p className={className}>{head}<button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</p>;
};

// ---- The play box's label and line (owner, 2026-10-16), in the game's own word. ----
const cprBoxCopy = (id) => {
  const k = CPR_STAGE[id]; const u = (GS_GAMES[id].ed || ['edition'])[0]; const U = u.toUpperCase();
  if (k === 'daily' && id === 'groups') return null; // "a new groups" doesn't read; the play box keeps canon's copy until worded
  if (k === 'daily') { const no = { word: 212, mystery: 64 }[id]; return ['TODAY’S ' + U + ' · NO. ' + no, 'Free with an account. A new ' + u + ' every day.']; }
  if (k === 'first') return [id === 'barrow' ? 'CHAPTER 1' : 'THE FIRST ' + U, 'Free with an account. Every other ' + u + ' comes with the Pass.'];
  if (k === 'pass') return ['WITH THE PASS', GS_NAME[id] + ' comes with the Pass.'];
  return null;
};

Object.assign(window, { CandPUR: cprStore, useCpr, CPR_DEFAULTS, CPR_STAGE, CPR_SHOWN, cprEditions, cprLocked, cprFirstState, cprPlayed, cprPassLine, CprPassPara, CprPassEnd, cprBoxCopy });
