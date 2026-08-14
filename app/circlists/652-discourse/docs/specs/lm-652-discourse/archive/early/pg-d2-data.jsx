// ============================================================================
// Discourse v2 — data layer.
//   D2_SPINE     the settled shape (Part 3 of the ideation doc) as lever answers
//   D2_OPTIONS   K0–K6: seven answers to "what happens when one line isn't enough"
//   D2_LEVERS    the config controls (Auto + explicit override)
//   D2_ITEMS     real Backend Pod seed cards with a preface, voices and a table
//                state attached on top
//   d2Resolve()  the ONE place option + overrides + state switches become what a
//                surface may render
// Data only — no components.
// ============================================================================

const { CircSeed: D2_SEED } = window;

const D2_USER = D2_SEED.DEFAULT_USER;
const D2_BACKEND = D2_SEED.seedSpaces(D2_USER.email).find((s) => s.id === 'sp-backend');
const d2Seed = (url) => D2_BACKEND.items.find((i) => i.url === url) || { url, attribution: 'Added by you', reactions: [] };
const D2_MEMBERS = ['Marcus T.', 'Priya N.', 'Sam R.', 'Ada L.', 'Dev K.', 'Lena P.'];
const D2_LONG = 'This is the piece that made me rethink my last job. Different company, same pattern: the platform team ends up owning every migration nobody else wants, and the org files it as a reliability problem instead of a staffing one. Part two is the bit to take if you take nothing else.';

// ---- Fixtures --------------------------------------------------------------
// preface : what the sharer attached. { by, text, ask, seal } — `ask` is the
//           question register, `seal` marks a line its author kept back.
// voices  : what the circle said once they had read it. { by, line, echoes, to, r }
//           echoes = who pointed at that line; to = the member it answers;
//           r = which round it belongs to (only rendered by the rounds option).
// table   : the continued exchange. { on, by, turns:[{by,text}], landed }
// rx      : reactions appended to the seed's own roster, so a fixture can give
//           an item a fuller disc without editing app/seed-data.jsx.
const D2_FIX = {
  'https://newsletter.pragmaticengineer.com/p/scaling-on-call': {
    preface: { by: 'You', text: 'Why measuring platform teams by tickets closed keeps failing us. Ten minutes.' },
    voices: [
      { by: 'Priya N.', line: 'The ending caught me off guard. We are the third example.', echoes: ['Marcus T.', 'Dev K.'] },
      { by: 'Marcus T.', line: 'Worth putting the checklist somewhere we will actually see it.', echoes: [] },
    ],
  },
  'https://blog.rust-lang.org/2026/01/async-internals': { preface: null, voices: [] },
  'https://martinfowler.com/articles/cd-pipeline.html': {
    preface: { by: 'Sam R.', text: 'Not through it yet — sharing early because everything from this writer has landed for us.' },
    voices: [{ by: 'Priya N.', line: 'Skim the middle, the last section is the argument.', echoes: [] }],
  },
  'https://danluu.com/percentile-latency/': {
    preface: { by: 'Sam R.', ask: 'Are we watching the wrong percentile?', text: 'The p50 we report every week is the one number he says lies.', seal: true },
    voices: [
      { by: 'Lena P.', line: 'Yes, and our alerting is worse than the dashboard.', echoes: ['Priya N.'] },
      { by: 'Dev K.', line: 'p99 or nothing from now on.', echoes: [] },
      { by: 'Marcus T.', line: 'Not convinced — p50 still tells us about the common case.', echoes: [], to: 'Dev K.' },
    ],
  },
  'https://go.dev/blog/pipelines': {
    preface: { by: 'Marcus T.', text: 'Our onboarding is exactly the failure he describes in part two.' },
    voices: [
      { by: 'Priya N.', line: 'Read it because of your note, and part two is our doc almost line for line.', echoes: ['Ada L.', 'Dev K.', 'Sam R.'] },
      { by: 'Ada L.', line: 'The fix he lands on is cheaper than the one we keep proposing.', echoes: ['Lena P.'], r: 1 },
      { by: 'Dev K.', line: 'Can we try the checklist this week?', echoes: [], r: 2 },
      { by: 'Sam R.', line: 'Where does the runbook sit in this?', echoes: [], to: 'Ada L.', r: 2 },
    ],
    table: {
      on: true, by: 'Priya N.',
      turns: [
        { by: 'Marcus T.', text: 'Taking it further: the failure is not the doc, it is that nobody owns the first week. The doc is downstream of that.' },
        { by: 'Priya N.', text: 'Agreed. And the person who owns the first week cannot also be on call that week, which is what we do today.' },
        { by: 'Ada L.', text: 'So the smallest version of this is one named owner per intake, rotating monthly. That is a rota change, not a document.' },
        { by: 'Marcus T.', text: 'Then the doc becomes the owner\u2019s checklist rather than the newcomer\u2019s manual. Which is the shape the article ends on.' },
      ],
    },
  },
  'https://jvns.ca/blog/2026/02/dns-resolvers/': {
    preface: { by: 'Priya N.', text: 'I never actually understood resolvers. Now I do.' },
    voices: [
      { by: 'Marcus T.', line: 'The drawing halfway down is the whole thing.', echoes: ['Ada L.'] },
      { by: 'Dev K.', line: 'Quietly did not understand this either. Fixed.', echoes: [] },
    ],
    fresh: true,
  },
  'https://www.kernel.org/doc/html/latest/process/submitting-patches.html': {
    preface: null,
    voices: [{ by: 'Lena P.', line: 'The checklist at the end is worth the whole read.', echoes: [] }],
    fresh: true,
  },
  'https://www.youtube.com/watch?v=Kx7Bvksk_qg': {
    preface: { by: 'Marcus T.', text: 'Twelve minutes, and the last three are the argument.' },
    rx: [{ name: 'Priya N.', glyph: '\uD83D\uDD25', intensity: 0.7 }, { name: 'Ada L.', glyph: '\uD83D\uDCA1', intensity: 0.5 },
      { name: 'You', glyph: '\u2764\uFE0F', intensity: 0.44 }, { name: 'Dev K.', glyph: '\uD83D\uDC4D', intensity: 0.35 }],
    voices: [
      { by: 'Priya N.', line: 'The last three minutes are doing all the work, agreed.', echoes: ['Ada L.'] },
      { by: 'You', line: 'Watched it twice. The middle is skippable.', echoes: [] },
    ],
    table: {
      on: false, by: 'Ada L.',
      landed: { by: 'Ada L.', text: 'We are taking one thing from this: the argument only works if the team already trusts the numbers. So we fix the numbers first.' },
      turns: [{ by: 'Ada L.', text: 'The claim rests on trusted instrumentation, which we do not have yet.' }],
    },
  },
  'https://martinfowler.com/bliki/FormerMember.html': { preface: null, voices: [] },
};

