// ============================================================================
// After Pixels — Where, Chain, Salvage and Common: four Pass-only daily puzzles, built as Daily Groups is.
// Loads after gs-library.jsx and before gs-puzzles-library.jsx, which spreads DP_PZ into PZ and calls dpSession for each earlier edition.
// Here: each game's card, cover and motion art, product page, chats, results, today's and in-progress plays, the templates the
// earlier plays are drawn from, and the staged states. Every play is SAMPLE; distances are approximate.
// Each game is played through text in the player's own AI: the chats carry text and a plain text board, never a picture.
// ============================================================================
import React from 'react';
import { GS_NAME, GS_GAMES, gsAccess, GS_GAME_ORDER, GS_ART, GS_SVG, GS_RESULT, GS_SESSIONS, GS, GS_TODAY_PLAYED, GS_ED_SIDS } from './gs-data.jsx';
import { GS_ART_LOCAL, I } from './gs-parts.jsx';
import { GS_CHATS, gscU, gscAi } from './gs-chats.jsx';
import { GS_PAGES, GS_STEP_CONNECT } from './gs-game.jsx';
import { PZ } from './gs-puzzles-library.jsx';

export const DP_IDS = ['where', 'chain', 'salvage', 'common'];
const DP_NO = 21; // today's edition of Where, Chain and Salvage: the three games are three weeks old in the seed
const CM_NO = 7; // today's edition of Common, the newest game: No. 7, the day its product page's chat pictures show
 // working titles







// ---- Results ----
const dpWrong = (n) => (n === 0 ? 'no wrong guesses' : n === 1 ? '1 wrong guess' : n + ' wrong guesses');


// ---- Where. A play from a template: { a: answer, g: [[country, km]], hint }. Distance is border to border, to the nearest 10 km;
// 0 means the two share a border. The one hint is the compass direction, centre to centre, from the latest guess. Only UN member states count. ----
const dpKm = (n) => n.toLocaleString('en-GB') + ' km';
// Share marks, one per guess: 1,000 km or more ○, 100 to 990 km ◐, under 100 km (a shared border included) ●, found ◉.
const dpWhMark = (km) => (km >= 1000 ? '○' : km >= 100 ? '◐' : '●');
const dpWhere = (t, ok) => {
  const rows = t.g.map(([c, km]) => [c, km, dpWhMark(km)]);
  if (ok) rows.push([t.a, null, '◉']);
  // A line says what the guess was: its country, then how far it lies from the hidden one (a shared border is not a distance).
  const far = (km) => (km === null ? 'Found it' : km === 0 ? 'Shares a border with the hidden country' : dpKm(km) + ' from the hidden country, border to border');
  const lines = rows.map((r, k) => ['Guess ' + (k + 1), r[0], far(r[1])]);
  const h = t.hint && /^From (.+), the country lies (.+)$/.exec(t.hint);
  if (h) lines.splice(lines.length - 1, 0, ['Hint', 'The hidden country lies ' + h[2] + ' of ' + h[1]]);
  if (!ok) lines.push(['Answer', t.a]);
  return { lines, guesses: rows.length, hints: t.hint ? 1 : 0, marks: rows.map((r) => r[2]).join(' ') };
};
const dpWhHead = (n, r, ok) => 'Where #' + n + ' · ' + (ok ? 'found in ' + r.guesses + ' of 6' : 'not found') + (r.hints ? ' · 1 hint' : '');
let WH_TODAY;
let WH_OK;
let WH_FAIL;

let DP_NUM;
const dpChain = (t) => {
  const last = t.w.length - 1; const pre = t.w.map(() => 1); const res = t.w.map(() => null); const miss = t.w.map(() => 0);
  // Ends, then a line per guess: the word it was for, what it was, and what the game showed back. Only the guess's own result is said.
  const lines = [['Ends', t.w[0] + ' to ' + t.w[last], DP_NUM[t.w.length] + ' words in all']];
  t.p.forEach(([guess, k], j) => {
    let note;
    if (guess === t.w[k]) { res[k] = 'found'; note = ['Right']; }
    else { miss[k] += 1; pre[k] += 1; note = pre[k] >= t.w[k].length ? (res[k] = 'given', ['Wrong, so it was given away', 'The word was ' + t.w[k]]) : ['Wrong', 'Now shows ' + t.w[k].slice(0, pre[k])]; }
    lines.push(['Guess ' + (j + 1), guess, 'Word ' + (k + 1), ...note]);
  });
  const hidden = t.w.length - 2; const given = res.filter((r) => r === 'given').length; const found = res.filter((r) => r === 'found').length;
  // Share marks, one per word, ends included: found first time ●, found after a wrong guess ◐, given away ○.
  const marks = t.w.map((_, k) => (res[k] === 'given' ? '○' : miss[k] ? '◐' : '●')).join('—');
  return { lines, words: t.w.length, hidden, found, given, wrong: miss.reduce((a, b) => a + b, 0), marks };
};
const dpChResult = (r) => GS_RESULT.chain(r.given ? { given: true, found: r.found, of: r.hidden } : { wrong: r.wrong });
const dpChHead = (n, r) => 'Chain #' + n + ' · ' + (r.given ? r.found + ' of ' + r.hidden + ' words found' : 'solved · ' + dpWrong(r.wrong));
// Chain's sample plays, read by its session body (gs-chain.jsx) too.
export let CH_TODAY;
export let CH_OK;
export let CH_FAIL;
// Today's chain on Config's Hard: every hidden word found and none given away, but only just. 18 guesses, 14 of them wrong (the most a win allows: a word of n letters is given away on its (n-1)th wrong guess).
// Each wrong guess starts with the letters the game was showing for that word.
export let CH_HARD;

