// Playground: should the home hero sell the product rather than one game? Overrides GsHome and GsDemoBar on window;
// option 0 is the app's own GsHome. Nothing in app/ changes. Brief and handoff: docs/specs/home-product-hero/.
const MH_KEY = 'pg_product_hero_v1';
let mh = { opt: '1', open: true, d: 'today', ...(() => { try { return JSON.parse(localStorage.getItem(MH_KEY)) || {}; } catch (e) { return {}; } })() };
const mhSubs = new Set();
const mhSet = (p) => { mh = { ...mh, ...p }; try { localStorage.setItem(MH_KEY, JSON.stringify(mh)); } catch (e) {} mhSubs.forEach((f) => f(mh)); };
const useMh = () => { const [s, setS] = React.useState(mh); React.useEffect(() => { mhSubs.add(setS); return () => mhSubs.delete(setS); }, []); return s; };

// app/ retired GsShot (the home now uses DS ChatPicture); this rig keeps the screenshot it was built with.
const MH_SHOT = 'assets/in-use/daily-word-claude-code-2026-10-05.png';
const MH_SHOT_ALT = 'Daily Word played in Claude Code';
const GsShot = window.GsShot || (({ crop, zoom, caption }) => {
  const [open, setOpen] = React.useState(false);
  const img = <img src={MH_SHOT} alt={MH_SHOT_ALT} className={crop ? 'is-crop' : undefined} />;
  return (
    <figure className="gs-shot">
      {zoom ? <button type="button" className="gs-shot-btn" onClick={() => setOpen(true)} aria-label="Open the screenshot whole">{img}<span className="gs-shot-hint">Open whole</span></button> : img}
      {caption && <figcaption className="gs-small gs-muted" style={{ padding: 12 }}>{caption}</figcaption>}
      {zoom && <div className="gs-zoom"><DS.Popup open={open} onClose={() => setOpen(false)} kind="panel" label={MH_SHOT_ALT}><img className="gs-zoom-img" src={MH_SHOT} alt={MH_SHOT_ALT} /></DS.Popup></div>}
    </figure>
  );
});
// The line is the home's own (home-how option 4, line c, ratified 2026-10-09), moved up.
const MhH1 = () => <h1 className="gs-h1 mh-h1"><span>Your AI does the talking.</span> <span>The game keeps the score.</span></h1>;
const MH_SUB = 'Play small games by talking to Claude or ChatGPT. The game holds the rules, the dice and your record.';
const MhAct = () => { const gs = useGs(); return <div className="gs-hero-act"><DS.Button onClick={gs.startFree}>Start free</DS.Button><DS.Button variant="secondary" onClick={gs.goHow}>See how it works</DS.Button></div>; };
const MhWorks = () => <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>;
const MhSoon = () => <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>;
const MhAll = () => { const gs = useGs(); return <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>; };
const MhFeats = () => <div className="gs-feats" role="region" aria-label="Available games" tabIndex={0}>{GS_GAME_ORDER.map((k) => <GsFeature key={k} id={k} />)}</div>;
const MhGames = () => (
  <section className="gs-band">
    <h2 className="mcp-t-sec">Available games</h2>
    <MhFeats /><MhSoon /><MhAll />
  </section>
);
const MhPass = () => { const gs = useGs(); return (
  <div className="hm-pass">
    <span className="gs-label">THE PASS</span>
    <p>Play every game and every edition. Try it free for seven days.</p>
    <DS.TextLink onClick={() => gs.go('pass')}>About the Pass</DS.TextLink>
  </div>
); };
// Options 1 and 2 moved the band's line to the top, so the band keeps the Pass alone.
const MhPassBand = () => <section id="gs-how" className="gs-band"><div className="mh-pass-solo"><MhPass /></div></section>;
const MhTail = () => <><GsWhatsNew /><p className="gs-small gs-foot">{GS.purchase}</p></>;

// ---- 1: the promise, with play beside it ----
const MhOne = () => (
  <main className="gs-wrap gs-main gs-home">
    <section className="gs-hero3 mh-hero">
      <div className="gs-hero-copy"><MhH1 /><p className="gs-hero-sub">{MH_SUB}</p><MhAct /><MhWorks /></div>
      <div className="mh-shot"><GsShot id="dailyWord" crop zoom /></div>
    </section>
    <MhGames /><MhPassBand /><MhTail />
  </main>
);
// ---- 2: who does what ----
const MhTwo = () => (
  <main className="gs-wrap gs-main gs-home">
    <section className="gs-hero3 mh-hero">
      <div className="gs-hero-copy">
        <MhH1 />
        <p className="gs-hero-sub">Play small games by talking to Claude or ChatGPT.</p>
        <div className="mh-who">
          <div className="mh-who-col"><span className="gs-label">YOUR AI</span><p>It tells the story and plays every character.</p><p className="gs-muted">It answers whatever you say, in the game’s voice.</p></div>
          <div className="mh-who-col"><span className="gs-label">THE GAME</span><p>It holds the rules, the dice and every turn.</p><p className="gs-muted">It keeps each result, so nobody can fudge it.</p></div>
        </div>
        <MhAct /><MhWorks />
      </div>
      <div className="mh-shot"><GsShot id="dailyWord" crop zoom /></div>
    </section>
    <MhGames /><MhPassBand /><MhTail />
  </main>
);
// ---- 3: the promise over the library ----
const MhThree = () => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main gs-home">
      <section className="mh-hero mh-wide">
        <div className="gs-hero-copy mh-wide-copy"><MhH1 /><p className="gs-hero-sub">{MH_SUB}</p><MhAct /></div>
        <MhFeats />
        <MhAll />
      </section>
      <section className="gs-band"><MhSoon /></section>
      <section id="gs-how" className="gs-band">
        <div className="hm-how">
          <div className="hm-say">
            <h2 className="mcp-t-sec">Here is Daily Word, played in Claude Code.</h2>
            <GsShot id="dailyWord" crop zoom />
            <DS.TextLink onClick={gs.goHow}>See how it works</DS.TextLink>
          </div>
          <MhPass />
        </div>
      </section>
      <MhTail />
    </main>
  );
};

