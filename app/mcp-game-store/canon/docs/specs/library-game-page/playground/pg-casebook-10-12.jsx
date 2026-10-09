// Playground: the library game page, Casebook only. Options 10 to 12.
// Loads after pg-casebook.jsx (seed, badges, share text, CbSession). Scope ratified 2026-10-08 in review-2-notes.md.
const C10_KEY = 'pg_library_casebook_v3';
let c10State = { opt: '10', viewer: 'pass', week: 'live', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(C10_KEY)) || {}; } catch (e) { return {}; } })() };
const c10Subs = new Set();
const c10Set = (p) => { c10State = { ...c10State, ...p }; try { localStorage.setItem(C10_KEY, JSON.stringify(c10State)); } catch (e) {} c10Subs.forEach((f) => f(c10State)); };
const useC10 = () => { const [s, setS] = React.useState(c10State); React.useEffect(() => { c10Subs.add(setS); return () => c10Subs.delete(setS); }, []); return s; };

// ---- Seed: 28 more weeks behind the 17 in pg-casebook.jsx, about 45 in all ----------
const C10_A = ['The Silent', 'The Broken', 'The Last', 'A Cold', 'The Second', 'The Hollow', 'The Drowned', 'The Borrowed'];
const C10_B = ['Bell', 'Lantern', 'Orchard', 'Letter', 'Mill', 'Chapel', 'Ferry', 'Clock', 'Garden', 'Key', 'Pier', 'Ledger', 'Window', 'Harbour'];
const C10_SEQ = 'FQBNQFHBQNFQBHQN';
const C10_OLD = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(2026, 5, 15 - 7 * (i + 1));
  const mName = d.toLocaleString('en-GB', { month: 'long' });
  const month = mName + (d.getFullYear() !== 2026 ? ' ' + d.getFullYear() : '');
  const week = d.getDate() + ' ' + mName + (d.getFullYear() !== 2026 ? ' ' + d.getFullYear() : '');
  const played = i % 5 !== 2;
  const r = (i * 3) % 16; const len = 9 + ((i * 5) % 8);
  const seq = played ? (C10_SEQ.slice(r) + C10_SEQ.slice(0, r)).slice(0, len) : '';
  const lies = Array.from(seq).filter((c) => c === 'B').length;
  const verdict = played ? (i % 3 === 0 ? 'right' : 'wrong') : null;
  return { id: 'o' + i, week, month, title: C10_A[i % 8] + ' ' + C10_B[(i * 3) % 14], played, live: false, verdict,
    total: Math.max(lies, 3 + (i % 3)), turns: seq.length, lies, seq,
    rec: played ? cbRecord(seq, ['Ivy Marsh', 'Col. Brand', 'Ottoline Fay'], verdict, i) : [] };
});
const C10_CASES = [...CB_CASES, ...C10_OLD];
const C10_DONE_SEQ = 'FQBNQFBQFBH';
const C10_DONE = { ...CB_LIVE, live: false, verdict: 'right', seq: C10_DONE_SEQ, turns: C10_DONE_SEQ.length, lies: 4, total: 5,
  rec: cbRecord(C10_DONE_SEQ, ['Ada Quill', 'Rev. Hale', 'Nell Marsh'], 'right', 0) };
const c10Week = (st) => (st.week === 'done' ? C10_DONE : CB_LIVE);
const c10Case = (id, st) => (id === CB_LIVE.id ? c10Week(st) : C10_CASES.find((c) => c.id === id));
const c10Hist = (mode) => C10_CASES.filter((c) => c.id !== CB_LIVE.id && (c.played || mode === 'pass'));

