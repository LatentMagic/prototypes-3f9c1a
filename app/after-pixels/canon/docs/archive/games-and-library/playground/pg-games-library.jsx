// Playground: the Games page (options 1 to 3) and the Library page (one design), 2026-10-09.
// Loads after the app's modules and before main.jsx. Overrides window.GsGames, the top bar's Games and
// Library items, and the demo bar. Nothing in app/ is edited.
// Routes: the Library is route 'games' + { lib: true }; a placeholder game's product page is 'games' + { pid },
// its library game page 'games' + { pid, page: 'record' } (main.jsx's route list can't grow from here).
const PG_KEY = 'pg_games_library_v1';
let pgState = { opt: '1', faded: false, open: true, ...(() => { try { return JSON.parse(localStorage.getItem(PG_KEY)) || {}; } catch (e) { return {}; } })() };
const pgSubs = new Set();
const pgSet = (p) => { pgState = { ...pgState, ...p }; try { localStorage.setItem(PG_KEY, JSON.stringify(pgState)); } catch (e) {} pgSubs.forEach((f) => f(pgState)); };
const usePg = () => { const [s, setS] = React.useState(pgState); React.useEffect(() => { pgSubs.add(setS); return () => pgSubs.delete(setS); }, []); return s; };

// ---- Sample content: five placeholder games (names and categories are not decisions) ----
const PG_SVG = (b) => '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">' + b + '</svg>';
Object.assign(GS_ART, {
  cipher: PG_SVG('<rect width="160" height="120" fill="#163328"/><rect x="24" y="34" width="24" height="24" fill="#F2EBE0"/><rect x="56" y="34" width="24" height="24" fill="#E5A63B"/><rect x="88" y="34" width="24" height="24" fill="#F2EBE0"/><rect x="40" y="66" width="24" height="24" fill="#328A88"/><rect x="72" y="66" width="24" height="24" fill="#F2EBE0"/><rect x="104" y="66" width="24" height="24" fill="#D66847"/>'),
  harbour: PG_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="0" y="84" width="160" height="36" fill="#328A88"/><rect x="26" y="60" width="44" height="24" fill="#D66847"/><rect x="86" y="52" width="48" height="32" fill="#F2EBE0"/><circle cx="130" cy="26" r="10" fill="#E5A63B"/>'),
  scribe: PG_SVG('<rect width="160" height="120" fill="#421A28"/><path d="M30 120L80 40L130 120Z" fill="#E5A63B"/><rect x="66" y="80" width="28" height="40" fill="#421A28"/><rect x="18" y="18" width="12" height="12" fill="#F2EBE0"/><rect x="0" y="108" width="160" height="12" fill="#328A88"/>'),
});
const PG_NEW = {
  cipher: { name: 'Daily Cipher', category: 'PUZZLE', art: 'cipher', free: true, blurb: 'Every letter in today’s line is swapped for another. Crack it.', tags: ['FREE', 'Daily', '10 min'] },
  derelict: { name: 'Derelict', category: 'ADVENTURE', art: 'derelict', blurb: 'The station’s lights are on and nobody answers. Board her.', tags: ['PASS', 'Weekly', '25–40 min'] },
  harbour: { name: 'Harbour Master', category: 'STRATEGY', art: 'harbour', blurb: 'Six ships are waiting and the tide turns at six. Choose who docks first.', tags: ['PASS', 'Weekly', '30 min'] },
  barrow: { name: 'The Barrow of Hollowmere', category: 'ADVENTURE', art: 'barrow', blurb: 'Something under the hill wants its gold back. Go down anyway.', tags: ['PASS', 'Campaign', '5 levels'] },
  scribe: { name: 'The Scribe of Ur', category: 'LEARNING ACTIVITY', art: 'scribe', blurb: 'The river rose early and the fields are under water. Tell the scribes what to do.', tags: ['PASS', '2 hours'] },
};
Object.keys(PG_NEW).forEach((k) => { GS_GAMES[k] = { ...PG_NEW[k], route: 'games', placeholder: true }; });
const pgPage = (id, o) => {
  const g = GS_GAMES[id];
  return { rhythm: o.rhythm,
    box: g.free
      ? { free: true, label: 'FREE', heading: o.head, button: o.button, steps: [GS_STEP_CONNECT, o.step, <><b>See your result</b> on your session page.</>] }
      : { label: 'PART OF THE PASS', heading: o.head, session: null, steps: [GS_STEP_CONNECT, o.step, <><b>Keep your result.</b> It stays in your history.</>], small: g.name + ' is part of the [Platform] Pass.' },
    facts: { long: g.tags[g.tags.length - 1], often: o.often }, tags: [],
    pitch: { h: o.h, ps: [o.line] }, who: o.who, shots: [null],
    week: { title: o.wt, line: o.wl, session: null, unmarked: true } };
};
// Games-page lines for every game: the edition heading and a longer line (the prototype's GS_MORE, plus the placeholders).
const PG_MORE = { ...GS_MORE,
  cipher: { head: 'A new cipher every day', line: 'One sentence, every letter swapped. Find the first word and the rest gives way.' },
  derelict: { head: 'A new deck every week', line: 'Delve’s dice, in science fiction. Something is still moving on deck four.' },
  harbour: { head: 'A new tide table every week', line: 'Every ship has a cargo and a captain who wants in first. Make the first call.' },
  barrow: { head: 'A short campaign', line: 'Five levels deep, and your loot carries from one to the next. Pick your first door.' },
  scribe: { head: null, line: 'It’s 2500 BC and the temple wants its grain counted. Start counting.' },
};
Object.assign(GS_PAGES, {
  cipher: pgPage('cipher', { rhythm: 'NEW EVERY DAY', head: 'A new cipher every day', button: 'Play today’s cipher', often: 'New every day',
    step: <><b>Crack today’s cipher.</b> You can ask for one letter.</>, h: 'Every letter in today’s line is swapped for another.', line: PG_MORE.cipher.line,
    who: { ai: 'Reads out the line and takes your guesses at each letter.', server: 'Holds the key, checks every guess and counts them.' }, wt: 'Today’s cipher', wl: 'One line. Every letter swapped.' }),
  derelict: pgPage('derelict', { rhythm: 'A NEW DECK EVERY WEEK', head: 'A new deck every week', often: 'A new deck every week',
    step: <><b>Play one full deck</b>, start to ending.</>, h: 'The station’s lights are on and nobody answers.', line: PG_MORE.derelict.line,
    who: { ai: 'Narrates the station and voices whatever is still aboard.', server: 'Rolls every die, keeps the tracks and records your session.' }, wt: 'This week’s deck', wl: 'Find out what’s still moving.' }),
  harbour: pgPage('harbour', { rhythm: 'A NEW TIDE EVERY WEEK', head: 'A new tide table every week', often: 'A new tide table every week',
    step: <><b>Play one full tide</b>, first ship to last.</>, h: 'Six ships are waiting and the tide turns at six.', line: PG_MORE.harbour.line,
    who: { ai: 'Plays the captains and the harbour office.', server: 'Holds the tide table, scores every call and keeps the record.' }, wt: 'This week’s tide', wl: 'Six ships. One berth at a time.' }),
  barrow: pgPage('barrow', { rhythm: 'FIVE LEVELS', head: 'A short campaign', often: 'Play it at your own pace',
    step: <><b>Play the campaign</b>, one level at a time.</>, h: 'Something under the hill wants its gold back.', line: PG_MORE.barrow.line,
    who: { ai: 'Narrates each level and voices what lives under the hill.', server: 'Rolls every die, carries your loot between levels and keeps the record.' }, wt: 'The campaign', wl: 'Five levels, one hill.' }),
  scribe: pgPage('scribe', { rhythm: 'ONE SEASON', head: 'A different season every time', often: 'Play it again, a different season each time',
    step: <><b>Play the season</b>, from flood to harvest.</>, h: 'The river rose early and the fields are under water.', line: PG_MORE.scribe.line,
    who: { ai: 'Speaks for the temple, the farmers and the scribes.', server: 'Keeps the stores, the flood and the record of every decision.' }, wt: 'The season', wl: 'One season, flood to harvest.' }),
});

