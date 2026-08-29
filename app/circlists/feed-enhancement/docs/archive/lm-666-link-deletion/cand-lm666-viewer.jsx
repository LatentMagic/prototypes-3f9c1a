// ============================================================================
// LM-666 candidate — "delete for me": the per-member view of a circle.
//
// The state: `hiddenForMe: [itemId]` per circle, carried inside the space object
// so it persists with everything else (a refresh, leaving and re-entering the
// circle, another member reacting — none of them bring the link back). Leaving
// drops the circle, so a rejoin reseeds it whole, on the same grain that seeds
// read state afresh per join.
//
// The read side is ONE hook: window.CircViewerSpaces, which main.jsx runs the
// rendered circles through. Everything downstream is derived from it — both
// tabs, the New pill, the waterline, the empty state, the rail dot and the home
// rows — so a hidden link cannot leak through one surface while being gone from
// another. Mutations still run against the raw state, so nothing else sees it.
//
// Arrival marks: a circle's dot only stands while a VISIBLE unread item sits
// above the circle's mark. A signal pointing at something the member cannot see
// is a signal that lies.
// ============================================================================
window.CAND666 = window.CAND666 || {};

const cand666Hidden = (s) => (s && s.hiddenForMe) || [];

// Who holds "Delete for everyone": the link's contributor, and the circle's
// champion. Read off what the product already carries — the card's attribution
// and the space's `champion` field. No role field, no time window.
const cand666IsContributor = (item) => /^added by\s+you\b/i.test((item && item.attribution) || '');
const cand666IsChampion = (space) => !!space && space.champion === 'You';
const cand666HoldsForEveryone = (item, space) => cand666IsContributor(item) || cand666IsChampion(space);

const cand666ViewerSpaces = (spaces) => spaces.map((s) => {
  const hid = cand666Hidden(s);
  if (!hid.length) return s;
  const items = s.items.filter((i) => !hid.includes(i.id));
  const pending = (s.pending || []).filter((i) => !hid.includes(i.id));
  const mark = s.lastSeenAt || 0;
  // Honest dot: something unread AND newer than the mark has to be left to see.
  const arrivals = pending.length > 0 || items.some((i) => !i.read && i.at && i.at > mark);
  return { ...s, items, pending, unseen: !!s.unseen && arrivals };
});

// The act. Lands at once in this member's own session; nothing waits on a pull,
// and nothing anywhere records that it happened.
const cand666DeleteForMe = (item) => {
  const api = window.CAND666.api;
  if (!api || !item) return;
  const id = api.currentId;
  api.setSpaces((prev) => prev.map((s) => (s.id === id
    ? { ...s, hiddenForMe: [...cand666Hidden(s), item.id] }
    : s)));
};

Object.assign(window, {
  CircViewerSpaces: cand666ViewerSpaces,
  cand666Hidden, cand666IsContributor, cand666IsChampion, cand666HoldsForEveryone, cand666DeleteForMe,
});
