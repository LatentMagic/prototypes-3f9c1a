// ============================================================================
// A3 — the champion sends the invitation themselves. Candidate overlay.
//
// Re-publishes ONE name: window.InviteForm (app/spaces.jsx). Everything around
// the card — roster, crown, kebab and Remove, own Leave, rename, member count
// and cap, the non-champion line, the funding card, the support line, and the
// circle-full panel — is the shipped component, untouched.
//
// The delta. The app mails nothing. The champion enters the friend's address and
// the card hands back a link bound to that address, to copy and send in their
// own words. No outbound mail, no fallback that offers one. And no memory: no
// invited list, no pending row, no delivery state, no revoke, no resend.
//
// Minting a link does NOT touch the roster. The shipped card called
// onInvite(email), which added the member on the spot; a row appearing the
// moment you get a link is a delivery confirmation, which this delta removes.
// onInvite is left unwired. Someone appears in the roster when they join, and
// joining happens outside the app.
//
// ---- THE SHAPE -------------------------------------------------------------
//
// ONE shape for the card's whole life: the field with its act beside it, then
// the link's box beneath, always present. No second face, so there is no swap —
// which is what four treatments of that swap, played as the app, were for
// (`playground/circlists-a3-transition.html`; option 04 ratified 2026-08-28,
// then corrected by the two passes below).
//
// **The press is the moment.** Deriving the link as the address was typed was
// wrong and could not be rescued: `a@b.co` is a valid address and so is
// `a@b.company.com`, so no check can tell a finished address from a plausible
// prefix — only the person typing knows. Every product that binds an invite to
// an address commits on a press; the ones without a press (Figma, Notion, Slack
// link-sharing) have no address to finish. So Get a link is back, and it is the
// one place the address is validated.
//
// **The link box is the copy control.** There is no Copy button: the box itself
// is a button, because a second filled control competing with Get a link is the
// thing that made this card busy. Which means it must take a control's shape —
// bordered box, copy glyph on the right, hover and press states, focus ring, the
// full 44px hit target. Anything that acts as a button reads as a button.
//
// **Get a link demotes once its link is on screen.** Before the press the green
// is the act; after it, the act is copying, and the box is what carries it. So
// the card holds exactly one filled control at any time, and never two.
//
// The box has three states, so readiness is defined and signalled:
//   empty    no link for the address in the field. The slot at its resting
//            height holding nothing of value — not even the domain, which would
//            imply part of the link already exists.
//   working  pressed; the link is being signed. The app's own spinner.
//   ready    the link is there, and the box plays .circ-glow — the app's arrival
//            wash, the same signal a card that just landed plays. The live
//            region says so.
//
// The signing beat is not decoration: the token is signed server-side (a pure
// function of address + circle + a secret), so the real card makes one
// idempotent request per press — nothing created, nothing stored, and the invite
// exists only when the recipient opens the link. Locally the token is instant.
//
// Editing the address empties the box: a link for the old address is a lie about
// who this one is for. That is also why there is no "Invite someone else" — the
// address IS the control.
//
// The word "link" was in the card four times — Get a link, Link for…, the URL,
// Copy link. The box is visibly a URL, in mono, behind a link icon, so what is
// left is Get a link and the "Their link" label.
//
// The funding fact rides the helper, not the field's hint. The hint slot IS the
// error slot: a typo'd address replaced "They join free" with the validation
// message, so the one fact about money in this card was destroyed by a typo.
// Who pays is the funding card, directly below.
// ============================================================================
const CAND_A3_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAND_A3_BASE = 'https://circlists.com/join/';
// Stands in for the one idempotent request the real card makes per press: long
// enough to be a moment, short enough not to be a wait.
const CAND_A3_SIGN_MS = 480;

const candA3Token = (email, spaceId) => {
  const s = String(email || '').trim().toLowerCase() + '|' + String(spaceId || '');
  let a = 2166136261, b = 5381;
  for (let i = 0; i < s.length; i++) {
    a = ((a ^ s.charCodeAt(i)) * 16777619) >>> 0;
    b = (((b * 33) >>> 0) ^ s.charCodeAt(i)) >>> 0;
  }
  const chunk = (n) => ('000' + n.toString(36)).slice(-4);
  return chunk(a) + '-' + chunk(b);
};

const candA3 = {
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)', marginBottom: 4 },
  helper: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '0 0 var(--space-4)' },
  label: { display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)', marginBottom: 6 },
  linkLabel: { display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)', margin: 'var(--space-4) 0 6px' },
  bind: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 'var(--space-4) 0 0' },
};