// ---- Ten achievements; five earned. New badge art uses the same shapes and grounds --
Object.assign(CB_BADGE, {
  row4: ['#421A28', [5, 15, 25, 35].map((x) => ['rect', 'x="' + x + '" y="20" width="8" height="8"', '#E5A63B'])],
  quick: ['#163328', [['path', 'd="M8 38L24 10L40 38Z"', '#D66847'], ['circle', 'cx="38" cy="10" r="4"', '#F2EBE0']]],
  clean: ['#1D1B3A', [['circle', 'cx="24" cy="24" r="14"', '#A390B2'], ['rect', 'x="19" y="19" width="10" height="10"', '#F2EBE0']]],
  ten: ['#421A28', [7, 15, 23, 31, 39].flatMap((x) => [['rect', 'x="' + (x - 3) + '" y="14" width="6" height="8"', '#F2EBE0'], ['rect', 'x="' + (x - 3) + '" y="26" width="6" height="8"', '#E5A63B']])],
  rooms: ['#163328', [['circle', 'cx="20" cy="20" r="11"', '#328A88'], ['rect', 'x="29" y="29" width="12" height="12"', '#F2EBE0']]],
});
const C10_ACH = [
  ...CB_ACH.slice(0, 4),
  { k: 'rooms', n: 'Every room searched', how: 'Search every place in one case.', got: '7 September' },
  { k: 'clean', n: 'Three solved in a row', how: 'Solve three cases running.', got: '14 September' },
  { k: 'quick', n: 'Solved in eight turns', how: 'Name the killer using eight turns or fewer.' },
  CB_ACH[4],
  { k: 'row4', n: 'Four weeks in a row', how: 'Play four weeks running.', of: 4, have: 3, endedHave: 2 },
  { k: 'ten', n: 'Ten cases solved', how: 'Solve ten cases.', of: 10, have: 4, endedHave: 3 },
];
const c10Got = () => C10_ACH.filter((a) => a.got);
const c10AchLine = (a, mode) => (a.got ? 'Earned ' + a.got : a.of ? (mode === 'ended' ? a.endedHave : a.have) + ' of ' + a.of : a.how);

// ---- Now: this week, in progress or finished ----------------------------------------
const c10Left = (c) => 16 - c.turns;
const C10Figs = ({ c }) => (
  <dl className="c7-figs">
    <div><dt className="gs-muted">Turns used</dt><dd>{c.turns}<span className="c7-of"> of 16</span></dd></div>
    <div><dt className="gs-muted">Lies exposed</dt><dd>{c.lies}{!c.live && <span className="c7-of">{' of ' + c.total}</span>}</dd></div>
    {c.live && <div><dt className="gs-muted">Turns left</dt><dd>{c10Left(c)}</dd></div>}
  </dl>
);
const C10LiveLine = ({ c }) => <p>{'You haven’t named the killer yet. You have ' + c10Left(c) + ' turns to do it.'}</p>;
const C10Inline = ({ c }) => {
  const lines = CB_SHARE.words(c);
  return (
    <div className="c10-inline">
      <CbShareText lines={lines} />
      <div className="c10-inline-foot"><span className="gs-muted">It hides the killer and the suspects.</span><CbCopyBtn lines={lines} /></div>
    </div>
  );
};
const C10Head = ({ c, right }) => (
  <div className="c10-nowhead">
    <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="gs-h1">{c.title}</h2></div>
    {right}
  </div>
);

// 10: one big card. Finished puts the result and Share where the progress was.
const C10NowCard = ({ c }) => {
  const gs = useGs();
  return (
    <div className="cb-box c10-now">
      <div className="c10-now-body">
        <C10Head c={c} />
        {c.live ? null : <C7Verdict c={c} />}
        <C10Figs c={c} />
        {c.live && <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />}
        {c.live && <C10LiveLine c={c} />}
        <div className="c7-foot">
          {!c.live && <C7Share c={c} />}
          <DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink>
        </div>
      </div>
      <div className="c7-band"><C7Streak /><span className="gs-muted">{'The next case arrives on ' + CB_NEXT + '.'}</span></div>
    </div>
  );
};
// 11: two halves. The right half is what to do next: the share text to copy, or the turns left.
const C10NowSplit = ({ c }) => {
  const gs = useGs();
  return (
    <div className="cb-box c10-now">
      <div className="c10-split">
        <div className="c7-half">
          <C10Head c={c} />
          {!c.live && <C7Verdict c={c} />}
          <C10Figs c={c} />
          <div className="c7-foot"><DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink></div>
        </div>
        <div className="c7-half">
          <span className="gs-label">{c.live ? 'STILL TO DO' : 'SHARE YOUR RESULT'}</span>
          {c.live ? <>
            <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
            <C10LiveLine c={c} />
          </> : <C10Inline c={c} />}
        </div>
      </div>
      <div className="c7-band"><C7Streak /><span className="gs-muted">{'The next case arrives on ' + CB_NEXT + '.'}</span></div>
    </div>
  );
};
// 12: the numbers as tiles under the title; Share sits beside the title once you've finished.
const C10NowTiles = ({ c }) => {
  const gs = useGs();
  return (
    <section className="gs-stack-md">
      <C10Head c={c} right={!c.live && <C7Share c={c} />} />
      <ul className="c9-tiles">
        {!c.live && <li className="cb-box c9-tile"><span className="gs-muted">Result</span><C7Verdict c={c} /></li>}
        <li className="cb-box c9-tile">
          <span className="gs-muted">Turns used</span>
          <span className="c9-n">{c.turns}<span className="c7-of"> of 16</span></span>
          <DS.ProgressBar label="" value={c.turns} max={16} showValue={false} />
        </li>
        <li className="cb-box c9-tile">
          <span className="gs-muted">Lies exposed</span>
          <span className="c9-n">{c.lies}{!c.live && <span className="c7-of">{' of ' + c.total}</span>}</span>
        </li>
        <li className="cb-box c9-tile">
          <span className="gs-muted">Weeks in a row</span>
          <span className="c9-n">{CB_STREAK.n}</span>
          <div className="gs-days" role="img" aria-label={'Last 8 weeks: played ' + CB_STREAK.strip.filter((x) => x[1]).length}>
            {CB_STREAK.strip.map(([d, v]) => <i key={d} title={d} className={v ? 'is-on' : ''} />)}
          </div>
        </li>
      </ul>
      <div className="c7-foot">
        <DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink>
        <span className="gs-muted">{c.live ? 'You haven’t named the killer yet.' : 'The next case arrives on ' + CB_NEXT + '.'}</span>
      </div>
    </section>
  );
};

