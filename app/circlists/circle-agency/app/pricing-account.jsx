// ============================================================================
// Per-person pricing candidate — the Subscription card on Account. Direction A
// styling (the house settings card). The card is where subscription status
// lives; a subscriber sees one of four states (free month, active, payment
// failed, ending), plus a pending switch. A non-subscriber sees one plain card
// with Subscribe as a link in the line and no price. Layout from the Account-card
// playground (02.1 + N2, ratified 2 Oct). Resume behaves as canon's: no confirm,
// cannot fail, returns the subscription to Active.
// ============================================================================
const PppRow = ({ k, v }) => (
  <div className="ppp-row"><span className="ppp-row-k">{k}</span><span className="ppp-row-v">{v}</span></div>
);
const PppHead = ({ marker, tick }) => (
  <div className="ppp-card-head">
    <div className="ppp-card-title">Subscription</div>
    {marker && <div className="ppp-card-marker">{tick && <Icon name="check" size={15} color="var(--color-fg-3)" />}{marker}</div>}
  </div>
);

// Not subscribed: one card for never-subscribed and lapsed, only the copy differs
// (lapsed: you champion a sleeping circle). Its act follows the Account rule (.circ-acct-act):
// full width on a phone, own width and right-aligned on desktop.
const PppNotSubscribed = ({ st }) => {
  const api = pppApi();
  const go = () => { window.CircPPP.set({ ctx: { from: 'account' } }); api.setRoute('subscribe'); };
  // Lapsed copy only while it's true: you champion at least one sleeping circle
  // (some taken over, some asleep still counts). Otherwise the never-subscribed line.
  const lapsed = !!st.usedFreeMonth && ((api && api.spaces) || []).some((s) => s.champion === 'You' && !s.funded);
  return (
    <div className="ppp-card ppp-ns">
      <PppHead />
      <div className="ppp-ns-wrap">
        <p className="ppp-card-body">{lapsed
          ? <>Your subscription ended on {pppNb(pppDay(-14))}, so your circles are asleep. Nothing in them has been{'\u00a0'}lost.</>
          : <>Joining circles is free. Subscribe to run your{'\u00a0'}own.</>}</p>
        <div className="ppp-ns-btn circ-acct-act"><Button variant="secondary" full onClick={go}>{lapsed ? 'Subscribe again' : 'Subscribe'}</Button></div>
      </div>
    </div>
  );
};

// Phrases that must never split across a line: prices, dates, counts.
const pppNb = (s) => String(s).replace(/ /g, '\u00a0');

// Subscribed (playground 02.1, ratified 2 Oct): neutral acts as an even pair,
// side by side when both fit, else stacked; never one-and-one-half. Cancel is red
// text below a rule at the card's foot. While a switch is pending, Keep <plan>
// undoes it (no confirm, like Resume).
const PppSubscribed = ({ st, user }) => {
  const api = pppApi(); const A = window.CircPPP;
  const plan = PPP_PLANS[st.plan];
  const renew = pppNb(pppDay(st.status === 'trial' || (st.status === 'ending' && st.wasTrial) ? PPP_TRIAL_DAYS : PPP_RENEW_DAYS));
  const marker = { trial: 'Active', active: 'Active', failed: 'Payment failed', ending: 'Ending' }[st.status];
  const resume = () => A.set(pppResumed(st));
  const pending = st.pending && st.status !== 'ending';
  const canSwitch = (st.status === 'active' || st.status === 'trial') && !st.pending;
  let line = null;
  if (st.status === 'ending') line = 'Your circles then go to sleep. A member can take one over by starting their own subscription, or free if they already have one. You can resume any time before that date.';
  return (
    <div className="ppp-card ppp-card-cq">
      <PppHead marker={marker} tick={st.status === 'active' || st.status === 'trial'} />
      <div className="ppp-rows">
        <PppRow k="Plan" v={plan.label + ' \u00b7 ' + pppNb(plan.a)} />
        {(st.status === 'active' || st.status === 'trial') && <PppRow k={st.status === 'trial' ? 'First payment' : 'Next renewal'} v={renew} />}
        {st.status === 'ending' && <PppRow k="Ends on" v={renew} />}
        {pending && <PppRow k={'From ' + renew} v={PPP_PLANS[st.pending].label + ' \u00b7 ' + pppNb(PPP_PLANS[st.pending].a)} />}
      </div>
      {line && <p className="ppp-card-line">{line}</p>}
      {/* Payment failed (board pg-failed-card 02.1, Joe 2 Oct): the line and its fix are one
          row of the card's table, under Plan's hairline. Stacks on a phone. */}
      {st.status === 'failed' && (
        <div className="ppp-fail-row">
          <span className="ppp-fail-line">Update the card within 30 days to keep your circles{'\u00a0'}awake.</span>
          <Button variant="secondary" icon={<Icon name="card" size={16} />} onClick={() => api.setRoute('ppp-card')}>Update payment card</Button>
        </div>
      )}
      {st.status !== 'failed' && <div className="ppp-pair">
        <Button variant="secondary" full icon={<Icon name="card" size={16} />} onClick={() => api.setRoute('ppp-card')}>Update payment card</Button>
        {canSwitch && <Button variant="secondary" full onClick={() => A.set({ sheet: 'switch' })}>{'Switch to ' + pppOther(st.plan)}</Button>}
        {pending && <Button variant="secondary" full onClick={() => A.set({ pending: null })}>{'Keep ' + st.plan}</Button>}
        {st.status === 'ending' && <Button variant="secondary" full onClick={resume}>Resume subscription</Button>}
      </div>}
      <div className="ppp-foot-wrap"><p className="ppp-card-foot ppp-foot"><span>Billed to {user ? user.email : 'your account'}</span><span>Card ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span></span></p></div>
      {st.status !== 'ending' && <div className="ppp-end"><Button variant="tertiary" style={{ color: 'var(--color-destructive)', paddingLeft: 0, paddingRight: 0 }} onClick={() => A.set({ sheet: 'cancel' })}>Cancel subscription</Button></div>}
    </div>
  );
};

