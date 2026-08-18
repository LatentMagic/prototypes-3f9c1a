// ============================================================================
// Thought on a card, v11 — the shelf, and the same thought at four lengths.
//
// The length control is the point of the rig, so the thought is not seeded once:
// every card that can carry words carries them at ONE LINE, A PARAGRAPH, and A
// PARAGRAPH WITH BULLETS, in that member's own register. The control picks which
// of the three the whole shelf is showing (or none at all), so an option can be
// judged at each length without the copy changing character underneath it.
//
// One card (Martin Fowler) never carries a thought at any setting: the family is
// judged on how the column reads, and a shelf where every card has words is not
// the shelf. Density decides how many of the rest do.
// ============================================================================
const { IT: T11IT, M: T11M } = window.CircSeed;
const [T11_HEART, T11_FIRE, T11_THUMB, T11_BULB] = window.RX_GLYPHS;
const T11_HR = 3600e3, T11_DAY = 24 * T11_HR, T11_NOW = Date.now();
const t11ago = (ms) => T11_NOW - ms;

const T11_META = {
  'https://martinfowler.com/articles/cd-pipeline.html': { title: 'Continuous Delivery Pipelines, End to End', source: 'Martin Fowler', image: 'uploads/card-previews/martinfowler-cd-pipeline.png' },
  'https://danluu.com/percentile-latency/': { title: 'How to Measure Latency, and Why the Percentiles Matter', source: null, hasImage: false, faviconExists: false },
  'https://arxiv.org/abs/2503.04918': { title: 'Learned Index Structures for Time-Series Stores', source: 'arXiv', image: 'uploads/card-previews/arxiv-2503-04918.png' },
  'https://newsletter.pragmaticengineer.com/p/scaling-on-call': { title: 'Scaling On-Call Without Burning Out the Team', source: 'The Pragmatic Engineer', image: 'uploads/card-previews/pragmatic-engineer.jpg' },
  'https://go.dev/blog/pipelines': { title: 'Go Concurrency Patterns: Pipelines', source: 'The Go Blog', image: 'uploads/card-previews/youtube-hqdefault.jpg' },
  'https://jvns.ca/blog/2026/02/dns-resolvers/': { title: 'How DNS Resolvers Actually Work', source: 'Julia Evans', hasImage: false },
  'https://sqlite.org/whentouse.html': { title: 'Appropriate Uses For SQLite', source: 'SQLite' },
  'https://www.kernel.org/doc/html/latest/process/submitting-patches.html': { title: 'Submitting Patches: The Essential Guide', source: 'The Linux Kernel Archives' },
  'https://www.youtube.com/watch?v=Kx7Bvksk_qg': { title: 'Simple Made Easy \u2014 Rich Hickey', source: 'YouTube', image: 'uploads/card-previews/youtube-maxres.jpg' },
};

