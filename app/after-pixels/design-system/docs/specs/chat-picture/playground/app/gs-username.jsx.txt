
// ============================================================================
// [Platform] — usernames. The store has a username and no real name.
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
  ];
};
// The field. Rules show only as errors after a failed save. A taken name is refused with its error; nothing is offered.
const GsUsernameField = ({ form, aside, autoFocus, label = 'Username', placeholder }) => {
  const b = form.bind('name');
  return aside
    ? <GsLabelled label={label} aside={aside}>
        <DS.TextField aria-label={label} placeholder={placeholder} autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus={autoFocus} {...b} />
      </GsLabelled>
    : <DS.TextField label={label} placeholder={placeholder} autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus={autoFocus} {...b} />;
};

// ---- Your username: a Google or Apple sign-up, after the provider and the device code.
// The account is made only when a name is chosen; leaving first leaves no account. No Skip. Back returns to sign-up, where Google or Apple leads here again.
const GsUsername = () => {
  const gs = useGs();
  const { next, provider, preset } = gs.route; // preset 'taken' is staged
  const form = useGsForm({ name: preset === 'taken' ? 'taken' : '' }, gsUsernameRules(null), (f) => gs.accountMade(f.name.trim(), provider || 'google', next), { tried: preset === 'taken' });
  return (
    <GsAuthFrame title="Your username" onBack={() => gs.go('signup', { next })}>
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <GsUsernameField form={form} autoFocus />
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
    if (n !== current) gs.setUser({ username: n, locked: true });
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
      {u.locked ? <p className="gs-muted">You can change it again on 6 November.</p> : <GsUsernameForm current={u.username} />}
    </DS.Card>
  );
};

Object.assign(window, { GsUsername, GsUsernameCard, GsUsernameField, gsUsernameRules });
