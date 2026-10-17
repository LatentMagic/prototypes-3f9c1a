// ============================================================================
// GSA register entries, family two: Account, Subscription, Plans and paying.
// The Subscription entries come from one def table and one stager.
// ============================================================================

// The Subscription as each state needs it. Dates are set here because the card
// reads them (next payment, end date, ended on).
function gsaStageSub(status, pending) {
  const nextDate = gsaDate(20);
  if (status === 'subscribed') return { status, plan: 'monthly', pending: pending || null, nextDate, endDate: null, endedOn: null };
  if (status === 'ending') return { status, plan: 'monthly', pending: null, nextDate, endDate: nextDate, endedOn: null };
  if (status === 'payment-failed') return { status, plan: 'monthly', pending: pending || null, nextDate, endDate: null, endedOn: null };
  if (status === 'ended') return { status, plan: 'monthly', pending: null, nextDate: null, endDate: null, endedOn: gsaDate(-3) };
  return { status: 'none', pending: null, nextDate: null, endDate: null, endedOn: null };
}

// [id, label, { sub, pending?, review?, platform? }]
const GSA_SUB_DEFS = [
  ['sub-none', 'Subscription card: no Subscription', { sub: 'none' }],
  ['sub-subscribed', 'Subscription card: Subscribed', { sub: 'subscribed' }],
  ['sub-pending-switch', 'Subscription card: Subscribed, with a Pending switch', { sub: 'subscribed', pending: 'yearly' }],
  ['sub-ending', 'Subscription card: Ending (can resume)', { sub: 'ending' }],
  ['sub-payment-failed', 'Subscription card: Payment failed', { sub: 'payment-failed' }],
  ['sub-payment-failed-pending', 'Subscription card: Payment failed, with a Pending switch', { sub: 'payment-failed', pending: 'yearly' }],
  ['sub-ended', 'Subscription card: Ended', { sub: 'ended' }],
  ['sub-provider-refuses', 'Subscription card: the payment provider refuses a change', { sub: 'subscribed', review: { payProvider: 'refuses' } }],
  ['sub-awaiting-provider', 'Subscription card: waiting for the payment provider (held)', { sub: 'subscribed', review: { payProvider: 'slow' } }],
  ['store-app-nothing-to-buy', 'App: Subscription card, nothing to buy', { sub: 'none', platform: 'app' }],
  ['store-app-one-link', 'App: Subscription card, the one allowed link', { sub: 'none', review: { storeLink: true }, platform: 'app' }],
];

function gsaStageSubDef(def) {
  return (c) => {
    c.set({ sub: gsaStageSub(def.sub, def.pending) });
    if (def.review) c.set({ review: def.review });
    c.go('account');
  };
}

const GSA_STATES_SUB = GSA_SUB_DEFS.map((d) => ({
  group: 'Subscription', id: d[0], label: d[1], platform: d[2].platform || 'web', stage: gsaStageSubDef(d[2]),
}));

// Delete dialog by Subscription state.
function gsaStageDelete(status, review, params) {
  return (c) => {
    c.set({ sub: gsaStageSub(status) });
    if (review) c.set({ review });
    c.go('account', Object.assign({ dialog: 'delete' }, params || {}));
  };
}

