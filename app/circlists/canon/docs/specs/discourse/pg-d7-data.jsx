// ============================================================================
// Discourse v7 — seed data. Data only, no logic, no React.
// ----------------------------------------------------------------------------
// One inhabited circle: five named members, eleven links across Active and Read,
// each carrying a sharer's thought and the circle's responses. Written to the
// shape app/seed-data.jsx produces (url / title / source / image / attribution /
// read / reactions / at) so every item drops straight into the shipped FeedCard,
// plus the discourse fields the ten directions read.
//
// Seeded for COVERAGE, not for tidiness. Every state AND every fallback:
//   • no thought attached          — a2 (rust), r3 (new yorker)
//   • a long thought               — a4 (arxiv)
//   • shared before reading        — a3 (martin fowler), r4 (moby-dick)
//   • nobody responded yet         — a1, a6, r3
//   • everyone responded           — a4 (all four others), r1 (all four others)
//   • no reactions at all          — a6 (the first-one-here moment)
//   • everyone who read it skipped — r3 (empty disc behind the Swell door)
//   • no preview image / no favicon— a6 (danluu), r4 (gutenberg)
//   • the full register spectrum   — gist · trust · reflection · takeaway,
//                                    in the sharers' thoughts AND in responses
//
// REGISTERS. The four kinds of thing a member says about a link. Directions may
// treat them differently or ignore them, but they must not invent a fifth.
//   'gist'       functional — what this is, why it is here
//   'trust'      pre-read — vouching for it before having finished it
//   'reflection' personal — what it stirred
//   'takeaway'   the one thing carried away from it
// ============================================================================

const PGD7_HOUR = 3600e3;
const PGD7_NOW = Date.now();
const pgd7Ago = (h) => PGD7_NOW - h * PGD7_HOUR;

// ---- Members. Five, including the viewer. -----------------------------------
// `name` is the roster identity. The viewer is 'You' everywhere in shared views
// (the app's own convention); `realName` is only for their own account chip.
const PGD7_MEMBERS = [
  { id: 'you', name: 'You', realName: 'Sam Rivera', email: 'sam.rivera@gmail.com', you: true },
  { id: 'priya', name: 'Priya N.', email: 'priya.n@example.com' },
  { id: 'marcus', name: 'Marcus T.', email: 'marcus.t@example.com' },
  { id: 'ada', name: 'Ada L.', email: 'ada.l@example.com' },
  { id: 'dev', name: 'Dev K.', email: 'dev.k@example.com' },
];

const PGD7_CIRCLE = {
  id: 'sp-thursday',
  name: 'Thursday Reading',
  champion: 'You',
  championEmail: 'sam.rivera@gmail.com',
  funded: true,
  dormancy: null,
};

// ---- Reaction glyph vocabulary (the Swell's only five) ----------------------
const D7_HEART = '❤️', D7_FIRE = '🔥', D7_THUMB = '👍',
      D7_BULB = '💡', D7_LOL = '😂';

