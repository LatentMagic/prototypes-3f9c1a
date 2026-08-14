// ============================================================================
// Discourse v4 — data layer.
//   PGD4_DIRS     eleven directions (baseline + ten), each a fully designed
//                 answer. Structural fields are NOT levers: `treat` is the
//                 typographic treatment of contributed content, `pre` is
//                 whether the sharer's line shows before the read, `cont` is
//                 the continuation discipline in that direction's own idiom.
//   PGD4_ITEMS    the real Backend Pod seed cards with ONE superset of
//                 discourse content attached — every treatment reads the same
//                 fixture differently. That is the exploration.
//   pgd4Resolve() the one place direction + levers + state switches combine.
// Data only — no components.
// ============================================================================

const { CircSeed: PGD4_SEED } = window;

const PGD4_USER = PGD4_SEED.DEFAULT_USER;
const PGD4_POD = PGD4_SEED.seedSpaces(PGD4_USER.email).find((s) => s.id === 'sp-backend');
const pgd4Seed = (url) => PGD4_POD.items.find((i) => i.url === url) || { url };

const PGD4_MEMBERS = ['You', 'Marcus T.', 'Priya N.', 'Sam R.', 'Ada L.', 'Dev K.', 'Lena P.'];

const PGD4_LONG = 'This is the article that made me rethink my last job. Different company, same pattern: the platform team ends up owning every migration nobody else wants, and the org files it as a reliability problem instead of a staffing one. Part two is the bit to read if you read nothing else.';

// Rotating placeholder prompts — the "vanishing prompt" scaffold. Nothing of
// these survives into the record.
const PGD4_PROMPTS = {
  share: ['Why this one, for us?', 'What made you send it?', 'The reason you picked this'],
  respond: ['What stayed with you?', 'The part that landed', 'What you took from it'],
};
const PGD4_SHARE_STEMS = ['Shared because', 'The core insight is', 'Takeaway for us', 'Haven\u2019t read it \u2014'];
const PGD4_REPLY_STEMS = {
  '\u2764\uFE0F': ['This landed because', 'It stayed with me because'],
  '\uD83D\uDD25': ['The part that lit up', 'What I\u2019d act on'],
  '\uD83D\uDC4D': ['Agreed on', 'Where I\u2019d push back'],
  '\uD83D\uDCA1': ['What I\u2019m taking', 'A different angle is'],
  '\uD83D\uDE02': ['The bit that got me', 'Also true for us'],
  none: ['Read it because', 'A different angle is'],
};

