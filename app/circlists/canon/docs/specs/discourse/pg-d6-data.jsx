// ============================================================================
// Discourse v6 — thirteen MECHANISMS.
//
// v5 shipped seven treatments and the client rejected the framing outright:
//
//   "The only thing that is there is that you came up with five to ten tweaks
//    of how to present a quote. You didn't ground at all with what was trying
//    to be achieved."
//
// He was right. v5 varied TYPOGRAPHY — an italic deck, inline brackets, small
// caps, a ruled slot — when what was needed was variation in MECHANISM: what
// the act of contributing IS, when it is possible, what it costs, what it
// produces, and how it relates to the reaction primitive the app already has.
//
// So each of these thirteen is a SYSTEM, and the rule that defines it comes
// first. If two rules are the same with different type, one of them is wrong.
// Full reasoning, the six client questions laid out as design axes, and the
// coverage proof: ideation-2026-08-05-discourse-v6-mechanics.md
//
// Load AFTER pg-d4-content + the v6 treatment files, BEFORE pg-d4-card.
// Additive: v4 and v5 are untouched when this file is not loaded.
// ============================================================================

const { PGD4_DIRS: PGD6_DIRS_REF, Pg4Treatment: PGD6_BASE_TREAT } = window;

const PGD6_NEW = [
  {
    id: 'secondpass', n: '19', name: 'The second pass',
    treat: 'm1', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'You cannot write at the moment of reading. The item comes back to you once, later, and only then are words possible.',
    cont: 'Each member’s second pass is their own, so lines accumulate as the circle drifts through. Ends when everyone has had their pass.',
    claim: 'Content that is actually considered, because it is structurally impossible to write in the first ten seconds.',
    cost: 'A returning item is the closest thing here to a to-do. It must read as offered, never owed.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'changeofheart', n: '20', name: 'Change of heart',
    treat: 'm2', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'Words unlock only when your reaction moves. Shift your glyph and the app asks what changed.',
    cont: 'Revivable and self-limiting. Each move overwrites the last trail — start and present, never the wobble between.',
    claim: 'The only mechanism where the reaction IS the door into discourse, so the two can never drift apart.',
    cost: 'Most items change nobody’s mind, so most items stay silent. Good for calm, a real problem for liveliness.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'passage', n: '21', name: 'The passage',
    treat: 'm3', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'You may not write prose. You mark a passage from the piece, and up to eight words beside it.',
    cont: 'Continuous and self-limiting. Two people marking the same passage produces no new content — it thickens the rule beside it.',
    claim: 'Grounds discourse in the text rather than in the members. The article does the talking; the circle chooses.',
    cost: 'Videos and podcasts have no passages. Needs a timestamp fallback, which is a second design.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'standing', n: '22', name: 'The standing note',
    treat: 'm4', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'One line per member, forever, rewritable. The card shows what the circle currently thinks, never what it has thought.',
    cont: 'Continuous in permission, static in volume. The record never grows; it ripens.',
    claim: 'Makes an old item worth revisiting — the record is current rather than archival. Bloat is mathematically impossible.',
    cost: 'Erases exchange. Ten members produce ten monologues that happen to sit together.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'heldline', n: '23', name: 'The held line',
    treat: 'm5', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'The item holds one line for the whole circle. To speak you must replace what is there — and the person you replaced sees it.',
    cont: 'Unbounded but expensive. The superseded lines stack behind the door as the item’s history of being understood.',
    claim: 'The card never grows by a pixel, and saying something costs displacing a named person.',
    cost: 'Genuinely confrontational. In a circle of friends it may simply freeze everyone.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'weather', n: '24', name: 'The weather',
    treat: 'm6', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'There are no messages. Words attach to a glyph as its label, and the card renders a sentence derived from the constellation.',
    cont: 'Always current, never a transcript. The sentence changes as the constellation does.',
    claim: 'One or two lines no matter how many members. The only mechanism whose card content is computed, not authored.',
    cost: 'A derived sentence is the app talking, not the circle. Get the phrasing wrong and it reads as a machine ventriloquising friends.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'handing', n: '25', name: 'The handing on',
    treat: 'm7', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'A thought is not left on an item. It is given to the next member who reads it, and shown to them before they read.',
    cont: 'A chain, one link at a time. Never more than one line per handoff.',
    claim: 'Turns a note into a gift with an addressee, which is the warmest act available anywhere in the set.',
    cost: 'Priming someone before they read is an intervention. It may spoil the piece.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'baton', n: '26', name: 'The baton',
    treat: 'm8', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'One member holds the floor at a time. You take it, say your piece, and pass it or let it lapse.',
    cont: 'Unlimited — the answer to "can we keep talking?" is yes. Made non-Slack by strict serialisation, not by a cap.',
    claim: 'The only mechanism that allows indefinite conversation while keeping the card at two lines, ever.',
    cost: 'A held floor is a queue, and a queue is pressure. The lapse timer is doing enormous unseen work.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'closing', n: '27', name: 'The closing',
    treat: 'm9', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'Nothing may be said while the item is live. The last read closes it, and closing opens one blind round revealed together.',
    cont: 'Bounded, exactly once. The item seals and is never reopened.',
    claim: 'Manufactures simultaneity in a product where nobody is ever present at once. Active stays perfectly silent.',
    cost: 'A circle that never finishes an item never gets to speak about it at all.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'ink', n: '28', name: 'Ink',
    treat: 'm10', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'A small, slowly replenishing budget of words across the whole circle. Reactions stay free and infinite.',
    cont: 'Continuous but rationed. You may always speak; you may not always afford to.',
    claim: 'Scarcity that is felt at the composer rather than policed on the card, and it makes choosing where to speak the act.',
    cost: 'A budget is a game mechanic, and a game mechanic in a calm reading app is a tonal risk.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'quorum', n: '29', name: 'The quorum',
    treat: 'm11', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'Words are written freely but revealed to nobody until enough of the circle has read. Discourse arrives all at once, or not at all.',
    cont: 'One reveal per item, then ordinary accretion. Before quorum the card carries a single word: held.',
    claim: 'Nobody is influenced by what anybody else said, because nobody has seen it. The most honest set of first reactions available.',
    cost: 'If the circle never reaches quorum, everything written is lost. Writing into a void that may stay a void.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'secondreader', n: '30', name: 'The second reader',
    treat: 'm12', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'The sharer’s thought is sealed and released to each member as they finish — and only they can answer it, once, privately.',
    cont: 'One exchange per member, in parallel, never merging. The sharer has a different conversation with each person.',
    claim: 'Zero footprint on the feed and the most intimate register in the set: it is a letter, not a post.',
    cost: 'Nobody sees the circle thinking. The communal library gains nothing.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'shelf6', n: '31', name: 'The gathering',
    treat: 'm13', live: 'card', pre: 'up', respond: 'note', swell: 'after',
    line: 'Discourse does not attach to items. The circle’s reading is periodically gathered into one spread, and a member lands it.',
    cont: 'Episodic by period, not by item. Each gathering closes when the next one opens.',
    claim: 'Discourse lives in time rather than on objects, so the queue can never bloat by a single line.',
    cost: 'Loses the link between a thought and the thing it was about. The heaviest departure from the app as it stands.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 90 },
  },
];

