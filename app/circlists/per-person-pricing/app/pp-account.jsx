// ============================================================================
// Per-person pricing candidate — the Subscription section on the account page.
// Money lives on the person, not the circle. Re-publishes AccountSettings and
// MembersSurface (window wins at render), wrapping the shipped ones unchanged and
// placing new UI by portal. Adds pp-account-* / pp-members-link states.
// Proposed behaviour, nothing here is ratified.
// ============================================================================
const PpaShippedAccount = window.AccountSettings;
const PpaShippedMembers = window.MembersSurface;

// phase: active | switched | ending | trial | none.  sheet: null | switch | cancel | card.
window.CircPPA = (() => {
  let st = { phase: 'active', plan: 'monthly', sheet: null };
  const subs = new Set();
  return {
    get: () => st,
    set(p) { st = { ...st, ...p }; subs.forEach((f) => f()); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
})();
const usePPA = () => {
  const [, tick] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => window.CircPPA.subscribe(tick), []);
  return window.CircPPA.get();
};
const ppaDay = (n) => new Date(Date.now() + n * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const ppaCircles = () => {
  try {
    const { seedSpaces, DEFAULT_USER } = window.CircSeed;
    return seedSpaces(DEFAULT_USER.email).filter((s) => ['sp-backend', 'sp-book', 'sp-sam'].includes(s.id)).map((s) => s.name);
  } catch (e) { return []; }
};
const PPA_RENEW_DAYS = 19, PPA_TRIAL_DAYS = 12;

const ppaCard = { background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' };
const ppaP = (extra) => ({ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0, ...extra });
const ppaOther = (id) => (id === 'monthly' ? 'yearly' : 'monthly');

const PpaSheet = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)', animation: 'circ-fade 160ms ease-out' }} />
    <div role="dialog" aria-label={title} style={{ position: 'relative', width: '100%', maxWidth: 480, background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      padding: 'var(--space-6) var(--space-6) calc(var(--space-6) + env(safe-area-inset-bottom))', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', animation: 'circ-slide-up 200ms ease-out' }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 18, color: 'var(--color-fg-1)', marginBottom: 'var(--space-3)' }}>{title}</div>
      {children}
    </div>
  </div>
);

const PpaSwitchSheet = ({ from }) => {
  const A = window.CircPPA;
  const to = PP_PLANS[ppaOther(from)]; const cur = PP_PLANS[from];
  const trial = A.get().phase === 'trial';
  const date = ppaDay(trial ? PPA_TRIAL_DAYS : PPA_RENEW_DAYS);
  const close = () => A.set({ sheet: null });
  const sv = window.CircPP.get().sheet;
  const go = () => A.set({ phase: A.get().phase === 'trial' ? 'trial' : 'switched', pending: to.id, sheet: null });
  if (sv === 'B' && !trial) {
    const row = (t, v, hi) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: hi ? 'var(--color-accent-soft)' : 'var(--color-surface-sunken)', border: hi ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
        <span style={ppaP({ color: 'var(--color-fg-1)' })}>{t}</span><span style={ppaP({ color: 'var(--color-fg-1)', fontWeight: 600 })}>{v}</span>
      </div>);
    return (
      <PpaSheet title={'Switch to ' + to.label + '?'} onClose={close}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-3)' }}>
          {row('Now', cur.full + ' per ' + cur.unit)}
          {row('From ' + date, to.full + ' per ' + to.unit, true)}
        </div>
        <p style={ppaP({ marginBottom: 'var(--space-5)' })}>{to.id === 'yearly' ? 'That is 2 months free. ' : ''}Nothing is charged or refunded today.</p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={go}>Switch to {to.label}</Button>
          <Button variant="secondary" onClick={close}>Not now</Button>
        </div>
      </PpaSheet>
    );
  }
  if (sv === 'C' && !trial) {
    return (
      <PpaSheet title={'Pay ' + (to.id === 'yearly' ? 'yearly' : 'monthly') + ' instead?'} onClose={close}>
        <p style={ppaP({ fontSize: 15, color: 'var(--color-fg-1)', marginBottom: 'var(--space-5)' })}>
          {to.id === 'yearly' ? 'Get 2 months free: ' : ''}{to.full} a {to.unit} from {date}, instead of {cur.full} a {cur.unit}. Nothing to pay today.
        </p>
        <Button variant="primary" full onClick={go}>Yes, switch to {to.label}</Button>
        <div style={{ height: 'var(--space-2)' }} />
        <Button variant="tertiary" full onClick={close}>Keep {cur.label}</Button>
      </PpaSheet>
    );
  }
  return (
    <PpaSheet title={'Switch to ' + to.label} onClose={close}>
      <p style={ppaP({ marginBottom: 'var(--space-3)' })}>
        {trial ? <>The new price starts when your free month ends, on <b>{date}</b>. You will be charged <b>{to.full}</b> per {to.unit} then.</>
          : <>The new price starts at your next renewal on <b>{date}</b>: <b>{to.full}</b> per {to.unit} instead of {cur.full} per {cur.unit}.</>}
      </p>
      <p style={ppaP({ marginBottom: 'var(--space-5)' })}>{trial ? 'Nothing is charged now.' : 'Nothing is charged or refunded now.'} Your circles stay awake.</p>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={() => A.set({ phase: A.get().phase === 'trial' ? 'trial' : 'switched', pending: to.id, sheet: null })}>Switch to {to.label}</Button>
        <Button variant="secondary" onClick={close}>Keep {cur.label}</Button>
      </div>
    </PpaSheet>
  );
};
const PpaCancelSheet = ({ n }) => {
  const A = window.CircPPA; const close = () => A.set({ sheet: null });
  const date = ppaDay(A.get().phase === 'trial' ? PPA_TRIAL_DAYS : PPA_RENEW_DAYS);
  return (
    <PpaSheet title="Cancel your subscription?" onClose={close}>
      <p style={ppaP({ marginBottom: 'var(--space-3)' })}>{n === 1 ? 'Your circle goes' : 'All ' + n + ' of your circles go'} to sleep on <b>{date}</b>. Until then, everything works as it does now.</p>
      <p style={ppaP({ marginBottom: 'var(--space-3)' })}>Members keep everything in {n === 1 ? 'it' : 'them'}, and any member can take a circle over.</p>
      <p style={ppaP({ marginBottom: 'var(--space-5)' })}>You can restart any time before {date}.</p>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button variant="secondary" style={{ color: 'var(--color-destructive)' }} onClick={() => A.set({ phase: 'ending', sheet: null })}>Cancel subscription</Button>
        <Button variant="primary" onClick={close}>Keep it</Button>
      </div>
    </PpaSheet>
  );
};
const PpaCardSheet = () => {
  const A = window.CircPPA;
  return (
    <PpaSheet title="Update your card" onClose={() => A.set({ sheet: null })}>
      <div style={{ ...ppaCard, background: 'var(--color-surface-sunken)', marginBottom: 'var(--space-4)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--color-fg-3)', marginBottom: 6 }}>PADDLE · SECURE PAGE</div>
        <p style={ppaP()}>This opens Paddle’s own page, where you enter the new card. Then you come straight back here.</p>
      </div>
      <Button variant="primary" onClick={() => A.set({ sheet: null })}>Done</Button>
    </PpaSheet>
  );
};

const PpaSection = () => {
  const s = usePPA(); const A = window.CircPPA;
  const names = ppaCircles(); const n = names.length;
  const plan = PP_PLANS[s.plan];
  const head = (right) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 'var(--space-2)' }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)' }}>Subscription</div>
      {right && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>{right}</div>}
    </div>
  );
  let body;
  const av = window.CircPP.get().acct;
  const other = PP_PLANS[ppaOther(s.plan)];
  const link = (t, on, color) => (
    <button type="button" onClick={on} style={{ background: 'none', border: 0, padding: 0, minHeight: 44, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 500, color: color || 'var(--color-accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>{t}</button>);
  if (s.phase === 'active' && av === 'B') {
    // B: one plain sentence, actions as links.
    body = (<>
      {head(<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={15} color="var(--color-fg-3)" />Active</span>)}
      <p style={ppaP({ fontSize: 15, color: 'var(--color-fg-1)', margin: '4px 0 6px' })}>{plan.label} plan, {plan.full}. Renews {ppaDay(PPA_RENEW_DAYS)}.</p>
      <p style={ppaP({ marginBottom: 'var(--space-3)' })}>Covers {n} circles: {names.join(', ')}.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 'var(--space-5)' }}>
        {link('Update card', () => A.set({ sheet: 'card' }))}
        {link('Switch to ' + other.label, () => A.set({ sheet: 'switch' }))}
        {link('Cancel', () => A.set({ sheet: 'cancel' }), 'var(--color-destructive)')}
      </div>
    </>);
  } else if (s.phase === 'active' && av === 'C') {
    // C: price first, a yearly nudge on the card itself.
    body = (<>
      {head(<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={15} color="var(--color-fg-3)" />Active</span>)}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 2px' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--color-fg-1)' }}>{plan.price}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-fg-2)' }}>per {plan.unit}</span>
      </div>
      <p style={ppaP({ marginBottom: 'var(--space-3)' })}>Next renewal {ppaDay(PPA_RENEW_DAYS)}. Covers {n} circles.</p>
      {s.plan === 'monthly' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', marginBottom: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent)' }}>
          <span style={ppaP({ color: 'var(--color-fg-1)' })}>Yearly is £50. That is 2 months free.</span>
          <Button variant="primary" size="sm" onClick={() => A.set({ sheet: 'switch' })}>Switch</Button>
        </div>)}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <Button variant="secondary" icon={<Icon name="card" size={16} />} onClick={() => A.set({ sheet: 'card' })}>Update card</Button>
        <Button variant="tertiary" style={{ color: 'var(--color-destructive)' }} onClick={() => A.set({ sheet: 'cancel' })}>Cancel</Button>
      </div>
    </>);
  } else if (s.phase === 'none') {
    body = (<>{head()}<p style={ppaP()}>You don’t run a paid circle. Your subscription starts when you create your first circle.</p></>);
  } else {
    const ending = s.phase === 'ending', trial = s.phase === 'trial', switched = s.phase === 'switched';
    const renew = ppaDay(trial ? PPA_TRIAL_DAYS : PPA_RENEW_DAYS);
    const pend = PP_PLANS[s.pending || ppaOther(s.plan)];
    const label = (t, v, strong) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: '1px solid var(--color-border-1)' }}>
        <span style={ppaP()}>{t}</span><span style={ppaP({ color: 'var(--color-fg-1)', fontWeight: strong ? 600 : 500, textAlign: 'right' })}>{v}</span>
      </div>);
    const status = ending ? 'Ends ' + ppaDay(PPA_RENEW_DAYS) : switched ? 'Switches to ' + pend.label + ' on ' + renew : trial ? 'Free month · ' + PPA_TRIAL_DAYS + ' days left' : 'Active';
    body = (<>
      {head(<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{s.phase === 'active' && <Icon name="check" size={15} color="var(--color-fg-3)" />}{trial ? 'Free month · ' + PPA_TRIAL_DAYS + ' days left' : ending ? 'Ending' : 'Active'}</span>)}
      {trial && <p style={ppaP({ marginBottom: 'var(--space-2)' })}>First payment {plan.full} on {renew}. We email a reminder a week before.</p>}
      {ending && <p style={ppaP({ marginBottom: 'var(--space-2)' })}>Ends {ppaDay(PPA_RENEW_DAYS)}. Your circles go to sleep then.</p>}
      {switched && <p style={ppaP({ marginBottom: 'var(--space-2)' })}>Switches to {pend.label} on {renew}. Nothing changes until then.</p>}
      <div style={{ marginTop: 'var(--space-2)' }}>
        {label('Plan', plan.label + ' · ' + plan.full + ' per ' + plan.unit, true)}
        {!ending && !trial && label(switched ? 'Renews on' : 'Next renewal', renew)}
        {label('Covers', n === 1 ? '1 circle' : n + ' circles')}
      </div>
      <p style={ppaP({ margin: '4px 0 var(--space-4)', fontSize: 13, color: 'var(--color-fg-3)' })}>{names.join(' · ')}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {ending ? <Button variant="primary" onClick={() => A.set({ phase: 'active', sheet: null })}>Resume</Button> : (<>
          <Button variant="secondary" icon={<Icon name="card" size={16} />} onClick={() => A.set({ sheet: 'card' })}>Update card</Button>
          {switched
            ? <Button variant="secondary" onClick={() => A.set({ phase: 'active', pending: null })}>Undo switch</Button>
            : <Button variant="secondary" onClick={() => A.set({ sheet: 'switch' })}>Switch to {PP_PLANS[ppaOther(s.plan)].label}</Button>}
          <Button variant="tertiary" style={{ color: 'var(--color-destructive)' }} onClick={() => A.set({ sheet: 'cancel' })}>Cancel</Button>
        </>)}
      </div>
    </>);
  }
  return (<>
    <div style={ppaCard}>{body}</div>
    <div style={{ height: 'var(--space-5)' }} />
    {s.sheet === 'switch' && <PpaSwitchSheet from={s.plan} />}
    {s.sheet === 'cancel' && <PpaCancelSheet n={n} />}
    {s.sheet === 'card' && <PpaCardSheet />}
  </>);
};

