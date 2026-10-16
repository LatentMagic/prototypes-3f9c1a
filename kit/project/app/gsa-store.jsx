// ============================================================================
// GSA store: the one source every screen, stager and Config row reads.
// Route, session, queue, subscription, space, push and the held review flags
// live here, plus the guard (gsaLand) and the verbs that move between screens.
// In memory only; a reload is the default open.
// ============================================================================
const GSA_SCREENS = {
  'home': 'GsaHome', 'sign-in': 'GsaSignIn', 'sign-up': 'GsaSignUp', 'sign-up-code': 'GsaSignUpCode',
  'sign-in-code': 'GsaSignInCode', 'recover': 'GsaRecover', 'provider': 'GsaProvider', 'account': 'GsaAccount', // provider: GSA-008
  'plans': 'GsaPlans', 'subscribe': 'GsaSubscribe', 'hosted-payment': 'GsaHostedPayment', 'invite': 'GsaInvite',
  'invite-link': 'GsaInviteLink', 'invite-invalid': 'GsaInviteInvalid', 'invite-full': 'GsaInviteFull',
  'shared-space': 'GsaSharedSpace', 'connect': 'GsaConnect',
  'ai-app': 'GsaAiApp', 'paid-feature': 'GsaPaidFeature', 'legal': 'GsaLegal',
  'deletion-request': 'GsaDeletionRequest', 'not-found': 'GsaNotFound', 'cant-connect': 'GsaCantConnect',
};
const GSA_DIALOGS = {
  'reverify': 'GsaReverifyDialog', 'email-code': 'GsaEmailCodeDialog', 'delete': 'GsaDeleteDialog',
  'cancel': 'GsaCancelDialog', 'plan': 'GsaPlanDialog',
};
const GSA_AUTH_ONLY = ['sign-in', 'sign-up', 'sign-up-code', 'sign-in-code', 'recover', 'provider'];
const GSA_SIGNED_IN_ONLY = ['home', 'account', 'hosted-payment', 'invite', 'shared-space', 'paid-feature'];
const GSA_PUBLIC = ['plans', 'invite-invalid', 'invite-full', 'connect', 'ai-app', 'legal',
  'deletion-request', 'not-found', 'cant-connect'];
const GSA_BARE = ['sign-in', 'sign-up', 'sign-up-code', 'sign-in-code', 'recover', 'provider', 'hosted-payment', 'ai-app'];
const GSA_BUYING = ['plans', 'subscribe', 'hosted-payment'];
const GSA_ACTIVE_SUB = ['subscribed', 'ending', 'payment-failed'];

function gsaView(s) {
  return s.session === 'visitor' ? 'visitor' : s.sub.status;
}

// ---- the invitation rules (S16) ---------------------------------------------
// Membership is by account (who), never by email: an email change keeps the seat.
function gsaIsMember(s) {
  return Boolean(s.who) && s.space.members.some((m) => m.who === s.who);
}

// The address a member holds now: the live or stashed account's, else the one on the list.
function gsaMemberEmail(s, m) {
  if (m.who && m.who === s.who) return s.person.email;
  if (m.who && s.accounts[m.who]) return s.accounts[m.who].person.email;
  return m.email;
}

function gsaInviteOutcome(s) {
  if (!s.review.inviteValid) return { name: 'invite-invalid' };
  if (gsaIsMember(s)) return { name: 'shared-space', notice: 'already-member' };
  if (s.space.full) return { name: 'invite-full' };
  return { name: 'shared-space', notice: 'joined' };
}

