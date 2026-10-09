// Playground: a game's Editions page, option 1 and variants 2a to 2c built from it, 2026-10-09.
// Adds route { page: 'editions' } on each game's product route by wrapping GsGamePage, and the "All editions" link
// on the product page (GsWeekCard copy) and the library game page (LbRecent copy). Nothing in app/ changes.
// The line a player copies is a placeholder, not copy.
const ED_KEY = 'pg_editions_v1';
let ed = { opt: '1', open: true, game: 'casebook', ...(() => { try { return JSON.parse(localStorage.getItem(ED_KEY)) || {}; } catch (e) { return {}; } })() };
const edSubs = new Set();
const edSet = (p) => { ed = { ...ed, ...p }; try { localStorage.setItem(ED_KEY, JSON.stringify(ed)); } catch (e) {} edSubs.forEach((f) => f(ed)); };
const useEd = () => { const [s, setS] = React.useState(ed); React.useEffect(() => { edSubs.add(setS); return () => edSubs.delete(setS); }, []); return s; };

const ED_GAMES = ['word', 'groups', 'mystery', 'escape', 'casebook', 'delve'];
const ED_UNIT = { word: 'word', groups: 'groups', mystery: 'case', escape: 'room', casebook: 'case', delve: 'scene' };
const edLine = (e) => 'Start ' + GS_GAMES[e.gid].name + ' #' + e.n; // placeholder line, not designed
const edGo = (gs, gid, pick) => gs.go(GS_GAMES[gid].route, { page: 'editions', pick });

// Every edition of a game, newest first: { key, gid, n, title, date, month, free, now, status, open }
const edList = (gs, gid) => {
  const pass = gs.view === 'pass'; const signed = gs.view !== 'out';
  if (PZ[gid]) {
    const c = PZ[gid];
    return c.all.map((x) => {
      const sid = x.i === 0 ? (GS_TODAY_PLAYED[gs.view] || {})[gid] : x.sid;
      return { key: x.id, gid, n: c.weekly ? c.all.length - x.i : +c.no(x.i).split('#')[1], title: c.weekly ? x.title : null, date: x.date, month: x.month, free: true, now: x.i === 0,
        status: !signed ? null : x.i === 0 ? (sid ? { kind: 'ok', label: c.short } : { kind: 'none', label: 'Not played' }) : pzStatus(c, x), open: signed && sid ? () => gs.go('session', { id: sid }) : null };
    });
  }
  const all = gid === 'casebook' ? CB_ALL : DV_ALL; const first = all[all.length - 1];
  return all.map((x, i) => {
    const mine = signed && (pass || x === first);
    const st = !mine ? null : gid === 'casebook' ? cbStatus(i === 0 ? cbWeek(gs) : x) : dvStatus(x);
    return { key: x.id, gid, n: all.length - i, title: x.title, date: x.week || x.date, month: x.month, free: x === first, now: i === 0, status: st,
      open: mine && x.played ? () => (gid === 'casebook' ? cbGo(gs, x.id) : gs.go('session', { id: x === first ? 'delve-first' : 'delve' })) : null };
  });
};
const edName = (e) => '#' + e.n + (e.title ? ' · ' + e.title : '');

const EdSt = ({ s }) => <span className={'lb-st is-' + s.kind}>{s.kind === 'ok' ? <DS.Icon name="check" size={14} /> : s.kind === 'bad' ? <DS.Icon name="error" size={14} /> : null}{s.short || s.label}</span>;

// The line, a dialog: one short action (copy), nothing scrolls.
const EdLineDialog = ({ e, onClose }) => {
  const gs = useGs(); const last = React.useRef(null); if (e) last.current = e; const x = last.current;
  return (
    <DS.Popup open={!!e} onClose={onClose} title={x ? GS_GAMES[x.gid].name + ' ' + edName(x) : ''} actions={x ? <LbCopyBtn lines={[edLine(x)]} /> : null}>
      {x && <div className="gs-stack-md">
        <p className="gs-muted">Paste this into your AI.</p>
        <div className="lb-share-text">{edLine(x)}</div>
        {!x.free && gs.view !== 'pass' && <p className="gs-small">This {ED_UNIT[x.gid]} comes with the Pass. <button type="button" className="gs-inlink" onClick={() => { onClose(); gs.go('pass'); }}>About the Pass</button></p>}
        {x.open && <div><DS.TextLink onClick={() => { onClose(); x.open(); }}>See your session</DS.TextLink></div>}
      </div>}
    </DS.Popup>
  );
};

