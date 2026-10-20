// ============================================================================
// Playground (pass-upsell-proposal): the settings store, the display staging, the catalogue of items and
// variations the rail shows, and the one handle app/main.jsx reads (window.KitCandidate). Loads after every
// app/ file it reads and before app/main.jsx. Nothing here is accepted; the main build never loads it.
// ============================================================================
const PGU_KEY = 'pg_pass-upsell-proposal_v1';
// Every item opens on its first variation. sit_* is who is looking per section; game_* the game a section shows.
const PGU_DEFAULTS = {
  sec: 'A', item: 'A1', folded: false,
  A1: 1, A1daily: '2', A2: 1, A4: 1, A5: 1, A6: 1, B1: 1, B2: 1, B3: 1, C: 1, Cacct: 'kept', D1: 1, D2: 1, D3: 1, E: 1, Eshow: 'every', F1: 'discover', F2: 1, F2many: 'as', F2link: 1, G: 1, Glead: 1, H: 1,
  arrived: false, sit_A: 'out', sit_B: 'out', sit_C: 'new', sit_D: 'done', sit_F: 'free', sit_H: 'out', game_B: 'word', game_D: 'casebook', game_E: 'casebook',
};
const PGU_SAVED = ['A1rev', 'A1', 'A1daily', 'A2', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'C', 'Cacct', 'D1', 'D2', 'D3', 'E', 'Eshow', 'F1', 'F2', 'F2many', 'F2link', 'G', 'Glead', 'H', 'arrived', 'sec', 'item', 'folded',
  'sit_A', 'sit_B', 'sit_C', 'sit_D', 'sit_F', 'sit_H', 'game_B', 'game_D', 'game_E'];
const PguStore = (() => {
  let saved = {}; try { saved = JSON.parse(localStorage.getItem(PGU_KEY) || '{}') || {}; } catch (e) {}
  // A1 gained a new first choice (2026-10-16): a saved pick from before points at a shifted list, so it is dropped once.
  if (saved.A1rev !== 2) { delete saved.A1; saved.A1rev = 2; }
  // seen: games whose returning card has shown once (E, "once, then gone"). bwDone: the Barrow's chapter 1 is finished (D's Done). Neither is saved.
  let s = { ...PGU_DEFAULTS, A1rev: 2, ...saved, seen: {}, bwDone: false };
  const subs = new Set(); const apiSubs = new Set();
  const save = () => { try { const o = {}; PGU_SAVED.forEach((k) => { o[k] = s[k]; }); localStorage.setItem(PGU_KEY, JSON.stringify(o)); } catch (e) {} };
  return {
    get: () => s,
    set(p) { s = { ...s, ...p }; save(); subs.forEach((f) => f()); apiSubs.forEach((f) => f()); },
    sub(f) { subs.add(f); return () => subs.delete(f); },
    // The rail re-renders whenever the app does (bind), without re-rendering the app.
    subApi(f) { apiSubs.add(f); return () => apiSubs.delete(f); },
    ping() { apiSubs.forEach((f) => f()); },
    defaults() { const keep = { folded: s.folded, sec: s.sec, item: s.item }; s = { ...PGU_DEFAULTS, ...keep, seen: {}, bwDone: s.bwDone }; save(); subs.forEach((f) => f()); apiSubs.forEach((f) => f()); },
  };
})();
const usePgu = () => React.useSyncExternalStore(PguStore.sub, PguStore.get);

// ---- Display staging (the owner's framing: display data, never policy) ----
// Daily Word and Daily Mystery a free daily; the first edition of Escape, Casebook and Delve; the Barrow's chapter 1; 36,000 Summers Ago Pass-only.
// Daily Groups is not shown in this page's surfaces.
const PGU_STAGE = { word: 'daily', mystery: 'daily', escape: 'first', casebook: 'first', delve: 'first', barrow: 'first', hunter: 'pass' };
const PGU_SHOWN = ['word', 'mystery', 'escape', 'casebook', 'delve', 'barrow', 'hunter'];
// Escape restaged as a free first edition, in this page only (canon: gs-data.jsx:49, gs-game.jsx:51).
GS_GAMES.escape.free = false; GS_GAMES.escape.first = true; GS_GAMES.escape.tags = ['FIRST', 'Weekly', '10 min'];
GS_PAGES.escape.box = { ...GS_PAGES.escape.box, free: false, first: true, label: 'FIRST ROOM FREE', button: 'Play the first room',
  small: 'The first room is free with an account. Every other room comes with the After Pixels Pass.' };
delete GS_TODAY_PLAYED.free.escape;
// The Barrow's finished chapter 1 (D3): a record to open. Level, ring and loot are placeholders; canon holds no Barrow result.
GS_SESSIONS['pgu-barrow-ch1'] = { kind: 'puzzle', gid: 'barrow', game: GS_GAMES.barrow.name, art: 'barrow', result: 'Finished', date: 'Wednesday 14 October',
  figures: ['Level 4 of 5', '6 pieces of loot'], listTitle: 'Every roll', lines: GS_ROLLS.slice(0, 8), share: 'Chapter 1 finished · level 4 · 6 pieces of loot' };