const GSA_STATES_ACCOUNT_ONLY = [
  { group: 'Account', id: 'account', label: 'Account page, password account', platform: 'web',
    stage: (c) => { c.go('account'); } },
  { group: 'Account', id: 'account-google', label: 'Account page, Google account (managed by Google)', platform: 'web',
    stage: (c) => { c.as('casey'); c.go('account'); } },
  { group: 'Account', id: 'account-apple', label: 'Account page, Apple account with a hidden email (relay address)', platform: 'web',
    stage: (c) => { c.as('robin'); c.go('account'); } },
  { group: 'Account', id: 'reverify-code', label: 'Prove it’s you: emailed code (Google account, before export)', platform: 'web',
    stage: (c) => { c.as('casey'); c.go('account', { dialog: 'reverify', for: 'export' }); } },
  { group: 'Account', id: 'account-direct', label: 'Account page opened directly (Back goes Home)', platform: 'web',
    stage: (c) => { c.store.replace('account'); } },
  { group: 'Account', id: 'account-no-notifications', label: 'Account page on a device that cannot get Notifications', platform: 'web',
    stage: (c) => { c.set({ push: { channel: 'none' } }); c.go('account'); } },
  { group: 'Account', id: 'email-change-code', label: 'Change email: code sent to the new address', platform: 'web',
    stage: (c) => { c.go('account', { dialog: 'email-code', email: 'new@example.com' }); } },
  { group: 'Account', id: 'email-change-ends-session', label: 'Change email ends the session: confirm the code to reach the Sign-in view', platform: 'web',
    stage: (c) => { c.set({ review: { emailEndsSession: true } }); c.go('account', { dialog: 'email-code', email: 'new@example.com' }); } },
  { group: 'Account', id: 'export-limit', label: 'Export: the limit is reached (press Export data)', platform: 'web',
    stage: (c) => { c.set({ review: { exportLimit: true } }); c.go('account'); } },
  { group: 'Account', id: 'delete-subscribed', label: 'Delete account dialog, Subscribed', platform: 'web',
    stage: gsaStageDelete('subscribed') },
  { group: 'Account', id: 'delete-payment-failed', label: 'Delete account dialog, payment failed', platform: 'web',
    stage: gsaStageDelete('payment-failed') },
  { group: 'Account', id: 'delete-ending', label: 'Delete account dialog, Subscription ending (placeholder: each app decides)', platform: 'web',
    stage: gsaStageDelete('ending') },
  { group: 'Account', id: 'delete-fails', label: 'Delete account: the payment provider cannot cancel the Subscription', platform: 'web',
    stage: gsaStageDelete('subscribed', { payProvider: 'refuses' }, { failed: true }) },
];

const GSA_STATES_PLANS = [
  { group: 'Plans and paying', id: 'plans-visitor', label: 'Plans page, signed out', platform: 'web',
    stage: (c) => { c.store.signOut(); c.go('plans'); } },
  { group: 'Plans and paying', id: 'plans-subscriber', label: 'Plans page, with a Subscription', platform: 'web',
    stage: (c) => { c.set({ sub: gsaStageSub('subscribed') }); c.go('plans'); } },
  { group: 'Plans and paying', id: 'subscribe-visitor', label: 'Subscribe page, signed out', platform: 'web',
    stage: (c) => { c.store.signOut(); c.go('subscribe'); } },
  { group: 'Plans and paying', id: 'subscribe-visitor-subscribed', label: 'Subscribe page, signed out, the account already subscribes (sign in goes to Account)', platform: 'web',
    stage: (c) => { c.set({ sub: gsaStageSub('subscribed') }); c.store.signOut(); c.go('subscribe'); } },
  { group: 'Plans and paying', id: 'subscribe-not-completed', label: 'Subscribe page after the payment was not completed', platform: 'web',
    stage: (c) => { c.go('subscribe', { plan: 'yearly', notice: 'not-completed' }); } },
  { group: 'Plans and paying', id: 'subscribe-payment-fails', label: 'Subscribe page after the payment failed (press Pay through the store)', platform: 'web',
    stage: (c) => { c.set({ review: { hosted: 'fails' } }); c.go('hosted-payment', { mode: 'subscribe', plan: 'yearly' }); } },
  { group: 'Plans and paying', id: 'update-card-refused', label: 'Update-card address opened with no Subscription', platform: 'web',
    stage: (c) => { c.go('hosted-payment', { mode: 'update-card' }); } },
];

const GSA_STATES_ACCOUNT = GSA_STATES_ACCOUNT_ONLY.concat(GSA_STATES_SUB, GSA_STATES_PLANS);

Object.assign(window, { GSA_STATES_ACCOUNT });