// Search, order, show.
const useEdFilter = (gs, list) => {
  const [q, setQ] = React.useState(''); const [sort, setSort] = React.useState('new'); const [show, setShow] = React.useState('all');
  const s = q.trim().toLowerCase().replace(/^#/, '');
  let out = list.filter((e) => show === 'all' || (show === 'none' ? e.status && e.status.kind === 'none' : show === 'free' ? e.free : e.status && e.status.kind !== 'none'));
  if (s) out = out.filter((e) => (String(e.n) + ' ' + (e.title || '') + ' ' + e.date + ' ' + e.month).toLowerCase().includes(s));
  if (sort === 'old') out = [...out].reverse();
  const shows = [['all', 'All'], ...(gs.view !== 'out' ? [['played', 'Played'], ['none', 'Not played']] : [])];
  return { q, setQ, sort, setSort, show, setShow, out, shows };
};
const EdTools = ({ f, gid, extra }) => (
  <aside className="lb-tools">
    <DS.SearchField label={'Find a ' + ED_UNIT[gid]} placeholder="A number, name or date" value={f.q} onChange={(e) => f.setQ(e.target.value)} />
    <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} />
    {f.shows.length > 1 && <LbChoice label="Show" value={f.show} opts={f.shows} onPick={f.setShow} />}
    {extra}
  </aside>
);
const EdPager = ({ list, size, children }) => {
  const [p, setP] = React.useState(0); const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(p, pages - 1);
  React.useEffect(() => setP(0), [list.length]);
  return <>{children(list.slice(pg * size, pg * size + size))}<PhPages pg={pg} pages={pages} go={(x) => { setP(x); gsScrollTop(); }} /></>;
};
const EdHead = ({ gid }) => {
  const gs = useGs(); const g = GS_GAMES[gid];
  return <>
    <LbBack label={g.name} onClick={() => gs.go(g.route)} />
    <h1 className="gs-h1">All editions</h1>
  </>;
};

