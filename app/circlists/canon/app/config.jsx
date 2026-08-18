// ============================================================================
// Circlists — the launcher (PROTOTYPE AID, not part of the product).
//
// A floating, draggable pill with two halves, both prototype aids and neither
// part of the product:
//   settings glyph → Config. Review settings only: posture, viewport, payments,
//                    gate, TEST circles, seed, liveliness staging.
//   list glyph     → States (app/states-ui.jsx). Where you GO — a state to jump
//                    to, and a link to hand someone.
//
// The split is the point: a setting is a mode you hold, a state is an address you
// open. Holding both in one settings modal is what made the old Scenarios list
// confusing, and an address needs a register of its own (app/states.jsx) before
// `?state=` can mean anything.
//
// Extracted to its own file so the omission-based homepage-demo derivation can
// drop the whole aid by leaving THIS one file out — main.jsx guards on
// window.ConfigLauncher and renders nothing when it's absent. The States half
// only appears when window.StatesPalette is loaded too.
//
// Owns its own open state + the pill's drag position; everything the modal
// controls is handed in as props from main.jsx, where the real state lives. The
// .circ-config-* / .circ-launcher-* styles live in circlists.html.
// ============================================================================
const { useState: useCState, useRef: useCRef, useEffect: useCEffect } = React;

const ConfigLauncher = ({ statesGroups, onGoState, onOpenStatesIndex,
                         onReset, gateOn, onGateChange, layout, onLayoutChange,
                         platform, onPlatformChange, mobilePayments, onMobilePaymentsChange,
                         showTest, onShowTestChange, live, onLiveChange, liveActions }) => {
  const [open, setOpen] = useCState(false);
  const [statesOpen, setStatesOpen] = useCState(false);
  // draggable launcher-button position. null = default bottom-right.
  const [btnPos, setBtnPos] = useCState(() => {
    try { const v = JSON.parse(localStorage.getItem('circ_launcher_pos') || 'null'); return v && typeof v.x === 'number' ? v : null; } catch (e) { return null; }
  });
  const dragRef = useCRef({ dragging: false, moved: false, dx: 0, dy: 0, last: null });
  const wrapRef = useCRef(null);
  const invokerRef = useCRef(null);

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    const wrap = e.currentTarget.closest('.circ-config-wrap');
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
      if (st.moved && st.last) { try { localStorage.setItem('circ_launcher_pos', JSON.stringify(st.last)); } catch (e) {} }
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

  return (
    <div className="circ-config-wrap" ref={wrapRef} style={wrapStyle}>
      <div className="circ-launcher" style={{ cursor: 'grab', touchAction: 'none' }}>
        <button className="circ-launcher-half" onPointerDown={onPointerDown}
          onClick={() => tapped(() => openAt(setOpen))}
          aria-haspopup="dialog" aria-expanded={open} data-open={open ? '1' : undefined}
          aria-label="Config" title="Config — drag to move">
          <Icon name="settings" size={17} />
        </button>
        {hasStates && (
          <button className="circ-launcher-half" onPointerDown={onPointerDown}
            onClick={() => tapped(() => openAt(setStatesOpen))}
            aria-haspopup="dialog" aria-expanded={statesOpen} data-open={statesOpen ? '1' : undefined}
            aria-label="States" title="States — drag to move">
            <Icon name="feed" size={17} />
          </button>
        )}
      </div>
      {hasStates && statesOpen && (
        <StatesPalette groups={statesGroups}
          onGo={(id) => { onGoState(id); closeAt(setStatesOpen); }}
          onOpenIndex={() => { closeAt(setStatesOpen); onOpenStatesIndex(); }}
          onClose={() => closeAt(setStatesOpen)} />
      )}
      {open && (
        <ConfigModal
          onReset={onReset}
          gateOn={gateOn} onGateChange={onGateChange}
          layout={layout} onLayoutChange={onLayoutChange}
          platform={platform} onPlatformChange={onPlatformChange}
          mobilePayments={mobilePayments} onMobilePaymentsChange={onMobilePaymentsChange}
          showTest={showTest} onShowTestChange={onShowTestChange}
          live={live} onLiveChange={onLiveChange} liveActions={liveActions}
          onClose={() => closeAt(setOpen)}
        />
      )}
    </div>
  );
};

