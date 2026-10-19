// [Platform] — Discover (route `games`). Re-publishes window.GsGames, replacing gs-discover.jsx's GsDiscover. Cards and picks are
// the re-published GsCard and GsPick (the Pass mark top right, no Free or First chips); the wall is the shared GsTile with the same mark.
// Proposed, not ratified yet: search and filters as History's (one search field and a Filters panel), and the selection below.
// Discover doesn't sell the Pass: only a game's product page and its Library page do, so it has no Pass line.

// The picks (seed). Labels name each game's rhythm, never a price or "this week".
const CPR_PICKS = [['casebook', 'ONE CASE'], ['word', 'A NEW WORD EVERY DAY']];
// The selection: Just added (games with editions, not picked), then Free to play (every game with free play, picks
// included; gone with the Pass). A row with nothing in it isn't shown.
const cprSelection = (gs) => {
  const shown = CPR_PICKS.map((p) => p[0]);
  const take = (ks) => { const out = ks.filter((k) => CPR_SHOWN.includes(k) && !shown.includes(k)); shown.push(...out); return out; };
  const added = take(GS_ADDED.filter(cprEditions));
  const free = gs.view === 'pass' ? [] : CPR_SHOWN.filter((k) => CPR_STAGE[k] !== 'pass');
  return { added, free };
};

// Search and filters live in the page shell, not the body, so they survive the body reloading in place; the shell writes them
// into the history entry (gs.keep), so Back returns them too.
const CprDiscoverBody = ({ f, setF }) => {
  const { q, cat, rhy } = f;
  const setQ = (v) => setF((p) => ({ ...p, q: v })); const setCat = (v) => setF((p) => ({ ...p, cat: v })); const setRhy = (v) => setF((p) => ({ ...p, rhy: v }));
  const gs = useGs();
  const wait = useGsPart([q, cat, rhy]);
  const tools = React.useRef(null);
  const filtering = cat !== 'all' || rhy !== 'all' || !!q.trim();
  const clearAll = () => { setF({ q: '', cat: 'all', rhy: 'all' }); setTimeout(() => { const i = tools.current && tools.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
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
      {wait ? <GsPart label="Loading games" /> : ids.length ? <div className="mcp-gwall">{ids.map((k) => <GsTile key={k} id={k} pass={cprLocked(gs, k)} />)}</div>
        : <div className="gs-nomatch"><p>Nothing matches that.</p><DS.TextLink onClick={clearAll}>Clear all</DS.TextLink></div>}
    </section>
  </>;
};
// The page shell is a copy of canon's GsDiscover with CprDiscoverBody in place of DcBody, which is file-scoped in app/gs-discover.jsx.
// Loading and failed states as canon.
const CprDiscover = () => {
  const gs = useGs();
  const [load, setLoad] = React.useState(gs.route.load || null);
  const fOf = (r, prevQ) => { const k = r.dcKeep || {}; return { q: k.q != null ? k.q : prevQ, cat: k.cat || r.kind || 'all', rhy: k.rhy || r.rhythm || 'all' }; };
  const [f, setF] = React.useState(() => fOf(gs.route, ''));
  React.useEffect(() => { setLoad(gs.route.load || null); setF((p) => fOf(gs.route, p.q)); }, [gs.route]);
  React.useEffect(() => { gs.keep({ dcKeep: f }); }, [f]);
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
        : <CprDiscoverBody f={f} setF={setF} />}
    </main>
  </>);
};

Object.assign(window, { GsGames: CprDiscover });
