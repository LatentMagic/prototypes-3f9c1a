// Playground: the library game page, Casebook only. Options 7 to 9.
// Loads after pg-casebook.jsx and reuses its seed, badges, share text and CbSession.
// Scope ratified 2026-10-08 (review-2-notes.md): now gets the most room; each option bounds the history its own way.
const C7_KEY = 'pg_library_casebook_v2';
let c7State = { opt: '7', viewer: 'pass', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(C7_KEY)) || {}; } catch (e) { return {}; } })() };
const c7Subs = new Set();
const c7Set = (p) => { c7State = { ...c7State, ...p }; try { localStorage.setItem(C7_KEY, JSON.stringify(c7State)); } catch (e) {} c7Subs.forEach((f) => f(c7State)); };
const useC7 = () => { const [s, setS] = React.useState(c7State); React.useEffect(() => { c7Subs.add(setS); return () => c7Subs.delete(setS); }, []); return s; };

const C7_LAST = CB_CASES.find((c) => c.played && !c.live);
const c7Hist = (mode) => cbList(mode).filter((c) => c !== CB_LIVE);
const c7Result = (c) => (c.verdict === 'right' ? 'Solved' : 'Unsolved');

// ---- Now: the parts every option builds from ----------------------------------------
const C7Streak = () => (
  <div className="c7-streak">
    <span className="c7-streak-n"><span className="gs-figure">{CB_STREAK.n}</span><span>weeks in a row</span></span>
    <div className="gs-days" role="img" aria-label={'Last 8 weeks: played ' + CB_STREAK.strip.filter((x) => x[1]).length}>
      {CB_STREAK.strip.map(([d, v]) => <i key={d} title={d} className={v ? 'is-on' : ''} />)}
    </div>
  </div>
);
const C7Share = ({ c, variant, label }) => {
  const [open, setOpen] = React.useState(false);
  const lines = CB_SHARE.words(c);
  return <>
    <DS.Button variant={variant || 'main'} onClick={() => setOpen(true)}>{label || 'Share'}</DS.Button>
    <DS.Popup open={open} onClose={() => setOpen(false)} kind="panel" title="Share your result"
      actions={<><DS.Button variant="secondary" onClick={() => setOpen(false)}>Close</DS.Button><CbCopyBtn lines={lines} /></>}>
      <CbShareText lines={lines} />
      <p className="gs-muted">It hides the killer and the suspects.</p>
    </DS.Popup>
  </>;
};
const C7Verdict = ({ c }) => (
  <span className={'c7-verdict ' + (c.verdict === 'right' ? 'is-ok' : 'is-bad')}>
    <DS.Icon name={c.verdict === 'right' ? 'check' : 'error'} size={24} />{c7Result(c)}
  </span>
);
const C7Live = ({ big }) => {
  const gs = useGs();
  return (
    <div className="c7-half">
      <span className="gs-label">THIS WEEK</span>
      <h2 className={big ? 'gs-h1' : 'mcp-t-card'}>{CB_LIVE.title}</h2>
      <DS.ProgressBar label={CB_LIVE.turns + ' of 16 turns used'} value={CB_LIVE.turns} max={16} showValue={false} />
      <p>{'You’ve exposed ' + CB_LIVE.lies + ' lies. The accusation is still yours to make.'}</p>
      <div className="c7-foot"><DS.TextLink onClick={() => cbGo(gs, CB_LIVE.id)}>See your turns so far</DS.TextLink></div>
    </div>
  );
};
const C7Last = () => {
  const gs = useGs(); const c = C7_LAST;
  return (
    <div className="c7-half">
      <span className="gs-label">LAST WEEK</span>
      <h2 className="mcp-t-card">{c.title}</h2>
      <C7Verdict c={c} />
      <p>{'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.'}</p>
      <div className="c7-foot"><C7Share c={c} /><DS.TextLink onClick={() => cbGo(gs, c.id)}>See every turn</DS.TextLink></div>
    </div>
  );
};

