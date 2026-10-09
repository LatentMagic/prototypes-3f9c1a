// Playground round 3: Discover only, options A and B, 2026-10-09.
// Loads after pg-games-library-2.jsx and reuses its parts. Settled for this round (not ratified decisions): names are
// Discover and Library, the Library is option 13, and signed in, Home is Discover. Overrides GsGames, GsHome and GsDemoBar.
const P3_KEY = 'pg_games_library_v3';
let p3 = { opt: 'a', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(P3_KEY)) || {}; } catch (e) { return {}; } })() };
const p3Subs = new Set();
const p3Set = (p) => { p3 = { ...p3, ...p }; try { localStorage.setItem(P3_KEY, JSON.stringify(p3)); } catch (e) {} p3Subs.forEach((f) => f(p3)); };
const useP3 = () => { const [s, setS] = React.useState(p3); React.useEffect(() => { p3Subs.add(setS); return () => p3Subs.delete(setS); }, []); return s; };

// Round 2's state, held in memory only so round 2's saved picks are left alone.
P2_NAMES['8'] = { store: 'Discover', lib: 'Library' };
p2 = { ...p2, names: '8', home: 'none', lib: '13' };

const P3Tile = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => pgOpen(gs, id); const mark = gsMarks(gs.view)[id];
  return (
    <div className="p2-tile">
      <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
      <button type="button" className="p2-tile-name" onClick={open}>{g.name}</button>
      <span className="gs-small">{pgCat(g.category)}</span>
      {(g.free || mark) && <span className="p3-tags">{g.free && <DS.Tag kind="free">Free</DS.Tag>}{mark && <DS.Tag kind="daily" icon="check">{mark}</DS.Tag>}</span>}
    </div>
  );
};

const P3Discover = () => {
  const gs = useGs(); const s = useP3();
  const [q, setQ] = React.useState(''); const [on, setOn] = React.useState([]);
  const kinds = PG_CATS.filter((c) => on.includes(c)); const free = on.includes('free');
  const ids = PG_ORDER.filter((k) => (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!free || GS_GAMES[k].free) && pgFind(q, k));
  const flip = (v) => setOn((a) => (a.includes(v) ? a.filter((x) => x !== v) : a.concat(v)));
  const clear = () => { setOn([]); setQ(''); };
  const busy = on.length || q.trim();
  const cells = ids.map((k) => <P3Tile key={k} id={k} />);
  if (gs.view !== 'pass' && !busy) cells.splice(Math.min(5, cells.length), 0, (
    <div key="pass" className="p2-passtile"><p><b>Every game here comes with the Pass.</b></p><DS.TextLink onClick={() => gs.go('pass')}>What’s included</DS.TextLink></div>
  ));
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Discover</h1>
      <div className="gs-grid2"><P2Pick id={P2_FEATURE} label="NEW THIS WEEK" /><P2Pick id="cipher" label="FREE EVERY DAY" /></div>
      {s.opt === 'b' && <P2Row title="Free to play" ids={PG_ORDER.filter((k) => GS_GAMES[k].free)} />}
      <section className="gl-sec">
        <div className="gs-sec-head"><h2 className="mcp-t-sec">All games</h2>{busy ? <DS.TextLink onClick={clear}>Clear</DS.TextLink> : null}</div>
        <div className="gl-tools">
          <DS.SearchField label="Search" placeholder="Name or kind" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="gl-chips" role="group" aria-label="Show only">
            {[...PG_CATS.map((c) => [c, pgCat(c)]), ['free', 'Free']].map(([v, l]) => <button key={v} type="button" aria-pressed={on.includes(v)} onClick={() => flip(v)}>{l}</button>)}
          </div>
        </div>
        {ids.length ? <div className="p2-wall">{cells}</div>
          : <div className="gl-empty"><p>No game matches that.</p><DS.TextLink onClick={clear}>Show every game</DS.TextLink></div>}
      </section>
    </main>
  );
};

const P3Games = () => {
  const gs = useGs(); const r = gs.route;
  if (r.pid) return r.page === 'record' && gs.view !== 'out' ? <PgPlaceLib id={r.pid} /> : <GsGamePage id={r.pid} top={gs.view !== 'out' ? <PgLibCard id={r.pid} /> : null} />;
  if (r.lib && gs.view !== 'out') return <P2Library />;
  return <P3Discover />;
};

const P3_OPTS = [
  { id: 'a', name: 'Cover wall with search', idea: 'Option 5 with a search beside the kind and Free chips. The wall is headed All games, and free games carry a Free tag. Free to play lives in the Free chip.', cost: 'Nothing on the page says “free” as a heading. On a phone the search sits under the two picks, about a screen down.' },
  { id: 'b', name: 'Plus a Free to play row', idea: 'A, with a Free to play row between the two picks and the wall, the row you liked in option 4.', cost: 'One more block, so the search sits further down on a phone. Free games show twice: in the row and in the wall.' },
];

let p3Booted = false;
const P3Strip = () => {
  const gs = useGs(); const s = useP3(); const o = P3_OPTS.find((x) => x.id === s.opt) || P3_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!p3Booted) { p3Booted = true; gs.setView('out'); setTimeout(() => window.gsApi.go('games'), 0); } }, []);
  const view = (v) => {
    gs.setView(v); gs.setConnected(v !== 'out');
    if (v === 'out' && (gs.route.lib || GS_SIGNED_IN_ONLY.includes(gs.route.name))) gs.go('games');
  };
  const pick = (id) => { p3Set({ opt: id }); gs.go('games'); };
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {P3_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id.toUpperCase()}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => p3Set({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">View</span>
            {seg([['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']], gs.view, view)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => p3Set({ open: true })}>{'Show · ' + o.id.toUpperCase() + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id.toUpperCase() + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">The names are Discover and Library, and the Library is option 13. Daily Cipher, Derelict, Harbour Master, The Barrow of Hollowmere and The Scribe of Ur are placeholder games.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

// Signed in, Home is Discover (Joe, 2026-10-09): the logo and any route to home land on Discover.
const P3Home = () => {
  const gs = useGs(); const out = gs.view === 'out';
  React.useEffect(() => { if (!out) gs.go('games'); }, [out]);
  return out ? <P2_ORIG_HOME /> : null;
};

Object.assign(window, { GsGames: P3Games, GsHome: P3Home, GsDemoBar: P3Strip });
