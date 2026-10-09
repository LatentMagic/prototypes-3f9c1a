// Playground: where a player finds what a game has put out and what they played, options 1 to 3, 2026-10-09.
// Overrides on window only (GsEditions, GsHistory, GsGamePage, LbRecent, edGo, GsDemoBar); nothing in app/ changes.
// Brief: docs/specs/plays-and-editions/ (handoff beside this folder).
const MD_KEY = 'pg_plays_v1';
let md = { opt: '1', open: true, game: 'word', ...(() => { try { return JSON.parse(localStorage.getItem(MD_KEY)) || {}; } catch (e) { return {}; } })() };
const mdSubs = new Set();
const mdSet = (p) => { md = { ...md, ...p }; try { localStorage.setItem(MD_KEY, JSON.stringify(md)); } catch (e) {} mdSubs.forEach((f) => f(md)); };
const useMd = () => { const [s, setS] = React.useState(md); React.useEffect(() => { mdSubs.add(setS); return () => mdSubs.delete(setS); }, []); return s; };

// ---- What an edition was. Answers show only once you've finished it; suspects and rooms are no spoiler. ----
const mdJoin = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const mdDay = (date) => pzLong(phParse(date));
const mdSid = (e) => { const c = PZ[e.gid]; const x = c.all.find((y) => y.id === e.key); return x && (x.i === 0 ? c.today : x.sid); };
const mdWhat = (e) => {
  const k = e.status && e.status.kind; const done = k === 'ok' || k === 'bad';
  if (e.gid === 'casebook') { const c = CB_ALL.find((y) => y.id === e.key); return c && c.cast ? mdJoin(c.cast) + ' are the suspects.' : null; }
  if (e.gid === 'delve') { const d = DV_ALL.find((y) => y.id === e.key); return d && k && k !== 'none' ? 'You went in as ' + d.hero + '.' : null; }
  if (!done || !PZ[e.gid]) return null;
  const s = GS_SESSIONS[mdSid(e)]; if (!s || !s.lines || !s.lines.length) return null;
  if (e.gid === 'word') { const a = s.answer || (!s.loss ? s.lines[s.lines.length - 1][1] : null); return a ? 'The word was ' + a + '.' : null; }
  if (e.gid === 'groups') { const f = s.lines.filter((l) => String(l[2]).startsWith('Found: ')).map((l) => l[2].slice(7)); return f.length ? 'You found ' + mdJoin(f) + '.' : null; }
  if (e.gid === 'mystery') { const a = s.lines.find((l) => l[0] === 'Accusation'); return a ? (a[2] === 'Right' ? 'It was ' + a[1] + '.' : 'You named ' + a[1] + ', and it wasn’t them.') : null; }
  return null;
};
// Plays by edition, newest first, as History shows them for this viewer.
const mdBy = (gs) => { const by = {}; if (gs.view === 'out') return by; phVisible(gs).forEach((p) => { (by[p.ed] = by[p.ed] || []).push(p); }); return by; };
const mdEnrich = (e, by) => ({ ...e, day: mdDay(e.date), what: mdWhat(e), plays: by[e.key] || [] });
const mdEds = (gs, gid) => { const by = mdBy(gs); return edList(gs, gid).map((e) => mdEnrich(e, by)); };
const mdFirst = (e) => e.plays.find((p) => !p.again) || e.plays[0];
const mdAgain = (e) => { const f = mdFirst(e); return !!f && f.status.kind !== 'live'; };
const mdPlay = (gs, e) => gs.playReq({ kind: 'edition', e });