const CandA3InviteForm = ({ space }) => {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [link, setLink] = React.useState(null);
  const [working, setWorking] = React.useState(false);
  const [copied, setCopied] = React.useState(null);
  const fieldRef = React.useRef(null);
  const linkRef = React.useRef(null);
  const boxRef = React.useRef(null);
  const signRef = React.useRef(null);

  React.useEffect(() => {
    const t = setTimeout(() => { if (fieldRef.current) fieldRef.current.focus(); }, 60);
    return () => { clearTimeout(t); clearTimeout(signRef.current); };
  }, []);
  React.useEffect(() => {
    if (copied !== 'ok') return;
    const t = setTimeout(() => setCopied(null), 2400);
    return () => clearTimeout(t);
  }, [copied]);

  const v = email.trim().toLowerCase();
  // Derived, not stored: a link belongs to the address it was made for, so
  // editing the field empties the box without anything having to clear it.
  const ready = !!link && link.email === v;

  // Focus follows the link when it lands, so the keyboard is already on the
  // thing to press next and the arrival is not just a visual event.
  React.useEffect(() => { if (ready && boxRef.current) boxRef.current.focus(); }, [ready]);

  const submit = (e) => {
    e.preventDefault();
    if (!CAND_A3_EMAIL_RE.test(v)) { setErr('Enter a valid email address.'); return; }
    if (space.members.some(m => (m.email || '').toLowerCase() === v)) {
      setErr('That person is already a member of this circle.'); return;
    }
    setErr(null); setCopied(null); setWorking(true);
    clearTimeout(signRef.current);
    signRef.current = setTimeout(() => {
      setLink({ email: v, url: CAND_A3_BASE + candA3Token(v, space.id) });
      setWorking(false);
    }, CAND_A3_SIGN_MS);
  };

  const change = (e) => {
    setEmail(e.target.value);
    if (err) setErr(null);
    if (working) { clearTimeout(signRef.current); setWorking(false); }
  };

  const copy = async () => {
    if (!ready) return;
    let ok = false;
    try { await navigator.clipboard.writeText(link.url); ok = true; } catch (e) {
      // Fall back to selecting the link so it can still be taken by hand.
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
    <div className="cand-a3-card">
      <div style={candA3.title}>Invite a member</div>
      <p style={candA3.helper}>Enter their email address and copy the link. Send it to them yourself — they join free.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="invite-email" style={candA3.label}>Email</label>
        <div className="cand-a3-out">
          <div className="cand-a3-field">
            <Field ref={fieldRef} name="invite-email" type="email" placeholder="name@example.com"
              value={email} onChange={change} error={err} />
          </div>
          <div className="cand-a3-act">
            <Button type="submit" variant={ready ? 'secondary' : 'primary'} loading={working}
              style={{ width: 'var(--cand-a3-copyw, 100%)' }}
              icon={<Icon name="link" size={16} color={ready ? 'var(--color-fg-2)' : '#fff'} />}>Get a link</Button>
          </div>
        </div>
      </form>
      <div style={candA3.linkLabel}>Their link</div>
      {/* Keyed on the link so a NEW one remounts the box and the arrival wash
          plays again — the wash is the readiness signal, so it fires every time,
          not only the first. */}
      {ready ? (
        <button key={link.url} ref={boxRef} type="button" onClick={copy} title="Copy link"
          className="cand-a3-linkrow cand-a3-linkbtn circ-glow">
          <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={15} color="var(--color-fg-3)" /></span>
          {/* The whole link, never truncated: it wraps when the card is narrow.
              A span rather than a readonly input so nothing is hidden behind a
              scroll. */}
          <span ref={linkRef} className="cand-a3-linkval">{link.url}</span>
          <span className="cand-a3-linkglyph"><Icon name={copied === 'ok' ? 'check' : 'copy'} size={16} /></span>
          <span className="circ-vh">{copied === 'ok' ? 'Copied' : 'Copy link'}</span>
        </button>
      ) : (
        <div className="cand-a3-linkrow" data-dim="">
          <span style={{ display: 'inline-flex', flexShrink: 0 }}>
            {working ? <Spinner size={14} light={false} /> : <Icon name="link" size={15} color="var(--color-fg-3)" />}
          </span>
          <span className="cand-a3-linkval" />
        </div>
      )}
      {copied === 'manual' && (
        <p style={candA3.bind}>Copy it by hand — the link is selected.</p>
      )}
      <p style={candA3.bind}>It only works for that address, and it takes them straight into {space.name}.</p>
      <span className="circ-vh" role="status" aria-live="polite">{copied === 'ok' ? 'Link copied.' : (ready ? 'Link ready.' : '')}</span>
    </div>
  );
};

Object.assign(window, { InviteForm: CandA3InviteForm });
