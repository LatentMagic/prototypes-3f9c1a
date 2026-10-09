// Playground: History, and how a library game page connects to it. Options 1 to 3, 2026-10-09.
// Brief: docs/specs/history/ (handoff-2026-10-09-history-playground.md). Loads after every app/ module, before main.jsx.
// Seed: one play log built from the library pages' own seeds (PZ, CB_ALL, DV_ALL, HG_DAYS), plus replays.
// Overrides GsHistory, LbRow, LbRecent and GsDemoBar on window. Nothing in app/ changes.
const PH_KEY = 'pg_history_v1';
let ph = { opt: '1', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(PH_KEY)) || {}; } catch (e) { return {}; } })() };
const phSubs = new Set();
const phSet = (p) => { ph = { ...ph, ...p }; try { localStorage.setItem(PH_KEY, JSON.stringify(ph)); } catch (e) {} phSubs.forEach((f) => f(ph)); };
const usePh = () => { const [s, setS] = React.useState(ph); React.useEffect(() => { phSubs.add(setS); return () => phSubs.delete(setS); }, []); return s; };

// ---- Dates ----
const PH_TODAY = new Date(2026, 9, 6);
const PH_ENDED = new Date(2026, 8, 18);
const PH_MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const phParse = (s) => { const [d, m, y] = s.split(' '); return new Date(+(y || 2026), PH_MON.indexOf(m), +d); };
const phAt = (d, h, m, plus = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + plus, h, m);
const phDay0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const phDayKey = (d) => d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
const phDayLabel = (d) => { const n = Math.round((phDay0(d) - PH_TODAY) / 864e5); return n === 0 ? 'Today' : n === -1 ? 'Yesterday' : d.toLocaleString('en-GB', { weekday: 'long' }) + ' ' + lbDate(d); };
const phTime = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
const phShort = (d) => lbShort(lbDate(d));
const phMonday = (d) => { const x = phDay0(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const phWeekLabel = (d) => { const w = Math.round((phMonday(PH_TODAY) - phMonday(d)) / (7 * 864e5)); return w === 0 ? 'This week' : w === 1 ? 'Last week' : 'Week of ' + lbDate(phMonday(d)); };

// ---- The play log. An edition holds its plays, first (the one that counts) first. ----
const PH_EDS = {}; const PH_PLAYS = [];
const phEd = (gid, ed, edTitle, edDate, plays) => {
  const e = { gid, ed, edTitle, edDate, plays: plays.map((p, n) => ({ ...p, gid, ed, edTitle, edDate, n, again: n > 0, pid: ed + '-' + n })) };
  PH_EDS[ed] = e; PH_PLAYS.push(...e.plays);
};
const phSess = (id) => (gs) => gs.go('session', { id });
const phClone = (sid, k, at, label, extra) => { const id = sid + '-r' + k; GS_SESSIONS[id] = { ...GS_SESSIONS[sid], result: label, loss: false, date: pzLong(at), ...(extra || {}) }; return id; };
// Replays seeded by hand: [days after the first play, hour, minute, result, kind, session extra]
const PH_HAND = {
  word0: [[0, 12, 40, 'Solved in 1 of 6', 'ok', { lines: [['Guess 1', 'TORCH', 'Solved']] }], [0, 21, 15, 'Solved in 2 of 6', 'ok', { lines: [['Guess 1', 'SLATE', 'T is in the word'], ['Guess 2', 'TORCH', 'Solved']] }]],
  escape0: [[0, 19, 30, 'Escaped in 5 moves']], escape2: [[2, 20, 0, 'Escaped in 6 moves']],
  groups1: [[1, 7, 50, 'All 4 groups, no mistakes']], mystery2: [[0, 22, 5, 'Case closed']],
  c0928: [[5, 21, 0, 'Solved'], [7, 9, 30, 'Unsolved', 'bad']], dv1: [[2, 19, 45, 'Your hero fell', 'bad']],
};
const PH_REPLAY = { word: (k) => 'Solved in ' + (2 + (k % 2)) + ' of 6', groups: () => 'All 4 groups, no mistakes', mystery: () => 'Case closed', escape: (k) => 'Escaped in ' + (5 + (k % 2)) + ' moves' };
Object.entries(PZ).forEach(([id, c]) => c.all.forEach((x) => {
  if (!x.played) return;
  const sid = x.i === 0 ? c.today : x.sid;
  let first;
  if (x.i === 0) { const s = GS_SESSIONS[c.today]; first = { at: phAt(PH_TODAY, 8 + c.salt, 5 + c.salt * 11), status: { kind: s.loss ? 'bad' : 'ok', label: s.result } }; }
  else first = { at: phAt(x.d, 7 + ((x.i * 5 + c.salt * 3) % 15), (x.i * 17 + c.salt * 7) % 60, c.weekly ? x.i % 4 : 0), status: { kind: x.ok ? 'ok' : 'bad', label: x.line } };
  first.open = phSess(sid);
  const reps = PH_HAND[x.id] || (x.i > 0 && (x.i * 7 + c.salt * 3) % 11 === 0 ? [[x.i % 2, 21, 10]] : []);
  const plays = [first].concat(reps.map(([plus, h, m, label, kind, extra], k) => {
    const at = phAt(first.at, h, m, plus); const lab = label || PH_REPLAY[id](x.i + k);
    return { at, status: { kind: kind || 'ok', label: lab }, open: phSess(phClone(sid, k, at, lab, extra)) };
  }));
  phEd(id, x.id, x.title, x.d, plays);
}));
CB_ALL.forEach((cb, k) => {
  if (!cb.played) return;
  const ed = phParse(cb.week);
  const first = { at: phAt(ed, 20, 10 + (k % 40), cb.live ? 0 : k % 3), status: cb.live ? { kind: 'live', label: 'In progress' } : cb.verdict === 'right' ? { kind: 'ok', label: 'Solved' } : { kind: 'bad', label: 'Unsolved' },
    open: cb.live ? (gs) => cbGo(gs) : (gs) => cbGo(gs, cb.id) };
  phEd('casebook', cb.id, cb.title, ed, [first].concat((PH_HAND[cb.id] || []).map(([plus, h, m, label, kind]) => ({ at: phAt(ed, h, m, plus), status: { kind: kind || 'ok', label }, open: (gs) => cbGo(gs, cb.id) }))));
});
DV_ALL.forEach((s, i) => {
  if (!s.played) return;
  const ed = phParse(s.date); const live = !s.end;
  const first = { at: phAt(ed, 18, 30, live ? 0 : i % 3), status: live ? { kind: 'live', label: 'In progress' } : DV_END[s.end], open: live ? (gs) => dvGo(gs) : phSess('delve') };
  phEd('delve', s.id, s.title, ed, [first].concat((PH_HAND[s.id] || []).map(([plus, h, m, label, kind]) => ({ at: phAt(ed, h, m, plus), status: { kind: kind || 'ok', label }, open: phSess('delve') }))));
});
// No editions: each day is its own entry, and never a replay.
HG_DAYS.forEach((x, i) => {
  const d = phParse(x.date);
  phEd('hunter', x.id, x.title, d, [{ at: phAt(d, 9 + (i % 4), 15), status: x.restarted ? { kind: 'none', label: 'Restarted' } : { kind: 'live', label: 'Day finished' }, open: phSess('hunter') }]);
});
const PH_ALL = PH_PLAYS.slice().sort((a, b) => b.at - a.at);
// Who sees what: what History does today (free: the free games; Pass ended: plus Pass-game plays from before it ended).
const phVisible = (gs) => {
  if (gs.view === 'pass') return PH_ALL;
  const today = Object.keys(GS_TODAY_PLAYED[gs.view] || {}); const lapsed = gsLapsed(gs);
  return PH_ALL.filter((p) => { const g = GS_GAMES[p.gid]; if (p.at >= PH_TODAY) return g.free && today.includes(p.gid); return g.free || (lapsed && p.at < PH_ENDED); });
};
const phLib = (gs, id, sid) => gs.go(GS_GAMES[id].route, sid ? { page: 'record', sid } : { page: 'record' });
const PH_ALL_LABEL = { word: 'All words', groups: 'All groups', mystery: 'All cases', escape: 'All rooms', casebook: 'All cases', delve: 'All scenes', hunter: 'All days' };

// ---- Parts ----
const PhCov = ({ gid }) => <span className="ph-cov" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART[GS_GAMES[gid].art] }} />;
const PhMeta = ({ items }) => <span className="ph-m">{items.filter(Boolean).map((t, i) => (t === 'Replay' ? <b key={i} className="ph-again">Replay</b> : <span key={i}>{t}</span>))}</span>;
// One play. when: 'time' (under a day heading) or 'date'.
const PhPlayRow = ({ p, showGame, when }) => {
  const gs = useGs();
  const at = when === 'time' ? phTime(p.at) : phShort(p.at) + ', ' + phTime(p.at);
  return (
    <button type="button" className="ph-row" onClick={() => p.open(gs)}>
      <PhCov gid={p.gid} />
      <span className="ph-tx"><span className="ph-t">{showGame ? GS_GAMES[p.gid].name : p.edTitle}</span><PhMeta items={[showGame && p.edTitle, at, p.again && 'Replay']} /></span>
      <span className="ph-res"><LbStatus s={p.status} /></span>
      <LbChev />
    </button>
  );
};
// A replay tucked under its edition (option 2).
const PhSub = ({ p, inert }) => {
  const gs = useGs();
  const cells = <><span className="ph-rail" aria-hidden="true" /><span className="ph-tx"><PhMeta items={['Replay', phShort(p.at) + ', ' + phTime(p.at)]} /></span><span className="ph-res"><LbStatus s={p.status} /></span></>;
  return inert ? <div className="ph-row is-sub">{cells}<span className="lb-chev-space" /></div>
    : <button type="button" className="ph-row is-sub" onClick={() => p.open(gs)}>{cells}<LbChev /></button>;
};
const PhSubs = ({ plays, lib, inert }) => (plays.length ? <ul className={'ph-subs' + (lib ? ' is-lib' : '')}>{plays.map((p) => <li key={p.pid}><PhSub p={p} inert={inert} /></li>)}</ul> : null);
const PhHead = () => <div className="gs-stack-sm"><h1 className="gs-h1">History</h1><p className="gs-muted">A replay doesn’t change your streak or your record.</p></div>;
const PhEmpty = () => {
  const gs = useGs();
  return <div className="gs-stack-md" style={{ justifyItems: 'start' }}><p>You haven’t played anything yet. Pick one and see what it does when you talk back.</p><DS.Button onClick={() => gs.go('games')}>Choose a game</DS.Button></div>;
};
const PhPages = ({ pg, pages, go }) => (pages > 1 ? (
  <nav className="lb-pages" aria-label="Pages">
    {pg > 0 ? <button type="button" className="gs-iconbtn" aria-label="Previous page" onClick={() => go(pg - 1)}><DS.Icon name="back" /></button> : <span className="gs-iconbtn-space" />}
    <div className="lb-pagenums">{Array.from({ length: pages }, (_, x) => <button key={x} type="button" aria-current={x === pg ? 'page' : undefined} onClick={() => go(x)}>{x + 1}</button>)}</div>
    {pg < pages - 1 ? <button type="button" className="gs-iconbtn" aria-label="Next page" onClick={() => go(pg + 1)}><DS.Icon name="back" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
  </nav>
) : null);
const usePhList = (initial) => {
  const gs = useGs(); const all = phVisible(gs);
  const [g, setG0] = React.useState(initial && all.some((p) => p.gid === initial) ? initial : 'all'); const [pg, setPg] = React.useState(0);
  const games = GS_GAME_ORDER.filter((k) => all.some((p) => p.gid === k));
  const setG = (v) => { setG0(v); setPg(0); };
  const go = (x) => { setPg(x); gsScrollTop(); };
  const [sort, setSort0] = React.useState('new'); const setSort = (v) => { setSort0(v); setPg(0); };
  const shown = g === 'all' ? all : all.filter((p) => p.gid === g);
  return { all, g, setG, pg, go, games, sort, setSort, list: sort === 'old' ? [...shown].reverse() : shown };
};
const PhShow = ({ f }) => <LbChoice label="Show" value={f.g} opts={[['all', 'All games'], ...f.games.map((k) => [k, GS_GAMES[k].name])]} onPick={f.setG} />;
const PhPage = ({ children }) => <main className="gs-wrap gs-main">{children}</main>;

// 1 · One list, by day. Every play is a row under the day you played it; a library page's full list is this, filtered.
const PhDiary = () => {
  const gs = useGs(); const r = gs.route; const f = usePhList(r.game);
  const [load, setLoad] = React.useState(r.load || null);
  const first = React.useRef(true);
  React.useEffect(() => { setLoad(r.load || null); }, [r]);
  React.useEffect(() => { if (first.current) { first.current = false; return; } setLoad('loading'); }, [f.g, f.sort, f.pg]);
  React.useEffect(() => { if (load !== 'loading') return undefined; const t = setTimeout(() => setLoad(null), 1200); return () => clearTimeout(t); }, [load]);
  const size = 24; const pages = Math.max(1, Math.ceil(f.list.length / size)); const pg = Math.min(f.pg, pages - 1);
  const groups = [];
  f.list.slice(pg * size, pg * size + size).forEach((p) => { const k = phDayKey(p.at); const last = groups[groups.length - 1]; if (last && last[0] === k) last[2].push(p); else groups.push([k, phDayLabel(p.at), [p]]); });
  return (
    <PhPage>
      {r.from && <LbBack label={GS_GAMES[r.from].name} onClick={() => phLib(gs, r.from)} />}
      <PhHead />
      {!f.all.length ? <PhEmpty /> : (
        <div className="lb-alllay">
          <aside className="lb-tools"><LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} /><PhShow f={f} /></aside>
          <div className="lb-box lb-results" aria-busy={load === 'loading' || load === 'hold'}>
            {load === 'loading' || load === 'hold' ? <div className="gs-inplace"><GsSpin /></div>
              : load === 'failed' ? <GsLoadFailed onRetry={() => setLoad('loading')} />
              : <>
                {groups.map(([k, label, ps]) => (
                  <React.Fragment key={k + pg}>
                    <h2 className="ph-day">{label}</h2>
                    <ul className="ph-list">{ps.map((p) => <li key={p.pid}><PhPlayRow p={p} showGame={f.g === 'all'} when="time" /></li>)}</ul>
                  </React.Fragment>
                ))}
                <PhPages pg={pg} pages={pages} go={f.go} />
              </>}
          </div>
        </div>
      )}
    </PhPage>
  );
};