// Where a free first part stands for this player: 'pass' | 'none' | 'live' | 'done'.
const pguFirstState = (gs, id) => {
  if (gs.view === 'pass') return 'pass';
  if (gsLapsed(gs)) return 'done';
  if (gsFresh(gs)) return 'none';
  if (!lbWeekDone(gs)) return 'live';
  if (id === 'barrow') return PguStore.get().bwDone ? 'done' : 'none';
  return 'done';
};
// Has this player ever played the game (Library's "Not played yet").
const pguPlayed = (gs, k) => {
  if (gsFresh(gs)) return false;
  if (k === 'barrow') { const s = pguFirstState(gs, 'barrow'); return s === 'live' || s === 'done'; }
  if (k === 'hunter') return gs.view === 'pass' || gsLapsed(gs);
  return true;
};

// ---- Who is looking, and getting the app there ----
const PGU_SITS = {
  out: 'Signed out', free: 'Free account', new: 'New account', pass: 'Pass holder', ended: 'Pass ended',
  notstarted: 'Not started', inprogress: 'In progress', done: 'Done',
};
const pguApi = () => window.KitCandidateApi;
// The situation the app is in now, read from its own state (the demo bar can change it too).
const pguSitNow = (gs) => {
  if (!gs) return null;
  if (gs.view === 'out') return 'out';
  if (gs.view === 'pass') return 'pass';
  if (gsLapsed(gs)) return 'ended';
  if (gsFresh(gs)) return 'new';
  return 'free';
};
const pguApplySit = (gs, sit) => {
  if (sit === 'out') { gs.setView('out'); gs.setReview({ week: 'done' }); return; }
  if (sit === 'pass') { gs.setView('pass'); gs.setUser({ fresh: false }); gs.setReview({ week: 'done' }); PguStore.set({ bwDone: false }); return; }
  gs.setView('free');
  gs.setUser({ fresh: sit === 'new' || sit === 'notstarted' });
  if (sit === 'ended') gs.setSub({ hadPass: true });
  gs.setReview({ week: sit === 'inprogress' ? 'live' : 'done' });
  PguStore.set({ bwDone: sit === 'done' || sit === 'ended' });
};
// Does the app already match a situation? D's three map onto free-account state.
const pguSitMatches = (gs, sit) => {
  const now = pguSitNow(gs);
  if (sit === 'notstarted') return now === 'new';
  if (sit === 'inprogress') return now === 'free' && !lbWeekDone(gs);
  if (sit === 'done') return now === 'free' && lbWeekDone(gs) && PguStore.get().bwDone;
  if (sit === 'free') return now === 'free' && lbWeekDone(gs);
  return now === sit;
};
// Scroll the nearest scroller to an element and ring it. Never scrollIntoView.
const pguScrollTo = (el) => {
  const sc = gsScroller(); const doc = sc === document.scrollingElement || sc === document.documentElement;
  const base = doc ? 0 : sc.getBoundingClientRect().top;
  sc.scrollTop = Math.max(0, el.getBoundingClientRect().top - base + sc.scrollTop - 96);
  // A card in a sideways row: bring it into the row's view too.
  const lock = el.querySelector('.pgu-lock');
  if (lock) { let p = lock.parentElement; while (p && p !== el.parentElement) { if (p.scrollWidth > p.clientWidth + 4 && /(auto|scroll)/.test(getComputedStyle(p).overflowX)) { const card = lock.closest('.mcp-card') || lock; p.scrollLeft = card.offsetLeft - p.offsetLeft - 16; break; } p = p.parentElement; } }
};
const pguRing = (sel, tries = 40) => {
  if (!sel) return;
  const el = document.querySelector(sel);
  if (!el) { if (tries > 0) setTimeout(() => pguRing(sel, tries - 1), 100); return; }
  pguScrollTo(el);
  el.classList.remove('pgu-ring'); void el.offsetWidth; el.classList.add('pgu-ring');
  setTimeout(() => el.classList.remove('pgu-ring'), 1600);
};
// Take the app to an item's surface: the situation, then the route, then ring the element. Pressed like a person would, never past the product.
const pguShow = (item, force) => {
  const gs = pguApi(); if (!gs || !item || !item.at) return;
  const v = PguStore.get(); const t = item.at(v);
  const sitOk = !t.sit || pguSitMatches(gs, t.sit);
  const r = gs.route; const here = r.name === t.route && (r.page || null) === ((t.extra && t.extra.page) || null) && (!t.extra || !t.extra.sid || r.sid === t.extra.sid)
    && (!t.extra || t.extra.played === undefined || r.played === t.extra.played);
  if (!sitOk) pguApplySit(gs, t.sit);
  if (force || !sitOk || !here) gs.go(t.route, t.extra || null, false);
  setTimeout(() => pguRing(t.ring), sitOk && here && !force ? 0 : 450);
};

