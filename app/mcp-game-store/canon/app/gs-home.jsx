// ============================================================================
// [Platform] — Home (screen 1) and Games (screen 6). The Pass page is in gs-billing.jsx.
// ============================================================================
// The hero shows a real screenshot of a game being played in an AI app, over the game covers.
const GsFeature = ({ id, children }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => gs.go(g.route);
  return (
    <DS.Card style={{ justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-feat">
        <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
        <div className="gs-feat-body">
          <div className="gs-stack-sm">
            <h3 className="mcp-t-card"><button type="button" className="gs-titlebtn" onClick={open}>{g.name}</button></h3>
            <p className="gs-lead">{g.blurb}</p>
          </div>
          <GsTagList tags={g.tags} />
          {children}
        </div>
      </div>
    </DS.Card>
  );
};
const GsTodayList = ({ row }) => {
  const gs = useGs();
  return (
    <div className="gs-today">
      <span className="gs-label">TODAY · {GS.today.toUpperCase()}</span>
      <ul className={'gs-today-list' + (row ? ' is-row' : '')}>
        {GS_PUZZLE_ORDER.map((k) => {
          const p = GS_PUZZLES[k];
          return (
            <li key={k}>
              <button type="button" className="gs-today-item" onClick={() => gs.go(GS_GAMES.daily.route)}>
                <span className="gs-today-cover" dangerouslySetInnerHTML={{ __html: GS_ART[p.art] }} />
                <span className="gs-stack-xs"><b>{p.name}</b><span className="gs-muted">{p.open}</span></span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
const GsHome = () => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main gs-home">
      <section className="gs-hero3">
        <div className="gs-hero-copy">
          <h1 className="gs-h1 gs-h1-home"><span>Someone’s lying to you.</span> <span>Go and find out who.</span></h1>
          <p className="gs-hero-sub">Small games you play by talking to Claude or ChatGPT. New ones every day.</p>
          <div className="gs-hero-act">
            <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            <DS.Button variant="secondary" onClick={() => gsScrollToId('gs-how')}>See how it works</DS.Button>
          </div>
          <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
        </div>
        <div className="gs-hero-art3">
          <div className="gs-hero-covers" aria-hidden="true">
            {['daily', 'delve', 'murder', 'escape'].map((k) => <span key={k} dangerouslySetInnerHTML={{ __html: GS_ART[k] }} />)}
          </div>
          <GsShot id="dailyWord" className="is-hero" />
        </div>
      </section>

      <section className="gs-band">
        <h2 className="mcp-t-sec">Available games</h2>
        <div className="gs-feats" role="region" aria-label="Available games" tabIndex={0}>
          <GsFeature id="daily" />
          <GsFeature id="casebook" />
          <GsFeature id="delve" />
          <GsFeature id="hunter" />
        </div>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>

      <section id="gs-how" className="gs-band">
        <h2 className="mcp-t-sec">Get started</h2>
        <GsSteps row items={[
          <p key="1"><b>Connect your AI</b> in about two minutes.</p>,
          <p key="2"><b>Play today’s puzzles free.</b> No card needed.</p>,
          <p key="3"><b>Get the Pass</b> for {GS_NAME.casebook}, Delve and {GS_NAME.hunter}. <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>What’s included</button></p>,
        ]} />
      </section>

      <section className="gs-band">
        <h2 className="mcp-t-sec">Who does what</h2>
        <div className="gs-who2">
          <div><h3 className="mcp-t-card">Your AI</h3><p className="gs-lead">Narrates, voices the characters, and asks what you do next.</p></div>
          <div><h3 className="mcp-t-card">The game engine</h3><p className="gs-lead">Rolls every die, keeps the score, decides each outcome and records your session.</p></div>
        </div>
      </section>

      <p className="gs-small gs-foot">{GS.purchase}</p>
    </main>
  );
};

// Games page: a little more than the home card, short of the game page.
const GS_MORE = {
  casebook: { head: 'A new case every week', line: null },
  delve: { head: 'A new scene every week', line: "Goblins have dragged the miller's daughter into the warren beneath Gallows Hill. When the drums stop, the ritual is complete." },
  hunter: { head: null, line: null },
};
const GsGameHead = ({ g, mark, open }) => (
  <div className="gs-stack-sm">
    <div className="gs-title-row">
      <h3 className="mcp-t-card"><button type="button" className="gs-titlebtn" onClick={open}>{g.name}</button></h3>
      {mark && <DS.Tag kind="daily" icon="check">{mark}</DS.Tag>}
    </div>
    <p className="gs-muted">{g.blurb}</p>
  </div>
);
const GsDailyWide = ({ mark }) => {
  const gs = useGs(); const g = GS_GAMES.daily; const open = () => gs.go(g.route);
  return (
    <DS.Card style={{ justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-gdaily">
        <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
        <div className="gs-feat-body">
          <GsGameHead g={g} mark={mark} open={open} />
          <GsTagList tags={g.tags} />
          <GsTodayList row />
        </div>
      </div>
    </DS.Card>
  );
};
const GsGameMore = ({ id, mark }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const m = GS_MORE[id] || {}; const open = () => gs.go(g.route);
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-gcard"><GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} /></div>
      <GsGameHead g={g} mark={mark} open={open} />
      <GsTagList tags={g.tags} />
      <div className="gs-today">
        <span className="gs-label">PART OF THE PASS</span>
        {m.head ? <p><b>{m.head}</b></p> : null}
        <p className="gs-muted">{m.line || <GsGap />}</p>
      </div>
    </DS.Card>
  );
};

// Games. Its content region can stage loading in place and a failed load;
// the top bar and footer stay and keep working either way.
const GsGames = () => {
  const gs = useGs();
  const [load, setLoad] = React.useState(gs.route.load || null); // null | 'hold' | 'loading' | 'failed'
  React.useEffect(() => { setLoad(gs.route.load || null); }, [gs.route]);
  React.useEffect(() => {
    if (load !== 'loading') return undefined;
    const t = setTimeout(() => setLoad(null), 1200);
    return () => clearTimeout(t);
  }, [load]);
  const marks = gsMarks(gs.view);
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Games</h1>
      {load === 'hold' || load === 'loading' ? <div className="gs-inplace"><GsSpin /></div>
        : load === 'failed' ? <GsLoadFailed onRetry={() => setLoad('loading')} />
        : <>
          <GsDailyWide mark={marks.daily} />
          <div className="gs-grid3">{GS_GAME_ORDER.filter((k) => k !== 'daily').map((k) => <GsGameMore key={k} id={k} mark={marks[k]} />)}</div>
          <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        </>}
    </main>
  );
};

Object.assign(window, { GsHome, GsGames });
