// Playground (1236, v9): the main build, whole, with a fixed bar at the top for Daily Word's session card: the desktop rule,
// the phone spacing and the hint row's marks. Each group sets one class on <html>; the styles are
// in word-v9.html. The plays are the main build's states (States → 7. Session page: Daily Word…); Viewport and Platform are
// Config's own. Nothing in app/ is changed.
const PG9_KEY = 'pg_word-session_v9';
const PG9_ROWS = {
  // One: a faint rule with 24 either side at every width; it lies flat under the chip on a phone, upright beside it on desktop.
  mode: ['one', [['one', 'One rule, 24 either side'], ['one20', 'One rule, 20 either side'], ['pick', 'Pick each']]],
  side: ['S', [['S', 'S · no rule'], ['S2', 'S2 · 20'], ['S3', 'S3 · 24'], ['S5', 'S5 · 32'], ['S6', 'S6 · 40']]],
  phone: ['P16', [['P16', 'P16'], ['P20', 'P20'], ['P24', 'P24'], ['P32', 'P32']]],
  dots: ['N1', [['N1', 'Dotted (as built)'], ['D5', 'None (D5)'], ['N2', 'Inset (N2)']]],
};
const pg9Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(PG9_KEY) || '{}'); } catch (e) {}
  return Object.fromEntries(Object.entries(PG9_ROWS).map(([k, [d, opts]]) => [k, opts.some((o) => o[0] === v[k]) ? v[k] : d])); };
const pg9Apply = (v) => { const h = document.documentElement;
  [...h.classList].filter((c) => c.startsWith('v9-')).forEach((c) => h.classList.remove(c));
  Object.entries(v).forEach(([k, x]) => h.classList.add('v9-' + k + '-' + x)); };
pg9Apply(pg9Get());

// The bar: fixed at the top of the window, in place of the top bar's Discover / Library / History links (hidden here).
const Pg9Bar = () => {
  const [v, setV] = React.useState(pg9Get);
  const set = (k, x) => { const n = { ...v, [k]: x }; try { localStorage.setItem(PG9_KEY, JSON.stringify(n)); } catch (e) {} pg9Apply(n); setV(n); };
  const G = ({ k, label }) => (
    <div className="pg9-grp" role="group" aria-label={label}><span className="pg9-lab">{label}</span>
      {PG9_ROWS[k][1].map(([x, l]) => <button key={x} type="button" className="pg9-chip" aria-pressed={v[k] === x} onClick={() => set(k, x)}>{l}</button>)}</div>);
  return (
    <div className="pg9-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pg9-eyebrow">DAILY WORD v9</span>
      <G k="mode" label="Rule" />{v.mode === 'pick' && <><G k="side" label="Desktop" /><G k="phone" label="Phone" /></>}<G k="dots" label="Hint marks" />
    </div>);
};
(() => { const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Pg9Bar />); })();

{ const b = window.buildStates; if (b) window.buildStates = (api) => { window.pg9Api = api; return b(api); }; }
// Opens on the hard play, signed in with the Pass (as v7).
let pg9Opened = false;
window.KitCandidate = {
  bind() {
    if (pg9Opened) return; pg9Opened = true;
    setTimeout(() => {
      const a = window.gsApi; a.setView('pass'); a.setConnected(true); a.go('word', { page: 'record' }, 'pass');
      setTimeout(() => { window.gsApi.setReview({ week: 'done' }); setTimeout(() => window.gsApi.go('session', { id: 'word-hard' }), 0); }, (window.GS_LOAD_MS || 600) + 100);
    }, 0);
  },
};
