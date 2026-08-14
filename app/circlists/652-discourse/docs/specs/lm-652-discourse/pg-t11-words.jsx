// ============================================================================
// v11 — the shared parts every option is built from.
//
// The register of the thought is a lever, so the words themselves are ONE
// component: each option hands it a size, a colour and a weight, and nothing
// else about how the words are set differs by accident. Bullets are set as a
// real list, because the case nothing has held is a paragraph with a few of them.
//
// No quotation marks anywhere, and nothing above the title in any option.
// ============================================================================

// The words, whole. `tight` is the recessed register (a slip, a strip); the
// default is the card's own ink.
const T11Words = ({ t, size = 14.5, lh = 1.55, color = 'var(--color-fg-1)', weight = 400, gap = 8 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>
    <p style={{ margin: 0, font: weight + ' ' + size + 'px/' + lh + ' var(--font-sans)', color, textWrap: 'pretty' }}>{t.text}</p>
    {t.bullets && (
      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5,
        font: weight + ' ' + (size - 0.5) + 'px/' + lh + ' var(--font-sans)', color, listStyleType: 'disc' }}>
        {t.bullets.map((b, i) => <li key={i} style={{ textWrap: 'pretty' }}><span style={{ position: 'relative', left: 1 }}>{b}</span></li>)}
      </ul>
    )}
  </div>
);

// The closed budget, made mechanical: measure the words, hold them at `closedPx`
// while shut, and travel to their real height on open. The soft edge only paints
// while something is actually being held back.
const T11Clip = ({ open, closedPx, fade = true, dur = 320, children }) => {
  const inner = React.useRef(null);
  const [h, setH] = React.useState(0);
  React.useLayoutEffect(() => {
    const measure = () => { if (inner.current) setH(inner.current.scrollHeight); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children]);
  const held = !open && h > closedPx + 2;
  const mask = held && fade ? 'linear-gradient(to bottom, #000 40%, rgba(0,0,0,0.15) 88%, transparent 100%)' : 'none';
  return (
    <div style={{ maxHeight: open ? (h ? h + 'px' : 'none') : closedPx + 'px', overflow: 'hidden',
      transition: 'max-height ' + dur + 'ms var(--ease-quiet)',
      maskImage: mask, WebkitMaskImage: mask }}>
      <div ref={inner}>{children}</div>
    </div>
  );
};

// The byline that trails the words. Never a label, never a prompt: a name.
const T11Byline = ({ t, quiet, children }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
    <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: quiet ? 'var(--color-fg-3)' : 'var(--color-fg-2)' }}>{t.by}</span>
    {children}
  </div>
);

// The put-away and the way in are the same words in the same place, so the
// affordance never moves under the reader's finger.
const T11Fold = ({ open, more = 'Read on', less = 'Enough' }) => (
  <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-accent)' }}>{open ? less : more}</span>
);

// A whole-block way in. Buttons, because anything that acts like one reads like
// one — and the label says whose words they are.
const T11Open = ({ t, onClick, label, children, style }) => (
  <button type="button" onClick={onClick} className="circ-t11-open" aria-expanded={undefined}
    aria-label={label || ('Read what ' + t.by + ' wrote')}
    style={{ display: 'block', width: '100%', textAlign: 'left', background: 'transparent',
      borderWidth: 0, padding: 0, margin: 0, font: 'inherit', cursor: 'pointer', ...style }}>
    {children}
  </button>
);

const t11UseEsc = (on, fn) => {
  React.useEffect(() => {
    if (!on) return;
    const h = (e) => { if (e.key === 'Escape') fn(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [on, fn]);
};

// Click away closes. Pointerdown, so it fires before the card's own handlers.
const t11UseOutside = (on, ref, fn) => {
  React.useEffect(() => {
    if (!on) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) fn(); };
    const t = setTimeout(() => document.addEventListener('pointerdown', h), 0);
    return () => { clearTimeout(t); document.removeEventListener('pointerdown', h); };
  }, [on, fn]);
};

Object.assign(window, { T11Words, T11Clip, T11Byline, T11Fold, T11Open, t11UseEsc, t11UseOutside });
