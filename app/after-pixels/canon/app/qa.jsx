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
    note: 'By hand: sign up by email (first and last name and username on the form), verify, then Connect your AI. By Google or Apple: no code, straight to Your username, then Connect your AI; from Get the Pass, checkout comes after the username. On Account, rename and watch the menu, avatar and a share card. Config has the Username row.',
    steps: ['sign-up', 'username-new-account', 'username-taken', 'account-email', 'account-provider', 'account-username-wait', 'session-delve'] },
  { key: 'circlists-match-1', title: 'Circlists match 1: sign-in, menu, Account',
    note: 'Also check by hand: Google, black Apple, email order; email sign-in lands on Verify this device; the user menu (signed in, wide).',
    steps: ['sign-in', 'sign-up', 'sign-in-new-device', 'code-expired', 'code-wrong', 'reset-password', 'provider-sign-in-fails', 'account-email', 'account-provider', 'change-email-code', 'delete-account-confirm'] },
  { key: 'free-tier-1', title: 'Free tier 1: everything you play is yours',
    note: 'On each session page, press Share: the text as pasted, one Copy button. Check at 390 and 320px.',
    steps: ['free-puzzle-result', 'free-history', 'lapsed-history', 'word-free', 'pass-card-none', 'pass-card-lapsed', 'cancel-sheet', 'pass-free', 'delve-free', 'session-puzzle', 'session-delve', 'session-casebook'] },
  { key: 'circlists-match-2', title: 'Circlists match 2: the Pass',
    steps: ['pass-page-never-subscribed', 'pass-page-subscribed-before', 'checkout', 'update-card', 'pass-card-none', 'pass-card-monthly', 'pass-card-yearly', 'pass-card-pending-switch', 'pass-card-payment-failed', 'pass-card-ending', 'pass-card-lapsed', 'switch-sheet-yearly', 'switch-sheet-monthly', 'cancel-sheet'] },
  { key: 'circlists-match-3', title: 'Circlists match 3: footer, legal, not-found, loading',
    note: 'Footer and legal pages: open Home, then Terms, Privacy and Refunds from the footer. Check the footer at 720, 420 and 300px.',
    steps: ['home', 'not-found', 'loading-full', 'loading-in-place', 'load-failed', 'cant-connect'] },
  { key: 'first-release-games', title: 'First-release games',
    note: 'Each page: facts band, More games. Every "—" is a gap in the record.',
    steps: ['groups-pass', 'groups-free', 'casebook-pass', 'casebook-free', 'delve-pass', 'hunter-pass', 'hunter-free', 'session-casebook', 'session-hunter', 'history', 'free-history', 'games', 'games-free', 'games-signed-out'] },
];
KIT_QA.unshift({ key: 'daily-puzzles-1213', title: 'Where, Chain and Salvage (1213)',
  note: 'Each game, at phone and desktop width: product page signed out, free (Get the Pass) and with the Pass; library page done, in progress and free (Needs the Pass); the editions list; a session and its Share text (no country, word or square named). Point at, Tab to and press each card, tile and Library or History row: the art moves and holds; with reduced motion it stays still. Daily Pin appears nowhere.',
  steps: ['where-signed-out', 'where-free', 'where-pass', 'library-where', 'library-where-in-progress', 'library-where-free', 'library-where-editions', 'session-where',
    'chain-signed-out', 'chain-free', 'chain-pass', 'library-chain', 'library-chain-in-progress', 'library-chain-free', 'library-chain-editions', 'session-chain',
    'salvage-signed-out', 'salvage-free', 'salvage-pass', 'library-salvage', 'library-salvage-in-progress', 'library-salvage-free', 'library-salvage-editions', 'session-salvage',
    'games', 'games-free', 'library', 'history'] });
