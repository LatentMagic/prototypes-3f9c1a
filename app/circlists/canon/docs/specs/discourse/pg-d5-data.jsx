// ============================================================================
// Discourse v5 — seven further directions, appended to the v4 set.
//
// v4 asked "what shape does discourse take". These seven answer the part the
// review kept naming and no direction had answered: **what makes a conversation
// feel ONGOING without it becoming a thread.**
//
// Research (2026-08-05) separated "ongoing" into four mechanisms that are all
// achievable without a reply chain:
//   revivability        a thing that CAN resurface later reads as alive, whether
//                       or not it is currently busy (Discord forum posts vs
//                       auto-archiving threads)
//   visible incompleteness  a shape-shaped hole where the next turn goes — renga's
//                       folded paper, exquisite corpse
//   lineage, not tally  ongoing-ness shown as a trail of who touched a thing and
//                       what they made of it, never as a count (Are.na, quote-tweet)
//   staggered object    the object persists across independent visits; nobody is
//                       ever "in the room together" (Letterboxd)
//
// Each direction below takes ONE of those and commits to it, and each carries a
// card treatment that no v4 direction uses — because "we want to see thoughts on
// card" and the v4 postmortem's rule stands: a new content class needs real
// typographic treatments, and different directions must treat it differently.
//
// This module appends to window.PGD4_DIRS (same array reference the v4 app
// already destructured) and swaps window.Pg4Treatment for a dispatcher that
// handles the new `treat` values and falls through to v4's for the old ones.
// Load AFTER pg-d4-content + the v5 treatment files, BEFORE pg-d4-card.
// ============================================================================

const { PGD4_DIRS: PGD5_DIRS_REF, Pg4Treatment: PGD5_BASE_TREAT } = window;