// About 12 games. The prototype's seven keep their order; the placeholders sit beside their kind.
const PG_ORDER = ['word', 'groups', 'mystery', 'cipher', 'escape', 'casebook', 'delve', 'derelict', 'harbour', 'hunter', 'barrow', 'scribe'];
const PG_RHYTHM = { word: 'day', groups: 'day', mystery: 'day', cipher: 'day', escape: 'week', casebook: 'week', delve: 'week', derelict: 'week', harbour: 'week', hunter: 'any', barrow: 'any', scribe: 'any' };
const pgCat = (c) => c.charAt(0) + c.slice(1).toLowerCase();
const PG_CATS = PG_ORDER.map((k) => GS_GAMES[k].category).filter((c, i, a) => a.indexOf(c) === i);
const pgFind = (q, k) => { const g = GS_GAMES[k]; const s = q.trim().toLowerCase(); return !s || g.name.toLowerCase().includes(s) || g.category.toLowerCase().includes(s); };

// A card always opens the product page; a library row always opens the library game page.
const pgOpen = (gs, id) => (GS_GAMES[id].placeholder ? gs.go('games', { pid: id }) : gs.go(GS_GAMES[id].route));
const pgOpenLib = (gs, id) => (GS_GAMES[id].placeholder ? gs.go('games', { pid: id, page: 'record' }) : gs.go(GS_GAMES[id].route, { page: 'record' }));