// 2 · Editions, replays tucked under. Grouped by the week the edition came out; the same row on the library game page.
const PhEdRow = ({ e, plays, showGame }) => {
  const gs = useGs(); const p = plays[0];
  return <>
    <button type="button" className="ph-row" onClick={() => p.open(gs)}>
      <PhCov gid={e.gid} />
      <span className="ph-tx"><span className="ph-t">{showGame ? GS_GAMES[e.gid].name : e.edTitle}</span><PhMeta items={[showGame && e.edTitle, phShort(p.at)]} /></span>
      <span className="ph-res"><LbStatus s={p.status} /></span>
      <LbChev />
    </button>
    <PhSubs plays={plays.slice(1)} />
  </>;
};
const PhLedger = () => {
  const gs = useGs(); const f = usePhList(gs.route.game);
  const eds = []; const seen = {};
  f.list.forEach((p) => { if (!seen[p.ed]) { seen[p.ed] = { e: PH_EDS[p.ed], plays: [] }; eds.push(seen[p.ed]); } seen[p.ed].plays.unshift(p); });
  eds.sort((a, b) => b.e.edDate - a.e.edDate || b.plays[0].at - a.plays[0].at);
  const size = 20; const pages = Math.max(1, Math.ceil(eds.length / size)); const pg = Math.min(f.pg, pages - 1);
  const groups = [];
  eds.slice(pg * size, pg * size + size).forEach((x) => { const label = phWeekLabel(x.e.edDate); const last = groups[groups.length - 1]; if (last && last[0] === label) last[1].push(x); else groups.push([label, [x]]); });
  return (
    <PhPage>
      <PhHead />
      {!f.all.length ? <PhEmpty /> : (
        <div className="lb-alllay">
          <aside className="lb-tools">
            <PhShow f={f} />
            {f.g !== 'all' && <div><DS.TextLink onClick={() => phLib(gs, f.g)}>{'Go to ' + GS_GAMES[f.g].name}</DS.TextLink></div>}
          </aside>
          <div className="lb-box lb-results">
            {groups.map(([label, xs]) => (
              <React.Fragment key={label + pg}>
                <h2 className="ph-day">{label}</h2>
                <ul className="ph-list">{xs.map((x) => <li key={x.e.ed}><PhEdRow e={x.e} plays={x.plays} showGame={f.g === 'all'} /></li>)}</ul>
              </React.Fragment>
            ))}
            <PhPages pg={pg} pages={pages} go={f.go} />
          </div>
        </div>
      )}
    </PhPage>
  );
};

