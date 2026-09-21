// Clearing conversations — wiring. The two bars are swapped for their forks and
// nothing else in the app is touched.
//   in a circle — CircCandidate.FeedLead is read per render by app/main.jsx
//   on home     — window.CircHomeReturns is read per render by app/home.jsx
window.CircCandidate.FeedLead = PgcFeedLead;

window.PGBAR = {
  eyebrow: 'clearing conversations',
  blurb: 'A way out of the returns bar that is not reading every card behind it. Three kinds of affordance, not three placements of one. Play each in both places: a circle’s bar, and home’s strip — where one act ends every funded circle, including the ones the panel’s six rows never showed you.',
  options: window.PGC_OPTIONS,
  get: () => window.PGC.opt,
  set: (id) => { window.PGCR.set(null); window.PGC.set({ opt: id }); window.pgcReset(); },
  sub: (f) => window.PGC.sub(f),
  notes: (o) => [['Costs', o.cost]],
  levers: () => [
    { label: 'Undo', value: window.PGC.undo,
      onChange: (id) => { window.PGCR.set(null); window.PGC.set({ undo: id }); },
      options: [{ id: 'off', label: 'Off' }, { id: 'on', label: 'On' }],
      hint: 'Applies to all three. On: the bar becomes its own receipt for eight seconds, carrying Undo, then plays its ordinary removal.' },
    { label: 'The marks', value: 'x', onChange: () => { window.PGCR.set(null); window.pgcReset(); },
      options: [{ id: 'x', label: 'Put them back' }],
      hint: 'Clearing is terminal by construction. This re-seeds the circles so the same option can be played twice.' },
  ],
};
