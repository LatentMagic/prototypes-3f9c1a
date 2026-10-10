// Playground: how History and the Library hold their filters. Options 1 to 3 beside today (0), 2026-10-10.
// Brief: docs/specs/filters-on-a-phone/ (handoff-2026-10-10-filters-playground.md). Loads after every app/ module, before main.jsx.
// Replaces window.LbTools (the seam in app/gs-library.jsx) and GsDemoBar. Filtering stays the app's own: every option
// re-lays the same SearchField and LbChoice elements the page hands LbTools, so a pick runs the page's own handler.
const PGF_KEY = 'pg_filters_v1';
let pgf = { opt: '1', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(PGF_KEY)) || {}; } catch (e) { return {}; } })() };
const pgfSubs = new Set();
const pgfSet = (p) => { pgf = { ...pgf, ...p }; try { localStorage.setItem(PGF_KEY, JSON.stringify(pgf)); } catch (e) {} pgfSubs.forEach((f) => f(pgf)); };
const usePgf = () => { const [s, setS] = React.useState(pgf); React.useEffect(() => { pgfSubs.add(setS); return () => pgfSubs.delete(setS); }, []); return s; };

const PGF_OPTS = [
  { id: '0', name: 'Before', stance: 'The app before 1b landed: search and every choice laid out in full, above the list on a phone and in a side column on desktop.', cost: 'On a phone you scroll past every choice before the first row.' },
  { id: '1', name: 'One Filters button', stance: 'Search stays on the page. Every choice moves into one panel behind a Filters button, which counts what you have changed; a line under it names those choices. The list takes the full width on desktop.', cost: 'You cannot see the choices without opening the panel, so changing one takes two taps.' },
  { id: '1b', name: 'Today: one Filters button, games picked by name', stance: 'In the app since 2026-10-10. As 1, but the list of games is not laid out as buttons. One Game row names the current pick; tapping it turns the panel into a search and a list of the games you have played, already narrowed by the Genre and Schedule you chose. The panel stays the same size however many games there are.', cost: 'Picking a game is a step deeper than the other filters, and you see the games only after opening it.' },
  { id: '2', name: 'A control per filter', stance: 'Each filter shrinks to one control that shows its current choice. Tapping it opens a menu of its options. On desktop, search and the controls sit in one bar above a full-width list.', cost: 'You see only the current choice, never the others, and Show grows a long menu as you play more games.' },
  { id: '3', name: 'Folded in place', stance: 'Today\u2019s choices, folded. On a phone, one Filters fold sits above the list and names what you have changed. On desktop the side column stays, each filter folded to its current choice.', cost: 'Desktop still spends a column on filters, and on a phone the choices stay hidden until you open the fold.' },
];

const PgfChoice = window.LbChoice; const PgfTools0 = window.LbToolsColumn; const PgfToolsApp = window.LbTools; const PgfDemo0 = window.GsDemoBar;
// The page's children: one SearchField and its LbChoice groups (History's Game).
const pgfParts = (children) => {
  let search = null; const choices = [];
  const walk = (k) => {
    if (!React.isValidElement(k)) return;
    if (k.type === PgfChoice) choices.push(k.props);
    else if (k.type === DS.SearchField) search = k;
    else if (typeof k.type === 'function') walk(k.type(k.props));
  };
  React.Children.toArray(children).forEach(walk);
  return { search, choices };
};
const pgfLabel = (c) => (c.opts.find(([v]) => v === c.value) || c.opts[0])[1];
const pgfOn = (c) => c.value !== c.opts[0][0];

// ---- 1 · One Filters button ----
const PgfPanel = ({ search, choices }) => {
  const gs = useGs(); const [open, setOpen] = React.useState(false);
  const on = choices.filter(pgfOn);
  return (
    <div className="pgf-top">
      <div className="pgf-bar">
        <div className="pgf-search">{search}</div>
        <DS.Button variant="secondary" onClick={() => setOpen(true)}>{on.length ? 'Filters · ' + on.length : 'Filters'}</DS.Button>
      </div>
      {on.length > 0 && <p className="pgf-sum">{on.map(pgfLabel).join(' · ')}</p>}
      <DS.Popup kind="panel" open={open} onClose={() => setOpen(false)} title="Filters" actions={<DS.Button onClick={() => setOpen(false)}>Done</DS.Button>}>
        <div className="pgf-groups">{choices.map((c) => <PgfChoice key={c.label} {...c} />)}</div>
      </DS.Popup>
    </div>
  );
};

