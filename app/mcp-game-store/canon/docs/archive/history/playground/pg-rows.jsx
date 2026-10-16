
// Playground: the "Your groups" rows, the All page, and how a replay shows. Options 1 to 3, 2026-10-09.
// Builds on pg-history.jsx (seed, PH_EDS, History parts). Overrides LbRecent, LbAll, GsHistory and GsDemoBar on window.
// LbRecent and LbAll are copies of app/gs-library.jsx with the row swapped (copy once, not tuned). Nothing in app/ changes.
const PR_KEY = 'pg_rows_v1';
let pr = { opt: '1', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(PR_KEY)) || {}; } catch (e) { return {}; } })() };
const prSubs = new Set();
const prSet = (p) => { pr = { ...pr, ...p }; try { localStorage.setItem(PR_KEY, JSON.stringify(pr)); } catch (e) {} prSubs.forEach((f) => f(pr)); };
const usePr = () => { const [s, setS] = React.useState(pr); React.useEffect(() => { prSubs.add(setS); return () => prSubs.delete(setS); }, []); return s; };

const PR_ROW_FALLBACK = window.LbRow;
const prLabel = (s) => s.short || s.label;
const PrSt = ({ s }) => <span className={'pr-st is-' + s.kind}><span className="pr-ico">{s.kind === 'ok' ? <DS.Icon name="check" size={14} /> : s.kind === 'bad' ? <DS.Icon name="error" size={14} /> : null}</span>{prLabel(s)}</span>;
const PrChip = () => <span className="pr-chip"><DS.Tag kind="daily">Replay</DS.Tag></span>;
const PrChev = ({ on }) => (on ? <LbChev /> : <span className="lb-chev-space" />);
const prKeep = (v, again) => (v === 'hide' ? !again : v === 'only' ? again : true);

// One play, one row. It opens that play's own record. Used on History and in the library lists.
// v: { key, title, meta: [text], status, again, onOpen, gid? (adds the cover) }
const PrPlay = ({ v, opt }) => {
  const on = !!v.onOpen; const Tag = on ? 'button' : 'div';
  const props = { className: 'pr-p pr-p' + opt + (v.gid ? ' has-cov' : '') + (v.again ? ' is-again' : '') + (on ? '' : ' is-off'), ...(on ? { type: 'button', onClick: v.onOpen } : {}) };
  return (
    <Tag {...props}>
      {v.gid && <PhCov gid={v.gid} />}
      <span className="pr-tx">
        <span className="pr-tl"><span className="pr-t" title={v.title}>{v.title}</span>{v.again && opt === '1' && <PrChip />}</span>
        <span className="pr-m">{v.again && opt === '2' && <PrChip />}{v.meta.filter(Boolean).map((t, i) => <span key={i} className="pr-sep">{t}</span>)}</span>
      </span>
      <span className="pr-res"><PrSt s={v.status} />{v.again && opt === '3' && <PrChip />}</span>
      <PrChev on={on} />
    </Tag>
  );
};
// An edition becomes one view per play, latest first. An edition never played stays one row.
const prViews = (r, gs) => {
  const e = PH_EDS[r.key];
  if (!e) return [{ key: r.key, title: r.title, meta: [r.date], status: r.status, again: false, onOpen: r.onOpen }];
  return e.plays.slice().reverse().map((p) => ({ key: p.pid, title: r.title, meta: [p.again ? lbDate(p.at) : r.date], status: p.status, again: p.again, onOpen: r.onOpen ? () => p.open(gs) : null }));
};
const PrFilter = ({ opt, value, onPick }) => (opt === '2'
  ? <LbChoice label="Plays" value={value} opts={[['show', 'All plays'], ['hide', 'First plays'], ['only', 'Replays']]} onPick={onPick} />
  : <LbChoice label="Replays" value={value} opts={[['show', 'Show'], ['hide', 'Hide']]} onPick={onPick} />);

