// ============================================================================
// LM-769 · the ask, round two — rig store. Selection persisted; a subscribe so
// the bar and the ask redraw together. No word lever and no alignment lever:
// the words are settled, and alignment has a correct answer per form.
// ============================================================================
const PGA_KEY = 'pg_ask2_v1';

const PGA_OPTIONS = [
  { id: 'block', n: '1', name: 'The block',
    dir: 'The sentence, kept — but left on the cards\u2019 own edge and set as two lines: the statement, then the offer beneath it with the × on its line. A block has a shape, so it never reads as a line that started at the margin and stopped nowhere.',
    cost: 'Two lines tall and the quietest of the five \u2014 feed-weight grey against a column of semibold titles. The one most likely to be scrolled past, and the line does not come back.' },
  { id: 'card', n: '2', name: 'The card',
    dir: 'The list is made of cards, so the offer is one: the card\u2019s surface, border, radius and padding, a title at card-title weight, a supporting line, the \u00d7 where a card\u2019s actions sit, and the house outlined secondary \u2014 never the filled accent.',
    cost: 'A card claims what cards claim: somebody in your circle put this here. This is the product talking, and it carries a card\u2019s permanence and a card\u2019s height for something that leaves after one tap.' },
  { id: 'banner', n: '3', name: 'The banner',
    dir: 'Not in the list — attached under it, and bled to the full content row. It slides down out from under the tabs, opening its own slot as it comes, the way the returns bar already arrives. The only form that cannot be mistaken for content, because it is not in the pile.',
    cost: 'A full-width band across the top of the feed is the shape every product uses for an announcement, so it arrives carrying that association. On a phone it also spends a row the feed would otherwise give to the first card.' },
  { id: 'setting', n: '4', name: 'The setting',
    dir: 'Stop pitching. The Account row, surfaced once where the member already is: the line, and the app\u2019s real switch. The control met here is the control found later, so the ask teaches where notifications live as well as offering them.',
    cost: 'Two controls in one row \u2014 a switch to answer and a \u00d7 to leave \u2014 and a settings control sitting in a list of links, which is a register the feed does not otherwise use.' },
  { id: 'tail', n: '5', name: 'The tail',
    dir: 'The same quiet sentence, at the END of the Active list rather than the head. An offer at the top interrupts the reading; an offer at the foot is met once the reading is done \u2014 the natural moment to ask for more.',
    cost: 'Lowest reach of the five by a distance: on a long list almost nobody scrolls to it, and a one-time line that is never seen is a feature nobody turns on.' },
];

// The offer names what pressing it does: it opens the device dialog, which is
// setting notifications up — not a switch that flips them on then and there.
const PGA_LABEL = 'Set up notifications';

const pgaSubs = [];
const PGA = {
  opt: 'block',
  ground: 'sunken',
  width: 'full',
  set(patch) {
    Object.assign(PGA, patch);
    try { localStorage.setItem(PGA_KEY, JSON.stringify({ opt: PGA.opt, ground: PGA.ground, width: PGA.width })); } catch (e) {}
    pgaSubs.forEach((f) => f());
  },
  sub(f) { pgaSubs.push(f); return () => { const i = pgaSubs.indexOf(f); if (i > -1) pgaSubs.splice(i, 1); }; },
};
try {
  const raw = JSON.parse(localStorage.getItem(PGA_KEY) || 'null');
  if (raw && raw.opt) PGA.opt = raw.opt;
  if (raw && raw.ground) PGA.ground = raw.ground;
  if (raw && raw.width) PGA.width = raw.width;
} catch (e) {}

// Re-arm. The device answer is PERSISTED app state by design (the platform asks
// once), so the only honest way to play the same option twice is to put the
// stored answer back to "never asked" and reload.
const pgaRearm = () => {
  try {
    const k = window.CIRC_STATE_KEY;
    const s = JSON.parse(localStorage.getItem(k) || 'null');
    if (s) { s.push = { perm: 'default', on: false, ask: 'pending', channel: 'ok' }; localStorage.setItem(k, JSON.stringify(s)); }
  } catch (e) {}
  window.location.reload();
};

const usePGA = () => {
  const [, bump] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => PGA.sub(bump), []);
  return PGA;
};

Object.assign(window, { PGA, PGA_OPTIONS, PGA_LABEL, pgaRearm, usePGA });