// ---- Achievements: three treatments -------------------------------------------------
const C10AchSec = ({ mode, children }) => {
  const got = c10Got();
  return (
    <section className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">Achievements</h2>{mode === 'pass' && <span className="gs-muted">{got.length + ' of ' + C10_ACH.length + ' earned'}</span>}</div>
      {mode === 'free' ? <CbAchFree /> : <>
        {mode === 'ended' && <p className="gs-muted">{'Your Pass ended on ' + CB_ENDED + '. What you earned stays.'}</p>}
        {children(mode === 'ended' ? got : C10_ACH)}
      </>}
    </section>
  );
};
const C10AchRow = ({ mode }) => (
  <C10AchSec mode={mode}>{(items) => (
    <div className="cb-achrow c7-achrow" tabIndex={0} role="region" aria-label="Achievements">
      {items.map((a) => (
        <DS.Card key={a.k} style={{ gap: 12, justifyItems: 'start', alignContent: 'start' }}>
          <CbBadge k={a.k} got={!!a.got} />
          <span className="cb-ach-n">{a.n}</span>
          {!a.got && a.of ? <span className="cb-ach-bar"><DS.ProgressBar label={c10AchLine(a, mode)} value={mode === 'ended' ? a.endedHave : a.have} max={a.of} showValue={false} /></span>
            : <span className="gs-muted">{c10AchLine(a, mode)}</span>}
        </DS.Card>
      ))}
    </div>
  )}</C10AchSec>
);
const C10AchGrid = ({ mode }) => (
  <C10AchSec mode={mode}>{(items) => (
    <ul className="cb-achgrid c10-achgrid">
      {items.map((a) => (
        <li key={a.k}><CbBadge k={a.k} got={!!a.got} />
          <span className="gs-stack-xs"><span className="cb-ach-n">{a.n}</span><span className="gs-muted c10-achsub">{c10AchLine(a, mode)}</span></span></li>
      ))}
    </ul>
  )}</C10AchSec>
);
const C10AchList = ({ mode }) => (
  <C10AchSec mode={mode}>{(items) => (
    <div className="cb-box c10-achbox">
      <ul className="cb-achlist c10-achlist">
        {items.map((a) => (
          <li key={a.k}><CbBadge k={a.k} got={!!a.got} />
            <span className="cb-ach-n">{a.n}</span>
            <span className="gs-muted c10-achsub">{c10AchLine(a, mode)}</span></li>
        ))}
      </ul>
    </div>
  )}</C10AchSec>
);

// ---- History: recent rows on the game page, everything on its own page --------------
const C10Row = ({ c }) => {
  const gs = useGs();
  const body = <span className="gs-stack-xs">
    <span className="cb-row-t">{c.title}</span>
    <span className="c10-meta"><span className="gs-muted">{'Week of ' + c.week}</span><CbStatus c={c} />{c.played && <span className="gs-muted">{c.turns + ' turns'}</span>}</span>
  </span>;
  return c.played
    ? <button type="button" className="cb-row c10-row" onClick={() => cbGo(gs, c.id)}>{body}<CbChev /></button>
    : <div className="cb-row c10-row is-off">{body}<span /></div>;
};
const C10Rows = ({ list }) => <ul className="cb-list">{list.map((c) => <li key={c.id}><C10Row c={c} /></li>)}</ul>;
const C10Recent = ({ list }) => {
  const gs = useGs();
  return (
    <section className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">Your cases</h2><DS.TextLink onClick={() => cbGo(gs, 'all')}>All cases</DS.TextLink></div>
      <div className="cb-box"><C10Rows list={list.slice(0, 4)} /></div>
    </section>
  );
};