// Your plays card (copy of LbRecent, one row per play).
const PrRecent = ({ title, allLabel, onAll, rows, empty }) => {
  const s = usePr(); const gs = useGs();
  const card = React.useRef(null); const list = React.useRef(null); const probe = React.useRef(null);
  const [fit, setFit] = React.useState(null);
  const vs = React.useMemo(() => rows.flatMap((r) => (r.figs ? [{ key: r.key, raw: r }] : prViews(r, gs))), [rows, gs]);
  React.useLayoutEffect(() => {
    const el = card.current; if (!el || !vs.length) return undefined;
    const pair = el.previousElementSibling; const lay = el.parentElement;
    const measure = () => {
      const two = getComputedStyle(lay).gridTemplateColumns.split(' ').length > 1;
      if (!two || !pair) { el.style.height = ''; if (pair) pair.style.alignSelf = ''; setFit(null); return; }
      pair.style.alignSelf = 'start';
      el.style.height = pair.offsetHeight + 'px';
      const room = list.current ? el.clientHeight - list.current.offsetTop : 0;
      const hs = Array.from(probe.current.children).map((x) => x.offsetHeight);
      let k = 0; let sum = 0; while (k < hs.length && sum + hs[k] <= room + 1) { sum += hs[k]; k += 1; }
      if (k < Math.min(4, hs.length)) { el.style.height = ''; pair.style.alignSelf = ''; setFit(null); return; }
      setFit(k);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(pair); ro.observe(lay);
    return () => ro.disconnect();
  }, [vs.length, s.opt]);
  const shown = fit ? vs.slice(0, fit) : vs.slice(0, 4);
  const cell = (v, probing) => (v.raw ? <PR_ROW_FALLBACK r={v.raw} /> : <PrPlay v={probing ? { ...v, onOpen: null } : v} opt={s.opt} />);
  return (
    <section ref={card} className={'lb-card lb-recentcard' + (fit ? ' is-fill' : '')}>
      <div className="lb-sechead"><h2 className="mcp-t-card">{title}</h2>{rows.length > 0 && <DS.TextLink onClick={onAll}>{allLabel}</DS.TextLink>}</div>
      {vs.length ? <ul ref={list} className="lb-list lb-recent" style={fit ? { gridTemplateRows: 'repeat(' + fit + ', minmax(0, 1fr))' } : null}>{shown.map((v) => <li key={v.key}>{cell(v)}</li>)}</ul> : <p className="gs-muted">{empty}</p>}
      {vs.length > 0 && <ul ref={probe} className="lb-list lb-probe" aria-hidden="true">{vs.map((v) => <li key={v.key}>{cell(v, true)}</li>)}</ul>}
    </section>
  );
};

// The All page (copy of LbAll): editions are searched and filtered as before, then every play is a row.
const PrAll = ({ back, onBack, title, find, hint, filters, items, text, row, empty }) => {
  const s = usePr(); const gs = useGs();
  const [q, setQ] = React.useState(''); const [sort, setSort] = React.useState('new'); const [filt, setFilt] = React.useState(filters[0][0]);
  const [rep, setRep] = React.useState('show'); const [p, setP] = React.useState(0);
  const sq = q.trim().toLowerCase();
  React.useEffect(() => setP(0), [sq, sort, filt, rep]);
  const test = (filters.find(([v]) => v === filt) || filters[0])[2];
  let list = items.filter(test);
  if (sq) list = list.filter((x) => text(x).toLowerCase().includes(sq));
  if (sort === 'old') list = [...list].reverse();
  const vs = list.flatMap((x) => { const r = row(x); const vv = r.figs ? [{ key: r.key, raw: r, again: false }] : prViews(r, gs); return sort === 'old' ? vv.reverse() : vv; }).filter((v) => prKeep(rep, v.again));
  const size = 12; const pages = Math.max(1, Math.ceil(vs.length / size)); const pg = Math.min(p, pages - 1);
  const go = (x) => { setP(x); window.scrollTo(0, 0); };
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={back} onClick={onBack} />
      <h1 className="gs-h1">{title}</h1>
      <div className="lb-alllay">
        <aside className="lb-tools">
          <DS.SearchField label={find} placeholder={hint} value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Order" value={sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={setSort} />
          <LbChoice label="Show" value={filt} opts={filters.map(([v, l]) => [v, l])} onPick={setFilt} />
          <PrFilter opt={s.opt} value={rep} onPick={setRep} />
        </aside>
        <div className="lb-box lb-results">
          {vs.length ? <div className="lb-rows"><ul className="lb-list">{vs.slice(pg * size, pg * size + size).map((v) => <li key={v.key}>{v.raw ? <PR_ROW_FALLBACK r={v.raw} /> : <PrPlay v={v} opt={s.opt} />}</li>)}</ul></div>
            : <p className="lb-empty gs-muted">{empty}</p>}
          <PhPages pg={pg} pages={pages} go={go} />
        </div>
      </div>
    </main>
  );
};

