// The Switch plan overlay: three leaner treatments beside the candidate's own
// (00, PppSwitchSheet mounted). Every option uses the candidate's PppOverlay, so
// the sheet and modal patterns are the real ones; PppOverlayFrame pins the
// pattern per frame and stops the overlay taking focus. The Account card sits
// behind each scrim, mounted, so the overlay is seen over what opened it.
const PG_SW_USER = { email: 'sam@example.com' };
const pgSwSt = (status, plan) => ({ ...PPP_DEFAULT, status, plan, pending: null, sheet: null });
const noop = () => {};

const pgSw = (st) => {
  const cur = PPP_PLANS[st.plan]; const to = PPP_PLANS[pppOther(st.plan)];
  const trial = st.status === 'trial';
  const date = pppNb(pppDay(trial ? PPP_TRIAL_DAYS : PPP_RENEW_DAYS));
  return { cur, to, trial, date, title: 'Switch to ' + to.id + '?',
    actions: [{ label: 'Switch to ' + to.id, variant: 'primary', onClick: noop }, { label: 'Cancel', variant: 'secondary', onClick: noop }] };
};

// 01 One sentence: the new price and when it starts. Nothing else.
const PgSw1 = ({ st }) => {
  const s = pgSw(st);
  return (
    <PppOverlay title={s.title} onClose={noop} actions={s.actions}>
      <p className="ppp-overlay-body">{pppNb(s.to.a) + (s.trial ? ' once your free month ends, on ' : ' from your next renewal, on ') + s.date + '.'}</p>
    </PppOverlay>
  );
};

// 02 The card's own rows: the overlay previews exactly what the Account card
// will say once you confirm.
const PgSw2 = ({ st }) => {
  const s = pgSw(st);
  const rows = s.trial
    ? [['Plan', s.to.label + ' \u00b7 ' + pppNb(s.to.a)], ['First payment', s.to.price + ' on ' + s.date]]
    : [['Plan', s.cur.label + ' \u00b7 ' + pppNb(s.cur.a)], ['From ' + s.date, s.to.label + ' \u00b7 ' + pppNb(s.to.a)]];
  return (
    <PppOverlay title={s.title} onClose={noop} actions={s.actions}>
      <div className="ppp-rows pg-sw-rows">{rows.map(([k, v]) => <div key={k} className="ppp-row"><span className="ppp-row-k">{k}</span><span className="ppp-row-v">{v}</span></div>)}</div>
    </PppOverlay>
  );
};

// 02.1 Before and after: the change drawn as a move from one plan to the other,
// on a sunken panel with no hairlines, so it can't be mistaken for the card behind.
const PgSw2b = ({ st, v }) => {
  const s = pgSw(st);
  const cell = (k, plan, on) => (
    <div className={'pg-ba-cell' + (on ? ' pg-ba-on' : '')}>
      <div className="pg-ba-k">{k}</div>
      <div className="pg-ba-plan">{plan.label}</div>
      <div className="pg-ba-price">{pppNb(plan.a)}</div>
    </div>
  );
  return (
    <PppOverlay title={s.title} onClose={noop} actions={s.actions}>
      <div className={'pg-ba' + (v ? ' pg-ba-' + v : '')}>
        {cell('Now', s.cur)}
        <span className="pg-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
        {cell(pppNb('From ' + pppDay(s.trial ? PPP_TRIAL_DAYS : PPP_RENEW_DAYS, true)), s.to, true)}
      </div>
    </PppOverlay>
  );
};

// 04 No confirm. Switch acts at once; the card shows the change and Keep <plan>
// undoes it. Live: all three frames share one store, so a press shows in each.
const PgSw4 = () => {
  const st = usePPP();
  React.useEffect(() => {
    if (st.sheet !== 'switch') return;
    const to = pppOther(st.plan);
    window.CircPPP.set(st.status === 'trial' ? { plan: to, sheet: null } : { pending: to, sheet: null });
  }, [st.sheet]);
  return <PppSubscribed st={{ ...st, sheet: null }} user={PG_SW_USER} />;
};

