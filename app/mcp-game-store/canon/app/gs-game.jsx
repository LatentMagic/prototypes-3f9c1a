// ============================================================================
// [Platform] — the game page: one template for all four games (first-release-
// games). Delve's page is the model. Order: cover and play box; facts band
// (how long, how often, kind tags); pitch beside who does what; how it looks
// in your chat; (Delve: stat tiles); today's or this week's one; more games. Every null is a gap in the record and shows as "—".
// ============================================================================
const GsGap = () => <span className="gs-gap" title="Not decided yet">—</span>;
const gsOr = (v) => (v == null ? <GsGap /> : v);
const GS_STEP_CONNECT = <><b>Connect your AI</b> in about two minutes. ChatGPT, Claude, OpenClaw and others.</>;

const GS_PAGES = {
  word: {
    rhythm: 'NEW EVERY DAY',
    box: { free: true, label: 'FREE IN FULL', small: 'Every edition, your streak and its achievements are free with an account.', heading: 'A new word every day', button: 'Play today’s word',
      steps: [GS_STEP_CONNECT, <><b>Play today’s word.</b> You get six guesses.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'You already know today’s answer.', ps: [
      'You can’t see it yet, so start guessing. Each guess at the five-letter word comes back marked letter by letter.',
      'Your AI passes on your guesses, and the game engine marks every one and keeps count. Make your first guess.'] },
    who: { ai: 'Takes your guesses and shows you how each one scored.', server: 'Holds the word, marks every guess and keeps the count.' },
    shots: ['Each guess goes to the engine, which marks it and keeps count.'],
    week: { title: 'Today’s word', line: 'Five letters. Six guesses.', session: 'word-today' },
  },
  groups: {
    rhythm: 'NEW EVERY DAY',
    box: { free: true, label: 'FREE IN FULL', small: 'Every edition, your streak and its achievements are free with an account.', heading: 'New groups every day', button: 'Play today’s groups',
      steps: [GS_STEP_CONNECT, <><b>Find today’s four groups.</b> You can make four mistakes.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'Sixteen words hide four groups of four.', ps: [
      'Pick four words you think belong together. You can make four mistakes, and the game tells you when you’re one word away.',
      'Your AI passes on your picks and explains the groups afterwards. The game engine checks every one. Find the first group.'] },
    who: { ai: 'Passes on your picks and explains the groups once you finish.', server: 'Holds the groups, checks every pick and counts your mistakes.' },
    shots: ['Each set of four goes to the engine, which checks it and counts your mistakes.'],
    week: { title: 'Today’s groups', line: 'Four groups. Four mistakes to spare.', session: 'groups-today' },
  },
  mystery: {
    rhythm: 'NEW EVERY DAY',
    box: { free: true, label: 'FREE IN FULL', small: 'Every edition, your streak and its achievements are free with an account.', heading: 'A new case every day', button: 'Play today’s case',
      steps: [GS_STEP_CONNECT, <><b>Question the inspector</b>, then make one accusation.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'There’s a body, a locked door and a story that doesn’t add up.', ps: [
      'The clues point to one suspect, one weapon and one room. Ask the inspector yes-or-no questions, then make one accusation.',
      'Your AI voices the suspects. The game engine holds the answer and keeps it back until you accuse. Make your move.'] },
    who: { ai: 'Voices the suspects and the inspector, and takes your questions.', server: 'Holds the answer, counts your questions and checks your accusation.' },
    shots: ['Each question goes to the engine, which answers it and keeps count.'],
    week: { title: 'Today’s case', line: 'One case. One accusation.', session: 'mystery-today' },
  },
  escape: {
    rhythm: 'A NEW ROOM EVERY WEEK',
    box: { free: true, label: 'FREE IN FULL', small: 'Every edition, your streak and its achievements are free with an account.', heading: 'A new room every week', button: 'Play this week’s room',
      steps: [GS_STEP_CONNECT, <><b>Play this week’s room</b>, from the locked door to the way out.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'A new room every week' }, tags: [],
    pitch: { h: 'The door’s locked and you’re on the wrong side of it.', ps: [
      'Search the room, try what you find and work out the way out. A new room arrives every Monday.',
      'Your AI describes the room and what you find. The game engine decides what each move does and counts them. Say what you search first.'] },
    who: { ai: 'Describes the room and everything you find in it.', server: 'Decides what each move does, counts your moves and keeps the record.' },
    shots: ['Each move goes to the engine, which decides what happens and keeps count.'],
    week: { title: 'This week’s room', line: 'Find the way out.', session: 'escape-week' },
  },
  casebook: {
    rhythm: 'A NEW CASE EVERY WEEK',
    box: { first: true, label: 'FIRST CASE FREE', heading: 'A new case every week', session: 'casebook', button: 'Play the first case',
      steps: [GS_STEP_CONNECT, <><b>Play one full case</b>, start to ending.</>, <><b>Keep your result.</b> It stays in your history.</>],
      small: 'The first case is free with an account. Every other case comes with the [Platform] Pass.' },
    facts: { long: '25–40 min', often: 'A new case every week' },
    tags: ['Mystery', 'One case, sixteen turns, one accusation'],
    pitch: { h: 'Ask the question they haven’t prepared for.', ps: [
      'This week’s suspects have had time to get their stories straight. Your AI plays every one of them, and each has a secret to keep.',
      'Sixteen turns to search, question and confront them. Then one accusation.',
      'The game engine holds every statement word for word, so any story can be checked.'] },
    who: { ai: 'Voices every suspect and narrates what you find.', server: 'Holds every statement and every piece of evidence, counts your turns and keeps the record.' },
    shots: [null],
    week: { title: 'This week’s case', line: 'Sixteen turns. One accusation.', session: 'casebook' },
  },
  delve: {
    rhythm: 'ONE SCENE',
    box: { first: true, label: 'FIRST SCENE FREE', heading: 'A new scene every week', session: 'delve', button: 'Play the first scene',
      steps: [GS_STEP_CONNECT, <><b>Play one full scene</b>, start to ending.</>, <><b>Keep your result.</b> It stays in your history.</>],
      small: 'The first scene is free with an account. Every other scene comes with the [Platform] Pass.' },
    facts: { long: '25–40 min', often: 'A new scene every week' },
    tags: ['Adventure', 'One scene · new warren layout each run'],
    pitch: { h: 'Get her out before the drums stop', ps: [
      'Goblins have dragged the miller’s daughter into the warren beneath Gallows Hill. When the drums stop, the ritual is complete. You have one scene: sneak, talk, fight or bluff your way through tunnels, fungus galleries and a bone bridge to the ritual chamber, then get back out.',
      <>Every risky move is a d20 roll, made by the game engine where nobody can fudge it. Two tracks decide the scene: your <b>progress</b> towards the captive, and the <b>threat clock</b> that fills as the warren wakes. Your AI tells the story around the dice.</>] },
    who: { ai: 'Narrates the warren, voices the goblins and the captive, and asks what you do next.', server: 'Rolls every die, keeps both tracks, decides each outcome and records your session.' },
    shots: ['The scene opens. The engine sets up both tracks.', 'A weak hit: progress, with a cost the engine applies.', 'The ending, with a link back to your full session.'],
    week: { title: 'This week’s scene', line: 'Get her out before the drums stop.', session: 'delve' },
  },
  hunter: {
    rhythm: 'ONE DAY',
    box: { label: 'ONLY WITH THE PASS', heading: 'A different day every time', session: 'hunter',
      steps: [GS_STEP_CONNECT, <><b>Play the day</b>, from grey dawn to firelight.</>, <><b>Keep your day.</b> It stays in your history.</>],
      small: '36,000 Summers Ago comes only with the [Platform] Pass.' },
    facts: { long: '2 hours', often: 'Play it again, a different day each time' }, tags: [],
    pitch: { h: 'The day goes on whether you join it or not.', ps: [
      'It’s grey dawn, 36,000 years ago, and your band is already moving. Hunters head for the cliffs. Gatherers set out for the plateau.',
      'Join them, or go your own way. Whatever you skip, the day carries on without you. You’ll hear what you missed at the fire.',
      'Your AI tells the day and speaks for everyone in it. The game engine rolls the dice and keeps the record. Say what you do first.'] },
    who: { ai: 'Tells the day, speaks for everyone in it and answers whatever you try.', server: 'Keeps the time, rolls the dice, tracks where everyone is and records what you do.' },
    shots: [null],
    week: { title: 'The day', line: 'One day, dawn to firelight. Play it again and it goes differently.', session: 'hunter', unmarked: true },
  },
};
const GS_FACT_LABELS = [['long', 'How long'], ['often', 'How often']];

const GsPlayBox = ({ id }) => {
  const gs = useGs();
  const g = GS_GAMES[id]; const b = GS_PAGES[id].box;
  const paying = gs.view === 'pass';
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">{b.label}</span>
      <h2 className="mcp-t-card">{b.heading}</h2>
      <GsSteps items={[<><b>Connect your AI</b> first. <GsHowLink label="How to connect" /></>, ...b.steps.slice(1).map((s) => gsOr(s))]} />
      {b.free || b.first || paying
        ? <DS.Button block onClick={() => gs.play(g.name)}>Play in your AI</DS.Button>
        : <DS.Button block onClick={() => gs.go('pass')}>Get the Pass</DS.Button>}
      {b.small && <p className="gs-small">{b.small}{!b.free && ' ' + GS.purchase}</p>}
      {b.first && !paying && <div><DS.TextLink onClick={() => gs.go('pass')}>Get the Pass</DS.TextLink></div>}
      {!b.free && !b.first && !paying && <div><DS.TextLink onClick={() => gs.go('games')}>Play a free game</DS.TextLink></div>}
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
    <section className="gs-factband" aria-label="Facts">
      <dl className="gs-facts">
        {GS_FACT_LABELS.map(([k, l]) => (
          <div key={k} className="gs-fact"><dt className="gs-label">{l.toUpperCase()}</dt><dd>{gsOr(p.facts[k])}</dd></div>
        ))}
      </dl>
      {p.tags.length > 0 && <div className="gs-tags gs-fact-tags">{p.tags.map((t) => <DS.Tag key={t} kind="daily">{t}</DS.Tag>)}</div>}
    </section>
  );
};

// One card for this edition: today's, this week's or the day's. A free game plays for everyone; a Pass game needs the Pass.
const GsWeekCard = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const w = GS_PAGES[id].week;
  const paying = gs.view === 'pass'; const can = g.free || paying;
  const now = window.lbNow ? lbNow(gs, id) : null;
  return (
    <section id="gs-today" className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">{w.title}</h2>{window.ED_GAMES && ED_GAMES.includes(id) && <DS.TextLink onClick={() => edGo(gs, id)}>All editions</DS.TextLink>}</div>
      <DS.Card style={{ justifyItems: 'stretch' }}>
        <div className="gs-week">
          <GsCover art={g.art} />
          <div className="gs-stack-md" style={{ justifyItems: 'start', alignContent: 'center' }}>
          <h3 className="mcp-t-card">{g.name}</h3>
          <p className="gs-muted">{w.line}</p>
          {!can ? <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>{g.first && <p className="gs-small">{w.title + ' comes with the Pass. The first edition is free.'}</p>}<GsPassTag /></div>
            : now ? (
              <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
                <LbResult s={now.status} />
                <DS.TextLink onClick={now.open}>See your session page</DS.TextLink>
              </div>
            ) : <div className="gs-act"><DS.Button onClick={() => gs.playReq(window.ED_GAMES && ED_GAMES.includes(id) ? { kind: 'edition', e: edList(gs, id)[0] } : { kind: 'game', gid: id })}>Play in your AI</DS.Button></div>}
          </div>
        </div>
      </DS.Card>
    </section>
  );
};

const GsGamePage = ({ id, top }) => {
  const gs = useGs();
  const g = GS_GAMES[id]; const p = GS_PAGES[id];
  const marks = gsMarks(gs.view, gs);
  const others = GS_GAME_ORDER.filter((k) => k !== id);
  return (
    <main className="gs-wrap gs-main">
      {top}

      <section className="gs-head-split">
        <div className="gs-hero-cover">
          <GsCover art={g.art} />
          <div className="gs-cover-over">
            <span className="gs-label">{g.category + ' · ' + p.rhythm}</span>
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
        <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start', alignSelf: 'center' }}>
          <span className="gs-label">HOW IT PLAYS</span>
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

      {id === 'delve' && (
        <section className="gs-grid3">
          <GsStat label="IN A SCENE" figure="6–7 locations" line="Sinkhole to ritual chamber, shuffled each run." />
          <GsStat label="TYPICAL RUN" figure="10–14 rolls" line="Every one listed on your session page afterwards." />
          <GsStat label="ENDINGS" figure="4 ways out" line="Clean rescue, close call, alone, or caught." />
        </section>
      )}

      <GsWeekCard id={id} />

      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">More games</h2>
        <div className="gs-grid3">{others.map((k) => <GsGameCard key={k} id={k} mark={marks[k]} />)}</div>
        <div className="gs-grid2">{GS_SOON.map((s) => <GsSoonCard key={s.name} g={s} />)}</div>
      </section>
    </main>
  );
};

Object.assign(window, { GsGap, gsOr, GS_PAGES, GsGamePage });