// ---- Discourse fixtures ----------------------------------------------------
// One superset per item, ten treatments over it:
//   thought  { by, text, stem:[stem, completion], ask, pre, same:[names] }
//   response { by, text, word, stem, to, q, r, same:[names] }
//              to = the member this note answers (addressed continuation)
//              q  = the same member's later turn, in question register
//              r  = round (rounds open as more of the circle reads)
//   takeaway { by, text }  what the circle took — heads a landed record
//   turns    [{ by, text }]  what was said at the table, after graduation
const PGD4_DISC = {
  'https://newsletter.pragmaticengineer.com/p/scaling-on-call': {
    thought: {
      by: 'Marcus T.',
      text: 'Gist: why measuring platform teams by tickets closed fails. Worth the ten minutes.',
      stem: ['Shared because', 'measuring platform teams by tickets closed keeps failing us'],
      ask: 'Are we measuring the pod by the wrong thing?',
      pre: 'Haven\u2019t read it yet \u2014 sharing because everything from this writer has landed for us.',
      same: ['Priya N.', 'Lena P.'],
    },
    responses: [
      { by: 'Priya N.', text: 'Read it because of your note \u2014 the ending caught me off guard too.', word: 'the ending', stem: ['This landed because', 'the ending caught me off guard too'], to: 'Marcus T.', q: 'Does the ending change what we do about the rota?', r: 1, same: ['Dev K.'] },
      { by: 'Dev K.', text: 'This landed. Can we try the checklist idea this week?', word: 'checklist', stem: ['What I\u2019m taking', 'the checklist, this week if we can'], q: 'Who owns the checklist if we try it?', r: 1 },
    ],
  },
  'https://blog.rust-lang.org/2026/01/async-internals': { thought: null, responses: [] },
  'https://martinfowler.com/articles/cd-pipeline.html': {
    thought: {
      by: 'Sam R.',
      text: 'Haven\u2019t read it yet \u2014 sharing because everything from this writer has landed for us.',
      stem: ['Haven\u2019t read it \u2014', 'everything from this writer has landed for us'],
      ask: 'Worth putting on Thursday?',
      pre: 'Haven\u2019t read it yet \u2014 sharing because everything from this writer has landed for us.',
      same: ['Ada L.'],
    },
    responses: [],
  },
  'https://engineering.stripe-shopfront-example.com/blog/2026/03/how-we-migrated-forty-two-microservices-off-a-shared-postgres-instance-without-downtime': {
    thought: {
      by: 'Dev K.', text: PGD4_LONG,
      stem: ['Shared because', 'the platform team ends up owning every migration nobody else wants'],
      ask: 'Are we about to do this to ourselves?',
      pre: 'Haven\u2019t read past part one \u2014 sharing early because the shape is already familiar.',
      same: [],
    },
    responses: [
      { by: 'Lena P.', text: 'Part two, twice. Then we should talk about the analytics cluster.', word: 'part two', stem: ['The part that lit up', 'part two, and then our analytics cluster'], to: 'Dev K.', q: 'Is the analytics cluster the one we cannot move?', r: 1, same: ['Marcus T.'] },
    ],
  },
  'https://go.dev/blog/pipelines': {
    thought: {
      by: 'Marcus T.',
      text: 'Takeaway for us: our onboarding is exactly the failure he describes in part two.',
      stem: ['Takeaway for us', 'our onboarding is the failure he describes in part two'],
      ask: 'Is our onboarding the same failure he describes?',
      pre: 'Haven\u2019t finished it \u2014 sharing because part two already sounds like us.',
      same: ['Priya N.', 'Ada L.', 'Dev K.'],
    },
    responses: [
      { by: 'Priya N.', text: 'Read it because of your note \u2014 the ending caught me off guard too.', word: 'the ending', stem: ['This landed because', 'the ending caught me off guard too'], to: 'Marcus T.', q: 'Would you hand this to a new starter in week one?', r: 1, same: ['Ada L.', 'Lena P.'] },
      { by: 'Ada L.', text: 'This landed. Can we try the checklist idea this week?', word: 'checklist', stem: ['What I\u2019m taking', 'the checklist idea, this week'], q: 'What would we drop to make room for it?', r: 1 },
      { by: 'Lena P.', text: 'The onboarding doc is three years old. That is the whole argument.', word: 'three years', stem: ['Agreed on', 'the doc being three years past its date'], to: 'Priya N.', r: 2 },
      { by: 'You', text: 'Same \u2014 part two is our onboarding doc, almost line for line.', word: 'same', stem: ['Agreed on', 'part two being our onboarding doc, line for line'], r: 2 },
    ],
    takeaway: { by: 'Marcus T.', text: 'We rewrite onboarding around part two, and Ada\u2019s checklist goes in front of it.' },
    turns: [
      { by: 'Dev K.', text: 'The bit nobody has said yet: the doc is not the problem, the fact that nobody owns it is. Every failure he describes is an ownership failure wearing a documentation costume.' },
      { by: 'Priya N.', text: 'Then the checklist is the ownership \u2014 it is the only artefact with a name against each line. I would start there rather than with a rewrite.' },
    ],
  },
  'https://jvns.ca/blog/2026/02/dns-resolvers/': {
    thought: {
      by: 'Priya N.',
      text: 'Sending this one because I never actually understood resolvers, and now I do.',
      stem: ['The core insight is', 'a resolver is doing far less magic than I assumed'],
      ask: 'Did anyone else quietly not understand resolvers?',
      pre: 'Haven\u2019t read it yet \u2014 sharing because Julia has never once wasted my afternoon.',
      same: ['Marcus T.', 'Dev K.', 'Lena P.', 'Ada L.'],
    },
    responses: [],
  },
  'https://www.kernel.org/doc/html/latest/process/submitting-patches.html': {
    thought: null,
    responses: [
      { by: 'Lena P.', text: 'Bookmarking the checklist at the end \u2014 that alone is worth the read.', word: 'the checklist', stem: ['What I\u2019m taking', 'the checklist at the end'], r: 1, same: ['You'] },
    ],
  },
  'https://go.dev/blog/errors-are-values': {
    thought: {
      by: 'Ada L.',
      text: 'The bit on sentinel errors is the argument I lost last month.',
      stem: ['Shared because', 'the bit on sentinel errors is the argument I lost last month'],
      ask: 'Would you take the sentinel-error side again?',
      pre: 'Haven\u2019t read it yet \u2014 sharing it because the title is the argument I lost last month.',
      same: ['Dev K.'],
    },
    responses: [
      { by: 'You', text: 'You were right. I\u2019d take it again anyway.', word: 'again', stem: ['A different angle is', 'you were right, and I\u2019d take it again anyway'], to: 'Ada L.', r: 1, same: ['Ada L.', 'Marcus T.'] },
    ],
  },
};

