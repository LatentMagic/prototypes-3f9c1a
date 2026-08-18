// LM-652 · attaching a thought — wiring. Two names are re-published over the
// candidate (its feed row and the surface's head wrap) and the header bar is
// configured. Nothing in app/ or cand-* is edited.
window.CircCandidate.CardRow = ({ item, tab, api, children, ...rest }) => {
  if (tab === 'active' && pg652Mine(item)) return <PG652Row item={item} api={api} place="feed">{children}</PG652Row>;
  return <CandCardRow item={item} tab={tab} api={api} {...rest}>{children}</CandCardRow>;
};

window.CandHeadWrap = ({ item, api, children }) => {
  if (pg652Mine(item)) return <PG652Row item={item} api={api} place="surface">{children}</PG652Row>;
  return <CandSurfaceHead item={item} api={api}>{children}</CandSurfaceHead>;
};

// The card's state. Both states are a card with no thought; what differs is
// whether one was ever written, which the options may or may not answer
// differently.
const pg652SetState = (s) => {
  PG652.set({ state: s });
  const api = window.CircCandidate.api;
  if (!api) return;
  candUpdateItem(api, PG652_TARGET, (i) => {
    const n = { ...i };
    delete n.thought;
    if (s === 'deleted') n.pg652Deleted = true; else delete n.pg652Deleted;
    return n;
  });
};

// Which surface you are looking at. The rig does not draw a second card: it
// walks the app to the card's Overview and back, the way a member does.
const pg652Go = (w) => {
  PG652.set({ where: w });
  const api = window.CircCandidate.api;
  if (!api) return;
  if (w === 'overview') {
    const item = api.space && api.space.items.find(i => i.id === PG652_TARGET);
    if (item) window.CircCandidate.goToCard(item);
  } else {
    api.returnToSpace();
  }
};

window.PGBAR = {
  eyebrow: 'lm-652 \u00b7 attaching a thought',
  blurb: 'Your own card tops the feed with no thought on it. Five ways to give it one \u2014 write one and the card takes the shipped band.',
  options: window.PG652_OPTIONS,
  get: () => window.PG652.opt,
  set: (id) => window.PG652.set({ opt: id }),
  sub: (f) => window.PG652.sub(f),
  notes: (o) => [['Costs', o.cost]],
  levers: () => [
    { label: 'The card', value: window.PG652.state, onChange: pg652SetState,
      options: [{ id: 'never', label: 'Never had a thought' }, { id: 'deleted', label: 'Thought just deleted' }],
      hint: 'Clears whatever is on the card either way.' },
    { label: 'Seen on', value: window.PG652.where, onChange: pg652Go,
      options: [{ id: 'feed', label: 'Active feed' }, { id: 'overview', label: 'Overview' }] },
  ],
};

Object.assign(window, { pg652SetState, pg652Go });
