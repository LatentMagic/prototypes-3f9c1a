// ============================================================================
// GSA plans and paying: Plans page (S12), Subscribe page (S13), Hosted payment
// page (S14, a pictured payment-provider page). Stories GSA-018, 020, 023, 027.
// The chosen plan arrives as the route param `plan`. Prices are placeholders.
// ============================================================================
const GSA_CHECKOUT_ORDER = ['yearly', 'monthly'];
const GSA_CHECKOUT_NAMES = { yearly: 'Yearly', monthly: 'Monthly' };
const GSA_CHECKOUT_ACTIVE = ['subscribed', 'ending', 'payment-failed'];

function gsaCheckoutPlan(id) {
  return window.GSA_PLANS && window.GSA_PLANS[id] ? window.GSA_PLANS[id] : { id, price: '' };
}

// "£30 a year" -> "£30"
function gsaCheckoutDue(id) {
  return String(gsaCheckoutPlan(id).price).split(' a ')[0];
}

function gsaCheckoutRenews(id) {
  const d = new Date(window.gsaDate ? window.gsaDate(0) : new Date());
  if (id === 'yearly') d.setUTCFullYear(d.getUTCFullYear() + 1);
  else d.setUTCMonth(d.getUTCMonth() + 1);
  return d;
}

function gsaCheckoutLong(date) {
  return window.gsaLong ? window.gsaLong(date) : String(date);
}

function gsaCheckoutGo(e, name, params) {
  if (e && e.preventDefault) e.preventDefault();
  window.GsaStore.go(name, params || {});
}

function GsaCheckoutLink({ name, params, kind, children }) {
  const attrs = kind ? { className: 'gsa-btn', 'data-kind': kind } : {};
  return <a {...attrs} href={'#' + name} onClick={(e) => gsaCheckoutGo(e, name, params)}>{children}</a>;
}

// ---- S12 Plans page ---------------------------------------------------------
function GsaPlans() {
  const g = window.useGsa();
  const has = GSA_CHECKOUT_ACTIVE.includes(g.view);
  return (
    <div className="gsa-page-wide gsa-checkout-plans">
      <h1 className="gsa-heading">Plans</h1>
      {has ? (
        <div className="gsa-checkout-stack">
          <window.GsaStatusLine tone="neutral">You have a Subscription.</window.GsaStatusLine>
          <div><GsaCheckoutLink name="account" kind="secondary">Go to your Account</GsaCheckoutLink></div>
        </div>
      ) : (
        <div className="gsa-checkout-stack">
          <div className="gsa-checkout-covers">
            <section className="gsa-checkout-cover">
              <h2 className="gsa-checkout-sub">What a Subscription covers</h2>
              <window.GsaSlot>what the Subscription covers: each app fills this</window.GsaSlot>
            </section>
            <section className="gsa-checkout-cover">
              <h2 className="gsa-checkout-sub">What is free</h2>
              <window.GsaSlot>what the app gives with no Subscription: each app fills this</window.GsaSlot>
            </section>
          </div>
          <ul className="gsa-checkout-plan-list">
            {GSA_CHECKOUT_ORDER.map((id) => (
              <li key={id} className="gsa-checkout-plan-item">
                <window.GsaCard title={GSA_CHECKOUT_NAMES[id]}>
                  <p className="gsa-checkout-price">{gsaCheckoutPlan(id).price}</p>
                  <p className="gsa-checkout-note"><window.GsaPick>Placeholder price: each app sets its own</window.GsaPick></p>
                </window.GsaCard>
              </li>
            ))}
          </ul>
          <div><GsaCheckoutLink name="subscribe" kind="primary">Subscribe</GsaCheckoutLink></div>
        </div>
      )}
    </div>
  );
}

