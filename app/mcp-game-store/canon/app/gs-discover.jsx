// ============================================================================
// [Platform] — Discover (route `games`) and Library (route `library`).
// Discover: round 4 option 16 with Joe's changes, 2026-10-09: two picks, Free to play, the Pass band,
// then All games with search and kind chips (Free last), no Pass tile in the wall, no Free tag on the tiles. Just added sits under the picks (Joe).
// Library: option 13, rows with covers. Names Discover and Library. (docs/specs/games-and-library/)
// Loads after gs-player.jsx; replaces GsGames.
// ============================================================================
const gsKind = (c) => c.charAt(0) + c.slice(1).toLowerCase();
const GS_KINDS = GS_GAME_ORDER.map((k) => GS_GAMES[k].category).filter((c, i, a) => a.indexOf(c) === i);
const gsFind = (q, k) => { const g = GS_GAMES[k]; const s = q.trim().toLowerCase(); return !s || g.name.toLowerCase().includes(s); };
// The two picks: chosen by us, not by rule. Seed.
const GS_PICKS = [['casebook', 'A NEW CASE EVERY WEEK'], ['word', 'FREE EVERY DAY']];
// Just added: newest first. Seed (the app has no release dates yet).
const GS_ADDED = ['hunter', 'casebook', 'delve', 'escape'];
const GS_PASS_BAND = 'The Pass opens every edition of every game here, and every new game on its release day.';
const dcChev = <DS.Icon name="down" size={16} className="lb-chev" style={{ transform: 'rotate(-90deg)' }} />;

const DcHead = ({ g, mark, open, label }) => (
  <div className="gs-stack-sm">
    {label && <span className="gs-label">{label}</span>}
    <div className="gs-title-row">
      <h3 className="mcp-t-card"><button type="button" className="gs-titlebtn" onClick={open}>{g.name}</button></h3>
      {mark && <DS.Tag kind="daily" icon="check">{mark}</DS.Tag>}
    </div>
    <p className="gs-muted">{g.blurb}</p>
  </div>
);
const DcPick = ({ id, label }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => gs.go(g.route); const host = useGsArtHost();
  return (
    <DS.Card className="mcp-art-host gs-host" style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-gcard" ref={host}><GsArt art={g.art} shape="wide" /></div>
      <DcHead g={g} open={open} label={label} />
      <GsTagList tags={g.tags} ed={g.ed} />
    </DS.Card>
  );
};
const DcRowCard = ({ id, mark }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => gs.go(g.route); const host = useGsArtHost();
  return (
    <DS.Card className="mcp-art-host gs-host" style={{ justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-feat" ref={host}>
        <GsArt art={g.art} shape="wide" />
        <div className="gs-feat-body"><DcHead g={g} mark={mark} open={open} /><GsTagList tags={g.tags} ed={g.ed} /></div>
      </div>
    </DS.Card>
  );
};
const DcTile = ({ id, mark }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => gs.go(g.route); const host = useGsArtHost();
  return (
    <div className="dc-tile mcp-art-host gs-host" ref={host}>
      <GsArt art={g.art} shape="square" />
      <button type="button" className="dc-tile-name" onClick={open}>{g.name}</button>
      <span className="gs-small">{gsKind(g.category)}</span>
      {mark && <span className="dc-tags"><DS.Tag kind="daily" icon="check">{mark}</DS.Tag></span>}
    </div>
  );
};
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
  const clear = () => { setOn([]); setQ(''); };
  const freeIds = GS_GAME_ORDER.filter((k) => GS_GAMES[k].free);
  const wait = useGsPart([q, on.join()]);
  return <>
    <div className="gs-grid2">{GS_PICKS.map(([k, l]) => <DcPick key={k} id={k} label={l} />)}</div>
    <section className="dc-sec">
      <h2 className="mcp-t-sec">Just added</h2>
      <div className="gs-feats" role="region" aria-label="Just added" tabIndex={0}>{GS_ADDED.map((k) => <DcRowCard key={k} id={k} />)}</div>
    </section>
    <section className="dc-sec">
      <div className="gs-stack-sm"><h2 className="mcp-t-sec">Free to play</h2><p className="gs-muted">{GS_NAME.casebook + '’s first case and Delve’s first scene are free.'}</p></div>
      <div className="gs-feats" role="region" aria-label="Free to play" tabIndex={0}>{freeIds.map((k) => <DcRowCard key={k} id={k} />)}</div>
    </section>
    <DcPassBand />
    <section className="dc-sec">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">All games</h2>{on.length || q.trim() ? <DS.TextLink onClick={clear}>Clear</DS.TextLink> : null}</div>
      <div className="dc-tools">
        <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="dc-chips" role="group" aria-label="Show only">
          {[...GS_KINDS.map((c) => [c, gsKind(c)]), ...GS_RHYTHMS, ['free', 'Free']].map(([v, l]) => <button key={v} type="button" aria-pressed={on.includes(v)} onClick={() => flip(v)}>{l}</button>)}
        </div>
      </div>
      {wait ? <GsPart label="Loading games" /> : ids.length ? <div className="dc-wall">{ids.map((k) => <DcTile key={k} id={k} />)}</div>
        : <div className="dc-empty"><p>No game matches that.</p><DS.TextLink onClick={clear}>Show every game</DS.TextLink></div>}
    </section>
  </>;
};
// Its content region can stage loading in place and a failed load; the top bar and footer stay.
const GsDiscover = () => {
  const gs = useGs();
  const [load, setLoad] = React.useState(gs.route.load || null);
  React.useEffect(() => { setLoad(gs.route.load || null); }, [gs.route]);
  React.useEffect(() => {
    if (load !== 'loading') return undefined;
    const t = setTimeout(() => setLoad(null), 1200);
    return () => clearTimeout(t);
  }, [load]);
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Discover</h1>
      {load === 'hold' || load === 'loading' ? <div className="gs-inplace"><GsSpin /></div>
        : load === 'failed' ? <GsLoadFailed onRetry={() => setLoad(null)} />
        : <DcBody />}
    </main>
  );
};

