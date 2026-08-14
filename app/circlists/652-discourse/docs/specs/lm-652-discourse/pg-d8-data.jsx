// ============================================================================
// Discourse v8 — seeded circle + the five states' declarations.
// Data only. Cards are seeded in VARIED conversational states so every state
// can be felt as reader one and as reader four: no words yet, a first
// reflection, a live exchange, a full late-arrival record, and an empty record.
// ============================================================================
const { M: D8M, IT: D8IT } = window.CircSeed;
const [D8_HEART, D8_FIRE, D8_THUMB, D8_BULB, D8_LOL] = window.RX_GLYPHS;

const MIN = 60e3, HR = 3600e3, DAY = 24 * HR;
const NOW = Date.now();
const ago = (ms) => NOW - ms;

// A talk entry — one member's utterance on one card.
//   by        display name ('You' for the current member)
//   text      their own words, whole
//   at        when it was said
//   glyph/iv  the Swell reaction given in the same act (absent = they skipped it)
//   replyTo   id of the entry it answers (absent = a reflection of its own)
let d8n = 0;
const T = (by, text, at, glyph, intensity, replyTo) =>
  ({ id: 't' + (++d8n), by, text, at, glyph: glyph || null, intensity: intensity == null ? null : intensity, replyTo: replyTo || null });

const D8_MEMBERS = [
  D8M('You', 'sam.rivera@gmail.com'), D8M('Priya N.', 'priya.n@example.com'),
  D8M('Marcus T.', 'marcus.t@example.com'), D8M('Ada L.', 'ada.l@example.com'),
  D8M('Dev K.', 'dev.k@example.com'), D8M('Lena P.', 'lena.p@example.com'),
  D8M('Nadia F.', 'nadia.f@example.com'), D8M('Theo B.', 'theo.b@example.com'),
  D8M('Sam R.', 'sam.r@example.com'),
];

// meta lifted from app/seed-data.jsx's SEED_META so the cards carry their real
// titles, sources and previews (the shipped extraction fixtures).
const D8_META = {
  'https://martinfowler.com/articles/cd-pipeline.html': { title: 'Continuous Delivery Pipelines, End to End', source: 'Martin Fowler', image: 'uploads/card-previews/martinfowler-cd-pipeline.png' },
  'https://blog.rust-lang.org/2026/01/async-internals': { title: 'Inside Async: How Rust Schedules Your Futures', source: 'Rust Blog', image: 'uploads/card-previews/blog-overreacted.png' },
  'https://arxiv.org/abs/2503.04918': { title: 'Learned Index Structures for Time-Series Stores', source: 'arXiv', image: 'uploads/card-previews/arxiv-2503-04918.png' },
  'https://danluu.com/percentile-latency/': { title: 'How to Measure Latency, and Why the Percentiles Matter', source: null, hasImage: false, faviconExists: false },
  'https://newsletter.pragmaticengineer.com/p/scaling-on-call': { title: 'Scaling On-Call Without Burning Out the Team', source: 'The Pragmatic Engineer', image: 'uploads/card-previews/pragmatic-engineer.jpg' },
  'https://go.dev/blog/pipelines': { title: 'Go Concurrency Patterns: Pipelines', source: 'The Go Blog', image: 'uploads/card-previews/youtube-hqdefault.jpg' },
  'https://jvns.ca/blog/2026/02/dns-resolvers/': { title: 'How DNS Resolvers Actually Work', source: 'Julia Evans' },
  'https://www.kernel.org/doc/html/latest/process/submitting-patches.html': { title: 'Submitting Patches: The Essential Guide', source: 'The Linux Kernel Archives' },
  'https://www.youtube.com/watch?v=Kx7Bvksk_qg': { title: 'Simple Made Easy \u2014 Rich Hickey', source: 'YouTube', image: 'uploads/card-previews/youtube-maxres.jpg' },
  'https://sqlite.org/whentouse.html': { title: 'Appropriate Uses For SQLite', source: 'SQLite' },
  'https://go.dev/blog/errors-are-values': { title: 'Errors Are Values: Handling Failure the Go Way', source: 'The Go Blog', image: 'uploads/card-previews/blog-overreacted.png' },
};

