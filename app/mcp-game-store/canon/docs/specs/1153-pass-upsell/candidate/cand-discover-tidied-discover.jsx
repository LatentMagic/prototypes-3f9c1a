// Candidate (discover-tidied): Discover, tidied. Re-publishes window.GsGames (the `games` route) only.
// GsCard, GsPick and GsTile stay as they ship (Home keeps its Pass tag); Discover uses its own three
// card forms below, built from the same design-system parts, with a lock slot on the art.
// The axes the owner judges live in window.CandDT and are set from the Config aid (cand-discover-tidied-aids.jsx).

// ---- The candidate's settings: one small store the Config rows write and Discover reads.
const CDT_DEFAULTS = { a: '1', b: '1', c: '1', d: '1', wall: 'off', e: 'a', f: 'keep', g: 'keep', h: 'casebook', chips: 'off', part: 'none', allPlayed: false, noteGone: false };
const cdtStore = {
  v: { ...CDT_DEFAULTS }, subs: new Set(),
  set(p) { this.v = { ...this.v, ...p }; this.subs.forEach((f) => f()); },
};
const useCdt = () => {
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); cdtStore.subs.add(f); return () => cdtStore.subs.delete(f); }, []);
  return cdtStore.v;
};

// ---- Staging, for display only (owner, 2026-10-15): which kind of access each game shows. Not policy.
const CDT_STAGE = { word: 'daily', mystery: 'daily', escape: 'first', casebook: 'first', delve: 'first', barrow: 'first', hunter: 'pass' };
const CDT_SHOWN = GS_GAME_ORDER.filter((k) => k !== 'groups'); // Daily Groups is not shown (set by the brief)
const cdtHasFree = (k) => !!CDT_STAGE[k] && CDT_STAGE[k] !== 'pass';
const cdtLocked = (gs, k) => CDT_STAGE[k] === 'pass' && gs.view !== 'pass';
// The card's tag row: no Pass tag ever; Free and "First … free" only when a carry-over switch turns them on.
const cdtTags = (k, v) => {
  const rest = GS_GAMES[k].tags.filter((t) => t !== 'FREE' && t !== 'FIRST' && t !== 'PASS');
  const s = CDT_STAGE[k]; const acc = [];
  if (v.chips === 'on' && s === 'daily') acc.push('FREE');
  if ((v.chips === 'on' || v.part === 'mark') && s === 'first') acc.push('FIRST');
  return acc.concat(rest);
};

