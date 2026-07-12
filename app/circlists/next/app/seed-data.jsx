// ============================================================================
// Circlists — seed fixtures (data only, no logic).
// Lifted verbatim out of main.jsx so the root component stays a lean state
// machine. Pure data: the two tiny constructors (M, IT), the reaction glyph
// vocabulary, seedSpaces(), and DEFAULT_USER. Exposed on window.CircSeed;
// main.jsx and the scenarios aid read it from there. MUST load before main.jsx.
// ============================================================================
// ---- Seed data — inhabited, role-staged, no Lorem Ipsum --------------------
const M = (name, email) => ({ name, email });
const IT = (url, attribution, read, reactions) => ({ id: 'seed-' + Math.random().toString(36).slice(2, 9), url, attribution, read: !!read, reactions: reactions || [] });
// The Swell vocabulary — the only five glyphs a reaction can carry.
const HEART = '\u2764\uFE0F', FIRE = '\uD83D\uDD25', THUMB = '\uD83D\uDC4D', BULB = '\uD83D\uDCA1', LOL = '\uD83D\uDE02';

function seedSpaces(userEmail) {
  return [
    {
      // You champion it → Invite + Manage funding + "Championed by You".
      id: 'sp-backend',
      name: 'Backend Pod',
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
        IT('https://sqlite.org/whentouse.html', 'Added by former member.'),
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
        IT('https://martinfowler.com/bliki/CircuitBreaker.html', 'Added by former member.', true),
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
        IT('https://longreads.com/2026/01/the-long-walk-home/', 'Added by You.'),
      ],
    },
    {
      // Dormant — championed by Priya N. Default lands on the non-champion
      // take-over view; the launcher restages it for the champion views.
      id: 'sp-weekend',
      name: 'Weekend Reads',
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
}

const DEFAULT_USER = { firstName: 'Sam', lastName: 'Rivera', name: 'You', email: 'you@example.com' };

window.CircSeed = { M, IT, seedSpaces, DEFAULT_USER };