// C(url, by, read, at, opts) — one seeded card.
//   thought   the contributor's attached line, public before the read
//   talk      what has been said on it (revealed only once YOU have read it)
//   seenAt    when you last looked at its record; anything later reads as new
const C = (url, by, read, at, opts = {}) => ({
  ...D8IT(url, by === 'You' ? 'Added by you' : 'Added by ' + by, read, opts.reactions || []),
  ...(D8_META[url] || {}),
  at,
  thought: opts.thought ? { by, text: opts.thought, at } : null,
  talk: opts.talk || [],
  seenAt: opts.seenAt == null ? NOW : opts.seenAt,
  watched: !!opts.watched,          // set by hand, on top of the automatic set
  unwatched: !!opts.unwatched,      // stood down by hand
});

// The shelf, as it actually gets. Read is not a short list — a fortnight in it
// is a hundred cards deep, and the card you were part of is somewhere in the
// middle of it. These carry no talk and are in nobody's watched set: they are
// the silt the return affordances exist to see past.
const D8_SILT = [
  ['https://www.usenix.org/conference/osdi/storage-engines-revisited', 'Lena P.', 13],
  ['https://blog.cloudflare.com/tuning-tcp-backlogs/', 'Theo B.', 14],
  ['https://queue.acm.org/detail/reliability-budgets', 'Ada L.', 15],
  ['https://brooker.co.za/blog/timeouts-and-retries', 'Dev K.', 16],
  ['https://www.postgresql.org/docs/current/index-locking.html', 'Nadia F.', 17],
  ['https://research.google/pubs/monarch-planet-scale-monitoring/', 'Marcus T.', 18],
  ['https://ferd.ca/the-hidden-cost-of-queues.html', 'Priya N.', 19],
  ['https://www.scattered-thoughts.net/writing/against-sql', 'Sam R.', 21],
  ['https://rachelbythebay.com/w/2026/03/logging-that-lies', 'Lena P.', 23],
  ['https://blog.regehr.org/archives/undefined-behaviour-again', 'Theo B.', 24],
  ['https://tigerbeetle.com/blog/deterministic-simulation-testing', 'Ada L.', 25],
  ['https://www.hytradboi.com/talks/incremental-view-maintenance', 'Dev K.', 27],
];
const d8Silt = (from, to) => D8_SILT.slice(from, to).map(([url, by, days], n) => C(url, by, true, ago(days * DAY), {
  reactions: [
    { name: n % 2 ? 'Priya N.' : 'Marcus T.', glyph: n % 3 === 0 ? D8_THUMB : n % 3 === 1 ? D8_BULB : D8_HEART, intensity: 0.3 + (n % 4) * 0.15 },
    { name: 'You', skipped: true },
  ],
}));