// ---- 1b · One Filters button, games picked by name ----
// The game choice is the LbChoice whose options are games (History's Show). Genre and Schedule picks narrow its list.
const pgfIsGame = (c) => c.label === 'Game';
const pgfGames = (g, choices) => {
  const pick = (l) => { const c = choices.find((x) => x.label === l); return c ? c.value : 'all'; };
  const cat = pick('Genre'); const rhy = pick('Schedule');
  return g.opts.slice(1).filter(([v]) => v === g.value || ((cat === 'all' || GS_GAMES[v].category === cat) && (rhy === 'all' || gsRhythm(v) === rhy)));
};
const PgfGamePick = ({ g, list, onBack }) => {
  const [q, setQ] = React.useState(''); const s = q.trim().toLowerCase();
  const rows = [['all', 'All games']].concat(list).filter(([v, l], i) => i === 0 || !s || l.toLowerCase().includes(s));
  const pick = (v) => { g.onPick(v); onBack(); };
  return (
    <div className="pgf-pick">
      <button type="button" className="pgf-back" onClick={onBack}><DS.Icon name="back" size={16} />Filters</button>
      <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="pgf-plist" role="list">
        {rows.map(([v, l]) => (
          <li key={v}><button type="button" className="pgf-prow" aria-pressed={v === g.value} onClick={() => pick(v)}>
            <span>{l}</span>{v === g.value ? <DS.Icon name="check" size={16} /> : <span className="pgf-pgap" />}
          </button></li>
        ))}
        {rows.length === 1 && s && <li className="pgf-pnone">No game called that.</li>}
      </ul>
    </div>
  );
};
const PgfPanelB = ({ search, choices }) => {
  const [open, setOpen] = React.useState(false); const [deep, setDeep] = React.useState(false);
  const on = choices.filter(pgfOn); const g = choices.find(pgfIsGame);
  const close = () => { setOpen(false); setDeep(false); };
  const list = g ? pgfGames(g, choices) : [];
  return (
    <div className="pgf-top">
      <div className="pgf-bar">
        <div className="pgf-search">{search}</div>
        <DS.Button variant="secondary" onClick={() => setOpen(true)}>{on.length ? 'Filters · ' + on.length : 'Filters'}</DS.Button>
      </div>
      {on.length > 0 && <p className="pgf-sum">{on.map(pgfLabel).join(' · ')}</p>}
      <DS.Popup kind="panel" open={open} onClose={close} title="Filters" actions={<DS.Button onClick={close}>Done</DS.Button>}>
        {deep && g ? <PgfGamePick g={g} list={list} onBack={() => setDeep(false)} /> : (
          <div className="pgf-groups">{choices.map((c) => (c === g ? (
            <div key={c.label} className="pgf-grow">
              <span className="gs-field-label">Game</span>
              <button type="button" className="pgf-prow is-open" onClick={() => setDeep(true)}><span>{pgfLabel(c)}</span><LbChev /></button>
            </div>
          ) : <PgfChoice key={c.label} {...c} />))}</div>
        )}
      </DS.Popup>
    </div>
  );
};

