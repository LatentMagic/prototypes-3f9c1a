// ============================================================================
// After Pixels — Accuse's session page (1236): the notebook, the board and the panel, on the shared session card (GsSessCard).
//   Notebook: Escape's sheet as a case folder. Tabs Setting, Suspects, Weapons, Places, Clues, Hints; the open tab joins the folder,
//     which holds its chips and one reader. Hints is greyed out at 0.
//   Board: the case's cards in three ruled columns, marked in pen once played. A ring only ever means the player's pick: green when
//     right, amber when wrong. The truth the player missed is underlined once in green. No legend.
//   Panel: Hints as Salvage's count in a card of its own, then The culprit as a case card: "Case open" over blank lines while in
//     progress; once played "Case closed" or "Case cold", the culprit's name, and with what and where beneath.
// Every session of Accuse is a play of the one case below, the deployed edition 1 case (ski-lodge cast): the earlier editions' plays too (pzSession in
// gs-puzzles-library.jsx). The now card (gs-accuse-now.jsx) reuses the panel's two cards. Styles: app/gs-accuse.css.
// ============================================================================
import React from 'react';
import { GS, GS_SESSIONS } from './gs-data.jsx';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { EsxFold } from './gs-escape-sheet.jsx';
import { Big } from './gs-salvage.jsx';
import { GS_SESSION_BODY } from './registry.js';

const ACC_CASE = {
  no: 64,
  // The deployed case's scene, word for word: the setting's description, then who the victim was (case-generator.ts).
  scene: [{ id: 'scene', name: 'The scene', text: 'An avalanche has blocked the only road down the mountain, and the guests are stuck at the Edelweiss Lodge until the snowploughs come. Klaus Berger had raised the prices, called in old debts and insulted every one of his guests at dinner.' }],
  suspects: [['Mr Piers Fairfax', 'A land agent who wants to build a hotel where the lodge stands.'], ['Toby Lang', 'A young instructor whose job depends on Berger’s mood.'],
    ['Anneliese Berger', 'His wife, who wants a divorce he refuses to give.'], ['Rick Dawson', 'A champion skier whose medal Berger said was won by cheating.']],
  weapons: [['Hunting knife', 'With a short, sharp blade.'], ['Bottle of schnapps', 'Strong, and nearly full.'], ['Snow shovel', 'Steel-edged.'],
    ['Climbing rope', 'Red, and very strong.']],
  places: [['Great hall', 'Antlers over a stone fireplace.'], ['Games room', 'A dartboard and a chess table.'], ['Cable car hut', 'A cold hut at the top of the lift.'],
    ['Cellar bar', 'Low, warm and full of pipe smoke.']],
  clues: ['Whoever carried the snow shovel was not in the games room.', 'The killer was in the cable car hut.', 'Anneliese Berger was not in the great hall.',
    'Anneliese Berger carried the snow shovel.', 'Rick Dawson was in the cellar bar.'],
  hints: ['Anneliese Berger was not in the games room.', 'Whoever carried the snow shovel was not in the great hall.'],
  truth: ['Anneliese Berger', 'Snow shovel', 'Cable car hut'],
};
export const ACC_TRUTH = ACC_CASE.truth;
const accLow = (x) => x.charAt(0).toLowerCase() + x.slice(1);
// The culprit's weapon and place, "with the X, in the Y.", the case card's last line.
// KEEP: deployed places carry their own preposition (clue.ts, 29 of 63 cases take "on" or "at"); "in the" holds only for this sample case.
export const accWithWhere = () => 'with the ' + accLow(ACC_TRUTH[1]) + ', in the ' + accLow(ACC_TRUTH[2]) + '.';
// A wrong accusation gets one part wrong: part 0 the suspect, 1 the weapon, 2 the place.
export const accWrong = (part) => ACC_TRUTH.map((t, k) => (k === part ? [ACC_CASE.suspects, ACC_CASE.weapons, ACC_CASE.places][k].map((c) => c[0]).find((n) => n !== t) : t));
// The one place the three-way result (in progress, solved, failed) is decided: the tone and the word.
export const accResult = (p) => (p.live ? { tone: 'live', word: 'In progress' } : p.right ? { tone: 'ok', word: 'Solved' } : { tone: 'bad', word: 'Failed' });
// A play of the case: the hints taken (0 to 2) and the accusation (suspect, weapon, place), or none while the case is open.
export const accSession = ({ no, date, hints, pick }) => {
  const live = !pick; const right = !live && pick.every((x, i) => x === ACC_TRUTH[i]);
  // As the deployed record writes them: each hint labelled "Hint", and the accusation as one marked part per card, "Rick Dawson: Wrong".
  const hintLines = ACC_CASE.hints.slice(0, hints).map((h) => ['Hint', h]);
  const accPart = (x, k) => (k ? 'the ' + accLow(x) : x) + ': ' + (x === ACC_TRUTH[k] ? 'Right' : 'Wrong');
  const lines = live ? hintLines : [...hintLines, ['Accusation', ...pick.map(accPart)]];
  const result = accResult({ live, right }).word;
  // Share text as the game spec gives it: the verdict and the hints taken; a failed case adds a line marking each part, never naming a card.
  const shareLines = live ? null : [
    'Accuse No. ' + no + ' · ' + result.toLowerCase() + (hints ? ' · ' + hints + (hints === 1 ? ' hint ' : ' hints ') + '💡'.repeat(hints) : ''),
    ...(right ? [] : [['suspect', 'weapon', 'place'].map((k, i) => k + ' ' + (pick[i] === ACC_TRUTH[i] ? '✓' : '✗')).join(' · ')])];
  return { kind: 'puzzle', gid: 'mystery', game: 'Accuse', art: 'murder', number: no, date, hints, live, loss: !live && !right, result, share: live ? null : result,
    shareLines, lines, acc: { hints, pick, live, right } };
};

