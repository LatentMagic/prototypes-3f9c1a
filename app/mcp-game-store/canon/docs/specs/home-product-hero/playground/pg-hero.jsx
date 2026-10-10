// Playground: should the home hero sell the product rather than one game? Overrides GsHome and GsDemoBar on window;
// option 0 is the app's own GsHome. Nothing in app/ changes. Brief and handoff: docs/specs/home-product-hero/.
const MH_KEY = 'pg_product_hero_v1';
let mh = { opt: '1', open: true, d: 'today', ...(() => { try { return JSON.parse(localStorage.getItem(MH_KEY)) || {}; } catch (e) { return {}; } })() };
const mhSubs = new Set();
const mhSet = (p) => { mh = { ...mh, ...p }; try { localStorage.setItem(MH_KEY, JSON.stringify(mh)); } catch (e) {} mhSubs.forEach((f) => f(mh)); };
const useMh = () => { const [s, setS] = React.useState(mh); React.useEffect(() => { mhSubs.add(setS); return () => mhSubs.delete(setS); }, []); return s; };

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

const MH_BASE = { GsHome: window.GsHome };
const MhHome = () => {
  const s = useMh(); const B = MH_BASE.GsHome;
  return <div className="mh-d" data-d={s.d}>{s.opt === '0' ? <B /> : s.opt === '2' ? <MhTwo /> : s.opt === '3' ? <MhThree /> : <MhOne />}</div>;
};

// ---- Strip ----
const MH_OPTS = [
  { id: '0', name: 'Today: one game at the top',
    idea: 'The hero sells one game: Casebook’s headline and cover field, with a screenshot of Daily Word set inside it. The product line sits lower, after the games.',
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