// [one line, a paragraph, a paragraph and a few bullets]
//
// A PARAGRAPH here means what a member who cares actually writes: eight to
// fifteen lines on a phone, not two. The earlier seeds were too short to show
// what a long contribution costs the shelf, so every one of them was rewritten
// long \u2014 that length is the whole point of the length control.
//
// The opening sentences are deliberately mixed: three of them fit on one line
// and three do not, so the closed band is judged on BOTH of its states (the
// sentence whole, and the label that replaces it when it will not fit).
const T11_WORDS = {
  danluu: {
    one: 'The section on averages is the one I want to hand to everybody who writes a dashboard.',
    para: 'Averages lie. It is not that the mean is imprecise, it is that it describes a request nobody made, and the worked example with the two clusters is the clearest demonstration of that I have read anywhere. Go and look at our latency panel afterwards. Every graph on it is a mean over a five-minute window, so the number we watch all day is an average of an average, and the shape it hides is exactly the shape that example draws. The part I keep coming back to is the argument about percentiles on short windows: a p99 over five minutes is mostly a statement about the window, not about the tail, and we have three alerts wired to precisely that. I would rather publish the histogram and let people read it than keep shipping a single number that cannot be wrong because it does not say anything. None of this needs a project. It needs an afternoon, one change to the panel, and somebody willing to argue with a dashboard we all learned to trust.',
    lead: 'Averages lie, and this undoes the habit in about fifteen minutes. What I took out of it, in the order it changed my mind:',
    bullets: ['The mean describes a request nobody actually made \u2014 the two-cluster example is the whole argument and it takes one screen.', 'A p99 computed over a five-minute window is mostly a statement about the window, not about the tail.', 'Three of our alerts are wired to exactly that, which is why they go quiet in the incidents that matter.', 'Publish the histogram or publish nothing; a single number that cannot be wrong is not telling you anything.', 'The fix is an afternoon on the panel, not a project.'],
  },
  arxiv: {
    one: 'Sceptical of the benchmark, but the failure analysis in \u00a75 is honest.',
    para: 'I am sceptical of the benchmark and I want to say that before anything else, because the headline number will get quoted without the caveat: the traces are synthetic, they are drawn from a model whose parameters the authors chose, and none of our series look remotely like that. Take the speedup as an upper bound on a friendly workload and no more. That said, \u00a75 is honest in a way papers rarely are. They publish the case where the learned index loses, they say why, and the why is the thing that matters to us \u2014 the structure has to be rebuilt when the distribution shifts, and the rebuild is not free. On our ingest, shifts are the normal condition rather than the exception, so the number to argue about is the rebuild cost and not the lookup time. If we ever tried this seriously it would be behind a flag, on one store, with the rebuild cost graphed next to the latency win, and I would want us to agree in advance what ratio makes it worth keeping.',
    lead: 'Sceptical of the benchmark, convinced by the failure analysis. A roundup so you can decide whether to read the whole thing:',
    bullets: ['\u00a73 is the actual contribution; skim \u00a72 entirely if you know the area.', 'The traces are synthetic and drawn from the authors\u2019 own model \u2014 read the speedup as an upper bound on a friendly workload.', '\u00a75 publishes the case where it loses, which is rare and is the reason to read the paper at all.', 'The structure has to be rebuilt when the distribution shifts, and on our ingest shifts are the normal condition.', 'So the rebuild cost is the number to argue about, not the lookup time.'],
  },
  pragmatic: {
    one: 'We already do about half of this. The half we do not is the half that is hurting.',
    para: 'We already do about half of this. The half we do not is the half that is hurting, and the handover section describes our Monday mornings almost line for line \u2014 somebody finishing a shift, telling the next person the important parts out loud, and both of them believing that counted as a handover. Writing it down is the cheapest thing on the list and the one we keep not doing. The rota maths in the middle is the argument I failed to make last quarter and could not put a number on: below a certain headcount the rota is not a rota, it is two people taking turns being tired, and no amount of goodwill fixes that arithmetic. The line I would put on a wall is that nobody carries a system they did not help build, which is the real reason the alerts nobody understands are the ones that page at four in the morning. I would take the handover template and the published rota and leave the rest for now.',
    lead: 'We already do about half of this, and the half we do not is the half that is hurting. Four things I would take from it:',
    bullets: ['Handover is a written artefact, not a conversation at the end of a shift \u2014 this is the cheapest change on the list.', 'Below a certain headcount a rota is not a rota, it is two people taking turns being tired, and the maths in the middle proves it.', 'Nobody carries a system they did not help build, which is why the alerts nobody understands are the ones that page at four.', 'The rota goes out a month ahead so people can plan a life around it.'],
  },
  pipelines: {
    one: 'Old, but still the clearest thing on cancellation I have found.',
    para: 'Old, but still the clearest thing on cancellation I have found anywhere, and it reads dated for about two pages until you notice that everything written since is sugar over exactly this. The worked example is short enough to read on a phone and it earns every line: a stage, a done channel, and the discipline that whoever opens a channel closes it. Our worker bugs are almost all in the fan-in, and the fan-in here is four paragraphs that would have saved me a fortnight last year. Read the last section knowing that errgroup exists, because that section is what errgroup is doing for you, and the abstraction only makes sense once you have seen the shape underneath it. What I would not take from it is the naming; we are not writing 2014 Go, and a pipeline of five stages named after the article is harder to read than three functions named after what they do.',
    lead: 'Old, and still the one I hand people. What to read it for, and what to skip:',
    bullets: ['The cancellation pattern, which is the whole reason to read it \u2014 a stage, a done channel, and whoever opens a channel closes it.', 'The fan-in, which is four paragraphs and is where nearly all of our worker bugs actually live.', 'The last section, which is precisely what errgroup is doing for you \u2014 read it knowing errgroup exists.', 'Skip the naming: a five-stage pipeline named after the article reads worse than three functions named after their job.'],
  },
  jvns: {
    one: 'Read this before you touch the resolver config again.',
    para: 'Read this before you touch resolv.conf again. The section on where the resolver actually lives cleared up something I had been quietly getting wrong for years: I had a mental model with one resolver in it, and there are at least three places a name can be answered before anything leaves the machine. Once that is straight, the failure we had in March stops being mysterious \u2014 a stale cache looks exactly like an outage from the client side, which is why half the graphs said everything was fine while nothing worked. The diagrams are the only ones on this subject I have been able to hold in my head, and I think that is because they draw the boxes in the order a query meets them rather than in the order the specification lists them. It is worth twenty minutes even if you think you know this, and it is worth an hour if you are the person who is going to be woken up by it.',
    lead: 'Read this before you touch resolv.conf again. The parts that changed how I think about it:',
    bullets: ['Where the resolver actually lives \u2014 there are at least three places a name is answered before anything leaves the machine.', 'Why a stale cache looks exactly like an outage from the client side, which is our March incident in one paragraph.', 'The diagrams draw the boxes in the order a query meets them, not the order the spec lists them, which is why they stick.', 'Worth twenty minutes if you think you know it, worth an hour if you are the one being woken up by it.'],
  },
};