let SV_COLS;
const svCell = ([x, y]) => SV_COLS[x] + (y + 1);
const svAt = (ships) => { const at = {}; ships.forEach((s, i) => s.forEach(([x, y]) => { at[x + ',' + y] = i; })); return at; };
// A play replayed from its dives: [[cell, 'miss' | 'hit' | 'sunk', length]].
const svReplay = (ships, order) => {
  const at = svAt(ships); const hits = ships.map(() => 0);
  return order.map((c) => { const i = at[c[0] + ',' + c[1]]; if (i == null) return [c, 'miss']; hits[i] += 1; return hits[i] === ships[i].length ? [c, 'sunk', ships[i].length] : [c, 'hit']; });
};
const svLines = (log, hint) => {
  const lines = log.map(([c, r, n], k) => ['Dive ' + (k + 1), svCell(c), r === 'miss' ? 'Miss' : r === 'hit' ? 'Hit' : 'Sunk: the wreck of ' + n]);
  if (hint) lines.splice(hint.at, 0, ['Hint', hint.what, hint.said]);
  return lines;
};
// Share marks, one per dive in order, ten to a line: miss ○, hit ✕, the dive that sinks a wreck ■. No square is named.
const svMarks = (log) => { const m = log.map(([, r]) => (r === 'miss' ? '○' : r === 'hit' ? '✕' : '■')).join(''); const out = []; for (let k = 0; k < m.length; k += 10) out.push(m.slice(k, k + 10)); return out; };
// The board as the AI redraws it after every dive: not dived ·, miss ○, hit ✕, a sunk wreck ■.
const svBoard = (ships, log) => {
  const at = svAt(ships); const mark = {}; const sunk = new Set();
  log.forEach(([[x, y], r]) => { mark[x + ',' + y] = r === 'miss' ? '○' : '✕'; if (r === 'sunk') sunk.add(at[x + ',' + y]); });
  ships.forEach((s, i) => { if (sunk.has(i)) s.forEach(([x, y]) => { mark[x + ',' + y] = '■'; }); });
  return ['  A B C D E F G H', ...[0, 1, 2, 3, 4, 5, 6, 7].map((y) => (y + 1) + ' ' + [0, 1, 2, 3, 4, 5, 6, 7].map((x) => mark[x + ',' + y] || '·').join(' '))].join('\n');
};
const svSunk = (log) => log.filter((l) => l[1] === 'sunk').length;
const dpSvHead = (n, log, hint) => 'Salvage #' + n + ' · ' + (svSunk(log) === 5 ? 'all 5 wrecks' : svSunk(log) + ' of 5 wrecks') + ' · ' + log.length + ' of 30 dives' + (hint ? ' · 1 hint' : '');
let SV_TODAY;
let SV_TODAY_DIVES;
let SV_TODAY_HINT;
// Earlier seas: a seeded layout and a seeded player (checkerboard search, then along each hit), so every record agrees with its rules.
const svRng = (seed) => { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const svLayout = (seed) => {
  const r = svRng(seed);
  for (let t = 0; t < 500; t++) {
    const near = new Set(); const ships = []; let ok = true;
    for (const len of [4, 3, 3, 2, 2]) {
      let placed = false;
      for (let a = 0; a < 200 && !placed; a++) {
        const h = r() < 0.5; const c = Math.floor(r() * (h ? 9 - len : 8)); const rw = Math.floor(r() * (h ? 8 : 9 - len));
        const cells = Array.from({ length: len }, (_, k) => (h ? [c + k, rw] : [c, rw + k]));
        if (cells.some(([x, y]) => near.has(x + ',' + y))) continue;
        cells.forEach(([x, y]) => { for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) near.add((x + dx) + ',' + (y + dy)); });
        ships.push(cells); placed = true;
      }
      if (!placed) { ok = false; break; }
    }
    if (ok) return ships;
  }
  return SV_TODAY;
};
const svPlay = (ships, seed) => {
  const r = svRng(seed + 77); const at = svAt(ships); const tried = new Set(); const clear = new Set(); const hits = ships.map(() => []);
  const log = []; let sunk = 0; let queue = []; const par = Math.floor(r() * 2);
  const first = []; const rest = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) ((x + y) % 2 === par ? first : rest).push([x, y]);
  for (let i = first.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [first[i], first[j]] = [first[j], first[i]]; }
  const hunt = first.concat(rest);
  const open = ([x, y]) => x >= 0 && y >= 0 && x < 8 && y < 8 && !tried.has(x + ',' + y) && !clear.has(x + ',' + y);
  const around = ([x, y]) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
  while (log.length < 30 && sunk < 5) {
    let cell = null;
    while (queue.length && !cell) { const q = queue.shift(); if (open(q)) cell = q; }
    if (!cell) cell = hunt.find(open);
    const k = cell[0] + ',' + cell[1]; tried.add(k); const si = at[k];
    if (si == null) { log.push([cell, 'miss']); continue; }
    hits[si].push(cell);
    if (hits[si].length === ships[si].length) {
      sunk += 1; log.push([cell, 'sunk', ships[si].length]); queue = [];
      ships[si].forEach(([x, y]) => { for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) clear.add((x + dx) + ',' + (y + dy)); });
      hits.forEach((h, j) => { if (j !== si && h.length && h.length < ships[j].length) h.forEach((c) => queue.push(...around(c))); });
    } else {
      log.push([cell, 'hit']); const h = hits[si];
      if (h.length >= 2) { const xs = h.map((c) => c[0]); const ys = h.map((c) => c[1]);
        queue = (h[0][1] === h[1][1] ? [[Math.min(...xs) - 1, h[0][1]], [Math.max(...xs) + 1, h[0][1]]] : [[h[0][0], Math.min(...ys) - 1], [h[0][0], Math.max(...ys) + 1]]).concat(queue);
      } else queue = around(cell).concat(queue);
    }
  }
  return log;
};
let dpSvDay;

let dpWhT; let dpChT;
let dpChL; let dpSvL;



// ---- Common. A day is three threads of four items sharing one hidden link; the items show one at a time. A right guess scores 5, 3, 2 or 1 with
// 1, 2, 3 or 4 items showing; a thread closes found, passed or lost (two wrong guesses) at 0. The day is out of 15; completed means all three links found.
// A play from a template: a thread is [items showing when it closed, points, how it closed ('passed' or 'lost' when not found)]. ----
const cmMarks = (t) => '●'.repeat(t[0]) + '○'.repeat(4 - t[0]);
const cmScore = (day) => day.reduce((a, t) => a + t[1], 0);
const cmFound = (day) => day.filter((t) => !t[2]).length;
const cmResult = (day) => GS_RESULT.common({ score: cmScore(day), done: cmFound(day) === 3 });
const cmHead = (n, day) => 'Common No. ' + n + ' · ' + cmScore(day) + ' of 15 · ' + (cmFound(day) === 3 ? 'completed' : 'not completed');
const cmShare = (n, day) => [cmHead(n, day), ...day.map((t, k) => (k + 1) + '  ' + cmMarks(t) + '  ' + t[1])];
// An earlier day names no item or link: those belong to that day's content, which the seed does not carry.
const cmLines = (day) => day.map((t, k) => ['Thread ' + (k + 1), t[2] === 'passed' ? 'Passed' : t[2] === 'lost' ? 'Two wrong guesses' : 'Link found', t[0] + (t[0] === 1 ? ' item' : ' items') + ' showing', t[1] + (t[1] === 1 ? ' point' : ' points')]);
// Today's play: No. 7, the example the product page's chats show. Thread 1 is the chats' worked play.
const CM_TODAY_LINES = [
  ['Thread 1', 'Next item', 'A GUITAR'],
  ['Thread 1', 'Guess: Music.', 'Not it, but close', 'A YO-YO shows'],
  ['Thread 1', 'Guess: Things with strings.', 'Right', '2 points'],
  ['Thread 2', 'Guess: A jam.', 'Right', '5 points'],
  ['Thread 3', 'Next item', 'THE TRAFFIC'],
  ['Thread 3', 'Next item', 'A DUSTY RUG'],
  ['Thread 3', 'Next item', 'THE OTHER TEAM'],
  ['Thread 3', 'Guess: Beat.', 'Right', '1 point'],
];
const CM_TODAY = [[3, 2], [1, 5], [4, 1]];
const CM_OK = [[[1, 5], [2, 3], [4, 1]], [[2, 3], [1, 5], [3, 2]], [[3, 2], [3, 2], [2, 3]], [[1, 5], [1, 5], [2, 3]], [[4, 1], [2, 3], [3, 2]]];
const CM_FAIL = [[2, 3], [3, 0, 'passed'], [4, 0, 'lost']];
// Today's threads on the hard play: every link found only with all four items showing.
const CM_HARD = [[4, 1], [4, 1], [4, 1]];