// ---- Achievements: one row of cards (liked in 5), badges coloured when earned (liked in 4)
const C7Ach = ({ mode }) => {
  const got = cbGot();
  const items = mode === 'ended' ? got : CB_ACH;
  return (
    <section className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">Achievements</h2>{mode === 'pass' && <span className="gs-muted">{got.length + ' of ' + CB_ACH.length + ' earned'}</span>}</div>
      {mode === 'free' ? <CbAchFree /> : <>
        {mode === 'ended' && <p className="gs-muted">{'Your Pass ended on ' + CB_ENDED + '. What you earned stays.'}</p>}
        <div className="cb-achrow c7-achrow" tabIndex={0} role="region" aria-label="Achievements">
          {items.map((a) => (
            <DS.Card key={a.k} style={{ gap: 12, justifyItems: 'start', alignContent: 'start' }}>
              <CbBadge k={a.k} got={!!a.got} />
              <span className="cb-ach-n">{a.n}</span>
              {a.got ? <span className="gs-muted">{'Earned ' + a.got}</span>
                : a.of ? <span className="cb-ach-bar"><DS.ProgressBar label={a.have + ' of ' + a.of} value={a.have} max={a.of} showValue={false} /></span>
                : <span className="gs-muted">{a.how}</span>}
            </DS.Card>
          ))}
        </div>
      </>}
    </section>
  );
};