// A card. `words` names its entry in T11_WORDS; a card without one never carries
// a thought, whatever the controls say.
const T11C = (url, by, at, words, opts = {}) => ({
  ...T11IT(url, by === 'You' ? 'Added by you' : 'Added by ' + by, !!opts.read, opts.reactions || []),
  ...(T11_META[url] || {}),
  at, words, by, read: !!opts.read, talk: [], seenAt: T11_NOW, watched: false, unwatched: false, thought: null,
});

const T11_SHELF = [
  T11C('https://martinfowler.com/articles/cd-pipeline.html', 'Sam R.', t11ago(2 * T11_HR), null,
    { reactions: [{ name: 'Dev K.', glyph: T11_THUMB, intensity: 0.4 }] }),
  T11C('https://danluu.com/percentile-latency/', 'Dev K.', t11ago(8 * T11_HR), 'danluu',
    { reactions: [{ name: 'Ada L.', glyph: T11_BULB, intensity: 0.5 }] }),
  T11C('https://arxiv.org/abs/2503.04918', 'Marcus T.', t11ago(28 * T11_HR), 'arxiv',
    { reactions: [{ name: 'Priya N.', glyph: T11_BULB, intensity: 0.82 }, { name: 'Ada L.', glyph: T11_THUMB, intensity: 0.5 }] }),
  T11C('https://newsletter.pragmaticengineer.com/p/scaling-on-call', 'Ada L.', t11ago(3 * T11_DAY), 'pragmatic',
    { reactions: [{ name: 'Dev K.', glyph: T11_FIRE, intensity: 0.9 }] }),
  T11C('https://go.dev/blog/pipelines', 'Lena P.', t11ago(5 * T11_DAY), 'pipelines', {}),
  T11C('https://jvns.ca/blog/2026/02/dns-resolvers/', 'Priya N.', t11ago(10 * T11_DAY), 'jvns',
    { reactions: [{ name: 'Marcus T.', glyph: T11_HEART, intensity: 0.7 }] }),
  // Read, so the tab beside Active is not hollow. No thoughts: this question is
  // about the Active shelf, and the Read tab is here only to be a real tab.
  T11C('https://www.youtube.com/watch?v=Kx7Bvksk_qg', 'Marcus T.', t11ago(22 * T11_DAY), null,
    { read: true, reactions: [{ name: 'You', glyph: T11_FIRE, intensity: 0.62 }, { name: 'Ada L.', glyph: T11_FIRE, intensity: 0.86 }] }),
  T11C('https://sqlite.org/whentouse.html', 'Lena P.', t11ago(26 * T11_DAY), null,
    { read: true, reactions: [{ name: 'You', glyph: T11_THUMB, intensity: 0.44 }] }),
  T11C('https://www.kernel.org/doc/html/latest/process/submitting-patches.html', 'Sam R.', t11ago(12 * T11_DAY), null,
    { read: true, reactions: [{ name: 'Priya N.', glyph: T11_BULB, intensity: 0.66 }] }),
];

// One card in four (arXiv and Julia Evans — one with a preview, one without),
// against every card that can.
const T11_SPARSE = ['https://arxiv.org/abs/2503.04918', 'https://jvns.ca/blog/2026/02/dns-resolvers/'];

// The shelf as the controls make it. A thought is {by, text, bullets}.
const t11Shelf = ({ length, preview, density }) => T11_SHELF.map(c => {
  const w = c.words && T11_WORDS[c.words];
  const carries = !!w && length !== 'none' && (density === 'all' || T11_SPARSE.includes(c.url)) && !c.read;
  const thought = !carries ? null
    : length === 'one' ? { by: c.by, text: w.one, bullets: null }
    : length === 'para' ? { by: c.by, text: w.para, bullets: null }
    : { by: c.by, text: w.lead, bullets: w.bullets };
  return { ...c, thought, hasImage: preview ? c.hasImage !== false : false };
});

// Is this a thought the card cannot show whole without becoming a wall?
const t11Long = (t) => !!t && (!!t.bullets || t.text.length > 110);

window.PGT11Data = { t11Shelf, t11Long, T11_WORDS };
