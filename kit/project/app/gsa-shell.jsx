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

// The current page is marked in the nav (aria-current) for the link that opens it.
function GsaNavLink({ to, route, children }) {
  const here = route.name === to;
  return (
    <GsaButton kind="link" aria-current={here ? 'page' : undefined} onClick={() => window.GsaStore.go(to)}>{children}</GsaButton>
  );
}

function GsaShellHeader({ g }) {
  const signedIn = g.session === 'signed-in';
  const name = [g.person.first, g.person.last].filter(Boolean).join(' ');
  return (
    <header className="gsa-shell-header" data-posture={g.isApp ? 'app' : 'web'}>
      <div className="gsa-shell-bar">
        {signedIn ? (
          <GsaButton kind="link" className="gsa-shell-name" onClick={() => window.GsaStore.go('home')}>{window.GSA_APP_NAME}</GsaButton>
        ) : (
          <span className="gsa-shell-name">{window.GSA_APP_NAME}</span>
        )}
        {signedIn ? (
          <>
            <nav className="gsa-shell-nav" aria-label="Main">
              {/* Home is the frame's own (ui-design: the persistent frame carries movement between areas). */}
              <GsaNavLink to="home" route={g.route}>Home</GsaNavLink>
              {/* One tag for both links (G39): how they are reached is each app's pick. */}
              <GsaPick>
                <GsaNavLink to="shared-space" route={g.route}>Shared space</GsaNavLink>
                <GsaNavLink to="paid-feature" route={g.route}>Paid feature</GsaNavLink>
              </GsaPick>
            </nav>
            <div className="gsa-shell-end">
              <GsaMenu
                label={name}
                items={[
                  { label: 'Account', onSelect: () => window.GsaStore.go('account') },
                  { label: 'Sign out', onSelect: () => window.GsaStore.signOut() },
                ]}
              />
            </div>
          </>
        ) : (
          <nav className="gsa-shell-end" aria-label="Main">
            <GsaShellLink to="sign-in">Sign in</GsaShellLink>
          </nav>
        )}
      </div>
    </header>
  );
}

function GsaShellFooter({ g }) {
  // GSA-029.AF-01: the Refund Policy is reachable wherever the app takes payment, in both postures.
  const takesPayment = g.tiers.payment;
  const showPlans = takesPayment && !g.isApp && g.tiers.plans;
  return (
    <footer className="gsa-shell-footer">
      <div className="gsa-shell-footer-in">
        <nav className="gsa-shell-footer-nav" aria-label="Footer">
          {/* Pick (G8): GSA-029 Additional leaves where the legal links sit to each app. */}
          <GsaPick>
            <GsaShellLink to="legal" params={{ page: 'terms' }}>Terms</GsaShellLink>
            <GsaShellLink to="legal" params={{ page: 'privacy' }}>Privacy policy</GsaShellLink>
            {takesPayment ? <GsaShellLink to="legal" params={{ page: 'refund' }}>Refund Policy</GsaShellLink> : null}
            <GsaShellLink to="connect">Connect your AI app</GsaShellLink>
            <GsaShellLink to="deletion-request">Deletion request</GsaShellLink>
          </GsaPick>
          {showPlans ? <GsaPick><GsaShellLink to="plans">Plans</GsaShellLink></GsaPick> : null}
        </nav>
        <p className="gsa-shell-support">
          <span className="gsa-slot-prefix">Slot: </span>Support address: <a href={'mailto:' + window.GSA_SUPPORT}>{window.GSA_SUPPORT}</a>
        </p>
      </div>
    </footer>
  );
}

function GsaFrame({ children }) {
  const g = useGsa();
  return (
    <div className="gsa-shell">
      <GsaShellHeader g={g} />
      <main className="gsa-shell-main">{children}</main>
      <div id="gsa-overlay-root" className="gsa-overlay-root" />
      <GsaShellFooter g={g} />
    </div>
  );
}

Object.assign(window, { GsaFrame });
