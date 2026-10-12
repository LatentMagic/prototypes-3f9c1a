// Playground: History's filters, redesigned. Options 1 to 3 beside today (0), 2026-10-12.
// Brief: the playground prompt of 2026-10-12; handoff in docs/specs/history-filters-redesign/. Loads after app/gs-history.jsx, before main.jsx.
// Replaces GsHistory and GsDemoBar. Option 0 mounts the app's GsHistory as it is. Options 1 to 3 build History from the app's own
// helpers (phVisible, phEds, phHay, phMatch, edLabel, edName) and parts (DS.ListRow, LbChoice's look, LbGamePick, RpPages, GsPart).
// Seed, every option: Daily Word, Daily Groups and Daily Mystery can't be replayed, so their replays leave the play log.
const PGH_KEY = 'pg_history_filters_v1';
let pgh = { opt: '1', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(PGH_KEY)) || {}; } catch (e) { return {}; } })() };
const pghSubs = new Set();
const pghSet = (p) => { pgh = { ...pgh, ...p }; try { localStorage.setItem(PGH_KEY, JSON.stringify(pgh)); } catch (e) {} pghSubs.forEach((f) => f(pgh)); };
const usePgh = () => { const [s, setS] = React.useState(pgh); React.useEffect(() => { pghSubs.add(setS); return () => pghSubs.delete(setS); }, []); return s; };

(() => {
  const daily = (p) => p.again && GS_GAMES[p.gid].daily;
  [PH_ALL, PH_PLAYS].forEach((a) => { for (let i = a.length - 1; i >= 0; i -= 1) if (daily(a[i])) a.splice(i, 1); });
  Object.values(PH_EDS).forEach((e) => { if (GS_GAMES[e.gid].daily) e.plays = e.plays.filter((p) => !p.again); });
})();

const PGH_OPTS = [
  { id: '0', name: 'Today', stance: 'The app as it stands. Search, and one Filters button whose panel holds List, Genre, Schedule, Game, Plays and Order. List switches History to every edition, with replays tucked under their edition. A library game page’s “All cases” lands on what you played of the game.', cost: 'Finding a missed edition depends on a choice inside the Filters panel that nothing on the page mentions.' },
  { id: '1', name: 'Two lists', stance: 'Played and All editions are two tabs under the heading, outside the filters, so the page names both lists. Filters only narrow, and narrow the same way on either tab. “All cases” opens the All cases tab for that game.', cost: 'One more row of controls above the list on a phone. The Library has one list, so it would take the Filters panel but not the tabs.' },
  { id: '2', name: 'One list, three kinds of row', stance: 'There is one list and no switch. Three choices on the page say which rows it holds: First plays, Replays and Not played. History opens on the first two. Adding Not played puts every missed edition in, under the day it came out. “All cases” opens the game with all three on.', cost: 'Seeing each edition exactly once takes two taps (Not played on, Replays off). A first play sits under the day you played it, so a weekly edition can sit days after it came out.' },
  { id: '3', name: 'Every control on the page', stance: 'No Filters button. One row of controls, each showing what it is set to: the list, the games, replays and order. Game, genre and schedule become one Games control, because each one answers which games. “All cases” opens All cases for that game.', cost: 'The controls take two lines on a phone. You can narrow to a genre or to a schedule, but not to both at once.' },
];

const PghOrig = window.GsHistory || GsHistory; const PghDemo0 = window.GsDemoBar || GsDemoBar;
const PGH_REP = [['all', 'With replays'], ['first', 'No replays'], ['again', 'Only replays']];
const PGH_ORD = [['new', 'Newest first'], ['old', 'Oldest first']];
const PGH_KINDS = [['first', 'First plays'], ['again', 'Replays'], ['none', 'Not played']];
const PGH_KINDS0 = ['first', 'again'];
// A row's title, the same in every list: the edition by edLabel, or edName when the list holds one game.
const pghTitle = (gid, ed, fallback, one) => {
  const m = phMeta()[ed]; if (m && ED_GAMES.includes(gid)) return one ? edName(m) : edLabel(m);
  return one || (fallback || '').includes(GS_GAMES[gid].name) ? fallback : GS_GAMES[gid].name + ' · ' + fallback;
};

