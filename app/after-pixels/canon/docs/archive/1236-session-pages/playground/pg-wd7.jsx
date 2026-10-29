// ============================================================================
// Playground (1236), v7: Daily Word's result statement (owner, 2026-10-28). The tiles, hint and numbers are v6's, agreed and
// untouched. Beside them, three designs of the result statement: an element of its own that states the outcome outright, as
// Escape's open door and "Escaped". It says only what the board can't, and never repeats itself.
// ============================================================================
const PGW_O = [[false, 'Off'], [true, 'On']];
const PGW_S = [['today', 'Solved', 'word-today'], ['hard', 'Hard', 'word-hard'], ['failed', 'Failed', 'word-failed'], ['live', 'In progress', 'word-live']];

const PgwStore = (() => {
  let v = { nums: true, st: 'hard', d: 'all', five: 'white', fail: 'Failed' }; try { v = { ...v, ...JSON.parse(localStorage.getItem(window.PGW_KEY) || '{}') }; } catch (e) {}
  const subs = new Set();
  return { get: () => v, set: (p) => { v = { ...v, ...p }; try { localStorage.setItem(window.PGW_KEY, JSON.stringify(v)); } catch (e) {} subs.forEach((f) => f()); },
    sub: (f) => { subs.add(f); return () => subs.delete(f); } };
})();
const usePgw = () => React.useSyncExternalStore(PgwStore.sub, PgwStore.get);

// ---- The model: the record's lines as guesses (marks from the engine's rule) and the hint, each with the record's own words. ----
const pgwRead = (s) => {
  const ev = []; let n = 0;
  (s.lines || []).forEach((l) => {
    if (/^Guess/.test(l[0])) { n += 1; ev.push({ kind: 'guess', n, word: l[1], say: l[2], marks: wdScore(l[1], s.answer || l[1]) }); }
    else if (l[0] === 'Hint') { const m = /Letter (\d) is ([A-Z])/.exec(l[1]); if (m) ev.push({ kind: 'hint', pos: Number(m[1]) - 1, letter: m[2], text: l[1], after: n }); }
  });
  const h = ev.filter((e) => e.kind === 'hint').length; const hint = h === 0 ? 'No hint' : h === 1 ? '1 hint' : h + ' hints';
  const last = [...ev].reverse().find((e) => e.kind === 'guess');
  const left = 6 - n;
  const r = s.live ? { tone: 'live', head: 'In progress', vd: left === 1 ? '1 guess left' : left + ' guesses left', spare: left === 1 ? '1 guess left' : left + ' guesses left' }
    : s.loss ? { tone: 'bad', head: 'Not solved', vd: 'All 6 guesses used', spare: 'All 6 guesses used' }
    : { tone: 'ok', head: 'Solved', vd: 'In ' + n + ' of 6', spare: left === 0 ? 'On the last guess' : left === 1 ? '1 guess to spare' : left + ' guesses to spare' };
  // Each letter's best mark across the guesses, for the keys.
  const keys = {}; const rank = { miss: 1, near: 2, hit: 3 };
  ev.forEach((e) => { if (e.kind === 'guess') e.word.split('').forEach((ch, i) => { const k = e.marks[i]; if (!keys[ch] || rank[k] > rank[keys[ch]]) keys[ch] = k; }); });
  return { ev, n, spare: s.live ? 6 - n : 0, r, last, keys };
};

const PGW_SAY = { hit: 'in place', near: 'in the word', miss: 'not in the word' };
const PgwT = ({ k, t }) => <span className={'pgw-t is-' + k}>{t || ''}</span>;
const PgwRow = ({ g }) => (
  <div className="pgw-row" role="img" aria-label={'Guess ' + g.n + ', ' + g.word + ': ' + g.word.split('').map((ch, i) => ch + ' ' + PGW_SAY[g.marks[i]]).join(', ')}>
    {g.word.split('').map((ch, i) => <PgwT key={i} k={g.marks[i]} t={ch} />)}
  </div>);
