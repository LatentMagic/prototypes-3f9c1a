// Playground (1236, v11): Daily Word's now card, C2 with the plain word (v10's pick) and three ideas on it. The main build, whole,
// with a fixed bar: Concept (Now, D1 count, D2 six rows, D3 in the head), Tiles (48, 52, 56) and This edition's play. Every
// concept's pieces are rendered; the bar sets v11-<row>-<pick> on <html> and word-v11.html's styles show one. Replaces
// GS_LIBRARY.word here only: canon's page (app/gs-pass-library.jsx cprPzLibrary) with Pg11Now in the now card's place.
const PG11_KEY = 'pg_word-now_v11';
const PG11_ROWS = {
  concept: ['now', [['now', 'Now'], ['D1', 'D1 · Count'], ['D2', 'D2 · Six rows'], ['D3', 'D3 · In the head']]],
  tile: ['48', [['48', '48'], ['52', '52'], ['56', '56']]],
};
const pg11Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(PG11_KEY) || '{}'); } catch (e) {}
  return Object.fromEntries(Object.entries(PG11_ROWS).map(([k, [d, opts]]) => [k, opts.some((o) => o[0] === v[k]) ? v[k] : d])); };
const pg11Apply = (v) => { const h = document.documentElement;
  [...h.classList].filter((c) => c.startsWith('v11-')).forEach((c) => h.classList.remove(c));
  Object.entries(v).forEach(([k, x]) => h.classList.add('v11-' + k + '-' + x)); };
pg11Apply(pg11Get());
const PG11_PLAYS = [['live', 'In progress'], ['average', 'Average'], ['hard', 'Hard'], ['failed', 'Failed']];
const pg11Play = () => { const r = (window.gsApi && window.gsApi.review) || {}; return r.week === 'live' ? 'live' : r.ed || 'average'; };

const Pg11Bar = () => {
  const [v, setV] = React.useState(pg11Get); const [, tick] = React.useState(0);
  const set = (k, x) => { const n = { ...v, [k]: x }; try { localStorage.setItem(PG11_KEY, JSON.stringify(n)); } catch (e) {} pg11Apply(n); setV(n); };
  const play = (x) => { window.gsApi.setReview({ today: 'played', week: x === 'live' ? 'live' : 'done', ed: x === 'live' ? null : x }); tick((t) => t + 1); };
  const G = ({ label, opts, cur, on }) => (
    <div className="pg11-grp" role="group" aria-label={label}><span className="pg11-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="pg11-chip" aria-pressed={cur === x} onClick={() => on(x)}>{l}</button>)}</div>);
  return (
    <div className="pg11-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pg11-eyebrow">DAILY WORD NOW CARD v11</span>
      <G label="Concept" opts={PG11_ROWS.concept[1]} cur={v.concept} on={(x) => set('concept', x)} />
      <G label="Tiles" opts={PG11_ROWS.tile[1]} cur={v.tile} on={(x) => set('tile', x)} />
      <G label="Play" opts={PG11_PLAYS} cur={pg11Play()} on={play} />
    </div>);
};
(() => { const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Pg11Bar />); })();

const pg11Say = (g) => 'Guess ' + g.n + ', ' + g.word + ': ' + g.word.split('').map((ch, i) => ch + ' ' + WD_SAY[g.marks[i]]).join(', ');

// The result statement: Escape's plain word in its colour (v10's pick); In progress is the store's neutral result.
const Pg11Result = ({ s }) => { const r = wdResult(s);
  return r.tone === 'live'
    ? <span className="lb-big wd11-r"><LbResult s={{ kind: 'live', label: 'In progress' }} /></span>
    : <p className={'es-vd wd11-r is-' + (r.tone === 'ok' ? 'ok' : 'over')}>{r.word}</p>; };

const pg11Said = (s, last, hint) => s.live ? 'That’s guess ' + last.n + ' of 6 so far.' : s.loss ? 'That was your sixth and last guess.' : 'You found it on guess ' + last.n + ' of 6' + (hint ? ', with the hint.' : '.');

// One trail row: a guess's marks, a hint (a dashed square under the letter it gave), or a guess not used (D2).
const Pg11Tr = ({ e }) => (e.kind === 'guess'
  ? <div className="wd11-tr">{e.marks.map((m, j) => <i key={j} className={'is-' + m} />)}</div>
  : e.kind === 'hint' ? <div className="wd11-tr is-h">{[0, 1, 2, 3, 4].map((j) => <i key={j} className={j === e.pos ? 'is-hint' : 'is-none'} />)}</div>
  : <div className="wd11-tr">{[0, 1, 2, 3, 4].map((j) => <i key={j} className="is-empty" />)}</div>);