const C10_FILTERS = [['all', 'All'], ['right', 'Solved'], ['wrong', 'Unsolved'], ['none', 'Not played']];
const C10Seg = ({ label, value, opts, onPick }) => (
  <div className="c10-segwrap" role="group" aria-label={label}>
    <span className="gs-field-label">{label}</span>
    <div className="c10-seg">{opts.map(([v, l]) => <button key={v} type="button" aria-pressed={value === v} onClick={() => onPick(v)}>{l}</button>)}</div>
  </div>
);
// Search, sort and filter are the same in all three; the way through the list differs.
const useC10List = (mode) => {
  const [q, setQ] = React.useState(''); const [sort, setSort] = React.useState('new'); const [filt, setFilt] = React.useState('all');
  const s = q.trim().toLowerCase();
  let list = c10Hist(mode).filter((c) => (filt === 'all' ? true : filt === 'none' ? !c.played : c.verdict === filt));
  if (s) list = list.filter((c) => (c.title + ' ' + c.week + ' ' + c.month).toLowerCase().includes(s));
  if (sort === 'old') list = [...list].reverse();
  const controls = (
    <div className="c10-tools">
      <DS.SearchField label="Find a case" placeholder="A case name or a month" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="c10-tools-row">
        <C10Seg label="Order" value={sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={setSort} />
        <C10Seg label="Show" value={filt} opts={C10_FILTERS.filter(([v]) => v !== 'none' || mode === 'pass')} onPick={setFilt} />
      </div>
    </div>
  );
  return { list, controls, key: s + sort + filt };
};
const C10Empty = () => <p className="c7-empty gs-muted">No case matches that. Try another name or month.</p>;
const C10Shell = ({ children }) => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main c10-all">
      <div><button type="button" className="lg-back" onClick={() => cbGo(gs)}><DS.Icon name="back" size={20} />Casebook</button></div>
      <h1 className="gs-h1">Your cases</h1>
      {children}
    </main>
  );
};
// 10: numbered pages of ten.
const C10AllPages = () => {
  const gs = useGs(); const { list, controls, key } = useC10List(cbMode(gs));
  const [p, setP] = React.useState(0);
  React.useEffect(() => setP(0), [key]);
  const size = 10; const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(p, pages - 1);
  const go = (n) => { setP(n); window.scrollTo(0, 0); };
  return (
    <C10Shell>
      {controls}
      <div className="cb-box">
        {list.length ? <C10Rows list={list.slice(pg * size, pg * size + size)} /> : <C10Empty />}
        {pages > 1 && (
          <nav className="c10-pages" aria-label="Pages">
            {pg > 0 ? <button type="button" className="gs-iconbtn" aria-label="Previous page" onClick={() => go(pg - 1)}><DS.Icon name="back" /></button> : <span className="gs-iconbtn-space" />}
            <div className="c10-pagenums">{Array.from({ length: pages }, (_, n) => <button key={n} type="button" aria-current={n === pg ? 'page' : undefined} onClick={() => go(n)}>{n + 1}</button>)}</div>
            {pg < pages - 1 ? <button type="button" className="gs-iconbtn" aria-label="Next page" onClick={() => go(pg + 1)}><DS.Icon name="back" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
          </nav>
        )}
      </div>
    </C10Shell>
  );
};
// 11: one list; ten more load as you near the end. The tools stay pinned so you can change course.
const C10AllScroll = () => {
  const gs = useGs(); const { list, controls, key } = useC10List(cbMode(gs));
  const [n, setN] = React.useState(10); const end = React.useRef(null);
  React.useEffect(() => setN(10), [key]);
  React.useEffect(() => {
    const el = end.current; if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) setN((x) => x + 10); }, { rootMargin: '200px' });
    io.observe(el); return () => io.disconnect();
  }, [key, n >= list.length]);
  return (
    <C10Shell>
      <div className="c10-sticky">{controls}</div>
      <div className="cb-box">{list.length ? <C10Rows list={list.slice(0, n)} /> : <C10Empty />}</div>
      {n < list.length ? <div ref={end} className="c10-loading"><DS.Loader size={24} /><span className="gs-muted">Loading older cases</span></div>
        : list.length > 10 && <div className="c10-loading"><span className="gs-muted">That’s every case.</span><DS.TextLink onClick={() => window.scrollTo(0, 0)}>Back to the top</DS.TextLink></div>}
    </C10Shell>
  );
};
// 12: every case by month; a month index jumps straight there.
const C10AllMonths = () => {
  const gs = useGs(); const { list, controls } = useC10List(cbMode(gs));
  const months = cbMonths(list);
  const mid = (m) => 'c10m-' + m.replace(/\s/g, '-');
  return (
    <C10Shell>
      {controls}
      {months.length ? (
        <div className="c10-mgrid">
          <nav className="c10-index" aria-label="Jump to a month">
            {months.map((g) => <button key={g.m} type="button" className="c10-index-btn" onClick={() => gsScrollToId(mid(g.m))}>{g.m}</button>)}
          </nav>
          <div className="cb-box">
            {months.map((g) => <div key={g.m} id={mid(g.m)} className="c10-mblock"><div className="cb-month gs-label">{g.m.toUpperCase()}</div><C10Rows list={g.cases} /></div>)}
          </div>
        </div>
      ) : <div className="cb-box"><C10Empty /></div>}
    </C10Shell>
  );
};

