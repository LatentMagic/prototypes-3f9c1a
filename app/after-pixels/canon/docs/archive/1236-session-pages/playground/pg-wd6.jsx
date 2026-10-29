// ============================================================================
// Playground (1236), v6: Daily Word's session page, the board in a card that holds only real content (owner, 2026-10-28:
// design 1, the hugging card, is the base). Loads after app/gs-word.jsx and replaces GS_SESSION_BODY.word and
// GS_SESSION_QUIET.word (the head carries no result, as Escape's). Tiles square; the hint a half-height rectangle with a thin
// dotted edge. Three ideas for the result (Design 1 to 3, owner 2026-10-28): it moves off the top of the board, beside it,
// filled only with what the record holds. "1 hint" is gone from the result: the hint row already says it.
// ============================================================================
const PGW_O = [[false, 'Off'], [true, 'On']];
const PGW_S = [['today', 'Solved', 'word-today'], ['hard', 'Hard', 'word-hard'], ['failed', 'Failed', 'word-failed'], ['live', 'In progress', 'word-live']];

const PgwStore = (() => {
  let v = { nums: false, st: 'hard', d: 1 }; try { v = { ...v, ...JSON.parse(localStorage.getItem(window.PGW_KEY) || '{}') }; } catch (e) {}
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

const PgwVerdict = ({ r }) => (r.tone === 'live' ? <p className="pgw-vd">{r.vd}</p>
  : <p className={'pgw-vd is-' + r.tone}><DS.Icon name={r.tone === 'ok' ? 'check' : 'close'} size={20} />{r.vd}</p>);
// The result as one line (heading and verdict). KEEP: never wider than the board (width 0, min-width 100%), so the card hugs the tiles.
const PgwLine = ({ m }) => <div className="pgw-line"><h2 className="pgw-h">{m.r.head}</h2><PgwVerdict r={m.r} /></div>;
// The six tries as a track: used, the solving one, the ones to spare.
const PgwTrack = ({ m }) => (
  <span className="pgw-track" aria-hidden="true">
    {[1, 2, 3, 4, 5, 6].map((i) => <i key={i} className={i > m.n ? 'is-spare' : (i === m.n && m.r.tone === 'ok') ? 'is-ok' : 'is-used'} />)}
  </span>);

// What the record says about each place in the word: the guess that first put it in place, or the hint if the hint gave it
// first; unplaced if neither has yet.
const pgwPlaces = (m) => {
  const at = [null, null, null, null, null];
  m.ev.forEach((e) => {
    if (e.kind === 'hint') { if (!at[e.pos]) at[e.pos] = { by: 'hint', ch: e.letter }; return; }
    e.marks.forEach((k, i) => { if (k === 'hit' && !at[i]) at[i] = { by: e.n, ch: e.word[i] }; });
  });
  return at;
};
const pgwStatus = (m) => (m.r.tone === 'ok' ? 'Found on guess ' + m.n : m.r.tone === 'bad' ? 'Not found in 6' : m.r.vd);

// 1. The word: the result is the word itself, as far as you got it, each letter with the guess that put it in place.
const PgwWord = ({ m }) => {
  const at = pgwPlaces(m);
  return (
    <div className={'pgw-word is-' + m.r.tone}>
      <p className="pgw-st">{m.r.tone === 'ok' && <DS.Icon name="check" size={18} />}{pgwStatus(m)}</p>
      <div className="pgw-wl" role="img" aria-label={at.map((x, i) => x ? x.ch + (x.by === 'hint' ? ', from the hint' : ', guess ' + x.by) : 'letter ' + (i + 1) + ' not found').join('; ')}>
        {at.map((x, i) => <span key={i} className={'pgw-wc' + (x ? '' : ' is-gap') + (x && x.by === 'hint' ? ' is-hint' : '')}>
          <b>{x ? x.ch : ''}</b><small>{x ? (x.by === 'hint' ? 'Hint' : x.by) : ''}</small></span>)}
      </div>
    </div>);
};
const PgwO1 = ({ m, nums }) => <section className="pgw-card is-d1" aria-label="How it went"><PgwWord m={m} /><PgwBoard m={m} nums={nums} /></section>;

// 2. Closing in: letters in place after each guess, in a row; the run tells the day (a climb to 5, or a stall at 4).
const PgwRun = ({ m }) => {
  const steps = []; m.ev.forEach((e) => { if (e.kind === 'hint') steps.push({ hint: true, ch: e.letter }); else steps.push({ n: e.n, v: e.marks.filter((k) => k === 'hit').length }); });
  return (
    <div className={'pgw-run is-' + m.r.tone}>
      <p className="pgw-st">{m.r.tone === 'ok' && <DS.Icon name="check" size={18} />}{pgwStatus(m)}</p>
      <ol className="pgw-steps" aria-label="Letters in place after each guess">
        {steps.map((x, i) => x.hint
          ? <li key={i} className="pgw-sh" aria-label={'Hint: ' + x.ch}><span>{x.ch}</span></li>
          : <li key={i} className={'pgw-sv' + (x.v === 5 ? ' is-five' : '')} aria-label={'Guess ' + x.n + ': ' + x.v + ' in place'}><b>{x.v}</b><i aria-hidden="true">{[0, 1, 2, 3, 4].map((j) => <em key={j} className={j < x.v ? 'is-on' : ''} />)}</i></li>)}
      </ol>
      <p className="pgw-cap">Letters in place after each guess</p>
    </div>);
};
const PgwO2 = ({ m, nums }) => <section className="pgw-card is-d2" aria-label="How it went"><PgwRun m={m} /><PgwBoard m={m} nums={nums} /></section>;

// 3. Against six: the guesses used out of the six you get, as Escape's time against par.
const PgwTally = ({ m }) => (
  <div className="pgw-tally">
    <div className={'pgw-resh is-' + m.r.tone}><h2 className="pgw-h">{m.r.head}</h2>{m.r.tone !== 'live' && <DS.Icon name={m.r.tone === 'ok' ? 'check' : 'close'} size={24} />}</div>
    <p className="pgw-fig" aria-label={m.n + ' of 6 guesses'}>{m.n}<span>/6</span></p>
    <PgwTrack m={m} />
    <p className="pgw-cap">{m.r.spare}</p>
  </div>);
const PgwO3 = ({ m, nums }) => (
  <section className="pgw-card is-d3" aria-label="How it went">
    <PgwTally m={m} /><PgwBoard m={m} nums={nums} />
  </section>);

const PgwBody = ({ s }) => {
  const v = usePgw(); const m = React.useMemo(() => pgwRead(s), [s]);
  const O = v.d === 3 ? PgwO3 : v.d === 2 ? PgwO2 : PgwO1;
  return <>
    <div className="pgw-o1"><O m={m} nums={v.nums} /></div>
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
  /* the result, shared */
  .pgw-line { width: 0; min-width: 100%; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }
  .pgw-resh { display: flex; align-items: center; gap: 8px; color: var(--success); }
  .pgw-h { margin: 0; font: 700 28px/1.1 var(--font-heading); letter-spacing: -.01em; color: var(--text); }
  .pgw-vd { margin: 0; display: flex; align-items: center; gap: 6px; font: 600 18px/1.35 var(--font-text); color: var(--text); }
  .pgw-vd.is-ok { color: var(--success); } .pgw-vd.is-bad { color: var(--warning); } .pgw-resh.is-bad { color: var(--warning); }
  .pgw-cap { margin: 0; font: 400 15px/1.4 var(--font-text); color: var(--muted); }
  .pgw-tally .pgw-fig { display: none; }
  .pgw-st { margin: 0; display: flex; align-items: center; gap: 6px; font: 600 16px/1.35 var(--font-text); color: var(--text); }
  .is-ok > .pgw-st { color: var(--success); }
  /* 1: the word in heading type over a rule per place; an unplaced place keeps a dashed rule and no letter */
  .pgw-word, .pgw-run { width: 0; min-width: 100%; display: grid; gap: 12px; }
  .pgw-wl { display: flex; gap: 10px; }
  .pgw-wc { flex: 1 1 0; max-width: 56px; display: grid; justify-items: center; gap: 6px; }
  .pgw-wc b { display: block; width: 100%; min-height: 1em; text-align: center; padding-bottom: 6px; border-bottom: 3px solid var(--off-white); font: 700 44px/1 var(--font-heading); color: var(--text); }
  .pgw-wc.is-gap b { border-bottom-style: dashed; border-bottom-color: #746E65; }
  .pgw-wc small { min-height: 1em; font: 600 12px/1 var(--font-text); letter-spacing: .04em; text-transform: uppercase; color: var(--muted); font-variant-numeric: tabular-nums; }
  /* 2: one figure per guess, five pips under it; the hint a dashed letter between */
  .pgw-steps { margin: 0; padding: 0; list-style: none; display: flex; align-items: flex-start; gap: 14px; }
  .pgw-sv { display: grid; justify-items: center; gap: 8px; }
  .pgw-sv b { font: 700 40px/1 var(--font-heading); color: var(--muted); font-variant-numeric: tabular-nums; }
  .pgw-sv:last-child b, .pgw-sv.is-five b { color: var(--text); }
  .pgw-sv i { display: flex; gap: 2px; } .pgw-sv em { width: 5px; height: 5px; border: 1px solid #746E65; } .pgw-sv em.is-on { background: #4CC38A; border-color: #4CC38A; }
  .pgw-sh { align-self: center; } .pgw-sh span { display: grid; place-items: center; width: 24px; height: 24px; border: 1.5px dashed var(--off-white); font: 700 13px/1 var(--font-heading); color: var(--off-white); }
  /* 3 on a phone: heading and track on one line above the board */
  .pgw-tally { width: 0; min-width: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
  .pgw-tally .pgw-cap { flex-basis: 100%; }
  .pgw-track { display: flex; gap: 4px; }
  .pgw-track i { box-sizing: border-box; width: 20px; height: 8px; }
  .pgw-track .is-used { background: #918B80; } .pgw-track .is-ok { background: #4CC38A; } .pgw-track .is-spare { border: 1.5px solid #746E65; }
  /* KEEP: from 900px the result sits beside the board, never above it, so the card is wide rather than tall. */
  @container gs (min-width: 900px) {
    .pgw-card.is-d1, .pgw-card.is-d2, .pgw-card.is-d3 { grid-template-columns: auto auto; column-gap: 40px; }
    /* KEEP: beside something, the numbers' mirrored right gutter goes: it only centres the tiles in a card of their own. */
    .pgw-card .pgw-nrow { grid-template-columns: 24px auto; } .pgw-card .pgw-nrow > span:last-child:empty { display: none; }
    .pgw-card.is-d1, .pgw-card.is-d2 { align-items: center; column-gap: 48px; }
    .pgw-word, .pgw-run { width: auto; min-width: 0; gap: 16px; }
    .pgw-wl { gap: 12px; } .pgw-wc { flex: none; width: 64px; max-width: none; }
    .pgw-wc b { font-size: 64px; }
    .pgw-sv b { font-size: 56px; } .pgw-sv em { width: 7px; height: 7px; } .pgw-steps { gap: 18px; }
    .pgw-card.is-d3 { align-items: center; }
    .pgw-tally { width: auto; display: grid; gap: 12px; justify-items: start; }
    .pgw-tally .pgw-fig { display: block; margin: 0; font: 700 96px/.9 var(--font-heading); letter-spacing: -.03em; color: var(--text); }
    .pgw-tally .pgw-fig span { font-size: 40px; color: var(--muted); letter-spacing: 0; }
    .pgw-tally .pgw-track i { width: 28px; height: 10px; }
  }
  @container gs (min-width: 640px) {
    .pgw-board, .pgw-board.has-nums { --g: 8px; --t: clamp(56px, calc((100vh - 560px) / 5), 72px); }
    .pgw-card { padding: 24px; gap: 20px; }
    .pgw-h { font-size: 34px; }
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
      <span className="pgw-eyebrow">DAILY WORD v6</span>
      <div className="pgw-grp" role="group" aria-label="Design"><span className="pgw-lab">Design</span>
        {[[1, 'The word'], [2, 'Closing in'], [3, 'Against six']].map(([k, l]) => <button key={k} type="button" className="pgw-chip" aria-pressed={v.d === k} onClick={() => PgwStore.set({ d: k })}><b>{k}</b>{l}</button>)}</div>
      <div className="pgw-grp" role="group" aria-label="Guess numbers"><span className="pgw-lab">Numbers</span>
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
