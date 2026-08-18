// ============================================================================
// v11 — the app. The real Active shelf with ONE option mounted in it.
//
// The shipped feed card is mounted, not re-drawn (`D9Card`, the v9 copy that
// carries the slots discourse needs). The margin options fill its head slot; the
// tuck options wrap it, because a slip behind the card cannot live inside the
// card's border. Nothing else on the card is touched by any option.
//
// The rig owns the bar above the frame and nothing below it. The top bar carries
// no circles menu and no settings gear here: there is no drawer and no settings
// surface in this rig, and a control that goes nowhere poisons the review it
// appears in — absent, never present-and-dead.
// ============================================================================
const T11_OPTS = [].concat(window.T11_MARGIN, window.T11_TUCK);
const T11_KEY = 'pg_t11_v1';
const t11Saved = (() => { try { return JSON.parse(localStorage.getItem(T11_KEY) || 'null') || {}; } catch (e) { return {}; } })();
const T11_CFG0 = { length: 'para', preview: true, density: 'all' };

const T11App = () => {
  const [optId, setOptId] = React.useState(t11Saved.optId || 'M1');
  const [cfg, setCfg] = React.useState({ ...T11_CFG0, ...(t11Saved.cfg || {}) });
  const [viewport, setViewport] = React.useState(t11Saved.viewport || 'auto');
  const [barOpen, setBarOpen] = React.useState(true);
  const [winW, setWinW] = React.useState(window.innerWidth);
  const [tab, setTab] = React.useState('active');
  const [openIds, setOpenIds] = React.useState([]);
  const [liftId, setLiftId] = React.useState(null);
  const [pageId, setPageId] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [readIds, setReadIds] = React.useState([]);
  const [goneIds, setGoneIds] = React.useState([]);
  const user = window.CircSeed.DEFAULT_USER;

  React.useEffect(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem(T11_KEY, JSON.stringify({ optId, cfg, viewport })); } catch (e) {}
  }, [optId, cfg, viewport]);

  const opt = T11_OPTS.find(o => o.n === optId) || T11_OPTS[0];
  const isApp = viewport === 'mobile' || winW < 1024;
  React.useEffect(() => {
    document.documentElement.setAttribute('data-circ-posture', isApp ? 'mobile' : 'desktop');
  }, [isApp]);

  // Switching option or length never reloads the reader's place: only what is
  // open is dropped, because an open thought in one option means nothing in the
  // next. The scroll position is left exactly alone.
  const shut = () => { setOpenIds([]); setLiftId(null); setPageId(null); };
  React.useEffect(shut, [optId, cfg.length, cfg.density]);

  const api = {
    isOpen: (id) => openIds.includes(id),
    toggle: (id) => setOpenIds(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]),
    openOne: (id) => setOpenIds([id]),
    close: () => setOpenIds([]),
    lift: (id) => setLiftId(id),
    page: (id) => setPageId(id),
  };

  const shelf = React.useMemo(() => window.PGT11Data.t11Shelf(cfg), [cfg.length, cfg.preview, cfg.density]);
  const items = shelf
    .filter(i => !goneIds.includes(i.id))
    .map(i => (readIds.includes(i.id) ? { ...i, read: true, thought: i.thought } : i));

  const ctx = {
    user,
    onMarkRead: (item) => setReadIds(v => [...v, item.id]),
    onDelete: (item) => setConfirm(item),
    openRecord: () => {},
  };

  const stFor = (o) => ({
    onCard: o && o.onCard ? (item) => o.onCard(item, api) : null,
    cardHead: o && o.cardHead ? (slots) => o.cardHead(slots, api) : null,
  });
  // `mode` gives the card without the option on it: 'whole' for the lifted card,
  // whose margin simply holds the whole thought, and 'plain' for the travelled-to
  // card, which has the thought beside it on its own plane.
  const cardFor = (item, mode) => (
    <window.D9Card item={item} tab={item.read ? 'read' : 'active'} user={user} ctx={ctx}
      st={mode === 'whole' ? { onCard: (it) => <window.T11Whole item={it} /> } : mode ? {} : stFor(opt)} />
  );

  const list = items.filter(i => (tab === 'read' ? i.read : !i.read));
  const open = (id) => openIds.includes(id) || liftId === id;

  const feed = (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
        padding: isApp ? '16px 16px 96px' : '28px 24px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {list.length === 0
          ? <window.EmptyState tab={tab} onStartCircle={() => {}} />
          : list.map(item => (
            <div key={item.id} data-t11-card={item.id}
              style={{ position: 'relative', zIndex: open(item.id) ? 30 : 1, opacity: liftId === item.id ? 0.35 : 1 }}>
              {opt.wrap ? opt.wrap(item, api, cardFor(item)) : cardFor(item)}
            </div>
          ))}
      </div>
    </main>
  );

  const liftItem = liftId ? items.find(i => i.id === liftId) : null;
  const pageItem = pageId ? items.find(i => i.id === pageId) : null;

  const app = (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: isApp ? '100%' : 'var(--circ-vh)',
      background: 'var(--color-canvas)' }}>
      <window.TopBar isMobile={false} space={{ name: 'Backend Pod' }} showMembers={false} />
      <window.Tabs active={tab} onChange={setTab} />
      {feed}
      {liftItem && opt.lifts && (
        <window.T11Lifted item={liftItem} cardFor={(i) => cardFor(i, 'whole')} onClose={() => setLiftId(null)} />
      )}
      {pageItem && opt.pages && (
        <window.T11ThoughtPage item={pageItem} cardFor={(i) => cardFor(i, 'plain')} onClose={() => setPageId(null)} />
      )}
      {confirm && (
        <window.ConfirmDialog kind="delete"
          onConfirm={() => { setGoneIds(v => [...v, confirm.id]); setConfirm(null); }}
          onCancel={() => setConfirm(null)} />
      )}
    </div>
  );

  return (
    <React.Fragment>
      <window.T11Bar opts={T11_OPTS} optId={optId} onPick={setOptId} cfg={cfg} setCfg={setCfg}
        viewport={viewport} onViewport={setViewport} open={barOpen} onToggle={() => setBarOpen(v => !v)} />
      {viewport === 'mobile'
        ? <div className="circ-stage"><div className="circ-phone"><div className="circ-phone-clip">
            <div className="circ-phone-screen">{app}</div>
          </div></div></div>
        : app}
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<T11App />);
