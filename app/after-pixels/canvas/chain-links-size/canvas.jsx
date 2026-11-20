// ============================================================================
// Hi-fi canvas: how big Chain's guess chain should be on a long play (7 or more guesses; the real most is 18). "Today" is canon's own
// Chain session body (ChnSessBody, imported, not redrawn). Each option is a copy of that body's card (canon's GsSessCard, the same board,
// the same key, canon's CSS) with only the guesses' drawing changed. A play of 6 guesses or fewer keeps today's chain in every option.
// Nothing here is ruled. Game data is rough; the plays are Chain's Hard word line (SNOW to WAGON).
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React from 'react';
import { GsSessCard } from '../../canon/app/gs-session.jsx';
import { ChnSessBody } from '../../canon/app/gs-chain.jsx';
import './canvas.css';

// ---- The model, copied from canon/app/gs-chain.jsx (chnRead, ChnTiles, ChnJoint), which canon does not export. ----
const chnRead = (s) => {
  const P = s.play; const last = P.w.length - 1;
  const w = P.w.map((word, i) => { const end = i === 0 || i === last; return { i, word, state: end ? 'end' : 'hidden', shown: end ? word.length : 1 }; });
  const g = P.p.map(([guess, k, near], j) => {
    const x = w[k]; let res;
    if (guess === x.word) { res = 'right'; x.state = 'found'; }
    else { x.shown += 1; res = x.shown >= x.word.length ? 'given' : near ? 'near' : 'wrong'; if (res === 'given') { x.state = 'given'; x.shown = x.word.length; } }
    return { n: j + 1, res };
  });
  const r = s.live ? { tone: 'live', word: 'In progress' } : w.some((x) => x.state === 'given') ? { tone: 'bad', word: 'Failed' } : { tone: 'ok', word: 'Solved' };
  return { w, g, r, long: Math.max(...w.map((x) => (x.state === 'hidden' ? x.shown + 1 : x.word.length))) };
};
const ChnTiles = ({ x }) => (x.state === 'hidden'
  ? <div className="chn-row" role="img" aria-label={'Starts ' + x.word.slice(0, x.shown)}>
    {x.word.slice(0, x.shown).split('').map((ch, j) => <span key={j} className="wd-t chn-t is-shown" aria-hidden="true">{ch}</span>)}
    <span className="wd-t chn-t is-more" aria-hidden="true" /></div>
  : <div className="chn-row" role="img" aria-label={x.word + (x.state === 'given' ? ', given away' : '')}>
    {x.word.split('').map((ch, j) => <span key={j} aria-hidden="true"
      className={'wd-t chn-t is-' + (x.state === 'end' ? 'end' : x.state === 'given' ? 'given' : j < x.shown ? 'shown' : 'found')}>{ch}</span>)}</div>);
const ChnJoint = () => (
  <div className="chn-joint" aria-hidden="true"><svg width="16" height="22" viewBox="0 0 16 22"><rect x="1.5" y="1.5" width="8" height="12" rx="4" /><rect x="6.5" y="8.5" width="8" height="12" rx="4" /></svg></div>);

// ---- The plays. The Hard word line; guesses are [guess, index of the word, near miss]. ----
const W6 = ['SNOW', 'BALL', 'ROOM', 'SERVICE', 'STATION', 'WAGON'];
// Canon's Hard play (CH_HARD): the wrong guesses come in long runs.
const GRIND = [['BELL', 1], ['BAKE', 1], ['BALL', 1], ['RACE', 2], ['ROAD', 2], ['ROOM', 2],
  ['SALAD', 3], ['SECOND', 3], ['SERVER', 3], ['SERVED', 3], ['SERVING', 3], ['SERVICE', 3], ['STORE', 4], ['STAGE', 4], ['STAMP', 4], ['STATUS', 4], ['STATIC', 4], ['STATION', 4]];
// The same 18 with rights and near misses between the wrongs, so no run is long.
const MIXED = [['BELL', 1], ['SALAD', 3, 1], ['RACE', 2], ['SECOND', 3], ['BAKE', 1], ['SERVER', 3, 1], ['BALL', 1], ['STORE', 4], ['ROAD', 2, 1],
  ['SERVED', 3], ['ROOM', 2], ['STAGE', 4, 1], ['SERVING', 3], ['STAMP', 4], ['SERVICE', 3], ['STATUS', 4], ['STATIC', 4, 1], ['STATION', 4]];
