// Playground round 2: options 4 to 6, from the review of 1 to 3 (2026-10-09).
// Every option shows the home page's existing screenshot whole, never cropped. Mounts the real
// GsHome below with its own hero hidden, as round 1 does.
const H2_KEY = 'pg_home_hero2_v1';
let h2State = { opt: '4', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(H2_KEY)) || {}; } catch (e) { return {}; } })() };
const h2Subs = new Set();
const h2Set = (p) => { h2State = { ...h2State, ...p }; try { localStorage.setItem(H2_KEY, JSON.stringify(h2State)); } catch (e) {} h2Subs.forEach((f) => f(h2State)); };
const useH2 = () => { const [s, setS] = React.useState(h2State); React.useEffect(() => { h2Subs.add(setS); return () => h2Subs.delete(setS); }, []); return s; };

const H2_OPTS = [
  { id: '4', name: 'Casebook, shot on its cover',
    idea: 'Option 1 with its screenshot. The headline stays. The Casebook screenshot sits whole on Casebook’s own cover, which shows as a frame around it. The subline says what the screenshot shows.',
    cost: 'The screenshot is the one the home page already uses. Casebook needs the Pass, so Start free doesn’t reach it.' },
  { id: '5', name: 'Casebook, shot in a card',
    idea: 'The same words as 4. The screenshot leads a card that names the game under it, with a way to its page.',
    cost: 'The same as 4. The card is plainer than the cover frame, so the hero carries less colour.' },
  { id: '6', name: 'Daily Word, all the way',
    idea: 'Works today with the screenshot we have. The headline is the word puzzle’s own opening, the shot sits whole on the Daily Puzzles cover, and Start free plays exactly this.',
    cost: 'The lying hook goes. The headline sells one free puzzle, and the bigger games start in the next band.' },
];
const h2Opt = (st) => H2_OPTS.find((o) => o.id === st.opt) || H2_OPTS[0];

const H2Acts = () => {
  const gs = useGs();
  return <>
    <div className="gs-hero-act">
      <DS.Button onClick={gs.startFree}>Start free</DS.Button>
      <DS.Button variant="secondary" onClick={() => gsScrollToId('gs-how')}>See how it works</DS.Button>
    </div>
    <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
  </>;
};
const H2CaseCopy = () => (
  <div className="gs-hero-copy">
    <h1 className="gs-h1 gs-h1-home"><span>Someone’s lying to you.</span> <span>Go and find out who.</span></h1>
    <p className="gs-hero-sub">Your AI plays every suspect. The game remembers every word, so a lie can’t hide.</p>
    <H2Acts />
  </div>
);
const H2Slot = () => <GsShot id="dailyWord" />;
const H2Caption = ({ id, line }) => {
  const gs = useGs(); const g = GS_GAMES[id];
  return (
    <div className="h2-cap">
      <span className="gs-stack-xs"><span className="gs-label">{line}</span><span className="gs-strong">{g.name}</span></span>
      <DS.TextLink onClick={() => gs.go(g.route)}>{'See ' + g.name}</DS.TextLink>
    </div>
  );
};
const H2OnCover = ({ art, children }) => (
  <div className="h2-oncover">
    <div className="h2-coverbg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART[art] }} />
    {children}
  </div>
);

const H24 = () => (
  <section className="gs-hero3">
    <H2CaseCopy />
    <div className="h2-art">
      <H2OnCover art="casebook"><H2Slot /></H2OnCover>
      <H2Caption id="casebook" line="A NEW CASE EVERY WEEK" />
    </div>
  </section>
);
const H25 = () => (
  <section className="gs-hero3">
    <H2CaseCopy />
    <div className="h2-art">
      <DS.Card style={{ justifyItems: 'stretch', alignContent: 'start', gap: 16 }}>
        <H2Slot />
        <H2Caption id="casebook" line="A NEW CASE EVERY WEEK" />
      </DS.Card>
    </div>
  </section>
);
const H26 = () => (
  <section className="gs-hero3">
    <div className="gs-hero-copy">
      <h1 className="gs-h1 h2-h1">{GS_PUZZLES.word.open}</h1>
      <p className="gs-hero-sub">Your AI takes your guesses. The game checks every one and keeps count.</p>
      <H2Acts />
    </div>
    <div className="h2-art">
      <H2OnCover art="word"><GsShot id="dailyWord" /></H2OnCover>
      <H2Caption id="daily" line="FREE EVERY DAY" />
    </div>
  </section>
);

const H2_HERO = { 4: H24, 5: H25, 6: H26 };
const H2Home = () => {
  const st = useH2(); const Hero = H2_HERO[h2Opt(st).id];
  return (
    <div className="hh-swap">
      <main className="gs-wrap gs-main gs-home"><Hero /></main>
      <window.GsHomeReal />
    </div>
  );
};

let h2Booted = false;
const H2Strip = () => {
  const gs = useGs(); const st = useH2(); const o = h2Opt(st);
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!h2Booted) { h2Booted = true; gs.setDemoView('out'); setTimeout(() => window.gsApi.go('home'), 0); } }, []);
  const pick = (id) => { h2Set({ opt: id }); if (gs.route.name !== 'home') gs.go('home'); window.scrollTo(0, 0); };
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-row">
          <span className="pg-k">Hero</span>
          {H2_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id}</button>)}
          <span className="pg-name">{o.name}</span>
          <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
          <button type="button" className="gs-demo-opt" onClick={() => h2Set({ open: false })}>Hide</button>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => h2Set({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">Everything below the hero is the current home page.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsHomeReal = window.GsHome;
window.GsHome = H2Home;
window.GsDemoBar = H2Strip;
