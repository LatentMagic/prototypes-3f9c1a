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
  let st = { phase: 'active', plan: 'monthly', sheet: null, alert: null };
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

const ppaPill = (t) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 11, color: 'var(--color-accent)', background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>{t}</span>;
// v7 refinements of option C (the smallest). No dates: "your next renewal". "Keep ..." is a normal (secondary) button.
// sv: V1 plain price, V2 price rows with the pill, V3 the saving in one sentence. Yearly to monthly and the free-month sheet are single designs.
const PpaSheetV7 = ({ from, sv }) => {
  const A = window.CircPPA; const to = PP_PLANS[ppaOther(from)]; const cur = PP_PLANS[from];
  const trial = A.get().phase === 'trial'; const yearly = to.id === 'yearly';
  const close = () => A.set({ sheet: null });
  const go = () => A.set({ phase: trial ? 'trial' : 'switched', pending: to.id, sheet: null });
  const big = ppaP({ fontSize: 15, color: 'var(--color-fg-1)', marginBottom: 'var(--space-3)' });
  const small = ppaP({ marginBottom: 'var(--space-5)' });
  let title = yearly ? 'Pay yearly instead?' : 'Switch to monthly?'; let body;
  if (trial) {
    body = (<><p style={big}>Your free month carries on. When it ends you will pay {to.price} a {to.unit} instead of {cur.price} a {cur.unit}.</p><p style={small}>Nothing to pay today.</p></>);
  } else if (!yearly) {
    body = (<><p style={big}>From your next renewal you will pay {to.price} a month instead of {cur.price} a year. Until then you stay on yearly.</p>
      <p style={small}>Over a year, monthly adds up to £60, £10 more than yearly. Nothing is charged or refunded today.</p></>);
  } else if (sv === 'V2') {
    title = 'Switch to yearly?';
    const row = (t, v, hi, pill) => (
      <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: hi ? 'var(--color-accent-soft)' : 'var(--color-surface-sunken)', border: hi ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={ppaP({ color: 'var(--color-fg-1)' })}>{t}</span><span style={ppaP({ color: 'var(--color-fg-1)', fontWeight: 600, whiteSpace: 'nowrap' })}>{v}</span></div>
        {pill && <div style={{ marginTop: 6 }}>{pill}</div>}
      </div>);
    body = (<><div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-3)' }}>{row('Now', cur.price + ' a ' + cur.unit)}{row('From next renewal', to.price + ' a ' + to.unit, true, ppaPill('2 months free'))}</div>
      <p style={small}>Nothing to pay today.</p></>);
  } else if (sv === 'V3') {
    body = (<><p style={big}>Yearly is {to.price}, which is 2 months free compared with paying monthly. It starts at your next renewal.</p><p style={small}>Nothing to pay today.</p></>);
  } else {
    title = 'Switch to yearly?';
    body = (<><p style={big}>From your next renewal you will pay {to.price} a year instead of {cur.price} a month. Nothing to pay today.</p>
      <p style={small}>That is the price of 10 months, not 12.</p></>);
  }
  return (
    <PpaSheet title={title} onClose={close}>
      {body}
      <Button variant="primary" full onClick={go}>Yes, switch to {to.label.toLowerCase()}</Button>
      <div style={{ height: 'var(--space-2)' }} />
      <Button variant="secondary" full onClick={close}>Keep {cur.label.toLowerCase()}</Button>
    </PpaSheet>
  );
};
const PpaSwitchSheet = ({ from }) => {
  const A = window.CircPPA;
  if (/^V/.test(window.CircPP.get().sheet || '') || window.CircPP.get().sheet === 'T') return <PpaSheetV7 from={from} sv={window.CircPP.get().sheet} />;
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
  } else if (s.phase === 'none' && window.CircPP.get().v7 && window.CircPP.get().returning) {
    // v7 lapsed card (item 6): used the free month, not subscribed. Same rows as non-subscriber B; leads to pricing state 2. No price.
    const row = (t, v) => (<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: '1px solid var(--color-border-1)' }}><span style={ppaP()}>{t}</span><span style={ppaP({ color: 'var(--color-fg-1)', fontWeight: 500 })}>{v}</span></div>);
    body = (<>
      {head('Not subscribed')}
      <div style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>{row('Card', 'None to manage')}{row('Creating circles', 'Needs a subscription')}</div>
      <p style={ppaP({ marginBottom: 'var(--space-4)' })}>Your subscription ended. Start it again and you can create circles.</p>
      <Button variant="secondary" onClick={() => window.__ppApi && window.__ppApi.setRoute('funding')}>Start your subscription</Button>
    </>);
  } else if (s.phase === 'none' && window.CircPP.get().v7) {
    // v7 non-subscriber card (no price). Shared words: no card to manage because not paying; paying lets you create circles.
    const nv = window.CircPP.get().nsub;
    const create = () => window.__ppApi && window.__ppApi.setRoute('create-space');
    if (nv === 'B') {
      const row = (t, v) => (<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: '1px solid var(--color-border-1)' }}><span style={ppaP()}>{t}</span><span style={ppaP({ color: 'var(--color-fg-1)', fontWeight: 500 })}>{v}</span></div>);
      body = (<>
        {head('Not subscribed')}
        <div style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>{row('Card', 'None to manage')}{row('Creating circles', 'Needs a subscription')}</div>
        <p style={ppaP({ marginBottom: 'var(--space-4)' })}>There is no card to manage because you are not a paying member. Subscribe and you can create circles.</p>
        <Button variant="secondary" onClick={create}>Create a circle</Button>
      </>);
    } else if (nv === 'C') {
      body = (<>
        {head()}
        <div style={{ padding: '14px 14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent)' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)', marginBottom: 6 }}>Want to run a circle of your own?</div>
          <p style={ppaP({ color: 'var(--color-fg-1)', marginBottom: 'var(--space-4)' })}>Paying members can create circles. You are not one yet, so there is no card to manage here.</p>
          <Button variant="primary" onClick={create}>Create a circle</Button>
        </div>
      </>);
    } else {
      body = (<>
        {head()}
        <p style={ppaP({ fontSize: 15, color: 'var(--color-fg-1)', marginBottom: 'var(--space-2)' })}>No card to manage, because you are not a paying member.</p>
        <p style={ppaP({ marginBottom: 'var(--space-3)' })}>Pay, and you can create circles.</p>
        {link('Create a circle', create)}
      </>);
    }
  } else if (s.phase === 'none') {
    body = (<>{head()}<p style={ppaP()}>You don’t run a paid circle. Your subscription starts when you create your first circle.</p></>);
  } else {
    const ending = s.phase === 'ending', trial = s.phase === 'trial', switched = s.phase === 'switched', failed = s.phase === 'failed';
    const showCovers = window.CircPP.get().covers !== 'off';
    const email = (window.CircSeed && window.CircSeed.DEFAULT_USER && window.CircSeed.DEFAULT_USER.email) || 'you@example.com';
    const renew = ppaDay(trial ? PPA_TRIAL_DAYS : PPA_RENEW_DAYS);
    const pend = PP_PLANS[s.pending || ppaOther(s.plan)];
    const label = (t, v, strong) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: '1px solid var(--color-border-1)' }}>
        <span style={ppaP()}>{t}</span><span style={ppaP({ color: 'var(--color-fg-1)', fontWeight: strong ? 600 : 500, textAlign: 'right' })}>{v}</span>
      </div>);
    const status = ending ? 'Ends ' + ppaDay(PPA_RENEW_DAYS) : switched ? 'Switches to ' + pend.label + ' on ' + renew : trial ? 'Free month · ' + PPA_TRIAL_DAYS + ' days left' : 'Active';
    body = (<>
      {head(<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{s.phase === 'active' && <Icon name="check" size={15} color="var(--color-fg-3)" />}{trial ? 'Free month · ' + PPA_TRIAL_DAYS + ' days left' : ending ? 'Ending' : failed ? 'Payment failed' : 'Active'}</span>)}
      {failed && <p style={ppaP({ marginBottom: 'var(--space-2)' })}>Update the card within 30 days to keep your circles awake.</p>}
      {trial && <p style={ppaP({ marginBottom: 'var(--space-2)' })}>First payment {plan.full} on {renew}. We email a reminder a week before.</p>}
      {ending && <p style={ppaP({ marginBottom: 'var(--space-2)' })}>Your subscription ends on {ppaDay(PPA_RENEW_DAYS)}. Your circles then go to sleep, and whoever funds one next champions it. You can resume any time before that date.</p>}
      {switched && <p style={ppaP({ marginBottom: 'var(--space-2)' })}>Switches to {pend.label} on {renew}. Nothing changes until then.</p>}
      <div style={{ marginTop: 'var(--space-2)' }}>
        {label('Plan', plan.label + ' · ' + plan.full + ' per ' + plan.unit, true)}
        {!ending && !trial && !failed && label(switched ? 'Renews on' : 'Next renewal', renew)}
        {showCovers && label('Covers', n === 1 ? '1 circle' : n + ' circles')}
        {!showCovers && <div style={{ borderTop: '1px solid var(--color-border-1)' }} />}
      </div>
      {showCovers && <p style={ppaP({ margin: '4px 0 var(--space-4)', fontSize: 13, color: 'var(--color-fg-3)' })}>{names.join(' · ')}</p>}
      {!showCovers && <div style={{ height: 'var(--space-3)' }} />}
      {ending && s.alert && <p role="alert" style={ppaP({ color: 'var(--color-destructive)', marginBottom: 'var(--space-3)' })}>{s.alert === 'asleep' ? 'Your subscription has ended and your circles are now asleep.' : 'The resumption could not be completed.'}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {ending ? (<>
          <Button variant="secondary" icon={<Icon name="card" size={16} />} onClick={() => A.set({ sheet: 'card' })}>Update card</Button>
          <Button variant="primary" onClick={() => A.set({ phase: 'active', sheet: null })}>Resume</Button>
        </>) : (<>
          <Button variant="secondary" icon={<Icon name="card" size={16} />} onClick={() => A.set({ sheet: 'card' })}>Update card</Button>
          {failed ? null : switched
            ? <Button variant="secondary" onClick={() => A.set({ phase: 'active', pending: null })}>Undo switch</Button>
            : <Button variant="secondary" onClick={() => A.set({ sheet: 'switch' })}>Switch to {PP_PLANS[ppaOther(s.plan)].label}</Button>}
          <Button variant="tertiary" style={{ color: 'var(--color-destructive)' }} onClick={() => A.set({ sheet: 'cancel' })}>Cancel</Button>
        </>)}
      </div>
      <p style={ppaP({ margin: 'var(--space-4) 0 0', fontSize: 12.5, color: 'var(--color-fg-3)' })}>Billed to {email} · card ending 4242</p>
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
  React.useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      if (!window.__ppAutoDelete) { if (++n > 40) clearInterval(t); return; }
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent === 'Delete your account');
      if (b) { window.__ppAutoDelete = false; clearInterval(t); b.click(); } else if (++n > 40) clearInterval(t);
    }, 100);
    return () => clearInterval(t);
  }, []);
  const slot = usePpaSlot(ref, (h) => { const p = h.querySelector('h1 + p'); return p; });
  return (<div ref={ref} style={{ display: 'contents' }}>
    <PpaShippedAccount {...props} />
    {slot && ReactDOM.createPortal(<div style={{ marginBottom: 'var(--space-5)' }}><PpaSection /></div>, slot)}
  </div>);
};
window.AccountSettings = PpAccountSettings;