const d8Cards = () => [
  // ---- Active -------------------------------------------------------------
  // A bare link with no thought at all: attaching is optional and never punished.
  C('https://martinfowler.com/articles/cd-pipeline.html', 'Sam R.', false, ago(2 * HR), {
    reactions: [{ name: 'Dev K.', glyph: D8_THUMB, intensity: 0.4 }],
  }),
  // A thought, public before the read. Nobody has spoken yet — read it and you
  // are the first one here.
  C('https://blog.rust-lang.org/2026/01/async-internals', 'Priya N.', false, ago(5 * HR), {
    thought: 'The scheduler section is the bit I have never had explained properly. Worth it for that alone.',
    reactions: [{ name: 'Marcus T.', glyph: D8_FIRE, intensity: 0.66 }],
  }),
  // Reader seven: six people have already spoken, and none of it is visible
  // until you read it yourself.
  C('https://arxiv.org/abs/2503.04918', 'Marcus T.', false, ago(28 * HR), {
    thought: 'Sceptical of the benchmark, but the failure analysis in \u00a75 is honest.',
    reactions: [
      { name: 'Priya N.', glyph: D8_BULB, intensity: 0.82 }, { name: 'Ada L.', glyph: D8_THUMB, intensity: 0.5 },
      { name: 'Dev K.', glyph: D8_FIRE, intensity: 0.62 }, { name: 'Lena P.', glyph: D8_BULB, intensity: 0.44 },
      { name: 'Theo B.', glyph: D8_BULB, intensity: 0.28 }, { name: 'Marcus T.', glyph: D8_BULB, intensity: 0.6 },
      { name: 'Nadia F.', skipped: true },
    ],
    talk: (() => { const a = [
      T('Priya N.', 'The index itself is not the interesting part. The rebuild cost is.', ago(26 * HR), D8_BULB, 0.82),
      T('Ada L.', 'Benchmarks are on synthetic traces again. Nobody\u2019s series look like that.', ago(24 * HR), D8_THUMB, 0.5),
      T('Dev K.', '\u00a75 is the honest bit. Rare to see a paper publish the case where it loses.', ago(20 * HR), D8_FIRE, 0.62),
      T('Theo B.', 'Skimmed it. The related-work section is a decent reading list on its own.', ago(9 * HR), D8_BULB, 0.28),
      T('Marcus T.', 'Rereading. The rebuild cost is the point I would push on if we tried this here.', ago(4 * HR), D8_BULB, 0.6),
    ]; a.splice(3, 0, T('Lena P.', 'Agreed, though the trace generator is at least public this time.', ago(18 * HR), D8_BULB, 0.44, a[1].id)); return a; })(),
  }),
  C('https://danluu.com/percentile-latency/', 'You', false, ago(2 * DAY), {}),
  // A longer thought — the bound under pressure.
  C('https://newsletter.pragmaticengineer.com/p/scaling-on-call', 'Ada L.', false, ago(3 * DAY), {
    thought: 'We already do about half of this. The half we do not is the half that is hurting.',
    reactions: [{ name: 'Dev K.', glyph: D8_FIRE, intensity: 0.9 }, { name: 'Priya N.', glyph: D8_THUMB, intensity: 0.5 }],
    talk: [
      T('Dev K.', 'The rota section is the argument I failed to make last quarter.', ago(2.6 * DAY), D8_FIRE, 0.9),
      T('Priya N.', 'We would need to fix handover before any of this lands.', ago(2.2 * DAY), D8_THUMB, 0.5),
    ],
  }),

  // ---- Read ---------------------------------------------------------------
  // Yours, with your thought and your reflection: watched, and two lines have
  // landed since you last looked — one of them answering you.
  (() => {
    const t = [
      T('Ada L.', 'The cancellation pattern here is the one I keep reaching for and never remember correctly.', ago(6 * DAY), D8_FIRE, 0.88),
      T('Dev K.', 'Half of our pipeline bugs are this, written badly.', ago(5 * DAY), D8_THUMB, 0.5),
      T('You', 'It reads dated until you notice that everything since is sugar over it.', ago(4 * DAY), D8_BULB, 0.55),
    ];
    t.push(T('Marcus T.', 'Sugar that changed who can write it, though. Errgroup put this pattern in reach of the whole team.', ago(5 * HR), D8_BULB, 0.7, t[2].id));
    t.push(T('Lena P.', 'Sent this to my old team. Two of them have rewritten a worker on the back of it.', ago(90 * MIN), D8_HEART, 0.34));
    return C('https://go.dev/blog/pipelines', 'You', true, ago(8 * DAY), {
      thought: 'Old, but still the clearest thing on cancellation I have found.',
      reactions: [
        { name: 'Ada L.', glyph: D8_FIRE, intensity: 0.88 }, { name: 'Dev K.', glyph: D8_THUMB, intensity: 0.5 },
        { name: 'You', glyph: D8_BULB, intensity: 0.55 }, { name: 'Marcus T.', glyph: D8_BULB, intensity: 0.7 },
        { name: 'Lena P.', glyph: D8_HEART, intensity: 0.34 }, { name: 'Priya N.', skipped: true },
      ],
      talk: t, seenAt: ago(3 * DAY),
    });
  })(),
  // A live exchange — and one line landed on it two hours ago, answering you.
  ...d8Silt(0, 5),
  (() => {
    const t = [
      T('Marcus T.', 'The part where she simply reads the packets. I have been guessing at this for years.', ago(9 * DAY), D8_LOL, 0.86),
      T('You', 'This is going into the onboarding doc.', ago(9 * DAY), D8_FIRE, 0.5),
    ];
    t.push(T('Ada L.', 'Same. I had built a whole mental model out of folklore.', ago(8 * DAY), D8_BULB, 0.62, t[0].id));
    t.push(T('Nadia F.', 'The resolver diagram is the only one I have ever been able to hold in my head.', ago(2 * HR), D8_BULB, 0.72));
    return C('https://jvns.ca/blog/2026/02/dns-resolvers/', 'Priya N.', true, ago(10 * DAY), {
      thought: 'Read this before you touch the resolver config again.',
      reactions: [
        { name: 'Marcus T.', glyph: D8_LOL, intensity: 0.86 }, { name: 'You', glyph: D8_FIRE, intensity: 0.5 },
        { name: 'Ada L.', glyph: D8_BULB, intensity: 0.62 }, { name: 'Nadia F.', glyph: D8_BULB, intensity: 0.72, at: ago(2 * HR) },
        { name: 'Dev K.', skipped: true },
      ],
      talk: t, seenAt: ago(2 * DAY),
    });
  })(),
  ...d8Silt(5, 9),
  // You read it and said nothing: not yours, not spoken on — never indicated.
  C('https://www.kernel.org/doc/html/latest/process/submitting-patches.html', 'Sam R.', true, ago(12 * DAY), {
    reactions: [
      { name: 'Lena P.', glyph: D8_THUMB, intensity: 0.3 }, { name: 'Priya N.', glyph: D8_BULB, intensity: 0.66 },
      { name: 'You', skipped: true },
    ],
    talk: [
      T('Lena P.', 'Dry, but every rejection I have ever had is in here somewhere.', ago(11 * DAY), D8_THUMB, 0.3),
      T('Priya N.', 'Section 3 explains our last three bounced patches.', ago(6 * DAY), D8_BULB, 0.66),
    ],
    seenAt: ago(6 * DAY),
  }),
  ...d8Silt(9, 12),
  // The full record: everyone has spoken, several answering each other, and it
  // is still moving. This is the card that has to read calm at forty lines.
  (() => {
    const t = [
      T('Priya N.', 'The simple/easy split has changed how I argue in design reviews more than any book has.', ago(20 * DAY), D8_FIRE, 0.92),
      T('Ada L.', 'Watched it again on the train. It is a different talk at thirty than it was at twenty-five.', ago(19 * DAY), D8_FIRE, 0.86),
      T('Dev K.', 'I come out of this wanting to delete something, every time.', ago(18 * DAY), D8_BULB, 0.6),
      T('You', 'The complecting section is the only vocabulary I have found that makes the argument without sounding rude.', ago(17 * DAY), D8_FIRE, 0.62),
      T('Lena P.', 'It is the pacing. He never once rushes you.', ago(16 * DAY), D8_HEART, 0.55),
      T('Theo B.', 'Fine, but the Clojure framing dates it in places.', ago(14 * DAY), D8_THUMB, 0.3),
    ];
    t.push(T('Nadia F.', 'Ignore the Clojure and it holds anyway. The examples are incidental to the argument.', ago(13 * DAY), D8_BULB, 0.5, t[5].id));
    t.push(T('Marcus T.', 'It is the only talk I can send to a manager and to an intern and have both get something out of it.', ago(12 * DAY), D8_FIRE, 0.78, t[3].id));
    t.push(T('Dev K.', 'Came back to this after the incident. The section on state is uncomfortable reading now.', ago(6 * DAY), null, null));
    t.push(T('Sam R.', 'First watch. I understand why this keeps coming up.', ago(7 * HR), D8_BULB, 0.8));
    t.push(T('Ada L.', 'Wait for the second watch. It is a different talk once you have shipped the thing he is describing.', ago(3 * HR), null, null, t[9].id));
    return C('https://www.youtube.com/watch?v=Kx7Bvksk_qg', 'Marcus T.', true, ago(22 * DAY), {
      thought: 'Twelve years old. Still the talk I would hand a new hire on day one.',
      reactions: [
        { name: 'Priya N.', glyph: D8_FIRE, intensity: 0.92 }, { name: 'Ada L.', glyph: D8_FIRE, intensity: 0.86 },
        { name: 'Dev K.', glyph: D8_BULB, intensity: 0.6 }, { name: 'You', glyph: D8_FIRE, intensity: 0.62 },
        { name: 'Lena P.', glyph: D8_HEART, intensity: 0.55 }, { name: 'Theo B.', glyph: D8_THUMB, intensity: 0.3 },
        { name: 'Nadia F.', glyph: D8_BULB, intensity: 0.5 }, { name: 'Marcus T.', glyph: D8_FIRE, intensity: 0.78 },
        { name: 'Sam R.', glyph: D8_BULB, intensity: 0.8 },
      ],
      talk: t, seenAt: ago(5 * DAY),
    });
  })(),
  // Reactions only — an empty record, which every state still has to hold.
  C('https://sqlite.org/whentouse.html', 'former member', true, ago(26 * DAY), {
    reactions: [
      { name: 'Priya N.', glyph: D8_THUMB, intensity: 0.5 }, { name: 'You', glyph: D8_THUMB, intensity: 0.44 },
      { name: 'Ada L.', skipped: true },
    ],
  }),
  // A first reflection, then nothing for a month — until this morning. Not
  // yours and you never spoke on it: it is in the watched set because you stood
  // it up by hand, which is the only way it could be.
  C('https://go.dev/blog/errors-are-values', 'Ada L.', true, ago(30 * DAY), {
    reactions: [{ name: 'Priya N.', glyph: D8_THUMB, intensity: 0.5 }, { name: 'You', skipped: true },
      { name: 'Theo B.', glyph: D8_BULB, intensity: 0.66, at: ago(4 * HR) }],
    talk: [
      T('Priya N.', 'The scanner example finally made errcheck stop feeling like a chore.', ago(29 * DAY), D8_THUMB, 0.5),
      T('Theo B.', 'Came to this a month late. The scanner example is the whole argument in twelve lines.', ago(4 * HR), D8_BULB, 0.66),
    ],
    seenAt: ago(28 * DAY), watched: true,
  }),
];

const d8Circle = () => ({
  id: 'sp-backend', name: 'Backend Pod', funded: true, dormancy: null,
  champion: 'You', championEmail: 'sam.rivera@gmail.com',
  members: D8_MEMBERS, items: d8Cards(), pending: [], queued: [], unseen: false, lastSeenAt: NOW,
});

// A link the driver drops in, so "land as a reader" always has something to land on.
const D8_DROP = {
  url: 'https://longreads.com/2026/01/the-long-walk-home/',
  title: 'The Long Walk Home', source: 'Longreads',
};

window.PGD8Data = { d8Circle, d8Cards, D8_MEMBERS, D8_DROP, T, NOW, HR, DAY, MIN };
