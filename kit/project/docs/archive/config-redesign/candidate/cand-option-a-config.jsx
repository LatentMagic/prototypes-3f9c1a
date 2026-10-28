// ============================================================================
// Candidate option-a (config-redesign): the Config modal as two-pane settings.
// Re-publishes window.ConfigLauncher over app/config.jsx, and publishes the
// product-facing contract a product's window.ConfigExtra builds its rows from:
//
//   ConfigGroup({ title, scope, children })  scope 'global' joins the Global
//                                            section; omitted = its own section
//   ConfigRow({ label, value, onChange, options: [{value,label}], hint })
//   ConfigAction({ label, onClick, hint })   a one-shot event
//   ConfigNote({ children })                 a short "does not apply" line
//
// Layout: a left rail of sections (Global first, then one per feature group),
// the selected section's rows on the right. Below 640px it is a bottom sheet
// that drills in: the section list, then one section with a back control.
// Nothing scrolls sideways at any width. Styles: the CANDIDATE CSS block in
// option-a.html (.cao-*). Nothing here is accepted.
// ============================================================================
const { useState: useCaoState, useRef: useCaoRef, useEffect: useCaoEffect,
        useLayoutEffect: useCaoLayoutEffect, useContext: useCaoContext } = React;

const CAO_GLOBAL = 'Global';
const CAO_PHONE = '(max-width: 639px)';
const CaoConfigCtx = React.createContext(null);