// Switch overlay: before and after (Switch board 02.1, centred; ratified 2 Oct).
// The plan now, an arrow, the plan you move to with the date it starts, on a
// sunken panel with no row rules so it doesn't repeat the card behind it.
const PppSwitchSheet = ({ st }) => {
  const A = window.CircPPP; const cur = PPP_PLANS[st.plan]; const to = PPP_PLANS[pppOther(st.plan)];
  const close = () => A.set({ sheet: null });
  const trial = st.status === 'trial';
  const go = () => A.set(trial ? { plan: to.id, sheet: null } : { pending: to.id, sheet: null });
  const cell = (k, plan, on) => (
    <div className={'ppp-ba-cell' + (on ? ' ppp-ba-on' : '')}>
      <div className="ppp-ba-k">{k}</div>
      <div className="ppp-ba-plan">{plan.label}</div>
      <div className="ppp-ba-price">{pppNb(plan.a)}</div>
    </div>
  );
  return (
    <PppOverlay title={'Switch to ' + to.id + '?'} onClose={close} actions={[
      { label: 'Switch to ' + to.id, variant: 'primary', onClick: go },
      { label: 'Cancel', variant: 'secondary', onClick: close },
    ]}>
      <div className="ppp-ba">
        {cell('Now', cur)}
        <span className="ppp-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
        {cell(pppNb('From ' + pppDay(trial ? PPP_TRIAL_DAYS : PPP_RENEW_DAYS, true)), to, true)}
      </div>
    </PppOverlay>
  );
};

const PppCancelSheet = ({ st }) => {
  const A = window.CircPPP; const close = () => A.set({ sheet: null });
  // Board pg-cancel-sheet 02.4 (Joe, 2 Oct): the Switch overlay's before-and-after
  // panel, then one line that names the circles.
  const trial = st.status === 'trial';
  const n = trial ? PPP_TRIAL_DAYS : PPP_RENEW_DAYS;
  const cxCell = (k, a, b, on) => (
    <div className={'ppp-ba-cell' + (on ? ' ppp-ba-on' : '')}>
      <div className="ppp-ba-k">{k}</div><div className="ppp-ba-plan">{a}</div><div className="ppp-ba-price">{b}</div>
    </div>
  );
  return (
    <PppOverlay title="Cancel your subscription?" onClose={close} actions={[
      { label: 'Cancel subscription', variant: 'destructive', onClick: () => A.set({ status: 'ending', wasTrial: st.status === 'trial', pending: null, sheet: null }) },
      { label: 'Keep subscription', variant: 'secondary', onClick: close },
    ]}>
      <div className="ppp-ba">
        {cxCell('Now', trial ? 'Free month' : PPP_PLANS[st.plan].label, trial ? '\u00a30' : pppNb(PPP_PLANS[st.plan].a))}
        <span className="ppp-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
        {cxCell(pppNb('From ' + pppDay(n, true)), 'Asleep', pppNb('Nothing charged'), true)}
      </div>
      <p className="ppp-overlay-body ppp-cx-line">Your circles go to sleep. Everything in them stays, and any member can take one{'\u00a0'}over.</p>
    </PppOverlay>
  );
};

const PppAccountCard = ({ user }) => {
  const st = usePPP();
  return (
    <>
      {pppSubscribed(st) ? <PppSubscribed st={st} user={user} /> : <PppNotSubscribed st={st} />}
      {st.sheet === 'switch' && pppSubscribed(st) && <PppSwitchSheet st={st} />}
      {st.sheet === 'cancel' && pppSubscribed(st) && <PppCancelSheet st={st} />}
    </>
  );
};
window.PppAccountCard = PppAccountCard;
