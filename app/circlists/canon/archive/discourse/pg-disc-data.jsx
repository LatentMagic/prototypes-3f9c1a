// ============================================================================
// Discourse playground — data layer.
//   PGD_OPTIONS   the seven directions + the reaction-only baseline, each with
//                 its own intended answer to every lever (`def`).
//   PGD_LEVERS    the heading's config controls (Auto + explicit override).
//   PGD_ITEMS     the real Backend Pod seed cards (URL, title, source, image,
//                 reactions) with discourse content attached on top.
//   pgdResolve()  the ONE place option + overrides + state switches combine
//                 into what a card actually shows.
// Data only — no components.
// ============================================================================

const { CircSeed: PGD_SEED } = window;

const PGD_USER = PGD_SEED.DEFAULT_USER;
const PGD_BACKEND = PGD_SEED.seedSpaces(PGD_USER.email).find((s) => s.id === 'sp-backend');
const pgdSeedItem = (url) => PGD_BACKEND.items.find((i) => i.url === url) || { url };

// ---- Discourse fixtures ----------------------------------------------------
// thought: what the sharer attached. Registers span the spectrum the brief asks
// for — functional gist, pre-read trust, personal, takeaway, question.
//   text   the plain note (options that take a free line)
//   stem   [stem, completion] for the guided-statement option
//   ask    the question form (the question option)
//   pre    the same share written as pre-read trust (the "shared before
//          reading" state switch swaps every thought to this register)
// responses: what came back. word = the one-word echo; text = the short note.
const PGD_LONG = 'This is the article that made me rethink my last job. Different company, same pattern: the platform team ends up owning every migration nobody else wants, and the org files it as a reliability problem instead of a staffing one. Part two is the bit to read if you read nothing else.';

const PGD_DISC = {
  'https://newsletter.pragmaticengineer.com/p/scaling-on-call': {
    thought: {
      by: 'Marcus T.',
      text: 'Gist: why measuring platform teams by tickets closed fails. Worth the ten minutes.',
      stem: ['Shared because', 'measuring platform teams by tickets closed keeps failing us'],
      ask: 'Are we measuring the pod by the wrong thing?',
      pre: 'Haven\u2019t read it yet \u2014 sharing because everything from this writer has landed for us.',
    },
    responses: [
      { by: 'Priya N.', text: 'Read it because of your note \u2014 the ending caught me off guard too.', word: 'the ending', stem: ['This landed because', 'the ending caught me off guard too'] },
      { by: 'Dev K.', text: 'This landed. Can we try the checklist idea this week?', word: 'checklist', stem: ['What I\u2019m taking', 'the checklist, this week if we can'] },
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
      unread: true,
    },
    responses: [],
  },
  'https://engineering.stripe-shopfront-example.com/blog/2026/03/how-we-migrated-forty-two-microservices-off-a-shared-postgres-instance-without-downtime': {
    thought: {
      by: 'Dev K.', text: PGD_LONG,
      stem: ['Shared because', 'the platform team ends up owning every migration nobody else wants'],
      ask: 'Are we about to do this to ourselves?',
      pre: 'Haven\u2019t read past part one \u2014 sharing early because the shape is already familiar.',
    },
    responses: [{ by: 'Lena P.', text: 'Part two, twice. Then we should talk about the analytics cluster.', word: 'part two', stem: ['The part that lit up', 'part two, and then our analytics cluster'] }],
  },
  'https://go.dev/blog/pipelines': {
    thought: {
      by: 'Marcus T.',
      text: 'Takeaway for us: our onboarding is exactly the failure he describes in part two.',
      stem: ['Takeaway for us', 'our onboarding is the failure he describes in part two'],
      ask: 'Is our onboarding the same failure he describes?',
      pre: 'Haven\u2019t finished it \u2014 sharing because part two already sounds like us.',
    },
    responses: [
      { by: 'Priya N.', text: 'Read it because of your note \u2014 the ending caught me off guard too.', word: 'the ending', stem: ['This landed because', 'the ending caught me off guard too'] },
      { by: 'Ada L.', text: 'This landed. Can we try the checklist idea this week?', word: 'checklist', stem: ['What I\u2019m taking', 'the checklist idea, this week'] },
      { by: 'You', text: 'Same \u2014 part two is our onboarding doc, almost line for line.', word: 'same', stem: ['Agreed on', 'part two being our onboarding doc, line for line'] },
    ],
  },
  'https://jvns.ca/blog/2026/02/dns-resolvers/': {
    thought: {
      by: 'Priya N.',
      text: 'Sending this one because I never actually understood resolvers, and now I do.',
      stem: ['The core insight is', 'a resolver is doing far less magic than I assumed'],
      ask: 'Did anyone else quietly not understand resolvers?',
      pre: 'Haven\u2019t read it yet \u2014 sharing because Julia has never once wasted my afternoon.',
    },
    responses: [],
  },
  'https://www.kernel.org/doc/html/latest/process/submitting-patches.html': {
    thought: null,
    responses: [{ by: 'Lena P.', text: 'Bookmarking the checklist at the end \u2014 that alone is worth the read.', word: 'the checklist', stem: ['What I\u2019m taking', 'the checklist at the end'] }],
  },
  'https://go.dev/blog/errors-are-values': {
    thought: {
      by: 'Ada L.',
      text: 'The bit on sentinel errors is the argument I lost last month.',
      stem: ['Shared because', 'the bit on sentinel errors is the argument I lost last month'],
      ask: 'Would you take the sentinel-error side again?',
      pre: 'Haven\u2019t read it yet \u2014 sharing it because the title is the argument I lost last month.',
    },
    responses: [{ by: 'You', text: 'You were right. I\u2019d take it again anyway.', word: 'again', stem: ['A different angle is', 'you were right, and I\u2019d take it again anyway'] }],
  },
};

