// ============================================================================
// After Pixels — Discover (route `games`) and Library (route `library`).
// Both pages here are replaced: Discover (GsDiscover) by gs-pass-discover.jsx, Library (GsLibrary) by gs-pass-library.jsx.
// Their helpers (gsKind, GS_KINDS, gsFind, GS_ADDED, GS_LIB_READY) are still read.
// ============================================================================
const gsKind = (c) => c.charAt(0) + c.slice(1).toLowerCase();
const GS_KINDS = GS_GAME_ORDER.map((k) => GS_GAMES[k].category).filter((c, i, a) => a.indexOf(c) === i);
const gsFind = (q, k) => { const s = gsNorm(q); return !s || gsNorm(GS_GAMES[k].name).includes(s); };
// The two picks: chosen by us, not by rule. Seed.
const GS_PICKS = [['casebook', 'ONE CASE'], ['word', 'FREE EVERY DAY']];
// Just added: newest first. Seed (the app has no release dates yet).
const GS_ADDED = ['barrow', 'hunter', 'casebook', 'delve', 'escape'];
const GS_PASS_BAND = 'The Pass opens every game here in full, and every new game on its release day.';

const DcPassBand = () => {
  const gs = useGs(); if (gs.view === 'pass') return null;
  return (
    <DS.Card>
      <div className="dc-band">
        <p className="gs-lead"><b>{GS_PASS_BAND}</b></p>
        <DS.Button variant="secondary" onClick={() => gs.go('pass')}>About the Pass</DS.Button>
      </div>
    </DS.Card>
  );
};