// ---- 4 to 6: rebased on today's home (Casebook cover field with its chat, home-hero option 9) ----
// The field mirrors GsHome's in app/gs-home.jsx; keep the two in step.
const MhShapes = ({ tall }) => { const gs = useGs(); return (
  <div className="gs-hero-shapes4" aria-hidden="true" onClick={() => gs.go(GS_GAMES.casebook.route)}>
    <i style={{ background: '#D66847', '--h': '62%', '--rise': '12px' }}></i>
    <i style={{ background: '#A390B2', '--h': '86%', '--rise': '6px' }}></i>
    <i style={{ background: '#F2EBE0', '--h': tall ? '66%' : '48%', '--rise': '18px' }}></i>
    <b></b>
  </div>
); };
const MhName = () => { const gs = useGs(); return (
  <button type="button" className="gs-hero-name" onClick={() => gs.go(GS_GAMES.casebook.route)}>
    <span className="gs-label">A NEW CASE EVERY WEEK</span>
    <span className="gs-hero-name-t">{GS_NAME.casebook} <DS.Icon name="down" size={20} style={{ transform: 'rotate(-90deg)' }} /></span>
  </button>
); };
const MhChat = () => <GsChatPic turns={GS_HERO_CHAT} height={340} width={480} label="A Casebook case being played in a chat" />;
const MhField = () => <div className="gs-hero-field"><MhShapes /><MhName /><MhChat /></div>;
const MhCopy = ({ h1 = true }) => <div className="gs-hero-copy">{h1 && <MhH1 />}<p className="gs-hero-sub">{MH_SUB}</p><MhAct /><MhWorks /></div>;
const MhGamesNow = () => { const gs = useGs(); return (
  <section className="gs-band">
    <GsCardRow label="Available games" head={<h2 className="mcp-t-sec">Available games</h2>}>
      {GS_GAME_ORDER.map((k) => <GsFeature key={k} id={k} />)}
    </GsCardRow>
    <MhSoon /><MhAll />
  </section>
); };
// The slogan moved up, so the band's heading is the Pass's own.
const MhPassNow = () => { const gs = useGs(); return (
  <section id="gs-how" className="gs-band">
    <div className="gs-stack-sm">
      <h2 className="mcp-t-sec">The Pass</h2>
      <p>Play every game in full. Try it free for 14 days.</p>
      <DS.TextLink onClick={() => gs.go('pass')}>About the Pass</DS.TextLink>
    </div>
  </section>
); };
const MhRest = () => <><MhGamesNow /><MhPassNow /><MhTail /></>;