// ---- An earlier edition's session (gs-puzzles-library.jsx pzSession). base: kind, gid, game, art, date, result, loss. ----
export const dpSession = (id, c, x, base) => {
  const n = (id === 'common' ? CM_NO : DP_NO) - x.i; const i = x.i;
  if (id === 'where') {
    const r = dpWhere(x.ok ? WH_OK[i % WH_OK.length] : WH_FAIL, x.ok);
    return { ...base, number: n, hints: r.hints, figures: [r.guesses + ' of 6 guesses', r.hints ? '1 hint' : 'No hints'], share: x.line, shareLines: [dpWhHead(n, r, x.ok), r.marks], lines: r.lines };
  }
  if (id === 'chain') {
    const play = x.ok ? CH_OK[i % CH_OK.length] : CH_FAIL; const r = dpChain(play);
    return { ...base, number: n, play, figures: [r.words + ' words', dpWrong(r.wrong).replace(/^./, (ch) => ch.toUpperCase())], share: x.line, shareLines: [dpChHead(n, r), r.marks], lines: r.lines };
  }
  if (id === 'common') {
    const day = x.ok ? CM_OK[i % CM_OK.length] : CM_FAIL;
    return { ...base, number: n, figures: [cmScore(day) + ' of 15 points', cmFound(day) + ' of 3 links'], share: x.line, shareLines: cmShare(n, day), lines: cmLines(day) };
  }
  const d = dpSvDay(i, x.ok);
  return { ...base, number: n, figures: [svSunk(d.log) + ' of 5 wrecks', d.log.length + ' of 30 dives'], share: x.line, shareLines: [dpSvHead(n, d.log), ...svMarks(d.log)], lines: svLines(d.log) };
};
const dpCap = (s) => s.replace(/^./, (ch) => ch.toUpperCase());
export let DP_PZ;

// ---- Product pages ----
const dpStep = (b, rest) => <><b>{b}</b>{rest}</>;
let dpSeeResult;


// ---- In your chat: text only, as the player's own AI tells it. Each follows today's play above. ----
const dpMono = (text) => ({ type: 'mono', text });
const dpChEnds = (t) => [t.w[0], ...t.w.slice(1, -1).map((w) => w[0] + ' …'), t.w[t.w.length - 1]].join('\n');


// ---- Staged states (app/states.jsx spreads them into its register). ----
// Where and Chain's session pages: today's play, in progress, failed, and an earlier play (the same four states as Daily Mystery).
// Chain's session states sit with every other game's session page (Screens, "7. Session page: …"), so the States half of the
// Config pill lists its four together, beside the rest.
const dpSessAt = (k) => (k === 'chain' ? ['Screens', '7. Session page: '] : ['Daily puzzles 1213', 'Session page: ']);
const dpEarlier = (k, ok) => () => { const x = PZ[k].all.find((e) => e.i > 0 && e.played && e.ok === ok); return x.sid; };
let DP_SESSION_STATES;
let DP_PZ_STATES;