// Rows: { key, gid, title, status, day, when?, note?, end?, kind: first | again | none, open, hay }.
// Played: every play under the day it was played. Every edition: each edition once under the day it came out, and each replay its own row after it.
// Option 2: one list of first plays, replays and missed editions, each under its own day.
const pghRows = ({ gs, opt, all, g, ok, every, rep, kinds, s, sort }) => {
  const one = g !== 'all';
  const play = (p) => { const title = pghTitle(p.gid, p.ed, p.edTitle, one);
    return { key: p.pid, gid: p.gid, title, status: p.status, day: p.at, when: phTime(p.at), note: p.again ? 'Replay' : undefined, kind: p.again ? 'again' : 'first', open: () => p.open(gs), hay: phHay(p.gid, p.ed, p.edTitle, p.at) + ' ' + title }; };
  const eds = () => phEds(gs, g, all).filter((e) => ok(e.gid));
  const edRow = (e) => { const title = pghTitle(e.gid, e.key, e.title, one);
    return { key: e.gid + e.key, gid: e.gid, title, status: e.status, day: e.at, end: e.now ? <DS.Tag kind="daily">Latest</DS.Tag> : undefined, kind: e.plays.length ? 'first' : 'none',
      open: () => (e.plays.length ? e.plays[0].open(gs) : gs.go('session', { gid: e.gid, ed: e.key })), hay: phHay(e.gid, e.key, e.title, e.at) + ' ' + title }; };
  const hit = (x) => !s || phMatch(x.hay, s);
  const repOk = (x) => rep === 'all' || (rep === 'again') === (x.kind === 'again');
  if (opt === '2') {
    let rows = all.filter((p) => ok(p.gid)).map(play);
    if (kinds.includes('none')) rows = rows.concat(eds().filter((e) => !e.plays.length).map(edRow));
    rows = rows.filter((x) => kinds.includes(x.kind) && hit(x)).sort((a, b) => b.day - a.day);
    return sort === 'old' ? rows.reverse() : rows;
  }
  if (!every) { const rows = all.filter((p) => ok(p.gid)).map(play).filter((x) => repOk(x) && hit(x)); return sort === 'old' ? rows.reverse() : rows; }
  const units = eds().map((e) => { const h = edRow(e);
    const reps = e.plays.filter((p) => p.again).map((p) => ({ ...h, key: p.pid, status: p.status, end: undefined, note: 'Replay', kind: 'again', open: () => p.open(gs) }));
    return [h, ...reps].filter((x) => repOk(x) && hit(x)); }).filter((u) => u.length);
  units.sort((a, b) => b[0].day - a[0].day || GS_GAME_ORDER.indexOf(a[0].gid) - GS_GAME_ORDER.indexOf(b[0].gid));
  if (sort === 'old') units.reverse();
  return units.flat();
};
const pghRow = (x, one) => <DS.ListRow key={x.key} lead={one ? undefined : <PhLead gid={x.gid} />} title={x.title} result={x.status.label} tone={rpTone(x.status)} when={x.when} note={x.note} end={x.end} onClick={x.open} />;

// ---- Search and the Filters panel (options 1 and 2): a copy of LbFilters (app/gs-library.jsx). One change: when anything is set,
// the line under the bar ends in Clear all, which also clears search and, in option 2, puts the kinds of row back. ----
const PghTools = ({ search, choices, anySet, onClear, children }) => {
  const [open, setOpen] = React.useState(false); const [deep, setDeep] = React.useState(false);
  const on = choices.filter(lbfOn); const g = choices.find((c) => c.label === 'Game');
  const close = () => { setOpen(false); setDeep(false); };
  const clear = () => { on.forEach((c) => c.onPick(c.opts[0][0])); setDeep(false); };
  const done = <DS.Button onClick={close}>Done</DS.Button>;
  return (
    <div className="lbf-top">
      <div className="lbf-bar"><div className="lbf-search">{search}</div><DS.Button variant="secondary" onClick={() => setOpen(true)}>{on.length ? 'Filters · ' + on.length : 'Filters'}</DS.Button></div>
      {children}
      {anySet && <div className="pgh-sum">{on.length > 0 && <p className="lbf-sum">{on.map(lbfLabel).join(' · ')}</p>}<DS.TextLink onClick={onClear}>Clear all</DS.TextLink></div>}
      <DS.Popup kind="panel" open={open} onClose={close} title="Filters" actions={on.length ? <DS.ButtonPair><DS.Button variant="secondary" onClick={clear}>Clear</DS.Button>{done}</DS.ButtonPair> : done}>
        {deep && g ? <LbGamePick g={g} list={lbfGames(g, choices)} onBack={() => setDeep(false)} /> : (
          <div className="lbf-groups">{choices.map((c) => (c === g ? (
            <div key={c.label} className="lbf-grow">
              <span className="gs-field-label">Game</span>
              <button type="button" className="lbf-prow is-open" onClick={() => setDeep(true)}><span>{lbfLabel(c)}</span><LbChev /></button>
            </div>
          ) : <LbChoice key={c.label} {...c} />))}</div>
        )}
      </DS.Popup>
    </div>
  );
};