// Feed order: four unread (Active), four read (Read). Between them they cover
// thought / no thought / long thought / pre-read register, and nobody-responded
// / some / everyone, on cards with and without a preview image.
const PGD_ORDER = [
  ['https://newsletter.pragmaticengineer.com/p/scaling-on-call', false],
  ['https://blog.rust-lang.org/2026/01/async-internals', false],
  ['https://martinfowler.com/articles/cd-pipeline.html', false],
  ['https://engineering.stripe-shopfront-example.com/blog/2026/03/how-we-migrated-forty-two-microservices-off-a-shared-postgres-instance-without-downtime', false],
  ['https://go.dev/blog/pipelines', true],
  ['https://jvns.ca/blog/2026/02/dns-resolvers/', true],
  ['https://www.kernel.org/doc/html/latest/process/submitting-patches.html', true],
  ['https://go.dev/blog/errors-are-values', true],
];

const PGD_ITEMS = PGD_ORDER.map(([url, read], i) => {
  const seed = pgdSeedItem(url);
  const d = PGD_DISC[url] || { thought: null, responses: [] };
  // Preview paths in the seed are app-root relative; this page sits three deep.
  const image = seed.image ? '../../../' + seed.image : undefined;
  return { ...seed, image, id: 'pgd-' + i, read, thought: d.thought, responses: d.responses };
});

const PGD_MEMBERS = ['You', 'Marcus T.', 'Priya N.', 'Sam R.', 'Ada L.', 'Dev K.', 'Lena P.'];