// ---- The catalogue: sections, items, variations. The rail renders this; the overlays read the selections. ----
const PGU_DELVE_CAP = 'A NEW SCENE EVERY WEEK';
const PGU_H3_ROW_NAME = 'Your AI never asks you to pay';
// A1 choice 1 is built from the staging, not fixed text: the count of free dailies and whether any game has a free first part.
// A1daily '3' stages Daily Groups as a third free daily for this line only; no other surface reads it.
const PGU_NUM = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const pguA1Stage = (v) => (v.A1daily === '3' ? { ...PGU_STAGE, groups: 'daily' } : PGU_STAGE);
const pguPassLine = (v) => {
  const st = Object.values(pguA1Stage(v)); const n = st.filter((k) => k === 'daily').length; const first = st.includes('first');
  const parts = [];
  if (n) parts.push((PGU_NUM[n] || String(n)) + ' daily puzzle' + (n > 1 ? 's' : ''));
  if (first) parts.push(parts.length ? 'the start of select games' : 'The start of select games');
  const p1 = parts.length ? parts.join(' and ') + (parts.length > 1 || n > 1 ? ' come' : ' comes') + ' with your account.' : '';
  return { p1, lead: (parts.length ? 'Everything else' : 'Everything') + ' comes with ', link: 'the Pass', p2: '.', solo: true };
};
const PGU_A1 = {
  2: { p1: 'Two daily puzzles and the start of select games come with your account.', link: 'Everything else', p2: ' comes with the Pass.' },
  3: { p1: 'Start free: a puzzle every day, and the first part of select bigger games.', p2: 'The rest comes with the Pass.' },
  4: { p1: 'Your account opens the daily puzzles and the first room, case, scene or chapter of most bigger games.', p2: 'The Pass opens the rest.' },
  5: { p1: 'With an account you play the daily puzzles and the start of select games.', p2: 'The Pass opens everything else.' },
};
const PGU_A5 = { 1: ['CHAPTER 3', 'Chapter 3: coming soon'], 2: ['NEXT: CHAPTER 3', 'Next: chapter 3, coming soon'], 3: ['CHAPTER 3 · COMING SOON', 'Chapter 3 is coming soon'] };
const PGU_D2 = { 1: (u) => (u === 'chapter' ? 'Chapter 2 comes with the Pass.' : 'This week’s ' + u + ' comes with the Pass.'), 2: (u) => 'Every other ' + u + ' comes with the Pass.', 3: (u) => 'The next ' + u + ' comes with the Pass.', 4: () => 'Keep playing with the Pass.' };
const PGU_E = { 1: ['You stopped here. Everything you earned is still yours.', 'Get the Pass again'], 2: ['Your place is saved, and so is everything you earned.', 'Pick up with the Pass'],
  3: ['Welcome back. Your record and your achievements are all still here.', 'Get the Pass to carry on'] };
const PGU_C = {
  1: { head: 'YOUR ACCOUNT OPENS', label: true, daily: 'every day', units: { escape: 'the first room', casebook: 'the first case', delve: 'the first scene', barrow: 'chapter 1' },
    keep: 'Your results, history and achievements stay yours.', link: 'Everything else', rest: ' comes with the Pass.' },
  2: { head: 'Free with your account', daily: 'a new puzzle every day', units: { escape: 'room 1', casebook: 'case 1', delve: 'scene 1', barrow: 'chapter 1' }, link: 'Everything else', rest: ' comes with the Pass.' },
  3: { head: 'Start here', daily: 'play it every day', units: { escape: 'start with the first room', casebook: 'start with the first case', delve: 'start with the first scene', barrow: 'start at chapter 1' }, link: 'The rest', rest: ' comes with the Pass.' },
};
const PGU_C_ROWS = ['word', 'mystery', 'escape', 'casebook', 'delve', 'barrow'];
const PGU_LINK = { 1: (kind) => (kind === 'weekly' ? 'See your other weekly games' : 'See your other dailies'), 2: () => 'More to play today', 3: () => 'What else is open to you', 4: () => 'See what’s out for you to play' };
const PGU_G_LEAD = { 1: 'Install it in one click from your AI’s directory.', 2: 'Add it from the Claude or ChatGPT directory. It takes one click.', 3: 'Pick your AI. One click and you’re connected.' };
const pguBoxCopy = (id, v) => {
  const k = PGU_STAGE[id]; const u = (GS_GAMES[id].ed || ['edition'])[0]; const U = u.toUpperCase(); const bw = id === 'barrow';
  if (k === 'daily') {
    const no = { word: 212, mystery: 64 }[id]; const t = 'TODAY’S ' + U;
    return [null, [t + ' · NO. ' + no, 'Today’s ' + u + ', your streak and your achievements are free with an account.'], [t + ' · NO. ' + no, 'Free with an account. A new ' + u + ' every day.'],
      ['NO. ' + no + ' · TODAY', 'Play it free. Your streak and achievements come with your account.']][v.B1];
  }
  if (k === 'first') {
    const lab = bw ? 'CHAPTER 1 · FREE' : 'THE FIRST ' + U + ' · FREE';
    return [null, [lab, 'Every other ' + u + ' comes with the Pass.'], [lab, 'It’s free with an account. Every other ' + u + ' comes with the Pass.'],
      [bw ? 'START AT CHAPTER 1' : 'START WITH THE FIRST ' + U, 'Free with an account. The rest comes with the Pass.'],
      [bw ? 'CHAPTER 1' : 'THE FIRST ' + U, 'Free with an account. Every other ' + u + ' comes with the Pass.']][v.B2];
  }
  if (k === 'pass') {
    const n = GS_NAME.hunter;
    return [null, ['WITH THE PASS', n + ' comes with the Pass.'], ['WITH THE PASS', n + ' comes with the Pass, like everything past the free first parts.'],
      ['ONLY WITH THE PASS', n + ' is a Pass game. The Pass opens it, and every new game on its release day.'],
      ['WITH THE PASS', n + ' comes with the Pass.']][v.B3];
  }
  return null;
};

