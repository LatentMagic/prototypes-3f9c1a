// ============================================================================
// C1 playground — the page's own header bar. Dark, pinned above the app, and it
// carries everything the reviewer steers with: the five faces, the selected
// one's direction and cost, the mark, and the length lever.
// Viewport is NOT duplicated here — the app's own Config aid (bottom right)
// already owns Auto / Desktop / Mobile.
// ============================================================================
const PGC1FPill = ({ opt, on, onClick }) => (
  <button type="button" onClick={onClick} aria-pressed={on}
    style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
      background: on ? '#302F2C' : 'transparent', border: '1px solid ' + (on ? '#4A4844' : '#312F2C'),
      borderRadius: 'var(--radius-md)', padding: '7px 12px', minHeight: 38,
      font: (on ? '600' : '500') + ' 13px/1.2 var(--font-sans)', color: on ? '#FBFBF9' : '#A3A199' }}>
    <span style={{ font: '500 11px/1 var(--font-mono)', color: on ? '#8BBFAD' : '#6E6C66' }}>{opt.n}</span>
    {opt.name}
  </button>
);

const PGC1FSeg = ({ value, options, onChange }) => (
  <span style={{ display: 'inline-flex', gap: 2, padding: 3, background: '#232220', borderRadius: 'var(--radius-md)' }}>
    {options.map(o => (
      <button key={o.id} type="button" onClick={() => onChange(o.id)}
        style={{ cursor: 'pointer', border: 0, borderRadius: 'var(--radius-sm)', padding: '6px 10px', minHeight: 30,
          background: value === o.id ? '#3C3A36' : 'transparent',
          font: '500 12.5px/1.2 var(--font-sans)', color: value === o.id ? '#FBFBF9' : '#8F8D86' }}>{o.label}</button>
    ))}
  </span>
);

const PGC1FBar = () => {
  const st = usePGC1F();
  const [shut, setShut] = React.useState(false);
  const face = pgc1fFace();
  const mark = pgc1fMark();
  const setting = pgc1fSet();
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
  }, [shut, st.face, st.mark, st.type]);
  const label = { font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: '#6E6C66', textTransform: 'uppercase', flexShrink: 0 };
  const line = { font: '400 12.5px/1.55 var(--font-sans)', color: '#C9C7C0', textWrap: 'pretty' };
  return (
    <div ref={ref} style={{ padding: '10px 16px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={label}>c1 &middot; the open card</span>
          <span style={{ font: '500 12.5px/1.4 var(--font-sans)', color: '#A3A199' }}>
            The mechanic is settled. What the card looks like once it has come forward is not.
          </span>
        </span>
        <button type="button" onClick={() => setShut(s => !s)}
          style={{ flexShrink: 0, cursor: 'pointer', background: 'transparent', border: '1px solid #312F2C',
            borderRadius: 'var(--radius-md)', padding: '6px 10px', minHeight: 32,
            font: '500 12px/1.2 var(--font-sans)', color: '#A3A199' }}>{shut ? 'Show' : 'Hide'}</button>
      </div>
      {!shut && (
        <React.Fragment>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {PGC1F_FACES.map(o => <PGC1FPill key={o.id} opt={o} on={o.id === st.face} onClick={() => PGC1F.set({ face: o.id })} />)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 900 }}>
            <span style={line}>{face.dir}</span>
            <span style={{ ...line, color: '#8F8D86' }}><span style={{ color: '#6E6C66' }}>Costs: </span>{face.cost}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ ...label, paddingTop: 11 }}>mark</span>
            <PGC1FSeg value={st.mark} options={PGC1F_MARKS} onChange={(id) => PGC1F.set({ mark: id })} />
            <span style={{ flex: '1 1 320px', minWidth: 0, font: '400 12px/1.5 var(--font-sans)', color: '#8F8D86', paddingTop: 4, textWrap: 'pretty' }}>{mark.note}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ ...label, paddingTop: 11 }}>setting</span>
            <PGC1FSeg value={st.type} options={PGC1F_SETS} onChange={(id) => PGC1F.set({ type: id })} />
            <span style={{ flex: '1 1 320px', minWidth: 0, font: '400 12px/1.5 var(--font-sans)', color: '#8F8D86', paddingTop: 4, textWrap: 'pretty' }}>
              {setting.dir} <span style={{ color: '#6E6C66' }}>Costs: {setting.cost}</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={label}>length</span>
            <PGC1FSeg value={st.len} options={PGC1F_LENGTHS} onChange={(id) => PGC1F.set({ len: id })} />
            <span style={{ font: '400 12px/1.4 var(--font-sans)', color: '#6E6C66' }}>
              Mixed is the shelf as it stands. The rest force every thought to one length.
            </span>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

// Install the face set into the candidate. CardRow is a property read per render
// by main.jsx, so it swaps without touching app/ or the candidate's own files.
window.CircCandidate.CardRow = window.PGC1FRow;
ReactDOM.createRoot(document.getElementById('pgbar')).render(<PGC1FBar />);
