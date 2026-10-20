// Playground round 2: four studies, three options each (4 to 15), 2026-10-09.
// Loads after pg-games-library.jsx (reuses its seed games, cards, routes and placeholder pages) and before main.jsx.
// Overrides GsTopBar (a copy of app/gs-parts.jsx GsTopBar with the link list and logo target per option), GsHome
// (signed in only; signed out is the app's own), GsGames and GsDemoBar. Nothing in app/ is edited.
const P2_KEY = 'pg_games_library_v2';
let p2 = { study: 'store', store: '4', names: 'now', home: '10', lib: '13', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(P2_KEY)) || {}; } catch (e) { return {}; } })() };
const p2Subs = new Set();
const p2Set = (p) => { p2 = { ...p2, ...p }; try { localStorage.setItem(P2_KEY, JSON.stringify(p2)); } catch (e) {} p2Subs.forEach((f) => f(p2)); };
const useP2 = () => { const [s, setS] = React.useState(p2); React.useEffect(() => { p2Subs.add(setS); return () => p2Subs.delete(setS); }, []); return s; };

// ---- Seed (not decisions) ----
const P2_FEATURE = 'derelict';
const P2_ADDED = ['harbour', 'scribe', 'barrow', 'cipher'];
const P2_DAY = ['word', 'groups', 'mystery', 'cipher'];
const P2_WEEK = ['escape', 'casebook', 'delve', 'derelict', 'harbour'];
const P2_PROGRESS = { pass: [['barrow', 'You’re on level 2 of 5.'], ['hunter', 'You stopped at the river crossing.']], free: [] };
const P2_STREAK = { pass: 6 };
const p2Played = (view, k) => /^Played/.test(pgMe(view, k)[1]);
const p2Can = (view, k) => GS_GAMES[k].free || view === 'pass';
const p2Chev = <DS.Icon name="down" size={16} className="lb-chev" style={{ transform: 'rotate(-90deg)' }} />;

// ---- Names study ----
const P2_NAMES = {
  now: { store: 'Games', lib: 'Library' },
  '7': { store: 'Store', lib: 'Library' },
  '8': { store: 'Discover', lib: 'Play' },
  '9': { store: 'Games', lib: 'Record' },
};
const p2N = (s) => P2_NAMES[s.names] || P2_NAMES.now;

// ---- Small parts ----
const P2Ed = ({ id, line, mark, onClick, after }) => {
  const g = GS_GAMES[id];
  return (
    <li>
      <button type="button" className="p2-erow" onClick={onClick}>
        <GpMini art={g.art} />
        <span className="p2-erow-tx"><span className="p2-title">{g.name}</span><span className="gs-small">{line}</span></span>
        <span>{mark ? <DS.Tag kind="daily" icon="check">{mark}</DS.Tag> : after || null}</span>
        {p2Chev}
      </button>
    </li>
  );
};
const P2Box = ({ title, action, children }) => (
  <section className="lb-box p2-box">
    <div className="p2-boxhead"><h2 className="mcp-t-card">{title}</h2>{action}</div>
    <ul className="lb-list p2-list">{children}</ul>
  </section>
);
const P2PassBand = ({ line }) => {
  const gs = useGs(); if (gs.view === 'pass') return null;
  return (
    <DS.Card>
      <div className="p2-band">
        <p className="gs-lead"><b>{line}</b></p>
        <DS.Button variant="secondary" onClick={() => gs.go('pass')}>What’s included</DS.Button>
      </div>
    </DS.Card>
  );
};
const P2Row = ({ title, ids, label }) => {
  const marks = gsMarks(useGs().view);
  return (
    <section className="gl-sec">
      <h2 className="mcp-t-sec">{title}</h2>
      <div className="gs-feats" role="region" aria-label={label || title} tabIndex={0}>{ids.map((k) => <PgCardRow key={k} id={k} mark={marks[k]} />)}</div>
    </section>
  );
};