const SIX = [['BALL', 1], ['RACE', 2], ['ROOM', 2], ['STATION', 4], ['SUITE', 3], ['SERVICE', 3]];
const play = (p, n) => ({ play: { w: W6, p: p.slice(0, n) }, live: n < 18 && p !== SIX, lines: [] });

// ---- The guesses, drawn by each option. A link is a rounded loop, 1px per drawing unit. States as canon draws them: right closed
// green, wrong grey open, near miss off-white almost closed, given away amber broken in two. ----
const PAD = 3;
const GAP = { wrong: 14, near: 6, given: 8 };
const Loop = ({ res, x, y, w, h, sw }) => {
  const up = h > w; const L = Math.max(w, h); const S = Math.min(w, h); const P = 2 * (L - S) + Math.PI * S; const k = S / 16;
  const gap = GAP[res] * k;
  const dash = res === 'right' ? undefined : res === 'given' ? (P / 2 - gap) + ' ' + gap : (P - gap) + ' ' + gap;
  const off = res === 'right' ? undefined : P - gap / 2 - (up ? Math.PI * S / 4 + (L - S) / 2 : (L - S) / 2);
  return <rect x={x} y={y} width={w} height={h} rx={S / 2} className={'chn-loop is-' + res} style={{ strokeWidth: sw }} strokeDasharray={dash} strokeDashoffset={off} />;
};

// The options. row(item) and col(item): the loop's size when drawn across (a row on a phone) and when drawn in a column beside the
// board. text: its number is written inside the loop. merge: a run of wrong guesses is one loop. gut / top: room kept for a row's or
// a column's number label.
const OPTS = {
  one: { id: 'one', sw: 2.5, fs: 10.5, bar: 5, text: true, gut: 0, top: 0, row: () => ({ w: 28, h: 17 }), col: () => ({ w: 19, h: 28 }) },
  two: { id: 'two', sw: 2.2, fs: 0, bar: 4, barCol: 6, text: false, gut: 26, top: 18, row: () => ({ w: 20, h: 11 }), col: () => ({ w: 13, h: 22 }) },
  three: { id: 'three', sw: 2.5, fs: 10.5, bar: 5, text: true, merge: true, gut: 0, top: 0,
    row: (it) => ({ w: it.run ? 46 : 28, h: 17 }), col: (it) => ({ w: it.run ? 46 : 28, h: 17 }) },
};

const itemsOf = (g, merge) => {
  if (!merge) return g.map((t) => ({ res: t.res, n: t.n, label: String(t.n) }));
  const out = [];
  g.forEach((t) => {
    const last = out[out.length - 1];
    if (t.res === 'wrong' && last && last.res === 'wrong') { last.run = true; last.label = last.n + '–' + t.n; last.to = t.n; }
    else out.push({ res: t.res, n: t.n, label: String(t.n) });
  });
  return out;
};

// Balanced split: the fewest rows (or columns) that fit the room, cut where the running size is nearest an even share.
const split = (items, size, gap, room) => {
  const sz = items.map(size); const n = items.length; const cum = [0]; sz.forEach((s, i) => cum.push(cum[i] + s + gap));
  const total = cum[n]; const ext = (a, b) => cum[b] - cum[a] - gap;
  for (let r = Math.max(1, Math.ceil(total / (room + gap))); r <= n; r++) {
    const cuts = [0]; let ok = true;
    for (let k = 1; k < r; k++) {
      const target = (total * k) / r; let best = -1; let bd = Infinity;
      for (let i = cuts[k - 1] + 1; i < n - (r - 1 - k); i++) { const d = Math.abs(cum[i] - target); if (d < bd) { bd = d; best = i; } }
      if (best < 0) { ok = false; break; } cuts.push(best);
    }
    if (!ok) continue; cuts.push(n);
    const rows = []; let fits = true;
    for (let k = 0; k < r; k++) { rows.push(items.slice(cuts[k], cuts[k + 1])); if (ext(cuts[k], cuts[k + 1]) > room) fits = false; }
    if (fits) return rows;
  }
  return items.map((it) => [it]);
};

