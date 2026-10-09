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
    steps: ['free-puzzle-result', 'free-history', 'lapsed-history', 'word-free', 'pass-card-none', 'pass-card-lapsed', 'cancel-sheet', 'pass-free', 'delve-free', 'session-puzzle', 'session-delve', 'session-casebook'] },
  { key: 'circlists-match-2', title: 'Circlists match 2: the Pass',
    steps: ['pass-page-trial-available', 'pass-page-trial-used', 'checkout', 'update-card', 'pass-card-none', 'pass-card-monthly', 'pass-card-yearly', 'pass-card-trial', 'pass-card-pending-switch', 'pass-card-payment-failed', 'pass-card-ending', 'pass-card-lapsed', 'switch-sheet-yearly', 'switch-sheet-monthly', 'switch-sheet-trial', 'cancel-sheet', 'cancel-sheet-trial'] },
  { key: 'circlists-match-3', title: 'Circlists match 3: footer, legal, not-found, loading',
    note: 'Footer and legal pages: open Home, then Terms, Privacy and Refunds from the footer. Check the footer at 720, 420 and 300px.',
    steps: ['home', 'not-found', 'loading-full', 'loading-in-place', 'load-failed', 'cant-connect'] },
  { key: 'first-release-games', title: 'First-release games',
    note: 'Each page: facts band, this week’s one, More games. Every "—" is a gap in the record.',
    steps: ['groups-pass', 'groups-free', 'casebook-pass', 'casebook-free', 'delve-pass', 'hunter-pass', 'hunter-free', 'session-casebook', 'session-hunter', 'history', 'free-history', 'games', 'games-free', 'games-signed-out'] },
];
KIT_QA.unshift({ key: 'free-and-pass', title: 'Free and the Pass (proposed, not ratified)',
  note: 'Walk each step. Free player: the dailies and Escape in full; Casebook and Delve one first edition, no streak; 36,000 Summers Ago closed. Pass ended: locked achievements. Trial reads seven days everywhere. Pass page has no list or table.',
  steps: ['fp-word-library-free', 'fp-escape-library-free', 'fp-casebook-library-free', 'fp-delve-library-free', 'fp-hunter-library-free', 'fp-casebook-library-lapsed', 'fp-delve-library-lapsed', 'fp-hunter-library-lapsed',
    'fp-product-casebook-free', 'fp-product-hunter-free', 'games-free', 'free-history', 'lapsed-history', 'pass-card-none', 'pass-card-lapsed', 'pass-page-trial-available', 'pass-page-trial-used', 'fp-pass-page-signed-out', 'checkout', 'cancel-sheet', 'cancel-sheet-trial', 'switch-sheet-trial', 'pass-card-trial', 'pass-card-ending'] });
KIT_QA.unshift({ key: 'loading-pages-and-parts', title: 'Loading on pages and parts',
  note: 'Held states show the wait while it holds; the top bar and footer stay. By hand: click between Discover, Library, History, a game, a session, the Pass, Account (each loads about 1.2 s, Back does not repeat it). Change search, a chip, Kind, Order, Plays, Show or a page number: only that part loads. On Load failed, Try again shows the spinner on the button and ignores a second press. On a library game page, All… opens History loading, then filtered.',
  steps: ['loading-page-discover', 'loading-page-library', 'loading-page-history', 'loading-page-history-game', 'loading-page-product', 'loading-page-product-signed-out', 'loading-page-library-game', 'loading-page-library-case', 'loading-page-session', 'loading-page-pass', 'loading-page-account', 'loading-part-discover-games', 'loading-part-library-list', 'loading-part-history-results', 'loading-in-place', 'load-failed'] });
KIT_QA.unshift({ key: 'discover-and-library', title: 'Discover and Library',
  note: 'Discover: picks, Free to play, Pass band (gone with the Pass), All games with search and chips, Free last, no Free tag on tiles. Library: rows with covers, Kind and Order. Top bar: Discover, Library, History. Check hover and 320px.',
  steps: ['games-signed-out', 'games-free', 'games', 'library-free', 'library', 'loading-in-place'] });
KIT_QA.unshift({ key: 'split-daily-puzzles', title: 'Daily Puzzles split into separate games',
  note: 'No "Daily Puzzles" anywhere a player sees. Each daily and Escape: product page, library game page, a session, Share. Home, Games, Library menu and History at 320px.',
  steps: ['home', 'games-signed-out', 'games-free', 'games', 'word-free', 'word-signed-out', 'groups-pass', 'mystery-pass', 'escape-free', 'escape-pass',
    'library-word', 'library-groups-in-progress', 'library-mystery-in-progress', 'library-escape', 'library-escape-in-progress', 'library-groups-free',
    'session-puzzle', 'session-groups', 'session-escape', 'history', 'free-history', 'pass-free', 'not-connected'] });
KIT_QA.unshift({ key: 'rhythm-filters', title: 'Daily and weekly filters (not ratified)',
  note: 'Each held state shows its surface’s empty list. By hand: Daily shows only Daily Word, Groups and Mystery (or their plays); Weekly only Escape, Casebook and Delve; 36,000 Summers Ago only under All games. Combine with search, kind, Free, Order, Plays, Show; only the list part loads. Check at 320px.',
  steps: ['games', 'filter-empty-discover', 'library', 'filter-empty-library', 'history', 'filter-empty-history'] });
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