// ---- Storefront study (4 to 6) ----
const P2Hero = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const m = PG_MORE[id] || {}; const open = () => pgOpen(gs, id);
  return (
    <DS.Card style={{ justifyItems: 'stretch' }}>
      <div className="p2-hero">
        <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
        <div className="p2-hero-body">
          <span className="gs-label">NEW THIS WEEK</span>
          <h2 className="mcp-t-sec">{g.name}</h2>
          <p className="gs-lead">{g.blurb}</p>
          {m.line && <p className="gs-muted">{m.line}</p>}
          <GsTagList tags={g.tags} />
          <DS.Button onClick={open}>{'See ' + g.name}</DS.Button>
        </div>
      </div>
    </DS.Card>
  );
};
// 4 · Shop window
const P2S4 = () => (
  <>
    <P2Hero id={P2_FEATURE} />
    <P2Row title="Just added" ids={P2_ADDED} />
    <P2Row title="Free to play" ids={PG_ORDER.filter((k) => GS_GAMES[k].free)} />
    <P2PassBand line="The Pass gets you every game here, and every new one on its release day." />
    {PG_CATS.map((c) => <P2Row key={c} title={pgCat(c)} ids={PG_ORDER.filter((k) => GS_GAMES[k].category === c)} />)}
  </>
);
// 5 · Cover wall
const P2Tile = ({ id, line }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => pgOpen(gs, id); const mark = gsMarks(gs.view)[id];
  return (
    <div className="p2-tile">
      <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
      <button type="button" className="p2-tile-name" onClick={open}>{g.name}</button>
      <span className="gs-small">{line || pgCat(g.category) + (g.free ? ' · Free' : '')}</span>
      {mark && <span><DS.Tag kind="daily" icon="check">{mark}</DS.Tag></span>}
    </div>
  );
};
const P2Pick = ({ id, label }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => pgOpen(gs, id);
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-gcard"><GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} /></div>
      <PgHead g={g} open={open} label={label} />
      <GsTagList tags={g.tags} />
    </DS.Card>
  );
};
const P2S5 = () => {
  const gs = useGs(); const [on, setOn] = React.useState([]);
  const kinds = PG_CATS.filter((c) => on.includes(c)); const free = on.includes('free');
  const ids = PG_ORDER.filter((k) => (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!free || GS_GAMES[k].free));
  const flip = (v) => setOn((a) => (a.includes(v) ? a.filter((x) => x !== v) : a.concat(v)));
  const cells = ids.map((k) => <P2Tile key={k} id={k} />);
  if (gs.view !== 'pass' && !on.length) cells.splice(Math.min(5, cells.length), 0, (
    <div key="pass" className="p2-passtile"><p><b>Every game here comes with the Pass.</b></p><DS.TextLink onClick={() => gs.go('pass')}>What’s included</DS.TextLink></div>
  ));
  return (
    <>
      <div className="gs-grid2"><P2Pick id={P2_FEATURE} label="NEW THIS WEEK" /><P2Pick id="cipher" label="FREE EVERY DAY" /></div>
      <section className="gl-sec">
        <div className="gs-sec-head"><h2 className="mcp-t-sec">Every game</h2>{on.length ? <DS.TextLink onClick={() => setOn([])}>Clear</DS.TextLink> : null}</div>
        <div className="gl-chips" role="group" aria-label="Show only">
          {[...PG_CATS.map((c) => [c, pgCat(c)]), ['free', 'Free']].map(([v, l]) => <button key={v} type="button" aria-pressed={on.includes(v)} onClick={() => flip(v)}>{l}</button>)}
        </div>
        {ids.length ? <div className="p2-wall">{cells}</div>
          : <div className="gl-empty"><p>No game is all of those.</p><DS.TextLink onClick={() => setOn([])}>Show every game</DS.TextLink></div>}
      </section>
    </>
  );
};
// 6 · What's out now
const P2S6 = () => {
  const gs = useGs(); const marks = gsMarks(gs.view);
  const ed = (k) => <P2Ed key={k} id={k} line={(PG_MORE[k] && PG_MORE[k].head) || pgCat(GS_GAMES[k].category)} mark={marks[k]}
    after={GS_GAMES[k].free ? <DS.Tag kind="free">Free</DS.Tag> : null} onClick={() => pgOpen(gs, k)} />;
  const az = PG_ORDER.slice().sort((a, b) => GS_GAMES[a].name.localeCompare(GS_GAMES[b].name));
  return (
    <>
      <div className="p2-two">
        <P2Box title="Out today">{P2_DAY.map(ed)}</P2Box>
        <P2Box title="Out this week">{P2_WEEK.map(ed)}</P2Box>
      </div>
      <P2Row title="Just added" ids={P2_ADDED} />
      <P2PassBand line="The Pass gets you every game here, and every earlier edition." />
      <P2Box title="Every game, A to Z">
        {az.map((k) => <P2Ed key={k} id={k} line={pgCat(GS_GAMES[k].category)} onClick={() => pgOpen(gs, k)} />)}
      </P2Box>
    </>
  );
};
const P2_STORE = { '4': P2S4, '5': P2S5, '6': P2S6 };

