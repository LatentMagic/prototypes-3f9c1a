// ============================================================================
// Discourse v10 — the rig's chrome. One body, rendered in two places and never
// forked: docked in the circle rail's slot at desktop width, and the Home
// destination in the app posture.
//
// Three chapters, because v10 answers three questions rather than proposing five
// whole products: what a reflection becomes · how the circle tells you · what
// contributing is. Picking an option enters the app AND puts you at the moment
// that option lives in, so nothing has to be hunted for.
// Number and name on the face; stance and cost behind the disclosure (rule 11).
// ============================================================================
const D10_CHAPTERS = [
  // Rail order follows the user's own sequence: you contribute first, then you
  // reflect on what is there, then the circle brings you back.
  { id: 'c', label: 'contributing is\u2026', beat: 'add', options: window.D10_CONTRIBUTE },
  { id: 'r', label: 'a reflection is\u2026', beat: 'reflect', options: window.D10_REFLECT },
  { id: 'n', label: 'the circle tells you\u2026', beat: 'return', options: window.D10_RETURN },
];
const D10_ALL = D10_CHAPTERS.reduce((a, c) => a.concat(c.options.map(o => ({ ...o, chapter: c.id, beat: c.beat }))), []);
const d10Opt = (id) => D10_ALL.find(o => o.id === id) || D10_ALL[0];

const D10_BEATS = [
  { id: 'add', label: 'Add a link' },
  { id: 'arrive', label: 'Land as a reader' },
  { id: 'reflect', label: 'Reflect on one' },
  { id: 'return', label: 'Someone speaks' },
];

const D10Line = ({ lead, text, quiet }) => (
  <span style={{ font: '400 12.5px/1.5 var(--font-sans)', color: quiet ? 'var(--color-fg-3)' : 'var(--color-fg-2)', textWrap: 'pretty' }}>
    {lead && <span style={{ fontWeight: 600, color: 'var(--color-fg-2)' }}>{lead} </span>}{text}
  </span>
);

const D10Row = ({ opt, on, open, onPick, onToggle }) => (
  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column',
    background: on ? 'var(--color-surface)' : 'transparent',
    boxShadow: on ? 'var(--shadow-raised)' : 'none', borderRadius: 'var(--radius-md)' }}>
    {on && <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: 3, background: 'var(--color-accent)' }} />}
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button type="button" onClick={onPick} className="circ-d9-opt"
        style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
          background: 'transparent', borderWidth: 0, cursor: 'pointer', minHeight: 44, borderRadius: 'var(--radius-md)',
          padding: '10px 2px 10px 15px' }}>
        <span style={{ flexShrink: 0, width: 20, font: '500 11px/1 var(--font-mono)', color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{opt.n}</span>
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
        <D10Line text={opt.stance} />
        <D10Line quiet lead="Costs:" text={opt.cost} />
      </div>
    )}
  </div>
);

const D10Rail = ({ optId, onPick, onBeat, viewport, onViewport, onReset, home = false, circles }) => {
  const [openId, setOpenId] = React.useState(null);
  const flip = (id) => setOpenId(o => o === id ? null : id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 18 }}>
      {!home && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '2px 6px 0' }}>
          <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>discourse v10</span>
          <span style={{ font: '600 15px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>Three questions, nineteen answers</span>
        </div>
      )}
      {circles}
      {D10_CHAPTERS.map(ch => (
        <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)', padding: '0 6px 4px' }}>{ch.label}</span>
          {ch.options.map(o => (
            <D10Row key={o.id} opt={o} on={o.id === optId} open={openId === o.id}
              onPick={() => onPick(o.id)} onToggle={() => flip(o.id)} />
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)', padding: '0 6px' }}>walk the loop</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {D10_BEATS.map(b => (
            <button key={b.id} onClick={() => onBeat(b.id)} className="circ-config-btn-secondary"
              style={{ flex: '1 1 auto', textAlign: 'left' }}>{b.label}</button>
          ))}
        </div>
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

Object.assign(window, { D10_CHAPTERS, D10_ALL, D10_BEATS, D10Rail, d10Opt });
