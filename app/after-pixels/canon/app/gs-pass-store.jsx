// After Pixels — the staging every overlay reads, the copy built from it, and a small review store.
// Loads after every app/ file it reads, and before gs-more-games.jsx and the other gs-pass-* files.

// ---- Review store: what the Config row and the states set. Not saved. ----
// bwDone: the Barrow's chapter 1 is finished (canon has nobody playing it). newEds: 'seed' reads the seed's played data;
// 'most' treats every game but Daily Word as having an unplayed current edition, so New for you can be seen full.
// lapsed: which Pass-ended player is staged. 'seed' as before; 'every' covers the four cases of the Pass-ended proposal (state "Pass ended: every case").
// freeNew: the seeded free player hasn't played today's Daily Word or Escape's first room, so their New for you
// holds two games. false: both played, as the seed had them.
import React from 'react';
import { GS_TODAY_PLAYED, GS_GAME_ORDER, GS_GAMES, gsLapsed, gsFresh, useGs, GS_NAME } from './gs-data.jsx';
import { lbWeekDone } from './gs-library.jsx';

export const CPR_DEFAULTS = { bwDone: false, newEds: 'seed', lapsed: 'seed', freeNew: true };
let CPR_WORD_PLAY;
const cprSyncSeed = (v) => { if (v.freeNew) delete GS_TODAY_PLAYED.free.word; else GS_TODAY_PLAYED.free.word = CPR_WORD_PLAY; };
export let cprStore;

export const useCpr = () => {
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); cprStore.subs.add(f); return () => cprStore.subs.delete(f); }, []);
  return cprStore.v;
};

export let CPR_STAGE;
export let CPR_SHOWN;
export const cprLocked = (gs, k) => CPR_STAGE[k] === 'pass' && gs.view !== 'pass';
let CPR_LAPSED;
export const cprLapsedOf = (id) => (CPR_LAPSED[cprStore.get().lapsed] || CPR_LAPSED.seed)[id] || { used: true, pass: true };
// Where a free first part stands for this player: 'pass' | 'none' | 'live' | 'done'.
export const cprFirstState = (gs, id) => {
  if (gs.view === 'pass') return id === 'barrow' && cprStore.get().bwDone ? 'done' : 'pass';
  if (gsLapsed(gs)) return cprLapsedOf(id).used ? 'done' : 'none';
  if (gsFresh(gs)) return 'none';
  if (id === 'barrow') return cprStore.get().bwDone ? 'done' : 'none';
  if (id === 'escape' && cprStore.get().freeNew) return 'none';
  if (!lbWeekDone(gs)) return 'live';
  return 'done';
};
// Has this player played the game at all. The seed has no played flag per edition, so New for you reads this.
export const cprPlayed = (gs, k) => {
  if (GS_GAMES[k].added) return false; // the games in gs-more-games.jsx: nobody has played them
  if (cprStore.get().newEds === 'most' && !gsFresh(gs)) return k === 'word';
  if (gsFresh(gs)) return false;
  if (k === 'barrow') { const s = cprFirstState(gs, 'barrow'); return s === 'live' || s === 'done'; }
  if (k === 'hunter') return gs.view === 'pass' || gsLapsed(gs);
  return true;
};

let CPR_NUM;
export const cprPassLine = () => {
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
export const CprPassEnd = ({ text, className }) => {
  const gs = useGs(); const head = text.slice(0, -'the Pass.'.length);
  return <p className={className}>{head}<button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</p>;
};

// ---- The play box's label and line, in the game's own word. ----
export const cprBoxCopy = (id) => {
  const k = CPR_STAGE[id]; const u = GS_GAMES[id].ed[0]; const U = u.toUpperCase();
  if (k === 'daily' && id === 'groups') return null; // not reached while Daily Groups is staged 'pass'; "a new groups" doesn't read, so canon's copy stays until worded
  if (k === 'daily') { const no = { word: 212, mystery: 64 }[id]; return ['TODAY’S ' + U + ' · #' + no, 'Free with an account. A new ' + u + ' every day.']; }
  if (k === 'first') return [id === 'barrow' ? 'CHAPTER 1' : 'THE FIRST ' + U, 'Free with an account. Every other ' + u + ' comes with the Pass.'];
  if (k === 'pass') return ['WITH THE PASS', (GS_NAME[id] || GS_GAMES[id].name) + ' comes with the Pass.'];
  return null;
};

export let GsPassStage;

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsPassStore() {
CPR_WORD_PLAY = GS_TODAY_PLAYED.free.word;
cprStore = {
  v: { ...CPR_DEFAULTS }, subs: new Set(),
  get() { return this.v; },
  set(p) { this.v = { ...this.v, ...p }; cprSyncSeed(this.v); this.subs.forEach((f) => f()); },
};
cprSyncSeed(cprStore.v);
// ---- Each game's access, read from GS_GAMES (gs-data.jsx), where it is held once: 'daily' | 'first' | 'pass'. ----
CPR_STAGE = Object.fromEntries(GS_GAME_ORDER.map((k) => [k, GS_GAMES[k].access]));
CPR_SHOWN = GS_GAME_ORDER.filter((k) => !!CPR_STAGE[k]);
// ---- A Pass-ended player, per game with a free first part (proposed, not ratified): used, the free first
// part is played; pass, they played the game with the Pass. Library shows "You stopped here" only when both; otherwise the free card.
// 'seed' is the default Pass-ended player. What the card says they played is read from the play record. ----
CPR_LAPSED = {
  seed: { escape: { used: true, pass: false }, delve: { used: true, pass: true }, barrow: { used: true, pass: true } },
  every: { escape: { used: false, pass: true }, barrow: { used: true, pass: true }, delve: { used: true, pass: false } },
};
// ---- Home's Pass paragraph, built from the staging: a third free daily reads "Three" with no copy edit. ----
CPR_NUM = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
GsPassStage = cprStore;
}