// Place a portal target next to an element found inside the shipped render.
const usePpaSlot = (root, find, mode) => {
  const [slot, setSlot] = React.useState(null);
  React.useLayoutEffect(() => {
    const host = root.current; if (!host) return;
    const anchor = find(host); if (!anchor) return;
    const el = document.createElement('div');
    if (mode === 'replace') { anchor.style.display = 'none'; anchor.after(el); } else anchor.after(el);
    setSlot(el);
    return () => { el.remove(); if (mode === 'replace') anchor.style.display = ''; };
  }, []);
  return slot;
};

const PpAccountSettings = (props) => {
  const ref = React.useRef(null);
  const slot = usePpaSlot(ref, (h) => { const p = h.querySelector('h1 + p'); return p; });
  return (<div ref={ref} style={{ display: 'contents' }}>
    <PpaShippedAccount {...props} />
    {slot && ReactDOM.createPortal(<div style={{ marginBottom: 'var(--space-5)' }}><PpaSection /></div>, slot)}
  </div>);
};
window.AccountSettings = PpAccountSettings;

const PpMembersSurface = (props) => {
  const ref = React.useRef(null);
  const champ = usePP().champ;
  const on = props.isChampion && window.CircPP.get().subscribed;
  const slot = usePpaSlot(ref, (h) => {
    if (!on) return null;
    return Array.from(h.querySelectorAll('div')).find((d) => d.firstElementChild && d.firstElementChild.firstElementChild && d.firstElementChild.firstElementChild.textContent === 'Funding' && d.style.borderRadius);
  }, 'replace');
  return (<div ref={ref} style={{ display: 'contents' }}>
    <PpaShippedMembers {...props} />
    {slot && champ !== 'C' && ReactDOM.createPortal(
      <div style={{ ...ppaCard, padding: 'var(--space-5) var(--space-6)' }}>
        <span style={ppaP({ color: 'var(--color-fg-1)' })}>{champ === 'B' ? 'You\u2019re this circle\u2019s champion \u00b7 ' : 'Runs on your subscription \u00b7 '}</span>
        <button type="button" onClick={() => { window.CircPPA.set({ phase: 'active' }); window.__ppApi.setRoute('account'); }}
          style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 500, color: 'var(--color-accent)', textDecoration: 'underline', textUnderlineOffset: 3, minHeight: 32 }}>{champ === 'B' ? 'Account' : 'Manage'}</button>
      </div>, slot)}
  </div>);
};
window.MembersSurface = PpMembersSurface;