// ---- Game cards (copies of app/gs-home.jsx GsFeature and GsGameMore, opening through pgOpen) ----
const PgHead = ({ g, mark, open, label }) => (
  <div className="gs-stack-sm">
    {label && <span className="gs-label">{label}</span>}
    <div className="gs-title-row">
      <h3 className="mcp-t-card"><button type="button" className="gs-titlebtn" onClick={open}>{g.name}</button></h3>
      {mark && <DS.Tag kind="daily" icon="check">{mark}</DS.Tag>}
    </div>
    <p className="gs-muted">{g.blurb}</p>
  </div>
);
const PgCardRow = ({ id, mark }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => pgOpen(gs, id);
  return (
    <DS.Card style={{ justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-feat">
        <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
        <div className="gs-feat-body"><PgHead g={g} mark={mark} open={open} /><GsTagList tags={g.tags} /></div>
      </div>
    </DS.Card>
  );
};
const PgCardGrid = ({ id, mark }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const m = PG_MORE[id] || {}; const open = () => pgOpen(gs, id);
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-gcard"><GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} /></div>
      <PgHead g={g} mark={mark} open={open} label={g.category} />
      <GsTagList tags={g.tags} />
      <div className="gs-today">
        <span className="gs-label">{g.free ? 'FREE WITH AN ACCOUNT' : 'PART OF THE PASS'}</span>
        {m.head ? <p><b>{m.head}</b></p> : null}
        <p className="gs-muted">{m.line || <GsGap />}</p>
      </div>
    </DS.Card>
  );
};
const PgCardWide = ({ id, mark }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const m = PG_MORE[id] || {}; const open = () => pgOpen(gs, id);
  return (
    <DS.Card className="gl-wcard" style={{ justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gl-wide">
        <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
        <div className="gl-body">
          <PgHead g={g} mark={mark} open={open} label={g.category} />
          <GsTagList tags={g.tags} />
          {(m.head || m.line) && <p className="gs-small">{m.head ? m.head + '. ' : ''}{m.line}</p>}
        </div>
      </div>
    </DS.Card>
  );
};

// ---- Games page options ----
// 1 · A row per kind of game, each a scrolling card row.
const PgG1 = () => {
  const gs = useGs(); const marks = gsMarks(gs.view);
  return PG_CATS.map((c) => {
    const ids = PG_ORDER.filter((k) => GS_GAMES[k].category === c);
    return (
      <section key={c} className="gl-sec">
        <h2 className="mcp-t-sec">{pgCat(c)}</h2>
        <div className="gs-feats" role="region" aria-label={pgCat(c)} tabIndex={0}>{ids.map((k) => <PgCardRow key={k} id={k} mark={marks[k]} />)}</div>
      </section>
    );
  });
};
// 2 · Every game in one grid, with a search box and a filter by kind.
const PgG2 = () => {
  const gs = useGs(); const marks = gsMarks(gs.view);
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState('all');
  const ids = PG_ORDER.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && pgFind(q, k));
  return <>
    <div className="gl-tools">
      <DS.SearchField label="Find a game" placeholder="Name or kind" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="gl-chips" role="group" aria-label="Kind of game">
        {[['all', 'All games'], ...PG_CATS.map((c) => [c, pgCat(c)])].map(([v, l]) => <button key={v} type="button" aria-pressed={cat === v} onClick={() => setCat(v)}>{l}</button>)}
      </div>
    </div>
    {ids.length ? <div className="gs-grid3">{ids.map((k) => <PgCardGrid key={k} id={k} mark={marks[k]} />)}</div>
      : <div className="gl-empty"><p>{'No game matches “' + q + '”.'}</p><DS.TextLink onClick={() => { setQ(''); setCat('all'); }}>Show every game</DS.TextLink></div>}
  </>;
};
// 3 · Grouped by how often a new edition arrives, in wide cards.
const PG_RHYTHMS = [['day', 'New every day'], ['week', 'New every week'], ['any', 'Play any time']];
const PgG3 = () => {
  const gs = useGs(); const marks = gsMarks(gs.view);
  return PG_RHYTHMS.map(([r, h]) => (
    <section key={r} className="gl-sec">
      <h2 className="mcp-t-sec">{h}</h2>
      <div className="gs-grid2">{PG_ORDER.filter((k) => PG_RHYTHM[k] === r).map((k) => <PgCardWide key={k} id={k} mark={marks[k]} />)}</div>
    </section>
  ));
};
const PG_OPTS = [
  { id: '1', name: 'A row for each kind', Body: PgG1,
    idea: 'Each kind of game gets a heading and one row of cards that scrolls sideways. A new game adds a card to its row; a new kind adds a row.',
    cost: 'Cards past the first few in a row stay hidden until you scroll. A kind with one game gets a row of one.' },
  { id: '2', name: 'One grid with search and filter', Body: PgG2,
    idea: 'Every game at once, in one grid of the fullest cards, with a search box and a filter by kind above it. Scale is handled by finding, not by layout.',
    cost: 'Every card has the same weight, so nothing leads. On a phone the unfiltered page is a long scroll.' },
  { id: '3', name: 'By how often it’s new', Body: PgG3,
    idea: 'Grouped by when a new edition arrives: every day, every week, or any time. Wide cards carry the kind, the tags and the edition line.',
    cost: 'You can’t pick a kind. The grouping holds only while each game has one rhythm, and the any-time group grows fastest.' },
];
const pgOpt = (st) => PG_OPTS.find((o) => o.id === st.opt) || PG_OPTS[0];

// ---- Library page (one design): every game, with its state for this player ----
// [sort rank, state]. Free: Pass games read "Part of the Pass". Seed only.
const PG_ME = {
  pass: { word: [1, 'Played today'], groups: [2, 'Played today'], mystery: [3, 'Played today'], escape: [4, 'Played this week'], casebook: [5, 'Played this week'],
    delve: [6, 'Played this week'], hunter: [7, 'Last played 5 October'], harbour: [8, 'Last played 28 September'], barrow: [9, 'On level 2 of 5'],
    cipher: [null, 'Not played today'], derelict: [null, 'Not played yet'], scribe: [null, 'Not played yet'] },
  free: { word: [1, 'Played today'], groups: [null, 'Not played today'], mystery: [null, 'Not played today'], cipher: [null, 'Not played today'], escape: [null, 'Not played this week'] },
};
const pgMe = (view, k) => (PG_ME[view] && PG_ME[view][k]) || [null, 'Part of the Pass'];
const PgLibrary = () => {
  const gs = useGs(); const st = usePg();
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState('all'); const [sort, setSort] = React.useState('last');
  const rank = (k) => { const r = pgMe(gs.view, k)[0]; return r == null ? 99 : r; };
  let ids = PG_ORDER.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && pgFind(q, k));
  ids = ids.slice().sort((a, b) => (sort === 'az' ? 0 : rank(a) - rank(b)) || GS_GAMES[a].name.localeCompare(GS_GAMES[b].name));
  const locked = (k) => !GS_GAMES[k].free && gs.view !== 'pass';
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Library</h1>
      <div className="lb-alllay">
        <aside className="lb-tools">
          <DS.SearchField label="Find a game" placeholder="Name or kind" value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Kind" value={cat} opts={[['all', 'All games'], ...PG_CATS.map((c) => [c, pgCat(c)])]} onPick={setCat} />
          <LbChoice label="Order" value={sort} opts={[['last', 'Last played'], ['az', 'A to Z']]} onPick={setSort} />
        </aside>
        <div className="lb-box lb-results">
          {ids.length ? (
            <DS.RowList label="Every game">
              {ids.map((k) => (
                <DS.ListRow key={k} title={GS_GAMES[k].name} muted={st.faded && locked(k)} onClick={() => pgOpenLib(gs, k)}
                  meta={<><span>{pgCat(GS_GAMES[k].category)}</span><span>{pgMe(gs.view, k)[1]}</span></>} />
              ))}
            </DS.RowList>
          ) : <div className="gl-empty"><p>{'No game matches “' + q + '”.'}</p><DS.TextLink onClick={() => { setQ(''); setCat('all'); }}>Show every game</DS.TextLink></div>}
        </div>
      </div>
    </main>
  );
};