// KEEP: the hint tile starts at its letter's column and is at least wide enough for the letter and "Hint" side by side
// (the reference's 88px); the dotted marks fill the columns either side of it.
const PgwHint = ({ h }) => (
  <div className="pgw-hrow" role="img" aria-label={'Hint, after guess ' + h.after + ': ' + h.text} style={{ '--p': h.pos }}>
    {h.pos > 0 && <span className="pgw-dots is-l" aria-hidden="true" />}
    <span className="pgw-t is-hint" aria-hidden="true">{h.letter}</span>
    <span className="pgw-dots" aria-hidden="true" />
  </div>);
const PgwEmpty = () => <div className="pgw-row" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <PgwT key={i} k="empty" />)}</div>;
// Numbers (a bar switch): each guess row carries its number in a gutter at the left, mirrored by an empty one at the right,
// so the tiles stay centred in the card.
const PgwBoard = ({ m, nums, six, side, at }) => {
  const rows = m.ev.map((e, i) => [e.kind === 'guess' ? e.n : null, e.kind === 'guess' ? <PgwRow key={i} g={e} /> : <PgwHint key={i} h={e} />, e.kind === 'hint']);
  for (let i = 0; i < (six ? 6 - m.n : m.spare); i += 1) rows.push([m.n + i + 1, <PgwEmpty key={'e' + i} />, false]);
  // The row a side element rides on: the first, the last guess, or the guess row nearest the middle.
  const gi = rows.map((r, i) => (r[2] ? -1 : i)).filter((i) => i >= 0);
  const lastG = rows.findIndex((r) => r[0] === m.n && !r[2]);
  const ti = at === 'first' ? gi[0] : at === 'mid' ? gi.reduce((b, i) => (Math.abs(i - (rows.length - 1) / 2) < Math.abs(b - (rows.length - 1) / 2) ? i : b), gi[0]) : lastG;
  return (
    <div className={'pgw-board' + (nums ? ' has-nums' : '')}>
      {rows.map(([n, el, hint], i) => {
        const r = nums ? <div key={i} className={'pgw-nrow' + (hint ? ' is-hint' : '') + (n != null && n === m.n ? ' is-last' : '')}><span className="pgw-n" aria-hidden="true">{n}</span>{el}<span aria-hidden="true" /></div> : el;
        return side && i === ti ? <div key={i} className="pgw-ride">{r}{side}</div> : r;
      })}
    </div>);
};