const pguQ = (s) => '“' + s + '”';
const PGU_GAME_LABEL = { word: 'Daily Word', mystery: 'Daily Mystery', escape: 'Escape', casebook: GS_NAME.casebook, delve: 'Delve', barrow: 'The Barrow', hunter: GS_NAME.hunter };
const PGU_SECTIONS = [
  { id: 'A', name: 'Home', sits: ['out', 'free', 'pass'], sitNote: 'Home is signed out only. Free and Pass show the cards on a product page’s More games, the same row.',
    items: [
      { id: 'A1', tag: 'decided', title: 'The Pass section says the deal, not the price',
        what: 'The section drops “£30 a year or £3 a month” and says what an account plays free and that everything else comes with the Pass, so a stranger learns what they get before what it costs. About the Pass stays.',
        note: 'The Free dailies switch changes choice 1 only.',
        sw: { key: 'A1daily', label: 'Free dailies', opts: [['2', 'Two, as staged'], ['3', 'Stage a third']] },
        vars: [
          { name: '“Two daily puzzles…”, from the game data', copy: 'Two daily puzzles and the start of select games come with your account. Everything else comes with the Pass.',
            stance: 'The brief’s line, one link (“the Pass”), no About the Pass. The count and “the start of select games” come from the game data, so a third free daily reads “Three” with no copy edit.',
            cost: 'Still names a number; it stays true only while the staging is right. With no free daily and no free first part the line has nothing to say.' },
          { name: '“Two daily puzzles…”', copy: PGU_A1[2].p1 + ' Everything else' + PGU_A1[2].p2, stance: 'The brief’s example shape, with “Everything else” as a link.', cost: '“Two” is a count, which the voice rules ban: it goes stale when a daily is added. Two links to the Pass page in one block.' },
          { name: '“Start free…”', copy: PGU_A1[3].p1 + ' ' + PGU_A1[3].p2, stance: 'Opens with the hero’s own words, Start free.', cost: 'Opens on a fragment before a colon; “bigger games” is new vocabulary.' },
          { name: '“…room, case, scene or chapter…”', copy: PGU_A1[4].p1 + ' ' + PGU_A1[4].p2, stance: 'Says exactly what the free part is.', cost: 'Lists today’s units, so a game with a new unit forces a copy edit; “most” must stay true as games arrive.' },
          { name: '“With an account you play…” (mine)', copy: PGU_A1[5].p1 + ' ' + PGU_A1[5].p2, stance: 'Plain, no count, no list of units, one Pass per line.', cost: '“Select games” doesn’t say which; each game’s page carries that.' },
        ],
        at: () => ({ sit: 'out', route: 'home', ring: '.pgu-A1' }) },
      { id: 'A2', tag: 'decided', title: 'The pay line moves under the Pass section',
        what: 'The line leaves the foot of Home and sits under the Pass section, word for word, because the owner values it and it belongs with the deal.',
        quote: GS.purchase,
        vars: [
          { name: 'Muted line under the link', stance: 'Reads as part of the section.', cost: 'The section then ends on the reassurance, not the link.' },
          { name: 'Small print under a thin rule', stance: 'Set apart as a promise, not a pitch.', cost: 'One more ruled line on the phone, and it can read as fine print.' },
        ],
        at: () => ({ sit: 'out', route: 'home', ring: '.pgu-A1' }) },
      { id: 'A3', tag: 'decided', title: 'The Pass section sits below the games',
        what: 'Games first, then the offer, because the product comes before the price. Home already does this (gs-home.jsx), so nothing changes here.',
        at: () => ({ sit: 'out', route: 'home', ring: '.pgu-A1' }) },
      { id: 'A4', tag: 'decided', title: 'A lock on the card image, only for Pass-only games',
        what: 'Only a Pass-only game is marked, with a lock on its art, and the Free and “First … free” chips come off the cards, because the tag row is crowded and marking the exception is quieter. A Pass holder sees no lock.',
        note: 'The lock is not pressable: a press anywhere on the card opens the game, whose page explains the Pass. Its accessible name is “Pass only”. Discover keeps its own cards (out of scope).',
        vars: [
          { name: 'Corner padlock', stance: 'The smallest mark; reads on every cover colour.', cost: 'No word, so it relies on the padlock being read as the Pass.' },
          { name: 'Pass pill', stance: 'Names the Pass, top right, away from the left-aligned title and text, so it stands out.', cost: 'Sits on the art’s top-right, where some covers place shapes.' },
          { name: 'Bottom strip, “Pass only”', stance: 'Says it in words, the owner’s wording.', cost: 'Covers the art’s base, where most covers stand their shapes.' },
        ],
        at: (v) => (v.sit_A === 'out' ? { sit: 'out', route: 'home', ring: '.pgu-A4' } : { sit: v.sit_A, route: 'word', ring: '.gs-row4' }) },
      { id: 'A5', tag: 'decided', title: 'The coming-soon card names the next chapter',
        what: 'The Barrow’s coming-soon card says chapter 3, because chapter 2 has been out since 13 October and a card calling it coming soon is wrong. The Barrow’s Library line follows. “Play chapter 1” stays.',
        vars: [
          { name: 'CHAPTER 3', copy: 'Card: CHAPTER 3. Library: Chapter 3: coming soon.', stance: 'Today’s shape, number moved on.', cost: 'Nothing says chapter 2 is out.' },
          { name: 'NEXT: CHAPTER 3', copy: 'Card: NEXT: CHAPTER 3. Library: Next: chapter 3, coming soon.', stance: 'Says it is the next one.', cost: '“Next” and the Coming soon chip say the same thing.' },
          { name: 'CHAPTER 3 · COMING SOON', copy: 'Card: CHAPTER 3 · COMING SOON. Library: Chapter 3 is coming soon.', stance: 'The fullest label.', cost: 'Repeats the Coming soon chip just below it.' },
        ],
        also: { label: 'Show the Library line', at: () => ({ sit: 'pass', route: 'barrow', extra: { page: 'record' }, ring: '.pgu-A5lib' }) },
        at: () => ({ sit: 'out', route: 'home', ring: '.mcp-soon:has(.mcp-soon-play)' }) },
      { id: 'A6', tag: 'open', title: 'Home hero',
        what: 'The owner reads the hero as fine today. He leans toward a caption change at most, and may want Delve there instead of Casebook. The hero chat is page UI, not the game’s own chat copy.',
        vars: [
          { name: 'Today', stance: 'Unchanged: Casebook, A NEW CASE EVERY WEEK.', cost: 'Nothing about paying in the hero; the pay line is under the Pass section.' },
          { name: 'Caption: your AI never asks you to pay', stance: 'Puts the promise where every visitor looks.', cost: 'The promise then shows twice on Home, here and under the Pass section, and the caption stops naming the game’s rhythm.' },
          { name: 'Delve in the hero', stance: 'Leads with an adventure: Delve’s field, ' + PGU_DELVE_CAP + ', and a sample chat (the turns from Delve’s product page).', cost: 'Delve has no hero motion drawn yet, so its art is still.' },
          { name: 'Chat ends on the Pass', stance: 'Shows what a game mentioning the Pass would look like.', cost: 'Breaks “nothing sells in chat”, beside a page that promises your AI never asks you to pay.' },
        ],
        at: () => ({ sit: 'out', route: 'home', ring: '.pgu-A6' }) },
    ] },
  { id: 'B', name: 'Product page', sits: ['out', 'free'], games: ['word', 'mystery', 'escape', 'casebook', 'delve', 'barrow', 'hunter'],
    lede: 'The play box’s label names what you can play now, and the line under it says what is free and what comes with the Pass, so a stranger who lands from a friend’s share arrives at today’s edition, never a dead one. The button, steps and Works with stay. Edition numbers are the seed’s, placeholders.',
    items: [
      { id: 'B1', tag: 'decided', title: 'A free daily', kinds: 'daily', what: 'Daily Word and Daily Mystery, each in its own noun.',
        vars: [
          { name: 'TODAY’S WORD · NO. 212', copy: 'Today’s word, your streak and your achievements are free with an account.', stance: 'Names today’s edition; says everything free once.', cost: 'The longest line.' },
          { name: 'Same label, short line', copy: 'Free with an account. A new word every day.', stance: 'Short; the rhythm does the work.', cost: 'Doesn’t say the streak and achievements are free.' },
          { name: 'NO. 212 · TODAY', copy: 'Play it free. Your streak and achievements come with your account.', stance: 'The number first, then today.', cost: 'Says free twice, two ways.' },
        ],
        at: (v) => ({ sit: v.sit_B, route: PGU_STAGE[v.game_B] === 'daily' ? v.game_B : 'word', ring: '.pgu-B' }) },
      { id: 'B2', tag: 'decided', title: 'A free first part', kinds: 'first', what: 'The first case, room or scene of a weekly game, and the Barrow’s chapter 1; the unit comes from the game’s data.',
        vars: [
          { name: 'THE FIRST CASE · FREE', copy: 'Every other case comes with the Pass.', stance: 'The label says free; the line names only what else there is.', cost: 'Doesn’t say an account is needed.' },
          { name: 'Same label, account named', copy: 'It’s free with an account. Every other case comes with the Pass.', stance: 'Says the account and the rest.', cost: 'Repeats “free” from the label.' },
          { name: 'START WITH THE FIRST CASE', copy: 'Free with an account. The rest comes with the Pass.', stance: 'The label is an invitation.', cost: '“The rest” is vague about what the rest is.' },
          { name: 'THE FIRST CASE, short line', copy: 'Free with an account. Every other case comes with the Pass.', stance: 'Follows B1’s short line: a plain label, “Free with an account.”, then one short fact. Free is said once.', cost: '“Free with an account.” is a fragment, as in B1. The Barrow reads CHAPTER 1 and “Every other chapter”.' },
        ],
        at: (v) => ({ sit: v.sit_B, route: PGU_STAGE[v.game_B] === 'first' ? v.game_B : 'casebook', ring: '.pgu-B' }) },
      { id: 'B3', tag: 'decided', title: 'Pass-only', kinds: 'pass', what: 'The label says it comes with the Pass and a few words say what the Pass opens; no price. Canon’s line “comes only with the After Pixels Pass” is replaced; the pay line after it stays.',
        vars: [
          { name: 'WITH THE PASS', copy: GS_NAME.hunter + ' comes with the Pass.', stance: 'A fact, the floor.', cost: 'Gives no reason to act.' },
          { name: 'WITH THE PASS, beside the free parts', copy: GS_NAME.hunter + ' comes with the Pass, like everything past the free first parts.', stance: 'Places it beside what is free.', cost: '“Free first parts” is platform vocabulary.' },
          { name: 'ONLY WITH THE PASS', copy: GS_NAME.hunter + ' is a Pass game. The Pass opens it, and every new game on its release day.', stance: 'Says what the Pass opens, new games too.', cost: 'Two sentences, and a promise about release days to keep.' },
          { name: 'WITH THE PASS, short line', copy: GS_NAME.hunter + ' comes with the Pass.', stance: 'B2 design 4’s pattern for a Pass-only game: a plain label, one short line, “the Pass” linked in it, no pay line. No “Free with an account.” because nothing here is free.', cost: 'The button above is also Get the Pass, so the box links to the Pass twice.' },
        ],
        at: (v) => ({ sit: v.sit_B, route: 'hunter', ring: '.pgu-B' }) },
    ] },
  { id: 'C', name: 'A new account’s Library', sits: ['new', 'free'], sitLabels: { new: 'Nothing played yet', free: 'Has played something' },
    sitNote: 'Once something is played, the card is gone and the Library is the usual Library.',
    items: [
      { id: 'C', tag: 'decided', title: 'The empty Library says once what the account opens',
        what: 'A free account that has played nothing opens its Library on one card listing what it plays, because that is when someone who just signed up wants to know. A game you can’t play isn’t listed, so 36,000 Summers Ago has no row.',
        vars: [
          { name: 'YOUR ACCOUNT OPENS', copy: 'Rows: every day, the first room, the first case, the first scene, chapter 1. Foot: Your results, history and achievements stay yours. Everything else comes with the Pass.', stance: 'The account is the subject; reassures about records.', cost: 'Two foot lines.' },
          { name: 'Free with your account', copy: 'Rows: a new puzzle every day, room 1, case 1, scene 1, chapter 1. Foot: Everything else comes with the Pass.', stance: 'Short rows.', cost: '“Case 1” reads as a number, not the first case.' },
          { name: 'Start here', copy: 'Rows: play it every day, start with the first room, case or scene, start at chapter 1. Foot: The rest comes with the Pass.', stance: 'An invitation.', cost: 'Every row starts with a verb, so the list reads busier.' },
          { name: 'The usual Library, one line', copy: 'The Library as it is, with one line under the list: Everything else comes with the Pass. (“the Pass” is the link.)', stance: 'Adds only the Pass line, linked as in A1. Rows, search and filters are the usual Library’s; no buttons are added.', cost: 'Doesn’t say which part of each game is free; each row and game page carries that.' },
        ],
        at: (v) => ({ sit: v.sit_C, route: 'library', ring: '.pgu-C' }) },
      { id: 'Cacct', tag: 'open', title: 'The Account page’s sentence',
        what: 'Whether the Account page’s one sentence about what an account opens is replaced by the same list, so the deal lives in one place.',
        sw: { key: 'Cacct', label: 'Account page', opts: [['kept', 'Sentence kept'], ['list', 'Replaced by the list']] },
        at: () => ({ sit: 'free', route: 'account', ring: '.gs-acct-cards > :first-child' }) },
    ] },
  { id: 'D', name: 'A free first part', sits: ['notstarted', 'inprogress', 'done', 'pass'], games: ['casebook', 'delve', 'escape'],
    sitNote: 'Escape is restaged here as a free first edition, as the staging says.',
    items: [
      { id: 'D1', tag: 'decided', title: 'Play alone before and during; Share and the Pass once done',
        what: 'Before and during the free first part the card shows Play alone; once it is done it shows Share and the Pass offer, every time it is seen, because finishing is when the Pass is welcome, not over the Play button.',
        vars: [
          { name: 'Two buttons (today’s done card)', stance: 'Share and Get the Pass side by side, the line beside them.', cost: 'Two buttons compete; at 390px they stack full width.' },
          { name: 'Share, then a Pass link', stance: 'One button; Get the Pass is a link after the Pass line.', cost: 'The Pass is quieter and can be missed.' },
          { name: 'One sentence under the result', stance: 'The Pass reads as part of the result, with an inline link.', cost: 'The Pass is read before Share.' },
          { name: 'Share, then the line with the Pass linked', stance: 'Share and the record link as they are, then D2’s line with only “the Pass” linked, as in A1, B and C. No button.', cost: 'The Pass is a link in a muted line, so it is quieter than a button.' },
        ],
        at: (v) => ({ sit: v.sit_D, route: v.game_D, extra: { page: 'record' }, ring: '.pgu-first' }) },
      { id: 'D2', tag: 'open', title: 'The Pass line’s wording',
        what: 'The owner says naming the Pass once, when the free part is done, is really important; the fading card was too much. No dismiss, no first-visit flag.',
        vars: [
          { name: '“This week’s case…”', copy: 'This week’s case comes with the Pass.', stance: 'Specific and timely.', cost: 'True only until earlier cases can be played. The Barrow has no week, so it reads “Chapter 2 comes with the Pass.”' },
          { name: '“Every other case…”', copy: 'Every other case comes with the Pass.', stance: 'Always true.', cost: 'Generic.' },
          { name: '“The next case…”', copy: 'The next case comes with the Pass.', stance: 'Points at what comes next.', cost: 'Implies cases are played in order.' },
          { name: '“Keep playing with the Pass.”', copy: 'Keep playing with the Pass.', stance: 'True for every game and every week; no game word, no count. With D1 or D3 design 4, “the Pass” is the link.', cost: 'Doesn’t say what playing on gets you.' },
        ],
        at: (v) => ({ sit: 'done', route: v.game_D, extra: { page: 'record' }, ring: '.pgu-first' }) },
      { id: 'D3', tag: 'open', title: 'The Barrow, chapter 1 done',
        what: 'The same shape on the Barrow: the record first, then Share and the Pass, with D2’s line in “chapter”. Level 4, the bronze ring and the loot are placeholders; the achievements below are canon.',
        note: 'A real chapter-done card needs: finished or not, the level reached of five, what was carried out (loot, named items), and a run record to open.',
        vars: [
          { name: 'Two buttons', stance: 'As D1, design 1.', cost: 'Two buttons compete.' },
          { name: 'Share, then a Pass link', stance: 'As D1, design 2.', cost: 'The Pass is quieter.' },
          { name: 'One sentence under the result', stance: 'As D1, design 3.', cost: 'The Pass is read before Share.' },
          { name: 'Share, then the line with the Pass linked', stance: 'As D1, design 4.', cost: 'The Pass is quieter than a button.' },
        ],
        at: () => ({ sit: 'done', route: 'barrow', extra: { page: 'record' }, ring: '.pgu-first' }) },
    ] },
  { id: 'E', name: 'A returning player, Pass ended', games: ['casebook', 'delve', 'barrow'],
    sitNote: 'Shown as a player whose Pass ended. Their place and records are kept; the achievements card is canon.',
    items: [
      { id: 'E', tag: 'decided', title: 'One quiet card on the game they last played',
        what: 'A player whose Pass has ended sees one card saying their place and everything earned are kept, more elegant than a plain Get the Pass, because nothing is deleted when a Pass ends. The link-only second showing is dropped.',
        vars: [
          { name: '“You stopped here…”', copy: PGU_E[1][0] + ' Link: ' + PGU_E[1][1] + '.', stance: 'States the fact plainly.', cost: '“Here” leans on the label to say where.' },
          { name: '“Your place is saved…”', copy: PGU_E[2][0] + ' Link: ' + PGU_E[2][1] + '.', stance: 'Leads with what is kept.', cost: '“Pick up” is softer and vaguer about what the Pass is.' },
          { name: '“Welcome back…”', copy: PGU_E[3][0] + ' Link: ' + PGU_E[3][1] + '.', stance: 'A greeting.', cost: 'The longest; assumes they have been away.' },
        ],
        sw: { key: 'Eshow', label: 'Card shows', tag: 'brief', opts: [['every', 'Every visit'], ['once', 'Once, then gone']] },
        at: (v) => ({ sit: 'ended', route: v.game_E, extra: { page: 'record' }, ring: '.pgu-E, .pgu-first' }) },
    ] },
  { id: 'F', name: 'Where a signed-in player lands', sits: ['free', 'new', 'pass'],
    sitNote: 'A new account sees C’s card: every game it opens, none played.',
    items: [
      { id: 'F1', tag: 'decided', tagNote: 'on a condition', title: 'Signed-in players land on Library',
        what: 'After signing in a player lands on Library instead of Discover, because Library is theirs. The owner agreed on a condition: Library carries the games they haven’t played, which Discover does today. F2 is that condition.',
        sw: { key: 'F1', label: 'After signing in', opts: [['discover', 'Discover (today)'], ['library', 'Library']] },
        at: () => ({ sit: 'out', route: 'signin', ring: '.gs-root form, .gs-root main' }) },
      { id: 'F2', tag: 'open', title: 'Library as the place to go next',
        what: 'Library shows what is open and not yet played. A game you can’t play stays off the list. Joe leans toward unplayed games over “out today or this week”.',
        vars: [
          { name: 'Not played yet, on top', stance: 'Today’s rows, with what is unplayed grouped first.', cost: 'On a phone the group pushes your games down.' },
          { name: 'Tiles for the unplayed', stance: 'Unplayed games as the design system’s GameTile in one row that swipes sideways (CardRow), with Previous and Next once it overflows; played games stay rows.', cost: 'Two kinds of item on one page; GameTile has no state slot.' },
          { name: 'One line and a filter', stance: 'A single link at the top opens the Library filtered to unplayed.', cost: 'Nothing unplayed is visible until it is pressed.' },
        ],
        sw: { key: 'F2many', label: 'Unplayed games', opts: [['as', 'As staged'], ['many', 'Most not played']] },
        at: (v) => ({ sit: v.sit_F, route: 'library', ring: '.pgu-F2' }) },
      { id: 'F2link', tag: 'open', title: 'The link from a finished daily or weekly',
        what: 'An elegant link, not a card, that opens Library already filtered to what the player hasn’t played. Library gets a new Played filter beside Genre and Schedule, taken from the route, so the link lands with it on and clearable under Filters.',
        vars: [
          { name: '“See your other dailies”', copy: 'Weekly: “See your other weekly games”.', stance: 'Names the kind of game, and filters to that schedule too.', cost: 'Under the staging a free player has usually played the other dailies, so it often lands on an empty list.' },
          { name: '“More to play today”', stance: 'Short, about now.', cost: '“Today” is wrong on a weekly.' },
          { name: '“What else is open to you”', stance: 'Says what you can open.', cost: 'Abstract.' },
          { name: '“See what’s out for you to play”', stance: 'One link for daily and weekly games alike; “out” reads as a current release, which is what each game opens on.', cost: 'Lands on an empty list when a free player has played everything open to them.' },
        ],
        also: { label: 'Show it on a finished Casebook case', at: () => ({ sit: 'free', route: 'casebook', extra: { page: 'record' }, ring: '.pgu-nextlink' }) },
        at: () => ({ sit: 'free', route: 'word', extra: { page: 'record' }, ring: '.pgu-nextlink' }) },
    ] },
  { id: 'G', name: 'Connecting',
    items: [
      { id: 'G', tag: 'decided', title: 'A one-click install from the directories',
        what: 'Players connect with a one-click install from the Claude and ChatGPT directories, not by pasting an address, because one click works on a phone and pasting does not. The address and steps stay for other assistants. The buttons open the existing placeholder destinations.',
        vars: [
          { name: 'Two install buttons', stance: 'Add to Claude and Add to ChatGPT, side by side, first.', cost: 'Two large buttons push other assistants down the page.' },
          { name: 'A list of directories', stance: 'Rows that can grow as directories are added; other assistants behind a quiet link.', cost: 'The steps for other assistants are one tap further.' },
        ],
        at: () => ({ route: 'connect', ring: '.pgu-G' }) },
      { id: 'Glead', tag: 'decided', title: 'The page’s lead line',
        what: 'One line under How it works, with either design.',
        vars: [
          { name: '“Install it in one click…”', copy: PGU_G_LEAD[1], stance: 'Says where and how fast.', cost: '“Your AI’s directory” assumes they know the word.' },
          { name: '“Add it from the Claude or ChatGPT directory…”', copy: PGU_G_LEAD[2], stance: 'Names both directories.', cost: 'Names two AIs, so another directory means a copy edit.' },
          { name: '“Pick your AI…”', copy: PGU_G_LEAD[3], stance: 'Short and direct.', cost: 'Doesn’t say where the one click happens.' },
        ],
        at: () => ({ route: 'connect', ring: '.pgu-Glead' }) },
    ] },
  { id: 'H', name: 'The Pass page', sits: ['out', 'free'],
    items: [
      { id: 'H', tag: 'open', title: 'Where the pay line goes',
        what: 'The line “' + GS.purchase + '” leaves the play box, because the box is about playing. The owner wants it on the Pass page instead, placed quietly. Three places to put it.',
        vars: [
          { name: 'Under the price', copy: GS.purchase, stance: 'One small line under the price and Choose a plan, where someone is deciding to pay.', cost: 'Only signed-out and free players see it; a Pass holder’s page has no price.' },
          { name: 'On Start your Pass (not on Pricing)', copy: GS.purchase, stance: 'Under Get the Pass on the plan picker, the last step before checkout.', cost: 'Not on the Pricing page, so it misses the brief. Show it in the app stays on Pricing; this choice changes nothing there.' },
          { name: 'A row in What you get', copy: 'Row: ' + PGU_H3_ROW_NAME + '. Under it: Purchases only ever happen on this site. Ticked for Free and Pass.', stance: 'Sits with the other things you get, and everyone sees it, Pass holders too.', cost: 'The line is split and reworded to fit a row; the row name is mine. A tick in both columns compares nothing.' },
        ],
        at: (v) => ({ sit: v.sit_H || 'out', route: 'pass', ring: v.H === 2 ? '.gs-pass-page' : '.pgu-H' }) },
    ] },
];
const PGU_ITEMS = {}; PGU_SECTIONS.forEach((s) => s.items.forEach((i) => { PGU_ITEMS[i.id] = { ...i, sec: s.id }; }));

