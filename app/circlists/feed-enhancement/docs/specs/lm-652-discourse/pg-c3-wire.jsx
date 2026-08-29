// C3 — wire the option set into the candidate and configure the header bar.
window.CircCandidate.FeedLead = window.PGC3Lead;
window.PGBAR = {
  eyebrow: 'c3 \u00b7 the return affordance',
  blurb: 'How the head of the feed says the circle has spoken, and how it hands over the cards.',
  options: window.PGC3_OPTIONS,
  get: () => window.PGC3.opt,
  set: (id) => window.PGC3.set({ opt: id }),
  sub: (f) => window.PGC3.sub(f),
  notes: (o) => [['Costs', o.cost]],
};
