// ============================================================================
// Candidate (invite-landing) — mobile readiness M6. NOT canon, nothing ratified.
// A signed-out person taps an invite link and lands on a web page that names
// the circle and the inviter before any sign-in. window.CIRC_INVITE_VARIANT:
//   'rec'   — the invite page under Safari's Smart App Banner (iPhone Safari)
//   'strip' — the invite page with a home-made "Get the app" strip (Android)
//   'gate'  — a full "Get the app or continue in browser" page first
//   'none'  — the invite page, nothing about the app
// The Smart App Banner is drawn by Safari, not the page; it is shown here with
// a label saying so, never as app UI.
// ============================================================================

const INVITE_DEMO = { circle: 'Tuesday Book Club', inviter: 'Joe M.', members: 4 };

const SafariAppBanner = () => (
  <div style={{ position: 'relative', width: '100%' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 10px 8px',
      background: '#f2f2f7', borderBottom: '1px solid #c6c6c8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      outline: '2px dashed #8e8e93', outlineOffset: -2,
    }}>
      <span aria-hidden="true" style={{ color: '#8e8e93', fontSize: 18, lineHeight: 1, width: 14, textAlign: 'center' }}>×</span>
      <span style={{ width: 52, height: 52, borderRadius: 12, background: '#fff', border: '1px solid #e0e0e5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <LogoMark size={38} />
      </span>
      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#000' }}>Circlists</span>
        <span style={{ display: 'block', fontSize: 12, color: '#6e6e73' }}>LatentMagic</span>
        <span style={{ display: 'block', fontSize: 12, color: '#6e6e73' }}>Open in the App Store</span>
      </span>
      <span style={{ fontSize: 15, fontWeight: 600, color: '#007aff', padding: '0 4px' }}>View</span>
    </div>
    <div style={{
      position: 'absolute', right: 8, bottom: -11, zIndex: 2,
      fontFamily: 'var(--font-mono, ui-monospace, monospace)', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase',
      background: '#3a3a3c', color: '#fff', borderRadius: 4, padding: '3px 6px',
    }}>Safari's banner · drawn by Safari, not the page</div>
  </div>
);

const GetAppStrip = () => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
    background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-1)',
    fontFamily: 'var(--font-sans)',
  }}>
    <LogoMark size={28} />
    <span style={{ flex: 1, fontSize: 14, color: 'var(--color-fg-1)', lineHeight: 1.3 }}>Circlists is better in the app</span>
    <Button variant="secondary" size="sm">Get the app</Button>
    <button aria-label="Dismiss" style={{ background: 'transparent', border: 0, padding: 4, color: 'var(--color-fg-3)', display: 'inline-flex' }}><Icon name="x" size={16} /></button>
  </div>
);

const InviteLead = ({ circle, inviter, members }) => (
  <div style={{ width: '100%', maxWidth: 400, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-5)' }}>
    <Avatar name={inviter} size={40} />
    <div style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.35 }}>
      <div style={{ fontSize: 15, color: 'var(--color-fg-2)' }}><strong style={{ color: 'var(--color-fg-1)', fontWeight: 600 }}>{inviter}</strong> invited you to a circle</div>
      <div style={{ fontSize: 13, color: 'var(--color-fg-3)' }}>{members} members</div>
    </div>
  </div>
);

const InvitePage = ({ onSignup, onSignin, onGoogle }) => {
  const d = INVITE_DEMO;
  return (
    <AuthFrame lead={<InviteLead {...d} />} title={d.circle} subtitle="Join to see what the circle is sharing."
      footer={<span>Already have an account? <TextLink onClick={onSignin}>Sign in</TextLink></span>}>
      <Button variant="primary" full size="lg" onClick={onSignup}>Create an account to join</Button>
      <OrDivider />
      <Button variant="secondary" full size="lg" icon={<Icon name="google" size={18} />} onClick={onGoogle}>Continue with Google</Button>
      <ConsentLine />
    </AuthFrame>
  );
};

const GetAppGate = ({ onContinue }) => {
  const d = INVITE_DEMO;
  return (
    <AuthFrame lead={<InviteLead {...d} />} title="Get the Circlists app" subtitle={`Open ${d.circle} in the app, or carry on in your browser.`}>
      <Button variant="primary" full size="lg">Get the app</Button>
      <div style={{ height: 'var(--space-3)' }} />
      <Button variant="secondary" full size="lg" onClick={onContinue}>Continue in browser</Button>
    </AuthFrame>
  );
};

const InviteLanding = ({ onSignup, onSignin, onGoogle }) => {
  const variant = window.CIRC_INVITE_VARIANT || 'rec';
  const [past, setPast] = React.useState(false);
  if (variant === 'gate' && !past) return <GetAppGate onContinue={() => setPast(true)} />;
  return (
    <div>
      {variant === 'rec' && <SafariAppBanner />}
      {variant === 'strip' && <GetAppStrip />}
      <InvitePage onSignup={onSignup} onSignin={onSignin} onGoogle={onGoogle} />
    </div>
  );
};

Object.assign(window, { InviteLanding });
