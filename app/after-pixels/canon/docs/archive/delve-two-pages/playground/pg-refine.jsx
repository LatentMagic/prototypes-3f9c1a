// Playground: three refinements of option 2. Loads after pg-routes.jsx and reuses its parts
// (PgAbout, PgBox, PgMini, PgYoursBody, pgMain). Overrides the same window slots.
// One signed-in state: no never-played / has-played split. Each option carries its own names.
const RF_KEY = 'pg_delve_refine_v1';
let rfState = { opt: 'A', viewer: 'in', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(RF_KEY)) || {}; } catch (e) { return {}; } })() };
const rfSubs = new Set();
const rfSet = (p) => { rfState = { ...rfState, ...p }; try { localStorage.setItem(RF_KEY, JSON.stringify(rfState)); } catch (e) {} rfSubs.forEach((f) => f(rfState)); };
const useRf = () => { const [s, setS] = React.useState(rfState); React.useEffect(() => { rfSubs.add(setS); return () => rfSubs.delete(setS); }, []); return s; };

const RF_OPTS = [
  { id: 'A', name: 'Record', menu: 'Played', page: 'Delve record', slug: 'record',
    idea: 'Name the page for what it holds. The card sits above the cover and says the same thing to everyone signed in.',
    cost: '“Record” is already the Pass word for results across games, so the page and the Pass share it.' },
  { id: 'B', name: 'Username', menu: 'Playing', page: 'Delve', slug: '@name',
    idea: 'Name the page for whose it is. Your username sits in the play box under the button, and the page is titled Delve with your name above it.',
    cost: 'Two pages both titled Delve; only the name above the title and the address tell them apart.' },
  { id: 'C', name: 'This week', menu: 'Progress', page: 'Delve progress', slug: 'progress',
    idea: 'Lead with what is live. A band under the cover shows this week’s scene, which is true for every viewer, and links to the page.',
    cost: 'The band repeats this week’s scene, which the page below also covers. “Progress” fits weekly games better than replayable ones.' },
];
const rfName = (gs) => gs.user.username || 'ash';
const rfOpt = (st) => RF_OPTS.find((o) => o.id === st.opt) || RF_OPTS[0];
const rfToPage = (gs) => gs.go('delve', { page: 'yours' });

// ---- The way in, one per option ---------------------------------------------------
const RfCardA = () => {
  const gs = useGs();
  return (
    <section className="pg-band" aria-label="Delve record">
      <PgMini art="delve" />
      <div className="gs-stack-xs"><span className="gs-label">RECORD</span>
        <span className="gs-small">Every scene you’ve played, the weeks you’ve kept up and what’s left to earn.</span></div>
      <div className="pg-band-link"><DS.TextLink onClick={() => rfToPage(gs)}>See the record</DS.TextLink></div>
    </section>
  );
};
const RfUnderB = () => {
  const gs = useGs(); const n = rfName(gs);
  return <>
    <div className="gs-rule" />
    <div className="rf-me">
      <span className="gs-avatar" aria-hidden="true">{n[0].toUpperCase()}</span>
      <span className="gs-stack-xs"><span className="gs-strong">{n}</span><span className="gs-small">Scenes, streak and friends.</span></span>
      <DS.TextLink onClick={() => rfToPage(gs)}>Open</DS.TextLink>
    </div>
  </>;
};
const RfBandC = () => {
  const gs = useGs();
  return (
    <section className="pg-band" aria-label="This week">
      <PgMini art="delve" />
      <div className="gs-stack-xs"><span className="gs-label">THIS WEEK’S SCENE</span>
        <span className="gs-small">{GS_PAGES.delve.week.line} It’s open until Monday 12 October.</span></div>
      <div className="pg-band-link"><DS.TextLink onClick={() => rfToPage(gs)}>See progress</DS.TextLink></div>
    </section>
  );
};

