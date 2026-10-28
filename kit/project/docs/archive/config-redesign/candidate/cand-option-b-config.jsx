// ============================================================================
// Candidate option-b (config-redesign) — the Config pill and its modal
// (PROTOTYPE AID, not part of the product). Re-publishes window.ConfigLauncher
// and window.ConfigSeg over app/config.jsx. Nothing here is accepted.
//
// The modal is one panel in two parts:
//   Global   — always open: the kit's review settings beside the product's
//              whole-prototype rows (groups with scope 'global').
//   Features — one collapsible card per product group. A closed card's header
//              reads out its current values, so state is visible without opening.
//
// Products never write row markup. They publish window.ConfigExtra, a component
// that returns ConfigGroup elements built from ConfigRow / ConfigAction /
// ConfigNote. The shell renders ConfigExtra once per part; each ConfigGroup
// shows itself only in the part its scope belongs to.
//
// The launcher pill below is app/config.jsx's, unchanged: ConfigModal is
// reached there by closure, so the modal cannot be swapped without
// re-publishing the launcher that renders it.
// ============================================================================

// Top-level names in Babel scripts share one global scope with app/config.jsx,
// so every name here carries the CfgB prefix.
const CfgBSlot = React.createContext({ slot: 'feature', isOpen: () => true, toggle: () => {} });

// ---- Product-facing contract ------------------------------------------------

const CfgBSeg = ({ options, value, onChange, label }) => (
  <div className="cfgb-seg" role="group" aria-label={label}>
    {options.map((o) => (
      <button key={o.value} type="button" className="cfgb-seg-btn"
        aria-pressed={o.value === value} data-active={o.value === value ? '1' : undefined}
        onClick={() => onChange(o.value)}>{o.label}</button>
    ))}
  </div>
);

const CfgBInfo = ({ label, open, onToggle, controls }) => (
  <button type="button" className="cfgb-info" aria-expanded={open} aria-controls={controls}
    aria-label={`About ${label}`} title={`About ${label}`} onClick={onToggle}>i</button>
);

// Hints stay folded behind the info button: a row is one line until asked.
const CfgBRow = ({ label, value, onChange, options, hint }) => {
  const [hintOpen, setHintOpen] = React.useState(false);
  const hintId = React.useId();
  return (
    <div className="cfgb-row">
      <div className="cfgb-row-label">
        <span>{label}</span>
        {hint && <CfgBInfo label={label} open={hintOpen} controls={hintId} onToggle={() => setHintOpen((v) => !v)} />}
      </div>
      <CfgBSeg label={label} value={value} onChange={onChange} options={options} />
      {hint && hintOpen && <div id={hintId} className="cfgb-hint">{hint}</div>}
    </div>
  );
};

