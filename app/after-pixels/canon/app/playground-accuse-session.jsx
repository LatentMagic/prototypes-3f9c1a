// ============================================================================
// PLAYGROUND, not canon (branch candidate/accuse-session-hifi): Accuse's session page at hi fi, built from the picks made on the
// hi-fi canvases (one per element). Every direction shares the fundamentals and the parts below (PgaPage draws the page from them);
// directions differ only in how they resolve space: where the six tabs go, how the board and panel align. Each has a note at its head.
//   Notebook: Escape's sheet as a case folder. Tabs Scene, Suspects, Weapons, Places, Clues, Hints; the open tab joins the folder,
//     which holds its chips and one reader. Hints is greyed out at 0.
//   Board: the case's cards in three ruled columns, marked in pen once played. A ring only ever means the player's pick: green when
//     right, amber when wrong. The truth the player missed is underlined once in green. No legend.
//   Panel: Hints as Salvage's count, its own part (Big: the number large, "/2" small), then The culprit as a case card: "Case open" over blank lines while
//     in progress; once played "Case closed" or "Case cold", the culprit's name, and with what and where beneath.
// The case is invented sample data (the low-fi vision's), carried by its own fixture, so Accuse's canon data is untouched.
// Open with ?pg=accuse-session. To remove it: delete this file and playground-accuse-session.css, their lines in main.jsx and
// canon.css, and the exports of EsxFold in gs-escape-sheet.jsx and Big in gs-salvage.jsx.
// ============================================================================
import React from 'react';
import { GS_SESSIONS } from './gs-data.jsx';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { EsxFold } from './gs-escape-sheet.jsx';
import { Big } from './gs-salvage.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_SESSION_BODY } from './registry.js';

// ---- Fixture: one case, as the low-fi vision drew it. ----
const PGA_CASE = {
  no: 64,
  scene: [
    { id: 'lodge', name: 'The lodge', text: 'A snowed-in weekend at the Edelweiss Lodge. The cable car stopped at dusk; nobody left.' },
    { id: 'victim', name: 'The victim', text: 'Klaus Berger, the lodge owner, found at first light. Last seen arguing in the great hall.' }],
  suspects: [['Toby Lang', 'Ski instructor. Owed Klaus money.'], ['Mrs Harriet Coombe', 'A guest of twenty winters.'], ['Rick Dawson', 'The barman.'],
    ['Dr Lena Fischer', 'A doctor on holiday, or so she says. She arrived the night before the cable car stopped.']],
  weapons: [['Hunting knife', 'From the trophy wall.'], ['Bottle of schnapps', 'Half empty, from the bar.'], ['Brass cowbell', 'A souvenir by the door.'],
    ['Walking stick', 'Klaus’s own, silver-topped.']],
  places: [['Sauna', 'Down the outside steps.'], ['Great hall', 'The fire, the long table.'], ['Games room', 'Billiards and old maps.'],
    ['Cable car hut', 'At the top of the line, unheated.']],
  clues: ['Whoever carried the hunting knife was not in the sauna.', 'The killer carried the brass cowbell.', 'Dr Lena Fischer carried the brass cowbell.',
    'Whoever was in the great hall carried the bottle of schnapps.', 'Whoever carried the walking stick was not in the sauna.'],
  hints: ['Rick Dawson was not in the games room.', 'The walking stick was in the great hall.'],
  truth: ['Dr Lena Fischer', 'Brass cowbell', 'Cable car hut'],
};
// A play: the hints taken, and the accusation (suspect, weapon, place), or none while the case is open.
const PGA_PLAYS = {
  solved: { hints: 0, pick: PGA_CASE.truth },
  failed: { hints: 2, pick: ['Rick Dawson', 'Brass cowbell', 'Cable car hut'] },
  live: { hints: 1, pick: null },
};
const pgaLow = (x) => x.charAt(0).toLowerCase() + x.slice(1);
const pgaSentence = ([s, w, p]) => s + ', with the ' + pgaLow(w) + ', in the ' + pgaLow(p);
const pgaSession = (key) => {
  const p = PGA_PLAYS[key]; const live = !p.pick; const right = !live && p.pick.every((x, i) => x === PGA_CASE.truth[i]);
  const hintLines = PGA_CASE.hints.slice(0, p.hints).map((h, i) => ['Hint ' + (i + 1), h]);
  const lines = live ? hintLines : [...hintLines, ['Accusation', pgaSentence(p.pick), right ? 'Right' : 'Wrong']];
  const result = live ? 'In progress' : right ? 'Solved' : 'Failed';
  return { ...GS_SESSIONS['mystery-today'], number: PGA_CASE.no, live, loss: !live && !right, result, share: live ? null : result,
    figures: [], lines, pga: { ...p, live, right } };
};

