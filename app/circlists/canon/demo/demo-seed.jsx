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

  // ---- Discourse (app/talk-*.jsx) ------------------------------------------
  // Thoughts and conversations on a handful of cards, so the feature is present
  // rather than an empty affordance. Same two rules as the rest of this file: no
  // third-party request, nothing broken. Marks sit at NOW — the demo lands CAUGHT
  // UP, so no turn wears the unseen tab and the returns bar stays folded until
  // words arrive while the visitor is here.
  // martinfowler.com is deliberately left thought-less: it is the visitor's own
  // card, so its empty band is where they can write one.
  {
    const H = 3600e3, NOW = Date.now();
    const T = (id, by, hoursAgo, text, replyTo) => ({ id, by, text, at: NOW - hoursAgo * H, ...(replyTo ? { replyTo } : {}) });
    const byUrl = {};
    spaces.forEach(sp => sp.items.forEach(it => { byUrl[it.url] = it; }));
    const set = (url, fields) => { const it = byUrl[url]; if (it) Object.assign(it, { talkSeenAt: NOW, ...fields }); };

    set('https://newsletter.pragmaticengineer.com/p/scaling-on-call', {
      thought: { by: 'Priya N.', text: 'The rotation sizing section is the one to read before we plan next quarter.', at: NOW - 5 * H },
      talk: [
        T('pe1', 'Marcus T.', 4, 'Their rotation is six deep and ours is four. That is the whole difference in how tired everyone is.'),
        T('pe2', 'Ada L.', 3, 'Agreed on the depth. The handover checklist is the cheaper half of it, though.', 'pe1'),
        T('pe3', 'Dev K.', 2, 'Worth putting the comp table next to ours before Thursday.'),
      ],
    });
    set('https://jvns.ca/blog/2026/02/dns-resolvers/', {
      thought: { by: 'Marcus T.', text: 'Sending this round before the resolver migration — the diagrams are the clearest I have seen.', at: NOW - 9 * H },
      talk: [T('dn1', 'Priya N.', 6, 'The stub-resolver drawing is the one that finally made the caching layer make sense to me.')],
    });
    set('https://go.dev/blog/pipelines', {
      watching: true,
      thought: { by: 'Marcus T.', text: 'The fan-in section is the one to slow down for. It explains our worker-pool shutdown bug.', at: NOW - 40 * H },
      talk: [
        T('gp1', 'Priya N.', 30, 'The done-channel pattern here is exactly what the ingest service is missing. We cancel by killing the process.'),
        T('gp2', 'You', 26, 'Same conclusion. I will write up how we would retrofit it.', 'gp1'),
        T('gp3', 'Ada L.', 18, 'The stage-per-goroutine shape is worth copying wholesale.'),
      ],
    });
    set('https://www.kernel.org/doc/html/latest/process/submitting-patches.html', {
      watching: true,
      talk: [
        T('kp1', 'Lena P.', 22, 'The changelog section is the part our own reviews keep failing on.'),
        T('kp2', 'Priya N.', 20, 'Yes — one logical change per patch would fix most of our review churn.', 'kp1'),
      ],
    });
    set('https://www.newyorker.com/books/page-turner/the-quiet-novel-revival', {
      thought: { by: 'Joe M.', text: 'Short piece, and it names what we kept circling around last Tuesday.', at: NOW - 14 * H },
      talk: [T('qn1', 'Elif K.', 11, 'The paragraph on quiet endings is the one I would read aloud.')],
    });
    set('https://www.gutenberg.org/files/2701/2701-h/2701-h.htm', {
      watching: true,
      thought: { by: 'Joe M.', text: 'Chapters 32 to 35 are the ones to come with marked up.', at: NOW - 70 * H },
      talk: [
        T('md1', 'Priya N.', 60, 'The cetology chapter is a joke that lasts forty pages and I am here for it.'),
        T('md2', 'You', 52, 'It reads as a straight face held far too long, which is the point.', 'md1'),
        T('md3', 'Elif K.', 44, 'Bringing the Ahab-on-deck passage on Tuesday.'),
      ],
    });
  }

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
