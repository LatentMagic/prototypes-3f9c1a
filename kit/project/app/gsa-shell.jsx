// ============================================================================
// Golden Sample App - the frame. Header (web) / top bar (app posture), User
// menu, pick links, footer. Wraps every route that is not in GSA_BARE.
// Styles: gsa-shell.css.
// ============================================================================

function GsaShellLink({ to, params, children }) {
  return (
    <GsaButton kind="link" onClick={() => window.GsaStore.go(to, params || {})}>{children}</GsaButton>
  );
}

function GsaShellHeader({ g }) {
  const signedIn = g.session === 'signed-in';
  const name = [g.person.first, g.person.last].filter(Boolean).join(' ');
  return (
    <header className="gsa-shell-header" data-posture={g.isApp ? 'app' : 'web'}>
      <div className="gsa-shell-bar">
        <span className="gsa-shell-name">{window.GSA_APP_NAME}</span>
        <nav className="gsa-shell-nav" aria-label="Main">
          {signedIn ? (
            <>
              <GsaPick><GsaShellLink to="shared-space">Shared space</GsaShellLink></GsaPick>
              <GsaPick><GsaShellLink to="paid-feature">Paid feature</GsaShellLink></GsaPick>
              <GsaMenu
                label={name}
                items={[
                  { label: 'Account', onSelect: () => window.GsaStore.go('account') },
                  { label: 'Sign out', onSelect: () => window.GsaStore.signOut() },
                ]}
              />
            </>
          ) : (
            <GsaShellLink to="sign-in">Sign in</GsaShellLink>
          )}
        </nav>
      </div>
    </header>
  );
}

function GsaShellFooter({ g }) {
  const takesPayment = g.tiers.payment && !g.isApp;
  const showPlans = takesPayment && g.tiers.plans;
  return (
    <footer className="gsa-shell-footer">
      <nav className="gsa-shell-footer-nav" aria-label="Footer">
        <GsaShellLink to="legal" params={{ page: 'terms' }}>Terms</GsaShellLink>
        <GsaShellLink to="legal" params={{ page: 'privacy' }}>Privacy policy</GsaShellLink>
        {takesPayment ? <GsaShellLink to="legal" params={{ page: 'refund' }}>Refund Policy</GsaShellLink> : null}
        <GsaShellLink to="connect">Connect your AI app</GsaShellLink>
        <GsaShellLink to="deletion-request">Deletion request</GsaShellLink>
        {showPlans ? <GsaPick><GsaShellLink to="plans">Plans</GsaShellLink></GsaPick> : null}
      </nav>
      <p className="gsa-shell-support">
        Support: <a href={'mailto:' + window.GSA_SUPPORT}>{window.GSA_SUPPORT}</a>
      </p>
    </footer>
  );
}

function GsaFrame({ children }) {
  const g = useGsa();
  return (
    <div className="gsa-shell">
      <GsaShellHeader g={g} />
      <main className="gsa-shell-main">{children}</main>
      <GsaShellFooter g={g} />
    </div>
  );
}

Object.assign(window, { GsaFrame });
