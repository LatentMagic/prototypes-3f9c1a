// Playground: the library game page, Casebook only. Options 13 to 15, the final round.
// Loads after pg-casebook.jsx, pg-casebook-7-9.jsx and pg-casebook-10-12.jsx (seed, badges, share, C7Share).
// Scope: review-2-notes.md, "Scope for options 13 to 15". Parts sit side by side; nothing runs full width on desktop.
const C13_KEY = 'pg_library_casebook_v4';
let c13State = { opt: '13', viewer: 'pass', week: 'live', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(C13_KEY)) || {}; } catch (e) { return {}; } })() };
const c13Subs = new Set();
const c13Set = (p) => { c13State = { ...c13State, ...p }; try { localStorage.setItem(C13_KEY, JSON.stringify(c13State)); } catch (e) {} c13Subs.forEach((f) => f(c13State)); };
const useC13 = () => { const [s, setS] = React.useState(c13State); React.useEffect(() => { c13Subs.add(setS); return () => c13Subs.delete(setS); }, []); return s; };

const c13Short = (w) => { const p = w.split(' '); return p[0] + ' ' + p[1].slice(0, 3) + (p[2] ? ' ' + p[2] : ''); };
const c13Cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// The last weeks, oldest first, for the streak. Index 0 in C10_CASES is this week.
const c13Weeks = (n) => C10_CASES.slice(0, n).reverse().map((c) => {
  const p = c.week.split(' ');
  return { id: c.id, day: p[0], mon: p[1].slice(0, 3), month: p[1], played: c.played, now: c.id === CB_LIVE.id };
});
const C13_SINCE = '21 September';

// ---- Shared small parts ------------------------------------------------------------
const C13V = ({ c }) => (c.live ? <span>In progress</span>
  : <span className={'c13-v ' + (c.verdict === 'right' ? 'is-ok' : 'is-bad')}><DS.Icon name={c.verdict === 'right' ? 'check' : 'error'} size={20} />{c.verdict === 'right' ? 'Solved' : 'Unsolved'}</span>);
const C13Figs = ({ c }) => (
  <dl className="c13-figs">
    <div><dt>Result</dt><dd><C13V c={c} /></dd></div>
    <div><dt>Turns used</dt><dd>{c.turns}<span className="c13-of"> of 16</span></dd></div>
    <div><dt>Lies exposed</dt><dd>{c.lies}{!c.live && <span className="c13-of">{' of ' + c.total}</span>}</dd></div>
  </dl>
);
const C13Foot = ({ c }) => {
  const gs = useGs();
  return (
    <div className="c13-foot">
      <DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink>
      <span className="gs-muted">{'The next case arrives on ' + CB_NEXT + '.'}</span>
    </div>
  );
};
const C13StreakHead = () => (
  <div className="gs-stack-xs">
    <div className="c13-streakhead"><span className="gs-figure">{CB_STREAK.n}</span><span className="gs-strong">weeks in a row</span></div>
    <p className="gs-muted">{'You’ve played every week since ' + C13_SINCE + '.'}</p>
  </div>
);
const C13Legend = () => (
  <ul className="c13-legend"><li><i className="is-on" />Played</li><li><i />Missed</li></ul>
);

// ---- Rows: one line of signal; on a phone, title over a line of facts ----------------
const C13Rail = ({ up, down, played }) => (
  <span className="c13-rail" aria-hidden="true">{up && <i className="up" />}{down && <i className="down" />}<b className={played ? '' : 'is-miss'} /></span>
);
const C13Row = ({ c, rail }) => {
  const gs = useGs();
  const cells = <>
    {rail}
    <span className="c13-title">{c.title}</span>
    <span className="c13-meta">
      <span className="c13-date">{c13Short(c.week)}</span>
      <span className="c13-res"><CbStatus c={c} /></span>
      <span className="c13-n c13-tc">{c.played && <><b>{c.turns}</b><span>of 16 turns</span></>}</span>
      <span className="c13-n c13-lies">{c.played && <><b>{c.lies}</b><span>{'of ' + c.total + ' lies'}</span></>}</span>
    </span>
  </>;
  return c.played
    ? <button type="button" className={'c13-row' + (rail ? ' has-rail' : '')} onClick={() => cbGo(gs, c.id)}>{cells}<CbChev /></button>
    : <div className={'c13-row is-off' + (rail ? ' has-rail' : '')}>{cells}<span className="c13-chev-space" /></div>;
};
const C13Rows = ({ list }) => <div className="c13-list"><ul className="cb-list">{list.map((c) => <li key={c.id}><C13Row c={c} /></li>)}</ul></div>;
const C13Recent = ({ list, n }) => {
  const gs = useGs();
  return (
    <section className="cb-box c13-box">
      <div className="c13-boxhead"><h2 className="mcp-t-card">Your cases</h2><DS.TextLink onClick={() => cbGo(gs, 'all')}>All cases</DS.TextLink></div>
      <C13Rows list={list.slice(0, n)} />
    </section>
  );
};

