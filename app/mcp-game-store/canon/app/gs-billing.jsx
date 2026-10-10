// ============================================================================
// [Platform] — the Pass (circlists-match-2): dates and prices, the Pass card in
// every state, Switch and Cancel sheets, the buying block, checkout, and the
// update-card page. Every price is "£—"; the trial is 14 days.
// ============================================================================
const GS_NB = '\u00A0';
const GS_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const GS_DAY0 = new Date(2026, 9, 6); // the demo's today, matching GS.today
const GS_TRIAL_DAYS = 14;
const gsAddDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const gsAddMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
const gsLong = (d) => [d.getDate(), GS_MONTHS[d.getMonth()], d.getFullYear()].join(GS_NB);
const gsShort = (d) => d.getDate() + GS_NB + GS_MONTHS[d.getMonth()].slice(0, 3);
const gsNb = (s) => s.replace(/ /g, GS_NB);
const GS_PLAN = {
  monthly: { name: 'Monthly', price: gsNb('£— a month'), per: gsNb('£— / month'), months: 1 },
  yearly: { name: 'Yearly', price: gsNb('£— a year'), per: gsNb('£— / year'), months: 12 },
};
const gsOther = (plan) => (plan === 'yearly' ? 'monthly' : 'yearly');
// The date that matters for a subscription: next renewal, first payment, or end.
const gsSubDate = (sub) => {
  if (sub.renew) return new Date(sub.renew);
  if (sub.status === 'free' || (sub.status === 'ending' && sub.fromFree)) return gsAddDays(GS_DAY0, GS_TRIAL_DAYS);
  return sub.plan === 'yearly' ? new Date(2027, 8, 18) : new Date(2026, 9, 18);
};
const GS_LAPSED_ON = new Date(2026, 8, 18);
const GS_SUB_HOLDS = ['free', 'active', 'failed', 'ending'];

// ---- Shared bits ------------------------------------------------------------------
const GsRows = ({ rows }) => (
  <dl className="gs-rows-dl">
    {rows.map(([k, v]) => <div key={k} className="gs-row-kv"><dt className="gs-muted">{k}</dt><dd className="gs-num-text">{v}</dd></div>)}
  </dl>
);
// Two actions: stacked with the primary first on a phone, one row (secondary left) wider.
const GsActs = ({ children }) => <div className="gs-acts">{children}</div>;
// A plain heading for a pop-up (the system's title renders as h3).
const GsPopTitle = ({ children }) => <h2 className="mcp-t-card">{children}</h2>;

