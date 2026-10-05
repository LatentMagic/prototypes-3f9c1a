// ============================================================================
// Per-person pricing candidate — assembly. Publishes window.CircPricing, the ONE
// handle app/ reads (main.jsx, spaces.jsx, feed.jsx, qa.jsx), per render.
// Delete this folder's cand-* files and this entry and the app is canon again.
// Loads after the app files it extends and before app/main.jsx.
// ============================================================================
let pppBooted = false;
const pppLater = (f) => setTimeout(f, 0);
// /subscribe: the page's own address, carried in the hash (a static prototype has no server routes).
const pppSyncHash = (route) => {
  try {
    const want = route === 'subscribe' ? '#/subscribe' : '';
    if ((window.location.hash || '') !== want) window.history.replaceState(null, '', window.location.pathname + window.location.search + want);
  } catch (e) {}
};

window.CircPricing = {
  api: null,
  bind(api) {
    window.__pppApi = api; this.api = api;
    if (!pppBooted) {
      pppBooted = true;
      if ((window.location.hash || '') === '#/subscribe' && api.route !== 'subscribe') {
        if (!window.CircPPP.get().ctx) window.CircPPP.set({ ctx: { from: 'account' } });
        pppLater(() => api.setRoute('subscribe'));
        return;
      }
    }
    pppLater(() => pppSyncHash(api.route));
  },
  openCreate() {
    const api = this.api; const st = window.CircPPP.get();
    if (pppSubscribed(st)) { window.CircPPP.set({ ctx: null, fixed: null }); api.setRoute('create-space'); return; }
    window.CircPPP.set({ ctx: { from: 'create' } });
    api.setRoute('subscribe');
  },
  renderRoute(route) {
    const api = this.api; const st = window.CircPPP.get();
    const blocked = api.isApp && !api.mobilePayments;
    if (route === 'subscribe' || route === 'ppp-checkout') {
      if (blocked) return { body: <PppWebHandoff /> };
      if (route === 'ppp-checkout') return { body: <PppCheckout /> };
      // Subscribers never see the pricing screen: status lives on the Account card.
      if (pppSubscribed(st)) { pppLater(() => api.setRoute('account')); return { body: null }; }
      return { body: <PricingScreen /> };
    }
    if (route === 'ppp-card') return { body: <PppCardPage /> };
    if (route === 'create-space') {
      if (!pppSubscribed(st)) return { body: blocked ? <PppWebHandoff /> : <PricingScreen ctxOverride={{ from: 'create' }} /> };
      const ff = api.fundFlow || {};
      return { body: <CreateSpace key="ppp-create" initialName={ff.name || ''} initialDescription={ff.description || ''}
        canCancel={api.spaces.length > 0}
        onCancel={() => { window.CircPPP.set({ ctx: null, fixed: null }); api.goHome(); }}
        onCreate={(name, description) => { window.CircPPP.set({ ctx: null, fixed: null }); api.setFundFlow({ mode: 'new', name, description, spaceId: null }); api.setRoute('setting-up'); }} /> };
    }
    return null;
  },
  // No dots: subscribing is the person's act, not a step of creating, and the
  // create form is one step. (Ratified by Joe, 2 Oct.)
  createFlow() { return null; },
  // Heading names the thing, button the act (board 01, ratified by Joe, 2 Oct).
  createTitle() { return 'New circle'; },
  createLabel() { return 'Create circle'; },
  // Ending / Payment failed: one line under Create circle (pg-lapsing-takeover 3, Joe 2 Oct).
  createFoot: () => <PppCreateFoot />,
  createLede: (cap) => 'A shared list for up to ' + cap + ' people. You champion it; everyone joins free.',
  copy: window.PPP_COPY,
  hideFunding: true,
  AccountCard: window.PppAccountCard,
  confirmCopy: window.PPP_CONFIRM,
};
