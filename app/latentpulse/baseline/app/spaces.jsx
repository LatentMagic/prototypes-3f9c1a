// ============================================================================
// LatentPulse — Spaces, Invitations, Account settings.
// CreateSpace (full page), InviteMember (+ space-full), InvalidInvite,
// SpaceFull, AccountSettings.
// ============================================================================

const SPACE_CAP = 10;

// ---- In-shell content page frame (back + centred column) -------------------
const ContentPage = ({ onBack, backLabel = 'Back', children, max = 480 }) => (
  <main style={{ flex: 1, width: '100%' }}>
    <div style={{ maxWidth: max, margin: '0 auto', padding: '24px 20px 96px', width: '100%' }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: 'transparent', border: 0, padding: '8px 6px', margin: '0 0 16px -6px', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40,
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-2)',
        }}><Icon name="arrow-left" size={16} /> {backLabel}</button>
      )}
      {children}
    </div>
  </main>
);

// ---- Standalone calm full page (invalid invite / space full) ---------------
const CalmPage = ({ eyebrow, title, body, actionLabel, onAction }) => (
  <div style={{
    minHeight: 'var(--lp-vh)', background: 'var(--color-canvas)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px', textAlign: 'center',
  }}>
    <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)' }}><Wordmark size={16} /></div>
    <div style={{ maxWidth: 460 }}>
      {eyebrow && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'var(--color-fg-3)', marginBottom: 16,
        }}>{eyebrow}</div>
      )}
      <h1 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.2,
        letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0,
      }}>{title}</h1>
      <p style={{
        fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.55,
        color: 'var(--color-fg-2)', margin: '14px auto 0', maxWidth: 400,
      }}>{body}</p>
      <div style={{ marginTop: 'var(--space-8)' }}>
        <Button variant="primary" size="lg" onClick={onAction}>{actionLabel}</Button>
      </div>
    </div>
  </div>
);

const InvalidInvite = ({ onHome }) => (
  <CalmPage eyebrow="Invitation"
    title="This invite isn’t valid anymore."
    body="It may have expired or been revoked."
    actionLabel="Go home" onAction={onHome} />
);

const SpaceFull = ({ onHome }) => (
  <CalmPage eyebrow="Invitation"
    title="This space is full."
    body={`It’s reached its limit of ${SPACE_CAP} members. Ask whoever invited you to free up a spot.`}
    actionLabel="Go home" onAction={onHome} />
);

