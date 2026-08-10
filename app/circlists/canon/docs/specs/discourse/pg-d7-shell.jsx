// ============================================================================
// Discourse v7 — the rig.
// ----------------------------------------------------------------------------
// Ten complete versions of the app, not ten fragments. Each version IS the app,
// seeded and working, carrying one direction. The rig owns only the chrome that
// steers the exploration; inside it, the app is the app — real shell, real top
// bar, real tabs, real cards, the real Swell, the real add flow.
//
// NAVIGATION IS THE APP'S OWN. The direction list stands exactly where the
// circle rail stands, at the app's own breakpoint (main.jsx: winW < 1024):
//   ≥ 1024 web    — permanently docked <aside>. No toggle, because the app
//                   renders none and TopBar draws no circles-menu button.
//   < 1024 web    — behind the top bar's circles-menu button, in the app's OWN
//                   MobileDrawer (app/shell.jsx), mounted, never re-implemented.
//   app posture   — the Home destination, reached from the bottom bar's Home
//                   slot with the app's own push. Picking a direction enters it
//                   the way picking a circle does.
// The list carries NAMES ONLY. No claims, no costs, no levers. Theory lives in
// the docs, never in the reviewer's path.
//
// THE DRIVER is a four-beat strip pinned under the app column — attach · land ·
// respond · continue, the four ratified layers. One tap puts the app in that
// state. It is playground chrome standing in for nothing in the app, so it
// collapses on every viewport (PLAYGROUND.md non-negotiable 4). Prev/next rides
// the same strip, so a phone review is thumb-only and never returns to the list.
//
// State is per direction and persisted to sessionStorage under pg_d7_v1, so the
// rig behaves like an app: switching away and back is not a loss.
// ============================================================================

const { useState: d7S, useEffect: d7E, useMemo: d7M, useRef: d7R, useCallback: d7C } = React;

const D7 = window.PGD7_DATA;
const {
  AppShell, AppShellNative, TopBar, Tabs, MobileDrawer,
  FeedCard, FeedLoading, EmptyState, FAB, ConfirmDialog,
  SwellReactionFlow, SwellDoor, Icon, Avatar, Button, Field,
  PGD7Sheet, PGD7AddFlow, pgd7Extract, pgd7Narrow,
} = window;

// main.jsx's own breakpoint. Never invent one; never pick a value that disables
// a branch.
const D7_BREAK = 1024;
const D7_KEY = 'pg_d7_v1';

// The canonical order of the ten. A module registers itself; this list decides
// where it sits and what the rail shows when a module is missing. Order is the
// FINAL-TEN order, chosen so consecutive versions feel like different products.
const D7_ORDER = [
  'question', 'depths', 'countercard', 'seal', 'pulled-line',
  'sounding', 'seats', 'dispatch', 'palimpsest', 'stream',
];

const D7_BEATS = [
  ['attach', 'Attach'],
  ['land', 'Land'],
  ['respond', 'Respond'],
  ['continue', 'Continue'],
];

// ---- Persistence (sessionStorage) ------------------------------------------
const d7Load = () => { try { return JSON.parse(sessionStorage.getItem(D7_KEY)) || {}; } catch (e) { return {}; } };
const d7Save = (v) => { try { sessionStorage.setItem(D7_KEY, JSON.stringify(v)); } catch (e) {} };

const D7_BLANK_LOCAL = { read: {}, reactions: {}, thoughts: {}, responses: {}, added: [], deleted: [] };

// ============================================================================
// The registry. A direction module calls PGD7.register(spec) at load; the rig
// boots once every module has run. See pg-d7-CONTRACT.md — that document is the
// interface, this is only its implementation.
// ============================================================================
const PGD7_SPECS = {};
const PGD7 = {
  ORDER: D7_ORDER,
  specs: PGD7_SPECS,
  data: D7,
  Sheet: PGD7Sheet,
  register(spec) {
    if (!spec || !spec.id) { console.warn('[pgd7] register() needs an id'); return; }
    if (D7_ORDER.indexOf(spec.id) < 0) console.warn('[pgd7] unknown direction id:', spec.id);
    PGD7_SPECS[spec.id] = spec;
  },
  list() { return D7_ORDER.map((id) => PGD7_SPECS[id]).filter(Boolean); },
};
window.PGD7 = PGD7;

