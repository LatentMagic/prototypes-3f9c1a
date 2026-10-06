// ============================================================================
// [Platform] — Home (screen 1), Games (screen 6), Pass (screen 9).
// ============================================================================
// The hero shows a game being played inside an AI app window, over the real game covers.
const GsFeature = ({ id, children }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => gs.go(g.route);
  return (
    <DS.Card style={{ justifyItems: 'stretch' }}>
      <div className="gs-feat">
        <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
        <div className="gs-feat-body">
          <div className="gs-stack-sm">
            <h3 className="mcp-t-sec"><button type="button" className="gs-titlebtn" onClick={open}>{g.name}</button></h3>
            <p className="gs-lead">{g.blurb}</p>
          </div>
          <GsTagList tags={g.tags} />
          {children}
        </div>
      </div>
    </DS.Card>
  );
};
const GsTodayList = () => {
  const gs = useGs();
  return (
    <div className="gs-today">
      <span className="gs-label">TODAY · {GS.today.toUpperCase()}</span>
      <ul className="gs-today-list">
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
  const card = { gap: 16, justifyItems: 'stretch', alignContent: 'start', gridTemplateRows: 'auto 1fr auto' };
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
          <GsWordChat framed />
        </div>
      </section>

      <section className="gs-band">
        <div className="gs-sec-head">
          <h2 className="mcp-t-sec">Games</h2>
          <DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink>
        </div>
        <div className="gs-feats">
          <GsFeature id="daily"><GsTodayList /></GsFeature>
          <GsFeature id="delve">
            <div className="gs-today">
              <span className="gs-label">PART OF THE PASS</span>
              <p><b>A new scene every week</b></p>
              <p className="gs-muted">Goblins have dragged the miller's daughter into the warren beneath Gallows Hill. When the drums stop, the ritual is complete.</p>
            </div>
          </GsFeature>
        </div>
      </section>

      <section id="gs-how" className="gs-band">
        <h2 className="mcp-t-sec">How it works</h2>
        <GsSteps row items={[
          <p key="1"><b>Connect your AI</b> in about two minutes.</p>,
          <p key="2"><b>Play today’s puzzles free.</b> No card needed.</p>,
          <p key="3"><b>The Pass keeps</b> your results and your streak.</p>,
        ]} />
      </section>

      <section className="gs-band">
        <h2 className="mcp-t-sec">Who does what</h2>
        <div className="gs-who2">
          <div><h3 className="mcp-t-card">Your AI</h3><p className="gs-lead">Narrates, voices the characters, and asks what you do next.</p></div>
          <div><h3 className="mcp-t-card">Our server</h3><p className="gs-lead">Rolls every die, keeps the score, decides each outcome and records your session.</p></div>
        </div>
      </section>

      <section className="gs-band">
        <h2 className="mcp-t-sec">Who gets what</h2>
        <div className="gs-grid2 gs-card-eq">
          <DS.Card style={card}>
            <h3 className="mcp-t-card">Not paying</h3>
            <ul className="gs-plain">{GS_FREE_LIST.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="gs-card-foot"><DS.Button onClick={gs.startFree}>Start free</DS.Button></div>
          </DS.Card>
          <DS.Card style={card}>
            <h3 className="mcp-t-card">Paying</h3>
            <ul className="gs-plain">{GS_PASS_LIST.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="gs-card-foot"><span className="gs-figure gs-num-text">£—</span><DS.TextLink onClick={() => gs.go('pass')}>See the Pass</DS.TextLink></div>
          </DS.Card>
        </div>
      </section>

      <p className="gs-small gs-foot">{GS.purchase}</p>
    </main>
  );
};

const GsGames = () => {
  const gs = useGs();
  const marks = gs.view === 'pass' ? { daily: 'Played today', delve: 'Played this week' } : {};
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Games</h1>
      <div className="gs-grid2">{['daily', 'delve'].map((k) => <GsGameCard key={k} id={k} mark={marks[k]} />)}</div>
      <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
    </main>
  );
};

const GsPass = () => {
  const gs = useGs();
  const paying = gs.view === 'pass';
  const status = gs.view === 'free' ? 'You’re on the free plan' : paying ? 'You have the Pass' : null;
  return (
    <main className="gs-wrap gs-main">
      <div className="gs-stack-md">
        <h1 className="gs-h1">[Platform] Pass</h1>
        {status && <p className="gs-status">{paying && <DS.Icon name="check" />}{status}</p>}
      </div>
      <GsCompare passFoot={!paying && (
        <div className="gs-buy">
          <span className="gs-figure gs-num-text">£—</span>
          <DS.Button onClick={gs.getPass}>Get the Pass</DS.Button>
        </div>
      )} />
      <p className="gs-small">{GS.purchase}</p>
    </main>
  );
};

Object.assign(window, { GsHome, GsGames, GsPass });
