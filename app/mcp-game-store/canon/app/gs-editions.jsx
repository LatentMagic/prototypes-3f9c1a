
// ============================================================================
// [Platform] — a game's Editions page: every edition, your result, the line to paste into your AI.
// Option 1b, ratified 2026-10-09 (docs/specs/editions/handoff-2026-10-09-editions-round-2.md).
// Route: the game's own route with { page: 'editions', pick? }. Pass sits in a fixed slot, Latest beside it, result in its own column.
// The line a player copies is a placeholder, not copy.
// ============================================================================
const ED_GAMES = ['word', 'groups', 'mystery', 'escape', 'casebook', 'delve'];
const ED_UNIT = { word: 'word', groups: 'groups', mystery: 'case', escape: 'room', casebook: 'case', delve: 'scene' };
const edGo = (gs, gid, pick) => gs.go(GS_GAMES[gid].route, { page: 'editions', pick });
const edName = (e) => '#' + e.n + (e.title ? ' · ' + e.title : '');

// Every edition of a game, newest first: { key, gid, n, title, date, month, free, now, status, open }
// Results agree with the library game page: this edition from lbNow; a free player has played the first edition; a lapsed one, everything played before the Pass ended.
const ED_NONE = { kind: 'none', label: 'Not played' };
const edList = (gs, gid) => {
  const pass = gs.view === 'pass'; const signed = gs.view !== 'out'; const now = signed ? lbNow(gs, gid) : null;
  if (PZ[gid]) {
    const c = PZ[gid];
    return c.all.map((x) => ({ key: x.id, gid, n: c.weekly ? c.all.length - x.i : +c.no(x.i).split('#')[1], title: c.weekly ? x.title : null, date: x.date, month: x.month, free: true, now: x.i === 0,
      status: !signed ? null : x.i === 0 ? (now ? now.status : ED_NONE) : pzStatus(c, x),
      open: !signed ? null : x.i === 0 ? (now ? now.open : null) : x.sid ? () => gs.go('session', { id: x.sid }) : null }));
  }
  const all = gid === 'casebook' ? CB_ALL : DV_ALL; const first = all[all.length - 1]; const lapsed = gsLapsed(gs);
  const mine = (x) => x.played && (pass || x === first || (lapsed && lbOld(x.week || x.date)));
  return all.map((x, i) => {
    const played = i === 0 ? !!now : signed && mine(x);
    const st = !signed ? null : i === 0 ? (now ? now.status : ED_NONE) : played ? (gid === 'casebook' ? cbStatus(x) : dvStatus(x)) : ED_NONE;
    return { key: x.id, gid, n: all.length - i, title: x.title, date: x.week || x.date, month: x.month, free: x === first, now: i === 0, status: st,
      open: !played ? null : i === 0 ? now.open : () => (gid === 'casebook' ? cbGo(gs, x.id) : gs.go('session', { id: dvSid(x) })) };
  });
};

const EdSt = ({ s }) => <span className={'lb-st is-' + s.kind}>{s.kind === 'ok' ? <DS.Icon name="check" size={14} /> : s.kind === 'bad' ? <DS.Icon name="error" size={14} /> : null}{s.short || s.label}</span>;

// A row opens the play dialog with its edition's prompt (gs-connect.jsx).
const EdLineDialog = ({ e, onClose }) => {
  const gs = useGs();
  React.useEffect(() => { if (e) { gs.playReq({ kind: 'edition', e }); onClose(); } }, [e]);
  return null;
};

const useEdFilter = (gs, list) => {
  const [q, setQ] = React.useState(''); const [sort, setSort] = React.useState('new'); const [show, setShow] = React.useState('all');
  const s = q.trim().toLowerCase().replace(/^#/, '');
  let out = list.filter((e) => show === 'all' || (show === 'none' ? e.status && e.status.kind === 'none' : show === 'free' ? e.free : e.status && e.status.kind !== 'none'));
  if (s) out = out.filter((e) => (String(e.n) + ' ' + (e.title || '') + ' ' + e.date + ' ' + e.month).toLowerCase().includes(s));
  if (sort === 'old') out = [...out].reverse();
  const shows = [['all', 'All'], ...(gs.view !== 'out' ? [['played', 'Played'], ['none', 'Not played']] : [])];
  return { q, setQ, sort, setSort, show, setShow, out, shows };
};
const EdTools = ({ f, gid }) => (
  <aside className="lb-tools">
    <DS.SearchField label={'Find a ' + ED_UNIT[gid]} placeholder="A number, name or date" value={f.q} onChange={(e) => f.setQ(e.target.value)} />
    <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} />
    {f.shows.length > 1 && <LbChoice label="Show" value={f.show} opts={f.shows} onPick={f.setShow} />}
  </aside>
);
const EdPager = ({ list, size, children }) => {
  const [p, setP] = React.useState(0); const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(p, pages - 1);
  React.useEffect(() => setP(0), [list.length]);
  return <>{children(list.slice(pg * size, pg * size + size))}<PhPages pg={pg} pages={pages} go={(x) => { setP(x); gsScrollTop(); }} /></>;
};

const EdRow = ({ e, onOpen }) => {
  const gs = useGs();
  return (
    <li><button type="button" className="ed-row" onClick={() => onOpen(e)}>
      <span className="ed-t">{edName(e)}</span>
      <span className="ed-m"><span className="lb-date">{e.date}</span></span>
      <span className="ed-slots"><span className="ed-slot">{!e.free && gs.view !== 'pass' && <DS.Tag kind="locked">Pass</DS.Tag>}</span><span className="ed-slot">{e.now && <DS.Tag kind="daily">Latest</DS.Tag>}</span></span>
      <span className="ed-r">{e.status && <EdSt s={e.status} />}</span>
      <LbChev />
    </button></li>
  );
};

const GsEditions = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const all = edList(gs, id);
  const f = useEdFilter(gs, all); const [open, setOpen] = React.useState(null);
  React.useEffect(() => { if (gs.route.pick) setOpen(all.find((e) => e.key === gs.route.pick) || null); }, []);
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={g.name} onClick={() => gs.go(g.route)} />
      <h1 className="gs-h1">All editions</h1>
      <div className="lb-alllay">
        <EdTools f={f} gid={id} />
        <div className="lb-box lb-results">
          {!f.out.length ? <p className="lb-empty gs-muted">No edition matches that. Try a number or a date.</p>
            : <EdPager list={f.out} size={15}>{(rs) => <ul className="lb-list">{rs.map((e) => <EdRow key={e.key} e={e} onOpen={setOpen} />)}</ul>}</EdPager>}
        </div>
      </div>
      <EdLineDialog e={open} onClose={() => setOpen(null)} />
    </main>
  );
};

Object.assign(window, { GsEditions, ED_GAMES, edGo, edList });
