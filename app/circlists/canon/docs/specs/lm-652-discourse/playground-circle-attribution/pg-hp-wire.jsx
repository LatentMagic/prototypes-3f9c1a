// Home's Conversations preview — wiring. One swap: window.CircHomeReturns is
// read per render by app/home.jsx, so the fork replaces it and nothing else in
// the app is touched. The panel inside a circle (app/talk-return.jsx) is
// deliberately untouched — the user has scoped this rig to the homepage, and
// the in-circle bar is judged after.
window.CircHomeReturns = PghHomeReturns;

window.PGBAR = {
  eyebrow: 'home · conversations preview',
  blurb: 'Round two. Four ways to show which circle a conversation belongs to — 1 is the new one, and the recommendation. Fixed in all four: the bound (3 circles, 6 rows, freshest first), no count anywhere, no clear — this is a preview. Also fixed: no per-row hairline, and the chevron is back to match the in-circle rows. The head now carries intent rather than names; its wording is the lever below. Open the panel; Config forces the phone.',
  options: window.PGH_OPTIONS,
  get: () => window.PGH.opt,
  set: (id) => window.PGH.set({ opt: id }),
  sub: (f) => window.PGH.sub(f),
  notes: (o) => [['Costs', o.cost]],
  levers: () => [
    { label: 'Head', value: window.PGH.head,
      onChange: (id) => window.PGH.set({ head: id }),
      options: [{ id: 'watching', label: 'Watching' }, { id: 'replies', label: 'New replies' }, { id: 'since', label: 'Since you looked' }],
      hint: 'What the head says, with no count in any of them: “Conversations you are watching” / “New replies in your circles” / “Replies since you last looked”.' },
    { label: 'The seed', value: 'x', onChange: () => window.pghReset(),
      options: [{ id: 'x', label: 'Put it back' }],
      hint: 'Opening a conversation meets it, which takes its row out of the panel. This re-seeds the circles so the same option can be played twice.' },
  ],
};
