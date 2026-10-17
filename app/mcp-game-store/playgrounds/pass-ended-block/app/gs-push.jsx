// ============================================================================
// [Platform] — push notifications. A droppable module:
// main.jsx, gs-account.jsx, gs-discover.jsx and gs-history.jsx read every export off `window`,
// so deleting this file and its script tag removes the banner, the card and the browser dialog.
//
//   GsPushAsk     the turn-on banner, a strip under the top bar on Discover, Library and History.
//   GsNotifCard   the Notifications card on Account, after the Pass card.
//   GsPushHost    the simulated BROWSER permission dialog (the browser speaking, not the product:
//                 system font, light, not drawn from the design system), and the turn-on wait.
//   GsSwitch      the on/off control. The design system has none; square, like everything else.
//
// Mechanics follow Circlists as deployed (app/push.jsx there). Per device, so held in
// localStorage, not on the account:
//   perm     'default' | 'granted' | 'denied'   the browser's answer
//   channel  'ok' | 'ios-tab' | 'unsupported'   staged, never inferred
//   asked    the browser dialog has been raised; the banner never returns after that
//   snoozes / snoozeAt   the banner's ×: back after 3 days, then 7, then every 30
//   on       the all switch for this device; newGames and games[gid] are the others
// ============================================================================
const GS_PUSH_KEY = window.KIT_STATE_KEY || 'gs_push_v1';
const GS_PUSH_DAY = 86400000;
const GS_PUSH_SNOOZE = [3, 7, 30];
const GS_PUSH_HOST = 'platform.example';
// Placeholder defaults (not decided by the owner): the all switch is off until the browser allows it,
// New games is on, and a game's switch is on from its first play. Delve is off here as the player's own choice.
const GS_PUSH_DEFAULT = { perm: 'default', channel: 'ok', asked: false, snoozes: 0, snoozeAt: 0, on: false, newGames: true,
  games: { word: true, casebook: true, delve: false }, fail: false, prompt: null, turning: false, failed: false };
// Every game in the library gets a switch (2026-10-11, owner). A game the player hasn't played is off until they turn it on (placeholder).
const GS_PUSH_GAMES = GS_GAME_ORDER;
const gsPushWait = (n) => (n ? GS_PUSH_SNOOZE[Math.min(n, GS_PUSH_SNOOZE.length) - 1] : 0);
const gsPushLoad = () => { try { const s = JSON.parse(localStorage.getItem(GS_PUSH_KEY) || 'null'); return s || {}; } catch (e) { return {}; } };
const gsPushSave = (p) => { try { const { prompt, turning, failed, ...keep } = p; localStorage.setItem(GS_PUSH_KEY, JSON.stringify(keep)); } catch (e) {} };
// The banner, before sign-in is considered: undecided, deliverable, never raised, not waiting out a ×.
const gsPushAskDue = (p, now = Date.now()) => !!p && p.channel === 'ok' && p.perm === 'default' && !p.asked
  && (!p.snoozes || now >= p.snoozeAt + gsPushWait(p.snoozes) * GS_PUSH_DAY);

const gsPushRaise = (gs, from) => gs.setPush({ prompt: from, asked: true, failed: false });
const gsPushTurnOn = (gs) => gs.setPush({ turning: true, failed: false });

const GsSwitch = ({ on, onChange, labelledBy, disabled, busy }) => (
  <span className="gs-sw-slot">
    {busy && <GsInkSpin />}
    <button type="button" role="switch" className="gs-sw" aria-checked={!!on} aria-labelledby={labelledBy} disabled={disabled}
      aria-busy={busy || undefined} onClick={() => { if (!busy) onChange(!on); }}>
      <span className="gs-sw-track" aria-hidden="true"><span className="gs-sw-thumb" /></span>
    </button>
  </span>
);

// ---- The banner -------------------------------------------------------------------
const gsPushFocusPage = () => setTimeout(() => {
  const h = document.querySelector('.gs-main h1');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}, 0);
