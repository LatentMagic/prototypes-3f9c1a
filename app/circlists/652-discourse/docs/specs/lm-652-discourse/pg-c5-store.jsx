// ============================================================================
// C5 — how the conversation begins. Options + persisted selection.
//
// The ratified problem (2026-08-17): on the conversation surface the
// contributor's thought reads as a caption rather than as the start of the
// thread — it is smaller and fainter than the reply beneath it, the mono eyebrow
// is left carrying the whole "a conversation begins here" job on its own, and
// the same person appears twice within 60px (the card's attribution, then the
// thought) as bloat.
//
// Three answers, deliberately different silhouettes rather than one object with
// small edits: the thought becomes a turn / the thought becomes a distinct
// opening block / the thought leaves the thread entirely and belongs to the card.
// ============================================================================
const PGC5_OPTIONS = [
  {
    id: 'turn', n: '1', name: 'First turn',
    dir: 'The thought IS the first turn — same avatar, same name, same 14.5px black body as every other turn. The only difference is "with the link" where the others carry a time. No eyebrow: the conversation begins because somebody spoke.',
    cost: 'Nothing marks the link\u2019s own moment, so the contribution reads as a response to the card rather than the thing that came with it \u2014 and the double attribution stays, with nothing left to distinguish the two.',
  },
  {
    id: 'apart', n: '2', name: 'The opening, set apart',
    dir: 'The thought keeps its own register but is given real presence: full width on the card\u2019s warm paper, at readable size. The thread then begins under a labelled start, so the opening and the talk are two distinct beats.',
    cost: 'Reinstates the paper slab that was taken off this surface on the 17th, and puts a second block between the card and the first turn \u2014 the talk starts further down the page than in either other option.',
  },
  {
    id: 'oncard', n: '3', name: 'Attached to the card',
    dir: 'The thought is not in the conversation at all. It comes over as part of the head card, tucked under it on warm paper exactly as it sits in the feed, and the thread below starts clean with the first real turn.',
    cost: 'The thought is no longer part of the thread, so there is nothing for a reply to attach to \u2014 and the first turn now opens a conversation whose reason for existing is above it, not in it.',
  },
];

const PGC5_KEY = 'pg_c5_v1';
const pgc5Read = () => {
  try { const v = JSON.parse(localStorage.getItem(PGC5_KEY) || '{}'); return v && v.opt ? v : { opt: 'turn' }; }
  catch (e) { return { opt: 'turn' }; }
};
const PGC5 = {
  ...pgc5Read(),
  subs: [],
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PGC5_KEY, JSON.stringify({ opt: this.opt })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.push(f); return () => { this.subs = this.subs.filter(x => x !== f); }; },
};

Object.assign(window, { PGC5, PGC5_OPTIONS });
