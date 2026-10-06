// ============================================================================
// Circlists — the QA list (PROTOTYPE AID, not part of the product). DRAFT:
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
const CIRC_QA = [
  {
    key: 'auth-step-back', title: 'Sign in and Sign up: Back from the email form',
    note: 'Built 6 Oct. 1 and 2. Tap Continue with email, then the browser\u2019s Back: step one shows, focus on Continue with email. The page\u2019s back arrow does the same, and a further Back leaves the page.',
    steps: ['signin-new-device', 'signup-first-circle'],
  },
  {
    key: 'block-failure', title: 'Block and Unblock: when it fails',
    note: 'Built 6 Oct. 1. Priya\u2019s row \u2192 Block Priya \u2192 Block: the dialog stays open, "Couldn\u2019t block Priya. Try again." above the buttons; Cancel and Block still press, and the second Block goes. 2. Priya\u2019s row \u2192 Unblock Priya: under Blocked, "Couldn\u2019t unblock Priya. Try again."; the row stays Blocked, focus on its menu. The line goes on the next press of that menu (place built, not ratified).',
    steps: ['block-fails', 'unblock-fails'],
  },
  {
    key: 'add-link-refused', title: 'Add a link: an invalid address, and a refused link',
    note: 'Built 6 Oct. 1. Opens with Add showing and "not a link" in the slot: "That doesn\u2019t look like a valid URL. Check it and try again." under it (canon\u2019s line, staged for comparison). 2. Press Add (the + button), enter any valid link, Add: "This link can\u2019t be added." in the same place, no reason given; the link stays as typed. Change it or Cancel; Add again succeeds (wording built, not ratified).',
    steps: ['add-link-invalid', 'add-link-refused'],
  },
];
const circQaShown = () => CIRC_QA.filter((w) => !w.only || !!window[w.only]);

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
  useQaEffect(() => {
    const scroller = document.querySelector('.circ-phone-screen') || document.scrollingElement || document.documentElement;
    const prev = scroller.style.overflow;
    scroller.style.overflow = 'hidden';
    return () => { scroller.style.overflow = prev; };
  }, []);

  return (
    <div className="circ-config-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="QA" className="circ-config-modal"
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'scale(1)' : 'scale(0.97)' }}>
        <div className="circ-config-head">
          <div>
            <div className="circ-config-title">QA</div>
            <div className="circ-config-subtitle">Work in progress. The states to check for work in flight, in order.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="circ-config-close"><Icon name="x" size={18} /></button>
        </div>
        <div className="circ-config-body">
          {circQaShown().length === 0 && (
            <div className="circ-config-hint" style={{ margin: 0 }}>Nothing to check right now.</div>
          )}
          {circQaShown().map((w) => (
            <div key={w.key} className="circ-qa-work">
              <div className="circ-config-group-title">{w.title}</div>
              {w.note && <div className="circ-config-hint" style={{ margin: '4px 0 8px' }}>{w.note}</div>}
              <ol className="circ-qa-steps">
                {w.steps.map((id, i) => {
                  const label = labels[id];
                  return (
                    <li key={id}>
                      {label
                        ? <button className="circ-states-jump" onClick={() => onGo(id)}>
                            <span className="circ-states-label">{(i + 1) + '. ' + label}</span>
                            <span className="circ-states-id">?state={id}</span>
                          </button>
                        : <div className="circ-qa-stale">
                            <span className="circ-states-label">{(i + 1) + '. Not in the register'}</span>
                            <span className="circ-states-id">?state={id}</span>
                          </div>}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
          <div className="circ-states-foot">
            <div className="circ-config-hint" style={{ margin: 0 }}>
              This list is temporary. Each entry lives in app/qa.jsx and is deleted once its work is signed off; the states stay.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CIRC_QA, QaPalette });
