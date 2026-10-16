// ============================================================================
// Playground (pass-upsell-proposal): Home (A1 to A6) and the game card's lock (A4).
// Re-publishes GsHome, GsCard / GsGameCard and GsSoonCard in this page only. GsHome is canon's (app/gs-home.jsx)
// with the Pass section, the pay line and the hero switched per variation; everything else in it is as canon has it.
// ============================================================================
const PguShipCard = window.GsCard;
const PguShipSoon = window.GsSoonCard;

// A4: the lock on the art. Not pressable; the card's own press opens the game. Same three treatments as Discover, tidied.
const PguLock = ({ d }) => (
  <span className={'pgu-lock ' + (d === 1 ? 'is-corner' : d === 2 ? 'is-chip' : 'is-strip')} role="img" aria-label="Pass only">
    <DS.Icon name="lock" size={14} />
    {d === 2 ? <span aria-hidden="true">Pass</span> : d === 3 ? <span aria-hidden="true">Pass only</span> : null}
  </span>
);
const PguCard = ({ id, mark }) => {
  const gs = useGs(); const v = usePgu(); const host = useGsArtHost(); const g = GS_GAMES[id];
  if (gs.route.name === 'games') return <PguShipCard id={id} mark={mark} />; // Discover is out of scope: canon cards
  const lock = PGU_STAGE[id] === 'pass' && gs.view !== 'pass';
  const tags = g.tags.filter((t) => t !== 'FREE' && t !== 'FIRST' && t !== 'PASS');
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<div ref={host} className="pgu-art"><GsArt art={g.art} shape="wide" />{lock && <PguLock d={v.A4} />}</div>}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      mark={mark && <DS.Tag kind="daily" icon="check">{mark}</DS.Tag>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={tags} ed={g.ed} />} />
  );
};
// A5: the Barrow's coming-soon card names its next chapter.
const PguSoon = ({ g }) => { const v = usePgu(); return <PguShipSoon g={g.route === 'barrow' ? { ...g, label: PGU_A5[v.A5][0] } : g} />; };

// A1 + A2: the Pass section and the pay line under it.
const PguPassBand = () => {
  const gs = useGs(); const v = usePgu(); const c = PGU_A1[v.A1] || pguPassLine(v);
  const toPass = () => gs.go('pass');
  return (
    <section id="gs-how" className="gs-band pgu-A1">
      <div className="gs-stack-sm">
        <h2 className="mcp-t-sec">The Pass</h2>
        {c.solo
          ? <p className="pgu-wrap">{c.p1 ? c.p1 + ' ' : ''}{c.lead}<button type="button" className="gs-inlink" onClick={toPass}>{c.link}</button>{c.p2}</p>
          : <>
        {c.p1 && <p className="pgu-wrap">{gsKeepLast(c.p1)}</p>}
        <p className="pgu-wrap">{c.link ? <>{c.lead}<button type="button" className="gs-inlink" onClick={toPass}>{c.link}</button>{c.p2}</> : gsKeepLast(c.p2)}</p>
        {!c.solo && <div><DS.TextLink onClick={toPass}>About the Pass</DS.TextLink></div>}</>}
        {v.A2 === 1 && <p className="gs-small pgu-wrap">{GS.purchase}</p>}
      </div>
      {v.A2 === 2 && <p className="gs-small gs-foot pgu-wrap">{GS.purchase}</p>}
    </section>
  );
};

// A6: the hero chat, by variation. The Delve chat is the turns from Delve's own product page (a sample).
const PGU_DELVE_CHAT = GS_CHATS.delve.flatMap((c) => c.turns);
const PGU_PASS_CHAT = [...GS_HERO_CHAT, { from: 'user', text: 'What happens after this case?' },
  { from: 'ai', tool: 'casebook', text: 'This first case is free. Every case after it comes with the [Platform] Pass.' }];
const PguHeroField = () => {
  const gs = useGs(); const v = usePgu(); const field = React.useRef(null);
  const delve = v.A6 === 3; const id = delve ? 'delve' : 'casebook';
  React.useEffect(() => {
    const f = field.current; if (!f) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) f.classList.add('is-on'); };
    const off = () => f.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    f.addEventListener('pointerdown', on); ends.forEach((t) => f.addEventListener(t, off));
    return () => { f.removeEventListener('pointerdown', on); ends.forEach((t) => f.removeEventListener(t, off)); };
  }, []);
  const cap = v.A6 === 2 ? 'YOUR AI NEVER ASKS YOU TO PAY' : delve ? PGU_DELVE_CAP : 'A NEW CASE EVERY WEEK';
  const turns = delve ? PGU_DELVE_CHAT : v.A6 === 4 ? PGU_PASS_CHAT : GS_HERO_CHAT;
  const a = GS_ART.delve;
  return (
    <div className="gs-hero-field pgu-A6" ref={field} style={delve ? { background: '#421A28' } : undefined}>
      {delve
        ? <div className="pgu-hero-art" aria-hidden="true" onClick={() => gs.go('delve')} dangerouslySetInnerHTML={{ __html: a.svg.replace('xMidYMid slice', 'xMidYMax meet').replace('<rect width="160" height="120" fill="#421A28"/>', '') }} />
        : <div className="gs-hero-shapes4" aria-hidden="true" onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <i style={{ background: '#D66847', '--h': '62%', '--rise': '12px' }}></i>
            <i style={{ background: '#A390B2', '--h': '86%', '--rise': '6px' }}></i>
            <i style={{ background: '#F2EBE0', '--h': '66%', '--rise': '18px' }}></i>
            <b></b>
          </div>}
      <button type="button" className="gs-hero-name" onClick={() => gs.go(GS_GAMES[id].route)}>
        <span className="gs-label">{cap}</span>
        <span className="gs-hero-name-t">{GS_GAMES[id].name} <DS.Icon name="down" size={20} style={{ transform: 'rotate(-90deg)' }} /></span>
      </button>
      <GsChatPic key={'hero' + v.A6} turns={turns} height={340} width={480} label={delve ? 'A sample Delve scene being played in a chat' : 'A Casebook case being played in a chat'} />
    </div>
  );
};

const PguHome = () => {
  const gs = useGs();
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
        <PguHeroField />
      </section>

      <section className="gs-band pgu-A4">
        <DS.CardRow title="Available games" className="gs-row4">
          {GS_HOME_GAMES.map((k) => <GsFeature key={k} id={k} />)}
        </DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>

      <PguPassBand />

      <GsWhatsNew />
    </main>
  );
};

Object.assign(window, { GsHome: PguHome, GsCard: PguCard, GsGameCard: PguCard, GsSoonCard: PguSoon, PguLock });