// ============================================================================
// The card. The shipped FeedCard is mounted UNCHANGED whenever the direction
// puts nothing inside the card's border. When it does, content has to sit
// inside that border and wrapping the real card cannot do it — so this is a
// copy of FeedCard's body from app/feed.jsx with four slots cut into it.
// PLAYGROUND.md allows the copy for exactly this reason; it carries a pointer
// to its source and must never be "improved". Keep it in step with feed.jsx.
//
// The four slots, and where each one actually sits:
//   above-title          above the source line — the top of the card
//   description          under the title, INSIDE the left text column (beside
//                        the thumbnail), where an item's description would go
//   title-attribution    full card width, below the title+thumbnail row and
//                        above the attribution footer
//   below-attribution    full card width, below the attribution footer
// ============================================================================
const D7_TINTS = [
  ['#3a3a38', '#5a5a56'], ['#33413f', '#54655f'], ['#403830', '#645749'],
  ['#343a4a', '#565f77'], ['#42323c', '#66505d'],
];
const d7Hash = (s) => { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const d7Tint = (k) => { const g = D7_TINTS[d7Hash(k) % D7_TINTS.length]; return 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')'; };
const d7HostOf = (url) => window.pgd7Host(url);
const d7DeriveTitle = (url) => window.pgd7TitleFromUrl(url);

const PGD7Card = ({ item, tab, ctx, face, Slot, onOpen, onMarkRead, onDelete }) => {
  const [favBroken, setFavBroken] = d7S(false);
  const [imgBroken, setImgBroken] = d7S(false);
  const slot = (where) => (Slot ? <Slot ctx={ctx} item={item} tab={tab} where={where} /> : null);
  const at = (where) => (face && face.slot === where ? slot(where) : null);

  const attribution = item.attribution || ('Added by ' + D7.nameOf(item.by));
  const whoName = attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');
  const isYou = /^you$/i.test(whoName);
  const avatarName = isYou ? D7.me.realName : whoName;

  const host = d7HostOf(item.url);
  const source = item.source || host;
  const demote = !!(face && face.demoteTitle);
  const title = item.title || d7DeriveTitle(item.url);
  const prettyUrl = item.url.replace(/^https?:\/\//, '');
  const showImage = item.hasImage !== false;
  const faviconOk = item.faviconExists !== false && !favBroken;
  const faviconUrl = (window.CircFavicons && window.CircFavicons(host))
    || ('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64');
  const when = window.circWhen ? window.circWhen(item.at) : null;

  const open = () => onOpen && onOpen(item);
  const linkProps = { href: item.url, target: '_blank', rel: 'noopener noreferrer', onClick: open };

  // Demoted title: the item's own headline steps down to a source line so the
  // direction's authored text can outrank it. Only The Question asks for this.
  const titleNode = title
    ? <a {...linkProps} className="circ-cardtitle" style={demote ? {
        fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.35,
        color: 'var(--color-fg-2)', textDecoration: 'none', textWrap: 'pretty',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      } : {
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3,
        letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{title}</a>
    : <a {...linkProps} className="circ-cardtitle circ-cardurl" style={{
        fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, lineHeight: 1.45,
        color: 'var(--color-fg-1)', textDecoration: 'none', wordBreak: 'break-all',
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{prettyUrl}</a>;

  return (
    <article className="circ-card" style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
      display: 'flex', flexDirection: 'column',
    }}>
      {at('above-title')}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {faviconOk && (
              <span style={{ width: 15, height: 15, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-2)', display: 'inline-flex' }}>
                <img src={faviconUrl} alt="" onError={() => setFavBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: item.source ? 600 : 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>{source}</span>
          </div>
          {titleNode}
          {at('description')}
        </div>
        {showImage && (
          <a {...linkProps} tabIndex={-1} aria-hidden="true" className="circ-thumblink" style={{ flexShrink: 0, display: 'block', width: 60, height: 60, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-2)' }}>
            {item.image && !imgBroken
              ? <img src={item.image} alt="" onError={() => setImgBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <span style={{ display: 'block', width: '100%', height: '100%', background: d7Tint(source) }} />}
          </a>
        )}
      </div>

      {at('title-attribution')}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <Avatar name={avatarName} size={28} accent={isYou} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 9 }}>
          <span style={{ minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 14, lineHeight: 1.3, color: 'var(--color-fg-1)', letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attribution}</span>
          {when && <span style={{ flexShrink: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, lineHeight: 1.3, color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>{when}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: -13 }}>
          {tab === 'read'
            ? <SwellDoor item={item} />
            : (
              <button className="circ-cardaction circ-cardaction-icon" onClick={() => onMarkRead(item)} aria-label="Mark as read" title="Mark as read">
                <Icon name="check" size={18} />
              </button>
            )}
          <button className="circ-cardaction circ-cardaction-icon" onClick={() => onDelete(item)} aria-label="Delete this link" title="Delete">
            <Icon name="trash" size={17} />
          </button>
        </div>
      </div>

      {at('below-attribution')}
    </article>
  );
};

// ============================================================================
// The rail body — the flat list of ten names. ONE body, rendered in three
// places and never forked: the docked aside, the app's MobileDrawer, and the
// app posture's Home destination.
// ============================================================================
const Pg7Rail = ({ dirId, onPick, posture, onPosture }) => {
  const specs = PGD7.list();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--color-fg-3)', padding: '4px 14px 8px',
      }}>Directions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {D7_ORDER.map((id, i) => {
          const spec = PGD7_SPECS[id];
          const on = id === dirId;
          const missing = !spec;
          return (
            <button key={id} onClick={() => !missing && onPick(id)} disabled={missing} style={{
              position: 'relative', textAlign: 'left', cursor: missing ? 'default' : 'pointer',
              background: on ? 'var(--color-surface)' : 'transparent', border: 0,
              padding: '11px 12px 11px 14px', borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-sans)', fontWeight: on ? 600 : 500, fontSize: 14,
              color: missing ? 'var(--color-fg-3)' : 'var(--color-fg-1)', minHeight: 44,
              boxShadow: on ? 'var(--shadow-raised)' : 'none',
              opacity: missing ? 0.4 : 1,
              display: 'flex', alignItems: 'center', gap: 10,
            }} className={missing ? undefined : 'pg7-railitem'}>
              {on && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 3, background: 'var(--color-accent)' }} />}
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11, color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {spec ? spec.name : '—'}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, minHeight: 12 }} />
      {/* Viewport — the app's own Config aid, copied: Auto follows the window
          (main.jsx's < 1024); Mobile forces the app posture and frames it in the
          app's own phone frame. Auto never frames anything. */}
      <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 10, marginTop: 10 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'var(--color-fg-3)', padding: '0 14px 6px',
        }}>Viewport</div>
        <div style={{ display: 'flex', gap: 2, margin: '0 10px', background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', padding: 2 }}>
          {[['auto', 'Auto'], ['mobile', 'Mobile']].map(([v, l]) => (
            <button key={v} onClick={() => onPosture(v)} style={{
              flex: 1, background: posture === v ? 'var(--color-surface)' : 'transparent', border: 0,
              boxShadow: posture === v ? 'var(--shadow-raised)' : 'none', borderRadius: 6,
              padding: '7px 9px', cursor: 'pointer', minHeight: 36,
              fontFamily: 'var(--font-sans)', fontWeight: posture === v ? 600 : 500, fontSize: 12.5,
              color: posture === v ? 'var(--color-fg-1)' : 'var(--color-fg-2)',
            }}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// The driver strip. Prev/next and the four beats, in the thumb zone, always to
// hand, unmistakably not product — and collapsible, because it stands in for
// nothing in the app.
// ============================================================================
const Pg7Strip = ({ spec, index, total, open, onOpen, onPrev, onNext, onBeat, beat }) => (
  <div className="pg7-strip">
    <div className="pg7-striprow">
      <button className="pg7-nav" onClick={onPrev} aria-label="Previous direction">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button className="pg7-name" onClick={() => onOpen(!open)} aria-expanded={open}>
        <span className="pg7-num">{String(index + 1).padStart(2, '0')}/{total}</span>
        <span className="pg7-title">{spec ? spec.name : 'No direction loaded'}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={{ transform: open ? 'none' : 'rotate(180deg)', transition: 'transform var(--duration-base)' }}><polyline points="6 15 12 9 18 15" /></svg>
      </button>
      <button className="pg7-nav" onClick={onNext} aria-label="Next direction">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>
    {open && (
      <div className="pg7-beats">
        {D7_BEATS.map(([k, l]) => (
          <button key={k} className={'pg7-beat' + (beat === k ? ' pg7-beat-on' : '')} onClick={() => onBeat(k)}>{l}</button>
        ))}
      </div>
    )}
  </div>
);

// ============================================================================
// The app surface — the real app, one direction plugged into it.
// ============================================================================
const Pg7Surface = ({
  spec, ctx, local, setLocal, dirState, setDirState,
  isMobile, framed, appPosture, home, railBody, onGoHome,
  railOpen, onToggleRail, jump, onJumpDone,
}) => {
  const [tab, setTab] = d7S('active');
  const [route, setRoute] = d7S('feed');          // feed | continue | aside
  const [overlay, setOverlay] = d7S(null);        // { kind, id }
  const [addOpen, setAddOpen] = d7S(false);
  const [flow, setFlow] = d7S(null);              // the shipped SwellReactionFlow
  const [confirm, setConfirm] = d7S(null);
  const [winW, setWinW] = d7S(window.innerWidth);
  const committed = d7R(null);

  d7E(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const wide = !framed && winW >= D7_BREAK;
  const items = ctx.items;
  const byId = (id) => items.find((i) => i.id === id) || null;
  const activeItems = items.filter((i) => !i.read);
  const readItems = items.filter((i) => i.read);

  // ---- mutations -----------------------------------------------------------
  const markRead = (item, reaction) => setLocal((L) => ({
    ...L,
    read: { ...L.read, [item.id]: true },
    reactions: reaction ? { ...L.reactions, [item.id]: { ...reaction, name: 'You' } } : L.reactions,
  }));
  const setUnread = (item) => setLocal((L) => ({ ...L, read: { ...L.read, [item.id]: false } }));
  const del = (item) => setLocal((L) => ({ ...L, deleted: [...L.deleted, item.id] }));
  const setThought = (id, thought) => setLocal((L) => ({ ...L, thoughts: { ...L.thoughts, [id]: thought } }));
  const respond = (id, r) => setLocal((L) => ({
    ...L,
    responses: { ...L.responses, [id]: [...(L.responses[id] || []), { id: 'r' + Date.now(), by: 'you', at: Date.now(), register: 'gist', ...r }] },
  }));
  const addItem = (item, thought) => {
    const staged = { ...item, read: false, reactions: [], responses: [], pulls: [], prose: [], thought: thought ? { by: 'you', at: Date.now(), register: 'gist', ...thought } : null };
    setLocal((L) => ({ ...L, added: [staged, ...L.added] }));
    // Extraction never blocks the add: the card lands PENDING and settles in
    // place, exactly as main.jsx schedules it.
    const ms = 1400 + Math.round(Math.random() * 900);
    setTimeout(() => setLocal((L) => ({
      ...L,
      added: L.added.map((i) => (i.id === item.id ? { ...i, ...pgd7Extract(i.url), pending: false } : i)),
    })), ms);
    setTab('active');
  };

  // ---- the beat API handed to a direction ---------------------------------
  const api = {
    ...ctx,
    tab, setTab, route, setRoute,
    openAdd: () => { setRoute('feed'); setAddOpen(true); },
    openSwell: (item) => { const t = item || activeItems[0]; if (t) { setRoute('feed'); setTab('active'); setFlow(t); } },
    openLanding: (item) => { const t = item || readItems[0]; if (t) { setRoute('feed'); setOverlay({ kind: 'landing', id: t.id }); } },
    openRespond: (item) => { const t = item || readItems[0]; if (t) { setRoute('feed'); setTab('read'); setOverlay({ kind: 'respond', id: t.id }); } },
    openContinue: () => { setOverlay(null); setRoute('continue'); },
    openAside: () => { setOverlay(null); setRoute(wide ? 'feed' : 'aside'); },
    closeOverlay: () => setOverlay(null),
    firstUnread: () => activeItems[0] || null,
    firstRead: () => readItems[0] || null,
    itemById: byId,
    activeItems, readItems,
  };

  // ---- the driver ----------------------------------------------------------
  d7E(() => {
    if (!jump) return;
    const run = (spec && spec.beats && spec.beats[jump.what]) || null;
    if (run) run(api);
    else if (jump.what === 'attach') api.openAdd();
    else if (jump.what === 'land') api.openSwell(null);
    else if (jump.what === 'respond') api.openRespond(null);
    else if (jump.what === 'continue') {
      if (spec && spec.Aside) api.openAside();
      else if (spec && spec.Continue) api.openContinue();
      else { setRoute('feed'); setTab('read'); }
    }
    onJumpDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump]);

  // ---- the Swell, mounted, with the direction owning what follows ---------
  const commitReaction = (item, rx) => {
    committed.current = rx;
    markRead(item, rx);
    // The landing surface takes the sheet's place at commit: unmounting the
    // shipped flow rather than letting its reveal play IS the difference
    // between "merged with the reaction" and "after the reaction".
    if (spec && spec.Landing && spec.landingMerged !== false) {
      setFlow(null);
      setOverlay({ kind: 'landing', id: item.id, glyph: rx && rx.glyph });
    }
  };
  const closeFlow = (item) => {
    const rx = committed.current; committed.current = null;
    setFlow(null);
    if (rx && spec && spec.Landing && spec.landingMerged === false) setOverlay({ kind: 'landing', id: item.id, glyph: rx.glyph });
    else if (rx) setTab('read');
  };

  // ---- the feed ------------------------------------------------------------
  const face = (spec && spec.face) || { slot: 'none' };
  const Slot = (spec && spec.Card) || null;
  const list = (() => {
    const base = tab === 'active' ? activeItems : readItems;
    return spec && spec.order ? spec.order(base, api) : base;
  })();

  const renderCard = (item) => {
    const common = {
      item, tab, onOpen: () => {}, onMarkRead: (it) => setFlow(it),
      onDelete: (it) => setConfirm({ kind: 'delete', item: it }),
    };
    // Nothing of the direction's goes inside the border → mount the shipped card.
    if (item.pending || (!Slot && !face.demoteTitle)) {
      return <FeedCard {...common} user={{ firstName: 'Sam', lastName: 'Rivera', name: 'You', email: D7.me.email }} showTime />;
    }
    // Every surface a direction registers is handed the SAME ctx — the one with
    // navigation and the derived lists on it, not the bare root object.
    return <PGD7Card {...common} ctx={api} face={face} Slot={Slot} />;
  };

  const feed = (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{
        maxWidth: 'var(--max-feed-width)', margin: '0 auto',
        padding: isMobile ? '16px 16px 28px' : '28px 24px 40px',
        '--circ-feed-pad-top': isMobile ? '16px' : '28px',
        width: '100%', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {list.length === 0
          ? <EmptyState tab={tab} onStartCircle={() => {}} />
          : list.map((item) => <React.Fragment key={item.id}>{renderCard(item)}</React.Fragment>)}
      </div>
    </main>
  );

  const Banner = spec && spec.Banner;
  const Continue = spec && spec.Continue;
  const Aside = spec && spec.Aside;

  const page = route === 'continue' && Continue
    ? <main style={{ flex: 1, width: '100%' }}><Continue ctx={api} close={() => setRoute('feed')} /></main>
    : route === 'aside' && Aside
      ? <main style={{ flex: 1, width: '100%' }}><Aside ctx={api} close={() => setRoute('feed')} /></main>
      : (
        <React.Fragment>
          {Banner && <Banner ctx={api} />}
          <Tabs active={tab} onChange={setTab} />
          {feed}
        </React.Fragment>
      );

  const subView = route === 'continue'
    ? { title: (spec && spec.continueTitle) || 'Continue', onBack: () => setRoute('feed') }
    : route === 'aside'
      ? { title: (spec && spec.asideTitle) || 'The stream', onBack: () => setRoute('feed') }
      : null;

  const shell = appPosture ? (
    <AppShellNative
      user={{ firstName: 'Sam', lastName: 'Rivera', name: 'You', email: D7.me.email }}
      space={D7.circle} spaces={[]} currentId={D7.circle.id} isHome={home}
      showMembers={false} canAdd onAdd={() => setAddOpen(true)}
      onHome={onGoHome} onMembers={() => {}} subView={subView}>
      {home
        ? <div style={{ flex: 1, background: 'var(--color-page)', padding: '14px 10px 28px' }}>{railBody}</div>
        : page}
    </AppShellNative>
  ) : (
    <div style={{ minHeight: 'var(--circ-vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
      <TopBar isMobile={isMobile} space={D7.circle} showMembers={false}
        onMenu={onToggleRail} menuOpen={railOpen} subView={subView} />
      {page}
    </div>
  );

  const ovItem = overlay && overlay.id ? byId(overlay.id) : null;
  const Landing = spec && spec.Landing;
  const Respond = spec && spec.Respond;

  const overlays = (
    <React.Fragment>
      {flow && (
        <SwellReactionFlow key={flow.id} item={flow}
          swellOpts={{ centerDot: true, breath: true, snap: true }}
          onMarkRead={(it, rx) => commitReaction(flow, rx)}
          onClose={() => closeFlow(flow)} />
      )}
      {overlay && overlay.kind === 'landing' && ovItem && Landing && (
        <PGD7Sheet label="How it landed" onClose={() => setOverlay(null)}>
          {({ close }) => <Landing ctx={api} item={ovItem} glyph={overlay.glyph} close={close} />}
        </PGD7Sheet>
      )}
      {overlay && overlay.kind === 'respond' && ovItem && Respond && (
        <PGD7Sheet label="Respond" onClose={() => setOverlay(null)}>
          {({ close }) => <Respond ctx={api} item={ovItem} close={close} />}
        </PGD7Sheet>
      )}
      <PGD7AddFlow ctx={api} isMobile={isMobile} Compose={spec && spec.Compose}
        open={addOpen} onClose={() => setAddOpen(false)} onAdd={addItem} />
      {confirm && <ConfirmDialog kind={confirm.kind}
        onConfirm={() => { del(confirm.item); setConfirm(null); }}
        onCancel={() => setConfirm(null)} />}
    </React.Fragment>
  );

  // The FAB is the web postures' add affordance; the app posture has the docked
  // Add in its bottom bar and must not carry both.
  const fab = !appPosture && route === 'feed' && (
    <FAB onClick={() => setAddOpen(true)} expanded={addOpen} isMobile={isMobile} />
  );

  if (framed) {
    return (
      <div className="pg7-body">
        <div className="circ-stage">
          <div className="circ-phone">
            <div className="circ-phone-clip">
              <div className="circ-phone-screen">{shell}</div>
              {overlays}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pg7-body">
      {/* The transform lives on this wrapper, so position:fixed sheets and the
          FAB pin to the app column and not to the page. GOTCHA #5. */}
      <div className="pgd-surface">
        <div className="pgd-screen">{shell}</div>
        {fab}
        {overlays}
      </div>
      {wide && Aside && (
        <aside className="pg7-aside"><Aside ctx={api} close={() => {}} docked /></aside>
      )}
    </div>
  );
};

// ============================================================================
// Root.
// ============================================================================
const Pg7App = () => {
  const saved = d7Load();
  const specs = PGD7.list();
  const first = (specs[0] && specs[0].id) || D7_ORDER[0];
  const [dirId, setDirId] = d7S(saved.dirId && PGD7_SPECS[saved.dirId] ? saved.dirId : first);
  const [posture, setPosture] = d7S(saved.posture || 'auto');
  const [byDir, setByDir] = d7S(saved.byDir || {});
  const [stripOpen, setStripOpen] = d7S(saved.stripOpen !== false);
  const [winW, setWinW] = d7S(window.innerWidth);
  const [railOpen, setRailOpen] = d7S(false);
  const [home, setHome] = d7S(false);
  const [jump, setJump] = d7S(null);
  const [beat, setBeat] = d7S(null);

  d7E(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  d7E(() => { d7Save({ dirId, posture, byDir, stripOpen }); }, [dirId, posture, byDir, stripOpen]);

  const appPosture = posture === 'mobile';
  const isMobile = appPosture ? true : winW < D7_BREAK;
  const docked = !appPosture && !isMobile;
  const spec = PGD7_SPECS[dirId] || null;
  const index = Math.max(0, D7_ORDER.indexOf(dirId));

  const slot = byDir[dirId] || {};
  const local = { ...D7_BLANK_LOCAL, ...(slot.local || {}) };
  const dirState = slot.state || (spec && spec.initialState) || {};

  // Writers read the CURRENT slot out of the updater, never the render's copy —
  // two writes in one tick (a reaction committing while an add settles) would
  // otherwise clobber each other.
  const put = (patch) => setByDir((m) => ({ ...m, [dirId]: { ...(m[dirId] || {}), ...patch } }));
  const setLocal = (fn) => setByDir((m) => {
    const cur = { ...D7_BLANK_LOCAL, ...((m[dirId] || {}).local || {}) };
    return { ...m, [dirId]: { ...(m[dirId] || {}), local: typeof fn === 'function' ? fn(cur) : fn } };
  });
  const setDirState = (patch) => setByDir((m) => {
    const cur = (m[dirId] || {}).state || (spec && spec.initialState) || {};
    return { ...m, [dirId]: { ...(m[dirId] || {}), state: { ...cur, ...(typeof patch === 'function' ? patch(cur) : patch) } } };
  });

  // ---- the live item list --------------------------------------------------
  const items = d7M(() => {
    const merged = [...local.added, ...D7.items]
      .filter((i) => local.deleted.indexOf(i.id) < 0)
      .map((i) => {
        const readOv = local.read[i.id];
        const rx = local.reactions[i.id];
        const th = local.thoughts[i.id];
        const rs = local.responses[i.id];
        return {
          ...i,
          read: readOv != null ? readOv : !!i.read,
          reactions: rx ? [...(i.reactions || []), rx] : (i.reactions || []),
          thought: th !== undefined ? th : (i.thought || null),
          responses: rs ? [...(i.responses || []), ...rs] : (i.responses || []),
        };
      });
    return merged;
  }, [local]);

  const ctx = {
    data: D7, circle: D7.circle, members: D7.members, me: D7.me, others: D7.others,
    nameOf: D7.nameOf, memberById: D7.memberById, REGISTERS: D7.REGISTERS, GLYPHS: D7.GLYPHS,
    items, isMobile, appPosture, narrow: isMobile,
    state: dirState, setState: setDirState,
    beat,
    actions: {
      markRead: (item, reaction) => setLocal((L) => ({ ...L, read: { ...L.read, [item.id]: true }, reactions: reaction ? { ...L.reactions, [item.id]: { ...reaction, name: 'You' } } : L.reactions })),
      setUnread: (item) => setLocal((L) => ({ ...L, read: { ...L.read, [item.id]: false } })),
      setThought: (id, thought) => setLocal((L) => ({ ...L, thoughts: { ...L.thoughts, [id]: thought } })),
      respond: (id, r) => setLocal((L) => ({ ...L, responses: { ...L.responses, [id]: [...(L.responses[id] || []), { id: 'r' + Date.now() + Math.random().toString(36).slice(2, 5), by: 'you', at: Date.now(), register: 'gist', ...r }] } })),
      addItem: (partial) => setLocal((L) => ({ ...L, added: [{ id: 'x' + Date.now(), read: false, reactions: [], responses: [], pulls: [], prose: [], at: Date.now(), attribution: 'Added by you', by: 'you', ...partial }, ...L.added] })),
      del: (item) => setLocal((L) => ({ ...L, deleted: [...L.deleted, item.id] })),
      reset: () => put({ local: { ...D7_BLANK_LOCAL }, state: (spec && spec.initialState) || {} }),
    },
  };

  const pick = (id) => { setDirId(id); setHome(false); setBeat(null); if (!docked) setRailOpen(false); };
  const step = (d) => {
    const loaded = D7_ORDER.filter((id) => PGD7_SPECS[id]);
    if (!loaded.length) return;
    const i = loaded.indexOf(dirId);
    pick(loaded[(i + d + loaded.length) % loaded.length]);
  };
  const fire = (what) => {
    setBeat(what);
    setJump({ what, at: Date.now() });
    setHome(false);
    // Narrow viewport: the chrome gets out of the way as the driver fires, so
    // the app is actually visible when it lands in that state.
    if (!docked) setRailOpen(false);
  };

  const railBody = <Pg7Rail dirId={dirId} onPick={pick} posture={posture} onPosture={setPosture} />;

  return (
    <div className="pg-page">
      {docked && <aside className="pg-rail">{railBody}</aside>}
      <div className="pg7-col">
        <Pg7Surface
          key={dirId}
          spec={spec} ctx={ctx} local={local} setLocal={setLocal}
          dirState={dirState} setDirState={setDirState}
          isMobile={isMobile} framed={appPosture} appPosture={appPosture}
          home={appPosture && home} railBody={railBody} onGoHome={() => setHome(true)}
          railOpen={railOpen} onToggleRail={() => setRailOpen((v) => !v)}
          jump={jump} onJumpDone={() => setJump(null)} />
        <Pg7Strip spec={spec} index={index} total={D7_ORDER.length}
          open={stripOpen} onOpen={setStripOpen}
          onPrev={() => step(-1)} onNext={() => step(1)}
          onBeat={fire} beat={beat} />
      </div>
      {!appPosture && isMobile && (
        <MobileDrawer open={railOpen} width={264} onClose={() => setRailOpen(false)}>{railBody}</MobileDrawer>
      )}
    </div>
  );
};

// Boot after every direction module has run. Babel-standalone executes the
// script tags in order in one pass; a task scheduled here therefore runs once
// the last pg-d7-dir-* module has registered — and still boots if one of them
// is missing, so the rig is usable while the set is being filled in.
PGD7.boot = () => {
  if (PGD7.booted) return;
  PGD7.booted = true;
  ReactDOM.createRoot(document.getElementById('root')).render(<Pg7App />);
};
setTimeout(() => PGD7.boot(), 0);

Object.assign(window, { PGD7Card, Pg7Rail, Pg7Strip, Pg7Surface, Pg7App });
