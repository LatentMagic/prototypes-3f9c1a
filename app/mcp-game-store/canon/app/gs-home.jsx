// ============================================================================
// [Platform] — Home (screen 1) and Games (screen 6). The Pass page is in gs-billing.jsx.
// ============================================================================
// The hero: the headline's game (Casebook) as one cover field, with a real screenshot of play set inside it
// (home-hero option 9, subline a, ratified 2026-10-09; docs/specs/home-hero/).
const GsFeature = ({ id, children }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const open = () => gs.go(g.route); const host = useGsArtHost();
  return (
    <DS.Card className="mcp-art-host gs-host" style={{ justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-feat" ref={host}>
        <GsArt art={g.art} shape="wide" />
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

const GS_WHATSNEW = [
  { v: '1.9', d: '8 October 2026', t: 'Share cards for every result', x: 'Any finished session can be shared as a card or a link, with the full record of rolls, guesses and statements behind it.' },
  { v: '1.8', d: '24 September 2026', t: 'Streaks carry across devices', x: 'Your daily streak and record now follow your account, so they stay intact wherever you connect your AI.' },
  { v: '1.7', d: '10 September 2026', t: 'Connect in under two minutes', x: 'A single link now connects Claude, ChatGPT and other MCP assistants. No settings to copy between apps.' },
  { v: '1.6', d: '27 August 2026', t: 'Every earlier edition in one place', x: 'Open any past edition of a weekly or daily game from its page.' },
  { v: '1.5', d: '13 August 2026', t: 'Faster results after each play', x: 'The result and record appear as soon as the last turn is made.' },
  { v: '1.4', d: '30 July 2026', t: 'Account page', x: 'Manage your plan, card and connected assistants from one place.' },
  { v: '1.3', d: '16 July 2026', t: 'History view', x: 'Look back over every play, grouped by day and by game.' },
  { v: '1.2', d: '2 July 2026', t: 'Search and filters in the library', x: 'Find a game by kind, length or how often it releases.' },
  { v: '1.1', d: '18 June 2026', t: 'Free daily puzzles', x: 'Today’s Daily Puzzles are free with an account.' },
];
const GsWhatsNew = () => {
  const row = (e, i) => (
    <li key={e.v} className={'wn-e' + (i === 0 ? ' is-latest' : '')}>
      <div className="wn-body"><h3 className="wn-t">{e.t}</h3><p className="wn-d">{e.x}</p></div>
      <div className="wn-meta"><time>{e.d}</time></div>
    </li>
  );
  const now = GS_WHATSNEW.slice(0, 3), earlier = GS_WHATSNEW.slice(3);
  return (
    <section className="gs-band" aria-labelledby="gs-wn-h">
      <h2 className="mcp-t-sec" id="gs-wn-h">What’s new</h2>
      <div className="wn-panel">
        <ul className="wn-list has-fold">
          {now.map(row)}
          <li className="wn-e wn-foldrow">
            <details>
              <summary className="wn-sum"><span className="wn-caret"><DS.Icon name="down" size={16} style={{ transform: 'rotate(-90deg)' }} /></span>earlier updates</summary>
              <div className="wn-wrap" tabIndex={0} role="region" aria-label="Earlier updates"><ul className="wn-nest">{earlier.map((e) => row(e, -1))}</ul></div>
            </details>
          </li>
        </ul>
      </div>
    </section>
  );
};
const GsHome = () => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main gs-home">
      <section className="gs-hero3">
        <div className="gs-hero-copy">
          <h1 className="gs-h1 gs-h1-home"><span>Someone’s lying to you.</span> <span>Go and find out who.</span></h1>
          <p className="gs-hero-sub">Your AI plays every suspect, and some of them are lying. Find the proof that breaks their story.</p>
          <div className="gs-hero-act">
            <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            <DS.Button variant="secondary" onClick={gs.goHow}>See how it works</DS.Button>
          </div>
          <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
        </div>
        <div className="gs-hero-field">
          <div className="gs-hero-shapes4" aria-hidden="true" onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <i style={{ background: '#D66847', '--h': '62%', '--rise': '12px' }}></i>
            <i style={{ background: '#A390B2', '--h': '86%', '--rise': '6px' }}></i>
            <i style={{ background: '#F2EBE0', '--h': '48%', '--rise': '18px' }}></i>
            <b></b>
          </div>
          <button type="button" className="gs-hero-name" onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <span className="gs-label">A NEW CASE EVERY WEEK</span>
            <span className="gs-hero-name-t">{GS_NAME.casebook} <DS.Icon name="down" size={20} style={{ transform: 'rotate(-90deg)' }} /></span>
          </button>
          <GsShot id="dailyWord" zoom />
        </div>
      </section>

      <section className="gs-band">
        <h2 className="mcp-t-sec">Available games</h2>
        <div className="gs-feats" role="region" aria-label="Available games" tabIndex={0}>
          {GS_GAME_ORDER.map((k) => <GsFeature key={k} id={k} />)}
        </div>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>

      <section id="gs-how" className="gs-band">
        <h2 className="mcp-t-sec">Get started</h2>
        <GsSteps row items={[
          <p key="1"><b>Connect your AI</b> in about two minutes.</p>,
          <p key="2"><b>Play the free games.</b> No card needed.</p>,
          <p key="3"><b>Get the Pass</b> for every edition of every game, and every new game. <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>About the Pass</button></p>,
        ]} />
      </section>

      <section className="gs-band">
        <h2 className="mcp-t-sec">Who does what</h2>
        <div className="gs-who2">
          <div><h3 className="mcp-t-card">Your AI</h3><p className="gs-lead">Narrates, voices the characters, and asks what you do next.</p></div>
          <div><h3 className="mcp-t-card">The game engine</h3><p className="gs-lead">Rolls every die, keeps the score, decides each outcome and records your session.</p></div>
        </div>
      </section>

      <GsWhatsNew />

      <p className="gs-small gs-foot">{GS.purchase}</p>
    </main>
  );
};

// Games page: a little more than the home card, short of the game page.
const GS_MORE = {
  word: { head: 'A new word every day', line: 'You already know today’s answer. You can’t see it yet, so start guessing.' },
  groups: { head: 'New groups every day', line: 'Sixteen words hide four groups of four. You can make four mistakes, so pick your first four.' },
  mystery: { head: 'A new case every day', line: 'There’s a body, a locked door and a story that doesn’t add up. Your move.' },
  escape: { head: 'A new room every week', line: 'The door’s locked and you’re on the wrong side of it. Say what you search first.' },
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
const GsGameMore = ({ id, mark }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const m = GS_MORE[id] || {}; const open = () => gs.go(g.route);
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <div className="gs-gcard"><GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} /></div>
      <GsGameHead g={g} mark={mark} open={open} />
      <GsTagList tags={g.tags} />
      <div className="gs-today">
        <span className="gs-label">{g.free ? 'FREE IN FULL' : g.first ? 'FIRST EDITION FREE' : 'ONLY WITH THE PASS'}</span>
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
          <div className="gs-grid3">{GS_GAME_ORDER.map((k) => <GsGameMore key={k} id={k} mark={marks[k]} />)}</div>
          <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        </>}
    </main>
  );
};

Object.assign(window, { GsHome, GsGames, GsFeature });
