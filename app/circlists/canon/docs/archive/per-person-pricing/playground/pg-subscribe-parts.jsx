// Parts for the subscription-page option boards. PgPlan / PgCheck are copies of
// cand-ppp-pricing.jsx PppPlanCard / PppCheck with a pill and sub-line slot added —
// keep in step. Everything reads `used` (free month had) and `plan` from the board.
const PG_TRIAL_END = () => pppDay(30);
const pgNb = (s) => String(s).replace(/ /g, '\u00a0');
const PgPlan = ({ plan, on, onPick, pill, sub }) => {
  const p = PPP_PLANS[plan];
  return (
    <button type="button" role="radio" aria-checked={on} onClick={() => onPick(plan)} className={'ppp-plan' + (on ? ' ppp-plan-on' : '')}>
      <span aria-hidden className={'ppp-radio' + (on ? ' ppp-radio-on' : '')} />
      <span className="ppp-plan-name"><span>{p.label}</span>{pill && <span><PppPill>{pill}</PppPill></span>}{sub && <span className="pg-plan-sub">{sub}</span>}</span>
      <span className="ppp-plan-price">{p.price}<span className="ppp-plan-unit"> / {p.unit}</span></span>
    </button>
  );
};
const PgPlans = ({ pick, setPick, pill, subs = {} }) => (
  <div role="radiogroup" aria-label="Plan" className="ppp-plans">
    {['yearly', 'monthly'].map((id) => <PgPlan key={id} plan={id} on={pick === id} onPick={setPick} pill={id === 'yearly' ? pill : null} sub={subs[id]} />)}
  </div>
);
// Desktop tile: the same plan, stood upright so two sit side by side.
const PgTile = ({ plan, on, onPick, pill }) => {
  const p = PPP_PLANS[plan];
  return (
    <button type="button" role="radio" aria-checked={on} onClick={() => onPick(plan)} className={'pg-tile' + (on ? ' ppp-plan-on' : '')}>
      <span className="pg-tile-top"><span aria-hidden className={'ppp-radio' + (on ? ' ppp-radio-on' : '')} /><span>{p.label}</span>{pill && <PppPill>{pill}</PppPill>}</span>
      <span className="ppp-plan-price">{p.price}<span className="ppp-plan-unit"> / {p.unit}</span></span>
    </button>
  );
};
const PgCheck = ({ children }) => <div className="ppp-bullet"><span className="ppp-bullet-tick"><Icon name="check" size={18} /></span><span>{children}</span></div>;
const PgBullets = ({ row, center }) => <div className={row ? 'pg-bullets-row' : 'ppp-bullets' + (center ? ' pg-bullets-c' : '')}>{PPP_BULLETS.map((b) => <PgCheck key={b}>{b}</PgCheck>)}</div>;
const PgHeadBlock = ({ used, offer, align, nb, lede }) => (
  nb ? (
  <div className="ppp-a-head" style={align ? { textAlign: align } : null}>
    <h1 className="ppp-title">{used ? 'Start your subscription' : 'Start your free month'}</h1>
    {offer}
    {lede && !used
      ? <p className="ppp-lede pg-lede-nb"><span>{pgNb(lede)}</span></p>
      : <p className="ppp-lede pg-lede-nb"><span>{pgNb('Joining circles is free.')}</span> <span>{pgNb('Subscribe to run your own.')}</span></p>}
  </div>
  ) :
  <div className="ppp-a-head" style={align ? { textAlign: align } : null}>
    <h1 className="ppp-title">{used ? 'Start your subscription' : 'Start your free month'}</h1>
    {offer}
    <p className="ppp-lede">Joining circles is free.<br />Subscribe to run your own.</p>
  </div>
);
const PgReceipt = ({ used, plan }) => {
  const p = PPP_PLANS[plan];
  const rows = used
    ? [['Due today', p.full], ['Renews', plan === 'yearly' ? pppYearOn() : pppMonthOn()]]
    : [['Due today', '\u00a30.00'], ['From ' + PG_TRIAL_END(), p.a]];
  return <div className="pg-receipt">{rows.map(([k, v]) => <div key={k} className="ppp-row"><span className="ppp-row-k">{k}</span><span className="ppp-row-v">{pgNb(v)}</span></div>)}</div>;
};
const PgTimeline = ({ used, plan }) => {
  const p = PPP_PLANS[plan];
  const steps = used
    ? [['Today', 'First payment, ' + p.price + '.'], [plan === 'yearly' ? pppYearOn() : pppMonthOn(), 'Renews at ' + p.a + '.']]
    : [['Today', 'Your free month starts. A card is needed.'], [pppDay(23), 'We email you a reminder.'], [PG_TRIAL_END(), 'First payment, ' + p.price + '. Cancel before then and pay nothing.']];
  return <ol className="pg-tl">{steps.map(([w, t]) => <li key={w}><span className="pg-tl-dot" aria-hidden /><div><div className="pg-tl-when">{w}</div><div className="pg-tl-what">{t}</div></div></li>)}</ol>;
};
const PgQuiet = ({ used, nb, noCard }) => (used ? null : noCard
  ? <p className="pg-quiet pg-quiet-nb"><span>{'Cancel before ' + pgNb(PG_TRIAL_END()) + ' and pay\u00a0nothing.'}</span></p>
  : nb
  ? <p className="pg-quiet pg-quiet-nb"><span>{pgNb('A card is needed to start.')}</span> <span>{'Cancel before ' + pgNb(PG_TRIAL_END()) + ' and pay\u00a0nothing.'}</span></p>
  : <p className="pg-quiet">A card is needed to start. Cancel before {PG_TRIAL_END()} and pay nothing.</p>);
const PgAct = ({ used, quiet = true, left, nb, noCard }) => (
  <div>
    <Button variant="primary" size="lg" full>{used ? 'Subscribe' : 'Start free month'}</Button>
    {quiet && <PgQuiet used={used} nb={nb} noCard={noCard} />}
    <div className="ppp-billed" style={left ? { justifyContent: 'flex-start' } : null}><Icon name="lock" size={13} style={{ flex: 'none' }} /><span>Billed to sam@example.com</span></div>
  </div>
);
const PgPage = ({ children }) => (
  <div className="ppp-page">
    <header className="ppp-head"><span style={{ width: 40 }} /><WizardIconBtn name="x" label="Close" onClick={() => {}} /></header>
    <div className="ppp-body">{children}</div>
  </div>
);
const PG_PAGE_STATES = [['free', 'Free month available'], ['used', 'Free month used']];
// The board's state control drives the mounted candidate page through the in-memory store too.
const usePgPageState = (key) => {
  const [s, setS] = usePgSaved(key, 'free');
  const used = s === 'used';
  const st = window.CircPPP.get();
  if (st.usedFreeMonth !== used || st.status !== 'none') window.CircPPP.set({ usedFreeMonth: used, status: 'none', ctx: null });
  const set = (v) => { window.CircPPP.set({ usedFreeMonth: v === 'used' }); setS(v); };
  return [s, set, used];
};

Object.assign(window, { PgPlan, PgPlans, PgTile, PgCheck, PgBullets, PgHeadBlock, PgReceipt, PgTimeline, PgQuiet, PgAct, PgPage, PG_PAGE_STATES, usePgPageState });