// Round 8 (owner, 2026-10-28): only the page's own language: the tile's square and 2px edge, the hint tile (its letter on one
// side, its label on the other), the numbers, the system's type. No new surfaces, no fills of green beyond a mark. Each concept
// also shows its now-card size, since the result statement carries down to the library game page.
// Round 9 (owner, 2026-10-28): round 8's 4, the count in a tile, in two versions: with the row numbers and without (does the 5
// do their work?). KEEP: the count tile is a board tile, the same size, on the last row's line, one tile's step from the board,
// so it reads as part of the grid and never floats between rows. The statement has no padding of its own: the card hugs it.
// Round 11 (owner, 2026-10-28): 4 against two other kinds of statement. All three ride on the last row (round 10's 1).
// Failed says "Out of guesses", the system's own status word for Word (StatusTag); a draft.
const PGW_C = [
  ['A', 'Count in a tile', 'Round 8’s 4: the count held in a board tile, the result in heading type.'],
  ['B', 'The store’s tag', 'The system’s status Tag, the one every game would share (Escape’s “Escaped”), at heading size beside the row.'],
  ['C', 'The row, framed', 'No count: the row that ended the day framed in the result colour, the result beside it. The row number gives the count.'],
  ['D', 'The store’s tag, centred', 'B in a column of its own, centred on the board’s height.'],
];
const pgwRes = (t) => (t === 'ok' ? 'Solved' : t === 'bad' ? (PgwStore.get().fail || 'Failed') : 'In progress');
const pgwAria = (t, n) => pgwRes(t) + ', ' + n + (n === 1 ? ' guess' : ' guesses');
const PgwCT = ({ m, size }) => <span className={'pgw-ct is-' + size} role="img" aria-label={pgwAria(m.r.tone, m.n)}><i>{m.n}</i><b>{pgwRes(m.r.tone)}</b></span>;
const PgwTagS = ({ m, size }) => <span className={'pgw-tg is-' + size + ' is-' + m.r.tone}>{m.r.tone !== 'live' && <DS.Icon name={m.r.tone === 'ok' ? 'check' : 'close'} size={size === 'card' ? 14 : 24} />}{pgwRes(m.r.tone)}</span>;
const PgwFrameS = ({ m, size }) => <span className={'pgw-fr is-' + size}>{pgwRes(m.r.tone)}</span>;
const PgwMark = ({ k, m, size }) => (k === 'B' || k === 'D' ? <PgwTagS m={m} size={size} /> : k === 'C' ? <PgwFrameS m={m} size={size} /> : <PgwCT m={m} size={size} />);
const PgwStatement = ({ k, m, ride }) => { const v = usePgw(); return (
  <div className={'pgw-st is-' + k + ' is-' + m.r.tone + (v.five === 'green' ? ' is-g5' : '') + (ride ? ' is-ride' : '')}><PgwMark k={k} m={m} size="page" /></div>); };
const PGW_AT = { A: 'last', B: 'last', C: 'last' };
const PgwNowSketch = ({ k, m, s }) => (
  <div className="pgw-now">
    <p className="pgw-nowcap">On the library game page</p>
    <div className="pgw-nowc">
      <div className="pgw-nowt"><span>Today’s word</span><b>{'No. ' + s.number}</b></div>
      <div className={'pgw-st is-' + m.r.tone + (usePgw().five === 'green' ? ' is-g5' : '')}><PgwMark k={k} m={m} size="card" /></div>
    </div>
  </div>);

