// Clearing the returns bar, inside a circle — wiring. One swap:
// CircCandidate.FeedLead is read per render by app/main.jsx, so the fork
// replaces it and nothing else in the app is touched. The home strip
// (app/home-returns.jsx) is deliberately left alone: the user has scoped the
// clear to a circle, and home is settled as a preview with no clear on it.
window.CircCandidate.FeedLead = PgccFeedLead;

// No driver to get into a circle: the app's own landing is a circle (main.jsx
// defaults the route to 'space' and the circle to the top one), so the rig opens
// on the question. If a restored session lands on home instead, pressing a
// circle is the member's own path in and the rig does not shortcut it.

window.PGBAR = {
  eyebrow: 'in a circle · clearing the returns bar',
  blurb: 'One quiet act at the foot of the open panel — the direction that survived 2026-09-21, stripped of its band, its button and its teaching line. Clearing marks nothing read, a new reply brings the row back, and an empty bar is gone rather than caught up. Press Backend Pod, then the bar’s chevron. Undo is the lever, and it is also how the bar leaves.',
  options: window.PGCC_OPTIONS,
  get: () => window.PGCC.opt,
  set: (id) => { window.PGCCR.set(null); window.PGCC.set({ opt: id }); window.pgccReset(); },
  sub: (f) => window.PGCC.sub(f),
  notes: (o) => [['Costs', o.cost]],
  levers: () => [
    { label: 'Undo', value: window.PGCC.undo,
      onChange: (id) => { window.PGCCR.set(null); window.PGCC.set({ undo: id }); },
      options: [{ id: 'off', label: 'Off' }, { id: 'on', label: 'On' }],
      hint: 'Applies to all four, and answers how the bar leaves. Off: the shipped removal, at once. On: the bar holds its place for eight seconds as its own receipt, carrying Undo, then plays that same removal.' },
    { label: 'The marks', value: 'x', onChange: () => window.pgccReset(),
      options: [{ id: 'x', label: 'Put them back' }],
      hint: 'Clearing is terminal by construction. This re-seeds the circles so the same option can be played twice.' },
  ],
};