// ---- the guard: the only place a route is refused or redirected -------------
function gsaLand(route, s) {
  const name = route && route.name;
  if (!name || !Object.prototype.hasOwnProperty.call(GSA_SCREENS, name)) return { name: 'not-found' };
  const view = gsaView(s);
  const buying = GSA_BUYING.includes(name);
  if (s.env.platform === 'app' && buying) return { name: 'home' };
  if (!s.tiers.payment && buying) return { name: 'not-found' };
  if (!s.tiers.plans && name === 'plans') return { name: 'not-found' };
  if (view === 'visitor' && name === 'invite-link') return { name: 'sign-in' };
  if (view === 'visitor' && GSA_SIGNED_IN_ONLY.includes(name)) return { name: 'sign-in' };
  if (view !== 'visitor' && GSA_AUTH_ONLY.includes(name)) return { name: 'home' };
  if (view !== 'visitor' && name === 'invite-link') return gsaInviteOutcome(s);
  if (GSA_ACTIVE_SUB.includes(view) && name === 'subscribe') return { name: 'account' };
  if (name === 'hosted-payment' && route.mode === 'update-card' && (view === 'none' || view === 'ended')) {
    return { name: 'account', notice: 'update-card-refused' };
  }
  return route;
}

// ---- store internals --------------------------------------------------------
let gsaState = gsaSeed();
let gsaStack = [];
let gsaNewSeq = 0; // numbers the accounts made by sign-up
let gsaSnap = null;
let gsaEpoch = 0; // bumped by every reseed; GsaRoot keys the screen on it so no local state outlives one
const gsaListeners = new Set();

function gsaIsPlain(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);
}

function gsaMerge(base, patch) {
  const out = { ...base };
  Object.keys(patch).forEach((k) => {
    out[k] = gsaIsPlain(patch[k]) && gsaIsPlain(base[k]) ? { ...base[k], ...patch[k] } : patch[k];
  });
  return out;
}

function gsaCommit(next) {
  gsaState = next;
  gsaSnap = null;
  gsaListeners.forEach((fn) => fn());
}

function gsaJoin(s, route) {
  if (route.name !== 'shared-space' || route.notice !== 'joined') return s;
  if (gsaIsMember(s)) return s;
  const member = { who: s.who, name: s.person.first + ' ' + s.person.last, email: s.person.email };
  return { ...s, space: { ...s.space, role: 'member', members: s.space.members.concat([member]) } };
}

// Land a requested route: the guard to a fixed point, then the side effects the
// refusal carries (pending invitation, Return-to, joining). Returns the next state.
function gsaResolve(s, requested) {
  let r = gsaLand(requested, s);
  for (let i = 0; i < 3 && r.name !== requested.name; i += 1) {
    const again = gsaLand(r, s);
    if (again.name === r.name) break;
    r = again;
  }
  let next = s;
  if (requested.name === 'invite-link' && gsaView(s) === 'visitor') {
    next = { ...next, pending: { ...next.pending, invite: requested.invite || next.invite.id } };
  } else if (GSA_SIGNED_IN_ONLY.includes(requested.name) && gsaView(s) === 'visitor') {
    next = { ...next, returnTo: gsaOmit(requested, ['dialog', 'for']) };
  }
  next = gsaJoin(next, r);
  return { ...next, route: r };
}

// Erase only the signed-in person's account and slice; every other account keeps its data.
function gsaEraseAccount(s) {
  const accounts = gsaOmit(s.accounts, [s.who]);
  const members = s.space.members.filter((m) => m.who !== s.who);
  return { ...s, who: null, accounts, space: { ...s.space, members, role: 'none' } };
}

function gsaWipe() {
  const erased = gsaEraseAccount(gsaState);
  gsaStack = [];
  gsaEpoch += 1;
  gsaCommit({
    ...erased, session: 'visitor', route: { name: 'sign-in' }, returnTo: null, pending: {},
    review: { ...erased.review, deletedElsewhere: false },
  });
}

function gsaEraseIfDeleted() {
  if (!gsaState.review.deletedElsewhere) return false;
  gsaWipe();
  return true;
}

// Copy of obj without the named keys (no object-rest: Babel's shared _excluded global collides across kit files).
function gsaOmit(obj, keys) {
  const out = Object.assign({}, obj);
  keys.forEach((k) => { delete out[k]; });
  return out;
}

function gsaParams(route) {
  return gsaOmit(route, ['name']);
}

