// ============================================================================
// [Platform] — the game page: one template for all four games (first-release-
// games). Delve's page is the model. Order: cover and play box; facts band
// (how long, how often, genre tags); pitch beside who does what; how it looks
// in your chat; (Delve: stat tiles); more games. Every null is a gap in the record and shows as "—".
// The play box at the top is the page's one Play; the edition card that repeated it went 2026-10-11 (phone-snags-second-pass).
// `week` stays in GS_PAGES: the library game pages read its line.
// ============================================================================
const GsGap = () => <span className="gs-gap" title="Not decided yet">—</span>;
const gsOr = (v) => (v == null ? <GsGap /> : v);
// The free games' small line under Play: one template, so every free game says it the same way.
const gsFreeSmall = (edition) => edition + ', your streak and your achievements are free with an account.';
const GS_STEP_CONNECT = <><b>Connect your AI</b> in about two minutes. ChatGPT, Claude, OpenClaw and others.</>;

const GS_PAGES = {
  word: {
    rhythm: 'NEW EVERY DAY',
    box: { free: true, label: 'FREE WITH AN ACCOUNT', small: gsFreeSmall('Today’s word'), heading: 'Play it in your own AI chat', button: 'Play today’s word',
      steps: [GS_STEP_CONNECT, <><b>Play today’s word.</b> You get six guesses.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'Six guesses to find today’s five-letter word.', ps: [
      'Each guess comes back marked letter by letter: right place, wrong place, or not in the word. Stuck? You get two hints a day.',
      'Your AI runs the game but isn’t told the word until it’s over, so it can’t give it away. Solve it to keep your streak, then share your grid.'] },
    who: { ai: 'Takes your guesses and shows you how each one scored.', server: 'Holds the word, marks every guess and keeps the count.' },
    week: { title: 'Today’s word', line: 'Five letters. Six guesses.', session: 'word-today' },
  },
  groups: {
    rhythm: 'NEW EVERY DAY',
    box: { free: true, label: 'FREE WITH AN ACCOUNT', small: gsFreeSmall('Today’s groups'), heading: 'New groups every day', button: 'Play today’s groups',
      steps: [GS_STEP_CONNECT, <><b>Find today’s four groups.</b> You can make four mistakes.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'Sixteen words hide four groups of four.', ps: [
      'Pick four words you think belong together. You can make four mistakes, and the game tells you when you’re one word away.',
      'Your AI passes on your picks and explains the groups afterwards. The game engine checks every one. Find the first group.'] },
    who: { ai: 'Passes on your picks and explains the groups once you finish.', server: 'Holds the groups, checks every pick and counts your mistakes.' },
    week: { title: 'Today’s groups', line: 'Four groups. Four mistakes to spare.', session: 'groups-today' },
  },
  mystery: {
    rhythm: 'NEW EVERY DAY',
    box: { free: true, label: 'FREE WITH AN ACCOUNT', small: gsFreeSmall('Today’s case'), heading: 'Play it in your own AI chat', button: 'Play today’s case',
      steps: [GS_STEP_CONNECT, <><b>Question the inspector</b>, then make one accusation.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'There’s a body and a story that doesn’t add up.', ps: [
      'The clues point to one suspect, one weapon and one room. Ask the inspector two yes-or-no questions, then make one accusation.',
      'Your AI sets the scene, voices the cast and reads you the clues. The game engine holds the answer until you accuse. Make your move.'] },
    who: { ai: 'Voices the suspects and the inspector, and takes your questions.', server: 'Holds the answer, counts your questions and checks your accusation.' },
    week: { title: 'Today’s case', line: 'One suspect, one weapon, one room. One accusation.', session: 'mystery-today' },
  },
  escape: {
    rhythm: 'A NEW ROOM EVERY WEEK',
    box: { free: true, label: 'FREE WITH AN ACCOUNT', small: gsFreeSmall('This week’s room'), heading: 'A new room every week', button: 'Play this week’s room',
      steps: [GS_STEP_CONNECT, <><b>Play this week’s room</b>, from the locked door to the way out.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'A new room every week' }, tags: [],
    pitch: { h: 'The door’s locked and you’re on the wrong side of it.', ps: [
      'Search the room, try what you find and work out the way out. A new room arrives every Monday.',
      'Your AI describes the room and what you find. The game engine decides what each move does and counts them. Say what you search first.'] },
    who: { ai: 'Describes the room and everything you find in it.', server: 'Decides what each move does, counts your moves and keeps the record.' },
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
    week: { title: 'This week’s scene', line: 'Get her out before the drums stop.', session: 'delve' },
  },
  barrow: {
    rhythm: 'ONE CHAPTER',
    box: { first: true, label: 'FIRST CHAPTER FREE', heading: 'A campaign told in chapters', button: 'Play the first chapter',
      steps: [GS_STEP_CONNECT, <><b>Play chapter 1</b>, from the barrow’s door to its deepest room.</>, <><b>Keep your loot.</b> It carries into the next chapter.</>],
      small: 'The first chapter is free with an account. Every other chapter comes with the [Platform] Pass.' },
    facts: { long: '45–60 min', often: 'At your own pace' },
    tags: ['Adventure', 'Five levels · your loot carries on'],
    pitch: { h: 'Something under the hill wants its gold back.', ps: [
      'The barrow above Hollowmere has been sealed for three hundred years. Last night the seal broke, and the village’s sheep began walking into the hill.',
      'Chapter 1 takes you down five levels. Whatever you bring back stays yours: your loot and your wounds carry into the next chapter.',
      'Your AI tells the story and voices what lives under the hill. The game engine rolls every die and keeps your pack. Pick your first door.'] },
    who: { ai: 'Narrates each level and voices what lives under the hill.', server: 'Rolls every die, carries your loot between levels and keeps the record.' },
    week: { title: 'Chapter 1', line: 'Five levels under the hill. Your loot carries on.' },
  },
  hunter: {
    rhythm: 'ONE DAY',
    box: { label: 'ONLY WITH THE PASS', heading: 'A different day every time', session: 'hunter',
      steps: [GS_STEP_CONNECT, <><b>Play the day</b>, from grey dawn to firelight.</>, <><b>Keep your day.</b> It stays in your history.</>],
      small: '36,000 Summers Ago comes only with the [Platform] Pass.' },
    facts: { long: '2 hours', often: 'A different day every time you start' }, tags: [],
    pitch: { h: 'The day goes on whether you join it or not.', ps: [
      'It’s grey dawn, 36,000 years ago, and your band is already moving. Hunters head for the cliffs. Gatherers set out for the plateau.',
      'Join them, or go your own way. Whatever you skip, the day carries on without you. You’ll hear what you missed at the fire.',
      'Your AI tells the day and speaks for everyone in it. The game engine rolls the dice and keeps the record. Say what you do first.'] },
    who: { ai: 'Tells the day, speaks for everyone in it and answers whatever you try.', server: 'Keeps the time, rolls the dice, tracks where everyone is and records what you do.' },
    week: { title: 'The day', line: 'One day, dawn to firelight. Start it over and it goes differently.', session: 'hunter', unmarked: true },
  },
};
const GS_FACT_LABELS = [['long', 'How long'], ['often', 'How often']];

const GsPlayBox = ({ id }) => {
  const gs = useGs();
  const g = GS_GAMES[id]; const b = GS_PAGES[id].box;
  const paying = gs.view === 'pass';
  // Casebook and Delve: "Play" for a Pass holder, the first-edition label for everyone else. The prompt is the same for all.
  const label = b.first && !paying ? b.button : 'Play';
  // Signed in, the first sentence ("The first case is free with an account.") goes; the rest stays.
  const small = b.first && gs.view !== 'out' && b.small ? b.small.slice(b.small.indexOf('. ') + 2) : b.small;
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">{b.label}</span>
      <h2 className="mcp-t-card">{b.heading}</h2>
      <GsSteps items={[<><b>Connect your AI</b> first. <GsHowLink label="How to connect" /></>, ...b.steps.slice(1).map((s) => gsOr(s))]} />
      {b.free || b.first || paying
        ? <DS.Button block onClick={() => gs.play(g.name)}>{label}</DS.Button>
        : <DS.Button block onClick={() => gs.go('pass')}>Get the Pass</DS.Button>}
      {small && <p className="gs-small">{small}{!b.free && ' ' + GS.purchase}</p>}
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

const GsGamePage = ({ id, top }) => {
  const gs = useGs();
  const g = GS_GAMES[id]; const p = GS_PAGES[id];
  const others = window.GS_HOME_GAMES.filter((k) => k !== id); // Home's Available games row, minus this game
  return (
    <main className="gs-wrap gs-main">
      {top}

      <section className="gs-head-split">
        <div className="gs-hero-cover">
          <GsCover art={g.art} fit />
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
        <GsChatRow id={id} />
      </section>

      {id === 'delve' && (
        <section className="gs-grid3">
          <GsStat label="IN A SCENE" figure="6–7 locations" line="Sinkhole to ritual chamber, shuffled each run." />
          <GsStat label="TYPICAL RUN" figure="10–14 rolls" line="Every one listed on your session page afterwards." />
          <GsStat label="ENDINGS" figure="4 ways out" line="Clean rescue, close call, alone, or caught." />
        </section>
      )}

      {/* More games is the home page's card row (GS_HOME_GAMES) without this game, then the soon cards and a link to the store. */}
      <section className="gs-stack-md">
        <DS.CardRow title="More games" className="gs-row4">
          {others.map((k) => <GsGameCard key={k} id={k} />)}
        </DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((s) => <GsSoonCard key={s.name} g={s} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>
    </main>
  );
};

Object.assign(window, { GsGap, gsOr, GS_PAGES, GsGamePage });
