
// ============================================================================
// [Platform] — usernames. The store has a username and no real name.
//   GsUsername      the "Your username" screen, once per new account
//   GsUsernameCard  the Username card on the Account page (same pattern as Change email)
// Rules, errors and the taken state are shared by both. Demo: only "taken", in
// any capitals, is taken; your own current name never is.
// ============================================================================
const GS_NAME_A = ['Quiet', 'Brave', 'Amber', 'Swift', 'Gentle', 'Silver', 'Misty', 'Bright', 'Hollow', 'Cedar', 'Clever', 'Golden'];
const GS_NAME_B = ['Lantern', 'Falcon', 'Meadow', 'Compass', 'Pebble', 'Otter', 'Anchor', 'Thistle', 'Ember', 'Harbour', 'Willow', 'Comet'];
const gsPick = (l) => l[Math.floor(Math.random() * l.length)];
// Two plain words joined with capitals. Never made from a real name or an email.
const gsGenName = (not) => {
  let n; do { n = gsPick(GS_NAME_A) + gsPick(GS_NAME_B); } while (n === not);
  return n;
};

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
// Three free near-matches for a taken name: "Taken" gives Taken7, TakenX, TheTaken.
const gsNear = (v) => {
  const b = v.trim().replace(/[^A-Za-z0-9]/g, '').slice(0, 11);
  const base = b.charAt(0).toUpperCase() + b.slice(1);
  return [base + '7', base + 'X', 'The' + base];
};

// The field. Rules show only as errors after a failed save, and near-match buttons when taken.
const GsUsernameField = ({ form, aside, autoFocus, label = 'Username', placeholder, noRules }) => {
  const b = form.bind('name');
  const taken = b.error === GS_TAKEN;
  const field = aside
    ? <GsLabelled label={label} aside={aside}>
        <DS.TextField aria-label={label} placeholder={placeholder} autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus={autoFocus} {...b} />
      </GsLabelled>
    : <DS.TextField label={label} placeholder={placeholder} autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus={autoFocus} {...b} />;
  return (
    <div className="gs-stack-sm">
      {field}
      {taken && (
        <div className="gs-sugg" role="group" aria-label="Free usernames">
          {gsNear(form.f.name).map((n) => (
            <DS.Button key={n} variant="secondary" onClick={() => { form.set('name', n); form.focus('name'); }}>{n}</DS.Button>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Your username: once per new account, never on sign-in. No Skip, no back arrow.
const GsUsername = () => {
  const gs = useGs();
  const { next, preset } = gs.route; // preset 'taken' is staged
  const [first] = React.useState(() => (preset === 'taken' ? 'taken' : gsGenName()));
  const form = useGsForm({ name: first }, gsUsernameRules(null), (f) => gs.nameChosen(f.name.trim(), next), { tried: preset === 'taken' });
  const another = () => { form.set('name', gsGenName(form.f.name.trim())); form.focus('name'); };
  return (
    <GsAuthFrame title="Your username">
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <GsUsernameField form={form} autoFocus aside={<DS.TextLink onClick={another}>Suggest another</DS.TextLink>} />
        <DS.Button type="submit" block>Continue</DS.Button>
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
      <div className="gs-card-acts"><DS.Button type="submit">Update username</DS.Button></div>
    </form>
  );
};
const GsUsernameCard = () => {
  const gs = useGs();
  const u = gs.user;
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <h2 className="mcp-t-card">Username</h2>
      <p><b>{u.username}</b> is your public name.{u.locked ? '' : ' You can change it once every 30 days.'}</p>
      {u.locked ? <p className="gs-muted">You can change it again on 6 November.</p> : <GsUsernameForm current={u.username} />}
    </DS.Card>
  );
};

Object.assign(window, { GsUsername, GsUsernameCard, gsGenName });