// A one-shot event. data-config-action is what the modal's click capture keys
// on: the modal closes first, then the click replays on a clear screen.
const CfgBAction = ({ label, onClick, hint }) => (
  <button type="button" className="cfgb-action" data-config-action="1" title={hint || undefined}
    onClick={() => { if (typeof onClick === 'function') onClick(); }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2" /></svg>
    {label}
  </button>
);

const CfgBNote = ({ children }) => <div className="cfgb-note">{children}</div>;

// Groups lift their actions to the foot, so flatten through fragments and
// conditionals to see every row and action the product passed.
const cfgbFlatten = (children) => React.Children.toArray(children).flatMap((c) =>
  (c && c.type === React.Fragment) ? cfgbFlatten(c.props.children) : [c]);

const cfgbSummary = (items) => {
  const parts = items.filter((c) => c.type === CfgBRow).map((c) => {
    const opt = (c.props.options || []).find((o) => o.value === c.props.value);
    return `${c.props.label}: ${opt ? opt.label : c.props.value}`;
  });
  if (parts.length) return parts.join(' · ');
  const note = items.find((c) => c.type === CfgBNote);
  return note ? note.props.children : '';
};

const CfgBActions = ({ actions }) => {
  const [open, setOpen] = React.useState(false);
  const notesId = React.useId();
  if (!actions.length) return null;
  const hinted = actions.filter((a) => a.props.hint);
  return (
    <div className="cfgb-actions">
      <div className="cfgb-actions-head">
        <span>Fire an event</span>
        {hinted.length > 0 && <CfgBInfo label="these events" open={open} controls={notesId} onToggle={() => setOpen((v) => !v)} />}
      </div>
      <div className="cfgb-actions-row">{actions.map((a, i) => <React.Fragment key={i}>{a}</React.Fragment>)}</div>
      {open && (
        <ul id={notesId} className="cfgb-hint cfgb-actions-notes">
          {hinted.map((a, i) => <li key={i}><b>{a.props.label}:</b> {a.props.hint}</li>)}
        </ul>
      )}
    </div>
  );
};

const CfgBGroup = ({ title, scope, children }) => {
  const ctx = React.useContext(CfgBSlot);
  const isGlobal = scope === 'global';
  if ((ctx.slot === 'global') !== isGlobal) return null;

  const items = cfgbFlatten(children);
  const actions = items.filter((c) => c.type === CfgBAction);
  const body = items.filter((c) => c.type !== CfgBAction);
  const content = (
    <React.Fragment>
      {body.map((c, i) => <React.Fragment key={i}>{c}</React.Fragment>)}
      <CfgBActions actions={actions} />
    </React.Fragment>
  );

  if (isGlobal) {
    return (
      <section className="cfgb-gsec">
        <h3 className="cfgb-gsec-title">{title}</h3>
        {content}
      </section>
    );
  }

  const open = ctx.isOpen(title);
  const panelId = 'cfgb-card-' + title.replace(/\W+/g, '-').toLowerCase();
  return (
    <section className="cfgb-card" data-open={open ? '1' : undefined}>
      <button type="button" className="cfgb-card-head" aria-expanded={open} aria-controls={panelId}
        onClick={() => ctx.toggle(title)}>
        <span className="cfgb-card-text">
          <span className="cfgb-card-title">{title}</span>
          <span className="cfgb-card-sum">{cfgbSummary(items)}</span>
        </span>
        <span className="cfgb-card-chev" aria-hidden="true"><Icon name="chevron-down" size={18} strokeWidth={2} /></span>
      </button>
      {open && <div id={panelId} className="cfgb-card-body">{content}</div>}
    </section>
  );
};

// ---- The launcher pill (app/config.jsx's, unchanged) -------------------------

const CfgBLauncher = ({ statesGroups, onGoState, onOpenStatesIndex,
                        onReset, layout, onLayoutChange, platform, onPlatformChange }) => {
  const [open, setOpen] = React.useState(false);
  const [statesOpen, setStatesOpen] = React.useState(false);
  const [qaOpen, setQaOpen] = React.useState(false);
  const [btnPos, setBtnPos] = React.useState(() => {
    try { const v = JSON.parse(localStorage.getItem('kit_launcher_pos') || 'null'); return v && Number.isFinite(v.x) && Number.isFinite(v.y) ? v : null; } catch (e) { return null; }
  });
  const dragRef = React.useRef({ dragging: false, moved: false, dx: 0, dy: 0, last: null });
  const wrapRef = React.useRef(null);
  const invokerRef = React.useRef(null);

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    const wrap = e.currentTarget.closest('.kit-config-wrap');
    const rect = wrap.getBoundingClientRect();
    const st = dragRef.current;
    st.dragging = true; st.moved = false;
    st.dx = e.clientX - rect.left; st.dy = e.clientY - rect.top;
    st.w = rect.width; st.h = rect.height; st.ox = e.clientX; st.oy = e.clientY;
    const move = (ev) => {
      if (!st.dragging) return;
      if (Math.hypot(ev.clientX - st.ox, ev.clientY - st.oy) > 4) st.moved = true;
      const pad = 8;
      const x = Math.max(pad, Math.min(ev.clientX - st.dx, window.innerWidth - st.w - pad));
      const y = Math.max(pad, Math.min(ev.clientY - st.dy, window.innerHeight - st.h - pad));
      st.last = { x, y };
      setBtnPos(st.last);
    };
    const up = () => {
      st.dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (st.moved && st.last) { try { localStorage.setItem('kit_launcher_pos', JSON.stringify(st.last)); } catch (e) {} }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  React.useEffect(() => {
    const clamp = () => setBtnPos(p => {
      if (!p) return p;
      const el = wrapRef.current;
      const w = el ? el.offsetWidth : 140, h = el ? el.offsetHeight : 40, pad = 8;
      const x = Math.max(pad, Math.min(p.x, window.innerWidth - w - pad));
      const y = Math.max(pad, Math.min(p.y, window.innerHeight - h - pad));
      return (x === p.x && y === p.y) ? p : { x, y };
    });
    clamp();
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, []);

  const wrapStyle = btnPos ? { left: btnPos.x, top: btnPos.y, right: 'auto', bottom: 'auto' } : undefined;
  const openAt = (setter) => { invokerRef.current = document.activeElement; setter(true); };
  const closeAt = (setter) => {
    setter(false);
    if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus();
  };
  const tapped = (fn) => { if (dragRef.current.moved) { dragRef.current.moved = false; return; } fn(); };
  const StatesPalette = window.StatesPalette;
  const hasStates = !!StatesPalette && !!statesGroups && statesGroups.length > 0;
  const QaPalette = window.QaPalette;
  const hasQa = hasStates && !!QaPalette;

  return (
    <div className="kit-config-wrap" ref={wrapRef} style={wrapStyle}>
      <div className="kit-launcher" style={{ cursor: 'grab', touchAction: 'none' }}>
        <button className="kit-launcher-half" onPointerDown={onPointerDown}
          onClick={() => tapped(() => openAt(setOpen))}
          aria-haspopup="dialog" aria-expanded={open} data-open={open ? '1' : undefined}
          aria-label="Config" title="Config — drag to move">
          <Icon name="settings" size={17} />
        </button>
        {hasStates && (
          <button className="kit-launcher-half" onPointerDown={onPointerDown}
            onClick={() => tapped(() => openAt(setStatesOpen))}
            aria-haspopup="dialog" aria-expanded={statesOpen} data-open={statesOpen ? '1' : undefined}
            aria-label="States" title="States — drag to move">
            <Icon name="list" size={17} />
          </button>
        )}
        {hasQa && (
          <button className="kit-launcher-half" onPointerDown={onPointerDown}
            onClick={() => tapped(() => openAt(setQaOpen))}
            aria-haspopup="dialog" aria-expanded={qaOpen} data-open={qaOpen ? '1' : undefined}
            aria-label="QA" title="QA — drag to move">
            <Icon name="check" size={17} />
          </button>
        )}
      </div>
      {hasQa && qaOpen && (
        <QaPalette statesGroups={statesGroups}
          onGo={(id) => { onGoState(id); closeAt(setQaOpen); }}
          onClose={() => closeAt(setQaOpen)} />
      )}
      {hasStates && statesOpen && (
        <StatesPalette groups={statesGroups}
          onGo={(id) => { onGoState(id); closeAt(setStatesOpen); }}
          onOpenIndex={() => { closeAt(setStatesOpen); onOpenStatesIndex(); }}
          onClose={() => closeAt(setStatesOpen)} />
      )}
      {open && (
        <CfgBModal
          onReset={onReset}
          layout={layout} onLayoutChange={onLayoutChange}
          platform={platform} onPlatformChange={onPlatformChange}
          onClose={() => closeAt(setOpen)}
        />
      )}
    </div>
  );
};

// ---- The modal ---------------------------------------------------------------

// Which feature cards are open survives closing the modal, per entry.
const cfgbOpenKey = () => (window.KIT_STATE_KEY || 'kit') + '_config_open';
const cfgbReadOpen = () => {
  try { const v = JSON.parse(localStorage.getItem(cfgbOpenKey()) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
};

const CfgBModal = ({ onReset, layout, onLayoutChange, platform, onPlatformChange, onClose }) => {
  const isApp = platform === 'app';
  const [shown, setShown] = React.useState(false);
  const [openCards, setOpenCards] = React.useState(cfgbReadOpen);

  React.useEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  React.useEffect(kitLockScroll, []);

  const toggle = (title) => setOpenCards((prev) => {
    const next = prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title];
    try { localStorage.setItem(cfgbOpenKey(), JSON.stringify(next)); } catch (e) {}
    return next;
  });
  const isOpen = (title) => openCards.includes(title);

  // KEEP: actions act on the app behind the modal, and some of those acts are
  // animated. Intercept the click, play the exit, replay the click on a clear
  // screen, then close — so no action handler has to close the modal itself.
  const onBodyClickCapture = (e) => {
    const btn = e.target.closest && e.target.closest('[data-config-action]');
    if (!btn || btn.dataset.replay === '1') return;
    e.preventDefault(); e.stopPropagation();
    setShown(false);
    setTimeout(() => { btn.dataset.replay = '1'; btn.click(); onClose(); }, 190);
  };

  const Extra = window.ConfigExtra;
  const extra = Extra ? React.createElement(Extra, { onClose }) : null;

  return (
    <div className="cfgb-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Config" className="cfgb-modal" data-shown={shown ? '1' : undefined}
        style={{ opacity: shown ? 1 : 0 }}>
        <div className="cfgb-head">
          <div>
            <div className="cfgb-title">Config</div>
            <div className="cfgb-subtitle">Prototype controls — not part of the product.</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="cfgb-close"><Icon name="x" size={20} strokeWidth={2} /></button>
        </div>

        <div className="cfgb-body" onClickCapture={onBodyClickCapture}>
          <div className="cfgb-part-label">Global <span>— the whole prototype</span></div>
          <div className="cfgb-global">
            <section className="cfgb-gsec">
              <h3 className="cfgb-gsec-title">Review settings</h3>
              {onPlatformChange && (
                <CfgBRow label="Platform" value={platform || 'web'} onChange={onPlatformChange}
                  options={[{ value: 'web', label: 'Web' }, { value: 'app', label: 'Mobile' }]}
                  hint="Mobile renders the product as a native app, with the phone's status bar and home indicator drawn over it. Always shown in a phone." />
              )}
              <CfgBRow label="Viewport" value={layout} onChange={onLayoutChange}
                options={[{ value: 'auto', label: 'Auto' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }]}
                hint={'Web posture only. Mobile frames every screen in a phone bezel, regardless of window size: mobile web, so no status bar.' + (isApp ? ' The mobile app overrides this and always uses the phone.' : '')} />
              {onReset && (
                <div className="cfgb-row">
                  <div className="cfgb-row-label"><span>Seed data</span></div>
                  <CfgBAction label="Reset to seeded data" onClick={onReset} />
                </div>
              )}
            </section>
            {extra && <CfgBSlot.Provider value={{ slot: 'global', isOpen, toggle }}>{extra}</CfgBSlot.Provider>}
          </div>

          {extra && (
            <React.Fragment>
              <div className="cfgb-part-label">Features <span>— scenarios for one part of the product</span></div>
              <div className="cfgb-cards">
                <CfgBSlot.Provider value={{ slot: 'feature', isOpen, toggle }}>{React.createElement(Extra, { onClose })}</CfgBSlot.Provider>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  ConfigLauncher: CfgBLauncher,
  ConfigSeg: CfgBSeg,
  ConfigGroup: CfgBGroup,
  ConfigRow: CfgBRow,
  ConfigAction: CfgBAction,
  ConfigNote: CfgBNote,
});
