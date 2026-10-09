// Playground: the home page's "Get started" and "Who does what", three ways to say it in less room.
// Mounts the real home; the two sections are hidden and the option renders where they were.
const HB_KEY = 'pg_home_how_v1';
let hbState = { opt: '4', line: 'a', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(HB_KEY)) || {}; } catch (e) { return {}; } })() };
const hbSubs = new Set();
const hbSet = (p) => { hbState = { ...hbState, ...p }; try { localStorage.setItem(HB_KEY, JSON.stringify(hbState)); } catch (e) {} hbSubs.forEach((f) => f(hbState)); };
const useHb = () => { const [s, setS] = React.useState(hbState); React.useEffect(() => { hbSubs.add(setS); return () => hbSubs.delete(setS); }, []); return s; };

const HB_OPTS = [
  { id: '0', name: 'Today',
    idea: 'Two bands: Get started (three numbered steps) and Who does what (two columns).',
    cost: 'Two headings and two bands for five short sentences.' },
  { id: '1', name: 'One band: How it works',
    idea: 'Both sections become one band under one heading that names the page it leads to. The two roles sit as one line each, the three steps under them, and the heading carries a link to How it works.',
    cost: 'The roles lose their own headings, so "Your AI" and "The game engine" are bold lead-ins rather than titles.' },
  { id: '2', name: 'Four-row ledger',
    idea: 'One band, four labelled rows: Your AI, The game engine, Start free, The Pass. Each label is the thing; each line says what it does. Steps 1 and 2 merge into one row with a link to How it works.',
    cost: 'Reads as reference rather than a sequence; the numbers go. Still four rows high.' },
  { id: '3', name: 'One line, and the Pass',
    idea: 'The roles become one statement with a link to How it works. The Pass gets the same band Discover uses. Connecting and playing free are left to the hero’s two buttons.',
    cost: '"About two minutes" and "No card needed" leave the home page. The statement is new copy and needs ratifying.' },
  { id: '4', name: 'The line beside the Pass',
    idea: 'Option 3 in one row: the line and its link on the left, the Pass on the right as a short labelled note with a text link. No card, so the Pass sits level with the line instead of under it.',
    cost: 'The Pass is quieter than a card with a button. On a phone the two stack, so it is two short blocks rather than one row.' },
  { id: '5', name: 'The line over three columns',
    idea: 'The line is the heading. Under it, one row of three: Your AI, The game, The Pass, a sentence each. The roles come back from Who does what, short enough to sit beside the Pass.',
    cost: 'Three columns of prose take more height than 4. Connecting and playing free are left to the hero, as in 3.' },
];
const HB_LINES = [
  { id: 'a', text: 'Your AI tells the story. The game keeps the rules.' },
  { id: 'b', text: 'Your AI tells the story. The game holds the rules, the dice and the score.' },
  { id: 'c', text: 'Your AI does the talking. The game keeps the score.' },
];
const hbLine = (st) => (HB_LINES.find((l) => l.id === st.line) || HB_LINES[0]).text;
const hbOpt = (st) => HB_OPTS.find((o) => o.id === st.opt) || HB_OPTS[1];

const HbPassLink = () => { const gs = useGs(); return <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>About the Pass</button>; };

const Hb1 = () => {
  const gs = useGs();
  return (
    <section className="gs-band" id="hb-sec">
      <div className="gs-sec-head">
        <h2 className="mcp-t-sec">How it works</h2>
        <DS.TextLink onClick={gs.goHow}>How it works in full</DS.TextLink>
      </div>
      <div className="hb-roles">
        <p><b>Your AI</b> narrates, voices the characters, and asks what you do next.</p>
        <p><b>The game engine</b> rolls every die, keeps the score, decides each outcome and records your session.</p>
      </div>
      <GsSteps row items={[
        <p key="1"><b>Connect your AI</b> in about two minutes.</p>,
        <p key="2"><b>Play the free games.</b> No card needed.</p>,
        <p key="3"><b>Get the Pass</b> for every edition of every game, and every new game. <HbPassLink /></p>,
      ]} />
    </section>
  );
};

