// ============================================================================
// LM-769 · the ask — rig store. Option + word choice, persisted, with a
// subscribe so the bar and the ask redraw together.
// ============================================================================
const PGP_KEY = 'pg_push_v1';

const PGP_OPTIONS = [
  { id: 'sentence', n: '1', name: 'The sentence',
    dir: 'A line of feed-weight prose, centred in the column, with the offer set inline as the app\u2019s accent text link and a \u00d7 at the end of the sentence. No box, no fill, no object \u2014 it belongs to the column the way the New pill does, not to a card.',
    cost: 'It is the easiest thing on the screen to scroll past. A member who never reads it never turns notifications on \u2014 and the one-time line does not come back.' },
  { id: 'card', n: '2', name: 'The card',
    dir: 'An object in the pile, in the card\u2019s own vocabulary: white surface, the card border and radius, a semibold line, a supporting line, and a filled primary. Dismissed by the \u00d7 in its corner, the way a card\u2019s actions sit in its corner.',
    cost: 'A card\u2019s worth of weight and height for something that is not a link, and the filled accent makes it the loudest thing on a screen whose whole content is links. It also reads as a card you could open.' },
  { id: 'band', n: '3', name: 'The rule',
    dir: 'Furniture, in the divider\u2019s vocabulary: a hairline above and below, no fill, no border, no radius, spanning the column. The line sits left, the offer is an outlined secondary on the right. It reads as a seam in the list, not as something in the list.',
    cost: 'Two more horizontal rules in a column that already draws one for the waterline, so a member meeting both at once has to work out which seam means what.' },
  { id: 'pill', n: '4', name: 'The row',
    dir: 'Option 3 with the hairlines taken off and nothing put in their place: the same row — line left, outlined secondary right, × last — standing on the feed’s own ground. No seam, no box, no fill, no radius. Stacks on a narrow column, same container query.',
    cost: 'Nothing separates it from the first card, so on a busy Active list it can read as that card’s header rather than as its own thing.' },
];

// ONE label, not a lever. "Turn them on" had no antecedent \u2014 after "new links
// land in your circles", "them" reads as the links or the circles, never as the
// notifications, which are not named anywhere in the sentence. The offer has to
// name its own subject.
const PGP_LABEL = 'Turn on notifications';

const pgpSubs = [];
const PGP = {
  opt: 'sentence',
  align: 'centre',
  set(patch) {
    Object.assign(PGP, patch);
    try { localStorage.setItem(PGP_KEY, JSON.stringify({ opt: PGP.opt, align: PGP.align })); } catch (e) {}
    pgpSubs.forEach((f) => f());
  },
  sub(f) { pgpSubs.push(f); return () => { const i = pgpSubs.indexOf(f); if (i > -1) pgpSubs.splice(i, 1); }; },
};
try {
  const raw = JSON.parse(localStorage.getItem(PGP_KEY) || 'null');
  if (raw && raw.opt) PGP.opt = raw.opt;
  if (raw && raw.align) PGP.align = raw.align;
} catch (e) {}

// Re-arm the ask. The answer to the device dialog is PERSISTED app state (that
// is the product rule: the platform asks once), so the only honest way to play
// the same option twice is to put the stored answer back to "never asked" and
// reload. No app-side back door \u2014 a reset hook in main.jsx would exist only for
// this rig.
const pgpRearm = () => {
  try {
    const k = window.CIRC_STATE_KEY;
    const s = JSON.parse(localStorage.getItem(k) || 'null');
    if (s) { s.push = { perm: 'default', on: false, ask: 'pending', channel: 'ok' }; localStorage.setItem(k, JSON.stringify(s)); }
  } catch (e) {}
  window.location.reload();
};

const usePGP = () => {
  const [, bump] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => PGP.sub(bump), []);
  return PGP;
};

Object.assign(window, { PGP, PGP_OPTIONS, PGP_LABEL, pgpRearm, usePGP });
