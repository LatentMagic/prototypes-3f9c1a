// ============================================================================
// LM-652 candidate — assembly. Publishes window.CircCandidate, the ONE handle
// app/main.jsx reads (per render, droppable — delete the cand-* files and this
// entry's script tags and the app is exactly the shipped app again).
//   bind(api)        — main.jsx hands its per-render API bridge over.
//   goToCard(item)   — the one way into a card's conversation surface: stamps
//                      the card seen (talkSeenAt) and routes to it.
//   matchRoute/renderRoute — the surface, as an in-shell route ('card:<id>'),
//                      reached and left the way circle settings is.
//   CardRow / FeedLead — the feed's discourse skin + the return banner.
// Loads LAST among the cand-* files, still before app/main.jsx.
// ============================================================================
window.CircCandidate = {
  api: null,
  bind(api) { this.api = api; },
  goToCard(item) {
    const api = this.api;
    if (!api || !item) return;
    candUpdateItem(api, item.id, i => ({ ...i, talkSeenAt: Date.now() }));
    api.setRoute('card:' + item.id);
  },
  matchRoute: (r) => typeof r === 'string' && r.slice(0, 5) === 'card:',
  renderRoute: (r, api) => ({
    body: <CandSurfaceRoute api={api} itemId={r.slice(5)} />,
    opts: { subView: { title: 'Conversation', onBack: api.returnToSpace } },
  }),
  CardRow: window.CandCardRow,
  FeedLead: window.CandFeedLead,
};