// ---- Small self-contained segmented control (review-settings rows only) ----
const ConfigSeg = ({ options, value, onChange }) => (
  <div className="circ-config-seg" role="radiogroup">
    {options.map((o) => (
      <button key={o.value} type="button" role="radio" aria-checked={o.value === value}
        className="circ-config-seg-btn" data-active={o.value === value ? '1' : undefined}
        onClick={() => onChange(o.value)}>{o.label}</button>
    ))}
  </div>
);

// ---- The modal itself ----
const ConfigModal = ({ onReset, gateOn, onGateChange, layout, onLayoutChange,
                       platform, onPlatformChange, mobilePayments, onMobilePaymentsChange,
                       showTest, onShowTestChange, live, onLiveChange, liveActions, onClose }) => {
  const isApp = platform === 'app';
  const [arrivalCount, setArrivalCount] = useCState(1);
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

  // Lock whatever's actually scrolling behind the modal — the phone-frame's
  // inner screen when forced-mobile, otherwise the document itself — so a
  // scroll gesture that starts on the scrim/card never falls through to the
  // feed behind. Restored on close.
  useCEffect(() => {
    const scroller = document.querySelector('.circ-phone-screen') || document.scrollingElement || document.documentElement;
    const prevOverflow = scroller.style.overflow;
    scroller.style.overflow = 'hidden';
    return () => { scroller.style.overflow = prevOverflow; };
  }, []);

  return (
    <div className="circ-config-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Config" className="circ-config-modal"
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'scale(1)' : 'scale(0.97)' }}>
        <div className="circ-config-head">
          <div>
            <div className="circ-config-title">Config</div>
            <div className="circ-config-subtitle">Prototype controls — not part of the product.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="circ-config-close"><Icon name="x" size={18} /></button>
        </div>

        <div className="circ-config-body">
          <div className="circ-config-eyebrow">Review settings</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Platform</div>
            <ConfigSeg value={platform || 'web'} onChange={onPlatformChange} options={[
              { value: 'web', label: 'Web' }, { value: 'app', label: 'Mobile' },
            ]} />
          </div>
          <div className="circ-config-hint">Mobile renders the product as a native mobile app — bottom navigation, sheets, no floating button — on the same shared state. Always shown in a phone.</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Viewport</div>
            <ConfigSeg value={layout} onChange={onLayoutChange} options={[
              { value: 'auto', label: 'Auto' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' },
            ]} />
          </div>
          <div className="circ-config-hint">Web posture only. Mobile frames every screen in a phone bezel, regardless of window size.{isApp ? ' — The mobile app overrides this and always uses the phone.' : ''}</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Mobile payments</div>
            <ConfigSeg value={mobilePayments ? 'on' : 'off'} onChange={(v) => onMobilePaymentsChange(v === 'on')} options={[
              { value: 'off', label: 'Off' }, { value: 'on', label: 'On' },
            ]} />
          </div>
          <div className="circ-config-hint">Mobile only. Off, funding and checkout hand off to the web; on, the wizard runs in the app. Web mode always takes payment.</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Preview gate</div>
            <ConfigSeg value={gateOn ? 'on' : 'off'} onChange={(v) => onGateChange(v === 'on')} options={[
              { value: 'off', label: 'Off' }, { value: 'on', label: 'On' },
            ]} />
          </div>
          <div className="circ-config-hint">When on, New circle and Account dead-end in the sign-up gate.</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">TEST circles</div>
            <ConfigSeg value={showTest ? 'on' : 'off'} onChange={(v) => onShowTestChange(v === 'on')} options={[
              { value: 'on', label: 'Shown' }, { value: 'off', label: 'Hidden' },
            ]} />
          </div>
          <div className="circ-config-hint">Hides the two TEST demo circles from every circle list, for clean screenshots. They stay in state, so the scenarios that use them still work.</div>

          {onReset && (
            <React.Fragment>
              <div className="circ-config-row">
                <div className="circ-config-row-label">Seed data</div>
                <button className="circ-config-btn-secondary" onClick={onReset}>Reset to seeded data</button>
              </div>
              <div className="circ-config-hint">Clears local state and restages the default circles.</div>
            </React.Fragment>
          )}

          <div className="circ-config-sep" />

          {/* ---- Liveliness --------------------------------------------------
              Staging only. The grammar itself — the age, the glow, the waterline,
              the receipt — is the product, not a setting. The timed check ships OFF;
              all this does is turn it on (and choose the cadence), or fire arrivals
              directly so the grammar has something to react to. */}
          {live && (
            <React.Fragment>
              <div className="circ-config-eyebrow">Liveliness</div>

              <div className="circ-config-row">
                <div className="circ-config-row-label">Timed check</div>
                <ConfigSeg value={live.activity} onChange={(v) => onLiveChange('activity', v)} options={[
                  { value: 'off', label: 'Off' }, { value: 'slow', label: 'Slow' }, { value: 'fast', label: 'Fast' },
                ]} />
              </div>
              <div className="circ-config-hint">The app’s own check (slow ≈ 45s is what ships, fast ≈ 7s for review). In the circle you are in, arrivals wait behind the New pill; elsewhere they land and light that circle’s dot. Some are left unsurfaced, so a rail refresh has something to find.</div>

              <div className="circ-config-row">
                <div className="circ-config-row-label">Count</div>
                <div className="circ-config-stepper">
                  <button type="button" aria-label="Fewer" onClick={() => setArrivalCount(n => Math.max(1, n - 1))}>−</button>
                  <span>{arrivalCount}</span>
                  <button type="button" aria-label="More" onClick={() => setArrivalCount(n => Math.min(20, n + 1))}>+</button>
                </div>
              </div>

              <div className="circ-config-row">
                <div className="circ-config-row-label">Stage an arrival</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button className="circ-config-btn-secondary" onClick={() => { liveActions.here(arrivalCount); onClose(); }}>In this circle</button>
                  <button className="circ-config-btn-secondary" onClick={() => { liveActions.elsewhere(arrivalCount); onClose(); }}>In another</button>
                </div>
              </div>
              <div className="circ-config-hint">{arrivalCount} link{arrivalCount === 1 ? '' : 's'} each. In this circle {arrivalCount === 1 ? 'it waits' : 'they wait'} behind the New pill on Active — on Read the dot lights instead; in another {arrivalCount === 1 ? 'it lands' : 'they land'} and light that circle’s dot.</div>

              <div className="circ-config-row">
                <div className="circ-config-row-label">Waiting for a refresh</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button className="circ-config-btn-secondary" onClick={() => { liveActions.queue(arrivalCount); onClose(); }}>Unsurfaced arrival</button>
                  <button className="circ-config-btn-secondary" onClick={() => { liveActions.deleteElsewhere(); onClose(); }}>Delete by another member</button>
                </div>
              </div>
              <div className="circ-config-hint">Nothing surfaces either one. Selecting this circle in the rail lands the arrival{arrivalCount === 1 ? '' : 's'} directly and takes the deleted link away — that gesture is the only thing that finds them.</div>
            </React.Fragment>
          )}

          {/* An unratified overlay (a candidate build) can hang its own staging
              section here by publishing window.ConfigExtra. Absent in the shipped
              app, so nothing renders. */}
          {window.ConfigExtra && (
            <React.Fragment>
              <div className="circ-config-sep" />
              {React.createElement(window.ConfigExtra, { onClose })}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ConfigLauncher });