// ---- Create space (dedicated full page) ------------------------------------
const CreateSpace = ({ onCreate, onCancel, canCancel }) => {
  const [name, setName] = React.useState('');
  const [err, setErr] = React.useState(null);
  const ref = React.useRef(null);
  React.useEffect(() => { const t = setTimeout(() => ref.current && ref.current.focus(), 60); return () => clearTimeout(t); }, []);
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Give your space a name.'); return; }
    onCreate(name.trim());
  };
  return (
    <div style={{ minHeight: 'var(--lp-vh)', background: 'var(--color-canvas)', padding: '28px 20px 48px' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'min(8vh,56px)' }}>
          {canCancel ? (
            <button onClick={onCancel} style={{
              background: 'transparent', border: 0, padding: '8px 6px', margin: '0 0 0 -6px', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40,
              fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-2)',
            }}><Icon name="arrow-left" size={16} /> Back</button>
          ) : <Wordmark size={16} />}
          <span />
        </div>
        <form onSubmit={submit} noValidate style={{ marginTop: 8 }}>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.15,
            letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: '0 0 8px',
          }}>Create a space</h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.5,
            color: 'var(--color-fg-2)', margin: '0 0 var(--space-8)',
          }}>A space is a shared queue for a small, trusted group. You’ll fund it as its champion — up to {SPACE_CAP} people join free.</p>
          <Field ref={ref} label="Space name" name="space-name" placeholder="e.g. Backend Pod"
            value={name} onChange={(e) => { setName(e.target.value); if (err) setErr(null); }} error={err} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            {canCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
            <Button type="submit" variant="primary" size="lg" disabled={!name.trim()}>Continue</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---- Members surface (in shell) --------------------------------------------
// Reached via "N members" in the space header. Lists members + "Championed by X".
// Role-conditioned: champion sees Invite + Manage funding; a non-champion sees
// the list and calm lines that only the champion can invite / manage funding.
const MembersSurface = ({ space, isChampion, championName, onBack, onInvite, onManageFunding }) => {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [sentTo, setSentTo] = React.useState(null);
  const full = space.members.length >= SPACE_CAP;
  const ref = React.useRef(null);
  React.useEffect(() => { if (isChampion && !full) { const t = setTimeout(() => ref.current && ref.current.focus(), 60); return () => clearTimeout(t); } }, [isChampion, full]);

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!EMAIL_RE.test(v)) { setErr('Enter a valid email address.'); return; }
    const already = space.members.some(m => (m.email || '').toLowerCase() === v);
    if (already) { setErr('That person is already a member of this space.'); return; }
    setErr(null); setSentTo(email.trim()); setEmail(''); onInvite && onInvite(v);
  };

  const championLabel = isChampion ? 'You' : (championName || 'the champion');

  return (
    <ContentPage onBack={onBack} backLabel="Back to space">
      <div style={{
        fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--color-fg-3)', marginBottom: 10,
      }}>Members</div>
      <h1 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.25,
        letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 6px',
      }}>{space.name}</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)' }}>
        {space.members.length} of {SPACE_CAP} members · Championed by {championLabel}
      </p>

      {/* Member list */}
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-2)', marginBottom: 'var(--space-3)' }}>Members</div>
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--space-6)',
      }}>
        {space.members.map((m, i) => {
          const isYou = m.name === 'You';
          const memberIsChampion = (isChampion && isYou) || (!isChampion && m.name === championName);
          return (
            <div key={m.name + i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              borderTop: i ? '1px solid var(--color-border-2)' : 'none',
            }}>
              <Avatar name={m.name} size={32} accent={isYou} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>{m.name}{isYou ? ' (you)' : ''}</div>
                {m.email && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12, color: 'var(--color-fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>}
              </div>
              {memberIsChampion && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 11, letterSpacing: '0.04em',
                  textTransform: 'uppercase', color: 'var(--color-fg-3)', flexShrink: 0,
                }}>Champion</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Invite — champion only */}
      {isChampion ? (
        full ? (
          <div style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', textAlign: 'left', marginBottom: 'var(--space-5)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 18, color: 'var(--color-fg-1)', margin: '0 0 8px' }}>This space is full.</h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: 'var(--color-fg-2)', margin: 0 }}>
              It’s reached its limit of {SPACE_CAP} members, so no one new can be added right now.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', marginBottom: 'var(--space-5)',
          }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)', marginBottom: 4 }}>Invite a member</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '0 0 var(--space-4)' }}>
              Everyone you invite joins free — you fund the space for all of them.
            </p>
            <Field ref={ref} label="Email" name="invite-email" type="email" placeholder="name@example.com"
              value={email} onChange={(e) => { setEmail(e.target.value); if (err) setErr(null); if (sentTo) setSentTo(null); }} error={err} />
            {sentTo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '-8px 0 16px',
                fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>
                <Icon name="check" size={16} color="var(--color-accent)" /> Invite sent to {sentTo}.
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary" icon={<Icon name="share" size={16} color="#fff" />}>Send invite</Button>
            </div>
          </form>
        )
      ) : (
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-5) var(--space-6)', marginBottom: 'var(--space-5)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ marginTop: 1, color: 'var(--color-fg-3)', flexShrink: 0 }}><Icon name="users" size={18} /></span>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-fg-1)' }}>Only the champion can invite new members.</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', marginTop: 2 }}>Only the champion manages this space’s funding.</div>
          </div>
        </div>
      )}

      {/* Manage funding — champion only */}
      {isChampion && (
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 'var(--space-2)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>Funding</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>
              <Icon name="check" size={15} color="var(--color-fg-3)" /> Active
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '0 0 var(--space-4)' }}>
            £9 a month funds this space for everyone in it. Billed to {space.championEmail || 'your account'} · card ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span>.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Button variant="secondary" icon={<Icon name="card" size={16} />} onClick={() => onManageFunding && onManageFunding('update')}>Update payment card</Button>
            <Button variant="tertiary" onClick={() => onManageFunding && onManageFunding('cancel')}>Cancel funding</Button>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: 'var(--space-4) 0 0' }}>
            Both open this space’s subscription on our payment provider.
          </p>
        </div>
      )}
    </ContentPage>
  );
};

// ---- Account settings (in shell): change password --------------------------
const AccountSettings = ({ user, onBack }) => {
  const [cur, setCur] = React.useState('');
  const [np, setNp] = React.useState('');
  const [np2, setNp2] = React.useState('');
  const [err, setErr] = React.useState({});
  const [done, setDone] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!cur) next.cur = 'Enter your current password.';
    if (np.length < 8) next.np = 'Use at least 8 characters.';
    if (np && np2 !== np) next.np2 = 'Passwords don’t match. Re-enter to confirm.';
    setErr(next);
    if (Object.keys(next).length === 0) { setDone(true); setCur(''); setNp(''); setNp2(''); setTimeout(() => setDone(false), 3200); }
  };
  return (
    <ContentPage onBack={onBack} backLabel="Back to space">
      <h1 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.25,
        letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 6px',
      }}>Account</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)' }}>{user.email}</p>

      <form onSubmit={submit} noValidate style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
      }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)', marginBottom: 'var(--space-5)' }}>Change password</div>
        <Field label="Current password" name="cur" type="password" autoComplete="current-password" placeholder="••••••••"
          value={cur} onChange={(e) => { setCur(e.target.value); setErr(s => ({ ...s, cur: null })); setDone(false); }} error={err.cur} />
        <Field label="New password" name="np" type="password" autoComplete="new-password" placeholder="At least 8 characters"
          value={np} onChange={(e) => { setNp(e.target.value); setErr(s => ({ ...s, np: null })); setDone(false); }} error={err.np} />
        <Field label="Confirm new password" name="np2" type="password" autoComplete="new-password" placeholder="Re-enter new password"
          value={np2} onChange={(e) => { setNp2(e.target.value); setErr(s => ({ ...s, np2: null })); setDone(false); }} error={err.np2} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 'var(--space-2)' }}>
          {done && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>
              <Icon name="check" size={16} color="var(--color-accent)" /> Password updated.
            </span>
          )}
          <Button type="submit" variant="primary">Update password</Button>
        </div>
      </form>
    </ContentPage>
  );
};

Object.assign(window, { SPACE_CAP, ContentPage, CreateSpace, MembersSurface, AccountSettings, InvalidInvite, SpaceFull });
