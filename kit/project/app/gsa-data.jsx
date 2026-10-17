// ============================================================================
// GSA seed: the fiction every screen opens on. Fixed "today", two people,
// the queue, the shared space, the placeholder plans. Nothing here is a spec rule.
// gsaSeed() hands out a fresh copy each call, so a reseed never shares objects.
// ============================================================================
const GSA_DAY0 = new Date(2026, 9, 16, 9, 0, 0);

const GSA_PEOPLE = {
  sam: { first: 'Sam', last: 'Taylor', email: 'sam@example.com', method: 'password', providerId: null, enrolled: false },
  alex: { first: 'Alex', last: 'Chen', email: 'alex@example.com', method: 'password', providerId: null, enrolled: false },
  // Provider-managed accounts (GSA-008): no password; Robin's email is a Relay address (AF-04).
  casey: { first: 'Casey', last: 'Morgan', email: 'casey.morgan@gmail.com', method: 'google', providerId: 'google:casey', enrolled: false },
  robin: { first: 'Robin', last: 'Park', email: 'k3v9q2@privaterelay.appleid.com', method: 'apple', providerId: 'apple:robin', enrolled: false },
};

// What the pictured provider page offers (GSA-008): a person with an account, and a first visit.
const GSA_PROVIDER_PEOPLE = {
  google: {
    existing: { id: 'google:casey', first: 'Casey', last: 'Morgan', email: 'casey.morgan@gmail.com' },
    firstVisit: { id: 'google:drew', first: 'Drew', last: 'Patel', email: 'drew.patel@gmail.com' },
  },
  apple: {
    existing: { id: 'apple:robin', first: 'Robin', last: 'Park', email: 'robin.park@icloud.com', relay: 'k3v9q2@privaterelay.appleid.com' },
    firstVisit: { id: 'apple:lee', first: 'Lee', last: 'Quinn', email: 'lee.quinn@icloud.com', relay: 'lq7m2x@privaterelay.appleid.com' },
  },
};

const GSA_PLANS = {
  monthly: { id: 'monthly', price: '£3 a month' },
  yearly: { id: 'yearly', price: '£30 a year' },
};

const GSA_SPACE_NAME = 'Slot: shared space';
const GSA_SUPPORT = 'support@gsa.example';
const GSA_MCP_ADDRESS = 'https://gsa.example/mcp';
const GSA_TAKEN_EMAIL = 'taken@example.com';
const GSA_APP_NAME = 'GSA';
const GSA_EVENTS = ['event-one', 'event-two'];
const GSA_AI_APPS = [
  { id: 'ai-app-a', name: 'AI app A', how: 'link' },
  { id: 'ai-app-b', name: 'AI app B', how: 'steps' },
];

function gsaDaysBefore(n) {
  return new Date(GSA_DAY0.getTime() - n * 86400000);
}

function gsaSeedItems() {
  const active = [1, 2, 3, 4, 5].map((n) => ({
    id: 'item-' + n, title: 'Saved link ' + n, url: 'https://example.com/saved-' + n,
    status: 'active', createdAt: gsaDaysBefore(n),
  }));
  const done = [6, 7, 8].map((n) => ({
    id: 'item-' + n, title: 'Finished link ' + (n - 5), url: 'https://example.com/finished-' + (n - 5),
    status: 'done', createdAt: gsaDaysBefore(n + 3),
  }));
  return active.concat(done);
}

// One account's own data: person, queue, Subscription, Owner/member role, Notifications switch.
// key: 'sam', 'alex', 'casey', 'robin', or 'new:<n>' (an account made by sign-up or a first provider visit;
// account = { first, last, email, method?, providerId? }).
function gsaSeedAccount(key, account) {
  if (key === 'sam') {
    return {
      person: { ...GSA_PEOPLE.sam }, items: gsaSeedItems(), role: 'owner', pushOn: false,
      sub: {
        status: 'none', plan: 'monthly', pending: null, nextDate: null, endDate: null, endedOn: null,
        last4: '4242', billingEmail: GSA_PEOPLE.sam.email,
      },
    };
  }
  const person = GSA_PEOPLE[key]
    ? { ...GSA_PEOPLE[key] }
    : {
      first: (account && account.first) || '', last: (account && account.last) || '',
      email: (account && account.email) || String(key).replace(/^new:/, ''),
      method: (account && account.method) || 'password', providerId: (account && account.providerId) || null,
      enrolled: false,
    };
  return {
    person, items: [], role: 'none', pushOn: false,
    sub: {
      status: 'none', plan: 'monthly', pending: null, nextDate: null, endDate: null, endedOn: null,
      last4: '4242', billingEmail: person.email,
    },
  };
}

function gsaSeed() {
  const sam = gsaSeedAccount('sam');
  return {
    who: 'sam',
    accounts: { alex: gsaSeedAccount('alex'), casey: gsaSeedAccount('casey'), robin: gsaSeedAccount('robin') },
    env: { platform: 'web', isMobile: false },
    route: { name: 'home' },
    returnTo: null,
    pending: {},
    session: 'signed-in',
    person: sam.person,
    items: sam.items,
    queue: { load: 'ok', save: 'ok' },
    tiers: { payment: true, plans: true },
    sub: sam.sub,
    space: {
      role: sam.role, full: false,
      members: [
        { who: 'sam', name: 'Sam Taylor', email: 'sam@example.com' },
        { who: 'member', name: 'Jo Rivera', email: 'member@example.com' },
        { who: 'kim', name: 'Kim Lee', email: 'kim@example.com' },
      ],
    },
    invite: { id: 'a1b2c3', email: '' },
    push: {
      channel: 'ok', perm: 'default', on: sam.pushOn, registered: false, asked: false, snoozes: 0, snoozeAt: null,
      events: { 'event-one': true, 'event-two': true }, prompt: false, turning: false, failed: false,
    },
    review: {
      device: 'known',
      emailReverify: 'asks', emailEndsSession: false, storeLink: false,
      payProvider: 'works', hosted: 'pays', clipboard: 'ok',
      inviteValid: true, provider: 'works', providerAccount: 'existing',
      promptAnswer: 'prompt', pushFail: false, exportLimit: false, deletedElsewhere: false,
    },
  };
}

Object.assign(window, {
  GSA_DAY0, GSA_PEOPLE, GSA_PROVIDER_PEOPLE, GSA_PLANS, GSA_SPACE_NAME, GSA_SUPPORT, GSA_MCP_ADDRESS, GSA_APP_NAME,
  GSA_EVENTS, GSA_AI_APPS, GSA_TAKEN_EMAIL, gsaSeed, gsaSeedAccount,
});