// 3 · By game. One card per game, latest three plays; its heading opens the library game page, which holds the rest.
const PhByGame = () => {
  const gs = useGs(); const all = phVisible(gs);
  const games = []; all.forEach((p) => { if (!games.includes(p.gid)) games.push(p.gid); });
  return (
    <PhPage>
      <PhHead />
      {!all.length ? <PhEmpty /> : (
        <div className="ph-games">
          {games.map((gid) => {
            const ps = all.filter((p) => p.gid === gid); const last = phDayLabel(ps[0].at);
            return (
              <section key={gid} className="lb-box">
                <h2 className="ph-gh">
                  <button type="button" className="ph-ghead" onClick={() => phLib(gs, gid)}>
                    <PhCov gid={gid} />
                    <span className="ph-tx"><span className="ph-gname">{GS_GAMES[gid].name}</span><span className="ph-m"><span>{'Last played ' + (last === 'Today' || last === 'Yesterday' ? last.toLowerCase() : last)}</span></span></span>
                    <LbChev />
                  </button>
                </h2>
                <ul className="ph-list">{ps.slice(0, 3).map((p) => <li key={p.pid}><PhPlayRow p={p} when="date" /></li>)}</ul>
              </section>
            );
          })}
        </div>
      )}
    </PhPage>
  );
};
const PH_PAGES = { '1': PhDiary, '2': PhLedger, '3': PhByGame };
const PhHistory = () => { const gs = useGs(); const s = usePh(); const B = PH_PAGES[s.opt] || PhDiary; return <B key={s.opt + gs.view + (gs.sub.freeUsed ? 'u' : '')} />; };