// ---- Notebook. The groups, in tab order; each item is a chip that opens one reader under the chips. ----
const ACC_IC = {
  scene: 'M3 21h18M5 21V10l7-6 7 6v11M10 21v-5h4v5',
  suspects: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21c0-4 3.4-6 7.5-6s7.5 2 7.5 6',
  weapons: 'M5 19L17 7M14 4l6 6M4 20l2-2',
  places: 'M6 21V3.5h12V21M3.5 21h17M14.5 12.5h.01',
  hints: 'M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3zM9.5 19h5M10.5 21.5h3',
};
const accGroups = (p) => {
  const named = (k, list) => list.map(([name, text]) => ({ id: k + ':' + name, name, text }));
  // Suspects, Weapons and Places show no count: every case has four of each (game spec daily-mystery.md), so the number never
  // changes and says nothing (owner's ruling). Clues (5 or 6) and Hints (0 to 2) keep theirs.
  return [
    { key: 'scene', head: 'Setting', items: ACC_CASE.scene, count: null },
    { key: 'suspects', head: 'Suspects', items: named('s', ACC_CASE.suspects), count: null },
    { key: 'weapons', head: 'Weapons', items: named('w', ACC_CASE.weapons), count: null },
    { key: 'places', head: 'Places', items: named('p', ACC_CASE.places), count: null },
    { key: 'clues', head: 'Clues', items: ACC_CASE.clues.map((text, i) => ({ id: 'c' + i, name: 'Clue ' + (i + 1), text })) },
    { key: 'hints', head: 'Hints', items: ACC_CASE.hints.slice(0, p.hints).map((text, i) => ({ id: 'h' + i, name: 'Hint ' + (i + 1), text })) },
  ];
};
const AccIcon = ({ k }) => (k === 'clues'
  ? <span className="esx-mk" aria-hidden="true"><i className="esx-slip" /></span>
  : <span className="esx-mk acc-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"><path d={ACC_IC[k]} /></svg></span>);