// ---- The Pass card: the same card on the Account page and the Pass page ----------
// What a player keeps and what freezes when a Pass ends (cancel flow, ending and lapsed cards, Pass page).
const GsKeepLock = ({ lead, locked }) => (
  <div className="gs-stack-sm">
    <p>{lead}</p>
    <p><b>You keep</b> your results, your History and the achievements you earned.</p>
    <p><b>What freezes:</b> the Pass-only games and editions, and the achievements earned in them. They {locked}.</p>
  </div>
);
// A change to the Pass that did not go through (Config "Pass changes: Fail"). The card stays as it was.
const gsPassFails = (gs) => !!(gs.review && gs.review.passFail);
const GsPassCard = () => {
  const gs = useGs();
  const { sub } = gs;
  const [sheet, setSheet] = React.useState(gs.route.sheet || null); // 'switch' | 'cancel'
  const [busy, run] = useGsBusy();
  const [failed, setFailed] = React.useState(null); // 'resume' | 'keep'
  // After a change, focus moves to the control that undoes it (never the page root), and the change is announced.
  const want = React.useRef(null);
  React.useEffect(() => {
    const k = want.current; if (!k) return;
    want.current = null;
    const el = document.querySelector('[data-gs-focus="' + k + '"]');
    if (el) el.focus({ preventScroll: true });
  });
  const done = (k, msg) => { want.current = k; gsAnnounce(msg); };
  const date = gsLong(gsSubDate(sub));
  const plan = GS_PLAN[sub.plan];
  const other = gsOther(sub.plan);
  const card = { gap: 16, justifyItems: 'stretch', alignContent: 'start' };
  const update = <DS.Button variant="secondary" onClick={() => gs.go('update-card')}><GsGlyph name="card" />Update payment card</DS.Button>;
  if (!GS_SUB_HOLDS.includes(sub.status)) return (
    <DS.Card style={card}>
      <h2 className="mcp-t-card">Pass</h2>
      {sub.freeUsed
        ? <GsKeepLock lead={<>Your Pass ended on {gsLong(sub.endedOn ? new Date(sub.endedOn) : GS_LAPSED_ON)}.</>} locked="are frozen until you get the Pass again" />
        : <p>You have a free account. Free play needs no card, and your results and History are kept. The Pass opens every game in full.</p>}
      <div className="gs-card-acts"><DS.Button data-gs-focus="getpass" variant="secondary" onClick={() => gs.go('pass')}>{sub.freeUsed ? 'Get the Pass again' : 'Get the Pass'}</DS.Button></div>
    </DS.Card>
  );
  const marker = sub.status === 'failed' ? <span className="gs-marker is-bad">Payment failed</span>
    : sub.status === 'ending' ? <span className="gs-marker">Ending</span>
    : <span className="gs-marker"><DS.Icon name="check" />Active</span>;
  let rows = [['Plan', plan.name + ' · ' + plan.price]];
  let body = null;
  if (sub.status === 'active' || sub.status === 'free') {
    rows.push([sub.status === 'free' ? 'First payment' : 'Next renewal', date]);
    if (sub.pending) rows.push(['From ' + date, GS_PLAN[sub.pending].name + ' · ' + GS_PLAN[sub.pending].price]);
    body = (
      <div className="gs-stack-sm">
        <div className="gs-pair-even">
          {update}
          {sub.pending
            ? <DS.Button data-gs-focus="keep" variant="secondary" loading={busy} onClick={() => { setFailed(null); run(() => { if (gsPassFails(gs)) { setFailed('keep'); return; } done('switch', 'Your switch is undone. You stay on ' + plan.name.toLowerCase() + '.'); gs.setSub({ pending: null }); }); }}>Keep {plan.name.toLowerCase()}</DS.Button>
            : <DS.Button data-gs-focus="switch" variant="secondary" onClick={() => setSheet('switch')}>Switch to {other}</DS.Button>}
        </div>
        {failed === 'keep' && sub.pending && <GsXLine>Your switch to {sub.pending} is still set. Try again.</GsXLine>}
      </div>
    );
  } else if (sub.status === 'failed') {
    // A pending switch stays on the card with its date; there is no switch or keep control while the payment has failed (MCPG-015 AF-07).
    if (sub.pending) rows.push(['From ' + date, GS_PLAN[sub.pending].name + ' · ' + GS_PLAN[sub.pending].price]);
    body = <div className="gs-line-act"><p>Update the card within 30 days to keep your Pass.</p>{update}</div>;
  } else {
    rows.push(['Ends on', date]);
    body = (
      <div className="gs-stack-md">
        <GsKeepLock lead={<>Your Pass ends on that date. You can resume any time before then.</>} locked="freeze when it ends" />
        <div className="gs-pair-even">
          {update}
          <DS.Button data-gs-focus="resume" variant="secondary" loading={busy} onClick={() => { setFailed(null); run(() => { if (gsPassFails(gs)) { setFailed('resume'); return; } done('cancel', 'Your subscription is resumed.'); gs.setSub({ status: sub.fromFree ? 'free' : 'active', fromFree: false }); }); }}>Resume subscription</DS.Button>
        </div>
        {failed === 'resume' && <GsXLine>Your subscription wasn’t resumed. Try again.</GsXLine>}
      </div>
    );
  }
  return (
    <DS.Card style={card}>
      <div className="gs-title-row"><h2 className="mcp-t-card">Pass</h2>{marker}</div>
      <GsRows rows={rows} />
      {body}
      <div className="gs-card-foot gs-small"><span>Billed to {gs.user.email}</span><span>Card ending 4242</span></div>
      {sub.status !== 'ending' && <>
        <div className="gs-rule" />
        <div><DS.TextLink data-gs-focus="cancel" danger onClick={() => setSheet('cancel')}>Cancel subscription</DS.TextLink></div>
      </>}
      <GsSwitchSheet open={sheet === 'switch'} onClose={() => setSheet(null)} onDone={done} />
      <GsCancelSheet open={sheet === 'cancel'} onClose={() => setSheet(null)} onDone={done} />
    </DS.Card>
  );
};