// ---- The library game page: an edition played more than once, and the way to History ----
const PH_LbRow0 = window.LbRow;
const PH_LbRecent0 = window.LbRecent;
const PhPlaysPanel = ({ e, open, onClose }) => {
  const gs = useGs();
  return (
    <DS.Popup open={open} onClose={onClose} kind="panel" title={e.edTitle}>
      <ul className="ph-list ph-panel">
        {e.plays.map((p) => (
          <li key={p.pid}>
            <button type="button" className="ph-row is-panel" onClick={() => { onClose(); p.open(gs); }}>
              <span className="ph-tx"><span className="ph-t">{p.again ? 'Replay' : 'First play'}</span><PhMeta items={[phShort(p.at) + ', ' + phTime(p.at), !p.again && 'Counts for your streak']} /></span>
              <span className="ph-res"><LbStatus s={p.status} /></span>
              <LbChev />
            </button>
          </li>
        ))}
      </ul>
    </DS.Popup>
  );
};
const PhLbRow = ({ r }) => {
  const s = usePh(); const [open, setOpen] = React.useState(false);
  const e = PH_EDS[r.key];
  if (!e || e.plays.length < 2) return <PH_LbRow0 r={r} />;
  if (s.opt === '2') return <><PH_LbRow0 r={r} /><PhSubs plays={e.plays.slice(1)} lib inert={!r.onOpen} /></>;
  const more = { ...r, title: <>{r.title}<span className="ph-n">{' · ' + e.plays.length + ' plays'}</span></> };
  if (s.opt === '3' && r.onOpen) return <><PH_LbRow0 r={{ ...more, onOpen: () => setOpen(true) }} /><PhPlaysPanel e={e} open={open} onClose={() => setOpen(false)} /></>;
  return <PH_LbRow0 r={more} />;
};
const PhLbRecent = (props) => {
  const s = usePh(); const gs = useGs(); const id = gsGameOfRoute(gs.route.name);
  return <PH_LbRecent0 {...props} onAll={s.opt === '1' && id ? () => gs.go('history', { game: id, from: id }) : props.onAll} />;
};