// Four unread, four read. Between them: thought / no thought / long thought /
// pre-read register, and nobody-responded / some / everyone, on cards with and
// without a preview image.
const PGD4_ORDER = [
  ['https://martinfowler.com/articles/cd-pipeline.html', false],
  ['https://newsletter.pragmaticengineer.com/p/scaling-on-call', false],
  ['https://blog.rust-lang.org/2026/01/async-internals', false],
  ['https://engineering.stripe-shopfront-example.com/blog/2026/03/how-we-migrated-forty-two-microservices-off-a-shared-postgres-instance-without-downtime', false],
  ['https://go.dev/blog/pipelines', true],
  ['https://jvns.ca/blog/2026/02/dns-resolvers/', true],
  ['https://www.kernel.org/doc/html/latest/process/submitting-patches.html', true],
  ['https://go.dev/blog/errors-are-values', true],
];

// The sharer of a card is whoever the seed says added it — so the attached
// thought is always theirs, and a response never comes from the sharer.
const pgd4Sharer = (attr) => {
  const n = String(attr || '').replace(/^added by\s+/i, '').replace(/([a-z])\.$/, '$1');
  return /^you\.?$/i.test(n) ? 'You' : n;
};

const PGD4_ITEMS = PGD4_ORDER.map(([url, read], i) => {
  const seed = pgd4Seed(url);
  const d = PGD4_DISC[url] || { thought: null, responses: [] };
  const who = pgd4Sharer(seed.attribution);
  const old = d.thought && d.thought.by;
  const thought = d.thought ? { ...d.thought, by: who, same: (d.thought.same || []).filter((n) => n !== who) } : null;
  const responses = (d.responses || [])
    .filter((r) => r.by !== who)
    .map((r) => ({ ...r, to: r.to === old ? who : r.to, same: (r.same || []).filter((n) => n !== r.by) }));
  return {
    ...seed, id: 'd4-' + i, read, sharer: who,
    thought, responses,
    takeaway: d.takeaway || null, turns: d.turns || [],
    // Pre-seeded so each direction's distinctive moment is one touch away: the
    // busiest read item is already at the table.
    onTable: url === 'https://go.dev/blog/pipelines',
  };
});

