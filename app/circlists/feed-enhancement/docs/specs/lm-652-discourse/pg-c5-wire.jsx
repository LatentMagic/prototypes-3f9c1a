// C5 — wire the option set into the candidate and configure the header bar.
// Both slots are STABLE components that subscribe to the store themselves, so
// switching option re-renders the opening without needing the app to re-render.
const PGC5Use = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGC5.sub(bump), []);
  return PGC5.opt;
};

window.CandOpening = ({ item, api }) => {
  const opt = PGC5Use();
  if (opt === 'apart') return <PGC5Apart item={item} api={api} />;
  if (opt === 'oncard') return <PGC5Eyebrow />;
  return <PGC5Turn item={item} api={api} />;
};

window.CandHeadWrap = ({ item, api, children }) => {
  const opt = PGC5Use();
  if (opt !== 'oncard') return children;
  // Not a lookalike: the feed's own row, forced to its Active behaviour, so the
  // band, the swap and the mark are literally the shipped ones.
  return <CandCardRow item={item} tab="active" api={api}>{children}</CandCardRow>;
};

window.PGBAR = {
  eyebrow: 'c5 \u00b7 how the conversation begins',
  blurb: 'Open a card\u2019s conversation from the Read tab. The question is the contributor\u2019s thought: is it the first turn, its own opening, or part of the card?',
  options: window.PGC5_OPTIONS,
  get: () => window.PGC5.opt,
  set: (id) => window.PGC5.set({ opt: id }),
  sub: (f) => window.PGC5.sub(f),
  notes: (o) => [['Costs', o.cost]],
};
