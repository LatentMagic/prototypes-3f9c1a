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
// the selected section's rows on the right. Below 640px the rail is a tab strip
// above the pane, inside the bottom sheet. Styles: the CANDIDATE CSS block in
// option-a.html (.cao-*). Nothing here is accepted.
// ============================================================================
const { useState: useCaoState, useRef: useCaoRef, useEffect: useCaoEffect,
        useLayoutEffect: useCaoLayoutEffect, useContext: useCaoContext } = React;

const CAO_GLOBAL = 'Global';
const CaoConfigCtx = React.createContext(null);

// The section a group belongs to: every global group shares one.
const caoSectionOf = (title, scope) => (scope === 'global' ? CAO_GLOBAL : title);

// Children with fragments opened and false/null dropped, so a group can sort
// its actions from its rows however the product nested its conditionals.
// Keys are prefixed by the fragment they came from, so siblings stay unique.
const caoFlatten = (children, prefix = '') => React.Children.toArray(children).flatMap((c) =>
  (c && c.type === React.Fragment
    ? caoFlatten(c.props.children, prefix + c.key)
    : [React.isValidElement(c) ? React.cloneElement(c, { key: prefix + c.key }) : c]));

// ---- Contract: one row of choices ----
const ConfigRow = ({ label, value, onChange, options, hint }) => {
  const [hintOpen, setHintOpen] = useCaoState(false);
  return (
    <div className="cao-row">
      <div className="cao-row-head">
        <span className="cao-row-label">{label}</span>
        {hint && (
          <button type="button" className="cao-info" aria-expanded={hintOpen}
            aria-label={'About ' + label} onClick={() => setHintOpen((v) => !v)}>i</button>
        )}
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
  <button type="button" className="cao-action" title={hint || undefined}
    onClick={() => { if (typeof onClick === 'function') onClick(); }}>
    <span className="cao-action-glyph" aria-hidden="true">›</span>{label}
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
  // Feature sections are titled by the rail; only Global's subgroups need a heading.
  const showTitle = section === CAO_GLOBAL;
  return (
    <section className="cao-group">
      {showTitle && <h3 className="cao-group-title">{title}</h3>}
      {rest.length > 0 && <div className="cao-rows">{rest}</div>}
      {actions.length > 0 && <CaoEvents actions={actions} />}
    </section>
  );
};

// A group's one-shot events, set apart from its rows. Their hints sit behind
// one info button, like a row's.
const CaoEvents = ({ actions }) => {
  const [hintOpen, setHintOpen] = useCaoState(false);
  const hints = actions.filter((a) => a.props.hint);
  return (
    <div className="cao-events">
      <div className="cao-events-head">
        <span className="cao-events-title">Events</span>
        <span className="cao-events-sub">Each fires once and closes Config</span>
        {hints.length > 0 && (
          <button type="button" className="cao-info" aria-expanded={hintOpen}
            aria-label="About these events" onClick={() => setHintOpen((v) => !v)}>i</button>
        )}
      </div>
      <div className="cao-events-list">{actions}</div>
      {hintOpen && hints.map((a) => (
        <div key={a.key} className="cao-hint"><b>{a.props.label}:</b> {a.props.hint}</div>
      ))}
    </div>
  );
};

// The rail's selection survives closing and reopening Config, not a reload.
let caoLastSection = CAO_GLOBAL;

// ---- The modal ----
const CaoConfigModal = ({ onReset, layout, onLayoutChange, platform, onPlatformChange, onClose }) => {
  const isApp = platform === 'app';
  const [shown, setShown] = useCaoState(false);
  const [active, setActive] = useCaoState(caoLastSection);
  const [sections, setSections] = useCaoState([]);
  const regRef = useCaoRef(new Map());

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

  // A remembered section that this product does not have falls back to Global.
  useCaoEffect(() => {
    if (sections.length && !sections.includes(active)) setActive(CAO_GLOBAL);
  }, [sections]);
  useCaoEffect(() => { caoLastSection = active; }, [active]);

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

  const Extra = window.ConfigExtra;
  return (
    <div className="cao-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Config" className="cao-modal" data-shown={shown ? '1' : undefined}>
        <div className="cao-head">
          <div>
            <div className="cao-title">Config</div>
            <div className="cao-subtitle">Prototype controls, not part of the product.</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="cao-close"><Icon name="x" size={18} /></button>
        </div>

        <div className="cao-main">
          <nav className="cao-rail" role="tablist" aria-label="Config sections">
            {sections.map((s) => (
              <button key={s} type="button" role="tab" aria-selected={s === active}
                className="cao-rail-btn" data-active={s === active ? '1' : undefined}
                data-global={s === CAO_GLOBAL ? '1' : undefined}
                onClick={() => setActive(s)}>{s}</button>
            ))}
          </nav>

          <div className="cao-pane" role="tabpanel" aria-label={active} onClickCapture={onPaneClickCapture}>
            {active !== CAO_GLOBAL && <h2 className="cao-pane-title">{active}</h2>}
            <CaoConfigCtx.Provider value={ctx}>
              <ConfigGroup title="Review" scope="global">
                {onPlatformChange && (
                  <ConfigRow label="Platform" value={platform || 'web'} onChange={onPlatformChange}
                    options={[{ value: 'web', label: 'Web' }, { value: 'app', label: 'Mobile' }]}
                    hint="Mobile renders the product as a native app, in a phone with its status bar and home indicator." />
                )}
                <ConfigRow label="Viewport" value={layout} onChange={onLayoutChange}
                  options={[{ value: 'auto', label: 'Auto' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }]}
                  hint={'Web only. Mobile frames every screen in a phone bezel, with no status bar.' + (isApp ? ' The mobile app always uses the phone.' : '')} />
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