// ---- Achievements: the grid from 11, shaped to the space it gets ---------------------
const C13Ach = ({ mode, fit }) => {
  const got = c10Got(); const items = mode === 'ended' ? got : C10_ACH;
  return (
    <section className="c13-card">
      <div className="c13-sechead"><h2 className="mcp-t-card">Achievements</h2>{mode === 'pass' && <span className="gs-muted">{got.length + ' of ' + C10_ACH.length + ' earned'}</span>}</div>
      {mode === 'free' ? <CbAchFree /> : <>
        {mode === 'ended' && <p className="gs-muted">{'Your Pass ended on ' + CB_ENDED + '. What you earned stays.'}</p>}
        <ul className={'c13-ach is-' + fit}>
          {items.map((a) => (
            <li key={a.k}><CbBadge k={a.k} got={!!a.got} />
              <span className="gs-stack-xs"><span className="c13-ach-n">{a.n}</span><span className="c13-ach-sub">{c10AchLine(a, mode)}</span></span></li>
          ))}
        </ul>
      </>}
    </section>
  );
};

// ---- 13 Desk: now beside a timeline of weeks; cases beside achievements ---------------
const C13Now = ({ c }) => (
  <section className="c13-card c13-now">
    <div className="c13-top">
      <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{c.title}</h2></div>
      {!c.live && <C7Share c={c} />}
    </div>
    <C13Figs c={c} />
    {c.live && <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />}
    <C13Foot c={c} />
  </section>
);
// Weeks you play in a row join into one bar; a missed week breaks it. Dates sit under each week.
const C13Run = () => {
  const ws = c13Weeks(10);
  return (
    <section className="c13-card">
      <C13StreakHead />
      <div className="c13-run" role="img" aria-label={'The last 10 weeks, oldest first: ' + ws.map((w) => w.day + ' ' + w.month + (w.played ? ' played' : ' missed')).join(', ')}>
        {ws.map((w, i) => {
          const join = i > 0 && w.played && ws[i - 1].played;
          const newMon = i === 0 || ws[i - 1].mon !== w.mon;
          return (
            <span key={w.id} className={'c13-wk' + (w.played ? ' is-on' : '') + (join ? ' is-join' : '') + (w.now ? ' is-now' : '')}>
              <em>{newMon ? w.mon : ''}</em><i /><span>{w.day}</span>
            </span>
          );
        })}
      </div>
      <C13Legend />
    </section>
  );
};
const C13Desk = ({ c, mode }) => (
  <div className="c13-desk">
    <C13Now c={c} />
    <C13Run />
    <C13Recent list={c10Hist(mode)} n={6} />
    <C13Ach mode={mode} fit="two" />
  </div>
);