// Feed order: four unread, five read. Between them: a preface of every register
// (reason, honest pre-read, sealed question, none), a bare share, an item with a
// live table, an item already landed, and a record with nothing in it at all.
const D2_ORDER = [
  ['https://newsletter.pragmaticengineer.com/p/scaling-on-call', false],
  ['https://blog.rust-lang.org/2026/01/async-internals', false],
  ['https://martinfowler.com/articles/cd-pipeline.html', false],
  ['https://danluu.com/percentile-latency/', false],
  ['https://go.dev/blog/pipelines', true],
  ['https://jvns.ca/blog/2026/02/dns-resolvers/', true],
  ['https://www.youtube.com/watch?v=Kx7Bvksk_qg', true],
  ['https://www.kernel.org/doc/html/latest/process/submitting-patches.html', true],
  ['https://martinfowler.com/bliki/FormerMember.html', true],
];

const D2_ITEMS = D2_ORDER.map(([url, read], i) => {
  const seed = d2Seed(url);
  const f = D2_FIX[url] || {};
  // Seed preview paths are app-root relative; this entry file sits at the root.
  return {
    ...seed, id: 'd2-' + i, read,
    reactions: [...(seed.reactions || []), ...(f.rx || [])],
    preface: f.preface || null, voices: f.voices || [], table: f.table || null, fresh: !!f.fresh,
  };
});

// ---- Prompts ---------------------------------------------------------------
// The scaffold, in its three strengths (ideation note 2). `grammar` is the v1
// stem kept only so it can be seen losing.
const D2_PROMPTS = {
  share: ['Why this one?', 'What should they look out for?', 'What did it change?'],
  respond: ['What landed?', 'What are you taking from it?', 'Anything you would push back on?'],
};
const D2_STEMS = { share: ['Shared because', 'The core insight is', 'Taking from it'], respond: ['This landed because', 'What I am taking', 'Where I would push back'] };