// ---- S13 Subscribe page -----------------------------------------------------
function GsaSubscribe() {
  const g = window.useGsa();
  const route = g.route || {};
  const [plan, setPlan] = React.useState(route.plan === 'monthly' ? 'monthly' : 'yearly');
  const [busy, run] = window.useGsaBusy();
  const visitor = g.session === 'visitor';
  const subscribe = () => {
    run(() => {
      if (visitor) {
        window.GsaStore.set({ pending: { plan } });
        window.GsaStore.go('sign-up');
      } else {
        window.GsaStore.go('hosted-payment', { mode: 'subscribe', plan });
      }
    });
  };
  return (
    <div className="gsa-page gsa-checkout-subscribe">
      <div className="gsa-checkout-head">
        <h1 className="gsa-heading">Subscribe</h1>
        {!visitor ? <window.GsaButton kind="link" onClick={() => window.GsaStore.go('home')}>Close</window.GsaButton> : null}
      </div>
      {route.notice === 'not-completed' ? (
        <div className="gsa-checkout-stack-sm">
          <window.GsaStatusLine tone="warning">The payment was not completed. You have paid nothing.</window.GsaStatusLine>
        </div>
      ) : null}
      <fieldset className="gsa-checkout-choices">
        <legend className="gsa-checkout-sub">Choose a Plan</legend>
        {GSA_CHECKOUT_ORDER.map((id) => (
          <label key={id} className="gsa-checkout-choice" data-selected={plan === id ? 'true' : undefined}>
            <input type="radio" name="gsa-checkout-plan" value={id} checked={plan === id} onChange={() => setPlan(id)} />
            <span className="gsa-checkout-choice-text">
              <span className="gsa-checkout-choice-name">{GSA_CHECKOUT_NAMES[id]}</span>
              <span className="gsa-checkout-choice-price">{gsaCheckoutPlan(id).price}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <p className="gsa-checkout-note"><window.GsaPick>Placeholder price: each app sets its own</window.GsaPick></p>
      <div className="gsa-checkout-due" aria-live="polite">
        <p className="gsa-checkout-due-line"><strong>{gsaCheckoutDue(plan)}</strong> due today</p>
        <p className="gsa-text">Your Plan renews on {gsaCheckoutLong(gsaCheckoutRenews(plan))}.</p>
      </div>
      <window.GsaButton busy={busy} onClick={subscribe}>Subscribe</window.GsaButton>
    </div>
  );
}

// ---- S14 Hosted payment page (the payment provider's page, pictured) -------
function GsaCheckoutCardFields() {
  return (
    <div className="gsa-checkout-card-fields">
      <window.GsaField label="Card number" defaultValue="4242 4242 4242 4242" inputMode="numeric" autoComplete="off" name="gsa-checkout-number" />
      <div className="gsa-checkout-card-row">
        <window.GsaField label="Expiry" defaultValue="12 / 29" autoComplete="off" name="gsa-checkout-expiry" />
        <window.GsaField label="Security code" defaultValue="123" inputMode="numeric" autoComplete="off" name="gsa-checkout-cvc" />
      </div>
    </div>
  );
}

function GsaHostedPayment() {
  const g = window.useGsa();
  const route = g.route || {};
  const mode = route.mode === 'update-card' ? 'update-card' : 'subscribe';
  const plan = route.plan === 'monthly' || route.plan === 'yearly' ? route.plan : (g.sub && g.sub.plan) || 'yearly';
  const slow = g.review.payProvider === 'slow';
  const [busy, run] = window.useGsaBusy(slow ? 3000 : 900);
  const finished = React.useRef(false);
  const store = window.GsaStore;

  // GSA-018.AF-02: opening the payment address to subscribe, while a Subscription exists, goes to Account.
  React.useEffect(() => {
    if (mode === 'subscribe' && !finished.current && GSA_CHECKOUT_ACTIVE.includes(g.view)) store.replace('account', {});
  }, [mode, g.view]);

  const leave = () => {
    finished.current = true;
    if (mode === 'update-card') store.replace('account', {});
    else store.replace('subscribe', { plan, notice: 'not-completed' });
  };
  const refused = g.review.hosted === 'abandons' || (mode === 'subscribe' && g.review.payProvider === 'refuses');
  const pay = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    run(() => {
      finished.current = true;
      if (refused) { leave(); return; }
      if (mode === 'update-card') {
        const form = document.querySelector('.gsa-checkout-form');
        const digits = form ? String(form.elements['gsa-checkout-number'].value).replace(/\D/g, '') : '';
        store.set({ sub: { last4: digits.length >= 4 ? digits.slice(-4) : g.sub.last4 } });
        store.replace('account', {});
        return;
      }
      store.set({ sub: { status: 'subscribed', plan, pending: null, nextDate: gsaCheckoutRenews(plan), endDate: null, endedOn: null, last4: '4242', billingEmail: g.person.email } });
      store.replace('home', {});
    });
  };
  const appName = window.GSA_APP_NAME || 'the app';
  return (
    <div className="gsa-checkout-host">
      <div className="gsa-checkout-host-bar">
        <span className="gsa-checkout-host-name">Payment provider</span>
        <span className="gsa-checkout-host-label">This page belongs to the payment provider, not {appName}.</span>
      </div>
      <div className="gsa-checkout-host-body">
        <div className="gsa-checkout-host-panel">
          {mode === 'subscribe' ? (
            <div className="gsa-checkout-host-summary">
              <p className="gsa-checkout-note">{appName} · {GSA_CHECKOUT_NAMES[plan]} Plan</p>
              <p className="gsa-checkout-host-due"><strong>{gsaCheckoutDue(plan)}</strong> due today</p>
              <p className="gsa-text">Then {gsaCheckoutPlan(plan).price} from {gsaCheckoutLong(gsaCheckoutRenews(plan))}.</p>
            </div>
          ) : (
            <div className="gsa-checkout-host-summary">
              <h1 className="gsa-heading">Update your card</h1>
              <p className="gsa-text">{g.person.email}</p>
            </div>
          )}
          <form className="gsa-checkout-form" noValidate onSubmit={pay}>
            {mode === 'subscribe' ? <window.GsaField label="Email" value={g.person.email} readOnly name="gsa-checkout-email" /> : null}
            <GsaCheckoutCardFields />
            <window.GsaButton type="submit" busy={busy} className="gsa-checkout-block">
              {mode === 'subscribe' ? 'Pay and subscribe' : 'Save card'}
            </window.GsaButton>
          </form>
          <div className="gsa-checkout-host-cancel">
            <window.GsaButton kind="link" onClick={leave}>Cancel and return</window.GsaButton>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GsaPlans, GsaSubscribe, GsaHostedPayment });
