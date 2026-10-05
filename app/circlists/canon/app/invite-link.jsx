// ============================================================================
// The invite card (champion, circle not full). Publishes window.InviteForm,
// which app/spaces.jsx renders on the members surface.
//
// An invite is a link, not an address (owner, 5 Oct; docs/specs/
// invite-links-and-sign-in-stops/). The champion presses Get a link and copies
// it; no address is typed or checked. Each link works once, for the first
// person who opens it, and lasts 7 days. Any number can be made. The app mails
// nothing. Nothing is remembered: no invited list, no pending row, no delivery
// state, no revoke, no resend.
//
// Making a link does NOT touch the roster: someone appears when they join.
//
// ---- THE SHAPE -------------------------------------------------------------
// The link's box takes the place the address field had, with the act beside it
// (stacked in a narrow card). ONE box: each press replaces what is in it with a
// new, different link, and the arrival wash plays again. Stacking boxes would
// read as a list the card keeps, which it does not.
//
// **The link box is the copy control.** The box itself is a button — bordered,
// copy glyph on the right, hover and press states, focus ring, 44px target.
//
// **Get a link demotes once its link is on screen** (one filled control at a
// time) and stays pressable: a second press no longer strands an address-bound
// invitation, it simply makes another single-use link. Its label then reads
// "Get another link", so the press says what it will do.
//
// The box has four states: empty, working (the app's spinner), ready (.circ-glow,
// the live region says so), refused (a plain line in the box; the act returns to
// primary because the act is pressing again).
// ============================================================================
const INVITE_BASE = 'https://circlists.com/join/';
const INVITE_SIGN_MS = 480;
const INVITE_DAYS = 7;
// A link is one of many for the circle, so each press makes a different token.
// The real token is signed server-side; the prototype fakes it.
const inviteToken = () => {
  const chunk = () => ('0000' + Math.floor(Math.random() * 1679616).toString(36)).slice(-4);
  return chunk() + '-' + chunk();
};

const inviteCardStyles = {
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)', marginBottom: 4 },
  helper: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0 },
  linkLabelText: { fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' },
  refusal: { flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.35, color: 'var(--color-fg-1)', textAlign: 'left' },
  bind: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 'var(--space-4) 0 0' },
};

const InviteCard = ({ space }) => {
  const [link, setLink] = React.useState(null);
  const [working, setWorking] = React.useState(false);
  const [refused, setRefused] = React.useState(false);
  const [copied, setCopied] = React.useState(null);
  const linkRef = React.useRef(null);
  const boxRef = React.useRef(null);
  const signRef = React.useRef(null);

  React.useEffect(() => () => clearTimeout(signRef.current), []);
  React.useEffect(() => {
    if (copied !== 'ok') return;
    const t = setTimeout(() => setCopied(null), 2400);
    return () => clearTimeout(t);
  }, [copied]);
  const ready = !!link && !working;
  // Focus follows each new link, so the keyboard is on the thing to press next.
  React.useEffect(() => { if (ready && boxRef.current) boxRef.current.focus(); }, [link && link.url, working]);

  const make = () => {
    setCopied(null); setRefused(false); setWorking(true);
    clearTimeout(signRef.current);
    signRef.current = setTimeout(() => {
      // One-shot refusal, armed by the register (a transient window flag, never
      // app state): press → refusal, press again → link.
      if (window.CIRC_INVITE_MINT_FAIL) { window.CIRC_INVITE_MINT_FAIL = false; setLink(null); setRefused(true); setWorking(false); return; }
      setLink({ url: INVITE_BASE + inviteToken() });
      setWorking(false);
    }, INVITE_SIGN_MS);
  };

  const copy = async () => {
    if (!ready) return;
    let ok = false;
    try { await navigator.clipboard.writeText(link.url); ok = true; } catch (e) {
      try {
        const el = linkRef.current;
        if (el) {
          const sel = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(el);
          sel.removeAllRanges(); sel.addRange(range);
          ok = document.execCommand('copy');
        }
      } catch (e2) { ok = false; }
    }
    setCopied(ok ? 'ok' : 'manual');
  };

  return (
    <div className="circ-invite-card">
      <div style={inviteCardStyles.title}>Invite a member</div>
      <p style={inviteCardStyles.helper}>Get a link and send it to them yourself. They join free.</p>
      <div className="circ-invite-linkhead">
        <span style={inviteCardStyles.linkLabelText}>Invite link</span>
        {ready && <span className="circ-invite-life">Valid for {INVITE_DAYS} days</span>}
      </div>
      <div className="circ-invite-row">
        <div className="circ-invite-field">
          {ready ? (
            <button key={link.url} ref={boxRef} type="button" onClick={copy} title="Copy link"
              className="circ-invite-box circ-invite-copy circ-glow">
              <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={15} color="var(--color-fg-3)" /></span>
              <span ref={linkRef} className="circ-invite-url">{link.url}</span>
              <span className="circ-invite-glyph"><Icon name={copied === 'ok' ? 'check' : 'copy'} size={16} /></span>
              <span className="circ-vh">{copied === 'ok' ? 'Copied' : 'Copy link'}</span>
            </button>
          ) : (
            <div className="circ-invite-box" data-dim="">
              <span style={{ display: 'inline-flex', flexShrink: 0 }}>
                {working ? <Spinner size={14} light={false} /> : <Icon name="link" size={15} color="var(--color-fg-3)" />}
              </span>
              {refused && !working
                ? <span style={inviteCardStyles.refusal}>Couldn’t make a link. Try again.</span>
                : <span className="circ-invite-url" />}
            </div>
          )}
        </div>
        <div className="circ-invite-act">
          <Button type="button" variant={ready ? 'secondary' : 'primary'} loading={working} onClick={make}
            style={{ width: 'var(--circ-invite-btnw, 100%)' }}
            icon={<Icon name="link" size={16} color={ready ? 'var(--color-fg-2)' : '#fff'} />}>{ready ? 'Get another link' : 'Get a link'}</Button>
        </div>
      </div>
      {copied === 'manual' && (
        <p style={inviteCardStyles.bind}>Copy it by hand — the link is selected.</p>
      )}
      <p style={inviteCardStyles.bind}>Each link works once, for the first person who opens it, and takes them straight into {space.name}.</p>
      <span className="circ-vh" role="status" aria-live="polite">{copied === 'ok' ? 'Link copied.' : (ready ? 'Link ready.' : (refused && !working ? 'Couldn’t make a link. Try again.' : ''))}</span>
    </div>
  );
};

Object.assign(window, { InviteForm: InviteCard });