// ---- Response stems, keyed by the glyph you just left ----------------------
// The guided-statement option merges with the Swell literally: the reaction you
// leave decides which sentence you are offered to finish.
const PGD_SHARE_STEMS = ['Shared because', 'The core insight is', 'Takeaway for us', 'Haven\u2019t read it \u2014'];
const PGD_REPLY_STEMS = {
  '\u2764\uFE0F': ['This landed because', 'It stayed with me because'],
  '\uD83D\uDD25': ['The part that lit up', 'What I\u2019d act on'],
  '\uD83D\uDC4D': ['Agreed on', 'Where I\u2019d push back'],
  '\uD83D\uDCA1': ['What I\u2019m taking', 'A different angle is'],
  '\uD83D\uDE02': ['The bit that got me', 'Also true for us'],
  none: ['Read it because', 'A different angle is'],
};

// ---- The options -----------------------------------------------------------
// `def` is each option's OWN intended answer to every lever. The heading's
// controls default to Auto (= use this) and can override any single one.
const PGD_OPTIONS = [
  {
    id: 'baseline', n: '00', name: 'Reaction only', kind: 'baseline',
    line: 'Today\u2019s design, unchanged \u2014 the Swell and the door, and no words anywhere.',
    claim: 'The calmest possible surface. Nothing to write, nothing to miss, no one visibly silent.',
    cost: 'A reaction says something landed, never what. The loop never closes and the circle never feels like a room.',
    from: 'Baseline reference \u2014 what ships today.',
    def: { attach: 'none', home: 'none', reveal: 'none', respond: 'none', limit: 0, marker: 'hidden', whose: 'none', persist: 'n/a', attrib: 'named' },
  },
  {
    id: 'notes', n: '01', name: 'Passing notes',
    line: 'A two-beat exchange: one thought out, one note back per member.',
    claim: 'Brevity is structural \u2014 the shape holds exactly two turns, so it can never grow into a thread. The card becomes a small stack of paired exchanges you can read at a glance.',
    cost: 'Every read now opens an empty slot with your name on it. The quiet reader is the one who feels it.',
    from: 'Claude seed 1.',
    def: { attach: 'nudge', home: 'card', reveal: 'after', respond: 'note', limit: 140, marker: 'quiet', whose: 'sharer', persist: 'forever', attrib: 'named' },
  },
  {
    id: 'margin', n: '02', name: 'Marginalia',
    line: 'Short notes hang in the card\u2019s margin. They annotate the link, never each other.',
    claim: 'No messaging metaphor at all \u2014 the circle passes an annotated object around, like a family book. The annotated card IS the artefact, so referring back and sharing out need no extra surface.',
    cost: 'A margin note has no addressee, so nobody is answered. Belonging stays ambient rather than reciprocal.',
    from: 'Claude seed 2.',
    def: { attach: 'optional', home: 'margin', reveal: 'after', respond: 'note', limit: 120, marker: 'quiet', whose: 'any', persist: 'forever', attrib: 'muted' },
  },
  {
    id: 'table', n: '03', name: 'The Table',
    line: 'A third tab beside Active and Read. Cards graduate to it the moment something is said.',
    claim: 'The queue stays perfectly calm and belonging becomes visible geography \u2014 you walk into a room and see your circle gathered around the things that sparked something.',
    cost: 'A place you choose to enter is a place you can forget to enter. Discourse competes with reading instead of riding along with it.',
    from: 'Claude seed 3.',
    def: { attach: 'nudge', home: 'table', reveal: 'after', respond: 'note', limit: 140, marker: 'hidden', whose: 'any', persist: 'forever', attrib: 'named' },
  },
  {
    id: 'stems', n: '04', name: 'Guided statements',
    line: 'Both halves finish a sentence stem \u2014 and your reaction picks which stems you\u2019re offered.',
    claim: 'Essays are impossible by grammar, not by rule, and the blank-box barrier disappears. Merged with the Swell outright: the glyph you leave selects the sentence you complete.',
    cost: 'The stems put words in your mouth. Done badly the whole circle reads like a form someone filled in.',
    from: 'Ideator seed 2, merged with the glyph-picks-the-stem idea.',
    def: { attach: 'nudge', home: 'back', reveal: 'swell', respond: 'stem', limit: 90, marker: 'quiet', whose: 'sharer', persist: 'forever', attrib: 'named' },
  },
  {
    id: 'door', n: '05', name: 'Inside the door',
    line: 'A preface unseals with the Swell; the epilogue is written in the same breath, and both live in the Reaction door.',
    claim: 'The feed and both queues stay completely silent \u2014 discourse never leaks onto a card. The exchange reads as a conclusive handshake at the moment of loop closure, contained by the boundary that already exists.',
    cost: 'Discourse you cannot see from the feed is discourse most members never go looking for. The magic is behind a door.',
    from: 'Ideator seeds 1 and 3, merged \u2014 both put the exchange inside the reaction boundary; one made it permanent, the other momentary. This keeps the moment AND the record.',
    def: { attach: 'nudge', home: 'door', reveal: 'swell', respond: 'note', limit: 140, marker: 'hidden', whose: 'sharer', persist: 'forever', attrib: 'named' },
  },
  {
    id: 'echo', n: '06', name: 'The Echo',
    line: 'You respond by pointing, not writing: echo the thought, and add one word at most.',
    claim: 'Nothing to compose, so everybody answers \u2014 the participation floor is a single tap. Being echoed by name, on your own sentence, is the belonging signal a glyph can\u2019t carry.',
    cost: 'One word cannot hold a disagreement. The loop closes warmly and shallowly, every time.',
    from: 'Our own \u2014 what the prototype suggests once you accept that the response never needs to be prose.',
    def: { attach: 'nudge', home: 'card', reveal: 'swell', respond: 'echo', limit: 24, marker: 'quiet', whose: 'sharer', persist: 'forever', attrib: 'muted' },
  },
  {
    id: 'ask', n: '07', name: 'The question',
    line: 'The attached thought is a question, so the response has somewhere to land.',
    claim: 'A reading circle\u2019s real shape. Answers are short because a specific question makes them short, and the sharer gets the one thing a reaction can never give: an answer.',
    cost: 'Not every link has a question in it, and asked badly it turns reading into homework.',
    from: 'Our own \u2014 the inverse of \u201Cwhy I shared\u201D: the thought is for the reader, not about the sharer.',
    def: { attach: 'nudge', home: 'card', reveal: 'after', respond: 'answer', limit: 140, marker: 'quiet', whose: 'sharer', persist: 'forever', attrib: 'named' },
  },
];