// KEEP: as Escape's sheet, no tab is open at first and the folder is shut; a tap on a tab opens the folder on its things, a tap on
// another swaps the contents and shuts the reader, and a tap on the open tab shuts the folder. A tab with nothing in it (Hints at 0)
// is greyed out and does nothing. On a phone (sheet 560px or less) each tab shows its icon and count only and the open tab's
// name heads the folder, so six tabs fit across 358px without clipping a word.
const AccNotebook = ({ p }) => {
  const g = React.useMemo(() => accGroups(p), [p]);
  const [open, setOpen] = React.useState(null); const [sel, setSel] = React.useState(null);
  const grp = g.find((x) => x.key === open); const it = sel && grp && grp.items.find((x) => x.id === sel);
  return <section className="dv4 esx-sheet acc-nb" aria-label="Notebook">
    <span className="gs-sc-cap">Notebook</span>
    <div className="acc-tabs" role="tablist" data-open={grp ? 'y' : 'n'}>{g.map((x) => (
      <button key={x.key} type="button" role="tab" aria-selected={open === x.key} aria-expanded={open === x.key} disabled={!x.items.length}
        aria-label={x.head + (x.count === null ? '' : ' ' + x.items.length)} className={'acc-tab' + (open === x.key ? ' is-open' : '')}
        onClick={() => { setOpen(open === x.key ? null : x.key); setSel(null); }}>
        <span className="acc-tl"><AccIcon k={x.key} /><span className="acc-tn">{x.head}</span></span>
        <b className="esx-num">{x.count === null ? ' ' : x.items.length}</b>
      </button>))}</div>
    <EsxFold open={!!grp}>{grp && <div className="acc-folder" role="tabpanel" aria-label={grp.head}>
      <span className="acc-fh">{grp.head}</span>
      <div key={grp.key} className="esx-chips esx-in">{grp.items.map((x) => (
        <button key={x.id} type="button" className="esx-chip" aria-expanded={sel === x.id} onClick={() => setSel(sel === x.id ? null : x.id)}>
          <b>{x.name}</b></button>))}</div>
      <EsxFold open={!!it}>{it && <div key={it.id} className="esx-read esx-in"><span className="esx-nm"><b>{it.name}</b></span><p className="esx-tx">{it.text}</p></div>}</EsxFold>
    </div>}</EsxFold>
  </section>;
};

// ---- Board: the pen. Marks are drawn over the words, measured from where each word sits, so a ring fits a name that wraps. ----
const accSeed = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const accSmooth = (p) => { let d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
  for (let i = 0; i < p.length - 1; i++) { const a = p[i - 1] || p[i]; const b = p[i]; const c = p[i + 1]; const e = p[i + 2] || c;
    d += ' C' + [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6, c[0], c[1]].map((v) => v.toFixed(1)).join(' '); }
  return d; };
// A ring: a little over one turn, spiralling out slightly so its ends cross as a pen's do.
const accRing = (L, T, R, B, r) => { const cx = (L + R) / 2; const cy = (T + B) / 2; const rx = (R - L) / 2; const ry = (B - T) / 2;
  const tilt = (r() - 0.5) * 0.06; const a0 = -2 + (r() - 0.5) * 0.4; const p = [];
  for (let i = 0; i <= 22; i++) { const t = i / 22; const a = a0 + Math.PI * 2.2 * t; const f = 1 + (r() - 0.5) * 0.05 + 0.08 * (t - 0.5);
    const x = Math.cos(a) * rx * f; const y = Math.sin(a) * ry * f; p.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]); }
  return accSmooth(p); };
const accLine = (x1, x2, y, r) => { const p = []; const n = Math.max(2, Math.round((x2 - x1) / 30));
  for (let i = 0; i <= n; i++) { const t = i / n; p.push([x1 + (x2 - x1) * t, y + 0.8 * (t - 0.5) + (r() - 0.5) * 1.2]); } return accSmooth(p); };