// ---- Notebook. The groups, in tab order; each item is a chip that opens one reader under the chips. ----
const PGA_IC = {
  scene: 'M3 21h18M5 21V10l7-6 7 6v11M10 21v-5h4v5',
  suspects: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21c0-4 3.4-6 7.5-6s7.5 2 7.5 6',
  weapons: 'M5 19L17 7M14 4l6 6M4 20l2-2',
  places: 'M6 21V3.5h12V21M3.5 21h17M14.5 12.5h.01',
  hints: 'M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3zM9.5 19h5M10.5 21.5h3',
};
const pgaGroups = (p) => {
  const named = (k, list) => list.map(([name, text]) => ({ id: k + ':' + name, name, text }));
  return [
    { key: 'scene', head: 'Scene', items: PGA_CASE.scene, count: null },
    { key: 'suspects', head: 'Suspects', items: named('s', PGA_CASE.suspects) },
    { key: 'weapons', head: 'Weapons', items: named('w', PGA_CASE.weapons) },
    { key: 'places', head: 'Places', items: named('p', PGA_CASE.places) },
    { key: 'clues', head: 'Clues', items: PGA_CASE.clues.map((text, i) => ({ id: 'c' + i, name: 'Clue ' + (i + 1), text })) },
    { key: 'hints', head: 'Hints', items: PGA_CASE.hints.slice(0, p.hints).map((text, i) => ({ id: 'h' + i, name: 'Hint ' + (i + 1), text })) },
  ];
};
const PgaIcon = ({ k }) => (k === 'clues'
  ? <span className="esx-mk" aria-hidden="true"><i className="esx-slip" /></span>
  : <span className="esx-mk pga-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"><path d={PGA_IC[k]} /></svg></span>);

// KEEP: as Escape's sheet, no tab is open at first and the folder is shut; a tap on a tab opens the folder on its things, a tap on
// another swaps the contents and shuts the reader, and a tap on the open tab shuts the folder. A tab with nothing in it (Hints at 0)
// is greyed out and does nothing. How the six tabs fit is each direction's own (`lay`, a class
// on the sheet; the CSS says how): direction 1 on a phone (sheet 560px or less) shows each tab's icon and count only, and the open
// tab's name heads the folder, so six tabs fit across 358px without clipping a word.
const PgaNotebook = ({ p, lay = '' }) => {
  const g = React.useMemo(() => pgaGroups(p), [p]);
  const [open, setOpen] = React.useState(null); const [sel, setSel] = React.useState(null);
  const grp = g.find((x) => x.key === open); const it = sel && grp && grp.items.find((x) => x.id === sel);
  return <section className={'dv4 esx-sheet pga-nb' + (lay ? ' ' + lay : '')} aria-label="Notebook">
    <span className="gs-sc-cap">Notebook</span>
    <div className="pga-tabs" role="tablist" data-row={g.findIndex((x) => x.key === open) < 3 ? 0 : 1} data-open={grp ? 'y' : 'n'}>{g.map((x) => (
      <button key={x.key} type="button" role="tab" aria-selected={open === x.key} aria-expanded={open === x.key} disabled={!x.items.length}
        aria-label={x.head + (x.count === null ? '' : ' ' + x.items.length)} className={'pga-tab' + (open === x.key ? ' is-open' : '')}
        onClick={() => { setOpen(open === x.key ? null : x.key); setSel(null); }}>
        <span className="pga-tl"><PgaIcon k={x.key} /><span className="pga-tn">{x.head}</span></span>
        <b className="esx-num">{x.count === null ? ' ' : x.items.length}</b>
      </button>))}</div>
    <EsxFold open={!!grp}>{grp && <div className="pga-folder" role="tabpanel" aria-label={grp.head}>
      <span className="pga-fh">{grp.head}</span>
      <div key={grp.key} className="esx-chips esx-in">{grp.items.map((x) => (
        <button key={x.id} type="button" className="esx-chip" aria-expanded={sel === x.id} onClick={() => setSel(sel === x.id ? null : x.id)}>
          <b>{x.name}</b></button>))}</div>
      <EsxFold open={!!it}>{it && <div key={it.id} className="esx-read esx-in"><span className="esx-nm"><b>{it.name}</b></span><p className="esx-tx">{it.text}</p></div>}</EsxFold>
    </div>}</EsxFold>
  </section>;
};

// ---- Board: the pen. Marks are drawn over the words, measured from where each word sits, so a ring fits a name that wraps. ----
const pgaSeed = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const pgaSmooth = (p) => { let d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
  for (let i = 0; i < p.length - 1; i++) { const a = p[i - 1] || p[i]; const b = p[i]; const c = p[i + 1]; const e = p[i + 2] || c;
    d += ' C' + [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6, c[0], c[1]].map((v) => v.toFixed(1)).join(' '); }
  return d; };
