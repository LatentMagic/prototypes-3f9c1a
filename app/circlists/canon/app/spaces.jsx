// ============================================================================
// Circlists — Spaces, Invitations, Account settings.
// CreateSpace (full page), InviteMember (+ space-full), InvalidInvite,
// SpaceFull, AccountSettings.
// ============================================================================

const SPACE_CAP = 10;

// ---- In-shell content page frame (back + centred column) -------------------
const ContentPage = ({ onBack, backLabel = 'Back', children, max = 'var(--max-feed-width)' }) => (
  <main style={{ flex: 1, width: '100%' }}>
    <div style={{ maxWidth: max, margin: '0 auto', padding: '24px 24px 96px', width: '100%' }}>
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
          textTransform: 'uppercase', color: 'var(--color-fg-3)', marginBottom: 'var(--space-8)',
        }}>{eyebrow}</div>
      )}
      <h1 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.2,
        letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0,
      }}>{title}</h1>
      <p style={{
        fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.55,
        color: 'var(--color-fg-2)', margin: 'var(--space-8) auto 0', maxWidth: 400,
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
  // Step 1 of the shared Create → Fund wizard: same shell, same column as step 2.
  return (
    <WizardShell flow={{ step: 0 }} onExit={canCancel === false ? null : onCancel}>
      <WizardTitle>Create a circle</WizardTitle>
      <p style={{
        fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5,
        color: 'var(--color-fg-2)', margin: '0 0 24px',
      }}>A shared list for up to {SPACE_CAP} people. You fund it as champion; everyone joins free.</p>
      <form onSubmit={submit} noValidate style={{ width: '100%', textAlign: 'left' }}>
        <Field ref={ref} label="Circle name" name="space-name" placeholder="e.g. Backend Pod"
          value={name} onChange={(e) => { setName(e.target.value); if (err) setErr(null); }} error={err} />
        <Button type="submit" variant="primary" size="lg" full disabled={!name.trim()}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Continue<Icon name="arrow-right" size={18} style={{ display: 'inline-block' }} /></span>
        </Button>
      </form>
    </WizardShell>
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

// ---- Funding state on the card ---------------------------------------------
// Marker plus ONE line beneath it, and never a second indicator elsewhere on the
// card. Every state reads as TEXT — colour and symbol never carry it alone.
//   active    — nothing beneath the marker
//   ending    — a cancellation is scheduled; the line carries the date and that
//               the circle sleeps then. BOTH buttons are live (LM-638): there IS
//               now a way back — Resume funding stands where Cancel funding stands
//               on the active card, and Update payment card is identical to its
//               active-state self (a stale card is the next thing that would end
//               the funding after a resume, so the two sit together here as they
//               do there). Resume takes no confirm and charges nothing: there is
//               nothing to confirm. The succession
//               clause IS carried here (restored 2026-08-03): the cancel confirm
//               said it once, at a moment you pass through; this card is the
//               standing description of the state, and without it Ending reads as
//               the circle's end rather than a handover. Two clauses, and both are
//               load-bearing — attempts to compress it to one sentence lost either
//               that ANY member may fund it or that funding it champions them.
//               Leave the wording alone; it may wrap, and that is the cheaper price.
//   retrying  — a renewal payment failed and is being retried; the line carries
//               the retry window as a DURATION, never a date. Both funding
//               buttons stay live: updating the card is the recovery route.
//               MARKER: 'Payment failed', ratified 2026-08-03. Not 'Retrying'
//               (describes our system's activity, not the state of the funding,
//               and reassures at the moment the line asks you to act) and not
//               'Card declined' (over-specific — expiry, bank block and
//               insufficient funds all land here too). The marker carries the
//               fact, so the line beneath carries only the remedy and the stake.
const FUNDING_MARKERS = { active: 'Active', ending: 'Ending', retrying: 'Payment failed' };
const circFmtDay = (ts) => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const fundingStateLine = (f) => {
  if (!f) return null;
  if (f.state === 'ending') return `Funding ends on ${circFmtDay(f.endsAt)}. The circle then goes to sleep, and whoever funds it next champions it. You can resume funding any time before that date.`;
  if (f.state === 'retrying') return `Update the card within ${f.retryWindow || '30 days'} to keep the circle awake.`;
  return null;
};

// ---- Invite card (champion, circle not full) -------------------------------
// The card itself lives in app/invite-link.jsx and is read per render off
// window, like every other droppable module: the champion enters an address, the
// card hands back a link bound to it, and the app mails nothing. Absent that
// module the members surface simply offers no invite — which is how the homepage
// demo omits it, the gate covering circle settings so the surface is never
// reached there.
// The circle-full panel stays in MembersSurface: it is not part of the card.

// ---- Members surface (in shell) --------------------------------------------
// Reached via "N members" in the space header. Lists members + "Championed by X".
// Role-conditioned: champion sees Invite + Manage funding; a non-champion sees
// the list and calm lines that only the champion can invite / manage funding.
// Champion also gets: inline space rename, and per-member removal (kebab menu).
// The roster's trailing slot means "this row's membership": the crown states the
// role, a kebab carries what can be done to it. The champion's kebab acts on other
// people (Remove); your own kebab acts on you (Leave), and is the only one a
// non-champion sees — which is what marks it as yours without a label. Scope it
// strictly to YOUR MEMBERSHIP OF THIS CIRCLE; it is not a settings drawer.
const MembersSurface = ({ space, isChampion, championName, onInvite, onManageFunding, onCancelFunding, onResumeFunding, onRename, onRemoveMember, onStartCircle, onLeave }) => {
  // onInvite is no longer consumed: getting a link does not add a member. A row
  // appearing the moment you get one is a delivery confirmation, and the app
  // makes none — someone appears in the roster when they join, outside the app.
  // main.jsx still passes it; the states register uses the same path.
  const full = space.members.length >= SPACE_CAP;
  // Read per render, like every other droppable module (app/invite-link.jsx).
  const Invite = window.InviteForm;
  // No one holds the role: the champion's account was deleted, so their roster row
  // and crown are gone and NO management is offered to anybody until the paid
  // period runs out. Reading, adding and reacting are untouched.
  const unchampioned = !space.champion;
  const funding = space.funding || { state: 'active' };
  const fundingLine = fundingStateLine(funding);

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
              ) : (isChampion || isYou) ? (
                <div data-kebab-root style={{ position: 'relative', flexShrink: 0 }}>
                  <button onClick={() => setMenuFor(menuFor === m.name ? null : m.name)}
                    aria-haspopup="menu" aria-expanded={menuFor === m.name} aria-label={isYou ? 'Your membership' : `Manage ${m.name}`}
                    className="circ-cardaction circ-cardaction-icon" style={{ minWidth: 44, minHeight: 44, color: 'var(--color-fg-2)' }}>
                    <Icon name="more-vertical" size={18} />
                  </button>
                  {menuFor === m.name && (
                    <div role="menu" style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 20, minWidth: 168,
                      background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
                      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)', padding: 6,
                    }}>
                      <button role="menuitem" className="circ-menuitem"
                        onClick={() => { setMenuFor(null); if (isYou) { onLeave && onLeave(); } else { setRemoving(m); } }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                          background: 'transparent', border: 0, cursor: 'pointer', padding: '9px 10px', minHeight: 40,
                          borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
                          color: 'var(--color-destructive)', whiteSpace: 'nowrap' }}>
                        <Icon name={isYou ? 'logout' : 'trash'} size={16} /> {isYou ? 'Leave this circle' : 'Remove'}
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
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)', margin: '0 0 4px' }}>This circle is full</h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0 }}>
              It’s reached its limit of {SPACE_CAP} members, so no one new can be added right now.
            </p>
            {/* Door: own line, grey sentence with the link inside — same construction as the empty state. */}
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5,
              color: 'var(--color-fg-3)', margin: 'var(--space-4) 0 0',
            }}><button type="button" onClick={onStartCircle} className="circ-doorlink" style={{
              backgroundColor: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit',
            }}>Start another circle</button> any time.</p>
          </div>
        ) : (
          Invite ? <Invite space={space} /> : null
        )
      ) : unchampioned ? (
        /* Where the crown was: nobody champions this circle, how long it stays
           open, and who may bring it back. A statement, never a disabled control. */
        <div style={{
          padding: '0 2px', marginBottom: 'var(--space-5)',
          fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)',
        }}>
          No one is championing this circle. It stays open until {space.openUntil ? circFmtDay(space.openUntil) : 'the end of the paid period'}, then goes to sleep — after that any member can fund it and champion it from then on.
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0 2px', marginBottom: 'var(--space-5)',
          fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)',
        }}>
          <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="crown" size={15} /></span>
          <span>
            The Champion manages this circle’s membership and funding. You can{' '}
            {/* Door: continuation of the same line, green on the last two words only. */}
            <button type="button" onClick={onStartCircle} className="circ-doorlink" style={{
              backgroundColor: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit',
            }}>champion your own</button>.
          </span>
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
              {funding.state === 'active' && <Icon name="check" size={15} color="var(--color-fg-3)" />} {FUNDING_MARKERS[funding.state] || FUNDING_MARKERS.active}
            </div>
          </div>
          {fundingLine && (
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0 }}>{fundingLine}</p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            <Button variant="secondary" icon={<Icon name="card" size={16} />} onClick={() => onManageFunding && onManageFunding('update')}>Update payment card</Button>
            {funding.state === 'ending'
              ? <Button variant="secondary" onClick={() => onResumeFunding && onResumeFunding()}>Resume funding</Button>
              : <Button variant="tertiary" style={{ color: 'var(--color-destructive)' }} onClick={() => onCancelFunding && onCancelFunding()}>Cancel funding</Button>}
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: 'var(--space-4) 0 0' }}>
            Billed to {space.championEmail || 'your account'} · card ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span>.
          </p>
        </div>
      )}

      {/* The champion's exit, stated last: same crown icon, tier and construction as the
          non-champion's crown line, at the end of the page after the funding card it
          refers to. Why their own roster row carries no "…" — the role binds them to the
          funding, so releasing the funding is the exit. */}
      {isChampion && !unchampioned && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0 2px', marginTop: 'var(--space-5)',
          fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)',
        }}>
          <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="crown" size={15} /></span>
          <span>You champion this circle, so you can’t leave it. Cancel funding to step back.</span>
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

