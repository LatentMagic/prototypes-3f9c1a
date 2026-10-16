// [Platform] — Home, and the Pass mark on the game cards.
// Re-publishes GsHome, GsCard / GsGameCard and GsPick. GsHome is canon's (app/gs-home.jsx) with the Pass section changed;
// the hero, Available games, Coming soon and What's new are canon's. GsTile (Discover's wall) stays canon: no pill there.

// The Pass mark (owner, 2026-10-16) is the design system's: GameCard, GamePick and GameTile draw it on the picture when `pass`
// is set. Set for Pass-only games, for a player without the Pass.
// The Free and "First … free" chips come off the cards; the Pass is never a tag.
const cprTags = (k) => GS_GAMES[k].tags.filter((t) => t !== 'FREE' && t !== 'FIRST' && t !== 'PASS');
const CprArt = ({ host, id, shape }) => <div ref={host}><GsArt art={GS_GAMES[id].art} shape={shape} /></div>;
const CprCard = ({ id, mark }) => {
  const gs = useGs(); const host = useGsArtHost(); const g = GS_GAMES[id];
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<CprArt host={host} id={id} shape="wide" />} pass={cprLocked(gs, id)}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      mark={mark && <DS.Tag kind="daily" icon="check">{mark}</DS.Tag>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={cprTags(id)} ed={g.ed} />} />
  );
};
const CprPick = ({ id, label }) => {
  const gs = useGs(); const host = useGsArtHost(); const g = GS_GAMES[id];
  return (
    <DS.GamePick className="mcp-art-host gs-host"
      art={<CprArt host={host} id={id} shape="wide" />} pass={cprLocked(gs, id)}
      label={label}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={cprTags(id)} ed={g.ed} />} />
  );
};

const CprHome = () => {
  const gs = useGs(); const field = React.useRef(null);
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
        {/* Casebook here isn't a decided game (owner, 2026-10-16). The pattern stands whichever game it shows:
            one game's art, its schedule caption, a sample chat. */}
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
          <GsChatPic turns={GS_HERO_CHAT} height={340} width={480} label="A Casebook case being played in a chat" />
        </div>
      </section>

      <section className="gs-band">
        <DS.CardRow title="Available games" className="gs-row4">
          {GS_HOME_GAMES.map((k) => <GsFeature key={k} id={k} />)}
        </DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>

      {/* The Pass section: one paragraph built from the game data, "the Pass" its only link, no About the Pass (owner, 2026-10-16).
          The pay line sits under it; whether it stays here now that it is on Pricing is open. */}
      <section id="gs-how" className="gs-band gs-pu-band">
        <div className="gs-stack-sm">
          <h2 className="mcp-t-sec">The Pass</h2>
          <CprPassPara className="gs-pu-wrap" />
          <p className="gs-small gs-pu-wrap">{GS.purchase}</p>
        </div>
      </section>

      <GsWhatsNew />
    </main>
  );
};

Object.assign(window, { GsHome: CprHome, GsCard: CprCard, GsGameCard: CprCard, GsPick: CprPick, CprArt, cprTags });
