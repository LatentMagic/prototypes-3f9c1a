// ============================================================================
// LM-652 candidate — assembly. Publishes window.CircCandidate, the ONE handle
// app/main.jsx reads (per render, droppable — delete the cand-* files and this
// entry's script tags and the app is exactly the shipped app again).
//   bind(api)        — main.jsx hands its per-render API bridge over.
//   goToCard(item)   — the one way into a card's conversation surface. It does
//                      NOT stamp the card seen: the mark has to stay where it was
//                      for the arrival wash to be read against, so the surface
//                      moves it forward when the member LEAVES.
//   matchRoute/renderRoute — the surface, as an in-shell route ('card:<id>'),
//                      reached and left the way circle settings is.
//   CardRow / FeedLead — the feed's discourse skin + the return banner.
// Loads LAST among the cand-* files, still before app/main.jsx.
// ============================================================================
// One-shot migration of the read mark. Two kinds of card carry no usable mark:
// one that has never been visited (absent), and one left behind by an earlier
// build or a QA lever that wrote 0. Both mean the same thing — there is no
// "since" yet — but neither can be read against, so words arriving later would
// never light. Both are normalised to a real timestamp at the newest words on the
// card: nothing already there is new, everything after this moment is.
const candMigrateMarks = (api) => api.setSpaces(prev => prev.map(s => ({
  ...s,
  items: s.items.map(i => {
    const talk = (i.talk || []).filter(t => !t.deleted);
    if (!talk.length || i.talkSeenAt) return i;
    return { ...i, talkSeenAt: Math.max(...talk.map(t => t.at)) };
  }),
})));
let candMigrated = false;

window.CircCandidate = {
  api: null,
  // Item 5 (corrected 2026-08-19) — TWO triggers only: adding the link, or
  // speaking in the conversation (a turn or a reply). Marking read does NOT
  // enrol, and neither does placing a reaction; both run through app/main.jsx's
  // markRead, so this hook stays unset.
  onMarkRead: null,
  bind(api) {
    this.api = api;
    // After the render, never during it.
    if (!candMigrated) { candMigrated = true; setTimeout(() => candMigrateMarks(api), 0); }
  },
  goToCard(item) {
    const api = this.api;
    if (!api || !item) return;
    api.setRoute('card:' + item.id);
  },
  matchRoute: (r) => typeof r === 'string' && r.slice(0, 5) === 'card:',
  renderRoute: (r, api) => ({
    body: <CandSurfaceRoute api={api} itemId={r.slice(5)} />,
    opts: { subView: { title: 'Overview', onBack: api.returnToSpace } },
  }),
  CardRow: window.CandCardRow,
  FeedLead: window.CandFeedLead,
};