const GSA_WRITE_KEYS = ['items', 'person', 'sub', 'space', 'push', 'invite'];
const GsaStore = {
  get() {
    if (!gsaSnap) gsaSnap = { ...gsaState, epoch: gsaEpoch, view: gsaView(gsaState), isApp: gsaState.env.platform === 'app' };
    return gsaSnap;
  },
  set(patch, opts) {
    const before = gsaState;
    const p = typeof patch === 'function' ? patch(GsaStore.get()) : patch;
    if (!p) return;
    if (before.review.deletedElsewhere && GSA_WRITE_KEYS.some((k) => k in p)) { gsaWipe(); return; }
    let next = gsaMerge(before, p);
    const moved = before.session !== next.session || before.env.platform !== next.env.platform
      || before.tiers.payment !== next.tiers.payment || before.tiers.plans !== next.tiers.plans
      || before.sub.status !== next.sub.status;
    if (moved && !(opts && opts.keepRoute)) {
      const landed = gsaResolve(next, next.route);
      if (landed.route.name !== next.route.name) next = landed;
    }
    gsaCommit(next);
  },
  reset() {
    const fresh = gsaSeed();
    fresh.env = { ...gsaState.env };
    gsaStack = [];
    gsaEpoch += 1;
    gsaCommit(fresh);
  },
  subscribe(fn) {
    gsaListeners.add(fn);
    return () => { gsaListeners.delete(fn); };
  },
  go(name, params = {}) {
    if (gsaEraseIfDeleted()) return;
    const cur = gsaState.route;
    const next = gsaResolve(gsaState, { name, ...params });
    gsaStack = gsaStack.concat([cur]);
    gsaCommit(next);
  },
  replace(name, params = {}) {
    if (gsaEraseIfDeleted()) return;
    gsaCommit(gsaResolve(gsaState, { name, ...params }));
  },
  back() {
    if (gsaEraseIfDeleted()) return;
    const prev = gsaStack[gsaStack.length - 1];
    gsaStack = gsaStack.slice(0, -1);
    const s = { ...gsaState, returnTo: gsaState.returnTo };
    const landed = gsaLand(prev || { name: 'home' }, s);
    gsaCommit({ ...gsaJoin(s, landed), route: landed });
  },
  // who: 'sam' | 'alex' | 'new' ('new' takes account = { first, last, email }).
  // Each person's queue, Subscription, role and Notifications switch is their own.
  signIn(who = 'sam', account) {
    const s = gsaState;
    // A sign-up always makes a new account under a fresh key; the key never stands for an address.
    if (who === 'new') gsaNewSeq += 1;
    const key = who === 'new' ? 'new:' + gsaNewSeq : who;
    const patch = { session: 'signed-in' };
    if (key !== s.who) {
      const acct = s.accounts[key] || gsaSeedAccount(key, account);
      if (s.who) patch.accounts = { [s.who]: { person: s.person, items: s.items, sub: s.sub, role: s.space.role, pushOn: s.push.on } };
      patch.who = key;
      patch.person = { ...acct.person };
      patch.items = acct.items;
      patch.sub = { ...acct.sub };
      patch.space = { role: acct.role };
      patch.push = { on: acct.pushOn, registered: false };
    }
    GsaStore.set(patch, { keepRoute: true });
  },
  // Makes a stashed account under a fresh 'new:<n>' key (the sign-up counter) and returns the key;
  // it does not sign in. account = { first, last, email, method, providerId } (GSA-008.AF-02).
  addAccount(account) {
    gsaNewSeq += 1;
    const key = 'new:' + gsaNewSeq;
    GsaStore.set({ accounts: { [key]: gsaSeedAccount(key, account) } }, { keepRoute: true });
    return key;
  },
  // The who whose person.providerId is `providerId`, or null. The live account answers for itself.
  accountByProvider(providerId) {
    const s = gsaState;
    if (!providerId) return null;
    if (s.who && s.person.providerId === providerId) return s.who;
    const keys = Object.keys(s.accounts);
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i] !== s.who && s.accounts[keys[i]].person.providerId === providerId) return keys[i];
    }
    return null;
  },
  // The person on file for 'sam' or 'alex': live when signed in as them, else stashed, else the seed.
  personOf(who) {
    const s = gsaState;
    if (s.who === who) return s.person;
    return (s.accounts[who] && s.accounts[who].person) || GSA_PEOPLE[who] || GSA_PEOPLE.sam;
  },
  // The registry: the who ('sam', 'alex', 'new:<n>') whose CURRENT address is `email`, or null.
  // The live account answers for itself; its stash is stale and skipped. An address given up is free.
  accountByEmail(email) {
    const s = gsaState;
    const want = String(email || '').trim().toLowerCase();
    if (!want) return null;
    if (s.who && s.person.email.toLowerCase() === want) return s.who;
    const keys = Object.keys(s.accounts);
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i] !== s.who && s.accounts[keys[i]].person.email.toLowerCase() === want) return keys[i];
    }
    return null;
  },
  // True for any address on file (except the account exceptWho) and the demo address taken@example.com.
  emailTaken(email, exceptWho) {
    const want = String(email || '').trim().toLowerCase();
    if (want === GSA_TAKEN_EMAIL) return true;
    const who = GsaStore.accountByEmail(want);
    return who !== null && who !== exceptWho;
  },
  // Config "Signed in": the live account, or after a deletion the first account on file
  // (Sam afresh when none is left). Never an erased account.
  signInAvailable() {
    const s = gsaState;
    if (s.who) return GsaStore.set({ session: 'signed-in' });
    const keys = Object.keys(s.accounts);
    const key = keys.length ? keys[0] : 'sam';
    GsaStore.signIn(key);
    const t = gsaState;
    // A revived seed Sam is still the Owner and a member: put his row back.
    if (key === 'sam' && !gsaIsMember(t)) {
      const row = { who: 'sam', name: t.person.first + ' ' + t.person.last, email: t.person.email };
      gsaCommit({ ...t, space: { ...t.space, members: t.space.members.concat([row]) } });
    }
    // Land off sign-in, as the Visitor-to-Signed-in path does.
    gsaCommit(gsaResolve(gsaState, gsaState.route));
  },
  // Erase the signed-in person's own account and data (GSA-014), then sign out. Others are untouched.
  eraseAccount() {
    if (!gsaState.who) return;
    gsaCommit(gsaEraseAccount(gsaState));
    GsaStore.signOut();
  },
  signOut({ keepPending } = {}) {
    const s = gsaState;
    gsaStack = [];
    gsaCommit({ ...s, session: 'visitor', returnTo: null, route: { name: 'sign-in' }, pending: keepPending ? s.pending : {} });
  },
  finishAuth(via) {
    const s = gsaState;
    const { invite, plan } = s.pending;
    const rest = gsaOmit(s.pending, ['invite', 'plan']);
    if (invite) {
      gsaCommit({ ...s, pending: rest });
      const landed = gsaInviteOutcome(gsaState);
      GsaStore.replace(landed.name, gsaParams(landed));
      return;
    }
    if (plan) {
      gsaCommit({ ...s, pending: rest });
      if (via === 'sign-up') return GsaStore.replace('hosted-payment', { mode: 'subscribe', plan });
      return GsaStore.replace(GSA_ACTIVE_SUB.includes(s.sub.status) ? 'account' : 'subscribe', GSA_ACTIVE_SUB.includes(s.sub.status) ? {} : { plan });
    }
    if (s.returnTo) {
      const target = s.returnTo;
      gsaCommit({ ...s, returnTo: null });
      return GsaStore.replace(target.name, gsaParams(target));
    }
    return GsaStore.replace('home');
  },
};

function useGsa() {
  return React.useSyncExternalStore(GsaStore.subscribe, GsaStore.get);
}

function gsaDeletedElsewhere() {
  GsaStore.set({ review: { deletedElsewhere: true } });
}

Object.assign(window, {
  gsaOmit, gsaParams, GsaStore, useGsa, gsaLand, gsaInviteOutcome, gsaIsMember, gsaMemberEmail, gsaDeletedElsewhere,
  GSA_SCREENS, GSA_DIALOGS, GSA_AUTH_ONLY, GSA_SIGNED_IN_ONLY, GSA_PUBLIC, GSA_BARE,
});