// ---- Parts ----
const MdMarks = ({ e }) => { const gs = useGs(); return <span className="ed-slots"><span className="ed-slot">{!e.free && gs.view !== 'pass' && <DS.Tag kind="locked">Pass</DS.Tag>}</span><span className="ed-slot">{e.now && <DS.Tag kind="daily">Latest</DS.Tag>}</span></span>; };
const MdRow = ({ e, title, cov, noDay, onOpen }) => (
  <button type="button" className={'ed-row' + (cov ? ' md-cov' : '')} onClick={onOpen}>
    {cov && <PhCov gid={e.gid} />}
    <span className="ed-t">{title || edName(e)}</span>
    {(!noDay || e.what) && <span className="ed-m">{!noDay && <span className="lb-date">{e.day}</span>}{e.what && <span className="md-what">{e.what}</span>}</span>}
    <MdMarks e={e} />
    <span className="ed-r">{e.status && <EdSt s={e.status} />}</span>
    <LbChev />
  </button>
);
const mdPlayView = (gs, e, p) => ({ key: p.pid, title: pzLong(p.at), when: phTime(p.at), status: rpSh(e.gid, p.status), chip: p.again ? 'again' : null, onOpen: () => p.open(gs) });
const MdPlays = ({ e, flush }) => {
  const gs = useGs(); const nor = e.plays.some((p) => p.again) ? undefined : '1';
  return <ul className={'lb-list rp-cols' + (flush ? ' md-flush' : '')} data-nor={nor}>{e.plays.map((p) => <li key={p.pid}><RpRow v={mdPlayView(gs, e, p)} /></li>)}</ul>;
};
const MdPassNote = ({ e, before }) => {
  const gs = useGs(); if (e.free || gs.view === 'pass') return null;
  return <p className="gs-small">This edition comes with the Pass. <button type="button" className="gs-inlink" onClick={() => { if (before) before(); gs.go('pass'); }}>About the Pass</button></p>;
};
const MdSignIn = ({ before }) => {
  const gs = useGs();
  return <p className="gs-muted">Sign in and every play of it is kept here. <button type="button" className="gs-inlink" onClick={() => { if (before) before(); gs.go('signup'); }}>Start free</button></p>;
};

// ---- Option 1: a panel for each edition ----
const MdPanel = ({ e, onClose }) => {
  const gs = useGs(); const last = React.useRef(null); if (e) last.current = e; const x = last.current;
  if (!x) return null;
  const out = gs.view === 'out';
  return (
    <DS.Popup open={!!e} onClose={onClose} kind="panel" title={GS_GAMES[x.gid].name + ' ' + edName(x)}
      actions={<DS.Button block onClick={() => { onClose(); mdPlay(gs, x); }}>{mdAgain(x) ? 'Play again' : 'Play in your AI'}</DS.Button>}>
      <div className="gs-stack-md">
        <div className="gs-stack-xs"><span className="gs-muted">{x.day}</span>{x.what && <p>{x.what}</p>}</div>
        <MdPassNote e={x} before={onClose} />
        {out ? <MdSignIn before={onClose} />
          : x.plays.length ? <div className="gs-stack-sm"><h3 className="mcp-t-card">Your plays</h3><MdPlays e={x} flush /></div>
          : <p className="gs-muted">You haven’t played this one yet.</p>}
      </div>
    </DS.Popup>
  );
};
// What pressing an edition does: option 1 opens its panel, option 3 its page.
const useMdOpen = () => {
  const s = useMd(); const gs = useGs(); const [e, setE] = React.useState(null);
  if (s.opt === '3') return { go: (x) => gs.go(GS_GAMES[x.gid].route, { page: 'edition', key: x.key }), el: null };
  return { go: setE, el: <MdPanel e={e} onClose={() => setE(null)} /> };
};

// ---- Options 1 and 3: the game's list of editions (the Editions page) ----
const MdEditions = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const all = mdEds(gs, id);
  const f = useEdFilter(gs, all); const open = useMdOpen();
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={g.name} onClick={() => gs.go(g.route)} />
      <h1 className="gs-h1">All editions</h1>
      <div className="lb-alllay">
        <EdTools f={f} gid={id} />
        <div className="lb-box lb-results">
          {!f.out.length ? <p className="lb-empty gs-muted">No edition matches that. Try a number or a date.</p>
            : <EdPager list={f.out} size={15}>{(rs) => <ul className="lb-list">{rs.map((e) => <li key={e.key}><MdRow e={e} onOpen={() => open.go(e)} /></li>)}</ul>}</EdPager>}
        </div>
      </div>
      {open.el}
    </main>
  );
};
// The library game page's card: the latest earlier editions, played or not. "All…" opens the list above.
const MdRecent = ({ gid, title, allLabel }) => {
  const gs = useGs(); const open = useMdOpen(); const es = mdEds(gs, gid).slice(1, 6);
  return (
    <section className="lb-card">
      <div className="lb-sechead"><h2 className="mcp-t-card">{title}</h2><DS.TextLink onClick={() => edGo(gs, gid)}>{allLabel}</DS.TextLink></div>
      <ul className="lb-list md-card">{es.map((e) => <li key={e.key}><MdRow e={e} onOpen={() => open.go(e)} /></li>)}</ul>
      {open.el}
    </section>
  );
};

