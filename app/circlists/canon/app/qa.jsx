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
    key: 'invite-links-and-sign-in-stops', title: 'Invites by link, Apple with no account, sign-in and report failures',
    note: 'Built 5 Oct, not ratified. 1. The invite card: no address; Get a link, then Get another link makes a different one in the same box. Built, not ratified: the card\u2019s copy ("Get a link and send it to them yourself. They join free." / "Each link works once, for the first person who opens it\u2026"), one box replaced on each press, the button staying pressable as Get another link. 2. The refusal, unchanged. 3. The dead-link page: one page for spent, expired and broken links; body "An invite link works once and lasts 7 days. Ask whoever invited you for a new one." (built, not ratified). 4. Sign in, tap Continue with Apple: the draft line and its two actions replace the three buttons in place (form built, not ratified); Create a new account opens Sign up, Sign in another way returns. 5 and 6. Press Google or Apple: the first press fails with one line under the buttons, "Couldn\u2019t continue with Google. Try again." (wording and placement built, not ratified; R4); press again and it clears. Config, Provider sheet, Cancelled: nothing shows. 7. Report a card someone else added: the first report fails, "Couldn\u2019t send the report. Try again." (built, not ratified; R5); the dialog keeps its reason; the menu still offers Report until one goes.',
    steps: ['invite-link-card', 'invite-link-refused', 'invite-invalid', 'signin-apple-no-account', 'signin-provider-fails', 'signup-provider-fails', 'report-fails'],
  },
  {
    key: 'champion-leave', title: 'A champion can leave a circle',
    note: 'Proposed, not deployed. 1. Members as champion: the menu on your own row holds Leave this circle; no line at the foot. 2. Tap it: the champion confirm, circle with others. 3. The only member: the ratified body. 4. Dormant, its champion left: the line, Take over, Leave. 5. Your subscription ended: Leave this circle beside Start your subscription; the member confirm. 6. Taken over after its champion left, then that subscription ended: the subscription line, not the champion-left one. 7. Subscribed with no circles: the Account card says nothing about circles; Ending keeps only "You can resume any time before that date.", Payment failed reads "Update the card within 30 days to keep your subscription.", and Cancel subscription (from ppp-no-circles) drops its circles line. Every Leave confirm is a centred modal at phone and desktop width.',
    steps: ['members-champion', 'members-champion-sole', 'dormant-champion-left', 'ppp-lapsed-circle', 'dormant-champion-left-retaken', 'ppp-no-circles', 'ppp-no-circles-ending', 'ppp-no-circles-failed'],
  },
  {
    key: 'mobile-app', title: 'Mobile app: where it differs',
    note: 'The app posture, 5 Oct. Each step opens in Platform: Mobile with Mobile payments Off. At Create a circle, tap New circle.',
    steps: ['app-splash', 'app-start-up', 'startup-cant-connect', 'app-home', 'app-circle', 'app-circle-settings',
      'ppp-app-create-not-subscribed', 'ppp-create-subscribed', 'ppp-app-not-subscribed', 'ppp-app-free-month', 'ppp-app-active', 'ppp-app-lapsed',
      'push-setting-in-app'],
  },
  {
    key: 'report-block', title: 'Report and block: built, not ratified',
    note: 'Cleared on ratification. Proposed, not put to the owner one by one: the reasons inside the Form dialog, Blocked and Unblock on the row, and the reach of a block beyond its account-wide scope. Report: open a card someone else added, menu, Report link. Comment: open the conversation on Go pipelines, the menu by Priya N., Report comment. Block: Settings, the menu on a row, Block.',
    steps: ['reading-loop', 'report-link-reported', 'comment-reactions-counted', 'members-champion', 'members-non-champion', 'block-priya-second-circle'],
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
