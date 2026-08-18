// ============================================================================
// Discourse v8 — the rig's chrome. One body, rendered in two places and never
// forked: docked beside the app at desktop width (in the circle rail's own
// slot), and the Home destination in the app posture. Picking a state enters
// it, the way picking a circle does.
//
// The list obeys PLAYGROUND.md 10 and 11: every option carries a NUMBER and a
// name on its face, so it can be referred to out loud; the stance, the return
// mechanism and the cost sit behind a disclosure. A rail carrying four lines of
// prose per option cannot be scanned, and loses the reviewer their place.
// ============================================================================
const D8_STATES = [window.D8_DISC, window.D8_BACK, window.D8_LIFT, window.D8_LINE, window.D8_PAGE, window.D8_SIX];

const D8_BEATS = [
  { id: 'add', label: 'Add with a thought' },
  { id: 'arrive', label: 'Land as a reader' },
  { id: 'reflect', label: 'Reflect on one' },
  { id: 'return', label: 'Someone speaks' },
];

const D8Disclose = ({ open, onToggle, label }) => (
  <button type="button" onClick={onToggle} aria-expanded={open} className="circ-d8-disc"
    aria-label={(open ? 'Hide' : 'Show') + ' what \u201c' + label + '\u201d does and costs'}
    style={{ flexShrink: 0, width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
    <span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
      <window.Icon name="chevron-down" size={16} />
    </span>
  </button>
);

const D8Line2 = ({ lead, text, quiet }) => (
  <span style={{ font: '400 12.5px/1.5 var(--font-sans)', color: quiet ? 'var(--color-fg-3)' : 'var(--color-fg-2)', textWrap: 'pretty' }}>
    {lead && <span style={{ fontWeight: 600, color: 'var(--color-fg-2)' }}>{lead} </span>}{text}
  </span>
);

const D8Row = ({ n, name, detail, on, open, onPick, onToggle, sub = false }) => (
  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column',
    background: on ? 'var(--color-surface)' : 'transparent',
    boxShadow: on ? 'var(--shadow-raised)' : 'none', borderRadius: 'var(--radius-md)' }}>
    {on && <span aria-hidden="true" style={{ position: 'absolute', left: sub ? -9 : 0, top: sub ? 8 : 10, bottom: sub ? 8 : 10, width: 3, borderRadius: 3, background: 'var(--color-accent)' }} />}
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <button type="button" onClick={onPick} className="circ-d8-opt"
        style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
          background: 'transparent', border: 0, cursor: 'pointer', minHeight: 44, borderRadius: 'var(--radius-md)',
          padding: sub ? '8px 2px 8px 10px' : '10px 2px 10px 15px' }}>
        <span style={{ flexShrink: 0, font: '500 11.5px/1 var(--font-mono)', color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{n}</span>
        <span style={{ flex: 1, minWidth: 0, font: (on ? '600' : '500') + ' ' + (sub ? '13px' : '14px') + '/1.35 var(--font-sans)',
          color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{name}</span>
      </button>
      <D8Disclose open={open} onToggle={onToggle} label={name} />
    </div>
    {open && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: sub ? '0 12px 12px 34px' : '0 14px 12px 40px' }}>
        {detail}
      </div>
    )}
  </div>
);

const D8Rail = ({ stateId, onPick, onBeat, viewport, onViewport, onReset, home = false, variantId, onVariant }) => {
  // One disclosure open at a time: the list stays a list.
  const [openId, setOpenId] = React.useState(null);
  const flip = (id) => setOpenId(o => o === id ? null : id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 18 }}>
      {!home && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '2px 6px 0' }}>
          <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>discourse v8</span>
          <span style={{ font: '600 15px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>Six ways it could work</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {D8_STATES.map((s, si) => {
          const on = s.id === stateId;
          const num = String(si + 1);
          return (
            <React.Fragment key={s.id}>
              <D8Row n={num} name={s.name} on={on} open={openId === s.id}
                onPick={() => onPick(s.id)} onToggle={() => flip(s.id)}
                detail={
                  <React.Fragment>
                    <D8Line2 text={s.stance} />
                    {s.ret && <D8Line2 lead="Return:" text={s.ret} />}
                    <D8Line2 quiet lead="Costs:" text={s.cost} />
                  </React.Fragment>
                } />
              {/* The one state that carries a switcher: five answers to a single
                  narrow axis, swapped in place. It lives in the RIG's chrome,
                  never in the app — the app stays the app. */}
              {on && s.variants && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '2px 0 6px 14px',
                  paddingLeft: 8, borderLeft: '1px solid var(--color-border-2)' }}>
                  {s.variants.map((v, vi) => (
                    <D8Row key={v.id} sub n={num + '.' + (vi + 1)} name={v.name}
                      on={v.id === variantId} open={openId === s.id + ':' + v.id}
                      onPick={() => onVariant(v.id)} onToggle={() => flip(s.id + ':' + v.id)}
                      detail={
                        <React.Fragment>
                          <D8Line2 text={v.note} />
                          <D8Line2 quiet lead="Costs:" text={v.cost} />
                        </React.Fragment>
                      } />
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)', padding: '0 6px' }}>walk the loop</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {D8_BEATS.map(b => (
            <button key={b.id} onClick={() => onBeat(b.id)} className="circ-config-btn-secondary"
              style={{ flex: '1 1 auto', textAlign: 'left' }}>{b.label}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 12 }} />
      <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>Viewport</span>
        <div className="circ-config-seg">
          {['auto', 'mobile'].map(v => (
            <button key={v} className="circ-config-seg-btn" {...(viewport === v ? { 'data-active': '' } : {})}
              onClick={() => onViewport(v)}>{v === 'auto' ? 'Auto' : 'Mobile'}</button>
          ))}
        </div>
      </div>
      <button onClick={onReset} className="circ-textlink" style={{
        background: 'transparent', border: 0, padding: '6px 0', cursor: 'pointer', textAlign: 'left',
        font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>Start over</button>
    </div>
  );
};

Object.assign(window, { D8_STATES, D8_BEATS, D8Rail });
