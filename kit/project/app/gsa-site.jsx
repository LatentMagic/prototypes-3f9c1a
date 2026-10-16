// ============================================================================
// Golden Sample App - site pages: Not-found, Can't connect, Paid feature (Slot),
// legal pages, Deletion request page. Styles: gsa-shell.css.
// ============================================================================

const GSA_SITE_PAID_VIEWS = ['subscribed', 'ending', 'payment-failed'];

// GSA-030: one link, no reason, no detail. Home when signed in, Sign-in for a Visitor.
// What a Visitor sees at a Dead address that is not a Signed-in address is each app's pick (D18).
function GsaNotFound() {
  const g = useGsa();
  const signedIn = g.session === 'signed-in';
  return (
    <div className="gsa-page">
      <h1 className="gsa-heading">Page not found</h1>
      <p className="gsa-text">
        {signedIn ? 'There is no page at this address.' : <GsaPick>There is no page at this address.</GsaPick>}
      </p>
      <GsaButton onClick={() => window.GsaStore.go(signedIn ? 'home' : 'sign-in')}>
        {signedIn ? 'Go to Home' : 'Go to Sign in'}
      </GsaButton>
    </div>
  );
}

// ui-design standard (not a story): a designed can't-connect state that can be tried again.
function GsaCantConnect() {
  const [busy, run] = useGsaBusy();
  // Once Home has loaded in place, focus goes to its heading, not the page root (ui-design: focus restoration).
  const retry = () => run(() => {
    window.GsaStore.back();
    let tries = 0;
    const land = () => {
      const h = document.querySelector('.gsa-shell-main h1');
      if (h && h.textContent !== "Can't connect") {
        if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      } else if (tries++ < 30) requestAnimationFrame(land);
    };
    requestAnimationFrame(land);
  });
  return (
    <div className="gsa-page">
      <h1 className="gsa-heading">Can't connect</h1>
      <p className="gsa-text">Check your connection, then try again.</p>
      <GsaButton busy={busy} onClick={retry}>Try again</GsaButton>
    </div>
  );
}

// Slot (G3): no gate wording is invented.
function GsaPaidFeature() {
  const g = useGsa();
  const has = GSA_SITE_PAID_VIEWS.includes(g.view);
  return (
    <div className="gsa-page">
      <h1 className="gsa-heading">Paid feature</h1>
      {has
        ? <GsaSlot>the paid feature</GsaSlot>
        : <GsaSlot>each app decides what a person without a Subscription sees here</GsaSlot>}
    </div>
  );
}

const GSA_SITE_LEGAL = {
  terms: { title: 'Terms', slot: 'the Terms of this app' },
  privacy: { title: 'Privacy policy', slot: 'the Privacy policy of this app' },
  refund: { title: 'Refund Policy', slot: 'the Refund Policy of this app' },
};

// GSA-029: public. The Refund Policy exists only where the app takes payment (lean q12).
function GsaLegal({ route }) {
  const g = useGsa();
  const page = GSA_SITE_LEGAL[route && route.page];
  if (!page || (route.page === 'refund' && !g.tiers.payment)) return <GsaNotFound />;
  return (
    <div className="gsa-page">
      <h1 className="gsa-heading">{page.title}</h1>
      <GsaSlot>{page.slot}</GsaSlot>
    </div>
  );
}

// GSA-029.AF-02: public; says how to ask, lists what is erased (lean G34).
function GsaDeletionRequest() {
  const g = useGsa();
  return (
    <div className="gsa-page">
      <h1 className="gsa-heading">Ask for your account to be deleted</h1>
      <p className="gsa-text">
        Write to the Support address from the email address of the account.
        You do not need the Store app.
      </p>
      <GsaSlot>Support address: <a href={'mailto:' + window.GSA_SUPPORT}>{window.GSA_SUPPORT}</a></GsaSlot>
      <p className="gsa-text">We erase:</p>
      <ul className="gsa-shell-list">
        <li>the account and its sign-in details</li>
        <li>the items in the queue</li>
        {g.tiers.payment ? <li>the record of the Subscription</li> : null}
        <li>the notification settings of the account</li>
      </ul>
      <p className="gsa-text">This cannot be undone.</p>
    </div>
  );
}

Object.assign(window, { GsaNotFound, GsaCantConnect, GsaPaidFeature, GsaLegal, GsaDeletionRequest });