// ---- Option 3: a control per question. The menu button is pgf-mbtn from docs/specs/filters-on-a-phone/ (option 2). ----
const PghMenu = ({ label, value, opts, onPick, align, mark }) => {
  const cur = opts.find(([v]) => v === value) || opts[0];
  return <DS.Menu label={label} align={align}
    trigger={<button type="button" className={'pgh-mbtn' + (mark !== false && value !== opts[0][0] ? ' is-on' : '')} aria-label={label + ': ' + cur[1]}><span>{cur[1]}</span><DS.Icon name="down" size={16} /></button>}
    items={opts.map(([v, l]) => ({ label: l, icon: v === value ? 'check' : undefined, onSelect: () => onPick(v) }))} />;
};
const pghScopeLabel = (v) => (v === 'all' ? 'All games' : v.startsWith('r:') ? (v === 'r:daily' ? 'Daily games' : 'Weekly games') : v.startsWith('c:') ? gsKind(v.slice(2)) + ' games' : GS_GAMES[v.slice(2)].name);
// Several picks: the first one's name, then how many more.
const pghScLabel = (vs) => (!vs.length ? 'All games' : pghScopeLabel(vs[0]) + (vs.length > 1 ? ' +' + (vs.length - 1) : ''));
// A game is in when it matches any pick.
const pghScHit = (vs, gid) => !vs.length || vs.some((v) => (v.startsWith('g:') ? gid === v.slice(2) : v.startsWith('r:') ? gsRhythm(gid) === v.slice(2) : GS_GAMES[gid].category === v.slice(2)));
// Which games, in one panel: all, or any mix of schedules, genres and games. "All games" clears; the rest are checkboxes.
const PghScope = ({ games, value, onPick }) => {
  const [q, setQ] = React.useState(''); const s = gsNorm(q);
  const secs = [['', [['all', 'All games']]], ['Schedule', GS_RHYTHMS.map(([v]) => ['r:' + v, pghScopeLabel('r:' + v)])], ['Genre', GS_KINDS.map((c) => ['c:' + c, pghScopeLabel('c:' + c)])], ['Game', games.map((k) => ['g:' + k, GS_GAMES[k].name])]]
    .map(([h, rows]) => [h, rows.filter(([v, l]) => v === 'all' || !s || gsNorm(l).includes(s))]).filter(([, rows]) => rows.length);
  return (
    <div className="pgh-scope">
      <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
      {secs.map(([h, rows]) => (
        <div key={h || 'all'} className="pgh-sec">
          {h && <span className="gs-field-label">{h}</span>}
          <ul className="lbf-plist" role="list">{rows.map(([v, l]) => (
            <li key={v}>{v === 'all'
              ? <button type="button" className="lbf-prow" aria-pressed={!value.length} onClick={() => onPick([])}><span>{l}</span>{!value.length ? <DS.Icon name="check" size={16} /> : <span className="lbf-pgap" />}</button>
              : <DS.Checkbox className="pgh-crow" label={l} checked={value.includes(v)} onChange={() => onPick(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])} />}</li>
          ))}</ul>
        </div>
      ))}
      {secs.length === 1 && s && <p className="lbf-pnone">No game called that.</p>}
    </div>
  );
};
const PghBar3 = ({ search, hasEds, mode, setMode, listLabel, scope, setScope, games, rep, setRep, sort, setSort, anySet, onClear }) => {
  const box = React.useRef(null); const [ends, setEnds] = React.useState(''); const [pick, setPick] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const m = () => { const w = el.getBoundingClientRect(); const e = Array.from(el.children).map((c) => (c.getBoundingClientRect().left - w.left + 228 > w.width ? '1' : '0')).join(''); setEnds((p) => (p === e ? p : e)); };
    m(); const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect();
  }, [mode, scope, rep, sort, hasEds, anySet]);
  const al = (i) => (ends[i] === '1' ? 'end' : 'start'); const o = hasEds ? 1 : 0;
  return (
    <div className="lbf-top">
      <div className="pgh-bar3">
        <div className="lbf-search">{search}</div>
        <div ref={box} className="pgh-menus" role="group" aria-label="What the list shows">
          {hasEds && <PghMenu label="List" value={mode} opts={[['played', 'Played'], ['all', listLabel]]} onPick={setMode} align={al(0)} mark={false} />}
          <button type="button" className={'pgh-mbtn' + (scope.length ? ' is-on' : '')} aria-label={'Games: ' + pghScLabel(scope)} aria-haspopup="dialog" onClick={() => setPick(true)}><span>{pghScLabel(scope)}</span><DS.Icon name="down" size={16} /></button>
          <PghMenu label="Replays" value={rep} opts={PGH_REP} onPick={setRep} align={al(o + 1)} />
          <PghMenu label="Order" value={sort} opts={PGH_ORD} onPick={setSort} align={al(o + 2)} />
          {anySet && <DS.TextLink onClick={onClear}>Clear all</DS.TextLink>}
        </div>
      </div>
      <DS.Popup kind="panel" open={pick} onClose={() => setPick(false)} title="Games"
        actions={scope.length ? <DS.ButtonPair><DS.Button variant="secondary" onClick={() => setScope([])}>Clear</DS.Button><DS.Button onClick={() => setPick(false)}>Done</DS.Button></DS.ButtonPair> : <DS.Button onClick={() => setPick(false)}>Done</DS.Button>}>
        <PghScope games={games} value={scope} onPick={setScope} />
      </DS.Popup>
    </div>
  );
};

