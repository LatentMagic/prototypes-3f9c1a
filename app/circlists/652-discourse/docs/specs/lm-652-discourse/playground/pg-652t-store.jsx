// ============================================================================
// LM-652 · attaching a thought to a card that has none — the store, the five
// options, and the seed.
//
// The question: a contributor whose OWN card carries no thought can give it one,
// from wherever they meet that card. The five options differ in where that lives
// and what form it takes; everything else on both surfaces is the candidate,
// untouched.
//
// Two levers, both in the header bar: the card's state (never had a thought /
// thought just deleted) and which surface you are looking at (Active feed /
// Overview). The option set is the pill row.
// ============================================================================
const PG652_KEY = 'pg_652t_v1';
const pg652Saved = (() => { try { return JSON.parse(localStorage.getItem(PG652_KEY) || 'null') || {}; } catch (e) { return {}; } })();

// The tuck. Mirrors CAND_OVERLAP / CAND_INSET in cand-lm652-card.jsx, which are
// module constants there and not published on window — the numbers are the
// candidate's, not this rig's, and must not be tuned here.
const PG652_OVERLAP = 15;
const PG652_INSET = 12;
// Your own card, the one under exploration. Fixed id so the header bar's
// Overview lever can reach it without guessing.
const PG652_TARGET = 'pg652-mine';

const PG652 = {
  opt: pg652Saved.opt || 'band',
  state: pg652Saved.state || 'never',   // never | deleted
  where: pg652Saved.where || 'feed',    // feed | overview
  subs: new Set(),
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PG652_KEY, JSON.stringify({ opt: this.opt, state: this.state, where: this.where })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePG652 = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PG652.sub(bump), []);
  return PG652;
};

// ---- The five options ------------------------------------------------------
// Each is a complete answer, drawn in both places. `dir` is the direction it
// takes; `cost` is what it charges — we are choosing on elegance, so the cost is
// part of the answer.
const PG652_OPTIONS = [
  { id: 'band', n: '1', name: 'Empty band',
    dir: 'The thought\u2019s own band is there before the thought is: a line of warm paper tucked under your card reading Add a thought. Pressing it opens the writing field in the band\u2019s own place, on the paper the words will land on. One element, the same on both surfaces.',
    cost: 'Your own cards always carry a slot where everyone else\u2019s carry nothing \u2014 the closest any of these comes to an empty invitation, and the feed reads unevenly down your column.' },
  { id: 'pen', n: '2', name: 'Pen in the foot row',
    dir: 'A pen joins mark-as-read and delete, on your own card only. It is the Add popover\u2019s glyph for the thought, kept in the row that already holds the card\u2019s own acts. Nothing rests under the card; the paper opens beneath when you press.',
    cost: 'A third control in the row we are most worried about, and on a narrow card it closes on the attribution line. It is the only option whose cost is paid on every one of your own cards, whether you ever write a thought or not.' },
  { id: 'field', n: '3', name: 'Overview writes it',
    dir: 'No control anywhere. The feed card is exactly the shipped card; open it and the head of Overview carries the field itself, where the thought sits on any other card. A field, not an affordance \u2014 you write in it.',
    cost: 'The feed never says the door exists. A contributor who never opens their own card never finds it, and the field rests open on a surface that is otherwise all reading.' },
  { id: 'sliver', n: '4', name: 'Bare edge',
    dir: 'No words and no glyph: a bare edge of warm paper shows under your own card, in the depth language the band already speaks. Pressing it brings the writing field up. The two states differ \u2014 a card whose thought was deleted shows the edge with one line on it, so the removal leaves a trace.',
    cost: 'Unlabelled: it is learned by pressing, and some never will. The edge is a 30px target, under the house 44px floor, and it is the one option that draws its two states differently.' },
  { id: 'menu', n: '5', name: 'The card\u2019s menu',
    dir: 'One overflow control in the foot row, holding the acts that belong to your own card \u2014 Add a thought today, and the place mark-as-read and delete could later collapse into, taking the row back down to one.',
    cost: 'Still a third control in that row, and a menu holding a single item is a promise about a future row rather than an answer for this one. Two presses where option 2 takes one.' },
];
const pg652Opt = () => PG652_OPTIONS.find(o => o.id === PG652.opt) || PG652_OPTIONS[0];

// ---- Seed ------------------------------------------------------------------
// The circle the rig opens on. Your own card carries no thought and sits at the
// top; one card below it carries one, so the endpoint of every option is on
// screen beside its starting point.
const PG652_THOUGHT = 'Read the first chapter on a train and immediately wanted someone to argue with me about it.';
(() => {
  const base = window.CircSeed.seedSpaces;
  window.CircSeed.seedSpaces = (email) => {
    const spaces = base(email);
    const NOW = Date.now();
    const it = (o) => ({ read: false, reactions: [], ...o });
    spaces[0] = { ...spaces[0], name: 'Reading Circle', items: [
      it({ id: PG652_TARGET, url: 'https://www.gutenberg.org/files/2701/2701-h/2701-h.htm',
        attribution: 'Added by you', title: 'Moby-Dick; or, The Whale', source: 'Project Gutenberg',
        hasImage: false, at: NOW - 2 * 3600e3 }),
      it({ id: 'pg652-news', url: 'https://longreads.com/2026/03/the-death-of-the-newspaper/',
        attribution: 'Added by Priya N.', title: 'The Death of the Newspaper', source: 'Longreads',
        image: 'uploads/card-previews/pragmatic-engineer.jpg', at: NOW - 7 * 3600e3,
        thought: { by: 'Priya N.', text: PG652_THOUGHT, at: NOW - 7 * 3600e3 } }),
      it({ id: 'pg652-build', url: 'https://worksinprogress.co/issue/why-buildings-fall-down/',
        attribution: 'Added by Ada L.', title: 'Why buildings fall down', source: 'Works in Progress',
        image: 'uploads/card-previews/martinfowler-cd-pipeline.png', at: NOW - 26 * 3600e3 }),
      it({ id: 'pg652-talk', url: 'https://www.youtube.com/watch?v=Kx7Bvksk_qg',
        attribution: 'Added by Marcus T.', title: 'Simple Made Easy \u2014 Rich Hickey', source: 'YouTube',
        image: 'uploads/card-previews/youtube-maxres.jpg', at: NOW - 2 * 86400e3 }),
    ] };
    return spaces;
  };
})();

Object.assign(window, { PG652, usePG652, PG652_OPTIONS, pg652Opt, PG652_OVERLAP, PG652_INSET, PG652_TARGET, PG652_THOUGHT });
