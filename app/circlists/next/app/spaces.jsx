// ============================================================================
// Circlists — Spaces, Invitations, Account settings.
// CreateSpace (full page), InviteMember (+ space-full), InvalidInvite,
// SpaceFull, AccountSettings.
// ============================================================================

const SPACE_CAP = 10;

// ---- In-shell content page frame (back + centred column) -------------------
const ContentPage = ({ onBack, backLabel = 'Back', children, max = 'var(--max-feed-width)' }) => (
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
    minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px', textAlign: 'center',
  }}>
    <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)' }}><Wordmark size={21} /></div>
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
    title="This circle is full."
    body={`It’s reached its limit of ${SPACE_CAP} members. Ask whoever invited you to free up a spot.`}
    actionLabel="Go home" onAction={onHome} />
);

// ---- Create space (dedicated full page) ------------------------------------
const CreateSpace = ({ onCreate, onCancel, canCancel, initialName = '' }) => {
  const [name, setName] = React.useState(initialName);
  const [err, setErr] = React.useState(null);
  const ref = React.useRef(null);
  React.useEffect(() => { const t = setTimeout(() => ref.current && ref.current.focus(), 60); return () => clearTimeout(t); }, []);
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Give your circle a name.'); return; }
    onCreate(name.trim());
  };
  return (
    <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '20px 24px' }}>
        <button onClick={onCancel} aria-label="Exit" style={{
          background: 'transparent', border: 0, padding: 8, margin: '-8px -8px -8px 0', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40,
          borderRadius: 'var(--radius-md)', color: 'var(--color-fg-2)',
        }}><Icon name="x" size={20} /></button>
      </header>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 64px' }}>
        <div style={{ maxWidth: 460, width: '100%', margin: '0 auto' }}>
          <form onSubmit={submit} noValidate style={{ marginTop: 'min(6vh,40px)' }}>
            <h1 style={{
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.15,
              letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: '0 0 8px',
            }}>Create a circle</h1>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.5,
              color: 'var(--color-fg-2)', margin: '0 0 var(--space-8)',
            }}>A circle is a shared list for a small, trusted group of up to {SPACE_CAP} people. You'll fund it as its champion; everyone joins free.</p>
            <Field ref={ref} label="Circle name" name="space-name" placeholder="e.g. Backend Pod"
              value={name} onChange={(e) => { setName(e.target.value); if (err) setErr(null); }} error={err} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <Button type="submit" variant="primary" size="lg" disabled={!name.trim()}>Continue</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ---- Remove-member dialog — champion only ----------------------------------
// Matches the Delete-link confirm treatment (destructive). The removed member
// KEEPS their real name on any links they added — "former member" anonymisation
// is reserved for account deletion, never removal.
const RemoveMemberDialog = ({ member, onConfirm, onCancel }) => {
  const cancelRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  React.useEffect(() => {
    invokerRef.current = document.activeElement;
    const id = setTimeout(() => cancelRef.current && cancelRef.current.focus(), 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(id); window.removeEventListener('keydown', onKey); if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus(); };
  }, []);
  if (!member) return null;
  const name = member.name;
  const firstName = name.includes(' ') ? name.split(' ')[0] : name;
  return (
    <div role="alertdialog" aria-modal="true" aria-label={`Remove ${firstName}?`}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} className="circ-anim-fade">
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 8px' }}>Remove {firstName}?</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)' }}>They lose access to this circle. Their links stay, with their name. You can re-invite them later.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={() => onConfirm()}>Remove {firstName}</Button>
        </div>
      </div>
    </div>
  );
};

