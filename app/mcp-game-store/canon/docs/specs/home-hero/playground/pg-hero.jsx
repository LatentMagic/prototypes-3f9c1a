// Playground: three home heroes, signed out. Each one makes the headline, the art and the
// screenshot point at the same thing. The rest of the home page is the real GsHome, mounted
// below with its own hero hidden (.hh-swap in the entry's CSS), so nothing under the hero is copied.
const HH_KEY = 'pg_home_hero_v1';
let hhState = { opt: '1', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(HH_KEY)) || {}; } catch (e) { return {}; } })() };
const hhSubs = new Set();
const hhSet = (p) => { hhState = { ...hhState, ...p }; try { localStorage.setItem(HH_KEY, JSON.stringify(hhState)); } catch (e) {} hhSubs.forEach((f) => f(hhState)); };
const useHh = () => { const [s, setS] = React.useState(hhState); React.useEffect(() => { hhSubs.add(setS); return () => hhSubs.delete(setS); }, []); return s; };

const HH_OPTS = [
  { id: '1', name: 'The game it names',
    idea: 'Keep the headline and give it its game. Someone lies to you in Casebook, so the art becomes Casebook. The subline sells every game.',
    cost: 'Casebook needs the Pass, so Start free never reaches the game in the picture. No Casebook screenshot exists yet, so the art is its card, not play. The card repeats in Available games below.' },
  { id: '2', name: 'Free today',
    idea: 'Everything in the hero is what Start free gives you today: the free puzzles, their covers and the real screenshot of one being played.',
    cost: 'The headline is built from today’s puzzle kinds, so it needs rewriting if they change. The Pass games first appear in the next band.' },
  { id: '3', name: 'One promise, every game',
    idea: 'The headline says what every game shares: your AI plays the parts and the game holds the answer. The screenshot shows that happening, with every game’s cover beside it, named.',
    cost: 'It explains more than it dares, so it loses some of the pull of a cold open. The covers repeat the Available games band below.' },
];
const hhOpt = (st) => HH_OPTS.find((o) => o.id === st.opt) || HH_OPTS[0];

// Shared by all three: the buttons and Works with, unchanged from the app.
const HhActs = () => {
  const gs = useGs();
  return <>
    <div className="gs-hero-act">
      <DS.Button onClick={gs.startFree}>Start free</DS.Button>
      <DS.Button variant="secondary" onClick={() => gsScrollToId('gs-how')}>See how it works</DS.Button>
    </div>
    <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
  </>;
};

const Hh1 = () => {
  const gs = useGs();
  return (
    <section className="gs-hero3">
      <div className="gs-hero-copy">
        <h1 className="gs-h1 gs-h1-home"><span>Someone’s lying to you.</span> <span>Go and find out who.</span></h1>
        <p className="gs-hero-sub">Play small games by talking to your AI. New ones arrive every day.</p>
        <HhActs />
      </div>
      <div className="hh-art hh-feat">
        <GsFeature id="casebook">
          <div className="gs-card-foot">
            <span>You get sixteen turns and one accusation.</span>
            <DS.TextLink onClick={() => gs.go('casebook')}>See Casebook</DS.TextLink>
          </div>
        </GsFeature>
      </div>
    </section>
  );
};

const Hh2 = () => (
  <section className="gs-hero3">
    <div className="gs-hero-copy">
      <h1 className="gs-h1 hh-h1">There’s a locked door, a body and a word you can’t see yet.</h1>
      <p className="gs-hero-sub">Today’s puzzles are free. Play them by talking to your AI. Tomorrow brings new ones.</p>
      <HhActs />
    </div>
    <div className="hh-art">
      <DS.Card style={{ justifyItems: 'stretch', alignContent: 'start', gap: 16 }}>
        <GsShot id="dailyWord" crop />
        <GsTodayList />
      </DS.Card>
    </div>
  </section>
);

const Hh3 = () => {
  const gs = useGs();
  return (
    <section className="gs-hero3">
      <div className="gs-hero-copy">
        <h1 className="gs-h1 hh-h1">Your AI plays every part. Only the game knows the answer.</h1>
        <p className="gs-hero-sub">Pick a game and say what you do first. New ones arrive every day.</p>
        <HhActs />
      </div>
      <div className="hh-art hh-stack">
        <GsShot id="dailyWord" crop caption={GS_PAGES.daily.shots[0]} />
        <ul className="hh-covers">
          {GS_GAME_ORDER.map((k) => {
            const g = GS_GAMES[k];
            return (
              <li key={k}>
                <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={() => gs.go(g.route)} />
                <button type="button" className="gs-titlebtn hh-cov-name" onClick={() => gs.go(g.route)}>{g.name}</button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

const HH_HERO = { 1: Hh1, 2: Hh2, 3: Hh3 };
const HhHome = () => {
  const st = useHh(); const Hero = HH_HERO[hhOpt(st).id];
  return (
    <div className="hh-swap">
      <main className="gs-wrap gs-main gs-home"><Hero /></main>
      <window.GsHomeReal />
    </div>
  );
};

// ---- Strip (prototype control, not product) ----------------------------------------
let hhBooted = false;
const HhStrip = () => {
  const gs = useGs(); const st = useHh(); const o = hhOpt(st);
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!hhBooted) { hhBooted = true; gs.setDemoView('out'); setTimeout(() => window.gsApi.go('home'), 0); } }, []);
  const pick = (id) => { hhSet({ opt: id }); if (gs.route.name !== 'home') gs.go('home'); window.scrollTo(0, 0); };
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-row">
          <span className="pg-k">Hero</span>
          {HH_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id}</button>)}
          <span className="pg-name">{o.name}</span>
          <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
          <button type="button" className="gs-demo-opt" onClick={() => hhSet({ open: false })}>Hide</button>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => hhSet({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">All three name the assistants once, in Works with. Everything below the hero is the current home page.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsHomeReal = window.GsHome;
window.GsHome = HhHome;
window.GsDemoBar = HhStrip;