// ---- Library study (13 to 15), plus the Ready to play band from option 11 ----
const P2LibRow = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id];
  return <P2Ed id={id} line={pgCat(g.category) + ' · ' + pgMe(gs.view, id)[1]} onClick={() => pgOpenLib(gs, id)} />;
};
const P2LibTile = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => pgOpenLib(gs, id);
  return (
    <div className="p2-tile">
      <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
      <button type="button" className="p2-tile-name" onClick={open}>{g.name}</button>
      <span className="gs-small">{pgMe(gs.view, id)[1]}</span>
    </div>
  );
};
const p2Ready = (view) => {
  const prog = (P2_PROGRESS[view] || []).map(([k, l]) => [k, l, 'Carry on with ']);
  const ed = [...P2_DAY, ...P2_WEEK].filter((k) => p2Can(view, k) && !p2Played(view, k))
    .map((k) => [k, (PG_MORE[k] && PG_MORE[k].head) || '', P2_DAY.includes(k) ? 'Play today’s ' : 'Play this week’s ']);
  return prog.concat(ed);
};
const P2ReadyBand = () => {
  const gs = useGs(); const rows = p2Ready(gs.view);
  return (
    <P2Box title="Ready to play">
      {rows.length ? rows.map(([k, l]) => <P2Ed key={k} id={k} line={l} onClick={() => pgOpenLib(gs, k)} />)
        : <li className="lb-empty gs-muted">You’ve played everything that’s out. New editions arrive tomorrow.</li>}
    </P2Box>
  );
};
const P2Library = () => {
  const gs = useGs(); const s = useP2();
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState('all'); const [sort, setSort] = React.useState('last');
  const rank = (k) => { const r = pgMe(gs.view, k)[0]; return r == null ? 99 : r; };
  const byRank = (a, b) => rank(a) - rank(b) || GS_GAMES[a].name.localeCompare(GS_GAMES[b].name);
  let ids = PG_ORDER.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && pgFind(q, k));
  ids = ids.slice().sort((a, b) => (sort === 'az' ? GS_GAMES[a].name.localeCompare(GS_GAMES[b].name) : byRank(a, b)));
  const recent = s.lib === '15' ? PG_ORDER.filter((k) => rank(k) < 99).sort(byRank).slice(0, 3) : [];
  const empty = <div className="gl-empty"><p>{'No game matches “' + q + '”.'}</p><DS.TextLink onClick={() => { setQ(''); setCat('all'); }}>Show every game</DS.TextLink></div>;
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">{p2N(s).lib}</h1>
      {s.home === '11' && <P2ReadyBand />}
      {recent.length > 0 && (
        <section className="gl-sec">
          <h2 className="mcp-t-sec">Played lately</h2>
          <div className="p2-recent">{recent.map((k) => <P2LibTile key={k} id={k} />)}</div>
        </section>
      )}
      <div className="lb-alllay">
        <aside className="lb-tools">
          <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Kind" value={cat} opts={[['all', 'All games'], ...PG_CATS.map((c) => [c, pgCat(c)])]} onPick={setCat} />
          <LbChoice label="Order" value={sort} opts={[['last', 'Last played'], ['az', 'A to Z']]} onPick={setSort} />
        </aside>
        {!ids.length ? <div className="lb-box">{empty}</div>
          : s.lib === '14' ? <div className="p2-wall">{ids.map((k) => <P2LibTile key={k} id={k} />)}</div>
          : s.lib === '15' ? (
            <div className="lb-box"><DS.RowList label="Every game">
              {ids.map((k) => <DS.ListRow key={k} title={GS_GAMES[k].name} onClick={() => pgOpenLib(gs, k)}
                meta={<><span>{pgCat(GS_GAMES[k].category)}</span><span>{pgMe(gs.view, k)[1]}</span></>} />)}
            </DS.RowList></div>
          ) : <div className="lb-box"><ul className="lb-list p2-list">{ids.map((k) => <P2LibRow key={k} id={k} />)}</ul></div>}
      </div>
    </main>
  );
};

