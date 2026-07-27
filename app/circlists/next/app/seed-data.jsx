// ============================================================================
// Circlists — seed fixtures (data only, no logic).
// Lifted verbatim out of main.jsx so the root component stays a lean state
// machine. Pure data: the two tiny constructors (M, IT), the reaction glyph
// vocabulary, seedSpaces(), and DEFAULT_USER. Exposed on window.CircSeed;
// main.jsx and the scenarios aid read it from there. MUST load before main.jsx.
// ============================================================================
// ---- Seed data — inhabited, role-staged, no Lorem Ipsum --------------------
const M = (name, email) => ({ name, email });
// IT(url, attribution, read, reactions, meta?) — `meta` carries the extracted
// enrichment fields (BIZ-80): { title, source, image, hasImage, faviconExists }.
// Omit meta and the card derives a title from the URL + shows a tint block.
const IT = (url, attribution, read, reactions, meta) => ({ id: 'seed-' + Math.random().toString(36).slice(2, 9), url, attribution, read: !!read, reactions: reactions || [], ...(meta || {}) });
// The Swell vocabulary — the only five glyphs a reaction can carry.
const HEART = '\u2764\uFE0F', FIRE = '\uD83D\uDD25', THUMB = '\uD83D\uDC4D', BULB = '\uD83D\uDCA1', LOL = '\uD83D\uDE02';

// ---- Extracted metadata (BIZ-80), keyed by URL. Merged onto the seed items in
// seedSpaces() so the item fixtures stay readable. Fields: title (headline),
// source (publication; omit -> bare domain), image (preview path; omit -> a
// source-keyed tint block), hasImage:false (genuinely no preview -> text-only),
// faviconExists:false (host ships no favicon -> no garnish). The throwaway TEST
// spaces are intentionally left unlisted: they derive a title + tint block.
const SEED_META = {
  'https://newsletter.pragmaticengineer.com/p/scaling-on-call': { title: 'Scaling On-Call Without Burning Out the Team', source: 'The Pragmatic Engineer', image: 'uploads/card-previews/pragmatic-engineer.jpg' },
  'https://blog.rust-lang.org/2026/01/async-internals': { title: 'Inside Async: How Rust Schedules Your Futures', source: 'Rust Blog', image: 'uploads/card-previews/blog-overreacted.png' },
  'https://martinfowler.com/articles/cd-pipeline.html': { title: 'Continuous Delivery Pipelines, End to End', source: 'Martin Fowler' },
  'https://arxiv.org/abs/2503.04918': { title: 'Learned Index Structures for Time-Series Stores', source: 'arXiv' },
  'https://www.youtube.com/watch?v=Kx7Bvksk_qg': { title: 'Simple Made Easy \u2014 Rich Hickey', source: 'YouTube', image: 'uploads/card-previews/youtube-maxres.jpg' },
  'https://danluu.com/percentile-latency/': { title: 'How to Measure Latency, and Why the Percentiles Matter', source: null, hasImage: false, faviconExists: false },
  'https://sqlite.org/whentouse.html': { title: 'Appropriate Uses For SQLite', source: 'SQLite' },
  'https://go.dev/blog/pipelines': { title: 'Go Concurrency Patterns: Pipelines', source: 'The Go Blog', image: 'uploads/card-previews/youtube-hqdefault.jpg' },
  'https://jvns.ca/blog/2026/02/dns-resolvers/': { title: 'How DNS Resolvers Actually Work', source: 'Julia Evans' },
  'https://www.kernel.org/doc/html/latest/process/submitting-patches.html': { title: 'Submitting Patches: The Essential Guide', source: 'The Linux Kernel Archives' },
  'https://martinfowler.com/bliki/FormerMember.html': { title: 'On Naming Things You Later Regret', source: 'Martin Fowler', hasImage: false },
  'https://go.dev/blog/errors-are-values': { title: 'Errors Are Values: Handling Failure the Go Way', source: 'The Go Blog', image: 'uploads/card-previews/blog-overreacted.png' },
  'https://www.newyorker.com/books/page-turner/the-quiet-novel-revival': { title: 'The Quiet Novel Revival', source: 'The New Yorker' },
  'https://lithub.com/on-rereading-your-favorite-books/': { title: 'On Rereading Your Favorite Books', source: 'Literary Hub' },
  'https://www.theparisreview.org/interviews/the-art-of-fiction': { title: 'The Art of Fiction No. 240', source: 'The Paris Review' },
  'https://www.gutenberg.org/files/2701/2701-h/2701-h.htm': { title: 'Moby-Dick; or, The Whale', source: 'Project Gutenberg', hasImage: false },
  'https://www.gutenberg.org/files/1342/1342-h/1342-h.htm': { title: 'Pride and Prejudice', source: 'Project Gutenberg', hasImage: false },
  'https://longreads.com/2026/01/the-long-walk-home/': { title: 'The Long Walk Home', source: 'Longreads' },
  'https://engineering.stripe-shopfront-example.com/blog/2026/03/how-we-migrated-forty-two-microservices-off-a-shared-postgres-instance-without-downtime': { title: 'How We Migrated Forty-Two Microservices Off a Shared Postgres Instance Without Any Downtime', source: 'Engineering at Shopfront', image: 'uploads/card-previews/blog-overreacted.png' },
  'https://docs.internal-infra-example.org/wiki/spaces/PLATFORM/pages/884213/postmortem-2026-02-14-cross-region-replication-lag-incident-review-and-followups': { title: 'Postmortem: Cross-Region Replication Lag Incident, Root Cause, and the Nineteen Followup Action Items', source: null, hasImage: false, faviconExists: false },
  'https://blog.distributed-systems-weekly-example.com/archive/2026/consensus-protocols-explained-raft-paxos-and-why-most-teams-should-never-build-their-own': { title: 'Consensus Protocols Explained: Raft, Paxos, and Why Most Teams Should Never Build Their Own', source: 'Distributed Systems Weekly', image: 'uploads/card-previews/youtube-hqdefault.jpg' },
  'https://internal-wiki-example.atlassian.net/wiki/spaces/ENG/pages/9982341/runbook-database-failover-procedure-for-the-primary-analytics-cluster-updated-march-2026': { title: 'Runbook: Database Failover Procedure for the Primary Analytics Cluster (Updated March 2026)', source: null, hasImage: false, faviconExists: false },
};