KIT_QA.unshift({ key: 'iffy-decisions', title: 'Decisions, 11 October',
  note: 'Delve product page: signed out and free read "Play the first run", Pass reads "Play"; signed in drops "The first run is free with an account." Casebook is Pass-only: its page reads Get the Pass, as Daily Groups’. A played session page names its edition above the result. Sign up by Google or Apple: no code, straight to Your username (Config Device = New still gives Verify this device on sign-in). Share from a session page and a library game page: the same pop-up, a bottom sheet on a phone.',
  steps: ['sign-up', 'username-new-account', 'verify-email', 'sign-in-new-device-provider', 'reset-password-code', 'session-delve', 'history', 'library-casebook', 'library-delve'] });
KIT_QA.unshift({ key: 'fixes', title: 'Fixes, 10 October',
  note: 'From History, open a row and press its back link: it returns to History, as left. Pass card: cancel, resume, switch and undo each move focus to the control that undoes them and are announced. Tab stays inside every open pop-up.',
  steps: ['history', 'session-delve-past', 'library-delve', 'library-casebook', 'library-mystery-never-played', 'sign-up', 'verify-email', 'not-found', 'pass-card-monthly', 'pass-card-failed-pending-switch', 'switch-sheet-yearly', 'delete-account-confirm', 'cancel-sheet', 'session-hunter', 'library-delve-no-pass', 'library', 'games-free', 'home', 'load-failed'] });
KIT_QA.unshift({ key: 'free-and-pass', title: 'Free and the Pass (proposed, not ratified)',
  note: 'Walk each step. Free player: the dailies and Escape in full; Delve one first edition, no streak; Casebook and 36,000 Summers Ago closed. Pass ended: earned achievements shown as earned; the streak and the rest frozen. The Pass page’s “What you get” table shows what free and the Pass each give.',
  steps: ['fp-word-library-free', 'fp-escape-library-free', 'fp-casebook-library-free', 'fp-delve-library-free', 'fp-casebook-library-lapsed', 'fp-delve-library-lapsed', 'fp-hunter-library-lapsed',
    'fp-product-casebook-free', 'fp-product-hunter-free', 'games-free', 'free-history', 'lapsed-history', 'pass-card-none', 'pass-card-lapsed', 'pass-page-never-subscribed', 'pass-page-subscribed-before', 'fp-pass-page-signed-out', 'checkout', 'cancel-sheet', 'pass-card-ending'] });
KIT_QA.unshift({ key: 'loading-pages-and-parts', title: 'Loading on pages and parts',
  note: 'Held states show the wait while it holds; the top bar and footer stay. By hand: click between Discover, Library, History, a game, a session, the Pass, Account (each loads about 1.2 s, Back does not repeat it). Change search, a chip, Genre, Order, Plays, Show or a page number: only that part loads. On Load failed, Try again shows the spinner on the button and ignores a second press. On a library game page, All… opens History loading, then filtered.',
  steps: ['loading-page-discover', 'loading-page-library', 'loading-page-history', 'loading-page-history-game', 'loading-page-product', 'loading-page-product-signed-out', 'loading-page-library-game', 'loading-page-library-case', 'loading-page-session', 'loading-page-pass', 'loading-page-account', 'loading-part-discover-games', 'loading-part-library-list', 'loading-part-history-results', 'loading-in-place', 'load-failed'] });
KIT_QA.unshift({ key: 'discover-and-library', title: 'Discover and Library',
  note: 'Discover: picks, Free to play, Pass band (gone with the Pass), All games with search and chips, Free last, no Free tag on tiles. Library: rows with covers, Genre and Order. Top bar: Discover, Library, History. Check hover and 320px.',
  steps: ['games-signed-out', 'games-free', 'games', 'library-free', 'library', 'loading-in-place'] });
KIT_QA.unshift({ key: 'split-daily-puzzles', title: 'Daily Puzzles split into separate games',
  note: 'No "Daily Puzzles" anywhere a player sees. Each daily and Escape: product page, library game page, a session, Share. Home, Games, Library menu and History at 320px.',
  steps: ['home', 'games-signed-out', 'games-free', 'games', 'word-free', 'word-signed-out', 'groups-pass', 'mystery-pass', 'escape-free', 'escape-pass',
    'library-word', 'library-groups-in-progress', 'library-mystery-in-progress', 'library-escape', 'library-escape-in-progress', 'library-groups-free',
    'session-puzzle', 'session-groups', 'session-escape', 'history', 'free-history', 'pass-free', 'not-connected'] });
