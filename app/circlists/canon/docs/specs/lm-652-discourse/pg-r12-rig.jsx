// ============================================================================
// Return v12 — the rig's chrome. One body, two places: docked in the circle
// rail's slot at desktop width, the Home destination in the app posture.
// One question, five answers. Number and name on the face; stance and cost
// behind the disclosure.
// ============================================================================
const R12_BEATS = [
  { id: 'return', label: 'Someone speaks' },
  { id: 'arrive', label: 'Land as a reader' },
  { id: 'reflect', label: 'Reflect on one' },
  { id: 'add', label: 'Add a link' },
];

const R12Line = ({ lead, text, quiet }) => (
  <span style={{ font: '400 12.5px/1.5 var(--font-sans)', color: quiet ? 'var(--color-fg-3)' : 'var(--color-fg-2)', textWrap: 'pretty' }}>
    {lead && <span style={{ fontWeight: 600, color: 'var(--color-fg-2)' }}>{lead} </span>}{text}
  </span>
);

const R12Row = ({ opt, on, open, onPick, onToggle }) => (
  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column',
    background: on ? 'var(--color-surface)' : 'transparent',
    boxShadow: on ? 'var(--shadow-raised)' : 'none', borderRadius: 'var(--radius-md)' }}>
    {on && <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: 3, background: 'var(--color-accent)' }} />}
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button type="button" onClick={onPick} className="circ-d9-opt"
        style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
          background: 'transparent', borderWidth: 0, cursor: 'pointer', minHeight: 44, borderRadius: 'var(--radius-md)',
          padding: '10px 2px 10px 15px' }}>
        <span style={{ flexShrink: 0, width: 22, font: '500 11px/1 var(--font-mono)', color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{opt.n}</span>
        <span style={{ flex: 1, minWidth: 0, font: (on ? '600' : '500') + ' 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{opt.name}</span>
      </button>
      <button type="button" onClick={onToggle} aria-expanded={open} className="circ-d9-disc"
        aria-label={(open ? 'Hide' : 'Show') + ' what \u201c' + opt.name + '\u201d does and costs'}
        style={{ flexShrink: 0, width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', borderWidth: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
        <span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <window.Icon name="chevron-down" size={16} />
        </span>
      </button>
    </div>
    {open && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '0 14px 12px 38px' }}>
        <R12Line text={opt.stance} />
        <R12Line quiet lead="Costs:" text={opt.cost} />
      </div>
    )}
  </div>
);

const R12Rail = ({ optId, onPick, onBeat, viewport, onViewport, onReset, home = false }) => {
  const [openId, setOpenId] = React.useState(null);
  const flip = (id) => setOpenId(o => o === id ? null : id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 18 }}>
      {!home && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '2px 6px 0' }}>
          <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>return v12</span>
          <span style={{ font: '600 15px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>Five ways the circle says a card you are watching has moved</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)', padding: '0 6px 4px' }}>on any tab, the circle tells you…</span>
        {window.W12_OPTIONS.map(o => (
          <R12Row key={o.id} opt={o} on={o.id === optId} open={openId === o.id}
            onPick={() => onPick(o.id)} onToggle={() => flip(o.id)} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)', padding: '0 6px' }}>walk the loop</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {R12_BEATS.map(b => (
            <button key={b.id} onClick={() => onBeat(b.id)} className="circ-config-btn-secondary"
              style={{ flex: '1 1 auto', textAlign: 'left' }}>{b.label}</button>
          ))}
        </div>
        <R12Line quiet text="The fold is in all five: a card you are watching is turned down at the corner in sage, grey when you are not. Tap it to turn it down or flatten it." />
      </div>
      <div style={{ flex: 1, minHeight: 12 }} />
      <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', paddingTop: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
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

const r12Opt = (id) => window.W12_OPTIONS.find(o => o.id === id) || window.W12_OPTIONS[0];

Object.assign(window, { R12_BEATS, R12Rail, r12Opt });