const GsPushAsk = () => {
  const gs = useGs();
  if (gs.view === 'out' || !gs.push || !gsPushAskDue(gs.push)) return null;
  const close = () => { gs.setPush({ snoozes: (gs.push.snoozes || 0) + 1, snoozeAt: Date.now() }); gsPushFocusPage(); };
  return (
    <div className="gs-pushask" role="region" aria-label="Notifications">
      <div className="gs-wrap gs-pushask-in">
        <p>Hear when a new game or edition is out, or your streak is about to end. Choose which games in Account.{' '}
          <button type="button" className="gs-inlink" onClick={() => gsPushRaise(gs, 'banner')}>Turn on notifications</button></p>
        <button type="button" className="gs-iconbtn gs-pushask-x" aria-label="Dismiss" onClick={close}><GsGlyph name="x" size={18} /></button>
      </div>
    </div>
  );
};

// ---- The card ---------------------------------------------------------------------
const GsNotifCard = () => {
  const gs = useGs(); const p = gs.push;
  const [open, setOpen] = React.useState(false);
  const opener = React.useRef(null);
  if (!p || p.channel === 'unsupported') return null;
  const statement = p.channel === 'ios-tab'
    ? 'To get notifications, add [Platform] to your Home Screen first. Tap Share, then Add to Home Screen.'
    : p.perm === 'denied' ? 'Allow notifications for [Platform] in your device settings.' : null;
  const card = { gap: 16, justifyItems: 'stretch', alignContent: 'start' };
  if (statement) return (
    <DS.Card style={card}>
      <h2 className="mcp-t-card">Notifications</h2>
      <p>{statement}</p>
    </DS.Card>
  );
  const allOn = p.perm === 'granted' && p.on;
  const flipAll = (v) => {
    if (!v) { gs.setPush({ on: false, failed: false }); return; }
    if (p.perm === 'default') gsPushRaise(gs, 'card'); else gsPushTurnOn(gs);
  };
  const off = !allOn || p.turning;
  const nOn = GS_PUSH_GAMES.filter((k) => (p.games || {})[k]).length;
  return (
    <React.Fragment>
    <DS.Card style={card}>
      <h2 className="mcp-t-card">Notifications</h2>
      <div className="gs-nt">
        <div className="gs-nt-row">
          <span id="nt-all" className="gs-strong gs-nt-master">Notifications on this device</span>
          <GsSwitch on={allOn} onChange={flipAll} labelledBy="nt-all" busy={p.turning} />
        </div>
        {p.failed && <GsXLine>Notifications didn’t turn on. Try again.</GsXLine>}
        <div className="gs-nt-row gs-nt-sep">
          <span className="gs-stack-xs"><span id="nt-new" className="gs-strong">New games</span><span className="gs-muted gs-nt-sub">When a new game is released.</span></span>
          <GsSwitch on={p.newGames} onChange={(v) => gs.setPush({ newGames: v })} labelledBy="nt-new" disabled={off} />
        </div>
        {off ? (
          // While notifications are off here the row is a statement: no count it can't back up, and why it can't be opened.
          <div className="gs-nt-row gs-nt-sep">
            <span className="gs-stack-xs"><span className="gs-strong">Games</span><span className="gs-muted gs-nt-sub">Turn on notifications on this device to choose games.</span></span>
          </div>
        ) : (
          <button type="button" className="gs-nt-row gs-nt-sep gs-nt-go" onClick={() => setOpen(true)} ref={opener}>
            <span className="gs-stack-xs"><span className="gs-strong">Games</span><span className="gs-muted gs-nt-sub">A new edition is out, or your streak is about to end.</span></span>
            <span className="gs-nt-count">{nOn} on<DS.Icon name="next" size={20} /></span>
          </button>
        )}
      </div>
    </DS.Card>
    <GsNotifGames open={open} onClose={() => { setOpen(false); setTimeout(() => opener.current && opener.current.focus({ preventScroll: true }), 0); }} />
    </React.Fragment>
  );
};