KIT_QA.unshift({ key: 'rhythm-filters', title: 'Daily and weekly filters (not ratified)',
  note: 'Each held state shows its surface’s empty list. By hand: Daily shows only Daily Word, Groups and Mystery (or their plays); Weekly only Escape and Delve; Casebook, the Barrow and 36,000 Summers Ago only under All games. Combine with search, genre, Free, Order, Plays, Show; only the list part loads. Check at 320px.',
  steps: ['games', 'filter-empty-discover', 'library', 'filter-empty-library', 'history', 'filter-empty-history'] });
KIT_QA.unshift({ key: 'walk-sweep', title: 'Walk sweep 2026-10-10 (not ratified)',
  note: 'Walk each new state. By hand: sign up by email (username on the form); sign up with Google (code, then Your username, then Connect your AI); from the Pass page, the username comes before checkout and Cancel and return keeps the plan. Sign out, then Back: no Library, History or Account. After signing in, Back never reopens sign-up. A Pass holder pressing Get the Pass lands on Account. From a play dialog on a phone, How to connect then Back reopens the dialog. Config: Pass changes Fail; Device New.',
  steps: ['sign-up', 'username-new-account', 'username-taken', 'sign-in-new-device-provider', 'account-provider', 'delete-account-code-provider', 'delete-account-confirm',
    'pass-card-none', 'pass-page-never-subscribed', 'checkout', 'pass-cancel-sheet-payment-failed', 'pass-cancel-fails', 'pass-resume-fails', 'pass-switch-fails', 'pass-keep-fails',
    'word-free', 'escape-free', 'hunter-free', 'groups-pass',
    'library-word', 'library-word-in-progress', 'library-word-streak-broken', 'library-mystery-never-played', 'library-casebook-free', 'library-delve-free-in-progress', 'library-list-free-in-progress', 'games-free',
    'library-casebook-pass-ended', 'library-delve-pass-ended', 'library-hunter-pass-ended',
    'free-puzzle-result', 'session-delve-past', 'session-hunter', 'session-casebook', 'history', 'home', 'not-found', 'not-found-signed-in'] });
KIT_QA.unshift({ key: 'every-edition-playable', title: 'Every edition can be played',
  note: 'Each daily puzzle has "Every …" beside its name and the same list. An earlier word not played shows its prompt. A played word or case shows its result, says it was played once, and has no prompt or Copy. Check at 390 and 1280px.',
  steps: ['library-word-editions', 'edition-word-earlier', 'edition-word-done', 'edition-casebook-done', 'session-word-earlier', 'session-casebook', 'history'] });
KIT_QA.unshift({ key: 'failed-on-strip', title: 'Failed on the streak strip',
  note: 'A failed day: the Not played outline with a cross; legend Completed / Failed / Not played. 36,000 Summers Ago keeps Played / Not played.',
  steps: ['library-word', 'library-word-streak-broken', 'library-word-in-progress', 'library-mystery-never-played', 'library-casebook', 'library-delve', 'library-casebook-pass-ended', 'library-delve-pass-ended'] });
KIT_QA.unshift({ key: 'phone-snags-second-pass', title: 'Phone snags, second pass',
  note: 'On a phone: product pages have no edition card and show the cover small beside the title; a session page shows its buttons without scrolling; More games cards move on press and their art is 2:1; press and hold the home hero, a card, a button: nothing selects. The phone top bar shows Menu and a person icon. Account: Pass, Notifications, then Username. Check at 320, 390 and 1280px.',
  steps: ['home', 'word-signed-out', 'word-free', 'casebook-pass', 'session-puzzle', 'session-delve', 'account-email'] });