// ---- A placeholder game's two pages ----
// The product page is the app's own template; its signed-in card is a copy of app/gs-player.jsx GpCard.
const PgLibCard = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id];
  return (
    <section className="pg-band" aria-label="In your library">
      <GpMini art={g.art} />
      <div className="gs-stack-xs"><span className="gs-label">IN YOUR LIBRARY</span><span className="gs-small">See every time you’ve played and how each one ended.</span></div>
      <div className="pg-band-link"><DS.TextLink onClick={() => pgOpenLib(gs, id)}>{'Go to your ' + g.name}</DS.TextLink></div>
    </section>
  );
};
const PgPlaceLib = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id];
  return (
    <main className="gs-wrap gs-main">
      <section className="rf-head">
        <span><GsCover art={g.art} /></span>
        <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
          <h1 className="gs-h1">{g.name}</h1>
          <DS.TextLink onClick={() => pgOpen(gs, id)}>{'About ' + g.name}</DS.TextLink>
        </div>
      </section>
      <p className="gs-muted">This is a placeholder game, so its library game page isn’t built in the playground.</p>
    </main>
  );
};

const PgGames = () => {
  const gs = useGs(); const st = usePg(); const r = gs.route;
  if (r.pid) return r.page === 'record' && gs.view !== 'out' ? <PgPlaceLib id={r.pid} /> : <GsGamePage id={r.pid} top={gs.view !== 'out' ? <PgLibCard id={r.pid} /> : null} />;
  if (r.lib && gs.view !== 'out') return <PgLibrary />;
  const O = pgOpt(st).Body;
  return <main className="gs-wrap gs-main"><h1 className="gs-h1">Games</h1><O /></main>;
};

