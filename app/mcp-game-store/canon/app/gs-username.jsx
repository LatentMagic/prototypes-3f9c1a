
// ============================================================================
// [Platform] — usernames. The store shows a username; the first and last name asked at sign-up by email are never shown on a share or a card.
//   GsUsernameField the field, on the sign-up form, Your username and the Account card
//   GsUsername      the "Your username" screen, for a Google or Apple sign-up only
//   GsUsernameCard  the Username card on the Account page (same pattern as Change email)
// No name is ever generated, prefilled or suggested. Demo: only "taken", in
// any capitals, is taken; your own current name never is.
// ============================================================================

const GS_TAKEN = 'That username is taken';
const gsUsernameRules = (current) => {
  const t = (v) => v.trim();
  return [
    ['name', (v) => t(v).length >= 3 && t(v).length <= 16, 'Use 3 to 16 characters.'],
    ['name', (v) => /^[A-Za-z0-9_]*$/.test(t(v)), 'Use letters, numbers and underscores only.'],
    ['name', (v) => /^[A-Za-z]/.test(t(v)), 'Start with a letter.'],
    ['name', (v) => t(v) === current || t(v).toLowerCase() !== 'taken', GS_TAKEN],
    // The current name, unchanged, answered as the email card answers its own case.
    ...(current ? [['name', (v) => t(v) !== current, 'That’s already your username. Enter a different one.']] : []),
  ];
};
// The day a username can next change: 30 days after it last changed, or after sign-up, counted from the prototype's today.
const gsUsernameNext = (u) => lbDate(gsAddDays(new Date(u.since || GS_DAY0.getTime()), 30));
// The field. The rule shows as one hint line under it on the sign-up form and Your username (hint); a failed save replaces it with the error. A taken name is refused with its error; nothing is offered.
const GS_USERNAME_HINT = 'Use 3 to 16 letters, numbers or underscores, starting with a letter. You can change it once every 30 days.';
const GsUsernameField = ({ form, aside, autoFocus, label = 'Username', placeholder, hint }) => {
  const b = form.bind('name');
  return aside
    ? <GsLabelled label={label} aside={aside}>
        <DS.TextField aria-label={label} placeholder={placeholder} hint={hint} autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus={autoFocus} {...b} />
      </GsLabelled>
    : <DS.TextField label={label} placeholder={placeholder} hint={hint} autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus={autoFocus} {...b} />;
};

// ---- Your username: a Google or Apple sign-up, straight after the provider (no code: a new account has no device to verify, 2026-10-11).
// The account is made only when a name is chosen; leaving first leaves no account. No Skip. Back returns to sign-up, where Google or Apple leads here again.
const GsUsername = () => {
  const gs = useGs();
  const { next, provider, preset } = gs.route; // preset 'taken' is staged
  const form = useGsForm({ name: preset === 'taken' ? 'taken' : '' }, gsUsernameRules(null), (f) => gs.accountMade(f.name.trim(), provider || 'google', next), { tried: preset === 'taken' });
  return (
    <GsAuthFrame title="Your username" onBack={() => gs.go('signup', { next })}>
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <GsUsernameField form={form} autoFocus hint={GS_USERNAME_HINT} />
        <DS.Button type="submit" block loading={form.busy}>Continue</DS.Button>
      </form>
    </GsAuthFrame>
  );
};

// ---- Account card. Mirrors Change email: a field and one update button. Any change
// saved here starts a 30-day wait, shown as a muted line in place of the field.
const GsUsernameForm = ({ current }) => {
  const gs = useGs();
  const form = useGsForm({ name: '' }, gsUsernameRules(current), (f) => {
    const n = f.name.trim();
    if (n !== current) gs.setUser({ username: n, locked: true, since: GS_DAY0.getTime() });
  });
  return (
    <form noValidate onSubmit={form.submit} className="gs-stack-md">
      <GsUsernameField form={form} label="New username" placeholder="Enter a new username" />
      <div className="gs-card-acts"><DS.Button type="submit" loading={form.busy}>Update username</DS.Button></div>
    </form>
  );
};
const GsUsernameCard = () => {
  const gs = useGs();
  const u = gs.user;
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <h2 className="mcp-t-card">Username</h2>
      <p><b>{u.username}</b> is your username.{u.locked ? '' : ' You can change it once every 30 days.'}</p>
      {u.locked ? <p className="gs-muted">{'You can change it again on ' + gsUsernameNext(u) + '.'}</p> : <GsUsernameForm current={u.username} />}
    </DS.Card>
  );
};

Object.assign(window, { GsUsername, GsUsernameCard, GsUsernameField, gsUsernameRules, GS_USERNAME_HINT });
