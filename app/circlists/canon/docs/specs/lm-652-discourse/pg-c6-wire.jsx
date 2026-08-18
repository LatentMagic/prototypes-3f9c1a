// C6 — wire the control set into the candidate and configure the header bar.
// Both slots are STABLE components that subscribe to the store themselves, so
// switching option re-renders without the app re-rendering.
const PGC6Use = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGC6.sub(bump), []);
  return PGC6.opt;
};

// The card's corner, in every option: the SIGNAL, not a control. Same fold the
// Read shelf draws when a card is watched — nothing to press, nothing to miss.
window.CandFoldCtl = ({ item }) => (item.watching ? <CandFold /> : null);

window.CandOpening = ({ item, api }) => {
  const opt = PGC6Use();
  if (opt === 'word') return <PGC6Word item={item} api={api} />;
  if (opt === 'switch') return <PGC6Switch item={item} api={api} />;
  if (opt === 'line') return <PGC6Line item={item} api={api} />;
  return <PGC6Glyph item={item} api={api} />;
};

window.PGBAR = {
  eyebrow: 'c6 \u00b7 the watching control',
  blurb: 'The fold fails both accessibility floors as a button (1.55:1 against the card, ~22px of target), so here it is a signal only and the control moves to the conversation\u2019s header row. Open a card\u2019s conversation from the Read tab.',
  options: window.PGC6_OPTIONS,
  get: () => window.PGC6.opt,
  set: (id) => window.PGC6.set({ opt: id }),
  sub: (f) => window.PGC6.sub(f),
  notes: (o) => [['Costs', o.cost]],
};