// Only the word itself is measured, not the hidden words for screen readers that follow it.
const accRects = (el) => { const g = document.createRange(); g.selectNodeContents(el.firstChild); return [...g.getClientRects()].filter((q) => q.width > 1); };
// KEEP: the pen marks are redrawn whenever the board changes size, and a ring never reaches more than 5px past its column, so it never
// crosses into the next column's words.
const accDraw = (host, ov) => {
  const H = host.getBoundingClientRect(); let out = '';
  host.querySelectorAll('[data-pen]').forEach((el) => {
    const k = el.dataset.pen; const r = accSeed(el.textContent + k); const rs = accRects(el); if (!rs.length) return;
    const L = Math.min(...rs.map((q) => q.left)) - H.left; const R = Math.max(...rs.map((q) => q.right)) - H.left;
    const T = Math.min(...rs.map((q) => q.top)) - H.top; const B = Math.max(...rs.map((q) => q.bottom)) - H.top;
    const C = el.closest('.acc-col').getBoundingClientRect();
    if (k !== 'miss') out += '<path class="' + (k === 'right' ? 'g' : 'a') + '" d="' + accRing(Math.max(L - 7, C.left - H.left - 5), T - 4, Math.min(R + 7, C.right - H.left + 5), B + 3, r) + '"/>';
    else rs.forEach((q) => { out += '<path class="g" d="' + accLine(q.left - H.left - 1, q.right - H.left + 1, q.bottom - H.top + 1, r) + '"/>'; });
  });
  ov.innerHTML = out;
};
const ACC_HEADS = ['Suspects', 'Weapons', 'Places'];
const AccBoard = ({ p }) => {
  const host = React.useRef(null); const ov = React.useRef(null);
  React.useLayoutEffect(() => {
    const draw = () => host.current && accDraw(host.current, ov.current);
    draw(); if (document.fonts) document.fonts.ready.then(draw);
    const ro = new ResizeObserver(draw); ro.observe(host.current); return () => ro.disconnect();
  }, [p]);
  // A word's mark: right (the player's pick, and true), wrong (the player's pick, not true), miss (true, not picked), or none.
  const mark = (k, name) => { if (!p.pick) return null; const mine = p.pick[k] === name; const t = ACC_CASE.truth[k] === name;
    return mine ? (t ? 'right' : 'wrong') : t ? 'miss' : null; };
  const say = { right: ', your pick, right', wrong: ', your pick, wrong', miss: ', the answer' };
  return <div className="acc-bd" ref={host}>
    {[ACC_CASE.suspects, ACC_CASE.weapons, ACC_CASE.places].map((list, k) => (
      <div key={k} className="acc-col"><span className="gs-sc-cap">{ACC_HEADS[k]}</span>
        <ul>{list.map(([name]) => { const m = mark(k, name);
          return <li key={name}>{m ? <span className="acc-m" data-pen={m}>{name}<span className="acc-sr">{say[m]}</span></span> : name}</li>; })}</ul>
      </div>))}
    <svg className="acc-ov" ref={ov} aria-hidden="true" />
  </div>;
};

// ---- Panel. ----
export const AccCulprit = ({ p }) => (p.live
  ? <div className="acc-case is-open"><span className="acc-tag">Case open</span><span className="acc-blank" /><span className="acc-blank is-s" /></div>
  : <div className="acc-case"><span className={'acc-tag ' + (p.right ? 'is-ok' : 'is-bad')}>{p.right ? 'Case closed' : 'Case cold'}</span>
    <span className="acc-name">{ACC_CASE.truth[0]}</span><span className="acc-sent">{accWithWhere()}</span></div>);


// Hints taken, as Salvage's count (Big) in a card of its own, with the case card's edge and corner. Open while the case is.
export const AccHintsCard = ({ p }) => <div className={'acc-hc' + (p.live ? ' is-open' : '')}><Big n={p.hints} of={2} /></div>;

const AccPage = ({ s }) => { const p = s.acc;
  return <div className="dv4-lay">
    <AccNotebook p={p} />
    <GsSessCard r={accResult(p)} className="acc-card" board={<AccBoard p={p} />}
      rows={[['Hints', <AccHintsCard p={p} />], ['The culprit', <AccCulprit p={p} />]]} />
    {s.lines.length > 0 && <GsMoves s={s} />}
  </div>; };
const AccBody = ({ s, sid }) => <AccPage key={sid} s={s} />;

// Today's edition in each play the demo bar and Config → This edition pick, its in-progress form and one earlier case. Today's seeded
// play is the failed one (an accusation with the suspect wrong, after two hints). Earlier editions: pzSession (gs-puzzles-library.jsx).
export const initGsAccuse = () => {
  GS_SESSION_BODY.mystery = AccBody;
  Object.assign(GS_SESSIONS, {
    'mystery-today': accSession({ no: ACC_CASE.no, date: GS.today, hints: 2, pick: ['Rick Dawson', 'Snow shovel', 'Cable car hut'] }),
    'mystery-today-avg': accSession({ no: ACC_CASE.no, date: GS.today, hints: 0, pick: ACC_TRUTH }),
    'mystery-today-hard': accSession({ no: ACC_CASE.no, date: GS.today, hints: 2, pick: ACC_TRUTH }),
    'mystery-live': accSession({ no: ACC_CASE.no, date: GS.today, hints: 1, pick: null }),
    'mystery-1004': accSession({ no: 62, date: 'Sunday 4 October', hints: 1, pick: ACC_TRUTH }),
  });
};
