// ============================================================================
// Golden Sample App - invitations: Invite page (S15), Invite link landing (S16),
// Invalid / Full / Other-account pages (S17-S19), Shared space (S20).
// Styles: gsa-people.css. Outcomes come from gsaInviteOutcome in the store.
// ============================================================================

const GSA_INVITE_BASE = 'https://gsa.example/invite/';
const GSA_INVITE_DAYS = 30;
const GSA_INVITE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- Invite page (S15): GSA-024. Nothing is stored; the page starts empty. ---
function GsaInvite() {
  const g = useGsa();
  const [link, setLink] = React.useState(null);
  const [made, setMade] = React.useState(0);
  const [copy, setCopy] = React.useState(null);
  const [busy, run] = useGsaBusy();
  const linkRef = React.useRef(null);
  const copyRef = React.useRef(null);
  const members = g.space.members;

  const form = useGsaForm({
    email: (v) => {
      const email = String(v || '').trim();
      if (!email) return 'Enter an email address.';
      if (!GSA_INVITE_EMAIL.test(email)) return 'Enter a valid email address.';
      if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) return 'This person is already a member.';
      return null;
    },
  });
  const email = form.bind('email');
  const edit = (e) => {
    email.onChange(e);
    if (link) { setLink(null); setCopy(null); }
  };

  const request = form.submit((values) => {
    if (g.space.role !== 'owner' || g.space.full) return;
    run(() => {
      const n = made + 1;
      setMade(n);
      setLink({ email: values.email.trim(), url: GSA_INVITE_BASE + g.invite.id + (n > 1 ? n : '') });
      setCopy(null);
    });
  });

  // "Get a link" is replaced by the link: focus goes to Copy link.
  const hasLink = !!link;
  React.useEffect(() => { if (hasLink && copyRef.current) copyRef.current.focus({ preventScroll: true }); }, [hasLink]);

  const select = () => { if (linkRef.current) { linkRef.current.focus({ preventScroll: true }); linkRef.current.select(); } };
  const copyLink = () => {
    if (!link) return;
    const refuse = () => { setCopy('refused'); select(); };
    if (g.review.clipboard === 'refused') { refuse(); return; }
    try {
      Promise.resolve(navigator.clipboard.writeText(link.url)).then(() => setCopy('copied'), refuse);
    } catch (err) { refuse(); }
  };

  const back = <GsaButton kind="link" onClick={() => GsaStore.go('shared-space')}>Back to the shared space</GsaButton>;

  let body;
  if (g.space.role !== 'owner') {
    body = <GsaStatusLine>Only the owner of the shared space can invite people.</GsaStatusLine>;
  } else if (g.space.full) {
    body = <GsaStatusLine tone="warning">The shared space is full. No more people can be invited.</GsaStatusLine>;
  } else {
    body = (
      <form className="gsa-people-form" onSubmit={request} noValidate>
        <p className="gsa-text">Enter one email address and the app makes a link for it. The link works for {GSA_INVITE_DAYS} days. The app sends nothing: give the link to the person yourself.</p>
        <GsaField {...email} onChange={edit} label="Email address" type="email" autoComplete="off" />
        {link ? null : <GsaButton type="submit" busy={busy}>Get a link</GsaButton>}
        {busy ? <GsaStatusLine>Making a link for {form.values.email.trim()}.</GsaStatusLine> : null}
        {link ? (
          <div className="gsa-people-link">
            <GsaStatusLine tone="success">A link for {link.email} is ready. It is valid until {gsaLong(gsaDate(GSA_INVITE_DAYS))}.</GsaStatusLine>
            <label className="gsa-people-link-label" htmlFor="gsa-people-link-url">Invite link for {link.email}</label>
            <div className="gsa-people-link-row">
              <input id="gsa-people-link-url" ref={linkRef} className="gsa-field-input gsa-people-link-url" readOnly value={link.url} onFocus={(e) => e.target.select()} />
              <GsaButton kind="secondary" ref={copyRef} onClick={copyLink}>Copy link</GsaButton>
            </div>
            {copy === 'copied' ? <GsaStatusLine tone="success">Copied. The link is on your clipboard.</GsaStatusLine> : null}
            {copy === 'refused' ? <GsaStatusLine tone="warning">This device would not copy it. The link is selected: copy it by hand.</GsaStatusLine> : null}
            <p className="gsa-field-hint">To make a link for another address, change the email address above.</p>
          </div>
        ) : null}
      </form>
    );
  }

  return (
    <main className="gsa-page gsa-people-page">
      <h1 className="gsa-heading">Invite someone</h1>
      {body}
      <div className="gsa-people-back">{back}</div>
    </main>
  );
}

// ---- Invite link landing (S16): the guard always resolves it, this is a stand-in. -
function GsaInviteLink() {
  React.useEffect(() => {
    const s = GsaStore.get();
    const out = window.gsaInviteOutcome ? window.gsaInviteOutcome(s) : { name: 'invite-invalid' };
    GsaStore.replace(out.name, gsaParams(out));
  }, []);
  return <main className="gsa-page gsa-people-page"><GsaSpin /></main>;
}

// ---- One-way pages: S17 invalid, S18 full ------------------------------------
function GsaInviteEnd({ title, children }) {
  return (
    <main className="gsa-page gsa-people-page">
      <h1 className="gsa-heading">{title}</h1>
      <p className="gsa-text">{children}</p>
      <GsaButton kind="secondary" onClick={() => GsaStore.go('home')}>Go to Home</GsaButton>
    </main>
  );
}
function GsaInviteInvalid() {
  return <GsaInviteEnd title="This invitation cannot be used">Ask the person who sent it for a new link.</GsaInviteEnd>;
}
function GsaInviteFull() {
  return <GsaInviteEnd title="This shared space is full">There is no room for another member right now.</GsaInviteEnd>;
}

// ---- S19: the invitation is for another account ------------------------------
function GsaInviteOtherAccount() {
  const continueAs = () => {
    const id = GsaStore.get().invite.id;
    GsaStore.set({ review: { inviteMatch: 'match' }, pending: { invite: id } });
    GsaStore.signOut({ keepPending: true });
  };
  return (
    <main className="gsa-page gsa-people-page">
      <h1 className="gsa-heading">This invitation is for another person</h1>
      <p className="gsa-text">You are signed in as someone else. To accept it, sign in as the person it was sent to.</p>
      <GsaButton onClick={continueAs}>Continue as the invited person</GsaButton>
    </main>
  );
}

// ---- Shared space (S20): a Slot and the Owner's way to Invite (no member list, D4) -
function GsaSharedSpace({ route }) {
  const g = useGsa();
  const notice = route && route.notice;
  return (
    <main className="gsa-page gsa-people-page">
      <h1 className="gsa-heading">Shared space</h1>
      {notice === 'joined' ? <GsaStatusLine tone="success">You joined the shared space.</GsaStatusLine> : null}
      {notice === 'already-member' ? <GsaStatusLine>You are already a member of this shared space.</GsaStatusLine> : null}
      <div className="gsa-people-block">
        <GsaSlot>each app fills this. What a member sees first goes here.</GsaSlot>
      </div>
      {g.space.role === 'owner' ? (
        <div className="gsa-people-block">
          <GsaButton kind="secondary" onClick={() => GsaStore.go('invite')}>Invite someone</GsaButton>
        </div>
      ) : null}
    </main>
  );
}

Object.assign(window, {
  GsaInvite, GsaInviteLink, GsaInviteInvalid, GsaInviteFull, GsaInviteOtherAccount, GsaSharedSpace,
});