// ---- Option 3: a page for every edition ----
const MdEditionPage = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const out = gs.view === 'out'; const all = mdEds(gs, id);
  const e = all.find((x) => x.key === gs.route.key) || all[0]; const again = mdAgain(e);
  return (
    <main className="gs-wrap gs-main">
      <LbBack label="All editions" onClick={() => edGo(gs, id)} />
      <section className="gs-sess-head">
        <GsCover art={g.art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <h1 className="gs-h1">{g.name + ' ' + edName(e)}</h1>
          <div className="gs-figs"><span className="gs-fig gs-fig-quiet">{e.day}</span>{!e.free && gs.view !== 'pass' && <DS.Tag kind="locked">Pass</DS.Tag>}{e.now && <DS.Tag kind="daily">Latest</DS.Tag>}</div>
          {e.what && <p>{e.what}</p>}
          {e.status && e.status.kind !== 'none' && <LbResult s={e.status} />}
          <DS.Button variant={again ? 'secondary' : 'main'} onClick={() => mdPlay(gs, e)}>{again ? 'Play again' : 'Play in your AI'}</DS.Button>
          <MdPassNote e={e} />
        </div>
      </section>
      {out ? <MdSignIn /> : (
        <section className="gs-stack-md">
          <h2 className="mcp-t-sec">Your plays</h2>
          {e.plays.length ? <div className="lb-box"><MdPlays e={e} /></div> : <p className="gs-muted">You haven’t played this one yet.</p>}
          {e.plays.some((p) => p.again) && <p className="gs-muted">Only your first finished play counts for your streak and your shared result.</p>}
        </section>
      )}
    </main>
  );
};