// One strip of loops: across (a row) or down (a column), the loops joined by a short bar.
const Strip = ({ items, cfg, orient }) => {
  const row = orient === 'row'; const sizes = items.map((it) => cfg[row ? 'row' : 'col'](it)); const bar = row ? cfg.bar : (cfg.barCol || cfg.bar);
  let pos = 0; const at = sizes.map((s) => { const p = pos; pos += (row ? s.w : s.h) + bar; return p; });
  const main = pos - bar; const cross = Math.max(...sizes.map((s) => (row ? s.h : s.w)));
  const W = (row ? main : cross) + 2 * PAD; const H = (row ? cross : main) + 2 * PAD;
  const box = (s, i) => ({ x: PAD + (row ? at[i] : (cross - s.w) / 2), y: PAD + (row ? (cross - s.h) / 2 : at[i]) });
  return (
    <svg className="o-strip" width={W} height={H} viewBox={'0 0 ' + W + ' ' + H} style={{ maxWidth: '100%', height: 'auto' }} aria-hidden="true">
      {items.slice(1).map((it, i) => { const a = box(sizes[i], i); const b = box(sizes[i + 1], i + 1);
        return row
          ? <line key={'b' + i} className="chn-bar" x1={a.x + sizes[i].w} y1={a.y + sizes[i].h / 2} x2={b.x} y2={a.y + sizes[i].h / 2} />
          : <line key={'b' + i} className="chn-bar" x1={a.x + sizes[i].w / 2} y1={a.y + sizes[i].h} x2={a.x + sizes[i].w / 2} y2={b.y} />; })}
      {items.map((it, i) => { const s = sizes[i]; const b = box(s, i);
        return <Loop key={i} res={it.res} x={b.x} y={b.y} w={s.w} h={s.h} sw={cfg.sw} />; })}
      {cfg.text && items.map((it, i) => { const s = sizes[i]; const b = box(s, i);
        return <text key={'n' + i} className="o-num" x={b.x + s.w / 2} y={b.y + s.h / 2} style={{ fontSize: cfg.fs }}>{it.label}</text>; })}
    </svg>);
};
const stripWidth = (items, cfg) => items.reduce((a, it) => a + cfg.row(it).w, 0) + cfg.bar * (items.length - 1) + 2 * PAD;

const CHN_KINDS = [['right', 'Right'], ['wrong', 'Wrong'], ['near', 'Near miss'], ['given', 'Given away']];
const OptGuesses = ({ g, cfg }) => {
  const ref = React.useRef(null); const [m, setM] = React.useState({ room: 0, bh: 0 });
  React.useLayoutEffect(() => {
    const me = ref.current; const card = me.closest('.chn-card'); const board = card && card.querySelector('.chn-board'); const panel = me.closest('.gs-sc-panel'); if (!board || !panel) return undefined;
    const fit = () => { const ps = getComputedStyle(panel); const room = panel.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight); const bh = board.offsetHeight;
      setM((f) => (f.room === room && f.bh === bh ? f : { room, bh })); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(panel); ro.observe(board); return () => ro.disconnect();
  }, [g.length]);
  const items = itemsOf(g, cfg.merge);
  const rows = m.room ? split(items, (it) => cfg.row(it).w, cfg.bar, m.room - 2 * PAD - cfg.gut) : [items];
  const cbar = cfg.barCol || cfg.bar;
  const cols = m.bh ? split(items, (it) => cfg.col(it).h, cbar, m.bh - 2 * PAD - cfg.top) : [items];
  const tall = Math.max(...cols.map((c) => c.reduce((a, it) => a + cfg.col(it).h, 0) + cbar * (c.length - 1) + 2 * PAD));
  const widest = Math.max(...rows.map((r) => stripWidth(r, cfg)));
  const kinds = CHN_KINDS.map(([k, label]) => [k, label, g.filter((t) => t.res === k).length]).filter((x) => x[2] > 0);
  return (
    <div ref={ref} className={'chn-guesses o-guesses o-' + cfg.id} role="img" aria-label={g.length + ' guesses: ' + kinds.map((x) => x[2] + ' ' + x[1].toLowerCase()).join(', ')}>
      <div className="o-rows">{rows.map((r, i) => (
        <div key={i} className="o-row" style={cfg.gut ? { gridTemplateColumns: cfg.gut + 'px ' + widest + 'px' } : undefined}>
          {cfg.gut > 0 && <span className="o-lab">{r[0].n}</span>}
          <div className="o-cell"><Strip items={r} cfg={cfg} orient="row" /></div>
        </div>))}</div>
      <div className="o-cols">{cols.map((c, i) => (
        <div key={i} className="o-col">
          {cfg.top > 0 && <span className="o-lab o-lab-top">{c[0].n}</span>}
          <div className="o-colcell" style={{ height: tall }}><Strip items={c} cfg={cfg} orient="col" /></div>
        </div>))}</div>
      <ul className="chn-key" aria-hidden="true">{kinds.map(([k, label, n]) => (
        <li key={k}><svg width="12" height="20" viewBox="0 0 20 34"><Loop res={k} x={2} y={2} w={16} h={30} sw={3.5} /></svg>{label} <b>{n}</b></li>))}</ul>
    </div>);
};