// ---- Top bar: Games and Library each link to their page, no dropdown ----
const pgWhere = (gs) => {
  const r = gs.route; const lib = gs.view !== 'out' && (r.lib || r.page === 'record');
  const games = !lib && (r.name === 'games' || GS_GAME_ORDER.some((k) => GS_GAMES[k].route === r.name));
  return { lib, games };
};
const PgGamesNav = () => { const gs = useGs(); return <button type="button" className="gs-navlink" aria-current={pgWhere(gs).games ? 'page' : undefined} onClick={() => gs.go('games')}>Games</button>; };
const PgLibNav = () => { const gs = useGs(); if (gs.view === 'out') return null; return <button type="button" className="gs-navlink" aria-current={pgWhere(gs).lib ? 'page' : undefined} onClick={() => gs.go('games', { lib: true })}>Library</button>; };
const PgGamesMenu = ({ pick }) => { const gs = useGs(); return <button type="button" role="menuitem" className="gs-menu-item" onClick={() => pick(() => gs.go('games'))}>Games</button>; };
const PgLibMenu = ({ pick }) => { const gs = useGs(); if (gs.view === 'out') return null; return <button type="button" role="menuitem" className="gs-menu-item" onClick={() => pick(() => gs.go('games', { lib: true }))}>Library</button>; };

// ---- Strip: the playground's controls, in place of the demo bar ----
let pgBooted = false;
const PgStrip = () => {
  const gs = useGs(); const st = usePg(); const o = pgOpt(st);
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!pgBooted) { pgBooted = true; gs.setView('out'); setTimeout(() => window.gsApi.go('games'), 0); } }, []);
  // Switching view keeps you on the page you're on; a signed-in-only page falls back to Games.
  const view = (v) => {
    gs.setView(v);
    if (v === 'out' && (gs.route.lib || GS_SIGNED_IN_ONLY.includes(gs.route.name))) gs.go('games');
  };
  const pick = (id) => { pgSet({ opt: id }); const r = gs.route; if (r.name !== 'games' || r.lib || r.pid) gs.go('games'); else gsScrollTop(); };
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Games</span>
            {PG_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => pgSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">View</span>
            {seg([['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']], gs.view, view)}
            <span aria-hidden="true" className="gs-demo-sep" />
            <span>Pass rows:</span>
            {seg([['plain', 'plain'], ['faded', 'faded']], st.faded ? 'faded' : 'plain', (v) => pgSet({ faded: v === 'faded' }))}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => pgSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">Daily Cipher, Derelict, Harbour Master, The Barrow of Hollowmere and The Scribe of Ur are placeholder games; Strategy is a placeholder kind. “Pass rows: faded” tries the Library’s faded row, an idea and not a decision.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsGames: PgGames, GsGamesNav: PgGamesNav, GsGamesNavMenu: PgGamesMenu, GsNavExtra: PgLibNav, GsNavExtraMenu: PgLibMenu, GsDemoBar: PgStrip });