// ---- The three pages ------------------------------------------------------------------
const C10Game = ({ Now, Ach }) => {
  const gs = useGs(); const st = useC10(); const mode = cbMode(gs);
  return (
    <main className="gs-wrap gs-main">
      <CbHead />
      <Now c={c10Week(st)} />
      <Ach mode={mode} />
      <C10Recent list={c10Hist(mode)} />
    </main>
  );
};
const C10_OPTS = [
  { id: '10', name: 'One card', Now: C10NowCard, Ach: C10AchRow, All: C10AllPages,
    idea: 'This week is one big card. In progress it shows your numbers, the turns bar and what’s left; finished, the result and Share take that space.',
    ach: 'One scrolling row of cards, ten of them.', all: 'Numbered pages of ten.' },
  { id: '11', name: 'Two halves', Now: C10NowSplit, Ach: C10AchGrid, All: C10AllScroll,
    idea: 'This week splits in two: where you stand on the left, what to do next on the right. Finished, the right half is the share text with Copy.',
    ach: 'A badge grid with every badge in view.', all: 'One list. Ten more load as you reach the end; search, order and filter stay pinned at the top.' },
  { id: '12', name: 'Tiles', Now: C10NowTiles, Ach: C10AchList, All: C10AllMonths,
    idea: 'This week’s numbers sit in tiles under the title. Finished, Share sits beside the title and the result gets its own tile.',
    ach: 'A compact list in one card, two columns on a wide screen.', all: 'Every case by month, with a month index that jumps straight there.' },
];
let c10Booted = false;
const C10Page = () => {
  const gs = useGs(); const st = useC10();
  const o = C10_OPTS.find((x) => x.id === st.opt) || C10_OPTS[0];
  const k = st.opt + gs.view + gs.sub.freeUsed + st.week;
  const sid = gs.route.sid;
  if (sid === 'all') { const A = o.All; return <A key={k} />; }
  const c = sid && c10Case(sid, st);
  if (c) return <main className="gs-wrap gs-main"><CbSession key={k + sid} c={c} share="words" back="Casebook" onBack={() => cbGo(gs)} /></main>;
  return <C10Game key={k} Now={o.Now} Ach={o.Ach} />;
};
const C10GameRoute = () => { const gs = useGs(); if (gs.view !== 'out' && gs.route.page === 'record') return <C10Page />; const O = cbOrig; return <O />; };
const C10StripBar = () => {
  const gs = useGs(); const st = useC10();
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!c10Booted) { c10Booted = true; cbApply(gs, st.viewer); } }, []);
  const o = C10_OPTS.find((x) => x.id === st.opt) || C10_OPTS[0];
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {C10_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => { c10Set({ opt: x.id }); cbGo(gs); }}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => cbGo(gs, 'all')}>All cases</button>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => c10Set({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Viewer</span>
            {CB_VIEWERS.map(([v, l]) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={st.viewer === v} onClick={() => { c10Set({ viewer: v }); cbApply(gs, v); }}>{l}</button>)}
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Week</span>
            {[['live', 'In progress'], ['done', 'Finished']].map(([v, l]) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={st.week === v} onClick={() => c10Set({ week: v })}>{l}</button>)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => c10Set({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Achievements.</b> {o.ach}</p>
          <p><b>All cases.</b> {o.all}</p>
          <p className="gs-muted">Case titles, records and badges are invented for the rig. No hover yet: the design system is settling it.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsCasebook: C10GameRoute, GsDemoBar: C10StripBar });