// ---- Rename-circle dialog — champion only ----------------------------------
// Focused dialog (matches the Remove-member treatment). Auto-growing textarea so
// a long name wraps and stays fully visible instead of scrolling out of a single
// line; 60-char cap enforced silently; Save trims. Enter saves, Esc/scrim/Cancel
// dismiss. No X, no explanatory subline — the title and one field carry it.
const RenameCircleDialog = ({ currentName, onSave, onCancel }) => {
  const [draft, setDraft] = React.useState(currentName);
  const [err, setErr] = React.useState(null);
  const areaRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  React.useEffect(() => {
    invokerRef.current = document.activeElement;
    const id = setTimeout(() => { const el = areaRef.current; if (el) { el.focus(); const n = el.value.length; el.setSelectionRange(n, n); } }, 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(id); window.removeEventListener('keydown', onKey); if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus(); };
  }, []);
  const save = () => { const v = draft.trim(); if (!v) { setErr('Give your circle a name.'); return; } onSave(v); };
  return (
    <div role="dialog" aria-modal="true" aria-label="Rename circle"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} className="circ-anim-fade">
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 var(--space-5)' }}>Rename circle</h2>
        <input id="rename-circle-input" ref={areaRef} value={draft} maxLength={30} aria-label="Circle name" aria-invalid={!!err}
          onChange={(e) => { setDraft(e.target.value); if (err) setErr(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } }}
          style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: 'var(--color-fg-1)', border: '1px solid ' + (err ? 'var(--color-destructive)' : 'var(--color-border-1)'), borderRadius: 'var(--radius-md)', padding: '12px 14px', minHeight: 44, background: 'var(--color-surface)' }} />
        {err && (
          <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 7, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4, color: 'var(--color-destructive)' }}>
            <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="x" size={14} /></span><span>{err}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!draft.trim()}>Save</Button>
        </div>
      </div>
    </div>
  );
};