const AccountSettings = ({ user, onChangeEmail, onDeleteAccount }) => {
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
        <><SsoManaged /><div style={{ height: 'var(--space-5)' }} /><DeleteAccount onDelete={onDeleteAccount} /><SupportLine /></>
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
      <div style={{ height: 'var(--space-5)' }} />
      <DeleteAccount onDelete={onDeleteAccount} />
      <SupportLine />
      </>)}
    </ContentPage>
  );
};

// ---- Delete your account ---------------------------------------------------
// Its own card, matching the two above it. The page's rule is that an action
// lives inside the card that names its subject (Update email in Change email,
// Update password in Change password); deleting acts on the account, and the
// page title is the only thing that named it — so the control had no home and
// was floating between the last card and the footer, reading as a text link
// because the mailto beneath recruited it into that kind. A tertiary
// destructive only reads as a control beside a boxed sibling (Cancel funding
// next to Update payment card); alone on page ground it does not.
//   Appendix 3 rejected a red box as a settings page's terminal element — that
// ruling was about a naked destructive-secondary on bare ground WITH a better
// home available (the roster-row kebab). There is no roster row here. Inside a
// card that names its subject the red is contained, and rank comes from being
// last rather than from being loud. Outline, never fill.
//   One line of consequence only: the confirmation carries the rest.
// AMENDED — the split between card and dialog, which was wrong twice:
//   CARD: what is true for EVERYONE, standing — what you lose (your account and
//     your place in the circles) and what survives you (everything you added,
//     with your name, exactly as the Leave dialog puts it: a communal library
//     does not lose its contents when a member goes). No billing here: most
//     members do not champion anything, and the card is read by all of them.
//   DIALOG: the irreversible beat, then the consequence that only lands for
//     champions — funding cancelled, the paid period honoured, then sleep.
//     Money stops at the moment of the act, so it is named at that moment.
//   NEITHER: "you can manage a circle's funding from its settings first" — cut.
//     A signpost to another surface is not a consequence, and it was the longest
//     line in the flow. The support address sits directly beneath this card.
const DeleteAccount = ({ onDelete }) => (
  <div style={{
    background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
  }}>
    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)', marginBottom: 6 }}>Delete account</div>
    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0 }}>
      Your account goes, and your place in every circle. What you added stays, with your name.
    </p>
    <div style={{ marginTop: 'var(--space-4)' }}>
      <Button variant="destructive-secondary" onClick={() => onDelete && onDelete()}>Delete your account</Button>
    </div>
  </div>
);

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