// ---- addressable states ------------------------------------------------------
const PPA_GROUP = 'Pricing candidate: account subscription';
const ppaState = (id, label, { phase, plan = 'monthly', pending = null, sheet = null, account = 'subscribed', route = 'account', current = null, pp = {} }) => ({
  id, label, group: PPA_GROUP,
  go: (api, seed) => {
    const { DEFAULT_USER } = window.CircSeed;
    try { localStorage.removeItem(api.STATE_KEY); } catch (e) {}
    window.__ppTk = null; window.__ppAuto = null;
    window.CircPP.set({ flow: 'form-first', copy: 'A', acct: 'A', sheet: 'A', champ: 'A', ...PP_ACCOUNT_PATCH[account], ...pp });
    window.CircPPA.set({ phase, plan, pending, sheet });
    api.setUser(DEFAULT_USER); api.setSpaces(seed.filter((sp) => !/^TEST\b/i.test(sp.name || '')));
    api.setLoadingFeed(false); api.setHoldLoading(false);
    if (api.setHomeStripOpen) api.setHomeStripOpen(false);
    api.setCurrentId(current); api.setTab('active'); api.setRoute(route);
  },
});
const PPA_STATES = [
  ppaState('pp-account-active', 'Account: subscription active, monthly, three circles covered', { phase: 'active' }),
  ppaState('pp-account-switch', 'Account: switch to yearly, confirm sheet', { phase: 'active', sheet: 'switch' }),
  ppaState('pp-account-switched', 'Account: switch made, takes effect at renewal, undo', { phase: 'switched', pending: 'yearly' }),
  ppaState('pp-account-cancel', 'Account: cancel, confirm sheet', { phase: 'active', sheet: 'cancel' }),
  ppaState('pp-account-ending', 'Account: cancelled, ends on a date, resume', { phase: 'ending' }),
  ppaState('pp-account-trial', 'Account: free month, first payment date', { phase: 'trial', plan: 'yearly' }),
  ppaState('pp-account-none', 'Account: never subscribed', { phase: 'none', account: 'none' }),
  ppaState('pp-members-link', 'Circle settings, champion: runs on your subscription, Manage link', { phase: 'active', route: 'members', current: 'sp-backend' }),
  // Design-option states (review only): B and C of each surface. A is the state above.
  ppaState('pp-account-active-b', 'Account card B: one plain sentence, links', { phase: 'active', pp: { acct: 'B' } }),
  ppaState('pp-account-active-c', 'Account card C: price first, yearly nudge', { phase: 'active', pp: { acct: 'C' } }),
  ppaState('pp-account-switch-b', 'Switch sheet B: now vs from', { phase: 'active', sheet: 'switch', pp: { sheet: 'B' } }),
  ppaState('pp-account-switch-c', 'Switch sheet C: one sentence', { phase: 'active', sheet: 'switch', pp: { sheet: 'C' } }),
  ppaState('pp-members-link-b', 'Circle settings B: champion line, Account link', { phase: 'active', route: 'members', current: 'sp-backend', pp: { champ: 'B' } }),
  ppaState('pp-members-link-c', 'Circle settings C: nothing, badge only', { phase: 'active', route: 'members', current: 'sp-backend', pp: { champ: 'C' } }),
  // Create-a-circle, pricing first: start on home, not subscribed; tap Create. copy picks the free-month wording.
  ppaState('pp-create-first', 'Create, pricing first: home, not subscribed (tap Create)', { phase: 'none', account: 'none', route: 'home', pp: { flow: 'pricing-first' } }),
  ppaState('pp-create-first-b', 'Create, pricing first, copy B', { phase: 'none', account: 'none', route: 'home', pp: { flow: 'pricing-first', copy: 'B' } }),
  ppaState('pp-create-first-c', 'Create, pricing first, copy C', { phase: 'none', account: 'none', route: 'home', pp: { flow: 'pricing-first', copy: 'C' } }),
];
const PPA_IDS = PPA_STATES.map((s) => s.id);
const ppaBuild = window.buildStates;
window.buildStates = (api) => {
  const r = ppaBuild(api);
  const { seedSpaces, DEFAULT_USER } = window.CircSeed;
  const mine = PPA_STATES.map((s) => ({ id: s.id, label: s.label, group: s.group, go: () => s.go(api, seedSpaces(DEFAULT_USER.email)) }));
  mine.forEach((m) => { r.byId[m.id] = m; });
  r.groups = [...r.groups, { title: PPA_GROUP, notes: null, items: mine }];
  return r;
};
const ppaResolve = window.circResolveState;
window.circResolveState = () => {
  let name = '';
  try { name = (new URLSearchParams(window.location.search).get('state') || '').trim().toLowerCase(); } catch (e) {}
  return PPA_IDS.includes(name) ? { kind: 'state', id: name } : ppaResolve();
};
