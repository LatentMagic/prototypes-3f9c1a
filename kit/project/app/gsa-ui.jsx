// ============================================================================
// Golden Sample App - shared UI. Buttons, fields, form hook, dialog, menu,
// card, status line, slot/pick marks, loading helpers, demo dates.
// Styles: gsa.css. No other gsa file redefines these.
// ============================================================================

const gsaCx = (...parts) => parts.filter(Boolean).join(' ');

// ---- Button ----------------------------------------------------------------
// busy shows a working state and drops presses; the target is 44px (gsa.css).
const GsaButton = React.forwardRef(function GsaButton(props, ref) {
  const { kind = 'primary', busy = false, disabled = false, onClick, children, type = 'button', className } = props;
  const rest = gsaOmit(props, ['kind', 'busy', 'disabled', 'onClick', 'children', 'type', 'className']);
  const press = (e) => {
    if (busy || disabled) { e.preventDefault(); return; }
    if (onClick) onClick(e);
  };
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={gsaCx('gsa-btn', className)}
      data-kind={kind}
      aria-busy={busy ? 'true' : undefined}
      disabled={disabled || undefined}
      aria-disabled={busy ? 'true' : undefined}
      onClick={press}
    >
      {busy ? <span className="gsa-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});

// ---- Field -----------------------------------------------------------------
function GsaField(props) {
  const { label, error, hint, id, className } = props;
  const input = gsaOmit(props, ['label', 'error', 'hint', 'id', 'className']);
  const auto = React.useId();
  const fieldId = id || 'gsa-field-' + auto.replace(/:/g, '');
  const describedBy = [error ? fieldId + '-error' : null, hint ? fieldId + '-hint' : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={gsaCx('gsa-field', className)}>
      {label ? <label className="gsa-field-label" htmlFor={fieldId}>{label}</label> : null}
      <input
        {...input}
        id={fieldId}
        className="gsa-field-input"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
      />
      {hint ? <div className="gsa-field-hint" id={fieldId + '-hint'}>{hint}</div> : null}
      {error ? <div className="gsa-field-error" id={fieldId + '-error'}>{error}</div> : null}
    </div>
  );
}

// ---- Code field: one six-digit field. onChange receives the digits string. --
function GsaCodeField(props) {
  const { value = '', onChange, error, label, id } = props;
  const rest = gsaOmit(props, ['value', 'onChange', 'error', 'label', 'id']);
  const handle = (e) => {
    const raw = e && e.target ? e.target.value : e;
    if (onChange) onChange(String(raw || '').replace(/\D/g, '').slice(0, 6));
  };
  return (
    <GsaField
      {...rest}
      id={id}
      label={label}
      error={error}
      className="gsa-code-field"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      pattern="[0-9]*"
      value={value}
      onChange={handle}
    />
  );
}

// ---- Form hook -------------------------------------------------------------
// rules: { name: (value, values) => error | null }. Errors stay hidden until
// the first submit, then follow input live. A refused submit focuses the first
// invalid field (rules order, which is the field order).
function useGsaForm(rules) {
  const [values, setValues] = React.useState(() => Object.keys(rules).reduce((acc, k) => ({ ...acc, [k]: '' }), {}));
  const [submitted, setSubmitted] = React.useState(false);
  const computeErrors = (v) => Object.keys(rules).reduce((acc, k) => {
    const msg = rules[k](v[k], v);
    return msg ? { ...acc, [k]: msg } : acc;
  }, {});
  const live = computeErrors(values);
  const errors = submitted ? live : {};
  const fieldId = (name) => 'gsa-form-' + name;
  const bind = (name) => ({
    id: fieldId(name),
    name,
    value: values[name] === undefined ? '' : values[name],
    error: errors[name],
    onChange: (e) => {
      const next = e && e.target ? e.target.value : e;
      setValues((prev) => ({ ...prev, [name]: next }));
    },
  });
  const submit = (onValid) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitted(true);
    const first = Object.keys(rules).find((k) => live[k]);
    if (first) {
      const el = document.getElementById(fieldId(first));
      if (el) el.focus({ preventScroll: false });
      return;
    }
    if (onValid) onValid(values);
  };
  return { values, errors, bind, submit };
}

// ---- Dialog ----------------------------------------------------------------
// Centred at every width, fixed content that never scrolls. Focus goes to the
// dialog on open and back to the opener on close. It renders into the Frame's
// overlay root, a sibling of the container the screens are laid out in, so no
// container ancestor captures its position: fixed (GOTCHA 3). Without a Frame
// (bare routes) it renders in place.
function GsaDialog({ title, onClose, children, actions }) {
  const ref = React.useRef(null);
  const [host, setHost] = React.useState(null);
  React.useLayoutEffect(() => { setHost(document.getElementById('gsa-overlay-root') || false); }, []);
  const titleId = 'gsa-dialog-title-' + React.useId().replace(/:/g, '');
  React.useEffect(kitLockScroll, []);
  React.useEffect(() => {
    if (host === null) return undefined;
    const opener = document.activeElement;
    if (ref.current) ref.current.focus({ preventScroll: true });
    return () => {
      if (opener && opener.isConnected && opener.focus) opener.focus({ preventScroll: true });
    };
  }, [host]);
  const keys = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); if (onClose) onClose(); return; }
    if (e.key !== 'Tab' || !ref.current) return;
    const stops = ref.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!stops.length) { e.preventDefault(); return; }
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  if (host === null) return null;
  const scrim = (
    <div className="gsa-dialog-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div ref={ref} className="gsa-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={keys}>
        <h2 className="gsa-dialog-title" id={titleId}>{title}</h2>
        <div className="gsa-dialog-body">{children}</div>
        {actions ? <div className="gsa-dialog-actions">{actions}</div> : null}
      </div>
    </div>
  );
  return host ? ReactDOM.createPortal(scrim, host) : scrim;
}