// ---- Members surface (in shell) --------------------------------------------
// Reached via "N members" in the space header. Lists members + "Championed by X".
// Role-conditioned: champion sees Invite + Manage funding; a non-champion sees
// the list and calm lines that only the champion can invite / manage funding.
// Champion also gets: inline space rename, and per-member removal (kebab menu).
const MembersSurface = ({ space, isChampion, championName, onInvite, onManageFunding, onRename, onRemoveMember }) => {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [sentTo, setSentTo] = React.useState(null);
  const full = space.members.length >= SPACE_CAP;
  const ref = React.useRef(null);
  React.useEffect(() => { if (isChampion && !full) { const t = setTimeout(() => ref.current && ref.current.focus(), 60); return () => clearTimeout(t); } }, [isChampion, full]);

  // Rename (champion only) — opens a focused dialog
  const [renaming, setRenaming] = React.useState(false);
  const beginRename = () => setRenaming(true);

  // Per-member kebab + removal (champion only)
  const [menuFor, setMenuFor] = React.useState(null);
  const [removing, setRemoving] = React.useState(null);
  React.useEffect(() => {
    if (!menuFor) return;
    const onDoc = (e) => { if (!e.target.closest('[data-kebab-root]')) setMenuFor(null); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuFor(null); };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); window.removeEventListener('keydown', onKey); };
  }, [menuFor]);

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!EMAIL_RE.test(v)) { setErr('Enter a valid email address.'); return; }
    const already = space.members.some(m => (m.email || '').toLowerCase() === v);
    if (already) { setErr('That person is already a member of this circle.'); return; }
    setErr(null); setSentTo(email.trim()); setEmail(''); onInvite && onInvite(v);
  };

  return (
    <ContentPage>
      {(
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: '0 0 6px' }}>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.25,
            letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: 0,
          }}>{space.name}</h1>
          {isChampion && (
            <button onClick={beginRename} aria-label="Rename circle" className="circ-cardaction circ-cardaction-icon"
              style={{ minWidth: 40, minHeight: 40, color: 'var(--color-fg-3)' }}>
              <Icon name="edit" size={18} />
            </button>
          )}
        </div>
      )}
      {renaming && <RenameCircleDialog currentName={space.name} onSave={(v) => { onRename && onRename(v); setRenaming(false); }} onCancel={() => setRenaming(false)} />}
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)' }}>
        {space.members.length} of {SPACE_CAP} members
      </p>

      {/* Member list */}
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-2)', marginBottom: 'var(--space-3)' }}>Members</div>
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
        borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)',
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
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>{m.name}</div>
                {m.email && (isYou || memberIsChampion) && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12, color: 'var(--color-fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>}
              </div>
              {memberIsChampion ? (
                <span aria-label="Champion" title="Champion" style={{ minWidth: 44, minHeight: 44, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-fg-3)' }}>
                  <Icon name="crown" size={16} />
                </span>
              ) : isChampion ? (
                <div data-kebab-root style={{ position: 'relative', flexShrink: 0 }}>
                  <button onClick={() => setMenuFor(menuFor === m.name ? null : m.name)}
                    aria-haspopup="menu" aria-expanded={menuFor === m.name} aria-label={`Manage ${m.name}`}
                    className="circ-cardaction circ-cardaction-icon" style={{ minWidth: 44, minHeight: 44, color: 'var(--color-fg-2)' }}>
                    <Icon name="more-vertical" size={18} />
                  </button>
                  {menuFor === m.name && (
                    <div role="menu" style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 20, minWidth: 168,
                      background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
                      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)', padding: 6,
                    }}>
                      <button role="menuitem" className="circ-menuitem" onClick={() => { setMenuFor(null); setRemoving(m); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                          background: 'transparent', border: 0, cursor: 'pointer', padding: '9px 10px', minHeight: 40,
                          borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
                          color: 'var(--color-destructive)' }}>
                        <Icon name="trash" size={16} /> Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
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
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 18, color: 'var(--color-fg-1)', margin: '0 0 8px' }}>This circle is full.</h2>
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
              Everyone you invite joins free — you fund the circle for all of them.
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
          display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0 2px', marginBottom: 'var(--space-5)',
          fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)',
        }}>
          <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="crown" size={15} /></span>
          <span>The Champion manages this circle’s membership and funding.</span>
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
            Billed to {space.championEmail || 'your account'} · card ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span>.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Button variant="secondary" icon={<Icon name="card" size={16} />} onClick={() => onManageFunding && onManageFunding('update')}>Update payment card</Button>
            <Button variant="tertiary" style={{ color: 'var(--color-destructive)' }} onClick={() => onManageFunding && onManageFunding('cancel')}>Cancel funding</Button>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: 'var(--space-4) 0 0' }}>
            Both open this circle’s subscription on our payment provider.
          </p>
        </div>
      )}

      <SupportLine />

      {removing && (
        <RemoveMemberDialog member={removing}
          onConfirm={() => { onRemoveMember && onRemoveMember(removing.name); setRemoving(null); }}
          onCancel={() => setRemoving(null)} />
      )}
    </ContentPage>
  );
};
// ---- Support line — quiet contact footer, shared across settings surfaces --
// Labels support rather than commanding "get in touch"; address in mono per the
// domain convention. Reads OPERATOR_EMAIL at render time (single source).
const SupportLine = () => (
  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, color: 'var(--color-fg-3)', margin: 'var(--space-6) 0 0' }}>
    <a href={`mailto:${window.OPERATOR_EMAIL}`} className="circ-textlink" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--color-fg-3)', textDecoration: 'underline' }}>{window.OPERATOR_EMAIL}</a>
  </p>
);

const AccountSettings = ({ user, onChangeEmail }) => {
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
    <ContentPage>
      <h1 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.25,
        letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 6px',
      }}>Account</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)' }}>{user.email}</p>

      {user.ssoProvider ? (
        <><SsoManaged /><SupportLine /></>
      ) : (<>
      <ChangeEmail user={user} onChangeEmail={onChangeEmail} />

      <div style={{ height: 'var(--space-5)' }} />

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
      <SupportLine />
      </>)}
    </ContentPage>
  );
};

// ---- SSO-managed account — single card for BOTH email and password ---------
// When the user signed in through an identity provider, email and password are
// not ours to change: they live with the provider. One consolidated card says
// so (no two separate managed rows) and points them to the provider.
const SsoManaged = () => (
  <div style={{
    background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
  }}>
    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)', marginBottom: 6 }}>Change email &amp; password</div>
    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0 }}>
      Your email and password are managed by your sign-in provider and can be changed there.
    </p>
  </div>
);