// ---- 2 · A control per filter ----
const PgfMenus = ({ search, choices }) => {
  const box = React.useRef(null); const [ends, setEnds] = React.useState('');
  const sig = choices.map(pgfLabel).join('|');
  React.useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const m = () => { const w = el.getBoundingClientRect();
      const e = Array.from(el.children).map((c) => (c.getBoundingClientRect().left - w.left + 228 > w.width ? '1' : '0')).join('');
      setEnds((p) => (p === e ? p : e)); };
    m(); const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect();
  }, [sig]);
  return (
    <div className="pgf-top">
      <div className="pgf-bar2">
        <div className="pgf-search">{search}</div>
        <div ref={box} className="pgf-menus" role="group" aria-label="Filters">
          {choices.map((c, i) => (
            <DS.Menu key={c.label} label={c.label} align={ends[i] === '1' ? 'end' : 'start'}
              trigger={<button type="button" className={'pgf-mbtn' + (pgfOn(c) ? ' is-on' : '')} aria-label={c.label + ': ' + pgfLabel(c)}><span className="pgf-mk">{c.label}</span><span>{pgfLabel(c)}</span><DS.Icon name="down" size={16} /></button>}
              items={c.opts.map(([v, l]) => ({ label: l, icon: v === c.value ? 'check' : undefined, onSelect: () => c.onPick(v) }))} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- 3 · Folded in place ----
const PgfFold = ({ search, choices }) => {
  const on = choices.filter(pgfOn);
  return (
    <aside className="lb-tools pgf-fold">
      {search}
      <div className="pgf-narrow">
        <DS.Disclosure title={on.length ? 'Filters · ' + on.map(pgfLabel).join(', ') : 'Filters'}>
          <div className="pgf-groups">{choices.map((c) => <PgfChoice key={c.label} {...c} />)}</div>
        </DS.Disclosure>
      </div>
      <div className="pgf-wide">
        {choices.map((c) => (
          <DS.Disclosure key={c.label} title={c.label + ' · ' + pgfLabel(c)}>
            <div className="pgf-one"><PgfChoice {...c} /></div>
          </DS.Disclosure>
        ))}
      </div>
    </aside>
  );
};

const PgfTools = ({ children }) => {
  const s = usePgf();
  if (s.opt === '0') return <PgfTools0>{children}</PgfTools0>;
  const p = pgfParts(children);
  if (s.opt === '1b') return <PgfToolsApp>{children}</PgfToolsApp>;
  return s.opt === '1' ? <PgfPanel {...p} /> : s.opt === '2' ? <PgfMenus {...p} /> : <PgfFold {...p} />;
};

// ---- The strip: options, and the two lists. Sits above the app's demo bar. ----
let pgfBooted = false;
const PGF_GO = [['history', 'History'], ['library', 'Library']];
const PgfStrip = () => {
  const gs = useGs(); const s = usePgf(); const o = PGF_OPTS.find((x) => x.id === s.opt) || PGF_OPTS[1];
  const [why, setWhy] = React.useState(false);
  const bar = React.useRef(null); const [low, setLow] = React.useState(44); const [h, setH] = React.useState(88);
  React.useEffect(() => { if (!pgfBooted) { pgfBooted = true; gs.setView('pass'); gs.setConnected(true); setTimeout(() => window.gsApi.go('history'), 250); } }, []);
  React.useLayoutEffect(() => {
    const el = bar.current; if (!el) return undefined;
    const root = el.closest('.gs-root'); const demo = root && root.querySelector('.gs-demo:not(.pg-strip)');
    const m = () => { setLow(demo ? demo.offsetHeight : 0); setH(el.offsetHeight); };
    m(); const ro = new ResizeObserver(m); ro.observe(el); if (demo) ro.observe(demo); return () => ro.disconnect();
  }, [s.open]);
  const view = (v) => { gs.setDemoView(v); gs.setConnected(v !== 'out'); };
  const here = gs.route.name;
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (<>
    <PgfDemo0 />
    <div aria-hidden="true" style={{ flex: 'none', height: h }} />
    <div ref={bar} className="gs-demo pg-strip" style={{ bottom: low }} role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Filters</span>
            {PGF_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => pgfSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => pgfSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{gs.view === 'out' ? <button type="button" className="gs-demo-opt" onClick={() => view('pass')}>Sign in with the Pass</button> : seg(PGF_GO, here, (k) => gs.go(k))}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => pgfSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why"><p>{o.stance}</p><p className="gs-muted">{'Cost: ' + o.cost}</p></div>
      </DS.Popup>
    </div>
  </>);
};

Object.assign(window, { LbTools: PgfTools, GsDemoBar: PgfStrip });