// ---- Signed-in study (10 to 12) ----
// 10 · Today
const P2Today = () => {
  const gs = useGs(); const s = useP2(); const marks = gsMarks(gs.view); const n = p2N(s);
  const prog = P2_PROGRESS[gs.view] || [];
  const ed = (k) => <P2Ed key={k} id={k} line={p2Can(gs.view, k) ? ((PG_MORE[k] && PG_MORE[k].head) || '') : 'Part of the Pass'} mark={marks[k]} onClick={() => pgOpenLib(gs, k)} />;
  const streak = P2_STREAK[gs.view];
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Today</h1>
      <div className="p2-two">
        <P2Box title="Carry on">
          {prog.length ? prog.map(([k, l]) => <P2Ed key={k} id={k} line={l} onClick={() => pgOpenLib(gs, k)} />)
            : <li className="lb-empty gs-muted">Nothing’s in progress. Today’s puzzles are below.</li>}
        </P2Box>
        <section className="lb-card">
          <h2 className="mcp-t-card">Your streak</h2>
          {streak ? <><p className="gs-figure">{streak + ' days'}</p><p className="gs-muted">{'Play one of today’s puzzles to make it ' + (streak + 1) + '.'}</p></>
            : <><p className="gs-muted">Your results last today only. Get the Pass to keep your streak.</p><div><DS.TextLink onClick={() => gs.go('pass')}>What’s included</DS.TextLink></div></>}
        </section>
      </div>
      <div className="p2-two">
        <P2Box title="Out today">{P2_DAY.map(ed)}</P2Box>
        <P2Box title="Out this week">{P2_WEEK.map(ed)}</P2Box>
      </div>
      <section className="gl-sec">
        <div className="gs-sec-head"><h2 className="mcp-t-sec">Just added</h2><DS.TextLink onClick={() => gs.go('games')}>{'All of ' + n.store}</DS.TextLink></div>
        <div className="gs-feats" role="region" aria-label="Just added" tabIndex={0}>{P2_ADDED.map((k) => <PgCardRow key={k} id={k} />)}</div>
      </section>
    </main>
  );
};
// 12 · Say it to your AI
const P2Copy = ({ text }) => {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { if (!done) return undefined; const t = setTimeout(() => setDone(false), 2000); return () => clearTimeout(t); }, [done]);
  return <DS.Button variant="secondary" onClick={() => { try { navigator.clipboard.writeText(text).catch(() => {}); } catch (e) {} setDone(true); }}>{done ? 'Copied' : 'Copy'}</DS.Button>;
};
const P2Launch = () => {
  const gs = useGs(); const s = useP2(); const n = p2N(s);
  const rows = p2Ready(gs.view);
  const done = [...P2_DAY, ...P2_WEEK].filter((k) => p2Played(gs.view, k));
  return (
    <main className="gs-wrap gs-main">
      <div className="gs-stack-sm">
        <h1 className="gs-h1">Play now</h1>
        <p className="gs-muted gs-measure">Say one of these to your AI and it starts the game.</p>
      </div>
      {!gs.connected ? (
        <DS.Card><div className="p2-band"><p className="gs-lead">Connect your AI to start playing. It takes about two minutes.</p><DS.Button onClick={() => gs.go('connect')}>Connect your AI</DS.Button></div></DS.Card>
      ) : (
        <div className="p2-launchlay">
          <section className="lb-box p2-box">
            <div className="p2-boxhead"><h2 className="mcp-t-card">Ready now</h2></div>
            <ul className="lb-list">
              {rows.map(([k, , pre]) => { const line = pre + GS_GAMES[k].name; return (
                <li key={k} className="p2-say">
                  <GpMini art={GS_GAMES[k].art} />
                  <span className="p2-erow-tx"><span className="p2-line">{'“' + line + '”'}</span><button type="button" className="gs-inlink gs-small" onClick={() => pgOpenLib(gs, k)}>{GS_GAMES[k].name}</button></span>
                  <P2Copy text={line} />
                </li>
              ); })}
            </ul>
          </section>
          <div className="gs-stack-md">
            {done.length > 0 && (
              <section className="lb-card">
                <h2 className="mcp-t-card">Played</h2>
                <ul className="gs-plain">{done.map((k) => <li key={k}><span className="lb-v is-ok"><DS.Icon name="check" size={16} /></span>{GS_GAMES[k].name}</li>)}</ul>
              </section>
            )}
            <section className="lb-card">
              <p>You can also ask for any game by name.</p>
              <div><DS.TextLink onClick={() => gs.go('games')}>{'See ' + n.store}</DS.TextLink></div>
            </section>
            <P2PassBand line="Get the Pass to play the full game library." />
          </div>
        </div>
      )}
    </main>
  );
};
const P2_ORIG_HOME = GsHome;
const P2Home = () => {
  const gs = useGs(); const s = useP2();
  if (gs.view === 'out') return <P2_ORIG_HOME />;
  if (s.home === '11') return <P2Library />;
  return s.home === '12' ? <P2Launch /> : <P2Today />;
};

