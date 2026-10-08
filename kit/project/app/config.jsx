// ============================================================================
// Kit — the launcher (PROTOTYPE AID, not part of the product).
//
// A floating, draggable pill of up to three halves, all prototype aids and none
// part of the product:
//   settings glyph → Config. Review settings only: modes you hold while looking.
//   list glyph     → States (app/states-ui.jsx). Where you GO — a state to jump
//                    to, and a link to hand someone.
//   check glyph    → QA (app/qa.jsx). The states to check for work in flight.
//
// The split is the point: a setting is a mode you hold, a state is an address you
// open. An address needs a register of its own (app/states.jsx) before
// `?state=` can mean anything.
//
// Extracted to its own file so a build can drop the whole aid by leaving THIS
// one file out — main.jsx guards on
// window.ConfigLauncher and renders nothing when it's absent. The States half
// only appears when window.StatesPalette is loaded too.
//
// Owns its own open state + the pill's drag position; everything the modal
// controls is handed in as props from main.jsx, where the real state lives. The
// .kit-config-* / .kit-launcher-* styles live in index.html.
//
// PRODUCT ROWS do not go in this file. A product publishes window.ConfigExtra
// (see app/config-extra.example.jsx) and the modal renders it at its foot.
// ============================================================================
const { useState: useCState, useRef: useCRef, useEffect: useCEffect } = React;

const ConfigLauncher = ({ statesGroups, onGoState, onOpenStatesIndex,
                         onReset, layout, onLayoutChange }) => {
  const [open, setOpen] = useCState(false);
  const [statesOpen, setStatesOpen] = useCState(false);
  const [qaOpen, setQaOpen] = useCState(false);
  // draggable launcher-button position. null = default bottom-right.
  const [btnPos, setBtnPos] = useCState(() => {
    try { const v = JSON.parse(localStorage.getItem('kit_launcher_pos') || 'null'); return v && Number.isFinite(v.x) && Number.isFinite(v.y) ? v : null; } catch (e) { return null; }
  });
  const dragRef = useCRef({ dragging: false, moved: false, dx: 0, dy: 0, last: null });
  const wrapRef = useCRef(null);
  const invokerRef = useCRef(null);

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

  // keep a restored/old button position inside the current viewport (mount + resize)
  useCEffect(() => {
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
  // A drag ends on whichever half it started on; the click that follows is not one.
  const tapped = (fn) => { if (dragRef.current.moved) { dragRef.current.moved = false; return; } fn(); };
  const StatesPalette = window.StatesPalette;
  const hasStates = !!StatesPalette && !!statesGroups && statesGroups.length > 0;
  // QA (app/qa.jsx): hidden only when the file is absent; an empty list shows its empty state.
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
        <ConfigModal
          onReset={onReset}
          layout={layout} onLayoutChange={onLayoutChange}
          onClose={() => closeAt(setOpen)}
        />
      )}
    </div>
  );
};

// ---- Small self-contained segmented control (review-settings rows only) ----
const ConfigSeg = ({ options, value, onChange }) => (
  <div className="kit-config-seg" role="radiogroup">
    {options.map((o) => (
      <button key={o.value} type="button" role="radio" aria-checked={o.value === value}
        className="kit-config-seg-btn" data-active={o.value === value ? '1' : undefined}
        onClick={() => onChange(o.value)}>{o.label}</button>
    ))}
  </div>
);

// ---- The modal itself ----
const ConfigModal = ({ onReset, layout, onLayoutChange, onClose }) => {
  const [shown, setShown] = useCState(false);
  useCEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);

  useCEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock whatever is scrolling behind the modal (app/primitives.jsx). Released on close.
  useCEffect(kitLockScroll, []);

  // Staging buttons act on the app behind us, and some of those acts are
  // animated. Firing while the modal is still on screen means the motion plays
  // behind a card. So: intercept the click, play our exit, replay the click on
  // a clear screen, then close. One place, every .kit-config-btn-secondary in
  // the body (a product's ConfigExtra buttons included), nothing to configure:
  // the button's own handler does not have to close the modal.
  const onBodyClickCapture = (e) => {
    const btn = e.target.closest && e.target.closest('.kit-config-btn-secondary');
    if (!btn || btn.dataset.replay === '1') return;
    e.preventDefault(); e.stopPropagation();
    setShown(false);
    setTimeout(() => { btn.dataset.replay = '1'; btn.click(); onClose(); }, 190);
  };

  return (
    <div className="kit-config-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Config" className="kit-config-modal" data-shown={shown ? '1' : undefined}
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'scale(1)' : 'scale(0.97)' }}>
        <div className="kit-config-head">
          <div>
            <div className="kit-config-title">Config</div>
            <div className="kit-config-subtitle">Prototype controls — not part of the product.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="kit-config-close"><Icon name="x" size={18} /></button>
        </div>

        <div className="kit-config-body" onClickCapture={onBodyClickCapture}>
          <div className="kit-config-eyebrow">Review settings</div>

          <div className="kit-config-row">
            <div className="kit-config-row-label">Viewport</div>
            <ConfigSeg value={layout} onChange={onLayoutChange} options={[
              { value: 'auto', label: 'Auto' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' },
            ]} />
          </div>
          <div className="kit-config-hint">Mobile frames every screen in a phone bezel, regardless of window size.</div>

          {onReset && (
            <React.Fragment>
              <div className="kit-config-row">
                <div className="kit-config-row-label">Seed data</div>
                <button className="kit-config-btn-secondary" onClick={onReset}>Reset to seeded data</button>
              </div>
              <div className="kit-config-hint">Restages the seeded data.</div>
            </React.Fragment>
          )}

          {/* The product's own review settings hang here: a file publishes
              window.ConfigExtra (app/config-extra.example.jsx). Absent, nothing
              renders. */}
          {window.ConfigExtra && (
            <React.Fragment>
              <div className="kit-config-sep" />
              {React.createElement(window.ConfigExtra, { onClose })}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ConfigLauncher, ConfigSeg });
