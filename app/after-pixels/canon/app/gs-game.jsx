// ============================================================================
// After Pixels — the game page: one template for every game. Delve's page is the model. Order: cover and
// play box; facts band (how long, how often, genre tags); pitch beside who does what; how it looks in
// your chat; (Delve: stat tiles); more games. Every null is a gap in the record and shows as "—".
// The play box at the top is the page's one Play. GsPlayBox is in gs-pass-game.jsx.
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
    box: { label: 'FREE WITH AN ACCOUNT', small: gsFreeSmall('Today’s word'), heading: 'Play it in your own AI chat', button: 'Play today’s word',
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
    box: { label: 'ONLY WITH THE PASS', small: gsFreeSmall('Today’s groups'), heading: 'New groups every day', button: 'Play today’s groups',
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
    box: { label: 'FREE WITH AN ACCOUNT', small: gsFreeSmall('Today’s case'), heading: 'Play it in your own AI chat', button: 'Play today’s case',
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
    box: { label: 'FIRST ROOM FREE', small: 'The first room is free with an account. Every other room comes with the After Pixels Pass.', heading: 'A new room every week', button: 'Play the first room',
      steps: [GS_STEP_CONNECT, <><b>Play the first room.</b> Every lock has three hints if you need them.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: 'About 30 min', often: 'A new room every week' }, tags: [],
    pitch: { h: 'The door’s locked and you’re on the wrong side of it.', ps: [
      'Examine what’s in the room and find its locks. Each one opens to an answer you work out from clues around you. Carry what you find, set what moves and choose your way on. The room changes as it opens, and a lock may open onto a second room.',
      'Every lock has three hints, taken in order. The first two point the way and the third gives the answer. A hint costs no try, and it shows on your result.',
      'No clock runs while you play, and every room can be finished. Your time against par shows once you’re out. Say what you examine first.'] },
    who: { ai: 'Describes the room and everything you find in it.', server: 'Decides what each move does and keeps secret what the room hasn’t shown. It records wrong tries, hints and your time.' },
    week: { title: 'This week’s room', line: 'Find the way out.', session: 'escape-week' },
  },
  casebook: {
    rhythm: 'ONE CASE',
    box: { label: 'ONLY WITH THE PASS', heading: 'Sixteen turns. One accusation.', session: 'casebook',
      steps: [GS_STEP_CONNECT, <><b>Play one full case</b>, start to ending.</>, <><b>Keep your result.</b> It stays in your history.</>],
      small: GS_NAME.casebook + ' comes only with the After Pixels Pass.' },
    facts: { long: '25–40 min', often: 'One case, ready when you are' },
    tags: ['Mystery', 'One case, sixteen turns, one accusation'],
    pitch: { h: 'Ask the question they haven’t prepared for.', ps: [
      'The suspects have had time to get their stories straight. Your AI plays every one of them, and each has a secret to keep.',
      'Sixteen turns to search, question and confront them. Then one accusation.',
      'The game engine holds every statement word for word, so any story can be checked.'] },
    who: { ai: 'Voices every suspect and narrates what you find.', server: 'Holds every statement and every piece of evidence, counts your turns and keeps the record.' },
    week: { label: 'A CASE', title: 'Sixteen turns, then one accusation', line: 'Ask the question they haven’t prepared for.', session: 'casebook' },
  },
  delve: {
    rhythm: 'ONE RUN A WEEK',
    box: { label: 'FIRST RUN FREE', heading: 'One run every week', session: 'delve', button: 'Play the first run',
      steps: [GS_STEP_CONNECT, <><b>Play this week’s run</b>, from the first room to its ending.</>, <><b>Keep your result.</b> It stays in your history.</>],
      small: 'The first run is free with an account. Every other run comes with the After Pixels Pass.' },
    facts: { long: '25–40 min', often: 'One run every week' },
    tags: ['Adventure', 'One run a week · five rooms'],
    pitch: { h: 'Get her out before the ritual is complete', ps: [
      'Goblins have dragged the miller’s daughter into the tunnels beneath Ashford Mill, and their shaman means to offer her to his idol at moonrise. Pick a fighter, a rogue or a wizard and make your way room by room: past bone chimes and goblin sentries, through choices about what to search and what to carry, to the shrine where the ritual is under way.',
      'Every risky move is a d20 roll, made by the game where nobody can fudge it. Each foe has a track you wear down, your hit points run out if you are careless, and the ritual creeps on with every slip. Your AI tells the story around the dice.'] },
    who: { ai: 'Narrates the warren, voices the goblins and the captive, and asks what you do next.', server: 'Rolls every die, keeps the score of foes, hit points and threat, decides each outcome and records your session.' },
    week: { title: 'This week’s run', line: 'Get Elsie out of the warren beneath Ashford Mill before the ritual is complete.', session: 'delve' },
  },
  barrow: {
    rhythm: 'A BARROW CAMPAIGN',
    box: { label: 'FIRST CHAPTER FREE', heading: 'A campaign in two chapters', button: 'Play Chapter 1',
      steps: [GS_STEP_CONNECT, <><b>Choose a hero</b>, then play at your own pace.</>, <><b>Keep your hero.</b> They carry on into the next chapter.</>],
      small: 'The first chapter is free with an account. Every other chapter comes with the After Pixels Pass.' },
    facts: { long: 'Several sessions', often: 'Two chapters, played at your own pace over several sessions' },
    tags: ['Adventure', 'Mist, old stone and honest dice'],
    pitch: { h: 'Bring the bell home. Keep the hero.', ps: [
      'Mist lies on the marsh, and the village of Hollowmere has lost its bell to the barrow. Go as a fighter, a rogue or a wizard, through the churchyard and Whisperwood to the old stone and the older things beneath it.',
      'Explore a world that stays put, fight with dice nobody can fudge, and stop whenever you like. Finish the quest and your hero carries on, levelled up, into the second chapter, out across the mere to the drowned abbey.',
      'Your AI is the Game Master and gives the world its voice. The game engine holds the map, rolls every die and keeps the journal. Choose your hero.'] },
    who: { ai: 'Plays the Game Master: narrates the world and turns what you say into moves.', server: 'Holds the map, the hero’s sheet and every enemy, rolls every die and keeps the journal.' },
    week: { label: 'A QUEST', title: 'The bell is in the barrow', line: 'Bring the Bell of Hollowmere home from the barrow, and stop whenever you like.' },
    // Chapter 2's card, for a player past Chapter 1 (label as deployed).
    week2: { label: 'A QUEST', title: 'The chalice is in the abbey', line: 'Bring the Chalice of St. Ebba home from the drowned abbey, and stop whenever you like.' },
  },
  hunter: {
    rhythm: 'ONE DAY',
    box: { label: 'ONLY WITH THE PASS', heading: 'A different day every time', session: 'hunter',
      steps: [GS_STEP_CONNECT, <><b>Play the day</b>, from grey dawn to firelight.</>, <><b>Keep your day.</b> It stays in your history.</>],
      small: '36,000 Summers Ago comes only with the After Pixels Pass.' },
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
  const others = window.GS_HOME_GAMES.filter((k) => k !== id);   return (
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
        {id === 'barrow' && <p className="gs-small gs-muted gs-credit" style={{ overflowWrap: 'anywhere', maxWidth: '72ch' }}>{GS_BARROW_CREDIT}</p>}
      </section>

      {id === 'delve' && (
        <section className="gs-grid3">
          <GsStat label="IN A RUN" figure="5 rooms" line="This week: flooded tunnel to shrine cavern." />
          <GsStat label="TYPICAL RUN" figure="10–14 rolls" line="Every one listed on your session page afterwards." />
          <GsStat label="ENDINGS" figure="4 ways out" line="Win, turn back early, fall, or run out of time." />
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
