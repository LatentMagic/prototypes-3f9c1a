// ============================================================================
// Playground (1236), v7: Daily Word's result statement (owner, 2026-10-28). The tiles, hint and numbers are v6's, agreed and
// untouched. Beside them, three designs of the result statement: an element of its own that states the outcome outright, as
// Escape's open door and "Escaped". It says only what the board can't, and never repeats itself.
// ============================================================================
const PGW_O = [[false, 'Off'], [true, 'On']];
const PGW_S = [['today', 'Solved', 'word-today'], ['hard', 'Hard', 'word-hard'], ['failed', 'Failed', 'word-failed'], ['live', 'In progress', 'word-live']];

const PgwStore = (() => {
  let v = { nums: true, st: 'hard', d: 'all' }; try { v = { ...v, ...JSON.parse(localStorage.getItem(window.PGW_KEY) || '{}') }; } catch (e) {}
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
const PgwBoard = ({ m, nums, six }) => {
  const rows = m.ev.map((e, i) => [e.kind === 'guess' ? e.n : null, e.kind === 'guess' ? <PgwRow key={i} g={e} /> : <PgwHint key={i} h={e} />, e.kind === 'hint']);
  for (let i = 0; i < (six ? 6 - m.n : m.spare); i += 1) rows.push([m.n + i + 1, <PgwEmpty key={'e' + i} />, false]);
  return (
    <div className={'pgw-board' + (nums ? ' has-nums' : '')}>
      {rows.map(([n, el, hint], i) => nums
        ? <div key={i} className={'pgw-nrow' + (hint ? ' is-hint' : '')}><span className="pgw-n" aria-hidden="true">{n}</span>{el}<span aria-hidden="true" /></div>
        : el)}
    </div>);
};

// Round 3: a sheet of six marks to react to (owner, 2026-10-28: "allows me to steer"). The words are the same in all six, so
// only the form changes: "Found" / "Not found" / "Still looking", with the count in plain English under it.
const pgwWords = (m) => (m.r.tone === 'ok' ? ['Found', 'in ' + m.n + (m.n === 1 ? ' guess' : ' guesses')]
  : m.r.tone === 'bad' ? ['Not found', null] : ['Still looking', (6 - m.n) + (6 - m.n === 1 ? ' guess left' : ' guesses left')]);
const PgwT2 = ({ m }) => { const [h, sub] = pgwWords(m); return <div className="pgw-tx"><h2 className="pgw-h">{h}</h2>{sub && <p className="pgw-sub">{sub}</p>}</div>; };
const PGW_C = [
  ['A', 'The cover', 'Daily Word’s cover as the mark, as Escape uses its cover’s door.'],
  ['B', 'The bracket', 'A bracket spans the rows you used; its length is the count.'],
  ['C', 'The leader', 'A line runs from the last row to the statement.'],
  ['D', 'The stamp', 'The word set inside a ruled box, like a stamp.'],
  ['E', 'One square', 'One tile-sized square in the result colour, beside off-white words.'],
  ['F', 'The tick', 'A tick (a cross when not found) built from two straight bars.'],
];
const PgwMark = ({ k, m }) => {
  const t = m.r.tone;
  if (k === 'A') return <div className="pgw-cv"><GsArt art="word" shape="square" /></div>;
  if (k === 'E') return <span className={'pgw-sq is-' + t} aria-hidden="true" />;
  if (k === 'F') return <span className={'pgw-tick is-' + t} aria-hidden="true">{t === 'live' ? null : <><i /><i /></>}</span>;
  return null;
};
const PgwStatement = ({ k, m }) => {
  const [h, sub] = pgwWords(m);
  if (k === 'D') return <div className={'pgw-st is-D is-' + m.r.tone}><h2 className="pgw-stamp">{h}</h2>{sub && <p className="pgw-sub">{sub}</p>}</div>;
  return <div className={'pgw-st is-' + k + ' is-' + m.r.tone}>{k === 'B' && <span className="pgw-br" aria-hidden="true" />}{k === 'C' && <span className="pgw-ld" aria-hidden="true" />}<PgwMark k={k} m={m} /><PgwT2 m={m} /></div>;
};

const PgwBody = ({ s }) => {
  const v = usePgw(); const m = React.useMemo(() => pgwRead(s), [s]);
  const list = v.d === 'all' ? PGW_C : PGW_C.filter((c) => c[0] === v.d);
  return <>
    <div className="pgw-sheet">
      {list.map(([k, name, why]) => (
        <div key={k} id={'c' + k} className="pgw-opt">
          <p className="pgw-tag"><b>{k}</b>{name}<span>{why}</span></p>
          <div className="pgw-o1"><section className={'pgw-card is-' + k} aria-label="How it went"><PgwBoard m={m} nums /><PgwStatement k={k} m={m} /></section></div>
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
  .pgw-card > .pgw-st { order: -1; width: 0; min-width: 100%; display: flex; align-items: center; gap: 16px; position: relative; }
  .pgw-tx { display: grid; gap: 4px; }
  .pgw-h { margin: 0; font: 700 28px/1.05 var(--font-heading); letter-spacing: -.01em; color: var(--text); text-wrap: balance; }
  .pgw-sub { margin: 0; font: 600 18px/1.3 var(--font-text); color: var(--muted); }
  /* A */
  .pgw-cv { flex: none; width: 72px; } .pgw-cv > * { width: 100%; }
  /* B: the bracket only shows beside the board (desktop) */
  .pgw-br { display: none; }
  /* C: the leader only shows beside the board */
  .pgw-ld { display: none; }
  /* D */
  .pgw-st.is-D { display: grid; justify-items: start; gap: 8px; }
  .pgw-stamp { margin: 0; padding: 8px 14px; border: 3px solid var(--off-white); font: 700 24px/1 var(--font-heading); letter-spacing: .06em; text-transform: uppercase; color: var(--text); }
  .is-ok .pgw-stamp { border-color: var(--success); color: var(--success); } .is-bad .pgw-stamp { border-color: var(--warning); color: var(--warning); }
  /* E */
  .pgw-sq { box-sizing: border-box; flex: none; width: 40px; height: 40px; }
  .pgw-sq.is-ok { background: #4CC38A; } .pgw-sq.is-bad { background: var(--warning); } .pgw-sq.is-live { border: 2px solid #746E65; }
  /* F: two straight bars; a tick when found, a cross when not; nothing while playing */
  .pgw-tick { flex: none; position: relative; width: 48px; height: 48px; }
  .pgw-tick.is-live { display: none; }
  .pgw-tick i { position: absolute; background: var(--success); height: 7px; }
  .pgw-tick.is-ok i:first-child { width: 20px; left: 4px; top: 27px; transform: rotate(45deg); }
  .pgw-tick.is-ok i:last-child { width: 38px; left: 14px; top: 20px; transform: rotate(-50deg); }
  .pgw-tick.is-bad i { background: var(--warning); width: 48px; left: 0; top: 20px; }
  .pgw-tick.is-bad i:first-child { transform: rotate(45deg); } .pgw-tick.is-bad i:last-child { transform: rotate(-45deg); }
  /* KEEP: from 900px the statement sits to the right of the board, so the card is wide rather than tall. */
  @container gs (min-width: 900px) {
    .pgw-card { grid-template-columns: auto auto; column-gap: 40px; align-items: center; }
    .pgw-card > .pgw-st { order: 0; width: auto; min-width: 0; padding-right: 8px; }
    /* KEEP: beside something, the numbers' mirrored right gutter goes: it only centres the tiles in a card of their own. */
    .pgw-card .pgw-nrow { grid-template-columns: 24px auto; } .pgw-card .pgw-nrow > span:last-child:empty { display: none; }
    .pgw-h { font-size: 40px; } .pgw-sub { font-size: 18px; }
    .pgw-card > .pgw-st.is-A, .pgw-card > .pgw-st.is-F { flex-direction: column; align-items: flex-start; gap: 20px; }
    .pgw-cv { width: 120px; }
    /* B: the bracket runs the board's full height, its arms pointing at the first and last rows */
    .pgw-card.is-B { column-gap: 0; align-items: stretch; }
    .pgw-st.is-B { padding-left: 0; gap: 24px; }
    .pgw-br { display: block; flex: none; align-self: stretch; width: 20px; margin: calc(var(--t, 60px) / 2) 0; border: 3px solid var(--off-white); border-left: 0; }
    .pgw-st.is-B.is-ok .pgw-br { border-color: var(--success); } .pgw-st.is-B.is-bad .pgw-br { border-color: var(--warning); }
    /* C: the statement sits level with the last row, which is the row that ended the day */
    .pgw-card.is-C { align-items: end; column-gap: 0; }
    .pgw-st.is-C { min-height: 72px; gap: 16px; }
    .pgw-ld { display: block; flex: none; width: 48px; border-top: 3px solid var(--off-white); margin-left: 12px; }
    .pgw-st.is-C.is-ok .pgw-ld { border-color: var(--success); } .pgw-st.is-C.is-bad .pgw-ld { border-color: var(--warning); }
    .pgw-stamp { font-size: 40px; padding: 12px 20px; }
    .pgw-sq { width: 64px; height: 64px; }
    .pgw-tick { width: 72px; height: 72px; } .pgw-tick i { height: 10px; }
    .pgw-tick.is-ok i:first-child { width: 30px; left: 6px; top: 40px; } .pgw-tick.is-ok i:last-child { width: 56px; left: 20px; top: 30px; }
    .pgw-tick.is-bad i { width: 72px; top: 31px; }
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
        {[['all', 'All six'], ...PGW_C.map((c) => [c[0], c[1]])].map(([k, l]) => <button key={k} type="button" className="pgw-chip" aria-pressed={v.d === k} onClick={() => PgwStore.set({ d: k })}>{k !== 'all' && <b>{k}</b>}{l}</button>)}</div>
      {/* The numbers are agreed (owner, 2026-10-28): always on, no switch. */}
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
