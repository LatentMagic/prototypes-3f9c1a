// ============================================================================
// GSA store: the one source every screen, stager and Config row reads.
// Route, session, queue, subscription, space, push and the held review flags
// live here, plus the guard (gsaLand) and the verbs that move between screens.
// In memory only; a reload is the default open.
// ============================================================================
const GSA_SCREENS = {
  'home': 'GsaHome', 'sign-in': 'GsaSignIn', 'sign-up': 'GsaSignUp', 'sign-up-code': 'GsaSignUpCode',
  'sign-in-code': 'GsaSignInCode', 'recover': 'GsaRecover', 'provider': 'GsaProvider', 'account': 'GsaAccount',
  'plans': 'GsaPlans', 'subscribe': 'GsaSubscribe', 'hosted-payment': 'GsaHostedPayment', 'invite': 'GsaInvite',
  'invite-link': 'GsaInviteLink', 'invite-invalid': 'GsaInviteInvalid', 'invite-full': 'GsaInviteFull',
  'invite-other-account': 'GsaInviteOtherAccount', 'shared-space': 'GsaSharedSpace', 'connect': 'GsaConnect',
  'ai-app': 'GsaAiApp', 'paid-feature': 'GsaPaidFeature', 'legal': 'GsaLegal',
  'deletion-request': 'GsaDeletionRequest', 'not-found': 'GsaNotFound', 'cant-connect': 'GsaCantConnect',
};
const GSA_DIALOGS = {
  'reverify': 'GsaReverifyDialog', 'email-code': 'GsaEmailCodeDialog', 'delete': 'GsaDeleteDialog',
  'cancel': 'GsaCancelDialog', 'plan': 'GsaPlanDialog',
};
const GSA_AUTH_ONLY = ['sign-in', 'sign-up', 'sign-up-code', 'sign-in-code', 'recover'];
const GSA_SIGNED_IN_ONLY = ['home', 'account', 'hosted-payment', 'invite', 'shared-space', 'paid-feature'];
const GSA_PUBLIC = ['plans', 'invite-invalid', 'invite-full', 'invite-other-account', 'connect', 'ai-app', 'legal',
  'deletion-request', 'not-found', 'cant-connect', 'provider'];
const GSA_BARE = ['sign-in', 'sign-up', 'sign-up-code', 'sign-in-code', 'recover', 'provider', 'hosted-payment', 'ai-app'];
const GSA_BUYING = ['plans', 'subscribe', 'hosted-payment'];
const GSA_ACTIVE_SUB = ['subscribed', 'ending', 'payment-failed'];

function gsaView(s) {
  return s.session === 'visitor' ? 'visitor' : s.sub.status;
}

// ---- the invitation rules (S16) ---------------------------------------------
function gsaInviteOutcome(s) {
  if (!s.review.inviteValid) return { name: 'invite-invalid' };
  if (s.space.full) return { name: 'invite-full' };
  if (s.space.members.some((m) => m.email === s.person.email)) return { name: 'shared-space', notice: 'already-member' };
  if (s.review.inviteMatch === 'other') return { name: 'invite-other-account' };
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
let gsaSnap = null;
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
  if (s.space.members.some((m) => m.email === s.person.email)) return s;
  const member = { name: s.person.first + ' ' + s.person.last, email: s.person.email };
  return { ...s, space: { ...s.space, members: s.space.members.concat([member]) } };
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
    next = { ...next, returnTo: requested };
  }
  next = gsaJoin(next, r);
  return { ...next, route: r };
}

function gsaWipe() {
  const fresh = gsaSeed();
  fresh.env = { ...gsaState.env };
  fresh.session = 'visitor';
  fresh.route = { name: 'sign-in' };
  gsaStack = [];
  gsaCommit(fresh);
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
    if (!gsaSnap) gsaSnap = { ...gsaState, view: gsaView(gsaState), isApp: gsaState.env.platform === 'app' };
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
  signIn(method) {
    const person = GSA_PEOPLE[method] || GSA_PEOPLE.password;
    const prev = gsaState.person;
    const patch = { session: 'signed-in', person: { ...person } };
    // A different person on this device: the registration was the last person's.
    if (prev && prev.email !== person.email) patch.push = { registered: false };
    GsaStore.set(patch, { keepRoute: true });
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
  gsaOmit, gsaParams, GsaStore, useGsa, gsaLand, gsaInviteOutcome, gsaDeletedElsewhere,
  GSA_SCREENS, GSA_DIALOGS, GSA_AUTH_ONLY, GSA_SIGNED_IN_ONLY, GSA_PUBLIC, GSA_BARE,
});