// ---- The games panel: every game's switch, searchable, so the card stays one row however big the library grows.
const GsNotifGames = ({ open, onClose }) => {
  const gs = useGs(); const p = gs.push || {};
  const [q, setQ] = React.useState('');
  const list = React.useRef(null);
  // The DS panel focuses its first field, which lit the search box on open (and raises a phone keyboard); start on the first switch instead.
  React.useEffect(() => {
    if (!open) return undefined;
    setQ('');
    const t = setTimeout(() => { const b = list.current && list.current.querySelector('[role=switch]'); if (b) b.focus({ preventScroll: true }); }, 60);
    return () => clearTimeout(t);
  }, [open]);
  const t = gsNorm(q);
  const ids = GS_PUSH_GAMES.filter((k) => !t || gsNorm(GS_GAMES[k].name).includes(t));
  return (
    <DS.Popup kind="panel" open={open} onClose={onClose} title="Games" actions={<DS.Button onClick={onClose}>Done</DS.Button>}>
      <div className="gs-nt-panel" style={{ minWidth: 0 }}>
        <p className="gs-muted gs-nt-sub">A new edition is out, or your streak is about to end.</p>
        <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
        {ids.length ? (
          <ul className="gs-nt-list" role="list" ref={list}>{ids.map((k) => (
            <li key={k} className="gs-nt-row">
              <span id={'nt-g-' + k}>{GS_GAMES[k].name}</span>
              <GsSwitch on={!!(p.games || {})[k]} onChange={(v) => gs.setPush({ games: { ...p.games, [k]: v } })} labelledBy={'nt-g-' + k} />
            </li>
          ))}</ul>
        ) : <p style={{ overflowWrap: 'anywhere' }}>No game matches “{q}”.</p>}
      </div>
    </DS.Popup>
  );
};

// ---- The browser's own dialog, and the turn-on wait ----------------------------------
const GsPushHost = () => {
  const gs = useGs(); const p = gs.push || {};
  const allow = React.useRef(null);
  const opener = React.useRef(null);
  React.useEffect(() => {
    if (!p.prompt) return undefined;
    opener.current = document.activeElement;
    const t = setTimeout(() => allow.current && allow.current.focus(), 40);
    const onKey = (e) => { if (e.key === 'Escape') answer(null); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [p.prompt]);
  React.useEffect(() => {
    if (!p.turning) return undefined;
    const t = setTimeout(() => gs.setPush(p.fail ? { turning: false, on: false, failed: true } : { turning: false, on: true }), GS_WORK_MS);
    return () => clearTimeout(t);
  }, [p.turning]);
  // Allow turns notifications on; Block is final from the site's side; closing it leaves the answer undecided.
  function answer(v) {
    const from = p.prompt;
    if (v === true) gs.setPush({ prompt: null, perm: 'granted', turning: true });
    else if (v === false) gs.setPush({ prompt: null, perm: 'denied', on: false });
    else gs.setPush({ prompt: null });
    const back = opener.current;
    if (from === 'card' && back && document.contains(back)) setTimeout(() => back.focus({ preventScroll: true }), 0);
    else if (from === 'banner') gsPushFocusPage();
  }
  if (!p.prompt) return null;
  return (
    <div className="gs-osperm" role="dialog" aria-modal="false" aria-label={GS_PUSH_HOST + ' wants to show notifications'}>
      <div className="gs-osperm-head">
        <span>{GS_PUSH_HOST} wants to</span>
        <button type="button" className="gs-osperm-x" aria-label="Close" onClick={() => answer(null)}>×</button>
      </div>
      <p className="gs-osperm-what"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" /></svg>Show notifications</p>
      <div className="gs-osperm-acts">
        <button type="button" onClick={() => answer(false)}>Block</button>
        <button type="button" ref={allow} className="is-main" onClick={() => answer(true)}>Allow</button>
      </div>
    </div>
  );
};

Object.assign(window, { GS_PUSH_DEFAULT, GS_PUSH_DAY, GS_PUSH_GAMES, gsPushWait, gsPushLoad, gsPushSave, gsPushAskDue, GsSwitch, GsPushAsk, GsNotifCard, GsPushHost });
