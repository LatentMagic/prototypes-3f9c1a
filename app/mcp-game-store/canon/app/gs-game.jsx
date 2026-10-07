// ============================================================================
// [Platform] — the game page: one template for all four games (first-release-
// games). Delve's page is the model. Order: breadcrumb and cover; play box;
// facts row; pitch beside who does what; how it looks in your chat; a finished
// play; (Delve: stat tiles); today's or this week's one; (Daily Puzzles: streak
// and record); more games. Every null is a gap in the record and shows as "—".
// ============================================================================
const GsGap = () => <span className="gs-gap" title="Not decided yet">—</span>;
const gsOr = (v) => (v == null ? <GsGap /> : v);
const GS_STEP_CONNECT = <><b>Connect your AI</b> in about two minutes. Claude, ChatGPT, Goose and others.</>;

const GS_PAGES = {
  daily: {
    crumb: 'Puzzles', label: 'PUZZLES · NEW EVERY DAY',
    box: { free: true, label: 'FREE', heading: 'New puzzles every day', button: 'Play today’s puzzles',
      steps: [GS_STEP_CONNECT, <><b>Play today’s puzzles.</b> All three, in any order.</>, <><b>See your result</b> on your session page.</>] },
    facts: { ai: null, age: null, long: '10 min each', often: 'New every day', players: 'Solo' }, tags: [],
    pitch: { h: 'Three small puzzles, new every day.', ps: [
      'There’s a locked door, a body and a word you can’t see yet. Three puzzles, all new today.',
      'Your AI reads you the puzzle, and our server checks every guess and keeps count.'] },
    who: { ai: 'Reads you the puzzle and takes your guesses, moves and questions.', server: 'Checks every guess, move and accusation, and keeps the count.' },
    shots: ['Each guess goes to the server, which checks it and keeps count.'],
    finished: 'word-today',
  },
  casebook: {
    crumb: 'Mysteries', label: 'MYSTERY · A NEW CASE EVERY WEEK',
    box: { label: 'PART OF THE PASS', heading: 'A new case every week', session: 'casebook',
      steps: [GS_STEP_CONNECT, <><b>Play one full case</b>, start to ending.</>, <><b>Keep your result.</b> It stays in your history.</>],
      small: GS_NAME.casebook + ' is part of the [Platform] Pass.' },
    facts: { ai: 'AI-essential: your AI plays every suspect', age: null, long: null, often: 'A new case every week', players: null },
    tags: ['Mystery', 'One case, sixteen turns, one accusation'],
    pitch: { h: 'Ask the question they haven’t prepared for.', ps: [
      'This week’s suspects have had time to get their stories straight. Your AI plays every one of them, and each has a secret to keep.',
      'Sixteen turns to search, question and confront them. Then one accusation.',
      'Our server holds every statement word for word, so any story can be checked.'] },
    who: { ai: 'Voices every suspect and narrates what you find.', server: 'Holds every statement and every piece of evidence, counts your turns and keeps the record.' },
    shots: [null],
    finished: 'casebook',
    week: { title: 'This week’s case', line: 'Sixteen turns. One accusation.', session: 'casebook' },
  },
  delve: {
    crumb: 'Adventures', label: 'ADVENTURE · ONE SCENE',
    box: { label: 'PART OF THE PASS', heading: 'A new scene every week', session: 'delve',
      steps: [GS_STEP_CONNECT, <><b>Play one full scene</b>, start to ending.</>, <><b>Keep your result.</b> It stays in your history.</>],
      small: 'The first scene is free. Every scene after it is part of the [Platform] Pass.', firstFree: true },
    facts: { ai: 'AI-essential: your AI is the Dungeon Master', age: '12+ · fantasy peril, no gore', long: '25–40 min', often: 'A new scene every week', players: 'Solo' },
    tags: ['Adventure', 'One scene · new warren layout each run'],
    pitch: { h: 'Get her out before the drums stop', ps: [
      'Goblins have dragged the miller’s daughter into the warren beneath Gallows Hill. When the drums stop, the ritual is complete. You have one scene: sneak, talk, fight or bluff your way through tunnels, fungus galleries and a bone bridge to the ritual chamber, then get back out.',
      <>Every risky move is a d20 roll, made by our server where nobody can fudge it. Two tracks decide the scene: your <b>progress</b> towards the captive, and the <b>threat clock</b> that fills as the warren wakes. Your AI tells the story around the dice.</>] },
    who: { ai: 'Narrates the warren, voices the goblins and the captive, and asks what you do next.', server: 'Rolls every die, keeps both tracks, decides each outcome and records your session.' },
    shots: ['The scene opens. The server sets up both tracks.', 'A weak hit: progress, with a cost the server applies.', 'The ending, with a link back to your full session.'],
    finished: 'delve',
    week: { title: 'This week’s scene', line: 'Get her out before the drums stop.', session: 'delve' },
  },
  hunter: {
    crumb: 'Learning activities', label: 'LEARNING ACTIVITY · ONE DAY',
    box: { label: 'PART OF THE PASS', heading: 'A day to explore', session: 'hunter',
      steps: [GS_STEP_CONNECT, <><b>Explore one day</b>, from dawn to dusk.</>, null],
      small: 'The hunter-gatherer game is part of the [Platform] Pass.' },
    facts: { ai: null, age: null, long: null, often: null, players: null }, tags: [],
    pitch: { h: 'One day, dawn to dusk.', ps: [
      'It’s dawn in late summer, and the day is yours. You’re in the world of hunter-gatherers near Chauvet cave in France. Go where you like.',
      'Gathering carries the day, and a big hunt is rare. No single conflict drives it. Not everywhere can be reached before dusk.',
      'It’s more a learning activity than a game. It’s one day, and you can play it again.'] },
    who: { ai: 'Drives the world and answers what you try.', server: 'Keeps the time, what you have done and seen, and how the world changes in answer.' },
    shots: [null],
    finished: 'hunter',
    week: { title: 'The day', line: 'One day, dawn to dusk, and you can play it again.', session: 'hunter', unmarked: true },
  },
};
const GS_FACT_LABELS = [['ai', 'What your AI does'], ['age', 'Age'], ['long', 'How long'], ['often', 'How often'], ['players', 'Players']];