// ---- The one handle app/main.jsx reads (skills/candidate-build): bind gets the app's context object each render. ----
const PGU_AUTH = ['signup', 'signin', 'verify', 'username', 'recover', 'returning'];
window.KitCandidate = {
  bind(api) {
    window.KitCandidateApi = api;
    // F1: where signing in lands. Library when the switch says so; Discover (today) otherwise.
    const sIn = api.signedIn; api.signedIn = (how, next) => sIn(how, next || (PguStore.get().F1 === 'library' ? 'library' : undefined));
    const sdv = api.setDemoView;
    api.setDemoView = (v) => {
      if (v !== 'out' && PguStore.get().F1 === 'library' && (api.route.name === 'home' || PGU_AUTH.includes(api.route.name))) { api.setView(v); api.go('library', null, v); return; }
      sdv(v);
    };
    setTimeout(PguStore.ping, 0);
  },
};

Object.assign(window, { PguStore, usePgu, PGU_STAGE, PGU_SHOWN, pguFirstState, pguPlayed, PGU_SITS, pguSitNow, pguApplySit, pguRing, pguShow, pguQ, PGU_GAME_LABEL,
  PGU_A1, pguPassLine, PGU_A5, PGU_D2, PGU_E, PGU_C, PGU_C_ROWS, PGU_LINK, PGU_G_LEAD, PGU_DELVE_CAP, pguBoxCopy, PGU_SECTIONS, PGU_ITEMS, PGU_DEFAULTS });