// A frame that holds a fixed overlay: the transform makes it the containing block.
const PgOvFrame = ({ cap, width, height, sheet, st, children }) => (
  <div style={{ width, maxWidth: '100%' }}>
    <div className="pg-cap">{cap}</div>
    <div className="pg-frame pg-frame-pad pg-ov-frame" data-circ-posture={sheet ? 'mobile' : 'desktop'} style={{ width, height }}>
      <PppSubscribed st={st} user={PG_SW_USER} />
      <PppOverlayFrame.Provider value={{ sheet }}>{children}</PppOverlayFrame.Provider>
    </div>
  </div>
);
const PgSwWidths = ({ st, render }) => (
  <>
    <PgOvFrame cap="Phone · 320 · bottom sheet" width={320} height={640} sheet st={st}>{render()}</PgOvFrame>
    <PgOvFrame cap="Phone · 390 · bottom sheet" width={390} height={640} sheet st={st}>{render()}</PgOvFrame>
    <PgOvFrame cap="Desktop · centred modal" width={720} height={520} sheet={false} st={st}>{render()}</PgOvFrame>
  </>
);

const PgSwitchBoard = () => {
  const [plan, setPlan] = usePgSaved('pg_ppp_switch_plan_v1', 'monthly');
  const [status, setStatus] = usePgSaved('pg_ppp_switch_status_v1', 'active');
  const st = pgSwSt(status, plan);
  React.useLayoutEffect(() => { window.CircPPP.reset(pgSwSt(status, plan)); }, [status, plan]);
  return (
    <PgBoard eyebrow="Per-person pricing · option board" title="The Switch plan overlay"
      lede="Opened from Switch to a plan on the Account card. Each overlay is shown as the bottom sheet at 320 and 390 and as the centred modal on desktop, over the real card. Options 01 to 02.1 drop the plan card, the pill and the quiet line, and use the house confirm buttons: Switch to <plan> and Cancel, no close button. 04 asks whether the overlay should exist at all."
      controls={<>
        <PgSeg label="Plan now" value={plan} options={[['monthly', 'Monthly, switching to yearly'], ['yearly', 'Yearly, switching to monthly']]} onChange={setPlan} />
        <PgSeg label="Status" value={status} options={[['active', 'Active'], ['trial', 'Free month']]} onChange={setStatus} />
      </>}>
      <PgOpt num="00" name="As built" claim="The candidate's overlay, mounted. Since 2 Oct this is 02.1 (ratified, built). Before that it was a highlighted plan card with the pill, a sentence with both prices, a grey line, and Yes, switch to <plan> / Keep <plan>.">
        <PgSwWidths st={st} render={() => <PppSwitchSheet st={st} />} />
      </PgOpt>
      <PgOpt num="01" name="One sentence" claim="One sentence: the new price and when it starts. The old price is left to the card behind."
        cost="The saving on yearly is not stated. It is on the subscription page, where the plan was first chosen.">
        <PgSwWidths st={st} render={() => <PgSw1 st={st} />} />
      </PgOpt>
      <PgOpt num="02" name="The card's own rows" claim="Two rows in the Account card's style, showing what the card will say once you confirm: Plan and From <date> (or Plan and First payment on a free month)."
        cost="It reads as state, not a change: only From says something moves. The same rows sit in the card behind the scrim, so the overlay repeats what it covers.">
        <PgSwWidths st={st} render={() => <PgSw2 st={st} />} />
      </PgOpt>
      <PgOpt num="02.1" name="Before and after" claim="The change as a move: the plan you have now, an arrow, and the plan you move to with the date it starts. Each half is centred in its own half of a sunken panel, so the space is even either side of each and of the arrow. No hairlines, so it does not repeat the card rows behind it. The same panel on a free month, because the new price still starts on that date."
        cost="A new shape in the house vocabulary, used only here. The date is short (20 Oct) so both halves fit at 320.">
        <PgSwWidths st={st} render={() => <PgSw2b st={st} />} />
      </PgOpt>
      <PgOpt num="04" name="No confirm" claim="No overlay. Switch to <plan> changes the card at once: a From <date> row appears and Keep <plan> takes Switch's place to undo it. Nothing is charged until the renewal, so per ui-design.md the undo stands in for a confirm. Press Switch in any frame; the three frames share one card. Change a control above to reset."
        cost="A one-tap change to what you pay, with no pause. On a free month the plan changes outright, so there is no From row and no Keep <plan>; the undo is pressing Switch again.">
        <PgFrame cap="Phone · 320" width={320} pad><PgSw4 /></PgFrame>
        <PgFrame cap="Phone · 390" width={390} pad><PgSw4 /></PgFrame>
        <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad><PgSw4 /></PgFrame>
      </PgOpt>
    </PgBoard>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgSwitchBoard />);
