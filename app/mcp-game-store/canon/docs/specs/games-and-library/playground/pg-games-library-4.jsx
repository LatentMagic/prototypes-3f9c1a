// Playground round 4: Discover only, options 16 to 22, 2026-10-09.
// Loads after pg-games-library-2.jsx and reuses its parts. Held for this round: names Discover and Library, Library option 13,
// signed in the logo opens Discover. Every option has search, Free first in the chips, "Learning" as a kind, and hover on
// everything clickable (CSS in round-4.html). Overrides GsGames, GsHome and GsDemoBar.
const P4_KEY = 'pg_games_library_v4';
let p4 = { opt: '16', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(P4_KEY)) || {}; } catch (e) { return {}; } })() };
const p4Subs = new Set();
const p4Set = (p) => { p4 = { ...p4, ...p }; try { localStorage.setItem(P4_KEY, JSON.stringify(p4)); } catch (e) {} p4Subs.forEach((f) => f(p4)); };
const useP4 = () => { const [s, setS] = React.useState(p4); React.useEffect(() => { p4Subs.add(setS); return () => p4Subs.delete(setS); }, []); return s; };

P2_NAMES['8'] = { store: 'Discover', lib: 'Library' };
p2 = { ...p2, names: '8', home: 'none', lib: '13' };
Object.values(GS_GAMES).forEach((g) => { if (g.category === 'LEARNING ACTIVITY') g.category = 'LEARNING'; });
PG_CATS.forEach((c, i) => { if (c === 'LEARNING ACTIVITY') PG_CATS[i] = 'LEARNING'; });
const P4_NEWEST = [...P2_ADDED, ...PG_ORDER.filter((k) => !P2_ADDED.includes(k))];
const P4_BAND = 'The Pass gets you every game here, and every new one on its release day.';

// ---- Shared parts ----
const useP4Filter = () => {
  const [q, setQ] = React.useState(''); const [on, setOn] = React.useState([]);
  const kinds = PG_CATS.filter((c) => on.includes(c)); const free = on.includes('free');
  const match = (k) => (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!free || GS_GAMES[k].free) && pgFind(q, k);
  const flip = (v) => setOn((a) => (a.includes(v) ? a.filter((x) => x !== v) : a.concat(v)));
  const clear = () => { setOn([]); setQ(''); };
  return { q, setQ, on, flip, clear, busy: !!(on.length || q.trim()), match };
};
const P4Search = ({ f }) => <DS.SearchField label="Search" placeholder="Name or kind" value={f.q} onChange={(e) => f.setQ(e.target.value)} />;
const P4Chips = ({ f, free = true, last }) => (
  <div className="gl-chips" role="group" aria-label="Show only">
    {(last ? [...PG_CATS.map((c) => [c, pgCat(c)]), ['free', 'Free']] : [...(free ? [['free', 'Free']] : []), ...PG_CATS.map((c) => [c, pgCat(c)])]).map(([v, l]) => <button key={v} type="button" aria-pressed={f.on.includes(v)} onClick={() => f.flip(v)}>{l}</button>)}
  </div>
);
const P4Tools = ({ f, free, last }) => <div className="gl-tools"><P4Search f={f} /><P4Chips f={f} free={free} last={last} /></div>;
const P4PassTile = () => { const gs = useGs(); return <div className="p2-passtile"><p><b>Every game here comes with the Pass.</b></p><DS.TextLink onClick={() => gs.go('pass')}>What’s included</DS.TextLink></div>; };
const P4TileNoTag = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => pgOpen(gs, id); const mark = gsMarks(gs.view)[id];
  return (
    <div className="p2-tile">
      <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
      <button type="button" className="p2-tile-name" onClick={open}>{g.name}</button>
      <span className="gs-small">{pgCat(g.category)}</span>
      {mark && <span className="p3-tags"><DS.Tag kind="daily" icon="check">{mark}</DS.Tag></span>}
    </div>
  );
};
const P4Wall = ({ ids, pass, f, notag }) => {
  const gs = useGs();
  if (!ids.length) return <div className="gl-empty"><p>No game matches that.</p><DS.TextLink onClick={f.clear}>Show every game</DS.TextLink></div>;
  const cells = ids.map((k) => (notag ? <P4TileNoTag key={k} id={k} /> : <P3Tile key={k} id={k} />));
  if (pass && gs.view !== 'pass') cells.splice(Math.min(5, cells.length), 0, <P4PassTile key="pass" />);
  return <div className="p2-wall">{cells}</div>;
};
const P4SecHead = ({ title, f }) => <div className="gs-sec-head"><h2 className="mcp-t-sec">{title}</h2>{f && f.busy ? <DS.TextLink onClick={f.clear}>Clear</DS.TextLink> : null}</div>;
const P4Picks = () => <div className="gs-grid2"><P2Pick id={P2_FEATURE} label="NEW THIS WEEK" /><P2Pick id="cipher" label="FREE EVERY DAY" /></div>;
const P4Free = () => <P2Row title="Free to play" ids={PG_ORDER.filter((k) => GS_GAMES[k].free)} />;
const P4Page = ({ children }) => <main className="gs-wrap gs-main">{children}</main>;

