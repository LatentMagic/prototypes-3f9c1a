// ============================================================================
// LM-652 · the empty band, ideated. The band is settled; what is open is what
// happens between pressing it and the thought existing.
//
// Two families:
//   in place — the band grows into the field where it sits (1, 2, 5)
//   opens    — the band does what every other band does: the card swaps and you
//              write on the opened paper (3, 4)
//
// Everything else is the candidate. Only your own thoughtless card is touched.
// ============================================================================
const PGB_KEY = 'pg_band_v1';
const pgbSaved = (() => { try { return JSON.parse(localStorage.getItem(PGB_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const PGB_OVERLAP = 15, PGB_INSET = 12, PGB_EDGE = 12, PGB_SWAP = 420;
const PGB_TARGET = 'pgb-mine';

const PGB = {
  opt: pgbSaved.opt || 'aside',
  // The id of a card the row keeps hold of AFTER the thought lands. Without it
  // the row is swapped for the shipped one the instant the item gains a thought,
  // and whatever the option promised to do next never happens.
  hold: null,
  subs: new Set(),
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PGB_KEY, JSON.stringify({ opt: this.opt })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGB = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGB.sub(bump), []);
  return PGB;
};

const PGB_OPTIONS = [
  { id: 'aside', n: '1', name: 'As built',
    dir: 'The field opens where the band is. Send sits inside the box; the close sits outside it, to the right. The baseline \u2014 here to be compared against, not defended.',
    cost: 'The two controls belong to different boxes and read as unrelated. The close also pushes the field narrower than the card it belongs to.' },
  { id: 'nox', n: '2', name: 'No close at all',
    dir: 'The field is the band, grown. Send is the only control on it, and it is the same send every box in this product has. You take the field back the way you take words back: clear it, and press away \u2014 an empty box closes itself.',
    cost: 'Nothing on screen says how to leave. The field holds while there are words in it, which is right, but a contributor who wants out with words written has to clear them first.' },
  { id: 'pair', n: '5', name: 'A pair beneath',
    dir: 'The field keeps its own edges and the two acts sit together under it, right-aligned: Cancel and Add. Not glyphs \u2014 the words. This is the pattern the card already uses when you edit a thought you have written, so the app has said it once already.',
    cost: 'Two buttons under a two-line box is a lot of furniture for one sentence, and it is the heaviest of the five in the feed.' },
  { id: 'opens', n: '3', name: 'The band opens',
    dir: 'The band does what every band does: the link card slips behind and the paper comes up full width, with the writing field on it. The cross sits top-right where the open face\u2019s cross already sits, and Add sits at the foot where the card\u2019s own acts are. Sending leaves the card open, now carrying the thought \u2014 the field becomes the words in place, and the card settles to their height. Close it and it goes back down onto its band, the way any thought does.',
    cost: 'A press to open before a press to write, and the feed moves under you to make room. The card is left open after sending, which no other act in the feed does.' },
  { id: 'roundtrip', n: '4', name: 'Opens, then settles',
    dir: 'The same opening, the same paper, the same cross \u2014 but sending sends the card back down. It is the band\u2019s own closing travel, not a disappearance: the paper closes onto the band, now carrying your words, and the row is exactly where it was. Writing is a round trip: out, and back.',
    cost: 'You do not see the thought as a reader will until you open it again. Two travels for one sentence, and the second one takes your words off screen as its last act.' },
];
const pgbOpt = () => PGB_OPTIONS.find(o => o.id === PGB.opt) || PGB_OPTIONS[0];
const pgbOpens = () => PGB.opt === 'opens' || PGB.opt === 'roundtrip';

const PGB_THOUGHT = 'Read the first chapter on a train and immediately wanted someone to argue with me about it.';
// The circle's contents, as a function so the reset can put them back — a rig
// that can be played into a corner and not out of it is a rig you use once.
const pgbItems = () => {
  const NOW = Date.now();
  const it = (o) => ({ read: false, reactions: [], ...o });
  return [
    it({ id: PGB_TARGET, url: 'https://www.gutenberg.org/files/2701/2701-h/2701-h.htm',
      attribution: 'Added by you', title: 'Moby-Dick; or, The Whale', source: 'Project Gutenberg',
      hasImage: false, at: NOW - 2 * 3600e3 }),
    it({ id: 'pgb-news', url: 'https://longreads.com/2026/03/the-death-of-the-newspaper/',
      attribution: 'Added by Priya N.', title: 'The Death of the Newspaper', source: 'Longreads',
      image: 'uploads/card-previews/pragmatic-engineer.jpg', at: NOW - 7 * 3600e3,
      thought: { by: 'Priya N.', text: PGB_THOUGHT, at: NOW - 7 * 3600e3 } }),
    it({ id: 'pgb-build', url: 'https://worksinprogress.co/issue/why-buildings-fall-down/',
      attribution: 'Added by Ada L.', title: 'Why buildings fall down', source: 'Works in Progress',
      image: 'uploads/card-previews/martinfowler-cd-pipeline.png', at: NOW - 26 * 3600e3 }),
  ];
};
(() => {
  const base = window.CircSeed.seedSpaces;
  window.CircSeed.seedSpaces = (email) => {
    const spaces = base(email);
    spaces[0] = { ...spaces[0], name: 'Reading Circle', items: pgbItems() };
    return spaces;
  };
})();

Object.assign(window, { PGB, usePGB, PGB_OPTIONS, pgbOpt, pgbOpens, pgbItems, PGB_OVERLAP, PGB_INSET, PGB_EDGE, PGB_SWAP, PGB_TARGET });