// ---- History rows and the three ways of bounding them -------------------------------
const C7Row = ({ c, onOpen }) => {
  const inner = <><span className="gs-stack-xs"><span className="cb-row-t">{c.title}</span><span className="gs-muted">{'Week of ' + c.week}</span></span><CbStatus c={c} /></>;
  return c.played
    ? <button type="button" className="cb-row c7-row" onClick={onOpen}>{inner}<CbChev /></button>
    : <div className="cb-row c7-row is-off">{inner}<span /></div>;
};
// Pages: a fixed number of rows; Newer and Older step through them.
const C7Pages = ({ list, size, head }) => {
  const gs = useGs();
  const [p, setP] = React.useState(0);
  const pages = Math.max(1, Math.ceil(list.length / size));
  const pg = Math.min(p, pages - 1);
  const shown = list.slice(pg * size, pg * size + size);
  const from = list.length ? pg * size + 1 : 0; const to = pg * size + shown.length;
  return (
    <div className="cb-box">
      {head}
      {shown.length ? <ul className="cb-list">{shown.map((c) => <li key={c.id}><C7Row c={c} onOpen={() => cbGo(gs, c.id)} /></li>)}</ul>
        : <p className="c7-empty gs-muted">No case matches that.</p>}
      {pages > 1 && (
        <div className="c7-pager">
          <span className="gs-muted">{from + ' to ' + to + ' of ' + list.length}</span>
          <div className="c7-pager-btns">
            {pg > 0 && <DS.Button variant="secondary" onClick={() => setP(pg - 1)}>Newer</DS.Button>}
            {pg < pages - 1 && <DS.Button variant="secondary" onClick={() => setP(pg + 1)}>Older</DS.Button>}
          </div>
        </div>
      )}
    </div>
  );
};
// Months: one month at a time, stepped with arrows; a month holds four or five cases at most.
const C7Months = ({ list }) => {
  const gs = useGs();
  const months = cbMonths(list);
  const [i, setI] = React.useState(0);
  const m = months[i];
  if (!m) return null;
  return (
    <section className="gs-stack-md">
      <div className="c7-monthhead">
        <h2 className="mcp-t-sec">Your cases</h2>
        <div className="c7-stepper">
          {i < months.length - 1 ? <button type="button" className="gs-iconbtn" aria-label={'Earlier: ' + months[i + 1].m} onClick={() => setI(i + 1)}><DS.Icon name="back" /></button> : <span className="gs-iconbtn-space" />}
          <span className="c7-month" aria-live="polite">{m.m}</span>
          {i > 0 ? <button type="button" className="gs-iconbtn" aria-label={'Later: ' + months[i - 1].m} onClick={() => setI(i - 1)}><DS.Icon name="back" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
        </div>
      </div>
      <ul className="c7-tiles">
        {m.cases.map((c) => (
          <li key={c.id}>{c.played
            ? <button type="button" className="c7-tile" onClick={() => cbGo(gs, c.id)}><span className="gs-muted">{'Week of ' + c.week}</span><span className="cb-row-t">{c.title}</span><CbStatus c={c} /></button>
            : <div className="c7-tile is-off"><span className="gs-muted">{'Week of ' + c.week}</span><span className="cb-row-t">{c.title}</span><CbStatus c={c} /></div>}</li>
        ))}
      </ul>
    </section>
  );
};
// Archive: the page keeps the latest three; every case lives one click away, searchable and paged.
const C7Recent = ({ list }) => {
  const gs = useGs();
  return (
    <section className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">Your cases</h2><DS.TextLink onClick={() => cbGo(gs, 'all')}>{'All ' + list.length + ' cases'}</DS.TextLink></div>
      <div className="cb-box"><ul className="cb-list">{list.slice(0, 3).map((c) => <li key={c.id}><C7Row c={c} onOpen={() => cbGo(gs, c.id)} /></li>)}</ul></div>
    </section>
  );
};
const C7Archive = () => {
  const gs = useGs(); const mode = cbMode(gs);
  const [q, setQ] = React.useState('');
  const all = c7Hist(mode);
  const s = q.trim().toLowerCase();
  const list = s ? all.filter((c) => (c.title + ' ' + c.week + ' ' + c.month).toLowerCase().includes(s)) : all;
  return (
    <main className="gs-wrap gs-main c7-narrow">
      <div><button type="button" className="lg-back" onClick={() => cbGo(gs)}><DS.Icon name="back" size={20} />Casebook</button></div>
      <h1 className="gs-h1">Your cases</h1>
      <DS.SearchField label="Find a case" placeholder="A case name or a month" value={q} onChange={(e) => setQ(e.target.value)} />
      <C7Pages key={s} list={list} size={8} />
    </main>
  );
};

// ---- 7 · Split: one now card, this week beside last week; history in pages -----------
const C7Split = () => {
  const gs = useGs(); const mode = cbMode(gs); const list = c7Hist(mode);
  return (
    <main className="gs-wrap gs-main">
      <CbHead />
      <div className="cb-box c7-now">
        <div className="c7-split"><C7Live /><C7Last /></div>
        <div className="c7-band"><C7Streak /><span className="gs-muted">{'The next case arrives on ' + CB_NEXT + '.'}</span></div>
      </div>
      <C7Ach mode={mode} />
      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">Your cases</h2>
        <C7Pages list={list} size={5} />
      </section>
    </main>
  );
};

// ---- 8 · Lead: this week takes the big card; last week and the streak sit beside it --
const C8Figs = () => (
  <dl className="c7-figs">
    <div><dt className="gs-muted">Turns used</dt><dd>{CB_LIVE.turns}<span className="c7-of"> of 16</span></dd></div>
    <div><dt className="gs-muted">Lies exposed</dt><dd>{CB_LIVE.lies}</dd></div>
    <div><dt className="gs-muted">Accusation</dt><dd className="c7-dd-word">To make</dd></div>
  </dl>
);
const C8Lead = () => {
  const gs = useGs(); const mode = cbMode(gs); const list = c7Hist(mode);
  return (
    <main className="gs-wrap gs-main">
      <CbHead />
      <div className="c8-now">
        <div className="cb-box c8-lead">
          <div className="c7-half">
            <span className="gs-label">THIS WEEK</span>
            <h2 className="gs-h1">{CB_LIVE.title}</h2>
          </div>
          <C8Figs />
          <DS.ProgressBar label={CB_LIVE.turns + ' of 16 turns used'} value={CB_LIVE.turns} max={16} showValue={false} />
          <div className="c7-foot"><DS.TextLink onClick={() => cbGo(gs, CB_LIVE.id)}>See your turns so far</DS.TextLink><span className="gs-muted">{'Next case on ' + CB_NEXT + '.'}</span></div>
        </div>
        <div className="c8-side">
          <div className="cb-box c7-pad"><C7Last /></div>
          <div className="cb-box c7-pad"><C7Streak /></div>
        </div>
      </div>
      <C7Ach mode={mode} />
      <C7Months list={list} />
    </main>
  );
};

// ---- 9 · Scoreboard: the numbers lead, one tile each; history is three rows and a door
const C9Score = () => {
  const gs = useGs(); const c = C7_LAST;
  return (
    <section className="gs-stack-md">
      <div className="c9-title">
        <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="gs-h1">{CB_LIVE.title}</h2></div>
        <DS.TextLink onClick={() => cbGo(gs, CB_LIVE.id)}>See your turns so far</DS.TextLink>
      </div>
      <ul className="c9-tiles">
        <li className="cb-box c9-tile">
          <span className="gs-muted">Turns used</span>
          <span className="c9-n">{CB_LIVE.turns}<span className="c7-of"> of 16</span></span>
          <DS.ProgressBar label="" value={CB_LIVE.turns} max={16} showValue={false} />
        </li>
        <li className="cb-box c9-tile">
          <span className="gs-muted">Lies exposed</span>
          <span className="c9-n">{CB_LIVE.lies}</span>
          <span className="gs-muted">The accusation is still to make.</span>
        </li>
        <li className="cb-box c9-tile">
          <span className="gs-muted">Weeks in a row</span>
          <span className="c9-n">{CB_STREAK.n}</span>
          <div className="gs-days" role="img" aria-label={'Last 8 weeks: played ' + CB_STREAK.strip.filter((x) => x[1]).length}>
            {CB_STREAK.strip.map(([d, v]) => <i key={d} title={d} className={v ? 'is-on' : ''} />)}
          </div>
        </li>
        <li className="cb-box c9-tile">
          <span className="gs-muted">Last week</span>
          <C7Verdict c={c} />
          <span className="gs-muted">{c.turns + ' of 16 turns'}</span>
          <div className="c9-tile-act"><C7Share c={c} label="Share last week" /></div>
        </li>
      </ul>
      <p className="gs-muted">{'The next case arrives on ' + CB_NEXT + '.'}</p>
    </section>
  );
};
const C9Board = () => {
  const gs = useGs(); const mode = cbMode(gs); const list = c7Hist(mode);
  return (
    <main className="gs-wrap gs-main">
      <CbHead />
      <C9Score />
      <C7Ach mode={mode} />
      <C7Recent list={list} />
    </main>
  );
};

// ---- Mount ------------------------------------------------------------------------
const C7_OPTS = [
  { id: '7', name: 'Split', idea: 'One card holds the moment: this week’s case on the left, last week’s result and Share on the right, the streak along the bottom. Achievements follow as a row of cards.',
    hist: 'Five cases at a time, with Newer and Older. The list never grows past five rows.', cost: 'Finding a case from months ago takes several presses.' },
  { id: '8', name: 'Lead', idea: 'This week’s case takes the largest card, with its numbers set big. Last week’s result with Share and the streak sit beside it in two cards the same height.',
    hist: 'One month at a time as tiles, stepped with arrows. A month holds four or five cases, so the section keeps its size.', cost: 'The arrows hide how far back your cases go.' },
  { id: '9', name: 'Scoreboard', idea: 'The numbers lead: turns used, lies exposed, weeks in a row and last week’s result, one tile each. Share sits in last week’s tile.',
    hist: 'The page keeps the latest three cases. “All cases” opens a page you can search, eight cases at a time.', cost: 'Every older case is one page away, not on this one.' },
];
let c7Booted = false;
const C7Page = () => {
  const gs = useGs(); const st = useC7();
  const k = st.opt + gs.view + gs.sub.freeUsed;
  const sid = gs.route.sid;
  if (sid === 'all') return <C7Archive key={k} />;
  const c = sid && cbCase(sid);
  if (c) return <main className="gs-wrap gs-main"><CbSession key={k + sid} c={c} share="words" back="Casebook" onBack={() => cbGo(gs)} /></main>;
  if (st.opt === '8') return <C8Lead key={k} />;
  if (st.opt === '9') return <C9Board key={k} />;
  return <C7Split key={k} />;
};
const C7Game = () => { const gs = useGs(); if (gs.view !== 'out' && gs.route.page === 'record') return <C7Page />; const O = cbOrig; return <O />; };
const C7StripBar = () => {
  const gs = useGs(); const st = useC7();
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!c7Booted) { c7Booted = true; cbApply(gs, st.viewer); } }, []);
  const o = C7_OPTS.find((x) => x.id === st.opt) || C7_OPTS[0];
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {C7_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => { c7Set({ opt: x.id }); cbGo(gs); }}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => c7Set({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Viewer</span>
            {CB_VIEWERS.map(([v, l]) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={st.viewer === v} onClick={() => { c7Set({ viewer: v }); cbApply(gs, v); }}>{l}</button>)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => c7Set({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>History.</b> {o.hist}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-muted">Case titles, records and badges are invented for the rig.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsCasebook: C7Game, GsDemoBar: C7StripBar });