// ---- The settled spine -----------------------------------------------------
// Part 3 of the ideation doc, as the Auto answer to every lever. These are the
// same for all seven options — the spine is what the notes settled.
const D2_SPINE = {
  preface: 'sealed',    // card | sealed | hidden — sealed = on the card unless its author holds it back
  prompt: 'placeholder',// placeholder | prefill | grammar
  echo: 'same',         // same | echo | off
  record: 'merged',     // merged | sectioned
  bloat: 'lean',        // lean | onCard  (what the Read card carries)
  names: 'named',       // named | muted
  limit: 140,
  graduate: 'none',     // none | member | voices
  land: false,
  turns: 'one',
};

const D2_SHAPE = [
  ['Reveal-on-read protects the conversation, not the invitation.', 'Jonny + you, note 1'],
  ['The sharer\u2019s line sits on the card, on both tabs \u2014 and its author can seal it.', 'note 1'],
  ['Everything the circle said lives behind the door. The card never grows with the conversation.', 'you, note 7'],
  ['The record is one artefact: the disc is the shape, the roster is the substance.', 'Jonny, note 5'],
  ['The reveal IS the record \u2014 opened when you commit, dismissed by you. No timer.', 'you, note 5'],
  ['The preface outranks the responses. A size up, full weight, everywhere.', 'Jonny, note 6'],
  ['Same is a verb on every line \u2014 the participation floor, and the only way to answer a response.', 'Jonny + you, note 4'],
  ['Continuation is real. Which discipline it takes is the open question.', 'you, note 6 of yours'],
  ['Every moment is re-enterable. Nothing expires.', 'you, note 4 of yours'],
  ['A continued exchange is set as a page, never as a transcript.', 'from the continuation ideation'],
];

// ---- K0–K6 -----------------------------------------------------------------
const D2_OPTIONS = [
  {
    id: 'one', n: 'K0', name: 'One line each', kind: 'floor',
    line: 'You get one line, forever. The floor \u2014 and the gap you named.',
    theory: 'There is nothing to reply to.',
    claim: 'Perfect calm: the record is always one glance, and nobody can be owed a reply.',
    cost: 'A question cannot be answered back. The record is parallel statements that never touch.',
    def: { turns: 'one', graduate: 'none', land: false },
  },
  {
    id: 'living', n: 'K1', name: 'Your line is living',
    line: 'One line each \u2014 but you can rewrite yours whenever. The record ripens instead of growing.',
    theory: 'Growth is impossible by construction.',
    claim: 'Continuation with zero accumulation. Changing your mind IS the second turn, and the artefact stays readable forever. A line is yours until somebody touches it \u2014 once it has been echoed or answered, it locks.',
    cost: 'History vanishes. Someone can be answering a sentence that no longer exists, so the record reads as settled consensus rather than exchange.',
    def: { turns: 'living', graduate: 'none', land: false },
  },
  {
    id: 'addressed', n: 'K2', name: 'One each, plus one to each person',
    line: 'A reply is addressed to a member, sits beside their line, and is never nested.',
    theory: 'Depth is 1 by construction; breadth is capped by the size of the circle.',
    claim: 'Real back-and-forth with a ceiling you can calculate. Because a reply is to a person rather than to a room, it reads as answering someone instead of posting.',
    cost: 'In a full circle that is a lot of lines. Bounded is not the same as small.',
    def: { turns: 'addressed', graduate: 'none', land: false },
  },
  {
    id: 'table', n: 'K3', name: 'Continuation needs a room',
    line: 'One line each in the door. Take it to the table and you may speak freely \u2014 then land it.',
    theory: 'You have to walk somewhere to have a conversation, and the room holds two items, not two hundred.',
    claim: 'The queue stays a queue and the conversation gets a beginning, a middle and an end. The table is a lens over the same library \u2014 nothing is moved out of the feed \u2014 and landing it drains the room.',
    cost: 'A place you enter is a place you can forget to enter, and a quiet circle may never fill it.',
    def: { turns: 'open', graduate: 'member', land: true },
  },
  {
    id: 'question', n: 'K4', name: 'Continue by asking',
    line: 'Speak as often as you like \u2014 but every turn after your first must be a question.',
    theory: 'A question cannot be a monologue. It always hands the floor to somebody else.',
    claim: 'Continuation is structurally generous, and the record reads as an enquiry \u2014 which is what a reading circle actually is.',
    cost: 'It is a grammar, so it inherits every risk of putting words in your mouth. Sometimes you just want to agree.',
    def: { turns: 'question', graduate: 'none', land: false },
  },
  {
    id: 'rounds', n: 'K5', name: 'Rounds, closed by reading',
    line: 'One line each per round. A round closes when everyone who has read it has spoken.',
    theory: 'Length is replaced by structure \u2014 and the trigger is reading, never a clock.',
    claim: 'The record has movements rather than a tail, and nothing can make you late: no deadline exists to miss.',
    cost: 'One member who never speaks freezes the round, and waiting for a round is a quiet way of waiting for people.',
    def: { turns: 'rounds', graduate: 'none', land: false },
  },
  {
    id: 'land', n: 'K6', name: 'Land it \u2014 and until then, say anything',
    line: 'No limit on turns at all. What ends it is somebody writing what the circle takes from it.',
    theory: 'Ration the open state, not the talking.',
    claim: 'A conversation that must end stays short without anyone being rationed \u2014 and the artefact\u2019s final form is a conclusion, the most useful thing the circle produced, at the top forever.',
    cost: 'The middle can sprawl before anyone lands it, and closing an exchange is a power one member holds over the others.',
    def: { turns: 'open', graduate: 'none', land: true },
  },
];

