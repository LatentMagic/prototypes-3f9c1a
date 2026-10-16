// Candidate (discover-games-hub): Discover rebuilt as a games hub. Re-publishes window.GsGames (the `games` route) only.
// GsTile stays as it ships; the hub's tile below is built from the same design-system GameTile, with a lock slot on the art
// and the state line and doors under it (outside the tile, so the tile's stretched title press does not cover them).
// The axes live in window.CandGH and are set from the Config aid (cand-discover-games-hub-aids.jsx). Nothing here is accepted.

const CGH_DEFAULTS = { a: '1', b: '1', c: '1', lock: 'off', d: '1', e: '1', f: '1', chips: 'off', part: 'none' };
const cghStore = {
  v: { ...CGH_DEFAULTS, allFirst: false }, subs: new Set(),
  set(p) { this.v = { ...this.v, ...p }; this.subs.forEach((f) => f()); },
};
const useCgh = () => {
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); cghStore.subs.add(f); return () => cghStore.subs.delete(f); }, []);
  return cghStore.v;
};

// ---- Staging, for display only (owner, 2026-10-15): which kind of access each game shows. Not policy.
const CGH_STAGE = { word: 'daily', mystery: 'daily', escape: 'first', casebook: 'first', delve: 'first', barrow: 'first', hunter: 'pass' };
const CGH_SHOWN = GS_GAME_ORDER.filter((k) => k !== 'groups'); // Daily Groups is not shown (set by the brief)
const cghHasFree = (k) => !!CGH_STAGE[k] && CGH_STAGE[k] !== 'pass';
const cghLocked = (gs, k) => CGH_STAGE[k] === 'pass' && gs.view !== 'pass';

// ---- State line: Library's own line (gsLibRow), so the two agree. "Pass only" is a Pass mark, so the hub shows no line there.
// The play door's Library-style wording, keyed by the ready line it plays.
const CGH_PLAY = {
  'Today’s word is ready': 'Play today’s word', 'Today’s case is ready': 'Play today’s case', 'Today’s hunt is ready': 'Play today’s hunt',
  'This week’s room is ready': 'Play this week’s room', 'This week’s case is ready': 'Play this week’s case', 'This week’s scene is ready': 'Play this week’s scene',
  'Your free case is ready': 'Play the first case', 'Your free scene is ready': 'Play the first scene', 'Chapter 1 is ready': 'Play chapter 1',
};
const cghShort = (r, ready) => (r === 'Chapter 1 is ready' ? 'Chapter 1 ready' : ready ? 'Ready' : r === 'In progress' ? r : /done/i.test(r) ? 'Done' : r);
const cghRow = (gs, k, v) => {
  if (gs.view === 'out') return null;
  const r = gsLibRow(gs, k).result;
  if (!r || r === 'Pass only') return null;
  const ready = !!CGH_PLAY[r];
  return { raw: r, ready, line: v.e === '1' ? r : cghShort(r, ready) };
};
const cghDoor = (k, v) => { const ed = GS_GAMES[k].ed; if (!ed || !ED3.includes(k) || v.c === '3') return null; return v.c === '1' ? 'Every ' + ed[0] : 'All ' + ed[1]; };
// Carry-over switches (axis G): no Free, "First … free" or Pass tag unless switched on.
const cghTags = (k, v) => {
  const s = CGH_STAGE[k]; const ed = GS_GAMES[k].ed;
  if (v.chips === 'on' && s === 'daily') return [<DS.Tag key="f" kind="free">Free</DS.Tag>];
  if ((v.chips === 'on' || v.part === 'mark') && s === 'first') return [<DS.Tag key="f" kind="free">{'First ' + ed[0] + ' free'}</DS.Tag>];
  return [];
};

// ---- The lock: on the art, inert (the tile's own press opens the game). Three treatments (axis D).
const CghLock = ({ d }) => (
  <span className={'cgh-lock ' + (d === '1' ? 'is-corner' : d === '2' ? 'is-chip' : 'is-strip')} role="img" aria-label="Pass only">
    <DS.Icon name="lock" size={14} />
    {d === '2' ? <span aria-hidden="true">Pass</span> : d === '3' ? <span aria-hidden="true">Pass only</span> : null}
  </span>
);