// ---- Items ------------------------------------------------------------------
// thought   — the sharer's contribution (layer 1). null = nothing attached.
// pulls     — sentences members have taken out of the source (The Pulled Line).
// prose     — the source's own text, inline, so selection can be PERFORMED
//             rather than picked from a list.
// responses — what the circle gave back on reading (layers 3 and 4).
const PGD7_ITEMS = [
  {
    id: 'a1',
    url: 'https://newsletter.pragmaticengineer.com/p/scaling-on-call',
    title: 'Scaling On-Call Without Burning Out the Team',
    source: 'The Pragmatic Engineer',
    image: 'uploads/card-previews/pragmatic-engineer.jpg',
    by: 'priya', attribution: 'Added by Priya N.', read: false, at: pgd7Ago(3),
    reactions: [
      { name: 'Marcus T.', glyph: D7_FIRE, intensity: 0.86 },
      { name: 'Ada L.', glyph: D7_BULB, intensity: 0.55 },
      { name: 'Dev K.', skipped: true },
    ],
    thought: { by: 'priya', register: 'gist', at: pgd7Ago(3),
      text: 'The rota maths, worked all the way through. Sections three and four are the ones that matter.' },
    pulls: [
      { by: 'marcus', text: 'A rota that needs a hero every third week is not a rota, it is a queue with a person on the end of it.' },
    ],
    prose: [
      'Every on-call rotation starts as a fair division of an unfair job. Six engineers, one week each, six weeks between shifts — written on a whiteboard, it looks humane.',
      'What the whiteboard leaves out is that the load is not distributed evenly across the calendar. It clusters. Deploy Fridays, quarter-end, the week a dependency ships a breaking change. A rota that needs a hero every third week is not a rota, it is a queue with a person on the end of it.',
      'The teams that survive on-call for years do one unglamorous thing: they treat every page as a bug in the system that produced it, and they fix the loudest one before adding anybody to the rota.',
    ],
    responses: [],
  },
  {
    id: 'a2',
    url: 'https://blog.rust-lang.org/2026/01/async-internals',
    title: 'Inside Async: How Rust Schedules Your Futures',
    source: 'Rust Blog',
    image: 'uploads/card-previews/blog-overreacted.png',
    by: 'marcus', attribution: 'Added by Marcus T.', read: false, at: pgd7Ago(9),
    reactions: [
      { name: 'Ada L.', glyph: D7_FIRE, intensity: 0.72 },
      { name: 'Priya N.', glyph: D7_BULB, intensity: 0.5 },
    ],
    // Nothing attached. The fallback every direction has to survive.
    thought: null,
    pulls: [],
    prose: [
      'A future in Rust is not a running thing. It is a description of work that has not started, handed to an executor that decides when — or whether — to poll it.',
      'That inversion is the whole design. Nothing progresses because time passed; things progress because something asked them to.',
      'Once you hold that, the borrow checker’s complaints about async blocks stop being arbitrary. It is asking where the description lives while nobody is looking at it.',
    ],
    responses: [
      { id: 'a2r1', by: 'ada', register: 'gist', at: pgd7Ago(7),
        text: 'The polling diagram halfway down is the clearest one I have seen anywhere.' },
      { id: 'a2r2', by: 'priya', register: 'reflection', at: pgd7Ago(5),
        text: 'I have written async Rust for two years and never once thought about who is doing the asking. Slightly unsettling.' },
    ],
  },
  {
    id: 'a3',
    url: 'https://martinfowler.com/articles/cd-pipeline.html',
    title: 'Continuous Delivery Pipelines, End to End',
    source: 'Martin Fowler',
    image: 'uploads/card-previews/martinfowler-cd-pipeline.png',
    by: 'you', attribution: 'Added by you', read: false, at: pgd7Ago(14),
    reactions: [
      { name: 'Dev K.', glyph: D7_THUMB, intensity: 0.4 },
    ],
    // Shared before reading: the thought vouches rather than reports.
    sharedBeforeReading: true,
    thought: { by: 'you', register: 'trust', at: pgd7Ago(14),
      text: 'Not read it yet — putting it here because everything of his on pipelines has been worth the hour.' },
    pulls: [],
    prose: [
      'A deployment pipeline is a partial ordering of the things you believe about a change, arranged so the cheapest belief is tested first.',
      'Most pipelines are slow not because the tests are slow but because the ordering is wrong: an expensive stage sits in front of a cheap one that would have failed anyway.',
      'The end state is not speed. It is that a red pipeline tells you something specific, every time, without anybody having to interpret it.',
    ],
    responses: [
      { id: 'a3r1', by: 'marcus', register: 'takeaway', at: pgd7Ago(11),
        text: 'Cheapest belief first. That is the whole article and I am going to say it in standup on Monday.' },
    ],
  },
  {
    id: 'a4',
    url: 'https://arxiv.org/abs/2503.04918',
    title: 'Learned Index Structures for Time-Series Stores',
    source: 'arXiv',
    image: 'uploads/card-previews/arxiv-2503-04918.png',
    by: 'ada', attribution: 'Added by Ada L.', read: false, at: pgd7Ago(22),
    reactions: [
      { name: 'Priya N.', glyph: D7_BULB, intensity: 0.62 },
      { name: 'Marcus T.', glyph: D7_FIRE, intensity: 0.9 },
      { name: 'Dev K.', glyph: D7_THUMB, intensity: 0.3 },
      { name: 'You', skipped: true },
    ],
    // The long thought. Directions with a tight measure must survive this.
    thought: { by: 'ada', register: 'reflection', at: pgd7Ago(22),
      text: 'I spent most of last year arguing that a learned index is a research toy, and this is the paper that changed my mind — not because the benchmarks are good, though they are, but because of the failure analysis in section six. They ran the thing against a workload that violates every assumption the model makes, watched it degrade, and then wrote down exactly how it degraded instead of quietly dropping the case. That is the part I trust. A structure that fails predictably is a structure you can put in front of real data.' },
    pulls: [
      { by: 'marcus', text: 'A structure that degrades predictably is worth more than one that is faster in the cases you thought to measure.' },
      { by: 'priya', text: 'The model does not learn the data; it learns the shape of the queries you happened to run.' },
    ],
    prose: [
      'Learned indexes replace a search structure with a function that predicts where a key ought to be, and a small correction step for when it is wrong.',
      'The model does not learn the data; it learns the shape of the queries you happened to run. Change the workload and the correction step carries a cost you did not budget for.',
      'A structure that degrades predictably is worth more than one that is faster in the cases you thought to measure. We therefore report the adversarial workload alongside the favourable one.',
    ],
    // Everyone else has responded.
    responses: [
      { id: 'a4r1', by: 'marcus', register: 'takeaway', at: pgd7Ago(20),
        text: 'Predictable degradation over peak throughput. Taking that one into the storage review.' },
      { id: 'a4r2', by: 'priya', register: 'gist', at: pgd7Ago(19),
        text: 'Section six is the paper. The rest is setup.' },
      { id: 'a4r3', by: 'dev', register: 'reflection', at: pgd7Ago(17),
        text: 'Reading this the week we shipped our own hand-rolled index was uncomfortable in a useful way.' },
      { id: 'a4r4', by: 'you', register: 'trust', at: pgd7Ago(15),
        text: 'Only got as far as section three, but on Ada’s word I will finish it tonight.' },
    ],
  },
  {
    id: 'a5',
    url: 'https://www.youtube.com/watch?v=Kx7Bvksk_qg',
    title: 'Simple Made Easy — Rich Hickey',
    source: 'YouTube',
    image: 'uploads/card-previews/youtube-maxres.jpg',
    by: 'dev', attribution: 'Added by Dev K.', read: false, at: pgd7Ago(30),
    reactions: [
      { name: 'Ada L.', glyph: D7_HEART, intensity: 0.6 },
      { name: 'Marcus T.', glyph: D7_LOL, intensity: 0.44 },
      { name: 'Priya N.', skipped: true },
    ],
    thought: { by: 'dev', register: 'takeaway', at: pgd7Ago(30),
      text: 'Simple is about how many things are braided together. Easy is about how near it is to hand. They are not the same word and I had used them as one for a decade.' },
    pulls: [
      { by: 'ada', text: 'Simplicity is a property of the thing. Ease is a property of your relationship to it.' },
    ],
    prose: [
      'We conflate simple with easy constantly, and the conflation costs us. Simplicity is a property of the thing. Ease is a property of your relationship to it.',
      'A thing is simple when it does not interleave — when you can pull one strand without dragging four others behind it. Nothing about that is a matter of familiarity.',
      'Choosing the easy thing feels like moving fast because the cost arrives later, distributed across everybody who has to hold the braid in their head.',
    ],
    responses: [
      { id: 'a5r1', by: 'ada', register: 'reflection', at: pgd7Ago(26),
        text: 'I watch this roughly once a year and it lands differently each time, which is probably the point.' },
      { id: 'a5r2', by: 'marcus', register: 'gist', at: pgd7Ago(24),
        text: 'Forty minutes, worth it at 1x. The knitting metaphor starts around eleven.' },
    ],
  },
  {
    id: 'a6',
    url: 'https://danluu.com/percentile-latency/',
    title: 'How to Measure Latency, and Why the Percentiles Matter',
    // No source, no preview, no favicon — the bare-fallback card.
    source: null, hasImage: false, faviconExists: false,
    by: 'marcus', attribution: 'Added by Marcus T.', read: false, at: pgd7Ago(2),
    // Nobody has touched it: no reactions, no responses. The first-one-here moment.
    reactions: [],
    thought: { by: 'marcus', register: 'gist', at: pgd7Ago(2),
      text: 'Short one. The histogram section is the bit worth having.' },
    pulls: [],
    prose: [
      'An average latency is a number that describes nobody. Take two users, one served in a millisecond and one in a second, and the mean says half a second, which neither of them experienced.',
      'Percentiles are better and still lie by omission: a p99 quoted without the window it was computed over is a number without a denominator.',
      'Keep the histogram. Everything else is a lossy summary of it, and you can always compute a summary later; you cannot recover a distribution you threw away.',
    ],
    responses: [],
  },
  {
    id: 'a7',
    url: 'https://lithub.com/on-rereading-your-favorite-books/',
    title: 'On Rereading Your Favorite Books',
    source: 'Literary Hub',
    by: 'priya', attribution: 'Added by Priya N.', read: false, at: pgd7Ago(38),
    reactions: [
      { name: 'You', glyph: D7_HEART, intensity: 0.7 },
      { name: 'Dev K.', glyph: D7_THUMB, intensity: 0.5 },
      { name: 'Ada L.', skipped: true },
    ],
    thought: { by: 'priya', register: 'reflection', at: pgd7Ago(38),
      text: 'Not a work one. It made me want to go back to a book I have been avoiding because I liked it too much the first time.' },
    pulls: [
      { by: 'you', text: 'You never reread a book. You read a different one, written by the same words, to a different person.' },
    ],
    prose: [
      'You never reread a book. You read a different one, written by the same words, to a different person.',
      'This is why rereading feels like a small act of nerve. The book is fixed and you are not, and the comparison runs in one direction only.',
      'The books that survive rereading are rarely the ones with the best plots. They are the ones with room in them — gaps the first reading filled one way and the second fills another.',
    ],
    responses: [
      { id: 'a7r1', by: 'ada', register: 'reflection', at: pgd7Ago(33),
        text: 'The bit about being afraid to reread something you loved is uncomfortably accurate.' },
      { id: 'a7r2', by: 'you', register: 'takeaway', at: pgd7Ago(30),
        text: 'The book is fixed and you are not. Keeping that one.' },
      { id: 'a7r3', by: 'dev', register: 'gist', at: pgd7Ago(28),
        text: 'Ten minutes, no work content, entirely worth it.' },
    ],
  },

  // ---- Read tab -------------------------------------------------------------
  {
    id: 'r1',
    url: 'https://go.dev/blog/pipelines',
    title: 'Go Concurrency Patterns: Pipelines',
    source: 'The Go Blog',
    image: 'uploads/card-previews/youtube-hqdefault.jpg',
    by: 'marcus', attribution: 'Added by Marcus T.', read: true, at: pgd7Ago(8 * 24),
    reactions: [
      { name: 'Priya N.', glyph: D7_FIRE, intensity: 0.72 },
      { name: 'Ada L.', glyph: D7_FIRE, intensity: 0.88 },
      { name: 'Dev K.', glyph: D7_BULB, intensity: 0.4 },
      { name: 'You', glyph: D7_THUMB, intensity: 0.55 },
    ],
    thought: { by: 'marcus', register: 'takeaway', at: pgd7Ago(8 * 24),
      text: 'The done channel is the whole idea. Everything else in the piece is an example of it.' },
    pulls: [
      { by: 'priya', text: 'A pipeline stage that cannot be cancelled is a leak with good manners.' },
      { by: 'dev', text: 'Close the channel from the sending side, always, and the ownership question answers itself.' },
    ],
    prose: [
      'A pipeline is a series of stages connected by channels, where each stage is a group of goroutines running the same function.',
      'Close the channel from the sending side, always, and the ownership question answers itself. A receiver that closes is a receiver making a decision it does not have the information to make.',
      'A pipeline stage that cannot be cancelled is a leak with good manners. It will sit there politely, holding a goroutine, for as long as your process lives.',
    ],
    // Everyone else has responded.
    responses: [
      { id: 'r1r1', by: 'priya', register: 'gist', at: pgd7Ago(7 * 24),
        text: 'Read it as a companion to the context package docs and the two click together.' },
      { id: 'r1r2', by: 'ada', register: 'takeaway', at: pgd7Ago(6 * 24),
        text: 'Close from the sending side. I have got that wrong in review twice this month.' },
      { id: 'r1r3', by: 'dev', register: 'reflection', at: pgd7Ago(5 * 24),
        text: 'There is something calming about a concurrency article that admits most of the difficulty is ownership, not scheduling.' },
      { id: 'r1r4', by: 'you', register: 'trust', at: pgd7Ago(4 * 24),
        text: 'Marcus said the done channel was the point and he was right, so I skimmed the rest with that in mind.' },
    ],
  },
  {
    id: 'r2',
    url: 'https://jvns.ca/blog/2026/02/dns-resolvers/',
    title: 'How DNS Resolvers Actually Work',
    source: 'Julia Evans',
    by: 'priya', attribution: 'Added by Priya N.', read: true, at: pgd7Ago(9 * 24),
    reactions: [
      { name: 'Marcus T.', glyph: D7_LOL, intensity: 0.86 },
      { name: 'You', glyph: D7_FIRE, intensity: 0.5 },
      { name: 'Ada L.', skipped: true },
    ],
    thought: { by: 'priya', register: 'gist', at: pgd7Ago(9 * 24),
      text: 'Drawings, not prose. Fifteen minutes and you will stop guessing at resolver behaviour.' },
    pulls: [],
    prose: [
      'A resolver is not one thing. It is a stub in your process, a cache on your machine, a recursive server somewhere upstream, and a chain of authoritative servers that do not know each other.',
      'Almost every confusing DNS bug is a disagreement between two of those about how long an answer stays true.',
      'When you cannot explain a resolution, ask which of the four you are actually talking to. Usually it is not the one you assumed.',
    ],
    responses: [
      { id: 'r2r1', by: 'marcus', register: 'takeaway', at: pgd7Ago(8 * 24),
        text: 'Ask which resolver you are actually talking to. That would have saved me a Tuesday.' },
      { id: 'r2r2', by: 'you', register: 'reflection', at: pgd7Ago(7 * 24),
        text: 'I have been faintly embarrassed about not understanding DNS for years and this quietly fixed it.' },
    ],
  },
  {
    id: 'r3',
    url: 'https://www.newyorker.com/books/page-turner/the-quiet-novel-revival',
    title: 'The Quiet Novel Revival',
    source: 'The New Yorker',
    by: 'ada', attribution: 'Added by Ada L.', read: true, at: pgd7Ago(11 * 24),
    // Everyone who read it skipped the Swell — empty disc behind the door.
    reactions: [
      { name: 'Priya N.', skipped: true },
      { name: 'Marcus T.', skipped: true },
      { name: 'You', skipped: true },
    ],
    // Nothing attached, and nobody responded. A read card with no words on it at all.
    thought: null,
    pulls: [],
    prose: [
      'The novels selling this year are not the loud ones. They are short, interior, and almost entirely without incident, and the trade has decided this is a revival rather than a lull.',
      'What the category actually shares is a refusal of stakes. Nothing is at risk except a person’s sense of themselves, which turns out to be enough.',
      'Whether that is a movement or a marketing shelf will be obvious in five years and unanswerable now.',
    ],
    responses: [],
  },
  {
    id: 'r4',
    url: 'https://www.gutenberg.org/files/2701/2701-h/2701-h.htm',
    title: 'Moby-Dick; or, The Whale',
    source: 'Project Gutenberg',
    hasImage: false,
    by: 'dev', attribution: 'Added by Dev K.', read: true, at: pgd7Ago(13 * 24),
    reactions: [
      { name: 'Ada L.', glyph: D7_HEART, intensity: 0.9 },
      { name: 'You', glyph: D7_LOL, intensity: 0.45 },
      { name: 'Priya N.', glyph: D7_BULB, intensity: 0.52 },
    ],
    sharedBeforeReading: true,
    thought: { by: 'dev', register: 'trust', at: pgd7Ago(13 * 24),
      text: 'Forty pages in and already recommending it, which I accept is not how recommending works.' },
    pulls: [
      { by: 'ada', text: 'It is a way I have of driving off the spleen and regulating the circulation.' },
    ],
    prose: [
      'Call me Ishmael. Some years ago — never mind how long precisely — having little or no money in my purse, I thought I would sail about a little and see the watery part of the world.',
      'It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth, I account it high time to get to sea as soon as I can.',
      'There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.',
    ],
    responses: [
      { id: 'r4r1', by: 'ada', register: 'reflection', at: pgd7Ago(12 * 24),
        text: 'The first paragraph is the only opening in English I can recite, and I still do not know when I learned it.' },
      { id: 'r4r2', by: 'priya', register: 'gist', at: pgd7Ago(11 * 24),
        text: 'Free, complete, and the chapter breaks make it survivable on a commute.' },
      { id: 'r4r3', by: 'you', register: 'reflection', at: pgd7Ago(10 * 24),
        text: 'I bounced off this twice in my twenties and got through it the year I stopped treating it as a novel and started treating it as a very long, very odd essay with a plot bolted on. Dev recommending it forty pages in is exactly the right way to recommend it, because the first forty pages are the part everybody can agree about.' },
    ],
  },
];

