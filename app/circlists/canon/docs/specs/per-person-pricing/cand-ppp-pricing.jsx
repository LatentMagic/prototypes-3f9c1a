// ============================================================================
// Per-person pricing candidate — the subscription page (/subscribe) and its
// checkout. One screen, two states keyed only on whether the person has had the
// free month. Serves Create, take-over and Account; subscribers never see it.
//   Board 01.2 (pg-subscribe-phone, ratified 2 Oct), one centred column at every
//   width: Save £10 pill, receipt rows, centred ticks, cancel date under the
//   button, heading scaled to the page.
// ============================================================================
const PPP_LEDE = 'Joining circles is free. Subscribe to run your own.';
const PPP_BULLETS = ['Start as many circles as you like', 'Everyone you invite joins free'];

const pppKeep = (s) => String(s).replace(/ /g, '\u00a0');
const PppPill = ({ children }) => <span className="ppp-pill">{children}</span>;

// P2: white card; picked = 2px accent border, green pill stays green.
const PppPlanCard = ({ plan, on, onPick, still }) => {
  const p = PPP_PLANS[plan];
  const inner = (
    <>
      {!still && <span aria-hidden className={'ppp-radio' + (on ? ' ppp-radio-on' : '')} />}
      <span className="ppp-plan-name">
        <span>{p.label}</span>
        {plan === 'yearly' && <span><PppPill>Save {'\u00a3'}10</PppPill></span>}
      </span>
      <span className="ppp-plan-price">{p.price}<span className="ppp-plan-unit"> / {p.unit}</span></span>
    </>
  );
  if (still) return <div className="ppp-plan ppp-plan-on">{inner}</div>;
  return (
    <button type="button" role="radio" aria-checked={on} onClick={() => onPick(plan)} className={'ppp-plan' + (on ? ' ppp-plan-on' : '')}>{inner}</button>
  );
};

const PppCheck = ({ children }) => (
  <div className="ppp-bullet"><span className="ppp-bullet-tick"><Icon name="check" size={18} /></span><span>{children}</span></div>
);