// ---- Reverification — one prompt, in front of a sensitive act -------------
// The identity provider requires this before a sensitive action runs; it is not
// optional and cannot be turned off. It is a re-login in place, not a trip back
// to sign-in, and because the UI is ours to draw the prototype draws a stand-in:
// the beat is real, the mechanism is not modelled.
//   Password account -> re-enter the password. SSO account -> bounce through the
// provider. Change password does NOT use this: its form already takes the
// current password, so a prompt for the same password immediately above a field
// asking for it again communicates nothing and reads as a defect.
//   It asserts identity only. It never re-argues the decision — the confirm
// dialog before it already carried the cost.
const ReverifyDialog = ({ provider, onPass, onCancel }) => {
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState(null);
  const pwRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  React.useEffect(() => {
    invokerRef.current = document.activeElement;
    const id = setTimeout(() => { const el = provider ? cancelRef.current : pwRef.current; el && el.focus(); }, 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus();
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    if (!provider && !pw) { setErr('Enter your password.'); return; }
    onPass && onPass();
  };
  return (
    <div role="dialog" aria-modal="true" aria-label="Confirm it’s you"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }} className="circ-anim-fade">
      <form onSubmit={submit} noValidate style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)',
          lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 8px',
        }}>Confirm it’s you</h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.55,
          color: 'var(--color-fg-2)', margin: '0 0 var(--space-5)',
        }}>{provider ? `Continue through ${provider} to confirm it’s you.` : 'Enter your password to continue.'}</p>
        {!provider && (
          <Field ref={pwRef} label="Password" name="reverify-password" type="password" autoComplete="current-password" placeholder="••••••••"
            value={pw} onChange={(e) => { setPw(e.target.value); if (err) setErr(null); }} error={err} />
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: provider ? 0 : 'var(--space-2)' }}>
          <Button ref={cancelRef} type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">{provider ? `Continue with ${provider}` : 'Continue'}</Button>
        </div>
      </form>
    </div>
  );
};