// ---- Change email — verify the NEW address by code, then switch ------------
// No password / re-auth step: control of the new address is proven by a code
// sent to it, and the email only switches AFTER that code is confirmed.
const ChangeEmail = ({ user, onChangeEmail }) => {
  const [phase, setPhase] = React.useState('idle'); // idle | verify | done
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [err, setErr] = React.useState({});
  const codeRef = React.useRef(null);

  React.useEffect(() => { if (phase === 'verify') { const t = setTimeout(() => codeRef.current && codeRef.current.focus(), 60); return () => clearTimeout(t); } }, [phase]);

  const start = (e) => {
    e.preventDefault();
    const next = {};
    const v = email.trim().toLowerCase();
    if (!EMAIL_RE.test(v)) next.email = 'Enter a valid email address.';
    else if (v === (user.email || '').toLowerCase()) next.email = 'That’s already your email. Enter a different one.';
    setErr(next);
    if (Object.keys(next).length === 0) { setCode(''); setPhase('verify'); }
  };

  const confirm = (e) => {
    e.preventDefault();
    if (code.replace(/\s/g, '').length < 6) { setErr({ code: 'That code’s not right — check and re-enter.' }); return; }
    onChangeEmail && onChangeEmail(email.trim());
    setPhase('done'); setEmail(''); setCode(''); setErr({});
    setTimeout(() => setPhase('idle'), 3600);
  };

  const cancel = () => { setPhase('idle'); setEmail(''); setCode(''); setErr({}); };

  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
    }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)', marginBottom: 'var(--space-5)' }}>Change email</div>

      {phase === 'verify' ? (
        <form onSubmit={confirm} noValidate>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '0 0 var(--space-4)' }}>
            Enter the code sent to <strong style={{ color: 'var(--color-fg-1)', fontWeight: 600 }}>{email.trim()}</strong>. Your email switches once it’s confirmed.
          </p>
          <Field ref={codeRef} label="Verification code" name="email-code" mono type="text" inputMode="numeric" maxLength={6} placeholder="000000"
            value={code} onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '')); if (err.code) setErr({}); }}
            style={{ letterSpacing: '0.4em', fontSize: 20, fontWeight: 600 }} error={err.code} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={cancel}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm</Button>
          </div>
        </form>
      ) : (
        <form onSubmit={start} noValidate>
          <Field label="New email" name="new-email" type="email" autoComplete="email" placeholder="new@example.com"
            value={email} onChange={(e) => { setEmail(e.target.value); setErr(s => ({ ...s, email: null })); }} error={err.email} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 'var(--space-2)' }}>
            {phase === 'done' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>
                <Icon name="check" size={16} color="var(--color-accent)" /> Email updated.
              </span>
            )}
            <Button type="submit" variant="primary">Update email</Button>
          </div>
        </form>
      )}
    </div>
  );
};

// ---- No-space home (authenticated home for a user in no space) --------------
// Rendered inside the app shell (rail + header present; header carries no space
// name). A calm empty-state inviting the user to create a space, plus a quiet
// line acknowledging invitations. No funding language lives here.
const NoSpaceHome = ({ onCreate }) => (
  <main style={{ flex: 1, width: '100%' }}>
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: 'calc(var(--circ-vh) - var(--top-bar-height))',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px 96px', textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.18,
        letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0,
      }}>You’re not in a circle yet.</h1>
      <div style={{ marginTop: 'var(--space-8)' }}>
        <Button variant="primary" size="lg" icon={<Icon name="plus" size={16} color="#fff" strokeWidth={2} />} onClick={onCreate}>Create a circle</Button>
      </div>
      <p style={{
        fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, lineHeight: 1.5,
        color: 'var(--color-fg-3)', margin: '24px auto 0', maxWidth: 380,
      }}>Waiting on an invite? It’ll arrive by email and bring you straight in.</p>
    </div>
  </main>
);

Object.assign(window, { SPACE_CAP, ContentPage, CreateSpace, NoSpaceHome, MembersSurface, AccountSettings, SsoManaged, InvalidInvite, SpaceFull });