// ---- Levers ----------------------------------------------------------------
const D2_LEVERS = [
  { key: 'preface', group: 'shape', label: 'The sharer\u2019s line', opts: [['auto', 'Auto'], ['card', 'On the card'], ['sealed', 'Author seals'], ['hidden', 'Until read']] },
  { key: 'bloat', group: 'shape', label: 'Read card', opts: [['auto', 'Auto'], ['lean', 'Lean'], ['onCard', 'With the words']] },
  { key: 'record', group: 'shape', label: 'The record', opts: [['auto', 'Auto'], ['merged', 'Merged'], ['sectioned', 'Sectioned']] },
  { key: 'echo', group: 'shape', label: 'Pointing', opts: [['auto', 'Auto'], ['same', 'Same'], ['echo', 'Echo'], ['off', 'Off']] },
  { key: 'prompt', group: 'shape', label: 'Prompt', opts: [['auto', 'Auto'], ['placeholder', 'Placeholder'], ['prefill', 'Prefill'], ['grammar', 'Grammar']] },
  { key: 'graduate', group: 'shape', label: 'The table', opts: [['auto', 'Auto'], ['none', 'None'], ['member', 'By a member'], ['voices', 'At three voices']] },
  { key: 'land', group: 'shape', label: 'Landing', opts: [['auto', 'Auto'], ['on', 'On'], ['off', 'Off']] },
  { key: 'names', group: 'shape', label: 'Names', opts: [['auto', 'Auto'], ['named', 'Named'], ['muted', 'Muted']] },
  { key: 'limit', group: 'shape', label: 'Length', opts: [['auto', 'Auto'], ['90', '90'], ['140', '140'], ['240', '240']] },
  { key: 'sPreface', group: 'state', label: 'Sharer\u2019s lines', opts: [['auto', 'As seeded'], ['none', 'None'], ['long', 'Long']] },
  { key: 'sVoices', group: 'state', label: 'Voices', opts: [['auto', 'As seeded'], ['none', 'Nobody yet'], ['all', 'Everyone']] },
  { key: 'sYou', group: 'state', label: 'You', opts: [['auto', 'As seeded'], ['silent', 'Not spoken'], ['spoken', 'Spoken']] },
];
const D2_DEFAULT_CFG = D2_LEVERS.reduce((a, l) => (a[l.key] = 'auto', a), {});

const D2_WORDS = {
  turns: { one: 'one line each, forever', living: 'one line each, rewritable', addressed: 'one line, plus one to each person', open: 'as many as you like', question: 'unlimited, but questions after the first', rounds: 'one line each, per round' },
  preface: { card: 'on the card, before you read', sealed: 'on the card unless its author seals it', hidden: 'hidden until you have read it' },
  bloat: { lean: 'the door only', onCard: 'the words on the card too' },
  record: { merged: 'reactions and words in one list', sectioned: 'how it landed, then what was said' },
  echo: { same: '\u201CSame\u201D, on any line', echo: '\u201CEcho\u201D, on any line', off: 'no pointing \u2014 words only' },
  prompt: { placeholder: 'a prompt in the placeholder', prefill: 'a tappable prefill you can edit away', grammar: 'a stem that stays in the record' },
  graduate: { none: 'no table', member: 'a member takes it there', voices: 'automatic at three voices' },
  names: { named: 'named', muted: 'avatar only' },
};