// ---- Option 2: History holds everything, every edition under the day it came out ----
const MD_SIZE = 24;
const MdHistory = ({ fixed }) => {
  const gs = useGs(); const r = gs.route; const out = gs.view === 'out';
  const start = fixed || r.game;
  const [g, setG0] = React.useState(start || 'all'); const [show, setShow0] = React.useState(start ? 'all' : 'played');
  const [sort, setSort0] = React.useState('new'); const [pg, setPg] = React.useState(0);
  const reset = (fn) => (v) => { fn(v); setPg(0); };
  const setG = reset(setG0); const setShow = reset(setShow0); const setSort = reset(setSort0);
  const by = mdBy(gs);
  const hunter = out ? [] : phVisible(gs).filter((p) => p.gid === 'hunter').map((p) => ({ key: p.ed, gid: 'hunter', hunter: true, title: p.edTitle, date: lbDate(p.edDate), free: true, now: false, status: p.status, plays: [p], day: pzLong(p.edDate), what: null }));
  const has = (k) => k === 'hunter' ? hunter.length > 0 : true;
  const games = (out && fixed ? [fixed] : g === 'all' ? GS_GAME_ORDER : [g]).filter(has);
  let items = games.flatMap((k) => (k === 'hunter' ? hunter : ED_GAMES.includes(k) ? edList(gs, k).map((e) => mdEnrich(e, by)) : []));
  if (!out) items = items.filter((e) => show === 'all' || (show === 'played' ? e.plays.length > 0 : e.status && e.status.kind === 'none'));
  items.forEach((e) => { e.at = phParse(e.date); });
  items.sort((a, b) => b.at - a.at || GS_GAME_ORDER.indexOf(a.gid) - GS_GAME_ORDER.indexOf(b.gid));
  if (sort === 'old') items.reverse();
  const pages = Math.max(1, Math.ceil(items.length / MD_SIZE)); const p = Math.min(pg, pages - 1);
  const groups = []; items.slice(p * MD_SIZE, p * MD_SIZE + MD_SIZE).forEach((e) => { const k = phDayKey(e.at); const l = groups[groups.length - 1]; if (l && l[0] === k) l[2].push(e); else groups.push([k, phDayLabel(e.at), [e]]); });
  const one = games.length === 1;
  const name = (e) => (e.hunter ? GS_GAMES.hunter.name + ' · ' + e.title : one ? edName(e) : GS_GAMES[e.gid].name + ' ' + edName(e));
  const press = (e) => (!out && e.plays.length ? mdFirst(e).open(gs) : mdPlay(gs, e));
  const gameOpts = [['all', 'All games'], ...GS_GAME_ORDER.filter((k) => (k === 'hunter' ? hunter.length : ED_GAMES.includes(k))).map((k) => [k, GS_GAMES[k].name])];
  const backTo = r.from ? [GS_GAMES[r.from].name, () => gs.go(GS_GAMES[r.from].route, { page: 'record' })] : (fixed || r.back) ? [GS_GAMES[fixed || r.back].name, () => gs.go(GS_GAMES[fixed || r.back].route)] : null;
  return (
    <main className="gs-wrap gs-main">
      {backTo && <LbBack label={backTo[0]} onClick={backTo[1]} />}
      {out ? <h1 className="gs-h1">All editions</h1> : <PhHead />}
      <div className="lb-alllay">
        <aside className="lb-tools">
          <LbChoice label="Order" value={sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={setSort} />
          {!out && <LbChoice label="Show" value={show} opts={[['all', 'Everything'], ['played', 'Played'], ['none', 'Not played']]} onPick={setShow} />}
          {!(out && fixed) && <LbChoice label="Game" value={g} opts={gameOpts} onPick={setG} />}
        </aside>
        <div className="lb-box lb-results">
          {groups.length ? groups.map(([k, label, es]) => (
            <React.Fragment key={k + p}>
              <h2 className="ph-day">{label}</h2>
              <ul className="lb-list">{es.map((e) => {
                const reps = e.plays.filter((x) => x.again);
                return (
                  <React.Fragment key={e.gid + e.key}>
                    <li><MdRow e={e} cov={!one} noDay title={name(e)} onOpen={() => press(e)} /></li>
                    {reps.length > 0 && <li className="md-rep-wrap"><ul className="lb-list rp-cols md-reps">{reps.map((x) => <li key={x.pid}><RpRow v={mdPlayView(gs, e, x)} /></li>)}</ul></li>}
                  </React.Fragment>
                );
              })}</ul>
            </React.Fragment>
          )) : <p className="lb-empty gs-muted">Nothing matches that.</p>}
          <RpPages pg={p} pages={pages} go={(x) => { setPg(x); gsScrollTop(); }} />
        </div>
      </div>
    </main>
  );
};

// ---- Wiring: each override falls back to the app's own component ----
const MD_BASE = { GsEditions: window.GsEditions, GsHistory: window.GsHistory, GsGamePage: window.GsGamePage, LbRecent: window.LbRecent, edGo: window.edGo };
const MdEditionsSwitch = ({ id }) => { const s = useMd(); return s.opt === '2' ? <MdHistory key="o2" fixed={id} /> : <MdEditions key="o13" id={id} />; };
const MdHistorySwitch = () => { const s = useMd(); return s.opt === '2' ? <MdHistory /> : <MD_BASE.GsHistory />; };
const MdGamePage = (props) => { const gs = useGs(); const s = useMd(); return s.opt === '3' && gs.route.page === 'edition' && ED_GAMES.includes(props.id) ? <MdEditionPage id={props.id} /> : <MD_BASE.GsGamePage {...props} />; };
const MdRecentSwitch = (props) => {
  const s = useMd(); const gs = useGs(); const gid = gsGameOfRoute(gs.route.name);
  return s.opt === '2' || !ED_GAMES.includes(gid) ? <MD_BASE.LbRecent {...props} /> : <MdRecent gid={gid} title={props.title} allLabel={props.allLabel} />;
};
// Option 2 signed in: "All editions" opens History filtered to the game.
const mdEdGo = (gs, gid, pick) => (md.opt === '2' && gs.view !== 'out' ? gs.go('history', { game: gid, back: gid }) : MD_BASE.edGo(gs, gid, pick));

// ---- Strip ----
const MD_OPTS = [
  { id: '1', name: 'A panel for each edition',
    idea: 'Each game keeps one list of everything it has put out: the Editions page, reached from the product page and from the library game page’s card. An entry shows the day, what the edition was once you’ve finished it, and your result. Pressing it opens a panel with every play of it, each opening its session page, and Play or Play again.',
    cost: 'History still lists the same plays across games, so for one game a play shows in two lists. Play is one step further away than today.',
    out: 'The same list with no results. The panel gives the prompt and a line about signing in.' },
  { id: '2', name: 'History holds everything',
    idea: 'The Editions page goes. History lists every edition of every game under the day it came out, played or not, with your replays beneath it. Show picks everything, played or not played; Game narrows it to one. “All editions” and the library game page open it filtered to the game.',
    cost: 'With every game and everything shown the list is long, so it opens on what you played. A row does one of two things: opens your first play, or gives the prompt if you haven’t played it. Play again is on the session page.',
    out: '“All editions” on the product page opens the same list for that game, titled All editions, with no results and no Show.' },
  { id: '3', name: 'A page for every edition',
    idea: 'Every edition gets its own page: what it was, your result, every play of it (each opens its session page) and Play or Play again. The Editions page and the library game page’s card list editions and open that page; History lists plays and opens session pages.',
    cost: 'A new kind of page, and the prompt is two presses from a list. Three lists stay; they meet at the edition page instead of repeating each other.',
    out: 'The edition page is public: what it was and the prompt, without your plays. A link to it can be sent to anyone.' },
];
let mdBooted = false;
const MdStrip = () => {
  const gs = useGs(); const s = useMd(); const o = MD_OPTS.find((x) => x.id === s.opt) || MD_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!mdBooted) { mdBooted = true; gs.setView('pass'); gs.setConnected(true); setTimeout(() => window.gsApi.go(GS_GAMES[md.game].route, { page: 'record' }), 0); } }, []);
  const out = gs.view === 'out';
  const view = (v) => { gs.setDemoView(v); gs.setConnected(v !== 'out'); };
  const rt = gs.route; const gid = gsGameOfRoute(rt.name);
  const here = rt.name === 'history' ? 'h' : !gid ? null : rt.page === 'editions' ? 'e' : rt.page === 'record' ? 'l' : rt.page === 'edition' ? 'e' : 'p';
  const to = (k, g) => { const id = g || s.game; const r = GS_GAMES[id].route;
    if (k === 'e') edGo(gs, id); else if (k === 'l') gs.go(r, { page: 'record' }); else if (k === 'h') gs.go('history'); else gs.go(r); };
  const pickGame = (g) => { mdSet({ game: g }); to(here && here !== 'h' ? here : 'l', g); };
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  const goOpts = [['p', '1 Product page'], ['e', '2 All editions'], ...(out ? [] : [['l', '3 Library game page'], ['h', '4 History']])];
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {MD_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => mdSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => mdSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Game</span>{seg(ED_GAMES.map((k) => [k, GS_GAMES[k].name.replace('Daily ', '')]), gid && ED_GAMES.includes(gid) ? gid : s.game, pickGame)}</div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{seg(goOpts, here, (k) => to(k))}</div>
          <div className="pg-strip-row"><span className="pg-k">View</span>{seg([['out', 'signed out'], ['free', 'no Pass'], ['pass', 'Pass']], gs.view, view)}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => mdSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p><b>Signed out.</b> {o.out}</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsEditions: MdEditionsSwitch, GsHistory: MdHistorySwitch, GsGamePage: MdGamePage, LbRecent: MdRecentSwitch, edGo: mdEdGo, GsDemoBar: MdStrip });
