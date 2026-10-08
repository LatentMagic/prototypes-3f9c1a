// ============================================================================
// Kit — the QA list (PROTOTYPE AID, not part of the product). DRAFT:
// the shape is still being iterated on.
//
// The Config pill's third half. A short, ephemeral walk-through of the states a
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
  { key: 'loading-on-action', title: 'Loading on action',
    note: 'On each, press the action: its control shows the spinner for about a second and ignores a second press (and Enter). Sign out is in the account menu. Check at phone and desktop width.',
    steps: ['sign-up', 'sign-in', 'verify-email', 'sign-in-new-device', 'reset-password', 'username-new-account', 'account-email', 'change-email-code', 'delete-account-confirm', 'pass-card-pending-switch', 'pass-card-ending', 'switch-sheet-yearly', 'cancel-sheet', 'checkout', 'update-card'] },
  { key: 'username-1', title: 'Usernames',
    note: 'By hand: sign up by email (no name fields), then Your username, then Connect your AI; from Get the Pass the screen comes after checkout, or on cancelling it. On Account, rename and watch the menu, avatar and a share card. Config has the Username row.',
    steps: ['sign-up', 'username-new-account', 'username-taken', 'account-email', 'account-provider', 'account-username-wait', 'session-delve'] },
  { key: 'circlists-match-1', title: 'Circlists match 1: sign-in, menu, Account',
    note: 'Also check by hand: Google, black Apple, email order; email sign-in lands on Verify this device; the user menu (signed in, wide).',
    steps: ['sign-in', 'sign-up', 'sign-in-new-device', 'code-expired', 'code-wrong', 'reset-password', 'provider-sign-in-fails', 'apple-no-account', 'account-email', 'account-provider', 'change-email-code', 'delete-account-confirm'] },
  { key: 'free-tier-1', title: 'Free tier 1: everything you play is yours',
    note: 'On each session page, press Share: the text as pasted, one Copy button. Check at 390 and 320px.',
    steps: ['free-puzzle-result', 'free-history', 'lapsed-history', 'puzzles-free', 'pass-card-none', 'pass-card-lapsed', 'cancel-sheet', 'pass-free', 'delve-free', 'session-puzzle', 'session-delve', 'session-casebook'] },
  { key: 'circlists-match-2', title: 'Circlists match 2: the Pass',
    steps: ['pass-page-free-month', 'pass-page-free-used', 'checkout', 'update-card', 'pass-card-none', 'pass-card-monthly', 'pass-card-yearly', 'pass-card-free-month', 'pass-card-pending-switch', 'pass-card-payment-failed', 'pass-card-ending', 'pass-card-lapsed', 'switch-sheet-yearly', 'switch-sheet-monthly', 'switch-sheet-free-month', 'cancel-sheet', 'cancel-sheet-free-month'] },
  { key: 'circlists-match-3', title: 'Circlists match 3: footer, legal, not-found, loading',
    note: 'Footer and legal pages: open Home, then Terms, Privacy and Refunds from the footer. Check the footer at 720, 420 and 300px.',
    steps: ['home', 'not-found', 'loading-full', 'loading-in-place', 'load-failed', 'cant-connect'] },
  { key: 'first-release-games', title: 'First-release games',
    note: 'Each page: facts band, this week’s one, More games. Every "—" is a gap in the record.',
    steps: ['puzzles-pass', 'puzzles-free', 'casebook-pass', 'casebook-free', 'delve-pass', 'hunter-pass', 'hunter-free', 'session-casebook', 'session-hunter', 'history', 'free-history', 'games', 'games-free', 'games-signed-out'] },
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
      <div role="dialog" aria-modal="true" aria-label="QA" className="kit-config-modal" data-shown={shown ? '1' : undefined}
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
