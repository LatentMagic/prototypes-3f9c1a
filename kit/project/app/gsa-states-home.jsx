// ============================================================================
// GSA register entries, family one: Home, Sign in, Sign up, Site, Slots.
// Each entry: { group, id, label, platform, stage(c) }. buildStates reseeds
// before every stage, so a stager only writes what differs from the seed.
// ============================================================================

// Home mounts once on page load, before a stager runs, and reads queue.load
// only on mount. So a held or failing load is staged by leaving Home and
// coming back: a marker route now, Home a moment later (only if the flag is
// still set, so a later reseed cancels it).
function gsaStageHomeFresh(c, load) {
  c.set({ queue: { load } });
  c.store.replace('not-found');
  setTimeout(() => {
    if (c.store.get().queue.load === load) c.store.replace('home');
  }, 40);
}

// A signed-out visitor sitting on the Sign-in view.
function gsaStageVisitor(c) {
  c.store.signOut();
}

const GSA_STATES_HOME = [
  { group: 'Home', id: 'queue', label: 'Home: the queue with Active and Done items', platform: 'web',
    stage: (c) => { c.store.replace('home'); } },
  { group: 'Home', id: 'queue-empty', label: 'Home: the queue with nothing in it', platform: 'web',
    stage: (c) => { c.set({ items: [] }); c.store.replace('home'); } },
  { group: 'Home', id: 'queue-loading', label: 'Home: the queue’s first load, held', platform: 'web',
    stage: (c) => gsaStageHomeFresh(c, 'hold') },
  { group: 'Home', id: 'queue-load-fails', label: 'Home: the queue fails to load (Try again fails until Config Loading is Normal)', platform: 'web',
    stage: (c) => gsaStageHomeFresh(c, 'fail') },
  { group: 'Home', id: 'queue-save-fails', label: 'Home: adding or marking done fails', platform: 'web',
    stage: (c) => { c.set({ queue: { save: 'fail' } }); c.store.replace('home'); } },
  { group: 'Home', id: 'cant-connect', label: 'Home: cannot reach the server (ui-design standard, not a story)', platform: 'web',
    stage: (c) => { c.go('cant-connect'); } },

  { group: 'Sign in', id: 'sign-in', label: 'Sign-in view', platform: 'web',
    stage: (c) => { gsaStageVisitor(c); } },
  { group: 'Sign in', id: 'sign-in-return', label: 'Sign-in view after opening the Account page signed out (returns there)', platform: 'web',
    stage: (c) => { gsaStageVisitor(c); c.go('account'); } },
  { group: 'Sign in', id: 'sign-in-code-device', label: 'Sign-in code page: a new device', platform: 'web',
    stage: (c) => { gsaStageVisitor(c); c.store.replace('sign-in-code', { kind: 'device', method: 'password', via: 'sign-in' }); } },
  { group: 'Sign in', id: 'sign-in-code-authenticator', label: 'Sign-in code page: an authenticator-app code', platform: 'web',
    stage: (c) => {
      gsaStageVisitor(c);
      c.set({ person: { enrolled: true } });
      c.store.replace('sign-in-code', { kind: 'authenticator', method: 'password', via: 'sign-in' });
    } },

  { group: 'Sign in', id: 'provider-fails', label: 'Sign-in view: Google or Apple sign-in failed', platform: 'web',
    stage: (c) => { gsaStageVisitor(c); c.set({ review: { provider: 'fails' } }); c.store.replace('sign-in', { failed: 'google' }); } },
  { group: 'Sign in', id: 'provider-first-visit', label: 'Google, first visit: account made, then the device code', platform: 'web',
    stage: (c) => {
      gsaStageVisitor(c);
      c.set({ review: { providerAccount: 'first-visit' } });
      const g = window.GSA_PROVIDER_PEOPLE.google.firstVisit;
      const key = c.store.addAccount({ first: g.first, last: g.last, email: g.email, method: 'google', providerId: g.id });
      window.gsaAuthProceed(key, 'sign-up', true);
    } },
  { group: 'Sign in', id: 'apple-hide-email', label: 'Apple, first visit, Hide My Email: the code goes to the relay address', platform: 'web',
    stage: (c) => {
      gsaStageVisitor(c);
      c.set({ review: { providerAccount: 'first-visit' } });
      const a = window.GSA_PROVIDER_PEOPLE.apple.firstVisit;
      const key = c.store.addAccount({ first: a.first, last: a.last, email: a.relay, method: 'apple', providerId: a.id });
      window.gsaAuthProceed(key, 'sign-up', true);
    } },
  { group: 'Sign in', id: 'store-app-google', label: 'App: Google sign-in opens the system browser', platform: 'app',
    stage: (c) => { gsaStageVisitor(c); c.store.replace('provider', { provider: 'google', from: 'sign-in' }); } },

  { group: 'Sign up', id: 'sign-up-free-app', label: 'Sign-up page in an app that takes no payment (no Refund Policy)', platform: 'web',
    stage: (c) => { gsaStageVisitor(c); c.set({ tiers: { payment: false } }); c.store.replace('sign-up'); } },

  { group: 'Site', id: 'not-found', label: 'Not-found page', platform: 'web',
    stage: (c) => { c.go('not-found'); } },
  { group: 'Site', id: 'not-found-other-account', label: 'Not-found page for another account’s page', platform: 'web',
    stage: (c) => { c.go('another-accounts-page'); } },
  { group: 'Site', id: 'not-found-visitor', label: 'Not-found page, signed out at a public address (placeholder: each app decides)', platform: 'web',
    stage: (c) => { gsaStageVisitor(c); c.go('not-found'); } },

  { group: 'Slots', id: 'shared-space', label: 'Shared space (Slot), as the Owner', platform: 'web',
    stage: (c) => { c.go('shared-space'); } },
  { group: 'Slots', id: 'paid-feature-no-subscription', label: 'Paid feature (Slot), without a Subscription', platform: 'web',
    stage: (c) => { c.go('paid-feature'); } },
];

Object.assign(window, { GSA_STATES_HOME });
