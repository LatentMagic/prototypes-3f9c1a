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
import { SLV_DIVES, SLV_PLAYS, SLV_WRECKS, slvShareLinesOf } from './gs-salvage.jsx';

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
const svLines = (log) => log.map(([c, r, n], k) => ['Dive ' + (k + 1), svCell(c), r === 'miss' ? 'Miss' : r === 'hit' ? 'Hit' : 'Sunk: the wreck of ' + n]);
// Share marks, one per dive in order, ten to a line: miss ○, hit ✕, the dive that sinks a wreck ■. No square is named.
const svMarks = (log) => { const m = log.map(([, r]) => (r === 'miss' ? '○' : r === 'hit' ? '✕' : '■')).join(''); const out = []; for (let k = 0; k < m.length; k += 10) out.push(m.slice(k, k + 10)); return out; };
// Salvage's drawn sea for a chat turn, as the deployed script has the AI draw it: a tile per square with column letters over it, row numbers before each row,
// a shown count over each column and after each row, and a - where none is shown. A dived square is ○ a miss, ✕ a hit not yet raised (amber) or ■ part of a wreck raised (green).
// The chats' sea is not a real edition: wrecks D1 to G1, B5 to D5, A8 to C8, F6 to F7 and A2 to A3, with the margins of four columns (B, D, E, F) and four rows (1, 3, 6, 7).
const SV_CHAT_SEA = { cols: { B: 2, D: 2, E: 1, F: 3 }, rows: { 1: 4, 3: 1, 6: 1, 7: 1 } };
// `swept` adds the counts a sonar sweep gives to the margin, as { cols: { A: 3 } }.
const svGrid = (miss, hit, raised, swept = {}) => {
  const cnt = { cols: { ...SV_CHAT_SEA.cols, ...swept.cols }, rows: { ...SV_CHAT_SEA.rows, ...swept.rows } };
  const mark = {};
  miss.forEach((sq) => { mark[sq] = ['○', '']; }); hit.forEach((sq) => { mark[sq] = ['✕', 'n']; }); raised.forEach((sq) => { mark[sq] = ['■', 'h']; });
  const cols = 'ABCDEFGH'.split('');
  const head = [{ l: ' ', m: ' ' }, ...cols.map((c) => ({ l: String(cnt.cols[c] || '-'), m: 'x' })), { l: ' ', m: ' ' }];
  const letters = [{ l: ' ', m: ' ' }, ...cols.map((c) => ({ l: c, m: 'x' })), { l: ' ', m: ' ' }];
  const body = [1, 2, 3, 4, 5, 6, 7, 8].map((r) => [{ l: String(r), m: 'x' }, ...cols.map((c) => ({ l: (mark[c + r] || [' '])[0], m: (mark[c + r] || [' ', ' '])[1] || ' ' })), { l: String(cnt.rows[r] || '-'), m: 'x' }]);
  return { type: 'tilegrid', length: 10, rows: [head, letters, ...body].map((r) => ({ letters: r.map((x) => x.l).join(''), marks: r.map((x) => x.m).join('') })) };
};
const svStats = (dives, tools) => ({ type: 'stats', items: [{ label: 'Dives left', value: dives }, { label: 'Tools left', value: tools }, { label: 'Wrecks to find', value: '4 3 3 2 2' }] });
const SV_WRECK_SQUARES = ['D1', 'E1', 'F1', 'G1', 'B5', 'C5', 'D5', 'A8', 'B8', 'C8', 'F6', 'F7', 'A2', 'A3'];
const svSunk = (log) => log.filter((l) => l[1] === 'sunk').length;
const dpSvHead = (n, log, hint) => 'Salvage #' + n + ' · ' + (svSunk(log) === 5 ? 'all 5 wrecks' : svSunk(log) + ' of 5 wrecks') + ' · ' + log.length + ' of ' + SLV_DIVES + ' dives' + (hint ? ' · 1 hint' : '');
// Today's sea, as the earlier seas' [x, y] squares: the sea of SLV_PLAYS (gs-salvage.jsx), the only one.
const svSea = () => SLV_WRECKS.map((w) => w.map((sq) => [SV_COLS.indexOf(sq[0]), +sq.slice(1) - 1]));
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
  return svSea();
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
  while (log.length < SLV_DIVES && sunk < 5) {
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

let dpWhT; let dpChT; let dpCmToday;
let dpChL;



// ---- Common, version 6. A day is three threads of four items sharing one hidden connection; the items show one at a time. A right guess scores
// 5, 3, 2 or 1 with 1, 2, 3 or 4 items showing. The day has five guesses shared by its threads, each spent right or wrong, and a wrong guess shows
// another item (none at 4 showing, and none on the day's last guess). A pass is free and scores 0. A thread closes found, passed or lost (out of
// guesses) at 0; when the guesses run out, the threads left close lost, and a thread never opened shows no item. The day is out of 15, and every
// finished day is completed, whatever the score.
// A play is a day's content (per thread its four items, the connection and how each item fits) and its moves, in order: [thread index, 'more'],
// [thread index, 'pass'] or [thread index, guess, right]. cmPlay replays it into the threads, the guesses and the record's lines; the session
// page (gs-common.jsx) draws from the same replay. ----
const CM_PTS = [5, 3, 2, 1];
const cmCount = (n) => n + (n === 1 ? ' point' : ' points');
const CM_HOW = { found: 'Found', passed: 'Passed', lost: 'Out of guesses' };
// Lines follow the platform's record: a thread opens with Item 1, a wrong guess is followed by the item it shows, and a closed thread reads
// Connection, How it fits, then its points. A thread the run out closes before it opens gets its heading and closing lines, no item.
export const cmPlay = ({ c, m }, live) => {
  const t = c.map((x, k) => ({ k, items: x.items, link: x.link, shown: 0, state: 'waiting', pts: 0, at: 0 }));
  const pool = []; const lines = [];
  const open = (k) => { if (!t[k]) return; t[k].state = 'open'; t[k].shown = 1; lines.push(['Thread ' + (k + 1)], ['Item 1', c[k].items[0]]); };
  const close = (x, how, pts) => { if (x.state === 'waiting') lines.push(['Thread ' + (x.k + 1)]);
    x.state = how; x.pts = pts; lines.push(['Connection', c[x.k].link], ['How it fits', c[x.k].fits], [CM_HOW[how], cmCount(pts)]); };
  const runOut = () => t.forEach((x) => { if (x.state === 'open' || x.state === 'waiting') close(x, 'lost', 0); });
  open(0);
  m.forEach(([k, a, right]) => {
    const x = t[k];
    if (a === 'more') { x.shown += 1; lines.push(['Item ' + x.shown, c[k].items[x.shown - 1]]); return; }
    if (a === 'pass') { close(x, 'passed', 0); open(k + 1); return; }
    pool.push({ k, right }); const last = pool.length === 5;
    lines.push(['Guess', a, right ? 'Right' : 'Wrong']);
    if (right) { x.at = x.shown; close(x, 'found', CM_PTS[x.shown - 1]); if (last) runOut(); else open(k + 1); return; }
    if (last) { runOut(); return; }
    if (x.shown < 4) { x.shown += 1; lines.push(['Item ' + x.shown, c[k].items[x.shown - 1]]); }
  });
  // A thread as the share card and figures read it: [items showing when it closed, points, how it closed when not found].
  const day = t.map((x) => [x.shown, x.pts, ...(x.state === 'found' ? [] : [x.state])]);
  return { t, pool, lines, day, live: !!live };
};
// Squares: a seen item takes its thread's cover colour (orange, teal, lilac) once the link is named, else white; an unseen item is black.
const CM_SQ = ['🟧', '🟦', '🟪'];
const cmMarks = (t, k) => (t[2] ? '⬜' : CM_SQ[k]).repeat(t[0]) + '⬛'.repeat(4 - t[0]);
const cmScore = (day) => day.reduce((a, t) => a + t[1], 0);
const cmFound = (day) => day.filter((t) => !t[2]).length;
const cmResult = (day) => GS_RESULT.common({ score: cmScore(day) });
const cmHead = (n, day) => 'Common No. ' + n + ' · ' + cmScore(day) + '/15';
const cmShare = (n, day) => [cmHead(n, day), ...day.map((t, k) => cmMarks(t, k) + '  ' + t[1])];
const cmFigures = (day) => [cmScore(day) + ' of 15', cmFound(day) + ' of 3 connections found'];
// A finished session's own fields, from its play.
const cmSess = (n, play) => { const p = cmPlay(play); const res = cmResult(p.day);
  return { number: n, play, result: res, figures: cmFigures(p.day), shareLines: cmShare(n, p.day), lines: p.lines, day: p.day }; };
// Today: No. 7, the example the product page's chats show. Thread 1 is the chats' worked play, spending 2 of the day's guesses.
const CM_C7 = [
  { items: ['EGG', 'TORTOISE', 'PEANUT', 'HERMIT CRAB'], link: 'Shell', fits: 'An egg, a tortoise, a peanut and a hermit crab all have one.' },
  { items: ['A PRINTER', 'A ZIP', 'A DOOR', 'A RADIO SIGNAL'], link: 'Jam', fits: 'A printer, a zip, a door and a radio signal can all jam.' },
  { items: ['A DRUM', 'THE TRAFFIC', 'A DUSTY RUG', 'THE OTHER TEAM'], link: 'Beat', fits: 'You can beat a drum, the traffic, a dusty rug and the other team.' }];
// Earlier days' threads, from the owner's version 6 playtests; the earlier plays alternate between them.
const CM_CA = [
  { items: ['A CLOWN', 'A TRAPEZE', 'A TIGHTROPE WALKER', 'A RINGMASTER'], link: 'Things at the circus', fits: 'A clown, a trapeze, a tightrope walker and a ringmaster are all at the circus.' },
  { items: ['A PIANIST', 'A SINGER', 'A SALMON', 'A SNAKE'], link: 'Things with scales', fits: 'A pianist and a singer practise scales; a salmon and a snake are covered in them.' },
  { items: ['THE SALT', 'A NOTE IN CLASS', 'THE TIME', 'A DRIVING TEST'], link: 'Things you can pass', fits: 'You can pass the salt, a note in class, the time and a driving test.' }];
const CM_CB = [
  { items: ['A SLICE OF PIZZA', 'A COAT HANGER', 'A SAIL', 'A SANDWICH CUT CORNER TO CORNER'], link: 'Things shaped like a triangle', fits: 'A slice of pizza, a coat hanger, a sail and a sandwich cut corner to corner are all triangles.' },
  { items: ['A SHARK', 'A DOLPHIN', 'A ROCKET', 'A SURFBOARD'], link: 'Things with fins', fits: 'A shark, a dolphin, a rocket and a surfboard all have fins.' },
  { items: ['YOUR VOICE', 'YOUR TEMPER', 'WEIGHT', 'YOUR KEYS'], link: 'Things you can lose', fits: 'You can lose your voice, your temper, weight and your keys.' }];
const CM_TODAY = { c: CM_C7, m: [[0, 'more'], [0, 'Things that are slow.', false], [0, 'They all have a shell.', true], [1, 'A jam.', true],
  [2, 'more'], [2, 'more'], [2, 'more'], [2, 'Beat.', true]] };
// In progress: thread 1 with three items showing, after one wrong guess.
const CM_LIVE = { c: CM_C7, m: CM_TODAY.m.slice(0, 2) };
// Earlier finished days, each guess's words written for its thread (a: No. 21's threads, b: No. 28's).
const CM_OK = [
  { c: CM_CA, m: [[0, 'The circus.', true], [1, 'more'], [1, 'Scales.', true], [2, 'Things you can catch.', false], [2, 'more'], [2, 'more'], [2, 'Things you can pass.', true]] },
  { c: CM_CB, m: [[0, 'Pointy things.', false], [0, 'Triangles.', true], [1, 'Fins.', true], [2, 'more'], [2, 'more'], [2, 'Things you can lose.', true]] },
  { c: CM_CA, m: [[0, 'more'], [0, 'Things in a show.', false], [0, 'The circus.', true], [1, 'more'], [1, 'more'], [1, 'Scales.', true], [2, 'more'], [2, 'Things you can pass.', true]] },
  { c: CM_CB, m: [[0, 'Triangles.', true], [1, 'Fins.', true], [2, 'Things you can drop.', false], [2, 'Things you can lose.', true]] },
  { c: CM_CA, m: [[0, 'more'], [0, 'more'], [0, 'more'], [0, 'The circus.', true], [1, 'more'], [1, 'Scales.', true],
    [2, 'Things you can hand over.', false], [2, 'Things you can fail.', false], [2, 'Things you can pass.', true]] }];
// The run out: three wrong guesses and a right one on thread 1, a wrong fifth on thread 2, which closes with the one item it showed (the last
// guess reveals no item), and thread 3 closes without ever opening.
const CM_FAIL = { c: CM_CB, m: [[0, 'Things in a kitchen.', false], [0, 'Things you hang up.', false], [0, 'Flat things.', false], [0, 'Triangles.', true],
  [1, 'Things that swim.', false]] };
// A day's play partway through (Config: Past day, In progress): thread 1 named after a wrong guess, thread 2 open with 2 items
// showing, thread 3 not reached; 2 of the 5 guesses spent.
const CM_PARTWAY = { c: CM_CB, m: [[0, 'Pointy things.', false], [0, 'Triangles.', true], [1, 'more']] };
export const cmPartway = (x) => { const { number, play, lines } = cmSess(CM_NO - x.i, CM_PARTWAY); return { number, play, lines }; };
// Today's threads run out the same way (Config → This edition: failed).
const CM_FAIL_TODAY = { c: CM_C7, m: [[0, 'Things that are slow.', false], [0, 'Round things.', false], [0, 'Things you can crack.', false], [0, 'Shell.', true],
  [1, 'Things in an office.', false]] };
// Today's threads on the hard play: every connection found only with all four items showing.
const CM_HARD = { c: CM_C7, m: [0, 1, 2].flatMap((k) => [[k, 'more'], [k, 'more'], [k, 'more'], [k, CM_C7[k].link + '.', true]]) };

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
    const { day, result, ...own } = cmSess(n, x.ok ? CM_OK[i % CM_OK.length] : CM_FAIL);
    return { ...base, ...own, share: x.line };
  }
  const d = dpSvDay(i, x.ok);
  return { ...base, number: n, figures: [svSunk(d.log) + ' of 5 wrecks', d.log.length + ' of ' + SLV_DIVES + ' dives'], share: x.line, shareLines: [dpSvHead(n, d.log), ...svMarks(d.log)], lines: svLines(d.log) };
};
// Connections found in a play, read from its session's figures.
const cmFoundIn = (p) => { const m = /^(\d) of 3 connections found$/.exec(((GS_SESSIONS[p.sid] || {}).figures || [])[1] || ''); return m ? +m[1] : 0; };
const dpCap = (s) => s.replace(/^./, (ch) => ch.toUpperCase());
export let DP_PZ;