// ---- The directions --------------------------------------------------------
// treat  the typographic treatment of contributed content (the exploration)
// live   where the record lives: card | margin | back | door | swell | table
// pre    the sharer's line before you have read it: up | held | sealed
// cont   continuation, in this direction's own idiom
// swell  merged (the record replaces the reveal, no timer) | after | is
const PGD4_DIRS = [
  {
    id: 'base', n: '00', name: 'Reaction only', treat: 'none', live: 'none', pre: 'held',
    line: 'Today\u2019s design, unchanged. No words anywhere.',
    respond: 'none', swell: 'is', cont: 'Nothing continues, because nothing was said.',
    claim: 'The calmest possible surface. Nobody is visibly silent.',
    cost: 'A reaction says something landed, never what. The loop never closes.',
    def: { pre: 'held', names: 'named', word: 'same', limit: 0 },
  },
  {
    id: 'invite', n: '01', name: 'The invitation', treat: 'invite', live: 'door', pre: 'up',
    line: 'The sharer\u2019s line is the headline. The article title is the footnote.',
    respond: 'note', swell: 'merged',
    cont: 'Your line is living \u2014 rewrite it until somebody points at it, then it locks.',
    claim: 'The one thing that makes you pick this out of eight is the biggest type on the card.',
    cost: 'The feed stops being scannable by headline. Eight shares become eight paragraphs.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 140 },
  },
  {
    id: 'notes', n: '02', name: 'Passing notes', treat: 'ledger', live: 'card', pre: 'up',
    line: 'Two beats, bracketed as a pair. One note back, addressed to a person.',
    respond: 'note', swell: 'after',
    cont: 'One note to each member who spoke \u2014 marked to them, never nested. Depth is one.',
    claim: 'An exchange that reads as an exchange, and can never grow into a thread.',
    cost: 'Every read opens an empty slot with your name on it.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 140 },
  },
  {
    id: 'margin', n: '03', name: 'Marginalia', treat: 'margin', live: 'margin', pre: 'held',
    line: 'Small notes outside the column, in initials. The card is an annotated object.',
    respond: 'note', swell: 'after',
    cont: 'Keep annotating. A margin has no turns because it is not a conversation.',
    claim: 'No messaging metaphor at all \u2014 the annotated card is the artefact.',
    cost: 'Nobody is answered. Belonging stays ambient.',
    def: { pre: 'held', names: 'muted', word: 'same', limit: 120 },
  },
  {
    id: 'ask', n: '04', name: 'The question', treat: 'qa', live: 'card', pre: 'up',
    line: 'The sharer asks. Answers set under it, visibly subordinate.',
    respond: 'answer', swell: 'after',
    cont: 'Every turn after your first must be a question. The floor is always handed on.',
    claim: 'The exchange has a head and a body, so its legal shape is visible without a rule.',
    cost: 'A grammar. Sometimes you only want to agree.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 140 },
  },
  {
    id: 'same', n: '05', name: 'Same', treat: 'same', live: 'card', pre: 'up',
    line: 'You answer by pointing at a sentence, not by writing another one.',
    respond: 'point', swell: 'merged',
    cont: 'Point at anything, any time. A same cannot itself be samed \u2014 depth stops at one.',
    claim: 'The participation floor is one tap, so the quiet member is not silent.',
    cost: 'One word cannot hold a disagreement.',
    def: { pre: 'up', names: 'muted', word: 'same', limit: 24 },
  },
  {
    id: 'prompt', n: '06', name: 'The vanishing prompt', treat: 'epigraph', live: 'card', pre: 'up',
    line: 'A prompt helps you write and then disappears. Sentences, name after the dash.',
    respond: 'note', swell: 'after',
    cont: 'Say anything, until somebody writes the takeaway that heads the set.',
    claim: 'All of the scaffold, none of the residue \u2014 nothing of the app\u2019s words is in the record.',
    cost: 'The blank box returns for anyone the prompt does not reach.',
    def: { pre: 'up', names: 'named', word: 'same', limit: 140 },
  },
  {
    id: 'stems', n: '07', name: 'Guided statements', treat: 'stem', live: 'back', pre: 'held',
    line: 'Finish a sentence the app starts. The stem stays, on the back of the card.',
    respond: 'stem', swell: 'merged',
    cont: 'Restate \u2014 pick a new stem and replace your old one. One statement each, always current.',
    claim: 'Essays are impossible by grammar, and the blank box never appears.',
    cost: 'The app\u2019s words are in the record forever, in bold, above yours.',
    def: { pre: 'held', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'door', n: '08', name: 'Inside the door', treat: 'rows', live: 'door', pre: 'sealed',
    line: 'Both queues stay silent. The door holds glyphs and words as one record.',
    respond: 'note', swell: 'merged',
    cont: 'Answer one person inside the record. A new round opens as more of the circle reads it.',
    claim: 'The card never grows, and the reveal stops being a timer \u2014 it becomes the record.',
    cost: 'Discourse you cannot see from the feed is discourse nobody goes looking for.',
    def: { pre: 'sealed', names: 'named', word: 'same', limit: 140 },
  },
  {
    id: 'swell', n: '09', name: 'The Swell speaks', treat: 'labels', live: 'swell', pre: 'sealed',
    line: 'Words surface from the disc, pinned at their author\u2019s glyph. Then they fade.',
    respond: 'note', swell: 'merged',
    cont: 'Nothing continues. The moment is the whole of it \u2014 only the shape is kept.',
    claim: 'Discourse merged into the gesture completely. The queues stay visually silent.',
    cost: 'An exchange nobody can refer back to.',
    def: { pre: 'sealed', names: 'named', word: 'same', limit: 90 },
  },
  {
    id: 'table', n: '10', name: 'The Table', treat: 'page', live: 'table', pre: 'held',
    line: 'One quiet line on the card. A page you walk to, and the only place you may speak twice.',
    respond: 'note', swell: 'after',
    cont: 'The table is continuation. Speak as often as you like there; anyone may land it and drain it.',
    claim: 'A lens over the same library \u2014 nothing is moved, and the room has an exit.',
    cost: 'A place you enter is a place you can forget to enter.',
    def: { pre: 'held', names: 'named', word: 'same', limit: 240 },
  },
];

// ---- Levers — six, folded away, secondary ----------------------------------
const PGD4_LEVERS = [
  { key: 'pre', label: 'Sharer\u2019s line', opts: [['auto', 'Auto'], ['up', 'Up front'], ['held', 'Held']] },
  { key: 'names', label: 'Names', opts: [['auto', 'Auto'], ['named', 'Named'], ['muted', 'Muted']] },
  { key: 'word', label: 'The word', opts: [['auto', 'Auto'], ['same', 'Same'], ['echo', 'Echo']] },
  { key: 'limit', label: 'Length', opts: [['auto', 'Auto'], ['90', '90'], ['140', '140'], ['240', '240']] },
  { key: 'sThought', label: 'Thoughts', opts: [['auto', 'As seeded'], ['none', 'None'], ['long', 'Long'], ['pre', 'Pre-read']] },
  { key: 'sResp', label: 'Responses', opts: [['auto', 'As seeded'], ['none', 'Nobody yet'], ['all', 'Everyone']] },
];
const PGD4_DEFAULT_OV = PGD4_LEVERS.reduce((a, l) => (a[l.key] = 'auto', a), {});

const pgd4Merge = (dir, ov) => {
  const c = { ...dir.def, treat: dir.treat, live: dir.live, respond: dir.respond, swell: dir.swell, id: dir.id };
  Object.keys(ov || {}).forEach((k) => {
    const v = ov[k];
    if (v == null || v === 'auto') return;
    c[k] = k === 'limit' ? Number(v) : v;
  });
  if (dir.id === 'base') { c.pre = 'held'; c.respond = 'none'; }
  return c;
};

// ---- One derivation point --------------------------------------------------
// Reveal-on-read: what another member said is never visible until you have read
// the item. Whether the SHARER'S line is protected by that is a per-direction
// answer (`pre`), not a rule — which is the tension the set exists to show.
const pgd4Resolve = (item, cfg, dir) => {
  const off = cfg.respond === 'none';
  let thought = item.thought;
  if (off || cfg.sThought === 'none') thought = null;
  else if (thought && cfg.sThought === 'long') thought = { ...thought, text: PGD4_LONG };
  else if (thought && cfg.sThought === 'pre') thought = { ...thought, text: thought.pre };

  let responses = off ? [] : (item.responses || []);
  if (cfg.sResp === 'none') responses = [];
  else if (cfg.sResp === 'all' && item.read) {
    const have = responses.map((r) => r.by);
    responses = [...responses, ...PGD4_MEMBERS.filter((m) => !have.includes(m)).slice(0, 3).map((m) => ({
      by: m, text: 'Read it because of the note. Worth the time.', word: 'worth it', r: 1,
      stem: ['Agreed on', 'the whole of part two'], same: [],
    }))];
  }

  const sealed = !item.read;
  const mine = responses.find((r) => r.by === 'You') || null;
  const showThought = !!thought && (!sealed || cfg.pre === 'up');
  const rounds = responses.reduce((m, r) => Math.max(m, r.r || 1), 1);
  return {
    thought, responses, sealed, mine, showThought, rounds,
    takeaway: off || cfg.treat !== 'epigraph' ? null : item.takeaway,
    // An unread card may carry a presence marker, never content.
    marker: sealed && !showThought && dir.live !== 'door' && dir.live !== 'swell' && (thought || responses.length) ? (dir.id === 'ask' ? 'a question' : 'a note') : null,
    // The micro dot: the door holds words you have not seen.
    dot: !sealed && dir.live === 'door' && !!(thought || responses.length),
    canRespond: !sealed && !mine && cfg.respond !== 'none',
    count: responses.length + (thought ? 1 : 0),
  };
};

Object.assign(window, {
  PGD4_DIRS, PGD4_LEVERS, PGD4_DEFAULT_OV, PGD4_ITEMS, PGD4_USER, PGD4_MEMBERS,
  PGD4_PROMPTS, PGD4_SHARE_STEMS, PGD4_REPLY_STEMS, PGD4_LONG, pgd4Merge, pgd4Resolve,
});
