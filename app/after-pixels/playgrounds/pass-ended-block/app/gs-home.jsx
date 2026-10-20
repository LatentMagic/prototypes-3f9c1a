// ============================================================================
// After Pixels — Home (screen 1) and Games (screen 6). The Pass page is in gs-billing.jsx.
// ============================================================================
// The hero: the product's promise beside Casebook's cover field, with the whole Casebook chat (DS ChatPlayback, played turn by turn) set inside it
// and scrollable (home-product-hero option 4, ratified 2026-10-11). The field is from
// home-hero option 9.
const GsFeature = ({ id }) => <GsCard id={id} />;
// NOTE (owner, 2026-10-13): Available games is NOT meant to hold every game. It is a small, chosen sample so a visitor gets a sense
// of what exists; the whole library is on Discover. A game is added here only on the owner's approval: this row is what we highlight.
// More games on each game's page uses this same list, minus the page's own game (owner, 2026-10-13).
// It already holds too much and needs revisiting. Daily Groups and Casebook were taken off (owner, 2026-10-13).
const GS_HOME_GAMES = ['word', 'mystery', 'escape', 'delve', 'barrow', 'hunter'];

const GS_WHATSNEW = [
  { v: '1.9', d: '1 October 2026', t: 'Copy any result as text', x: 'You can copy any finished result as text and paste it anywhere. The full record of rolls, guesses and statements stays on its session page.' },
  { v: '1.8', d: '24 September 2026', t: 'Streaks carry across devices', x: 'Your daily streak and record now follow your account, so they stay intact wherever you connect your AI.' },
  { v: '1.7', d: '10 September 2026', t: 'Connect in under two minutes', x: 'A single link now connects Claude, ChatGPT and other MCP assistants. No settings to copy between apps.' },
  { v: '1.6', d: '27 August 2026', t: 'Every play, in History', x: 'History lists every play under the day you played it. Find one by its name, number or date.' },
  { v: '1.5', d: '13 August 2026', t: 'Faster results after each play', x: 'The result and record appear as soon as the last turn is made.' },
  { v: '1.4', d: '30 July 2026', t: 'Account page', x: 'Manage your username, email, password, card and Pass from one place.' },
  { v: '1.3', d: '16 July 2026', t: 'History view', x: 'Look back over every play, grouped by day and by game.' },
  { v: '1.2', d: '2 July 2026', t: 'Search and filters in the library', x: 'Find a game by name, genre or how often it releases.' },
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
  const gs = useGs(); const field = React.useRef(null);
  // Touch: the Casebook pose plays while a finger is down on the name or the art, as on a game card, and stops on release or scroll.
  React.useEffect(() => {
    const f = field.current; if (!f) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) f.classList.add('is-on'); };
    const off = () => f.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    f.addEventListener('pointerdown', on); ends.forEach((t) => f.addEventListener(t, off));
    return () => { f.removeEventListener('pointerdown', on); ends.forEach((t) => f.removeEventListener(t, off)); };
  }, []);
  return (
    <main className="gs-wrap gs-main gs-home">
      <section className="gs-hero3">
        <div className="gs-hero-copy">
          <h1 className="gs-h1 gs-h1-home"><span>Your AI does the talking.</span> <span>The game keeps the score.</span></h1>
          <p className="gs-hero-sub">Play small games by talking to Claude or ChatGPT. The game holds the rules, the dice and your record.</p>
          <div className="gs-hero-act">
            <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            <DS.Button variant="secondary" onClick={gs.goHow}>See how it works</DS.Button>
          </div>
          <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
        </div>
        <div className="gs-hero-field" ref={field}>
          <div className="gs-hero-shapes4" aria-hidden="true" onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <i style={{ background: '#D66847', '--h': '62%', '--rise': '12px' }}></i>
            <i style={{ background: '#A390B2', '--h': '86%', '--rise': '6px' }}></i>
            <i style={{ background: '#F2EBE0', '--h': '66%', '--rise': '18px' }}></i>
            <b></b>
          </div>
          <button type="button" className="gs-hero-name" onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <span className="gs-label">A NEW CASE EVERY WEEK</span>
            <span className="gs-hero-name-t">{GS_NAME.casebook} <DS.Icon name="down" size={20} style={{ transform: 'rotate(-90deg)' }} /></span>
          </button>
          {/* The design system's ChatPlayback plays the case turn by turn and stops on the finished chat; its own control pauses and plays again. Under reduced motion it draws the finished chat still. */}
          <DS.ChatPlayback turns={GS_HERO_CHAT} loop mark={GS_CHAT_MARK} toolBy={GS_CHAT_BY} height={340} width={480} label="A Casebook case being played in a chat" />
        </div>
      </section>

      <section className="gs-band">
        <DS.CardRow title="Available games" className="gs-row4">
          {GS_HOME_GAMES.map((k) => <GsFeature key={k} id={k} />)}
        </DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>

      {/* The promise moved up into the hero, so this band is the Pass's own (home-product-hero option 4). */}
      <section id="gs-how" className="gs-band">
        <div className="gs-stack-sm">
          <h2 className="mcp-t-sec">The Pass</h2>
          <p>Play every game in full. £30 a year or £3 a month.</p>
          <DS.TextLink onClick={() => gs.go('pass')}>About the Pass</DS.TextLink>
        </div>
      </section>

      <GsWhatsNew />

      <p className="gs-small gs-foot">{GS.purchase}</p>
    </main>
  );
};

Object.assign(window, { GsHome, GsFeature, GS_HOME_GAMES });
