// Playground round 4: option 9, option 8 refined for elegance (2026-10-09 review), beside 8 as it was.
// Subline a is ratified (2026-10-09). The cover becomes one field; the screenshot sits in it and
// runs off its bottom edge, a little cropped, with the cover's bars rising behind it.
const H3_KEY = 'pg_home_hero4_v1';
let h3State = { opt: '9', line: 'a', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(H3_KEY)) || {}; } catch (e) { return {}; } })() };
const h3Subs = new Set();
const h3Set = (p) => { h3State = { ...h3State, ...p }; try { localStorage.setItem(H3_KEY, JSON.stringify(h3State)); } catch (e) {} h3Subs.forEach((f) => f(h3State)); };
const useH3 = () => { const [s, setS] = React.useState(h3State); React.useEffect(() => { h3Subs.add(setS); return () => h3Subs.delete(setS); }, []); return s; };

const H3_OPTS = [
  { id: '8', name: 'Cover band above the screenshot, as it was',
    idea: 'A short band of the cover names the game, and the screenshot hangs directly under it.',
    cost: 'Two boxes joined at one edge. The shapes are cut off by the band and crowd the name.' },
  { id: '9', name: 'Screenshot set into the cover',
    idea: 'The cover is one field. The name sits on its plain left, the bars rise behind the screenshot, and the screenshot runs off the bottom edge, so it reads as one object.',
    cost: 'The bottom of the screenshot is cropped a little. The cover’s shapes are rearranged around the screenshot rather than shown as drawn.' },
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
const H39 = () => (
  <div className="h4-field">
    <div className="h4-shapes" aria-hidden="true">
      <i className="h4-bar" style={{ background: '#D66847', height: '62%' }}></i>
      <i className="h4-bar" style={{ background: '#A390B2', height: '86%' }}></i>
      <i className="h4-bar" style={{ background: '#F2EBE0', height: '48%' }}></i>
      <i className="h4-sun"></i>
    </div>
    <H3Name />
    <GsShot id="dailyWord" zoom />
  </div>
);
const H3_ART = { 7: H37, 8: H38, 9: H39 };
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
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => h3Set({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">Subline a, ratified 2026-10-09. The bars and sun are Casebook’s cover shapes in its own colours, rearranged.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsHomeReal = window.GsHome;
window.GsHome = H3Home;
window.GsDemoBar = H3Strip;
