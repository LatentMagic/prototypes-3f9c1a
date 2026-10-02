// Shared chrome for the per-person pricing option boards. Swaps the candidate's
// subscription store for an in-memory one so nothing here writes to the
// candidate's saved state (circ_ppp_v1), and stubs the app handle the mounted
// candidate components read.
window.__pppApi = { user: { email: 'sam@example.com' }, setRoute() {}, goHome() {}, enterSpace() {}, setTab() {}, setSpaces() {} };
(() => {
  let st = { ...PPP_DEFAULT, sheet: null };
  const subs = new Set();
  window.CircPPP = {
    get: () => st,
    set(p) { st = { ...st, ...p }; subs.forEach((f) => f()); },
    reset(p) { this.set({ ...PPP_DEFAULT, ...(p || {}) }); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
})();

const usePgSaved = (key, init) => {
  const [v, setV] = React.useState(() => { try { const s = JSON.parse(localStorage.getItem(key) || 'null'); return s == null ? init : s; } catch (e) { return init; } });
  const set = (n) => { setV(n); try { localStorage.setItem(key, JSON.stringify(n)); } catch (e) {} };
  return [v, set];
};

const PgBoard = ({ eyebrow, title, lede, controls, children }) => (
  <div className="pg-wrap">
    <div className="pg-eyebrow">{eyebrow}</div>
    <h1 className="pg-h1">{title}</h1>
    <p className="pg-lede">{lede}</p>
    {controls && <div className="pg-controls">{controls}</div>}
    <div className="pg-opts">{children}</div>
  </div>
);

const PgSeg = ({ label, value, options, onChange }) => (
  <div className="pg-ctl">
    <span className="pg-ctl-l">{label}</span>
    <div className="circ-config-seg" role="radiogroup" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} data-active={value === v ? '' : undefined} className="circ-config-seg-btn" onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  </div>
);

const PgOpt = ({ num, name, claim, cost, children }) => (
  <section>
    <div className="pg-opthead"><span className="pg-num">{num}</span><span className="pg-name">{name}</span></div>
    {claim && <p className="pg-claim">{claim}</p>}
    {cost && <p className="pg-cost">{cost}</p>}
    <div className="pg-frames">{children}</div>
  </section>
);

const PgFrame = ({ cap, width, posture = 'mobile', minH, pad, children }) => (
  <div style={{ width, maxWidth: '100%' }}>
    <div className="pg-cap">{cap}</div>
    <div className={'pg-frame' + (pad ? ' pg-frame-pad' : '')} data-circ-posture={posture} style={{ width, minHeight: minH }}>{children}</div>
  </div>
);

// A desktop-width frame scaled down to the board's width, so a 1280 page is seen whole.
const PgScaled = ({ cap, width = 1280, minH = 800, children }) => {
  const outer = React.useRef(null); const inner = React.useRef(null);
  const [s, setS] = React.useState(1); const [h, setH] = React.useState(minH);
  React.useLayoutEffect(() => {
    const fit = () => {
      if (!outer.current || !inner.current) return;
      const k = Math.min(1, outer.current.clientWidth / width);
      setS(k); setH(inner.current.offsetHeight * k);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(outer.current); ro.observe(inner.current);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div className="pg-scaled">
      <div className="pg-cap">{cap}</div>
      <div ref={outer} style={{ width: '100%', height: h }}>
        <div ref={inner} className="pg-frame pg-scaled-inner" data-circ-posture="desktop" style={{ width, minHeight: minH, transform: 'scale(' + s + ')' }}>{children}</div>
      </div>
    </div>
  );
};

Object.assign(window, { usePgSaved, PgBoard, PgSeg, PgOpt, PgFrame, PgScaled });