// A ring: a little over one turn, spiralling out slightly so its ends cross as a pen's do.
const pgaRing = (L, T, R, B, r) => { const cx = (L + R) / 2; const cy = (T + B) / 2; const rx = (R - L) / 2; const ry = (B - T) / 2;
  const tilt = (r() - 0.5) * 0.06; const a0 = -2 + (r() - 0.5) * 0.4; const p = [];
  for (let i = 0; i <= 22; i++) { const t = i / 22; const a = a0 + Math.PI * 2.2 * t; const f = 1 + (r() - 0.5) * 0.05 + 0.08 * (t - 0.5);
    const x = Math.cos(a) * rx * f; const y = Math.sin(a) * ry * f; p.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]); }
  return pgaSmooth(p); };
const pgaLine = (x1, x2, y, r) => { const p = []; const n = Math.max(2, Math.round((x2 - x1) / 30));
  for (let i = 0; i <= n; i++) { const t = i / n; p.push([x1 + (x2 - x1) * t, y + 0.8 * (t - 0.5) + (r() - 0.5) * 1.2]); } return pgaSmooth(p); };
// Only the word itself is measured, not the hidden words for screen readers that follow it.
const pgaRects = (el) => { const g = document.createRange(); g.selectNodeContents(el.firstChild); return [...g.getClientRects()].filter((q) => q.width > 1); };
// KEEP: the pen marks are redrawn whenever the board changes size, and a ring never reaches more than 5px past its column, so it never
// crosses into the next column's words.
const pgaDraw = (host, ov) => {
  const H = host.getBoundingClientRect(); let out = '';
  host.querySelectorAll('[data-pen]').forEach((el) => {
    const k = el.dataset.pen; const r = pgaSeed(el.textContent + k); const rs = pgaRects(el); if (!rs.length) return;
    const L = Math.min(...rs.map((q) => q.left)) - H.left; const R = Math.max(...rs.map((q) => q.right)) - H.left;
    const T = Math.min(...rs.map((q) => q.top)) - H.top; const B = Math.max(...rs.map((q) => q.bottom)) - H.top;
    const C = el.closest('.pga-col').getBoundingClientRect();
    if (k !== 'miss') out += '<path class="' + (k === 'right' ? 'g' : 'a') + '" d="' + pgaRing(Math.max(L - 7, C.left - H.left - 5), T - 4, Math.min(R + 7, C.right - H.left + 5), B + 3, r) + '"/>';
    else rs.forEach((q) => { out += '<path class="g" d="' + pgaLine(q.left - H.left - 1, q.right - H.left + 1, q.bottom - H.top + 1, r) + '"/>'; });
  });
  ov.innerHTML = out;
};
const PGA_HEADS = ['Suspects', 'Weapons', 'Places'];
const PgaBoard = ({ p }) => {
  const host = React.useRef(null); const ov = React.useRef(null);
  React.useLayoutEffect(() => {
    const draw = () => host.current && pgaDraw(host.current, ov.current);
    draw(); if (document.fonts) document.fonts.ready.then(draw);
    const ro = new ResizeObserver(draw); ro.observe(host.current); return () => ro.disconnect();
  }, [p]);
  // A word's mark: right (the player's pick, and true), wrong (the player's pick, not true), miss (true, not picked), or none.
  const mark = (k, name) => { if (!p.pick) return null; const mine = p.pick[k] === name; const t = PGA_CASE.truth[k] === name;
    return mine ? (t ? 'right' : 'wrong') : t ? 'miss' : null; };
  const say = { right: ', your pick, right', wrong: ', your pick, wrong', miss: ', the answer' };
  return <div className="pga-bd" ref={host}>
    {[PGA_CASE.suspects, PGA_CASE.weapons, PGA_CASE.places].map((list, k) => (
      <div key={k} className="pga-col"><span className="gs-sc-cap">{PGA_HEADS[k]}</span>
        <ul>{list.map(([name]) => { const m = mark(k, name);
          return <li key={name}>{m ? <span className="pga-m" data-pen={m}>{name}<span className="pga-sr">{say[m]}</span></span> : name}</li>; })}</ul>
      </div>))}
    <svg className="pga-ov" ref={ov} aria-hidden="true" />
  </div>;
};

// ---- Panel. ----
const PgaCulprit = ({ p }) => (p.live
  ? <div className="pga-case is-open"><span className="pga-tag">Case open</span><span className="pga-blank" /><span className="pga-blank is-s" /></div>
  : <div className="pga-case"><span className={'pga-tag ' + (p.right ? 'is-ok' : 'is-bad')}>{p.right ? 'Case closed' : 'Case cold'}</span>
    <span className="pga-name">{PGA_CASE.truth[0]}</span><span className="pga-sent">{'with the ' + pgaLow(PGA_CASE.truth[1]) + ', in the ' + pgaLow(PGA_CASE.truth[2]) + '.'}</span></div>);

