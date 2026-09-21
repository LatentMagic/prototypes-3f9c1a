// The rig's own chrome: which answer the app is running, and a way to each of
// the four surfaces the answer shows up on. A floating pill at the bottom-left,
// clear of the FAB and of both bottom bars, collapsible on every viewport.
//
// Changing the answer reloads — the sizes are read at element creation, so a
// live swap would leave half the tree on the old scale.
//
// The four routes are DRIVERS: they press the app's own controls in order, the
// way a member would, and then ring the field in question. Nothing here is a
// shortcut past the product; if a route breaks, the click path has moved.
const pgWait = (ms) => new Promise(r => setTimeout(r, ms));
const pgByText = (sel, txt) => [...document.querySelectorAll(sel)].find(e => e.textContent.trim() === txt);
const pgScroller = (el) => {
  let n = el && el.parentElement;
  while (n && n !== document.body) {
    const s = getComputedStyle(n);
    if (/auto|scroll/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 4) return n;
    n = n.parentElement;
  }
  return null;
};
const pgBring = (el) => {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const sc = pgScroller(el);
  if (sc) { const sr = sc.getBoundingClientRect(); sc.scrollBy({ top: r.top - sr.top - 120, behavior: 'smooth' }); }
  else window.scrollBy({ top: r.top - 140, behavior: 'smooth' });
};
const pgRing = (el) => {
  if (!el) return;
  pgBring(el);
  el.style.transition = 'box-shadow 220ms ease';
  el.style.boxShadow = '0 0 0 3px var(--color-accent-ring)';
  setTimeout(() => { el.style.boxShadow = ''; }, 2400);
};
const pgType = (el, v) => {
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  set.call(el, v);
  el.dispatchEvent(new Event('input', { bubbles: true }));
};

const PG_DEST = [
  { n: '1', name: 'The URL slot', sub: 'Add a link \u2014 what you paste into', now: '14 mono',
    run: async () => {
      if (!document.querySelector('input[name="add-url"]')) {
        const fab = document.querySelector('[aria-label="Add a link"]');
        if (fab) fab.click();
        await pgWait(440);
      }
      const i = document.querySelector('input[name="add-url"]');
      if (i) { i.focus(); pgRing(i.parentElement); }
    } },
  { n: '2', name: 'The thought box', sub: 'the same sheet, second face', now: '15.5',
    run: async () => {
      if (!document.querySelector('input[name="add-url"]')) {
        const fab = document.querySelector('[aria-label="Add a link"]');
        if (fab) fab.click();
        await pgWait(440);
      }
      const i = document.querySelector('input[name="add-url"]');
      if (i && !i.value) pgType(i, 'https://martinfowler.com/articles/patterns-of-distributed-systems.html');
      await pgWait(140);
      const row = [...document.querySelectorAll('form[aria-label="Add a link"] button')]
        .find(b => /Say why/.test(b.textContent));
      if (row) row.click();
      await pgWait(520);
      pgRing(document.querySelector('textarea[aria-label="A thought to go with it"]'));
    } },
  { n: '3', name: 'Your thought on a card', sub: 'opens the card, then \u22ef \u2192 Edit', now: '12.5',
    run: async () => {
      const band = document.querySelector('button[aria-label^="Read what You"]');
      if (band) { pgBring(band); await pgWait(260); band.click(); }
      await pgWait(520);
      const menu = document.querySelector('[aria-label="What you said"]');
      if (menu) menu.click();
      await pgWait(180);
      const ed = pgByText('.circ-menuitem', 'Edit');
      if (ed) ed.click();
      await pgWait(320);
      pgRing(document.querySelector('textarea[aria-label="Edit what you wrote"]'));
    } },
  { n: '4', name: 'A conversation', sub: 'Read tab \u2192 the disc on a card', now: '14.5',
    run: async () => {
      const read = pgByText('button', 'Read');
      if (read) read.click();
      await pgWait(440);
      const way = document.querySelector('[aria-label^="Open this card"]');
      if (way) way.click();
      await pgWait(660);
      pgRing(document.querySelector('textarea[aria-label="Add to the conversation"]'));
    } },
];

const PgFloorStrip = () => {
  const [open, setOpen] = React.useState(false);
  const F = window.PG_FLOOR;
  const cur = F.id();
  const o = F.OPTS[cur];
  const line = { font: '400 11px/1.45 var(--font-sans)', opacity: 0.66, textWrap: 'pretty' };
  const chip = (on) => ({ border: 0, cursor: 'pointer', borderRadius: 7, padding: '0 9px', height: 28,
    font: '500 11.5px/1 var(--font-mono)', letterSpacing: '0.03em',
    background: on ? '#F5F5F2' : 'rgba(245,245,242,0.10)', color: on ? '#141413' : '#F5F5F2' });
  const go = async (d) => { setOpen(false); await pgWait(80); d.run(); };
  return (
    <div style={{ position: 'fixed', left: 12, bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', zIndex: 400,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, maxWidth: 'calc(100vw - 24px)' }}>
      {open && (
        <div style={{ background: '#141413', color: '#F5F5F2', borderRadius: 10, padding: 10, width: 296,
          maxWidth: '100%', boxShadow: '0 12px 28px rgba(10,10,10,0.28)',
          display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 7 }}>
              {F.order.map(id => (
                <button key={id} type="button" onClick={() => F.set(id)} aria-pressed={id === cur} style={chip(id === cur)}>{id}</button>
              ))}
            </div>
            <div style={{ font: '600 12.5px/1.25 var(--font-sans)' }}>{o.name}
              <span style={{ font: '400 10.5px/1.2 var(--font-sans)', opacity: 0.55 }}> &nbsp;{o.tag}</span>
            </div>
            <div style={{ font: '500 10.5px/1.5 var(--font-mono)', letterSpacing: '0.02em', opacity: 0.8 }}>{o.sizes}</div>
            <div style={{ ...line, marginTop: 3 }}>{o.note} Sizes read <em>field / words</em>.</div>
          </div>
          <div style={{ height: 1, background: 'rgba(245,245,242,0.14)' }} />
          <div>
            <div style={{ font: '600 10.5px/1 var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 6 }}>
              The four fields — tap to be taken there
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {PG_DEST.map(d => (
                <button key={d.n} type="button" onClick={() => go(d)}
                  style={{ border: 0, background: 'transparent', color: '#F5F5F2', cursor: 'pointer', textAlign: 'left',
                    borderRadius: 7, padding: '7px 8px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ font: '500 11px/1.3 var(--font-mono)', opacity: 0.5, flexShrink: 0 }}>{d.n}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', font: '500 12px/1.3 var(--font-sans)' }}>{d.name}</span>
                    <span style={{ display: 'block', ...line, opacity: 0.55 }}>{d.sub} &middot; today {d.now}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open}
        style={{ border: 0, cursor: 'pointer', borderRadius: 8, padding: '0 10px', height: 30,
          font: '500 12px/1 var(--font-mono)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 7,
          background: '#141413', color: '#F5F5F2', boxShadow: '0 6px 16px rgba(10,10,10,0.24)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: cur === '00' ? '#B98A5A' : 'var(--color-sage)' }} />
        {cur} {o.name}
      </button>
    </div>
  );
};

const pgFloorMount = document.createElement('div');
document.body.appendChild(pgFloorMount);
ReactDOM.createRoot(pgFloorMount).render(<PgFloorStrip />);