// ---- 14 Sidebar: now and a calendar of weeks in a side column ------------------------
const C14Now = ({ c }) => (
  <section className="c13-card">
    <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-card">{c.title}</h2></div>
    <dl className="gs-rows-dl">
      <div className="gs-row-kv"><dt className="gs-muted">Result</dt><dd><C13V c={c} /></dd></div>
      <div className="gs-row-kv"><dt className="gs-muted">Turns used</dt><dd>{c.turns + ' of 16'}</dd></div>
      <div className="gs-row-kv"><dt className="gs-muted">Lies exposed</dt><dd>{c.live ? c.lies : c.lies + ' of ' + c.total}</dd></div>
    </dl>
    {c.live && <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />}
    {!c.live && <div className="c14-act"><C7Share c={c} /></div>}
    <C13Foot c={c} />
  </section>
);
// A month to a row, a square to a week, each with its date.
const C14Cal = () => {
  const ws = c13Weeks(12).filter((w, i, a) => a.findIndex((x) => x.month === 'August') <= i);
  const rows = ws.reduce((a, w) => { const g = a[a.length - 1]; if (g && g.m === w.mon) g.ws.push(w); else a.push({ m: w.mon, ws: [w] }); return a; }, []);
  return (
    <section className="c13-card">
      <C13StreakHead />
      <div className="c14-cal">
        {rows.map((r) => (
          <div key={r.m} className="c14-calrow">
            <span>{r.m}</span>
            {r.ws.map((w) => <span key={w.id} className={'c14-day' + (w.played ? ' is-on' : '') + (w.now ? ' is-now' : '')}
              aria-label={'Week of ' + w.day + ' ' + w.month + (w.played ? ', played' : ', missed') + (w.now ? ', this week' : '')}>{w.day}</span>)}
          </div>
        ))}
      </div>
      <C13Legend />
    </section>
  );
};
const C14Side = ({ c, mode }) => (
  <div className="c14-lay">
    <aside className="c14-aside"><C14Now c={c} /><C14Cal /></aside>
    <div className="c14-mainc"><C13Recent list={c10Hist(mode)} n={6} /><C13Ach mode={mode} fit="wide" /></div>
  </div>
);