// ---- Product pages ----
const dpStep = (b, rest) => <><b>{b}</b>{rest}</>;
let dpSeeResult;


// ---- In your chat: text only, as the player's own AI tells it. Each follows today's play above. ----
const dpMono = (text) => ({ type: 'mono', text });
// Chain's drawn board for a chat turn: one numbered row per word. `words` holds each word as the game shows it: a whole word (an end, a found word) or the one or two
// letters shown so far (this chain's words run four letters or more, so under three letters means hidden); `open` lists the rows the game marks open. Whole words are bold, hidden letters end in an ellipsis.
const chStats = (left, wrong) => ({ type: 'stats', items: [{ label: 'Words left', value: left }, { label: 'Wrong guesses', value: wrong }] });
const chBoard = (words, open) => ({ type: 'facts', items: words.map((w, i) => ({ label: String(i + 1), value: (w.length < 3 ? w + '…' : '**' + w + '**') + (open.includes(i) ? '  ← open' : '') })) });
// Common's drawn thread for a chat turn: the items showing, numbered as the game gives them, then the thread, the day's guesses left and what a right guess scores now.
const cmBoard = (thread, items, left, pts) => [{ type: 'facts', items: items.map((w, i) => ({ label: String(i + 1), value: '**' + w + '**' })) },
  { type: 'stats', items: [{ label: 'Thread', value: thread + ' of 3' }, { label: 'Guesses left', value: left }, { label: 'Right guess scores', value: pts }] }];


