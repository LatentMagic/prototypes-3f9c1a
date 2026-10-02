// ============================================================================
// Per-person pricing candidate — assembly. Holds the checkout offer that
// subscriptions.jsx reads. Loads after the app
// files it re-publishes over and before app/main.jsx.
// ============================================================================
const ppCheckoutOffer = () => {
  const st = window.CircPP.get();
  const p = PP_PLANS[st.plan];
  const tk = window.__ppTkActive || null;
  const title = 'Circlists \u00b7 ' + p.label + ' plan';
  const later = 'Then ' + p.full + ' per ' + p.unit + ' from ' + ppNextDate(p.unit) + '.';
  if (tk && tk.kind === 'lapsed') {
    if (st.v7) return { title, price: p.full, per: 'due today', note: 'Starts your subscription and wakes all your circles. ' + later, button: 'Pay and subscribe' };
    return { title, price: p.full, per: 'due today', note: 'Restarts your subscription and wakes all your circles. ' + later, button: 'Pay and restart' };
  }
  if (st.returning && !st.subscribed) {
    return { title, price: p.full, per: 'due today',
      note: 'You have subscribed before, so there is no free month. ' + later,
      button: tk ? 'Pay and take over' : 'Pay and create circle' };
  }
  return {
    title,
    price: '\u00a30.00', per: 'due today',
    note: 'Free for 30 days. Then ' + p.full + ' per ' + p.unit + ' from ' + ppChargeDate() + '. We email a reminder first.',
    button: 'Start free month',
  };
};
window.ppCheckoutOffer = ppCheckoutOffer;