// ---- History, options 1 to 3. Route params as the app's: game, from (a library game page's "All…" link), show, q, keep. ----
const PghNew = ({ opt }) => {
  const gs = useGs(); const r = gs.route; const k0 = r.keep || {};
  const arrive = !r.keep && !!r.from;
  const all = phVisible(gs);
  const known = (k) => all.some((p) => p.gid === k) || ED_GAMES.includes(k);
  const st = (v) => React.useState(v);
  const [g, setG0] = st(k0.g || (r.game && known(r.game) ? r.game : 'all'));
  const [cat, setCat0] = st(k0.cat || r.kind || 'all'); const [rhy, setRhy0] = st(k0.rhy || r.rhythm || 'all');
  const [rep, setRep0] = st(k0.rep || 'all'); const [sort, setSort0] = st(k0.sort || 'new'); const [q, setQ0] = st(k0.q != null ? k0.q : r.q || '');
  const [mode, setMode0] = st(k0.mode || (arrive || r.show === 'all' ? 'all' : 'played'));
  const [kinds, setKinds0] = st(k0.kinds || (arrive || r.show === 'all' ? ['first', 'again', 'none'] : PGH_KINDS0));
  const [sc, setSc0] = st(k0.sc || (r.game && known(r.game) ? ['g:' + r.game] : r.rhythm ? ['r:' + r.rhythm] : r.kind ? ['c:' + r.kind] : []));
  const [pg, setPg] = st(k0.pg || 0);
  React.useEffect(() => { gs.keep({ keep: { g, cat, rhy, rep, sort, q, mode, kinds, pg, sc } }); }, [g, cat, rhy, rep, sort, q, mode, kinds, pg, sc]);
  const wait = useGsPart([g, cat, rhy, rep, sort, mode, kinds.join(), pg, q, sc.join()]);
  const re = (fn) => (v) => { fn(v); setPg(0); };
  const setG = re(setG0); const setCat = re(setCat0); const setRhy = re(setRhy0); const setRep = re(setRep0); const setSort = re(setSort0); const setQ = re(setQ0); const setMode = re(setMode0);
  const toggle = re((v) => setKinds0((k) => (k.includes(v) ? k.filter((x) => x !== v) : PGH_KINDS.map(([x]) => x).filter((x) => x === v || k.includes(x)))));
  const go = (x) => { setPg(x); gsScrollTop(); };
  const one = g !== 'all'; const hasEds = !one || ED_GAMES.includes(g); const every = hasEds && mode === 'all';
  const ok = (gid) => opt === '3' ? pghScHit(sc, gid) : (g === 'all' || gid === g) && (cat === 'all' || GS_GAMES[gid].category === cat) && (rhy === 'all' || gsRhythm(gid) === rhy);
  const s = phNorm(q);
  const anySet = one || cat !== 'all' || rhy !== 'all' || rep !== 'all' || sort !== 'new' || !!q || (opt === '2' && kinds.join() !== PGH_KINDS0.join()) || (opt === '3' && sc.length > 0);
  const clearAll = () => { setG0('all'); setCat0('all'); setRhy0('all'); setRep0('all'); setSort0('new'); setQ0(''); setKinds0(PGH_KINDS0); setSc0([]); setPg(0); };
  const withEds = opt === '2' ? kinds.includes('none') : every;
  const games = GS_GAME_ORDER.filter((k) => k === g || all.some((p) => p.gid === k) || (withEds && ED_GAMES.includes(k)));
  const listLabel = one && hasEds ? 'All ' + GS_GAMES[g].ed[1] : 'All editions';
  const rows = pghRows({ gs, opt, all, g, ok, every, rep, kinds, s, sort });
  const size = 24; const pages = Math.max(1, Math.ceil(rows.length / size)); const p = Math.min(pg, pages - 1);
  const groups = [];
  rows.slice(p * size, p * size + size).forEach((x) => { const k = phDayKey(x.day); const last = groups[groups.length - 1]; if (last && last[0] === k) last[2].push(x); else groups.push([k, phDayLabel(x.day), [x]]); });
  const search = <DS.SearchField label="Search" placeholder="A number, name or date" value={q} onChange={(e) => setQ(e.target.value)} />;
  const C = {
    genre: { label: 'Genre', value: cat, opts: [['all', 'All games'], ...GS_KINDS.map((c) => [c, gsKind(c)])], onPick: setCat },
    sched: { label: 'Schedule', value: rhy, opts: [['all', 'All games'], ...GS_RHYTHMS], onPick: setRhy },
    game: { label: 'Game', value: g, opts: [['all', 'All games'], ...games.map((k) => [k, GS_GAMES[k].name])], onPick: setG },
    rep: { label: 'Replays', value: rep, opts: PGH_REP, onPick: setRep },
    ord: { label: 'Order', value: sort, opts: PGH_ORD, onPick: setSort },
  };
  const scope = sc;
  // One game picked on its own still counts as one game: short titles, and its own word for the list.
  const setScope = (v) => { setSc0(v); setG0(v.length === 1 && v[0].startsWith('g:') ? v[0].slice(2) : 'all'); setRhy0('all'); setCat0('all'); setPg(0); };
  let tools;
  if (opt === '1') tools = <PghTools search={search} choices={[C.genre, C.sched, C.game, C.rep, C.ord]} anySet={anySet} onClear={clearAll} />;
  else if (opt === '2') tools = (
    <PghTools search={search} choices={[C.genre, C.sched, C.game, C.ord]} anySet={anySet} onClear={clearAll}>
      <div className="lb-choicegrp pgh-kinds" role="group" aria-label="Show">
        <span className="gs-field-label">Show</span>
        <div className="lb-choice">{PGH_KINDS.map(([v, l]) => <button key={v} type="button" aria-pressed={kinds.includes(v)} onClick={() => toggle(v)}>{l}</button>)}</div>
      </div>
    </PghTools>
  );
  else tools = <PghBar3 search={search} hasEds={hasEds} mode={mode} setMode={setMode} listLabel={listLabel} scope={scope} setScope={setScope} games={games} rep={rep} setRep={setRep} sort={sort} setSort={setSort} anySet={anySet} onClear={clearAll} />;
  return (<>
    {window.GsPushAsk && <window.GsPushAsk />}
    <main className="gs-wrap gs-main">
      {r.from && <LbBack label={GS_GAMES[r.from].name} onClick={() => phLib(gs, r.from)} />}
      <PhHead />
      {!all.length ? <PhEmpty /> : (<>
        {opt === '1' && hasEds && (
          <div className="pgh-tabs" role="tablist" aria-label="Lists">
            {[['played', 'Played'], ['all', listLabel]].map(([v, l]) => <button key={v} type="button" role="tab" aria-selected={mode === v} className="pgh-tab" onClick={() => setMode(v)}>{l}</button>)}
          </div>
        )}
        <div className="lb-alllay">
          {tools}
          <div className="lb-box lb-results" style={{ maxWidth: 960 }}>
            {wait ? <GsPart label="Loading" /> : <>{groups.length ? groups.map(([k, label, xs]) => (
              <React.Fragment key={k + p}>
                <h2 className="ph-day">{label}</h2>
                <DS.RowList label={label}>{xs.map((x) => pghRow(x, one))}</DS.RowList>
              </React.Fragment>
            )) : (
              <div className="lb-empty pgh-empty">
                <p className="gs-muted">{s ? 'Nothing matches that. Try a name, a number or a date.' : 'Nothing matches that.'}</p>
                {anySet && <DS.Button variant="secondary" onClick={clearAll}>Clear all</DS.Button>}
              </div>
            )}
            <RpPages pg={p} pages={pages} go={go} /></>}
          </div>
        </div>
      </>)}
    </main>
  </>);
};
const PghHistory = () => { const s = usePgh(); return s.opt === '0' ? <PghOrig /> : <PghNew key={s.opt} opt={s.opt} />; };