// 4 only: the whole Casebook conversation from its product page, in a chat that scrolls; it opens on the latest turn.
const MH_CB_ALL = (GS_CHATS.casebook || []).flatMap((c) => c.turns);
const MhFour = () => {
  const ref = React.useRef(null);
  const [chat, setChat] = React.useState(null); const [more, setMore] = React.useState(false);
  React.useEffect(() => {
    const b = ref.current && ref.current.querySelector('.mcp-chat-body');
    if (!b) return;
    setChat(b.parentElement);
    b.tabIndex = 0; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'The Casebook chat, scrolls');
    let moved = false; const mark = () => { const up = b.scrollTop > 4; b.dataset.more = up ? 'up' : ''; setMore(up); };
    const end = () => { if (!moved) b.scrollTop = b.scrollHeight; mark(); };
    b.addEventListener('scroll', mark, { passive: true });
    const stop = () => { moved = true; };
    b.addEventListener('wheel', stop, { passive: true }); b.addEventListener('touchstart', stop, { passive: true }); b.addEventListener('keydown', stop);
    const ro = new ResizeObserver(end); ro.observe(b); [...b.children].forEach((c) => ro.observe(c));
    end(); const t = setTimeout(end, 600);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, []);
  return (
    <main className="gs-wrap gs-main gs-home">
      <section className="gs-hero3 mh4">
        <MhCopy />
        <div className="gs-hero-field" ref={ref}>
          <MhShapes tall /><MhName />
          <GsChatPic turns={MH_CB_ALL} height={340} width={480} label="A Casebook case being played in a chat" />
          {chat && ReactDOM.createPortal(
            <button type="button" className="mh4-up" hidden={!more} onClick={() => { const b = chat.querySelector('.mcp-chat-body'); b.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}>
              <DS.Icon name="down" size={16} style={{ transform: 'rotate(180deg)' }} />Earlier in the case
            </button>, chat)}
        </div>
      </section>
      <MhRest />
    </main>
  );
};
const MhFive = () => (
  <main className="gs-wrap gs-main gs-home">
    <section className="mh-hero mh-wide mh5">
      <MhH1 />
      <div className="gs-hero3 mh5-row"><MhCopy h1={false} /><MhField /></div>
    </section>
    <MhRest />
  </main>
);
const MhSix = () => (
  <main className="gs-wrap gs-main gs-home">
    <section className="mh-hero mh-wide mh6">
      <div className="gs-hero-copy mh-wide-copy"><MhH1 /><p className="gs-hero-sub">{MH_SUB}</p><MhAct /></div>
      <div className="gs-hero-field mh6-field">
        <MhShapes />
        <div className="mh6-pitch">
          <MhName />
          <h2 className="mcp-t-sec">Someone’s lying to you. Go and find out who.</h2>
          <p>Your AI plays every suspect, and some of them are lying. Find the proof that breaks their story.</p>
        </div>
        <MhChat />
      </div>
      <MhWorks />
    </section>
    <MhRest />
  </main>
);

const MH_BASE = { GsHome: window.GsHome };
const MH_VIEW = { '1': MhOne, '2': MhTwo, '3': MhThree, '4': MhFour, '5': MhFive, '6': MhSix };
const MhHome = () => {
  const s = useMh(); const V = s.opt === '0' ? MH_BASE.GsHome : (MH_VIEW[s.opt] || MhOne);
  return <div className="mh-d" data-d={s.d}><V /></div>;
};

// ---- Strip ----
const MH_OPTS = [
  { id: '0', name: 'Today: one game at the top',
    idea: 'The hero sells one game: Casebook’s headline and cover field, with a Casebook chat set inside it. The product line sits lower, after the games.',
    cost: 'A stranger meets a mystery before they learn what [Platform] does that a chat alone can’t.' },
  { id: '1', name: 'The promise, with play beside it',
    idea: 'The headline says what [Platform] is better at: your AI plays, the game keeps the rules and the score. A real screenshot beside it shows a game inside a chat.',
    cost: 'No game gets the top, so the hero loses Casebook’s hook and its art. The band lower down keeps only the Pass.' },
  { id: '2', name: 'Who does what',
    idea: 'The headline, then two short columns: what your AI does and what the game does. The split is the reason to trust the result.',
    cost: 'More to read before the buttons, and the hero runs longer on a phone.' },
  { id: '3', name: 'The promise over the library',
    idea: 'The headline sits over the games themselves, so the covers are the art. The screenshot moves down into the how-it-works band.',
    cost: 'The first image is a row of covers, not a game being played. On a phone the games start below the fold.' },
  { id: '4', name: 'The promise, beside today’s game',
    idea: 'Option 1 on today’s home: the slogan on two lines, and Casebook’s cover field with its chat where the screenshot was. The band lower down is headed The Pass.',
    cost: 'The field says Casebook while the headline says the product, so the art and the words point at different things.' },
  { id: '5', name: 'The promise across, the game below it',
    idea: 'Option 3’s wide slogan runs across the page. Under it, the product’s line and buttons sit beside Casebook’s cover field and chat.',
    cost: 'The tallest hero here: on a phone the buttons sit under a large headline and the field starts below the fold.' },
  { id: '6', name: 'The promise, then the game’s own pitch',
    idea: 'The wide slogan, line and buttons sell the product. Below them Casebook gets the whole width: its own headline and line beside its chat, inside its cover field.',
    cost: 'Two headlines in one hero; Casebook’s has to stay clearly second, and the hero runs long before the games.' },
];
let mhBooted = false;
const MhStrip = () => {
  const gs = useGs(); const s = useMh(); const o = MH_OPTS.find((x) => x.id === s.opt) || MH_OPTS[1];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!mhBooted) { mhBooted = true; gs.setView('out'); setTimeout(() => window.gsApi.go('home'), 0); } }, []);
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  const pick = (v) => { mhSet({ opt: v }); if (gs.route.name !== 'home') gs.go('home'); else gsScrollTop(); };
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {MH_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => mhSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Density</span>{seg([['roomy', 'Roomy'], ['today', 'Today'], ['compact', 'Compact']], s.d, (v) => mhSet({ d: v }))}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => mhSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p><b>Density.</b> Roomy and Compact change the space in the hero and between bands, and Compact sets a smaller headline. The headline stays the largest thing on the page.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsHome: MhHome, GsDemoBar: MhStrip });
