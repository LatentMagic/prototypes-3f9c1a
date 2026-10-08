// ============================================================================
// Kit — the states palette + the states index (PROTOTYPE AID).
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
    const url = window.kitStateLink(state.id);
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
    <div className="kit-states-item">
      <div className="kit-states-row">
        <button className="kit-states-jump" onClick={() => onGo(state.id)}>
          <span className="kit-states-label">{state.label}</span>
          <span className="kit-states-id">?state={state.id}</span>
        </button>
        <button className="kit-states-copy" onClick={copy} title="Copy link to this state"
          aria-label={'Copy link to ' + state.label}>
          <Icon name={copied && copied.ok ? 'check' : 'link'} size={15} />
        </button>
      </div>
      {copied && (
        <div className="kit-states-copied">
          <span>{copied.ok ? 'Copied' : 'Copy by hand'}</span>
          <input readOnly value={copied.url} onFocus={(e) => e.target.select()} />
        </div>
      )}
    </div>
  );
};

// Each group collapses, and starts collapsed. Open/closed is
// not remembered. A search
// opens every group it matches, or the matches would sit hidden.
// A group's `notes` (per group, from KIT_STATE_GROUP_NOTES) sit at its foot.
const StatesGroups = ({ groups, onGo, forceOpen = false }) => {
  const [open, setOpen] = useStState({});
  return (
    <div className="kit-states-groups">
      {groups.map((g) => {
        const isOpen = forceOpen || !!open[g.title];
        const bodyId = 'kit-states-g-' + g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          <div className="kit-states-group" key={g.title}>
            <button type="button" className="kit-states-group-head" aria-expanded={isOpen} aria-controls={bodyId}
              onClick={() => setOpen((p) => ({ ...p, [g.title]: !isOpen }))} disabled={forceOpen}>
              <span className="kit-config-group-title">{g.title}</span>
              <span className="kit-states-group-count">{g.items.length}</span>
              <span className="kit-states-group-chev" aria-hidden="true" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                <Icon name="chevron-down" size={16} />
              </span>
            </button>
            {isOpen && (
              <div id={bodyId}>
                <div className="kit-states-group-body">
                  {g.items.map((s) => <StatesRow key={s.id} state={s} onGo={onGo} />)}
                </div>
                {g.notes && g.notes.length > 0 && (
                  <div className="kit-states-notes">
                    <div className="kit-states-notes-title">Notes</div>
                    <ul>{g.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const kitFilterGroups = (groups, q) => {
  const t = q.trim().toLowerCase();
  if (!t) return groups;
  return groups
    .map((g) => ({ title: g.title, notes: g.notes, items: g.items.filter((s) => (s.label + ' ' + s.id + ' ' + g.title).toLowerCase().includes(t)) }))
    .filter((g) => g.items.length > 0);
};

// ---- the palette -----------------------------------------------------------
const StatesPalette = ({ groups, onGo, onOpenIndex, onClose }) => {
  const [q, setQ] = useStState('');
  const [shown, setShown] = useStState(false);
  const fieldRef = useStRef(null);
  const filtered = useStMemo(() => kitFilterGroups(groups, q), [groups, q]);

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
  // Lock whatever is scrolling behind — same as the Config modal.
  useStEffect(kitLockScroll, []);

  return (
    <div className="kit-config-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="States" className="kit-config-modal" data-shown={shown ? '1' : undefined}
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'scale(1)' : 'scale(0.97)' }}>
        <div className="kit-config-head">
          <div>
            <div className="kit-config-title">States</div>
            <div className="kit-config-subtitle">Every staged state of the app. Jump to one, or copy its link.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="kit-config-close"><Icon name="x" size={18} /></button>
        </div>
        <div className="kit-config-body">
          <input ref={fieldRef} className="kit-states-search" type="search" value={q}
            onChange={(e) => setQ(e.target.value)} placeholder="Search states" aria-label="Search states" />
          {filtered.length === 0
            ? <div className="kit-config-hint" style={{ margin: '14px 0 0' }}>Nothing matches “{q}”.</div>
            : <StatesGroups groups={filtered} onGo={onGo} forceOpen={!!q.trim()} />}
          <div className="kit-states-foot">
            <div className="kit-config-hint" style={{ margin: 0 }}>
              A link opens the app at that state. The names live in the register (app/states.jsx); a name
              that is not in it lands on the index.
            </div>
            <button className="kit-config-btn-secondary" onClick={onOpenIndex}>Open the states index</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- the index -------------------------------------------------------------
const StatesIndex = ({ reason, groups, onGo, onDismiss }) => {
  const [q, setQ] = useStState('');
  const filtered = useStMemo(() => kitFilterGroups(groups, q), [groups, q]);
  const unresolved = reason && reason.kind === 'unresolved' ? reason.name : null;
  return (
    <div className="kit-index">
      <div className="kit-index-inner">
        <div className="kit-index-eyebrow">Prototype</div>
        <h1 className="kit-index-title">States</h1>
        <p className="kit-index-lede">
          Every state this prototype can be opened at. Each one has an address, so a ticket can point
          straight at it: add <code>?state=&lt;name&gt;</code> to this page.
        </p>
        {unresolved && (
          <p className="kit-index-note">
            Nothing is registered under <code>{unresolved}</code>. It has been renamed or removed since
            that link was written — the current names are below.
          </p>
        )}
        <div className="kit-index-bar">
          <input className="kit-states-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search states" aria-label="Search states" />
          <button className="kit-config-btn-secondary" onClick={onDismiss}>Continue to the app</button>
        </div>
        {filtered.length === 0
          ? <div className="kit-config-hint">Nothing matches “{q}”.</div>
          : <StatesGroups groups={filtered} onGo={onGo} forceOpen={!!q.trim()} />}
      </div>
    </div>
  );
};

Object.assign(window, { StatesPalette, StatesIndex, StatesRow, StatesGroups });
