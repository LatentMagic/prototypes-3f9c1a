// ============================================================================
// Playground header bar — one body, used by C2, C3 and C4. Unmistakably not
// product: dark, pinned above the app, and it carries the option set, the
// selected option's direction and cost, and any levers the page has.
// Configured by window.PGBAR before this file loads. Viewport is deliberately
// absent: the app's own Config aid (bottom right) already owns it.
// ============================================================================
const PGBarPill = ({ opt, on, onClick }) => (
  <button type="button" onClick={onClick} aria-pressed={on}
    style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
      background: on ? '#302F2C' : 'transparent', border: '1px solid ' + (on ? '#4A4844' : '#312F2C'),
      borderRadius: 'var(--radius-md)', padding: '7px 12px', minHeight: 38,
      font: (on ? '600' : '500') + ' 13px/1.2 var(--font-sans)', color: on ? '#FBFBF9' : '#A3A199' }}>
    <span style={{ font: '500 11px/1 var(--font-mono)', color: on ? '#8BBFAD' : '#6E6C66' }}>{opt.n}</span>
    {opt.name}
  </button>
);

const PGBarSeg = ({ value, options, onChange }) => (
  <span style={{ display: 'inline-flex', gap: 2, padding: 3, background: '#232220', borderRadius: 'var(--radius-md)' }}>
    {options.map(o => (
      <button key={o.id} type="button" onClick={() => onChange(o.id)}
        style={{ cursor: 'pointer', border: 0, borderRadius: 'var(--radius-sm)', padding: '6px 10px', minHeight: 30,
          background: value === o.id ? '#3C3A36' : 'transparent',
          font: '500 12.5px/1.2 var(--font-sans)', color: value === o.id ? '#FBFBF9' : '#8F8D86' }}>{o.label}</button>
    ))}
  </span>
);

const PGBar = () => {
  const cfg = window.PGBAR;
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => cfg.sub(bump), []);
  const [shut, setShut] = React.useState(false);
  const cur = cfg.get();
  const opt = cfg.options.find(o => o.id === cur) || cfg.options[0];
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--pgbar-h', el.offsetHeight + 'px');
    set();
    if (typeof ResizeObserver === 'undefined') { window.addEventListener('resize', set); return () => window.removeEventListener('resize', set); }
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [shut, cur]);
  const label = { font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: '#6E6C66', textTransform: 'uppercase' };
  const levers = (cfg.levers && cfg.levers()) || [];
  return (
    <div ref={ref} style={{ padding: '10px 16px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={label}>{cfg.eyebrow}</span>
          <span style={{ font: '500 12.5px/1.4 var(--font-sans)', color: '#A3A199' }}>{cfg.blurb}</span>
        </span>
        <button type="button" onClick={() => setShut(s => !s)}
          style={{ flexShrink: 0, cursor: 'pointer', background: 'transparent', border: '1px solid #312F2C',
            borderRadius: 'var(--radius-md)', padding: '6px 10px', minHeight: 32,
            font: '500 12px/1.2 var(--font-sans)', color: '#A3A199' }}>{shut ? 'Show' : 'Hide'}</button>
      </div>
      {!shut && (
        <React.Fragment>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {cfg.options.map(o => <PGBarPill key={o.id} opt={o} on={o.id === cur} onClick={() => cfg.set(o.id)} />)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 900 }}>
            <span style={{ font: '400 12.5px/1.55 var(--font-sans)', color: '#C9C7C0', textWrap: 'pretty' }}>{opt.dir}</span>
            {cfg.notes(opt).map(([k, v], i) => (
              <span key={i} style={{ font: '400 12.5px/1.55 var(--font-sans)', color: '#8F8D86', textWrap: 'pretty' }}>
                <span style={{ color: '#6E6C66' }}>{k}: </span>{v}
              </span>
            ))}
          </div>
          {levers.map((lv, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={label}>{lv.label}</span>
              <PGBarSeg value={lv.value} options={lv.options} onChange={lv.onChange} />
              {lv.hint && <span style={{ font: '400 12px/1.4 var(--font-sans)', color: '#6E6C66' }}>{lv.hint}</span>}
            </div>
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('pgbar')).render(<PGBar />);