// ---- Levers ----------------------------------------------------------------
// group 'shape' = what discourse IS; group 'state' = what data it is standing on.
const PGD_LEVERS = [
  { key: 'attach', group: 'shape', label: 'Attach', opts: [['auto', 'Auto'], ['required', 'Required'], ['nudge', 'Nudged'], ['optional', 'Optional']] },
  { key: 'marker', group: 'shape', label: 'Unread marker', opts: [['auto', 'Auto'], ['hidden', 'Hidden'], ['quiet', 'Quiet']] },
  { key: 'reveal', group: 'shape', label: 'Respond at', opts: [['auto', 'Auto'], ['swell', 'The Swell'], ['after', 'After'], ['place', 'Its place']] },
  { key: 'respond', group: 'shape', label: 'Response', opts: [['auto', 'Auto'], ['note', 'Note'], ['word', 'One word'], ['echo', 'Echo']] },
  { key: 'limit', group: 'shape', label: 'Length', opts: [['auto', 'Auto'], ['90', '90'], ['140', '140'], ['240', '240']] },
  { key: 'attrib', group: 'shape', label: 'Names', opts: [['auto', 'Auto'], ['named', 'Named'], ['muted', 'Muted']] },
  { key: 'sThought', group: 'state', label: 'Thoughts', opts: [['auto', 'As seeded'], ['none', 'None attached'], ['long', 'Long']] },
  { key: 'sResp', group: 'state', label: 'Responses', opts: [['auto', 'As seeded'], ['none', 'Nobody yet'], ['all', 'Everyone']] },
  { key: 'sPre', group: 'state', label: 'Shared pre-read', opts: [['auto', 'As seeded'], ['on', 'All of them']] },
];
const PGD_DEFAULT_CFG = PGD_LEVERS.reduce((a, l) => (a[l.key] = 'auto', a), {});

