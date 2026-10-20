// Playground round 3: options 7 and 8, from option 1 (2026-10-09 review). Both keep option 1's
// headline and show Casebook's cover and the existing screenshot, each whole. The subline is a
// separate lever: three lines written from the Casebook spec (game-specs/casebook.md, section 1).
const H3_KEY = 'pg_home_hero3_v1';
let h3State = { opt: '7', line: 'a', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(H3_KEY)) || {}; } catch (e) { return {}; } })() };
const h3Subs = new Set();
const h3Set = (p) => { h3State = { ...h3State, ...p }; try { localStorage.setItem(H3_KEY, JSON.stringify(h3State)); } catch (e) {} h3Subs.forEach((f) => f(h3State)); };
const useH3 = () => { const [s, setS] = React.useState(h3State); React.useEffect(() => { h3Subs.add(setS); return () => h3Subs.delete(setS); }, []); return s; };

const H3_OPTS = [
  { id: '7', name: 'Screenshot over the cover',
    idea: 'The cover fills the frame and carries the game’s name. The screenshot overlaps its lower right, so the top left of the cover stays clear.',
    cost: 'The screenshot covers most of the art. On a phone the overlap is tighter, so less of the cover shows.' },
  { id: '8', name: 'Cover band above the screenshot',
    idea: 'A short band of the cover names the game, and the screenshot hangs directly under it, like a window under its title.',
    cost: 'The cover is cut to a strip, so its shapes read less than in 7. The block is taller.' },
];
const H3_LINES = [
  { id: 'a', text: 'Your AI plays every suspect, and some of them are lying. Find the proof that breaks their story.' },
  { id: 'b', text: 'Your AI plays every suspect. Search, ask questions and show them evidence until the lies give way.' },
  { id: 'c', text: 'Talk to your AI to search, question and confront every suspect. You get one accusation.' },
];
const h3Opt = (st) => H3_OPTS.find((o) => o.id === st.opt) || H3_OPTS[0];
const h3Line = (st) => H3_LINES.find((l) => l.id === st.line) || H3_LINES[0];

const H3Copy = () => {
  const gs = useGs(); const st = useH3();
  return (
    <div className="gs-hero-copy">
      <h1 className="gs-h1 gs-h1-home"><span>Someone’s lying to you.</span> <span>Go and find out who.</span></h1>
      <p className="gs-hero-sub">{h3Line(st).text}</p>
      <div className="gs-hero-act">
        <DS.Button onClick={gs.startFree}>Start free</DS.Button>
        <DS.Button variant="secondary" onClick={() => gsScrollToId('gs-how')}>See how it works</DS.Button>
      </div>
      <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
    </div>
  );
};
const H3Name = () => {
  const gs = useGs();
  return (
    <button type="button" className="h3-name" onClick={() => gs.go('casebook')}>
      <span className="gs-label">A NEW CASE EVERY WEEK</span>
      <span className="h3-name-t">Casebook <DS.Icon name="down" size={20} style={{ transform: 'rotate(-90deg)' }} /></span>
    </button>
  );
};
const H37 = () => (
  <div className="h3-over">
    <div className="h3-over-bg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART.casebook }} />
    <H3Name />
    <GsShot id="dailyWord" />
  </div>
);
const H38 = () => (
  <div className="h3-band-wrap">
    <div className="h3-band">
      <div className="h3-over-bg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART.casebook }} />
      <H3Name />
    </div>
    <GsShot id="dailyWord" />
  </div>
);
const H3_ART = { 7: H37, 8: H38 };
const H3Home = () => {
  const st = useH3(); const Art = H3_ART[h3Opt(st).id];
  return (
    <div className="hh-swap">
      <main className="gs-wrap gs-main gs-home">
        <section className="gs-hero3"><H3Copy /><div className="h2-art"><Art /></div></section>
      </main>
      <window.GsHomeReal />
    </div>
  );
};

let h3Booted = false;
const H3Strip = () => {
  const gs = useGs(); const st = useH3(); const o = h3Opt(st);
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!h3Booted) { h3Booted = true; gs.setDemoView('out'); setTimeout(() => window.gsApi.go('home'), 0); } }, []);
  const back = () => { if (gs.route.name !== 'home') gs.go('home'); window.scrollTo(0, 0); };
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="h3-rows">
          <div className="pg-strip-row">
            <span className="pg-k">Art</span>
            {H3_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => { h3Set({ opt: x.id }); back(); }}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => h3Set({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Line</span>
            {H3_LINES.map((l) => <button key={l.id} type="button" className="gs-demo-opt" aria-pressed={st.line === l.id} title={l.text} onClick={() => { h3Set({ line: l.id }); back(); }}>{l.id}</button>)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => h3Set({ open: true })}>Show · {o.id} {o.name} · line {st.line}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">The three sublines come from the Casebook spec: suspects lie to hide things, and proof that breaks a lie makes them admit the truth.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsHomeReal = window.GsHome;
window.GsHome = H3Home;
window.GsDemoBar = H3Strip;
