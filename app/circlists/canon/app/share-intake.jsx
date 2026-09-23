// ============================================================================
// Circlists — Share intake (LM-771). The screen a member lands on after
// sharing a link into Circlists from another app.
//
// ONE new surface: the picker. Everything it is made of already existed —
// WizardShell + WizardTitle (app/wizard.jsx), CircleRow (app/home.jsx),
// SignIn/AuthFrame (app/auth.jsx). This file
// holds the page that arranges them, the held-link line, and the signed-out
// lead. Nothing else.
//
// The shell is the Create-a-circle wizard's, reached as a STANDALONE task:
// `flow={null}` ⇒ no step dots and no back, × only. Same on desktop and
// mobile, which is the wizard's own contract (one column, WIZARD_COL) and not
// a choice re-made here. No `subject` either: the picker's subject is the link,
// and the link is read in the body where it can be read whole-ish rather than
// in a 200px header slot.
//
// A droppable module in the app's own idiom: main.jsx reads
// window.CircShareIntake per render, so removing this file removes the intake
// route and nothing else. The picker leans on window.CircleRow, so with
// app/home.jsx dropped the page keeps its title and its link and simply has no
// rows to draw — the same degradation home itself takes.
// ============================================================================

// The held link. Plain mono URL text, one line, never wrapped — no fetch, no
// preview card, no favicon, no page title (LM-771 names those as NOT here).
// Bare text, no box: the rows below are white cards you tap, and a boxed link
// above them read as one more card. The whole link is reachable by scrolling
// the line sideways; the right edge fades while more link lies beyond it and
// clears at the end. No left fade — ratified on the option board
// (docs/specs/lm-771-share-intake/playground/wb-held-link.html, option 01).
// The fade is a CSS mask, not a native affordance; the scrollbar is hidden.
const SHARE_LINK_FADE = 48;
const ShareHeldLink = ({ link }) => {
  const ref = React.useRef(null);
  const [end, setEnd] = React.useState(false);
  const read = () => { const el = ref.current; if (el) setEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2); };
  React.useEffect(() => { if (ref.current) ref.current.scrollLeft = 0; read(); }, [link]);
  if (!link) return null;
  const mask = end ? 'none' : `linear-gradient(90deg, #000 calc(100% - ${SHARE_LINK_FADE}px), transparent 100%)`;
  return (
    <React.Fragment>
      <style>{'.circ-share-link{scrollbar-width:none}.circ-share-link::-webkit-scrollbar{display:none}.circ-share-link:focus-visible{outline:2px solid var(--color-accent);outline-offset:2px}'}</style>
      <div ref={ref} onScroll={read} tabIndex={0} role="region" aria-label="Shared link" dir="ltr" title={link} className="circ-share-link" style={{
        fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-regular)', fontSize: 13,
        lineHeight: 1.4, color: 'var(--color-fg-1)', width: '100%', padding: '4px 0',
        whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden', overscrollBehaviorX: 'contain',
        textAlign: 'left', WebkitMaskImage: mask, maskImage: mask,
      }}>{link}</div>
    </React.Fragment>
  );
};

// The hairline between the link and the rows. 24 below, not 16, because the
// link's line box carries ~6px of invisible leading and padding above the
// rule and nothing does below it — equal numbers read as a short gap.
const ShareLinkRule = () => (
  <div aria-hidden="true" style={{ height: 1, width: '100%', background: 'var(--color-border-2)', margin: '16px 0 24px' }}></div>
);

// Above the canon sign-in card: the held link, ruled off exactly as on the
// picker. What signing in is for lives IN the card, as its subtitle
// (SHARE_SIGNIN_SUBTITLE, passed by main.jsx) — ratified 2026-09-23, option 03
// of docs/specs/lm-771-share-intake/playground/wb-signed-out-lead.html.
// No bottom margin: the rule's own 24 is the whole gap to the card, matching
// the ~22 the link's line box reads above the rule.
const SHARE_SIGNIN_SUBTITLE = 'To add this link to a circle.';
const ShareSignInLead = ({ link }) => (link ? (
  <div style={{ width: '100%', maxWidth: 400 }}>
    <ShareHeldLink link={link} />
    <ShareLinkRule />
  </div>
) : null);

// The picker. Rows are CircleRow itself, in the order they are handed in — the
// same list main.jsx gives home — so order, meta line, asleep wording and the
// unseen micro are the home's, not a second reading of them.
//
// NOTHING IS PRE-SELECTED and there is no selection state: a row's tap IS the
// act, exactly as on home. So no Continue button, and no aria-selected
// anywhere — these are navigation, not options.
const ShareIntake = ({ spaces = [], link = '', onPick, onExit }) => {
  const Row = window.CircleRow;
  // No circles never renders here: main.jsx sends that arrival to home's own
  // empty state, unchanged (ruled 2026-09-23).
  if (spaces.length === 0) return null;
  return (
    <WizardShell flow={null} onExit={onExit}>
      <WizardTitle mb={link ? 12 : 20}>Add to which circle?</WizardTitle>
      <ShareHeldLink link={link} />
      {link ? <ShareLinkRule /> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', textAlign: 'left' }}>
        {Row ? spaces.map((s) => <Row key={s.id} space={s} onSelect={onPick} />) : null}
      </div>
    </WizardShell>
  );
};

Object.assign(window, { CircShareIntake: ShareIntake, ShareHeldLink, ShareSignInLead, SHARE_SIGNIN_SUBTITLE });