const d2Merge = (opt, ov) => {
  const c = { ...D2_SPINE, ...opt.def };
  Object.keys(ov || {}).forEach((k) => {
    const v = ov[k];
    if (v == null || v === 'auto') return;
    if (k === 'limit') c.limit = Number(v);
    else if (k === 'land') c.land = v === 'on';
    else c[k] = v;
  });
  return c;
};

// ---- One derivation point --------------------------------------------------
const D2_ECHO_WORD = { same: 'Same', echo: 'Echo' };

const d2Resolve = (item, cfg, opt) => {
  let preface = item.preface;
  if (cfg.sPreface === 'none') preface = null;
  else if (cfg.sPreface === 'long' && preface) preface = { ...preface, text: D2_LONG, ask: null };

  let voices = (item.voices || []).map((v) => ({ ...v, echoes: cfg.echo === 'off' ? [] : (v.echoes || []) }));
  if (cfg.sVoices === 'none') voices = [];
  else if (cfg.sVoices === 'all') {
    const have = voices.map((v) => v.by);
    voices = [...voices, ...D2_MEMBERS.filter((m) => !have.includes(m)).map((m) => ({
      by: m, line: 'Took the same thing from it. Worth the time.', echoes: [], r: 1,
    }))];
  }
  if (cfg.sYou === 'silent') voices = voices.filter((v) => v.by !== 'You');
  else if (cfg.sYou === 'spoken' && item.read && !voices.some((v) => v.by === 'You')) {
    voices = [...voices, { by: 'You', line: 'Landed harder than I expected. The last section is the one.', echoes: [], r: 1 }];
  }
  const mine = voices.find((v) => v.by === 'You') || null;

  // Reveal-on-read: the conversation is sealed until YOU have been through it.
  // The invitation is not — unless its author sealed it, or the lever hides it.
  const sealed = !item.read;
  // Your own line is never hidden from you — a seal holds it back from OTHERS.
  const prefaceOnCard = !!preface && (cfg.preface === 'card' || (cfg.preface === 'sealed' && (!preface.seal || preface.by === 'You')) || item.read);
  const prefaceHeld = !!preface && !prefaceOnCard;
  const mineSealed = !!preface && preface.by === 'You' && !!preface.seal && cfg.preface === 'sealed';

  // The record: one row per reaction, carrying that member's words when they
  // left any. Anyone who spoke without reacting is appended.
  const rx = item.reactions || [];
  const rows = rx.map((r) => ({
    name: r.former ? null : r.name, former: !!r.former, rx: r,
    voice: voices.find((v) => v.by === r.name) || null,
  }));
  voices.forEach((v) => { if (!rx.some((r) => r.name === v.by)) rows.push({ name: v.by, rx: null, voice: v }); });

  const round = Math.max(1, ...voices.map((v) => v.r || 1));
  const spokeThisRound = !!(mine && (mine.r || 1) >= round);
  const tableOn = cfg.graduate !== 'none' && (cfg.graduate === 'voices' ? voices.length >= 3 : !!(item.table && item.table.on));
  const landed = cfg.land ? (item.table && item.table.landed) || null : null;
  const turns = (opt.def.turns === 'open' && cfg.graduate !== 'none') ? 'one' : cfg.turns;

  let canSpeak = !sealed;
  if (canSpeak) {
    if (turns === 'one' || turns === 'addressed') canSpeak = !mine;
    else if (turns === 'living') canSpeak = !mine || !(mine.echoes || []).length;
    else if (turns === 'rounds') canSpeak = !spokeThisRound;
    else if (landed) canSpeak = false;
  }
  // Addressed replies: one to each member who spoke and whom you have not yet
  // answered. Only ever available once your own line exists.
  const addressable = turns === 'addressed' && mine
    ? voices.filter((v) => v.by !== 'You' && !voices.some((w) => w.by === 'You' && w.to === v.by)).map((v) => v.by)
    : [];

  return {
    preface, prefaceOnCard, prefaceHeld, mineSealed, voices, rows, mine, sealed, canSpeak, addressable,
    turns, round, spokeThisRound, tableOn, landed,
    words: voices.length > 0,
    echoWord: D2_ECHO_WORD[cfg.echo] || null,
  };
};

Object.assign(window, {
  D2_OPTIONS, D2_LEVERS, D2_DEFAULT_CFG, D2_SPINE, D2_SHAPE, D2_ITEMS, D2_USER,
  D2_MEMBERS, D2_WORDS, D2_PROMPTS, D2_STEMS, D2_LONG, d2Merge, d2Resolve,
});