export let DP_STATES;

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsWhereChainSalvage() {
Object.assign(GS_NAME, { where: 'Where', chain: 'Chain', salvage: 'Salvage', common: 'Common' });
Object.assign(GS_GAMES, {
  where: gsAccess({ access: 'pass', name: GS_NAME.where, category: 'PUZZLE', art: 'where', route: 'where', ed: ['country', 'countries'], edLine: 'You get six guesses to find the country.', daily: true, once: true,
    blurb: 'Today’s country is somewhere on the map. Find it in six guesses.', tags: ['Daily', '5 min'] }),
  chain: gsAccess({ access: 'pass', name: GS_NAME.chain, category: 'PUZZLE', art: 'chain', route: 'chain', ed: ['chain', 'chains'], edLine: 'You get both ends. Find the words between.', daily: true, once: true,
    blurb: 'Every word in the line joins the next. Find the ones in between.', tags: ['Daily', '10 min'] }),
  salvage: gsAccess({ access: 'pass', name: GS_NAME.salvage, category: 'PUZZLE', art: 'salvage', route: 'salvage', ed: ['sea', 'seas'], edLine: 'You get thirty dives to find five wrecks.', daily: true, once: true,
    blurb: 'Five wrecks lie under today’s sea. Find them in thirty dives.', tags: ['Daily', '15 min'] }),
  common: gsAccess({ access: 'pass', name: GS_NAME.common, category: 'PUZZLE', art: 'common', route: 'common', ed: ['day', 'days'], edLine: 'You get three threads of four items. Name each link early.', daily: true, once: true,
    blurb: 'Four items share one hidden link. Name it as early as you dare.', tags: ['Daily', '10 min'] }),
});
GS_GAME_ORDER.splice(GS_GAME_ORDER.indexOf('mystery') + 1, 0, ...DP_IDS);
// ---- Art. The static cover is the moving piece's rest pose on its 160 by 120 stage (the same numbers as the CSS in index.html).
// Where: the hint's needle pointing the wrong way, and today's country. Chain: five words, the ends and their links found, the three middle words empty.
// Salvage: a board mid-hunt, cream misses and two orange hits in a row, one dive from finding a wreck of three.
// Common: four shapes in a row, one a link, each a different shape and colour. ----
Object.assign(GS_ART, {
  where: { ground: 'forest', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><g transform="rotate(45 52 60)"><path d="M52 32L60 60L44 60Z" fill="#D66847"/><path d="M44 60L60 60L52 88Z" fill="#F2EBE0"/></g><rect x="96" y="44" width="32" height="32" fill="#E5A63B"/>') },
  chain: { ground: 'wine', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><g fill="#F2EBE0"><rect x="32" y="57.33" width="16" height="5.33"/><rect x="112" y="57.33" width="16" height="5.33"/><rect x="24" y="52" width="16" height="16"/><rect x="120" y="52" width="16" height="16"/></g><g fill="none" stroke-width="2.67"><rect x="49.33" y="53.33" width="13.33" height="13.33" stroke="#D66847"/><rect x="73.33" y="53.33" width="13.33" height="13.33" stroke="#E5A63B"/><rect x="97.33" y="53.33" width="13.33" height="13.33" stroke="#A390B2"/></g>') },
  salvage: { ground: 'indigo', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="32" cy="60" r="6" fill="#F2EBE0"/><circle cx="104" cy="36" r="6" fill="#F2EBE0"/><circle cx="56" cy="84" r="6" fill="#F2EBE0"/><circle cx="128" cy="84" r="6" fill="#F2EBE0"/><circle cx="56" cy="60" r="6" fill="#D66847"/><circle cx="80" cy="60" r="6" fill="#D66847"/>') },
  common: { ground: 'indigo', extend: 'centre', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="34" cy="60" r="10" fill="#D66847"/><rect x="54" y="50" width="20" height="20" fill="#328A88"/><polygon points="96,51 106,68.32 86,68.32" fill="#A390B2"/><polygon points="126,50 136,60 126,70 116,60" fill="#F2EBE0"/>') },
});
Object.assign(GS_ART_LOCAL, {
  where: { bg: 'is-forest', body: <>{I('ga-wh-needle')}{I('ga-wh-ans')}</> },
  chain: { bg: 'is-wine', body: <>{I('ga-ch-l ga-ch-l1')}{I('ga-ch-l ga-ch-l2')}{I('ga-ch ga-ch-1')}{I('ga-ch ga-ch-o ga-ch-2')}{I('ga-ch ga-ch-o ga-ch-3')}{I('ga-ch ga-ch-o ga-ch-4')}{I('ga-ch ga-ch-5')}</> },
  salvage: { bg: '', body: <>{I('ga-sv-p ga-sv-miss ga-sv-m1')}{I('ga-sv-p ga-sv-miss ga-sv-m2')}{I('ga-sv-p ga-sv-miss ga-sv-m3')}{I('ga-sv-p ga-sv-miss ga-sv-m4')}{I('ga-sv-hull')}{I('ga-sv-p ga-sv-hit ga-sv-h1')}{I('ga-sv-p ga-sv-hit ga-sv-h2')}{I('ga-sv-p ga-sv-hit ga-sv-h3')}</> },
  common: { bg: '', body: <>{I('ga-cm ga-cm-1')}{I('ga-cm ga-cm-2')}{I('ga-cm ga-cm-3')}{I('ga-cm ga-cm-4')}</> },
});
Object.assign(GS_RESULT, {
  where: (r) => (r.ok ? 'Found in ' + r.guesses + ' of 6' : 'Not found'),
  chain: (r) => (r.given ? r.found + ' of ' + r.of + ' words found' : 'Solved, ' + dpWrong(r.wrong)),
  salvage: (r) => (r.found === 5 ? 'All 5 wrecks, ' + r.dives + ' of 30 dives' : r.found + ' of 5 wrecks found'),
  common: (r) => r.score + ' of 15, ' + (r.done ? 'completed' : 'not completed'),
});
WH_TODAY = { a: 'Hungary', g: [['Spain', 1110], ['Poland', 80]], hint: 'From Poland, the country lies south' };
WH_OK = [
  { a: 'Portugal', g: [['Italy', 1020], ['France', 400], ['Spain', 0]], hint: 'From Spain, the country lies west' },
  { a: 'Belgium', g: [['Spain', 810], ['Germany', 0]] },
  { a: 'Austria', g: [['Poland', 170], ['Italy', 0]], hint: 'From Italy, the country lies north' },
  { a: 'Finland', g: [['Greece', 2000], ['Estonia', 60], ['Sweden', 0]] },
  { a: 'Czechia', g: [['Hungary', 60], ['Germany', 0]] },
  { a: 'Ireland', g: [['France', 410], ['United Kingdom', 0]], hint: 'From the United Kingdom, the country lies west' },
];
WH_FAIL = { a: 'Slovenia', g: [['Greece', 720], ['Serbia', 200], ['Hungary', 0], ['Austria', 0], ['Croatia', 0], ['Italy', 0]], hint: 'From Croatia, the country lies north' };
// ---- Chain. A play from a template: { w: the line, p: [[guess, index of the word it was for]] }. The line is 5 to 7 words; each
// neighbouring pair makes a compound word or a common two-word phrase. Only the intended word counts; a wrong guess shows that word's
// next letter, and a word that runs out of letters is given away. Lengths stay hidden. No hint and no overall limit. ----
DP_NUM = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
CH_TODAY = { w: ['SNOW', 'BALL', 'ROOM', 'SERVICE', 'STATION', 'WAGON'], p: [['BALL', 1], ['RACE', 2], ['ROOM', 2], ['STATION', 4], ['SUITE', 3], ['SERVICE', 3]] };
CH_OK = [
  { w: ['RAIN', 'BOW', 'TIE', 'BREAK', 'FAST', 'FOOD'], p: [['BOW', 1], ['TIE', 2], ['FROZEN', 4], ['FAST', 4], ['BREAK', 3]] },
  { w: ['SEA', 'SHELL', 'FISH', 'CAKE', 'WALK'], p: [['SHORE', 1], ['SHELL', 1], ['FISH', 2], ['CAT', 3], ['CAKE', 3]] },
  { w: ['HEAD', 'LINE', 'UP', 'TOWN', 'HALL'], p: [['LIGHT', 1], ['LINE', 1], ['TOWN', 3], ['UP', 2]] },
  { w: ['MOON', 'LIGHT', 'HOUSE', 'BOAT', 'YARD'], p: [['LIGHT', 1], ['BOAT', 3], ['HOUSE', 2]] },
  { w: ['KEY', 'BOARD', 'WALK', 'WAY', 'SIDE', 'CAR'], p: [['BOARD', 1], ['SIDE', 4], ['WAY', 3], ['WAR', 2], ['WALK', 2]] },
  { w: ['HAND', 'BAG', 'PIPE', 'LINE', 'DANCE'], p: [['BALL', 1], ['BAG', 1], ['LINE', 3], ['PIPE', 2]] },
];
CH_HARD = { w: CH_TODAY.w, p: [['BELL', 1], ['BAKE', 1], ['BALL', 1], ['RACE', 2], ['ROAD', 2], ['ROOM', 2],
  ['SALAD', 3], ['SECOND', 3], ['SERVER', 3], ['SERVED', 3], ['SERVING', 3], ['SERVICE', 3], ['STORE', 4], ['STAGE', 4], ['STAMP', 4], ['STATUS', 4], ['STATIC', 4], ['STATION', 4]] };
// Config's Failed on today's chain: ROOM is given away on its third wrong guess (ROO shown, four letters), the other words found.
CH_FAIL = { w: CH_TODAY.w, p: [['BELL', 1], ['BALL', 1], ['RACE', 2], ['ROAD', 2], ['ROOF', 2], ['SUITE', 3], ['SERVICE', 3], ['STORE', 4], ['STATION', 4]] };
// ---- Salvage. An 8 by 8 sea, columns A to H, rows 1 to 8, with five wrecks of 4, 3, 3, 2 and 2 squares, straight across or down,
// never touching, not even at a corner. 30 dives, each a hit, a miss or sunk ("Sunk: the wreck of 3" names its length). One hint, which
// costs no dive: sonar on a row or a column says how many wreck squares it holds. Complete: every wreck found within the dives. ----
SV_COLS = 'ABCDEFGH';
// Today's sea: B2 to E2, G1 to G3, A5 to A7, D5 to E5, G7 to H7.
SV_TODAY = [[[1, 1], [2, 1], [3, 1], [4, 1]], [[6, 0], [6, 1], [6, 2]], [[0, 4], [0, 5], [0, 6]], [[3, 4], [4, 4]], [[6, 6], [7, 6]]];
SV_TODAY_DIVES = svReplay(SV_TODAY, ['D4', 'E2', 'E3', 'E1', 'F2', 'D2', 'C2', 'B2', 'G2', 'G3', 'G1', 'A6', 'A5', 'A7', 'E6', 'E5', 'F5', 'D5', 'G6', 'H8', 'G7', 'H7']
  .map((s) => [SV_COLS.indexOf(s[0]), +s.slice(1) - 1]));
SV_TODAY_HINT = { at: 11, what: 'Sonar on column A', said: '3 wreck squares' };
// Day i's sea: completed days find every wreck within 30 dives; failed days end with 3 found.
dpSvDay = (() => { const memo = {}; return (i, ok) => {
  const k = i + (ok ? 'y' : 'n'); if (memo[k]) return memo[k];
  for (let s = i * 13 + 1; s < i * 13 + 3000; s++) { const ships = svLayout(s); const log = svPlay(ships, s); if (svSunk(log) === (ok ? 5 : 3)) return (memo[k] = { ships, log }); }
  return (memo[k] = { ships: SV_TODAY, log: SV_TODAY_DIVES });
}; })();
// ---- Today's plays, and their in-progress forms (Config: today in progress). ----
dpWhT = dpWhere(WH_TODAY, true);
dpChT = dpChain(CH_TODAY);
dpChL = dpChain({ ...CH_TODAY, p: CH_TODAY.p.slice(0, 3) });
dpSvL = SV_TODAY_DIVES.slice(0, 11);
Object.assign(GS_SESSIONS, {
  'where-today': { kind: 'puzzle', gid: 'where', game: GS_NAME.where, art: 'where', number: DP_NO, hints: 1, result: GS_RESULT.where({ ok: true, guesses: dpWhT.guesses }), date: GS.today,
    figures: [dpWhT.guesses + ' of 6 guesses', '1 hint'], share: GS_RESULT.where({ ok: true, guesses: dpWhT.guesses }), shareLines: [dpWhHead(DP_NO, dpWhT, true), dpWhT.marks], lines: dpWhT.lines },
  'where-live': { kind: 'puzzle', gid: 'where', game: GS_NAME.where, art: 'where', number: DP_NO, hints: 0, live: true, result: 'In progress', date: GS.today,
    figures: ['2 of 6 guesses', 'No hints'], share: null, lines: dpWhT.lines.slice(0, 2) },
  'chain-today': { kind: 'puzzle', gid: 'chain', game: GS_NAME.chain, art: 'chain', number: DP_NO, play: CH_TODAY, result: dpChResult(dpChT), date: GS.today,
    figures: [dpChT.words + ' words', dpWrong(dpChT.wrong).replace(/^./, (c) => c.toUpperCase())], share: dpChResult(dpChT), shareLines: [dpChHead(DP_NO, dpChT), dpChT.marks], lines: dpChT.lines },
  'chain-live': { kind: 'puzzle', gid: 'chain', game: GS_NAME.chain, art: 'chain', number: DP_NO, play: { ...CH_TODAY, p: CH_TODAY.p.slice(0, 3) }, live: true, result: 'In progress', date: GS.today,
    figures: [dpChL.found + ' of ' + dpChL.hidden + ' words', dpWrong(dpChL.wrong).replace(/^./, (c) => c.toUpperCase())], share: null, lines: dpChL.lines },
  'salvage-today': { kind: 'puzzle', gid: 'salvage', game: GS_NAME.salvage, art: 'salvage', number: DP_NO, hints: 1, result: GS_RESULT.salvage({ found: 5, dives: SV_TODAY_DIVES.length }), date: GS.today,
    figures: ['5 of 5 wrecks', SV_TODAY_DIVES.length + ' of 30 dives', '1 hint'], share: GS_RESULT.salvage({ found: 5, dives: SV_TODAY_DIVES.length }), shareLines: [dpSvHead(DP_NO, SV_TODAY_DIVES, true), ...svMarks(SV_TODAY_DIVES)],
    lines: svLines(SV_TODAY_DIVES, SV_TODAY_HINT) },
  'salvage-live': { kind: 'puzzle', gid: 'salvage', game: GS_NAME.salvage, art: 'salvage', number: DP_NO, live: true, result: 'In progress', date: GS.today,
    figures: [svSunk(dpSvL) + ' of 5 wrecks', dpSvL.length + ' of 30 dives'], share: null, lines: svLines(dpSvL) },
  'common-today': { kind: 'puzzle', gid: 'common', game: GS_NAME.common, art: 'common', number: CM_NO, result: cmResult(CM_TODAY), date: GS.today,
    figures: [cmScore(CM_TODAY) + ' of 15 points', '3 of 3 links'], share: cmResult(CM_TODAY), shareLines: cmShare(CM_NO, CM_TODAY), lines: CM_TODAY_LINES },
  'common-live': { kind: 'puzzle', gid: 'common', game: GS_NAME.common, art: 'common', number: CM_NO, live: true, result: 'In progress', date: GS.today,
    figures: ['Thread 1 of 3', '0 of 15 points'], share: null, lines: CM_TODAY_LINES.slice(0, 2) },
});
DP_IDS.forEach((k) => { GS_TODAY_PLAYED.pass[k] = k + '-today'; });
// ---- This edition as Config → This edition picks it (GS_ED_SIDS). SAMPLES on today's edition: today's number and date. Hard: every guess, dive or
// item used and the edition still won. Failed: the edition lost. now: the line and bar of
// the library now card (CprPzNow); Chain's card draws from the play itself. ----
const dpHardWh = { a: 'Hungary', g: [['Spain', 1110], ['Poland', 80], ['Austria', 0], ['Slovakia', 0], ['Romania', 0]], hint: 'From Romania, the country lies west' };
const dpPickWh = (ok) => {
  const r = dpWhere(ok ? dpHardWh : { ...dpHardWh, g: [...dpHardWh.g, ['Croatia', 0]] }, ok); const res = GS_RESULT.where({ ok, guesses: r.guesses });
  return { ...GS_SESSIONS['where-today'], loss: !ok, hints: r.hints, result: res, share: res, figures: [r.guesses + ' of 6 guesses', '1 hint'], shareLines: [dpWhHead(DP_NO, r, ok), r.marks], lines: r.lines,
    now: { line: ok ? 'You found the country on your sixth guess, with the hint.' : 'You used all six guesses and the hint without finding the country.', bar: ['Guess 6 of 6', 6, 6] } };
};
const dpPickCh = (play) => {
  const r = dpChain(play); const res = dpChResult(r);
  return { ...GS_SESSIONS['chain-today'], loss: r.given > 0, play, result: res, share: res, figures: [r.words + ' words', dpWrong(r.wrong).replace(/^./, (c) => c.toUpperCase())], shareLines: [dpChHead(DP_NO, r), r.marks], lines: r.lines };
};
const dpDives = SV_TODAY_DIVES.map((d) => d[0]);
const dpCells = (list) => list.map((c) => [SV_COLS.indexOf(c[0]), +c.slice(1) - 1]);
const dpPickSv = (extra, upTo, now) => {
  const log = svReplay(SV_TODAY, [...dpDives.slice(0, upTo), ...dpCells(extra), ...dpDives.slice(upTo)].slice(0, 30)); const sunk = svSunk(log); const res = GS_RESULT.salvage({ found: sunk, dives: log.length });
  return { ...GS_SESSIONS['salvage-today'], loss: sunk < 5, result: res, share: res, figures: [sunk + ' of 5 wrecks', log.length + ' of 30 dives', '1 hint'], shareLines: [dpSvHead(DP_NO, log, true), ...svMarks(log)], lines: svLines(log, SV_TODAY_HINT), now };
};
const dpPickCm = (day, now) => {
  const res = cmResult(day);
  return { ...GS_SESSIONS['common-today'], loss: cmFound(day) < 3, result: res, share: res, figures: [cmScore(day) + ' of 15 points', cmFound(day) + ' of 3 links'], shareLines: cmShare(CM_NO, day), lines: cmLines(day), now };
};
Object.assign(GS_SESSIONS, {
  'where-today-hard': dpPickWh(true), 'where-today-failed': dpPickWh(false),
  'chain-today-hard': dpPickCh(CH_HARD), 'chain-today-failed': dpPickCh(CH_FAIL),
  'salvage-today-hard': dpPickSv(['A1', 'H1', 'H2', 'A8', 'C7', 'F7', 'B4', 'F8'], 14,
    { line: 'You found all five wrecks on your last dive, with one hint.', bar: ['30 of 30 dives', 30, 30] }),
  'salvage-today-failed': dpPickSv(['A1', 'H1', 'H2', 'A8', 'C7', 'F7', 'B4', 'F8', 'C4', 'B6', 'H4', 'H5', 'D7', 'E8', 'C1', 'D8'], 14,
    { line: 'You used all 30 dives and found 3 of the 5 wrecks.', bar: ['30 of 30 dives', 30, 30] }),
  'common-today-hard': dpPickCm(CM_HARD, { line: 'You found all three links, each with all four items showing, and scored 3 of 15.', bar: ['3 of 15 points', 3, 15] }),
  'common-today-failed': dpPickCm(CM_FAIL, { line: 'You found 1 of the 3 links and scored 3 of 15.', bar: ['3 of 15 points', 3, 15] }),
});
DP_IDS.forEach((k) => { GS_ED_SIDS[k] = { average: k + '-today', hard: k + '-today-hard', failed: k + '-today-failed' }; });
// ---- The library game page's seed (PZ in gs-puzzles-library.jsx), one entry per game. ----
DP_PZ = {
  where: {
    count: DP_NO, no: (i) => GS_NAME.where + ' #' + (DP_NO - i), salt: 7, keep: {}, today: 'where-today', liveSid: 'where-live',
    ok: (i) => GS_RESULT.where({ ok: true, guesses: dpWhere(WH_OK[i % WH_OK.length], true).guesses }), bad: GS_RESULT.where({ ok: false }),
    title: 'Today’s country', next: 'Next country: tomorrow',
    live: { line: 'You’ve used 2 of your 6 guesses. The closer one was ' + dpKm(WH_TODAY.g[1][1]) + ' away.', bar: ['Guess 2 of 6', 2, 6] },
    done: { st: { kind: 'ok', label: GS_SESSIONS['where-today'].result }, line: 'You found the country on your third guess, with the hint.', bar: ['Guess ' + dpWhT.guesses + ' of 6', dpWhT.guesses, 6] },
    recent: 'Your countries',
    ach: [{ k: 'wh1', n: 'Found', how: 'Find the country in a Where.', by: (p) => p.status.kind === 'ok' },
      { k: 'wh0', n: 'Found without the hint', how: 'Find the country without taking the hint.', by: (p) => { const s = GS_SESSIONS[p.sid]; return p.status.kind === 'ok' && !!s && !s.hints; } },
      { k: 'wh7', n: 'Seven days in a row', how: 'Find the country seven days running.', of: 7 }],
  },
  chain: {
    count: DP_NO, no: (i) => GS_NAME.chain + ' #' + (DP_NO - i), salt: 8, keep: {}, today: 'chain-today', liveSid: 'chain-live',
    ok: (i) => dpChResult(dpChain(CH_OK[i % CH_OK.length])), bad: dpChResult(dpChain(CH_FAIL)),
    title: 'Today’s chain', next: 'Next chain: tomorrow',
    live: { line: 'You’ve found ' + dpChL.found + ' of the ' + dpChL.hidden + ' words, with ' + dpWrong(dpChL.wrong).replace(/^1 /, 'one ') + '.', bar: [dpChL.found + ' of ' + dpChL.hidden + ' words', dpChL.found, dpChL.hidden] },
    done: { st: { kind: 'ok', label: GS_SESSIONS['chain-today'].result }, line: 'You found all ' + dpChT.hidden + ' words with two wrong guesses.', bar: [dpChT.hidden + ' of ' + dpChT.hidden + ' words', dpChT.hidden, dpChT.hidden] },
    recent: 'Your chains',
    ach: [{ k: 'ch1', n: 'Solved', how: 'Find every word in a Chain.', by: (p) => p.status.kind === 'ok' },
      { k: 'ch0', n: 'Solved with no wrong guesses', how: 'Find every word in a Chain without a wrong guess.', by: (p) => p.status.label === GS_RESULT.chain({ wrong: 0 }) },
      { k: 'ch7', n: 'Seven days in a row', how: 'Solve Chain seven days running.', of: 7 }],
  },
  salvage: {
    count: DP_NO, no: (i) => GS_NAME.salvage + ' #' + (DP_NO - i), salt: 12, keep: {}, today: 'salvage-today', liveSid: 'salvage-live',
    ok: (i) => GS_RESULT.salvage({ found: 5, dives: dpSvDay(i, true).log.length }), bad: GS_RESULT.salvage({ found: 3 }),
    // tag: not a launch game, so its now card keeps the finished result as the tag with its icon.
    title: 'Today’s sea', next: 'Next sea: tomorrow', tag: true,
    live: { line: 'You’ve found ' + svSunk(dpSvL) + ' of the 5 wrecks in ' + dpSvL.length + ' dives.', bar: [dpSvL.length + ' of 30 dives', dpSvL.length, 30] },
    done: { st: { kind: 'ok', label: GS_SESSIONS['salvage-today'].result }, line: 'You found all five wrecks with ' + (30 - SV_TODAY_DIVES.length) + ' dives to spare, and one hint.', bar: [SV_TODAY_DIVES.length + ' of 30 dives', SV_TODAY_DIVES.length, 30] },
    recent: 'Your seas',
    ach: [{ k: 'sv1', n: 'Every wreck found', how: 'Find all five wrecks in a Salvage.', by: (p) => p.status.kind === 'ok' },
      { k: 'sv5', n: 'Five dives to spare', how: 'Find all five wrecks in 25 dives or fewer.', by: (p) => { const m = /^All 5 wrecks, (\d+) of 30/.exec(p.status.label); return !!m && +m[1] <= 25; } },
      { k: 'sv7', n: 'Seven days in a row', how: 'Find every wreck seven days running.', of: 7 }],
  },
  common: {
    count: CM_NO, no: (i) => GS_NAME.common + ' #' + (CM_NO - i), salt: 11, keep: {}, today: 'common-today', liveSid: 'common-live',
    ok: (i) => cmResult(CM_OK[i % CM_OK.length]), bad: cmResult(CM_FAIL),
    title: 'Today’s threads', next: 'Next threads: tomorrow',
    live: { line: 'You’re on thread 1 of 3. One guess is used and three items show.', bar: ['Thread 1 of 3', 1, 3] },
    done: { st: { kind: 'ok', label: GS_SESSIONS['common-today'].result }, line: 'You found all three links and scored ' + cmScore(CM_TODAY) + ' of 15.', bar: [cmScore(CM_TODAY) + ' of 15 points', cmScore(CM_TODAY), 15] },
    recent: 'Your days',
    ach: [{ k: 'cm1', n: 'First Thread', how: 'Find a link.', by: (p) => /^[1-9]\d* of 15/.test(p.status.label) },
      { k: 'cm3', n: 'Clean Sweep', how: 'Find all three links in a day.', by: (p) => p.status.kind === 'ok' },
      { k: 'cm7', n: 'Seven Days in a Row', how: 'Find all three links seven days running.', of: 7 }],
  },
};
dpSeeResult = <><b>See your result</b> on your session page.</>;
Object.assign(GS_PAGES, {
  where: {
    rhythm: 'NEW EVERY DAY',
    box: { label: 'ONLY WITH THE PASS', heading: 'A new country every day', button: 'Play today’s country',
      steps: [GS_STEP_CONNECT, dpStep('Find today’s country.', ' You get six guesses.'), dpSeeResult], small: GS_NAME.where + ' comes only with the After Pixels Pass.' },
    facts: { long: '5 min', often: 'New every day' }, tags: [],
    pitch: { h: 'Today’s country is out there. Find it in six guesses.', ps: [
      'Name any country. The game tells you how far it lies from today’s, border to border. Zero means the two touch.',
      'You get one hint: the compass direction from your last guess. Your AI isn’t told the answer until you finish. Name your first country.'] },
    who: { ai: 'Passes on your guesses and tells you about the country once you’ve found it.', server: 'Holds the country, measures every distance and counts your guesses.' },
    week: { title: 'Today’s country', line: 'You get six guesses and one hint.', session: 'where-today' },
  },
  chain: {
    rhythm: 'NEW EVERY DAY',
    box: { label: 'ONLY WITH THE PASS', heading: 'A new chain every day', button: 'Play today’s chain',
      steps: [GS_STEP_CONNECT, dpStep('Fill in today’s chain', ', working in from either end.'), dpSeeResult], small: GS_NAME.chain + ' comes only with the After Pixels Pass.' },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'Fire joins house, and house joins plant. Find the words in between.', ps: [
      'You see both ends of the line and the first letter of every word between. Guess inward from either end, one word at a time.',
      'A wrong guess shows you the next letter of that word. Run out of letters and the word is given away. Make your first guess.'] },
    who: { ai: 'Passes on your guesses and explains every link once the chain is done.', server: 'Holds the chain, checks every guess and shows a letter for each miss.' },
    week: { title: 'Today’s chain', line: 'You get both ends and every first letter.', session: 'chain-today' },
  },
  salvage: {
    rhythm: 'NEW EVERY DAY',
    box: { label: 'ONLY WITH THE PASS', heading: 'A new sea every day', button: 'Play today’s sea',
      steps: [GS_STEP_CONNECT, dpStep('Find today’s five wrecks.', ' You get thirty dives.'), dpSeeResult], small: GS_NAME.salvage + ' comes only with the After Pixels Pass.' },
    facts: { long: '15 min', often: 'New every day' }, tags: [],
    pitch: { h: 'Five wrecks lie somewhere under you. Find them in thirty dives.', ps: [
      'Call a square from A1 to H8 and dive. Each dive comes back as a hit, a miss or sunk.',
      'Your AI reads the sea back to you after every dive, row by row. The game engine holds the wrecks. Call your first square.'] },
    who: { ai: 'Reads the sea back to you after every dive, row by row.', server: 'Holds the wrecks, answers every dive and counts the dives you have left.' },
    week: { title: 'Today’s sea', line: 'You get thirty dives to find five wrecks.', session: 'salvage-today' },
  },
  common: {
    rhythm: 'NEW EVERY DAY',
    box: { label: 'ONLY WITH THE PASS', heading: 'Three new threads every day', button: 'Play today’s threads',
      steps: [GS_STEP_CONNECT, dpStep('Name today’s three links.', ' You get two guesses a thread.'), dpSeeResult], small: GS_NAME.common + ' comes only with the After Pixels Pass.' },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'An egg, a tortoise and a peanut have something in common. Name it early.', ps: [
      'Each day has three threads, the same for everyone. A thread is four items with one hidden link. The game shows them one at a time. Ask for the next item, name the link, or pass.',
      'Name the link from the first item and it scores 5. Each item after that lowers it to 3, 2, then 1. A day is out of 15. You get two guesses a thread, and a wrong guess shows the next item. There are no hints. Your AI is told only the items you see. Name your first link.'] },
    who: { ai: 'Reads out each item and thinks it through with you when you ask. Tells the story of each link once a thread closes.', server: 'Holds the unseen items and each link, marks every guess and scores the thread.' },
    week: { title: 'Today’s threads', line: 'You get three threads, the same for everyone.', session: 'common-today' },
  },
});
Object.assign(GS_CHATS, {
  where: [
    { cap: 'Name a country. Everyone hunts the same one today.', turns: [gscU('I want to play Where.'),
      gscAi('where', ['Where #' + DP_NO + '. Today’s country is hidden, and you have six guesses.', 'Each miss tells you how far it is from today’s country, border to border. Name your first country.'])] },
    { cap: 'Every miss comes back as a distance, measured border to border.', turns: [gscU('Spain.'), gscAi('where', 'Spain is ' + dpKm(1110) + ' from today’s country. 5 guesses left.'),
      gscU('Poland.'), gscAi('where', 'Poland is ' + dpKm(80) + ' away. 4 guesses left.')] },
    { cap: 'You get one hint: the compass direction from your last guess.', turns: [gscU('Give me the hint.'), gscAi('where', 'From Poland, today’s country lies south. That was your one hint.'),
      gscU('Hungary.'), gscAi('where', ['Found in 3 of 6, with the hint.', 'Hungary sits in the Carpathian Basin, and the Danube runs through Budapest.'])] },
  ],
  chain: [
    { cap: 'You get both ends of the line and every first letter.', turns: [gscU('I want to play Chain.'),
      gscAi('chain', ['Chain #' + DP_NO + '. Six words, each joined to the next. Guess inward from either end.'], null, [dpMono(dpChEnds(CH_TODAY))])] },
    { cap: 'A wrong guess shows you the next letter.', turns: [gscU('Ball.'), gscAi('chain', 'Ball is right: snowball.'),
      gscU('Race.'), gscAi('chain', 'Not race. The next word starts RO.')] },
    { cap: 'Afterwards, your AI explains every link.', turns: [gscU('Service.'),
      gscAi('chain', ['Service is right. The chain is done, with 2 wrong guesses.', 'Snowball, ballroom, room service, service station, station wagon.'])] },
  ],
  salvage: [
    { cap: 'Five wrecks lie somewhere under an eight-by-eight sea.', turns: [gscU('I want to play Salvage.'),
      gscAi('salvage', ['Salvage #' + DP_NO + '. Five wrecks lie below: one of 4 squares, two of 3 and two of 2. None of them touch.', 'You have 30 dives. Call your first square.'], null, [dpMono(svBoard(SV_TODAY, []))])] },
    { cap: 'Each dive comes back as a hit, a miss or sunk.', turns: [gscU('E2.'), gscAi('salvage', 'Hit. 29 dives left.'),
      gscU('E3.'), gscAi('salvage', 'Miss. 28 dives left.')] },
    { cap: 'The board is redrawn after every dive, so your AI can read it aloud.', turns: [gscU('B2.'),
      gscAi('salvage', 'Sunk: the wreck of 4. ' + (30 - 8) + ' dives left.', null, [dpMono(svBoard(SV_TODAY, SV_TODAY_DIVES.slice(0, 8)))])] },
  ],
  common: [
    { cap: 'Say you want to play. Everyone gets the same three threads today.', turns: [gscU('I want to play Common.'),
      gscAi('common', ['Common No. ' + CM_NO + '. Thread 1 of 3.', 'Name the link now for 5 points, ask for the next item, or pass. You have two guesses.'], null, [dpMono('A TENNIS RACKET')])] },
    { cap: 'Each item that shows lowers what the link scores. A wrong guess shows the next.', turns: [gscU('Next.'),
      gscAi('common', 'A right guess now scores 3.', null, [dpMono('A TENNIS RACKET\nA GUITAR')]),
      gscU('Music.'),
      gscAi('common', 'Not it. Close: what do they all have stretched or tied to them? A right guess now scores 2, and you have one guess left.', null, [dpMono('A TENNIS RACKET\nA GUITAR\nA YO-YO')])] },
    { cap: 'When a thread closes, your AI tells its story.', turns: [gscU('Things with strings.'),
      gscAi('common', ['Things with strings is right, for 2 points.', 'A tennis racket is strung tight, a guitar has strings to pluck, a yo-yo winds up on one, and a harp has dozens.', 'Thread 2 of 3. Name the link now for 5 points, ask for the next item, or pass. You have two guesses. Your score is 2.'], null, [dpMono('A PRINTER')])] },
  ],
});
DP_SESSION_STATES = ['where', 'chain'].flatMap((k) => { const n = GS_NAME[k]; const [g, sp] = dpSessAt(k);
  const open = (id, extra) => (c) => { c.setView('pass'); c.setConnected(true); if (extra) c.setReview(extra); c.go('session', { id: typeof id === 'function' ? id() : id }); };
  return [
    { group: g, id: 'session-' + k + '-in-progress', label: sp + n + ' in progress', stage: open(k + '-live', { week: 'live' }) },
    { group: g, id: 'session-' + k + '-failed', label: sp + n + ', an earlier play that failed', stage: open(dpEarlier(k, false)) },
    { group: g, id: 'session-' + k + '-earlier', label: sp + n + ', an earlier play (played once)', stage: open(dpEarlier(k, true)) },
  ]; });
DP_PZ_STATES = DP_IDS.flatMap((k) => { const n = GS_NAME[k]; const g = 'Daily puzzles 1213'; return [
  { group: g, id: k + '-signed-out', label: n + ', signed out', stage: (c) => c.go(k) },
  { group: g, id: k + '-free', label: n + ', free account (Get the Pass)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go(k); } },
  { group: g, id: k + '-pass', label: n + ', with the Pass (played today)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go(k); } },
  { group: g, id: 'library-' + k, label: n + ' in your library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go(k, { page: 'record' }); } },
  { group: g, id: 'library-' + k + '-in-progress', label: n + ' in your library, today in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go(k, { page: 'record' }); } },
  { group: g, id: 'library-' + k + '-free', label: n + ' in your library, free account (Needs the Pass)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go(k, { page: 'record' }); } },
  { group: g, id: 'library-' + k + '-editions', label: n + ': every ' + GS_GAMES[k].ed[0] + ' (the editions list)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go(k, { page: 'record', list: true }); } },
  ...(k === 'chain' ? [
    { group: g, id: 'library-chain-never-played', label: 'Chain in your library, with the Pass, not yet played', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ never: 'chain' }); c.go(k, { page: 'record' }); } },
    { group: g, id: 'library-chain-failed', label: 'Chain in your library, today failed (a word given away)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ ed: 'failed' }); c.go(k, { page: 'record' }); } },
    { group: g, id: 'library-chain-hard', label: 'Chain in your library, a hard day (18 guesses)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ ed: 'hard' }); c.go(k, { page: 'record' }); } },
  ] : []),
  { group: dpSessAt(k)[0], id: 'session-' + k, label: k === 'chain' ? dpSessAt(k)[1] + n : 'Session page: ' + n + ' today, with Share', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: k + '-today' }); } },
]; });
DP_STATES = [...DP_PZ_STATES, ...DP_SESSION_STATES];
}