// ---- The strip: options, and where to go. Sits above the app's demo bar (pattern from docs/specs/filters-on-a-phone/playground/). ----
let pghBooted = false;
const PGH_GO = [['history', 'History'], ['casebook', GS_GAMES.casebook.name], ['escape', 'Escape'], ['word', 'Daily Word']];
const PghStrip = () => {
  const gs = useGs(); const s = usePgh(); const o = PGH_OPTS.find((x) => x.id === s.opt) || PGH_OPTS[1];
  const [why, setWhy] = React.useState(false);
  const bar = React.useRef(null); const [low, setLow] = React.useState(44); const [h, setH] = React.useState(88);
  React.useEffect(() => { if (!pghBooted) { pghBooted = true; gs.setView('pass'); gs.setConnected(true); setTimeout(() => window.gsApi.go('history'), 250); } }, []);
  React.useLayoutEffect(() => {
    const el = bar.current; if (!el) return undefined;
    const root = el.closest('.gs-root'); const demo = root && root.querySelector('.gs-demo:not(.pg-strip)');
    const m = () => { setLow(demo ? demo.offsetHeight : 0); setH(el.offsetHeight); };
    m(); const ro = new ResizeObserver(m); ro.observe(el); if (demo) ro.observe(demo); return () => ro.disconnect();
  }, [s.open]);
  const view = (v) => { gs.setDemoView(v); gs.setConnected(v !== 'out'); };
  const here = gs.route.name;
  const to = (k) => (k === 'history' ? gs.go('history') : gs.go(GS_GAMES[k].route, { page: 'record' }));
  return (<>
    <PghDemo0 />
    <div aria-hidden="true" style={{ flex: 'none', height: h }} />
    <div ref={bar} className="gs-demo pg-strip" style={{ bottom: low }} role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">History</span>
            {PGH_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => pghSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => pghSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{gs.view === 'out'
            ? <button type="button" className="gs-demo-opt" onClick={() => view('pass')}>Sign in with the Pass</button>
            : PGH_GO.map(([k, l], i) => <React.Fragment key={k}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={here === (k === 'history' ? 'history' : GS_GAMES[k].route)} onClick={() => to(k)}>{l}</button></React.Fragment>)}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => pghSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why"><p>{o.stance}</p><p className="gs-muted">{'Cost: ' + o.cost}</p></div>
      </DS.Popup>
    </div>
  </>);
};

Object.assign(window, { GsHistory: PghHistory, GsDemoBar: PghStrip });
