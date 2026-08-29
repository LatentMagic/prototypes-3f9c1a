// ============================================================================
// Discourse v9 — the rig's chrome. One body, rendered in two places and never
// forked: docked beside the app in the circle rail's slot at desktop width, and
// the Home destination in the app posture. Picking a state enters it, the way
// picking a circle does.
// Number and name on the face; stance, return and cost behind a disclosure, so
// the list stays a list (PLAYGROUND.md 10, 11).
// ============================================================================
const D9_STATES = [window.D9_ROOM, window.D9_PAGE, window.D9_FEED, window.D9_SWELL, window.D9_SPINE];

const D9_BEATS = [
  { id: 'add', label: 'Add with a thought' },
  { id: 'arrive', label: 'Land as a reader' },
  { id: 'reflect', label: 'Reflect on one' },
  { id: 'return', label: 'Someone speaks' },
];

const D9Line2 = ({ lead, text, quiet }) => (
  <span style={{ font: '400 12.5px/1.5 var(--font-sans)', color: quiet ? 'var(--color-fg-3)' : 'var(--color-fg-2)', textWrap: 'pretty' }}>
    {lead && <span style={{ fontWeight: 600, color: 'var(--color-fg-2)' }}>{lead} </span>}{text}
  </span>
);

const D9Row = ({ n, name, detail, on, open, onPick, onToggle }) => (
  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column',
    background: on ? 'var(--color-surface)' : 'transparent',
    boxShadow: on ? 'var(--shadow-raised)' : 'none', borderRadius: 'var(--radius-md)' }}>
    {on && <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: 3, background: 'var(--color-accent)' }} />}
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button type="button" onClick={onPick} className="circ-d9-opt"
        style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
          background: 'transparent', borderWidth: 0, cursor: 'pointer', minHeight: 44, borderRadius: 'var(--radius-md)',
          padding: '10px 2px 10px 15px' }}>
        <span style={{ flexShrink: 0, font: '500 11.5px/1 var(--font-mono)', color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{n}</span>
        <span style={{ flex: 1, minWidth: 0, font: (on ? '600' : '500') + ' 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{name}</span>
      </button>
      <button type="button" onClick={onToggle} aria-expanded={open} className="circ-d9-disc"
        aria-label={(open ? 'Hide' : 'Show') + ' what \u201c' + name + '\u201d does and costs'}
        style={{ flexShrink: 0, width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', borderWidth: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
        <span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <window.Icon name="chevron-down" size={16} />
        </span>
      </button>
    </div>
    {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '0 14px 12px 40px' }}>{detail}</div>}
  </div>
);

const D9Rail = ({ stateId, onPick, onBeat, viewport, onViewport, onReset, home = false }) => {
  const [openId, setOpenId] = React.useState(null);
  const flip = (id) => setOpenId(o => o === id ? null : id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 18 }}>
      {!home && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '2px 6px 0' }}>
          <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>discourse v9</span>
          <span style={{ font: '600 15px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>Five ways it could work</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {D9_STATES.map((s, si) => (
          <D9Row key={s.id} n={String(si + 1)} name={s.name} on={s.id === stateId} open={openId === s.id}
            onPick={() => onPick(s.id)} onToggle={() => flip(s.id)}
            detail={
              <React.Fragment>
                <D9Line2 text={s.stance} />
                <D9Line2 lead="Return:" text={s.ret} />
                <D9Line2 quiet lead="Costs:" text={s.cost} />
              </React.Fragment>
            } />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)', padding: '0 6px' }}>walk the loop</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {D9_BEATS.map(b => (
            <button key={b.id} onClick={() => onBeat(b.id)} className="circ-config-btn-secondary"
              style={{ flex: '1 1 auto', textAlign: 'left' }}>{b.label}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 12 }} />
      <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>Viewport</span>
        <div className="circ-config-seg">
          {['auto', 'mobile'].map(v => (
            <button key={v} className="circ-config-seg-btn" {...(viewport === v ? { 'data-active': '' } : {})}
              onClick={() => onViewport(v)}>{v === 'auto' ? 'Auto' : 'Mobile'}</button>
          ))}
        </div>
      </div>
      <button onClick={onReset} className="circ-textlink" style={{
        background: 'transparent', borderWidth: 0, padding: '6px 0', cursor: 'pointer', textAlign: 'left',
        font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>Start over</button>
    </div>
  );
};

Object.assign(window, { D9_STATES, D9_BEATS, D9Rail });
