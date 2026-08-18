// ============================================================================
// Circlists homepage demo — its own seed. NOT the development seed.
//
// The demo entry (circlists-homepage-demo.html) loads this INSTEAD of app/seed-data.jsx,
// so it must publish the same surface that file does:
//   window.CircSeed   = { M, IT, seedSpaces, DEFAULT_USER }   (main.jsx reads it
//                       at module load — every key is required)
//   window.CircFavicons(host)                                  (feed.jsx)
//
// Two rules this file exists to hold:
//   1. NO THIRD-PARTY REQUEST. feed.jsx falls back to Google's favicon service
//      for any host window.CircFavicons does not answer, so every item here
//      either uses a host with a baked-in local favicon (uploads/card-favicons)
//      or carries faviconExists: false. Preview images are local files only.
//   2. Nothing broken, nothing labelled TEST. The development seed exercises
//      failure — dormant circles, former members, stress fixtures. A visitor
//      needs the opposite: two circles doing the ordinary thing well.
//
// Content is a PROPOSAL (see HOMEPAGE-DEMO.md) and is meant to be easy to swap:
// edit the two space blocks below and nothing else.
// ============================================================================

const M = (name, email) => ({ name, email });
const IT = (url, attribution, read, reactions, meta) => ({ id: 'demo-' + Math.random().toString(36).slice(2, 9), url, attribution, read: !!read, reactions: reactions || [], ...(meta || {}) });

const HEART = '\u2764\uFE0F', FIRE = '\uD83D\uDD25', THUMB = '\uD83D\uDC4D', BULB = '\uD83D\uDCA1', LOL = '\uD83D\uDE02';

// Local favicons only (uploads/card-favicons). A host that is not here MUST be
// seeded with faviconExists: false — otherwise the card reaches for Google.
const DEMO_FAVICON_FILES = {
  'sqlite.org': 'uploads/card-favicons/sqlite.org.ico',
  'jvns.ca': 'uploads/card-favicons/jvns.ca.ico',
  'kernel.org': 'uploads/card-favicons/kernel.org.png',
  'gutenberg.org': 'uploads/card-favicons/gutenberg.org.ico',
  'newyorker.com': 'uploads/card-favicons/newyorker.com.ico',
};
window.CircFavicons = (host) => {
  const h = String(host || '').toLowerCase().replace(/^www\./, '');
  if (DEMO_FAVICON_FILES[h]) return DEMO_FAVICON_FILES[h];
  const key = Object.keys(DEMO_FAVICON_FILES).find(d => h.endsWith('.' + d));
  return key ? DEMO_FAVICON_FILES[key] : null;
};

// no-favicon shorthand — the honest absence state, not a fabricated mark
const NF = { faviconExists: false };