const PgwBody = ({ s }) => {
  const v = usePgw(); const m = React.useMemo(() => pgwRead(s), [s]);
  const list = v.d === 'all' ? PGW_C : PGW_C.filter((c) => c[0] === v.d);
  return <>
    <div className="pgw-sheet">
      {list.map(([k, name, why]) => (
        <div key={k} id={'c' + k} className="pgw-opt">
          <p className="pgw-tag"><b>{k}</b>{name}<span>{why}</span></p>
          <div className="pgw-o1"><section className={'pgw-card is-' + k + (PGW_AT[k] ? ' is-rides' : '') + ' is-' + m.r.tone} aria-label="How it went">
            {PGW_AT[k] ? <><PgwBoard m={m} nums={v.nums} side={<PgwStatement k={k} m={m} ride />} at={PGW_AT[k]} /><PgwStatement k={k} m={m} /></>
              : <>{k === '4' && <span className="pgw-div" aria-hidden="true" />}<PgwBoard m={m} nums={v.nums} /><PgwStatement k={k} m={m} /></>}
          </section></div>
          <PgwNowSketch k={k} m={m} s={s} />
        </div>))}
    </div>
    <section className="wd-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), word: PgwBody };
window.GS_SESSION_QUIET = { ...(window.GS_SESSION_QUIET || {}), word: (s) => ({ label: s.game, h1: 'No. ' + s.number }) };

(() => { const el = document.createElement('style'); el.textContent = `
  .pgw-card { box-sizing: border-box; background: var(--card); border: 1px solid var(--line); box-shadow: var(--shadow-card); padding: 16px; display: grid; gap: 16px; min-width: 0; }
  /* KEEP: the card is exactly as wide as what it holds and centred in the column: no stretch of card with nothing in it. */
  .pgw-o1 { display: grid; justify-items: center; min-width: 0; }
  .pgw-o1 .pgw-card { width: max-content; max-width: 100%; }
  /* Tiles are square. Phone: from the column's width (page and card padding out), up to 64px. From 640px: from the window's
     height, so the hard play fits under the head on a laptop (48px at 800 high, 60px at 900), up to 72px. */
  .pgw-board { --g: 6px; --t: min(64px, calc((100cqi - 32px - 34px - 4 * var(--g)) / 5)); display: grid; gap: var(--g); justify-content: center; }
  .pgw-board.has-nums { --t: min(64px, calc((100cqi - 32px - 34px - 2 * 28px - 4 * var(--g)) / 5)); }
  .pgw-row { display: grid; grid-template-columns: repeat(5, var(--t)); gap: var(--g); }
  .pgw-t { box-sizing: border-box; display: grid; place-items: center; width: var(--t); height: var(--t); font: 700 calc(var(--t) * .5)/1 var(--font-heading); text-transform: uppercase; }
  .pgw-t.is-hit { background: #4CC38A; color: #08140E; }
  .pgw-t.is-near { background: #E5A63B; color: #1B1917; }
  .pgw-t.is-miss { border: 2px solid #918B80; color: #ABA79E; }
  .pgw-t.is-empty { border: 2px solid #746E65; }
  /* The hint row, mirrored from the owner's reference (2026-10-28): half a tile high (at least 40px), a 2px dashed off-white
     edge, the letter at the left and "Hint" at the right, 12px in from each side; dotted marks across the rest of the row. */
  .pgw-hrow { display: flex; align-items: center; gap: var(--g); width: calc(5 * var(--t) + 4 * var(--g)); height: max(40px, calc(var(--t) * .5)); }
  .pgw-dots { flex: 1 1 0; min-width: 0; border-bottom: 2px dotted #4A453F; }
  .pgw-dots.is-l { flex: none; width: calc(var(--p) * (var(--t) + var(--g)) - var(--g)); }
  .pgw-t.is-hint { flex: none; width: var(--t); height: 100%; border: 1.5px dashed var(--off-white); color: var(--off-white); display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(4px, calc(var(--t) * .09), 10px);
    font: 700 clamp(16px, calc(var(--t) * .3), 20px)/1 var(--font-heading); }
  /* KEEP: the hint stays one tile wide at every tile size; its padding, letter and "Hint" scale with the tile so both always fit. */
  .pgw-t.is-hint::after { content: 'Hint'; font: 600 clamp(10px, calc(var(--t) * .16), 13px)/1 var(--font-text); letter-spacing: .04em; text-transform: uppercase; }
  @container gs (max-width: 639px) { .pgw-hrow { height: max(48px, calc(var(--t) * .75)); } .pgw-t.is-hint { flex-direction: column; justify-content: center; gap: 4px; padding: 0; font-size: 18px; } .pgw-t.is-hint::after { font-size: 10px; } }
  .pgw-nrow { display: grid; grid-template-columns: 20px auto 20px; align-items: center; gap: 8px; }
  .pgw-n { font: 600 13px/1 var(--font-text); color: var(--muted); text-align: right; font-variant-numeric: tabular-nums; }
  /* the sheet: the six marks one under another, each labelled (playground only, magenta like the bar) */
  .pgw-sheet { display: grid; gap: 36px; }
  .pgw-tag { margin: 0 0 8px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; font: 600 14px/1.3 var(--font-text); color: #FF2EC4; }
  .pgw-tag b { font: 700 18px/1 var(--font-heading); } .pgw-tag span { color: var(--muted); font-weight: 400; }
  /* the result statement, shared. KEEP: on a phone it sits above the board (order -1) and is never wider than it (width 0,
     min-width 100%), so the card hugs the tiles. */
  .pgw-card > .pgw-st { order: -1; width: 0; min-width: 100%; display: flex; align-items: center; }
  /* B: the system's Tag, scaled up from its 26px chip: same fill, ink, icon and square edge */
  .pgw-tg { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; font: 700 20px/1 var(--font-heading); white-space: nowrap; }
  .pgw-tg.is-ok { background: var(--success); color: var(--success-on, #08140E); } .pgw-tg.is-bad { background: var(--warning); color: var(--warning-on, #1B1917); }
  .pgw-tg.is-live { background: color-mix(in srgb, var(--text) 14%, var(--page)); color: var(--text); }
  .pgw-tg.is-card { height: 26px; padding: 0 10px; gap: 6px; font: 600 var(--size-small, 13px)/1 var(--font-text); }
  /* C: the words in heading type, coloured; the frame is drawn on the board's row */
  .pgw-fr { font: 700 28px/1 var(--font-heading); letter-spacing: -.01em; white-space: nowrap; color: var(--text); }
  .is-ok .pgw-fr { color: var(--success); } .is-bad .pgw-fr { color: var(--warning); }
  .pgw-fr.is-card { font-size: 18px; }
  .pgw-ride { display: contents; } .pgw-st.is-ride { display: none; } .pgw-div { display: none; }
  .pgw-st.is-ok { --rc: var(--success); } .pgw-st.is-bad { --rc: var(--warning); } .pgw-st.is-live { --rc: #918B80; }
  /* 1 and 2: the hint tile's shape with a solid 2px edge; the count in the tile's type at the left, the result in the hint's label type */
  .pgw-rt1 { box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 48px; padding: 0 12px; border: 2px solid var(--rc); color: var(--text); }
  .pgw-rt1 b { font: 700 22px/1 var(--font-heading); color: var(--text); }
  .pgw-rt1 small { font: 600 13px/1 var(--font-text); letter-spacing: .04em; text-transform: uppercase; color: var(--rc); }
  .pgw-rt1.is-card { height: 36px; padding: 0 10px; gap: 12px; } .pgw-rt1.is-card b { font-size: 18px; } .pgw-rt1.is-card small { font-size: 12px; }
  .pgw-lead2 { display: none; }
  /* 3: a tile at twice the board's size */
  .pgw-bt { box-sizing: border-box; width: 112px; height: 112px; border: 2px solid var(--rc); display: grid; place-items: center; align-content: center; gap: 8px; }
  .pgw-bt b { font: 700 48px/1 var(--font-heading); color: var(--text); }
  .pgw-bt small { font: 600 12px/1 var(--font-text); letter-spacing: .04em; text-transform: uppercase; color: var(--rc); }
  .pgw-bt.is-card { width: 56px; height: 56px; gap: 4px; } .pgw-bt.is-card b { font-size: 22px; } .pgw-bt.is-card small { font-size: 9px; }
  /* 4: the count in a small tile, the result in heading type, off-white */
  .pgw-ct { display: flex; align-items: center; gap: 12px; }
  .pgw-ct i { box-sizing: border-box; width: 44px; height: 44px; display: grid; place-items: center; border: 2px solid var(--rc); font: 700 22px/1 var(--font-heading); font-style: normal; color: var(--text); }
  .pgw-ct b { font: 700 28px/1 var(--font-heading); letter-spacing: -.01em; color: var(--text); white-space: nowrap; }
  .is-g5 .pgw-ct i { color: var(--rc); }
  .pgw-ct.is-card { gap: 8px; } .pgw-ct.is-card i { width: 28px; height: 28px; font-size: 15px; } .pgw-ct.is-card b { font-size: 18px; }
  /* the now-card sketch: the store's card, its label and title at the left, the result at the top right */
  .pgw-now { margin-top: 16px; display: grid; justify-items: center; gap: 8px; }
  .pgw-nowcap { margin: 0; font: 600 12px/1 var(--font-text); letter-spacing: .06em; text-transform: uppercase; color: #FF2EC4; }
  .pgw-nowc { box-sizing: border-box; width: min(100%, 420px); padding: 16px; background: var(--card); border: 1px solid var(--line); box-shadow: var(--shadow-card); display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .pgw-nowt { display: grid; gap: 4px; } .pgw-nowt span { font: 600 13px/1 var(--font-text); color: var(--muted); } .pgw-nowt b { font: 700 24px/1.1 var(--font-heading); color: var(--text); }
  /* KEEP: from 900px the statement sits to the right of the board, so the card is wide rather than tall. */
  @container gs (min-width: 900px) {
    .pgw-card { grid-template-columns: auto auto; column-gap: 40px; align-items: center; }
    .pgw-card > .pgw-st { order: 0; width: auto; min-width: 0; padding-right: 8px; }
    /* KEEP: beside something, the numbers' mirrored right gutter goes, and the number column is only as wide as its digit, so
       the card hugs the numbers on the left (owner, 2026-10-28). */
    .pgw-card .pgw-nrow { grid-template-columns: 1ch auto; font: 600 14px/1 var(--font-text); } .pgw-card .pgw-nrow > span:last-child:empty { display: none; }
    .pgw-ct.is-page { gap: 20px; } .pgw-ct.is-page b { font-size: 40px; }
    .pgw-ct.is-page i { width: 64px; height: 64px; font-size: 32px; }
    .pgw-card > .pgw-st { padding-right: 0; }
    /* 1 to 3: the statement rides on a board row; the column copy is for phones only */
    .pgw-card.is-rides { grid-template-columns: auto; }
    .pgw-card.is-rides > .pgw-st { display: none; }
    .pgw-ride { display: flex; align-items: center; gap: var(--g); }
    .pgw-st.is-ride.is-B, .pgw-st.is-ride.is-C { padding-left: 16px; }
    .pgw-card.is-D { column-gap: 32px; align-items: center; }
    .pgw-tg.is-page { height: 56px; padding: 0 20px; gap: 10px; font-size: 32px; }
    .pgw-fr.is-page { font-size: 40px; }
    /* C: KEEP: the frame sits 4px outside the row's tiles, on the last row only, solid 2px in the result colour */
    .pgw-card.is-C .pgw-ride .pgw-row { outline: 2px solid var(--rc-row, var(--success)); outline-offset: 4px; }
    .pgw-card.is-C.is-bad .pgw-ride .pgw-row { --rc-row: var(--warning); }
    .pgw-card.is-C.is-live .pgw-ride .pgw-row { --rc-row: #918B80; }
    .pgw-st.is-ride { display: flex; height: var(--t); }
    .pgw-st.is-ride .pgw-ct i { width: var(--t); height: var(--t); font-size: calc(var(--t) * .5); }
    /* 4: a rule the board's height, between board and statement */
    .pgw-card.is-4 { grid-template-columns: auto 1px auto; column-gap: 40px; align-items: stretch; }
    .pgw-card.is-4 .pgw-div { display: block; order: 2; width: 1px; background: var(--line); }
    .pgw-card.is-4 > .pgw-board { order: 1; } .pgw-card.is-4 > .pgw-st { order: 3; align-self: center; }
    /* 5 and 6: a column of its own, the tile at the board's tile size, on the board's top or last line */
    .pgw-card.is-5, .pgw-card.is-6 { column-gap: var(--g, 8px); }
    .pgw-card.is-5 > .pgw-st, .pgw-card.is-6 > .pgw-st { --t: clamp(56px, calc((100vh - 560px) / 5), 72px); padding-left: 8px; }
    .pgw-card.is-5 > .pgw-st .pgw-ct, .pgw-card.is-6 > .pgw-st .pgw-ct { flex-direction: column; align-items: flex-start; gap: 12px; }
    .pgw-card.is-5 > .pgw-st .pgw-ct i, .pgw-card.is-6 > .pgw-st .pgw-ct i { width: var(--t); height: var(--t); font-size: calc(var(--t) * .5); }
    .pgw-card.is-5 { align-items: start; } .pgw-card.is-6 { align-items: end; }
    .pgw-card.is-6 > .pgw-st .pgw-ct { flex-direction: column-reverse; }
  }
  @container gs (min-width: 640px) {
    .pgw-board, .pgw-board.has-nums { --g: 8px; --t: clamp(56px, calc((100vh - 560px) / 5), 72px); }
    .pgw-card { padding: 24px; gap: 20px; }
    .pgw-h { font-size: 34px; }
    @container gs (min-width: 900px) { .pgw-h { font-size: 40px; } }
    .pgw-nrow { grid-template-columns: 24px auto 24px; gap: 12px; }
    .pgw-n { font-size: 14px; }
  }
`; document.head.appendChild(el); })();

// ---- The bar ----
const pgwGo = (st) => {
  const a = window.gsApi; if (!a) return; const row = PGW_S.find((x) => x[0] === st) || PGW_S[1];
  a.setReview({ week: st === 'live' ? 'live' : 'done' }); setTimeout(() => window.gsApi.go('session', { id: row[2] }), 0);
};
const PgwBar = () => {
  const v = usePgw();
  return (
    <div className="pgw-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pgw-eyebrow">DAILY WORD v7</span>
      <div className="pgw-grp" role="group" aria-label="Design"><span className="pgw-lab">Design</span>
        {[['all', 'All three'], ...PGW_C.map((c) => [c[0], c[1]])].map(([k, l]) => <button key={k} type="button" className="pgw-chip" aria-pressed={v.d === k} onClick={() => PgwStore.set({ d: k })}>{k !== 'all' && <b>{k}</b>}{l}</button>)}</div>
      <div className="pgw-grp" role="group" aria-label="Failed says"><span className="pgw-lab">Failed says</span>
        {['Failed', 'Not solved', 'Out of guesses'].map((k) => <button key={k} type="button" className="pgw-chip" aria-pressed={v.fail === k} onClick={() => PgwStore.set({ fail: k })}>{k}</button>)}</div>
      <div className="pgw-grp" role="group" aria-label="The count's colour"><span className="pgw-lab">The 5</span>
        {[['white', 'Off-white'], ['green', 'Result colour']].map(([k, l]) => <button key={k} type="button" className="pgw-chip" aria-pressed={v.five === k} onClick={() => PgwStore.set({ five: k })}>{l}</button>)}</div>
      <div className="pgw-grp" role="group" aria-label="Row numbers"><span className="pgw-lab">Numbers</span>
        {PGW_O.map(([k, l]) => <button key={l} type="button" className="pgw-chip" aria-pressed={!!v.nums === k} onClick={() => PgwStore.set({ nums: k })}>{l}</button>)}</div>
      <div className="pgw-grp" role="group" aria-label="The play"><span className="pgw-lab">Play</span>
        {PGW_S.map(([k, l]) => <button key={k} type="button" className="pgw-chip" aria-pressed={v.st === k} onClick={() => { PgwStore.set({ st: k }); pgwGo(k); }}>{l}</button>)}</div>
    </div>);
};

let pgwOpened = false;
window.KitCandidate = {
  bind() {
    if (pgwOpened) return; pgwOpened = true;
    // Signed in with the Pass first, through a signed-in page (as v5), then the session once the new view has rendered.
    setTimeout(() => {
      const a = window.gsApi; a.setView('pass'); a.setConnected(true); a.go('word', { page: 'record' }, 'pass');
      setTimeout(() => pgwGo(PgwStore.get().st), (window.GS_LOAD_MS || 600) + 100);
    }, 0);
  },
};
// The bar sits in the page's flow above the app, so it never covers the board.
(() => { const el = document.createElement('div'); el.id = 'pgw-chrome'; document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<PgwBar />); })();