// The session page's card, as canon's ChnSessBody draws it, with the option's guesses.
const OptBody = ({ s, cfg }) => {
  const p = chnRead(s);
  return (
    <GsSessCard r={p.r} className="chn-card" style={{ '--chn-n': p.long, '--chn-rows': p.w.length }}
      board={<div className="chn-board">{p.w.map((x, i) => (
        <React.Fragment key={i}><ChnTiles x={x} />{i < p.w.length - 1 && <ChnJoint />}</React.Fragment>))}</div>}
      rows={[['Guesses', <OptGuesses g={p.g} cfg={cfg} />]]} />);
};

// ---- The page. A frame is as wide as the screen it stands for, with the page's 16px gutter (24px from 720px), so canon's own width rules
// apply; where the real width is wider than your screen the frame is shrunk to fit. ----
const Fit = ({ w, label, children }) => {
  const box = React.useRef(null); const inner = React.useRef(null);
  const [avail, setAvail] = React.useState(1200); const [h, setH] = React.useState(0);
  React.useLayoutEffect(() => {
    const host = box.current.closest('.wc'); const f = () => setAvail(host.clientWidth - 32);
    f(); const ro = new ResizeObserver(f); ro.observe(host);
    const ri = new ResizeObserver(() => setH(inner.current.offsetHeight)); ri.observe(inner.current);
    return () => { ro.disconnect(); ri.disconnect(); };
  }, []);
  const bleed = w <= 420 ? 32 : 0; const s = Math.min(1, (avail + bleed) / w);
  return (
    <figure className="wc-fig" ref={box} style={bleed ? { marginInline: -16 } : undefined}>
      <figcaption className="wc-state">{label}{s < 1 ? <span className="gs-muted"> (shrunk to {Math.round(s * 100)}% to fit your screen)</span> : null}</figcaption>
      <div className="wc-fit" style={{ width: w * s, height: h * s }}>
        <div ref={inner} className="wc-fit-in" style={{ width: w, transform: 'scale(' + s + ')' }}>
          <div className="wc-frame lb-lay" style={{ width: w }}>{children}</div>
        </div>
      </div>
    </figure>);
};

const WIDTHS = [320, 360, 390];
const Plays = ({ title, p, n, cfg, wide = true, narrow, phones = true }) => (
  <section className="wc-item" aria-label={title}>
    <h3 className="wc-sub">{title}</h3>
    {phones && <div className="wc-row">
      {WIDTHS.map((w) => <Fit key={w} w={w} label={w + ' wide'}>{cfg ? <OptBody s={play(p, n)} cfg={cfg} /> : <ChnSessBody s={play(p, n)} />}</Fit>)}
      {narrow && <Fit w={280} label="280 wide">{cfg ? <OptBody s={play(p, n)} cfg={cfg} /> : <ChnSessBody s={play(p, n)} />}</Fit>}
    </div>}
    {wide && <div className="wc-row"><Fit w={1200} label="1440 wide (the card is 1152 across)">{cfg ? <OptBody s={play(p, n)} cfg={cfg} /> : <ChnSessBody s={play(p, n)} />}</Fit></div>}
  </section>);