function seedSpaces(userEmail) {
  const spaces = [
    {
      // The visitor champions this one: the roster shows "Championed by You".
      id: 'sp-backend',
      name: 'Backend Pod',
      funded: true, dormancy: null, champion: 'You', championEmail: userEmail,
      members: [M('You', userEmail), M('Priya N.', 'priya.n@example.com'), M('Marcus T.', 'marcus.t@example.com'),
        M('Ada L.', 'ada.l@example.com'), M('Dev K.', 'dev.k@example.com'), M('Lena P.', 'lena.p@example.com'),
        M('Nadia F.', 'nadia.f@example.com')],
      items: [
        IT('https://newsletter.pragmaticengineer.com/p/scaling-on-call', 'Added by Priya N.', false, [
          { name: 'Marcus T.', glyph: FIRE, intensity: 0.86 },
          { name: 'Ada L.', glyph: FIRE, intensity: 0.72 },
          { name: 'Dev K.', glyph: BULB, intensity: 0.55 },
          { name: 'Lena P.', glyph: THUMB, intensity: 0.4 },
          { name: 'Nadia F.', skipped: true },
        ], { ...NF, title: 'Scaling On-Call Without Burning Out the Team', source: 'The Pragmatic Engineer', image: 'uploads/card-previews/pragmatic-engineer.jpg' }),
        IT('https://jvns.ca/blog/2026/02/dns-resolvers/', 'Added by Marcus T.', false, [
          { name: 'Priya N.', glyph: BULB, intensity: 0.62 },
          { name: 'Dev K.', glyph: THUMB, intensity: 0.45 },
        ], { title: 'How DNS Resolvers Actually Work', source: 'Julia Evans' }),
        IT('https://martinfowler.com/articles/cd-pipeline.html', 'Added by you', false, [
          { name: 'Ada L.', glyph: THUMB, intensity: 0.5 },
        ], { ...NF, title: 'Continuous Delivery Pipelines, End to End', source: 'Martin Fowler', image: 'uploads/card-previews/martinfowler-cd-pipeline.png' }),
        IT('https://danluu.com/percentile-latency/', 'Added by Ada L.', false, [
          { name: 'Priya N.', glyph: FIRE, intensity: 0.9 },
          { name: 'Marcus T.', glyph: THUMB, intensity: 0.5 },
          { name: 'Lena P.', glyph: BULB, intensity: 0.44 },
          { name: 'Dev K.', skipped: true },
        ], { ...NF, title: 'How to Measure Latency, and Why the Percentiles Matter', source: null, hasImage: false }),
        IT('https://sqlite.org/whentouse.html', 'Added by Dev K.', false, [
          { name: 'Nadia F.', glyph: BULB, intensity: 0.48 },
        ], { title: 'Appropriate Uses For SQLite', source: 'SQLite' }),
        IT('https://arxiv.org/abs/2503.04918', 'Added by Priya N.', false, [
          { name: 'Ada L.', glyph: LOL, intensity: 0.7 },
        ], { ...NF, title: 'Learned Index Structures for Time-Series Stores', source: 'arXiv', image: 'uploads/card-previews/arxiv-2503-04918.png' }),
        // ---- Read side ----
        IT('https://go.dev/blog/pipelines', 'Added by Marcus T.', true, [
          { name: 'Priya N.', glyph: FIRE, intensity: 0.72 },
          { name: 'Ada L.', glyph: FIRE, intensity: 0.88 },
          { name: 'Dev K.', glyph: FIRE, intensity: 0.5 },
          { name: 'You', glyph: THUMB, intensity: 0.55 },
          { name: 'Lena P.', glyph: HEART, intensity: 0.34 },
        ], { ...NF, title: 'Go Concurrency Patterns: Pipelines', source: 'The Go Blog', image: 'uploads/card-previews/youtube-hqdefault.jpg' }),
        IT('https://www.kernel.org/doc/html/latest/process/submitting-patches.html', 'Added by you', true, [
          { name: 'Priya N.', glyph: THUMB, intensity: 0.3 },
          { name: 'Lena P.', glyph: FIRE, intensity: 0.66 },
          { name: 'Ada L.', skipped: true },
        ], { title: 'Submitting Patches: The Essential Guide', source: 'The Linux Kernel Archives' }),
        IT('https://www.youtube.com/watch?v=Kx7Bvksk_qg', 'Added by Lena P.', true, [
          { name: 'Marcus T.', glyph: HEART, intensity: 0.6 },
          { name: 'You', glyph: BULB, intensity: 0.5 },
          { name: 'Dev K.', glyph: THUMB, intensity: 0.42 },
        ], { ...NF, title: 'Simple Made Easy \u2014 Rich Hickey', source: 'YouTube', image: 'uploads/card-previews/youtube-maxres.jpg' }),
        IT('https://go.dev/blog/errors-are-values', 'Added by Ada L.', true, [
          { name: 'Priya N.', skipped: true },
          { name: 'Marcus T.', skipped: true },
          { name: 'You', skipped: true },
        ], { ...NF, title: 'Errors Are Values: Handling Failure the Go Way', source: 'The Go Blog', image: 'uploads/card-previews/blog-overreacted.png' }),
      ],
    },
    {
      // Championed by someone else: the same surfaces, a plain member's view.
      id: 'sp-book',
      name: 'Tuesday Book Club',
      funded: true, dormancy: null, champion: 'Joe M.', championEmail: 'joe.m@example.com',
      members: [M('You', userEmail), M('Joe M.', 'joe.m@example.com'), M('Priya N.', 'priya.n@example.com'), M('Elif K.', 'elif.k@example.com')],
      items: [
        IT('https://www.newyorker.com/books/page-turner/the-quiet-novel-revival', 'Added by Joe M.', false, [
          { name: 'Elif K.', glyph: HEART, intensity: 0.66 },
          { name: 'Priya N.', glyph: THUMB, intensity: 0.4 },
        ], { title: 'The Quiet Novel Revival', source: 'The New Yorker' }),
        IT('https://lithub.com/on-rereading-your-favorite-books/', 'Added by Priya N.', false, [
          { name: 'Joe M.', glyph: HEART, intensity: 0.58 },
        ], { ...NF, title: 'On Rereading Your Favorite Books', source: 'Literary Hub' }),
        IT('https://www.theparisreview.org/interviews/the-art-of-fiction', 'Added by Elif K.', false, [], { ...NF, title: 'The Art of Fiction No. 240', source: 'The Paris Review' }),
        // ---- Read side ----
        IT('https://www.gutenberg.org/files/2701/2701-h/2701-h.htm', 'Added by Joe M.', true, [
          { name: 'Priya N.', glyph: HEART, intensity: 0.7 },
          { name: 'You', glyph: LOL, intensity: 0.45 },
          { name: 'Elif K.', glyph: HEART, intensity: 0.52 },
        ], { title: 'Moby-Dick; or, The Whale', source: 'Project Gutenberg', hasImage: false }),
        IT('https://www.gutenberg.org/files/1342/1342-h/1342-h.htm', 'Added by you', true, [
          { name: 'Joe M.', glyph: HEART, intensity: 0.62 },
          { name: 'Elif K.', skipped: true },
        ], { title: 'Pride and Prejudice', source: 'Project Gutenberg', hasImage: false }),
        IT('https://longreads.com/2026/01/the-long-walk-home/', 'Added by Elif K.', true, [
          { name: 'Priya N.', glyph: BULB, intensity: 0.5 },
          { name: 'You', skipped: true },
        ], { ...NF, title: 'The Long Walk Home', source: 'Longreads' }),
      ],
    },
  ];

  // ---- Liveliness fields (app/liveliness.jsx) ------------------------------
  // The demo lands CAUGHT UP: the last-seen mark sits above every seeded item,
  // so nothing pre-existing claims to be new and no circle wears a dot. The
  // arrival grammar is still live — it plays on what the visitor does.
  const HOUR = 3600e3, NOW = Date.now();
  spaces.forEach((sp) => {
    let unread = 0, read = 0;
    sp.items.forEach((it) => {
      it.at = it.read ? NOW - (6 * 24 + read++ * 20) * HOUR : NOW - (unread++ * 7 + 2) * HOUR;
    });
    sp.lastSeenAt = NOW;
    sp.unseen = false;
    sp.pending = [];
    sp.queued = [];
  });
  return spaces;
}

const DEFAULT_USER = { firstName: 'Sam', lastName: 'Rivera', name: 'You', email: 'sam.rivera@gmail.com' };

window.CircSeed = { M, IT, seedSpaces, DEFAULT_USER };
