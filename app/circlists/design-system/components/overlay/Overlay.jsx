// The three overlay kinds of ui-design.md § Responsive and adaptive design.
// Dialog and Menu keep one shape at every width; only Panel changes shape on a phone.
// Motion and pseudo-states live in components/components.css (.circ-ov-*).

const FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

// Focus contract shared by every kind: take focus on open, trap Tab (modal kinds),
// Escape closes, focus returns to the opener on close (ui-design.md § Focus restoration).
function useOverlayFocus(ref, open, onClose, { initialFocusRef, trap = true, restoreTo } = {}) {
  React.useEffect(() => {
    if (!open) return;
    const opener = (restoreTo && restoreTo.current) || document.activeElement;
    const el = ref.current;
    const first = (initialFocusRef && initialFocusRef.current) || (el && el.querySelector(FOCUSABLE)) || el;
    first && first.focus && first.focus();
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); onClose && onClose(); return; }
      if (trap && e.key === 'Tab' && el) {
        const f = [...el.querySelectorAll(FOCUSABLE)];
        if (!f.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (opener && opener.focus && document.contains(opener)) opener.focus();
    };
  }, [open]);
}

function useOutsidePress(open, refs, onClose) {
  React.useEffect(() => {
    if (!open) return;
    function onDown(e) { if (!refs.some(r => r && r.current && r.current.contains(e.target))) onClose && onClose(); }
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [open]);
}

function useWide(breakpoint, force) {
  const q = '(min-width: ' + breakpoint + 'px)';
  const [wide, setWide] = React.useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  React.useEffect(() => {
    const m = window.matchMedia(q); const f = () => setWide(m.matches);
    m.addEventListener('change', f); f();
    return () => m.removeEventListener('change', f);
  }, [q]);
  return force === 'sheet' ? false : force === 'desktop' ? true : wide;
}

const titleStyle = { font: '600 var(--text-2xl)/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: 0, textWrap: 'balance' };
const bodyStyle = { font: '400 15px/1.55 var(--font-sans)', color: 'var(--color-fg-2)', margin: '8px 0 0', textWrap: 'pretty' };

function Scrim({ contained, onPress, align = 'center', children }) {
  return (
    <div className="circ-ov-fade" onPointerDown={e => { if (e.target === e.currentTarget) onPress && onPress(); }}
      style={{ position: contained ? 'absolute' : 'fixed', inset: 0, background: 'var(--color-scrim)', zIndex: 50,
        display: 'flex', justifyContent: 'center', alignItems: align === 'bottom' ? 'flex-end' : 'center',
        padding: align === 'bottom' ? 0 : 'var(--space-4)' }}>
      {children}
    </div>
  );
}

/** One entry point with the kind as its input. Only kind="panel" ever swaps to a sheet. */
export function Overlay({ kind = 'dialog', ...props }) {
  return kind === 'menu' ? <Menu {...props} /> : kind === 'panel' ? <Panel {...props} /> : <Dialog {...props} />;
}

let uid = 0;
function useId(p) { const r = React.useRef(null); if (!r.current) r.current = p + '-' + (++uid); return r.current; }

/** Dialog: one question or one short edit. Centred at every width, never scrolls, never a sheet. */
export function Dialog({ open = true, onClose, title, description, children, actions, initialFocusRef, width = 400, contained = false, style }) {
  const ref = React.useRef(null);
  const tid = useId('circ-dlg-t'), did = useId('circ-dlg-d');
  useOverlayFocus(ref, open, onClose, { initialFocusRef });
  if (!open) return null;
  return (
    <Scrim contained={contained} onPress={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={tid} aria-describedby={description ? did : undefined}
        className="circ-ov-pop" tabIndex={-1}
        style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-overlay)',
          padding: 'var(--space-6)', width: '100%', maxWidth: width, boxSizing: 'border-box', overflow: 'hidden', outline: 'none', ...(style || {}) }}>
        <h2 id={tid} style={titleStyle}>{title}</h2>
        {description && <p id={did} style={bodyStyle}>{description}</p>}
        {children && <div style={{ marginTop: 'var(--space-4)' }}>{children}</div>}
        {actions && <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>{actions}</div>}
      </div>
    </Scrim>
  );
}

/** Menu: a short list of commands at its control. Place it beside the trigger inside a
 *  position:relative wrapper; it opens there at every width. Choosing an item closes it. */