const CghTile = ({ id }) => {
  const gs = useGs(); const v = useCgh(); const g = GS_GAMES[id]; const host = useGsArtHost();
  const row = cghRow(gs, id, v); const door = gs.view !== 'out' ? cghDoor(id, v) : null; const tags = cghTags(id, v);
  const play = row && row.ready ? (v.f === '1' ? CGH_PLAY[row.raw] : v.f === '2' ? 'Play' : null) : null;
  const under = tags.length || row || door;
  return (
    <div className="cgh-cell">
      <DS.GameTile className="mcp-art-host gs-host"
        art={<div ref={host} className="cgh-art"><GsArt art={g.art} shape="square" />{v.lock === 'on' && cghLocked(gs, id) && <CghLock d={v.d} />}</div>}
        title={<button type="button" className="mcp-gtile-open mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
        kind={gsKind(g.category)} />
      {under ? (
        <div className="cgh-under">
          {tags.length ? <div className="gs-tags">{tags}</div> : null}
          {row && <p className="cgh-state">{row.line}</p>}
          {play && <DS.Button variant="secondary" block aria-label={play === 'Play' ? 'Play ' + g.name : undefined} onClick={() => gs.play(g.name)}>{play}</DS.Button>}
          {door && <DS.TextLink aria-label={door + ', ' + g.name} onClick={() => pgeList(gs, id)}>{door}</DS.TextLink>}
        </div>
      ) : null}
    </div>
  );
};

// ---- Axis A: the Pass at the foot of the hub. Not shown to a Pass holder.
const CghPassFoot = () => {
  const gs = useGs(); const v = useCgh(); if (v.a === '1' || gs.view === 'pass') return null;
  return (
    <div className="cgh-passfoot">
      {v.a === '3' && <p>The start of select games comes with your account. The rest comes with the Pass.</p>}
      <DS.TextLink onClick={() => gs.go('pass')}>About the Pass</DS.TextLink>
    </div>
  );
};

// ---- Axis B: how the games are grouped. Rhythm: Every day, Every week, In chapters, More games. Genre: canon's genres in canon order.
const cghGroups = (b) => (b === '1'
  ? [['Every day', (k) => gsRhythm(k) === 'daily'], ['Every week', (k) => gsRhythm(k) === 'weekly'], ['In chapters', (k) => !gsRhythm(k) && !!GS_GAMES[k].eds], ['More games', (k) => !gsRhythm(k) && !GS_GAMES[k].eds]]
  : GS_KINDS.map((c) => [gsKind(c), (k) => GS_GAMES[k].category === c]));

const CghBody = () => {
  const gs = useGs(); const v = useCgh();
  const [q, setQ] = React.useState(''); const [on, setOn] = React.useState(gs.route.on || []);
  React.useEffect(() => { setOn(gs.route.on || []); }, [gs.route]);
  const kinds = GS_KINDS.filter((c) => on.includes(c)); const free = on.includes('free');
  const rhy = GS_RHYTHMS.map(([x]) => x).filter((x) => on.includes(x));
  const ids = CGH_SHOWN.filter((k) => (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!rhy.length || rhy.includes(gsRhythm(k))) && (!free || cghHasFree(k)) && gsFind(q, k));
  const flip = (x) => setOn((a) => (a.includes(x) ? a.filter((y) => y !== x) : a.concat(x)));
  const tools = React.useRef(null);
  const clear = () => { setOn([]); setQ(''); setTimeout(() => { const i = tools.current && tools.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
  const wait = useGsPart([q, on.join()]);
  const filtering = on.length > 0 || !!q.trim();
  const groups = cghGroups(v.b).map(([t, fit]) => [t, ids.filter(fit)]).filter(([, l]) => l.length);
  return <>
    <div className="cgh-top">
      <div className="dc-tools" ref={tools}>
        <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="dc-chips" role="group" aria-label="Show only">
          {[...GS_KINDS.map((c) => [c, gsKind(c)]), ...GS_RHYTHMS, ['free', 'Free']].map(([x, l]) => <button key={x} type="button" aria-pressed={on.includes(x)} onClick={() => flip(x)}>{l}</button>)}
        </div>
      </div>
      {filtering ? <div><DS.TextLink onClick={clear}>Clear</DS.TextLink></div> : null}
    </div>
    {wait ? <GsPart label="Loading games" /> : groups.length ? groups.map(([t, l]) => (
      <section key={t} className="dc-sec" aria-label={t}>
        <h2 className="mcp-t-sec">{t}</h2>
        <div className="mcp-gwall">{l.map((k) => <CghTile key={k} id={k} />)}</div>
      </section>
    )) : <div className="dc-empty"><p>No game matches that.</p><DS.TextLink onClick={clear}>Show every game</DS.TextLink></div>}
    <CghPassFoot />
  </>;
};
// The page shell is canon's GsDiscover with CghBody in place of DcBody: DcBody is reached by its file-scoped
// name, so it cannot be re-published from outside (skills/candidate-build, Traps). Loading and failed states as canon.
const CghDiscover = () => {
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
        : <CghBody />}
    </main>
  </>);
};

Object.assign(window, { GsGames: CghDiscover, CandGH: cghStore, useCandGH: useCgh, CAND_GH_DEFAULTS: CGH_DEFAULTS });
