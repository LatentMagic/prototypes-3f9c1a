// C2 — wire the option set into the candidate and configure the header bar.
// Loads last before app/main.jsx.
window.CircCandidate.CardRow = window.PGC2Row;
window.CircCandidate.FeedLead = window.PGC2Lead;
window.PGBAR = {
  eyebrow: 'c2 \u00b7 the marks on a read card',
  blurb: 'The way through, something unseen, and watching \u2014 answered together, in one corner.',
  options: window.PGC2_OPTIONS,
  get: () => window.PGC2.opt,
  set: (id) => window.PGC2.set({ opt: id }),
  sub: (f) => window.PGC2.sub(f),
  notes: (o) => [['Costs', o.cost], ['Can the fold carry watching alone', o.watch]],
};