// 16 · The wall, tidied. Joe 2026-10-09: Free chip last, no Free tag on tiles, no Pass tile, Just added under the picks.
const P4S16 = () => {
  const f = useP4Filter();
  return (
    <P4Page>
      <h1 className="gs-h1">Discover</h1>
      <P4Picks /><P2Row title="Just added" ids={P2_ADDED} /><P4Free /><P2PassBand line={P4_BAND} />
      <section className="gl-sec"><P4SecHead title="All games" f={f} /><P4Tools f={f} last /><P4Wall ids={PG_ORDER.filter(f.match)} f={f} notag /></section>
    </P4Page>
  );
};
// 17 · Search first
const P4S17 = () => {
  const f = useP4Filter(); const ids = PG_ORDER.filter(f.match);
  return (
    <P4Page>
      <div className="p4-head"><h1 className="gs-h1">Discover</h1><P4Search f={f} /></div>
      <P4Chips f={f} />
      {f.busy ? (
        <section className="gl-sec"><P4SecHead title={ids.length === 1 ? '1 game' : ids.length + ' games'} f={f} /><P4Wall ids={ids} f={f} /></section>
      ) : (
        <><P4Picks /><P4Free /><P2PassBand line={P4_BAND} /><section className="gl-sec"><P4SecHead title="All games" /><P4Wall ids={ids} pass f={f} /></section></>
      )}
    </P4Page>
  );
};
// 18 · Filter rail
const P4S18 = () => {
  const f = useP4Filter();
  return (
    <P4Page>
      <h1 className="gs-h1">Discover</h1>
      <div className="p4-rail">
        <aside className="p4-rail-tools" aria-label="Find a game"><P4Search f={f} /><P4Chips f={f} />{f.busy ? <div><DS.TextLink onClick={f.clear}>Clear</DS.TextLink></div> : null}</aside>
        <div className="p4-rail-main">
          {!f.busy && <P4Picks />}
          <section className="gl-sec"><P4SecHead title="All games" /><P4Wall ids={PG_ORDER.filter(f.match)} f={f} /></section>
        </div>
        <div className="p4-rail-band"><P4RailPass /></div>
      </div>
    </P4Page>
  );
};
const P4RailPass = () => {
  const gs = useGs(); if (gs.view === 'pass') return null;
  return <DS.Card><div className="gs-stack-sm"><p><b>{P4_BAND}</b></p><DS.Button variant="secondary" onClick={() => gs.go('pass')}>What’s included</DS.Button></div></DS.Card>;
};
// 19 · Free, then the Pass
const P4S19 = () => {
  const f = useP4Filter(); const gs = useGs();
  const free = PG_ORDER.filter((k) => GS_GAMES[k].free && f.match(k)); const pass = PG_ORDER.filter((k) => !GS_GAMES[k].free && f.match(k));
  return (
    <P4Page>
      <h1 className="gs-h1">Discover</h1>
      <P4Tools f={f} free={false} />
      {free.length > 0 && <section className="gl-sec"><P4SecHead title="Free to play" f={f} /><p className="gs-muted">You can play these with a free account.</p><P4Wall ids={free} f={f} /></section>}
      {gs.view !== 'pass' && pass.length > 0 && <P2PassBand line={P4_BAND} />}
      {pass.length > 0 && <section className="gl-sec"><P4SecHead title="With the Pass" f={free.length ? null : f} /><P4Wall ids={pass} f={f} /></section>}
      {!free.length && !pass.length && <P4Wall ids={[]} f={f} />}
    </P4Page>
  );
};
// 20 · Kind tabs
const P4S20 = () => {
  const f = useP4Filter(); const [tab, setTab] = React.useState('all');
  const tabs = [['all', 'All'], ['free', 'Free'], ...PG_CATS.map((c) => [c, pgCat(c)])];
  const inTab = (k) => tab === 'all' || (tab === 'free' ? GS_GAMES[k].free : GS_GAMES[k].category === tab);
  const ids = PG_ORDER.filter((k) => inTab(k) && pgFind(f.q, k));
  const home = tab === 'all' && !f.q.trim();
  return (
    <P4Page>
      <div className="p4-head"><h1 className="gs-h1">Discover</h1><P4Search f={f} /></div>
      <div className="p4-tabs" role="tablist" aria-label="Kind of game">
        {tabs.map(([v, l]) => <button key={v} type="button" role="tab" aria-selected={tab === v} className="p4-tab" onClick={() => setTab(v)}>{l}</button>)}
      </div>
      {home ? (
        <><P4Picks /><P4Free /><P2PassBand line={P4_BAND} /><section className="gl-sec"><P4SecHead title="All games" /><P4Wall ids={ids} pass f={f} /></section></>
      ) : <P4Wall ids={ids} f={{ ...f, clear: () => { f.clear(); setTab('all'); } }} />}
    </P4Page>
  );
};
// 21 · One mixed wall
const P4S21 = () => {
  const f = useP4Filter(); const gs = useGs(); const ids = PG_ORDER.filter(f.match);
  let cells;
  if (f.busy) cells = ids.map((k) => <P3Tile key={k} id={k} />);
  else {
    const rest = PG_ORDER.filter((k) => k !== P2_FEATURE && k !== 'cipher');
    cells = [<div key="p1" className="p4-big"><P2Pick id={P2_FEATURE} label="NEW THIS WEEK" /></div>, <div key="p2" className="p4-big"><P2Pick id="cipher" label="FREE EVERY DAY" /></div>,
      ...rest.map((k) => <P3Tile key={k} id={k} />)];
    if (gs.view !== 'pass') cells.splice(8, 0, <div key="band" className="p4-full"><P2PassBand line={P4_BAND} /></div>);
  }
  return (
    <P4Page>
      <h1 className="gs-h1">Discover</h1>
      <div className="gl-sec"><P4Tools f={f} />{f.busy ? <div><DS.TextLink onClick={f.clear}>Clear</DS.TextLink></div> : null}</div>
      {ids.length ? <div className="p4-mix">{cells}</div> : <P4Wall ids={[]} f={f} />}
    </P4Page>
  );
};
// 22 · A short Discover and an All games page
const P4S22 = () => {
  const gs = useGs(); const [q, setQ] = React.useState('');
  const go = (e) => { if (e) e.preventDefault(); gs.go('games', { all: true, q: q.trim() }); };
  return (
    <P4Page>
      <div className="p4-head"><h1 className="gs-h1">Discover</h1>
        <form className="p4-go" onSubmit={go} role="search"><DS.SearchField label="Search" placeholder="Name or kind" value={q} onChange={(e) => setQ(e.target.value)} /><DS.Button variant="secondary" type="submit">Search</DS.Button></form>
      </div>
      <P4Picks />
      <P2Row title="Just added" ids={P2_ADDED} />
      <P4Free />
      <P2PassBand line={P4_BAND} />
      <section className="gl-sec">
        <div className="gs-sec-head"><h2 className="mcp-t-sec">All games</h2><DS.TextLink onClick={() => gs.go('games', { all: true })}>See all games</DS.TextLink></div>
        <div className="p2-wall">{P4_NEWEST.slice(0, 5).map((k) => <P3Tile key={k} id={k} />)}</div>
      </section>
    </P4Page>
  );
};
const P4_PER = 8;
const P4All = () => {
  const gs = useGs(); const f = useP4Filter(); const [order, setOrder] = React.useState('new'); const [page, setPage] = React.useState(1);
  React.useEffect(() => { if (gs.route.q) f.setQ(gs.route.q); }, []);
  React.useEffect(() => setPage(1), [f.q, f.on.join(), order]);
  const all = (order === 'az' ? PG_ORDER.slice().sort((a, b) => GS_GAMES[a].name.localeCompare(GS_GAMES[b].name)) : P4_NEWEST).filter(f.match);
  const pages = Math.max(1, Math.ceil(all.length / P4_PER)); const ids = all.slice((page - 1) * P4_PER, page * P4_PER);
  const to = (n) => { setPage(n); gsScrollTop(); };
  return (
    <P4Page>
      <div className="gs-stack-sm" style={{ justifyItems: 'start' }}><DS.TextLink onClick={() => gs.go('games')}>Discover</DS.TextLink><h1 className="gs-h1">All games</h1></div>
      <div className="lb-alllay">
        <aside className="lb-tools">
          <P4Search f={f} />
          <P4Chips f={f} />
          <LbChoice label="Order" value={order} opts={[['new', 'Newest'], ['az', 'A to Z']]} onPick={setOrder} />
        </aside>
        <div className="gs-stack-md">
          <P4Wall ids={ids} f={f} />
          {pages > 1 && (
            <nav className="p4-pages" aria-label="Pages">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button key={n} type="button" className="p4-pg" aria-current={n === page ? 'page' : undefined} onClick={() => to(n)}>{n}</button>)}
              {page < pages && <button type="button" className="p4-pg" onClick={() => to(page + 1)}>Next</button>}
            </nav>
          )}
        </div>
      </div>
    </P4Page>
  );
};
const P4_STORE = { '16': P4S16, '17': P4S17, '18': P4S18, '19': P4S19, '20': P4S20, '21': P4S21, '22': P4S22 };

