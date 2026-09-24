// Option board — where "Include cards in Active" lives in the view-options
// panel (LM-786). Each cell mounts the shipped FeedLens, open, on History, with
// the real Backend Pod contributors. The only thing that differs is the row
// component FeedLens reads off `window.IncludeActiveRow` — a dispatcher here
// that picks the cell's option from context. Nothing in app/ is changed.
const PgIncCtx = React.createContext(1);
const PG_INC_SHIPPED = window.IncludeActiveRow;

// The panel's own type, lifted from feed-lens.jsx (LensSection / LensLabel)
// so each option speaks the panel's vocabulary. Copies, not improvements.
const pgIncEyebrow = { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)', padding: '10px 12px 0' };
const pgIncRule = { height: 1, background: 'var(--color-border-2)', margin: '10px 10px 0' };

// 1 — Its own section. A third eyebrow names the kind of thing it is.
const PgIncSection = ({ on, onChange }) => (
  <React.Fragment>
    <div style={pgIncEyebrow}>History</div>
    <div style={{ padding: '6px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, padding: '0 2px' }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-fg-1)' }}>Include cards in Active</span>
        <window.CandSwitch on={on} onChange={onChange} label="Include cards in Active" />
      </div>
    </div>
    <div aria-hidden="true" style={pgIncRule} />
  </React.Fragment>
);

// 2 — One of Display. The DISPLAY eyebrow moves above it (the shipped one is
// hidden in this cell), and the row takes Order/View's grid: its label in the
// group-label voice, its right edge on the trays' right edge.
const PgIncDisplay = ({ on, onChange }) => (
  <React.Fragment>
    <div style={pgIncEyebrow}>Display</div>
    <div style={{ padding: '6px 10px 2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, padding: '0 2px' }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-fg-2)' }}>Include cards in Active</span>
        <window.CandSwitch on={on} onChange={onChange} label="Include cards in Active" />
      </div>
    </div>
  </React.Fragment>
);

// 3 — The panel's lead. No eyebrow: the row is the panel's first line, set at
// the panel's title weight, and a full-bleed hairline separates what the tab
// holds from how it is shown. The inset rule inside stays the panel's one rule.
const PgIncLead = ({ on, onChange }) => (
  <React.Fragment>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, padding: '4px 20px 4px 14px' }}>
      <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-fg-1)', letterSpacing: '-0.005em' }}>Include cards in Active</span>
      <window.CandSwitch on={on} onChange={onChange} label="Include cards in Active" />
    </div>
    <div aria-hidden="true" style={{ height: 1, background: 'var(--color-border-2)', margin: '4px 0 0' }} />
  </React.Fragment>
);

const PG_INC_ROWS = { 0: PG_INC_SHIPPED, 1: PgIncSection, 2: PgIncDisplay, 3: PgIncLead };
window.IncludeActiveRow = (props) => {
  const n = React.useContext(PgIncCtx);
  const Row = PG_INC_ROWS[n];
  return Row ? <Row {...props} /> : null;
};

const PG_INC_OPTIONS = [
  { n: 1, name: 'Its own section',
    claim: 'The panel already sorts its controls by kind: Display redraws, Filter conceals. This is a third kind, what the tab holds, so it gets its own eyebrow. HISTORY also says why it appears on one tab only.',
    cost: 'The tallest option. A third heading and a second rule for one row, on a panel whose comments record it already at its height cap.' },
  { n: 2, name: 'One of Display',
    claim: 'No heading, no rule. It keeps Display’s contract exactly: it lights nothing and makes no chip. It sits with Order and View as a label and its control, aligned to their edges.',
    cost: 'Display means “redraws what is already on screen”, and this adds and removes cards. Display also changes between tabs, gaining a row on History.' },
  { n: 3, name: 'The panel’s lead',
    claim: 'It sets what the tab holds, so it frames everything below it. It is the first line at title weight, with a full-bleed hairline under it. Display and Filter stay exactly as they are.',
    cost: 'A control set as a title can read as a heading. The full-bleed line is a second kind of rule, used nowhere else in the panel.' },
];

const PgIncCell = ({ n, shipped }) => {
  const [on, setOn] = React.useState(false);
  const [order, setOrder] = React.useState('newest');
  const [who, setWho] = React.useState([]);
  const [density, setDensity] = React.useState('comfortable');
  const [saved, setSaved] = React.useState(false);
  const [h, setH] = React.useState(null);
  const ref = React.useRef(null);
  const space = React.useMemo(() => window.CircSeed.seedSpaces('sam.rivera@gmail.com').find((s) => s.id === 'sp-backend'), []);
  const contributors = React.useMemo(() => window.circContributors(space), [space]);
  React.useLayoutEffect(() => {
    const p = ref.current && ref.current.querySelector('#circ-lens-panel');
    if (p) setH(p.scrollHeight);
  });
  const pickWho = (id) => setWho((cur) => (id === window.CIRC_LENS_ALL || id == null) ? [] : cur.includes(id) ? cur.filter((w) => w !== id) : cur.concat([id]));
  return (
    <PgIncCtx.Provider value={n}>
      <div ref={ref} className={'frame pg-opt-' + n} style={{ '--top-bar-height': '0px' }}>
        <window.Tabs active="read" onChange={() => {}} right={
          <window.FeedLens order={order} who={who} contributors={contributors} user={window.CircSeed.DEFAULT_USER}
            onOrder={setOrder} onWho={pickWho} density={density} onDensity={setDensity} isMobile={false}
            saved={saved} onSaved={setSaved} includeActive={on} onIncludeActive={setOn}
            open={true} onOpenChange={() => {}} />
        } />
      </div>
      {h != null && <p className="fact">Panel content {h}px · cap 624px at 1280×800{h > 624 ? ' · scrolls' : ''}</p>}
    </PgIncCtx.Provider>
  );
};

const PgIncBoard = () => (
  <div className="wrap">
    <div className="eyebrow">LM-786 · option board</div>
    <h1>Include cards in Active, in the view-options panel</h1>
    <p className="lede">The words and the switch are fixed, and the row stays at the head of the panel. What varies is how it joins the panel’s grammar: its eyebrows, its one rule, its row metrics. Each panel is the shipped one, open on History, with Backend Pod’s contributors. Every control works. For comparison, 0 is what is built now.</p>
    <div className="grid">
      {PG_INC_OPTIONS.map((o) => (
        <section key={o.n}>
          <div className="opthead"><span className="num">{String(o.n).padStart(2, '0')}</span><span className="name">{o.name}</span></div>
          <p className="claim">{o.claim}</p>
          <p className="cost">Cost: {o.cost}</p>
          <PgIncCell n={o.n} />
        </section>
      ))}
      <section>
        <div className="opthead"><span className="num">00</span><span className="name">As built</span></div>
        <p className="claim">The current build, for reference: a bare row above DISPLAY with an inset rule under it.</p>
        <PgIncCell n={0} />
      </section>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<PgIncBoard />);