// Drawn in the kit Icon's stroke (24 grid, 2px, round): the kit set has no
// info, chevron-right, back or event mark.
const CAO_GLYPHS = {
  info: <React.Fragment><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16.5" /><line x1="12" y1="7.5" x2="12" y2="7.6" /></React.Fragment>,
  next: <polyline points="9 6 15 12 9 18" />,
  back: <polyline points="15 6 9 12 15 18" />,
  fire: <polygon points="7 5 18 12 7 19 7 5" />,
};
const CaoGlyph = ({ name, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{CAO_GLYPHS[name]}</svg>
);

const caoSectionOf = (title, scope) => (scope === 'global' ? CAO_GLOBAL : title);

// Children with fragments opened and false/null dropped, so a group can sort
// its actions from its rows however the product nested its conditionals.
// Keys are prefixed by the fragment they came from, so siblings stay unique.
const caoFlatten = (children, prefix = '') => React.Children.toArray(children).flatMap((c) =>
  (c && c.type === React.Fragment
    ? caoFlatten(c.props.children, prefix + c.key)
    : [React.isValidElement(c) ? React.cloneElement(c, { key: prefix + c.key }) : c]));

const caoUsePhone = () => {
  const [phone, setPhone] = useCaoState(() => window.matchMedia(CAO_PHONE).matches);
  useCaoEffect(() => {
    const mq = window.matchMedia(CAO_PHONE);
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
};

// The info toggle a row or an Events strip carries; the hint opens inline
// under it, so it can never land off-screen.
const CaoInfo = ({ open, onToggle, label }) => (
  <button type="button" className="cao-info" aria-expanded={open} aria-label={label} onClick={onToggle}>
    <CaoGlyph name="info" size={16} />
  </button>
);

// ---- Contract: one row of choices ----
// KEEP: options are separate bordered chips that wrap onto a new line, never a
// track that scrolls sideways; the chosen one is filled near-black.
const ConfigRow = ({ label, value, onChange, options, hint }) => {
  const [hintOpen, setHintOpen] = useCaoState(false);
  return (
    <div className="cao-row">
      <div className="cao-row-head">
        <span className="cao-row-label">{label}</span>
        {hint && <CaoInfo open={hintOpen} onToggle={() => setHintOpen((v) => !v)} label={'About ' + label} />}
      </div>
      <div className="cao-seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}
            className="cao-seg-btn" data-active={o.value === value ? '1' : undefined}
            onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
      {hint && hintOpen && <div className="cao-hint">{hint}</div>}
    </div>
  );
};

// ---- Contract: a one-shot event. Rendered in its group's Events strip. ----
// KEEP: the .cao-action class is what the modal's click-capture replays after
// closing, so an animated act plays on a clear screen.
const ConfigAction = ({ label, onClick, hint }) => (
  <button type="button" className="cao-action"
    onClick={() => { if (typeof onClick === 'function') onClick(); }}>
    <CaoGlyph name="fire" size={12} />{label}
  </button>
);

const ConfigNote = ({ children }) => <div className="cao-note">{children}</div>;

// ---- Contract: a group. Registers its section with the modal; renders only
// while that section is selected. ----
const ConfigGroup = ({ title, scope, children }) => {
  const ctx = useCaoContext(CaoConfigCtx);
  const id = React.useId();
  const section = caoSectionOf(title, scope);
  useCaoLayoutEffect(() => {
    if (!ctx) return undefined;
    ctx.register(id, section);
    return () => ctx.unregister(id);
  }, [section]);
  if (ctx && ctx.active !== section) return null;

  const items = caoFlatten(children);
  const actions = items.filter((c) => c.type === ConfigAction);
  const rest = items.filter((c) => c.type !== ConfigAction);
  // Feature sections are titled by the pane; only Global's subgroups need a heading.
  return (
    <section className="cao-group">
      {section === CAO_GLOBAL && <h3 className="cao-group-title">{title}</h3>}
      {rest.length > 0 && <div className="cao-rows">{rest}</div>}
      {actions.length > 0 && <CaoEvents actions={actions} />}
    </section>
  );
};

// A group's one-shot events, set apart from its rows by a heading, not a box.
const CaoEvents = ({ actions }) => {
  const [hintOpen, setHintOpen] = useCaoState(false);
  const hints = actions.filter((a) => a.props.hint);
  return (
    <div className="cao-events">
      <div className="cao-events-head">
        <span className="cao-events-title">Events</span>
        <span className="cao-events-sub">Fires once, then closes Config</span>
        {hints.length > 0 && <CaoInfo open={hintOpen} onToggle={() => setHintOpen((v) => !v)} label="About these events" />}
      </div>
      {hintOpen && hints.map((a) => (
        <div key={a.key} className="cao-hint"><b>{a.props.label}:</b> {a.props.hint}</div>
      ))}
      <div className="cao-events-list">{actions}</div>
    </div>
  );
};

// The section open last time; null until one is chosen this page load, so the
// phone sheet first opens on its section list.
let caoLastSection = null;

// ---- The modal ----
const CaoConfigModal = ({ onReset, layout, onLayoutChange, platform, onPlatformChange, onClose }) => {
  const isApp = platform === 'app';
  const phone = caoUsePhone();
  const [shown, setShown] = useCaoState(false);
  const [active, setActive] = useCaoState(caoLastSection || CAO_GLOBAL);
  // Phone only: the section list (false) or one section (true).
  const [drilled, setDrilled] = useCaoState(!!caoLastSection);
  const [sections, setSections] = useCaoState([]);
  const regRef = useCaoRef(new Map());
  const dialogRef = useCaoRef(null);

  const syncSections = () => {
    const seen = [];
    regRef.current.forEach((s) => { if (!seen.includes(s)) seen.push(s); });
    const ordered = [CAO_GLOBAL, ...seen.filter((s) => s !== CAO_GLOBAL)];
    setSections((prev) => (prev.join('|') === ordered.join('|') ? prev : ordered));
  };
  const ctx = {
    active,
    register: (id, section) => { regRef.current.set(id, section); syncSections(); },
    unregister: (id) => { regRef.current.delete(id); syncSections(); },
  };
  const choose = (s) => { setActive(s); setDrilled(true); caoLastSection = s; };

  // A remembered section that this product does not have falls back to Global.
  useCaoEffect(() => {
    if (sections.length && !sections.includes(active)) setActive(CAO_GLOBAL);
  }, [sections]);

  // Focus lands inside the dialog on open, and on the new view after a drill.
  useCaoEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const target = el.querySelector(phone && drilled ? '.cao-back'
      : phone ? '.cao-rail-btn' : '.cao-rail-btn[aria-current="true"]');
    if (target) target.focus({ preventScroll: true });
  }, [phone, drilled, sections.length > 1]); // KEEP: re-run once the feature sections have registered

  useCaoEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  useCaoEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  useCaoEffect(kitLockScroll, []);

  // KEEP: one-shot events act on the app behind the modal, some with motion.
  // Intercept, play the exit, replay the click on a clear screen, then close;
  // the action's own handler never has to close Config.
  const onPaneClickCapture = (e) => {
    const btn = e.target.closest && e.target.closest('.cao-action');
    if (!btn || btn.dataset.replay === '1') return;
    e.preventDefault(); e.stopPropagation();
    setShown(false);
    setTimeout(() => { btn.dataset.replay = '1'; btn.click(); onClose(); }, 190);
  };

  const inSection = phone && drilled;
  const features = sections.filter((s) => s !== CAO_GLOBAL);
  const railBtn = (s, sub) => (
    <button key={s} type="button" className="cao-rail-btn"
      aria-current={!phone && s === active ? 'true' : undefined}
      onClick={() => choose(s)}>
      <span className="cao-rail-text">
        <span className="cao-rail-name">{s}</span>
        {sub && <span className="cao-rail-sub">{sub}</span>}
      </span>
      <span className="cao-rail-chev"><CaoGlyph name="next" size={18} /></span>
    </button>
  );

  const Extra = window.ConfigExtra;
  return (
    <div className="cao-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Config" ref={dialogRef} className="cao-modal"
        data-shown={shown ? '1' : undefined} data-view={inSection ? 'section' : 'list'}>
        <div className="cao-head">
          {inSection ? (
            <button type="button" className="cao-back" onClick={() => setDrilled(false)}>
              <CaoGlyph name="back" size={20} /><span>Config</span>
            </button>
          ) : (
            <div className="cao-head-text">
              <div className="cao-title">Config</div>
              <div className="cao-subtitle">Prototype controls, not part of the product.</div>
            </div>
          )}
          <button type="button" onClick={onClose} aria-label="Close" className="cao-close"><Icon name="x" size={18} /></button>
        </div>

        <div className="cao-main">
          <nav className="cao-rail" aria-label="Config sections">
            {railBtn(CAO_GLOBAL, 'Whole prototype')}
            {features.length > 0 && <div className="cao-rail-label">Features</div>}
            {features.map((s) => railBtn(s))}
          </nav>

          <div className="cao-pane" aria-label={active} onClickCapture={onPaneClickCapture}>
            <h2 className="cao-pane-title">{active}</h2>
            <CaoConfigCtx.Provider value={ctx}>
              <ConfigGroup title="Review" scope="global">
                {onPlatformChange && (
                  <ConfigRow label="Platform" value={platform || 'web'} onChange={onPlatformChange}
                    options={[{ value: 'web', label: 'Web' }, { value: 'app', label: 'Mobile' }]}
                    hint="Mobile renders the product as a native app, in a phone with its status bar and home indicator." />
                )}
                {/* Viewport is a web posture; the mobile app is always in the phone, so the row would do nothing. */}
                {isApp
                  ? <ConfigNote>Viewport is for Web only: the mobile app always uses the phone.</ConfigNote>
                  : <ConfigRow label="Viewport" value={layout} onChange={onLayoutChange}
                      options={[{ value: 'auto', label: 'Auto' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }]}
                      hint="Mobile frames every screen in a phone bezel, with no status bar." />}
                {onReset && <ConfigAction label="Reset to seeded data" onClick={onReset} />}
              </ConfigGroup>
              {Extra && <Extra onClose={onClose} />}
            </CaoConfigCtx.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- The launcher: the shipped pill, unchanged; only its Config half opens
// this modal instead of the shipped one. ----
// KEEP: the shipped ConfigModal is file-scoped in app/config.jsx, so it cannot be
// re-published. The pill is reused whole and the gear's click is taken in the
// capture phase. A click that ends a drag is left to the pill, which swallows it.
const CaoShippedLauncher = window.ConfigLauncher;
const CaoLauncher = (props) => {
  const [open, setOpen] = useCaoState(false);
  const downAt = useCaoRef(null);
  const invoker = useCaoRef(null);
  const gearOf = (e) => e.target.closest && e.target.closest('.kit-launcher-half[aria-label="Config"]');

  const onPointerDownCapture = (e) => { downAt.current = gearOf(e) ? { x: e.clientX, y: e.clientY } : null; };
  const onClickCapture = (e) => {
    const gear = gearOf(e);
    if (!gear) return;
    const d = downAt.current;
    downAt.current = null;
    if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 4) return;
    e.stopPropagation(); e.preventDefault();
    invoker.current = gear;
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    if (invoker.current && invoker.current.focus) invoker.current.focus();
  };

  return (
    <div style={{ display: 'contents' }} onPointerDownCapture={onPointerDownCapture} onClickCapture={onClickCapture}>
      <CaoShippedLauncher {...props} />
      {open && (
        <CaoConfigModal onReset={props.onReset}
          layout={props.layout} onLayoutChange={props.onLayoutChange}
          platform={props.platform} onPlatformChange={props.onPlatformChange}
          onClose={close} />
      )}
    </div>
  );
};

Object.assign(window, { ConfigLauncher: CaoLauncher, ConfigGroup, ConfigRow, ConfigAction, ConfigNote });