KIT_QA.unshift({ key: 'final-audit-snags', title: 'Final audit snags',
  note: 'By hand: from Cancel sheet: payment failed, press Cancel subscription, then Library, 36,000 Summers Ago, then History: the Account card, the library page and History all say 6 October, the last day is 5 October, and History keeps every Pass-game play. Sign up by email (first and last name asked) as a new account: Library never played, History empty, Username changeable on 5 November. On Account, type the current username and press Update: it answers. Signed out (demo bar) on Library, History, Account or a session: Sign in, then that page. Notifications on: Games has Done; off: no count. Type a 70-letter word in each search; type 36000. Check at 390 and 1280px.',
  steps: ['pass-cancel-sheet-payment-failed', 'pass-ended-today', 'library-hunter-pass-ended-today', 'history-pass-ended-today', 'library-hunter-pass-ended', 'new-account-library', 'new-account-history', 'new-account-casebook-pass',
    'sign-up', 'account-email', 'account-username-wait', 'session-groups-unfinished', 'session-delve-unfinished', 'history-unfinished',
    'sign-in-return-library', 'session-unknown', 'library', 'home', 'word-signed-out', 'pass-page-never-subscribed', 'pass-page-subscribed-before'] });
KIT_QA.unshift({ key: 'directory-listings', title: 'Directory listings',
  note: 'The copy on both pages awaits the owner’s review. Check each page at desktop and phone width (Config, Viewport).',
  steps: ['directory-listing-claude', 'directory-listing-chatgpt'] });
KIT_QA.unshift({ key: 'pass-ended-every-case', title: 'Pass ended: every case',
  note: 'Library as a player whose Pass ended. Escape: free first-room card with Play. Casebook: the never-had Needs the Pass card (its one case is after the Pass ended). The Barrow: “You stopped here.”, CHAPTER 2. Delve: free first-run card, done. Daily Groups: “You stopped here.”, no Play. No Library row for Escape, the Barrow or Delve reads “Pass only”.',
  steps: ['pur-pass-ended-every'] });
KIT_QA.unshift({ key: 'elegance-fixes', title: 'Elegance fixes, 17 October (not signed off)',
  note: 'Check each at phone and desktop width. Free first edition in progress: head card, Your runs, Every run, the session page and the Library row all say In progress with the play date; Config This week finished ends it everywhere. Pass-ended and never-had Game pages show the Needs the Pass card in the now card’s place. Empty filters: “Nothing matches that.” and Clear all, no box. Under 640px every button is full width.',
  steps: ['pur-first-in-progress', 'library-casebook-free', 'library-delve-free-in-progress', 'library-list-free-in-progress', 'pur-first-done', 'edition-word-done', 'edition-mystery-done', 'edition-casebook-done',
    'session-groups-unfinished', 'session-delve-unfinished', 'library-hunter-pass-ended', 'library-hunter-pass-ended-today', 'fp-hunter-library-lapsed', 'library-casebook-pass-ended', 'library-delve-pass-ended', 'pur-pass-ended', 'pur-pass-ended-every', 'library-groups-free', 'pass-card-lapsed',
    'filter-empty-discover', 'filter-empty-library', 'filter-empty-history', 'history-search-empty', 'casebook-pass', 'casebook-free', 'session-groups', 'library-word', 'library-word-free', 'pur-new-account'] });
KIT_QA.unshift({ key: 'canon-delta-walk', title: 'Walk rulings, 18 October',
  note: 'Pass ended: earned achievements read “Earned {date}”, full-colour badge, and one line, “You can’t earn the rest until the Pass returns.” Account (lapsed, ending, cancel): the one What freezes sentence. Daily Word product page, played today: Play opens the prompt. Connect at phone width: Copy keeps its width beside the address, which scrolls sideways. Escape and Delve free: the Playing earlier line under the page. Two in progress (Escape, Delve): Your rooms or Your runs lists both, each In progress; the list shows both unmarked; an earlier one’s panel shows its prompt and Copy, with no warning; this week’s card still continues this week’s.',
  steps: ['library-escape-two-in-progress', 'editions-escape-two-in-progress', 'library-delve-two-in-progress', 'editions-delve-two-in-progress', 'library-delve-pass-ended', 'library-pass-ended', 'pass-card-lapsed', 'pass-card-ending', 'word-free', 'groups-pass', 'session-puzzle', 'connect', 'library-escape-free', 'library-delve-no-pass'] });