// ---- The seven -------------------------------------------------------------
const PGD5_NEW = [
  {
    id: 'standfirst', n: '11', name: 'The standfirst',
    treat: 'standfirst', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'One italic line under the title — the circle’s current best word on this. The title keeps its size.',
    cont: 'Anyone can offer a better line. The one most pointed at holds the deck, so the position is live but never argued.',
    claim: 'A thought in the one place editorial design already reserved for a thought, and only ever one line long.',
    cost: 'Only one voice is visible at a time. The rest of the circle is a number, not a presence.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'bracket', n: '12', name: 'The aside',
    treat: 'bracket', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'Square brackets, inline. An aside is short because an aside is short — nothing enforces it.',
    cont: 'Asides append into the same paragraph. It can grow for weeks and never becomes a stack.',
    claim: 'The cheapest possible way to carry several voices on a card. It adds lines, never blocks.',
    cost: 'Reads as an annotation, not as being spoken to. Nobody is answered.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'chorus', n: '13', name: 'The chorus',
    treat: 'chorus', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'Voices stacked as one block, name-led in small caps. No indents, no bubbles — a list, not a thread.',
    cont: 'It accretes across visits. Three show; the rest are a plain word, never a button.',
    claim: 'Several people on one card reading as a chorus rather than a comment section.',
    cost: 'Past three voices it wants to be a thread, and the cap is the only thing stopping it.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'slot', n: '14', name: 'The open slot',
    treat: 'slot', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'The card shows the shape of the next line before anyone writes it — your name, set, on an empty rule.',
    cont: 'Filling the slot opens the next one, for whoever reads next. It closes when the circle has all read.',
    claim: 'Unfinished business you can see. The invitation is typographic, not a button.',
    cost: 'An empty slot with your name on it is a small obligation, and calm is the floor.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'returned', n: '15', name: 'The long return',
    treat: 'returned', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'Time is the typography. A line added weeks later sits under its own dateline, marked as a return.',
    cont: 'You may return whenever, but not twice in a day. The gap between turns is the only limit there is.',
    claim: 'A card that is never closed — coming back months later is a designed act, not necromancy.',
    cost: 'Slow by construction. A circle wanting to talk today gets a surface that rewards waiting.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 140 },
  },
  {
    id: 'shelf', n: '16', name: 'The shelf talker',
    treat: 'shelf', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'A small card pinned beside the item, the way a bookshop staff pick sits under a book.',
    cont: 'Anyone may pin one. They gather along the shelf edge; the item never changes.',
    claim: 'Recommending, not commenting — the register a reading circle actually speaks in.',
    cost: 'A card inside a card. It is the heaviest of the seven on vertical space.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 120 },
  },
  {
    id: 'descend', n: '17', name: 'Reading on',
    treat: 'descend', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'Your response can become the next share. The card shows what it led to.',
    cont: 'The conversation continues as a chain of contributions, so continuing is the same act as sharing.',
    claim: 'The only direction where responding makes the circle something new instead of adding to a pile.',
    cost: 'The exchange leaves the card. Read the feed and you see results, never the talking.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
];

// ---- Extra fixture material -------------------------------------------------
// The v4 superset (PGD4_DISC) carries thought / responses / takeaway / turns.
// Two of the seven need something it does not hold: a note that arrived long
// after (returned) and a share that descended from this one (descend). Keyed by
// item id so every card reads, and derived from the existing responses so the
// voices stay the same people.
const PGD5_LATE = {
  // days elapsed, applied to the LAST response on an item
  late: 23,
  laterBy: 'Lena P.',
  laterText: 'Came back to this after the incident review. The part about staffing reads completely differently now.',
};

// Keyed by url. The READ items matter most — reveal-on-read means the lineage
// is only ever visible on a card you have read, so seeding only the Active ones
// would leave the direction's whole idea invisible. (It did, once.)
const PGD5_DESCENDANTS = {
  // read
  'https://go.dev/blog/pipelines': {
    by: 'Priya N.',
    title: 'Structured concurrency, and why we keep reinventing it',
    source: 'blog.golang.org',
  },
  'https://jvns.ca/blog/2026/02/dns-resolvers/': {
    by: 'Dev K.',
    title: 'The DNS outage postmortem I keep coming back to',
    source: 'incident.io',
  },
  'https://www.kernel.org/doc/html/latest/process/submitting-patches.html': {
    by: 'Ada L.',
    title: 'How we rewrote our own review guide after reading this',
    source: 'notes.adalovelace.dev',
  },
  // active
  'https://newsletter.pragmaticengineer.com/p/scaling-on-call': {
    by: 'Priya N.',
    title: 'The on-call handbook we actually use',
    source: 'incident.io',
  },
  'https://martinfowler.com/articles/cd-pipeline.html': {
    by: 'Dev K.',
    title: 'Trunk-based development, six months in',
    source: 'thoughtworks.com',
  },
};

// ---- Dispatch ---------------------------------------------------------------
// New treatments first; anything else falls through to the v4 dispatcher, so the
// eleven v4 directions are untouched by this file.
const Pg5Treatment = (props) => {
  const t = props.cfg.treat;
  const W = window;
  if (t === 'standfirst') return <W.Pg5Standfirst {...props} />;
  if (t === 'bracket') return <W.Pg5Bracket {...props} />;
  if (t === 'chorus') return <W.Pg5Chorus {...props} />;
  if (t === 'slot') return <W.Pg5Slot {...props} />;
  if (t === 'returned') return <W.Pg5Returned {...props} />;
  if (t === 'shelf') return <W.Pg5Shelf {...props} />;
  if (t === 'descend') return <W.Pg5Descend {...props} />;
  return <PGD5_BASE_TREAT {...props} />;
};

// Response-button labels for the new directions, merged into the v4 map so the
// card's Respond control reads in each direction's own idiom.
Object.assign(window.PGD4_RESPOND, {
  standfirst: 'Offer a line',
  bracket: 'Add an aside',
  chorus: 'Add your line',
  slot: 'Fill the slot',
  returned: 'Return to this',
  shelf: 'Pin a card',
  descend: 'Share what it led to',
});

// pg-d4-card keeps a whitelist of treatments that render inside the card body.
// All seven of these are card-visible by design — "we want to see thoughts on
// card" — so extend it. v4's own five stay first, so v4 is unaffected.
window.PGD_INLINE_TREATS = [
  'ledger', 'margin', 'qa', 'same', 'epigraph',
  'standfirst', 'bracket', 'chorus', 'slot', 'returned', 'shelf', 'descend',
];

// Append to the SAME array the v4 app already holds a reference to.
PGD5_DIRS_REF.push(...PGD5_NEW);

Object.assign(window, {
  PGD5_NEW, PGD5_LATE, PGD5_DESCENDANTS, Pg5Treatment,
  Pg4Treatment: Pg5Treatment,   // pg-d4-card reads this at ITS module load, after us
});