// ---- Library: every game, with where this player stands in it. [sort rank, line]. Seed only. ----
const GS_LIB_ME = {
  lapsed: { word: [1, 'Played today'], groups: [null, 'Not played today'], mystery: [null, 'Not played today'], escape: [null, 'Not played this week'],
    casebook: [5, 'Last played 13 September'], delve: [6, 'Last played 14 September'], hunter: [7, 'Last played 17 September'] },
  pass: { word: [1, 'Played today'], groups: [2, 'Played today'], mystery: [3, 'Played today'], escape: [4, 'Played this week'], casebook: [5, 'Played this week'],
    delve: [6, 'Played this week'], hunter: [7, 'Last played 5 October'] },
  free: { word: [1, 'Played today'], groups: [null, 'Not played today'], mystery: [null, 'Not played today'], escape: [null, 'Not played this week'],
    casebook: [5, 'First case played'], delve: [6, 'First scene played'], hunter: [null, 'Only with the Pass'] },
};
const gsLibMe0 = (view, k, lapsed) => (GS_LIB_ME[lapsed ? 'lapsed' : view] && GS_LIB_ME[lapsed ? 'lapsed' : view][k]) || [null, 'Free first ' + ((GS_GAMES[k] && GS_GAMES[k].ed) ? GS_GAMES[k].ed[0] : 'edition')];
// An edition in progress says so wherever a mark would say it was played, for every player.
const gsLibMe = (view, k, lapsed, live) => { const r = gsLibMe0(view, k, lapsed);
  return live && (/^Played (today|this week)$/.test(r[1]) || (!lapsed && /^First \w+ played$/.test(r[1]))) ? [r[0], 'In progress'] : r; };
const GsLibrary = () => {
  const gs = useGs();
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState(gs.route.kind || 'all'); const [sort, setSort] = React.useState('last');
  const [rhy, setRhy] = React.useState(gs.route.rhythm || 'all');
  React.useEffect(() => { setCat(gs.route.kind || 'all'); setRhy(gs.route.rhythm || 'all'); }, [gs.route]);
  const wait = useGsPart([q, cat, rhy, sort]);
  const rank = (k) => { const r = gsLibMe(gs.view, k, gsLapsed(gs), !lbWeekDone(gs))[0]; return r == null ? 99 : r; };
  const az = (a, b) => GS_GAMES[a].name.localeCompare(GS_GAMES[b].name);
  const ids = GS_GAME_ORDER.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && (rhy === 'all' || gsRhythm(k) === rhy) && gsFind(q, k))
    .sort((a, b) => (sort === 'az' ? az(a, b) : rank(a) - rank(b) || az(a, b)));
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Library</h1>
      <div className="lb-alllay">
        <aside className="lb-tools">
          <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Kind" value={cat} opts={[['all', 'All games'], ...GS_KINDS.map((c) => [c, gsKind(c)])]} onPick={setCat} />
          <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={setRhy} />
          <LbChoice label="Order" value={sort} opts={[['last', 'Last played'], ['az', 'A to Z']]} onPick={setSort} />
        </aside>
        <div className="lb-box">
          {wait ? <GsPart label="Loading games" /> : ids.length ? (
            <ul className="lb-list">{ids.map((k) => { const g = GS_GAMES[k]; return (
              <li key={k}>
                <button type="button" className="dc-lrow" onClick={() => gs.go(g.route, { page: 'record' })}>
                  <GpMini art={g.art} />
                  <span className="dc-lrow-tx"><span className="dc-lrow-t">{g.name}</span><span className="gs-small">{gsKind(g.category) + ' · ' + gsLibMe(gs.view, k, gsLapsed(gs), !lbWeekDone(gs))[1]}</span></span>
                  {dcChev}
                </button>
              </li>
            ); })}</ul>
          ) : <div className="dc-empty"><p>{q.trim() ? 'No game matches “' + q + '”.' : 'No game matches that.'}</p><DS.TextLink onClick={() => { setQ(''); setCat('all'); setRhy('all'); }}>Show every game</DS.TextLink></div>}
        </div>
      </div>
    </main>
  );
};

Object.assign(window, { GsGames: GsDiscover, GsLibrary });