function seedSpaces(userEmail) {
  const spaces = [
    {
      // You champion it → Invite + Manage funding + "Championed by You".
      id: 'sp-backend',
      name: 'Backend Pod',
      funded: true, dormancy: null, champion: 'You', championEmail: userEmail,
      members: [M('You', userEmail), M('Sam R.', 'sam.r@example.com'), M('Priya N.', 'priya.n@example.com'), M('Marcus T.', 'marcus.t@example.com'), M('Ada L.', 'ada.l@example.com'), M('Dev K.', 'dev.k@example.com'), M('Lena P.', 'lena.p@example.com'), M('Nadia F.', 'nadia.f@example.com'), M('Theo B.', 'theo.b@example.com'), M('Owen D.', 'owen.d@example.com'), M('Freya S.', 'freya.s@example.com')],
      items: [
        IT('https://newsletter.pragmaticengineer.com/p/scaling-on-call', 'Added by Marcus T.', false, [
          { name: 'Priya N.', glyph: FIRE, intensity: 0.9 },
          { name: 'Sam R.', glyph: FIRE, intensity: 0.84 },
          { name: 'Dev K.', glyph: FIRE, intensity: 0.7 },
          { name: 'Ada L.', glyph: BULB, intensity: 0.55 },
          { name: 'Lena P.', glyph: THUMB, intensity: 0.4 },
          { name: 'Nadia F.', skipped: true },
          { name: 'Theo B.', skipped: true },
        ]),
        IT('https://blog.rust-lang.org/2026/01/async-internals', 'Added by Priya N.', false, [
          { name: 'Marcus T.', glyph: FIRE, intensity: 0.66 },
          { name: 'Ada L.', glyph: FIRE, intensity: 0.72 },
          { name: 'Sam R.', glyph: BULB, intensity: 0.5 },
        ]),
        IT('https://martinfowler.com/articles/cd-pipeline.html', 'Added by Sam R.', false, [
          { name: 'Priya N.', glyph: BULB, intensity: 0.45 },
          { name: 'Dev K.', glyph: THUMB, intensity: 0.3 },
        ]),
        IT('https://arxiv.org/abs/2503.04918', 'Added by Priya N.', false, [
          { name: 'Ada L.', glyph: LOL, intensity: 0.82 },
          { name: 'Marcus T.', glyph: BULB, intensity: 0.4 },
        ]),
        IT('https://www.youtube.com/watch?v=Kx7Bvksk_qg', 'Added by Marcus T.', false, [
          { name: 'Lena P.', glyph: HEART, intensity: 0.6 },
        ]),
        IT('https://danluu.com/percentile-latency/', 'Added by Sam R.', false, [
          { name: 'Priya N.', glyph: THUMB, intensity: 0.74 },
          { name: 'Marcus T.', glyph: THUMB, intensity: 0.5 },
          { name: 'Dev K.', glyph: THUMB, intensity: 0.62 },
          { name: 'Ada L.', glyph: BULB, intensity: 0.44 },
          { name: 'Lena P.', glyph: FIRE, intensity: 0.9 },
          { name: 'Nadia F.', skipped: true },
          { name: 'Theo B.', skipped: true },
        ]),
        IT('https://sqlite.org/whentouse.html', 'Added by former member'),
        IT('https://go.dev/blog/pipelines', 'Added by Marcus T.', true, [
          { name: 'Priya N.', glyph: FIRE, intensity: 0.72 },
          { name: 'Ada L.', glyph: FIRE, intensity: 0.88 },
          { name: 'Dev K.', glyph: FIRE, intensity: 0.5 },
          { name: 'Sam R.', glyph: BULB, intensity: 0.4 },
          { name: 'Lena P.', glyph: HEART, intensity: 0.34 },
          { name: 'You', glyph: THUMB, intensity: 0.55 },
        ]),
        IT('https://jvns.ca/blog/2026/02/dns-resolvers/', 'Added by Priya N.', true, [
          { name: 'Marcus T.', glyph: LOL, intensity: 0.86 },
          { name: 'Ada L.', glyph: BULB, intensity: 0.62 },
          { name: 'You', glyph: FIRE, intensity: 0.5 },
          { name: 'Dev K.', glyph: THUMB, intensity: 0.28 },
          { name: 'Sam R.', skipped: true },
          { name: 'Lena P.', skipped: true },
        ]),
        IT('https://www.kernel.org/doc/html/latest/process/submitting-patches.html', 'Added by Sam R.', true, [
          { name: 'Priya N.', glyph: THUMB, intensity: 0.3 },
          { name: 'Lena P.', glyph: FIRE, intensity: 0.66 },
          { name: 'Ada L.', skipped: true },
          { name: 'You', skipped: true },
        ]),
        // Everyone who's read it skipped — no glyphs at all. The door still shows:
        // empty disc, roster is just the skip list. Also the former-member demo:
        // one row has no name, only { former: true } — their account was deleted,
        // so the roster labels them "Former member" same as the card attribution.
        IT('https://martinfowler.com/bliki/FormerMember.html', 'Added by former member', true, [
          { name: 'Sam R.', skipped: true },
          { name: 'Priya N.', skipped: true },
          { former: true, skipped: true },
          { name: 'Ada L.', skipped: true },
          { name: 'You', skipped: true },
        ]),
        // Read + all-skips but WITH a preview image — the bare (glyph-less) door
        // sitting on an image-bearing card, to compare against the image cards above.
        IT('https://go.dev/blog/errors-are-values', 'Added by Ada L.', true, [
          { name: 'Priya N.', skipped: true },
          { name: 'Marcus T.', skipped: true },
          { name: 'Sam R.', skipped: true },
          { name: 'You', skipped: true },
        ]),
        // Long-URL / long-title stress cases — one with a preview image, one without.
        IT('https://engineering.stripe-shopfront-example.com/blog/2026/03/how-we-migrated-forty-two-microservices-off-a-shared-postgres-instance-without-downtime', 'Added by Dev K.', false, [
          { name: 'Marcus T.', glyph: FIRE, intensity: 0.6 },
          { name: 'Priya N.', glyph: BULB, intensity: 0.42 },
        ]),
        IT('https://docs.internal-infra-example.org/wiki/spaces/PLATFORM/pages/884213/postmortem-2026-02-14-cross-region-replication-lag-incident-review-and-followups', 'Added by Priya N.', true, [
          { name: 'Sam R.', glyph: THUMB, intensity: 0.5 },
          { name: 'Ada L.', skipped: true },
        ]),
        IT('https://blog.distributed-systems-weekly-example.com/archive/2026/consensus-protocols-explained-raft-paxos-and-why-most-teams-should-never-build-their-own', 'Added by Ada L.', false, [
          { name: 'Dev K.', glyph: FIRE, intensity: 0.68 },
          { name: 'Lena P.', glyph: BULB, intensity: 0.3 },
        ]),
        IT('https://internal-wiki-example.atlassian.net/wiki/spaces/ENG/pages/9982341/runbook-database-failover-procedure-for-the-primary-analytics-cluster-updated-march-2026', 'Added by Marcus T.', true, [
          { name: 'Priya N.', skipped: true },
          { name: 'You', skipped: true },
        ]),
        // No SEED_META entry on purpose — no title at all, just the raw giant URL/slug.
        IT('https://analytics-internal-example.com/?trace=8823ff1c9e0a4b12-2026-03-retro-followups-database-migration-incident-action-items-and-owners-final-draft-v3', 'Added by Sam R.', false, [
          { name: 'Dev K.', skipped: true },
        ]),
      ],
    },
    {
      // Championed by Joe M. — you're a plain member (non-champion view).
      id: 'sp-book',
      name: 'Tuesday Book Club',
      funded: true, dormancy: null, champion: 'Joe M.', championEmail: 'joe.m@example.com',
      members: [M('You', userEmail), M('Joe M.', 'joe.m@example.com'), M('Priya N.', 'priya.n@example.com'), M('Sam R.', 'sam.r@example.com')],
      items: [
        IT('https://www.newyorker.com/books/page-turner/the-quiet-novel-revival', 'Added by Joe M.'),
        IT('https://lithub.com/on-rereading-your-favorite-books/', 'Added by Priya N.'),
        IT('https://www.theparisreview.org/interviews/the-art-of-fiction', 'Added by Sam R.'),
        IT('https://www.gutenberg.org/files/2701/2701-h/2701-h.htm', 'Added by Joe M.', true, [
          { name: 'Priya N.', glyph: HEART, intensity: 0.7 },
          { name: 'You', glyph: LOL, intensity: 0.45 },
        ]),
      ],
    },
    {
      // Small two-person space — championed by Sam R. (non-champion view).
      id: 'sp-sam',
      name: 'Me & Sam',
      funded: true, dormancy: null, champion: 'Sam R.', championEmail: 'sam.r@example.com',
      members: [M('You', userEmail), M('Sam R.', 'sam.r@example.com')],
      items: [
        IT('https://www.gutenberg.org/files/1342/1342-h/1342-h.htm', 'Added by Sam R.'),
        IT('https://longreads.com/2026/01/the-long-walk-home/', 'Added by you'),
      ],
    },
    {
      // TEST fixtures — the data-type showcase items lifted out of Backend Pod so
      // the demo reads clean. Each URL self-describes the reaction shape it stages
      // (empty / skips / hearts-clustered / hearts-and-fires). Delete this whole
      // space object before shipping a demo build.
      id: 'sp-test-backend',
      name: 'TEST - Backend Pod',
      funded: true, dormancy: null, champion: 'You', championEmail: userEmail,
      members: [M('You', userEmail), M('Sam R.', 'sam.r@example.com'), M('Priya N.', 'priya.n@example.com'), M('Marcus T.', 'marcus.t@example.com'), M('Ada L.', 'ada.l@example.com'), M('Dev K.', 'dev.k@example.com'), M('Lena P.', 'lena.p@example.com'), M('Nadia F.', 'nadia.f@example.com'), M('Theo B.', 'theo.b@example.com'), M('Owen D.', 'owen.d@example.com'), M('Freya S.', 'freya.s@example.com')],
      items: [
        // No reactions yet — react/skip this one to see the "first one here" moment.
        IT('https://firstonehere.com', 'Added by Sam R.', false, []),
        // A few responded, a couple skipped — roster mixes reactions and read-rings.
        IT('https://afewskipped.com', 'Added by Priya N.', false, [
          { name: 'Marcus T.', glyph: FIRE, intensity: 0.6 },
          { name: 'Ada L.', glyph: THUMB, intensity: 0.45 },
          { name: 'Dev K.', glyph: BULB, intensity: 0.52 },
          { name: 'Sam R.', skipped: true },
          { name: 'Lena P.', skipped: true },
        ]),
        // Every other member has already responded — a cluster of hearts among the rest.
        IT('https://heartsclustered.com', 'Added by Ada L.', false, [
          { name: 'Sam R.', glyph: HEART, intensity: 0.5 },
          { name: 'Priya N.', glyph: HEART, intensity: 0.62 },
          { name: 'Marcus T.', glyph: HEART, intensity: 0.7 },
          { name: 'Ada L.', glyph: HEART, intensity: 0.48 },
          { name: 'Dev K.', glyph: HEART, intensity: 0.44 },
          { name: 'Lena P.', glyph: HEART, intensity: 0.58 },
          { name: 'Nadia F.', glyph: THUMB, intensity: 0.5 },
          { name: 'Theo B.', glyph: BULB, intensity: 0.4 },
        ]),
        // Stress fixture — five hearts + five fires, adjacent sectors, even split.
        // Purpose: see how two big same-glyph huddles behave shoulder-to-shoulder.
        IT('https://heartsandfires.com', 'Added by Sam R.', false, [
          { name: 'Sam R.', glyph: HEART, intensity: 0.44 },
          { name: 'Priya N.', glyph: HEART, intensity: 0.56 },
          { name: 'Marcus T.', glyph: HEART, intensity: 0.66 },
          { name: 'Ada L.', glyph: HEART, intensity: 0.5 },
          { name: 'Dev K.', glyph: HEART, intensity: 0.6 },
          { name: 'Lena P.', glyph: FIRE, intensity: 0.46 },
          { name: 'Nadia F.', glyph: FIRE, intensity: 0.58 },
          { name: 'Theo B.', glyph: FIRE, intensity: 0.68 },
          { name: 'Owen D.', glyph: FIRE, intensity: 0.52 },
          { name: 'Freya S.', glyph: FIRE, intensity: 0.62 },
        ]),
      ],
    },
    {
      // TEST fixture \u2014 the dormant/terminal take-over showcase lifted out of the
      // demo so Weekend Reads can read as a plain circle. Stages the non-champion
      // dormant view (funded:false). Delete this whole space object before shipping.
      id: 'sp-test-weekend',
      name: 'TEST - Weekend Reads',
      funded: false, dormancy: 'terminal', champion: 'Priya N.', championEmail: 'priya.n@example.com',
      members: [M('You', userEmail), M('Priya N.', 'priya.n@example.com'), M('Marcus T.', 'marcus.t@example.com'), M('Sam R.', 'sam.r@example.com')],
      items: [
        IT('https://www.theatlantic.com/magazine/archive/the-art-of-the-slow-weekend', 'Added by Priya N.'),
        IT('https://www.newyorker.com/culture/cultural-comment/the-case-for-doing-nothing', 'Added by Marcus T.'),
        IT('https://longreads.com/2026/02/notes-on-walking/', 'Added by Priya N.'),
        IT('https://aeon.co/essays/why-boredom-is-good-for-you', 'Added by Sam R.', true),
      ],
    },
  ];
  // Fold the extracted metadata onto each seed item (see SEED_META).
  spaces.forEach((sp) => sp.items.forEach((it) => { if (SEED_META[it.url]) Object.assign(it, SEED_META[it.url]); }));
  return spaces;
}

const DEFAULT_USER = { firstName: 'Sam', lastName: 'Rivera', name: 'You', email: 'sam.rivera@gmail.com' };

window.CircSeed = { M, IT, seedSpaces, DEFAULT_USER };