KIT_QA.unshift({ key: 'audit-fixes', title: 'Audit fixes, 18 October: one play record',
  note: 'Every play, date, count and earned achievement comes from the play log. Check that the head card, the list of plays, History, the Library row, the editions list and achievements agree, that no date falls after Tue 6 Oct, and that a Pass-ended player has no Pass-only play or earned date after 18 Sep (later days are frozen). Groups, free: the never-had card alone. Summers Ago: a day with no ending reads Not finished; the head matches day 18. Library: Escape reads Today. Also: Account has no Your data or Notifications card; the play box reads #212; the Barrow panel ends on See in History; an empty editions search reads Nothing matches that. with Clear all (search zzzz).',
  steps: ['library-groups-free', 'pur-pass-ended-every', 'library-pass-ended', 'library-casebook-pass-ended', 'library-delve-pass-ended', 'library-hunter-pass-ended', 'pur-first-done', 'library-word', 'history', 'lapsed-history', 'session-barrow', 'library-barrow', 'edition-barrow-done', 'edition-barrow-done-free', 'library-hunter', 'session-hunter', 'history-hunter', 'library', 'session-kept-pass-ended', 'word-free', 'library-casebook-editions', 'editions-word-free', 'edition-delve-in-progress', 'escape-free', 'account-email'] });
const kitQaShown = () => KIT_QA.filter((w) => !w.only || !!window[w.only]);

const { useState: useQaState, useEffect: useQaEffect } = React;

const QaPalette = ({ statesGroups, onGo, onClose }) => {
  const [shown, setShown] = useQaState(false);
  const labels = {};
  (statesGroups || []).forEach((g) => g.items.forEach((s) => { [s.id, ...(s.aliases || [])].forEach((id) => { labels[id] = s.label; }); }));

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
KIT_QA.unshift({ key: 'escape-1236', title: 'Escape: session page and now card (1236, not signed off)',
  note: 'Each at desktop and phone width. Session page: the door and Escaped with the verdict, the line, one lane per lock (two a row on desktop, the picked one alone on a phone), Every move collapsed. Now card: Escaped and the verdict at the head’s right, the line; press a door: the session page opens on that lock’s lane. Hard: the cabinet lane wraps to two rows; doors stay 32px apart.',
  steps: ['library-escape', 'library-escape-on-par', 'library-escape-over', 'library-escape-hard', 'library-escape-in-progress', 'library-escape-free',
    'session-escape', 'session-escape-on-par', 'session-escape-over', 'session-escape-hard', 'session-escape-in-progress'] });
KIT_QA.unshift({ key: 'word-1236', title: 'Daily Word: session page (1236, not signed off)',
  note: 'Each at desktop and phone width; Hard at 1440 x 900 and 1280 x 800 must show the whole board without scrolling. The board on its grey ground, centred, the ground wrapping every tile; the hint a slim row, its letter in its place with "Hint" beside it; no dashed edges; in progress, an underline for each guess left. The cover: the grey square small and thin at rest, full and filled on hover, focus or tap. Every guess collapsed below.',
  steps: ['session-puzzle', 'session-word-hard', 'session-word-failed', 'session-word-in-progress'] });
KIT_QA.unshift({ key: 'this-edition-picks', title: 'Config: This edition (Average, Hard, Failed)',
  note: 'Config → Every game → This edition. Pick Hard, then Failed, then Average: Daily Word, Daily Groups and Daily Mystery change on the now card, Your plays, History and the session page together; Escape changes on Hard only. Daily Word’s History also holds #210 (hard) and #208 (failed). Escape keeps its par pick in its own section.',
  steps: ['history', 'library-word', 'library-escape'] });