// Before and after, on a sunken surface with an arrow between.
const GsBeforeAfter = ({ now, then }) => (
  <div className="gs-ba">
    <div className="gs-ba-side">{now.map((l, i) => <span key={i} className={i === 0 ? 'gs-small' : i === 1 ? 'gs-strong' : 'gs-num-text'}>{l}</span>)}</div>
    <GsGlyph name="arrow" />
    <div className="gs-ba-side is-hi">{then.map((l, i) => <span key={i} className={i === 0 ? 'gs-small' : i === 1 ? 'gs-strong' : 'gs-num-text'}>{l}</span>)}</div>
  </div>
);
const GsSwitchSheet = ({ open, onClose, onDone }) => {
  const gs = useGs();
  const { sub } = gs;
  const to = gsOther(sub.plan);
  const last = React.useRef(null);
  if (open) last.current = { from: sub.plan, to, date: gsShort(gsSubDate(sub)), long: gsLong(gsSubDate(sub)), trial: sub.status === 'free' };
  const p = last.current || { from: sub.plan, to, date: '', long: '', trial: false };
  const [busy, run, cancel] = useGsBusy();
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { if (open) setFailed(false); }, [open]);
  const close = () => { cancel(); onClose(); };
  const go = () => { setFailed(false); run(() => {
    if (gsPassFails(gs)) { setFailed(true); return; }
    // In the trial the switch applies at once and the first payment keeps its date (MCPG-015 AF-05).
    if (sub.status === 'free') { onDone && onDone('switch', 'You’re now on ' + p.to + '. Your first payment is still on ' + p.long + '.'); gs.setSub({ plan: p.to, pending: null }); }
    else { onDone && onDone('keep', 'You switch to ' + p.to + ' from ' + p.long + '.'); gs.setSub({ pending: p.to }); }
    onClose();
  }); };
  return (
    <DS.Popup open={open} onClose={close} posture="window" label={'Switch to ' + p.to + '?'}>
      <GsPopTitle>Switch to {p.to}?</GsPopTitle>
      <GsBeforeAfter now={['Now', GS_PLAN[p.from].name, GS_PLAN[p.from].price]} then={[p.trial ? 'From today' : 'From ' + p.date, GS_PLAN[p.to].name, GS_PLAN[p.to].price]} />
      <p>{p.trial ? 'Nothing is paid now. Your first payment is still on ' + p.long + ', at the ' + p.to + ' price.' : 'Nothing is paid now.'}</p>
      {failed && <GsXLine>Your plan wasn’t switched. Try again.</GsXLine>}
      <GsActs>
        <DS.Button variant="secondary" onClick={close}>Cancel</DS.Button>
        <DS.Button onClick={go} loading={busy}>Switch to {p.to}</DS.Button>
      </GsActs>
    </DS.Popup>
  );
};
const GsCancelSheet = ({ open, onClose, onDone }) => {
  const gs = useGs();
  const { sub } = gs;
  const last = React.useRef(null);
  if (open) last.current = { free: sub.status === 'free', failed: sub.status === 'failed', plan: sub.plan, date: gsShort(gsSubDate(sub)), long: gsLong(gsSubDate(sub)) };
  const p = last.current || { free: false, failed: false, plan: sub.plan, date: '' };
  const now = p.free ? ['Now', 'Trial', '£0'] : ['Now', GS_PLAN[p.plan].name, GS_PLAN[p.plan].price];
  const [busy, run, cancel] = useGsBusy();
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { if (open) setFailed(false); }, [open]);
  const close = () => { cancel(); onClose(); };
  // While the payment has failed there is nothing left to run out: the Pass ends today, and the card is the ended one.
  const go = () => { setFailed(false); run(() => {
    if (gsPassFails(gs)) { setFailed(true); return; }
    if (p.failed) { onDone && onDone('getpass', 'Your subscription is cancelled. Your Pass has ended.'); gs.setSub({ status: 'none', pending: null, freeUsed: true, endedOn: GS_DAY0.getTime() }); }
    else { onDone && onDone('resume', 'Your subscription is cancelled. Your Pass ends on ' + p.long + '.'); gs.setSub({ status: 'ending', pending: null, fromFree: p.free }); }
    onClose();
  }); };
  return (
    <DS.Popup open={open} onClose={close} posture="window" label="Cancel your subscription?">
      <GsPopTitle>Cancel your subscription?</GsPopTitle>
      <GsBeforeAfter now={now} then={[p.failed ? 'Today' : 'From ' + p.date, 'Ends', 'Nothing charged']} />
      <GsKeepLock lead={p.failed ? 'Your Pass ends today.' : 'You keep the Pass until it ends.'} locked="freeze when it ends, and carry on if the Pass returns" />
      {failed && <GsXLine>Your subscription wasn’t cancelled. Try again.</GsXLine>}
      <GsActs>
        <DS.Button variant="secondary" onClick={close}>Keep subscription</DS.Button>
        <DS.Button variant="danger" onClick={go} loading={busy}>Cancel subscription</DS.Button>
      </GsActs>
    </DS.Popup>
  );
};

