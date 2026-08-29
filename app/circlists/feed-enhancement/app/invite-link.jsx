// ============================================================================
// The invite card (champion, circle not full). Publishes window.InviteForm,
// which app/spaces.jsx renders on the members surface.
//
// The champion enters the friend's address and the card hands back a link bound
// to that address, to copy and send in their own words. The app mails nothing
// and offers no control that would. Nothing is remembered: no invited list, no
// pending row, no delivery state, no revoke, no resend.
//
// Minting a link does NOT touch the roster. A row appearing the moment you get a
// link is a delivery confirmation, which this feature does not make: someone
// appears in the roster when they join, and joining happens outside the app.
//
// ---- THE SHAPE -------------------------------------------------------------
//
// ONE shape for the card's whole life: the field with its act beside it, then
// the link's box beneath, always present. No second face, so there is no swap —
// which is what four treatments of that swap, played as the app, were for
// (docs/specs/a3-invite-link/playground/circlists-a3-transition.html).
//
// **The press is the moment.** Deriving the link as the address is typed was
// tried and cannot work: `a@b.co` is a valid address and so is
// `a@b.company.com`, so no check can tell a finished address from a plausible
// prefix — only the person typing knows. Every product that binds an invite to
// an address commits on a press; the ones without a press (link-sharing) have no
// address to finish. So Get a link is the one place the address is validated.
//
// **The link box is the copy control.** There is no Copy button: the box itself
// is a button, because a second filled control competing with Get a link is what
// made this card busy. Which means it takes a control's shape — bordered box,
// copy glyph on the right, hover and press states, focus ring, the full 44px hit
// target. Anything that acts as a button reads as a button.
//
// **Get a link demotes once its link is on screen.** Before the press the green
// is the act; after it, the act is copying, and the box carries it. So the card
// holds exactly one filled control at any time, and never two.
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
// exists only when the recipient opens the link. In the prototype the token is
// computed locally and instantly.
//
// Editing the address empties the box: a link for the old address is a lie about
// who this one is for. That is also why there is no "Invite someone else" — the
// address IS the control.
//
// The funding fact rides the helper, not the field's hint. The hint slot IS the
// error slot: a typo'd address would replace "they join free" with the
// validation message, destroying the card's one fact about money. Who pays is
// the funding card, directly below.
// ============================================================================
const INVITE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITE_BASE = 'https://circlists.com/join/';
// Stands in for the one idempotent request the real card makes per press: long
// enough to be a moment, short enough not to be a wait.
const INVITE_SIGN_MS = 480;

// A pure function of address + circle, plus the window it is signed in: a link
// is valid for 30 days, so it cannot be eternal. Pressing again after one lapses
// mints a fresh link for the same address, which is what makes "just do it
// again" a real recovery route — nothing has to be remembered, so the card never
// needs a line telling the champion the link is not kept anywhere.
const inviteToken = (email, spaceId) => {
  const s = String(email || '').trim().toLowerCase() + '|' + String(spaceId || '');
  let a = 2166136261, b = 5381;
  for (let i = 0; i < s.length; i++) {
    a = ((a ^ s.charCodeAt(i)) * 16777619) >>> 0;
    b = (((b * 33) >>> 0) ^ s.charCodeAt(i)) >>> 0;
  }
  const chunk = (n) => ('000' + n.toString(36)).slice(-4);
  return chunk(a) + '-' + chunk(b);
};

const inviteCardStyles = {
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)', marginBottom: 4 },
  helper: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '0 0 var(--space-4)' },
  label: { display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)', marginBottom: 6 },
  linkLabelText: { fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' },
  bind: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 'var(--space-4) 0 0' },
};

const InviteCard = ({ space }) => {
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
  // thing to press next and the arrival is not only a visual event.
  React.useEffect(() => { if (ready && boxRef.current) boxRef.current.focus(); }, [ready]);

  const submit = (e) => {
    e.preventDefault();
    if (!INVITE_EMAIL_RE.test(v)) { setErr('Enter a valid email address.'); return; }
    if (space.members.some(m => (m.email || '').toLowerCase() === v)) {
      setErr('That person is already a member of this circle.'); return;
    }
    setErr(null); setCopied(null); setWorking(true);
    clearTimeout(signRef.current);
    signRef.current = setTimeout(() => {
      setLink({ email: v, url: INVITE_BASE + inviteToken(v, space.id) });
      setWorking(false);
    }, INVITE_SIGN_MS);
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
    <div className="circ-invite-card">
      <div style={inviteCardStyles.title}>Invite a member</div>
      <p style={inviteCardStyles.helper}>Enter their email address and copy the link. Send it to them yourself — they join free.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="invite-email" style={inviteCardStyles.label}>Email</label>
        <div className="circ-invite-row">
          <div className="circ-invite-field">
            <Field ref={fieldRef} name="invite-email" type="email" placeholder="name@example.com"
              value={email} onChange={change} error={err} />
          </div>
          <div className="circ-invite-act">
            <Button type="submit" variant={ready ? 'secondary' : 'primary'} loading={working}
              style={{ width: 'var(--circ-invite-btnw, 100%)' }}
              icon={<Icon name="link" size={16} color={ready ? 'var(--color-fg-2)' : '#fff'} />}>Get a link</Button>
          </div>
        </div>
      </form>
      {/* How long it lasts sits on the label line, not in the prose: it is a
          property of the link, so it belongs beside the link's own name rather
          than as a third sentence. Shown only once there IS a link — the same
          discipline as the box, which holds nothing of value until then. */}
      <div className="circ-invite-linkhead">
        <span style={inviteCardStyles.linkLabelText}>Invite link</span>
        {ready && <span className="circ-invite-life">Valid for 30 days</span>}
      </div>
      {/* Keyed on the link so a NEW one remounts the box and the arrival wash
          plays again — the wash is the readiness signal, so it fires every time,
          not only the first. */}
      {ready ? (
        <button key={link.url} ref={boxRef} type="button" onClick={copy} title="Copy link"
          className="circ-invite-box circ-invite-copy circ-glow">
          <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={15} color="var(--color-fg-3)" /></span>
          {/* The whole link, never truncated: it wraps when the card is narrow.
              A span rather than a readonly input so nothing is hidden behind a
              scroll. */}
          <span ref={linkRef} className="circ-invite-url">{link.url}</span>
          <span className="circ-invite-glyph"><Icon name={copied === 'ok' ? 'check' : 'copy'} size={16} /></span>
          <span className="circ-vh">{copied === 'ok' ? 'Copied' : 'Copy link'}</span>
        </button>
      ) : (
        <div className="circ-invite-box" data-dim="">
          <span style={{ display: 'inline-flex', flexShrink: 0 }}>
            {working ? <Spinner size={14} light={false} /> : <Icon name="link" size={15} color="var(--color-fg-3)" />}
          </span>
          <span className="circ-invite-url" />
        </div>
      )}
      {copied === 'manual' && (
        <p style={inviteCardStyles.bind}>Copy it by hand — the link is selected.</p>
      )}
      <p style={inviteCardStyles.bind}>It only works for that address, and it takes them straight into {space.name}.</p>
      <span className="circ-vh" role="status" aria-live="polite">{copied === 'ok' ? 'Link copied.' : (ready ? 'Link ready.' : '')}</span>
    </div>
  );
};

Object.assign(window, { InviteForm: InviteCard });
