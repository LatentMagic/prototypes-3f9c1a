// LM-652 · the empty band — wiring. Only your own thoughtless card is taken over;
// everything else falls through to the candidate untouched.
// The row keeps the card while PGB.hold names it, so an option can finish the
// travel it promised after the thought has landed.
const pgbClaims = (item) => pgbMine(item) || (!!item && PGB.hold === item.id);
window.CircCandidate.CardRow = ({ item, tab, api, children, ...rest }) => {
  if (tab === 'active' && pgbClaims(item)) return <PgbRow item={item} api={api}>{children}</PgbRow>;
  return <CandCardRow item={item} tab={tab} api={api} {...rest}>{children}</CandCardRow>;
};
window.CandHeadWrap = ({ item, api, children }) => {
  if (pgbClaims(item)) return <PgbRow item={item} api={api}>{children}</PgbRow>;
  return <CandSurfaceHead item={item} api={api}>{children}</CandSurfaceHead>;
};

// Put the circle back the way it opened, so the same option can be played twice
// — and so a card read or removed while playing comes back.
const pgbReset = () => {
  const api = window.CircCandidate.api;
  if (!api) return;
  api.returnToSpace();
  PGB.set({ hold: null });
  api.setSpaces(prev => prev.map(s => s.id === api.currentId ? { ...s, items: pgbItems() } : s));
};

window.PGBAR = {
  eyebrow: 'lm-652 \u00b7 the empty band',
  blurb: 'The band is settled. What is open is what happens between pressing it and the thought existing \u2014 three that grow the band in place, two that open the card the way every other band does.',
  options: window.PGB_OPTIONS,
  get: () => window.PGB.opt,
  set: (id) => { window.PGB.set({ opt: id }); pgbReset(); },
  sub: (f) => window.PGB.sub(f),
  notes: (o) => [['Costs', o.cost]],
  levers: () => [
    { label: 'The card', value: 'x', onChange: pgbReset,
      options: [{ id: 'x', label: 'Start over' }],
      hint: 'Puts the circle back the way it opened.' },
  ],
};
Object.assign(window, { pgbReset, pgbClaims });
