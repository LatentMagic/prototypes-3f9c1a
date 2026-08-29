// ============================================================================
// The stack — a card behind a card. Standalone rig, one option.
//
// CLOSED: the shipped card, with a second card tucked UNDER it — inset each
// side, a band of it showing below the foot. The band always carries the
// thought: a short one is read there and needs nothing; a long one shows its
// opening and says so. It is always openable either way.
//
// OPEN: the card behind comes forward and lands ON TOP as an alternate face of
// the same card — the title (still the link), the whole thought, and the same
// actions. The shelf makes room for it, so nothing below is obscured. The card
// it came from stays underneath with its edge showing, which is the closed
// state's own geometry inverted: card above a card, in both states.
// ============================================================================
const ST_KEY = 'pg_st_v1';
const stSaved = (() => { try { return JSON.parse(localStorage.getItem(ST_KEY) || 'null') || {}; } catch (e) { return {}; } })();

// The band's paper. White is the card's own; the other two are candidates only —
// `--color-sage` is the mark's light and has never been a surface, and the warm
// paper is not a token yet. Both are here to be looked at, not adopted.
const ST_PAPERS = {
  white: { label: 'White', bg: 'var(--color-surface)', bd: 'var(--color-border-1)' },
  sage: { label: 'Sage tint', bg: 'color-mix(in oklab, var(--color-sage) 13%, #fff)', bd: 'color-mix(in oklab, var(--color-sage) 42%, #fff)' },
  warm: { label: 'Warm paper', bg: '#F2F1EB', bd: '#DEDCD3' },
};

const ST_OVERLAP = 15;  // how far the card in front sits over the one behind
const ST_INSET = 12;    // how far the card behind is inset on each side
const ST_EDGE = 27;     // the open state's sliver (12px of it shows)

// Roughly what fits on one line of the band at feed width. Past it the band
// shows the opening and says there is more.
const stHeld = (t) => window.PGT11Data.t11Long(t) || t.text.length > 58;

// The card in front, lifted so it visibly sits on something.
const StFront = ({ children }) => (
  <div style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-raised)' }}>{children}</div>
);