// ---- Change email — reverify, then verify the NEW address by code ----------
// Two different checks doing two different jobs: reverification proves it is
// still YOU (the provider requires it before a sensitive act), and the emailed
// code proves control of the NEW address. The email only switches after the
// code is confirmed.
//   AMENDED 2026-08-04 — this previously asserted no re-auth step was needed
// because the code proved control of the address. That reasoning holds for the
// address; it does not answer identity, and the provider gates the act either way.
const ChangeEmail = ({ user, onChangeEmail }) => {
  const [phase, setPhase] = React.useState('idle'); // idle | reverify | verify | done
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
    if (Object.keys(next).length === 0) { setCode(''); setPhase('reverify'); }
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

      {phase === 'reverify' && (
        <ReverifyDialog provider={user.ssoProvider} onPass={() => setPhase('verify')} onCancel={() => setPhase('idle')} />
      )}

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
// The line does NOT promise email: the app mails nothing, and an invitation is a
// link the champion sends by whatever means they choose (app/invite-link.jsx).
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
        color: 'var(--color-fg-3)', margin: 'var(--space-8) auto 0', maxWidth: 380, textWrap: 'balance',
      }}>Waiting on an invite? The champion will send a link.</p>
    </div>
  </main>
);

Object.assign(window, { SPACE_CAP, ContentPage, CreateSpace, NoSpaceHome, MembersSurface, AccountSettings, SsoManaged, InvalidInvite, SpaceFull, SupportLine, ReverifyDialog });