// ---- Pass page buying block ----------------------------------------------------
const GsBuyBlock = () => {
  const gs = useGs();
  const free = !gs.sub.freeUsed;
  const plan = GS_PLAN[gs.choice];
  const freeEnd = gsLong(gsAddDays(GS_DAY0, GS_TRIAL_DAYS));
  const renews = gsLong(gsAddMonths(GS_DAY0, plan.months));
  return (
    <section className="gs-buy-block" aria-labelledby="gs-buy-h">
      <div className="gs-stack-sm gs-buy-head">
        <h2 id="gs-buy-h" className="mcp-t-sec">{free ? 'Start your 14-day trial' : 'Start your Pass'}</h2>
        <p className="gs-muted">Choose how you pay.</p>
      </div>
      <fieldset className="gs-plans">
        <legend className="gs-vh">Plan</legend>
        {['yearly', 'monthly'].map((k) => (
          <label key={k} className={'gs-plan' + (gs.choice === k ? ' is-on' : '')}>
            <input type="radio" name="gs-plan" value={k} checked={gs.choice === k} onChange={() => gs.setChoice(k)} />
            <span className="gs-plan-dot" aria-hidden="true" />
            <span className="gs-plan-name">{GS_PLAN[k].name}</span>
            {k === 'yearly' && <DS.Tag kind="success">{gsNb('£— a month')}</DS.Tag>}
            <span className="gs-plan-price gs-num-text">{GS_PLAN[k].per}</span>
          </label>
        ))}
      </fieldset>
      <GsRows rows={free
        ? [['Due today', '£0.00'], ['From ' + freeEnd, plan.price]]
        : [['Due today', '£—'], ['Renews', renews]]} />
      <DS.Button block onClick={gs.getPass}>{free ? 'Start 14-day trial' : 'Get the Pass'}</DS.Button>
      {free && <p className="gs-small gs-center">{'Cancel before ' + freeEnd + ' and pay nothing.'}</p>}
      <p className="gs-small gs-ico-row gs-center-row"><DS.Icon name="lock" size={16} />{gs.view === 'out' ? 'Billed to your account' : 'Billed to ' + gs.user.email}</p>
      <p className="gs-small gs-center">{GS.purchase}</p>
    </section>
  );
};

