// C4 — configure the header bar. The field itself is installed by pg-c4-field.jsx
// re-publishing CandWrite; nothing on CircCandidate needs touching.
window.PGBAR = {
  eyebrow: 'c4 \u00b7 the add popover\u2019s thought field',
  blurb: 'Open Add (the green button, bottom right) and write a long one. That is the whole test.',
  options: window.PGC4_OPTIONS,
  get: () => window.PGC4.opt,
  set: (id) => window.PGC4.set({ opt: id }),
  sub: (f) => window.PGC4.sub(f),
  notes: (o) => [['Costs', o.cost]],
};