// Human words for the readout panel — every lever position, per option.
const PGD_WORDS = {
  attach: { none: 'nothing to attach', required: 'required at share', nudge: 'nudged, skippable', optional: 'fully optional' },
  home: { none: 'nowhere \u2014 reactions only', card: 'on the card', margin: 'in the card\u2019s margin', table: 'a third tab', door: 'inside the Reaction door', back: 'the back of the card' },
  reveal: { none: 'n/a', swell: 'in the Swell, at mark-read', after: 'after the reveal', place: 'only where it lives' },
  respond: { none: 'reaction only', note: 'a short note back', stem: 'a completed sentence', echo: 'an echo, plus a word', answer: 'an answer to the question', word: 'one word' },
  whose: { none: 'n/a', sharer: 'the sharer\u2019s alone', any: 'any member\u2019s' },
  persist: { 'n/a': 'n/a', forever: 'stays on the card', fades: 'fades after a while' },
  attrib: { named: 'named', muted: 'avatar, name on tap' },
};

const pgdMergeCfg = (option, ov) => {
  const c = { ...option.def };
  Object.keys(ov || {}).forEach((k) => {
    const v = ov[k];
    if (v == null || v === 'auto') return;
    if (k === 'limit') { c.limit = Number(v); return; }
    if (k[0] === 's') { c[k] = v; return; }        // state switches ride along
    c[k] = v;
  });
  if (option.def.home === 'none') { c.respond = 'none'; c.attach = 'none'; c.reveal = 'none'; }  // baseline never gains discourse
  return c;
};

// ---- One derivation point --------------------------------------------------
// Everything a card shows about discourse comes out of here: the state switches
// are applied, reveal-on-read masking is applied, and the result says plainly
// what the card may render.
const pgdResolve = (item, cfg, opt) => {
  const none = cfg.home === 'none';
  let thought = item.thought;
  if (none || cfg.sThought === 'none') thought = null;
  else if (thought && cfg.sThought === 'long') thought = { ...thought, text: PGD_LONG };
  if (thought && cfg.sPre === 'on') thought = { ...thought, text: thought.pre || thought.text, unread: true };

  let responses = none ? [] : (item.responses || []);
  if (cfg.sResp === 'none') responses = [];
  else if (cfg.sResp === 'all' && item.read) {
    const have = responses.map((r) => r.by);
    const extra = PGD_MEMBERS.filter((m) => !have.includes(m)).slice(0, 3).map((m) => ({
      by: m, text: 'Read it because of the note. Worth the time.', word: 'worth it',
      stem: ['Agreed on', 'the whole of part two'],
    }));
    responses = [...responses, ...extra];
  }
  // Reveal-on-read: nothing another member attached is visible until YOU have
  // read the item. Unread cards may show a presence marker, never content.
  const sealed = !item.read;
  const mine = responses.find((r) => r.by === 'You') || null;
  return {
    thought, responses, sealed, mine,
    marker: sealed && cfg.marker === 'quiet' && (thought || responses.length) ? (opt.id === 'ask' ? 'question' : 'note') : null,
    canRespond: !sealed && !mine && cfg.respond !== 'none',
    count: responses.length,
  };
};

Object.assign(window, {
  PGD_OPTIONS, PGD_LEVERS, PGD_DEFAULT_CFG, PGD_ITEMS, PGD_USER, PGD_MEMBERS,
  PGD_WORDS, PGD_SHARE_STEMS, PGD_REPLY_STEMS, PGD_LONG, pgdMergeCfg, pgdResolve,
});
