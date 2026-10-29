// Playground (1236, v10): Daily Word's now card, concept C (the word) in two fixes. The main build, whole, with a fixed bar: Fix
// (C1 centred, C2 beside the head), Result (the store's Tag or Escape's plain word) and This edition's play. Every concept and result is
// rendered; the bar sets v10-<row>-<pick> on <html> and word-v10.html's styles show one. Replaces GS_LIBRARY.word here only:
// canon's page (app/gs-pass-library.jsx cprPzLibrary) with Pg10Now in the now card's place. Nothing in app/ is changed.
const PG10_KEY = 'pg_word-now_v10';
const PG10_ROWS = {
  concept: ['C1', [['C1', 'C1 · Centred'], ['C2', 'C2 · Beside the head']]],
  res: ['tag', [['tag', 'Tag'], ['text', 'Plain word']]],
};
const pg10Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(PG10_KEY) || '{}'); } catch (e) {}
  return Object.fromEntries(Object.entries(PG10_ROWS).map(([k, [d, opts]]) => [k, opts.some((o) => o[0] === v[k]) ? v[k] : d])); };
const pg10Apply = (v) => { const h = document.documentElement;
  [...h.classList].filter((c) => c.startsWith('v10-')).forEach((c) => h.classList.remove(c));
  Object.entries(v).forEach(([k, x]) => h.classList.add('v10-' + k + '-' + x)); };
pg10Apply(pg10Get());
const PG10_PLAYS = [['live', 'In progress'], ['average', 'Average'], ['hard', 'Hard'], ['failed', 'Failed']];
const pg10Play = () => { const r = (window.gsApi && window.gsApi.review) || {}; return r.week === 'live' ? 'live' : r.ed || 'average'; };

const Pg10Bar = () => {
  const [v, setV] = React.useState(pg10Get); const [, tick] = React.useState(0);
  const set = (k, x) => { const n = { ...v, [k]: x }; try { localStorage.setItem(PG10_KEY, JSON.stringify(n)); } catch (e) {} pg10Apply(n); setV(n); };
  const play = (x) => { window.gsApi.setReview({ today: 'played', week: x === 'live' ? 'live' : 'done', ed: x === 'live' ? null : x }); tick((t) => t + 1); };
  const G = ({ label, opts, cur, on }) => (
    <div className="pg10-grp" role="group" aria-label={label}><span className="pg10-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="pg10-chip" aria-pressed={cur === x} onClick={() => on(x)}>{l}</button>)}</div>);
  return (
    <div className="pg10-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pg10-eyebrow">DAILY WORD NOW CARD v10 · C</span>
      <G label="Fix" opts={PG10_ROWS.concept[1]} cur={v.concept} on={(x) => set('concept', x)} />
      <G label="Result" opts={PG10_ROWS.res[1]} cur={v.res} on={(x) => set('res', x)} />
      <G label="Play" opts={PG10_PLAYS} cur={pg10Play()} on={play} />
    </div>);
};
(() => { const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Pg10Bar />); })();

const pg10Say = (g) => 'Guess ' + g.n + ', ' + g.word + ': ' + g.word.split('').map((ch, i) => ch + ' ' + WD_SAY[g.marks[i]]).join(', ');

// ---- The result statement, both treatments: the session page's Tag at card size, or Escape's plain word in its colour. In
// progress is the store's neutral result in both (as Escape's). ----
const Pg10Result = ({ s }) => { const r = wdResult(s); return <>
  <span className="lb-big wd10-r is-tag"><span className={'wd-tag is-' + r.tone}>{r.tone !== 'live' && <DS.Icon name={r.tone === 'ok' ? 'check' : 'close'} size={20} />}{r.word}</span></span>
  {r.tone === 'live'
    ? <span className="lb-big wd10-r is-text"><LbResult s={{ kind: 'live', label: 'In progress' }} /></span>
    : <p className={'es-vd wd10-r is-text is-' + (r.tone === 'ok' ? 'ok' : 'over')}>{r.word}</p>}
</>; };