const COUNTS = [18, 14, 12, 9];
const OPTIONS = [
  { cfg: OPTS.one, n: '1', h: 'Number inside the link',
    why: 'Each guess is one small link with its number written in it, so the row of numbers under the links goes and a row is one link tall; it folds into rows of seven at 320 and nine at 390.',
    gives: 'The number sits on the link, so it is a little smaller than today and a state’s gap in the link is a little harder to see.' },
  { cfg: OPTS.two, n: '2', h: 'Small links, row numbers at the side',
    why: 'The links shrink to bare coloured loops with no number of their own; each row (or column) starts with the number of its first link, as a line number does, so 18 guesses fit in two short rows.',
    gives: 'No link carries its own number: the reader counts along from the row’s first number, and the smallest links read by colour more than by shape.' },
  { cfg: OPTS.three, n: '3', h: 'Runs of wrong guesses as one link',
    why: 'A run of wrong guesses in a row is drawn as one wider grey link numbered by its range ("1–2"), so a grinding play is short and the right, near and given-away links stand out.',
    gives: 'A run is not guess by guess, and a play with no long runs (the mixed 18 below) saves little.' },
];

const Canvas = () => (
  <main className="wc">
    <h1 className="gs-h1">Chain: how big the guess chain is on a long play</h1>
    <p className="gs-muted wc-intro">Three ideas for the guess chain on Chain&rsquo;s session page, each drawn on the real page card at 320, 360, 390 and 1440 wide, for plays of 18, 14, 12 and 9 guesses (18 is the most). Today is first, for comparison only. Nothing is decided. Game data is rough; buttons do nothing.</p>

    <section className="wc-item wc-notes" aria-labelledby="wc-how">
      <h2 id="wc-how" className="wc-h">What you cannot see here</h2>
      <ul className="wc-list gs-muted">
        <li>Each option is for a play of 7 guesses or more. A play of 6 or fewer keeps today&rsquo;s single chain exactly, in every option (shown once under Today).</li>
        <li>The fold is measured, not fixed: rows by the room the card gives them, columns beside the board (from 672px) by the board&rsquo;s height. Resize the window and the rows re-balance; the counts here are for each width shown.</li>
        <li>A row that is not full is centred under the full ones; a column that is shorter than the full ones is centred against them, beside the board. Today does not do this beside the board: its short column sits at the top.</li>
        <li>The links are not buttons; nothing on the chain responds to a tap. The key under the chain is today&rsquo;s, unchanged.</li>
        <li>Frames wider than your screen are shrunk to fit it, so a 1440 frame reads smaller than it is on a laptop.</li>
      </ul>
    </section>

    <section className="wc-item wc-concept" aria-labelledby="wc-today">
      <h2 id="wc-today" className="wc-h">Today</h2>
      <p className="gs-muted wc-note">Canon&rsquo;s page as built: the fold at the now card&rsquo;s link size (30 by 16, numbers 13px), balanced rows across and columns beside the board. It is the real Chain session body, not a redraw.</p>
    </section>
    <Plays title="Today: 6 guesses (stays as it is in every option)" p={SIX} n={6} wide={false} />
    {COUNTS.map((n) => <Plays key={n} title={'Today: ' + n + ' guesses'} p={GRIND} n={n} narrow={n === 18} />)}
    <Plays title="Today: 17 guesses, beside the board only (columns of unequal length)" p={GRIND} n={17} phones={false} />

    {OPTIONS.map((o) => (
      <React.Fragment key={o.n}>
        <section className="wc-item wc-concept" aria-labelledby={'wc-' + o.n}>
          <h2 id={'wc-' + o.n} className="wc-h"><span className="wc-n">{o.n}</span>{o.h}</h2>
          <p className="gs-muted wc-note">{o.why}</p>
          <p className="gs-muted wc-note"><b>Gives up:</b> {o.gives}</p>
        </section>
        {COUNTS.map((n) => <Plays key={n} title={o.n + '. ' + o.h + ': ' + n + ' guesses'} p={GRIND} n={n} cfg={o.cfg} narrow={n === 18} />)}
        <Plays title={o.n + '. ' + o.h + ': 17 guesses, beside the board only (columns of unequal length)'} p={GRIND} n={17} cfg={o.cfg} phones={false} />
        <Plays title={o.n + '. ' + o.h + ': 18 guesses, rights and near misses between the wrong ones'} p={MIXED} n={18} cfg={o.cfg} wide={false} />
      </React.Fragment>))}
  </main>
);

window.KitCandidate.Screen = Canvas;
