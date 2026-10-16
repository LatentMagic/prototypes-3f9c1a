// Candidate (pass-upsell-ratified): Discover (route `games`), from "Discover, tidied", brought up to the 2026-10-16 decisions.
// Re-publishes window.GsGames. Cards and picks are the re-published GsCard and GsPick (the Pass mark top right, no Free or First
// chips); the wall is CprTile, canon's GsTile with the same mark (2026-10-16, owner asked for it). Proposals the owner made on 2026-10-16, not yet ratified: search and filters
// as History's (one search field and a Filters panel), and the selection below. Discover doesn't sell the Pass (owner, 2026-10-16):
// only a game's product page and its Library page do, so it has no Pass line.

// The picks (seed). Labels name each game's rhythm, never a price or "this week".
const CPR_PICKS = [['casebook', 'A NEW CASE EVERY WEEK'], ['word', 'A NEW WORD EVERY DAY']];
// The selection: Just added (games with editions, not picked), then Free to play (every game with free play, picks
// included; gone with the Pass). "Play any time" is gone (owner, 2026-10-16). A row with nothing in it isn't shown.
const cprSelection = (gs) => {
  const shown = CPR_PICKS.map((p) => p[0]);
  const take = (ks) => { const out = ks.filter((k) => CPR_SHOWN.includes(k) && !shown.includes(k)); shown.push(...out); return out; };
  const added = take(GS_ADDED.filter(cprEditions));
  const free = gs.view === 'pass' ? [] : CPR_SHOWN.filter((k) => CPR_STAGE[k] !== 'pass');
  return { added, free };
};
const CprTile = ({ id, kind }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const host = useGsArtHost();
  return (
    <DS.GameTile className="mcp-art-host gs-host"
      art={<CprArt host={host} id={id} shape="square" />} pass={cprLocked(gs, id)}
      title={<button type="button" className="mcp-gtile-open mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      kind={kind} />
  );
};

const CprDiscoverBody = () => {
  const gs = useGs();
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState(gs.route.kind || 'all'); const [rhy, setRhy] = React.useState(gs.route.rhythm || 'all');
  React.useEffect(() => { setCat(gs.route.kind || 'all'); setRhy(gs.route.rhythm || 'all'); }, [gs.route]);
  const wait = useGsPart([q, cat, rhy]);
  const tools = React.useRef(null);
  const filtering = cat !== 'all' || rhy !== 'all' || !!q.trim();
  const clearAll = () => { setQ(''); setCat('all'); setRhy('all'); setTimeout(() => { const i = tools.current && tools.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
  const ids = CPR_SHOWN.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && (rhy === 'all' || gsRhythm(k) === rhy) && gsFind(q, k));
  const sel = cprSelection(gs);
  const cardRow = (title, ks) => (ks.length ? <section className="dc-sec"><DS.CardRow title={title} className="gs-row4">{ks.map((k) => <GsCard key={k} id={k} />)}</DS.CardRow></section> : null);
  return <>
    <div ref={tools}>
      <window.LbTools>
        <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
        <LbChoice label="Genre" value={cat} opts={[['all', 'All games'], ...GS_KINDS.map((c) => [c, gsKind(c)])]} onPick={setCat} />
        <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={setRhy} />
      </window.LbTools>
    </div>
    {!filtering && <>
      <div className="mcp-gpicks">{CPR_PICKS.map(([k, l]) => <GsPick key={k} id={k} label={l} />)}</div>
      {cardRow('Just added', sel.added)}
      {cardRow('Free to play', sel.free)}
    </>}
    <section className="dc-sec">
      <h2 className="mcp-t-sec">All games</h2>
      {wait ? <GsPart label="Loading games" /> : ids.length ? <div className="mcp-gwall">{ids.map((k) => <CprTile key={k} id={k} kind={gsKind(GS_GAMES[k].category)} />)}</div>
        : <div className="lb-empty lb-empty-clear">
            <p className="gs-muted">{q.trim() ? 'No game matches “' + q + '”.' : 'No game matches that.'}</p>
            <DS.Button variant="secondary" onClick={clearAll}>Clear all</DS.Button>
          </div>}
    </section>
  </>;
};
// The page shell is canon's GsDiscover with CprDiscoverBody in place of DcBody: DcBody is file-scoped in app/gs-discover.jsx,
// so on merge the change goes into that file and this copy goes. Loading and failed states as canon.
const CprDiscover = () => {
  const gs = useGs();
  const [load, setLoad] = React.useState(gs.route.load || null);
  React.useEffect(() => { setLoad(gs.route.load || null); }, [gs.route]);
  React.useEffect(() => {
    if (load !== 'loading') return undefined;
    const t = setTimeout(() => setLoad(null), 1200);
    return () => clearTimeout(t);
  }, [load]);
  return (<>
    {window.GsPushAsk && <window.GsPushAsk />}
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Discover</h1>
      {load === 'hold' || load === 'loading' ? <div className="gs-inplace"><GsSpin /></div>
        : load === 'failed' ? <GsLoadFailed onRetry={() => setLoad(null)} />
        : <CprDiscoverBody />}
    </main>
  </>);
};

Object.assign(window, { GsGames: CprDiscover });