// ---- Option 1: a ledger. One line per edition; the row opens the line. ----
// Marks sit in fixed slots: Pass always first (its slot kept when empty), Latest always beside it.
// Variants: group = month headings; cols = date and marks in their own columns; pin = the latest edition as a card above the list.
const EdSlots = ({ e }) => { const gs = useGs(); return <span className="ed-slots"><span className="ed-slot">{!e.free && gs.view !== 'pass' && <GsPassTag />}</span><span className="ed-slot">{e.now && <DS.Tag kind="daily">Latest</DS.Tag>}</span></span>; };
const ED_TAG = { ok: 'success', bad: 'error', live: 'daily' };
const EdStTag = ({ s }) => s.kind === 'none' ? <EdSt s={s} /> : <DS.Tag kind={ED_TAG[s.kind] || 'daily'}>{s.short || s.label}</DS.Tag>;
const EdRow = ({ e, onOpen, cols, orig, tags }) => (
  <li><button type="button" className={'ed-row' + (cols ? ' is-cols' : '') + (orig ? ' is-orig' : '')} onClick={() => onOpen(e)}>
    <span className="ed-t">{edName(e)}</span>
    {cols ? <span className="lb-date ed-d">{e.date}</span> : <span className="ed-m"><span className="lb-date">{e.date}</span>{orig && <EdSlots e={e} />}</span>}
    {!orig && <EdSlots e={e} />}
    <span className="ed-r">{e.status && (tags ? <EdStTag s={e.status} /> : <EdSt s={e.status} />)}</span>
    <LbChev />
  </button></li>
);
const EdLedger = ({ gid, group, cols, pin, orig, tags }) => {
  const gs = useGs(); const all = edList(gs, gid); const top = pin ? all[0] : null; const list = pin ? all.slice(1) : all;
  const f = useEdFilter(gs, list); const [open, setOpen] = React.useState(null);
  React.useEffect(() => { if (gs.route.pick) setOpen(all.find((e) => e.key === gs.route.pick) || null); }, []);
  const months = []; f.out.forEach((e) => { const m = months[months.length - 1]; if (m && m[0] === e.month) m[1].push(e); else months.push([e.month, [e]]); });
  const rows = (rs) => <ul className="lb-list">{rs.map((e) => <EdRow key={e.key} e={e} cols={cols} orig={orig} tags={tags} onOpen={setOpen} />)}</ul>;
  return (
    <main className="gs-wrap gs-main">
      <EdHead gid={gid} />
      {top && (
        <section className="lb-card ed-pin">
          <span className="gs-label">LATEST</span>
          <ul className="lb-list">{[top].map((e) => <EdRow key={e.key} e={{ ...e, now: false }} cols={cols} orig={orig} tags={tags} onOpen={setOpen} />)}</ul>
        </section>
      )}
      <div className="lb-alllay">
        <EdTools f={f} gid={gid} />
        <div className="lb-box lb-results">
          {!f.out.length ? <p className="lb-empty gs-muted">No edition matches that. Try a number or a date.</p>
            : group ? <EdPager list={months} size={2}>{(ms) => ms.map(([m, es]) => <React.Fragment key={m}><h2 className="ph-day">{m}</h2>{rows(es)}</React.Fragment>)}</EdPager>
            : <EdPager list={f.out} size={15}>{rows}</EdPager>}
        </div>
      </div>
      <EdLineDialog e={open} onClose={() => setOpen(null)} />
    </main>
  );
};
const Ed1 = ({ gid }) => <EdLedger gid={gid} orig />;
const Ed1b = ({ gid }) => <EdLedger gid={gid} />;
const Ed2d = ({ gid }) => <EdLedger gid={gid} tags />;
const Ed2a = ({ gid }) => <EdLedger gid={gid} group />;
const Ed2b = ({ gid }) => <EdLedger gid={gid} cols />;
const Ed2c = ({ gid }) => <EdLedger gid={gid} pin />;

const ED_PAGES = { 1: Ed1, '1b': Ed1b, '2d': Ed2d, '2a': Ed2a, '2b': Ed2b, '2c': Ed2c };
const ED_BASE_PAGE = window.GsGamePage;
const EdGamePage = (props) => {
  const gs = useGs(); const s = useEd();
  if (gs.route.page === 'editions' && ED_GAMES.includes(props.id)) { const P = ED_PAGES[s.opt] || Ed1; return <P key={s.opt + gs.view} gid={props.id} />; }
  return <ED_BASE_PAGE {...props} />;
};

// ---- Product page: this edition's card, plus "All editions" and, per option, the free first edition ----
const EdWeekCard = ({ id }) => {
  const gs = useGs(); const s = useEd(); const g = GS_GAMES[id]; const w = GS_PAGES[id].week;
  const paying = gs.view === 'pass'; const can = g.free || paying;
  const sid = g.free ? (GS_TODAY_PLAYED[gs.view] || {})[id] : paying && !w.unmarked ? w.session : null;
  const ss = sid ? GS_SESSIONS[sid] : null; const has = ED_GAMES.includes(id);
  const firstE = has && !g.free ? edList(gs, id).find((e) => e.free) : null; const [open, setOpen] = React.useState(null);
  const offerFirst = firstE && gs.view === 'free';
  return (
    <section id="gs-today" className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">{w.title}</h2>{has && <DS.TextLink onClick={() => edGo(gs, id)}>All editions</DS.TextLink>}</div>
      <DS.Card style={{ justifyItems: 'stretch' }}>
        <div className="gs-week">
          <GsCover art={g.art} />
          <div className="gs-stack-md" style={{ justifyItems: 'start', alignContent: 'center' }}>
            <h3 className="mcp-t-card">{g.name}</h3>
            <p className="gs-muted">{w.line}</p>
            {!can ? (
              <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
                {g.first && <p className="gs-small">{w.title + ' comes with the Pass. The first edition is free.'}</p>}
                <GsPassTag />
              </div>
            ) : ss ? (
              <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
                {(() => { const st = has ? (edList(gs, id)[0] || {}).status : null; return st && st.kind !== 'none' ? <LbResult s={st} /> : <GsResultTag s={ss} />; })()}
                <DS.TextLink onClick={() => gs.go('session', { id: sid })}>See your session page</DS.TextLink>
              </div>
            ) : <div className="gs-act"><DS.Button onClick={() => gs.play(g.name, w.session)}>Play in your AI</DS.Button></div>}
          </div>
        </div>
      </DS.Card>
      <EdLineDialog e={open} onClose={() => setOpen(null)} />
    </section>
  );
};