// History: every play under its day (ratified), with the replay filter and the replay chip.
const PrHistory = () => {
  const gs = useGs(); const s = usePr(); const r = gs.route; const f = usePhList(r.game);
  const [rep, setRep] = React.useState('show');
  const list = f.list.filter((x) => prKeep(rep, x.again));
  const size = 24; const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(f.pg, pages - 1);
  const groups = [];
  list.slice(pg * size, pg * size + size).forEach((p) => { const k = phDayKey(p.at); const last = groups[groups.length - 1]; if (last && last[0] === k) last[2].push(p); else groups.push([k, phDayLabel(p.at), [p]]); });
  const view = (p) => ({ key: p.pid, gid: p.gid, title: f.g === 'all' ? GS_GAMES[p.gid].name : p.edTitle, meta: [f.g === 'all' && p.edTitle, phTime(p.at)], status: p.status, again: p.again, onOpen: () => p.open(gs) });
  return (
    <PhPage>
      {r.from && <LbBack label={GS_GAMES[r.from].name} onClick={() => phLib(gs, r.from)} />}
      <PhHead />
      {!f.all.length ? <PhEmpty /> : (
        <div className="lb-alllay">
          <aside className="lb-tools"><LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} /><PhShow f={f} />
            <PrFilter opt={s.opt} value={rep} onPick={(v) => { setRep(v); f.go(0); }} /></aside>
          <div className="lb-box lb-results">
            {groups.map(([k, label, ps]) => (
              <React.Fragment key={k + pg}>
                <h2 className="ph-day">{label}</h2>
                <ul className="ph-list">{ps.map((p) => <li key={p.pid}><PrPlay v={view(p)} opt={s.opt} /></li>)}</ul>
              </React.Fragment>
            ))}
            <PhPages pg={pg} pages={pages} go={f.go} />
          </div>
        </div>
      )}
    </PhPage>
  );
};

// ---- Strip ----
const PR_OPTS = [
  { id: '1', name: 'Chip beside the title',
    idea: 'Every play is its own row and opens its own record, so nothing says “2 plays” and then goes nowhere. A replay carries a Replay chip on the title line. The result sits in one fixed column with a fixed icon slot, so Solved, Missed and Not played start at the same edge.',
    filter: 'A Replays choice, Show or Hide, on History and on each All page.',
    cost: 'The chip sits in the title line, so a long title ends in an ellipsis a little sooner on a replay.' },
  { id: '2', name: 'Chip leads the meta line',
    idea: 'Same one-row-per-play rows and the same result column. The Replay chip leads the line under the title, ahead of the date or time, so the title keeps its full width and the chip is the first thing the second line says.',
    filter: 'One Plays choice with three states: All plays, First plays, Replays. It hides replays or shows only them.',
    cost: 'Three states is one more thing to read than Show or Hide.' },
  { id: '3', name: 'Chip under the result',
    idea: 'Same rows. The chip joins the result column, under the result, because a replay is a fact about that play’s result. The title and meta stay clean and all of the row’s status reads in one place.',
    filter: 'A Replays choice, Show or Hide, on History and on each All page.',
    cost: 'A replayed row is taller than the rest, and the chip is far from the title.' },
];
const PR_GO = [['g', 'Groups'], ['ga', 'All groups'], ['e', 'Escape'], ['ea', 'All rooms'], ['h', 'History']];
let prBooted = false;
const PrStrip = () => {
  const gs = useGs(); const s = usePr(); const o = PR_OPTS.find((x) => x.id === s.opt) || PR_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!prBooted) { prBooted = true; gs.setView('pass'); gs.setConnected(true); setTimeout(() => phLib(window.gsApi, 'groups'), 0); } }, []);
  const view = (v) => { gs.setDemoView(v); gs.setConnected(v !== 'out'); };
  const rt = gs.route; const gid = rt.page === 'record' ? gsGameOfRoute(rt.name) : null;
  const here = rt.name === 'history' ? 'h' : gid === 'groups' ? (rt.sid === 'all' ? 'ga' : 'g') : gid === 'escape' ? (rt.sid === 'all' ? 'ea' : 'e') : null;
  const to = (k) => (k === 'h' ? gs.go('history') : phLib(gs, k[0] === 'g' ? 'groups' : 'escape', k.length > 1 ? 'all' : undefined));
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Chip</span>
            {PR_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => prSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => prSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{gs.view === 'out' ? <span className="pg-name">Sign in to reach these</span> : seg(PR_GO, here, to)}</div>
          <div className="pg-strip-row"><span className="pg-k">View</span>{seg([['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']], gs.view, view)}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => prSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>The filter.</b> {o.filter}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">Daily Groups #87 has a replay. Escape has long room names to test the width. The wording in each option is a draft, not copy.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { LbRecent: PrRecent, LbAll: PrAll, GsHistory: PrHistory, GsDemoBar: PrStrip });