const PpStepSheet = ({ members }) => {
  const st = usePP(); const set = (p) => window.CircPP.set(p);
  const close = () => set({ stepSheet: null });
  const opt = (title, line, on) => (
    <button type="button" onClick={on} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', minHeight: 56, padding: '12px 14px', marginBottom: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border-2)' }}>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>{title}</span>
        <span style={ppaP({ display: 'block', marginTop: 2 })}>{line}</span>
      </span>
      <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
    </button>);
  if (st.stepSheet === 'pick') return (
    <PpaSheet title="Hand it to a member" onClose={close}>
      <p style={ppaP({ marginBottom: 'var(--space-4)' })}>They can accept only if they have, or start, a subscription. Until they accept, you stay champion.</p>
      {members.slice(0, 4).map((m) => opt(m.name, 'Ask ' + m.name.split(' ')[0] + ' to take it over', close))}
      <Button variant="secondary" onClick={() => set({ stepSheet: 'choice' })}>Back</Button>
    </PpaSheet>);
  return (
    <PpaSheet title="Step back from this circle" onClose={close}>
      <p style={ppaP({ marginBottom: 'var(--space-4)' })}>You stop paying for it. Your other circles are not affected. Pick what happens to this one.</p>
      {opt('Let it sleep', 'It sleeps at once. Members keep everything, and any member can take it over.', close)}
      {opt('Hand it to a member', 'Pick who takes it over. It keeps running with no gap.', () => set({ stepSheet: 'pick' }))}
      <div style={{ height: 'var(--space-2)' }} />
      <Button variant="secondary" onClick={close}>Keep it</Button>
    </PpaSheet>);
};
const PpMembersSurface = (props) => {
  const ref = React.useRef(null);
  const champ = usePP().champ;
  const stepSt = usePP(); const step = props.isChampion ? stepSt.step : null;
  const fslot = usePpaSlot(ref, (h) => (!step ? null : Array.from(h.querySelectorAll('div')).find((d) => d.style.display === 'flex' && d.children.length === 2 && /^You champion this circle/.test(d.textContent))), 'replace');
  const mail = <a href={'mailto:' + (window.OPERATOR_EMAIL || 'support@circlists.com')} className="circ-textlink" style={{ color: 'var(--color-fg-2)', textDecoration: 'underline', textUnderlineOffset: 3 }}>get in touch</a>;
  const fbase = { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0 2px', marginTop: 'var(--space-5)', fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)' };
  const crown = <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="crown" size={15} /></span>;
  const footer = !fslot ? null : step === 'A' ? (
    <div style={fbase}>{crown}<span>You champion this circle, so you can’t leave it. To hand it to another member, {mail}.</span></div>
  ) : step === 'B' ? (<div style={{ marginTop: 'var(--space-5)' }}>
    <div style={{ ...fbase, marginTop: 0, marginBottom: 'var(--space-3)' }}>{crown}<span>You champion this circle, so you can’t leave it.</span></div>
    <a href={'mailto:' + (window.OPERATOR_EMAIL || 'support@circlists.com')} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '10px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', textDecoration: 'none' }}>
      <Icon name="mail" size={18} color="var(--color-fg-2)" />
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>Hand this circle to another member</span>
        <span style={ppaP({ display: 'block', fontSize: 12.5 })}>Get in touch and we will move it for you</span>
      </span>
      <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
    </a></div>
  ) : (<div style={{ marginTop: 'var(--space-5)' }}>
    <button type="button" onClick={() => window.CircPP.set({ stepSheet: 'choice' })} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', minHeight: 56, padding: '10px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', border: '1px solid var(--color-border-1)' }}>
      {crown}
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>Step back from this circle</span>
        <span style={ppaP({ display: 'block', fontSize: 12.5 })}>Let it sleep, or hand it to a member</span>
      </span>
      <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
    </button>
    <p style={{ ...fbase, marginTop: 'var(--space-2)' }}>You champion this circle, so you can’t leave it. Stepping back is how you let go.</p>
  </div>);
  const on = props.isChampion && window.CircPP.get().subscribed;
  const slot = usePpaSlot(ref, (h) => {
    if (!on) return null;
    return Array.from(h.querySelectorAll('div')).find((d) => d.firstElementChild && d.firstElementChild.firstElementChild && d.firstElementChild.firstElementChild.textContent === 'Funding' && d.style.borderRadius);
  }, 'replace');
  return (<div ref={ref} style={{ display: 'contents' }}>
    <PpaShippedMembers {...props} />
    {fslot && ReactDOM.createPortal(footer, fslot)}
    {step === 'C' && stepSt.stepSheet && <PpStepSheet members={(props.space.members || []).filter((m) => m.name !== 'You')} />}
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
const ppaState = (id, label, { phase, plan = 'monthly', pending = null, sheet = null, alert = null, account = 'subscribed', route = 'account', current = null, pp = {} }) => ({
  id, label, group: PPA_GROUP,
  go: (api, seed) => {
    const { DEFAULT_USER } = window.CircSeed;
    try { localStorage.removeItem(api.STATE_KEY); } catch (e) {}
    window.__ppTk = null; window.__ppAuto = null;
    window.CircPP.set({ flow: 'form-first', copy: 'A', acct: 'A', sheet: 'A', champ: 'A', v7: null, covers: 'on', nsub: 'A', label: null, step: null, stepSheet: null, delp: false, option: 'cards', plan: 'yearly', ...PP_ACCOUNT_PATCH[account], ...pp });
    window.CircPPA.set({ phase, plan, pending, sheet, alert });
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
  // ---- v7 options (review only). Each carries a visible label (pp.label).
  ppaState('pp-v7-price-1a', 'v7 pricing screen, free month available, A', { phase: 'none', account: 'none', route: 'funding', pp: { flow: 'pricing-first', v7: 'A', label: 'Pricing screen · free month available · A' } }),
  ppaState('pp-v7-price-1b', 'v7 pricing screen, free month available, B', { phase: 'none', account: 'none', route: 'funding', pp: { flow: 'pricing-first', v7: 'B', label: 'Pricing screen · free month available · B' } }),
  ppaState('pp-v7-price-1c', 'v7 pricing screen, free month available, C', { phase: 'none', account: 'none', route: 'funding', pp: { flow: 'pricing-first', v7: 'C', label: 'Pricing screen · free month available · C' } }),
  ppaState('pp-v7-price-2', 'v7 pricing screen, free month used', { phase: 'none', account: 'returning', route: 'funding', pp: { flow: 'pricing-first', v7: 'S', label: 'Pricing screen · free month used' } }),
  ppaState('pp-v7-price-2-monthly', 'v7 pricing screen, free month used, monthly picked', { phase: 'none', account: 'returning', route: 'funding', pp: { flow: 'pricing-first', v7: 'S', plan: 'monthly', label: 'Pricing screen · free month used · monthly' } }),
  ppaState('pp-v7-switch-1', 'v7 switch to yearly, V1 plain price', { phase: 'active', sheet: 'switch', pp: { sheet: 'V1', label: 'Switch sheet · monthly to yearly · A' } }),
  ppaState('pp-v7-switch-2', 'v7 switch to yearly, V2 price rows and pill', { phase: 'active', sheet: 'switch', pp: { sheet: 'V2', label: 'Switch sheet · monthly to yearly · B' } }),
  ppaState('pp-v7-switch-3', 'v7 switch to yearly, V3 saving in a sentence', { phase: 'active', sheet: 'switch', pp: { sheet: 'V3', label: 'Switch sheet · monthly to yearly · C' } }),
  ppaState('pp-v7-switch-yearly', 'v7 switch to monthly (on yearly)', { phase: 'active', plan: 'yearly', sheet: 'switch', pp: { sheet: 'V1', label: 'Switch sheet · yearly to monthly' } }),
  ppaState('pp-v7-switch-trial', 'v7 switch during the free month', { phase: 'trial', plan: 'monthly', sheet: 'switch', pp: { sheet: 'T', label: 'Switch sheet · during the free month' } }),
  ppaState('pp-v7-acct-trial', 'v7 account card A, free month', { phase: 'trial', plan: 'yearly', pp: { label: 'Account card A · free month' } }),
  ppaState('pp-v7-acct-active-a', 'v7 account card A, active, with covers line', { phase: 'active', pp: { label: 'Account card A · active · covers line A (with)' } }),
  ppaState('pp-v7-acct-active-b', 'v7 account card A, active, without covers line', { phase: 'active', pp: { covers: 'off', label: 'Account card A · active · covers line B (without)' } }),
  ppaState('pp-v7-acct-ending', 'v7 account card A, ending, Update card kept', { phase: 'ending', pp: { label: 'Account card A · ending' } }),
  ppaState('pp-v7-acct-failed', 'v7 account card A, payment failed', { phase: 'failed', pp: { label: 'Account card A · payment failed' } }),
  ppaState('pp-v7-acct-resume-failed', 'v7 account card A, ending, resume failed', { phase: 'ending', alert: 'failed', pp: { label: 'Account card A · ending · resume failed' } }),
  ppaState('pp-v7-acct-resume-asleep', 'v7 account card A, ending, already asleep', { phase: 'ending', alert: 'asleep', pp: { label: 'Account card A · ending · already asleep' } }),
  ppaState('pp-v7-nosub-a', 'v7 non-subscriber card, A', { phase: 'none', account: 'none', pp: { v7: 'A', nsub: 'A', flow: 'pricing-first', label: 'Non-subscriber card · A' } }),
  ppaState('pp-v7-nosub-b', 'v7 non-subscriber card, B', { phase: 'none', account: 'none', pp: { v7: 'A', nsub: 'B', flow: 'pricing-first', label: 'Non-subscriber card · B' } }),
  ppaState('pp-v7-nosub-c', 'v7 non-subscriber card, C', { phase: 'none', account: 'none', pp: { v7: 'A', nsub: 'C', flow: 'pricing-first', label: 'Non-subscriber card · C' } }),
];
const PPA_MEM = { phase: 'active', route: 'members', current: 'sp-backend' };
PPA_STATES.push(
  ppaState('pp-v7-step-a', 'v7 step back, A: get in touch in the footer', { ...PPA_MEM, pp: { champ: 'C', step: 'A', label: 'Circle settings footer · A · launch, get in touch' } }),
  ppaState('pp-v7-step-b', 'v7 step back, B: get in touch as a row', { ...PPA_MEM, pp: { champ: 'C', step: 'B', label: 'Circle settings footer · B · get in touch as a row' } }),
  ppaState('pp-v7-step-c', 'v7 step back, C: step back row (fast follow)', { ...PPA_MEM, pp: { champ: 'C', step: 'C', label: 'Circle settings footer · C · fast follow, not v1' } }),
  ppaState('pp-v7-step-c-choice', 'v7 step back, C: the choice sheet', { ...PPA_MEM, pp: { champ: 'C', step: 'C', stepSheet: 'choice', label: 'Step back · C · fast follow, not v1 · the choice' } }),
  ppaState('pp-v7-step-c-pick', 'v7 step back, C: pick a member', { ...PPA_MEM, pp: { champ: 'C', step: 'C', stepSheet: 'pick', label: 'Step back · C · fast follow, not v1 · hand to a member' } }),
  ppaState('pp-v7-acct-lapsed', 'v7 lapsed account card', { phase: 'none', account: 'returning', pp: { v7: 'S', flow: 'pricing-first', label: 'Account card · lapsed (used the free month)' } }),
  ppaState('pp-v7-delete', 'v7 delete account confirm, with get in touch line', { phase: 'active', pp: { delp: true, label: 'Delete account confirm · get in touch to hand over first' } }),
);
PPA_STATES.find((x) => x.id === 'pp-v7-delete').go0 = PPA_STATES.find((x) => x.id === 'pp-v7-delete').go;
PPA_STATES.find((x) => x.id === 'pp-v7-delete').go = (api, seed) => { PPA_STATES.find((x) => x.id === 'pp-v7-delete').go0(api, seed); window.__ppAutoDelete = true; };
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

// v7 delete-account confirm: one added line, only when the review switch is on. Shipped dialog otherwise.
const PpShippedConfirm = window.ConfirmDialog;
const PpConfirmDialog = (props) => {
  const ref = React.useRef(null);
  const on = usePP().delp && props.kind === 'delete-account';
  const slot = usePpaSlot(ref, (h) => { if (!on) return null; const p = h.querySelector('[role=alertdialog] p'); if (p) p.style.marginBottom = '10px'; return p; });
  return (<div ref={ref} style={{ display: 'contents' }}>
    <PpShippedConfirm {...props} />
    {slot && ReactDOM.createPortal(<p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.55, color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)' }}>To hand a circle to someone first, <a href={'mailto:' + (window.OPERATOR_EMAIL || 'support@circlists.com')} className="circ-textlink" style={{ color: 'var(--color-fg-1)', textDecoration: 'underline', textUnderlineOffset: 3 }}>get in touch</a>.</p>, slot)}
  </div>);
};
window.ConfirmDialog = PpConfirmDialog;