// ---- The picture. Now: trail, word, sentence under. D1: the sentence goes; the count sits beside the word as data. D2: no text;
// the trail always holds six guesses, the ones not used flat, so the count is the picture and the card's height holds steady.
// D3: the sentence moves into the head, under the title; the picture is trail and word only. ----
const Pg11Word = ({ ev, s }) => {
  const gs = ev.filter((e) => e.kind === 'guess'); const last = gs[gs.length - 1]; const hint = ev.some((e) => e.kind === 'hint');
  if (!last) return <div className="wd11-pic" />;
  const before = ev.slice(0, ev.indexOf(last));
  const six = [...ev.filter((e) => e !== last), ...Array.from({ length: 6 - gs.length }, () => ({ kind: 'empty' }))];
  return (
    <div className="wd11-pic"><div className="wd11-line">
      <div className="wd11-trail is-played" aria-hidden="true">{before.map((e, i) => <Pg11Tr key={i} e={e} />)}</div>
      <div className="wd11-trail is-six" aria-hidden="true">{six.map((e, i) => <Pg11Tr key={i} e={e} />)}</div>
      <div className="wd11-big">
        <div className="wd11-row" role="img" aria-label={pg11Say(last)}>{last.word.split('').map((ch, j) => <span key={j} className={'wd-t is-' + last.marks[j]} aria-hidden="true">{ch}</span>)}</div>
      </div>
      <div className="wd11-stat"><b>{(s.loss ? 'X' : last.n) + '/6'}</b><span>{s.live ? 'so far' : 'guesses'}{hint ? ' · 1 hint' : ''}</span></div>
    </div><p className="wd11-said is-now">{pg11Said(s, last, hint)}</p></div>);
};

// ---- The now card: canon's frame (label, the edition as its title, result at the top right, Share, the record link, the next
// word, and once finished "See what's out for you to play"), the paragraph and bar replaced by the picture, as Escape's. ----
const Pg11Now = ({ c }) => {
  const gs = useGs(); const done = lbWeekDone(gs); const sid = done ? c.today : c.liveSid; const s = GS_SESSIONS[sid];
  const ev = React.useMemo(() => wdRead(s).events, [s]);
  const gsv = ev.filter((e) => e.kind === 'guess'); const last = gsv[gsv.length - 1];
  return (
    <section className="lb-card wd11"><div className="wd11-in">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">TODAY</span><h2 className="mcp-t-sec">{'#' + s.number}</h2>
          {last && <p className="wd11-said is-head">{pg11Said(s, last, ev.some((e) => e.kind === 'hint'))}</p>}</div>
        <Pg11Result s={s} />
      </div>
      <Pg11Word ev={ev} s={s} />
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

// Canon's Daily Word page (cprPzLibrary), with Pg11Now in the now card's place.
const PG11_SHIP_NOW = window.PzNow;
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
        {locked ? <LbNeedsPass id={id} had ach={ach} access="all" /> : none ? <PG11_SHIP_NOW c={c} done={lbWeekDone(gs)} none id={id} /> : <Pg11Now c={c} />}
        <LbRun n={n} unit="days" weeks={fz ? fz.weeks : lbRunOf(run)} />
        <LbAch items={ach} badges={c.badges} access="all" />
        <LbRecent title={recent} allLabel="See in History" empty={recent + ' appear here once you have played one.'} />
      </div>
      {gs.view !== 'pass' && !locked && <window.CprPassEnd className="gs-muted gs-pu-wrap" text={'Playing earlier ' + GS_GAMES[id].ed[1] + ' comes with the Pass.'} />}
    </main>);
};

// Opens Library → Daily Word on the hard play, signed in with the Pass.
let pg11Opened = false;
window.KitCandidate = {
  bind() {
    if (pg11Opened) return; pg11Opened = true;
    setTimeout(() => {
      const a = window.gsApi; a.setView('pass'); a.setConnected(true);
      a.setReview({ today: 'played', week: 'done', ed: 'hard' });
      a.go('word', { page: 'record' }, 'pass');
    }, 0);
  },
};
