// ============================================================================
// Circlists — the states palette + the states index (PROTOTYPE AID).
//
// Both are DERIVED views of the register in app/states.jsx and hold no list of
// their own:
//   StatesPalette — over the app, from the launcher's second half. Search, jump,
//                   copy a link to any state.
//   StatesIndex   — a page. What `?state=index` opens, and where a name that is
//                   not in the register lands: the reader sees a catalogue that
//                   does not contain the name they came for, which is the whole
//                   message. No warning chrome, no product surface touched.
//
// Deleting this file (with app/states.jsx) removes both; main.jsx guards on
// window.StatesIndex and config.jsx on window.StatesPalette.
// ============================================================================
const { useState: useStState, useEffect: useStEffect, useMemo: useStMemo, useRef: useStRef } = React;

// ---- one row, shared by both views -----------------------------------------
const StatesRow = ({ state, onGo }) => {
  const [copied, setCopied] = useStState(null);
  const copy = async () => {
    const url = window.circStateLink(state.id);
    let ok = false;
    try { await navigator.clipboard.writeText(url); ok = true; } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e2) { ok = false; }
    }
    // The link is shown either way: copied, so it can be read back; not copied,
    // so it can still be taken by hand.
    setCopied({ ok, url });
  };
  return (
    <div className="circ-states-item">
      <div className="circ-states-row">
        <button className="circ-states-jump" onClick={() => onGo(state.id)}>
          <span className="circ-states-label">{state.label}</span>
          <span className="circ-states-id">?state={state.id}</span>
        </button>
        <button className="circ-states-copy" onClick={copy} title="Copy link to this state"
          aria-label={'Copy link to ' + state.label}>
          <Icon name={copied && copied.ok ? 'check' : 'link'} size={15} />
        </button>
      </div>
      {copied && (
        <div className="circ-states-copied">
          <span>{copied.ok ? 'Copied' : 'Copy by hand'}</span>
          <input readOnly value={copied.url} onFocus={(e) => e.target.select()} />
        </div>
      )}
    </div>
  );
};

const StatesGroups = ({ groups, onGo }) => (
  <div className="circ-states-groups">
    {groups.map((g) => (
      <div className="circ-states-group" key={g.title}>
        <div className="circ-config-group-title">{g.title}</div>
        {g.items.map((s) => <StatesRow key={s.id} state={s} onGo={onGo} />)}
      </div>
    ))}
  </div>
);

const circFilterGroups = (groups, q) => {
  const t = q.trim().toLowerCase();
  if (!t) return groups;
  return groups
    .map((g) => ({ title: g.title, items: g.items.filter((s) => (s.label + ' ' + s.id + ' ' + g.title).toLowerCase().includes(t)) }))
    .filter((g) => g.items.length > 0);
};

// ---- the palette -----------------------------------------------------------
const StatesPalette = ({ groups, onGo, onOpenIndex, onClose }) => {
  const [q, setQ] = useStState('');
  const [shown, setShown] = useStState(false);
  const fieldRef = useStRef(null);
  const filtered = useStMemo(() => circFilterGroups(groups, q), [groups, q]);

  useStEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  useStEffect(() => { if (fieldRef.current) fieldRef.current.focus(); }, []);
  useStEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  // Lock whatever is scrolling behind (the phone screen when forced-mobile,
  // otherwise the document) — same as the Config modal.
  useStEffect(() => {
    const scroller = document.querySelector('.circ-phone-screen') || document.scrollingElement || document.documentElement;
    const prev = scroller.style.overflow;
    scroller.style.overflow = 'hidden';
    return () => { scroller.style.overflow = prev; };
  }, []);

  return (
    <div className="circ-config-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="States" className="circ-config-modal"
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'scale(1)' : 'scale(0.97)' }}>
        <div className="circ-config-head">
          <div>
            <div className="circ-config-title">States</div>
            <div className="circ-config-subtitle">Every staged state of the app. Jump to one, or copy its link.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="circ-config-close"><Icon name="x" size={18} /></button>
        </div>
        <div className="circ-config-body">
          <input ref={fieldRef} className="circ-states-search" type="search" value={q}
            onChange={(e) => setQ(e.target.value)} placeholder="Search states" aria-label="Search states" />
          {filtered.length === 0
            ? <div className="circ-config-hint" style={{ margin: '14px 0 0' }}>Nothing matches “{q}”.</div>
            : <StatesGroups groups={filtered} onGo={onGo} />}
          <div className="circ-states-foot">
            <div className="circ-config-hint" style={{ margin: 0 }}>
              A link opens the app at that state. The names live in the register (app/states.jsx); a name
              that is not in it lands on the index.
            </div>
            <button className="circ-config-btn-secondary" onClick={onOpenIndex}>Open the states index</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- the index -------------------------------------------------------------
const StatesIndex = ({ reason, groups, onGo, onDismiss }) => {
  const [q, setQ] = useStState('');
  const filtered = useStMemo(() => circFilterGroups(groups, q), [groups, q]);
  const unresolved = reason && reason.kind === 'unresolved' ? reason.name : null;
  return (
    <div className="circ-index">
      <div className="circ-index-inner">
        <div className="circ-index-eyebrow">Circlists prototype</div>
        <h1 className="circ-index-title">States</h1>
        <p className="circ-index-lede">
          Every state this prototype can be opened at. Each one has an address, so a ticket can point
          straight at it: add <code>?state=&lt;name&gt;</code> to this page.
        </p>
        {unresolved && (
          <p className="circ-index-note">
            Nothing is registered under <code>{unresolved}</code>. It has been renamed or removed since
            that link was written — the current names are below.
          </p>
        )}
        <div className="circ-index-bar">
          <input className="circ-states-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search states" aria-label="Search states" />
          <button className="circ-config-btn-secondary" onClick={onDismiss}>Continue to the app</button>
        </div>
        {filtered.length === 0
          ? <div className="circ-config-hint">Nothing matches “{q}”.</div>
          : <StatesGroups groups={filtered} onGo={onGo} />}
      </div>
    </div>
  );
};

Object.assign(window, { StatesPalette, StatesIndex, StatesRow, StatesGroups });