// ---- Metadata the add flow "extracts" ---------------------------------------
// Keyed by host. The product resolves a pending card asynchronously and fills it
// in place; the rig has no network, so this stands in for the extractor. A host
// that is not listed resolves to the honest floor: a URL-derived title and a
// source-keyed tint block, exactly as the shipped FeedCard does.
const PGD7_EXTRACT = {
  'newyorker.com': { source: 'The New Yorker' },
  'lithub.com': { source: 'Literary Hub' },
  'longreads.com': { source: 'Longreads', title: 'The Long Walk Home' },
  'theparisreview.org': { source: 'The Paris Review', title: 'The Art of Fiction No. 240' },
  'go.dev': { source: 'The Go Blog', image: 'uploads/card-previews/blog-overreacted.png' },
  'jvns.ca': { source: 'Julia Evans' },
  'sqlite.org': { source: 'SQLite', title: 'Appropriate Uses For SQLite' },
  'martinfowler.com': { source: 'Martin Fowler', image: 'uploads/card-previews/martinfowler-cd-pipeline.png' },
  'arxiv.org': { source: 'arXiv', image: 'uploads/card-previews/arxiv-2503-04918.png' },
  'danluu.com': { source: null, hasImage: false, faviconExists: false },
  'youtube.com': { source: 'YouTube', image: 'uploads/card-previews/youtube-hqdefault.jpg' },
  'github.com': { source: 'GitHub', image: 'uploads/card-previews/github-react.png' },
  'newsletter.pragmaticengineer.com': { source: 'The Pragmatic Engineer', image: 'uploads/card-previews/pragmatic-engineer.jpg' },
  'blog.rust-lang.org': { source: 'Rust Blog', image: 'uploads/card-previews/blog-overreacted.png' },
  'gutenberg.org': { source: 'Project Gutenberg', hasImage: false },
  'kernel.org': { source: 'The Linux Kernel Archives' },
};

// ---- Lookups ----------------------------------------------------------------
const pgd7Member = (id) => PGD7_MEMBERS.find((m) => m.id === id) || null;
const pgd7Name = (id) => { const m = pgd7Member(id); return m ? m.name : 'Former member'; };
const pgd7Others = () => PGD7_MEMBERS.filter((m) => !m.you);

window.PGD7_DATA = {
  circle: PGD7_CIRCLE,
  members: PGD7_MEMBERS,
  me: PGD7_MEMBERS[0],
  others: pgd7Others(),
  items: PGD7_ITEMS,
  extract: PGD7_EXTRACT,
  memberById: pgd7Member,
  nameOf: pgd7Name,
  REGISTERS: ['gist', 'trust', 'reflection', 'takeaway'],
  GLYPHS: [D7_HEART, D7_FIRE, D7_THUMB, D7_BULB, D7_LOL],
};