export function Menu({ open = true, onClose, anchorRef, label, align = 'end', children, width = 220, style }) {
  const ref = React.useRef(null);
  useOverlayFocus(ref, open, onClose, { trap: false, restoreTo: anchorRef });
  useOutsidePress(open, [ref, anchorRef], onClose);
  if (!open) return null;
  function onKey(e) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const items = [...ref.current.querySelectorAll('[role^="menuitem"]')];
    const i = items.indexOf(document.activeElement);
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[n] && items[n].focus();
  }
  return (
    <div ref={ref} role="menu" aria-label={label} onKeyDown={onKey} className="circ-ov-pop"
      onClick={e => { if (e.target.closest('[role^="menuitem"]')) onClose && onClose(); }}
      style={{ position: 'absolute', top: 'calc(100% + 4px)', [align === 'end' ? 'right' : 'left']: 0, zIndex: 40,
        width, background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-raised)', padding: 4, boxSizing: 'border-box', ...(style || {}) }}>
      {children}
    </div>
  );
}

export function MenuItem({ icon, destructive = false, onClick, children, checked }) {
  const role = checked === undefined ? 'menuitem' : 'menuitemcheckbox';
  return (
    <button type="button" role={role} aria-checked={checked} onClick={onClick} className="circ-ov-item" tabIndex={-1}
      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, padding: '0 12px', border: 0,
        background: 'transparent', borderRadius: 'var(--radius-md)', font: '500 14px var(--font-sans)', cursor: 'pointer', textAlign: 'left',
        color: destructive ? 'var(--color-destructive)' : 'var(--color-fg-1)' }}>
      {icon}{children}
    </button>
  );
}

export function MenuSeparator() {
  return <div role="separator" style={{ height: 1, background: 'var(--color-border-2)', margin: '4px 8px' }}></div>;
}

/** Panel: anything the user stays in and works with. A bottom sheet below `breakpoint`;
 *  at and above it, anchored to its control (popover, no scrim) or centred (modal, scrim). */
export function Panel({ open = true, onClose, title, children, footer, breakpoint = 640, desktop = 'centred', anchorRef,
  force = 'auto', width = 400, contained = false, align = 'end', style }) {
  const ref = React.useRef(null);
  const tid = useId('circ-pnl-t');
  const wide = useWide(breakpoint, force);
  const anchored = wide && desktop === 'anchored';
  useOverlayFocus(ref, open, onClose, { trap: !anchored, restoreTo: anchorRef });
  useOutsidePress(open && anchored, [ref, anchorRef], onClose);
  React.useEffect(() => {
    if (!open || contained || anchored) return;
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = o; };
  }, [open, contained, anchored]);
  if (!open) return null;
  const head = title && (
    <div style={{ padding: 'var(--space-5) var(--space-6) 0' }}>
      <h2 id={tid} style={{ ...titleStyle, fontSize: 'var(--text-xl)' }}>{title}</h2>
    </div>
  );
  const body = <div style={{ padding: 'var(--space-4) var(--space-6)', overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>{children}</div>;
  const foot = footer && <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 'var(--space-2)', padding: '0 var(--space-6) var(--space-5)' }}>{footer}</div>;
  const box = {
    background: 'var(--color-surface)', boxShadow: 'var(--shadow-overlay)', display: 'flex', flexDirection: 'column',
    boxSizing: 'border-box', outline: 'none', overflow: 'hidden',
  };
  const a11y = { role: 'dialog', 'aria-labelledby': title ? tid : undefined, tabIndex: -1 };
  if (anchored) {
    return (
      <div ref={ref} {...a11y} className="circ-ov-pop"
        style={{ ...box, position: 'absolute', top: 'calc(100% + 8px)', [align === 'end' ? 'right' : 'left']: 0, zIndex: 40,
          width, maxHeight: 'min(560px, 70vh)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', ...(style || {}) }}>
        {head}{body}{foot}
      </div>
    );
  }
  return (
    <Scrim contained={contained} onPress={onClose} align={wide ? 'center' : 'bottom'}>
      <div ref={ref} {...a11y} aria-modal="true" className={wide ? 'circ-ov-pop' : 'circ-ov-sheet'}
        style={wide
          ? { ...box, width: '100%', maxWidth: width, maxHeight: '85%', borderRadius: 'var(--radius-lg)', ...(style || {}) }
          : { ...box, width: '100%', maxHeight: '85%', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              paddingBottom: 'env(safe-area-inset-bottom)', ...(style || {}) }}>
        {head}{body}{foot}
      </div>
    </Scrim>
  );
}