// ---- Staged states (app/states.jsx spreads them into its register). ----
// Where and Chain's session pages: today's play, in progress, failed, and an earlier play (the same four states as Accuse).
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
    blurb: 'Which country is hidden? Each guess shows how far off you are.', tags: ['Daily'], size: 'tiny' }),
  chain: gsAccess({ access: 'pass', name: GS_NAME.chain, category: 'PUZZLE', art: 'chain', route: 'chain', ed: ['chain', 'chains'], edLine: 'You get both ends. Find the words between.', daily: true, once: true,
    blurb: 'Work out the missing words in a chain where each joins the next.', tags: ['Daily'], size: 'tiny' }),
  salvage: gsAccess({ access: 'pass', name: GS_NAME.salvage, category: 'PUZZLE', art: 'salvage', route: 'salvage', ed: ['sea', 'seas'], edLine: 'You get twenty dives to find five wrecks.', daily: true, once: true,
    blurb: 'Five wrecks lie under today’s sea. Find them in twenty dives.', tags: ['Daily'], size: 'tiny' }),
  common: gsAccess({ access: 'pass', name: GS_NAME.common, category: 'PUZZLE', art: 'common', route: 'common', ed: ['day', 'days'], edLine: 'You get three threads of four items. Name each connection early.', daily: true, once: true,
    blurb: 'Name the hidden connection between four items, as early as you dare.', tags: ['Daily'], size: 'tiny' }),
});
GS_GAME_ORDER.splice(GS_GAME_ORDER.indexOf('mystery') + 1, 0, ...DP_IDS);
// ---- Art. The static cover is the moving piece's rest pose on its 160 by 120 stage (the same numbers as the CSS in index.html).
// Where: the hint's needle pointing the wrong way, and today's country. Chain: five words, the ends and their links found, the three middle words empty.
// Salvage: a board mid-hunt, cream misses and two orange hits in a row, one dive from finding a wreck of three.
// Common: four shapes in a row, each a different shape and colour. ----
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
  salvage: (r) => (r.found === 5 ? 'All 5 wrecks in ' + r.dives + ' of ' + SLV_DIVES + ' dives' : r.found + ' of 5 wrecks found'),
  common: (r) => 'Completed · ' + r.score + ' of 15',
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
// never touching, not even at a corner. 20 dives, each a hit, a miss or sunk ("Sunk: the wreck of 3" names its length). One hint, which
// costs no dive: sonar on a row or a column says how many wreck squares it holds. Complete: every wreck found within the dives. ----
SV_COLS = 'ABCDEFGH';
// Day i's sea: completed days find every wreck within the dive budget; failed days end with 3 found.
dpSvDay = (() => { const memo = {}; return (i, ok) => {
  const k = i + (ok ? 'y' : 'n'); if (memo[k]) return memo[k];
  for (let s = i * 13 + 1; s < i * 13 + 3000; s++) { const ships = svLayout(s); const log = svPlay(ships, s); if (svSunk(log) === (ok ? 5 : 3)) return (memo[k] = { ships, log }); }
  return (memo[k] = { ships: svSea(), log: svPlay(svSea(), i) });
}; })();
// ---- Today's plays, and their in-progress forms (Config: today in progress). ----
dpWhT = dpWhere(WH_TODAY, true); dpCmToday = cmSess(CM_NO, CM_TODAY);
dpChT = dpChain(CH_TODAY);
// Salvage's plays are held once, in SLV_PLAYS (gs-salvage.jsx); each session of today's edition is that play's record. The result is the deployed headline.
const svSession = (fx) => { const p = SLV_PLAYS[fx]; const done = fx !== 'live'; const found = p.raised.size;
  const result = done ? GS_RESULT.salvage({ found, dives: p.dives }) : 'In progress';
  return { kind: 'puzzle', gid: 'salvage', game: GS_NAME.salvage, art: 'salvage', number: DP_NO, fx, date: GS.today, ...(done ? { hints: 1 } : { live: true }),
    loss: p.state === 'lost', result, figures: [found + ' of 5 wrecks', p.dives + ' of ' + SLV_DIVES + ' dives'], share: done ? result : null, shareLines: done ? slvShareLinesOf(p) : undefined, lines: p.lines }; };