const P2Games = () => {
  const gs = useGs(); const s = useP2(); const r = gs.route;
  if (r.pid) return r.page === 'record' && gs.view !== 'out' ? <PgPlaceLib id={r.pid} /> : <GsGamePage id={r.pid} top={gs.view !== 'out' ? <PgLibCard id={r.pid} /> : null} />;
  if (r.lib && gs.view !== 'out') return <P2Library />;
  const B = P2_STORE[s.store] || P2S4;
  return <main className="gs-wrap gs-main"><h1 className="gs-h1">{p2N(s).store}</h1><B /></main>;
};

// ---- Top bar: copy of app/gs-parts.jsx GsTopBar; links and logo target follow the options ----
const p2Here = (gs) => {
  const r = gs.route;
  if (r.name === 'home') return 'home';
  if (r.name === 'history') return 'history';
  if (gs.view !== 'out' && (r.lib || r.page === 'record')) return 'lib';
  if (r.name === 'games' || GS_GAME_ORDER.some((k) => GS_GAMES[k].route === r.name)) return 'store';
  return r.name;
};
const P2TopBar = () => {
  const gs = useGs(); const s = useP2(); const n = p2N(s);
  const [menu, setMenu] = React.useState(false);
  const mwrap = React.useRef(null);
  gsUseMenuDismiss(menu, setMenu, mwrap);
  const out = gs.view === 'out';
  const L = {
    home: ['home', 'Today', () => gs.go('home')],
    store: ['store', n.store, () => gs.go('games')],
    lib: ['lib', n.lib, () => gs.go(s.home === '11' ? 'home' : 'games', s.home === '11' ? {} : { lib: true })],
    history: ['history', 'History', () => gs.go('history')],
  };
  let links = out ? [L.store, ['how', 'How it works', gs.goHow], ['pass', 'Pricing', () => gs.go('pass')]]
    : s.home === '10' ? [L.home, L.lib, L.store, L.history] : s.home === '11' ? [L.lib, L.store, L.history] : [L.store, L.lib, L.history];
  if (s.names === '9') links = links.filter((l) => l[0] !== 'history');
  const here = p2Here(gs); const cur = here === 'home' && s.home === '11' && !out ? 'lib' : here;
  const logo = () => gs.go('home');
  const pick = (fn) => { setMenu(false); fn(); };
  return (
    <header className="gs-top">
      <div className="gs-wrap gs-top-in">
        <button type="button" className="gs-brand" aria-label="[Platform], home" onClick={logo}><GsMark /><span>[Platform]</span></button>
        <nav className="gs-nav" aria-label="Main">
          {links.map(([id, l, fn]) => <button key={id} type="button" className="gs-navlink" aria-current={cur === id ? 'page' : undefined} onClick={fn}>{l}</button>)}
        </nav>
        <div className="gs-top-end">
          {out ? (
            <div className="gs-wide-only">
              <button type="button" className="gs-navlink" onClick={() => gs.go('signin')}>Sign in</button>
              <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            </div>
          ) : <div className="gs-wide-only"><GsUserMenu /></div>}
          <div className="gs-narrow-only gs-menu-anchor" ref={mwrap}>
            <DS.Button variant="secondary" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>Menu</DS.Button>
            {menu && (
              <div className="gs-pop" role="menu" aria-label="Menu">
                {links.map(([id, l, fn]) => <button key={id} type="button" role="menuitem" className="gs-menu-item" onClick={() => pick(fn)}>{l}</button>)}
                {out && <button type="button" role="menuitem" className="gs-menu-item" onClick={() => pick(() => gs.go('signin'))}>Sign in</button>}
                {out ? <div className="gs-pop-cta"><DS.Button block onClick={() => pick(gs.startFree)}>Start free</DS.Button></div>
                  : <><div className="gs-menu-div" role="separator" /><GsIdentityHead /><GsUserItems role="menuitem" pick={pick} /></>}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ---- Studies and their options ----
const P2_STUDIES = [
  { id: 'store', name: 'Storefront', opts: [
    { id: '4', name: 'Shop window', idea: 'One new game leads in a big feature. Under it come rows: just added, free to play, then one row for each kind. The Pass gets a band of its own between them.', cost: 'Lots of rows on a phone, and cards past the first few hide off the edge. Someone has to choose the feature every week.' },
    { id: '5', name: 'Cover wall', idea: 'Two picks at the top, then every game as a cover tile in one wall. You can filter by more than one kind at once. The Pass sits in the wall as a tile.', cost: 'The covers carry the page, so it is only as good as the art. A tile has room for a name and one line, not a blurb.' },
    { id: '6', name: 'What’s out now', idea: 'The store is arranged by release: today’s editions and this week’s side by side, then what just arrived, then every game in a short A to Z list.', cost: 'A game with no schedule only shows in Just added and the A to Z. It leans on editions being the draw.' },
  ] },
  { id: 'names', name: 'Names', opts: [
    { id: 'now', name: 'Games and Library', idea: 'The names as they are now, so you can compare.', cost: '“Games” names the store and the things in it, so the store and a game’s page blur.' },
    { id: '7', name: 'Store and Library', idea: 'Store says plainly that it is where you look around. Library keeps its meaning: the games you can play.', cost: 'Store suggests you buy games one at a time, and the Pass is the only thing sold.' },
    { id: '8', name: 'Discover and Play', idea: 'Two verbs. Discover is for finding something new. Play is where you go to carry on.', cost: 'Verbs in a top bar read like buttons, and Play suggests play happens on the site when it happens in chat.' },
    { id: '9', name: 'Games and Record', idea: 'Games stays the store. Library becomes Record: your results and history across every game. It absorbs History, which leaves the top bar.', cost: 'Record undersells the page as a way back into a game, and breaks the link to “the full game library” in the Pass copy.' },
  ] },
  { id: 'home', name: 'Signed in', opts: [
    { id: '10', name: 'A Today page', idea: 'Signed in, Home becomes Today: what you are in the middle of, your streak, today’s and this week’s editions, and what just arrived. The logo and a Today link take you there.', cost: 'One more place to look, and much of it repeats the Library and the store.' },
    { id: '11', name: 'Library is home', idea: 'Signed in, there is no home page. The logo opens the Library, which gains a Ready to play box of what you haven’t played yet.', cost: 'The Library gets busier, and nothing signed in tells you what is new in the store.' },
    { id: '12', name: 'Say it to your AI', idea: 'Play happens in chat, so Home hands you the words. It lists a line to say to your AI for everything ready now, with a Copy button.', cost: 'Typing the line yourself is just as quick, so Copy may be worth little. It means nothing until your AI is connected.' },
  ] },
  { id: 'lib', name: 'Library', opts: [
    { id: '13', name: 'Rows with covers', idea: 'The list you liked, with a small cover on each row.', cost: 'At this size a cover is mostly colour, and every row gets a little taller.' },
    { id: '14', name: 'Cover grid', idea: 'Every game as a cover tile with its state underneath, beside the same search and filters.', cost: 'Fewer games per screen than a list, and the state line gets cramped on a phone.' },
    { id: '15', name: 'Played lately on top', idea: 'Your three most recent games as big covers, then the plain list for everything.', cost: 'Two ways of showing a game on one page, and the top three repeat in the list.' },
  ] },
];
const p2Study = (s) => P2_STUDIES.find((x) => x.id === s.study) || P2_STUDIES[0];
const p2Opt = (s) => { const st = p2Study(s); return st.opts.find((o) => o.id === s[st.id]) || st.opts[0]; };

// ---- Strip ----
let p2Booted = false;
const P2Strip = () => {
  const gs = useGs(); const s = useP2(); const st = p2Study(s); const o = p2Opt(s);
  const [why, setWhy] = React.useState(false);
  const show = (id) => {
    if (id === 'store' || id === 'names') { gs.go('games'); return; }
    if (gs.view === 'out') { gs.setView('pass'); gs.setConnected(true); }
    if (id === 'home') gs.go('home'); else gs.go(p2.home === '11' ? 'home' : 'games', p2.home === '11' ? {} : { lib: true });
  };
  React.useEffect(() => { if (!p2Booted) { p2Booted = true; gs.setView('out'); setTimeout(() => window.gsApi.go('games'), 0); } }, []);
  const view = (v) => {
    gs.setView(v); gs.setConnected(v !== 'out');
    if (v === 'out' && (gs.route.lib || GS_SIGNED_IN_ONLY.includes(gs.route.name))) gs.go('games');
  };
  const study = (id) => { p2Set({ study: id }); show(id); };
  const pick = (id) => { p2Set({ [st.id]: id }); if (st.id !== 'names') show(st.id); };
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Study</span>
            {seg(P2_STUDIES.map((x) => [x.id, x.name]), st.id, study)}
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {st.opts.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => p2Set({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">View</span>
            {seg([['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']], gs.view, view)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => p2Set({ open: true })}>{'Show · ' + st.name + ' ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">Every study’s current pick applies at once, so you can combine them. Daily Cipher, Derelict, Harbour Master, The Barrow of Hollowmere and The Scribe of Ur are placeholder games.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsTopBar: P2TopBar, GsHome: P2Home, GsGames: P2Games, GsDemoBar: P2Strip });