// ---- Dispatch ---------------------------------------------------------------
// New mechanisms first; anything else falls through to the v5/v4 dispatcher, so
// the eighteen directions before these are untouched by this file.
const PGD6_MAP = {
  m1: 'Pg6SecondPass', m2: 'Pg6ChangeOfHeart', m3: 'Pg6Passage', m4: 'Pg6Standing',
  m5: 'Pg6HeldLine', m6: 'Pg6Weather', m7: 'Pg6Handing', m8: 'Pg6Baton',
  m9: 'Pg6Closing', m10: 'Pg6Ink', m11: 'Pg6Quorum', m12: 'Pg6SecondReader',
  m13: 'Pg6Gathering',
};

const Pg6Treatment = (props) => {
  const name = PGD6_MAP[props.cfg.treat];
  const C = name ? window[name] : null;
  if (C) return <C {...props} />;
  return <PGD6_BASE_TREAT {...props} />;
};

// Response-button labels, merged into the existing map so each mechanism's
// control reads in its own idiom. The label IS part of the mechanism here —
// "Take the floor" and "Replace the line" are different acts.
// Keyed by DIRECTION ID, not by treat code — Pg4Respond looks up `dir.id`.
Object.assign(window.PGD4_RESPOND, {
  secondpass: 'On second pass', changeofheart: 'Move your reaction', passage: 'Mark a passage',
  standing: 'Set your line', heldline: 'Replace the line', weather: 'Label your glyph',
  handing: 'Hand it on', baton: 'Take the floor', closing: 'Wait for the close',
  ink: 'Spend a line', quorum: 'Write into the hold', secondreader: 'Answer privately',
  shelf6: 'Add to the gathering',
});

// pg-d4-card keeps a whitelist of treatments that render inside the card body.
// All thirteen are card-visible except the two that are deliberately invisible
// to the feed (m12 The second reader, m13 The gathering) — those still register
// so their claim and cost are readable in the playground's table.
window.PGD_INLINE_TREATS = (window.PGD_INLINE_TREATS || [
  'ledger', 'margin', 'qa', 'same', 'epigraph',
]).concat(['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13']);

// Append to the SAME array the app already holds a reference to.
PGD6_DIRS_REF.push(...PGD6_NEW);

Object.assign(window, {
  PGD6_NEW, PGD6_MAP, Pg6Treatment,
  Pg4Treatment: Pg6Treatment,   // pg-d4-card reads this at ITS module load, after us
});