// ---- 15 Weeks: the streak runs down the side of your cases ---------------------------
const C15Now = ({ c }) => (
  <section className="c13-card">
    <div className="c13-top">
      <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{c.title}</h2></div>
      {!c.live && <C7Share c={c} />}
    </div>
    {c.live ? <>
      <p>{'You’ve used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' lies. You haven’t named the killer yet.'}</p>
      <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
    </> : <div className="gs-stack-xs">
      <span className="c13-big"><C13V c={c} /></span>
      <p>{'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.'}</p>
    </div>}
    <C13Foot c={c} />
  </section>
);
const C15Weeks = ({ mode }) => {
  const gs = useGs();
  const list = c10Hist(mode).slice(0, 7);
  const ix = (c) => C10_CASES.indexOf(c);
  return (
    <section className="cb-box c13-box">
      <div className="c13-boxhead">
        <div className="c13-streakhead"><span className="gs-figure">{CB_STREAK.n}</span><span className="gs-strong">weeks in a row</span></div>
        <DS.TextLink onClick={() => cbGo(gs, 'all')}>All cases</DS.TextLink>
      </div>
      <div className="c13-list">
        <ul className="cb-list">
          {list.map((c, i) => {
            const prev = i === 0 ? C10_CASES[0] : list[i - 1]; const next = list[i + 1];
            const up = c.played && prev.played && ix(c) === ix(prev) + 1;
            const down = !!next && c.played && next.played && ix(next) === ix(c) + 1;
            return <li key={c.id}><C13Row c={c} rail={<C13Rail up={up} down={down} played={c.played} />} /></li>;
          })}
        </ul>
      </div>
    </section>
  );
};
const C15Lay = ({ c, mode }) => (
  <div className="c15-lay">
    <div className="c15-left"><C15Now c={c} /><C15Weeks mode={mode} /></div>
    <C13Ach mode={mode} fit="one" />
  </div>
);

// ---- All cases: tools in a side column; three ways through 45 and more ---------------
const C13Choice = ({ label, value, opts, onPick }) => (
  <div className="c13-choicegrp" role="group" aria-label={label}>
    <span className="gs-field-label">{label}</span>
    <div className="c13-choice">{opts.map(([v, l]) => <button key={v} type="button" aria-pressed={value === v} onClick={() => onPick(v)}>{l}</button>)}</div>
  </div>
);
const C13All = ({ way }) => {
  const gs = useGs(); const mode = cbMode(gs);
  const [q, setQ] = React.useState(''); const [sort, setSort] = React.useState('new'); const [filt, setFilt] = React.useState('all');
  const [p, setP] = React.useState(0); const [n, setN] = React.useState(12);
  const s = q.trim().toLowerCase(); const key = s + sort + filt;
  React.useEffect(() => { setP(0); setN(12); }, [key]);
  let list = c10Hist(mode).filter((c) => (filt === 'all' ? true : filt === 'none' ? !c.played : c.verdict === filt));
  if (s) list = list.filter((c) => (c.title + ' ' + c.week + ' ' + c.month).toLowerCase().includes(s));
  if (sort === 'old') list = [...list].reverse();
  const months = cbMonths(list); const mid = (m) => 'c13m-' + m.replace(/\s/g, '-');
  const size = 12; const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(p, pages - 1);
  const go = (x) => { setP(x); window.scrollTo(0, 0); };
  let body;
  if (!list.length) body = <div className="cb-box"><C10Empty /></div>;
  else if (way === 'pages') body = (
    <div className="cb-box">
      <C13Rows list={list.slice(pg * size, pg * size + size)} />
      {pages > 1 && (
        <nav className="c10-pages" aria-label="Pages">
          {pg > 0 ? <button type="button" className="gs-iconbtn" aria-label="Previous page" onClick={() => go(pg - 1)}><DS.Icon name="back" /></button> : <span className="gs-iconbtn-space" />}
          <div className="c10-pagenums">{Array.from({ length: pages }, (_, x) => <button key={x} type="button" aria-current={x === pg ? 'page' : undefined} onClick={() => go(x)}>{x + 1}</button>)}</div>
          {pg < pages - 1 ? <button type="button" className="gs-iconbtn" aria-label="Next page" onClick={() => go(pg + 1)}><DS.Icon name="back" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
        </nav>
      )}
    </div>
  );
  else if (way === 'months') body = (
    <div className="cb-box">
      {months.map((g) => <div key={g.m} id={mid(g.m)} className="c13-mblock"><div className="cb-month gs-label">{g.m.toUpperCase()}</div><C13Rows list={g.cases} /></div>)}
    </div>
  );
  else body = (
    <div className="cb-box">
      <C13Rows list={list.slice(0, n)} />
      <div className="c13-more">{n < list.length
        ? <DS.Button variant="secondary" onClick={() => setN(n + 12)}>Show older cases</DS.Button>
        : list.length > 12 && <span className="gs-muted">You’ve reached your first case.</span>}</div>
    </div>
  );
  return (
    <main className="gs-wrap gs-main">
      <div><button type="button" className="lg-back" onClick={() => cbGo(gs)}><DS.Icon name="back" size={20} />Casebook</button></div>
      <h1 className="gs-h1">Your cases</h1>
      <div className="c13-alllay">
        <aside className="c13-tools">
          <DS.SearchField label="Find a case" placeholder="A case name or a month" value={q} onChange={(e) => setQ(e.target.value)} />
          <C13Choice label="Order" value={sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={setSort} />
          <C13Choice label="Show" value={filt} opts={C10_FILTERS.filter(([v]) => v !== 'none' || mode === 'pass')} onPick={setFilt} />
          {way === 'months' && months.length > 1 && (
            <nav className="c13-choicegrp" aria-label="Jump to a month">
              <span className="gs-field-label">Jump to</span>
              <div className="c13-index">{months.map((g) => <button key={g.m} type="button" onClick={() => gsScrollToId(mid(g.m))}>{g.m}</button>)}</div>
            </nav>
          )}
        </aside>
        <div className="c13-results">{body}</div>
      </div>
    </main>
  );
};

// ---- The case page: turns grouped by kind --------------------------------------------
const C13_KINDS = [['Show evidence', 'Evidence shown'], ['Search', 'Searches'], ['Question', 'Questions']];
const C13Out = ({ r }) => {
  if (r.act === 'Show evidence') return <span className={'c13-out' + (r.c === 'B' ? ' is-hit' : '')}>{r.out}</span>;
  if (r.act === 'Search') return <span className={'c13-out' + (r.c === 'F' ? ' is-found' : '')}>{r.out}</span>;
  return null;
};
const C13Session = ({ c }) => {
  const gs = useGs();
  const rec = c.rec.map((r, i) => ({ ...r, n: i + 1 }));
  const acc = rec.find((r) => r.c === 'A');
  return (
    <main className="gs-wrap gs-main c13-sess">
      <div><button type="button" className="lg-back" onClick={() => cbGo(gs)}><DS.Icon name="back" size={20} />Casebook</button></div>
      <div className="c13-top">
        <div className="gs-stack-xs"><span className="gs-label">{c.live ? 'THIS WEEK' : 'WEEK OF ' + c.week.toUpperCase()}</span><h1 className="gs-h1">{c.title}</h1></div>
        {!c.live && <C7Share c={c} />}
      </div>
      <section className="c13-card">
        <dl className="c13-figs">
          <div><dt>Result</dt><dd><C13V c={c} /></dd></div>
          <div><dt>Turns used</dt><dd>{c.turns}<span className="c13-of"> of 16</span></dd></div>
          <div><dt>Lies exposed</dt><dd>{c.lies}{!c.live && <span className="c13-of">{' of ' + c.total}</span>}</dd></div>
          <div><dt>You accused</dt><dd>{acc ? acc.what : <span className="c13-of">No one yet</span>}</dd></div>
        </dl>
      </section>
      <div className="c13-kinds">
        {C13_KINDS.map(([act, name]) => {
          const rs = rec.filter((r) => r.act === act);
          return (
            <section key={act} className="cb-box c13-kind">
              <div className="c13-kindhead"><h2 className="mcp-t-card">{name}</h2><span className="gs-muted">{rs.length === 1 ? '1 turn' : rs.length + ' turns'}</span></div>
              {rs.length ? <ol className="c13-turns">
                {rs.map((r) => (
                  <li key={r.n}><span className="c13-tn">{'Turn ' + r.n}</span>
                    <span className="gs-stack-xs"><span>{c13Cap(r.what)}</span><C13Out r={r} /></span></li>
                ))}
              </ol> : <p className="c13-none gs-muted">You haven’t taken one of these yet.</p>}
            </section>
          );
        })}
      </div>
    </main>
  );
};

// ---- Mount ----------------------------------------------------------------------------
const C13_OPTS = [
  { id: '13', name: 'Desk', Body: C13Desk, way: 'pages',
    idea: 'Two columns. This week sits beside your streak; your cases sit beside your achievements. Finished, Share sits by the title.',
    streak: 'A dated timeline of 10 weeks. Weeks you played in a row join into one bar; a missed week breaks it.', all: 'Numbered pages of twelve.' },
  { id: '14', name: 'Sidebar', Body: C14Side, way: 'months',
    idea: 'A side column holds this week and your streak. The main column holds your cases, then your achievements. Finished, Share fills the width of the side card.',
    streak: 'A calendar: a month to a row, a square to a week, each square carrying its date.', all: 'Every case by month, with a month list to jump to.' },
  { id: '15', name: 'Weeks', Body: C15Lay, way: 'more',
    idea: 'This week is a short card written as sentences. Your cases sit under it, with achievements in a column beside them.',
    streak: 'The streak runs down the side of your cases: a line joins weeks played in a row and breaks at a missed week.', all: 'Twelve at a time, with Show older cases.' },
];
let c13Booted = false;
const C13Page = () => {
  const gs = useGs(); const st = useC13(); const mode = cbMode(gs);
  const o = C13_OPTS.find((x) => x.id === st.opt) || C13_OPTS[0];
  const k = st.opt + gs.view + gs.sub.freeUsed + st.week;
  const sid = gs.route.sid;
  if (sid === 'all') return <C13All key={k} way={o.way} />;
  const c = sid && c10Case(sid, st);
  if (c) return <C13Session key={k + sid} c={c} />;
  const B = o.Body;
  return <main key={k} className="gs-wrap gs-main"><CbHead /><B c={c10Week(st)} mode={mode} /></main>;
};
const C13GameRoute = () => { const gs = useGs(); if (gs.view !== 'out' && gs.route.page === 'record') return <C13Page />; const O = cbOrig; return <O />; };
const C13StripBar = () => {
  const gs = useGs(); const st = useC13();
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!c13Booted) { c13Booted = true; cbApply(gs, st.viewer); } }, []);
  const o = C13_OPTS.find((x) => x.id === st.opt) || C13_OPTS[0];
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {C13_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => { c13Set({ opt: x.id }); cbGo(gs); }}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => cbGo(gs, 'all')}>All cases</button>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => c13Set({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Viewer</span>
            {CB_VIEWERS.map(([v, l]) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={st.viewer === v} onClick={() => { c13Set({ viewer: v }); cbApply(gs, v); }}>{l}</button>)}
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Week</span>
            {[['live', 'In progress'], ['done', 'Finished']].map(([v, l]) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={st.week === v} onClick={() => c13Set({ week: v })}>{l}</button>)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => c13Set({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Streak.</b> {o.streak}</p>
          <p><b>All cases.</b> {o.all}</p>
          <p className="gs-muted">Case rows, the case page and achievements are the same in all three. Titles, records and badges are invented for the rig. No hover yet: the design system is settling it.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsCasebook: C13GameRoute, GsDemoBar: C13StripBar });