const GsPlayBox = ({ id }) => {
  const gs = useGs();
  const g = GS_GAMES[id]; const b = GS_PAGES[id].box;
  const paying = gs.view === 'pass';
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">{b.label}</span>
      <h2 className="mcp-t-card">{b.heading}</h2>
      <GsSteps items={b.steps.map((s) => gsOr(s))} />
      {b.free
        ? <DS.Button block onClick={() => gsScrollToId('gs-today')}>{b.button}</DS.Button>
        : paying
          ? <DS.Button block onClick={() => gs.play(g.name, b.session)}>Play in your AI</DS.Button>
          : b.firstFree
            ? <DS.Button block onClick={() => gs.play(g.name, b.session)}>Play the first scene</DS.Button>
            : <DS.Button block onClick={() => gs.go('pass')}>Get the Pass</DS.Button>}
      {!b.free && <p className="gs-small">{b.small} {GS.purchase}</p>}
      {!b.free && !paying && <div>{b.firstFree
        ? <DS.TextLink onClick={() => gs.go('pass')}>See the Pass</DS.TextLink>
        : <DS.TextLink onClick={() => gs.go('puzzles')}>Play today’s puzzles free</DS.TextLink>}</div>}
      <div className="gs-rule" />
      <div className="gs-stack-sm">
        <span className="gs-label">WORKS WITH</span>
        <p className="gs-small">{GS.works}</p>
      </div>
    </DS.Card>
  );
};

const GsFacts = ({ id }) => {
  const p = GS_PAGES[id];
  return (
    <section className="gs-stack-md" aria-label="Facts">
      <dl className="gs-facts">
        {GS_FACT_LABELS.map(([k, l]) => (
          <div key={k} className="gs-fact"><dt className="gs-label">{l.toUpperCase()}</dt><dd>{gsOr(p.facts[k])}</dd></div>
        ))}
      </dl>
      {p.tags.length > 0 && <div className="gs-tags">{p.tags.map((t) => <DS.Tag key={t} kind="daily">{t}</DS.Tag>)}</div>}
    </section>
  );
};

// A compact preview of the session page, beside its share card.
const GsFinished = ({ sid }) => {
  const gs = useGs(); const s = GS_SESSIONS[sid];
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">A finished play</h2>
      <div className="gs-grid2 gs-top-align">
        <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
          <div className="gs-mini">
            <GsCover art={s.art} />
            <div className="gs-stack-xs" style={{ justifyItems: 'start' }}>
              <span className="gs-small">{s.game}</span>
              <span className="gs-figure">{gsOr(s.result)}</span>
            </div>
          </div>
          <div className="gs-figs">
            {(s.figures || []).map((f, i) => <span key={i} className="gs-fig">{gsOr(f)}</span>)}
            <span className="gs-fig gs-fig-quiet">{s.date}</span>
          </div>
          <div><DS.TextLink onClick={() => gs.go('session', { id: sid })}>See a finished session (demo)</DS.TextLink></div>
        </DS.Card>
        <GsShareCard s={s} />
      </div>
    </section>
  );
};