// The Pass page's own words (free-and-pass, 2026-10-09). Copy sits above the comparison table.
const GsPass = () => {
  const gs = useGs();
  const holds = gs.view === 'pass';
  const status = gs.view === 'free' ? 'You have a free account' : holds ? 'You have the Pass' : null;
  return (
    <main className="gs-wrap gs-main">
      <div className="gs-stack-md">
        <h1 className="gs-h1">[Platform] Pass</h1>
        {status && <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 24px', minHeight: 48 }}>{status && <p className="gs-status">{status}{holds && <DS.Icon name="check" />}</p>}{holds && <DS.TextLink onClick={() => gs.go('account')}>Manage in account</DS.TextLink>}</div>}
      </div>
      <GsCompare />
      {!holds && <GsBuyBlock />}
    </main>
  );
};

// ---- Payment provider (stand-in) ---------------------------------------------------
// The third party's own page. Single-card form: the inputs only format.
const GsProviderFrame = ({ merchant, children }) => (
  <div className="gs-auth">
    <main className="gs-auth-col">
      {children}
      <p className="gs-small gs-center">This is a simulated provider boundary.</p>
    </main>
  </div>
);
const gsFmt = {
  card: (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(),
  exp: (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; },
  cvc: (v) => v.replace(/\D/g, '').slice(0, 4),
};
const GsCardInputs = () => {
  const [f, setF] = React.useState({ card: '', exp: '', cvc: '' });
  const bind = (k) => ({ value: f[k], onChange: (e) => setF((s) => ({ ...s, [k]: gsFmt[k](e.target.value) })) });
  return (
    <div className="gs-stack-sm" role="group" aria-labelledby="gs-card-info">
      <span id="gs-card-info" className="gs-field-label">Card information</span>
      <div className="gs-cardin">
        <input className="mcp-in gs-num-text" inputMode="numeric" placeholder="1234 1234 1234 1234" autoComplete="cc-number" aria-label="Card number" {...bind('card')} />
        <div className="gs-cardin-row">
          <input className="mcp-in gs-num-text" inputMode="numeric" placeholder="MM / YY" autoComplete="cc-exp" aria-label="Expiry, MM / YY" {...bind('exp')} />
          <input className="mcp-in gs-num-text" inputMode="numeric" placeholder="CVC" autoComplete="cc-csc" aria-label="CVC" {...bind('cvc')} />
        </div>
      </div>
    </div>
  );
};
const GsCheckout = () => {
  const gs = useGs();
  const free = !gs.sub.freeUsed;
  const plan = GS_PLAN[gs.choice];
  const per = gs.choice === 'yearly' ? 'a year' : 'a month';
  const [paying, setPaying] = React.useState(false);
  const pay = (e) => { e.preventDefault(); if (paying) return; setPaying(true); setTimeout(() => gs.paid(free), 1400); };
  return (
    <GsProviderFrame merchant="[Platform]">
      <DS.Card style={{ gap: 24, justifyItems: 'stretch', padding: 24 }}>
        <div className="gs-stack-xs">
          <span className="gs-small">[Platform] · {plan.name} plan</span>
          <span className="gs-ico-row"><span className="gs-figure gs-num-text">{free ? '£0.00' : '£—'}</span><span className="gs-muted">due today</span></span>
          <p className="gs-small">{free
            ? <>Free for 14 days. Then {gsNb('£— ' + per)} from {gsLong(gsAddDays(GS_DAY0, GS_TRIAL_DAYS))}. The payment provider emails you a reminder before your first payment.</>
            : <>Then {gsNb('£— ' + per)} from {gsLong(gsAddMonths(GS_DAY0, plan.months))}.</>}</p>
        </div>
        <form noValidate onSubmit={pay} className="gs-stack-md">
          <DS.TextField label="Email" value={gs.user.email} readOnly />
          <GsCardInputs />
          <DS.Button type="submit" block loading={paying} loadingLabel="Processing…">{free ? 'Start 14-day trial' : 'Pay and subscribe'}</DS.Button>
        </form>
        <div className="gs-center"><DS.TextLink onClick={gs.afterCheckout}>Cancel and return</DS.TextLink></div>
      </DS.Card>
    </GsProviderFrame>
  );
};
const GsUpdateCard = () => {
  const gs = useGs();
  const [busy, run] = useGsBusy();
  const save = (e) => { e.preventDefault(); run(() => { if (gs.sub.status === 'failed') gs.setSub({ status: 'active' }); gs.go('account'); }); };
  return (
    <GsProviderFrame merchant="[Platform] · Billing">
      <DS.Card style={{ gap: 24, justifyItems: 'stretch', padding: 24 }}>
        <div className="gs-stack-xs"><h1 className="mcp-t-sec">Update your card</h1><p className="gs-muted">{gs.user.email}</p></div>
        <form noValidate onSubmit={save} className="gs-stack-md">
          <GsCardInputs />
          <DS.Button type="submit" block loading={busy}>Save card</DS.Button>
        </form>
        <div className="gs-center"><DS.TextLink onClick={() => gs.go('account')}>Cancel and return</DS.TextLink></div>
      </DS.Card>
    </GsProviderFrame>
  );
};

Object.assign(window, {
  GS_DAY0, GS_PLAN, GS_SUB_HOLDS, gsAddDays, gsAddMonths, gsLong, gsShort, gsSubDate,
  GsRows, GsActs, GsPopTitle, GsKeepLock, GsPassCard, GsSwitchSheet, GsCancelSheet, GsBuyBlock, GsPass, GsCheckout, GsUpdateCard,
});