// ---- Strip ----
const ED_OPTS = [
  { id: '1', name: 'Ledger, fixes only',
    idea: 'The first ledger as it was, with one fix: Pass and Latest sit in fixed slots after the date, Pass first, so they line up down the list.',
    cost: 'The line is one press away on every row.' },
  { id: '1b', name: 'Ledger, marks in a column',
    idea: 'One short line per edition: number, name, date, your result. Pass and Latest sit in fixed slots, Pass first, so they line up down the list. The row opens a dialog with the line and Copy.',
    cost: 'The line is one press away on every row.' },
  { id: '2a', name: 'Ledger by month',
    idea: 'Option 1 under month headings, the way History groups by day. Two months to a page.',
    cost: 'A month of daily puzzles is a long run between headings; weekly games get four rows a month.' },
  { id: '2b', name: 'Ledger in columns',
    idea: 'Option 1 with the date and the marks in their own columns on wide screens, so number, date, Pass and result each read straight down.',
    cost: 'Wide rows only; on a phone it falls back to option 1.' },
  { id: '2c', name: 'Latest on top',
    idea: 'Option 1 with the latest edition lifted into its own card above the list; the list holds the earlier ones.',
    cost: 'The latest edition is also on the product page, so this repeats it.' },
  { id: '2d', name: 'Results as tags',
    idea: 'Option 1b with the result shown as the design system’s status tags: solved green, unsolved red, in progress grey. Not played stays plain text.',
    cost: 'Three kinds of tag on one row, and colour now carries the result.' },
];
let edBooted = false;
const EdStrip = () => {
  const gs = useGs(); const s = useEd(); const o = ED_OPTS.find((x) => x.id === s.opt) || ED_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!edBooted) { edBooted = true; gs.setView('free'); gs.setConnected(true); setTimeout(() => edGo(window.gsApi, ed.game), 0); } }, []);
  const view = (v) => { gs.setDemoView(v); gs.setConnected(v !== 'out'); };
  const rt = gs.route; const gid = gsGameOfRoute(rt.name);
  const here = !gid ? null : rt.page === 'editions' ? 'e' : rt.page === 'record' ? 'l' : 'p';
  const to = (k, g) => { const id = g || s.game; if (k === 'e') edGo(gs, id); else if (k === 'l') gs.go(GS_GAMES[id].route, { page: 'record' }); else gs.go(GS_GAMES[id].route); };
  const pickGame = (g) => { edSet({ game: g }); to(here || 'e', g); };
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  const goOpts = [['p', '1 Product page'], ['e', '2 Editions']];
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {ED_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => edSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => edSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Game</span>{seg(ED_GAMES.map((k) => [k, GS_GAMES[k].name.replace('Daily ', '')]), gid || s.game, pickGame)}</div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{seg(goOpts, here, (k) => to(k))}</div>
          <div className="pg-strip-row"><span className="pg-k">View</span>{seg([['out', 'signed out'], ['free', 'no Pass'], ['pass', 'Pass']], gs.view, view)}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => edSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">The free first edition is the one row without a Pass mark. “Start Casebook #45” is a placeholder line, not copy.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsGamePage: EdGamePage, GsWeekCard: EdWeekCard, GsDemoBar: EdStrip });