// One card for this week's (or the day's) game.
const GsWeekCard = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const w = GS_PAGES[id].week;
  const paying = gs.view === 'pass';
  const s = paying && !w.unmarked ? GS_SESSIONS[w.session] : null;
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">{w.title}</h2>
      <div className="gs-grid3">
        <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
          <GsCover art={g.art} />
          <h3 className="mcp-t-card">{g.name}</h3>
          <p className="gs-muted">{w.line}</p>
          {!paying ? <div><GsPassTag /></div>
            : s ? (
              <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
                <GsResultTag s={s} />
                <DS.TextLink onClick={() => gs.go('session', { id: w.session })}>See your session page</DS.TextLink>
              </div>
            ) : <div className="gs-act"><DS.Button onClick={() => gs.play(g.name, w.session)}>Play in your AI</DS.Button></div>}
        </DS.Card>
      </div>
    </section>
  );
};

const GsDailyToday = () => {
  const gs = useGs();
  const played = GS_TODAY_PLAYED[gs.view] || {};
  return (
    <>
      <section id="gs-today" className="gs-stack-md">
        <div className="gs-sec-head"><h2 className="mcp-t-sec">Today</h2><p className="gs-muted">{GS.today}</p></div>
        <div className="gs-grid3">{GS_PUZZLE_ORDER.map((k) => <GsPuzzleCard key={k} id={k} session={played[k]} />)}</div>
      </section>
      <GsEarlier paying={gs.view === 'pass'} />
    </>
  );
};

const GsGamePage = ({ id }) => {
  const gs = useGs();
  const g = GS_GAMES[id]; const p = GS_PAGES[id];
  const marks = gsMarks(gs.view);
  const others = GS_GAME_ORDER.filter((k) => k !== id);
  return (
    <main className="gs-wrap gs-main">
      <nav aria-label="Breadcrumb" className="gs-crumb">
        <button type="button" className="gs-inlink" onClick={() => gs.go('games')}>Games</button>
        <span aria-hidden="true">/</span><span>{p.crumb}</span><span aria-hidden="true">/</span>
        <span aria-current="page">{g.name}</span>
      </nav>

      <section className="gs-head-split">
        <div className="gs-hero-cover">
          <GsCover art={g.art} />
          <div className="gs-cover-over">
            <span className="gs-label">{p.label}</span>
            <h1 className="gs-cover-title">{g.name}</h1>
          </div>
        </div>
        <GsPlayBox id={id} />
      </section>

      <GsFacts id={id} />

      <section className="gs-pitch">
        <div className="gs-stack-md gs-measure">
          <h2 className="mcp-t-sec">{p.pitch.h}</h2>
          {p.pitch.ps.map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
          <span className="gs-label">WHO DOES WHAT</span>
          <GsWhoCols ai={p.who.ai} server={p.who.server} />
        </DS.Card>
      </section>

      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">How it looks in your chat</h2>
        {/* Stand-ins: the Daily Word screenshot in every slot until each game's own exist in assets/in-use/ */}
        <div className={p.shots.length > 1 ? 'gs-chats' : 'gs-grid2'}>
          {p.shots.map((c, i) => <GsShot key={i} id="dailyWord" caption={gsOr(c)} />)}
        </div>
      </section>

      <GsFinished sid={p.finished} />

      {id === 'delve' && (
        <section className="gs-grid3">
          <GsStat label="IN A SCENE" figure="6–7 locations" line="Sinkhole to ritual chamber, shuffled each run." />
          <GsStat label="TYPICAL RUN" figure="10–14 rolls" line="Every one listed on your session page afterwards." />
          <GsStat label="ENDINGS" figure="4 ways out" line="Clean rescue, close call, alone, or caught." />
        </section>
      )}

      {id === 'daily' ? <GsDailyToday /> : <GsWeekCard id={id} />}

      {id === 'daily' && <GsStreakPanel paying={gs.view === 'pass'} />}

      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">More games</h2>
        <div className="gs-grid3">{others.map((k) => <GsGameCard key={k} id={k} mark={marks[k]} />)}</div>
        <div className="gs-grid2">{GS_SOON.map((s) => <GsSoonCard key={s.name} g={s} />)}</div>
      </section>
    </main>
  );
};

const GsDelve = () => <GsGamePage id="delve" />;
const GsPuzzles = () => <GsGamePage id="daily" />;
const GsCasebook = () => <GsGamePage id="casebook" />;
const GsHunter = () => <GsGamePage id="hunter" />;

Object.assign(window, { GsGap, gsOr, GS_PAGES, GsGamePage, GsDelve, GsPuzzles, GsCasebook, GsHunter });