// The band: the card behind, seen from under the card in front.
const StBand = ({ item, paper, onOpen }) => {
  const t = item.thought;
  const p = ST_PAPERS[paper];
  const held = stHeld(t);
  return (
    <button type="button" onClick={onOpen} className="st-band"
      aria-label={'Open what ' + t.by + ' wrote'}
      style={{ position: 'relative', zIndex: 0, display: 'flex', alignItems: 'baseline', gap: 12, width: 'auto', textAlign: 'left', font: 'inherit', cursor: 'pointer',
        background: p.bg, borderWidth: 1, borderStyle: 'solid', borderColor: p.bd, borderTopWidth: 0,
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        margin: (-ST_OVERLAP) + 'px ' + ST_INSET + 'px 0', padding: (ST_OVERLAP + 5) + 'px 16px 9px' }}>
      <span style={{ flex: 1, minWidth: 0, font: '400 13.5px/1.5 var(--font-sans)', color: 'var(--color-fg-1)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <span style={{ fontWeight: 600 }}>{t.by}</span>{'\u2002'}{t.text}
      </span>
      {held && (
        <span className="st-more" style={{ flexShrink: 0, font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-accent)' }}>Read more</span>
      )}
    </button>
  );
};

// The edge of the card the alternate came from. It sits ABOVE the alternate: the
// thought card has come forward, so the link card is the one that has slipped
// behind — and the only thing that shows that is seeing its edge on top.
const StEdge = () => (
  <div aria-hidden="true" style={{ position: 'relative', zIndex: 0, height: ST_EDGE,
    background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)', borderBottomWidth: 0,
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', margin: '0 ' + ST_INSET + 'px ' + (-ST_OVERLAP) + 'px' }} />
);

// The alternate face. The same card, with room: the title still opens the link,
// the words are the matter, and the actions are the card's own. No favicon, no
// source name, no preview, no attribution row — that furniture is for scanning a
// shelf, and this is not a shelf.
const StAlt = ({ item, user, ctx, paper, onClose }) => {
  const t = item.thought;
  const p = ST_PAPERS[paper];
  const title = item.title || window.d9DeriveTitle(item.url);
  const isYou = /^you$/i.test(t.by);
  return (
    <div className="st-alt" style={{ position: 'relative', zIndex: 2,
      background: p.bg, borderWidth: 1, borderStyle: 'solid', borderColor: p.bd,
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-raised)',
      padding: 'var(--space-4) var(--space-5) var(--space-3)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle"
          style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3,
            letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty' }}>{title}</a>
        <button type="button" onClick={onClose} className="st-close" aria-label="Close"
          style={{ flexShrink: 0, background: 'transparent', borderWidth: 0, cursor: 'pointer', color: 'var(--color-fg-2)',
            borderRadius: 'var(--radius-sm)', width: 36, height: 36, margin: '-6px -10px 0 0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <window.Icon name="x" size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <window.Avatar name={isYou ? window.displayName(user) : t.by} size={22} accent={isYou} />
          <span style={{ font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{t.by}</span>
        </div>
        <window.T11Words t={t} size={15.5} lh={1.65} gap={10} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderTopWidth: 1, borderTopStyle: 'solid',
        borderTopColor: 'var(--color-border-2)', marginTop: 2, paddingTop: 2 }}>
        <span style={{ flex: 1, font: '500 11px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{window.circWhen(item.at)}</span>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: -13 }}>
          <button className="circ-cardaction circ-cardaction-icon" onClick={() => ctx.onMarkRead(item)} aria-label="Mark as read" title="Mark as read">
            <window.Icon name="check" size={18} />
          </button>
          <button className="circ-cardaction circ-cardaction-icon" onClick={() => ctx.onDelete(item)} aria-label="Delete this link" title="Delete">
            <window.Icon name="trash" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- the rig's bar: length, the band's paper, viewport. Nothing else. --------
const ST_LENGTHS = [['none', 'None'], ['one', 'One line'], ['para', 'A paragraph'], ['bullets', '+ bullets']];
const StSeg = ({ label, value, options, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
    <span className="pg-lab">{label}</span>
    <div className="pg-seg">
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} {...(value === v ? { 'data-on': '' } : {})}>{l}</button>
      ))}
    </div>
  </div>
);

const StBar = ({ cfg, setCfg, paper, onPaper, viewport, onViewport, open, onToggle }) => (
  <div className="pg-bar">
    <div className="pg-bar-in">
      <div className="pg-bar-top">
        <span className="pg-eyebrow">{'thought on a card \u00b7 the stack'}</span>
        <span className="pg-title">A card behind a card</span>
        <button type="button" className="pg-collapse" onClick={onToggle} aria-expanded={open}>
          {open ? 'Hide controls' : 'Controls'}
        </button>
      </div>
      {open && (
        <React.Fragment>
          <div className="pg-say">
            <p>Closed, the thought is on the band of a second card tucked under the first. Open, that card comes forward and lands on top as an alternate face — the title still opens the link, the words have room, and the shelf makes space so nothing below is covered.</p>
            <p className="pg-cost"><b>Costs.</b> A card that carries words has a second edge, so the shelf&rsquo;s rhythm is uneven; and the wrapper this needs does not exist in <code>app/feed.jsx</code> today.</p>
          </div>
          <div className="pg-ctrls">
            <StSeg label="Thought length" value={cfg.length} options={ST_LENGTHS} onChange={(v) => setCfg({ ...cfg, length: v })} />
            <StSeg label="The band's paper" value={paper} options={Object.keys(ST_PAPERS).map(k => [k, ST_PAPERS[k].label])} onChange={onPaper} />
            <StSeg label="Viewport" value={viewport} options={[['auto', 'Auto'], ['mobile', 'Mobile']]} onChange={onViewport} />
          </div>
        </React.Fragment>
      )}
    </div>
  </div>
);

// ---- the app ----------------------------------------------------------------
const StApp = () => {
  const [cfg, setCfg] = React.useState({ length: 'para', preview: true, density: 'all', ...(stSaved.cfg || {}) });
  const [paper, setPaper] = React.useState(stSaved.paper || 'white');
  const [viewport, setViewport] = React.useState(stSaved.viewport || 'auto');
  const [barOpen, setBarOpen] = React.useState(true);
  const [winW, setWinW] = React.useState(window.innerWidth);
  const [tab, setTab] = React.useState('active');
  const [openId, setOpenId] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [readIds, setReadIds] = React.useState([]);
  const [goneIds, setGoneIds] = React.useState([]);
  const user = window.CircSeed.DEFAULT_USER;
  const openRef = React.useRef(null);

  React.useEffect(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem(ST_KEY, JSON.stringify({ cfg, paper, viewport })); } catch (e) {}
  }, [cfg, paper, viewport]);

  const isApp = viewport === 'mobile' || winW < 1024;
  React.useEffect(() => {
    document.documentElement.setAttribute('data-circ-posture', isApp ? 'mobile' : 'desktop');
  }, [isApp]);

  const close = React.useCallback(() => setOpenId(null), []);
  React.useEffect(() => { setOpenId(null); }, [cfg.length]);
  window.t11UseEsc(!!openId, close);
  window.t11UseOutside(!!openId, openRef, close);

  const shelf = React.useMemo(() => window.PGT11Data.t11Shelf(cfg), [cfg.length, cfg.preview, cfg.density]);
  const items = shelf
    .filter(i => !goneIds.includes(i.id))
    .map(i => (readIds.includes(i.id) ? { ...i, read: true } : i));

  const ctx = {
    user,
    onMarkRead: (item) => { setReadIds(v => [...v, item.id]); setOpenId(null); },
    onDelete: (item) => setConfirm(item),
    openRecord: () => {},
  };

  const list = items.filter(i => (tab === 'read' ? i.read : !i.read));

  const row = (item) => {
    const card = <window.D9Card item={item} tab={item.read ? 'read' : 'active'} user={user} ctx={ctx} st={{}} />;
    if (!item.thought) return card;
    if (openId === item.id) {
      return (
        <div ref={openRef} style={{ display: 'flex', flexDirection: 'column' }}>
          <StEdge />
          <StAlt item={item} user={user} ctx={ctx} paper={paper} onClose={close} />
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <StFront>{card}</StFront>
        <StBand item={item} paper={paper} onOpen={() => setOpenId(item.id)} />
      </div>
    );
  };

  const app = (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: isApp ? '100%' : 'var(--circ-vh)', background: 'var(--color-canvas)' }}>
      <window.TopBar isMobile={false} space={{ name: 'Backend Pod' }} showMembers={false} />
      <window.Tabs active={tab} onChange={setTab} />
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
          padding: isApp ? '16px 16px 96px' : '28px 24px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {list.length === 0
            ? <window.EmptyState tab={tab} onStartCircle={() => {}} />
            : list.map(item => (
              <div key={item.id} style={{ position: 'relative', zIndex: openId === item.id ? 30 : 1 }}>{row(item)}</div>
            ))}
        </div>
      </main>
      {confirm && (
        <window.ConfirmDialog kind="delete"
          onConfirm={() => { setGoneIds(v => [...v, confirm.id]); setConfirm(null); }}
          onCancel={() => setConfirm(null)} />
      )}
    </div>
  );

  return (
    <React.Fragment>
      <StBar cfg={cfg} setCfg={setCfg} paper={paper} onPaper={setPaper}
        viewport={viewport} onViewport={setViewport} open={barOpen} onToggle={() => setBarOpen(v => !v)} />
      {viewport === 'mobile'
        ? <div className="circ-stage"><div className="circ-phone"><div className="circ-phone-clip">
            <div className="circ-phone-screen">{app}</div>
          </div></div></div>
        : app}
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<StApp />);