// ---- C · The word: the guess the play ended on (the word you found, your last try, or your latest so far) at full tile size,
// the guesses before it as a small blocks trail climbing up to it. ----
const Pg10Word = ({ ev, s }) => {
  const gs = ev.filter((e) => e.kind === 'guess'); const last = gs[gs.length - 1]; const hint = ev.some((e) => e.kind === 'hint');
  if (!last) return <div className="wd10-pic is-C" />;
  const said = s.live ? 'That’s guess ' + last.n + ' of 6 so far.' : s.loss ? 'That was your sixth and last guess.' : 'You found it on guess ' + last.n + ' of 6' + (hint ? ', with the hint.' : '.');
  return (
    <div className="wd10-pic is-C"><div className="wd10-line">
      <div className="wd10-trail" aria-hidden="true">
        {ev.slice(0, ev.indexOf(last)).map((e, i) => (e.kind === 'guess'
          ? <div key={i} className="wd10-tr">{e.marks.map((m, j) => <i key={j} className={'is-' + m} />)}</div>
          : <div key={i} className="wd10-tr is-h">{[0, 1, 2, 3, 4].map((j) => <i key={j} className={j === e.pos ? 'is-hint' : 'is-none'} />)}</div>))}
      </div>
      <div className="wd10-big">
        <div className="wd10-row" role="img" aria-label={pg10Say(last)}>{last.word.split('').map((ch, j) => <span key={j} className={'wd-t is-' + last.marks[j]} aria-hidden="true">{ch}</span>)}</div>
      </div>
    </div><p className="wd10-said">{said}</p></div>);
};

// ---- The now card: canon's frame (label, the edition as its title as Escape's room name, result at the top right, Share, the record link, the next word, and once finished
// "See what's out for you to play"), the paragraph and bar replaced by the concept's picture, as Escape's. ----
const Pg10Now = ({ c }) => {
  const gs = useGs(); const done = lbWeekDone(gs); const sid = done ? c.today : c.liveSid; const s = GS_SESSIONS[sid];
  const ev = React.useMemo(() => wdRead(s).events, [s]);
  return (
    <section className="lb-card wd10"><div className="wd10-in">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">TODAY</span><h2 className="mcp-t-sec">{'#' + s.number}</h2></div>
        <Pg10Result s={s} />
      </div>
      <Pg10Word ev={ev} s={s} />
      <div className="lb-foot">
        <div className="lb-acts">
          {done && <LbShare lines={gsShareText(s)} />}
          <DS.TextLink onClick={() => gs.go('session', { id: sid })}>{done ? c.links[0] : c.links[1]}</DS.TextLink>
        </div>
        <span className="gs-muted">{c.next}</span>
      </div>
      {done && <CprNextLink />}
    </div></section>);
};

// Canon's Daily Word page (cprPzLibrary), with Pg10Now in the now card's place.
const PG10_SHIP_NOW = window.PzNow;
window.GS_LIBRARY.word = () => {
  const gs = useGs(); const r = gs.route; const id = 'word';
  if (r.list && !r.sid) return <PgeListPage key={id} gid={id} />;
  const c = PZ[id]; const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (gs.review.today || '');
  const [recent] = c.plays;
  const locked = cprLocked(gs, id); const had = locked && gsLapsed(gs) && phVisible(gs).some((p) => p.gid === id);
  if (locked && !had) return <main key={k} className="gs-wrap gs-main"><LbHead id={id} /><div className="lb-lay"><LbNeedsPass id={id} ach={c.ach} access="all" /></div></main>;
  const none = gs.review.never === id || gsFresh(gs) || !lbNow(gs, id);
  const run = pzRun(gs, id); const fz = had ? lbFrozen(lbRunOf(run), run, (x) => x.date) : null;
  const n = fz ? fz.n : lbStreak(run);
  const ach = phAch(gs, id, c.ach, n);
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id={id} />
      <div className="lb-lay">
        {locked ? <LbNeedsPass id={id} had ach={ach} access="all" /> : none ? <PG10_SHIP_NOW c={c} done={lbWeekDone(gs)} none id={id} /> : <Pg10Now c={c} />}
        <LbRun n={n} unit="days" weeks={fz ? fz.weeks : lbRunOf(run)} />
        <LbAch items={ach} badges={c.badges} access="all" />
        <LbRecent title={recent} allLabel="See in History" empty={recent + ' appear here once you have played one.'} />
      </div>
      {gs.view !== 'pass' && !locked && <window.CprPassEnd className="gs-muted gs-pu-wrap" text={'Playing earlier ' + GS_GAMES[id].ed[1] + ' comes with the Pass.'} />}
    </main>);
};

// Opens Library → Daily Word on the hard play, signed in with the Pass.
let pg10Opened = false;
window.KitCandidate = {
  bind() {
    if (pg10Opened) return; pg10Opened = true;
    setTimeout(() => {
      const a = window.gsApi; a.setView('pass'); a.setConnected(true);
      a.setReview({ today: 'played', week: 'done', ed: 'hard' });
      a.go('word', { page: 'record' }, 'pass');
    }, 0);
  },
};