const P4Games = () => {
  const gs = useGs(); const s = useP4(); const r = gs.route;
  if (r.pid) return r.page === 'record' && gs.view !== 'out' ? <PgPlaceLib id={r.pid} /> : <GsGamePage id={r.pid} top={gs.view !== 'out' ? <PgLibCard id={r.pid} /> : null} />;
  if (r.lib && gs.view !== 'out') return <P2Library />;
  if (r.all && s.opt === '22') return <P4All />;
  const B = P4_STORE[s.opt] || P4S16;
  return <B key={s.opt} />;
};
const P4Home = () => {
  const gs = useGs(); const out = gs.view === 'out';
  React.useEffect(() => { if (!out) gs.go('games'); }, [out]);
  return out ? <P2_ORIG_HOME /> : null;
};

const P4_OPTS = [
  { id: '16', name: 'The wall, tidied', idea: 'Option 5 with your notes: two picks, a Free to play row, the Pass band under it, then All games with search beside the chips. Free is the last chip, tiles carry no Free tag, and the wall has no Pass tile.', cost: 'It is still a stack of blocks. On a phone the search is three blocks down, and free games show twice.' },
  { id: '17', name: 'Search first', idea: 'Search sits beside the page heading and the chips under it, so you can look for a game before anything else. As soon as you search or pick a chip, the page turns into the results.', cost: 'The page has two modes, and the picks vanish while you search. Search sits above the picks, so it competes with them for first look.' },
  { id: '18', name: 'Filter rail', idea: 'On a wide screen, search and the chips stay in a column beside the wall, the way a big store’s browse page works. The Pass sits under them in the same column. On a phone they come first.', cost: 'The rail takes width from the covers. Free has no heading of its own, only its chip and its tags.' },
  { id: '19', name: 'Free, then the Pass', idea: 'The store is split by what you can play: the free games first, then the Pass band, then everything that comes with the Pass. Search and kind filter both halves.', cost: 'No picks, so nothing new gets a spotlight. The free half is small, and the split repeats what the tags already say.' },
  { id: '20', name: 'Kind tabs', idea: 'Search beside the heading, then one tab per kind with Free as a tab. All shows the full front page. Any other tab shows just its games.', cost: 'You can only pick one kind at a time, and lose the chips you could unclick. A new kind adds a tab, and on a phone the tabs scroll.' },
  { id: '21', name: 'One mixed wall', idea: 'No separate blocks. The two picks are big tiles inside the wall, and the Pass band runs across it after the first rows. Search and chips sit on top. Filtering turns it into a plain wall.', cost: 'The covers have to work at two sizes. The layout reshuffles when you filter, so the picks seem to disappear.' },
  { id: '22', name: 'Short page, All games page', idea: 'Discover shows a handful: picks, Just added, Free to play, the Pass, and five of All games. Search or See all games opens an All games page with filters, order and numbered pages.', cost: 'Seeing everything takes one more tap. The search on Discover hands off to another page instead of filtering in place.' },
];

let p4Booted = false;
const P4Strip = () => {
  const gs = useGs(); const s = useP4(); const o = P4_OPTS.find((x) => x.id === s.opt) || P4_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!p4Booted) { p4Booted = true; gs.setView('out'); setTimeout(() => window.gsApi.go('games'), 0); } }, []);
  const view = (v) => {
    gs.setView(v); gs.setConnected(v !== 'out');
    if (v === 'out' && (gs.route.lib || GS_SIGNED_IN_ONLY.includes(gs.route.name))) gs.go('games');
  };
  const pick = (id) => { p4Set({ opt: id }); gs.go('games'); gsScrollTop(); };
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Discover</span>
            {P4_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => p4Set({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">View</span>
            {seg([['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']], gs.view, view)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => p4Set({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">Every option has search, Free first in the chips and hover on everything you can click. The Pass line is a placeholder. Daily Cipher, Derelict, Harbour Master, The Barrow of Hollowmere and The Scribe of Ur are placeholder games.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsGames: P4Games, GsHome: P4Home, GsDemoBar: P4Strip });