// ---- The lock: on the art, inert (the card's own press opens the game). Three treatments (axis D).
const CdtLock = ({ d }) => (
  <span className={'cdt-lock ' + (d === '1' ? 'is-corner' : d === '2' ? 'is-chip' : 'is-strip')} role="img" aria-label="Pass only">
    <DS.Icon name="lock" size={14} />
    {d === '2' ? <span aria-hidden="true">Pass</span> : d === '3' ? <span aria-hidden="true">Pass only</span> : null}
  </span>
);
const CdtArt = ({ host, art, shape, lock, d }) => (
  <div ref={host} className="cdt-art"><GsArt art={art} shape={shape} />{lock && <CdtLock d={d} />}</div>
);
const CdtCard = ({ id }) => {
  const gs = useGs(); const v = useCdt(); const g = GS_GAMES[id]; const host = useGsArtHost();
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<CdtArt host={host} art={g.art} shape="wide" lock={cdtLocked(gs, id)} d={v.d} />}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={cdtTags(id, v)} ed={g.ed} />} />
  );
};
const CdtPick = ({ id, label }) => {
  const gs = useGs(); const v = useCdt(); const g = GS_GAMES[id]; const host = useGsArtHost();
  return (
    <DS.GamePick className="mcp-art-host gs-host"
      art={<CdtArt host={host} art={g.art} shape="wide" lock={cdtLocked(gs, id)} d={v.d} />}
      label={label}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={cdtTags(id, v)} ed={g.ed} />} />
  );
};
const CdtTile = ({ id, kind }) => {
  const gs = useGs(); const v = useCdt(); const g = GS_GAMES[id]; const host = useGsArtHost();
  return (
    <DS.GameTile className="mcp-art-host gs-host"
      art={<CdtArt host={host} art={g.art} shape="square" lock={v.wall === 'on' && cdtLocked(gs, id)} d={v.d} />}
      title={<button type="button" className="mcp-gtile-open mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      kind={kind} />
  );
};

// ---- Copy for each axis (strings named in the brief; Delve's pick label is the one this build had to write).
const CDT_A = { 1: ['The start of select games comes with your account. The rest comes with the Pass.', 'About the Pass'], 2: ['Everything else comes with the Pass.', 'See the Pass'], 3: [null, 'About the Pass'] };
const CDT_C = { 1: 'Free to play', 2: 'Free with your account', 3: 'Start here' };
const CDT_E = { a: ['You’ve played the first part of each game.', 'Everything else', ' comes with the Pass.'], b: ['You’ve played the start of every game on offer.', 'The rest', ' comes with the Pass.'] };
const CDT_PICK2 = { casebook: 'A NEW CASE EVERY WEEK', delve: 'A NEW SCENE EVERY WEEK' };

// ---- The Pass band, as one line with a text link (item 4). Gone with the Pass, as canon.
const CdtPassLine = () => {
  const gs = useGs(); const v = useCdt(); if (gs.view === 'pass') return null;
  const [s, l] = CDT_A[v.a];
  return <div className="cdt-passline">{s && <p>{s}</p>}<DS.TextLink onClick={() => gs.go('pass')}>{l}</DS.TextLink></div>;
};
// ---- The once-only note (item 5), from the push-ask pattern; Got it retires it.
const CdtNote = () => {
  const gs = useGs(); const v = useCdt(); const [l1, lk, rest] = CDT_E[v.e];
  return (
    <div className="gs-pushask cdt-note">
      <div className="gs-pushask-in">
        <p>{l1}<br /><button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>{lk}</button>{rest}</p>
        <DS.TextLink onClick={() => { cdtStore.set({ noteGone: true }); gsPushFocusPage(); }}>Got it</DS.TextLink>
      </div>
    </div>
  );
};

const CDT_CHIPS = () => [...GS_KINDS.map((c) => [c, gsKind(c)]), ...GS_RHYTHMS, ['free', 'Free']];
const CdtBody = () => {
  const gs = useGs(); const v = useCdt();
  const [q, setQ] = React.useState(''); const [on, setOn] = React.useState(gs.route.on || []);
  const [panel, setPanel] = React.useState(false);
  React.useEffect(() => { setOn(gs.route.on || []); }, [gs.route]);
  const kinds = GS_KINDS.filter((c) => on.includes(c)); const free = on.includes('free');
  const rhy = GS_RHYTHMS.map(([x]) => x).filter((x) => on.includes(x));
  const ids = CDT_SHOWN.filter((k) => (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!rhy.length || rhy.includes(gsRhythm(k))) && (!free || cdtHasFree(k)) && gsFind(q, k));
  const flip = (x) => setOn((a) => (a.includes(x) ? a.filter((y) => y !== x) : a.concat(x)));
  const tools = React.useRef(null);
  const focusSearch = () => setTimeout(() => { const i = tools.current && tools.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0);
  const clear = () => { setOn([]); setQ(''); focusSearch(); };
  const wait = useGsPart([q, on.join()]);
  const filtering = on.length > 0 || !!q.trim();
  const chips = CDT_CHIPS();
  const chipRow = <div className="dc-chips" role="group" aria-label="Show only">{chips.map(([x, l]) => <button key={x} type="button" aria-pressed={on.includes(x)} onClick={() => flip(x)}>{l}</button>)}</div>;
  const search = <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />;

  // Each game once above All games: picks, then Just added without them, then the free row without either.
  const picks = [[v.h, CDT_PICK2[v.h]], ['word', v.f === 'keep' ? 'FREE EVERY DAY' : 'A NEW WORD EVERY DAY']];
  const pickIds = picks.map((p) => p[0]);
  const added = GS_ADDED.filter((k) => CDT_SHOWN.includes(k) && !pickIds.includes(k));
  const freeRow = CDT_SHOWN.filter((k) => cdtHasFree(k) && !pickIds.includes(k) && !added.includes(k));
  const allDone = gs.view === 'free' && v.allPlayed;
  const showFree = gs.view !== 'pass' && !allDone && freeRow.length > 0;
  const showNote = allDone && !v.noteGone;
  const sub = v.g === 'keep' ? GS_NAME.casebook + '’s first case and Delve’s first scene are free.' : undefined;

  return <>
    {v.b === '1' ? (
      <div className="cdt-tools" ref={tools}><div className="cdt-search">{search}</div>{chipRow}</div>
    ) : (
      <div className="cdt-tools lbf-top" ref={tools}>
        <div className="lbf-bar">
          <div className="lbf-search">{search}</div>
          <DS.Button variant="secondary" onClick={() => setPanel(true)}>Filter</DS.Button>
        </div>
        {on.length ? <div className="cdt-active" role="group" aria-label="Show only">
          {chips.filter(([x]) => on.includes(x)).map(([x, l]) => <button key={x} type="button" className="cdt-rm" aria-label={'Remove ' + l} onClick={() => { flip(x); if (on.length === 1) focusSearch(); }}>{l}<DS.Icon name="close" size={14} /></button>)}
        </div> : null}
        <DS.Popup kind="panel" open={panel} onClose={() => setPanel(false)} title="Filter"
          actions={on.length ? <DS.ButtonPair><DS.Button variant="secondary" onClick={() => setOn([])}>Clear</DS.Button><DS.Button onClick={() => setPanel(false)}>Done</DS.Button></DS.ButtonPair> : <DS.Button onClick={() => setPanel(false)}>Done</DS.Button>}>
          <div className="cdt-panel-chips">{chipRow}</div>
        </DS.Popup>
      </div>
    )}
    {!filtering && <>
      <div className="mcp-gpicks">{picks.map(([k, l]) => <CdtPick key={k} id={k} label={l} />)}</div>
      {added.length > 0 && <section className="dc-sec"><DS.CardRow title="Just added" className="gs-row4">{added.map((k) => <CdtCard key={k} id={k} />)}</DS.CardRow></section>}
      {showFree && <section className="dc-sec"><DS.CardRow title={CDT_C[v.c]} className="gs-row4" sub={sub}>{freeRow.map((k) => <CdtCard key={k} id={k} />)}</DS.CardRow></section>}
      {showNote && <CdtNote />}
      <CdtPassLine />
    </>}
    <section className="dc-sec">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">All games</h2>{filtering ? <DS.TextLink onClick={clear}>Clear</DS.TextLink> : null}</div>
      {wait ? <GsPart label="Loading games" /> : ids.length ? <div className="mcp-gwall">{ids.map((k) => <CdtTile key={k} id={k} kind={gsKind(GS_GAMES[k].category)} />)}</div>
        : <div className="dc-empty"><p>No game matches that.</p><DS.TextLink onClick={clear}>Show every game</DS.TextLink></div>}
    </section>
  </>;
};
// The page shell is canon's GsDiscover with CdtBody in place of DcBody: DcBody is reached by its file-scoped
// name, so it cannot be re-published from outside (skills/candidate-build, Traps). Loading and failed states as canon.
const CdtDiscover = () => {
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
        : <CdtBody />}
    </main>
  </>);
};

Object.assign(window, { GsGames: CdtDiscover, CandDT: cdtStore, useCandDT: useCdt, CAND_DT_DEFAULTS: CDT_DEFAULTS });