// ============================================================================
// 1 Tab per kind: the six tabs across, icons and counts only on a phone.
// ============================================================================
// The session card every direction shares; `card` is the direction's class on it, `lay` the notebook's, `wrap` the page's.
const pgaResult = (p) => (p.live ? { tone: 'live', word: 'In progress' } : p.right ? { tone: 'ok', word: 'Solved' } : { tone: 'bad', word: 'Failed' });
// The panel setting: Two cards ('two', Hints in a card of its own with the culprit card's edge), or 'now' (Hints as a bare count).
const PgaHintsCard = ({ p }) => <div className={'pga-hc' + (p.live ? ' is-open' : '')}><Big n={p.hints} of={2} /></div>;
const PgaPage = ({ s, lay, card = '', wrap = '' }) => { const p = s.pga; const pn = usePgSetting('panel') || 'two';
  const two = pn !== 'now';
  return <div className={'dv4-lay' + (wrap ? ' ' + wrap : '')}>
    <PgaNotebook p={p} lay={lay} />
    <GsSessCard r={pgaResult(p)} className={'pga-card' + (card ? ' ' + card : '') + (two ? ' pga-2c' : '')} board={<PgaBoard p={p} />}
      rows={[['Hints', two ? <PgaHintsCard p={p} /> : <Big n={p.hints} of={2} />], ['The culprit', <PgaCulprit p={p} />]]} />
    {s.lines.length > 0 && <GsMoves s={s} />}
  </div>; };
const Pga1 = ({ s }) => <PgaPage s={s} />;

// ============================================================================
// 2 Side tabs: the tabs leave the folder's top edge and run down its left side, like a binder's index, at every width. On a phone the
// spine is narrow (icon and count, the open tab's name heading the folder, as in 1); on a desktop each tab carries its name and count
// on one line. The spine sets the folder's height, so an opened reader fills the space beside it rather than lengthening the page.
// The card hangs everything off one left edge: result, board and panel start at the same line; on a desktop the board fills its side
// and the panel sits to its right, from the top; the panel reads as a ledger, each caption on the left and Hints' count on the right.
// ============================================================================
const Pga2 = ({ s }) => <PgaPage s={s} lay="is-side" card="pga-ledger" />;

// ============================================================================
// 3 Two rows: the six tabs in two rows of three at every width, each the same width and carrying its name, its icon and its count, so
// no tab changes width when another opens. The row holding the open tab sits on the folder and the open tab joins it; the other row
// stands behind, as a binder's second row of tabs does. On a desktop the notebook and the card sit side by side (the notebook on
// the left, in reading order) with Every move across both; the card in its narrower column stacks the board over the panel, and the
// panel puts Hints and The culprit side by side, centred under the board.
// ============================================================================
const Pga3 = ({ s }) => <PgaPage s={s} lay="is-rows" card="pga-pair" wrap="pga-desk" />;

const PGA_DIRS = { 1: Pga1, 2: Pga2, 3: Pga3 };
const PgaBody = ({ s, sid }) => {
  const dir = usePgSetting('dir');
  if (!s.pga) return s.lines && s.lines.length ? <GsMoves s={s} /> : null;
  const D = PGA_DIRS[dir] || Pga1;
  return <D key={sid} s={s} />;
};

// The settings bar (app/playground.jsx) picks the direction and the play. Open with ?pg=accuse-session.
const pgaOpen = (key) => ({ state: 'session-mystery', go: (gs) => gs.go('session', { id: 'pga-' + key }) });
export const initPlaygroundAccuseSession = () => {
  pgRegister('accuse-session', { title: 'Accuse session', settings: [
    { key: 'dir', kind: 'concept', label: 'Direction', options: [
      { value: '1', label: '1 Tab per kind' }, { value: '2', label: '2 Side tabs' }, { value: '3', label: '3 Two rows' }] },
    { key: 'panel', kind: 'concept', label: 'Panel', options: [
      { value: 'two', label: 'Two cards' }, { value: 'now', label: 'As before' }] },
    { key: 'play', label: 'Play', options: [
      { value: 'solved', label: 'Solved · no hints', ...pgaOpen('solved') },
      { value: 'failed', label: 'Failed · 2 hints', ...pgaOpen('failed') },
      { value: 'live', label: 'In progress · 1 hint', ...pgaOpen('live') }] },
  ] });
  // Only under ?pg=: without it canon has neither the fixture sessions nor the body.
  if (!pgActive()) return;
  Object.keys(PGA_PLAYS).forEach((key) => { GS_SESSIONS['pga-' + key] = pgaSession(key); });
  GS_SESSION_BODY.mystery = PgaBody;
};