// ---- The strip: playground controls, not product ----
const PH_OPTS = [
  { id: '1', name: 'One list, by day',
    idea: 'History lists every play, newest first, under the day you played it. A replay is its own row, marked Replay. On a library game page, an edition you played more than once says how many times, and its All link opens History showing only that game.',
    rule: 'A library game page’s full list is History, filtered to that game. The game’s own all page goes.',
    cost: 'Tapping through changes the list from editions to plays, and editions you missed no longer appear in it. A day of replays pushes everything else down.' },
  { id: '2', name: 'Editions, replays tucked under',
    idea: 'History lists what you played by edition, grouped by the week each came out. Replays sit under their edition as smaller rows, and each opens its own record. The library game page uses the same rows, so an edition looks the same in both places.',
    rule: 'One row for an edition, with its replays under it, wherever it appears. Picking a game in History links to its library game page.',
    cost: 'A replay of an old edition files under that old week, so today’s replay can be pages back. Two full lists remain: History and each game’s all page.' },
  { id: '3', name: 'By game',
    idea: 'History has one card per game, most recently played first, each with its latest three plays. The card’s heading opens the library game page, which holds the rest. There, an edition played more than once says how many times and opens a panel of its plays.',
    rule: 'History shows each game’s latest plays; the full list of a game’s plays lives on its library game page.',
    cost: 'You can’t see what you played across games in time order. Three plays fill fast, so a few replays of today’s puzzle push older plays off the card.' },
];
const PH_GO = [['history', 'History'], ['groups', 'Groups'], ['escape', 'Escape'], ['casebook', 'Casebook'], ['delve', 'Delve'], ['hunter', '36,000']];
let phBooted = false;
const PhStrip = () => {
  const gs = useGs(); const s = usePh(); const o = PH_OPTS.find((x) => x.id === s.opt) || PH_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!phBooted) { phBooted = true; gs.setView('pass'); gs.setConnected(true); setTimeout(() => window.gsApi.go('history'), 0); } }, []);
  const view = (v) => { gs.setDemoView(v); gs.setConnected(v !== 'out'); };
  const here = gs.route.name === 'history' ? 'history' : gs.route.page === 'record' ? gsGameOfRoute(gs.route.name) : null;
  const to = (k) => (k === 'history' ? gs.go('history') : phLib(gs, k));
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">History</span>
            {PH_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => phSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => phSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{gs.view === 'out' ? <span className="pg-name">Sign in to reach History</span> : seg(PH_GO, here, to)}</div>
          {gs.view !== 'out' && s.opt === '1' && <div className="pg-strip-row"><span className="pg-k">Load</span>{seg([['', 'normal'], ['hold', 'held'], ['failed', 'failed']], here === 'history' ? (gs.route.load || '') : null, (v) => gs.go('history', v ? { load: v } : {}))}</div>}
          <div className="pg-strip-row"><span className="pg-k">View</span>{seg([['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']], gs.view, view)}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => phSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>The rule.</b> {o.rule}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">Seeded for a daily player: about forty days of the four puzzles, thirty weeks of Escape, Casebook and Delve, and eighteen days of 36,000 Summers Ago, with replays. Groups, Escape, Casebook and Delve have replays on their library game pages. A replay’s record repeats its first play’s lines.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsHistory: PhHistory, LbRow: PhLbRow, LbRecent: PhLbRecent, GsDemoBar: PhStrip });