const PricingScreen = ({ ctxOverride }) => {
  const st = usePPP(); const api = pppApi();
  const ctx = st.ctx || ctxOverride || { from: 'account' };
  const used = st.usedFreeMonth;
  const p = PPP_PLANS[st.pick];
  // Take-over and resubscribing start in one circle, so closing returns to it (asleep).
  const back = (ctx.from === 'takeover' || ctx.from === 'resubscribe') && ctx.spaceId;
  const close = () => { window.CircPPP.set({ ctx: null }); if (back) api.enterSpace(ctx.spaceId); else api.goHome(); };
  const go = () => { window.CircPPP.set({ ctx }); api.setRoute('ppp-checkout'); };
  const sub = ctx.from === 'takeover' ? ctx.name : null;
  return (
    <div className="ppp-page">
      <header className="ppp-head">
        <span style={{ width: 40 }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {sub ? <WizardSubject>{sub}</WizardSubject> : null}
        </div>
        <WizardIconBtn name="x" label="Close" onClick={close} />
      </header>
      <div className="ppp-body">
        <div className="ppp-price">
          <div className="ppp-a-head">
            <h1 className="ppp-title">{used ? 'Start your subscription' : 'Start your free month'}</h1>
            <p className="ppp-lede ppp-lede-ph"><span>{pppKeep('Subscribe to run your own circles.')}</span></p>
          </div>
          <div className="ppp-a-decide">
            <div role="radiogroup" aria-label="Plan" className="ppp-plans">
              {['yearly', 'monthly'].map((id) => <PppPlanCard key={id} plan={id} on={st.pick === id} onPick={(v) => window.CircPPP.set({ pick: v })} />)}
            </div>
            <div className="ppp-receipt">
              {(used
                ? [['Due today', p.full], ['Renews', st.pick === 'yearly' ? pppYearOn() : pppMonthOn()]]
                : [['Due today', '\u00a30.00'], ['From ' + pppDay(30), p.a]]
              ).map(([k, v]) => <div key={k} className="ppp-row"><span className="ppp-row-k">{k}</span><span className="ppp-row-v">{pppKeep(v)}</span></div>)}
            </div>
          </div>
          <div className="ppp-a-gets">
            <div className="ppp-bullets">{PPP_BULLETS.map((b) => <PppCheck key={b}>{b}</PppCheck>)}</div>
          </div>
          <div className="ppp-a-act">
            <Button variant="primary" size="lg" full onClick={go}>{used ? 'Subscribe' : 'Start free month'}</Button>
            {!used && <p className="ppp-cancel-by">{'Cancel before ' + pppKeep(pppDay(30)) + ' and pay\u00a0nothing.'}</p>}
            <div className="ppp-billed"><Icon name="lock" size={13} style={{ flex: 'none' }} /><span>Billed to {api.user ? api.user.email : 'your account'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// The provider stand-in, priced for one person's subscription.
const PppCheckout = () => {
  const st = usePPP(); const api = pppApi();
  const ctx = st.ctx || { from: 'account' };
  const p = PPP_PLANS[st.pick];
  const used = st.usedFreeMonth;
  const offer = used
    ? { lead: 'Circlists \u00b7 ' + p.label + ' plan', price: p.full, per: 'due today', note: 'Then ' + p.full + ' a ' + p.unit + ' from ' + (p.id === 'yearly' ? pppYearOn() : pppMonthOn()) + '.', button: 'Pay and subscribe' }
    : { lead: 'Circlists \u00b7 ' + p.label + ' plan', price: '\u00a30.00', per: 'due today', note: 'Free for 30 days. Then ' + p.full + ' a ' + p.unit + ' from ' + pppDay(30) + '. We email a reminder a week before.', button: 'Start free month' };
  const done = () => {
    window.CircPPP.set({ status: used ? 'active' : 'trial', plan: st.pick, pending: null, usedFreeMonth: true });
    api.setSpaces((prev) => {
      let next = pppWakeMine(prev);
      if (ctx.from === 'takeover' && ctx.spaceId) next = next.map((s) => (s.id === ctx.spaceId
        ? { ...s, funded: true, dormancy: null, funding: null, openUntil: null, champion: 'You', championEmail: api.user.email } : s));
      return next;
    });
    if (ctx.from === 'create') { window.CircPPP.set({ ctx: { ...ctx, paid: true } }); api.setRoute('create-space'); return; }
    window.CircPPP.set({ ctx: null });
    // Take-over and resubscribing land in the circle they started from, now awake.
    if ((ctx.from === 'takeover' || ctx.from === 'resubscribe') && ctx.spaceId) { api.setTab('active'); api.enterSpace(ctx.spaceId); return; }
    api.goHome();
  };
  return <Checkout user={api.user} offer={offer} onSuccess={done} onCancel={() => api.setRoute('subscribe')} />;
};

// Update card: the provider's own page, then straight back to Account.
const PppCardPage = () => {
  const api = pppApi();
  const [card, setCard] = React.useState('');
  const back = () => api.setRoute('account');
  const save = (e) => { e.preventDefault(); const s = window.CircPPP.get(); if (s.status === 'failed') window.CircPPP.set({ status: 'active' }); back(); };
  const inp = { width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-mono)', fontSize: 16, color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px', minHeight: 46, marginBottom: 8 };
  return (
    <ProviderShell merchant={'Circlists \u00b7 Billing'}>
      <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', marginBottom: 4 }}>Update your card</div>
      <div style={{ fontWeight: 500, fontSize: 13, color: '#64748b', marginBottom: 18 }}>{api.user ? api.user.email : ''}</div>
      <form onSubmit={save}>
        <input style={inp} inputMode="numeric" placeholder="1234 1234 1234 1234" value={card} onChange={(e) => setCard(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}><input style={inp} placeholder="MM / YY" /><input style={inp} placeholder="CVC" /></div>
        <button type="submit" style={{ width: '100%', minHeight: 48, border: 0, borderRadius: 8, cursor: 'pointer', background: '#047857', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15 }}>Save card</button>
      </form>
      <button onClick={back} style={{ width: '100%', marginTop: 14, background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: '#64748b', minHeight: 36 }}>Cancel and return</button>
    </ProviderShell>
  );
};

// App posture, mobile payments off: subscribing happens on the web.
const PppWebHandoff = () => {
  const api = pppApi();
  return <CalmPage title="Subscriptions start on the web." body="Open Circlists in a browser to subscribe." actionLabel="Back to your circles" onAction={() => { window.CircPPP.set({ ctx: null }); api.goHome(); }} />;
};

Object.assign(window, { PPP_LEDE, PPP_BULLETS, PricingScreen, PppCheckout, PppCardPage, PppWebHandoff, PppPlanCard, PppPill });
