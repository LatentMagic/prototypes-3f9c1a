// ============================================================================
// GSA register entries, family three: Invitations, AI app, Notifications.
// ============================================================================

// Sign in as a person who is not in the shared space yet, so the link joins.
function gsaStageNonMember(c) {
  c.as('google');
}

const GSA_STATES_INVITES = [
  { group: 'Invitations', id: 'invite-not-owner', label: 'Invite page, not the Owner', platform: 'web',
    stage: (c) => { c.set({ space: { role: 'member' } }); c.go('invite'); } },
  { group: 'Invitations', id: 'invite-space-full', label: 'Invite page, the shared space is full', platform: 'web',
    stage: (c) => { c.set({ space: { full: true } }); c.go('invite'); } },
  { group: 'Invitations', id: 'invite-copy-refused', label: 'Invite page, the device refuses to copy (make a link, press Copy)', platform: 'web',
    stage: (c) => { c.set({ review: { clipboard: 'refused' } }); c.go('invite'); } },
  { group: 'Invitations', id: 'accept-signed-in', label: 'Invite link, signed in: joins', platform: 'web',
    stage: (c) => { gsaStageNonMember(c); c.go('invite-link'); } },
  { group: 'Invitations', id: 'accept-signed-out', label: 'Invite link, signed out: sign in first', platform: 'web',
    stage: (c) => {
      // Sam is the Owner but not yet on the member list, so signing in joins.
      c.set({ space: { members: [{ name: 'Jo Rivera', email: 'member@example.com' }, { name: 'Kim Lee', email: 'kim@example.com' }] } });
      c.store.signOut();
      c.go('invite-link');
    } },
  { group: 'Invitations', id: 'accept-already-member', label: 'Invite link, already a member', platform: 'web',
    stage: (c) => { c.go('invite-link'); } },
  { group: 'Invitations', id: 'accept-gmail-alias', label: 'Invite link to a googlemail address, signed in on the gmail one: joins', platform: 'web',
    stage: (c) => {
      gsaStageNonMember(c);
      c.set({ person: { email: 'alex.chen@gmail.com' }, invite: { email: 'alex.chen@googlemail.com' }, review: { inviteMatch: 'alias' } });
      c.go('invite-link');
    } },
  { group: 'Invitations', id: 'invite-invalid', label: 'Invite link invalid, expired or revoked', platform: 'web',
    stage: (c) => { c.set({ review: { inviteValid: false } }); c.go('invite-link'); } },
  { group: 'Invitations', id: 'invite-full', label: 'Invite link, the shared space is full', platform: 'web',
    stage: (c) => { c.set({ space: { full: true } }); c.go('invite-link'); } },
  { group: 'Invitations', id: 'invite-other-account', label: 'Invite link for another account', platform: 'web',
    stage: (c) => { gsaStageNonMember(c); c.set({ review: { inviteMatch: 'other' } }); c.go('invite-link'); } },
];

const GSA_STATES_AI = [
  ['ai-sign-in-needed', 'AI app: asks you to sign in', 'sign-in-needed'],
  ['ai-no-account', 'AI app: you need an account', 'no-account'],
  ['ai-refused-call', 'AI app: a refused call, with its reason', 'refused-call'],
  ['ai-no-sale', 'AI app: needs a Subscription (links to Plans)', 'no-sale'],
].map((d) => ({ group: 'AI app', id: d[0], label: d[1], platform: 'web', stage: (c) => { c.go('ai-app', { reply: d[2] }); } }));

// Push states: the patch each one writes, then the screen it opens on.
// [id, label, push patch, route]
const GSA_PUSH_DEFS = [
  ['notify-ask', 'Notifications: the ask on Home', {}, 'home'],
  ['notify-os-prompt', 'Notifications: the device’s permission prompt open', { asked: true, prompt: true }, 'account'],
  ['notify-on', 'Notifications: on, one control per event', { perm: 'granted', on: true, registered: true, asked: true }, 'account'],
  ['notify-off', 'Notifications: off on this device', { perm: 'granted', on: false, asked: true }, 'account'],
  ['notify-refused', 'Notifications: permission refused on the device', { perm: 'denied', on: false, asked: true }, 'account'],
  ['notify-ios-tab', 'Notifications: iPhone browser tab (add to home screen)', { channel: 'ios-tab' }, 'account'],
  ['notify-turn-on-fails', 'Notifications: turning on failed', { perm: 'granted', on: false, asked: true }, 'account'],
  ['notify-snoozed', 'Notifications: ask snoozed (Config: Move on brings it back)', { snoozes: 1 }, 'home'],
];

const GSA_STATES_PUSH = GSA_PUSH_DEFS.map((d) => ({
  group: 'Notifications', id: d[0], label: d[1], platform: 'web',
  stage: (c) => {
    const patch = Object.assign({}, d[2]);
    if (d[0] === 'notify-snoozed') patch.snoozeAt = Date.now();
    c.set({ push: patch });
    c.go(d[3]);
    // The failed line lives while the card is mounted, so it is set after the page opens.
    if (d[0] === 'notify-turn-on-fails') c.set({ push: { failed: true } });
  },
})).concat([
  { group: 'Notifications', id: 'notify-push', label: 'Notifications: one arrives, naming its subject only', platform: 'web',
    stage: (c) => {
      c.set({ push: { perm: 'granted', on: true, registered: true, asked: true } });
      c.go('home');
      setTimeout(() => {
        const s = c.store.get();
        if (s.push.on && s.route.name === 'home' && window.gsaPushSend) window.gsaPushSend();
      }, 400);
    } },
  { group: 'Notifications', id: 'notify-different-person', label: 'Notifications: another person signs in on this device (switch off, no ask)', platform: 'web',
    stage: (c) => {
      c.set({ push: { perm: 'granted', on: true, registered: true, asked: true } });
      // The next person on the device: registration is the last person's, the switch is theirs.
      c.as('google');
      c.set({ push: { on: false } });
      c.go('account');
    } },
]);

const GSA_STATES_PEOPLE = GSA_STATES_INVITES.concat(GSA_STATES_AI, GSA_STATES_PUSH);

Object.assign(window, { GSA_STATES_PEOPLE });