// ---- Menu: opens at its control; choosing an item runs it and closes -------
function GsaMenu({ label, items = [] }) {
  const [open, setOpen] = React.useState(false);
  const [align, setAlign] = React.useState('start');
  const wrap = React.useRef(null);
  const trigger = React.useRef(null);
  const listId = 'gsa-menu-' + React.useId().replace(/:/g, '');
  const close = (restore) => {
    setOpen(false);
    if (restore && trigger.current) trigger.current.focus({ preventScroll: true });
  };
  const toggle = () => {
    if (!open && wrap.current) {
      const box = wrap.current.getBoundingClientRect();
      const host = wrap.current.closest('.kit-phone-screen');
      const bounds = host ? host.getBoundingClientRect() : { left: 0, right: window.innerWidth };
      setAlign(box.left + box.width / 2 > (bounds.left + bounds.right) / 2 ? 'end' : 'start');
    }
    setOpen(!open);
  };
  React.useEffect(() => {
    if (!open) return undefined;
    const first = wrap.current && wrap.current.querySelector('[role="menuitem"]');
    if (first) first.focus({ preventScroll: true });
    const away = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);
  const keys = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(true); return; }
    if (e.key === 'Tab') { setOpen(false); return; }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const nodes = Array.from(wrap.current.querySelectorAll('[role="menuitem"]'));
    const at = nodes.indexOf(document.activeElement);
    const next = e.key === 'ArrowDown' ? (at + 1) % nodes.length : (at - 1 + nodes.length) % nodes.length;
    if (nodes[next]) nodes[next].focus({ preventScroll: true });
  };
  return (
    <div className="gsa-menu" ref={wrap} onKeyDown={open ? keys : undefined}>
      <GsaButton kind="secondary" ref={trigger} onClick={toggle} aria-haspopup="menu" aria-expanded={open ? 'true' : 'false'} aria-controls={open ? listId : undefined}>
        <span className="gsa-menu-label">{label}</span>
      </GsaButton>
      {open ? (
        <ul className="gsa-menu-list" id={listId} role="menu" data-align={align}>
          {items.map((item, i) => (
            <li key={i} role="none">
              <button type="button" role="menuitem" className="gsa-menu-item" onClick={() => { close(true); if (item.onSelect) item.onSelect(); }}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

// ---- Card, status line, marks ----------------------------------------------
function GsaCard({ title, children }) {
  return (
    <section className="gsa-card">
      {title ? <h2 className="gsa-card-title">{title}</h2> : null}
      {children}
    </section>
  );
}

function GsaStatusLine({ tone = 'neutral', children }) {
  return <div className="gsa-status" role="status" data-tone={tone}>{children}</div>;
}

function GsaSlot({ children }) {
  return <div className="gsa-slot"><span className="gsa-slot-prefix">Slot: </span>{children}</div>;
}

function GsaPick({ children }) {
  return <span>{children}<span className="gsa-pick-tag">Placeholder</span></span>;
}

// ---- Loading ---------------------------------------------------------------
// Withhold 300 ms so a quick wait never flashes a spinner. The 600 ms hold is
// kept by useGsaBusy, whose default 900 ms is withhold plus hold.
function GsaSpin() {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShown(true), 300);
    return () => clearTimeout(t);
  }, []);
  if (!shown) return null;
  return <div className="gsa-spin-wrap" role="status" aria-label="Loading"><span className="gsa-spin" aria-hidden="true" /></div>;
}

function GsaLoadFailed({ onRetry }) {
  return (
    <div className="gsa-load-failed" role="alert">
      <p>This could not be loaded.</p>
      <GsaButton kind="secondary" onClick={onRetry}>Try again</GsaButton>
    </div>
  );
}

// [busy, run(fn)]: run holds busy for ms, then calls fn. A press while busy is dropped.
function useGsaBusy(ms = 900) {
  const [busy, setBusy] = React.useState(false);
  const held = React.useRef(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const run = React.useCallback((fn) => {
    if (held.current) return;
    held.current = true;
    setBusy(true);
    timer.current = setTimeout(() => {
      held.current = false;
      setBusy(false);
      if (fn) fn();
    }, ms);
  }, [ms]);
  return [busy, run];
}

// ---- Demo dates ------------------------------------------------------------
function gsaDay0() {
  const d = window.GSA_DAY0;
  if (d instanceof Date) return d;
  if (typeof d === 'string' && !isNaN(Date.parse(d))) return new Date(d);
  return new Date(Date.UTC(2026, 9, 16));
}
function gsaDate(days) {
  return new Date(gsaDay0().getTime() + days * 86400000);
}
function gsaLong(date) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

Object.assign(window, {
  GsaButton, GsaField, GsaCodeField, useGsaForm, GsaDialog, GsaMenu, GsaCard,
  GsaStatusLine, GsaSlot, GsaPick, GsaSpin, GsaLoadFailed, useGsaBusy, gsaDate, gsaLong,
});