const DcBody = () => {
  const gs = useGs();
  const [q, setQ] = React.useState(''); const [on, setOn] = React.useState(gs.route.on || []);
  React.useEffect(() => { setOn(gs.route.on || []); }, [gs.route]);
  const kinds = GS_KINDS.filter((c) => on.includes(c)); const free = on.includes('free');
  const rhy = GS_RHYTHMS.map(([v]) => v).filter((v) => on.includes(v));
  const ids = GS_GAME_ORDER.filter((k) => (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!rhy.length || rhy.includes(gsRhythm(k))) && (!free || GS_GAMES[k].free) && gsFind(q, k));
  const flip = (v) => setOn((a) => (a.includes(v) ? a.filter((x) => x !== v) : a.concat(v)));
  const tools = React.useRef(null);
  const clear = () => { setOn([]); setQ(''); setTimeout(() => { const i = tools.current && tools.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
  const freeIds = GS_GAME_ORDER.filter((k) => GS_GAMES[k].free);
  const wait = useGsPart([q, on.join()]);
  return <>
    <div className="mcp-gpicks">{GS_PICKS.map(([k, l]) => <GsPick key={k} id={k} label={l} />)}</div>
    <section className="dc-sec">
      <DS.CardRow title="Just added" className="gs-row4">{GS_ADDED.map((k) => <GsCard key={k} id={k} />)}</DS.CardRow>
    </section>
    <section className="dc-sec">
      <DS.CardRow title="Free to play" className="gs-row4" sub="Delve’s first run is free.">{freeIds.map((k) => <GsCard key={k} id={k} />)}</DS.CardRow>
    </section>
    <DcPassBand />
    <section className="dc-sec">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">All games</h2>{on.length || q.trim() ? <DS.TextLink onClick={clear}>Clear</DS.TextLink> : null}</div>
      <div className="dc-tools" ref={tools}>
        <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="dc-chips" role="group" aria-label="Show only">
          {[...GS_KINDS.map((c) => [c, gsKind(c)]), ...GS_RHYTHMS, ['free', 'Free']].map(([v, l]) => <button key={v} type="button" aria-pressed={on.includes(v)} onClick={() => flip(v)}>{l}</button>)}
        </div>
      </div>
      {wait ? <GsPart label="Loading games" /> : ids.length ? <div className="mcp-gwall">{ids.map((k) => <GsTile key={k} id={k} />)}</div>
        : <div className="dc-empty"><p>No game matches that.</p><DS.TextLink onClick={clear}>Show every game</DS.TextLink></div>}
    </section>
  </>;
};
// Replaced by gs-pass-discover.jsx (CprDiscover).
const GsDiscover = () => {
  const gs = useGs();
  const [load, setLoad] = React.useState(gs.route.load || null);
  React.useEffect(() => { setLoad(gs.route.load || null); }, [gs.route]);
  React.useEffect(() => {
    if (load !== 'loading') return undefined;
    const t = setTimeout(() => setLoad(null), 1200);
    return () => clearTimeout(t);
  }, [load]);
  return (<>
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Discover</h1>
      {load === 'hold' || load === 'loading' ? <div className="gs-inplace"><GsSpin /></div>
        : load === 'failed' ? <GsLoadFailed onRetry={() => setLoad(null)} />
        : <DcBody />}
    </main>
  </>);
};

// ---- Library. GsLibrary is replaced by gs-pass-library.jsx (CprLibrary). GS_LIB_READY: each game's ready line, read by its rows.
const GS_LIB_READY = { barrow: 'Chapter 1 is ready', word: 'Today’s word is ready', groups: 'Today’s groups are ready', mystery: 'Today’s case is ready', where: 'Today’s country is ready', chain: 'Today’s chain is ready', salvage: 'Today’s sea is ready', escape: 'This week’s room is ready', hunter: 'Today’s hunt is ready' };
const GsLibrary = () => {
  const gs = useGs();
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState(gs.route.kind || 'all'); const [sort, setSort] = React.useState('last');
  const [rhy, setRhy] = React.useState(gs.route.rhythm || 'all');
  React.useEffect(() => { setCat(gs.route.kind || 'all'); setRhy(gs.route.rhythm || 'all'); }, [gs.route]);
  const wait = useGsPart([q, cat, rhy, sort]);
  const lay = React.useRef(null);
  const showAll = () => { setQ(''); setCat('all'); setRhy('all'); setTimeout(() => { const i = lay.current && lay.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
  const rows = {}; GS_GAME_ORDER.forEach((k) => { rows[k] = gsLibRow(gs, k); });
  const az = (a, b) => GS_GAMES[a].name.localeCompare(GS_GAMES[b].name);
  const listed = GS_GAME_ORDER.filter((k) => lbAccess(gs, k) !== 'none' || lbPast(gs));
  const ids = listed.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && (rhy === 'all' || gsRhythm(k) === rhy) && gsFind(q, k))
    .sort((a, b) => (sort === 'az' ? az(a, b) : rows[b].at - rows[a].at || GS_GAME_ORDER.indexOf(a) - GS_GAME_ORDER.indexOf(b)));
  return (<>
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Library</h1>
      <div className="lb-alllay" ref={lay}>
        <window.LbTools>
          <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Genre" value={cat} opts={[['all', 'All games'], ...GS_KINDS.map((c) => [c, gsKind(c)])]} onPick={setCat} />
          <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={setRhy} />
          <LbChoice label="Order" value={sort} opts={[['last', 'Last played'], ['az', 'A to Z']]} onPick={setSort} />
        </window.LbTools>
        <div className="lb-box">
          {wait ? <GsPart label="Loading games" /> : ids.length ? (
            <DS.RowList label="Library">{ids.map((k) => { const g = GS_GAMES[k]; const me = rows[k]; return (
              <DS.ListRow key={k} lead={<GsArt art={g.art} shape="landscape" />} title={g.name} result={gsForms(me.result)} tone={me.tone || undefined} when={me.when || undefined} onClick={() => gs.go(g.route, { page: 'record' })} />
            ); })}</DS.RowList>
          ) : <div className="dc-empty" style={{ minWidth: 0 }}><p style={{ overflowWrap: 'anywhere' }}>{q.trim() ? 'No game matches “' + q + '”.' : 'No game matches that.'}</p><DS.TextLink onClick={showAll}>Show every game</DS.TextLink></div>}
        </div>
      </div>
    </main>
  </>);
};

Object.assign(window, { GsGames: GsDiscover, GsLibrary });