dpChL = dpChain({ ...CH_TODAY, p: CH_TODAY.p.slice(0, 3) });
Object.assign(GS_SESSIONS, {
  'where-today': { kind: 'puzzle', gid: 'where', game: GS_NAME.where, art: 'where', number: DP_NO, hints: 1, result: GS_RESULT.where({ ok: true, guesses: dpWhT.guesses }), date: GS.today,
    figures: [dpWhT.guesses + ' of 6 guesses', '1 hint'], share: GS_RESULT.where({ ok: true, guesses: dpWhT.guesses }), shareLines: [dpWhHead(DP_NO, dpWhT, true), dpWhT.marks], lines: dpWhT.lines },
  'where-live': { kind: 'puzzle', gid: 'where', game: GS_NAME.where, art: 'where', number: DP_NO, hints: 0, live: true, result: 'In progress', date: GS.today,
    figures: ['2 of 6 guesses', 'No hints'], share: null, lines: dpWhT.lines.slice(0, 2) },
  'chain-today': { kind: 'puzzle', gid: 'chain', game: GS_NAME.chain, art: 'chain', number: DP_NO, play: CH_TODAY, result: dpChResult(dpChT), date: GS.today,
    figures: [dpChT.words + ' words', dpWrong(dpChT.wrong).replace(/^./, (c) => c.toUpperCase())], share: dpChResult(dpChT), shareLines: [dpChHead(DP_NO, dpChT), dpChT.marks], lines: dpChT.lines },
  'chain-live': { kind: 'puzzle', gid: 'chain', game: GS_NAME.chain, art: 'chain', number: DP_NO, play: { ...CH_TODAY, p: CH_TODAY.p.slice(0, 3) }, live: true, result: 'In progress', date: GS.today,
    figures: [dpChL.found + ' of ' + dpChL.hidden + ' words', dpWrong(dpChL.wrong).replace(/^./, (c) => c.toUpperCase())], share: null, lines: dpChL.lines },
  'salvage-today': svSession('won'), 'salvage-live': svSession('live'),
  'common-today': { kind: 'puzzle', gid: 'common', game: GS_NAME.common, art: 'common', date: GS.today, ...dpCmToday, share: dpCmToday.result, recovered: true },
  'common-live': { kind: 'puzzle', gid: 'common', game: GS_NAME.common, art: 'common', number: CM_NO, play: CM_LIVE, live: true, result: 'In progress', date: GS.today,
    figures: ['Thread 1 of 3', '0 points so far'], share: null, lines: cmPlay(CM_LIVE, true).lines },
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
const dpPickCm = (play, recovered, now) => {
  const { day, ...own } = cmSess(CM_NO, play);
  return { ...GS_SESSIONS['common-today'], loss: false, recovered, ...own, share: own.result, now };
};
Object.assign(GS_SESSIONS, {
  'where-today-hard': dpPickWh(true), 'where-today-failed': dpPickWh(false),
  'chain-today-hard': dpPickCh(CH_HARD), 'chain-today-failed': dpPickCh(CH_FAIL),
  'salvage-today-hard': { ...svSession('hard'), now: { line: 'You found all five wrecks on your last dive.', bar: [SLV_PLAYS.hard.dives + ' of ' + SLV_DIVES + ' dives', SLV_PLAYS.hard.dives, SLV_DIVES] } },
  'salvage-today-failed': { ...svSession('lost'), now: { line: 'You used all ' + SLV_PLAYS.lost.dives + ' dives and found ' + SLV_PLAYS.lost.raised.size + ' of the 5 wrecks.', bar: [SLV_PLAYS.lost.dives + ' of ' + SLV_DIVES + ' dives', SLV_PLAYS.lost.dives, SLV_DIVES] } },
  'common-today-hard': dpPickCm(CM_HARD, false, { line: 'You found all three connections and scored 3 of 15.', bar: ['3 of 15', 3, 15] }),
  'common-today-failed': dpPickCm(CM_FAIL_TODAY, true, { line: 'You found 1 of the 3 connections and scored 1 of 15.', bar: ['1 of 15', 1, 15] }),
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
    title: 'Today’s sea', next: 'Next dive: tomorrow', tag: true,
    live: { line: 'You’ve found ' + SLV_PLAYS.live.raised.size + ' of the 5 wrecks in ' + SLV_PLAYS.live.dives + ' dives.', bar: [SLV_PLAYS.live.dives + ' of ' + SLV_DIVES + ' dives', SLV_PLAYS.live.dives, SLV_DIVES] },
    done: { st: { kind: 'ok', label: GS_SESSIONS['salvage-today'].result }, line: 'You found all five wrecks with ' + (SLV_DIVES - SLV_PLAYS.won.dives) + ' dives to spare.', bar: [SLV_PLAYS.won.dives + ' of ' + SLV_DIVES + ' dives', SLV_PLAYS.won.dives, SLV_DIVES] },
    recent: 'Your seas',
    ach: [{ k: 'sv1', n: 'Every wreck found', how: 'Find all five wrecks in a Salvage.', by: (p) => p.status.kind === 'ok' },
      // KEEP: a deployed achievement (monorepo play-records.ts, "Last Dive"); the platform has nine, the library shows three.
      { k: 'sv5', n: 'Last dive', how: 'Find all five wrecks with your twentieth and final dive.', by: (p) => { const m = new RegExp('^All 5 wrecks in (\\d+) of ' + SLV_DIVES).exec(p.status.label); return !!m && +m[1] === SLV_DIVES; } },
      { k: 'sv7', n: 'Seven days in a row', how: 'Find every wreck seven days running.', of: 7 }],
  },
  common: {
    count: CM_NO, no: (i) => GS_NAME.common + ' #' + (CM_NO - i), salt: 11, keep: {}, alwaysCompletes: true, today: 'common-today', liveSid: 'common-live',
    ok: (i) => cmSess(0, CM_OK[i % CM_OK.length]).result, bad: cmSess(0, CM_FAIL).result,
    title: 'Today’s threads', next: 'Next set: tomorrow',
    live: { line: 'You’re on thread 1 of 3, with 0 points so far.', bar: ['Thread 1 of 3', 1, 3] },
    done: { st: { kind: 'ok', label: GS_SESSIONS['common-today'].result }, line: 'You found all three connections and scored ' + cmScore(dpCmToday.day) + ' of 15.', bar: [cmScore(dpCmToday.day) + ' of 15', cmScore(dpCmToday.day), 15] },
    recent: 'Your days',
    // Common's eight achievements (verbatim from the platform), in the platform's order. Every finished day completes, so a day's status is always ok.
    ach: [{ k: 'cm1', n: 'First Thread', how: 'Find a connection.', by: (p) => cmFoundIn(p) > 0 },
      { k: 'cm2', n: 'Clean Sweep', how: 'Find all three connections in a day.', by: (p) => cmFoundIn(p) === 3 },
      { k: 'cm3', n: 'Ten Days', how: 'Finish ten days.', of: 10, count: (ps) => ps },
      { k: 'cm4', n: 'Seven Days in a Row', how: 'Finish a day seven days running.', of: 7 },
      { k: 'cm5', n: 'Thirty Days in a Row', how: 'Finish a day thirty days running.', of: 30 },
      { k: 'cm6', n: 'Sharp Eye', how: 'Find a connection from its first item alone.', by: (p) => ((GS_SESSIONS[p.sid] || {}).shareLines || []).some((l) => /●○○○ {2}5$/.test(l)) },
      { k: 'cm7', n: 'Full Marks', how: 'Score 15 in a day.', by: (p) => /· 15 of 15$/.test(p.status.label) },
      { k: 'cm8', n: 'Second Wind', how: 'Recover from a false start.', by: (p) => !!(GS_SESSIONS[p.sid] || {}).recovered }],
  },
};
dpSeeResult = <><b>See your result</b> on your session page.</>;
Object.assign(GS_PAGES, {
  where: {
    box: { label: 'ONLY WITH THE PASS', heading: 'A new country every day', button: 'Play today’s country',
      steps: [GS_STEP_CONNECT, dpStep('Find today’s country.', ' You get six guesses.'), dpSeeResult], small: GS_NAME.where + ' comes only with the After Pixels Pass.' },
    facts: { often: 'New every day' }, tags: [],
    pitch: { h: 'Which country is hidden? Each guess shows how far off you are.', ps: [
      'A different country is hidden every day, and you have six guesses to find it. Name any country in the world, and you’re told how far it lies from the hidden one.',
      'A guess on the far side of the world still helps, because it tells you where the country isn’t. Each distance rules out more of the world, so every guess closes in on where it’s hiding. When you’re torn between places, your one hint gives the compass direction from your latest guess.'] },
    who: { ai: 'Lists every guess with its distance after each turn, and tells you a little about the country once you’ve found it.', server: 'Keeps the country secret, measures every distance and works out which way the hint points.' },
    week: { title: 'Today’s country', line: 'You get six guesses and one hint.', session: 'where-today' },
  },
  chain: {
    box: { label: 'ONLY WITH THE PASS', heading: 'A new chain every day', button: 'Play today’s chain',
      steps: [GS_STEP_CONNECT, dpStep('Fill in today’s chain', ', working in from either end.'), dpSeeResult], small: GS_NAME.chain + ' comes only with the After Pixels Pass.' },
    facts: { often: 'New every day' }, tags: [],
    pitch: { h: 'Work out the missing words in a chain where each joins the next.', ps: [
      'A line of words has its two ends showing, and the words between are yours to find. Each one joins the next, either fused into a single word, like rainbow, or as a pair that belong together, like bow tie.',
      'Start with a word next to either end and work inward. Each word you find lets you guess the word beside it, and a wrong guess shows you the next letter of that word.'] },
    who: { ai: 'Draws the whole line after every guess, with the words you can try next marked, and goes through every link once the chain is solved.', server: 'Keeps the chain secret, shows only the letters you’ve earned, and gives a word away once its letters run out.' },
    week: { title: 'Today’s chain', line: 'You get both ends and every first letter.', session: 'chain-today' },
  },
  salvage: {
    box: { label: 'ONLY WITH THE PASS', heading: 'A new sea every day', button: 'Play today’s sea',
      steps: [GS_STEP_CONNECT, dpStep('Find today’s five wrecks.', ' You get twenty dives.'), dpSeeResult], small: GS_NAME.salvage + ' comes only with the After Pixels Pass.' },
    facts: { often: 'New every day' }, tags: [],
    pitch: { h: 'Five wrecks lie somewhere on the sea bed. Find them in twenty dives.', ps: [
      'Some rows and columns of the sea carry a count in the margin, the number of wreck squares that lie along them. Each dive comes back a miss, a hit or a whole wreck raised, and from the counts and the dives you work out where the other wrecks must lie.',
      'You also get three tools: a sonar sweep that counts a row or column, a metal detector that counts the wreck squares around a square, and a dragnet that snags the first wreck square on a line. Every sea can be solved by reasoning from its counts and these tools.'] },
    who: { ai: 'Draws the whole sea after every dive, with the counts in the margins, the dives and tools you have left, and the wrecks still to find.', server: 'Keeps the wrecks secret, answers every dive and tool, and counts what you have left.' },
    week: { title: 'Today’s sea', line: 'You get twenty dives to find five wrecks.', session: 'salvage-today' },
  },
  common: {
    box: { label: 'ONLY WITH THE PASS', heading: 'Three new threads every day', button: 'Play today’s threads',
      steps: [GS_STEP_CONNECT, dpStep('Ask for another item', ', guess, or pass.'), dpSeeResult], small: GS_NAME.common + ' comes only with the After Pixels Pass.' },
    facts: { often: 'New every day' }, tags: [],
    pitch: { h: 'An egg, a tortoise and a peanut share something. Guess it early for more points.', ps: [
      'Each day brings three threads, and a thread is four items that share one hidden connection. The game shows them one at a time, starting with a single item that could point several ways.',
      'The earlier you name the connection, the more it scores, so the skill is knowing when to commit. However a thread ends, the game shows its connection and how every item fits, so even a thread that scores nothing ends with the answer.'] },
    who: { ai: 'Shows each item as it arrives, with your guesses left and what a right guess scores, and explains how every item fits once a thread closes.', server: 'Keeps every unseen item and each connection secret, and marks every guess.' },
    week: { title: 'Today’s threads', line: 'You get three threads of four items.', session: 'common-today' },
  },
});
const WH_STATS = (guesses, hints) => ({ type: 'stats', items: [{ label: 'Guesses left', value: guesses }, { label: 'Hints left', value: hints }] });
Object.assign(GS_CHATS, {
  // Where: the product page's three chats, written for the page from a real play (2026-11-08) and the game spec (where.md §4, §5). The case is not
  // a real edition: Austria, No. 112 (the scheduled editions run to 45 and never name Austria), with distances from the shipped atlas to the nearest 10 km.
  where: [
    { cap: 'You get six guesses and one hint.', turns: [gscU('Play Where on After Pixels'),
      gscAi('where', ['Where No. 112 is ready: find today’s country in six guesses. Each miss comes back as a border-to-border distance, and 0 means the two touch. After your first guess, your one hint gives the compass direction from your latest guess. Which country first?'])] },
    { cap: 'Each guess comes back as a distance from the country.', turns: [gscU('Brazil'),
      gscAi('where', 'Brazil is 7,290 km away.', [{ type: 'facts', items: [{ label: 'Brazil', value: '7,290 km' }] }, WH_STATS(5, 1)]),
      gscU('Give me the hint'),
      gscAi('where', 'From Brazil, today’s country lies northeast.', [{ type: 'facts', items: [{ label: 'Brazil', value: '7,290 km' }, { label: 'Hint', value: 'Northeast of Brazil' }] }, WH_STATS(5, 0)]),
      gscU('France'),
      gscAi('where', 'France is 140 km away.', [{ type: 'facts', items: [{ label: 'Brazil', value: '7,290 km' }, { label: 'France', value: '140 km' }] }, WH_STATS(4, 0)])] },
    { cap: 'A guess at 0 km means the answer is one of its neighbours.', turns: [gscU('Germany'),
      gscAi('where', 'Germany shares a border with today’s country.', [{ type: 'facts', items: [{ label: 'Brazil', value: '7,290 km' }, { label: 'France', value: '140 km' }, { label: 'Germany', value: '0 km, shares a border' }] }, WH_STATS(3, 0)]),
      gscU('Austria'),
      gscAi('where', ['Today’s country is Austria.', 'It sits in the Alps, and Vienna is its capital.'], [{ type: 'result', title: 'Where No. 112', status: 'Found', stats: [{ label: 'Guesses', value: '4 of 6' }, { label: 'Hints used', value: 1 }] }]),
      gscU('Share my result'),
      gscAi('where', null, null, [{ type: 'mono', text: 'Where No. 112 · found in 4 of 6 · 1 hint\n○ ◐ ● ◉\nhttps://afterpixels.com/discover/where' }])] },
  ],
  // Chain: the product page's four chats, written for the page from a real play (2026-11-08, No. 20) and the game spec (chain.md §2 to §5).
  // The chain is not a real edition: CROSS, WORD, PLAY, BACK, TRACK, "No. 112" (scheduled editions run to 45; none holds this line), every link in the shipped link list.
  // The board is the design system's FactRows, as the deployed script has the AI draw it each turn: every word numbered, hidden words as the letters shown, open words marked.
  chain: [
    { cap: 'You get both ends and each word’s first letter. Only a word marked open can be guessed.', turns: [gscU('Play Chain on After Pixels'),
      gscAi('chain', null, null, [chBoard(['CROSS', 'W', 'P', 'B', 'TRACK'], [1, 3]), chStats(3, 0)])] },
    { cap: 'A wrong guess shows the next letter of that word.', turns: [gscU('Wire'),
      gscAi('chain', null, null, [chBoard(['CROSS', 'WO', 'P', 'B', 'TRACK'], [1, 3]), chStats(3, 1)]),
      gscU('Word'),
      gscAi('chain', null, null, [chBoard(['CROSS', 'WORD', 'P', 'B', 'TRACK'], [2, 3]), chStats(2, 1)])] },
    { cap: 'Once it is solved, you get every link and a result that names no word.', turns: [gscU('Back'),
      gscAi('chain', null, null, [chBoard(['CROSS', 'WORD', 'P', 'BACK', 'TRACK'], [2]), chStats(1, 1)]),
      gscU('Play'),
      gscAi('chain', 'The links are crossword, wordplay, playback and backtrack.', null, [chBoard(['CROSS', 'WORD', 'PLAY', 'BACK', 'TRACK'], []), chStats(0, 1)]),
      gscU('Share my result'),
      gscAi('chain', null, null, [{ type: 'mono', text: 'Chain No. 112 · solved · 1 wrong guess\n●—◐—●—●—●\nhttps://afterpixels.com/discover/chain' }])] },
  ],
  // Salvage: the product page's three chats, written for the page from a real play (2026-11-08, No. 20) and the game spec (salvage.md §1 to §5). The sea is not a real
  // edition (see SV_CHAT_SEA): the real play mirrored left to right, as No. 112. The sea is drawn as the deployed script has the AI draw it each turn (svGrid).
  salvage: [
    { cap: 'Five wrecks lie hidden, and the margins count some rows and columns.', turns: [gscU('Play Salvage on After Pixels'),
      gscAi('salvage', 'The bell goes down over a grey, quiet sea. The five wrecks lie hidden, none touching.', [svGrid([], [], []), svStats(20, 3)])] },
    { cap: 'A dragnet snags the first wreck square on a line.', turns: [gscU('Row 1 counts 4, so dragnet along it from the left'),
      gscAi('salvage', 'The dragnet snagged at D1, a hit.', [svGrid([], ['D1'], []), svStats(20, 2)])] },
    { cap: 'The last wreck raised wins the day.', turns: [gscU('D5 to finish it'),
      gscAi('salvage', 'D5 raised the wreck of 3, covering B5 to D5.', [svGrid(['A4'], [], SV_WRECK_SQUARES, { cols: { A: 3 } }), { type: 'result', title: 'Salvage No. 112', status: 'All 5 wrecks', stats: [{ label: 'Dives used', value: '14 of 20' }, { label: 'Tools used', value: 3 }] }]),
      gscU('Share my result'),
      gscAi('salvage', null, null, [{ type: 'mono', text: 'Salvage No. 112 · all 5 wrecks · 14 of 20 dives\n🕸️ ✕ ✕ ■ 🧲 ✕ ■ 📡 ○ ✕\n■ ✕ ✕ ■ ✕ ✕ ■\nhttps://afterpixels.com/discover/salvage' }])] },
  ],
  // Common: the product page's three chats, written for the page from a real play (2026-11-08, No. 35) and the game spec (common.md §2, §4, §5).
  // The day is not a real edition: No. 112 (the scheduled editions run to 63), with threads the link pool holds no copy of. The board is the design
  // system's FactRows (the items showing, as the game gives them) and StatRow, as the deployed script has the AI read each thread.
  common: [
    { cap: 'Each thread opens with a single item.', turns: [gscU('Play Common on After Pixels'),
      gscAi('common', null, null, cmBoard(1, ['A RIVER'], 5, 5))] },
    { cap: 'Every extra item you see lowers what a right guess scores.', turns: [gscU('Another item'),
      gscAi('common', null, null, cmBoard(1, ['A RIVER', 'A BOTTLE'], 5, 3)),
      gscU('Things that hold water'),
      gscAi('common', '“Things that hold water” wasn’t it.', null, cmBoard(1, ['A RIVER', 'A BOTTLE', 'A CAVE'], 4, 2))] },
    { cap: 'When a thread closes, your AI gives the connection and how each item fits.', turns: [gscU('Things with a hinge'),
      gscAi('common', 'Correct! Thread 3 was Things with a hinge, worth 3 points. A laptop and a door swing on one, a clam’s two shells open on one, and so do the arms of a pair of glasses.',
        null, [{ type: 'result', title: 'Common No. 112', status: 'Completed', stats: [{ label: 'Score', value: '10 of 15' }, { label: 'Threads found', value: '3 of 3' }] }]),
      gscU('Share my result'),
      gscAi('common', null, null, [{ type: 'mono', text: 'Common No. 112 · 10/15\n\n🟧🟧🟧⬛  2\n🟦⬛⬛⬛  5\n🟪🟪⬛⬛  3\nafterpixels.com/discover/common' }])] },
  ],
});
DP_SESSION_STATES = ['where', 'chain', 'salvage'].flatMap((k) => { const n = GS_NAME[k]; const [g, sp] = dpSessAt(k);
  const open = (id, extra) => (c) => { c.setView('pass'); c.setConnected(true); if (extra) c.setReview(extra); c.go('session', { id: typeof id === 'function' ? id() : id }); };
  return [
    { group: g, id: 'session-' + k + '-in-progress', label: sp + n + ' in progress', stage: open(k + '-live', { week: 'live' }) },
    // Salvage's own failed and earlier plays are fixtures only on today's edition (app/gs-salvage.jsx), so its failed state is today's, picked in Config → This edition.
    k === 'salvage'
      ? { group: g, id: 'session-salvage-failed', label: sp + n + ' today, failed', stage: open('salvage-today-failed', { ed: 'failed' }) }
      : { group: g, id: 'session-' + k + '-failed', label: sp + n + ', an earlier play that failed', stage: open(dpEarlier(k, false)) },
    ...(k === 'salvage' ? [] : [{ group: g, id: 'session-' + k + '-earlier', label: sp + n + ', an earlier play (played once)', stage: open(dpEarlier(k, true)) }]),
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
  ...(k === 'salvage' ? [
    { group: g, id: 'library-salvage-failed', label: 'Salvage in your library, today failed (two wrecks not raised)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ ed: 'failed' }); c.go(k, { page: 'record' }); } },
  ] : []),
  { group: dpSessAt(k)[0], id: 'session-' + k, label: k === 'chain' ? dpSessAt(k)[1] + n : 'Session page: ' + n + ' today, with Share', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: k + '-today' }); } },
]; });
DP_STATES = [...DP_PZ_STATES, ...DP_SESSION_STATES];
}
