// ============================================================================
// Kit — the QA list (PROTOTYPE AID, not part of the product). DRAFT:
// the shape is still being iterated on.
//
// The launcher's third half. A short, ephemeral walk-through of the states a
// piece of work in flight needs checking against. It holds NO staging of its
// own: every step is a state id from the register (app/states.jsx), so a QA
// entry can never drift from what the States palette opens.
//
// One entry per piece of work. Several can be in flight at once.
// CLEARING: delete the entry. The states themselves stay in the register.
// When the list is empty the button stays and the panel shows its empty state.
//
// A step whose id is not in the register shows as stale rather than failing
// silently. Deletable: config.jsx guards on window.QaPalette.
// ============================================================================
// Entry shape: { key, title, note?, only?, steps: ['state-id', ...] }
// `only` names a window handle; the entry shows only when it is present, so a
// candidate build's walk-through stays out of the main build.
const KIT_QA = [
  {
    key: 'placeholder-walk-through', title: 'Placeholder walk-through',
    note: 'An example entry. 1. The screen with nothing on it. 2. The screen with items. Replace it with the states a piece of work in flight needs checking against.',
    steps: ['empty', 'with-items'],
  },
];
const kitQaShown = () => KIT_QA.filter((w) => !w.only || !!window[w.only]);

const { useState: useQaState, useEffect: useQaEffect } = React;

const QaPalette = ({ statesGroups, onGo, onClose }) => {
  const [shown, setShown] = useQaState(false);
  const labels = {};
  (statesGroups || []).forEach((g) => g.items.forEach((s) => { labels[s.id] = s.label; }));

  useQaEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  useQaEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  useQaEffect(kitLockScroll, []);

  return (
    <div className="kit-config-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="QA" className="kit-config-modal"
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'scale(1)' : 'scale(0.97)' }}>
        <div className="kit-config-head">
          <div>
            <div className="kit-config-title">QA</div>
            <div className="kit-config-subtitle">Work in progress. The states to check for work in flight, in order.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="kit-config-close"><Icon name="x" size={18} /></button>
        </div>
        <div className="kit-config-body">
          {kitQaShown().length === 0 && (
            <div className="kit-config-hint" style={{ margin: 0 }}>Nothing to check right now.</div>
          )}
          {kitQaShown().map((w) => (
            <div key={w.key} className="kit-qa-work">
              <div className="kit-config-group-title">{w.title}</div>
              {w.note && <div className="kit-config-hint" style={{ margin: '4px 0 8px' }}>{w.note}</div>}
              <ol className="kit-qa-steps">
                {w.steps.map((id, i) => {
                  const label = labels[id];
                  return (
                    <li key={id}>
                      {label
                        ? <button className="kit-states-jump" onClick={() => onGo(id)}>
                            <span className="kit-states-label">{(i + 1) + '. ' + label}</span>
                            <span className="kit-states-id">?state={id}</span>
                          </button>
                        : <div className="kit-qa-stale">
                            <span className="kit-states-label">{(i + 1) + '. Not in the register'}</span>
                            <span className="kit-states-id">?state={id}</span>
                          </div>}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
          <div className="kit-states-foot">
            <div className="kit-config-hint" style={{ margin: 0 }}>
              This list is temporary. Each entry lives in app/qa.jsx and is deleted once its work is signed off; the states stay.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { KIT_QA, QaPalette });