const Hb2 = () => {
  const gs = useGs();
  const rows = [
    ['Your AI', <>Narrates, voices the characters, and asks what you do next.</>],
    ['The game engine', <>Rolls every die, keeps the score, decides each outcome and records your session.</>],
    ['Start free', <>Connect your AI in about two minutes, then play the free games. No card needed. <button type="button" className="gs-inlink" onClick={gs.goHow}>How it works</button></>],
    ['The Pass', <>Every edition of every game, and every new game. <HbPassLink /></>],
  ];
  return (
    <section className="gs-band" id="hb-sec">
      <h2 className="mcp-t-sec">How it works</h2>
      <dl className="hb-ledger">
        {rows.map(([k, v]) => <div key={k} className="hb-row"><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </section>
  );
};

const Hb3 = () => {
  const gs = useGs();
  return (
    <section className="gs-band" id="hb-sec">
      <div className="hb-say">
        <h2 className="mcp-t-sec">{hbLine(useHb())}</h2>
        <DS.TextLink onClick={gs.goHow}>See how it works</DS.TextLink>
      </div>
      <DS.Card>
        <div className="dc-band">
          <p className="gs-lead"><b>{GS_PASS_BAND}</b></p>
          <DS.Button variant="secondary" onClick={() => gs.go('pass')}>About the Pass</DS.Button>
        </div>
      </DS.Card>
    </section>
  );
};
const Hb4 = () => {
  const gs = useGs(); const st = useHb();
  return (
    <section className="gs-band" id="hb-sec">
      <div className="hb4">
        <div className="hb-say">
          <h2 className="mcp-t-sec">{hbLine(st)}</h2>
          <DS.TextLink onClick={gs.goHow}>See how it works</DS.TextLink>
        </div>
        <div className="hb4-pass">
          <span className="gs-label">THE PASS</span>
          <p>Every edition of every game, and every new game on its release day.</p>
          <DS.TextLink onClick={() => gs.go('pass')}>About the Pass</DS.TextLink>
        </div>
      </div>
    </section>
  );
};
const Hb5 = () => {
  const gs = useGs(); const st = useHb();
  return (
    <section className="gs-band" id="hb-sec">
      <div className="gs-sec-head">
        <h2 className="mcp-t-sec">{hbLine(st)}</h2>
        <DS.TextLink onClick={gs.goHow}>See how it works</DS.TextLink>
      </div>
      <div className="hb5">
        <div><h3 className="hb5-h">Your AI</h3><p>Narrates, voices the characters, and asks what you do next.</p></div>
        <div><h3 className="hb5-h">The game</h3><p>Rolls every die, keeps the score, decides each outcome and records your session.</p></div>
        <div><h3 className="hb5-h">The Pass</h3><p>Every edition of every game, and every new game. <HbPassLink /></p></div>
      </div>
    </section>
  );
};
const HB_BODY = { 1: Hb1, 2: Hb2, 3: Hb3, 4: Hb4, 5: Hb5 };

// Renders children into a node placed just before the real "Get started" band.
const HbSlot = ({ children }) => {
  const [el, setEl] = React.useState(null);
  React.useLayoutEffect(() => {
    const t = document.getElementById('gs-how'); if (!t) return undefined;
    const d = document.createElement('div'); d.className = 'hb-slot'; t.before(d); setEl(d);
    return () => d.remove();
  }, []);
  return el ? ReactDOM.createPortal(children, el) : null;
};

const HbHome = () => {
  const st = useHb(); const Body = HB_BODY[st.opt];
  React.useEffect(() => { document.documentElement.dataset.hb = st.opt; }, [st.opt]);
  return <><window.GsHomeReal />{Body && <HbSlot><Body /></HbSlot>}</>;
};

const hbScroll = () => setTimeout(() => {
  const t = document.getElementById(hbState.opt === '0' ? 'gs-how' : 'hb-sec'); if (!t) return;
  const box = t.closest('.kit-phone-screen');
  if (box) box.scrollTo({ top: t.offsetTop - 24 }); else window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 24 });
}, 60);

let hbBooted = false;
const HbStrip = () => {
  const gs = useGs(); const st = useHb(); const o = hbOpt(st);
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!hbBooted) { hbBooted = true; (gs.setDemoView || gs.setView)('out'); setTimeout(() => { window.gsApi && window.gsApi.go('home'); hbScroll(); }, 0); } }, []);
  const pick = (id) => { hbSet({ opt: id }); if (gs.route.name !== 'home') gs.go('home'); hbScroll(); };
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (<div className="hb-rows">
        {+st.opt >= 3 && <div className="pg-strip-row">
          <span className="hb-k">Line</span>
          {HB_LINES.map((l) => <button key={l.id} type="button" className="gs-demo-opt" aria-pressed={st.line === l.id} title={l.text} onClick={() => hbSet({ line: l.id })}>{l.id}</button>)}
          <span className="pg-name">{hbLine(st)}</span>
        </div>}
        <div className="pg-strip-row">
          <span className="hb-k">Option</span>
          {HB_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id}</button>)}
          <span className="pg-name">{o.name}</span>
          <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
          <button type="button" className="gs-demo-opt" onClick={() => hbSet({ open: false })}>Hide</button>
        </div>
      </div>) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => hbSet({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsHomeReal = window.GsHome;
window.GsHome = HbHome;
window.GsDemoBar = HbStrip;