// ---- Pages ---------------------------------------------------------------------
const RfPublic = ({ o, inn, main }) => (
  <main className="gs-wrap gs-main">
    {inn && o.id === 'A' && <RfCardA />}
    <section className="gs-head-split">
      <div className="gs-hero-cover">
        <GsCover art="delve" />
        <div className="gs-cover-over"><span className="gs-label">{GS_PAGES.delve.label}</span><h1 className="gs-cover-title">Delve</h1></div>
      </div>
      <PgBox main={main} under={inn && o.id === 'B' ? <RfUnderB /> : null} />
    </section>
    {inn && o.id === 'C' && <RfBandC />}
    <PgAbout />
  </main>
);
const RfPlayer = ({ o }) => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main">
      <section className="rf-head">
        <span><GsCover art="delve" /></span>
        <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
          {o.id === 'B' && <span className="gs-label">{rfName(gs).toUpperCase()}</span>}
          <h1 className="gs-h1">{o.page}</h1>
          <DS.TextLink onClick={() => gs.go('delve', { page: 'about' })}>About Delve</DS.TextLink>
        </div>
      </section>
      <PgYoursBody who="played" />
    </main>
  );
};
const RfDelve = () => {
  const gs = useGs(); const st = useRf(); const o = rfOpt(st);
  const inn = gs.view !== 'out';
  const main = pgMain(inn ? 'played' : 'out', gs);
  return inn && gs.route.page === 'yours' ? <RfPlayer o={o} /> : <RfPublic o={o} inn={inn} main={main} />;
};

// ---- Top-bar dropdown (Delve included) -------------------------------------------
const rfItems = (gs) => ['daily', 'delve', 'casebook'].map((k) => [k, GS_GAMES[k].name,
  k === 'delve' ? () => rfToPage(gs) : () => gs.go(GS_GAMES[k].route)]);
const RfNav = () => {
  const gs = useGs(); const st = useRf(); const o = rfOpt(st);
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  if (gs.view === 'out') return null;
  const here = gs.route.name === 'delve' && gs.route.page === 'yours';
  return (
    <div className="gs-acct" ref={wrap}>
      <button type="button" className="gs-navlink" aria-expanded={open} aria-haspopup="menu" aria-current={here ? 'page' : undefined} onClick={() => setOpen((v) => !v)}>
        {o.menu} <DS.Icon name="down" size={16} />
      </button>
      {open && (
        <div className="gs-pop pg-yours-pop" role="menu" aria-label={o.menu}>
          {rfItems(gs).map(([k, l, fn]) => <button key={k} type="button" role="menuitem" className="gs-menu-item gs-menu-ico" onClick={() => { setOpen(false); fn(); }}><PgMini art={GS_GAMES[k].art} sm />{l}</button>)}
        </div>
      )}
    </div>
  );
};
const RfNavMenu = ({ pick }) => {
  const gs = useGs(); const st = useRf(); const o = rfOpt(st);
  if (gs.view === 'out') return null;
  return <>
    <div className="gs-menu-div" role="separator" />
    <span className="gs-label pg-menu-label">{o.menu.toUpperCase()}</span>
    {rfItems(gs).map(([k, l, fn]) => <button key={k} type="button" role="menuitem" className="gs-menu-item gs-menu-ico" onClick={() => pick(fn)}><PgMini art={GS_GAMES[k].art} sm />{l}</button>)}
  </>;
};

// ---- Strip ---------------------------------------------------------------------
let rfBooted = false;
const rfApply = (gs, v) => { gs.setDemoView(v === 'out' ? 'out' : 'pass'); if (v !== 'out') gs.setConnected(true); setTimeout(() => window.gsApi.go('delve'), 0); };
const RfStrip = () => {
  const gs = useGs(); const st = useRf(); const o = rfOpt(st);
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!rfBooted) { rfBooted = true; rfApply(gs, st.viewer); } }, []);
  const inn = gs.view !== 'out';
  const addr = gs.route.name !== 'delve' ? '—' : inn && gs.route.page === 'yours'
    ? '/games/delve/' + (o.id === 'B' ? '@' + rfName(gs) : o.slug) : '/games/delve';
  const pickV = (v) => { rfSet({ viewer: v }); rfApply(gs, v); };
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {RF_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => { rfSet({ opt: x.id }); rfApply(gs, st.viewer); }}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => rfSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Viewer</span>
            {[['out', 'Signed out'], ['in', 'Signed in']].map(([v, l]) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={st.viewer === v} onClick={() => pickV(v)}>{l}</button>)}
          </div>
          <div className="pg-strip-row is-addr"><span className="pg-k">Address</span><span className="pg-addr">{addr}</span></div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => rfSet({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <ul className="gs-plain">
            <li className="pg-kv"><span className="gs-muted">Dropdown</span><b>{o.menu}</b></li>
            <li className="pg-kv"><span className="gs-muted">Player page</span><b>{o.page}</b></li>
          </ul>
          <p className="gs-small">The player page’s content is unchanged from the last round and isn’t under review.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsDelve = RfDelve;
window.GsDemoBar = RfStrip;
window.GsNavExtra = RfNav;
window.GsNavExtraMenu = RfNavMenu;
